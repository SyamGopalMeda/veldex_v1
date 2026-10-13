import { MetadataRoute } from 'next';
import { getServicesView, listProjects, listArticles } from '@/lib/content';
import { abs } from '@/lib/seo';

export const revalidate = 3600;

// Stable "last modified" dates: a sitemap that claims every page changed on every
// request teaches search engines to ignore lastmod. Bump SITE_UPDATED on redesigns.
const SITE_UPDATED = new Date('2026-10-12');

/** Same hero/overview images the service pages render (helps image search). */
const SERVICE_IMAGES: Record<string, string[]> = {
  'gate-automation': ['/images/gate.jpg', '/images/gate_overview.jpg'],
  railings: ['/images/railings.jpg'],
  staircases: ['/images/stairs.jpg'],
  'pergolas-gazebos': ['/images/gazebo.jpg'],
  'sheds-roofing': ['/images/sheds.jpg'],
  'elevations-facades': ['/images/elevation.jpg'],
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const page = (path: string, priority: number, changeFrequency: 'weekly' | 'monthly' | 'yearly', images?: string[], lastModified = SITE_UPDATED) =>
    ({ url: abs(path), lastModified, changeFrequency, priority, ...(images?.length ? { images: images.map(abs) } : {}) });

  const [{ published: services }, allProjects, blogArticles] = await Promise.all([getServicesView(), listProjects(), listArticles()]);

  return [
    page('/', 1.0, 'weekly', ['/images/hero/desktop/d-floating-staircase.jpg', '/images/hero/desktop/d-laser-cut-gate.jpg', '/images/hero/desktop/d-curved-foyer-staircase.jpg']),
    page('/services', 0.9, 'monthly'),
    ...services.map((s) => page(`/services/${s.slug}`, 0.9, 'monthly', SERVICE_IMAGES[s.slug])),
    page('/projects', 0.8, 'weekly', allProjects.slice(0, 8).map((p) => p.mainImage)),
    ...allProjects.map((p) => page(`/projects/${p.slug}`, 0.7, 'monthly', [p.mainImage, ...p.galleryImages.map((g) => g.src)].slice(0, 6))),
    page('/blog', 0.8, 'weekly'),
    ...blogArticles
      .map((a) => page(`/blog/${a.slug}`, 0.7, 'monthly', [a.featuredImage], new Date(a.dateModifiedISO || a.datePublishedISO))),
    page('/about', 0.6, 'yearly'),
    page('/contact', 0.7, 'yearly'),
    page('/quote', 0.8, 'yearly'),
    page('/privacy-policy', 0.2, 'yearly'),
  ];
}
