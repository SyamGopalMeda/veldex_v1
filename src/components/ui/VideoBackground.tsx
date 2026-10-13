'use client';

import { useEffect, useRef, useState } from 'react';

interface VideoBackgroundProps {
  src: string;
  /** 0–1. Opacity when in viewport. Default 0.85 */
  opacity?: number;
  /** Overlay colour/gradient on top of video. Default subtle gradient. */
  overlay?: string;
  /** Extra CSS classes on the wrapping div */
  className?: string;
  /** Scale factor for subtle zoom. Default 1.05 */
  scale?: number;
  /** Enable parallax Y shift while scrolling. Default true */
  parallax?: boolean;
  /** Parallax strength in px. Default 30 */
  parallaxStrength?: number;
  /** Fade-in as section enters viewport. Default false to prevent artificial washing out */
  fadeOnScroll?: boolean;
  /** Children rendered above overlay */
  children?: React.ReactNode;
  /** Poster image shown before video loads */
  poster?: string;
}

export function VideoBackground({
  src,
  opacity = 0.85,
  overlay,
  className = '',
  scale = 1.05,
  parallax = true,
  parallaxStrength = 30,
  fadeOnScroll = false,
  children,
  poster,
}: VideoBackgroundProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentOpacity, setCurrentOpacity] = useState(opacity);
  const [translateY, setTranslateY] = useState(0);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  /* ── Intersection Observer: play/pause ── */
  useEffect(() => {
    const el = wrapRef.current;
    const vid = videoRef.current;
    if (!el || !vid) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            vid.play().catch(() => {});
          } else {
            vid.pause();
          }
        });
      },
      { threshold: 0.05, rootMargin: '120px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* ── Scroll-driven parallax & optional fade ── */
  useEffect(() => {
    if (prefersReducedMotion.current) {
      setCurrentOpacity(opacity);
      return;
    }

    const handleScroll = () => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const sectionH = el.offsetHeight;

      /* Only fade when explicitly requested */
      if (fadeOnScroll) {
        const enterProgress = Math.min(1, Math.max(0, (vh - rect.top) / (vh * 0.4)));
        const exitProgress  = Math.min(1, Math.max(0, (-rect.bottom + vh * 0.1) / (vh * 0.3)));
        const combined = enterProgress * (1 - exitProgress);
        setCurrentOpacity(Math.max(0.2, combined) * opacity);
      } else {
        setCurrentOpacity(opacity);
      }

      /* Parallax translation */
      if (parallax) {
        const centerOffset = rect.top + sectionH / 2 - vh / 2;
        const shift = (centerOffset / vh) * parallaxStrength;
        setTranslateY(Math.max(-parallaxStrength, Math.min(parallaxStrength, shift)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [opacity, parallax, parallaxStrength, fadeOnScroll]);

  return (
    <div ref={wrapRef} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        poster={poster}
        preload="auto"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: prefersReducedMotion.current ? opacity : currentOpacity,
          transform: `scale(${scale}) translateY(${translateY}px)`,
          transition: 'opacity 0.4s ease',
          willChange: 'transform, opacity',
        }}
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* Overlay - only rendered if specified */}
      {overlay && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: overlay,
            zIndex: 1,
          }}
        />
      )}

      {children && (
        <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
      )}
    </div>
  );
}
