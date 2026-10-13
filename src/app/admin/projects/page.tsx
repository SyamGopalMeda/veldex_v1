'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Pencil, Trash2, ExternalLink, Briefcase, Star, RefreshCw } from 'lucide-react';
import type { ManagedProject } from '@/lib/content';
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog';
import { Toast, ToastNotification } from '@/components/admin/ui/Toast';
import { PageHead, Empty, Skeleton, StatusBadge, useInitialQuery } from '@/components/admin/ui/adm';

const CATEGORIES: Record<string, string> = { gates: 'Gates', staircases: 'Staircases', railings: 'Railings', pergolas: 'Pergolas', roofing: 'Roofing', elevations: 'Elevations', other: 'Interiors & custom' };

export default function AdminProjectsListPage() {
  const [projects, setProjects] = useState<ManagedProject[] | null>(null);
  const [error, setError] = useState('');
  const [q, setQ] = useInitialQuery();
  const [cat, setCat] = useState('all');
  const [status, setStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [busy, setBusy] = useState<string | null>(null);
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastNotification | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const notify = (message: string, type: ToastNotification['type'] = 'success') => { setToast({ message, type }); clearTimeout(timer.current); timer.current = setTimeout(() => setToast(null), 3400); };

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/projects', { cache: 'no-store' });
      const d = await res.json();
      if (!res.ok || !d.success) throw new Error(d.error || 'Could not load projects');
      setProjects(d.projects); setError('');
    } catch (e) { setError((e as Error).message); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (projects ?? []).filter((p) =>
      (cat === 'all' || p.categoryValue === cat) &&
      (status === 'all' || (status === 'published') === p.isPublished) &&
      (!s || [p.title, p.location, p.category, p.slug].some((v) => v.toLowerCase().includes(s))));
  }, [projects, q, cat, status]);
  const count = (st: 'all' | 'published' | 'draft') => (projects ?? []).filter((p) => st === 'all' || (st === 'published') === p.isPublished).length;

  const patch = async (p: ManagedProject, body: { isPublished?: boolean; isFeatured?: boolean }, msg: string) => {
    setBusy(p.slug);
    const before = projects;
    setProjects((list) => (list ?? []).map((x) => (x.slug === p.slug ? { ...x, ...body } : x)));
    try {
      const res = await fetch('/api/admin/projects', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug: p.slug, ...body }) });
      const d = await res.json().catch(() => ({}));
      if (!res.ok || !d.success) throw new Error(d.error || 'Update failed');
      notify(msg);
    } catch (e) { setProjects(before); notify(`Couldn't update — ${(e as Error).message}`, 'error'); }
    finally { setBusy(null); }
  };

  const remove = async (slug: string) => {
    setDeleteSlug(null);
    const before = projects;
    setProjects((list) => (list ?? []).filter((x) => x.slug !== slug));
    try {
      const res = await fetch(`/api/admin/projects?slug=${encodeURIComponent(slug)}`, { method: 'DELETE' });
      const d = await res.json().catch(() => ({}));
      if (!res.ok || !d.success) throw new Error(d.error || 'Delete failed');
      notify('Project deleted from the website.', 'info');
    } catch (e) { setProjects(before); notify(`Couldn't delete — ${(e as Error).message}`, 'error'); }
  };

  return (
    <div>
      <Toast notification={toast} onClose={() => setToast(null)} />
      <ConfirmDialog isOpen={!!deleteSlug} title="Delete this project?" description="It is removed from the portfolio and its page stops working. This can't be undone from the admin." confirmLabel="Delete project" onConfirm={() => deleteSlug && remove(deleteSlug)} onCancel={() => setDeleteSlug(null)} />
      <PageHead
        eyebrow="Content"
        title="Projects"
        description="Your portfolio — gates, staircases, railings, interiors, exteriors and more. Changes appear on the website as soon as you save."
        actions={<><button type="button" className="adm-btn adm-btn-ghost" onClick={load}><RefreshCw size={15} /> Refresh</button><Link href="/admin/projects/new" className="adm-btn adm-btn-signal"><Plus size={16} /> Add project</Link></>}
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        <div className="adm-seg" role="group" aria-label="Status">
          {(['all', 'published', 'draft'] as const).map((s) => <button key={s} type="button" aria-pressed={status === s} onClick={() => setStatus(s)}>{s === 'all' ? 'All' : s === 'published' ? 'Published' : 'Drafts'} <span>{count(s)}</span></button>)}
        </div>
      </div>

      <div className="adm-card">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, padding: 14, borderBottom: '1px solid var(--adm-line-2)' }}>
          <label style={{ position: 'relative', flex: '1 1 260px' }}>
            <span className="sr-only">Search projects</span>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--adm-muted)' }} />
            <input className="adm-input" style={{ paddingLeft: 38 }} placeholder="Search title, location or category…" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
          <select className="adm-select" style={{ width: 'auto', flex: '0 1 220px' }} value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Category">
            <option value="all">All categories</option>
            {Object.entries(CATEGORIES).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>

        {error ? <Empty icon={Briefcase} title="Couldn't load projects" action={<button className="adm-btn adm-btn-primary" onClick={load}>Try again</button>}>{error}</Empty>
          : !projects ? <div style={{ padding: 16, display: 'grid', gap: 10 }}>{[0, 1, 2, 3].map((i) => <Skeleton key={i} h={56} />)}</div>
          : shown.length === 0 ? <Empty icon={Briefcase} title={projects.length ? 'No matching projects' : 'No projects yet'} action={<Link href="/admin/projects/new" className="adm-btn adm-btn-signal"><Plus size={16} /> Add project</Link>} />
          : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {shown.map((p) => (
                <li key={p.slug} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--adm-line-2)', flexWrap: 'wrap', opacity: busy === p.slug ? 0.6 : 1 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.mainImage} alt="" loading="lazy" style={{ width: 72, height: 52, objectFit: 'cover', borderRadius: 8, background: 'var(--adm-bg)', flexShrink: 0 }} />
                  <Link href={`/admin/projects/${p.slug}/edit`} style={{ flex: '1 1 220px', minWidth: 0, color: 'inherit', textDecoration: 'none' }}>
                    <div style={{ fontWeight: 650, fontSize: 14.5 }}>{p.title}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--adm-muted)' }}>{CATEGORIES[p.categoryValue] ?? p.category} · {p.location}{p.year ? ` · ${p.year}` : ''}</div>
                  </Link>
                  <StatusBadge status={p.isPublished ? 'Published' : 'Draft'} />
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    <span className="adm-help" style={{ marginRight: 2 }}>Live</span>
                    <button type="button" role="switch" aria-checked={p.isPublished} className="adm-switch" disabled={busy === p.slug} onClick={() => patch(p, { isPublished: !p.isPublished }, p.isPublished ? `“${p.title}” is now hidden from the website.` : `“${p.title}” is now live.`)} aria-label={`Publish ${p.title}`} />
                    <button type="button" className="adm-btn adm-btn-ghost adm-btn-icon" disabled={busy === p.slug} onClick={() => patch(p, { isFeatured: !p.isFeatured }, p.isFeatured ? 'Removed from featured.' : 'Featured on the home page.')} aria-pressed={p.isFeatured} aria-label={p.isFeatured ? 'Unfeature' : 'Feature on home page'} title={p.isFeatured ? 'Featured' : 'Feature on home page'}>
                      <Star size={15} fill={p.isFeatured ? 'var(--adm-signal)' : 'none'} style={{ color: p.isFeatured ? 'var(--adm-signal-ink)' : undefined }} />
                    </button>
                    {p.isPublished && <a className="adm-btn adm-btn-ghost adm-btn-icon" href={`/projects/${p.slug}`} target="_blank" rel="noopener noreferrer" aria-label={`View ${p.title}`}><ExternalLink size={14} /></a>}
                    <Link className="adm-btn adm-btn-ghost adm-btn-icon" href={`/admin/projects/${p.slug}/edit`} aria-label={`Edit ${p.title}`}><Pencil size={14} /></Link>
                    <button type="button" className="adm-btn adm-btn-ghost adm-btn-icon" onClick={() => setDeleteSlug(p.slug)} aria-label={`Delete ${p.title}`}><Trash2 size={14} /></button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        {projects && <div style={{ padding: '12px 16px', fontSize: 12.5, color: 'var(--adm-muted)' }}>Showing {shown.length} of {projects.length} projects</div>}
      </div>
    </div>
  );
}
