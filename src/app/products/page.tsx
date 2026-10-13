import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShieldCheck, 
  Settings, 
  CheckCircle2, 
  Headphones, 
  ArrowRight,
  MessageCircle,
  Columns,
  ArrowUpRight,
  Home as HomeIcon,
  Layers,
  Grid3X3,
  Sparkles,
  Sliders,
  Wrench,
  Compass
} from 'lucide-react';
import { siteConfig, buildQuoteWhatsAppLink } from '@/lib/config';
import { JsonLd } from '@/components/seo/JsonLd';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Custom Metal Fabrication Products Catalog | Veldex Fabrications',
  description:
    'Explore custom fabricated metal products by Veldex Fabrications: automated sliding gates, SS & glass balustrades, structural staircases, pergolas & gazebos, terrace sheds, and decorative laser cut panels across Vijayawada.',
  alternates: {
    canonical: `${siteConfig.seo.baseUrl}/products`,
  },
  openGraph: {
    title: 'Custom Fabricated Products Catalog | Veldex Fabrications',
    description:
      'Explore our wide range of premium metal fabrication products designed for durability, aesthetics and long-lasting performance.',
    url: `${siteConfig.seo.baseUrl}/products`,
  },
};

const productCategories = [
  {
    title: 'Gates & Doors',
    subtitle: 'Sliding, Swing, Bi-fold, Laser Cut',
    img: '/images/gate.jpg',
    icon: ShieldCheck,
    href: '/services/gate-automation',
  },
  {
    title: 'Railings & Balustrades',
    subtitle: 'SS, Glass, MS, Aluminium Railings',
    img: '/images/railings.jpg',
    icon: Columns,
    href: '/services/railings',
  },
  {
    title: 'Staircases',
    subtitle: 'Spiral, Floating, Straight, Cantilever',
    img: '/images/stairs.jpg',
    icon: ArrowUpRight,
    href: '/services/staircases',
  },
  {
    title: 'Pergolas & Gazebos',
    subtitle: 'Custom Outdoor Structures',
    img: '/images/gazebo.jpg',
    icon: HomeIcon,
    href: '/services/pergolas-gazebos',
  },
  {
    title: 'Terrace Sheds & Roofing',
    subtitle: 'Metal, Polycarbonate, Insulated',
    img: '/images/sheds.jpg',
    icon: Layers,
    href: '/services/sheds-roofing',
  },
  {
    title: 'Fences & Compound Walls',
    subtitle: 'Decorative & Security Fences',
    img: '/images/gate_proj_2.jpg',
    icon: Grid3X3,
    href: '/services/elevations-facades',
  },
  {
    title: 'Laser Cut Panels',
    subtitle: 'Decorative Screens & Facades',
    img: '/images/mat_decorative.jpg',
    icon: Sparkles,
    href: '/services/elevations-facades',
  },
  {
    title: 'Custom Metal Items',
    subtitle: 'Table, Planters, Shelves & More',
    img: '/images/hero_welder.jpg',
    icon: Wrench,
    href: '/contact',
  },
];

const materialOptions = [
  { name: 'Mild Steel', img: '/images/mat_mild_steel.jpg' },
  { name: 'Stainless Steel', img: '/images/mat_stainless_steel.jpg' },
  { name: 'Aluminium', img: '/images/mat_aluminium.jpg' },
  { name: 'Glass', img: '/images/mat_toughened_glass.jpg' },
  { name: 'Wood Finish', img: '/images/mat_wood_treads.jpg' },
  { name: 'Powder Coated', img: '/images/mat_color_coated.jpg' },
];

const whyChooseBenefits = [
  {
    icon: Settings,
    title: 'Durable & Reliable',
    description: 'Built to withstand time, weather and usage.',
  },
  {
    icon: Compass,
    title: 'Aesthetic Designs',
    description: 'Modern, stylish and elegant designs for every need.',
  },
  {
    icon: Sliders,
    title: 'Customizable',
    description: 'Tailored to match your space and preferences.',
  },
  {
    icon: CheckCircle2,
    title: 'Quality Assured',
    description: 'Strict quality checks at every stage of manufacturing.',
  },
];

