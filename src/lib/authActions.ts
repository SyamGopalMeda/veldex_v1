'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createSessionCookie, isAdminEmail, revokeUserSessions, verifySessionCookie } from '@/lib/firebaseAdmin';

const SESSION_COOKIE_NAME = '__session';
const SESSION_EXPIRY_MS = 60 * 60 * 24 * 5 * 1000; // 5 days

export async function signIn(
  _prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  const email = formData.get('email')?.toString().trim();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  // Only allowlisted administrator accounts (ADMIN_EMAILS) may sign in.
  // Generic message so the allowlist can't be probed.
  if (!isAdminEmail(email)) {
    return { error: 'Invalid email or password.' };
  }

  try {
    // Sign in with Firebase client SDK to get ID token
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();

    // Create HttpOnly session cookie via Admin SDK
    const sessionCookie = await createSessionCookie(idToken);

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
      maxAge: SESSION_EXPIRY_MS / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code;
    if (
      code === 'auth/user-not-found' ||
      code === 'auth/wrong-password' ||
      code === 'auth/invalid-credential'
    ) {
      return { error: 'Invalid email or password.' };
    }
    if (code === 'auth/too-many-requests') {
      return { error: 'Too many failed attempts. Please try again later.' };
    }
    // Server-side only (never sent to the browser): the real cause, e.g. missing
    // Admin SDK credentials on a local machine.
    console.error('[signIn] session creation failed:', code ?? (err as Error)?.message ?? err);
    return { error: 'Sign in failed. Please try again.' };
  }

  redirect('/admin');
}

export async function signOut(): Promise<void> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (sessionCookie) {
    const decoded = await verifySessionCookie(sessionCookie);
    if (decoded?.uid) {
      await revokeUserSessions(decoded.uid);
    }
  }

  cookieStore.set(SESSION_COOKIE_NAME, '', {
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });

  redirect('/admin/login');
}

export async function getSessionUser(): Promise<{ uid: string; email?: string } | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return null;
  return verifySessionCookie(sessionCookie);
}
