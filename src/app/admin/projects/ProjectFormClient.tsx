'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, Trash2, ArrowUp, ArrowDown, ExternalLink, ImagePlus, Star } from 'lucide-react';
import type { ManagedProject } from '@/lib/content';
import { Toast, ToastNotification } from '@/components/admin/ui/Toast';
import { Card } from '@/components/admin/ui/adm';
import { MediaPicker, ImageField } from '@/components/admin/ui/MediaPicker';

const CATEGORIES = [
  { value: 'gates', label: 'Gates & Automation' },
  { value: 'staircases', label: 'Staircases' },
  { value: 'railings', label: 'Railings & Balustrades' },
  { value: 'pergolas', label: 'Pergolas & Gazebos' },
  { value: 'roofing', label: 'Sheds & Roofing' },
  { value: 'elevations', label: 'Elevations & Facades' },
  { value: 'other', label: 'Interiors & Custom Work' },
];

interface ProjectFormClientProps {
  initialData?: ManagedProject;
  isEdit?: boolean;
}

export function ProjectFormClient({ initialData, isEdit = false }: ProjectFormClientProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [categoryValue, setCategoryValue] = useState<string>(initialData?.categoryValue ?? 'gates');
  const [projectType, setProjectType] = useState<string>(initialData?.projectType ?? 'Residential');
  const [location, setLocation] = useState(initialData?.location ?? 'Vijayawada, Andhra Pradesh');
  const [completionDate, setCompletionDate] = useState(initialData?.completionDate ?? '');
  const [shortDescription, setShortDescription] = useState(initialData?.shortDescription ?? '');
  const [about, setAbout] = useState(initialData?.aboutProject ?? initialData?.projectDescription ?? '');
  const [highlights, setHighlights] = useState((initialData?.highlights ?? []).join('\n'));
  const [specs, setSpecs] = useState<{ label: string; value: string }[]>(initialData?.specs?.length ? initialData.specs : [{ label: 'Material', value: '' }, { label: 'Finish', value: '' }]);
  const [mainImage, setMainImage] = useState(initialData?.mainImage ?? '');
  const [gallery, setGallery] = useState<{ src: string; alt: string }[]>(initialData?.galleryImages ?? []);
  const [galleryPicker, setGalleryPicker] = useState(false);
  const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl ?? '');
  const [videoThumbnail, setVideoThumbnail] = useState(initialData?.videoThumbnail ?? '');
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false);
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? true);
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle ?? '');
  const [seoDescription, setSeoDescription] = useState(initialData?.seoDescription ?? '');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string>('');
  const [toast, setToast] = useState<ToastNotification | null>(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => { setDirty(true); }, [title, categoryValue, projectType, location, completionDate, shortDescription, about, highlights, specs, mainImage, gallery, videoUrl, videoThumbnail, isFeatured, isPublished, seoTitle, seoDescription]);
  useEffect(() => { setDirty(false); }, []);
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const moveImg = (i: number, d: -1 | 1) => setGallery((g) => { const n = [...g]; const j = i + d; if (j < 0 || j >= n.length) return g; [n[i], n[j]] = [n[j], n[i]]; return n; });

  const save = async (publish: boolean) => {
    setErrors('');
    if (!title.trim()) return setErrors('Add a project title.');
    if (!mainImage) return setErrors('Choose a main image.');
    if (!location.trim()) return setErrors('Add the project location.');
    setSaving(true);
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: initialData?.slug, title, categoryValue, projectType, location, completionDate, shortDescription,
          aboutProject: about, projectDescription: about, highlights: highlights.split('\n'), specs,
          mainImage, galleryImages: gallery, videoUrl, videoThumbnail, isFeatured, isPublished: publish, seoTitle, seoDescription,
        }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok || !d.success) throw new Error(d.error || 'Could not save the project.');
      setIsPublished(publish);
      setDirty(false);
      setToast({ message: publish ? 'Saved and live on the website.' : 'Saved as a draft (hidden from the website).', type: 'success' });
      if (!isEdit) setTimeout(() => router.push(`/admin/projects/${d.project.slug}/edit`), 700);
    } catch (e) {
      setErrors((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const seoT = seoTitle || `${title} | Veldex Fabrications`;
  const seoD = seoDescription || shortDescription;

  return (
    <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'minmax(0,1fr)' }}>
      <Toast notification={toast} onClose={() => setToast(null)} />
      <MediaPicker open={galleryPicker} multiple folder="projects" title="Add gallery photos" onClose={() => setGalleryPicker(false)}
        onSelect={(urls) => setGallery((g) => [...g, ...urls.filter((u) => !g.some((x) => x.src === u)).map((src) => ({ src, alt: title }))])} />

      <div className="adm-page-head" style={{ marginBottom: 0 }}>
        <div>
          <Link href="/admin/projects" className="adm-link" style={{ marginBottom: 8 }}><ArrowLeft size={14} /> All projects</Link>
          <h1>{isEdit ? title || 'Edit project' : 'New project'}</h1>
          <p>{isEdit ? <>Public page: <span className="adm-mono">/projects/{initialData?.slug}</span></> : 'Fill in the details, add photos, then publish.'}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {isEdit && isPublished && <a className="adm-btn adm-btn-ghost" href={`/projects/${initialData?.slug}`} target="_blank" rel="noopener noreferrer"><ExternalLink size={15} /> View live</a>}
          <button type="button" className="adm-btn adm-btn-ghost" onClick={() => save(false)} disabled={saving}>Save as draft</button>
          <button type="button" className="adm-btn adm-btn-signal" onClick={() => save(true)} disabled={saving}><Save size={15} /> {saving ? 'Saving…' : 'Publish'}</button>
        </div>
      </div>

      {errors && <div role="alert" className="adm-card" style={{ padding: '12px 16px', background: 'var(--adm-bad-tint)', color: 'var(--adm-bad)', borderColor: '#F3C1BB', fontSize: 14 }}>{errors}</div>}

      <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))', alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: 20 }}>
          <Card title="Project details">
            <div style={{ display: 'grid', gap: 16 }}>
              <label className="adm-field"><span>Title *</span><input className="adm-input" value={title} maxLength={120} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Laser-cut main gate for a villa" /></label>
              <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))' }}>
                <label className="adm-field"><span>Category *</span>
                  <select className="adm-select" value={categoryValue} onChange={(e) => setCategoryValue(e.target.value)}>{CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}</select>
                </label>
                <label className="adm-field"><span>Project type</span>
                  <select className="adm-select" value={projectType} onChange={(e) => setProjectType(e.target.value)}>{['Residential', 'Commercial', 'Industrial'].map((t) => <option key={t}>{t}</option>)}</select>
                </label>
              </div>
              <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))' }}>
                <label className="adm-field"><span>Location *</span><input className="adm-input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Vijayawada, Andhra Pradesh" /></label>
                <label className="adm-field"><span>Completed</span><input className="adm-input" value={completionDate} onChange={(e) => setCompletionDate(e.target.value)} placeholder="e.g. March 2026" /></label>
              </div>
              <label className="adm-field"><span>Short description</span><textarea className="adm-textarea" rows={2} maxLength={300} value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} placeholder="One or two sentences shown on project cards." /><span className="adm-help">{shortDescription.length}/300</span></label>
              <label className="adm-field"><span>About the project</span><textarea className="adm-textarea" rows={6} value={about} onChange={(e) => setAbout(e.target.value)} placeholder="The brief, the design, materials, finish and installation." /></label>
              <label className="adm-field"><span>Highlights (one per line)</span><textarea className="adm-textarea" rows={4} value={highlights} onChange={(e) => setHighlights(e.target.value)} placeholder={'CNC laser-cut infill panels\nRemote-controlled sliding motor'} /></label>
            </div>
          </Card>

          <Card title="Specifications" subtitle="Shown as a table on the project page" action={<button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setSpecs((s) => [...s, { label: '', value: '' }])} disabled={specs.length >= 20}><Plus size={14} /> Add row</button>}>
            <div style={{ display: 'grid', gap: 8 }}>
              {specs.map((s, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.6fr) auto', gap: 8 }}>
                  <input className="adm-input" placeholder="Label" value={s.label} onChange={(e) => setSpecs((x) => x.map((r, j) => (j === i ? { ...r, label: e.target.value } : r)))} aria-label={`Spec ${i + 1} label`} />
                  <input className="adm-input" placeholder="Value" value={s.value} onChange={(e) => setSpecs((x) => x.map((r, j) => (j === i ? { ...r, value: e.target.value } : r)))} aria-label={`Spec ${i + 1} value`} />
                  <button type="button" className="adm-btn adm-btn-ghost adm-btn-icon" style={{ height: 42, width: 42 }} onClick={() => setSpecs((x) => x.filter((_, j) => j !== i))} aria-label="Remove row"><Trash2 size={14} /></button>
                </div>
              ))}
              {!specs.length && <span className="adm-help">No specifications — the table is hidden.</span>}
            </div>
          </Card>
        </div>

        <div style={{ display: 'grid', gap: 20 }}>
          <Card title="Visibility">
            <div style={{ display: 'grid', gap: 14 }}>
              <label style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 14 }}>
                <button type="button" role="switch" aria-checked={isPublished} className="adm-switch" onClick={() => setIsPublished((v) => !v)} aria-label="Published" />
                <span><b>{isPublished ? 'Published' : 'Draft'}</b><br /><span className="adm-help">{isPublished ? 'Visible on the website after you save.' : 'Hidden from the website.'}</span></span>
              </label>
              <label style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 14 }}>
                <button type="button" role="switch" aria-checked={isFeatured} className="adm-switch" onClick={() => setIsFeatured((v) => !v)} aria-label="Featured" />
                <span><b><Star size={13} style={{ verticalAlign: '-2px' }} /> Featured</b><br /><span className="adm-help">Shown first in the home page gallery.</span></span>
              </label>
            </div>
          </Card>

          <Card title="Photos">
            <div style={{ display: 'grid', gap: 16 }}>
              <ImageField label="Main image" required folder="projects" value={mainImage} onChange={setMainImage} help="Used on project cards, the project page header and when shared." />
              <div className="adm-field">
                <span>Gallery ({gallery.length})</span>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
                  {gallery.map((g, i) => (
                    <li key={g.src + i} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: 8, border: '1px solid var(--adm-line)', borderRadius: 10 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={g.src} alt="" style={{ width: 64, height: 46, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
                      <input className="adm-input" style={{ minHeight: 36, padding: '6px 10px', fontSize: 13 }} value={g.alt} onChange={(e) => setGallery((x) => x.map((r, j) => (j === i ? { ...r, alt: e.target.value } : r)))} placeholder="Describe the photo" aria-label={`Photo ${i + 1} description`} />
                      <button type="button" className="adm-btn adm-btn-ghost adm-btn-icon" onClick={() => moveImg(i, -1)} disabled={i === 0} aria-label="Move up"><ArrowUp size={13} /></button>
                      <button type="button" className="adm-btn adm-btn-ghost adm-btn-icon" onClick={() => moveImg(i, 1)} disabled={i === gallery.length - 1} aria-label="Move down"><ArrowDown size={13} /></button>
                      <button type="button" className="adm-btn adm-btn-ghost adm-btn-icon" onClick={() => setGallery((x) => x.filter((_, j) => j !== i))} aria-label="Remove photo"><Trash2 size={13} /></button>
                    </li>
                  ))}
                </ul>
                <button type="button" className="adm-btn adm-btn-ghost" onClick={() => setGalleryPicker(true)}><ImagePlus size={15} /> Add photos</button>
                <span className="adm-help">The first photo opens the gallery. Upload new photos or pick from the library.</span>
              </div>
            </div>
          </Card>

          <Card title="Video (optional)">
            <div style={{ display: 'grid', gap: 14 }}>
              <label className="adm-field"><span>Instagram reel or YouTube link</span><input className="adm-input" type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://www.instagram.com/reel/…" /></label>
              {videoUrl && <ImageField label="Video thumbnail" folder="projects" value={videoThumbnail} onChange={setVideoThumbnail} />}
            </div>
          </Card>

          <Card title="Search engine listing" subtitle="Optional — defaults are generated from the title and description">
            <div style={{ display: 'grid', gap: 14 }}>
              <label className="adm-field"><span>SEO title</span><input className="adm-input" maxLength={70} value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder={`${title || 'Project'} in Vijayawada | Veldex`} /><span className="adm-help">{seoTitle.length}/60 recommended</span></label>
              <label className="adm-field"><span>Meta description</span><textarea className="adm-textarea" rows={3} maxLength={170} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} /><span className="adm-help">{seoDescription.length}/160 recommended</span></label>
              <div style={{ padding: 14, border: '1px solid var(--adm-line)', borderRadius: 12, background: '#fff' }} aria-label="Google preview">
                <div style={{ fontSize: 12, color: '#202124' }}>veldex fabrications › projects</div>
                <div style={{ fontSize: 17, color: '#1a0dab', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{seoT}</div>
                <div style={{ fontSize: 13, color: '#4d5156', marginTop: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{seoD || 'Add a short description to control how this page appears in Google.'}</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
