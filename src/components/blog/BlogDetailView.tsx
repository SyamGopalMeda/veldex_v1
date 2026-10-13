'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  MessageCircle,
  Share2,
  ArrowRight,
  ArrowUpRight,
  Play,
  ExternalLink,
  X,
  MapPin,
  ChevronDown,
} from 'lucide-react';
import { BlogArticle } from '@/lib/blogData';
import { buildQuoteWhatsAppLink, siteConfig } from '@/lib/config';
import { PageHero, SectionHead, Reveal } from '@/components/vx/kit';
import { BlogSidebar } from './BlogSidebar';

interface BlogDetailViewProps {
  article: BlogArticle;
  relatedArticles?: BlogArticle[];
}

/** Acronyms kept upper-case when section titles are shown in sentence case */
const ACRONYMS = new Set(['CNC', 'CAD', '3D', 'TIG', 'MIG', 'PUF', 'HSS', 'SS', 'MS', 'PU', 'UV', 'AP']);

/** Data stores section titles in caps; render them in readable sentence case. */
function sentenceCase(text: string) {
  if (text !== text.toUpperCase()) return text;
  let capNext = true;
  return text
    .split(' ')
    .map((word) => {
      const bare = word.replace(/[^A-Z0-9]/gi, '');
      let out: string;
      if (ACRONYMS.has(bare.toUpperCase())) out = word;
      else {
        const lower = word.toLowerCase();
        out = capNext ? lower.charAt(0).toUpperCase() + lower.slice(1) : lower;
      }
      capNext = /[:.?!]$/.test(word);
      return out;
    })
    .join(' ');
}

/** Split the headline into two lines around the configured accent phrase, keeping the title's own casing. */
function titleLines(title: string, accent?: string): string[] {
  if (!accent) return [title];
  const idx = title.toLowerCase().indexOf(accent.toLowerCase());
  if (idx <= 0) return [title];
  const before = title.slice(0, idx).trim();
  const after = title.slice(idx, idx + accent.length).trim();
  return before ? [before, after] : [title];
}

const sectionId = (n: string) => `section-${n}`;
const TAKEAWAYS_ID = 'key-takeaways';

