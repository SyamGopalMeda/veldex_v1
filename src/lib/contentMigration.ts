/**
 * One-time move of the content that ships with the code (projects, articles,
 * services, website settings, hero slider) into Firestore, so every item is a
 * real database record the admin panel edits.
 *
 * Idempotent and non-destructive: an item that already has a Firestore document
 * (an admin edit, a hidden item or a deletion marker) is never touched — only
 * missing items are written, as complete, lossless copies of what the site shows.
 */
import { getAdminFirestore } from '@/lib/firebaseAdmin';
import { allProjects } from '@/lib/projectsData';
import { blogArticles } from '@/lib/blogData';
import { seedServices } from '@/lib/siteData';
import { DEFAULT_HERO } from '@/lib/heroDefaults';
import { DEFAULT_SETTINGS } from '@/lib/settingsShared';
import { articleToRecord, projectToRecord, toPlain } from '@/lib/content';

type Part = { label: string; total: number; inDatabase: number; missing: string[] };
export type MigrationStatus = { complete: boolean; parts: Record<'projects' | 'articles' | 'services' | 'settings' | 'hero', Part> };

const db = () => getAdminFirestore();

async function existingIds(col: string): Promise<Set<string>> {
  const snap = await db().collection(col).get();
  const ids = new Set<string>();
  snap.docs.forEach((d) => { ids.add(d.id); const s = d.get('slug'); if (typeof s === 'string') ids.add(s); });
  return ids;
}

export async function migrationStatus(): Promise<MigrationStatus> {
  const [projects, articles, services, general, hero] = await Promise.all([
    existingIds('projects'),
    existingIds('articles'),
    existingIds('services'),
    db().collection('settings').doc('general').get(),
    db().collection('settings').doc('hero').get(),
  ]);
  const part = (label: string, slugs: string[], have: Set<string>): Part => {
    const missing = slugs.filter((s) => !have.has(s));
    return { label, total: slugs.length, inDatabase: slugs.length - missing.length, missing };
  };
  // Services are one list: once the collection has any document it is the source of truth.
  const servicesPart: Part = services.size
    ? { label: 'Services', total: seedServices.length, inDatabase: seedServices.length, missing: [] }
    : part('Services', seedServices.map((s) => s.slug), services);
  const parts = {
    projects: part('Projects', allProjects.map((p) => p.slug), projects),
    articles: part('Blog articles', blogArticles.map((a) => a.slug), articles),
    services: servicesPart,
    settings: { label: 'Website settings', total: 1, inDatabase: general.exists ? 1 : 0, missing: general.exists ? [] : ['general'] },
    hero: { label: 'Hero slider', total: 1, inDatabase: hero.exists ? 1 : 0, missing: hero.exists ? [] : ['hero'] },
  };
  return { complete: Object.values(parts).every((p) => p.missing.length === 0), parts };
}

/** Writes every missing item. Returns how many documents were created per part. */
export async function runMigration(): Promise<Record<string, number>> {
  const before = await migrationStatus();
  const now = new Date().toISOString();
  const meta = { createdAt: now, updatedAt: now, migratedAt: now };
  const batch = db().batch();
  const written: Record<string, number> = { projects: 0, articles: 0, services: 0, settings: 0, hero: 0 };

  const missingProjects = new Set(before.parts.projects.missing);
  allProjects.forEach((p, i) => {
    if (!missingProjects.has(p.slug)) return;
    batch.set(db().collection('projects').doc(p.slug), projectToRecord(p, { ...meta, sortOrder: i }));
    written.projects++;
  });

  const missingArticles = new Set(before.parts.articles.missing);
  for (const a of blogArticles) {
    if (!missingArticles.has(a.slug)) continue;
    batch.set(db().collection('articles').doc(a.slug), articleToRecord(a, meta));
    written.articles++;
  }

  if (before.parts.services.missing.length) {
    seedServices.forEach((s, i) => {
      batch.set(db().collection('services').doc(s.slug), toPlain({ ...s, isPublished: s.isPublished !== false, sortOrder: i, ...meta }));
      written.services++;
    });
  }

  if (before.parts.settings.missing.length) {
    batch.set(db().collection('settings').doc('general'), toPlain({ ...DEFAULT_SETTINGS, ...meta }));
    written.settings = 1;
  }
  if (before.parts.hero.missing.length) {
    const { updatedAt: _u, ...hero } = DEFAULT_HERO;
    void _u;
    batch.set(db().collection('settings').doc('hero'), toPlain({ ...hero, ...meta }));
    written.hero = 1;
  }

  await batch.commit();
  return written;
}

/** Everything the website's content and leads depend on, as one JSON document. */
export async function exportBackup() {
  const cols = ['projects', 'articles', 'services', 'settings', 'enquiries', 'products'];
  const database: Record<string, Record<string, unknown>> = {};
  for (const c of cols) {
    const snap = await db().collection(c).get();
    if (snap.empty) continue;
    database[c] = Object.fromEntries(snap.docs.map((d) => [d.id, d.data()]));
  }
  return {
    exportedAt: new Date().toISOString(),
    database,
    builtIn: { projects: allProjects, articles: blogArticles, services: seedServices, settings: DEFAULT_SETTINGS, hero: DEFAULT_HERO },
  };
}
