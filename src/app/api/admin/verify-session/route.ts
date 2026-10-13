import { NextRequest, NextResponse } from 'next/server';
import { verifySessionCookie } from '@/lib/firebaseAdmin';

/**
 * POST /api/admin/verify-session
 * Used by middleware to validate the __session cookie server-side.
 * Returns 200 if valid, 401 if invalid or expired.
 */
export async function POST(request: NextRequest) {
  const sessionCookie = request.cookies.get('__session')?.value;

  if (!sessionCookie) {
    return NextResponse.json({ error: 'No session' }, { status: 401 });
  }

  const user = await verifySessionCookie(sessionCookie);

  if (!user) {
    return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
  }

  return NextResponse.json({ uid: user.uid }, { status: 200 });
}