export function BlogDetailView({ article, relatedArticles = [], allArticles }: BlogDetailViewProps & { allArticles?: BlogArticle[] }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('');
  const mobileTocRef = useRef<HTMLDetailsElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      router.push(`/blog?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleCategorySelect = (categorySlug: string) => {
    router.push(`/blog?category=${categorySlug}`);
  };

  const handleTagClick = (tag: string) => {
    router.push(`/blog?q=${encodeURIComponent(tag)}`);
  };

  // Social sharing helpers (canonical URL keeps server and client markup identical)
  const currentUrl = `${siteConfig.seo.baseUrl}/blog/${article.slug}`;
  const shareText = encodeURIComponent(article.title);
  const shareUrl = encodeURIComponent(currentUrl);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    whatsapp: `https://wa.me/?text=${shareText}%20${shareUrl}`,
  };

  const sections = article.sections ?? [];
  const tocItems = [
    ...sections.map((s) => ({ id: sectionId(s.number), num: s.number.padStart(2, '0'), label: sentenceCase(s.title) })),
    ...(article.conclusion ? [{ id: TAKEAWAYS_ID, num: '—', label: 'Key takeaways' }] : []),
  ];

  // Scroll-spy: IntersectionObserver marks the section crossing the upper reading band
  useEffect(() => {
    const els = tocItems
      .map((t) => document.getElementById(t.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;
    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        const first = els.find((el) => visible.has(el.id));
        if (first) setActiveId(first.id);
      },
      { rootMargin: '-22% 0px -62% 0px', threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article.slug]);

  // Video modal: Escape to close, focus the close button, lock page scroll
  useEffect(() => {
    if (!videoModalOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setVideoModalOpen(false); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    closeBtnRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [videoModalOpen]);

  const openSocial = () => {
    if (article.socialContent?.videoUrl) {
      setVideoModalOpen(true);
    } else {
      window.open(article.socialContent?.url, '_blank');
    }
  };

  const socialPlatformLabel = article.socialContent?.platform === 'youtube' ? 'View on YouTube' : 'View on Instagram';

  const tocList = (onNavigate?: () => void) => (
    <nav className="vx-toc vx-blog-toc" aria-label="Table of contents">
      {tocItems.map((t) => (
        <a
          key={t.id}
          href={`#${t.id}`}
          className={activeId === t.id ? 'is-active' : ''}
          aria-current={activeId === t.id ? 'location' : undefined}
          onClick={onNavigate}
        >
          <span>{t.num}</span>
          {t.label}
        </a>
      ))}
    </nav>
  );

  const shareRow = (
    <div className="vx-blog-share">
      <span className="vx-blog-share-label"><Share2 size={14} aria-hidden="true" />Share this article</span>
      <div className="vx-blog-share-links">
        <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </a>
        <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Share on X (Twitter)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
        <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.5A1.5 1.5 0 0 0 6.33 8a1.5 1.5 0 0 0 1.5 1.5A1.5 1.5 0 0 0 9.33 8 1.5 1.5 0 0 0 7.83 6.5z" />
          </svg>
        </a>
        <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp">
          <MessageCircle size={15} aria-hidden="true" />
        </a>
      </div>
    </div>
  );

  return (
    <div className="vx">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <PageHero
        compact
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }, { label: article.title }]}
        kicker={article.category}
        title={titleLines(article.title, article.titleAccent)}
        lead={article.excerpt}
        meta={
          <dl className="vx-blog-hero-meta">
            <div><dt>Published</dt><dd><time dateTime={article.datePublishedISO}>{article.date}</time></dd></div>
            <div><dt>Author</dt><dd>By {article.author}</dd></div>
            <div><dt>Reading time</dt><dd>{article.readTime}</dd></div>
          </dl>
        }
      />

      {/* ── ARTICLE ──────────────────────────────────────────────────────── */}
      <section className="vx-blog-article-sec">
        <div className="vx-wrap">
          <figure className="vx-blog-cover vx-media">
            <Image
              src={article.featuredImage}
              alt={article.featuredImageAlt || article.title}
              fill
              preload
              sizes="(max-width: 1380px) calc(100vw - 3rem), 1320px"
            />
          </figure>

          <div className={`vx-blog-read ${tocItems.length ? 'has-toc' : ''}`}>
            {tocItems.length > 0 && (
              <aside className="vx-blog-rail" aria-label="In this article">
                <div className="vx-aside-sticky vx-blog-rail-inner">
                  <span className="vx-kicker"><i />In this article</span>
                  <div className="vx-blog-progress" aria-hidden="true"><span /></div>
                  {tocList()}
                  {shareRow}
                </div>
              </aside>
            )}

            <article className="vx-blog-body">
              {tocItems.length > 0 && (
                <details className="vx-blog-toc-m" ref={mobileTocRef}>
                  <summary>
                    <span className="vx-kicker"><i />In this article</span>
                    <ChevronDown size={18} aria-hidden="true" />
                  </summary>
                  {tocList(() => { if (mobileTocRef.current) mobileTocRef.current.open = false; })}
                </details>
              )}

              <div className="vx-prose vx-blog-prose">
                {/* Intro Paragraph */}
                {article.intro && article.intro.split(/\n{2,}/).map((para, pi) => <p key={pi} className={pi === 0 ? 'vx-blog-lead' : undefined}>{para}</p>)}

                {/* Numbered Editorial Sections */}
                {sections.map((section) => (
                  <section key={section.number} id={sectionId(section.number)} className="vx-blog-section">
                    <h2>
                      <span className="vx-blog-section-num">{section.number.padStart(2, '0')}</span>
                      {sentenceCase(section.title)}
                    </h2>
                    {section.content.split(/\n{2,}/).map((para, pi) => <p key={pi}>{para}</p>)}

                    {/* Internal Contextual Link (if configured) */}
                    {section.internalLink && (
                      <Link href={section.internalLink.href} title={section.internalLink.linkTitle} className="vx-blog-inline-link">
                        <span className="vx-blog-inline-kicker">Related service</span>
                        <span className="vx-blog-inline-text">{section.internalLink.text}</span>
                        <ArrowUpRight size={18} aria-hidden="true" />
                      </Link>
                    )}

                    {/* Supporting image with descriptive alt */}
                    {section.image && (
                      <figure className="vx-blog-figure vx-media">
                        <Image
                          src={section.image}
                          alt={section.imageAlt || section.title}
                          fill
                          sizes="(max-width: 767px) calc(100vw - 2.5rem), 720px"
                        />
                      </figure>
                    )}
                  </section>
                ))}

                {/* Conclusion */}
                {article.conclusion && (
                  <aside id={TAKEAWAYS_ID} className="vx-blog-takeaways">
                    <h2>Key takeaways</h2>
                    {article.conclusion.split(/\n{2,}/).map((para, pi) => <p key={pi}>{para}</p>)}
                  </aside>
                )}
              </div>

              {/* ── Real project showcase card ────────────────────────────── */}
              {article.relatedProject && (
                <div className="vx-blog-project">
                  <div className="vx-blog-project-media vx-media">
                    <Image src={article.relatedProject.image} alt={article.relatedProject.title} fill sizes="(max-width: 639px) 100vw, 260px" />
                  </div>
                  <div className="vx-blog-project-body">
                    <span className="vx-kicker"><b>Case</b><i />Featured case study</span>
                    <h3 className="vx-h3">{article.relatedProject.title}</h3>
                    <p className="vx-blog-project-loc"><MapPin size={13} aria-hidden="true" />{article.relatedProject.location}</p>
                    <p className="vx-blog-project-desc">{article.relatedProject.description}</p>
                    <Link href={`/projects/${article.relatedProject.slug}`} className="vx-link">
                      View full case study <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              )}

              {/* ── Social content card ───────────────────────────────────── */}
              {article.socialContent && (
                <div className="vx-blog-social">
                  <button type="button" className="vx-blog-social-thumb vx-media" onClick={openSocial} aria-label={article.socialContent.videoUrl ? `Watch video: ${article.socialContent.title}` : `${socialPlatformLabel}: ${article.socialContent.title}`}>
                    <Image src={article.socialContent.thumbnail} alt="" fill sizes="(max-width: 639px) 100vw, 240px" />
                    <span className="vx-blog-play"><Play size={18} fill="currentColor" aria-hidden="true" /></span>
                  </button>
                  <div className="vx-blog-social-body">
                    <div className="vx-blog-social-top">
                      <span className="vx-tag">{article.socialContent.badge}</span>
                      <a href={article.socialContent.url} target="_blank" rel="noopener noreferrer" className="vx-blog-social-ext">
                        {socialPlatformLabel} <ExternalLink size={12} aria-hidden="true" />
                      </a>
                    </div>
                    <h3 className="vx-h3">{article.socialContent.title}</h3>
                    <p>{article.socialContent.caption}</p>
                    <button type="button" onClick={openSocial} className="vx-btn vx-btn-line vx-blog-social-btn">
                      {article.socialContent.videoUrl ? 'Watch video' : socialPlatformLabel}
                      <span className="vx-btn-ico"><Play size={14} fill="currentColor" aria-hidden="true" /></span>
                    </button>
                  </div>
                </div>
              )}

              {/* ── Custom fabrication CTA ────────────────────────────────── */}
              <div className="vx-box vx-box-dark vx-blog-cta">
                <span className="vx-box-icon"><ShieldCheck size={20} strokeWidth={1.6} /></span>
                <div className="vx-blog-cta-copy">
                  <h3 className="vx-h3">Need custom fabrication for your property?</h3>
                  <p>Our engineering team can design, fabricate, and install your exact vision.</p>
                </div>
                <div className="vx-blog-cta-actions">
                  <a
                    href={buildQuoteWhatsAppLink(`Fabrication Inquiry via Blog: ${article.title}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="vx-btn vx-btn-signal"
                  >
                    Get WhatsApp quote
                    <span className="vx-btn-ico"><MessageCircle size={17} /></span>
                  </a>
                  <Link href="/contact" className="vx-link vx-blog-cta-link">
                    Contact us <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </div>
              </div>

              {/* ── Tags + share (end of article) ─────────────────────────── */}
              <div className="vx-blog-endmatter">
                {article.tags.length > 0 && (
                  <ul className="vx-blog-endtags" aria-label="Article tags">
                    {article.tags.map((tag) => (
                      <li key={tag}>
                        <button type="button" className="vx-tag vx-blog-tag" onClick={() => handleTagClick(tag)}>{tag}</button>
                      </li>
                    ))}
                  </ul>
                )}
                {shareRow}
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ── RELATED ARTICLES ─────────────────────────────────────────────── */}
      {relatedArticles && relatedArticles.length > 0 && (
        <section className="vx-sec vx-sec-white vx-blog-related">
          <div className="vx-wrap">
            <SectionHead
              kicker="Continue reading"
              title={['Related articles']}
              aside={
                <Link href="/blog" className="vx-link">
                  View all articles <ArrowRight size={16} aria-hidden="true" />
                </Link>
              }
            />
            <div className="vx-gallery">
              {relatedArticles.map((rel, i) => (
                <article key={rel.id} className="vx-card vx-blog-card" style={{ ['--i' as string]: i } as CSSProperties}>
                  <div className="vx-card-media">
                    <Image src={rel.featuredImage} alt={rel.featuredImageAlt || rel.title} fill sizes="(max-width: 679px) 100vw, (max-width: 1099px) 50vw, 420px" />
                  </div>
                  <div className="vx-card-meta">
                    <span>{rel.category}</span>
                    <time dateTime={rel.datePublishedISO}>{rel.date}</time>
                  </div>
                  <h3>
                    <Link href={`/blog/${rel.slug}`} className="vx-blog-card-link">{rel.title}</Link>
                  </h3>
                  <p className="vx-blog-card-excerpt">{rel.excerpt}</p>
                  <div className="vx-blog-card-foot">
                    <span>{rel.author}</span>
                    <span className="vx-blog-card-more">Read article <ArrowRight size={14} aria-hidden="true" /></span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── EXPLORE THE BLOG (sidebar widgets as a band) ─────────────────── */}
      <section className="vx-sec vx-sec-tight vx-blog-explore">
        <div className="vx-wrap">
          <Reveal>
            <span className="vx-kicker"><b>Blog</b><i />Explore more</span>
          </Reveal>
          <BlogSidebar
            variant="band"
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
            selectedCategory=""
            onCategoryChange={handleCategorySelect}
            excludeSlug={article.slug}
            articles={allArticles}
            showTags={false}
            tags={article.tags}
            onTagClick={handleTagClick}
            showNewsletter={true}
          />
        </div>
      </section>

      {/* ── VIDEO MODAL (If social video clicked) ────────────────────────── */}
      {videoModalOpen && article.socialContent?.videoUrl && (
        <div
          className="vx-blog-modal"
          role="dialog"
          aria-modal="true"
          aria-label={article.socialContent.title}
          onClick={() => setVideoModalOpen(false)}
        >
          <button ref={closeBtnRef} type="button" onClick={() => setVideoModalOpen(false)} className="vx-blog-modal-close" aria-label="Close video">
            <X size={22} />
          </button>
          <div className="vx-blog-modal-frame" onClick={(e) => e.stopPropagation()}>
            <video src={article.socialContent.videoUrl} controls autoPlay playsInline />
          </div>
        </div>
      )}
    </div>
  );
}
