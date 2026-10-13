import { Metadata } from 'next';
import { pageMetadata, PAGE_SEO, breadcrumbSchema } from '@/lib/seo';
import { getServicesView } from '@/lib/content';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Columns,
  ArrowUpRight,
  Home as HomeIcon,
  Layers,
  Grid3X3,
  ArrowRight,
  Clock,
  Users2,
  Headphones,
} from 'lucide-react';
import { siteConfig } from '@/lib/config';
import { seedServices } from '@/lib/siteData';
import { JsonLd } from '@/components/seo/JsonLd';
import { PageHero, SectionHead, CtaBand, Reveal } from '@/components/vx/kit';

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({ ...PAGE_SEO.services, path: '/services' });

const coreServicesAll = [
  {
    title: 'GATE FABRICATION & AUTOMATION',
    description: 'Custom designed gates with advanced automation for security, convenience and style.',
    slug: 'gate-automation',
    img: '/images/stock/gate-wrought-iron-garden.jpg',
    icon: ShieldCheck,
  },
  {
    title: 'RAILINGS & BALUSTRADES',
    description: 'Premium quality railings and balustrades in steel, glass and stainless steel.',
    slug: 'railings',
    img: '/images/stock/interior-ornate-spiral-railing.jpg',
    icon: Columns,
  },
  {
    title: 'CUSTOM STAIRCASES',
    description: 'Elegant and durable staircases tailored to your space and design preferences.',
    slug: 'staircases',
    img: '/images/stock/interior-dark-staircase.jpg',
    icon: ArrowUpRight,
  },
  {
    title: 'PERGOLAS & GAZEBOS',
    description: 'Bespoke pergolas, gazebos and canopies that blend comfort with aesthetics.',
    slug: 'pergolas-gazebos',
    img: '/images/stock/exterior-modern-pergola.jpg',
    icon: HomeIcon,
  },
  {
    title: 'SHEDS & ROOFING',
    description: 'Strong and reliable sheds and roofing solutions for all environments.',
    slug: 'sheds-roofing',
    img: '/images/stock/exterior-steel-roof-structure.jpg',
    icon: Layers,
  },
  {
    title: 'ELEVATIONS & METALWORK',
    description: 'Custom elevations and metalworks that enhance the look and value of your property.',
    slug: 'elevations-facades',
    img: '/images/stock/exterior-decorative-panel.jpg',
    icon: Grid3X3,
  },
];

const qualityPoints = [
  {
    icon: ShieldCheck,
    title: 'QUALITY ASSURANCE',
    body: 'Every product undergoes strict quality checks to ensure long-lasting performance.',
  },
  {
    icon: Users2,
    title: 'EXPERT TEAM',
    body: 'Skilled engineers and fabricators with years of experience in precision metalwork.',
  },
  {
    icon: Clock,
    title: 'ON-TIME DELIVERY',
    body: 'We value your time and ensure timely delivery with efficient project management.',
  },
  {
    icon: Headphones,
    title: 'AFTER-SALES SUPPORT',
    body: "Our support doesn't end at delivery. We're here for assistance whenever you need.",
  },
];

/** Display helper: renders ALL-CAPS data labels in title case (data itself is unchanged). */
function titleCase(value: string) {
  if (value !== value.toUpperCase()) return value;
  return value
    .split(' ')
    .map((w) => (w.length > 1 ? w[0] + w.slice(1).toLowerCase() : w))
    .join(' ');
}

const pad = (n: number) => String(n).padStart(2, '0');

