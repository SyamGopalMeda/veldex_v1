'use client';

import { useEffect, useRef } from 'react';

const DURATION = 1700;  // ms for the arc to cross the hero
const START_DELAY = 350;

interface Spark { x: number; y: number; vx: number; vy: number; life: number; max: number; }

/**
 * Hero intro: a welding arc travels the seam left → right, throwing sparks,
 * then the seam cools from white-hot to Veldex yellow. Mirrors the torch and
 * bolt in the logo. Skipped (static seam) for reduced motion.
 */
export function WeldSeam() {
  const lineRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const line = lineRef.current;
    const canvas = canvasRef.current;
    if (!line || !canvas) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      line.style.transform = 'scaleX(1)';
      line.classList.add('is-cool');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const SEAM_Y = 60; // seam position inside the canvas (canvas starts 60px above the seam)
    const sparks: Spark[] = [];
    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    let start = 0;
    let raf = 0;
    let finished = false;

    const frame = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, Math.max(0, (now - start - START_DELAY) / DURATION));
      const p = ease(t);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const headX = p * w;
      line.style.transform = `scaleX(${p})`;

      if (t > 0 && t < 1) {
        for (let i = 0; i < 5; i++) {
          sparks.push({
            x: headX,
            y: SEAM_Y,
            vx: (Math.random() - 0.7) * 4.5,
            vy: -Math.random() * 4.2 - 0.6,
            life: 0,
            max: 26 + Math.random() * 30,
          });
        }
      }
      if (t >= 1 && !finished) {
        finished = true;
        line.classList.add('is-cool');
      }

      ctx.clearRect(0, 0, w, h);
      // arc glow at the head
      if (t > 0 && t < 1) {
        const g = ctx.createRadialGradient(headX, SEAM_Y, 0, headX, SEAM_Y, 46);
        g.addColorStop(0, 'rgba(255,250,230,0.95)');
        g.addColorStop(0.25, 'rgba(255,212,94,0.55)');
        g.addColorStop(1, 'rgba(243,175,4,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(headX, SEAM_Y, 46, 0, Math.PI * 2);
        ctx.fill();
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life += 1;
        s.vy += 0.22; // gravity
        s.vx *= 0.985;
        const px = s.x;
        const py = s.y;
        s.x += s.vx;
        s.y += s.vy;
        const k = 1 - s.life / s.max;
        if (k <= 0 || s.y > h) { sparks.splice(i, 1); continue; }
        ctx.strokeStyle = k > 0.6 ? `rgba(255,246,214,${k})` : `rgba(243,175,4,${k})`;
        ctx.lineWidth = 1.4 * k + 0.3;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
      }

      if (t < 1 || sparks.length) raf = requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, w, h);
    };
    raf = requestAnimationFrame(frame);
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="vx-seam" aria-hidden="true">
      <div ref={lineRef} className="vx-seam-line" />
      <canvas ref={canvasRef} />
    </div>
  );
}
