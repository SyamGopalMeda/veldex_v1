'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export interface GalleryProject {
  slug: string;
  title: string;
  category: string;
  categoryValue: string;
  city: string;
  year: string;
  img: string;
}

const LIMIT = 6;

/** Category tabs over the real project list; cards re-enter with a stagger on every filter change. */
export function ProjectGallery({ projects }: { projects: GalleryProject[] }) {
  const [filter, setFilter] = useState('all');

  const tabs = useMemo(() => {
    const counts = new Map<string, { label: string; n: number }>();
    for (const p of projects) {
      const c = counts.get(p.categoryValue);
      counts.set(p.categoryValue, { label: p.category, n: (c?.n ?? 0) + 1 });
    }
    return [{ value: 'all', label: 'All', n: projects.length }, ...Array.from(counts, ([value, v]) => ({ value, label: v.label, n: v.n }))];
  }, [projects]);

  const shown = (filter === 'all' ? projects : projects.filter((p) => p.categoryValue === filter)).slice(0, LIMIT);

  return (
    <div>
      <div className="vx-tabs" role="tablist" aria-label="Filter projects by category">
        {tabs.map((t) => (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={filter === t.value}
            className={`vx-tab ${filter === t.value ? 'is-on' : ''}`}
            onClick={() => setFilter(t.value)}
          >
            {t.label} <sup>{String(t.n).padStart(2, '0')}</sup>
          </button>
        ))}
      </div>

      <div className="vx-gallery" style={{ marginTop: '2.25rem' }} key={filter}>
        {shown.map((p, i) => (
          <Link key={p.slug} href={`/projects/${p.slug}`} className="vx-card" style={{ ['--i' as string]: i }}>
            <div className="vx-card-media">
              <Image src={p.img} alt={p.title} fill sizes="(max-width: 680px) 100vw, (max-width: 1100px) 50vw, 420px" />
            </div>
            <div className="vx-card-meta">
              <span>{p.category}</span>
              <span>{p.city} · {p.year}</span>
            </div>
            <h3>{p.title}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
