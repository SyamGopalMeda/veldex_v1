/**
 * Server-only data helpers shared by the /api/admin/* routes.
 * Everything here reads real data: Firestore collections, plus the site's own
 * published content (the same project / blog / service records the public
 * pages render when Firestore has no override).
 */
import type { DocumentSnapshot, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { getAdminFirestore } from '@/lib/firebaseAdmin';
import { seedServices } from '@/lib/siteData';
import type { AdminEnquiry } from '@/lib/adminStore';
import type { Service } from '@/types';

// ── Enquiries ───────────────────────────────────────────────────────────────

export type EnquiryRecord = AdminEnquiry & { createdAt: string | null; serviceKey: string };

const pretty = (s: string) => s.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

export function normaliseStatus(raw: unknown): AdminEnquiry['status'] {
  const s = String(raw ?? '').toLowerCase();
  if (s.includes('contact')) return 'Contacted';
  if (s.includes('progress') || s.includes('quot')) return 'In Progress';
  if (s.includes('complet') || s.includes('won')) return 'Completed';
  if (s.includes('close') || s.includes('lost')) return 'Closed';
  return 'New';
}

/** Firestore enquiry → admin shape. `id` is the real document id. */
export function formatEnquiry(doc: QueryDocumentSnapshot | DocumentSnapshot): EnquiryRecord {
  const data = doc.data() ?? {};
  const createdAt: string | null = typeof data.createdAt === 'string' ? data.createdAt : null;
  const d = createdAt ? new Date(createdAt) : null;
  const serviceKey = String(data.serviceRequested || data.service || 'custom-fabrication');
  return {
    id: doc.id,
    name: data.clientName || data.name || 'Anonymous client',
    phone: data.phone || '',
    email: data.email || '',
    service: pretty(serviceKey),
    serviceKey,
    message: data.message || '',
    date: d && !isNaN(+d) ? d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—',
    createdAt,
    status: normaliseStatus(data.status),
    source: data.source || 'Website',
    notes: data.notes || '',
  };
}

export async function listEnquiries(limit = 500): Promise<EnquiryRecord[]> {
  const snap = await getAdminFirestore().collection('enquiries').orderBy('createdAt', 'desc').limit(limit).get();
  return snap.docs.map(formatEnquiry);
}

/** Resolves an enquiry by its real id (also accepts a legacy "#ABCD" short code). */
export async function findEnquiryRef(id: string) {
  const db = getAdminFirestore();
  const clean = id.replace(/^#/, '');
  const direct = db.collection('enquiries').doc(clean);
  if ((await direct.get()).exists) return direct;
  if (clean.length <= 6) {
    const snap = await db.collection('enquiries').orderBy('createdAt', 'desc').limit(500).get();
    const match = snap.docs.find((d) => d.id.slice(-clean.length).toUpperCase() === clean.toUpperCase());
    if (match) return match.ref;
  }
  return null;
}

// ── Projects & articles (Firestore overrides first, then published site content) ─

export async function countProjects(): Promise<{ total: number; byCategory: Record<string, number> }> {
  const { listProjects } = await import('@/lib/content');
  const all = await listProjects(); // published only — what visitors see
  const byCategory: Record<string, number> = {};
  for (const p of all) byCategory[p.categoryValue] = (byCategory[p.categoryValue] || 0) + 1;
  return { total: all.length, byCategory };
}

export async function countArticles(): Promise<{ total: number; drafts: number }> {
  const { listArticles } = await import('@/lib/content');
  const all = await listArticles(true);
  return { total: all.length, drafts: all.filter((a) => a.status === 'draft').length };
}

// ── Services ────────────────────────────────────────────────────────────────

/** Project category each service's portfolio items are filed under. */
export const SERVICE_PROJECT_CATEGORY: Record<string, string> = {
  'gate-automation': 'gates',
  railings: 'railings',
  staircases: 'staircases',
  'pergolas-gazebos': 'pergolas',
  'sheds-roofing': 'roofing',
  'elevations-facades': 'elevations',
};

export type AdminServiceRecord = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  icon: string;
  isPublished: boolean;
  projectsCount: number;
  source: 'firestore' | 'site';
};

/**
 * Lists services exactly as the public site resolves them: if the Firestore
 * `services` collection has documents it is the source of truth, otherwise
 * the built-in service list is.
 */
export async function listServices(): Promise<AdminServiceRecord[]> {
  const [{ byCategory }, snap] = await Promise.all([
    countProjects(),
    getAdminFirestore().collection('services').get().catch(() => null),
  ]);
  const fromDb = snap && !snap.empty;
  const rows: Service[] = fromDb ? snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Service, 'id'>) })) : seedServices;
  return rows.map((s) => ({
    id: s.id,
    slug: s.slug,
    name: s.name,
    shortDescription: s.shortDescription || '',
    icon: s.icon || 'Wrench',
    isPublished: s.isPublished !== false,
    projectsCount: byCategory[SERVICE_PROJECT_CATEGORY[s.slug] ?? s.slug] || 0,
    source: fromDb ? 'firestore' : 'site',
  }));
}

/**
 * Before the first admin edit, copies the complete built-in service list into
 * Firestore. Otherwise a single saved service would make the public site show
 * only that one (it falls back to the built-in list only when Firestore is empty).
 */
export async function ensureServicesSeeded(): Promise<void> {
  const db = getAdminFirestore();
  const snap = await db.collection('services').limit(1).get();
  if (!snap.empty) return;
  const batch = db.batch();
  const now = new Date().toISOString();
  for (const s of seedServices) batch.set(db.collection('services').doc(s.slug), { ...s, isPublished: s.isPublished !== false, createdAt: now });
  await batch.commit();
}
