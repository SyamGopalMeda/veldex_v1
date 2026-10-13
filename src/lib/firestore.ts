/**
 * Firestore Data Access Layer
 * Server-side typed helpers for reading and writing application data.
 * All functions return typed interfaces from src/types/index.ts.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  updateDoc,
  serverTimestamp,
  type Firestore,
} from 'firebase/firestore';
import { db } from './firebase';
import { getAdminFirestore } from './firebaseAdmin';
import type { Service, Product, Project, Enquiry, SiteSettings, EnquiryStatus } from '@/types';
import { siteConfig } from './config';

// ── Settings ────────────────────────────────────────────────────────────────

/**
 * Reads site settings from Firestore.
 * Falls back to config.ts defaults if not found.
 */
export async function getSettings(): Promise<SiteSettings> {
  try {
    const adminDb = getAdminFirestore();
    const docRef = adminDb.collection('settings').doc('general');
    const snap = await docRef.get();

    if (snap.exists) {
      return snap.data() as SiteSettings;
    }
  } catch {
    // Fall through to defaults
  }

  // Fallback to centralized config
  return {
    displayPhone: siteConfig.contact.phoneDisplay,
    whatsappNumber: siteConfig.contact.whatsapp,
    displayEmail: siteConfig.contact.email,
    publicLocation: siteConfig.location.publicDisplay,
    operatingHours: siteConfig.hours.display,
    instagramUrl: siteConfig.social.instagram,
    threadsUrl: siteConfig.social.threads,
  };
}

// ── Services ────────────────────────────────────────────────────────────────

export async function getPublishedServices(): Promise<Service[]> {
  try {
    const adminDb = getAdminFirestore();
    const snap = await adminDb
      .collection('services')
      .where('isPublished', '==', true)
      .orderBy('name')
      .get();

    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Service));
  } catch {
    return [];
  }
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  try {
    const adminDb = getAdminFirestore();
    const snap = await adminDb
      .collection('services')
      .where('slug', '==', slug)
      .where('isPublished', '==', true)
      .limit(1)
      .get();

    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() } as Service;
  } catch {
    return null;
  }
}

export async function getAllServiceSlugs(): Promise<string[]> {
  const services = await getPublishedServices();
  return services.map((s) => s.slug);
}

// ── Products ────────────────────────────────────────────────────────────────

export async function getPublishedProducts(): Promise<Product[]> {
  try {
    const adminDb = getAdminFirestore();
    const snap = await adminDb
      .collection('products')
      .where('isAvailable', '==', true)
      .orderBy('name')
      .get();

    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
  } catch {
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const adminDb = getAdminFirestore();
    const snap = await adminDb
      .collection('products')
      .where('slug', '==', slug)
      .where('isAvailable', '==', true)
      .limit(1)
      .get();

    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() } as Product;
  } catch {
    return null;
  }
}

export async function getAllProductSlugs(): Promise<string[]> {
  const products = await getPublishedProducts();
  return products.map((p) => p.slug);
}

// ── Projects ────────────────────────────────────────────────────────────────

export async function getPublishedProjects(limitCount?: number): Promise<Project[]> {
  try {
    const adminDb = getAdminFirestore();
    let q = adminDb
      .collection('projects')
      .where('isPublished', '==', true)
      .orderBy('publishedAt', 'desc');

    if (limitCount) {
      q = q.limit(limitCount) as typeof q;
    }

    const snap = await q.get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
  } catch {
    return [];
  }
}

export async function getFeaturedProjects(limitCount = 6): Promise<Project[]> {
  try {
    const adminDb = getAdminFirestore();
    const snap = await adminDb
      .collection('projects')
      .where('isPublished', '==', true)
      .where('isFeatured', '==', true)
      .orderBy('publishedAt', 'desc')
      .limit(limitCount)
      .get();

    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
  } catch {
    return [];
  }
}

// ── Enquiries ───────────────────────────────────────────────────────────────

/**
 * Creates a new enquiry in Firestore.
 * IMPORTANT: Do not call this directly from the client.
 * Use the Server Action in src/app/actions/enquiry.ts which performs validation.
 */
export async function createEnquiry(
  data: Omit<Enquiry, 'id' | 'status' | 'createdAt'>
): Promise<string> {
  const adminDb = getAdminFirestore();
  const docRef = await adminDb.collection('enquiries').add({
    ...data,
    status: 'NEW' as EnquiryStatus,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

// ── Admin-side Enquiry Operations ───────────────────────────────────────────

export async function getAllEnquiries(limitCount = 50): Promise<Enquiry[]> {
  try {
    const adminDb = getAdminFirestore();
    const snap = await adminDb
      .collection('enquiries')
      .orderBy('createdAt', 'desc')
      .limit(limitCount)
      .get();

    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Enquiry));
  } catch {
    return [];
  }
}

export async function updateEnquiryStatus(
  enquiryId: string,
  status: EnquiryStatus
): Promise<void> {
  const adminDb = getAdminFirestore();
  await adminDb.collection('enquiries').doc(enquiryId).update({
    status,
    updatedAt: new Date().toISOString(),
  });
}

// ── Admin Dashboard Stats ────────────────────────────────────────────────────

export async function getDashboardStats(): Promise<{
  totalProjects: number;
  publishedProjects: number;
  totalEnquiries: number;
  newEnquiries: number;
}> {
  try {
    const adminDb = getAdminFirestore();
    const [projectsSnap, enquiriesSnap, newEnquiriesSnap] = await Promise.all([
      adminDb.collection('projects').get(),
      adminDb.collection('enquiries').get(),
      adminDb.collection('enquiries').where('status', '==', 'NEW').get(),
    ]);

    const publishedSnap = await adminDb
      .collection('projects')
      .where('isPublished', '==', true)
      .get();

    return {
      totalProjects: projectsSnap.size,
      publishedProjects: publishedSnap.size,
      totalEnquiries: enquiriesSnap.size,
      newEnquiries: newEnquiriesSnap.size,
    };
  } catch {
    return { totalProjects: 0, publishedProjects: 0, totalEnquiries: 0, newEnquiries: 0 };
  }
}

// ── Settings Update (Admin) ──────────────────────────────────────────────────

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
  const adminDb = getAdminFirestore();
  await adminDb.collection('settings').doc('general').set(settings, { merge: true });
}
