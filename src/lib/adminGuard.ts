/**
 * Server-side guard for /api/admin/* route handlers.
 * Every admin endpoint must call this first; it verifies the HttpOnly
 * __session cookie with the Firebase Admin SDK and the admin allowlist.
 */
import { NextRequest, NextResponse } from 'next/server';
import { verifySessionCookie } from '@/lib/firebaseAdmin';

export async function requireAdmin(request: NextRequest): Promise<NextResponse | null> {
  const session = request.cookies.get('__session')?.value;
  const user = session ? await verifySessionCookie(session) : null;
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}
