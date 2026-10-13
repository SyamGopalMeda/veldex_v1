import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { listProjects, getProject, getRelated } from '@/lib/content';
import { ProjectDetailClient } from './ProjectDetailClient';
import { pageMetadata, abs, orgRef, breadcrumbSchema } from '@/lib/seo';

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return (await listProjects()).map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {
      title: { absolute: 'Project not found | Veldex Fabrications' },
      robots: { index: false },
    };
  }

  const city = (project.city || project.location).split(',')[0].trim();
  const full = `${project.title} in ${city} | ${project.category} – Veldex`;
  const title = full.length <= 62 ? full : `${project.title} in ${city} | Veldex Fabrications`.slice(0, 70);
  const base = project.shortDescription.trim().replace(/\.?$/, '.');
  const long = `${base} ${project.category} project by Veldex Fabrications in ${project.location}.`;
  const description = long.length <= 160 ? long : `${base} ${project.category} project by Veldex in ${city}.`.slice(0, 160);
  return pageMetadata({ title: project.seoTitle || title, description: project.seoDescription || description, path: `/projects/${project.slug}`, image: project.mainImage });
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  const relatedProjects = await getRelated(project.slug, project.categoryValue, 3);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      '@id': abs(`/projects/${project.slug}#project`),
      name: project.title,
      description: project.shortDescription,
      url: abs(`/projects/${project.slug}`),
      image: [project.mainImage, ...project.galleryImages.map((g) => g.src)].slice(0, 6).map(abs),
      genre: project.category,
      creator: orgRef,
      locationCreated: { '@type': 'Place', name: project.location },
      dateCreated: project.year,
    },
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Projects', path: '/projects' },
      { name: project.title, path: `/projects/${project.slug}` },
    ]),
  ];


  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProjectDetailClient project={project} relatedProjects={relatedProjects} />
    </>
  );
}
