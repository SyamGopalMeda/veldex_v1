import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';

export interface Crumb { label: string; href?: string }

interface PageHeroProps {
  crumbs: Crumb[];
  /** Short mono label, e.g. "Our services" */
  kicker: string;
  /** Headline; each entry renders on its own line, words rise in sequence */
  title: string[];
  lead?: ReactNode;
  image?: string;
  imageAlt?: string;
  /** Buttons / links under the lead */
  actions?: ReactNode;
  /** Optional content under the actions (stats, chips…) */
  meta?: ReactNode;
  /** Shorter hero without the image column (articles, legal, forms) */
  compact?: boolean;
}

const SLICES = 5;
const WORD_STEP = 70;

/**
 * Dark page hero shared by every inner page. Same language as the home hero:
 * mono kicker, words rising from masks, and an image that assembles from
 * vertical slices on load. Pure CSS motion — no client JS.
 */
export function PageHero({ crumbs, kicker, title, lead, image, imageAlt = '', actions, meta, compact }: PageHeroProps) {
  let w = 0;
  const words = title.map((line) => line.split(' ').map((word) => ({ word, i: w++ })));
  const after = 300 + w * WORD_STEP + 200;
  const showImage = Boolean(image) && !compact;

  return (
    <section className={`vx-ph ${compact ? 'is-compact' : ''} ${showImage ? 'has-image' : ''}`} style={{ ['--after' as string]: `${after}ms` } as CSSProperties}>
      <div className="vx-ph-grid-lines" aria-hidden="true" />
      <div className="vx-wrap vx-ph-inner">
        <div className="vx-ph-copy">
          <nav aria-label="Breadcrumb" className="vx-ph-crumbs">
            <ol>
              {crumbs.map((c, i) => (
                <li key={c.label}>
                  {c.href && i < crumbs.length - 1 ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
                </li>
              ))}
            </ol>
          </nav>
          <span className="vx-ph-kicker"><i />{kicker}</span>
          <h1 className="vx-ph-title">
            {words.map((line, li) => (
              <span key={li} className="vx-ph-line">
                {line.map(({ word, i }) => (
                  <span key={i} className="vx-ph-mask">
                    <span className="vx-ph-word" style={{ animationDelay: `${300 + i * WORD_STEP}ms` }}>{word}</span>
                  </span>
                ))}
              </span>
            ))}
          </h1>
          {lead && <div className="vx-ph-lead vx-ph-late">{lead}</div>}
          {actions && <div className="vx-ph-actions vx-ph-late" style={{ animationDelay: `calc(var(--after) + 120ms)` }}>{actions}</div>}
          {meta && <div className="vx-ph-meta vx-ph-late" style={{ animationDelay: `calc(var(--after) + 240ms)` }}>{meta}</div>}
        </div>

        {showImage && (
          <div className="vx-ph-media" aria-hidden={imageAlt ? undefined : true}>
            <div className="vx-ph-frame">
              {Array.from({ length: SLICES }).map((_, i) => (
                <div
                  key={i}
                  className={`vx-ph-slice ${i % 2 ? 'from-bottom' : 'from-top'}`}
                  style={{
                    left: `${(100 / SLICES) * i}%`,
                    width: `${100 / SLICES + 0.2}%`,
                    animationDelay: `${150 + Math.abs(i - (SLICES - 1) / 2) * 90}ms`,
                  }}
                >
                  <div className="vx-ph-slice-img" style={{ left: `${-100 * i}%`, width: `${100 * SLICES}%` }}>
                    <Image src={image as string} alt={i === 0 ? imageAlt : ''} fill preload sizes="(max-width: 1023px) 100vw, 45vw" className="object-cover" />
                  </div>
                </div>
              ))}
              <span className="vx-ph-corner tl" /><span className="vx-ph-corner br" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
