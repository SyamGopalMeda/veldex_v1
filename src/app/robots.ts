import { MetadataRoute } from 'next';
import { abs, SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api/admin', '/wa'] }],
    sitemap: abs('/sitemap.xml'),
    host: SITE_URL,
  };
}
