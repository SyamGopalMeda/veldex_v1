import type { Metadata } from 'next';
import Link from 'next/link';
import { pageMetadata, PAGE_SEO } from '@/lib/seo';
import Image from 'next/image';
import {
  ShieldCheck,
  Columns,
  ArrowUpRight,
  Home as HomeIcon,
  Layers,
  Grid3X3,
  CheckCircle2,
  Wrench,
  Users2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { siteConfig } from '@/lib/config';
import { getFeaturedProjects } from '@/lib/firestore';
import { seedServices } from '@/lib/siteData';
import { listProjects, getHeroConfig, getSiteSettings, getServicesView } from '@/lib/content';
import { JsonLd } from '@/components/seo/JsonLd';
import { LaserCutVisual } from '@/components/ui/LaserCutVisual';
import { Reveal, Lines } from '@/components/vx/Reveal';
import { HeroSplit, type SplitSlide } from '@/components/vx/HeroSplit';
import { ProcessReel, type ReelStage } from '@/components/vx/ProcessReel';
import { ProjectGallery } from '@/components/vx/ProjectGallery';
import { QuoteBuilder } from '@/components/vx/QuoteBuilder';
import { BlueprintVisual } from '@/components/vx/BlueprintVisual';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  return pageMetadata({
    title: s.defaultSeoTitle || PAGE_SEO.home.title,
    description: s.defaultMetaDescription || PAGE_SEO.home.description,
    path: '/',
    image: s.defaultOgImage || undefined,
  });
}

