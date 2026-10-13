import { requireAdmin } from '@/lib/adminGuard';
import { NextRequest, NextResponse } from 'next/server';
import { getAdminFirestore } from '@/lib/firebaseAdmin';
import { blogArticles, blogCategories } from '@/lib/blogData';
import { listArticles, slugify, revalidateSite, bodyToArticle, articleToRecord, toPlain } from '@/lib/content';

const COL = 'articles';
const isImagePath = (v: unknown) => typeof v === 'string' && (/^\/(?!\/)[\w\-./%]+$/.test(v) || /^https:\/\//.test(v));
const fail = (error: string, status = 400) => NextResponse.json({ success: false, error }, { status });

async function docsForSlug(slug: string) {
  const col = getAdminFirestore().collection(COL);
  const [byId, byField] = await Promise.all([col.doc(slug).get(), col.where('slug', '==', slug).get()]);
  const refs = new Map<string, FirebaseFirestore.DocumentReference>();
  if (byId.exists) refs.set(byId.id, byId.ref);
  byField.docs.forEach((d) => refs.set(d.id, d.ref));
  return [...refs.values()];
}

/** GET /api/admin/blog — all articles incl. drafts */
export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    return NextResponse.json({ success: true, articles: await listArticles(true) });
  } catch (err) {
    console.error('[Blog API] read', err);
    return fail('Could not load articles', 500);
  }
}

/** POST /api/admin/blog — create (no slug) or update (slug) */
export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const b = await request.json();
    const title = String(b.title ?? '').trim();
    if (!title) return fail('Article title is required.');
    if (title.length > 140) return fail('Keep the title under 140 characters.');
    const body = String(b.body ?? b.content ?? '').trim();
    if (body.length < 80) return fail('Write a little more — the article body is too short.');
    const parsed = bodyToArticle(body);
    if (!parsed.intro && !parsed.sections?.length) return fail('Add some text to the article body.');
    if (!isImagePath(b.featuredImage)) return fail('Choose a featured image.');
    const category = blogCategories.find((c) => c.slug === b.categorySlug && c.slug !== 'all');
    if (!category) return fail('Choose a category.');

    const existing = b.slug ? (await listArticles(true)).find((a) => a.slug === b.slug) : null;
    let slug = existing?.slug ?? slugify(title);
    if (!slug) return fail('Use letters or numbers in the title.');
    if (!existing) {
      const taken = new Set((await listArticles(true)).map((a) => a.slug));
      const base = slug;
      for (let i = 2; taken.has(slug); i++) slug = `${base}-${i}`;
    }

    const now = new Date().toISOString();
    const db = getAdminFirestore();
    const prev = await db.collection(COL).doc(slug).get();
    const record = {
      slug, title,
      category: category.name.toUpperCase(),
      categorySlug: category.slug,
      excerpt: String(b.excerpt ?? '').trim().slice(0, 300),
      body,
      featuredImage: b.featuredImage,
      featuredImageAlt: String(b.featuredImageAlt || title).trim().slice(0, 160),
      tags: (Array.isArray(b.tags) ? b.tags : String(b.tags ?? '').split(',')).map((t: string) => String(t).trim()).filter(Boolean).slice(0, 12),
      author: String(b.author || 'Veldex Team').trim().slice(0, 80),
      metaTitle: String(b.metaTitle ?? '').trim().slice(0, 70) || title.slice(0, 70),
      metaDescription: String(b.metaDescription ?? '').trim().slice(0, 170) || String(b.excerpt ?? '').trim().slice(0, 170),
      isPublished: b.isPublished !== false,
      deleted: false,
      datePublishedISO: prev.exists ? prev.data()?.datePublishedISO ?? existing?.datePublishedISO ?? now : existing?.datePublishedISO ?? now,
      createdAt: prev.exists ? prev.data()?.createdAt ?? now : now,
      updatedAt: now,
    };
    // Keep what the editor can't change: cards/links stored with the article, and
    // the original structured sections (headings, inline links) while the body is untouched.
    const kept: Record<string, unknown> = {};
    if (existing) {
      const pd = prev.exists ? prev.data() ?? {} : {};
      for (const k of ['authorRole', 'isPopular', 'canonicalUrl', 'socialImage', 'relatedProject', 'relatedArticleSlugs', 'socialContent'] as const) {
        const v = pd[k] !== undefined ? pd[k] : existing[k];
        if (v !== undefined && v !== null) kept[k] = v;
      }
      if (existing.titleAccent && existing.title === title) kept.titleAccent = existing.titleAccent;
      if (existing.date) kept.date = existing.date;
      if (existing.categorySlug === category.slug && existing.category) kept.category = existing.category;
      if (existing.body.replace(/\r/g, '').trim() === body.replace(/\r/g, '')) {
        kept.sections = existing.sections ?? [];
        if (existing.intro) kept.intro = existing.intro;
        if (existing.conclusion) kept.conclusion = existing.conclusion;
        if (existing.readTime) kept.readTime = existing.readTime;
      }
    }
    const others = (await docsForSlug(slug)).filter((r) => r.id !== slug);
    const batch = db.batch();
    batch.set(db.collection(COL).doc(slug), { ...record, ...toPlain(kept) });
    others.forEach((r) => batch.delete(r));
    await batch.commit();

    revalidateSite();
    return NextResponse.json({ success: true, article: (await listArticles(true)).find((a) => a.slug === slug) });
  } catch (err) {
    console.error('[Blog API] save', err);
    return fail('Could not save the article.', 500);
  }
}

/** PATCH /api/admin/blog — { slug, isPublished } */
export async function PATCH(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const { slug, isPublished } = await request.json();
    const article = (await listArticles(true)).find((a) => a.slug === slug);
    if (!article) return fail('Article not found.', 404);
    if (typeof isPublished !== 'boolean') return fail('Nothing to change.');
    const db = getAdminFirestore();
    const ref = db.collection(COL).doc(slug);
    if ((await ref.get()).exists) {
      await ref.set({ isPublished, updatedAt: new Date().toISOString() }, { merge: true });
    } else {
      // first change to a built-in article: store its complete record
      const now = new Date().toISOString();
      await ref.set(articleToRecord(article, { isPublished, createdAt: now, updatedAt: now }));
    }
    revalidateSite();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Blog API] patch', err);
    return fail('Could not update the article.', 500);
  }
}

/** DELETE /api/admin/blog?slug= (or ?id=) */
export async function DELETE(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const params = new URL(request.url).searchParams;
    const slug = params.get('slug') || params.get('id');
    if (!slug) return fail('Article slug is required.');
    if (!(await listArticles(true)).some((a) => a.slug === slug)) return fail('Article not found.', 404);
    const db = getAdminFirestore();
    const batch = db.batch();
    (await docsForSlug(slug)).forEach((r) => batch.delete(r));
    if (blogArticles.some((a) => a.slug === slug)) {
      batch.set(db.collection(COL).doc(slug), { slug, deleted: true, updatedAt: new Date().toISOString() });
    }
    await batch.commit();
    revalidateSite();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Blog API] delete', err);
    return fail('Could not delete the article.', 500);
  }
}
