'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ArrowRight, RotateCcw } from 'lucide-react';
import type { ProjectData } from '@/lib/projectsData';
import { SectionHead } from '@/components/vx/kit';

const categories = [
  { label: 'All projects', value: 'all' },
  { label: 'Gates', value: 'gates' },
  { label: 'Staircases', value: 'staircases' },
  { label: 'Railings', value: 'railings' },
  { label: 'Pergolas', value: 'pergolas' },
  { label: 'Sheds', value: 'roofing' },
  { label: 'Elevations', value: 'elevations' },
  { label: 'Other', value: 'other' },
];

type SortKey = 'latest' | 'oldest' | 'az';

const pad = (n: number) => String(n).padStart(2, '0');

export function ProjectsListingClient({ projects }: { projects: ProjectData[] }) {
  const projectsList = projects;
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('latest');
  const [visibleCount, setVisibleCount] = useState(12);


  const counts = useMemo(() => {
    const map = new Map<string, number>([['all', projectsList.length]]);
    for (const p of projectsList) map.set(p.categoryValue, (map.get(p.categoryValue) ?? 0) + 1);
    return map;
  }, [projectsList]);

  const filteredProjects = useMemo(() => {
    let list = projectsList.filter((project) => {
      const matchCategory =
        selectedCategory === 'all' || project.categoryValue === selectedCategory;

      if (!searchQuery.trim()) return matchCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchText =
        project.title.toLowerCase().includes(q) ||
        project.location.toLowerCase().includes(q) ||
        project.category.toLowerCase().includes(q) ||
        project.shortDescription.toLowerCase().includes(q);

      return matchCategory && matchText;
    });

    if (sortBy === 'latest') {
      list = [...list].sort((a, b) => b.year.localeCompare(a.year));
    } else if (sortBy === 'oldest') {
      list = [...list].sort((a, b) => a.year.localeCompare(b.year));
    } else if (sortBy === 'az') {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [projectsList, selectedCategory, searchQuery, sortBy]);

  const displayedProjects = filteredProjects.slice(0, visibleCount);
  const activeLabel = categories.find((c) => c.value === selectedCategory)?.label ?? 'All projects';

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
  };

  return (
    <section id="portfolio" className="vx-sec vx-projects-portfolio">
      <div className="vx-wrap">
        <SectionHead
          num="01"
          kicker="Portfolio"
          title={['Completed', 'projects']}
          aside="Gates, staircases, railings, pergolas, sheds and elevations — filter by category or search by name, location or keyword."
        />

        {/* ── Toolbar ── */}
        <div className="vx-projects-toolbar">
          <div className="vx-tabs vx-projects-tabs" role="group" aria-label="Filter projects by category">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  aria-pressed={isActive}
                  className={`vx-tab ${isActive ? 'is-on' : ''}`}
                  onClick={() => {
                    setSelectedCategory(cat.value);
                    setVisibleCount(12);
                  }}
                >
                  {cat.label} <sup>{pad(counts.get(cat.value) ?? 0)}</sup>
                </button>
              );
            })}
          </div>

          <div className="vx-projects-subbar">
            <p className="vx-projects-count" aria-live="polite">
              <b>{pad(displayedProjects.length)}</b> / {pad(filteredProjects.length)} shown
              <i />
              {activeLabel}
              {searchQuery.trim() && <> · “{searchQuery.trim()}”</>}
            </p>
            <div className="vx-projects-controls">
            <label className="vx-search vx-projects-search">
              <span className="sr-only">Search projects</span>
              <Search size={16} />
              <input
                type="search"
                className="vx-input"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </label>
            <label className="vx-projects-sort">
              <span className="sr-only">Sort projects</span>
              <select
                className="vx-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
              >
                <option value="latest">Sort by: Latest</option>
                <option value="oldest">Sort by: Oldest</option>
                <option value="az">Sort by: Title A-Z</option>
              </select>
            </label>
            </div>
          </div>
        </div>

        {/* ── Grid ── */}
        {filteredProjects.length > 0 ? (
          <>
            <div className="vx-gallery vx-projects-grid" key={`${selectedCategory}-${sortBy}`}>
              {displayedProjects.map((project, i) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="vx-card vx-projects-card"
                  style={{ ['--i' as string]: Math.min(i, 8) }}
                >
                  <div className="vx-card-media">
                    <Image
                      src={project.mainImage}
                      alt={project.title}
                      fill
                      sizes="(max-width: 680px) 100vw, (max-width: 1100px) 50vw, 420px"
                    />
                    <span className="vx-media-tag">{project.projectType}</span>
                  </div>
                  <div className="vx-card-meta">
                    <span>{project.category}</span>
                    <span>{project.city} · {project.year}</span>
                  </div>
                  <h3>{project.title}</h3>
                  <span className="vx-projects-card-cta">
                    View project <ArrowRight size={14} />
                  </span>
                </Link>
              ))}
            </div>

            {visibleCount < filteredProjects.length && (
              <div className="vx-projects-more">
                <button
                  type="button"
                  className="vx-btn vx-btn-line"
                  onClick={() => setVisibleCount((prev) => prev + 8)}
                >
                  Load more projects
                  <span className="vx-btn-ico"><RotateCcw size={16} /></span>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="vx-empty vx-projects-empty">
            <h3 className="vx-h3">No projects found</h3>
            <p>No projects matched your filter or search criteria.</p>
            <button type="button" className="vx-btn vx-btn-ink" onClick={resetFilters}>
              View all projects
              <span className="vx-btn-ico"><ArrowRight size={16} /></span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
