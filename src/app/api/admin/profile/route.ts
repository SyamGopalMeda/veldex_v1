import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminGuard';
import { getAdminAuth, verifySessionCookie } from '@/lib/firebaseAdmin';

async function sessionUser(request: NextRequest) {
  return verifySessionCookie(request.cookies.get('__session')?.value ?? '');
}

/** GET /api/admin/profile — the signed-in administrator's real account details */
export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const session = await sessionUser(request);
    const user = await getAdminAuth().getUser(session!.uid);
    return NextResponse.json({
      success: true,
      profile: {
        uid: user.uid,
        email: user.email ?? session!.email ?? '',
        displayName: user.displayName ?? '',
        emailVerified: user.emailVerified,
        createdAt: user.metadata.creationTime ?? null,
        lastSignInAt: user.metadata.lastSignInTime ?? null,
        providers: user.providerData.map((p) => p.providerId),
      },
    });
  } catch (err) {
    console.error('[Profile API] Read error:', err);
    return NextResponse.json({ success: false, error: 'Could not load profile' }, { status: 500 });
  }
}

/** PATCH /api/admin/profile — { displayName } */
export async function PATCH(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const { displayName } = await request.json();
    const name = String(displayName ?? '').trim().slice(0, 80);
    const session = await sessionUser(request);
    await getAdminAuth().updateUser(session!.uid, { displayName: name || null });
    return NextResponse.json({ success: true, displayName: name });
  } catch (err) {
    console.error('[Profile API] Update error:', err);
    return NextResponse.json({ success: false, error: 'Could not update profile' }, { status: 500 });
  }
}

/**
 * POST /api/admin/profile — change password: { currentPassword, newPassword }.
 * The current password is verified with Firebase Auth first; afterwards every
 * session for this account is revoked, so the admin signs in again.
 */
export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const { currentPassword, newPassword } = await request.json();
    if (typeof newPassword !== 'string' || newPassword.length < 12) {
      return NextResponse.json({ success: false, error: 'Use at least 12 characters for the new password.' }, { status: 400 });
    }
    if (newPassword === currentPassword) {
      return NextResponse.json({ success: false, error: 'The new password must be different.' }, { status: 400 });
    }
    const session = await sessionUser(request);
    const auth = getAdminAuth();
    const user = await auth.getUser(session!.uid);

    const verify = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: user.email, password: String(currentPassword ?? ''), returnSecureToken: false }) }
    );
    if (!verify.ok) {
      return NextResponse.json({ success: false, error: 'Your current password is incorrect.' }, { status: 400 });
    }

    await auth.updateUser(user.uid, { password: newPassword });
    await auth.revokeRefreshTokens(user.uid);
    const res = NextResponse.json({ success: true });
    res.cookies.set('__session', '', { maxAge: 0, path: '/', httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' });
    return res;
  } catch (err) {
    console.error('[Profile API] Password change error:', err);
    return NextResponse.json({ success: false, error: 'Could not change the password' }, { status: 500 });
  }
}
