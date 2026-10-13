import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminGuard';
import { getAdminFirestore } from '@/lib/firebaseAdmin';
import { getHeroConfig, revalidateSite, validateHero, toPlain } from '@/lib/content';
import { DEFAULT_HERO } from '@/lib/heroDefaults';

/** GET /api/admin/hero — current home-hero slides, timing and stats */
export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const snap = await getAdminFirestore().collection('settings').doc('hero').get().catch(() => null);
  return NextResponse.json({ success: true, hero: await getHeroConfig(), customised: Boolean(snap?.exists), defaults: DEFAULT_HERO });
}

/** POST /api/admin/hero — save the whole hero (validated), then refresh the home page */
export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const result = validateHero(await request.json());
    if (!result.ok) return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    await getAdminFirestore().collection('settings').doc('hero').set(result.value);
    revalidateSite();
    return NextResponse.json({ success: true, hero: result.value });
  } catch (err) {
    console.error('[Hero API] save', err);
    return NextResponse.json({ success: false, error: 'Could not save the hero.' }, { status: 500 });
  }
}

/** DELETE /api/admin/hero — restore the built-in hero */
export async function DELETE(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  // Store the original slides (not a deleted doc) so the hero stays database-backed
  const { updatedAt: _u, ...hero } = DEFAULT_HERO;
  void _u;
  const now = new Date().toISOString();
  await getAdminFirestore().collection('settings').doc('hero').set(toPlain({ ...hero, updatedAt: now }));
  revalidateSite();
  return NextResponse.json({ success: true, hero: { ...DEFAULT_HERO, updatedAt: now } });
}
