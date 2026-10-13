'use client';

import { useEffect, useRef, useState } from 'react';
import { Plus, Pencil, Trash2, ExternalLink, X, Save, Share2 } from 'lucide-react';
import type { AdminSocialPost } from '@/lib/adminStore';
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog';
import { Toast, ToastNotification } from '@/components/admin/ui/Toast';
import { PageHead, Empty, Skeleton, StatusBadge } from '@/components/admin/ui/adm';

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
function Youtube({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.5 17a24.1 24.1 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.1 24.1 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17" /><path d="m10 15 5-3-5-3z" />
    </svg>
  );
}
function Facebook({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
const TYPE_META = {
  instagram: { label: 'Instagram', icon: InstagramIcon, color: '#C13584' },
  youtube: { label: 'YouTube', icon: Youtube, color: '#E62117' },
  facebook: { label: 'Facebook', icon: Facebook, color: '#1877F2' },
} as const;
type PostType = keyof typeof TYPE_META;
type Draft = { id?: string; type: PostType; title: string; caption: string; url: string; thumbnail: string; status: 'published' | 'draft' };
const EMPTY: Draft = { type: 'instagram', title: '', caption: '', url: '', thumbnail: '', status: 'published' };

export default function AdminSocialPostsPage() {
  const [posts, setPosts] = useState<AdminSocialPost[] | null>(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | PostType>('all');
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [toast, setToast] = useState<ToastNotification | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const notify = (message: string, type: ToastNotification['type'] = 'success') => {
    setToast({ message, type }); clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToast(null), 3200);
  };

  const load = () =>
    fetch('/api/admin/social-posts', { cache: 'no-store' }).then((r) => r.json())
      .then((d) => { if (!d.success) throw new Error(d.error); setPosts(d.posts); setError(''); })
      .catch((e) => setError(e.message || 'Could not load posts'));

  useEffect(() => {
    load();
    fetch('/api/admin/media', { cache: 'no-store' }).then((r) => r.json()).then((d) => setImages((d.items || []).map((i: { url: string }) => i.url))).catch(() => {});
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/social-posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(draft) });
      const d = await res.json();
      if (!res.ok || !d.success) throw new Error(d.error || 'Save failed');
      setPosts((list) => {
        const rest = (list || []).filter((p) => p.id !== d.post.id);
        return draft.id ? (list || []).map((p) => (p.id === d.post.id ? d.post : p)) : [d.post, ...rest];
      });
      notify(draft.id ? 'Post updated.' : 'Post added.');
      setDraft(null);
    } catch (err) {
      notify(`Couldn't save — ${(err as Error).message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    setDeleteId(null);
    const before = posts;
    setPosts((list) => (list || []).filter((p) => p.id !== id));
    try {
      const res = await fetch(`/api/admin/social-posts?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const d = await res.json();
      if (!res.ok || !d.success) throw new Error(d.error || 'Delete failed');
      notify('Post deleted.', 'info');
    } catch (err) {
      setPosts(before);
      notify(`Couldn't delete — ${(err as Error).message}`, 'error');
    }
  };

  const shown = (posts || []).filter((p) => filter === 'all' || p.type === filter);
  const count = (t: 'all' | PostType) => (posts || []).filter((p) => t === 'all' || p.type === t).length;

  return (
    <div>
      <Toast notification={toast} onClose={() => setToast(null)} />
      <ConfirmDialog isOpen={!!deleteId} title="Delete this post?" description="It will be removed from the admin list. The original post on the social network is not affected." confirmLabel="Delete post" onConfirm={() => deleteId && remove(deleteId)} onCancel={() => setDeleteId(null)} />

      <PageHead
        eyebrow="Content"
        title="Social posts & reels"
        description="Keep track of the Instagram reels, YouTube videos and Facebook posts that show Veldex's work."
        actions={<button type="button" className="adm-btn adm-btn-signal" onClick={() => setDraft({ ...EMPTY })}><Plus size={16} /> Add post</button>}
      />

      <div className="adm-seg" role="group" aria-label="Filter by network" style={{ marginBottom: 16 }}>
        {(['all', 'instagram', 'youtube', 'facebook'] as const).map((t) => (
          <button key={t} type="button" aria-pressed={filter === t} onClick={() => setFilter(t)}>{t === 'all' ? 'All' : TYPE_META[t].label} <span>{count(t)}</span></button>
        ))}
      </div>

      {error ? (
        <div className="adm-card"><Empty icon={Share2} title="Couldn't load posts" action={<button className="adm-btn adm-btn-primary" onClick={load}>Try again</button>}>{error}</Empty></div>
      ) : !posts ? (
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))' }}>{[0, 1, 2, 3].map((i) => <Skeleton key={i} h={300} />)}</div>
      ) : shown.length === 0 ? (
        <div className="adm-card"><Empty icon={Share2} title={posts.length ? 'No posts for this network' : 'No social posts yet'} action={<button className="adm-btn adm-btn-signal" onClick={() => setDraft({ ...EMPTY, type: filter === 'all' ? 'instagram' : filter })}><Plus size={16} /> Add post</button>}>Add a link to a reel or video to keep your social content organised in one place.</Empty></div>
      ) : (
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))' }}>
          {shown.map((p) => {
            const meta = TYPE_META[p.type as PostType] ?? TYPE_META.instagram;
            const Icon = meta.icon;
            return (
              <article key={p.id} className="adm-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', aspectRatio: '4 / 3', background: 'var(--adm-ink)' }}>
                  {p.thumbnail
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={p.thumbnail} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: '#6F6A61' }}><Icon size={34} /></div>}
                  <span className="adm-badge" style={{ position: 'absolute', top: 10, left: 10, background: '#fff', color: meta.color }}><Icon size={12} /> {meta.label}</span>
                </div>
                <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <h2 style={{ fontSize: 15, fontWeight: 650, margin: 0, lineHeight: 1.35 }}>{p.title}</h2>
                    <StatusBadge status={p.status === 'draft' ? 'Draft' : 'Published'} />
                  </div>
                  {p.caption && <p style={{ margin: 0, fontSize: 13, color: 'var(--adm-text-2)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.caption}</p>}
                  <div style={{ fontSize: 12, color: 'var(--adm-muted)' }}>Added {p.date}</div>
                  <div style={{ marginTop: 'auto', paddingTop: 12, display: 'flex', gap: 6 }}>
                    <a className="adm-btn adm-btn-ghost adm-btn-sm" href={p.url} target="_blank" rel="noopener noreferrer" style={{ flex: 1 }}><ExternalLink size={14} /> Open</a>
                    <button type="button" className="adm-btn adm-btn-ghost adm-btn-icon" onClick={() => setDraft({ id: p.id, type: p.type as PostType, title: p.title, caption: p.caption, url: p.url, thumbnail: p.thumbnail, status: p.status })} aria-label={`Edit ${p.title}`}><Pencil size={14} /></button>
                    <button type="button" className="adm-btn adm-btn-ghost adm-btn-icon" onClick={() => setDeleteId(p.id)} aria-label={`Delete ${p.title}`}><Trash2 size={14} /></button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {draft && (
        <div className="adm-modal-back" onClick={(e) => e.target === e.currentTarget && setDraft(null)}>
          <form className="adm-modal" role="dialog" aria-modal="true" aria-labelledby="sp-title" onSubmit={submit}>
            <div className="adm-card-head">
              <h2 id="sp-title">{draft.id ? 'Edit post' : 'Add social post'}</h2>
              <button type="button" className="adm-iconbtn" onClick={() => setDraft(null)} aria-label="Close"><X size={18} /></button>
            </div>
            <div className="adm-card-body" style={{ display: 'grid', gap: 16 }}>
              <div className="adm-field">
                <span>Network</span>
                <div className="adm-seg" role="radiogroup" aria-label="Network">
                  {(Object.keys(TYPE_META) as PostType[]).map((t) => (
                    <button key={t} type="button" role="radio" aria-checked={draft.type === t} aria-pressed={draft.type === t} onClick={() => setDraft({ ...draft, type: t })}>{TYPE_META[t].label}</button>
                  ))}
                </div>
              </div>
              <label className="adm-field"><span>Title</span><input className="adm-input" required maxLength={120} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="e.g. Laser-cut gate installation, Vijayawada" /></label>
              <label className="adm-field"><span>Post URL</span><input className="adm-input" required type="url" pattern="https://.*" value={draft.url} onChange={(e) => setDraft({ ...draft, url: e.target.value })} placeholder="https://www.instagram.com/reel/…" /></label>
              <label className="adm-field"><span>Caption</span><textarea className="adm-textarea" rows={3} maxLength={600} value={draft.caption} onChange={(e) => setDraft({ ...draft, caption: e.target.value })} /></label>
              <label className="adm-field">
                <span>Thumbnail</span>
                <select className="adm-select" value={draft.thumbnail} onChange={(e) => setDraft({ ...draft, thumbnail: e.target.value })}>
                  <option value="">No thumbnail</option>
                  {images.map((u) => <option key={u} value={u}>{u.replace('/images/', '')}</option>)}
                </select>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {draft.thumbnail && <img src={draft.thumbnail} alt="" style={{ marginTop: 8, width: 140, aspectRatio: '4/3', objectFit: 'cover', borderRadius: 10 }} />}
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, fontWeight: 500 }}>
                <button type="button" role="switch" className="adm-switch" aria-checked={draft.status === 'published'} onClick={() => setDraft({ ...draft, status: draft.status === 'published' ? 'draft' : 'published' })} aria-label="Published" />
                {draft.status === 'published' ? 'Published' : 'Draft'}
              </label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: 16, borderTop: '1px solid var(--adm-line-2)' }}>
              <button type="button" className="adm-btn adm-btn-ghost" onClick={() => setDraft(null)}>Cancel</button>
              <button type="submit" className="adm-btn adm-btn-primary" disabled={saving}><Save size={15} /> {saving ? 'Saving…' : draft.id ? 'Save changes' : 'Add post'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
