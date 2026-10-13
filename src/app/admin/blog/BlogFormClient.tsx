'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, ExternalLink, Eye, PenLine } from 'lucide-react';
import type { ManagedArticle } from '@/lib/content';
import { Toast, ToastNotification } from '@/components/admin/ui/Toast';
import { Card } from '@/components/admin/ui/adm';
import { ImageField, MediaPicker } from '@/components/admin/ui/MediaPicker';

const CATEGORIES = [
  { slug: 'gates-automation', name: 'Gates & Automation' },
  { slug: 'staircases', name: 'Staircases' },
  { slug: 'railings-balustrades', name: 'Railings & Balustrades' },
  { slug: 'pergolas-outdoor', name: 'Pergolas & Outdoor' },
  { slug: 'sheds-roofing', name: 'Terrace Sheds & Roofing' },
  { slug: 'metal-fabrication', name: 'Metal Fabrication' },
];

const TEMPLATE = `Write a short introduction here.

## First heading
The first section. Leave a blank line between paragraphs.

## Second heading
![Describe the image](/images/gate.jpg)
A section can include one image line like the one above.

## Conclusion
Wrap up with the key takeaways and a call to action.`;

/** Same rules the server uses to build the article (kept in sync with content.ts). */
function preview(body: string) {
  const blocks = body.replace(/\r/g, '').split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return blocks.map((b, i) => {
    const h = b.match(/^#{2,3}\s+(.+)$/);
    if (h) return <h3 key={i} style={{ fontSize: 17, fontWeight: 700, margin: '18px 0 6px' }}>{h[1]}</h3>;
    const img = b.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/);
    // eslint-disable-next-line @next/next/no-img-element
    if (img) return <img key={i} src={img[2]} alt={img[1]} style={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 10, margin: '6px 0' }} />;
    return <p key={i} style={{ margin: '0 0 10px', lineHeight: 1.65, fontSize: 14.5 }}>{b}</p>;
  });
}

