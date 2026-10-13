'use client';

import { useEffect, useRef } from 'react';

// A gate panel drawn the way Veldex builds one: CAD outline → laser cuts the
// pattern piece by piece → panel complete. The yellow laser head follows the
// real cut path and the readout shows its live X/Y position.

const PANEL = { x: 46, y: 58, w: 208, h: 196 };
const CUTS: string[] = [];
for (const cy of [106, 156, 206]) {
  for (const cx of [98, 150, 202]) {
    const r = 21;
    CUTS.push(`M ${cx} ${cy - r} L ${cx + r} ${cy} L ${cx} ${cy + r} L ${cx - r} ${cy} Z`);
  }
}

const OUTLINE_MS = 1400;
const CUT_MS = 6200;
const HOLD_MS = 1800;
const LOOP_MS = OUTLINE_MS + CUT_MS + HOLD_MS;

const fmt = (n: number) => n.toFixed(1).padStart(6, '0');

export function LaserCutVisual() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const headRef = useRef<SVGGElement>(null);
  const outlineRef = useRef<SVGRectElement>(null);
  // Readout is written straight to the DOM each frame (no React re-renders).
  const xRef = useRef<HTMLElement>(null);
  const yRef = useRef<HTMLElement>(null);
  const doneRef = useRef<HTMLElement>(null);
  const phaseRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const paths = pathRefs.current.filter(Boolean) as SVGPathElement[];
    const outline = outlineRef.current;
    const head = headRef.current;
    if (!paths.length || !outline || !head) return;

    const lengths = paths.map((p) => p.getTotalLength());
    const total = lengths.reduce((a, b) => a + b, 0);
    const outlineLen = 2 * (PANEL.w + PANEL.h);
    outline.style.strokeDasharray = `${outlineLen}`;
    paths.forEach((p, i) => { p.style.strokeDasharray = `${lengths[i]}`; });

    // Only touch the DOM when a value actually changes: every SVG style write
    // costs a main-thread style + paint pass, and most frames (hold phase,
    // finished paths) change nothing.
    const last: Record<string, string> = {};
    const put = (key: string, write: (v: string) => void, value: string) => {
      if (last[key] !== value) { last[key] = value; write(value); }
    };

    const renderAt = (t: number) => {
      // 1) CAD outline draws in
      const o = Math.min(1, t / OUTLINE_MS);
      put('o', (v) => { outline.style.strokeDashoffset = v; }, (outlineLen * (1 - o)).toFixed(1));

      // 2) Laser cuts the pattern along the actual path lengths
      const c = Math.min(1, Math.max(0, (t - OUTLINE_MS) / CUT_MS));
      let remaining = c * total;
      let done = 0;
      let px = PANEL.x;
      let py = PANEL.y;
      paths.forEach((p, i) => {
        const len = lengths[i];
        const drawn = Math.max(0, Math.min(len, remaining));
        remaining -= len;
        put(`d${i}`, (v) => { p.style.strokeDashoffset = v; }, (len - drawn).toFixed(1));
        put(`f${i}`, (v) => { p.style.fillOpacity = v; }, drawn >= len ? '1' : '0');
        if (drawn >= len) done += 1;
        if (drawn > 0 && drawn < len) {
          const pt = p.getPointAtLength(drawn);
          px = pt.x;
          py = pt.y;
        }
      });
      if (c >= 1) {
        const end = paths[paths.length - 1].getPointAtLength(0);
        px = end.x;
        py = end.y;
      }
      const cutting = c > 0 && c < 1;
      put('ho', (v) => { head.style.opacity = v; }, cutting ? '1' : '0');
      if (cutting) put('ht', (v) => head.setAttribute('transform', v), `translate(${px.toFixed(1)} ${py.toFixed(1)})`);
      if (xRef.current) put('xRef', (v) => { if (xRef.current) xRef.current.textContent = v; }, fmt((px - PANEL.x) * 12));
      if (yRef.current) put('yRef', (v) => { if (yRef.current) yRef.current.textContent = v; }, fmt((py - PANEL.y) * 12));
      if (doneRef.current) put('doneRef', (v) => { if (doneRef.current) doneRef.current.textContent = v; }, String(done).padStart(2, '0'));
      if (phaseRef.current) put('phaseRef', (v) => { if (phaseRef.current) phaseRef.current.textContent = v; }, c <= 0 ? 'DRAWING' : c < 1 ? 'CUTTING' : 'COMPLETE');
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      renderAt(OUTLINE_MS + CUT_MS);
      return;
    }

    let raf = 0;
    let start = 0;
    let visible = true;
    const tick = (now: number) => {
      if (!start) start = now;
      renderAt((now - start) % LOOP_MS);
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(tick);
      if (!visible && raf) { cancelAnimationFrame(raf); raf = 0; }
    });
    if (wrapRef.current) io.observe(wrapRef.current);
    raf = requestAnimationFrame(tick);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div ref={wrapRef} className="vx-cad h-full w-full" role="img" aria-label="Animated CAD drawing of a gate panel being laser cut">
      <svg viewBox="0 0 300 300" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <pattern id="vx-grid" width="15" height="15" patternUnits="userSpaceOnUse">
            <path d="M 15 0 L 0 0 0 15" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6" />
          </pattern>
          <radialGradient id="vx-spark">
            <stop offset="0%" stopColor="#FFF6D6" />
            <stop offset="40%" stopColor="#F3AF04" />
            <stop offset="100%" stopColor="rgba(243,175,4,0)" />
          </radialGradient>
        </defs>
        <rect width="300" height="300" fill="url(#vx-grid)" />

        {/* Dimension lines */}
        <g stroke="rgba(255,255,255,0.35)" strokeWidth="0.7" fill="none">
          <path d={`M ${PANEL.x} 40 H ${PANEL.x + PANEL.w} M ${PANEL.x} 36 V 44 M ${PANEL.x + PANEL.w} 36 V 44`} />
          <path d={`M 28 ${PANEL.y} V ${PANEL.y + PANEL.h} M 24 ${PANEL.y} H 32 M 24 ${PANEL.y + PANEL.h} H 32`} />
        </g>
        <g fill="rgba(255,255,255,0.55)" fontFamily="ui-monospace, monospace" fontSize="8" letterSpacing="1">
          <text x={PANEL.x + PANEL.w / 2} y="34" textAnchor="middle">W</text>
          <text x="18" y={PANEL.y + PANEL.h / 2 + 3} textAnchor="middle">H</text>
        </g>

        {/* Panel outline (CAD) */}
        <rect
          ref={outlineRef}
          x={PANEL.x}
          y={PANEL.y}
          width={PANEL.w}
          height={PANEL.h}
          fill="none"
          stroke="rgba(255,255,255,0.8)"
          strokeWidth="1.4"
        />

        {/* Cut pattern */}
        {CUTS.map((d, i) => (
          <path
            key={i}
            ref={(el) => { pathRefs.current[i] = el; }}
            d={d}
            fill="rgba(243,175,4,0.14)"
            fillOpacity="0"
            stroke="#F3AF04"
            strokeWidth="1.6"
            strokeLinejoin="miter"
            style={{ transition: 'fill-opacity 0.4s ease' }}
          />
        ))}

        {/* Laser head */}
        <g ref={headRef} style={{ opacity: 0 }}>
          <circle r="9" fill="url(#vx-spark)" />
          <circle r="2.2" fill="#FFFFFF" />
          <path d="M -14 0 H -6 M 6 0 H 14 M 0 -14 V -6 M 0 6 V 14" stroke="rgba(255,255,255,0.7)" strokeWidth="0.7" />
        </g>
      </svg>

      <div className="vx-cad-readout" style={{ top: '0.75rem' }}>
        <span className="vx-cad-label">CNC · LASER</span>
        <span>
          X <b ref={xRef}>{fmt(0)}</b> &nbsp;Y <b ref={yRef}>{fmt(0)}</b>
        </span>
      </div>
      <div className="vx-cad-readout" style={{ bottom: '0.75rem' }}>
        <span ref={phaseRef}>DRAWING</span>
        <span>
          <b ref={doneRef}>00</b>/{String(CUTS.length).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}
