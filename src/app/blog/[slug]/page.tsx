import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { listArticles, getArticle } from '@/lib/content';
import { BlogDetailView } from '@/components/blog/BlogDetailView';
import { pageMetadata, abs, orgRef, breadcrumbSchema } from '@/lib/seo';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return (await listArticles()).map((article) => ({
      slug: article.slug,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return {
      title: { absolute: 'Article not found | Veldex Fabrications' },
      robots: { index: false },
    };
  }

  const raw = (article.metaTitle || article.title).replace(/\s*\|\s*Veldex Fabrications\s*$/i, '');
  const title = `${raw} | Veldex Fabrications`.length <= 62 ? `${raw} | Veldex Fabrications` : `${raw} | Veldex`;
  return pageMetadata({
    title,
    description: (article.metaDescription || article.excerpt).slice(0, 165),
    path: `/blog/${article.slug}`,
    image: article.socialImage || article.featuredImage,
    type: 'article',
    publishedTime: article.datePublishedISO,
    modifiedTime: article.dateModifiedISO,
  });
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const canonicalUrl = abs(`/blog/${article.slug}`);
  const imageUrl = abs(article.featuredImage);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      '@id': `${canonicalUrl}#article`,
      headline: article.title,
      description: article.metaDescription || article.excerpt,
      image: [imageUrl],
      datePublished: article.datePublishedISO,
      dateModified: article.dateModifiedISO,
      inLanguage: 'en-IN',
      articleSection: article.category,
      author: orgRef,
      publisher: orgRef,
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
      keywords: article.tags.join(', '),
    },
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Blog', path: '/blog' },
      { name: article.title, path: `/blog/${article.slug}` },
    ]),
  ];


  const all = await listArticles();
  const preferred = (article.relatedArticleSlugs ?? []).map((s) => all.find((a) => a.slug === s)).filter((a): a is NonNullable<typeof a> => Boolean(a));
  const relatedArticles = [...preferred, ...all.filter((a) => a.slug !== article.slug && a.categorySlug === article.categorySlug), ...all.filter((a) => a.slug !== article.slug)]
    .filter((a, i, arr) => a.slug !== article.slug && arr.findIndex((b) => b.slug === a.slug) === i).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogDetailView article={article} relatedArticles={relatedArticles} allArticles={all} />
    </>
  );
}
