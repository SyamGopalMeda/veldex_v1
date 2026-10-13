/**
 * Firebase Storage for admin image uploads (server-only, Admin SDK).
 * Files live under uploads/ and are served through Firebase download URLs.
 */
import { randomUUID } from 'node:crypto';
import { getStorage } from 'firebase-admin/storage';
import { getAdminApp } from '@/lib/firebaseAdmin';

export const BUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'veldex-c8a64.firebasestorage.app';
export const bucket = () => getStorage(getAdminApp()).bucket(BUCKET);

export async function storageReady(): Promise<boolean> {
  try { return (await bucket().exists())[0]; } catch { return false; }
}

const downloadUrl = (path: string, token: string) =>
  `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodeURIComponent(path)}?alt=media&token=${token}`;

export async function saveUpload(path: string, data: Buffer, contentType: string) {
  const token = randomUUID();
  await bucket().file(path).save(data, {
    resumable: false,
    contentType,
    metadata: { cacheControl: 'public, max-age=31536000, immutable', metadata: { firebaseStorageDownloadTokens: token } },
  });
  return downloadUrl(path, token);
}

export async function listUploads() {
  const [files] = await bucket().getFiles({ prefix: 'uploads/' });
  return files
    .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f.name))
    .map((f) => {
      const meta = f.metadata as { size?: string | number; updated?: string; metadata?: Record<string, string> };
      const token = meta.metadata?.firebaseStorageDownloadTokens?.split(',')[0];
      return {
        url: token ? downloadUrl(f.name, token) : '',
        path: f.name,
        name: f.name.split('/').pop() ?? f.name,
        folder: 'uploads',
        bytes: Number(meta.size ?? 0),
        modified: meta.updated ?? '',
        used: true,
        uploaded: true,
      };
    })
    .filter((f) => f.url)
    .sort((a, b) => b.modified.localeCompare(a.modified));
}

export async function deleteUpload(path: string) {
  if (!path.startsWith('uploads/')) throw new Error('Only uploaded files can be deleted');
  await bucket().file(path).delete();
}
