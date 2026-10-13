'use client';

import { useEffect, useRef, useState } from 'react';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Save, X, RotateCcw, ExternalLink, Smartphone, Monitor, Images, Copy } from 'lucide-react';
import type { HeroConfig, HeroSlideConfig } from '@/lib/heroDefaults';
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog';
import { Toast, ToastNotification } from '@/components/admin/ui/Toast';
import { PageHead, Card, Empty, Skeleton, StatusBadge } from '@/components/admin/ui/adm';
import { ImageField } from '@/components/admin/ui/MediaPicker';

const SERVICES = [
  { slug: '', name: 'None' },
  { slug: 'gate-automation', name: 'Gates & automation' },
  { slug: 'railings', name: 'Railings' },
  { slug: 'staircases', name: 'Staircases' },
  { slug: 'pergolas-gazebos', name: 'Pergolas & gazebos' },
  { slug: 'sheds-roofing', name: 'Sheds & roofing' },
  { slug: 'elevations-facades', name: 'Elevations & facades' },
];

const blankSlide = (): HeroSlideConfig => ({
  id: `slide-${Date.now().toString(36)}`, enabled: true, img: '', mobileImg: '', alt: '',
  eyebrow: '', headline: '', text: '', ctaLabel: 'Get a quote', ctaHref: '/quote', materialsService: '',
});

