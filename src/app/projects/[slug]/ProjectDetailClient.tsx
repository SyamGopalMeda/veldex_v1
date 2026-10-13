'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  Calendar,
  Building,
  Layers,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  MessageCircle,
  Mail,
  ArrowRight,
  ArrowUpRight,
} from 'lucide-react';
import { ProjectData } from '@/lib/projectsData';
import { SectionHead, CtaBand, Reveal } from '@/components/vx/kit';

interface Props {
  project: ProjectData;
  relatedProjects: ProjectData[];
}

const pad = (n: number) => String(n).padStart(2, '0');
const WORD_STEP = 70;

export function ProjectDetailClient({ project, relatedProjects }: Props) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const images = project.galleryImages && project.galleryImages.length > 0
    ? project.galleryImages
    : [{ src: project.mainImage, alt: project.title }];
  const count = images.length;

  // Read the URL after mount so server and client markup match.
  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const shareText = encodeURIComponent(`Check out this project by Veldex Fabrications: ${project.title}`);
  const shareUrl = encodeURIComponent(currentUrl);

  const handlePrevImage = () => {
    setActiveImageIdx((prev) => (prev === 0 ? count - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIdx((prev) => (prev === count - 1 ? 0 : prev + 1));
  };

  const lightboxPrev = useCallback(() => setLightboxIdx((prev) => (prev === 0 ? count - 1 : prev - 1)), [count]);
  const lightboxNext = useCallback(() => setLightboxIdx((prev) => (prev === count - 1 ? 0 : prev + 1)), [count]);

  const openLightbox = (index = activeImageIdx) => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    setLightboxIdx(Math.min(Math.max(index, 0), count - 1));
    setLightboxOpen(true);
  };

  const openVideo = () => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    setVideoModalOpen(true);
  };

  // Overlays: lock page scroll, focus the close button, Esc / arrow keys, restore focus on close.
  const overlayOpen = lightboxOpen || (videoModalOpen && Boolean(project.videoUrl));
  useEffect(() => {
    if (!overlayOpen) return;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = 'hidden';
    closeBtnRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxOpen(false);
        setVideoModalOpen(false);
      } else if (lightboxOpen && e.key === 'ArrowLeft') {
        lightboxPrev();
      } else if (lightboxOpen && e.key === 'ArrowRight') {
        lightboxNext();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      html.style.overflow = prevOverflow;
      returnFocusRef.current?.focus?.();
    };
  }, [overlayOpen, lightboxOpen, lightboxPrev, lightboxNext]);

  // Hero title: words rise in sequence (same motion as <PageHero>).
  let w = 0;
  const titleWords = project.title.split(' ').map((word) => ({ word, i: w++ }));
  const after = 300 + w * WORD_STEP + 200;
  const cityShort = project.city.split(',')[0];

  const facts = [
    { icon: MapPin, label: 'Location', value: project.location },
    { icon: Calendar, label: 'Completed', value: project.completionDate },
    { icon: Building, label: 'Type', value: project.projectType },
    { icon: Layers, label: 'Category', value: project.category },
  ];

  const sideIdx = Math.min(1, count - 1);

  return (
    <div className="vx">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="vx-ph vx-pd-hero" style={{ ['--after' as string]: `${after}ms` } as CSSProperties}>
        <div className="vx-ph-grid-lines" aria-hidden="true" />
        <div className="vx-wrap vx-pd-head">
          <div className="vx-ph-copy">
            <nav aria-label="Breadcrumb" className="vx-ph-crumbs">
              <ol>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/projects">Projects</Link></li>
                <li><span aria-current="page">{project.title} - {cityShort}</span></li>
              </ol>
            </nav>
            <span className="vx-ph-kicker"><i />{project.category} · {project.year}</span>
            <h1 className="vx-ph-title vx-pd-title">
              <span className="vx-ph-line">
                {titleWords.map(({ word, i }) => (
                  <span key={i} className="vx-ph-mask">
                    <span className="vx-ph-word" style={{ animationDelay: `${300 + i * WORD_STEP}ms` }}>{word}</span>
                  </span>
                ))}
              </span>
            </h1>
            {project.shortDescription && <p className="vx-ph-lead vx-ph-late">{project.shortDescription}</p>}
            <div className="vx-ph-actions vx-ph-late" style={{ animationDelay: 'calc(var(--after) + 120ms)' }}>
              <Link href="/quote" className="vx-btn vx-btn-signal">
                Get a quote
                <span className="vx-btn-ico"><ArrowUpRight size={18} /></span>
              </Link>
              {project.videoUrl ? (
                <button type="button" className="vx-link vx-pd-hero-link" onClick={openVideo}>
                  <Play size={15} /> Watch project video
                </button>
              ) : (
                <button type="button" className="vx-link vx-pd-hero-link" onClick={() => openLightbox(0)}>
                  <Maximize2 size={15} /> View all images
                </button>
              )}
            </div>
          </div>

          <dl className="vx-pd-facts vx-ph-late" style={{ animationDelay: 'calc(var(--after) + 200ms)' }}>
            {facts.map(({ icon: Icon, label, value }) => (
              <div key={label}>
                <dt><Icon size={14} strokeWidth={1.6} />{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── GALLERY STAGE (straddles the dark band) ──────────────────────── */}
      <section className="vx-pd-stage-band" aria-label="Project images">
        <div className="vx-wrap">
          <div className="vx-pd-stage">
            <button
              type="button"
              className="vx-pd-stage-open"
              onClick={() => openLightbox(activeImageIdx)}
              aria-label={`Open image ${activeImageIdx + 1} of ${count} fullscreen`}
            >
              <Image
                key={images[activeImageIdx].src + activeImageIdx}
                src={images[activeImageIdx].src}
                alt={images[activeImageIdx].alt}
                fill
                preload={activeImageIdx === 0}
                className="vx-pd-stage-img"
                sizes="(max-width: 1360px) 100vw, 1320px"
              />
            </button>
            <span className="vx-pd-stage-count" aria-hidden="true">
              <b>{pad(activeImageIdx + 1)}</b> / {pad(count)}
            </span>
            <span className="vx-pd-stage-caption">{images[activeImageIdx].alt}</span>
            <button
              type="button"
              className="vx-pd-ibtn vx-pd-stage-expand"
              onClick={() => openLightbox(activeImageIdx)}
              aria-label="Expand image"
            >
              <Maximize2 size={16} />
            </button>
            <span className="vx-ph-corner tl" aria-hidden="true" />
            <span className="vx-ph-corner br" aria-hidden="true" />
          </div>

          <div className="vx-pd-thumbs-row">
            <button type="button" className="vx-pd-nav" onClick={handlePrevImage} aria-label="Previous image">
              <ChevronLeft size={18} />
            </button>
            <div className="vx-pd-thumbs">
              {images.map((img, idx) => {
                const isActive = idx === activeImageIdx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    className={`vx-pd-thumb ${isActive ? 'is-on' : ''}`}
                    aria-label={`Show image ${idx + 1}: ${img.alt}`}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    <Image src={img.src} alt="" fill sizes="96px" />
                  </button>
                );
              })}
            </div>
            <button type="button" className="vx-pd-nav" onClick={handleNextImage} aria-label="Next image">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ── 01 OVERVIEW: story + sticky aside ────────────────────────────── */}
      <section className="vx-sec vx-pd-overview">
        <div className="vx-wrap vx-pd-overview-grid">
          <div>
            <SectionHead num="01" kicker="Overview" title={['About the', 'project']} className="vx-pd-head-single" />
            <Reveal className="vx-pd-story">
              <p className="vx-pd-story-lead">{project.aboutProject}</p>
              <div className="vx-pd-story-block">
                <h3 className="vx-pd-label">Project description</h3>
                <p>{project.projectDescription}</p>
              </div>
            </Reveal>
          </div>

          <aside className="vx-pd-aside">
            <div className="vx-aside-sticky vx-pd-aside-stack">
              <Reveal delay={120} className="vx-box vx-box-dark vx-pd-highlights">
                <span className="vx-kicker"><b>{pad(project.highlights.length)}</b><i />Project highlights</span>
                <ul className="vx-pd-highlight-list">
                  {project.highlights.map((highlight, idx) => (
                    <li key={idx}>
                      <span className="vx-box-num">{pad(idx + 1)}</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>

              {project.videoUrl && (
                <Reveal delay={180} className="vx-box vx-pd-video-box">
                  <span className="vx-kicker">Project video</span>
                  <button type="button" className="vx-pd-video" onClick={openVideo} aria-label={`Play ${project.title} video`}>
                    <Image
                      src={project.videoThumbnail || project.mainImage}
                      alt={`${project.title} video thumbnail`}
                      fill
                      sizes="(max-width: 1023px) 100vw, 380px"
                    />
                    <span className="vx-pd-play"><Play size={20} fill="currentColor" /></span>
                  </button>
                </Reveal>
              )}

              <Reveal delay={240} className="vx-box vx-pd-share">
                <span className="vx-kicker">Share project</span>
                <div className="vx-pd-share-row">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="vx-pd-share-btn"
                    aria-label="Share on Facebook"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a
                    href={`https://www.instagram.com/veldexfabrications`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="vx-pd-share-btn"
                    aria-label="Instagram Profile"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </a>
                  <a
                    href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="vx-pd-share-btn"
                    aria-label="Share on WhatsApp"
                  >
                    <MessageCircle size={15} />
                  </a>
                  <a
                    href={`mailto:?subject=${encodeURIComponent(project.title)}&body=${shareText}%0A%0A${shareUrl}`}
                    className="vx-pd-share-btn"
                    aria-label="Share via Email"
                  >
                    <Mail size={15} />
                  </a>
                </div>
              </Reveal>
            </div>
          </aside>
        </div>
      </section>

      {/* ── 02 SPECIFICATIONS ────────────────────────────────────────────── */}
      <section className="vx-sec vx-sec-white vx-pd-specs">
        <div className="vx-wrap">
          <SectionHead
            num="02"
            kicker="Specifications"
            title={['Project', 'specifications']}
            aside={`${project.projectType} project · ${project.location}`}
          />
          <div className="vx-pd-specs-grid">
            <Reveal>
              <table className="vx-spec">
                <tbody>
                  {project.specs.map((spec, idx) => (
                    <tr key={idx}>
                      <th scope="row">{spec.label}</th>
                      <td>{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Reveal>
            <Reveal delay={150}>
              <button
                type="button"
                className="vx-media is-hover vx-pd-side"
                onClick={() => openLightbox(sideIdx)}
                aria-label="Open detailed angle view fullscreen"
              >
                <Image
                  src={project.sideImage || project.mainImage}
                  alt={`${project.title} detailed angle view`}
                  fill
                  sizes="(max-width: 1023px) 100vw, 540px"
                />
                <span className="vx-media-tag">Detail view</span>
              </button>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 03 GALLERY MOSAIC ────────────────────────────────────────────── */}
      <section className="vx-sec vx-pd-gallery">
        <div className="vx-wrap">
          <SectionHead
            num="03"
            kicker="Gallery"
            title={['Project', 'gallery']}
            aside={
              <button type="button" className="vx-btn vx-btn-line" onClick={() => openLightbox(0)}>
                View all images
                <span className="vx-btn-ico"><Maximize2 size={16} /></span>
              </button>
            }
          />
          <Reveal className={`vx-pd-mosaic n-${Math.min(count, 4)}`}>
            {images.slice(0, 4).map((img, idx) => (
              <button
                key={idx}
                type="button"
                className="vx-media is-hover vx-pd-tile"
                onClick={() => openLightbox(idx)}
                aria-label={`Open image ${idx + 1}: ${img.alt}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes={idx === 0 ? '(max-width: 719px) 100vw, 50vw' : '(max-width: 719px) 100vw, 25vw'}
                />
                <span className="vx-media-tag">{pad(idx + 1)}</span>
              </button>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── 04 RELATED PROJECTS ──────────────────────────────────────────── */}
      {relatedProjects && relatedProjects.length > 0 && (
        <section className="vx-sec vx-sec-white">
          <div className="vx-wrap">
            <SectionHead
              num="04"
              kicker="More work"
              title={['Related', 'projects']}
              aside={<Link href="/projects" className="vx-link">View all projects <ArrowRight size={16} /></Link>}
            />
            <Reveal className="vx-gallery">
              {relatedProjects.map((rel, i) => (
                <Link key={rel.id} href={`/projects/${rel.slug}`} className="vx-card vx-projects-card" style={{ ['--i' as string]: i }}>
                  <div className="vx-card-media">
                    <Image src={rel.mainImage} alt={rel.title} fill sizes="(max-width: 680px) 100vw, (max-width: 1100px) 50vw, 420px" />
                  </div>
                  <div className="vx-card-meta">
                    <span>{rel.category}</span>
                    <span>{rel.city}</span>
                  </div>
                  <h3>{rel.title}</h3>
                  <span className="vx-projects-card-cta">View project <ArrowRight size={14} /></span>
                </Link>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <CtaBand
        kicker="Next step"
        title="Have a similar project in mind?"
        text="We can help you design and build the perfect solution."
        whatsappContext={project.title}
      />

      {/* ── FULLSCREEN LIGHTBOX ──────────────────────────────────────────── */}
      {lightboxOpen && (
        <div
          className="vx-pd-overlay vx-pd-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} image viewer`}
          onClick={() => setLightboxOpen(false)}
        >
          <div className="vx-pd-overlay-bar">
            <span className="vx-pd-overlay-count"><b>{pad(lightboxIdx + 1)}</b> / {pad(count)}</span>
            <button
              ref={closeBtnRef}
              type="button"
              className="vx-pd-ibtn"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close fullscreen view"
            >
              <X size={20} />
            </button>
          </div>

          <button
            type="button"
            className="vx-pd-ibtn vx-pd-lb-nav is-prev"
            onClick={(e) => {
              e.stopPropagation();
              lightboxPrev();
            }}
            aria-label="Previous image"
          >
            <ChevronLeft size={22} />
          </button>

          <figure className="vx-pd-lb-figure" onClick={(e) => e.stopPropagation()}>
            <div className="vx-pd-lb-img">
              <Image
                key={lightboxIdx}
                src={images[lightboxIdx].src}
                alt={images[lightboxIdx].alt}
                fill
                sizes="90vw"
              />
            </div>
            <figcaption>{images[lightboxIdx].alt}</figcaption>
          </figure>

          <button
            type="button"
            className="vx-pd-ibtn vx-pd-lb-nav is-next"
            onClick={(e) => {
              e.stopPropagation();
              lightboxNext();
            }}
            aria-label="Next image"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      )}

      {/* ── VIDEO MODAL ──────────────────────────────────────────────────── */}
      {videoModalOpen && project.videoUrl && (
        <div
          className="vx-pd-overlay vx-pd-videomodal"
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} video`}
          onClick={() => setVideoModalOpen(false)}
        >
          <div className="vx-pd-overlay-bar">
            <span className="vx-pd-overlay-count">Project video</span>
            <button
              ref={closeBtnRef}
              type="button"
              className="vx-pd-ibtn"
              onClick={() => setVideoModalOpen(false)}
              aria-label="Close video"
            >
              <X size={20} />
            </button>
          </div>
          <div className="vx-pd-video-frame" onClick={(e) => e.stopPropagation()}>
            <video src={project.videoUrl} controls autoPlay playsInline />
          </div>
        </div>
      )}
    </div>
  );
}

export function ProjectGalleryInteractive({ images }: { images: { src: string; alt: string }[] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!images || images.length === 0) return null;

  return (
    <div className="space-y-3">
      <div
        className="relative aspect-16/10 rounded-2xl overflow-hidden border border-[#DCD8CF] group cursor-pointer"
        onClick={() => setLightboxOpen(true)}
      >
        <Image
          src={images[activeIdx]?.src || images[0].src}
          alt={images[activeIdx]?.alt || 'Gallery image'}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 60vw"
        />
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Maximize2 size={13} />
          <span>View full size</span>
        </div>
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-6 gap-2">
          {images.slice(0, 6).map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                activeIdx === idx ? 'border-[#121211] shadow-xs' : 'border-[#DCD8CF] opacity-70 hover:opacity-100'
              }`}
            >
              <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="100px" />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer"
          >
            <X size={20} />
          </button>
          <div className="relative w-full max-w-4xl aspect-16/10" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[activeIdx]?.src || images[0].src}
              alt={images[activeIdx]?.alt || 'Gallery full preview'}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>
        </div>
      )}
    </div>
  );
}
