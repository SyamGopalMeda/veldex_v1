import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * ADMIN ROUTE PROTECTION — Server-Verifiable Session Cookies
 *
 * This middleware intercepts all /admin/* requests and verifies the
 * __session HttpOnly cookie using the Firebase Admin SDK.
 *
 * Client-side auth state alone is NOT sufficient — this ensures even
 * direct URL access to /admin/* is fully server-protected.
 *
 * The actual token verification is done in the API route/Server Action
 * and then a session cookie is set. This middleware validates that cookie.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (not /admin/login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const sessionCookie = request.cookies.get('__session')?.value;
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('from', pathname);

    if (!sessionCookie || sessionCookie.trim().length === 0) {
      // No session cookie — redirect to login
      return NextResponse.redirect(loginUrl);
    }

    // A cookie merely existing is not proof of a session: verify it with the
    // Admin SDK (via the Node route handler) and the admin allowlist.
    try {
      const res = await fetch(new URL('/api/admin/verify-session', request.url), {
        method: 'POST',
        headers: { cookie: `__session=${sessionCookie}` },
        cache: 'no-store',
      });
      if (!res.ok) {
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete('__session');
        return response;
      }
    } catch {
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match /admin and all sub-paths, except:
     * - /admin/login (public auth page)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     */
    '/admin/:path*',
  ],
};
