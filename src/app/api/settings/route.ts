import { NextResponse } from 'next/server';
import { getSiteSettings, toPublicSettings } from '@/lib/content';

export const dynamic = 'force-dynamic';

/** GET /api/settings — public website settings (managed in Admin → Website settings) */
export async function GET() {
  const s = await getSiteSettings();
  const pub = toPublicSettings(s);
  return NextResponse.json({ success: true, settings: { ...pub, phone: pub.phoneDisplay } });
}
