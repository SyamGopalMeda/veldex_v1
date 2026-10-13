'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  /** Animation variant. Default 'fade-up' */
  variant?: 'fade-up' | 'fade-in' | 'fade-left' | 'fade-right' | 'scale-up';
  /** Delay in ms before animation starts. Default 0 */
  delay?: number;
  /** Threshold 0–1 for IntersectionObserver. Default 0.15 */
  threshold?: number;
  className?: string;
  /** Whether to animate only once. Default true */
  once?: boolean;
}

const variants = {
  'fade-up':    { hidden: 'opacity:0;transform:translateY(32px)', visible: 'opacity:1;transform:translateY(0)' },
  'fade-in':    { hidden: 'opacity:0', visible: 'opacity:1' },
  'fade-left':  { hidden: 'opacity:0;transform:translateX(-32px)', visible: 'opacity:1;transform:translateX(0)' },
  'fade-right': { hidden: 'opacity:0;transform:translateX(32px)', visible: 'opacity:1;transform:translateX(0)' },
  'scale-up':   { hidden: 'opacity:0;transform:scale(0.92)', visible: 'opacity:1;transform:scale(1)' },
};

export function ScrollReveal({
  children,
  variant = 'fade-up',
  delay = 0,
  threshold = 0.15,
  className = '',
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRevealed(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setRevealed(false);
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  const v = variants[variant];

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        ...(revealed
          ? Object.fromEntries(v.visible.split(';').map(s => { const [k, val] = s.split(':'); return [k.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase()), val?.trim()]; }))
          : Object.fromEntries(v.hidden.split(';').map(s => { const [k, val] = s.split(':'); return [k.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase()), val?.trim()]; }))
        ),
      }}
    >
      {children}
    </div>
  );
}