export function BlogFormClient({ initialData, isEdit = false }: { initialData?: ManagedArticle; isEdit?: boolean }) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [categorySlug, setCategorySlug] = useState(initialData?.categorySlug ?? 'gates-automation');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? '');
  const [body, setBody] = useState(initialData?.body ?? TEMPLATE);
  const [featuredImage, setFeaturedImage] = useState(initialData?.featuredImage ?? '');
  const [featuredImageAlt, setFeaturedImageAlt] = useState(initialData?.featuredImageAlt ?? '');
  const [tags, setTags] = useState((initialData?.tags ?? []).join(', '));
  const [author, setAuthor] = useState(initialData?.author ?? 'Veldex Team');
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle ?? '');
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription ?? '');
  const [isPublished, setIsPublished] = useState(initialData ? initialData.status === 'published' : true);
  const [tab, setTab] = useState<'write' | 'preview'>('write');
  const [imgPicker, setImgPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<ToastNotification | null>(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => { setDirty(true); }, [title, categorySlug, excerpt, body, featuredImage, featuredImageAlt, tags, author, metaTitle, metaDescription]);
  useEffect(() => { setDirty(false); }, []);
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const words = useMemo(() => body.split(/\s+/).filter(Boolean).length, [body]);

  const save = async (publish: boolean) => {
    setError('');
    if (!title.trim()) return setError('Add a title.');
    if (!featuredImage) return setError('Choose a featured image.');
    setSaving(true);
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: initialData?.slug, title, categorySlug, excerpt, body, featuredImage, featuredImageAlt, tags, author, metaTitle, metaDescription, isPublished: publish }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok || !d.success) throw new Error(d.error || 'Could not save the article.');
      setIsPublished(publish); setDirty(false);
      setToast({ message: publish ? 'Saved and live on the blog.' : 'Saved as a draft (hidden from the blog).', type: 'success' });
      if (!isEdit) setTimeout(() => router.push(`/admin/blog/${d.article.slug}/edit`), 700);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'minmax(0,1fr)' }}>
      <Toast notification={toast} onClose={() => setToast(null)} />
      <MediaPicker open={imgPicker} folder="blog" title="Insert an image" onClose={() => setImgPicker(false)} onSelect={(u) => setBody((b) => `${b.trimEnd()}\n\n![Describe the image](${u[0]})\n`)} />

      <div className="adm-page-head" style={{ marginBottom: 0 }}>
        <div>
          <Link href="/admin/blog" className="adm-link" style={{ marginBottom: 8 }}><ArrowLeft size={14} /> All articles</Link>
          <h1>{isEdit ? title || 'Edit article' : 'New article'}</h1>
          <p>{isEdit ? <>Public page: <span className="adm-mono">/blog/{initialData?.slug}</span></> : 'Write, add a featured image, then publish.'}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {isEdit && isPublished && <a className="adm-btn adm-btn-ghost" href={`/blog/${initialData?.slug}`} target="_blank" rel="noopener noreferrer"><ExternalLink size={15} /> View live</a>}
          <button type="button" className="adm-btn adm-btn-ghost" onClick={() => save(false)} disabled={saving}>Save as draft</button>
          <button type="button" className="adm-btn adm-btn-signal" onClick={() => save(true)} disabled={saving}><Save size={15} /> {saving ? 'Saving…' : 'Publish'}</button>
        </div>
      </div>

      {error && <div role="alert" className="adm-card" style={{ padding: '12px 16px', background: 'var(--adm-bad-tint)', color: 'var(--adm-bad)', borderColor: '#F3C1BB', fontSize: 14 }}>{error}</div>}

      <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))', alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: 20 }}>
          <Card title="Article">
            <div style={{ display: 'grid', gap: 16 }}>
              <label className="adm-field"><span>Title *</span><input className="adm-input" maxLength={140} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. How to choose a main gate for your home" /></label>
              <label className="adm-field"><span>Excerpt</span><textarea className="adm-textarea" rows={2} maxLength={300} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="One or two sentences shown on blog cards." /></label>
              <div className="adm-field">
                <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  Body * <span className="adm-help">{words} words</span>
                </span>
                <div className="adm-seg" role="tablist" style={{ alignSelf: 'start' }}>
                  <button type="button" aria-pressed={tab === 'write'} onClick={() => setTab('write')}><PenLine size={13} /> Write</button>
                  <button type="button" aria-pressed={tab === 'preview'} onClick={() => setTab('preview')}><Eye size={13} /> Preview</button>
                  <button type="button" onClick={() => setImgPicker(true)}>+ Image</button>
                </div>
                {tab === 'write'
                  ? <textarea className="adm-textarea adm-mono" rows={18} value={body} onChange={(e) => setBody(e.target.value)} style={{ fontSize: 13.5 }} aria-label="Article body" />
                  : <div style={{ border: '1px solid var(--adm-line)', borderRadius: 12, padding: 16, maxHeight: 520, overflowY: 'auto', background: '#fff' }}>{preview(body)}</div>}
                <span className="adm-help">Start a section with <b>## Heading</b>. Separate paragraphs with a blank line. A final <b>## Conclusion</b> becomes the key takeaways.</span>
              </div>
            </div>
          </Card>
        </div>

        <div style={{ display: 'grid', gap: 20 }}>
          <Card title="Visibility & details">
            <div style={{ display: 'grid', gap: 14 }}>
              <label style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 14 }}>
                <button type="button" role="switch" aria-checked={isPublished} className="adm-switch" onClick={() => setIsPublished((v) => !v)} aria-label="Published" />
                <span><b>{isPublished ? 'Published' : 'Draft'}</b><br /><span className="adm-help">Use the Publish or Save as draft buttons to apply.</span></span>
              </label>
              <label className="adm-field"><span>Category *</span>
                <select className="adm-select" value={categorySlug} onChange={(e) => setCategorySlug(e.target.value)}>{CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select>
              </label>
              <label className="adm-field"><span>Tags (comma separated)</span><input className="adm-input" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Gate design, MS gate, Automation" /></label>
              <label className="adm-field"><span>Author</span><input className="adm-input" maxLength={80} value={author} onChange={(e) => setAuthor(e.target.value)} /></label>
            </div>
          </Card>
          <Card title="Featured image">
            <div style={{ display: 'grid', gap: 14 }}>
              <ImageField label="Image" required folder="blog" value={featuredImage} onChange={setFeaturedImage} help="Landscape, 1200px+ wide. Also used when the article is shared." />
              <label className="adm-field"><span>Image description</span><input className="adm-input" maxLength={160} value={featuredImageAlt} onChange={(e) => setFeaturedImageAlt(e.target.value)} placeholder="Describe what the photo shows" /></label>
            </div>
          </Card>
          <Card title="Search engine listing" subtitle="Optional — defaults to the title and excerpt">
            <div style={{ display: 'grid', gap: 14 }}>
              <label className="adm-field"><span>SEO title</span><input className="adm-input" maxLength={70} value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder={title} /><span className="adm-help">{metaTitle.length}/60 recommended</span></label>
              <label className="adm-field"><span>Meta description</span><textarea className="adm-textarea" rows={3} maxLength={170} value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} placeholder={excerpt} /><span className="adm-help">{metaDescription.length}/160 recommended</span></label>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
