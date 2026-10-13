'use client';

import { useEffect, useRef, useState } from 'react';
import { Wrench, Pencil, ArrowUpRight, X, Save, Info, Briefcase } from 'lucide-react';
import { Toast, ToastNotification } from '@/components/admin/ui/Toast';
import { PageHead, Empty, Skeleton, StatusBadge } from '@/components/admin/ui/adm';

type Service = { id: string; slug: string; name: string; shortDescription: string; icon: string; isPublished: boolean; projectsCount: number; source: 'firestore' | 'site' };

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[] | null>(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<Service | null>(null);
  const [name, setName] = useState('');
  const [summary, setSummary] = useState('');
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastNotification | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const notify = (message: string, type: ToastNotification['type'] = 'success') => {
    setToast({ message, type });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3400);
  };

  const load = () =>
    fetch('/api/admin/services', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => { if (!d.success) throw new Error(d.error); setServices(d.services); setError(''); })
      .catch((e) => setError(e.message || 'Could not load services'));

  useEffect(() => { load(); }, []);

  const save = async (slug: string, body: Partial<Pick<Service, 'name' | 'shortDescription' | 'isPublished'>>, okMsg: string) => {
    setSaving(slug);
    try {
      const res = await fetch('/api/admin/services', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug, ...body }) });
      const d = await res.json();
      if (!res.ok || !d.success) throw new Error(d.error || 'Save failed');
      setServices(d.services);
      notify(okMsg);
      return true;
    } catch (e) {
      notify(`Couldn't save — ${(e as Error).message}`, 'error');
      return false;
    } finally {
      setSaving(null);
    }
  };

  const openEdit = (s: Service) => { setEditing(s); setName(s.name); setSummary(s.shortDescription); };

  const visible = services?.filter((s) => s.isPublished).length ?? 0;

  return (
    <div>
      <Toast notification={toast} onClose={() => setToast(null)} />
      <PageHead
        eyebrow="Content"
        title="Services"
        description="The services listed on the website. Rename a service, edit its summary, or hide it from the site."
      />

      <div className="adm-card" style={{ padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 20, background: 'var(--adm-signal-tint)', borderColor: '#F3D98A' }}>
        <Info size={17} style={{ color: 'var(--adm-signal-ink)', flexShrink: 0, marginTop: 2 }} />
        <p style={{ margin: 0, fontSize: 13.5, color: 'var(--adm-text-2)', lineHeight: 1.55 }}>
          Changes save to Firestore straight away. Public service pages refresh within an hour. {services && <><b>{visible}</b> of {services.length} services are visible.</>}
        </p>
      </div>

      {error ? (
        <div className="adm-card"><Empty icon={Wrench} title="Couldn't load services" action={<button className="adm-btn adm-btn-primary" onClick={load}>Try again</button>}>{error}</Empty></div>
      ) : !services ? (
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))' }}>{[0, 1, 2, 3, 4, 5].map((i) => <Skeleton key={i} h={190} />)}</div>
      ) : (
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))' }}>
          {services.map((s) => (
            <article key={s.slug} className="adm-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14, opacity: s.isPublished ? 1 : 0.72 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <span className="adm-stat-ico" style={{ background: s.isPublished ? 'var(--adm-ink)' : 'var(--adm-bg)', color: s.isPublished ? 'var(--adm-signal)' : 'var(--adm-muted)' }}><Wrench size={18} /></span>
                <StatusBadge status={s.isPublished ? 'Published' : 'Hidden'} />
              </div>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 650, margin: 0, letterSpacing: '-.01em' }}>{s.name}</h2>
                <div className="adm-mono" style={{ fontSize: 11.5, color: 'var(--adm-muted)', marginTop: 4 }}>/services/{s.slug}</div>
              </div>
              <p style={{ margin: 0, fontSize: 13.5, color: 'var(--adm-text-2)', lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{s.shortDescription}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--adm-muted)' }}>
                <Briefcase size={13} /> {s.projectsCount} portfolio project{s.projectsCount === 1 ? '' : 's'}
              </div>
              <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px solid var(--adm-line-2)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 500, cursor: 'pointer', marginRight: 'auto' }}>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={s.isPublished}
                    className="adm-switch"
                    disabled={saving === s.slug}
                    onClick={() => save(s.slug, { isPublished: !s.isPublished }, s.isPublished ? `${s.name} is now hidden from the site.` : `${s.name} is now visible on the site.`)}
                    aria-label={`Show ${s.name} on the website`}
                  />
                  {s.isPublished ? 'Visible' : 'Hidden'}
                </label>
                <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => openEdit(s)}><Pencil size={14} /> Edit</button>
                {s.isPublished && <a className="adm-btn adm-btn-ghost adm-btn-icon" href={`/services/${s.slug}`} target="_blank" rel="noopener noreferrer" aria-label={`View ${s.name} on the website`}><ArrowUpRight size={15} /></a>}
              </div>
            </article>
          ))}
        </div>
      )}

      {editing && (
        <div className="adm-modal-back" onClick={(e) => e.target === e.currentTarget && setEditing(null)}>
          <form
            className="adm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="svc-edit-title"
            onSubmit={async (e) => {
              e.preventDefault();
              if (await save(editing.slug, { name, shortDescription: summary }, 'Service updated.')) setEditing(null);
            }}
          >
            <div className="adm-card-head">
              <div><h2 id="svc-edit-title">Edit service</h2><p className="adm-mono">/services/{editing.slug}</p></div>
              <button type="button" className="adm-iconbtn" onClick={() => setEditing(null)} aria-label="Close"><X size={18} /></button>
            </div>
            <div className="adm-card-body" style={{ display: 'grid', gap: 16 }}>
              <label className="adm-field"><span>Service name</span><input className="adm-input" value={name} onChange={(e) => setName(e.target.value)} required maxLength={80} autoFocus /></label>
              <label className="adm-field">
                <span>Short summary</span>
                <textarea className="adm-textarea" rows={4} value={summary} onChange={(e) => setSummary(e.target.value)} maxLength={300} />
                <span className="adm-help">{summary.length}/300 · shown on service cards and in search results</span>
              </label>
              <p className="adm-help" style={{ margin: 0 }}>The page address stays the same so existing links and Google results keep working.</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: 16, borderTop: '1px solid var(--adm-line-2)' }}>
              <button type="button" className="adm-btn adm-btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" className="adm-btn adm-btn-primary" disabled={saving === editing.slug || !name.trim()}><Save size={15} /> {saving === editing.slug ? 'Saving…' : 'Save changes'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
