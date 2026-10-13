import { notFound } from 'next/navigation';
import { listProjects } from '@/lib/content';
import { allProjects } from '@/lib/projectsData';
import { ProjectFormClient } from '../../ProjectFormClient';

export const dynamic = 'force-dynamic';

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  const all = await listProjects(true);
  // accept the slug, or a legacy built-in id such as "p-1"
  const slug = allProjects.find((p) => p.id === id)?.slug ?? decodeURIComponent(id);
  const project = all.find((p) => p.slug === slug);
  if (!project) notFound();
  return <ProjectFormClient key={project.slug} initialData={project} isEdit />;
}
