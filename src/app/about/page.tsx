import { Metadata } from 'next';
import { pageMetadata, PAGE_SEO, breadcrumbSchema } from '@/lib/seo';
import Link from 'next/link';
import { Target, Eye, Award, ArrowUpRight, ArrowRight } from 'lucide-react';
import { siteConfig } from '@/lib/config';
import { JsonLd } from '@/components/seo/JsonLd';
import { PageHero, SectionHead, CtaBand, Reveal } from '@/components/vx/kit';

export const metadata: Metadata = pageMetadata({ ...PAGE_SEO.about, path: '/about' });

const standard = [
  { title: 'Certified Grade Steels', body: 'MS and Stainless Steel (SS 304/316) sourced with verifiable batch quality.' },
  { title: 'Advanced Cutting & Jointing', body: 'High-precision CNC fiber laser cuts and seam-welded joints for smooth aesthetics.' },
  { title: 'Protective Coatings', body: 'Multi-stage epoxy primers, hot-dip galvanizing, and UV-resistant PU topcoats.' },
];

const drivers = [
  { icon: Target, title: 'Our Mission', body: 'To deliver robust, aesthetically elevated metal engineering solutions that empower architects, builders, and homeowners with structural dependability and design distinction.' },
  { icon: Eye, title: 'Our Vision', body: 'To become the premier custom metal fabrication and access automation authority across Andhra Pradesh, recognized for engineering excellence and flawless execution.' },
  { icon: Award, title: 'Our Core Values', body: 'Integrity in material specifications, precision in every weld seam, transparent pricing models, and total accountability to client timelines.' },
];

const strengths = [
  { title: 'Skilled Team', desc: 'Certified welders & mechanical installers.' },
  { title: 'Advanced Tools', desc: 'Precision CNC cuts & automated jigs.' },
  { title: 'Quality Materials', desc: 'Tested MS, SS 304/316 & safety glass.' },
  { title: 'Timely Delivery', desc: 'Strict milestone tracking & fast turnaround.' },
  { title: 'Customer First', desc: 'Direct consultation & post-install support.' },
];

export default function AboutPage() {
  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Veldex Fabrications',
    url: `${siteConfig.seo.baseUrl}/about`,
    mainEntity: {
      '@type': 'LocalBusiness',
      name: siteConfig.brand.name,
      description: siteConfig.brand.description,
      address: {
        '@type': 'PostalAddress',
        addressLocality: siteConfig.location.city,
        addressRegion: siteConfig.location.state,
        addressCountry: 'IN',
      },
    },
  };

  return (
    <div className="vx">
      <JsonLd data={aboutSchema} />
      <JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])} />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <PageHero
        crumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]}
        kicker="Our story & capabilities"
        title={['Built on trust.', 'Engineered to last.']}
        lead="From precision laser-cut screens to heavy-duty cantilever gate assemblies, Veldex Fabrications is committed to setting new benchmarks in architectural metal engineering."
        image="/images/hero/hero-welding.jpg"
        imageAlt="Welder at work in warm workshop light"
        actions={
          <>
            <Link href="/quote" className="vx-btn vx-btn-signal">
              Start a project
              <span className="vx-btn-ico"><ArrowUpRight size={18} /></span>
            </Link>
            <Link href="/projects" className="vx-link" style={{ color: '#fff' }}>View projects <ArrowRight size={16} /></Link>
          </>
        }
      />

      {/* ── 01 ETHOS ─────────────────────────────────────────────────────── */}
      <section className="vx-sec">
        <div className="vx-wrap vx-about-ethos">
          <div>
            <SectionHead
              num="01"
              kicker="Engineering ethos"
              title={['Precision craftsmanship', '& rigorous fabrication']}
              className="vx-about-ethos-head"
            />
            <Reveal className="vx-about-copy">
              <p>At Veldex Fabrications, metal is more than a structural material — it is the architectural spine of modern homes, commercial complexes, and industrial installations.</p>
              <p>Rooted in deep fabrication experience and practical workshop mastery, our team approaches every custom gate, spiral staircase, and rooftop gazebo with uncompromising tolerances. We combine heavy-gauge steels with automated drive hardware to ensure long-lasting performance under challenging weather conditions.</p>
              <p>Whether designing a trackless cantilever gate for a luxury villa or outfitting an entire commercial balcony facade with toughened glass balustrades, we manage every step from initial on-site CAD measurement to final PU coating.</p>
            </Reveal>
          </div>

          <Reveal delay={150} className="vx-box vx-box-dark vx-about-standard">
            <span className="vx-kicker"><b>Standard</b><i />Quality benchmark</span>
            <h3 className="vx-h3" style={{ marginTop: '1rem', fontSize: '1.6rem' }}>The Veldex Standard</h3>
            <ol className="vx-about-standard-list">
              {standard.map((item, i) => (
                <li key={item.title}>
                  <span className="vx-box-num">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* ── 02 MISSION / VISION / VALUES ─────────────────────────────────── */}
      <section className="vx-sec vx-sec-white">
        <div className="vx-wrap">
          <SectionHead
            num="02"
            kicker="What drives us"
            title={['Mission, vision', '& values']}
          />
          <Reveal className="vx-hairgrid vx-grid-3">
            {drivers.map(({ icon: Icon, title, body }, i) => (
              <div key={title} className="vx-about-driver">
                <div className="flex items-center justify-between">
                  <span className="vx-box-icon"><Icon size={20} strokeWidth={1.6} /></span>
                  <span className="vx-box-num">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="vx-h3" style={{ marginTop: '1.75rem' }}>{title}</h3>
                <p className="vx-body" style={{ marginTop: '0.75rem', fontSize: '0.98rem' }}>{body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── 03 WHY CHOOSE VELDEX ─────────────────────────────────────────── */}
      <section className="vx-sec">
        <div className="vx-wrap">
          <SectionHead
            num="03"
            kicker="Proven strengths"
            title={['Why choose', 'Veldex?']}
            aside="Five reasons architects, builders and homeowners across Andhra Pradesh trust us with their metalwork."
          />
          <div className="vx-about-strengths">
            {strengths.map((item, i) => (
              <Reveal key={item.title} delay={i * 80} className="vx-about-strength">
                <span className="vx-about-strength-num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="vx-h3">{item.title}</h3>
                <p>{item.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <CtaBand
        kicker="Next step"
        title="Ready to discuss your project?"
        text="Our engineering team is ready to review your site requirements in Vijayawada and surrounding regions."
      />
    </div>
  );
}
