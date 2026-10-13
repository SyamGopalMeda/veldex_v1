/**
 * Content layer — the single source the PUBLIC website and the ADMIN panel both
 * read from. Firestore is the source of truth; the content that ships with the
 * code (projectsData / blogData / site config / hero defaults) is the starting
 * library and the fallback when Firestore is empty or unreachable.
 *
 *  • A Firestore doc with the same slug as a built-in item overrides it (edit).
 *  • `deleted: true` hides a built-in item for good (delete).
 *  • `isPublished: false` hides an item from the public site (unpublish/draft).
 *
 * Server-only (uses the Admin SDK). Public pages are statically cached; every
 * admin write calls revalidateSite() so changes appear immediately.
 */
import { cache } from 'react';
import { revalidatePath } from 'next/cache';
import { getAdminFirestore } from '@/lib/firebaseAdmin';
import { allProjects, type ProjectData } from '@/lib/projectsData';
import { blogArticles, blogCategories, type BlogArticle, type BlogSection } from '@/lib/blogData';
import { DEFAULT_HERO, type HeroConfig, type HeroSlideConfig } from '@/lib/heroDefaults';
import type { WebsiteSettingsData } from '@/lib/adminStore';
import { seedServices } from '@/lib/siteData';
import type { Service } from '@/types';
import { DEFAULT_SETTINGS } from '@/lib/settingsShared';
export { DEFAULT_SETTINGS, toPublicSettings, type PublicSettings } from '@/lib/settingsShared';

export function slugify(text: string): string {
  return String(text || '').toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}

/** Purge the cached public pages after an admin change. */
export function revalidateSite() {
  try { revalidatePath('/', 'layout'); } catch { /* outside a request (scripts/tests) */ }
}

const db = () => getAdminFirestore();
const str = (v: unknown, d = '') => (typeof v === 'string' ? v : d);
const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

// ═══ Projects ═════════════════════════════════════════════════════════════════

export const PROJECT_CATEGORIES: { value: ProjectData['categoryValue']; label: string }[] = [
  { value: 'gates', label: 'Gates & Automation' },
  { value: 'staircases', label: 'Staircases' },
  { value: 'railings', label: 'Railings & Balustrades' },
  { value: 'pergolas', label: 'Pergolas & Gazebos' },
  { value: 'roofing', label: 'Sheds & Roofing' },
  { value: 'elevations', label: 'Elevations & Facades' },
  { value: 'other', label: 'Interiors & Custom Work' },
];

export type ManagedProject = ProjectData & {
  isPublished: boolean;
  isFeatured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  source: 'site' | 'database' | 'site+database';
  updatedAt?: string;
};

