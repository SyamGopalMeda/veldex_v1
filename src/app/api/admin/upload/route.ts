import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { requireAdmin } from '@/lib/adminGuard';
import { saveUpload, storageReady } from '@/lib/storage';
import { slugify } from '@/lib/content';

export const runtime = 'nodejs';
const MAX_BYTES = 15 * 1024 * 1024;
const TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

/**
 * POST /api/admin/upload (multipart: file, [folder])
 * Validates the image, fixes orientation, resizes to ≤2560 px, saves a quality
 * JPEG to Firebase Storage and returns its public URL.
 */
export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    if (!(await storageReady())) {
      return NextResponse.json({ success: false, error: 'Image uploads need Firebase Storage. Open Firebase console → Storage → Get started, then try again.' }, { status: 503 });
    }
    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File)) return NextResponse.json({ success: false, error: 'Choose an image file.' }, { status: 400 });
    if (!TYPES.includes(file.type)) return NextResponse.json({ success: false, error: 'Use a JPG, PNG, WebP or AVIF image.' }, { status: 400 });
    if (file.size > MAX_BYTES) return NextResponse.json({ success: false, error: 'Images must be under 15 MB.' }, { status: 400 });

    const input = Buffer.from(await file.arrayBuffer());
    const img = sharp(input, { failOn: 'error' }).rotate();
    const meta = await img.metadata();
    if (!meta.width || !meta.height) return NextResponse.json({ success: false, error: 'That file is not a readable image.' }, { status: 400 });
    if (meta.width < 600) return NextResponse.json({ success: false, error: `Image is only ${meta.width}px wide — use at least 600px (1600px+ for heroes).` }, { status: 400 });
    const out = await img.resize({ width: 2560, height: 2560, fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 86, progressive: true, mozjpeg: true }).toBuffer({ resolveWithObject: true });

    const folder = slugify(String(form.get('folder') || 'general')) || 'general';
    const base = slugify(file.name.replace(/\.[^.]+$/, '')) || 'image';
    const path = `uploads/${folder}/${Date.now()}-${base}.jpg`;
    const url = await saveUpload(path, out.data, 'image/jpeg');
    return NextResponse.json({ success: true, url, path, width: out.info.width, height: out.info.height, bytes: out.info.size });
  } catch (err) {
    console.error('[Upload API]', err);
    return NextResponse.json({ success: false, error: 'Upload failed — please try again.' }, { status: 500 });
  }
}
