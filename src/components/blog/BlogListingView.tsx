'use client';

import { useState, useMemo, useEffect, type CSSProperties } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, RotateCcw, Search, FileText } from 'lucide-react';
import { blogCategories, type BlogArticle } from '@/lib/blogData';
import { PageHero, SectionHead, CtaBand } from '@/components/vx/kit';
import { BlogSidebar } from './BlogSidebar';

const highlights = ['Expert insights', 'Design inspiration', 'Industry trends', 'Latest updates'];

function matchesCategory(article: BlogArticle, category: string) {
  return (
    category === 'all' ||
    article.categorySlug === category ||
    article.category.toLowerCase().includes(category.toLowerCase())
  );
}

export function BlogListingView({ articles }: { articles: BlogArticle[] }) {
  const articlesList = articles;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Honour ?q= / ?category= links coming from article pages (sidebar search, tags, categories)
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    const category = params.get('category');
    if (q) setSearchQuery(q);
    if (category) setSelectedCategory(category);

  }, []);

  const filteredArticles = useMemo(() => {
    return articlesList.filter((article) => {
      // Category match
      const inCategory = matchesCategory(article, selectedCategory);

      // Search match
      if (!searchQuery.trim()) return inCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesTitle = article.title.toLowerCase().includes(q);
      const matchesExcerpt = article.excerpt.toLowerCase().includes(q);
      const matchesCategoryName = article.category.toLowerCase().includes(q);
      const matchesTags = Array.isArray(article.tags) && article.tags.some((t) => t.toLowerCase().includes(q));

      return inCategory && (matchesTitle || matchesExcerpt || matchesCategoryName || matchesTags);
    });
  }, [articlesList, searchQuery, selectedCategory]);

  // Live counts per category (same matching rule as the filter)
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of blogCategories) {
      counts[cat.slug] = articlesList.filter((a) => matchesCategory(a, cat.slug)).length;
    }
    return counts;
  }, [articlesList]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  const isFiltering = Boolean(searchQuery.trim()) || selectedCategory !== 'all';
  const featured = !isFiltering ? filteredArticles[0] : undefined;
  const gridArticles = featured ? filteredArticles.slice(1) : filteredArticles;

  return (
    <div className="vx">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <PageHero
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Blog' }]}
        kicker="Our blog"
        title={['Ideas, insights', '& inspiration']}
        lead="Expert tips, industry insights and updates on metal fabrication, design trends and everything that inspires our work."
        image="/images/gazebo.jpg"
        imageAlt="Veldex Fabrications Architectural Pergola"
        actions={
          <a href="#latest" className="vx-btn vx-btn-signal">
            Read the latest
            <span className="vx-btn-ico"><ArrowUpRight size={18} /></span>
          </a>
        }
        meta={
          <ul className="vx-blog-highlights">
            {highlights.map((h, i) => (
              <li key={h}><span>{String(i + 1).padStart(2, '0')}</span>{h}</li>
            ))}
          </ul>
        }
      />

      {/* ── 01 LATEST ARTICLES ───────────────────────────────────────────── */}
      <section className="vx-sec vx-blog-list-sec" id="latest">
        <div className="vx-wrap">
          <SectionHead
            num="01"
            kicker="Journal"
            title={['Latest articles']}
            aside={
              <form role="search" className="vx-search vx-blog-list-search" onSubmit={(e) => e.preventDefault()}>
                <Search size={17} aria-hidden="true" />
                <input
                  type="search"
                  className="vx-input"
                  placeholder="Search articles..."
                  aria-label="Search articles"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            }
            className="vx-blog-list-head"
          />

          {/* Category filter */}
          <div className="vx-blog-filter">
            <div className="vx-tabs vx-blog-tabs" role="group" aria-label="Filter by category">
              {blogCategories.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  className={`vx-tab ${selectedCategory === cat.slug ? 'is-on' : ''}`}
                  aria-pressed={selectedCategory === cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                >
                  {cat.name}
                  <sup>{String(categoryCounts[cat.slug] ?? cat.count).padStart(2, '0')}</sup>
                </button>
              ))}
            </div>
            <div className="vx-blog-status" aria-live="polite">
              {isFiltering ? (
                <>
                  <span>Showing {filteredArticles.length} of {articlesList.length} articles</span>
                  <button type="button" onClick={resetFilters} className="vx-blog-reset">
                    <RotateCcw size={13} aria-hidden="true" />
                    Reset
                  </button>
                </>
              ) : (
                <span>{articlesList.length} articles</span>
              )}
            </div>
          </div>

          <div className="vx-blog-layout">
            <div className="vx-blog-main">
              {filteredArticles.length > 0 ? (
                <>
                  {featured && (
                    <article className="vx-blog-feature">
                      <Link href={`/blog/${featured.slug}`} className="vx-blog-feature-media vx-media" tabIndex={-1} aria-hidden="true">
                        <Image
                          src={featured.featuredImage}
                          alt=""
                          fill
                          sizes="(max-width: 1023px) 100vw, 55vw"
                        />
                        <span className="vx-media-tag">{featured.category}</span>
                      </Link>
                      <div className="vx-blog-feature-body">
                        <div className="vx-blog-feature-top">
                          <span className="vx-tag is-signal">Featured</span>
                          <span className="vx-blog-meta">{featured.readTime}</span>
                        </div>
                        <h3 className="vx-blog-feature-title">
                          <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
                        </h3>
                        <p className="vx-blog-feature-excerpt">{featured.excerpt}</p>
                        <div className="vx-blog-feature-foot">
                          <span className="vx-blog-meta">
                            <time dateTime={featured.datePublishedISO}>{featured.date}</time>
                            <i aria-hidden="true">/</i>
                            {featured.author}
                          </span>
                          <Link href={`/blog/${featured.slug}`} className="vx-btn vx-btn-ink">
                            Read article
                            <span className="vx-btn-ico"><ArrowUpRight size={18} /></span>
                          </Link>
                        </div>
                      </div>
                    </article>
                  )}

                  {gridArticles.length > 0 && (
                    <div className="vx-blog-grid">
                      {gridArticles.map((article, i) => (
                        <article
                          key={article.id}
                          className="vx-card vx-blog-card"
                          style={{ ['--i' as string]: i } as CSSProperties}
                        >
                          <div className="vx-card-media">
                            <Image
                              src={article.featuredImage}
                              alt={article.featuredImageAlt || article.title}
                              fill
                              sizes="(max-width: 639px) 100vw, (max-width: 1099px) 50vw, 30vw"
                            />
                          </div>
                          <div className="vx-card-meta">
                            <span>{article.category}</span>
                            <time dateTime={article.datePublishedISO}>{article.date}</time>
                          </div>
                          <h3>
                            <Link href={`/blog/${article.slug}`} className="vx-blog-card-link">{article.title}</Link>
                          </h3>
                          <p className="vx-blog-card-excerpt">{article.excerpt}</p>
                          <div className="vx-blog-card-foot">
                            <span>{article.author}</span>
                            <span className="vx-blog-card-more">Read more <ArrowRight size={14} aria-hidden="true" /></span>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                /* Empty State */
                <div className="vx-empty vx-blog-empty">
                  <span className="vx-box-icon"><FileText size={20} strokeWidth={1.6} /></span>
                  <h3 className="vx-h3">No articles found</h3>
                  <p>
                    We couldn&apos;t find any articles matching your search criteria. Try adjusting your keywords or category filter.
                  </p>
                  <button type="button" onClick={resetFilters} className="vx-btn vx-btn-ink">
                    View all articles
                    <span className="vx-btn-ico"><ArrowRight size={18} /></span>
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar: search + categories live in the toolbar above */}
            <div className="vx-blog-aside">
              <BlogSidebar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                categoryCounts={categoryCounts}
                articles={articlesList}
                showSearch={false}
                showCategories={false}
                showNewsletter={true}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <CtaBand />
    </div>
  );
}