export default async function ServicesPage() {
  const svc = await getServicesView();
  const coreServices = coreServicesAll.filter((c) => svc.isPublished(c.slug)).map((c) => ({ ...c, title: svc.get(c.slug)?.name ?? c.title }));
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Custom Metal Fabrication Services | Veldex Fabrications',
    description: metadata.description,
    url: `${siteConfig.seo.baseUrl}/services`,
    hasPart: coreServices.map((s) => ({
      '@type': 'Service',
      name: s.title,
      description: s.description,
      url: `${siteConfig.seo.baseUrl}/services/${s.slug}`,
      provider: {
        '@type': 'LocalBusiness',
        name: siteConfig.brand.name,
      },
    })),
  };

  // Material lists come from the shared service records (display only).
  const materialsBySlug = new Map(seedServices.map((s) => [s.slug, s.materials]));

  return (
    <div className="vx">
      <JsonLd data={collectionSchema} />
      <JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }])} />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <PageHero
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Services' }]}
        kicker="Our services"
        title={['Engineered solutions.', 'Built to last.']}
        lead="At Veldex Fabrications, we deliver precision-engineered metal fabrication and architectural metalwork solutions for residential, commercial and industrial projects."
        image="/images/stock/exterior-modern-house-driveway.jpg"
        imageAlt="Veldex Metal Fabrication Workshop"
        actions={
          <>
            <a href="#catalogue" className="vx-btn vx-btn-signal">
              Explore services
              <span className="vx-btn-ico"><ArrowRight size={18} /></span>
            </a>
            <Link href="/contact" className="vx-link" style={{ color: '#fff' }}>Send lead form <ArrowUpRight size={16} /></Link>
          </>
        }
      />

      {/* ── 01 CATALOGUE — numbered service index ───────────────────────── */}
      <section className="vx-sec" id="catalogue">
        <div className="vx-wrap">
          <SectionHead
            num="01"
            kicker="What we offer"
            title={['Our core', 'services']}
            aside="Precision-engineered metalwork for residential, commercial and industrial projects. Select a service to see its scope, materials, features and recent work."
          />

          <ol className="vx-services-index">
            {coreServices.map((service, i) => {
              const Icon = service.icon;
              const name = titleCase(service.title);
              const materials = materialsBySlug.get(service.slug) ?? [];
              return (
                <Reveal as="li" key={service.slug} delay={(i % 3) * 70}>
                  <Link href={`/services/${service.slug}`} className="vx-services-row">
                    <span className="vx-services-num">{pad(i + 1)}</span>

                    <div className="vx-services-title">
                      <span className="vx-box-icon"><Icon size={19} strokeWidth={1.6} /></span>
                      <h3 className="vx-h3">{name}</h3>
                    </div>

                    <div className="vx-services-copy">
                      <p>{service.description}</p>
                      {materials.length > 0 && (
                        <p className="vx-svc-mat"><b>Materials</b> — {materials.join(' · ')}</p>
                      )}
                      <span className="vx-services-more">View details <ArrowRight size={15} /></span>
                    </div>

                    <div className="vx-services-thumb">
                      <Image
                        src={service.img}
                        alt={name}
                        fill
                        sizes="(max-width: 899px) calc(100vw - 2.5rem), 300px"
                      />
                      <span className="vx-services-go" aria-hidden="true"><ArrowUpRight size={18} /></span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ── 02 QUALITY — four commitments ───────────────────────────────── */}
      <section className="vx-sec vx-sec-white vx-sec-tight">
        <div className="vx-wrap">
          <SectionHead
            num="02"
            kicker="Our commitment"
            title={['Quality from the', 'workshop to your site']}
          />
          <Reveal className="vx-hairgrid vx-grid-4">
            {qualityPoints.map(({ icon: Icon, title, body }, i) => (
              <div key={title} className="vx-services-point">
                <div className="flex items-center justify-between">
                  <span className="vx-box-icon"><Icon size={20} strokeWidth={1.6} /></span>
                  <span className="vx-box-num">{pad(i + 1)}</span>
                </div>
                <h3 className="vx-h3" style={{ marginTop: '1.75rem' }}>{titleCase(title)}</h3>
                <p className="vx-body" style={{ marginTop: '0.75rem', fontSize: '0.95rem' }}>{body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <CtaBand
        kicker="Next step"
        title="Have a project in mind?"
        text="Let's build something extraordinary together. Get in touch with our team today."
      />
    </div>
  );
}