function projectFromDoc(id: string, d: FirebaseFirestore.DocumentData, base?: ProjectData): ManagedProject {
  const title = str(d.title, base?.title ?? 'Untitled project');
  const slug = str(d.slug, base?.slug ?? (slugify(title) || id));
  const location = str(d.location, base?.location ?? 'Vijayawada, Andhra Pradesh');
  const categoryValue = (str(d.categoryValue, base?.categoryValue ?? 'other') as ProjectData['categoryValue']);
  const gallery = arr<{ src?: string; alt?: string; caption?: string } | string>(d.galleryImages)
    .map((g) => (typeof g === 'string' ? { src: g, alt: title } : { src: str(g.src), alt: str(g.alt, str(g.caption, title)) }))
    .filter((g) => g.src);
  const mainImage = str(d.mainImage, base?.mainImage ?? gallery[0]?.src ?? '/images/gate.jpg');
  const completion = str(d.completionDate, base?.completionDate ?? '');
  return {
    id: slug,
    slug,
    title,
    subtitle: str(d.subtitle, base?.subtitle ?? location.split(',')[0]),
    category: str(d.category, base?.category ?? PROJECT_CATEGORIES.find((c) => c.value === categoryValue)?.label ?? 'Custom Work'),
    categoryValue,
    location,
    city: str(d.city, base?.city ?? `${location.split(',')[0].trim()}, AP`),
    completionDate: completion,
    year: str(d.year, base?.year ?? (completion.match(/\d{4}/)?.[0] ?? String(new Date().getFullYear()))),
    projectType: (str(d.projectType, base?.projectType ?? 'Residential') as ProjectData['projectType']),
    mainImage,
    galleryImages: gallery.length ? gallery : base?.galleryImages ?? [{ src: mainImage, alt: title }],
    sideImage: str(d.sideImage, base?.sideImage ?? '') || undefined,
    videoUrl: str(d.videoUrl, base?.videoUrl ?? '') || undefined,
    videoThumbnail: str(d.videoThumbnail, base?.videoThumbnail ?? '') || undefined,
    shortDescription: str(d.shortDescription, base?.shortDescription ?? ''),
    aboutProject: str(d.aboutProject, base?.aboutProject ?? str(d.projectDescription, str(d.shortDescription))),
    projectDescription: str(d.projectDescription, base?.projectDescription ?? str(d.shortDescription)),
    highlights: d.highlights !== undefined ? arr<string>(d.highlights) : base?.highlights ?? [],
    specs: d.specs !== undefined ? arr(d.specs) : arr(d.specifications).length ? arr(d.specifications) : base?.specs ?? [],
    isFeatured: d.isFeatured !== undefined ? Boolean(d.isFeatured) : Boolean(base?.isFeatured),
    isPublished: d.isPublished !== false,
    seoTitle: str(d.seoTitle) || undefined,
    seoDescription: str(d.seoDescription) || undefined,
    source: base ? 'site+database' : 'database',
    updatedAt: str(d.updatedAt) || undefined,
  };
}

const siteProject = (p: ProjectData): ManagedProject => ({ ...p, isFeatured: Boolean(p.isFeatured), isPublished: true, source: 'site' });

/** All projects (admin view includes drafts; public view excludes them). Cached per request. */
export const listProjects = cache(async (includeHidden = false): Promise<ManagedProject[]> => {
  const bySlug = new Map<string, ManagedProject>(allProjects.map((p) => [p.slug, siteProject(p)]));
  const order = allProjects.map((p) => p.slug);
  try {
    const snap = await db().collection('projects').get();
    const fresh: { slug: string; at: string }[] = [];
    for (const doc of snap.docs) {
      const d = doc.data();
      const slug = str(d.slug) || doc.id;
      if (d.deleted === true) { bySlug.delete(slug); continue; }
      const base = allProjects.find((p) => p.slug === slug);
      bySlug.set(slug, projectFromDoc(doc.id, d, base));
      if (!base) fresh.push({ slug, at: str(d.createdAt, str(d.updatedAt)) });
    }
    // newly added projects first (newest first), then the built-in portfolio order
    fresh.sort((a, b) => b.at.localeCompare(a.at));
    order.unshift(...fresh.map((f) => f.slug));
  } catch (err) {
    console.warn('[content] projects: Firestore unavailable, using built-in list', (err as Error).message);
  }
  return order.map((s) => bySlug.get(s)).filter((p): p is ManagedProject => Boolean(p) && (includeHidden || p!.isPublished));
});

export async function getProject(slug: string, includeHidden = false) {
  return (await listProjects(includeHidden)).find((p) => p.slug === slug) ?? null;
}

export async function getRelated(slug: string, category: string, limit = 3) {
  const all = await listProjects();
  const same = all.filter((p) => p.slug !== slug && p.categoryValue === category);
  const rest = all.filter((p) => p.slug !== slug && p.categoryValue !== category);
  return [...same, ...rest].slice(0, limit);
}

// ═══ Blog articles ════════════════════════════════════════════════════════════

export type ManagedArticle = BlogArticle & { source: 'site' | 'database' | 'site+database'; body: string };

/** Sections → the simple editable text format used in the admin editor. */
export function articleToBody(a: Pick<BlogArticle, 'intro' | 'sections' | 'conclusion'>): string {
  const parts: string[] = [];
  if (a.intro) parts.push(a.intro);
  for (const s of a.sections ?? []) {
    parts.push(`## ${s.title}`);
    if (s.image) parts.push(`![${s.imageAlt ?? ''}](${s.image})`);
    parts.push(s.content);
  }
  if (a.conclusion) parts.push('## Conclusion', a.conclusion);
  return parts.join('\n\n');
}

