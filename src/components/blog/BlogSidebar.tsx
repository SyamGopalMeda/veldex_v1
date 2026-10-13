'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  LayoutGrid,
  Shield,
  TrendingUp,
  Columns,
  Home,
  Wrench,
  Compass,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { blogCategories, getPopularArticles, type BlogArticle } from '@/lib/blogData';
import { NewsletterForm } from './NewsletterForm';

const DEFAULT_TAGS = [
  'Gate Design',
  'Modern Homes',
  'Laser Cut',
  'Automation',
  'Home Security',
  'Metal Gates',
  'Trends 2024',
];

interface BlogSidebarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  /** Called when the search form is submitted (Enter / button). When set, typing no longer triggers onSearchChange per keystroke. */
  onSearchSubmit?: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (categorySlug: string) => void;
  /** Live article counts per category slug; falls back to the static counts in blogData */
  categoryCounts?: Record<string, number>;
  /** Live published articles (database + built-in); used for the popular list */
  articles?: BlogArticle[];
  showSearch?: boolean;
  showCategories?: boolean;
  showPopular?: boolean;
  /** Hide this article from the popular list (e.g. the one being read) */
  excludeSlug?: string;
  showTags?: boolean;
  /** Tags to list; defaults to the original tag set */
  tags?: string[];
  activeTags?: string[];
  onTagClick?: (tag: string) => void;
  showNewsletter?: boolean;
  /** 'stack' = vertical aside, 'band' = multi-column band below an article */
  variant?: 'stack' | 'band';
}

const getCategoryIcon = (slug: string) => {
  switch (slug) {
    case 'all':
      return <LayoutGrid size={15} />;
    case 'gates-automation':
      return <Shield size={15} />;
    case 'staircases':
      return <TrendingUp size={15} />;
    case 'railings-balustrades':
      return <Columns size={15} />;
    case 'pergolas-outdoor':
      return <Home size={15} />;
    case 'metal-fabrication':
      return <Wrench size={15} />;
    case 'industry-insights':
      return <Compass size={15} />;
    default:
      return <Tag size={15} />;
  }
};

export function BlogSidebar({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  selectedCategory,
  onCategoryChange,
  categoryCounts,
  articles,
  showSearch = true,
  showCategories = true,
  showPopular = true,
  excludeSlug,
  showTags = false,
  tags = DEFAULT_TAGS,
  activeTags = [],
  onTagClick,
  showNewsletter = true,
  variant = 'stack',
}: BlogSidebarProps) {
  const source = articles ?? getPopularArticles();
  const popular = source.filter((a) => a.isPopular);
  const popularArticles = (popular.length ? popular : source).filter((a) => a.slug !== excludeSlug).slice(0, 5);
  // Submit mode keeps a local draft so navigation only happens on submit
  const [draft, setDraft] = useState(searchQuery);
  const value = onSearchSubmit ? draft : searchQuery;

  const searchBlock = showSearch && (
    <form
      role="search"
      className="vx-blog-widget"
      onSubmit={(e) => {
        e.preventDefault();
        if (onSearchSubmit) onSearchSubmit(draft);
        else onSearchChange(searchQuery);
      }}
    >
      <h3 className="vx-blog-widget-title"><span>Search</span></h3>
      <div className="vx-search vx-blog-search">
        <Search size={17} aria-hidden="true" />
        <input
          type="search"
          className="vx-input"
          placeholder="Search articles..."
          aria-label="Search articles"
          value={value}
          onChange={(e) => (onSearchSubmit ? setDraft(e.target.value) : onSearchChange(e.target.value))}
        />
        <button type="submit" className="vx-blog-search-go" aria-label="Search articles">
          <ArrowRight size={16} />
        </button>
      </div>
    </form>
  );

  const categoriesBlock = showCategories && (
    <div className="vx-blog-widget">
      <h3 className="vx-blog-widget-title"><span>Categories</span></h3>
      <ul className="vx-blog-cats">
        {blogCategories.map((cat) => {
          const isActive = selectedCategory === cat.slug;
          const count = categoryCounts?.[cat.slug] ?? cat.count;
          return (
            <li key={cat.slug}>
              <button
                type="button"
                onClick={() => onCategoryChange(cat.slug)}
                className={`vx-blog-cat ${isActive ? 'is-on' : ''}`}
                aria-pressed={isActive}
              >
                <span className="vx-blog-cat-ico" aria-hidden="true">{getCategoryIcon(cat.slug)}</span>
                <span className="vx-blog-cat-name">{cat.name}</span>
                <span className="vx-blog-cat-count">{String(count).padStart(2, '0')}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );

  const popularBlock = showPopular && popularArticles.length > 0 && (
    <div className="vx-blog-widget">
      <h3 className="vx-blog-widget-title"><span>Popular posts</span></h3>
      <ol className="vx-blog-popular">
        {popularArticles.map((art, i) => (
          <li key={art.id}>
            <Link href={`/blog/${art.slug}`} className="vx-blog-pop">
              <span className="vx-blog-pop-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="vx-blog-pop-thumb">
                <Image src={art.featuredImage} alt="" fill sizes="64px" />
              </span>
              <span className="vx-blog-pop-text">
                <span className="vx-blog-pop-title">{art.title}</span>
                <time className="vx-blog-pop-date" dateTime={art.datePublishedISO}>{art.date}</time>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );

  const tagsBlock = showTags && tags.length > 0 && (
    <div className="vx-blog-widget">
      <h3 className="vx-blog-widget-title"><span>Tags</span></h3>
      <div className="vx-blog-tags">
        {tags.map((tag) => {
          const isSelected = activeTags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => onTagClick && onTagClick(tag)}
              className={`vx-tag vx-blog-tag ${isSelected ? 'is-on' : ''}`}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );

  const newsletterBlock = showNewsletter && <NewsletterForm layout="sidebar" />;

  if (variant === 'band') {
    return (
      <aside className="vx-blog-sidebar is-band" aria-label="Explore the blog">
        {(searchBlock || categoriesBlock) && <div className="vx-blog-band-col">{searchBlock}{categoriesBlock}</div>}
        {popularBlock && <div className="vx-blog-band-col">{popularBlock}</div>}
        {(tagsBlock || newsletterBlock) && <div className="vx-blog-band-col">{tagsBlock}{newsletterBlock}</div>}
      </aside>
    );
  }

  return (
    <aside className="vx-blog-sidebar" aria-label="Blog sidebar">
      {searchBlock}
      {categoriesBlock}
      {popularBlock}
      {tagsBlock}
      {newsletterBlock}
    </aside>
  );
}
