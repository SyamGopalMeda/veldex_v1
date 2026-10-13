import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminGuard';
import manifest from '@/lib/mediaManifest.json';
import { listUploads, deleteUpload, storageReady } from '@/lib/storage';
import { revalidateSite } from '@/lib/content';

/**
 * GET /api/admin/media — uploaded images (Firebase Storage) first, then every
 * image shipped with the site (manifest generated at build time).
 */
export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const ready = await storageReady();
  const uploads = ready ? await listUploads().catch(() => []) : [];
  return NextResponse.json({ success: true, storageReady: ready, generatedAt: manifest.generatedAt, items: [...uploads, ...manifest.items] });
}

/** DELETE /api/admin/media?path=uploads/... — remove an uploaded image */
export async function DELETE(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const path = new URL(request.url).searchParams.get('path') ?? '';
  if (!path.startsWith('uploads/')) return NextResponse.json({ success: false, error: 'Only uploaded images can be deleted here.' }, { status: 400 });
  try {
    await deleteUpload(path);
    revalidateSite();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Media API] delete', err);
    return NextResponse.json({ success: false, error: 'Could not delete the image.' }, { status: 500 });
  }
}
