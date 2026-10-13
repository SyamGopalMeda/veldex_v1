import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShieldCheck, 
  Settings, 
  Layers, 
  Clock, 
  MapPin, 
  Calendar, 
  Building, 
  CheckCircle2, 
  ArrowRight, 
  MessageCircle, 
  PhoneCall, 
  FileText,
  User,
  Sliders,
  Sparkles,
  Grid3X3
} from 'lucide-react';
import { getProductBySlug, getAllProductSlugs, getPublishedProducts } from '@/lib/firestore';
import { seedProducts } from '@/lib/siteData';
import { siteConfig, buildQuoteWhatsAppLink } from '@/lib/config';
import { JsonLd } from '@/components/seo/JsonLd';
import { ProjectGalleryInteractive } from '@/app/projects/[slug]/ProjectDetailClient';

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  if (slugs.length > 0) {
    return slugs.map((slug) => ({ slug }));
  }
  return [
    ...seedProducts.map((p) => ({ slug: p.slug })),
    { slug: 'modern-laser-cut-gate' },
    { slug: 'gates' },
    { slug: 'railings' },
    { slug: 'staircases' },
    { slug: 'pergolas' },
    { slug: 'roofing' },
    { slug: 'fences' },
    { slug: 'laser-cut' },
    { slug: 'custom-metalwork' },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let product = await getProductBySlug(slug);
  if (!product) {
    product = seedProducts.find((p) => p.slug === slug) || null;
  }

  const productName = product?.name || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return {
    title: `${productName} | Custom Products | Veldex Fabrications`,
    description: product?.shortDescription || `Precision fabricated ${productName} by Veldex Fabrications in Vijayawada, Andhra Pradesh.`,
    alternates: {
      canonical: `${siteConfig.seo.baseUrl}/products/${slug}`,
    },
    openGraph: {
      title: `${productName} | Veldex Fabrications`,
      description: product?.shortDescription || `Precision custom metal fabrication in Vijayawada.`,
      url: `${siteConfig.seo.baseUrl}/products/${slug}`,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  let product = await getProductBySlug(slug);
  if (!product) {
    product = seedProducts.find((p) => p.slug === slug) || null;
  }

  // Format title for split heading with green highlight
  const rawTitle = product?.name || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const titleWords = rawTitle.toUpperCase().split(' ');
  const titlePart1 = titleWords.length > 2 ? titleWords.slice(0, 2).join(' ') : titleWords[0] || 'CUSTOM';
  const titlePart2 = titleWords.length > 2 ? titleWords.slice(2).join(' ') : titleWords.slice(1).join(' ') || 'PRODUCT';

  // Category & image resolution
  const categoryName = product?.category || 'Gate Fabrication & Automation';
  
  // Default image based on slug/category
  let defaultHeroImg = '/images/gate.jpg';
  if (slug.includes('railing') || slug.includes('balustrade')) defaultHeroImg = '/images/railing_hero.jpg';
  else if (slug.includes('stair')) defaultHeroImg = '/images/stairs.jpg';
  else if (slug.includes('pergola') || slug.includes('gazebo')) defaultHeroImg = '/images/gazebo.jpg';
  else if (slug.includes('shed') || slug.includes('roof')) defaultHeroImg = '/images/sheds.jpg';
  else if (slug.includes('elevation') || slug.includes('laser') || slug.includes('panel')) defaultHeroImg = '/images/elevation.jpg';

  const heroImg = (product?.images && product.images.length > 0 && product.images[0]) || defaultHeroImg;

  // 6 Gallery images
  const galleryImages = [
    { src: heroImg, alt: `${rawTitle} Front View` },
    { src: '/images/gate_overview.jpg', alt: `${rawTitle} Detail Angle` },
    { src: '/images/mat_decorative.jpg', alt: `${rawTitle} Material Detail` },
    { src: '/images/gate_proj_2.jpg', alt: `${rawTitle} Installation View` },
    { src: '/images/gate_proj_3.jpg', alt: `${rawTitle} Workshop Quality` },
    { src: '/images/elevation.jpg', alt: `${rawTitle} Architectural Finish` },
  ];

  // Specs
  const specs = [
    { Icon: User, label: 'Product Name', value: rawTitle },
    { Icon: MapPin, label: 'Location', value: 'Vijayawada, Andhra Pradesh' },
    { Icon: Building, label: 'Category', value: categoryName },
    { Icon: Layers, label: 'Materials Used', value: product?.materialsAvailable?.join(', ') || 'Mild Steel (MS) / Stainless Steel' },
    { Icon: Sparkles, label: 'Finish', value: product?.finishOptions?.join(', ') || 'Powder Coated / Satin Polish' },
    { Icon: Calendar, label: 'Manufacture Year', value: '2024 - 2026' },
    { Icon: Building, label: 'Application Type', value: 'Residential & Commercial' },
    { Icon: Settings, label: 'Scope of Work', value: 'Custom Sizing, Fabrication & On-Site Installation' },
  ];

  // Key Features
  const keyFeatures = [
    'Beautiful precision-crafted design for modern architectural aesthetics',
    'Strong and durable certified high-grade structural metal construction',
    'Dual-coat powder coated / anti-corrosive finish for long-lasting weather protection',
    'Smooth low-friction operation with optional smart automation integration',
    'Enhanced safety, structural rigidity and privacy engineering',
    'Weather resistant, termite proof and minimal maintenance required',
  ];

  // Materials & Finishes (5 circles)
  const materialsAndFinishes = [
    { name: 'MILD STEEL', img: '/images/mat_mild_steel.jpg' },
    { name: 'POWDER COATED', img: '/images/mat_powder_coat.jpg' },
    { name: 'HEAVY DUTY FRAME', img: '/images/mat_galvanized.jpg' },
    { name: 'PREMIUM HINGES', img: '/images/mat_stainless_steel.jpg' },
    { name: 'AUTOMATION SYSTEM', img: '/images/mat_insulated_panels.jpg' },
  ];

  // Related Products
  const relatedProducts = [
    { title: 'Decorative Main Gate', category: 'Gate Fabrication & Automation', img: '/images/gate.jpg', slug: 'modern-laser-cut-gate' },
    { title: 'Sliding Gate with Wood', category: 'Gate Fabrication & Automation', img: '/images/gate_proj_2.jpg', slug: 'gates' },
    { title: 'Laser Cut Compound Gate', category: 'Gate Fabrication & Automation', img: '/images/mat_decorative.jpg', slug: 'laser-cut' },
    { title: 'Modern Bi-Fold Gate', category: 'Gate Fabrication & Automation', img: '/images/gate_proj_3.jpg', slug: 'gates' },
    { title: 'Classic Swing Gate', category: 'Gate Fabrication & Automation', img: '/images/gate.jpg', slug: 'modern-laser-cut-gate' },
    { title: 'Industrial Sliding Gate', category: 'Gate Fabrication & Automation', img: '/images/sheds.jpg', slug: 'roofing' },
  ];

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: rawTitle,
    description: product?.shortDescription || product?.description || `Custom fabricated ${rawTitle}`,
    category: categoryName,
    brand: {
      '@type': 'Brand',
      name: siteConfig.brand.name,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: '0.00',
      availability: 'https://schema.org/InStock',
      description: 'Custom Quoted / Estimate based on exact site dimensions',
    },
  };

  return (
    <>
      <JsonLd data={productSchema} />

      {/* ══════════════════════════════════════════════════════════════════
          1. HERO SECTION (TWO-COLUMN SPLIT-IMAGE HERO)
          ══════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 border-b overflow-hidden" style={{ background: '#F4F2EE', borderColor: '#DCD8CF' }}>
        
        {/* Right background image for ambient depth */}
        <div className="absolute top-0 right-0 w-full lg:w-[62%] h-full z-0 overflow-hidden pointer-events-none hidden md:block">
          <Image
            src={heroImg}
            alt={rawTitle}
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
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] mb-6 font-[family-name:var(--font-inter)]" style={{ color: '#8C8980' }}>
            <Link href="/" className="hover:text-[#121211] transition-colors">
              HOME
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-[#121211] transition-colors">
              PRODUCTS
            </Link>
            <span>/</span>
            <span style={{ color: '#121211' }}>{rawTitle}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Heading, Category Badge, Description & 4 Highlights */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Eyebrow */}
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-[2px]" style={{ background: '#121211' }} />
                <span className="text-xs font-bold uppercase tracking-[0.25em] font-[family-name:var(--font-barlow)]" style={{ color: '#121211' }}>
                  OUR PRODUCT
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase font-[family-name:var(--font-barlow)] leading-[1.05] tracking-tight" style={{ color: '#121211' }}>
                {titlePart1}<br />
                <span style={{ color: '#121211' }}>{titlePart2}</span>
              </h1>

              {/* Category Indicator */}
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-[family-name:var(--font-barlow)]" style={{ color: '#121211' }}>
                <Grid3X3 size={15} />
                <span>CATEGORY: {categoryName}</span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm md:text-base font-[family-name:var(--font-inter)] leading-relaxed max-w-xl font-medium" style={{ color: '#66635B' }}>
                {product?.shortDescription || product?.description || "A premium custom-crafted metal fabrication product designed to enhance security, privacy and architectural aesthetics. Built with precision and high-grade materials for long-lasting performance."}
              </p>

              {/* 4 Feature Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 max-w-xl border-t" style={{ borderColor: '#DCD8CF' }}>
                {[
                  { Icon: ShieldCheck, line1: 'PREMIUM', line2: 'QUALITY' },
                  { Icon: Settings, line1: 'PRECISION', line2: 'ENGINEERED' },
                  { Icon: Sliders, line1: 'CUSTOM', line2: 'DESIGN' },
                  { Icon: Clock, line1: 'LONG LASTING', line2: 'DURABILITY' },
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
                  src={heroImg}
                  alt={rawTitle}
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
          2. PRODUCT OVERVIEW & PRODUCT GALLERY (TWO COLUMNS)
          ══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-24 border-b" style={{ background: '#F4F2EE', borderColor: '#DCD8CF' }}>
        <div className="section-container">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Column (5 Cols): Specification Table + CTA Card */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Header */}
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-[2px]" style={{ background: '#121211' }} />
                <h2 className="text-base font-extrabold uppercase tracking-wider font-[family-name:var(--font-barlow)]" style={{ color: '#121211' }}>
                  PROJECT OVERVIEW
                </h2>
              </div>

              {/* Specs Table */}
              <div 
                className="rounded-2xl p-5 sm:p-6 divide-y divide-[#E8E5DE] border shadow-sm"
                style={{
                  background: '#FFFFFF',
                  borderColor: '#DCD8CF',
                }}
              >
                {specs.map(({ Icon, label, value }) => (
                  <div key={label} className="py-3 flex items-center justify-between text-xs font-[family-name:var(--font-inter)]">
                    <div className="flex items-center gap-2 font-medium" style={{ color: '#66635B' }}>
                      <Icon size={14} style={{ color: '#121211' }} />
                      <span>{label}</span>
                    </div>
                    <div className="font-bold text-right max-w-[55%]" style={{ color: '#121211' }}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Have a similar project in mind? Card */}
              <div 
                className="rounded-2xl p-6 text-white border shadow-md"
                style={{
                  background: '#0E0E0D',
                  borderColor: '#121211',
                }}
              >
                <h3 className="text-lg font-extrabold uppercase font-[family-name:var(--font-barlow)] tracking-tight text-white mb-1">
                  HAVE A SIMILAR PROJECT IN MIND?
                </h3>
                <p className="text-xs font-[family-name:var(--font-inter)] text-[#E4E0D7] mb-5">
                  Let&apos;s build something extraordinary together.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={buildQuoteWhatsAppLink(rawTitle)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-brand text-xs py-2.5 px-4 rounded-md inline-flex items-center gap-2 shadow-sm flex-1 justify-center"
                    style={{ background: '#121211' }}
                  >
                    <MessageCircle size={15} />
                    <span>GET WHATSAPP ESTIMATE</span>
                  </a>

                  <Link
                    href="/contact"
                    className="btn-outline text-xs py-2.5 px-4 rounded-md inline-flex items-center gap-1.5 shadow-sm bg-white text-[#121211] hover:border-[#121211]"
                  >
                    <span>SEND LEAD FORM</span>
                    <ArrowRight size={13} style={{ color: '#121211' }} />
                  </Link>
                </div>
              </div>

            </div>

            {/* Right Column (7 Cols): Project Gallery Grid */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Header */}
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-[2px]" style={{ background: '#121211' }} />
                <h2 className="text-base font-extrabold uppercase tracking-wider font-[family-name:var(--font-barlow)]" style={{ color: '#121211' }}>
                  PROJECT GALLERY
                </h2>
              </div>

              {/* 6-Photo Interactive Gallery Grid */}
              <ProjectGalleryInteractive images={galleryImages} />

            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          3. KEY FEATURES & MATERIALS (TWO COLUMNS)
          ══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-24 border-b" style={{ background: '#FFFFFF', borderColor: '#DCD8CF' }}>
        <div className="section-container">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column (6 Cols): Key Features */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-[2px]" style={{ background: '#121211' }} />
                <h2 className="text-base font-extrabold uppercase tracking-wider font-[family-name:var(--font-barlow)]" style={{ color: '#121211' }}>
                  KEY FEATURES
                </h2>
              </div>

              <div className="space-y-4">
                {keyFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 size={18} style={{ color: '#121211', flexShrink: 0, marginTop: '2px' }} />
                    <span className="text-xs sm:text-sm font-[family-name:var(--font-inter)] font-semibold" style={{ color: '#121211' }}>
                      {feat}
                    </span>
                  </div>
                ))}
              </div>

            </div>

            {/* Right Column (6 Cols): Materials & Finishes Circular Cards */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-[2px]" style={{ background: '#121211' }} />
                <h2 className="text-base font-extrabold uppercase tracking-wider font-[family-name:var(--font-barlow)]" style={{ color: '#121211' }}>
                  MATERIALS &amp; FINISHES
                </h2>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 text-center">
                {materialsAndFinishes.map((mat) => (
                  <div key={mat.name} className="flex flex-col items-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 relative shadow-sm mb-2 bg-[#F4F2EE]" style={{ borderColor: '#DCD8CF' }}>
                      <Image
                        src={mat.img}
                        alt={mat.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase font-[family-name:var(--font-barlow)] tracking-wider" style={{ color: '#121211' }}>
                      {mat.name}
                    </span>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          4. RELATED PRODUCTS (HORIZONTAL GRID)
          ══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-24 border-b" style={{ background: '#F4F2EE', borderColor: '#DCD8CF' }}>
        <div className="section-container">
          
          <div className="flex items-center gap-2.5 mb-8">
            <span className="w-6 h-[2px]" style={{ background: '#121211' }} />
            <h2 className="text-base font-extrabold uppercase tracking-wider font-[family-name:var(--font-barlow)]" style={{ color: '#121211' }}>
              RELATED PRODUCTS
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
            {relatedProducts.map((rel, idx) => (
              <Link
                key={idx}
                href={`/products/${rel.slug}`}
                className="group block rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-lg hover:border-[#121211] flex flex-col justify-between"
                style={{
                  background: '#FFFFFF',
                  borderColor: '#DCD8CF',
                }}
              >
                <div>
                  <div className="aspect-[16/11] relative overflow-hidden bg-[#EBE8E1]">
                    <Image
                      src={rel.img}
                      alt={rel.title}
                      fill
                      sizes="(max-width: 768px) 50vw, 16vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="p-3.5 pb-2">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-extrabold uppercase font-[family-name:var(--font-barlow)] leading-tight line-clamp-1 group-hover:text-[#121211] transition-colors" style={{ color: '#121211' }}>
                        {rel.title}
                      </h5>
                      <ArrowRight size={12} style={{ color: '#121211' }} className="shrink-0 group-hover:translate-x-0.5 transition-transform ml-1" />
                    </div>
                    <p className="text-[10px] font-medium font-[family-name:var(--font-inter)] mt-0.5 line-clamp-1" style={{ color: '#8C8980' }}>
                      {rel.category}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          5. FINAL CALL TO ACTION BAR
          ══════════════════════════════════════════════════════════════════ */}
      <section className="py-10 md:py-12" style={{ background: '#0E0E0D' }}>
        <div className="section-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            
            {/* Left Content */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-white/20 hidden sm:flex" style={{ background: '#121211', color: '#FFFFFF' }}>
                <FileText size={24} />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold uppercase font-[family-name:var(--font-barlow)] text-white tracking-tight mb-0.5">
                  READY TO START YOUR PROJECT?
                </h3>
                <p className="text-xs font-[family-name:var(--font-inter)] text-[#E4E0D7]">
                  Get in touch with our team for a free consultation and personalized quote.
                </p>
              </div>
            </div>

            {/* Right Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={`tel:${siteConfig.contact.phone.replace(/[^0-9+]/g, '')}`}
                className="btn-outline px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-md inline-flex items-center gap-2"
                style={{
                  background: 'transparent',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: '#FFFFFF',
                }}
              >
                <PhoneCall size={14} />
                <span>CALL US NOW</span>
              </a>

              <a
                href={buildQuoteWhatsAppLink(rawTitle)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brand px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-md inline-flex items-center gap-2 bg-white text-[#121211] hover:bg-[#EBE8E1] shadow-md border-0"
              >
                <MessageCircle size={15} style={{ color: '#121211' }} />
                <span style={{ color: '#121211' }}>GET WHATSAPP QUOTE</span>
              </a>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