export default async function HomePage() {
  const svc = await getServicesView();
  const services = svc.published;
  const projects = await getFeaturedProjects(6);
  const [hero, publishedProjects] = await Promise.all([getHeroConfig(), listProjects()]);



  const masterServices = [
    {
      name: 'GATE FABRICATION & AUTOMATION',
      shortDescription: 'Sliding, swing & trackless gates with advanced automation solutions.',
      slug: 'gate-automation',
      img: '/images/stock/gate-wrought-iron-garden.jpg',
      icon: ShieldCheck,
    },
    {
      name: 'ARCHITECTURAL RAILINGS & GLASS BALUSTRADES',
      shortDescription: 'Premium stainless steel & glass railings for safety and architectural elegance.',
      slug: 'railings',
      img: '/images/stock/interior-ornate-spiral-railing.jpg',
      icon: Columns,
    },
    {
      name: 'CUSTOM STRUCTURAL STAIRCASES',
      shortDescription: 'Spiral, monostring & industrial staircases built with precision and strength.',
      slug: 'staircases',
      img: '/images/stock/interior-dark-staircase.jpg',
      icon: ArrowUpRight,
    },
    {
      name: 'PERGOLAS, GAZEBOS & ROOFTOP CANOPIES',
      shortDescription: 'Modern pergolas, gazebos & rooftop canopies designed for beauty and comfort.',
      slug: 'pergolas-gazebos',
      img: '/images/stock/exterior-modern-pergola.jpg',
      icon: HomeIcon,
    },
    {
      name: 'TERRACE SHEDS & STRUCTURAL ROOFING',
      shortDescription: 'Durable sheds, roofing solutions & industrial structures for every need.',
      slug: 'sheds-roofing',
      img: '/images/stock/exterior-steel-roof-structure.jpg',
      icon: Layers,
    },
    {
      name: 'BUILDING ELEVATIONS & CNC METALWORK',
      shortDescription: 'CNC laser-cut panels, facades & custom metal works that define architecture.',
      slug: 'elevations-facades',
      img: '/images/stock/exterior-decorative-panel.jpg',
      icon: Grid3X3,
    },
  ];

  const showcaseProjects = [
    { title: 'MODERN LASER CUT GATE', category: 'GATES & DOORS', location: 'Vijayawada, Andhra Pradesh', img: '/images/gate.jpg' },
    { title: 'ARCHITECTURAL SPIRAL STAIRS', category: 'STAIRCASES', location: 'Vijayawada, Andhra Pradesh', img: '/images/stairs.jpg' },
    { title: 'SS RAILINGS WITH GLASS', category: 'RAILINGS', location: 'Eluru, Andhra Pradesh', img: '/images/railings.jpg' },
    { title: 'KERALA STYLE GAZEBO', category: 'GAZEBOS', location: 'Vijayawada, Andhra Pradesh', img: '/images/gazebo.jpg' },
    { title: 'LASER CUT PANEL FACADE', category: 'PANELS', location: 'Vijayawada, Andhra Pradesh', img: '/images/elevation.jpg' },
    { title: 'ROOFTOP PERGOLA SETUP', category: 'PERGOLAS', location: 'Vijayawada, Andhra Pradesh', img: '/images/hero_welder.jpg' },
  ];

  // ── View data (all copy and lists come from existing site data) ──────────
  const values = [
    { Icon: CheckCircle2, title: 'Quality Materials', body: 'We use only the finest raw materials known for maximum durability.' },
    { Icon: Wrench, title: 'Expert Craftsmanship', body: 'Skilled professionals ensuring precision in every detail.' },
    { Icon: Users2, title: 'Customer Focused', body: 'Your satisfaction is our priority.' },
    { Icon: Clock, title: 'On Time Delivery', body: 'Committed to delivering on time, every time.' },
  ];

  // Join the home card list with live (Firestore) or seed service records for materials.
  const serviceRecords = masterServices.filter((m) => svc.isPublished(m.slug)).map((m) => {
    const rec = services.find((s) => s.slug === m.slug) ?? seedServices.find((s) => s.slug === m.slug);
    return { ...m, displayName: rec?.name ?? m.name, materials: rec?.materials ?? [] };
  });

  // Hero slides — headlines come from the existing site (tagline, Services and
  // About page headlines); materials come from each service's record.
  const materialsFor = (slug: string) => serviceRecords.find((r) => r.slug === slug)?.materials ?? [];
  // Hero slides, timing and stats are managed in Admin → Hero (Firestore settings/hero)
  const heroSlides: SplitSlide[] = hero.slides
    .filter((h) => h.enabled)
    .map((h) => ({
      img: h.img,
      mobileImg: h.mobileImg,
      alt: h.alt,
      eyebrow: h.eyebrow,
      headline: h.headline,
      text: h.text,
      cta: { label: h.ctaLabel, href: h.ctaHref },
      materials: h.materialsService ? materialsFor(h.materialsService) : [],
    }));

  const stages: ReelStage[] = [
    { key: 'measure', title: 'Measure', body: 'Every job starts with initial on-site CAD measurement.', media: <BlueprintVisual /> },
    { key: 'cut', title: 'Cut', body: 'From precision laser-cut screens to heavy-duty cantilever gate assemblies.', media: <div style={{ position: 'absolute', inset: 0 }}><LaserCutVisual /></div> },
    { key: 'fabricate', title: 'Fabricate', body: 'Heavy-gauge steels, fabricated with uncompromising tolerances.', media: <Image src="/images/hero_welder.jpg" alt="Welder fabricating a steel frame" fill sizes="(max-width: 900px) 100vw, 560px" /> },
    { key: 'finish', title: 'Finish', body: 'Final PU coating for long-lasting performance under challenging weather conditions.', media: <Image src="/images/mat_powder_coat.jpg" alt="Coated metal finish" fill sizes="(max-width: 900px) 100vw, 560px" /> },
    { key: 'deliver', title: 'Deliver', body: 'Committed to delivering on time, every time.', media: <Image src="/images/gate.jpg" alt="Installed automated gate" fill sizes="(max-width: 900px) 100vw, 560px" /> },
  ];

  const materials = [
    { name: 'Mild Steel', img: '/images/mat_mild_steel.jpg' },
    { name: 'Stainless Steel', img: '/images/mat_stainless_steel.jpg' },
    { name: 'Aluminium', img: '/images/mat_aluminium.jpg' },
    { name: 'Galvanized Steel', img: '/images/mat_galvanized.jpg' },
    { name: 'Toughened Glass', img: '/images/mat_toughened_glass.jpg' },
    { name: 'Polycarbonate', img: '/images/mat_polycarbonate.jpg' },
    { name: 'Wood Finish', img: '/images/mat_wood_treads.jpg' },
    { name: 'Powder Coated', img: '/images/mat_powder_coat.jpg' },
  ];

  const galleryProjects = [...publishedProjects]
    .sort((a, b) => Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured)))
    .map((p) => ({ slug: p.slug, title: p.title, category: p.category, categoryValue: p.categoryValue, city: p.city, year: p.year, img: p.mainImage }));

  const builderServices = serviceRecords.map((s) => ({ slug: s.slug, name: s.displayName, materials: s.materials }));

  return (
    <div className="vx">
      <noscript>
        <style>{`[data-reveal]{opacity:1!important;transform:none!important}.vx-line>span{transform:none!important}`}</style>
      </noscript>

      {/* ══ HERO — full-screen 3D slice background ═════════════════════════ */}
      <HeroSplit slides={heroSlides} intervalMs={hero.intervalMs} stats={hero.stats} />

      {/* ══ VALUES ════════════════════════════════════════════════════════ */}
      <section style={{ background: 'var(--vx-white)', borderBottom: '1px solid var(--vx-line)' }}>
        <div className="vx-wrap vx-values-band">
          {values.map(({ Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 90}>
              <Icon size={18} strokeWidth={1.6} style={{ color: 'var(--vx-signal-ink)' }} />
              <div style={{ marginTop: '0.85rem', fontWeight: 500 }}>{title}</div>
              <p>{body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ 01 SERVICES — blueprint grid with vision-scan reveal ══════════ */}
      <section className="vx-sec" id="services">
        <div className="vx-wrap">
          <div className="vx-head">
            <div>
              <Reveal mode="fade"><span className="vx-kicker"><b>01</b><i />Services</span></Reveal>
              <Reveal as="h2" mode="lines" className="vx-h2" style={{ marginTop: '1.25rem' }}>
                <Lines lines={['Comprehensive', 'services']} />
              </Reveal>
            </div>
            <Reveal delay={150}>
              <p className="vx-body" style={{ margin: 0 }}>
                At Veldex Fabrications, metal is more than a structural material — it is the architectural spine of modern homes, commercial complexes, and industrial installations.
              </p>
            </Reveal>
          </div>

          <Reveal className="vx-grid-sheet">
            {serviceRecords.map((s, i) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="vx-svc">
                <div className="vx-svc-top">
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <span className="vx-svc-idx">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="vx-h3" style={{ maxWidth: '16rem' }}>{s.displayName}</h3>
                  </div>
                  <span className="vx-svc-go"><ArrowUpRight size={17} /></span>
                </div>
                <div className="vx-scan">
                  <Image src={s.img} alt={`${s.displayName} — custom metalwork by Veldex Fabrications`} fill sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 420px" className="vx-scan-base" />
                  <span className="vx-scan-grid" />
                  <span className="vx-scan-color">
                    <Image src={s.img} alt={s.displayName} fill sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 420px" />
                  </span>
                  <span className="vx-scan-beam" />
                  <span className="vx-scan-mark tl" /><span className="vx-scan-mark br" />
                  <span className="vx-scan-label">View service</span>
                </div>
                <p className="vx-body" style={{ margin: 0, fontSize: '0.95rem' }}>{s.shortDescription}</p>
                {s.materials.length > 0 && (
                  <p className="vx-svc-mat" style={{ margin: 'auto 0 0' }}><b>Materials</b> — {s.materials.join(' · ')}</p>
                )}
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ══ 02 PROCESS — pinned horizontal reel ═══════════════════════════ */}
      <section className="vx-dark vx-reel-sec">
        <ProcessReel
          stages={stages}
          header={
            <div className="vx-head" style={{ marginBottom: 0 }}>
              <div>
                <span className="vx-kicker"><b>02</b><i />How we work</span>
                <h2 className="vx-h2" style={{ marginTop: '1.25rem' }}>From CAD measurement<br />to final PU coating</h2>
              </div>
              <p className="vx-body" style={{ margin: 0 }}>
                Rooted in deep fabrication experience and practical workshop mastery, our team approaches every custom gate, spiral staircase, and rooftop gazebo with uncompromising tolerances.
              </p>
            </div>
          }
        />
      </section>

      {/* ══ 03 MATERIALS — expanding slats ════════════════════════════════ */}
      <section className="vx-sec">
        <div className="vx-wrap">
          <div className="vx-head">
            <div>
              <Reveal mode="fade"><span className="vx-kicker"><b>03</b><i />Materials</span></Reveal>
              <Reveal as="h2" mode="lines" className="vx-h2" style={{ marginTop: '1.25rem' }}>
                <Lines lines={['Materials we', 'work with']} />
              </Reveal>
            </div>
            <Reveal delay={150}>
              <p className="vx-body" style={{ margin: 0 }}>
                We work with mild steel (MS), stainless steel (SS 304), and wrought iron to create gates that combine strength with aesthetic appeal.
              </p>
            </Reveal>
          </div>
          <Reveal className="vx-slats">
            {materials.map((m, i) => (
              <div key={m.name} className="vx-slat" tabIndex={0} aria-label={m.name}>
                <Image src={m.img} alt="" fill sizes="(max-width: 960px) 50vw, 600px" />
                <span className="vx-slat-idx">{String(i + 1).padStart(2, '0')}</span>
                <span className="vx-slat-name">{m.name}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ══ 04 PROJECTS — filterable gallery of real project pages ═══════ */}
      <section className="vx-sec" style={{ background: 'var(--vx-white)' }}>
        <div className="vx-wrap">
          <div className="vx-head">
            <div>
              <Reveal mode="fade"><span className="vx-kicker"><b>04</b><i />Projects</span></Reveal>
              <Reveal as="h2" mode="lines" className="vx-h2" style={{ marginTop: '1.25rem' }}>
                <Lines lines={['Recent', 'projects']} />
              </Reveal>
            </div>
            <Reveal delay={150} style={{ justifySelf: 'end' }}>
              <Link href="/projects" className="vx-link">View all projects <ArrowRight size={16} /></Link>
            </Reveal>
          </div>
          <Reveal>
            <ProjectGallery projects={galleryProjects} />
          </Reveal>
        </div>
      </section>

      {/* ══ 05 QUOTE — brief builder ══════════════════════════════════════ */}
      <section className="vx-sec vx-dark">
        <div className="vx-wrap">
          <div className="vx-head">
            <div>
              <Reveal mode="fade"><span className="vx-kicker"><b>05</b><i />Start a project</span></Reveal>
              <Reveal as="h2" mode="lines" className="vx-h2" style={{ marginTop: '1.25rem' }}>
                <Lines lines={['Have a custom', 'requirement?']} />
              </Reveal>
            </div>
            <Reveal delay={150}>
              <p className="vx-body" style={{ margin: 0 }}>
                Send us your site dimensions, blueprints, or architectural concepts. Our engineering team provides fast turnaround custom quotations.
              </p>
            </Reveal>
          </div>
          <Reveal>
            <QuoteBuilder services={builderServices} />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
