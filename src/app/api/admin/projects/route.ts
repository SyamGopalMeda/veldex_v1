import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminGuard';
import { getAdminFirestore } from '@/lib/firebaseAdmin';
import { allProjects } from '@/lib/projectsData';
import { listProjects, slugify, revalidateSite, PROJECT_CATEGORIES, projectToRecord } from '@/lib/content';

const COL = 'projects';
const isImagePath = (v: unknown) => typeof v === 'string' && (/^\/(?!\/)[\w\-./%]+$/.test(v) || /^https:\/\//.test(v));
const fail = (error: string, status = 400) => NextResponse.json({ success: false, error }, { status });

/** All docs for a slug (handles legacy ids like proj_<slug>) */
async function docsForSlug(slug: string) {
  const col = getAdminFirestore().collection(COL);
  const [byId, byField] = await Promise.all([col.doc(slug).get(), col.where('slug', '==', slug).get()]);
  const refs = new Map<string, FirebaseFirestore.DocumentReference>();
  if (byId.exists) refs.set(byId.id, byId.ref);
  byField.docs.forEach((d) => refs.set(d.id, d.ref));
  return [...refs.values()];
}

/** GET /api/admin/projects — every project incl. drafts (database + built-in) */
export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    return NextResponse.json({ success: true, projects: await listProjects(true) });
  } catch (err) {
    console.error('[Projects API] read', err);
    return fail('Could not load projects', 500);
  }
}

/** POST /api/admin/projects — create (no slug) or update (slug) */
export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const b = await request.json();
    const title = String(b.title ?? '').trim();
    if (!title) return fail('Project title is required.');
    if (title.length > 120) return fail('Keep the title under 120 characters.');
    if (!isImagePath(b.mainImage)) return fail('Choose a main image.');
    const categoryValue = PROJECT_CATEGORIES.some((c) => c.value === b.categoryValue) ? b.categoryValue : null;
    if (!categoryValue) return fail('Choose a category.');
    const location = String(b.location ?? '').trim();
    if (!location) return fail('Location is required.');

    const gallery = (Array.isArray(b.galleryImages) ? b.galleryImages : [])
      .map((g: unknown) => (typeof g === 'string' ? { src: g, alt: title } : g as { src?: string; alt?: string }))
      .filter((g: { src?: string }) => isImagePath(g.src))
      .slice(0, 30)
      .map((g: { src?: string; alt?: string }) => ({ src: g.src, alt: String(g.alt || title).slice(0, 160) }));
    const specs = (Array.isArray(b.specs) ? b.specs : [])
      .map((s: { label?: string; value?: string }) => ({ label: String(s?.label ?? '').trim().slice(0, 60), value: String(s?.value ?? '').trim().slice(0, 160) }))
      .filter((s: { label: string; value: string }) => s.label && s.value).slice(0, 20);
    const highlights = (Array.isArray(b.highlights) ? b.highlights : String(b.highlights ?? '').split('\n'))
      .map((h: string) => String(h).trim()).filter(Boolean).slice(0, 12);

    // Existing project keeps its URL; a new one gets a unique slug from its title
    const existing = b.slug ? (await listProjects(true)).find((p) => p.slug === b.slug) : null;
    let slug = existing?.slug ?? slugify(b.slugOverride || title);
    if (!slug) return fail('Use letters or numbers in the title.');
    if (!existing) {
      const taken = new Set((await listProjects(true)).map((p) => p.slug));
      const base = slug;
      for (let i = 2; taken.has(slug); i++) slug = `${base}-${i}`;
    }

    const now = new Date().toISOString();
    const category = PROJECT_CATEGORIES.find((c) => c.value === categoryValue)!.label;
    const completionDate = String(b.completionDate ?? '').trim();
    const record = {
      slug, title, category, categoryValue, location,
      city: String(b.city || `${location.split(',')[0].trim()}, AP`).trim(),
      projectType: ['Residential', 'Commercial', 'Industrial'].includes(b.projectType) ? b.projectType : 'Residential',
      completionDate,
      year: (completionDate.match(/\d{4}/)?.[0]) ?? String(new Date().getFullYear()),
      shortDescription: String(b.shortDescription ?? '').trim().slice(0, 300),
      aboutProject: String(b.aboutProject ?? b.projectDescription ?? '').trim().slice(0, 5000),
      projectDescription: String(b.projectDescription ?? b.aboutProject ?? '').trim().slice(0, 5000),
      highlights, specs,
      mainImage: b.mainImage,
      galleryImages: gallery.length ? gallery : [{ src: b.mainImage, alt: title }],
      videoUrl: /^https:\/\//.test(String(b.videoUrl ?? '')) ? String(b.videoUrl) : null,
      videoThumbnail: isImagePath(b.videoThumbnail) ? b.videoThumbnail : null,
      isFeatured: Boolean(b.isFeatured),
      isPublished: b.isPublished !== false,
      seoTitle: String(b.seoTitle ?? '').trim().slice(0, 70),
      seoDescription: String(b.seoDescription ?? '').trim().slice(0, 170),
      deleted: false,
      updatedAt: now,
    };

    // Keep details the form doesn't edit, so saving never changes what the page shows
    if (existing) {
      const kept = record as Record<string, unknown>;
      if (existing.categoryValue === categoryValue && existing.category) kept.category = existing.category;
      if (existing.subtitle) kept.subtitle = existing.subtitle;
      if (existing.sideImage) kept.sideImage = existing.sideImage;
      if (existing.location === location && existing.city && !b.city) kept.city = existing.city;
      if (existing.completionDate === completionDate && existing.year) kept.year = existing.year;
      if (existing.aboutProject === record.aboutProject && b.projectDescription === b.aboutProject) kept.projectDescription = existing.projectDescription;
    }

    const db = getAdminFirestore();
    const others = (await docsForSlug(slug)).filter((r) => r.id !== slug);
    const prev = await db.collection(COL).doc(slug).get();
    const createdAt = prev.exists ? prev.data()?.createdAt ?? now : (others.length ? (await others[0].get()).data()?.createdAt ?? now : now);
    const batch = db.batch();
    batch.set(db.collection(COL).doc(slug), { ...record, createdAt });
    others.forEach((r) => batch.delete(r)); // fold legacy duplicates into one doc
    await batch.commit();

    revalidateSite();
    const saved = (await listProjects(true)).find((p) => p.slug === slug);
    return NextResponse.json({ success: true, project: saved });
  } catch (err) {
    console.error('[Projects API] save', err);
    return fail('Could not save the project.', 500);
  }
}