/**
 * Editor text → intro / sections / conclusion.
 *  "## Heading" starts a section · "![alt](/images/x.jpg)" adds the section image ·
 *  a final "## Conclusion" (or "Key takeaways") becomes the conclusion.
 */
export function bodyToArticle(body: string): Pick<BlogArticle, 'intro' | 'sections' | 'conclusion'> {
  const blocks = body.replace(/\r/g, '').split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  const intro: string[] = [];
  const sections: BlogSection[] = [];
  let conclusion = '';
  let cur: BlogSection | null = null;
  let inConclusion = false;
  for (const b of blocks) {
    const h = b.match(/^#{2,3}\s+(.+)$/);
    if (h) {
      const title = h[1].trim();
      if (/^(conclusion|key takeaways?|summary)$/i.test(title)) { inConclusion = true; cur = null; continue; }
      inConclusion = false;
      cur = { number: String(sections.length + 1), title, content: '' };
      sections.push(cur);
      continue;
    }
    const img = b.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/);
    if (img && cur) { cur.image = img[2]; cur.imageAlt = img[1]; continue; }
    if (inConclusion) conclusion = conclusion ? `${conclusion}\n\n${b}` : b;
    else if (cur) cur.content = cur.content ? `${cur.content}\n\n${b}` : b;
    else intro.push(b);
  }
  return { intro: intro.join('\n\n') || undefined, sections, conclusion: conclusion || undefined };
}

const readTime = (text: string) => `${Math.max(2, Math.round(text.split(/\s+/).length / 200))} min read`;
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

/** Fields with no editor control — kept exactly as stored (migrated content keeps its cards, links, etc.). */
const ARTICLE_PASSTHROUGH = ['authorRole', 'isPopular', 'canonicalUrl', 'socialImage', 'relatedProject', 'relatedArticleSlugs', 'socialContent'] as const;

function articleFromDoc(id: string, d: FirebaseFirestore.DocumentData, base?: BlogArticle): ManagedArticle {
  const title = str(d.title, base?.title ?? 'Untitled article');
  const slug = str(d.slug, base?.slug ?? (slugify(title) || id));
  const body = str(d.body, str(d.content));
  // Structured sections (migrated content) are used verbatim; free text from the
  // editor is parsed. The admin API drops stored sections when the body is edited.
  const parsed = Array.isArray(d.sections)
    ? { intro: str(d.intro) || undefined, sections: d.sections as BlogSection[], conclusion: str(d.conclusion) || undefined }
    : body ? bodyToArticle(body) : { intro: base?.intro, sections: base?.sections, conclusion: base?.conclusion };
  const categorySlug = str(d.categorySlug, base?.categorySlug ?? 'metal-fabrication');
  const cat = blogCategories.find((c) => c.slug === categorySlug);
  const published = str(d.datePublishedISO, base?.datePublishedISO ?? str(d.createdAt, new Date().toISOString()));
  const modified = str(d.dateModifiedISO, str(d.updatedAt, base?.dateModifiedISO ?? published));
  const words = [parsed.intro, ...(parsed.sections ?? []).map((s) => s.content), parsed.conclusion].join(' ');
  const extras: Partial<BlogArticle> = {};
  for (const k of ARTICLE_PASSTHROUGH) {
    const v = d[k] !== undefined ? d[k] : base?.[k];
    if (v !== undefined && v !== null) (extras as Record<string, unknown>)[k] = v;
  }
  return {
    ...(base ?? ({} as BlogArticle)),
    ...extras,
    id: slug,
    slug,
    title,
    titleAccent: str(d.titleAccent) || (base && base.title === title ? base.titleAccent : undefined),
    excerpt: str(d.excerpt, base?.excerpt ?? ''),
    category: str(d.category, base?.category ?? (cat?.name ?? 'Fabrication').toUpperCase()),
    categorySlug,
    date: str(d.date) || fmtDate(published),
    datePublishedISO: published,
    dateModifiedISO: modified,
    author: str(d.author, base?.author ?? 'Veldex Team'),
    readTime: str(d.readTime) || (words.trim() ? readTime(words) : base?.readTime ?? '4 min read'),
    featuredImage: str(d.featuredImage, base?.featuredImage ?? '/images/gate.jpg'),
    featuredImageAlt: str(d.featuredImageAlt, base?.featuredImageAlt ?? title),
    intro: parsed.intro,
    sections: parsed.sections,
    conclusion: parsed.conclusion,
    tags: d.tags !== undefined ? arr<string>(d.tags) : base?.tags ?? [],
    metaTitle: str(d.metaTitle, base?.metaTitle ?? title),
    metaDescription: str(d.metaDescription, base?.metaDescription ?? str(d.excerpt)),
    status: d.isPublished === false ? 'draft' : 'published',
    source: base ? 'site+database' : 'database',
    body: body || articleToBody({ intro: parsed.intro, sections: parsed.sections, conclusion: parsed.conclusion }),
  };
}

