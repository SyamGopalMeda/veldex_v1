import { requireAdmin } from '@/lib/adminGuard';
import { NextRequest, NextResponse } from 'next/server';
import { getAdminFirestore } from '@/lib/firebaseAdmin';
import { DEFAULT_SETTINGS, getSiteSettings, revalidateSite } from '@/lib/content';
import type { WebsiteSettingsData } from '@/lib/adminStore';

const fail = (error: string, status = 400) => NextResponse.json({ success: false, error }, { status });

/** GET /api/admin/settings — current website settings (Firestore over defaults) */
export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  return NextResponse.json({ success: true, settings: await getSiteSettings() });
}

/** POST /api/admin/settings — validate and save, then refresh the public site */
export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const body = (await request.json()) as Partial<WebsiteSettingsData>;
    const clean: Partial<WebsiteSettingsData> = {};
    for (const k of Object.keys(DEFAULT_SETTINGS) as (keyof WebsiteSettingsData)[]) {
      if (k === 'businessHours') continue;
      const v = body[k];
      if (typeof v === 'string') (clean[k] as string) = v.trim().slice(0, 400);
    }
    if (Array.isArray(body.businessHours)) {
      clean.businessHours = body.businessHours.slice(0, 7).map((h) => ({ day: String(h.day).slice(0, 12), open: Boolean(h.open), hours: String(h.hours ?? '').slice(0, 40) }));
    }

    if (clean.websiteName !== undefined && !clean.websiteName) return fail('Website name is required.');
    if (clean.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email)) return fail('Enter a valid email address.');
    for (const k of ['phone', 'whatsapp'] as const) {
      if (clean[k] && clean[k]!.replace(/\D/g, '').length < 10) return fail(`Enter a valid ${k === 'phone' ? 'phone' : 'WhatsApp'} number (10+ digits).`);
    }
    for (const k of ['instagram', 'facebook', 'youtube', 'linkedin', 'googleMapsUrl'] as const) {
      if (clean[k] && !/^https:\/\//.test(clean[k]!)) return fail(`The ${k === 'googleMapsUrl' ? 'Google Maps' : k} link must start with https://`);
    }
    if (clean.defaultSeoTitle && clean.defaultSeoTitle.length > 70) return fail('Keep the SEO title under 70 characters.');
    if (clean.defaultMetaDescription && clean.defaultMetaDescription.length > 170) return fail('Keep the meta description under 170 characters.');

    await getAdminFirestore().collection('settings').doc('general').set({ ...clean, updatedAt: new Date().toISOString() }, { merge: true });
    revalidateSite();
    return NextResponse.json({ success: true, settings: await getSiteSettings() });
  } catch (err) {
    console.error('[Settings API] Save error:', err);
    return fail('Could not save settings.', 500);
  }
}
