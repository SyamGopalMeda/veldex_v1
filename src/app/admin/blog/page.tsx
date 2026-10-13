'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Pencil, Trash2, ExternalLink, FileText, RefreshCw } from 'lucide-react';
import type { ManagedArticle } from '@/lib/content';
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog';
import { Toast, ToastNotification } from '@/components/admin/ui/Toast';
import { PageHead, Empty, Skeleton, StatusBadge, useInitialQuery } from '@/components/admin/ui/adm';

export default function AdminBlogPage() {
  const [articles, setArticles] = useState<ManagedArticle[] | null>(null);
  const [error, setError] = useState('');
  const [q, setQ] = useInitialQuery();
  const [status, setStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [busy, setBusy] = useState<string | null>(null);
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastNotification | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const notify = (message: string, type: ToastNotification['type'] = 'success') => { setToast({ message, type }); clearTimeout(timer.current); timer.current = setTimeout(() => setToast(null), 3400); };

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/blog', { cache: 'no-store' });
      const d = await res.json();
      if (!res.ok || !d.success) throw new Error(d.error || 'Could not load articles');
      setArticles(d.articles); setError('');
    } catch (e) { setError((e as Error).message); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (articles ?? []).filter((a) => (status === 'all' || a.status === status) && (!s || [a.title, a.category, a.excerpt, a.slug].some((v) => v.toLowerCase().includes(s))));
  }, [articles, q, status]);
  const count = (st: 'all' | 'published' | 'draft') => (articles ?? []).filter((a) => st === 'all' || a.status === st).length;

  const toggle = async (a: ManagedArticle) => {
    const publish = a.status !== 'published';
    setBusy(a.slug);
    const before = articles;
    setArticles((list) => (list ?? []).map((x) => (x.slug === a.slug ? { ...x, status: publish ? 'published' : 'draft' } : x)));
    try {
      const res = await fetch('/api/admin/blog', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug: a.slug, isPublished: publish }) });
      const d = await res.json().catch(() => ({}));
      if (!res.ok || !d.success) throw new Error(d.error || 'Update failed');
      notify(publish ? `“${a.title}” is now live.` : `“${a.title}” is now hidden from the blog.`);
    } catch (e) { setArticles(before); notify(`Couldn't update — ${(e as Error).message}`, 'error'); }
    finally { setBusy(null); }
  };

  const remove = async (slug: string) => {
    setDeleteSlug(null);
    const before = articles;
    setArticles((list) => (list ?? []).filter((x) => x.slug !== slug));
    try {
      const res = await fetch(`/api/admin/blog?slug=${encodeURIComponent(slug)}`, { method: 'DELETE' });
      const d = await res.json().catch(() => ({}));
      if (!res.ok || !d.success) throw new Error(d.error || 'Delete failed');
      notify('Article deleted from the blog.', 'info');
    } catch (e) { setArticles(before); notify(`Couldn't delete — ${(e as Error).message}`, 'error'); }
  };

  return (
    <div>
      <Toast notification={toast} onClose={() => setToast(null)} />
      <ConfirmDialog isOpen={!!deleteSlug} title="Delete this article?" description="It is removed from the blog and its page stops working." confirmLabel="Delete article" onConfirm={() => deleteSlug && remove(deleteSlug)} onCancel={() => setDeleteSlug(null)} />
      <PageHead
        eyebrow="Content"
        title="Blog"
        description="Guides and articles on the website. Publishing or hiding takes effect immediately."
        actions={<><button type="button" className="adm-btn adm-btn-ghost" onClick={load}><RefreshCw size={15} /> Refresh</button><Link href="/admin/blog/new" className="adm-btn adm-btn-signal"><Plus size={16} /> New article</Link></>}
      />
      <div className="adm-seg" role="group" aria-label="Status" style={{ marginBottom: 16 }}>
        {(['all', 'published', 'draft'] as const).map((s) => <button key={s} type="button" aria-pressed={status === s} onClick={() => setStatus(s)}>{s === 'all' ? 'All' : s === 'published' ? 'Published' : 'Drafts'} <span>{count(s)}</span></button>)}
      </div>
      <div className="adm-card">
        <div style={{ padding: 14, borderBottom: '1px solid var(--adm-line-2)' }}>
          <label style={{ position: 'relative', display: 'block' }}>
            <span className="sr-only">Search articles</span>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--adm-muted)' }} />
            <input className="adm-input" style={{ paddingLeft: 38 }} placeholder="Search title, category or excerpt…" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
        </div>
        {error ? <Empty icon={FileText} title="Couldn't load articles" action={<button className="adm-btn adm-btn-primary" onClick={load}>Try again</button>}>{error}</Empty>
          : !articles ? <div style={{ padding: 16, display: 'grid', gap: 10 }}>{[0, 1, 2].map((i) => <Skeleton key={i} h={56} />)}</div>
          : shown.length === 0 ? <Empty icon={FileText} title={articles.length ? 'No matching articles' : 'No articles yet'} action={<Link href="/admin/blog/new" className="adm-btn adm-btn-signal"><Plus size={16} /> New article</Link>} />
          : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {shown.map((a) => (
                <li key={a.slug} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--adm-line-2)', flexWrap: 'wrap', opacity: busy === a.slug ? 0.6 : 1 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.featuredImage} alt="" loading="lazy" style={{ width: 72, height: 52, objectFit: 'cover', borderRadius: 8, background: 'var(--adm-bg)', flexShrink: 0 }} />
                  <Link href={`/admin/blog/${a.slug}/edit`} style={{ flex: '1 1 240px', minWidth: 0, color: 'inherit', textDecoration: 'none' }}>
                    <div style={{ fontWeight: 650, fontSize: 14.5 }}>{a.title}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--adm-muted)' }}>{a.category} · {a.date} · {a.readTime}</div>
                  </Link>
                  <StatusBadge status={a.status === 'published' ? 'Published' : 'Draft'} />
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    <span className="adm-help" style={{ marginRight: 2 }}>Live</span>
                    <button type="button" role="switch" aria-checked={a.status === 'published'} className="adm-switch" disabled={busy === a.slug} onClick={() => toggle(a)} aria-label={`Publish ${a.title}`} />
                    {a.status === 'published' && <a className="adm-btn adm-btn-ghost adm-btn-icon" href={`/blog/${a.slug}`} target="_blank" rel="noopener noreferrer" aria-label={`View ${a.title}`}><ExternalLink size={14} /></a>}
                    <Link className="adm-btn adm-btn-ghost adm-btn-icon" href={`/admin/blog/${a.slug}/edit`} aria-label={`Edit ${a.title}`}><Pencil size={14} /></Link>
                    <button type="button" className="adm-btn adm-btn-ghost adm-btn-icon" onClick={() => setDeleteSlug(a.slug)} aria-label={`Delete ${a.title}`}><Trash2 size={14} /></button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        {articles && <div style={{ padding: '12px 16px', fontSize: 12.5, color: 'var(--adm-muted)' }}>Showing {shown.length} of {articles.length} articles</div>}
      </div>
    </div>
  );
}