/** Plain JSON copy (Firestore rejects `undefined`). */
export const toPlain = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

/** Full, lossless Firestore record for an article — every field the page renders. */
export function articleToRecord(a: BlogArticle, extra: Record<string, unknown> = {}) {
  const { id: _id, status, ...rest } = a as BlogArticle & { source?: unknown; body?: unknown };
  void _id;
  delete (rest as Record<string, unknown>).source;
  return toPlain({ ...rest, body: articleToBody(a), isPublished: status !== 'draft', deleted: false, ...extra });
}

/** Full, lossless Firestore record for a project. */
export function projectToRecord(p: ProjectData, extra: Record<string, unknown> = {}) {
  const { id: _id, ...rest } = p as ProjectData & { source?: unknown };
  void _id;
  delete (rest as Record<string, unknown>).source;
  return toPlain({ ...rest, isFeatured: Boolean(p.isFeatured), isPublished: (p as { isPublished?: boolean }).isPublished !== false, deleted: false, ...extra });
}

const siteArticle = (a: BlogArticle): ManagedArticle => ({ ...a, source: 'site', body: articleToBody(a) });

export const listArticles = cache(async (includeHidden = false): Promise<ManagedArticle[]> => {
  const bySlug = new Map<string, ManagedArticle>(blogArticles.map((a) => [a.slug, siteArticle(a)]));
  try {
    const snap = await db().collection('articles').get();
    for (const doc of snap.docs) {
      const d = doc.data();
      const slug = str(d.slug) || doc.id;
      if (d.deleted === true) { bySlug.delete(slug); continue; }
      bySlug.set(slug, articleFromDoc(doc.id, d, blogArticles.find((a) => a.slug === slug)));
    }
  } catch (err) {
    console.warn('[content] articles: Firestore unavailable, using built-in list', (err as Error).message);
  }
  return [...bySlug.values()]
    .filter((a) => includeHidden || a.status === 'published')
    .sort((a, b) => b.datePublishedISO.localeCompare(a.datePublishedISO));
});

export async function getArticle(slug: string, includeHidden = false) {
  return (await listArticles(includeHidden)).find((a) => a.slug === slug) ?? null;
}

// ═══ Website settings ═════════════════════════════════════════════════════════

export const getSiteSettings = cache(async (): Promise<WebsiteSettingsData> => {
  try {
    const snap = await db().collection('settings').doc('general').get();
    if (!snap.exists) return DEFAULT_SETTINGS;
    const d = snap.data() as Partial<WebsiteSettingsData>;
    const out = { ...DEFAULT_SETTINGS };
    for (const k of Object.keys(DEFAULT_SETTINGS) as (keyof WebsiteSettingsData)[]) {
      const v = d[k];
      if (k === 'businessHours') { if (Array.isArray(v) && v.length) out.businessHours = v as WebsiteSettingsData['businessHours']; }
      else if (typeof v === 'string') (out[k] as string) = v.trim();
    }
    return out;
  } catch {
    return DEFAULT_SETTINGS;
  }
});

// ═══ Hero ═════════════════════════════════════════════════════════════════════

