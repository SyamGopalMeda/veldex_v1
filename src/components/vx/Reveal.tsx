'use client';

import { createElement, useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  as?: 'div' | 'section' | 'li' | 'span' | 'h1' | 'h2' | 'p';
  /** 'up' (default) fades + rises; 'fade' fades only; 'lines' animates nested .vx-line spans */
  mode?: 'up' | 'fade' | 'lines';
  delay?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Adds `is-in` once the element enters the viewport; all motion lives in CSS
 * (`[data-reveal]` and `.vx-line` in globals.css), including reduced-motion.
 */
export function Reveal({ children, as = 'div', mode = 'up', delay = 0, className = '', style }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-in');
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return createElement(
    as,
    {
      ref,
      'data-reveal': mode,
      className,
      style: { ...style, ['--d' as string]: `${delay}ms` },
    },
    children
  );
}

/** Splits a heading into masked lines that rise in sequence inside a <Reveal mode="lines">. */
export function Lines({ lines }: { lines: ReactNode[] }) {
  return (
    <>
      {lines.map((line, i) => (
        <span key={i} className="vx-line" style={{ ['--l' as string]: i }}>
          <span>{line}</span>
        </span>
      ))}
    </>
  );
}
