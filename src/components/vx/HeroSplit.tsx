'use client';

import { memo, useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { getImageProps } from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, Gem, Ruler, Cog, Users, Building2, ShieldCheck } from 'lucide-react';
import { WeldSeam } from './WeldSeam';

export interface SplitSlide {
  img: string;
  alt: string;
  eyebrow: string;
  headline: string;
  text: string;
  cta: { label: string; href: string };
  /** Real materials for this line of work (spec line under the CTA) */
  materials: string[];
  /** Focal point kept in frame when the photo is cropped (CSS object-position) */
  focus?: string;
  /** 'contain': square art shown whole at full height, right-aligned.
   *  'frame': tight close-up shown whole as a framed picture on the right (never cropped). */
  fit?: 'contain' | 'frame';
  /** Portrait art used instead of `img` on phones / upright tablets */
  mobileImg?: string;
}

// ── Timeline (ms) — CSS reads the same values through custom properties ──
const PANELS = 8;          // full-width vertical slices
const PANEL_MS = 1250;     // flight time of one slice
const PANEL_STAGGER = 80;  // centre-out stagger step
const ASSEMBLE_MS = PANEL_MS + PANEL_STAGGER * Math.ceil(PANELS / 2);
const TEXT_START = 480;    // headline words start rising (slices mid-flight)
const WORD_STEP = 75;
const SIZES = '100vw';     // identical on every layer so one download is reused
/** Phones and upright tablets get the portrait art (must match the CSS breakpoint) */
const PORTRAIT = '(max-aspect-ratio: 4/5)';

const FEATURES = [
  { Icon: Gem, label: 'Premium quality' },
  { Icon: Ruler, label: 'Custom designs' },
  { Icon: Cog, label: 'Expert fabrication' },
];
const STAT_ICONS = [Users, Building2, ShieldCheck];

/** <picture> that serves the portrait art on phones and the landscape photo elsewhere —
 *  each device downloads only the one it shows. */