const cleanSlide = (s: Partial<HeroSlideConfig>, i: number): HeroSlideConfig => ({
  id: str(s.id) || `slide-${i + 1}`,
  enabled: s.enabled !== false,
  img: str(s.img),
  mobileImg: str(s.mobileImg) || undefined,
  alt: str(s.alt),
  eyebrow: str(s.eyebrow),
  headline: str(s.headline),
  text: str(s.text),
  ctaLabel: str(s.ctaLabel, 'Learn more'),
  ctaHref: str(s.ctaHref, '/services'),
  materialsService: str(s.materialsService) || undefined,
});

export const getHeroConfig = cache(async (): Promise<HeroConfig> => {
  try {
    const snap = await db().collection('settings').doc('hero').get();
    if (!snap.exists) return DEFAULT_HERO;
    const d = snap.data() as Partial<HeroConfig>;
    const slides = arr<Partial<HeroSlideConfig>>(d.slides).map(cleanSlide).filter((s) => s.img && s.headline);
    return {
      intervalMs: Math.min(20000, Math.max(3000, Number(d.intervalMs) || DEFAULT_HERO.intervalMs)),
      slides: slides.length ? slides : DEFAULT_HERO.slides,
      stats: Array.isArray(d.stats) ? d.stats.filter((x) => x && x.value && x.label).slice(0, 3) : DEFAULT_HERO.stats,
      updatedAt: str(d.updatedAt) || undefined,
    };
  } catch {
    return DEFAULT_HERO;
  }
});

export function validateHero(input: Partial<HeroConfig>): { ok: true; value: HeroConfig } | { ok: false; error: string } {
  const slides = arr<Partial<HeroSlideConfig>>(input.slides).map(cleanSlide);
  if (!slides.length) return { ok: false, error: 'Add at least one slide.' };
  if (slides.length > 10) return { ok: false, error: 'Use at most 10 slides.' };
  for (const [i, s] of slides.entries()) {
    if (!s.img) return { ok: false, error: `Slide ${i + 1} needs a desktop image.` };
    if (!s.headline.trim()) return { ok: false, error: `Slide ${i + 1} needs a headline.` };
    if (s.headline.length > 90) return { ok: false, error: `Slide ${i + 1}: keep the headline under 90 characters.` };
    if (!/^\/(?!\/)|^https:\/\//.test(s.ctaHref)) return { ok: false, error: `Slide ${i + 1}: the button link must start with / or https://` };
  }
  if (!slides.some((s) => s.enabled)) return { ok: false, error: 'At least one slide must be visible.' };
  const stats = arr<{ value?: string; label?: string }>(input.stats)
    .map((x) => ({ value: str(x.value).trim().slice(0, 12), label: str(x.label).trim().slice(0, 28) }))
    .filter((x) => x.value && x.label).slice(0, 3);
  return {
    ok: true,
    value: {
      intervalMs: Math.min(20000, Math.max(3000, Number(input.intervalMs) || DEFAULT_HERO.intervalMs)),
      slides,
      stats,
      updatedAt: new Date().toISOString(),
    },
  };
}

// ═══ Services ═════════════════════════════════════════════════════════════════

/**
 * Services as the public site shows them. If Admin → Services has saved anything,
 * Firestore holds the full list (it is copied there on the first save) and is the
 * source of truth; otherwise the built-in list is. Hidden services are excluded.
 */
export const getServicesView = cache(async () => {
  let all: Service[] = seedServices;
  try {
    const snap = await db().collection('services').get();
    if (!snap.empty) {
      all = snap.docs.map((d) => {
        const data = d.data() as Partial<Service>;
        const seed = seedServices.find((s) => s.slug === (data.slug || d.id));
        return { ...(seed ?? ({} as Service)), ...data, id: d.id, slug: data.slug || d.id } as Service;
      });
      // keep the familiar order
      all.sort((a, b) => {
        const ia = seedServices.findIndex((s) => s.slug === a.slug), ib = seedServices.findIndex((s) => s.slug === b.slug);
        return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
      });
    }
  } catch { /* built-in list */ }
  const published = all.filter((s) => s.isPublished !== false);
  return { all, published, isPublished: (slug: string) => published.some((s) => s.slug === slug), get: (slug: string) => all.find((s) => s.slug === slug) ?? null };
});
