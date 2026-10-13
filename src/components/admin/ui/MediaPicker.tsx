'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X, Check, ImageIcon, Upload, Loader2 } from 'lucide-react';
import { Empty, Skeleton } from './adm';

export type MediaItem = { url: string; name: string; folder: string; bytes: number; used: boolean; uploaded?: boolean; path?: string };

let cache: MediaItem[] | null = null;
export const invalidateMediaCache = () => { cache = null; };

/** Uploads one image through /api/admin/upload. Returns its URL or throws a readable error. */
export async function uploadImage(file: File, folder = 'general'): Promise<string> {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('folder', folder);
  const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
  const d = await res.json().catch(() => ({}));
  if (!res.ok || !d.success) throw new Error(d.error || 'Upload failed');
  invalidateMediaCache();
  return d.url as string;
}

/**
 * Modal to choose images: upload new ones (Firebase Storage) or pick from the
 * library (uploads + images shipped with the site).
 */
export function MediaPicker({ open, onClose, onSelect, multiple = false, title = 'Choose an image', folder = 'general' }: {
  open: boolean;
  onClose: () => void;
  onSelect: (urls: string[]) => void;
  multiple?: boolean;
  title?: string;
  folder?: string;
}) {
  const [items, setItems] = useState<MediaItem[] | null>(cache);
  const [q, setQ] = useState('');
  const [picked, setPicked] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () =>
    fetch('/api/admin/media', { cache: 'no-store' }).then((r) => r.json())
      .then((d) => { if (!d.success) throw new Error(d.error); cache = d.items; setItems(d.items); })
      .catch((e) => setError(e.message || 'Could not load media'));

  useEffect(() => {
    if (!open) return;
    setPicked([]); setQ(''); setUploadError('');
    if (!cache) load(); else setItems(cache);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !uploading && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, uploading]);

  const shown = useMemo(() => (items || []).filter((m) => !q || m.url.toLowerCase().includes(q.toLowerCase()) || m.name.toLowerCase().includes(q.toLowerCase())), [items, q]);

  if (!open) return null;

  const toggle = (url: string) => {
    if (!multiple) { onSelect([url]); onClose(); return; }
    setPicked((p) => (p.includes(url) ? p.filter((u) => u !== url) : [...p, url]));
  };

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploadError('');
    const list = Array.from(files).slice(0, multiple ? 20 : 1);
    setUploading(list.length);
    const urls: string[] = [];
    for (const f of list) {
      try { urls.push(await uploadImage(f, folder)); }
      catch (e) { setUploadError(`${f.name}: ${(e as Error).message}`); }
      setUploading((n) => n - 1);
    }
    if (fileRef.current) fileRef.current.value = '';
    if (!urls.length) return;
    await load();
    if (!multiple) { onSelect([urls[0]]); onClose(); }
    else setPicked((p) => [...p, ...urls]);
  };

  return (
    <div className="adm-modal-back" onClick={(e) => e.target === e.currentTarget && !uploading && onClose()}>
      <div className="adm-modal" role="dialog" aria-modal="true" aria-label={title} style={{ maxWidth: 900, display: 'flex', flexDirection: 'column' }}>
        <div className="adm-card-head">
          <div><h2>{title}</h2><p>Upload new photos or choose from the library</p></div>
          <button type="button" className="adm-iconbtn" onClick={onClose} disabled={Boolean(uploading)} aria-label="Close"><X size={18} /></button>
        </div>
        <div style={{ padding: '14px 20px 0', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <label style={{ position: 'relative', flex: '1 1 240px' }}>
            <span className="sr-only">Search images</span>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--adm-muted)' }} />
            <input className="adm-input" style={{ paddingLeft: 38 }} placeholder="Search by file name…" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple={multiple} hidden onChange={(e) => onFiles(e.target.files)} />
          <button type="button" className="adm-btn adm-btn-signal" onClick={() => fileRef.current?.click()} disabled={Boolean(uploading)}>
            {uploading ? <><Loader2 size={15} className="animate-spin" /> Uploading {uploading}…</> : <><Upload size={15} /> Upload {multiple ? 'images' : 'image'}</>}
          </button>
        </div>
        {uploadError && <div role="alert" style={{ margin: '12px 20px 0', fontSize: 13, color: 'var(--adm-bad)', background: 'var(--adm-bad-tint)', padding: '10px 12px', borderRadius: 10 }}>{uploadError}</div>}
        <div style={{ padding: 20, overflowY: 'auto', maxHeight: '56vh' }}>
          {error ? <Empty icon={ImageIcon} title="Couldn't load media">{error}</Empty>
            : !items ? <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} h={110} />)}</div>
            : shown.length === 0 ? <Empty icon={Search} title="No images match" />
            : (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 140px), 1fr))' }}>
                {shown.map((m) => {
                  const on = picked.includes(m.url);
                  return (
                    <li key={m.url}>
                      <button type="button" onClick={() => toggle(m.url)} aria-pressed={multiple ? on : undefined} style={{ width: '100%', textAlign: 'left', cursor: 'pointer', borderRadius: 10, overflow: 'hidden', border: `2px solid ${on ? 'var(--adm-signal)' : 'var(--adm-line)'}`, background: '#fff', position: 'relative' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={m.url} alt="" loading="lazy" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }} />
                        <span style={{ display: 'block', padding: '6px 8px', fontSize: 11.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</span>
                        {m.uploaded && <span className="adm-badge is-info" style={{ position: 'absolute', top: 6, left: 6 }}>Uploaded</span>}
                        {on && <span style={{ position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: '50%', background: 'var(--adm-signal)', display: 'grid', placeItems: 'center' }}><Check size={14} /></span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
        </div>
        {multiple && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, padding: 16, borderTop: '1px solid var(--adm-line-2)' }}>
            <span className="adm-help">{picked.length} selected</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" className="adm-btn adm-btn-ghost" onClick={onClose} disabled={Boolean(uploading)}>Cancel</button>
              <button type="button" className="adm-btn adm-btn-primary" disabled={!picked.length || Boolean(uploading)} onClick={() => { onSelect(picked); onClose(); }}>Add {picked.length || ''} image{picked.length === 1 ? '' : 's'}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Small image field: thumbnail + Choose/Change + Clear. */
export function ImageField({ label, value, onChange, folder, help, required }: { label: string; value: string; onChange: (url: string) => void; folder?: string; help?: string; required?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="adm-field">
      <span>{label}{required && ' *'}</span>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 10, border: '1px solid var(--adm-line)', borderRadius: 12, background: '#fff' }}>
        <div style={{ width: 96, height: 64, borderRadius: 8, overflow: 'hidden', background: 'var(--adm-bg)', flexShrink: 0, display: 'grid', placeItems: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {value ? <img src={value} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ImageIcon size={20} style={{ color: 'var(--adm-muted)' }} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="adm-mono" style={{ fontSize: 11.5, color: 'var(--adm-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value ? value.replace(/\?.*$/, '').split('/').pop() : 'No image chosen'}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setOpen(true)}>{value ? 'Change' : 'Choose image'}</button>
            {value && !required && <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => onChange('')}>Remove</button>}
          </div>
        </div>
      </div>
      {help && <span className="adm-help">{help}</span>}
      <MediaPicker open={open} onClose={() => setOpen(false)} onSelect={(u) => onChange(u[0])} folder={folder} title={label} />
    </div>
  );
}
