import { notFound } from 'next/navigation';
import { listArticles } from '@/lib/content';
import { blogArticles } from '@/lib/blogData';
import { BlogFormClient } from '../../BlogFormClient';

export const dynamic = 'force-dynamic';

interface EditBlogPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = await params;
  const slug = blogArticles.find((a) => a.id === id)?.slug ?? decodeURIComponent(id);
  const article = (await listArticles(true)).find((a) => a.slug === slug);
  if (!article) notFound();
  return <BlogFormClient key={article.slug} initialData={article} isEdit />;
}
