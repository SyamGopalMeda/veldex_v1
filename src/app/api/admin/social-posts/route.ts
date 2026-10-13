import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminGuard';
import { getAdminFirestore } from '@/lib/firebaseAdmin';
import type { AdminSocialPost } from '@/lib/adminStore';

const COLLECTION = 'socialPosts';
const TYPES = ['instagram', 'youtube', 'facebook'] as const;

function toPost(id: string, d: FirebaseFirestore.DocumentData): AdminSocialPost {
  const created = typeof d.createdAt === 'string' ? new Date(d.createdAt) : null;
  return {
    id,
    type: TYPES.includes(d.type) ? d.type : 'instagram',
    thumbnail: d.thumbnail || '',
    title: d.title || '',
    caption: d.caption || '',
    url: d.url || '',
    videoUrl: d.videoUrl || undefined,
    status: d.status === 'draft' ? 'draft' : 'published',
    relatedProject: d.relatedProject || undefined,
    date: created && !isNaN(+created) ? created.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—',
  };
}

/** GET /api/admin/social-posts */
export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const snap = await getAdminFirestore().collection(COLLECTION).orderBy('createdAt', 'desc').get();
    return NextResponse.json({ success: true, posts: snap.docs.map((d) => toPost(d.id, d.data())) });
  } catch (err) {
    console.error('[Social API] Read error:', err);
    return NextResponse.json({ success: false, error: 'Could not load posts' }, { status: 500 });
  }
}

/** POST /api/admin/social-posts — create (no id) or update (id) */
export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const body = await request.json();
    const title = String(body.title ?? '').trim();
    const url = String(body.url ?? '').trim();
    if (!title || !url) {
      return NextResponse.json({ success: false, error: 'Title and post URL are required' }, { status: 400 });
    }
    if (!/^https:\/\//i.test(url)) {
      return NextResponse.json({ success: false, error: 'Post URL must start with https://' }, { status: 400 });
    }
    const record = {
      type: TYPES.includes(body.type) ? body.type : 'instagram',
      title,
      caption: String(body.caption ?? '').trim(),
      url,
      thumbnail: String(body.thumbnail ?? '').trim(),
      status: body.status === 'draft' ? 'draft' : 'published',
      updatedAt: new Date().toISOString(),
    };
    const col = getAdminFirestore().collection(COLLECTION);
    if (body.id) {
      const ref = col.doc(String(body.id));
      if (!(await ref.get()).exists) return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
      await ref.set(record, { merge: true });
      return NextResponse.json({ success: true, post: toPost(ref.id, { ...(await ref.get()).data() }) });
    }
    const ref = await col.add({ ...record, createdAt: record.updatedAt });
    return NextResponse.json({ success: true, post: toPost(ref.id, { ...record, createdAt: record.updatedAt }) });
  } catch (err) {
    console.error('[Social API] Save error:', err);
    return NextResponse.json({ success: false, error: 'Could not save the post' }, { status: 500 });
  }
}

/** DELETE /api/admin/social-posts?id= */
export async function DELETE(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
    const ref = getAdminFirestore().collection(COLLECTION).doc(id);
    if (!(await ref.get()).exists) return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    await ref.delete();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Social API] Delete error:', err);
    return NextResponse.json({ success: false, error: 'Could not delete the post' }, { status: 500 });
  }
}
