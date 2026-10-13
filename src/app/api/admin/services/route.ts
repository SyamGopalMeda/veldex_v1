import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminGuard';
import { getAdminFirestore } from '@/lib/firebaseAdmin';
import { ensureServicesSeeded, listServices } from '@/lib/adminData';
import { revalidateSite } from '@/lib/content';

/** GET /api/admin/services — services exactly as the public site resolves them */
export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    return NextResponse.json({ success: true, services: await listServices() });
  } catch (err) {
    console.error('[Services API] Read error:', err);
    return NextResponse.json({ success: false, error: 'Could not load services' }, { status: 500 });
  }
}

/**
 * POST /api/admin/services — update a service's name, summary or visibility.
 * Body: { slug, name?, shortDescription?, isPublished? }
 */
export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const { slug, name, shortDescription, isPublished } = await request.json();
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ success: false, error: 'Service slug is required' }, { status: 400 });
    }
    // Validate against the services the site actually has before writing anything
    if (!(await listServices()).some((s) => s.slug === slug)) {
      return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
    }
    await ensureServicesSeeded();
    const ref = getAdminFirestore().collection('services').doc(slug);
    const updates: Record<string, unknown> = { updatedAt: new Date().toISOString() };
    if (typeof name === 'string' && name.trim()) updates.name = name.trim();
    if (typeof shortDescription === 'string') updates.shortDescription = shortDescription.trim();
    if (typeof isPublished === 'boolean') updates.isPublished = isPublished;
    await ref.set(updates, { merge: true });
    revalidateSite();
    return NextResponse.json({ success: true, services: await listServices() });
  } catch (err) {
    console.error('[Services API] Save error:', err);
    return NextResponse.json({ success: false, error: 'Could not save the service' }, { status: 500 });
  }
}
