import { NextRequest, NextResponse } from 'next/server';
import { getSiteSettings, toPublicSettings } from '@/lib/content';

/**
 * GET /wa?text=… → WhatsApp chat with the number set in Admin → Website settings.
 * Every WhatsApp button on the site links here, so changing the number in the
 * admin updates all of them at once.
 */
export async function GET(request: NextRequest) {
  const s = toPublicSettings(await getSiteSettings());
  const text = new URL(request.url).searchParams.get('text') ?? '';
  const target = `https://wa.me/${s.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
  return NextResponse.redirect(target, 302);
}