export default function ProductsPage() {
  const catalogSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Custom Fabricated Products | Veldex Fabrications',
    description: metadata.description,
    url: `${siteConfig.seo.baseUrl}/products`,
    hasPart: productCategories.map((c) => ({
      '@type': 'Product',
      name: c.title,
      description: c.subtitle,
      url: `${siteConfig.seo.baseUrl}${c.href}`,
      brand: {
        '@type': 'Brand',
        name: siteConfig.brand.name,
      },
    })),
  };

  return (
    <>
      <JsonLd data={catalogSchema} />

      {/* ══════════════════════════════════════════════════════════════════
          1. HERO SECTION (SPLIT-IMAGE HERO)
          ══════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 border-b overflow-hidden" style={{ background: '#F4F2EE', borderColor: '#DCD8CF' }}>
        
        {/* Right background image for full hero ambient */}
        <div className="absolute top-0 right-0 w-full lg:w-[62%] h-full z-0 overflow-hidden pointer-events-none hidden md:block">
          <Image
            src="/images/gate.jpg"
            alt="Veldex Architectural Metal Products"
            fill
            priority
            sizes="62vw"
            className="object-cover object-center"
          />
          {/* Smooth left white gradient to ensure pristine text readability */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to right, #F4F2EE 0%, rgba(244,242,238,0.98) 28%, rgba(244,242,238,0.70) 52%, rgba(244,242,238,0.15) 82%, rgba(244,242,238,0.30) 100%)',
            }}
          />
        </div>

        <div className="section-container relative z-10 w-full">
          
          {/* Eyebrow with green bar */}
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-6 h-[2px]" style={{ background: '#121211' }} />
            <span className="text-xs font-bold uppercase tracking-[0.25em] font-[family-name:var(--font-barlow)]" style={{ color: '#121211' }}>
              OUR PRODUCTS
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Heading, Description & 4 Highlights */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase font-[family-name:var(--font-barlow)] leading-[1.05] tracking-tight" style={{ color: '#121211' }}>
                QUALITY PRODUCTS.<br />
                <span style={{ color: '#121211' }}>CRAFTED WITH PRECISION.</span>
              </h1>

              {/* Description */}
              <p className="text-xs sm:text-sm md:text-base font-[family-name:var(--font-inter)] leading-relaxed max-w-xl font-medium" style={{ color: '#66635B' }}>
                Explore our wide range of premium metal fabrication products designed for durability, aesthetics and long-lasting performance for every space.
              </p>

              {/* 4 Compact Highlights in Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 max-w-xl border-t" style={{ borderColor: '#DCD8CF' }}>
                {[
                  { Icon: ShieldCheck, line1: 'PREMIUM', line2: 'QUALITY' },
                  { Icon: Settings, line1: 'PRECISION', line2: 'CRAFTED' },
                  { Icon: CheckCircle2, line1: 'CUSTOM', line2: 'BUILT' },
                  { Icon: Headphones, line1: 'RELIABLE', line2: 'SUPPORT' },
                ].map(({ Icon, line1, line2 }) => (
                  <div key={line1} className="text-center sm:text-left flex flex-col items-center sm:items-start">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center mb-1.5" style={{ color: '#121211', background: '#EBE8E1' }}>
                      <Icon size={18} strokeWidth={2} />
                    </div>
                    <span className="text-[11px] font-bold font-[family-name:var(--font-barlow)] uppercase tracking-wider leading-tight" style={{ color: '#121211' }}>
                      {line1}<br />{line2}
                    </span>
                  </div>
                ))}
              </div>

            </div>

            {/* Right Column: Hero Visual (Visible on Mobile) */}
            <div className="lg:col-span-5 md:hidden">
              <div className="aspect-[16/11] relative rounded-2xl overflow-hidden shadow-lg border" style={{ borderColor: '#DCD8CF' }}>
                <Image
                  src="/images/gate.jpg"
                  alt="Veldex Metal Products"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          2. PRODUCT CATEGORIES (8 CARDS GRID)
          ══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-24 border-b" style={{ background: '#F4F2EE', borderColor: '#DCD8CF' }}>
        <div className="section-container">
          
          {/* Section Header */}
          <div className="text-center max-w-xl mx-auto mb-14 md:mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.25em] block mb-2 font-[family-name:var(--font-barlow)]" style={{ color: '#66635B' }}>
              OUR PRODUCT RANGE
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight font-[family-name:var(--font-barlow)]" style={{ color: '#121211' }}>
              BROWSE BY CATEGORY
            </h2>
            <div className="w-12 h-[2.5px] mx-auto mt-3" style={{ background: '#121211' }} />
          </div>

          {/* 8 Cards Grid (4 cols × 2 rows on desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productCategories.map((cat) => {
              const IconComp = cat.icon;
              return (
                <Link
                  key={cat.title}
                  href={cat.href}
                  className="group rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:border-[#121211]"
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #DCD8CF',
                  }}
                >
                  <div>
                    {/* Card Image with Floating Round Badge */}
                    <div className="aspect-[16/10] relative overflow-hidden bg-[#EBE8E1]">
                      <Image
                        src={cat.img}
                        alt={cat.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 pointer-events-none opacity-60 group-hover:opacity-30 transition-opacity" />
                      
                      {/* Floating Round Icon Badge */}
                      <div 
                        className="absolute bottom-3 left-3 z-20 w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                        style={{
                          background: '#FFFFFF',
                          border: '1px solid #DCD8CF',
                          color: '#121211',
                        }}
                      >
                        <IconComp size={16} strokeWidth={2.2} />
                      </div>
                    </div>

                    {/* Card Content & Arrow Link */}
                    <div className="p-5 pt-4 flex items-center justify-between">
                      <div>
                        <h3 
                          className="text-base font-extrabold uppercase font-[family-name:var(--font-barlow)] leading-tight group-hover:text-[#121211] transition-colors"
                          style={{ color: '#121211' }}
                        >
                          {cat.title}
                        </h3>
                        <p 
                          className="text-[11px] font-[family-name:var(--font-inter)] mt-0.5 line-clamp-1"
                          style={{ color: '#66635B' }}
                        >
                          {cat.subtitle}
                        </p>
                      </div>

                      <div className="shrink-0 pl-2">
                        <ArrowRight size={15} style={{ color: '#121211' }} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              3. TWO-COLUMN SECTION: MATERIALS & FINISHES + WHY CHOOSE US
              ══════════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-16 md:mt-20">
            
            {/* Left: Materials & Finishes (Dark Forest Green Card) */}
            <div 
              className="lg:col-span-5 rounded-3xl p-8 sm:p-10 text-white flex flex-col justify-between border shadow-xl"
              style={{
                background: '#0E0E0D',
                borderColor: '#121211',
              }}
            >
              <div className="text-center mb-8">
                <span className="text-xs font-bold uppercase tracking-[0.25em] font-[family-name:var(--font-barlow)]" style={{ color: '#E4E0D7' }}>
                  — MATERIALS &amp; FINISHES —
                </span>
              </div>

              {/* 6 Circular Items Grid (3 cols × 2 rows) */}
              <div className="grid grid-cols-3 gap-y-6 gap-x-3 text-center my-auto">
                {materialOptions.map((mat) => (
                  <div key={mat.name} className="flex flex-col items-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white/20 relative shadow-md mb-2 bg-black/20">
                      <Image
                        src={mat.img}
                        alt={mat.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold uppercase font-[family-name:var(--font-barlow)] tracking-wider text-white">
                      {mat.name}
                    </span>
                  </div>
                ))}
              </div>

              <div className="text-center pt-6 mt-4 border-t border-[#2B2A27]">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9C5BB] font-[family-name:var(--font-inter)]">
                  Premium Grade Sourcing &amp; Surface Treatment
                </span>
              </div>
            </div>

            {/* Right: Why Choose Our Products? */}
            <div 
              className="lg:col-span-7 rounded-3xl p-8 sm:p-10 flex flex-col justify-center border shadow-sm"
              style={{
                background: '#FFFFFF',
                borderColor: '#DCD8CF',
              }}
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl sm:text-3xl font-extrabold uppercase font-[family-name:var(--font-barlow)] tracking-tight" style={{ color: '#121211' }}>
                  WHY CHOOSE OUR PRODUCTS?
                </h3>
                <div className="w-12 h-[2.5px] mx-auto mt-2.5" style={{ background: '#121211' }} />
              </div>

              {/* 4 Benefits Grid (2 cols × 2 rows) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                {whyChooseBenefits.map((benefit) => {
                  const IconC = benefit.icon;
                  return (
                    <div key={benefit.title} className="flex items-start gap-4">
                      <div 
                        className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 shadow-sm"
                        style={{
                          background: '#EBE8E1',
                          color: '#121211',
                        }}
                      >
                        <IconC size={20} strokeWidth={2} />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold uppercase font-[family-name:var(--font-barlow)] tracking-wider mb-1" style={{ color: '#121211' }}>
                          {benefit.title}
                        </h4>
                        <p className="text-xs font-[family-name:var(--font-inter)] leading-relaxed" style={{ color: '#66635B' }}>
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          4. CUSTOM FABRICATION CTA SECTION
          ══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 md:py-28 overflow-hidden" style={{ background: '#0E0E0D' }}>
        
        {/* Background Workshop Image with Dark Green Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-25">
          <Image
            src="/images/hero_welder.jpg"
            alt="Veldex Metal Fabrication Workshop"
            fill
            className="object-cover"
          />
        </div>

        <div className="section-container relative z-10 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase font-[family-name:var(--font-barlow)] tracking-tight text-white mb-2">
            LOOKING FOR SOMETHING CUSTOM?
          </h2>

          <p className="text-xs sm:text-sm font-[family-name:var(--font-inter)] leading-relaxed max-w-xl mx-auto mb-8 font-medium" style={{ color: '#E4E0D7' }}>
            We can build it exactly the way you imagine.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a 
              href={buildQuoteWhatsAppLink()} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-brand px-7 py-3.5 text-xs font-bold uppercase tracking-wider rounded-md inline-flex items-center gap-2 shadow-lg"
              style={{
                background: '#121211',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <MessageCircle size={16} />
              <span>GET WHATSAPP QUOTE</span>
            </a>
            
            <Link 
              href="/contact" 
              className="btn-outline px-7 py-3.5 text-xs font-bold uppercase tracking-wider rounded-md inline-flex items-center gap-2 shadow-sm"
              style={{
                background: '#FFFFFF',
                borderColor: '#FFFFFF',
                color: '#121211',
              }}
            >
              <span>CONTACT OUR TEAM</span>
              <ArrowRight size={14} style={{ color: '#121211' }} />
            </Link>
          </div>
        </div>

      </section>
    </>
  );
}
