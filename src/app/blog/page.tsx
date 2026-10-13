import { Metadata } from 'next';
import { pageMetadata, PAGE_SEO, abs, orgRef, breadcrumbSchema, itemListSchema } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import { listArticles } from '@/lib/content';
import { BlogListingView } from '@/components/blog/BlogListingView';

export const metadata: Metadata = pageMetadata({ ...PAGE_SEO.blog, path: '/blog' });

export default async function BlogPage() {
  const posts = await listArticles();
  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Blog', '@id': abs('/blog#blog'), url: abs('/blog'), name: 'Veldex Fabrications blog', inLanguage: 'en-IN', publisher: orgRef }} />
      <JsonLd data={itemListSchema('Articles', posts.map((a) => ({ name: a.title, path: `/blog/${a.slug}`, image: a.featuredImage })))} />
      <JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }])} />
      <BlogListingView articles={posts} />
    </>
  );
}
