import { Metadata } from 'next';
import { pageMetadata, PAGE_SEO, abs, breadcrumbSchema, itemListSchema } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import { listProjects } from '@/lib/content';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight, Award, ShieldCheck, Sparkles, Users2, Building, MapPin } from 'lucide-react';
import { siteConfig } from '@/lib/config';
import { PageHero, SectionHead, CtaBand, Reveal } from '@/components/vx/kit';
import { ProjectsListingClient } from './ProjectsListingClient';

export const revalidate = 1800;

export const metadata: Metadata = pageMetadata({ ...PAGE_SEO.projects, path: '/projects' });

const promises = [
  { icon: Award, label: 'Premium craftsmanship' },
  { icon: ShieldCheck, label: 'Durable solutions' },
  { icon: Sparkles, label: 'Modern designs' },
  { icon: Users2, label: 'Customer satisfaction' },
];

const stats = [
  { icon: Building, num: '250+', title: 'Projects', desc: 'Completed across residential and commercial spaces.' },
  { icon: Users2, num: '100+', title: 'Happy clients', desc: 'Trusted by clients for quality and reliability.' },
  { icon: Award, num: '10+', title: 'Years of experience', desc: 'Delivering excellence in metal fabrication.' },
  { icon: MapPin, num: '4+', title: 'Cities served', desc: 'Vijayawada, Hyderabad, Guntur & surrounding areas.' },
];

export default async function ProjectsPage() {
  const allProjects = await listProjects();
  return (
    <div className="vx">
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'CollectionPage', '@id': abs('/projects#page'), url: abs('/projects'), name: 'Veldex Fabrications project gallery', inLanguage: 'en-IN' }} />
      <JsonLd data={itemListSchema('Completed fabrication projects', allProjects.map((p) => ({ name: `${p.title} – ${p.city}`, path: `/projects/${p.slug}`, image: p.mainImage })))} />
      <JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Projects', path: '/projects' }])} />
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <PageHero
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Projects' }]}
        kicker="Our projects"
        title={['Built with precision.', 'Delivered with pride.']}
        lead="Explore our completed projects that showcase our passion for quality, innovation and attention to detail."
        image="/images/gate.jpg"
        imageAlt="Veldex Fabrications Architectural Gate Project"
        actions={
          <>
            <Link href="/quote" className="vx-btn vx-btn-signal">
              Get a quote
              <span className="vx-btn-ico"><ArrowUpRight size={18} /></span>
            </Link>
            <a href="#portfolio" className="vx-link" style={{ color: '#fff' }}>Browse the portfolio <ArrowRight size={16} /></a>
          </>
        }
        meta={
          <ul className="vx-projects-promises">
            {promises.map(({ icon: Icon, label }) => (
              <li key={label}><Icon size={15} strokeWidth={1.6} />{label}</li>
            ))}
          </ul>
        }
      />

      {/* ── 01 PORTFOLIO (client: fetch, filter, search, sort, load more) ── */}
      <ProjectsListingClient projects={allProjects} />

      {/* ── 02 TRACK RECORD ──────────────────────────────────────────────── */}
      <section className="vx-sec vx-sec-white vx-sec-tight">
        <div className="vx-wrap">
          <SectionHead num="02" kicker="Track record" title={['Workshop to site,', 'across the region']} />
          <Reveal className="vx-hairgrid vx-grid-4 vx-projects-stats">
            {stats.map(({ icon: Icon, num, title, desc }) => (
              <div key={title} className="vx-projects-stat">
                <span className="vx-box-icon"><Icon size={20} strokeWidth={1.6} /></span>
                <strong className="vx-projects-stat-num">{num}</strong>
                <span className="vx-projects-stat-title">{title}</span>
                <p>{desc}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <CtaBand
        kicker="Next step"
        title="Have a project in mind?"
        text="From custom automated gates to architectural staircases and pergolas, our fabrication engineers are ready to bring your vision to life."
      />
    </div>
  );
}
