'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import type { Analytics } from 'firebase/analytics';

let analytics: Promise<Analytics | null> | null = null;

/** Initialise only firebase/app + analytics — not auth/firestore/storage — to keep public pages light. */
function getAnalyticsOnce() {
  if (!analytics) {
    analytics = (async () => {
      const [{ initializeApp, getApps, getApp }, { initializeAnalytics, isSupported }] = await Promise.all([
        import('firebase/app'),
        import('firebase/analytics'),
      ]);
      if (!(await isSupported())) return null;
      const app = getApps().length ? getApp() : initializeApp({
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      });
      // We log page_view ourselves on every route change, so disable the automatic one
      return initializeAnalytics(app, { config: { send_page_view: false } });
    })().catch(() => null);
  }
  return analytics;
}

/**
 * Google Analytics for Firebase (public site only). Loaded after the page is
 * idle so it never competes with first paint; logs one page_view per route.
 */
export function FirebaseAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) return;
    let cancelled = false;
    const run = async () => {
      const a = await getAnalyticsOnce();
      if (cancelled || !a) return;
      const { logEvent } = await import('firebase/analytics');
      logEvent(a, 'page_view', { page_path: pathname, page_location: window.location.href, page_title: document.title });
    };
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(() => void run(), { timeout: 4000 });
    else setTimeout(() => void run(), 2500);
    return () => { cancelled = true; };
  }, [pathname]);

  return null;
}
