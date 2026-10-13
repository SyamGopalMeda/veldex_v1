/**
 * Firebase Admin SDK Initialization
 * SERVER-SIDE ONLY — Never import this in client components.
 * Used for session cookie creation/verification, and privileged Firestore operations.
 */

import { initializeApp, getApps, cert, applicationDefault, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

let adminApp: App;

export function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    process.env.GOOGLE_CLOUD_PROJECT;

  if (process.env.FIREBASE_ADMIN_CLIENT_EMAIL && privateKey) {
    // Local development: explicit service-account credentials from .env.local
    adminApp = initializeApp({
      credential: cert({ projectId, clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL, privateKey }),
      projectId,
    });
  } else if (process.env.K_SERVICE || process.env.FIREBASE_CONFIG || process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // Firebase App Hosting / Cloud Run: the runtime's own service account
    // (Application Default Credentials) — no key file needs to be deployed.
    adminApp = initializeApp({ credential: applicationDefault(), projectId });
  } else {
    throw new Error(
      'Firebase Admin SDK credentials are missing. Locally, set FIREBASE_ADMIN_CLIENT_EMAIL and ' +
        'FIREBASE_ADMIN_PRIVATE_KEY in .env.local; in production the hosting service account is used.'
    );
  }

  return adminApp;
}

export function getAdminAuth() {
  return getAuth(getAdminApp());
}

export function getAdminFirestore() {
  return getFirestore(getAdminApp());
}

/** Comma-separated allowlist of administrator emails (ADMIN_EMAILS). */
export function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS || 'admin@veldexfabrications.com,syamgopalmeda@gmail.com';
  return raw.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
}

export function isAdminEmail(email?: string | null): boolean {
  return Boolean(email) && getAdminEmails().includes(String(email).toLowerCase());
}

/**
 * Verifies a Firebase session cookie (HttpOnly) and that it belongs to an
 * allowlisted administrator. Returns the decoded user or null.
 */
export async function verifySessionCookie(
  sessionCookie: string
): Promise<{ uid: string; email?: string } | null> {
  if (!sessionCookie) return null;
  try {
    const adminAuth = getAdminAuth();
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true); // checkRevoked = true
    if (!isAdminEmail(decoded.email)) return null;
    return { uid: decoded.uid, email: decoded.email };
  } catch {
    return null;
  }
}

/**
 * Creates a session cookie from a Firebase ID token.
 * Expires in 5 days.
 */
export async function createSessionCookie(idToken: string): Promise<string> {
  const adminAuth = getAdminAuth();
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days in ms
  return adminAuth.createSessionCookie(idToken, { expiresIn });
}

/**
 * Revokes all refresh tokens for a user (forces re-login).
 */
export async function revokeUserSessions(uid: string): Promise<void> {
  const adminAuth = getAdminAuth();
  await adminAuth.revokeRefreshTokens(uid);
}
