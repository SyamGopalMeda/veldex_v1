'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, Copy, ExternalLink, X, ImageIcon, Check, Info, Upload, Loader2, Trash2 } from 'lucide-react';
import { uploadImage } from '@/components/admin/ui/MediaPicker';
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog';
import { Toast, ToastNotification } from '@/components/admin/ui/Toast';
import { PageHead, Empty, Skeleton, formatBytes, useInitialQuery } from '@/components/admin/ui/adm';

type Media = { url: string; name: string; folder: string; bytes: number; modified: string; used: boolean; uploaded?: boolean; path?: string };

export default function AdminMediaLibraryPage() {
  const [items, setItems] = useState<Media[] | null>(null);
  const [storageReady, setStorageReady] = useState(true);
  const [uploading, setUploading] = useState(0);
  const [deletePath, setDeletePath] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [query, setQuery] = useInitialQuery();
  const [folder, setFolder] = useState('all');
  const [usage, setUsage] = useState<'all' | 'used' | 'unused'>('all');
  const [preview, setPreview] = useState<Media | null>(null);
  const [dims, setDims] = useState<string>('');
  const [copied, setCopied] = useState('');
  const [toast, setToast] = useState<ToastNotification | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const load = () =>
    fetch('/api/admin/media', { cache: 'no-store' }).then((r) => r.json())
      .then((d) => { if (!d.success) throw new Error(d.error); setItems(d.items); setStorageReady(d.storageReady !== false); })
      .catch((e) => setError(e.message || 'Could not load media'));
  useEffect(() => { load(); }, []);

  const notify = (message: string, type: ToastNotification['type'] = 'success') => {
    setToast({ message, type }); clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToast(null), 4000);
  };
  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const list = Array.from(files).slice(0, 20);
    setUploading(list.length);
    let ok = 0;
    for (const f of list) {
      try { await uploadImage(f, 'library'); ok++; } catch (e) { notify(`${f.name}: ${(e as Error).message}`, 'error'); }
      setUploading((n) => n - 1);
    }
    if (fileRef.current) fileRef.current.value = '';
    if (ok) { notify(`${ok} image${ok > 1 ? 's' : ''} uploaded.`); load(); }
  };
  const remove = async (path: string) => {
    setDeletePath(null);
    const res = await fetch(`/api/admin/media?path=${encodeURIComponent(path)}`, { method: 'DELETE' });
    const d = await res.json().catch(() => ({}));
    if (!res.ok || !d.success) return notify(d.error || 'Could not delete the image.', 'error');
    setPreview(null);
    notify('Image deleted.', 'info');
    load();
  };

  useEffect(() => {
    if (!preview) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setPreview(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [preview]);

  const folders = useMemo(() => Array.from(new Set((items || []).map((i) => i.folder))).sort(), [items]);
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (items || []).filter((i) =>
      (folder === 'all' || i.folder === folder) &&
      (usage === 'all' || (usage === 'used') === i.used) &&
      (!q || i.url.toLowerCase().includes(q)));
  }, [items, query, folder, usage]);
  const totalBytes = (items || []).reduce((a, i) => a + i.bytes, 0);

  const copy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied(''), 1600);
    } catch {
      setToast({ message: 'Copy failed — select the path and copy it manually.', type: 'error' });
      clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div>
      <Toast notification={toast} onClose={() => setToast(null)} />
      <ConfirmDialog isOpen={!!deletePath} title="Delete this image?" description="Pages that still use it will show a broken image. Make sure it is no longer used before deleting." confirmLabel="Delete image" onConfirm={() => deletePath && remove(deletePath)} onCancel={() => setDeletePath(null)} />
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple hidden onChange={(e) => onFiles(e.target.files)} />
      <PageHead
        eyebrow="Content"
        title="Media library"
        description={items ? `${items.length} images · ${formatBytes(totalBytes)} in total` : 'Uploaded images and every image shipped with the website.'}
        actions={<button type="button" className="adm-btn adm-btn-signal" onClick={() => fileRef.current?.click()} disabled={Boolean(uploading) || !storageReady}>{uploading ? <><Loader2 size={15} className="animate-spin" /> Uploading {uploading}…</> : <><Upload size={15} /> Upload images</>}</button>}
      />

      <div className="adm-card" style={{ padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 20 }}>
        <Info size={17} style={{ color: 'var(--adm-signal-ink)', flexShrink: 0, marginTop: 2 }} />
        <p style={{ margin: 0, fontSize: 13.5, color: 'var(--adm-text-2)', lineHeight: 1.55 }}>
          {storageReady
            ? 'Upload photos here or straight from the project, blog and hero editors. Images are resized and compressed automatically (max 2560px). Copy a path to reuse an image anywhere.'
            : 'Uploads are turned off because Firebase Storage is not set up yet: Firebase console → Storage → Get started. You can still pick any image that ships with the website.'}
        </p>
      </div>

      <div className="adm-card">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, padding: 14, borderBottom: '1px solid var(--adm-line-2)', alignItems: 'center' }}>
          <label style={{ position: 'relative', flex: '1 1 240px' }}>
            <span className="sr-only">Search images</span>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--adm-muted)' }} />
            <input className="adm-input" style={{ paddingLeft: 38 }} placeholder="Search by file name…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>
          <select className="adm-select" style={{ width: 'auto', flex: '0 1 200px' }} value={folder} onChange={(e) => setFolder(e.target.value)} aria-label="Folder">
            <option value="all">All folders</option>
            {folders.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
          <div className="adm-seg" role="group" aria-label="Usage">
            {(['all', 'used', 'unused'] as const).map((u) => (
              <button key={u} type="button" aria-pressed={usage === u} onClick={() => setUsage(u)}>{u === 'all' ? 'All' : u === 'used' ? 'On the site' : 'Unused'}</button>
            ))}
          </div>
        </div>

        {error ? (
          <Empty icon={ImageIcon} title="Couldn't load media">{error}</Empty>
        ) : !items ? (
          <div style={{ padding: 16, display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} h={170} />)}</div>
        ) : shown.length === 0 ? (
          <Empty icon={Search} title="No images match">Try a different name, folder or filter.</Empty>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 16, display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 150px), 1fr))' }}>
            {shown.map((m) => (
              <li key={m.url} style={{ border: '1px solid var(--adm-line)', borderRadius: 12, overflow: 'hidden', background: '#fff', display: 'flex', flexDirection: 'column' }}>
                <button type="button" onClick={() => { setPreview(m); setDims(''); }} style={{ position: 'relative', aspectRatio: '4 / 3', background: 'var(--adm-bg)', cursor: 'zoom-in' }} aria-label={`Preview ${m.name}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.url} alt="" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {!m.used && <span className="adm-badge is-mute" style={{ position: 'absolute', top: 8, left: 8 }}>Unused</span>}
                </button>
                <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={m.name}>{m.name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--adm-muted)' }}>{formatBytes(m.bytes)} · {m.folder}</div>
                  </div>
                  <button type="button" className="adm-btn adm-btn-ghost adm-btn-icon" onClick={() => copy(m.url)} aria-label={`Copy path of ${m.name}`} title="Copy path">
                    {copied === m.url ? <Check size={14} style={{ color: 'var(--adm-ok)' }} /> : <Copy size={14} />}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {preview && (
        <div className="adm-modal-back" onClick={(e) => e.target === e.currentTarget && setPreview(null)}>
          <div className="adm-modal" role="dialog" aria-modal="true" aria-label={preview.name} style={{ maxWidth: 900 }}>
            <div className="adm-card-head">
              <div style={{ minWidth: 0 }}>
                <h2 style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{preview.name}</h2>
                <p>{[dims, formatBytes(preview.bytes), preview.used ? 'Used on the site' : 'Not referenced by the site'].filter(Boolean).join(' · ')}</p>
              </div>
              <button type="button" className="adm-iconbtn" onClick={() => setPreview(null)} aria-label="Close"><X size={18} /></button>
            </div>
            <div style={{ background: 'var(--adm-ink)', display: 'grid', placeItems: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview.url} alt={preview.name} onLoad={(e) => setDims(`${e.currentTarget.naturalWidth}×${e.currentTarget.naturalHeight}px`)} style={{ maxWidth: '100%', maxHeight: '62vh', objectFit: 'contain' }} />
            </div>
            <div style={{ display: 'flex', gap: 8, padding: 16, alignItems: 'center', flexWrap: 'wrap' }}>
              <code className="adm-mono" style={{ flex: 1, minWidth: 0, fontSize: 12.5, padding: '9px 12px', background: 'var(--adm-bg)', borderRadius: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{preview.url}</code>
              <button type="button" className="adm-btn adm-btn-primary" onClick={() => copy(preview.url)}>{copied === preview.url ? <Check size={15} /> : <Copy size={15} />} {copied === preview.url ? 'Copied' : 'Copy path'}</button>
              <a className="adm-btn adm-btn-ghost" href={preview.url} target="_blank" rel="noopener noreferrer"><ExternalLink size={15} /> Open</a>
              {preview.uploaded && preview.path && <button type="button" className="adm-btn adm-btn-ghost" style={{ color: 'var(--adm-bad)' }} onClick={() => setDeletePath(preview.path!)}><Trash2 size={15} /> Delete</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