export default function AdminHeroPage() {
  const [hero, setHero] = useState<HeroConfig | null>(null);
  const [saved, setSaved] = useState<string>('');
  const [customised, setCustomised] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<{ index: number; slide: HeroSlideConfig } | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState<null | { kind: 'delete'; index: number } | { kind: 'reset' }>(null);
  const [toast, setToast] = useState<ToastNotification | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const notify = (message: string, type: ToastNotification['type'] = 'success') => {
    setToast({ message, type }); clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToast(null), 3600);
  };

  const load = () =>
    fetch('/api/admin/hero', { cache: 'no-store' }).then((r) => r.json())
      .then((d) => { if (!d.success) throw new Error(d.error); setHero(d.hero); setSaved(JSON.stringify(d.hero)); setCustomised(d.customised); setError(''); })
      .catch((e) => setError(e.message || 'Could not load the hero'));
  useEffect(() => { load(); }, []);

  const dirty = hero !== null && JSON.stringify(hero) !== saved;
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const update = (fn: (h: HeroConfig) => HeroConfig) => setHero((h) => (h ? fn(structuredClone(h)) : h));
  const move = (i: number, dir: -1 | 1) => update((h) => { const j = i + dir; if (j < 0 || j >= h.slides.length) return h; [h.slides[i], h.slides[j]] = [h.slides[j], h.slides[i]]; return h; });

  const save = async () => {
    if (!hero) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/hero', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(hero) });
      const d = await res.json();
      if (!res.ok || !d.success) throw new Error(d.error || 'Save failed');
      setHero(d.hero); setSaved(JSON.stringify(d.hero)); setCustomised(true);
      notify('Hero published — the home page is updated.');
    } catch (e) {
      notify((e as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    setConfirm(null);
    const res = await fetch('/api/admin/hero', { method: 'DELETE' });
    const d = await res.json().catch(() => ({}));
    if (!res.ok || !d.success) return notify('Could not reset the hero.', 'error');
    await load();
    notify('Hero restored to the original slides.');
  };

  const commitSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const s = editing.slide;
    if (!s.img) return notify('Choose a desktop image for the slide.', 'error');
    if (!s.headline.trim()) return notify('Add a headline.', 'error');
    update((h) => { if (editing.index < 0) h.slides.push(s); else h.slides[editing.index] = s; return h; });
    setEditing(null);
  };

  const visible = hero?.slides.filter((s) => s.enabled).length ?? 0;

  return (
    <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'minmax(0,1fr)' }}>
      <Toast notification={toast} onClose={() => setToast(null)} />
      <ConfirmDialog
        isOpen={!!confirm}
        title={confirm?.kind === 'reset' ? 'Restore the original hero?' : 'Remove this slide?'}
        description={confirm?.kind === 'reset' ? 'Your saved slides, timing and stats are replaced by the original hero.' : 'The slide is removed from the list. Nothing changes on the website until you publish.'}
        confirmLabel={confirm?.kind === 'reset' ? 'Restore original' : 'Remove slide'}
        onConfirm={() => { if (confirm?.kind === 'reset') reset(); else if (confirm) { update((h) => { h.slides.splice(confirm.index, 1); return h; }); setConfirm(null); } }}
        onCancel={() => setConfirm(null)}
      />

      <PageHead
        eyebrow="Home page"
        title="Hero slider"
        description="The full-screen slider at the top of the home page. Change images (desktop and phone), headlines, text and buttons, reorder or hide slides, then publish."
        actions={
          <>
            <a href="/" target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn-ghost"><ExternalLink size={15} /> View home page</a>
            <button type="button" className="adm-btn adm-btn-signal" onClick={save} disabled={!dirty || saving}><Save size={15} /> {saving ? 'Publishing…' : dirty ? 'Publish changes' : 'Published'}</button>
          </>
        }
      />

      {dirty && <div className="adm-card" role="status" style={{ padding: '12px 16px', background: 'var(--adm-signal-tint)', borderColor: '#F3D98A', fontSize: 13.5 }}>You have unpublished changes. Click <b>Publish changes</b> to update the website.</div>}

      {error ? (
        <div className="adm-card"><Empty icon={Images} title="Couldn't load the hero" action={<button className="adm-btn adm-btn-primary" onClick={load}>Try again</button>}>{error}</Empty></div>
      ) : !hero ? (
        <Skeleton h={320} />
      ) : (
        <>
          <Card title={`Slides (${visible} of ${hero.slides.length} visible)`} subtitle="Shown in this order. Use the arrows to reorder." action={<button type="button" className="adm-btn adm-btn-primary adm-btn-sm" onClick={() => setEditing({ index: -1, slide: blankSlide() })} disabled={hero.slides.length >= 10}><Plus size={14} /> Add slide</button>} bodyClass="">
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {hero.slides.map((s, i) => (
                <li key={s.id} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid var(--adm-line-2)', flexWrap: 'wrap', opacity: s.enabled ? 1 : 0.6 }}>
                  <span className="adm-mono" style={{ width: 22, color: 'var(--adm-muted)', fontSize: 12 }}>{String(i + 1).padStart(2, '0')}</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.img} alt="" title="Desktop image" style={{ width: 112, height: 63, objectFit: 'cover', borderRadius: 8, background: 'var(--adm-bg)' }} />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {s.mobileImg ? <img src={s.mobileImg} alt="" title="Phone image" style={{ width: 29, height: 63, objectFit: 'cover', borderRadius: 6 }} /> : <span title="No phone image — the desktop image is cropped on phones" style={{ width: 29, height: 63, borderRadius: 6, border: '1px dashed var(--adm-line)', display: 'grid', placeItems: 'center', color: 'var(--adm-muted)' }}><Smartphone size={13} /></span>}
                  </div>
                  <div style={{ flex: '1 1 220px', minWidth: 0 }}>
                    <div style={{ fontSize: 11.5, color: 'var(--adm-signal-ink)', fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase' }}>{s.eyebrow || '—'}</div>
                    <div style={{ fontWeight: 650, fontSize: 15, marginTop: 2 }}>{s.headline}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--adm-muted)', marginTop: 2 }}>Button: {s.ctaLabel} → <span className="adm-mono">{s.ctaHref}</span></div>
                  </div>
                  <StatusBadge status={s.enabled ? 'Published' : 'Hidden'} />
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    <button type="button" role="switch" aria-checked={s.enabled} className="adm-switch" onClick={() => update((h) => { h.slides[i].enabled = !h.slides[i].enabled; return h; })} aria-label={`Show slide ${i + 1}`} />
                    <button type="button" className="adm-btn adm-btn-ghost adm-btn-icon" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up"><ArrowUp size={14} /></button>
                    <button type="button" className="adm-btn adm-btn-ghost adm-btn-icon" onClick={() => move(i, 1)} disabled={i === hero.slides.length - 1} aria-label="Move down"><ArrowDown size={14} /></button>
                    <button type="button" className="adm-btn adm-btn-ghost adm-btn-icon" onClick={() => setEditing({ index: i, slide: { ...s } })} aria-label={`Edit slide ${i + 1}`}><Pencil size={14} /></button>
                    <button type="button" className="adm-btn adm-btn-ghost adm-btn-icon" onClick={() => update((h) => { h.slides.splice(i + 1, 0, { ...s, id: `${s.id}-copy-${Date.now().toString(36)}` }); return h; })} disabled={hero.slides.length >= 10} aria-label="Duplicate slide"><Copy size={14} /></button>
                    <button type="button" className="adm-btn adm-btn-ghost adm-btn-icon" onClick={() => setConfirm({ kind: 'delete', index: i })} disabled={hero.slides.length <= 1} aria-label={`Remove slide ${i + 1}`}><Trash2 size={14} /></button>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', alignItems: 'start' }}>
            <Card title="Timing & animation" subtitle="The slice animation runs on every slide change">
              <label className="adm-field">
                <span>Time on each slide: {(hero.intervalMs / 1000).toFixed(1)} seconds</span>
                <input type="range" min={4000} max={15000} step={500} value={hero.intervalMs} onChange={(e) => update((h) => ({ ...h, intervalMs: Number(e.target.value) }))} style={{ accentColor: 'var(--adm-signal)' }} />
                <span className="adm-help">4–15 seconds. Longer gives visitors time to read; shorter shows more of your work.</span>
              </label>
            </Card>
            <Card title="Phone stats card" subtitle="Shown at the bottom of the hero on phones (up to 3)">
              <div style={{ display: 'grid', gap: 10 }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '110px minmax(0,1fr)', gap: 8 }}>
                    <input className="adm-input" placeholder="e.g. 250+" maxLength={12} value={hero.stats[i]?.value ?? ''} onChange={(e) => update((h) => { h.stats[i] = { value: e.target.value, label: h.stats[i]?.label ?? '' }; return h; })} aria-label={`Stat ${i + 1} value`} />
                    <input className="adm-input" placeholder="e.g. Projects completed" maxLength={28} value={hero.stats[i]?.label ?? ''} onChange={(e) => update((h) => { h.stats[i] = { value: h.stats[i]?.value ?? '', label: e.target.value }; return h; })} aria-label={`Stat ${i + 1} label`} />
                  </div>
                ))}
                <span className="adm-help">Leave a row empty to hide it. Use only figures you can stand behind.</span>
              </div>
            </Card>
          </div>

          {customised && (
            <div><button type="button" className="adm-btn adm-btn-ghost" onClick={() => setConfirm({ kind: 'reset' })}><RotateCcw size={15} /> Restore original hero</button></div>
          )}
        </>
      )}

      {editing && (
        <div className="adm-modal-back" onClick={(e) => e.target === e.currentTarget && setEditing(null)}>
          <form className="adm-modal" role="dialog" aria-modal="true" aria-labelledby="slide-title" onSubmit={commitSlide} style={{ maxWidth: 720 }}>
            <div className="adm-card-head">
              <h2 id="slide-title">{editing.index < 0 ? 'Add slide' : `Edit slide ${editing.index + 1}`}</h2>
              <button type="button" className="adm-iconbtn" onClick={() => setEditing(null)} aria-label="Close"><X size={18} /></button>
            </div>
            <div className="adm-card-body" style={{ display: 'grid', gap: 16 }}>
              <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))' }}>
                <ImageField label="Desktop image" required folder="hero" value={editing.slide.img} onChange={(img) => setEditing({ ...editing, slide: { ...editing.slide, img } })} help="Landscape, 1920px+ wide (16:9 works best)." />
                <ImageField label="Phone image" folder="hero" value={editing.slide.mobileImg ?? ''} onChange={(mobileImg) => setEditing({ ...editing, slide: { ...editing.slide, mobileImg } })} help="Portrait, about 9:20. Optional — otherwise the desktop image is cropped." />
              </div>
              <label className="adm-field"><span>Image description (for accessibility & Google)</span><input className="adm-input" maxLength={160} value={editing.slide.alt} onChange={(e) => setEditing({ ...editing, slide: { ...editing.slide, alt: e.target.value } })} placeholder="e.g. Floating oak staircase with black steel railing" /></label>
              <label className="adm-field"><span>Small label above the headline</span><input className="adm-input" maxLength={60} value={editing.slide.eyebrow} onChange={(e) => setEditing({ ...editing, slide: { ...editing.slide, eyebrow: e.target.value } })} placeholder="e.g. Custom structural staircases" /></label>
              <label className="adm-field"><span>Headline *</span><input className="adm-input" required maxLength={90} value={editing.slide.headline} onChange={(e) => setEditing({ ...editing, slide: { ...editing.slide, headline: e.target.value } })} placeholder="e.g. Precision in every cut." /><span className="adm-help">The last word is highlighted in yellow on phones.</span></label>
              <label className="adm-field"><span>Text</span><textarea className="adm-textarea" rows={3} maxLength={260} value={editing.slide.text} onChange={(e) => setEditing({ ...editing, slide: { ...editing.slide, text: e.target.value } })} /></label>
              <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))' }}>
                <label className="adm-field"><span>Button text</span><input className="adm-input" maxLength={30} value={editing.slide.ctaLabel} onChange={(e) => setEditing({ ...editing, slide: { ...editing.slide, ctaLabel: e.target.value } })} /></label>
                <label className="adm-field"><span>Button link</span><input className="adm-input adm-mono" maxLength={200} value={editing.slide.ctaHref} onChange={(e) => setEditing({ ...editing, slide: { ...editing.slide, ctaHref: e.target.value } })} placeholder="/services/staircases" /></label>
                <label className="adm-field"><span>Materials line (desktop)</span>
                  <select className="adm-select" value={editing.slide.materialsService ?? ''} onChange={(e) => setEditing({ ...editing, slide: { ...editing.slide, materialsService: e.target.value } })}>
                    {SERVICES.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
                  </select>
                </label>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 12.5, color: 'var(--adm-muted)' }}><Monitor size={14} /> Changes are kept here until you click <b>Publish changes</b> on the page.</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: 16, borderTop: '1px solid var(--adm-line-2)' }}>
              <button type="button" className="adm-btn adm-btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" className="adm-btn adm-btn-primary">{editing.index < 0 ? 'Add slide' : 'Done'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