/** PATCH /api/admin/projects — quick toggles: { slug, isPublished?, isFeatured? } */
export async function PATCH(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const { slug, isPublished, isFeatured } = await request.json();
    const project = (await listProjects(true)).find((p) => p.slug === slug);
    if (!project) return fail('Project not found.', 404);
    const db = getAdminFirestore();
    const ref = db.collection(COL).doc(slug);
    const snap = await ref.get();
    const updates: Record<string, unknown> = { slug, updatedAt: new Date().toISOString() };
    if (typeof isPublished === 'boolean') updates.isPublished = isPublished;
    if (typeof isFeatured === 'boolean') updates.isFeatured = isFeatured;
    if (!snap.exists) {
      // first change to a built-in project: store its full record so the override is complete
      await ref.set(projectToRecord(project, { ...updates, createdAt: new Date().toISOString() }));
    } else {
      await ref.set(updates, { merge: true });
    }
    revalidateSite();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Projects API] patch', err);
    return fail('Could not update the project.', 500);
  }
}

/** DELETE /api/admin/projects?slug= (or ?id=) */
export async function DELETE(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const params = new URL(request.url).searchParams;
    const slug = params.get('slug') || params.get('id');
    if (!slug) return fail('Project slug is required.');
    if (!(await listProjects(true)).some((p) => p.slug === slug)) return fail('Project not found.', 404);
    const db = getAdminFirestore();
    const refs = await docsForSlug(slug);
    const batch = db.batch();
    refs.forEach((r) => batch.delete(r));
    // Built-in projects ship with the code, so remember the deletion
    if (allProjects.some((p) => p.slug === slug)) {
      batch.set(db.collection(COL).doc(slug), { slug, deleted: true, updatedAt: new Date().toISOString() });
    }
    await batch.commit();
    revalidateSite();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Projects API] delete', err);
    return fail('Could not delete the project.', 500);
  }
}