function ArtImage({ slide, className, style, priority }: { slide: SplitSlide; className?: string; style?: CSSProperties; priority?: boolean }) {
  const desk = getImageProps({ src: slide.img, alt: '', fill: true, sizes: SIZES }).props;
  const mob = slide.mobileImg ? getImageProps({ src: slide.mobileImg, alt: '', fill: true, sizes: SIZES }).props : null;
  return (
    <picture>
      {mob && <source media={PORTRAIT} srcSet={mob.srcSet} sizes={mob.sizes} />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={desk.src} srcSet={desk.srcSet} sizes={desk.sizes} alt="" decoding="async" fetchPriority={priority ? 'high' : undefined}
        className={className} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', ...style }} />
    </picture>
  );
}

/** One slide caption. Memoised: a slide change only re-renders the two
 *  captions whose state actually changes, not every word of every slide. */
const Caption = memo(function Caption({ s, i, active, leaving }: { s: SplitSlide; i: number; active: boolean; leaving: boolean }) {
  const words = s.headline.split(' ');
  const after = TEXT_START + words.length * WORD_STEP + 250;
  return (
    <div className={`vx-split-cap ${active ? 'is-active' : ''} ${leaving ? 'is-leaving' : ''}`} aria-hidden={!active} style={{ ['--after' as string]: `${after}ms` } as CSSProperties}>
      <span className="vx-split-eyebrow"><b>{String(i + 1).padStart(2, '0')}</b><i />{s.eyebrow}</span>
      <p className="vx-split-title">
        <span className="sr-only">{s.headline}</span>
        {words.map((w, wi) => (
          <span key={wi} className="vx-split-mask" aria-hidden="true">
            <span className={`vx-split-word ${wi === words.length - 1 ? 'is-last' : ''}`} style={{ ['--w' as string]: wi } as CSSProperties}>{w}</span>
          </span>
        ))}
      </p>
      <p className="vx-split-text vx-split-late">{s.text}</p>
      <ul className="vx-split-feats vx-split-late" style={{ ['--late' as string]: '60ms' } as CSSProperties}>
        {FEATURES.map(({ Icon, label }) => (
          <li key={label}><span><Icon size={20} strokeWidth={1.6} /></span>{label}</li>
        ))}
      </ul>
      <div className="vx-split-actions vx-split-late" style={{ ['--late' as string]: '120ms' } as CSSProperties}>
        <Link href={s.cta.href} className="vx-btn vx-btn-signal" tabIndex={active ? 0 : -1}>
          {s.cta.label}
          <span className="vx-btn-ico"><ArrowUpRight size={18} /></span>
        </Link>
        <Link href="/quote" className="vx-split-ghost" tabIndex={active ? 0 : -1}>Get a quote <ArrowRight size={18} className="vx-split-ghost-arrow" aria-hidden="true" /></Link>
      </div>
      {s.materials.length > 0 && (
        <p className="vx-split-spec vx-split-late" style={{ ['--late' as string]: '240ms' } as CSSProperties}>
          <span>Materials</span>{s.materials.slice(0, 3).join(' · ')}
        </p>
      )}
    </div>
  );
});

/**
 * Full-screen hero. The whole background photo arrives as vertical slices
 * flying in from alternating directions (centre-out, 3D tilt) under a
 * two-layer diagonal wipe, then locks into one seamless image that keeps a
 * slow Ken Burns drift. Copy leaves as the slices launch and rises in, word
 * by word, as they converge.
 */
export function HeroSplit({ slides, intervalMs = 7500, stats = [] }: { slides: SplitSlide[]; intervalMs?: number; stats?: { value: string; label: string }[] }) {
  const INTERVAL = intervalMs;
  const [index, setIndex] = useState(0);
  const [from, setFrom] = useState<number | null>(null);
  const [assembling, setAssembling] = useState(true); // intro assembles slide 0
  const [cycle, setCycle] = useState(0);
  const [tick, setTick] = useState(0);
  const indexRef = useRef(0);
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useRef(false);
  const visible = useRef(true);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ready = useRef<Map<number, Promise<void>>>(new Map());
  const pending = useRef(0); // guards against rapid clicks racing a decode

  // Fetch + decode a slide's photo off the main thread, using exactly the
  // srcset next/image renders, so its slices never fly in blank.
  const prepare = useCallback((i: number) => {
    const cached = ready.current.get(i);
    if (cached) return cached;
    const portrait = Boolean(slides[i].mobileImg) && window.matchMedia(PORTRAIT).matches;
    const { props } = getImageProps({ src: portrait ? slides[i].mobileImg! : slides[i].img, alt: '', fill: true, sizes: SIZES });
    const img = new window.Image();
    img.decoding = 'async';
    if (props.sizes) img.sizes = props.sizes;
    if (props.srcSet) img.srcset = props.srcSet;
    img.src = props.src;
    const p = img.decode().catch(() => undefined);
    ready.current.set(i, p);
    return p;
  }, [slides]);

  const goTo = useCallback((next: number) => {
    const cur = indexRef.current;
    const n = (next + slides.length) % slides.length;
    if (n === cur) return;
    const ticket = ++pending.current;
    // Wait for the photo (max 1.5s so a slow network never freezes the slider)
    Promise.race([prepare(n), new Promise((r) => setTimeout(r, 1500))]).then(() => {
      if (ticket !== pending.current) return; // a newer request superseded this one
      indexRef.current = n;
      setFrom(cur);
      setIndex(n);
      setAssembling(!reduced.current);
      setCycle((c) => c + 1);
      prepare((n + 1) % slides.length); // warm the following slide during the dwell
    });
  }, [slides.length, prepare]);

  // Warm the next slide once the page is idle after first paint
  useEffect(() => {
    const warm = () => prepare(1 % slides.length);
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(warm);
    else setTimeout(warm, 1500);
  }, [prepare, slides.length]);

  // Hand over from slices to the single assembled image
  useEffect(() => {
    if (!assembling) return;
    const t = setTimeout(() => setAssembling(false), ASSEMBLE_MS + 60);
    return () => clearTimeout(t);
  }, [assembling, cycle]);

  // Autoplay — paused off-screen / hidden tab, off for reduced motion
  useEffect(() => {
    if (reduced.current) return;
    const t = setTimeout(() => {
      if (visible.current && !document.hidden) goTo(indexRef.current + 1);
      else setTick((n) => n + 1);
    }, INTERVAL);
    return () => clearTimeout(t);
  }, [index, tick, goTo]);

  // Parallax (scroll for all, eased pointer on fine pointers)
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced.current) setAssembling(false);
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting; }, { threshold: 0.15 });
    io.observe(root);
    if (reduced.current) return () => io.disconnect();

    const fine = window.matchMedia('(pointer: fine)').matches;
    // No per-frame JS loop:
    //  • pointer parallax sets a target transform and a CSS transition eases
    //    to it on the compositor;
    //  • scroll parallax writes one transform per scroll frame, using the
    //    scroll offset captured in the scroll event (no layout reads in rAF).
    const scrollLayer = scrollRef.current;
    const tilt = bgRef.current;
    const content = contentRef.current;
    let heroH = root.offsetHeight;
    const ro = new ResizeObserver(([e]) => { heroH = e.contentRect.height; });
    ro.observe(root);

    let raf = 0, sy = 0, px = 0, py = 0, pointerRaf = 0;
    const applyScroll = () => {
      raf = 0;
      const y = Math.min(sy, heroH);
      if (scrollLayer) scrollLayer.style.transform = `translate3d(0, ${(y * 0.28).toFixed(1)}px, 0)`;
      if (content) {
        content.style.transform = `translate3d(0, ${(y * -0.12).toFixed(1)}px, 0)`;
        content.style.opacity = String(Math.max(0, 1 - y / 460));
      }
    };
    const kick = () => {
      sy = window.scrollY;
      if (sy > heroH + 200 && !raf) return; // hero long gone — nothing to update
      if (!raf) raf = requestAnimationFrame(applyScroll);
    };
    const applyPointer = () => {
      pointerRaf = 0;
      if (tilt) tilt.style.transform = `translate3d(${(px * -16).toFixed(1)}px, ${(py * -10).toFixed(1)}px, 0)`;
    };
    const onMove = (e: PointerEvent) => {
      if (!visible.current) return;
      px = e.clientX / window.innerWidth - 0.5; py = e.clientY / window.innerHeight - 0.5;
      if (!pointerRaf) pointerRaf = requestAnimationFrame(applyPointer);
    };
    kick();
    window.addEventListener('scroll', kick, { passive: true });
    if (fine) window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(raf);
      cancelAnimationFrame(pointerRaf);
      window.removeEventListener('scroll', kick);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  const slide = slides[index];
  const baseIdx = assembling ? from : index;          // what sits under the slices
  const mid = (PANELS - 1) / 2;

  const timeline = {
    ['--panel-ms' as string]: `${PANEL_MS}ms`,
    ['--text-start' as string]: `${TEXT_START}ms`,
    ['--word-step' as string]: `${WORD_STEP}ms`,
  } as CSSProperties;

  return (
    <section
      ref={rootRef}
      className="vx-split"
      style={timeline}
      aria-roledescription="carousel"
      aria-label="Veldex highlights"
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') goTo(indexRef.current + 1);
        if (e.key === 'ArrowLeft') goTo(indexRef.current - 1);
      }}
      onTouchStart={(e) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
      onTouchEnd={(e) => {
        const t = touch.current;
        touch.current = null;
        if (!t) return;
        const dx = e.changedTouches[0].clientX - t.x;
        const dy = e.changedTouches[0].clientY - t.y;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.2) goTo(indexRef.current + (dx < 0 ? 1 : -1));
      }}
    >
      <h1 className="sr-only">Veldex Fabrications — custom metal fabrication in Vijayawada: gates, SS &amp; glass railings, staircases, pergolas and terrace sheds</h1>

      {/* ── Full-screen background: base image + assembling slices + wipe ── */}
      <div className="vx-split-bg" aria-hidden="true">
        <div className="vx-split-bg-scroll" ref={scrollRef}>
        <div className="vx-split-bg-inner" ref={bgRef}>
          {baseIdx !== null && (
            <div className="vx-split-base" key={`base-${baseIdx}`}>
              <ArtImage slide={slides[baseIdx]} priority={baseIdx === 0} className={`object-cover is-drifting ${slides[baseIdx].fit ? `is-${slides[baseIdx].fit}` : ''} ${slides[baseIdx].mobileImg ? 'has-mobile' : ''}`} style={{ objectPosition: slides[baseIdx].focus }} />
            </div>
          )}

          {assembling && (
            <div className="vx-split-panels" key={`panels-${cycle}`}>
              {Array.from({ length: PANELS }).map((_, i) => (
                <div
                  key={i}
                  className={`vx-split-panel ${i % 2 ? 'from-bottom' : 'from-top'}`}
                  style={{
                    left: `${(100 / PANELS) * i}%`,
                    width: `${100 / PANELS + 0.12}%`,
                    animationDelay: `${Math.round(Math.abs(i - mid)) * PANEL_STAGGER}ms`,
                  }}
                >
                  <div className="vx-split-panel-img" style={{ left: `${-100 * i}%`, width: `${100 * PANELS}%` }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <ArtImage slide={slide} priority={cycle === 0} className={`vx-split-slice-img ${slide.fit ? `is-${slide.fit}` : ''} ${slide.mobileImg ? 'has-mobile' : ''}`} style={{ objectPosition: slide.focus }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        </div>

        {assembling && (
          <div className="vx-split-wipe" key={`wipe-${cycle}`}>
            <span className="vx-split-wipe-dark" />
            <span className="vx-split-wipe-edge" />
          </div>
        )}
      </div>

      <div className="vx-split-shade" aria-hidden="true" />
      <div className="vx-split-grid-lines" aria-hidden="true" />

      {/* ── Copy ── */}
      <div className="vx-wrap vx-split-content" ref={contentRef}>
        <div className="vx-split-copy">
          <div className="vx-split-captions" aria-live="polite">
            {slides.map((s, i) => (
              <Caption key={s.img} s={s} i={i} active={i === index} leaving={assembling && i === from} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats (phones / upright tablets) ── */}
      {stats.length > 0 && (
        <ul className="vx-split-stats" aria-label="Veldex in numbers" style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}>
          {stats.map(({ value, label }, i) => {
            const Icon = STAT_ICONS[i % STAT_ICONS.length];
            return <li key={label}><Icon size={22} strokeWidth={1.5} aria-hidden="true" /><b>{value}</b><span>{label}</span></li>;
          })}
        </ul>
      )}

      {/* ── Controls ── */}
      <div className="vx-wrap vx-split-controls">
        <div className="vx-split-dots" role="tablist" aria-label="Choose slide">
          {slides.map((s, i) => (
            <button key={s.img} type="button" role="tab" aria-selected={i === index} aria-label={`Slide ${i + 1}: ${s.eyebrow}`} className={`vx-split-dot ${i === index ? 'is-active' : ''}`} onClick={() => goTo(i)}>
              <span key={i === index ? `fill-${cycle}` : 'idle'} style={{ animationDuration: `${INTERVAL}ms` }} />
            </button>
          ))}
        </div>
        <span className="vx-split-count" aria-hidden="true"><b>{String(index + 1).padStart(2, '0')}</b> / {String(slides.length).padStart(2, '0')}</span>
        <div className="vx-split-arrows">
          <button type="button" onClick={() => goTo(indexRef.current - 1)} aria-label="Previous slide"><ArrowLeft size={18} strokeWidth={1.5} /></button>
          <button type="button" onClick={() => goTo(indexRef.current + 1)} aria-label="Next slide"><ArrowRight size={18} strokeWidth={1.5} /></button>
        </div>
      </div>

      <div className="vx-split-seam"><WeldSeam /></div>
    </section>
  );
}
