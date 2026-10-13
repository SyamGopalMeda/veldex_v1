'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

export interface ReelStage {
  key: string;
  title: string;
  body: string;
  media: ReactNode;
}

/**
 * Pinned horizontal process reel (desktop): the section sticks while vertical
 * scroll moves the stages sideways, so a visitor walks through the workshop
 * sequence in order. Below 900px it degrades to a plain vertical stack.
 */
export function ProcessReel({ stages, header }: { stages: ReelStage[]; header: ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const stepRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const outer = outerRef.current;
    const track = trackRef.current;
    if (!outer || !track) return;
    const mq = window.matchMedia('(min-width: 900px)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Sizes are cached (re-measured on resize) so the scroll loop does one
    // clean layout read per frame; transform and fills are written straight to
    // the DOM, and React state changes only when the current stage changes.
    let frame = 0;
    let outerH = 0, trackW = 0, viewH = 0, viewW = 0, last = -1;
    const measure = () => {
      outerH = outer.offsetHeight; trackW = track.scrollWidth;
      viewH = window.innerHeight; viewW = window.innerWidth;
    };
    const update = () => {
      frame = 0;
      if (!mq.matches) {
        track.style.transform = 'none';
        return;
      }
      const top = outer.getBoundingClientRect().top;
      const p = Math.min(1, Math.max(0, -top / Math.max(outerH - viewH, 1)));
      const shift = reduced ? 0 : p * Math.max(trackW - viewW, 0);
      track.style.transform = `translate3d(${(-shift).toFixed(1)}px, 0, 0)`;
      const pos = p * (stages.length - 1);
      stepRefs.current.forEach((el, i) => {
        if (el) el.style.setProperty('--f', Math.min(1, Math.max(0, pos - i + 1)).toFixed(3));
      });
      const cur = Math.round(pos);
      if (cur !== last) { last = cur; setCurrent(cur); }
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const onResize = () => { measure(); onScroll(); };
    measure();
    update();
    const ro = new ResizeObserver(onResize);
    ro.observe(outer);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [stages]);

  return (
    <div ref={outerRef} className="vx-reel" style={{ ['--n' as string]: stages.length }}>
      <div className="vx-reel-sticky">
        <div className="vx-wrap" style={{ marginBottom: '2.25rem' }}>{header}</div>
        <div ref={trackRef} className="vx-reel-track vx-wrap-mobile">
          {stages.map((s, i) => (
            <article key={s.key} className={`vx-stage ${i === current ? 'is-current' : ''}`}>
              <div className="vx-stage-copy">
                <span className="vx-stage-num">{String(i + 1).padStart(2, '0')} / {String(stages.length).padStart(2, '0')}</span>
                <div>
                  <h3 className="vx-h2" style={{ fontSize: 'clamp(2rem, 3.4vw, 3rem)' }}>{s.title}</h3>
                  <p className="vx-body" style={{ marginTop: '1rem', maxWidth: '26rem' }}>{s.body}</p>
                </div>
              </div>
              <div className="vx-stage-media">{s.media}</div>
            </article>
          ))}
        </div>
        <div className="vx-wrap">
          <div className="vx-reel-steps" aria-hidden="true">
            {stages.map((s, i) => (
              <span key={s.key} ref={(el) => { stepRefs.current[i] = el; }} className={`vx-reel-step ${i === current ? 'is-current' : ''}`}>
                {s.title}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
