import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Radio,
  Award,
  Wrench,
  Shield,
  Eye,
  Settings,
  ArrowRight,
  MessageCircle,
  Columns,
  Layers,
  Sliders,
  Sparkles,
  ArrowUpRight,
  Home as HomeIcon,
  Grid3X3,
  Sun,
  Leaf,
  CloudRain,
  Wind,
  Building,
  Target
} from 'lucide-react';
import { seedServices } from '@/lib/siteData';
import { getSiteSettings, getServicesView, listArticles } from '@/lib/content';
import { pageMetadata, SERVICE_SEO, SERVICE_AREAS, abs, orgRef, breadcrumbSchema, faqSchema } from '@/lib/seo';
import { siteConfig, buildQuoteWhatsAppLink } from '@/lib/config';
import { JsonLd } from '@/components/seo/JsonLd';
import { PageHero, SectionHead, CtaBand, Reveal } from '@/components/vx/kit';

export const revalidate = 3600;

/** Display helper: renders ALL-CAPS data labels in title case (data itself is unchanged). */
function titleCase(value: string) {
  if (value !== value.toUpperCase()) return value;
  return value
    .split(' ')
    .map((w) => (w.length > 1 ? w[0] + w.slice(1).toLowerCase() : w))
    .join(' ');
}

const pad = (n: number) => String(n).padStart(2, '0');

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = (await getServicesView()).published.map((s) => s.slug);
  if (slugs.length > 0) {
    return slugs.map((slug) => ({ slug }));
  }
  return seedServices.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const svc = await getServicesView();
  const service = svc.isPublished(slug) ? svc.get(slug) : null;

  if (!service) return {};

  const seo = SERVICE_SEO[service.slug];
  return pageMetadata({
    title: seo?.title ?? `${service.name} in Vijayawada | Veldex Fabrications`,
    description: seo?.description ?? service.shortDescription,
    path: `/services/${service.slug}`,
  });
}

// ── DATA CONFIGURATION PER SERVICE ───────────────────────────────────────────

interface ServicePageData {
  heroTitleTop: string;
  heroTitleHighlight: string;
  heroDesc: string;
  heroImage: string;
  heroHighlights: { Icon: any; label: string }[];
  overviewDesc: string;
  overviewChecklistLeft: string[];
  overviewChecklistRight: string[];
  overviewImage: string;
  materialsTitle?: string;
  materials: { name: string; img: string }[];
  features: { icon: any; title: string; description: string }[];
  recentProjects: { title: string; category: string; img: string; href: string }[];
  ctaDesc?: string;
}

const elevationsData: ServicePageData = {
  heroTitleTop: 'ELEVATIONS &',
  heroTitleHighlight: 'METALWORK',
  heroDesc: 'Custom elevations and metalwork that enhance the look and value of your property. Designed with precision, crafted with passion, built to last.',
  heroImage: '/images/stock/exterior-decorative-panel.jpg',
  heroHighlights: [
    { Icon: Building, label: 'MODERN AESTHETICS' },
    { Icon: ShieldCheck, label: 'PREMIUM QUALITY' },
    { Icon: Wrench, label: 'CUSTOM DESIGNS' },
    { Icon: Settings, label: 'LONG LASTING DURABILITY' },
  ],
  overviewDesc: 'We specialize in creating stunning architectural elevations and bespoke metalwork that bring creativity, strength and sophistication to residential, commercial and industrial spaces.',
  overviewChecklistLeft: [
    'Laser Cut Panels',
    'Facade Cladding',
    'Decorative Screens',
    'Metal Facades',
  ],
  overviewChecklistRight: [
    'Compound Walls',
    'Main Gate Designs',
    'Balcony Screens',
    'Custom Metalwork',
  ],
  overviewImage: '/images/stock/exterior-metal-screen-facade.jpg',
  materialsTitle: 'MATERIALS WE USE',
  materials: [
    { name: 'Mild Steel', img: '/images/mat_mild_steel.jpg' },
    { name: 'Stainless Steel', img: '/images/mat_stainless_steel.jpg' },
    { name: 'Aluminium', img: '/images/mat_aluminium.jpg' },
    { name: 'Laser Cut Sheets', img: '/images/mat_decorative.jpg' },
    { name: 'Glass', img: '/images/mat_toughened_glass.jpg' },
    { name: 'Powder Coated Finish', img: '/images/mat_powder_coat.jpg' },
  ],
  features: [
    {
      icon: Eye,
      title: 'Modern Appeal',
      description: 'Enhances the overall look and architectural beauty of any space.',
    },
    {
      icon: ShieldCheck,
      title: 'High Durability',
      description: 'Built with high-quality materials for long-lasting performance.',
    },
    {
      icon: Sliders,
      title: 'Custom Designs',
      description: 'Tailored solutions to match your style, needs and vision.',
    },
    {
      icon: CloudRain,
      title: 'Weather Resistant',
      description: 'Designed to withstand harsh weather and extreme conditions.',
    },
    {
      icon: Sparkles,
      title: 'Low Maintenance',
      description: 'Premium finishes and coatings for minimal upkeep.',
    },
    {
      icon: Target,
      title: 'Value Addition',
      description: 'Increases the value and elegance of your property.',
    },
  ],
  recentProjects: [
    { title: 'Laser Cut Facade', category: 'Residential Project', img: '/images/elevation.jpg', href: '/projects' },
    { title: 'Decorative Metal Screen', category: 'Commercial Project', img: '/images/mat_decorative.jpg', href: '/projects' },
    { title: 'Compound Wall Design', category: 'Residential Project', img: '/images/gate_proj_2.jpg', href: '/projects' },
    { title: 'Facade Cladding', category: 'Commercial Project', img: '/images/elevation.jpg', href: '/projects' },
    { title: 'Main Gate Design', category: 'Residential Project', img: '/images/gate.jpg', href: '/projects' },
    { title: 'Balcony Screen', category: 'Residential Project', img: '/images/railing_hero.jpg', href: '/projects' },
  ],
  ctaDesc: "Let's create something extraordinary together. Get in touch with our team today.",
};

const shedsRoofingData: ServicePageData = {
  heroTitleTop: 'TERRACE SHEDS',
  heroTitleHighlight: '& ROOFING',
  heroDesc: 'Strong, weather-resistant and long-lasting terrace sheds and roofing solutions designed for comfort, protection and durability in every season.',
  heroImage: '/images/stock/exterior-steel-roof-structure.jpg',
  heroHighlights: [
    { Icon: ShieldCheck, label: 'WEATHER PROTECTION' },
    { Icon: HomeIcon, label: 'STRONG STRUCTURE' },
    { Icon: Layers, label: 'QUALITY MATERIALS' },
    { Icon: Wrench, label: 'LOW MAINTENANCE' },
  ],
  overviewDesc: 'We design and fabricate terrace sheds and roofing systems that provide excellent protection from sun, rain and harsh weather. Our solutions are customized to match your space, requirements and architectural style.',
  overviewChecklistLeft: [
    'Terrace Sheds',
    'Parking Sheds',
    'Metal Roofing',
    'Waterproof Solutions',
  ],
  overviewChecklistRight: [
    'Polycarbonate Roofing',
    'Ventilation Systems',
    'Insulated Roofing',
    'Custom Fabrication',
  ],
  overviewImage: '/images/sheds.jpg',
  materialsTitle: 'MATERIALS WE USE',
  materials: [
    { name: 'Mild Steel', img: '/images/mat_mild_steel.jpg' },
    { name: 'Galvanized Steel', img: '/images/mat_galvanized.jpg' },
    { name: 'Aluminium', img: '/images/mat_aluminium.jpg' },
    { name: 'Polycarbonate Sheets', img: '/images/mat_polycarbonate.jpg' },
    { name: 'Insulated Panels', img: '/images/mat_insulated_panels.jpg' },
    { name: 'Colour Coated Sheets', img: '/images/mat_color_coated.jpg' },
  ],
  features: [
    {
      icon: CloudRain,
      title: 'Weather Protection',
      description: 'Shields your space from rain, heat and harsh weather conditions.',
    },
    {
      icon: ShieldCheck,
      title: 'Strong & Durable',
      description: 'Engineered for strength and built to withstand extreme conditions.',
    },
    {
      icon: Sun,
      title: 'Heat Reduction',
      description: 'Helps reduce direct heat exposure, keeping your space cooler.',
    },
    {
      icon: Wind,
      title: 'Ventilation & Airflow',
      description: 'Proper ventilation ensures fresh air and reduces heat.',
    },
    {
      icon: Settings,
      title: 'Custom Solutions',
      description: 'Tailored designs to suit your space, needs and architectural style.',
    },
    {
      icon: Wrench,
      title: 'Low Maintenance',
      description: 'High quality materials require minimal maintenance.',
    },
  ],
  recentProjects: [
    { title: 'Modern Rooftop Terrace Shed Canopy', category: 'ROOFING', img: '/images/sheds.jpg', href: '/projects' },
    { title: 'Double Vehicle Parking Shed Structure', category: 'SHEDS', img: '/images/sheds.jpg', href: '/projects' },
    { title: 'Outdoor Lounge Terrace Roof', category: 'ROOFING', img: '/images/gazebo.jpg', href: '/projects' },
    { title: 'Heavy Duty Structural Metal Canopy', category: 'SHEDS', img: '/images/sheds.jpg', href: '/projects' },
    { title: 'Terrace Dining Pavilion Canopy', category: 'ROOFING', img: '/images/gazebo.jpg', href: '/projects' },
    { title: 'Industrial Warehouse Structural Roof', category: 'SHEDS', img: '/images/hero_welder.jpg', href: '/projects' },
  ],
  ctaDesc: "Let's build a strong and comfortable space together. Get in touch with our team today.",
};

const pergolasData: ServicePageData = {
  heroTitleTop: 'PERGOLAS &',
  heroTitleHighlight: 'GAZEBOS',
  heroDesc: 'Bespoke pergolas, gazebos and canopies designed to blend comfort, shade and aesthetics. Perfect for outdoor living spaces that inspire relaxation.',
  heroImage: '/images/stock/exterior-modern-pergola.jpg',
  heroHighlights: [
    { Icon: Sun, label: 'Comfort & Shade' },
    { Icon: Grid3X3, label: 'Custom Designs' },
    { Icon: ShieldCheck, label: 'Weather Resistant' },
    { Icon: Wrench, label: 'Low Maintenance' },
  ],
  overviewDesc: 'Our pergolas and gazebos are crafted with precision metalwork and high-quality materials to transform your outdoor areas into stylish, functional and comfortable spaces — perfect for every season.',
  overviewChecklistLeft: [
    'Pergolas',
    'Gazebos',
    'Rooftop Canopies',
    'Garden Structures',
  ],
  overviewChecklistRight: [
    'Outdoor Lounge Spaces',
    'Metal & Wood Finishes',
    'Weather Resistant',
    'Custom Fabrication',
  ],
  overviewImage: '/images/stock/exterior-pergola-garden.jpg',
  materialsTitle: 'MATERIALS & FINISHES',
  materials: [
    { name: 'Mild Steel', img: '/images/mat_mild_steel.jpg' },
    { name: 'Stainless Steel', img: '/images/mat_stainless_steel.jpg' },
    { name: 'Aluminium', img: '/images/mat_aluminium.jpg' },
    { name: 'Wood Finishes', img: '/images/mat_wood_treads.jpg' },
    { name: 'Polycarbonate Sheets', img: '/images/mat_polycarbonate.jpg' },
    { name: 'Powder Coated Finish', img: '/images/mat_powder_coat.jpg' },
  ],
  features: [
    {
      icon: Sun,
      title: 'Sun & Rain Protection',
      description: 'Provides excellent shade and protection from harsh weather.',
    },
    {
      icon: HomeIcon,
      title: 'Custom Built',
      description: 'Tailored designs to suit your space, style and requirements.',
    },
    {
      icon: ShieldCheck,
      title: 'Durable & Strong',
      description: 'High-quality materials built to withstand extreme conditions.',
    },
    {
      icon: Leaf,
      title: 'Aesthetic Appeal',
      description: 'Enhances the beauty and value of your outdoor spaces.',
    },
    {
      icon: Settings,
      title: 'Versatile Usage',
      description: 'Ideal for lounges, gardens, terraces, cafes and commercial spaces.',
    },
    {
      icon: Wrench,
      title: 'Low Maintenance',
      description: 'Weather-resistant finishes for long-lasting performance.',
    },
  ],
  recentProjects: [
    { title: 'Luxury Rooftop Gazebo Lounge', category: 'PERGOLAS', img: '/images/gazebo.jpg', href: '/projects' },
    { title: 'Modern Steel Terrace Pergola', category: 'PERGOLAS', img: '/images/sheds.jpg', href: '/projects' },
    { title: 'Outdoor Dining Metal Canopy', category: 'PERGOLAS', img: '/images/gazebo.jpg', href: '/projects' },
    { title: 'Garden Wood & Steel Pergola', category: 'PERGOLAS', img: '/images/sheds.jpg', href: '/projects' },
    { title: 'Contemporary Villa Poolside Canopy', category: 'PERGOLAS', img: '/images/gazebo.jpg', href: '/projects' },
    { title: 'Illuminated Terrace Gazebo', category: 'PERGOLAS', img: '/images/gazebo.jpg', href: '/projects' },
  ],
  ctaDesc: "Let's create your perfect outdoor space. Get in touch with our team today.",
};

const staircasesData: ServicePageData = {
  heroTitleTop: 'CUSTOM',
  heroTitleHighlight: 'STAIRCASES',
  heroDesc: 'Elegant, safe and durable staircases crafted with precision engineering to perfectly match your space, style and functionality needs.',
  heroImage: '/images/stock/interior-dark-staircase.jpg',
  heroHighlights: [
    { Icon: ShieldCheck, label: 'Engineered Safety' },
    { Icon: ArrowUpRight, label: 'Custom Designs' },
    { Icon: Layers, label: 'Premium Materials' },
    { Icon: Wrench, label: 'Low Maintenance' },
  ],
  overviewDesc: 'Every staircase we build is a combination of structural strength, functionality and visual appeal. From modern floating stairs to classic metal staircases, our solutions are tailored to enhance your interiors and exteriors.',
  overviewChecklistLeft: [
    'Spiral Staircases',
    'Straight Staircases',
    'Floating Staircases',
    'Cantilever Staircases',
  ],
  overviewChecklistRight: [
    'Metal Staircases',
    'Indoor Staircases',
    'Outdoor Staircases',
    'Custom Handrails',
  ],
  overviewImage: '/images/stock/interior-spiral-stair-above.jpg',
  materials: [
    { name: 'Mild Steel', img: '/images/mat_mild_steel.jpg' },
    { name: 'Stainless Steel', img: '/images/mat_stainless_steel.jpg' },
    { name: 'Aluminium', img: '/images/mat_aluminium.jpg' },
    { name: 'Wood Treads', img: '/images/mat_wood_treads.jpg' },
    { name: 'Glass', img: '/images/mat_toughened_glass.jpg' },
    { name: 'Powder Coated Finish', img: '/images/mat_powder_coat.jpg' },
  ],
  features: [
    {
      icon: ShieldCheck,
      title: 'High Strength',
      description: 'Engineered for load bearing capacity and long-term durability.',
    },
    {
      icon: Sliders,
      title: 'Custom Built',
      description: 'Tailored designs to fit your space, style and requirements.',
    },
    {
      icon: Shield,
      title: 'Maximum Safety',
      description: 'Built with safety standards ensuring secure and comfortable usage.',
    },
    {
      icon: Eye,
      title: 'Aesthetic Appeal',
      description: 'Modern and elegant designs that elevate the look of your space.',
    },
    {
      icon: Settings,
      title: 'Low Maintenance',
      description: 'Premium materials and finishes for easy cleaning and lasting performance.',
    },
  ],
  recentProjects: [
    { title: 'Spiral Luxury Curved Staircase', category: 'STAIRCASES', img: '/images/stairs.jpg', href: '/projects' },
    { title: 'Hardwood & Black Metal Straight Staircase', category: 'STAIRCASES', img: '/images/railing_overview.jpg', href: '/projects' },
    { title: 'Architectural Indoor Floating Stairs', category: 'STAIRCASES', img: '/images/stairs.jpg', href: '/projects' },
    { title: 'Industrial Black Spiral Staircase', category: 'STAIRCASES', img: '/images/stairs.jpg', href: '/projects' },
    { title: 'Contemporary Cantilever Staircase', category: 'STAIRCASES', img: '/images/railing_overview.jpg', href: '/projects' },
    { title: 'Modern Structural Steel Staircase', category: 'STAIRCASES', img: '/images/hero_welder.jpg', href: '/projects' },
  ],
};

const railingsData: ServicePageData = {
  heroTitleTop: 'RAILINGS &',
  heroTitleHighlight: 'BALUSTRADES',
  heroDesc: 'Elegant, durable and precision-engineered railings for balconies, staircases, terraces and more. Designed to elevate safety without compromising style.',
  heroImage: '/images/stock/interior-ornate-spiral-railing.jpg',
  heroHighlights: [
    { Icon: ShieldCheck, label: 'Enhanced Safety' },
    { Icon: Columns, label: 'Premium Design' },
    { Icon: Layers, label: 'High Quality Materials' },
    { Icon: Wrench, label: 'Low Maintenance' },
  ],
  overviewDesc: 'Our railings and balustrades combine strength, aesthetics and functionality. From contemporary glass railings to timeless stainless steel designs, we craft solutions that blend seamlessly with your architecture while ensuring maximum safety.',
  overviewChecklistLeft: [
    'Balcony Railings',
    'Staircase Railings',
    'Terrace Railings',
    'Glass Balustrades',
  ],
  overviewChecklistRight: [
    'Stainless Steel Railings',
    'MS & Aluminium Railings',
    'Custom Designs',
    'Powder Coated Finishes',
  ],
  overviewImage: '/images/stock/interior-steel-stair-railing.jpg',
  materials: [
    { name: 'Stainless Steel', img: '/images/mat_stainless_steel.jpg' },
    { name: 'Mild Steel', img: '/images/mat_mild_steel.jpg' },
    { name: 'Aluminium', img: '/images/mat_aluminium.jpg' },
    { name: 'Toughened Glass', img: '/images/mat_toughened_glass.jpg' },
    { name: 'Powder Coated Finish', img: '/images/mat_powder_coat.jpg' },
  ],
  features: [
    {
      icon: ShieldCheck,
      title: 'Strong & Durable',
      description: 'High-strength materials for long-lasting performance.',
    },
    {
      icon: Eye,
      title: 'Sleek & Modern',
      description: 'Contemporary designs that enhance any space.',
    },
    {
      icon: Shield,
      title: 'Maximum Safety',
      description: 'Built to meet safety standards with secure installations.',
    },
    {
      icon: Sliders,
      title: 'Customizable',
      description: 'Tailored designs to suit your architecture and style.',
    },
    {
      icon: Settings,
      title: 'Low Maintenance',
      description: 'Corrosion-resistant finishes for easy upkeep.',
    },
  ],
  recentProjects: [
    { title: 'Frameless Glass Balcony Balustrade', category: 'RAILINGS', img: '/images/railing_hero.jpg', href: '/projects' },
    { title: 'Hardwood & Black Metal Staircase Railing', category: 'RAILINGS', img: '/images/railing_overview.jpg', href: '/projects' },
    { title: 'Architectural Villa Balcony Railings', category: 'RAILINGS', img: '/images/railings.jpg', href: '/projects' },
    { title: 'Spiral Luxury Staircase Railing', category: 'RAILINGS', img: '/images/stairs.jpg', href: '/projects' },
    { title: 'Modern Upper Terrace Glass Railing', category: 'RAILINGS', img: '/images/railing_hero.jpg', href: '/projects' },
    { title: 'Interior Black Iron Balusters', category: 'RAILINGS', img: '/images/railing_overview.jpg', href: '/projects' },
  ],
};

const gatesData: ServicePageData = {
  heroTitleTop: 'GATE FABRICATION',
  heroTitleHighlight: '& AUTOMATION',
  heroDesc: 'Custom designed gates with advanced automation for security, convenience and style. Built with precision engineering and premium materials for long lasting performance in every environment.',
  heroImage: '/images/stock/gate-wrought-iron-garden.jpg',
  heroHighlights: [
    { Icon: ShieldCheck, label: 'Enhanced Security' },
    { Icon: Radio, label: 'Smart Automation' },
    { Icon: Award, label: 'Premium Materials' },
    { Icon: Wrench, label: 'Low Maintenance' },
  ],
  overviewDesc: 'At Veldex Fabrications, we create gates that are more than just entrances — they are a perfect blend of security, durability and elegant design. From manual gates to fully automated smart gate systems, we deliver tailored solutions that match your property and lifestyle.',
  overviewChecklistLeft: [
    'Sliding Gates',
    'Swing Gates',
    'Telescopic Gates',
    'Bi-Folding Gates',
  ],
  overviewChecklistRight: [
    'Automation Systems',
    'Access Control Integration',
    'Remote & App Control',
    'Safety Sensors & Alarms',
  ],
  overviewImage: '/images/stock/entrance-wrought-iron-doors.jpg',
  materials: [
    { name: 'Mild Steel', img: '/images/mat_mild_steel.jpg' },
    { name: 'Stainless Steel', img: '/images/mat_stainless_steel.jpg' },
    { name: 'Aluminium', img: '/images/mat_aluminium.jpg' },
    { name: 'Galvanized Steel', img: '/images/mat_galvanized.jpg' },
    { name: 'Decorative Panels', img: '/images/mat_decorative.jpg' },
  ],
  features: [
    {
      icon: ShieldCheck,
      title: 'Robust & Durable',
      description: 'Heavy duty construction for maximum strength and durability.',
    },
    {
      icon: Radio,
      title: 'Smart Automation',
      description: 'Automated systems with remote, app and sensor based control.',
    },
    {
      icon: Shield,
      title: 'Enhanced Security',
      description: 'Advanced locking mechanisms and access control integration.',
    },
    {
      icon: Eye,
      title: 'Modern Aesthetics',
      description: 'Stylish designs that enhance the beauty of your property.',
    },
    {
      icon: Settings,
      title: 'Low Maintenance',
      description: 'High quality materials and coatings for long lasting performance.',
    },
  ],
  recentProjects: [
    { title: 'Laser Cut Motorized Gate', category: 'GATES', img: '/images/gate.jpg', href: '/projects' },
    { title: 'Modern Black Louver Sliding Gate', category: 'GATES', img: '/images/gate_overview.jpg', href: '/projects' },
    { title: 'Wood & Steel Composite Sliding Gate', category: 'GATES', img: '/images/gate_proj_2.jpg', href: '/projects' },
    { title: 'Double Swing Vertical Slat Gate', category: 'GATES', img: '/images/gate_proj_3.jpg', href: '/projects' },
    { title: 'Architectural Geometric Facade Gate', category: 'GATES', img: '/images/elevation.jpg', href: '/projects' },
  ],
};

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const svc = await getServicesView();
  const service = svc.isPublished(slug) ? svc.get(slug) : null;

  if (!service) {
    notFound();
  }

  // Determine service data configuration
  let pageData: ServicePageData;
  if (slug === 'elevations-facades' || slug === 'elevations-metalwork' || slug === 'elevations' || slug === 'metalwork') {
    pageData = elevationsData;
  } else if (slug === 'sheds-roofing' || slug === 'sheds' || slug === 'roofing' || slug === 'terrace-sheds-roofing') {
    pageData = shedsRoofingData;
  } else if (slug === 'pergolas-gazebos' || slug === 'pergolas' || slug === 'gazebos') {
    pageData = pergolasData;
  } else if (slug === 'staircases' || slug === 'custom-staircases') {
    pageData = staircasesData;
  } else if (slug === 'railings' || slug === 'railings-balustrades') {
    pageData = railingsData;
  } else if (slug === 'gate-automation' || slug === 'gates' || slug === 'gate-fabrication-automation') {
    pageData = gatesData;
  } else {
    // Default fallback constructed gracefully from service data
    pageData = {
      heroTitleTop: service.name.split(' ')[0],
      heroTitleHighlight: service.name.split(' ').slice(1).join(' ') || 'SOLUTIONS',
      heroDesc: service.shortDescription,
      heroImage: '/images/hero_welder.jpg',
      heroHighlights: [
        { Icon: ShieldCheck, label: 'Quality Assurance' },
        { Icon: Award, label: 'Premium Engineering' },
        { Icon: Layers, label: 'Certified Materials' },
        { Icon: Wrench, label: 'Expert Installation' },
      ],
      overviewDesc: service.description,
      overviewChecklistLeft: service.features.slice(0, 4),
      overviewChecklistRight: service.features.slice(4, 8).length > 0 ? service.features.slice(4, 8) : ['Custom Specifications', 'Durable Finishes', 'On-Site Installation', 'Warranty Protection'],
      overviewImage: '/images/hero_welder.jpg',
      materials: [
        { name: 'Mild Steel', img: '/images/mat_mild_steel.jpg' },
        { name: 'Stainless Steel', img: '/images/mat_stainless_steel.jpg' },
        { name: 'Aluminium', img: '/images/mat_aluminium.jpg' },
        { name: 'Galvanized Steel', img: '/images/mat_galvanized.jpg' },
        { name: 'Decorative Panels', img: '/images/mat_decorative.jpg' },
      ],
      features: [
        { icon: ShieldCheck, title: 'Strong & Durable', description: 'Heavy-duty construction for maximum strength and endurance.' },
        { icon: Eye, title: 'Modern Aesthetics', description: 'Sleek designs tailored to elevate architectural appeal.' },
        { icon: Shield, title: 'Maximum Safety', description: 'Engineered to comply with rigorous structural standards.' },
        { icon: Sliders, title: 'Customizable', description: 'Bespoke dimensions and finishes for exact specifications.' },
        { icon: Settings, title: 'Low Maintenance', description: 'Protective coatings ensure long-lasting durability.' },
      ],
      recentProjects: [
        { title: `${service.name} Project Alpha`, category: 'FABRICATION', img: '/images/hero_welder.jpg', href: '/projects' },
        { title: `${service.name} Project Beta`, category: 'FABRICATION', img: '/images/gazebo.jpg', href: '/projects' },
        { title: `${service.name} Project Gamma`, category: 'FABRICATION', img: '/images/sheds.jpg', href: '/projects' },
        { title: `${service.name} Project Delta`, category: 'FABRICATION', img: '/images/elevation.jpg', href: '/projects' },
        { title: `${service.name} Project Epsilon`, category: 'FABRICATION', img: '/images/gate.jpg', href: '/projects' },
      ],
    };
  }

  const seo = SERVICE_SEO[service.slug];
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': abs(`/services/${service.slug}#service`),
    name: service.name,
    serviceType: service.name,
    description: service.description,
    url: abs(`/services/${service.slug}`),
    image: abs(pageData.heroImage),
    provider: orgRef,
    areaServed: SERVICE_AREAS.map((name) => ({ '@type': name === 'Andhra Pradesh' ? 'State' : 'City', name })),
    ...(seo ? { keywords: seo.keywords.join(', ') } : {}),
  };
  const GUIDE_CATEGORY: Record<string, string> = {
    'gate-automation': 'gates-automation', railings: 'railings-balustrades', staircases: 'staircases',
    'pergolas-gazebos': 'pergolas-outdoor', 'sheds-roofing': 'sheds-roofing', 'elevations-facades': 'metal-fabrication',
  };
  const guides = (await listArticles()).filter((a) => a.categorySlug === GUIDE_CATEGORY[service.slug]).slice(0, 3);
  const crumbsSchema = breadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: service.name, path: `/services/${service.slug}` },
  ]);


  // ── Display-only derivations ────────────────────────────────────────────
  const materialsTitle = titleCase(pageData.materialsTitle || 'MATERIALS WE USE');
  const showLongDescription = Boolean(service.description) && service.description !== pageData.overviewDesc;
  const currentSlug = service.slug;
  const otherServices = svc.published.filter((s) => s.slug !== currentSlug);
  const projectCount = pageData.recentProjects.length;
  const jumpLinks = [
    { id: 'overview', label: 'Overview' },
    { id: 'materials', label: materialsTitle },
    { id: 'features', label: 'Features & benefits' },
    { id: 'projects', label: 'Recent projects' },
  ];

  return (
    <div className="vx">
      <JsonLd data={serviceSchema} />
      <JsonLd data={crumbsSchema} />
      {seo?.faqs.length ? <JsonLd data={faqSchema(seo.faqs)} /> : null}

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <PageHero
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: service.name }]}
        kicker="Our services"
        title={[titleCase(pageData.heroTitleTop), titleCase(pageData.heroTitleHighlight)]}
        lead={pageData.heroDesc}
        image={pageData.heroImage}
        imageAlt={service.name}
        actions={
          <>
            <a href={buildQuoteWhatsAppLink(service.name)} target="_blank" rel="noopener noreferrer" className="vx-btn vx-btn-signal">
              Get WhatsApp estimate
              <span className="vx-btn-ico"><MessageCircle size={17} /></span>
            </a>
            <Link href="/contact" className="vx-link" style={{ color: '#fff' }}>Send lead form <ArrowUpRight size={16} /></Link>
          </>
        }
        meta={
          <ul className="vx-svc-page-highlights">
            {pageData.heroHighlights.map(({ Icon, label }) => (
              <li key={label}>
                <Icon size={18} strokeWidth={1.7} />
                <span>{titleCase(label)}</span>
              </li>
            ))}
          </ul>
        }
      />

      {/* ── On-page index ────────────────────────────────────────────────── */}
      <nav className="vx-svc-page-jump" aria-label="On this page">
        <div className="vx-wrap">
          <ol>
            {jumpLinks.map((link, i) => (
              <li key={link.id}>
                <a href={`#${link.id}`}><span>{pad(i + 1)}</span>{link.label}</a>
              </li>
            ))}
          </ol>
        </div>
      </nav>

      {/* ── 01 OVERVIEW ──────────────────────────────────────────────────── */}
      <section id="overview" className="vx-sec vx-sec-white vx-svc-page-anchor">
        <div className="vx-wrap vx-svc-page-overview">
          <div>
            <SectionHead
              num="01"
              kicker="Service overview"
              title={['What we', 'design & build']}
              className="vx-svc-page-stackhead"
            />
            <Reveal className="vx-svc-page-copy">
              <p>{pageData.overviewDesc}</p>
              {showLongDescription && <p>{service.description}</p>}
            </Reveal>

            <Reveal delay={120} className="vx-svc-page-scope">
              <span className="vx-kicker"><i />Scope of work</span>
              <div className="vx-svc-page-scope-cols">
                <ul className="vx-ticks">
                  {pageData.overviewChecklistLeft.map((item) => <li key={item}>{item}</li>)}
                </ul>
                <ul className="vx-ticks">
                  {pageData.overviewChecklistRight.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </Reveal>
          </div>

          <div className="vx-svc-page-overview-side">
            <Reveal className="vx-media vx-svc-page-overview-img">
              <Image
                src={pageData.overviewImage}
                alt={`${service.name} Overview`}
                fill
                sizes="(max-width: 1023px) calc(100vw - 2.5rem), 40vw"
              />
              <span className="vx-media-tag">{service.name}</span>
            </Reveal>

            <Reveal delay={120} className="vx-box">
              <span className="vx-kicker"><i />At a glance</span>
              <table className="vx-spec" style={{ marginTop: '0.75rem' }}>
                <tbody>
                  <tr><th scope="row">Service</th><td>{service.name}</td></tr>
                  {service.materials.length > 0 && (
                    <tr><th scope="row">Materials</th><td>{service.materials.join(', ')}</td></tr>
                  )}
                  <tr><th scope="row">Area served</th><td>Andhra Pradesh</td></tr>
                  <tr><th scope="row">Based in</th><td>{(await getSiteSettings()).address}</td></tr>
                </tbody>
              </table>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 02 MATERIALS ─────────────────────────────────────────────────── */}
      <section id="materials" className="vx-sec vx-sec-tight vx-svc-page-anchor">
        <div className="vx-wrap">
          <SectionHead
            num="02"
            kicker="Specification"
            title={[materialsTitle]}
          />
          <Reveal
            className="vx-svc-page-materials"
            style={{ ['--cols' as string]: Math.min(pageData.materials.length, 6) }}
          >
            {pageData.materials.map((material, i) => (
              <figure key={material.name} className="vx-svc-page-material">
                <div className="vx-svc-page-material-img">
                  <Image
                    src={material.img}
                    alt={material.name}
                    fill
                    sizes="(max-width: 719px) 50vw, (max-width: 1099px) 33vw, 220px"
                  />
                </div>
                <figcaption>
                  <span className="vx-box-num">{pad(i + 1)}</span>
                  {material.name}
                </figcaption>
              </figure>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── 03 FEATURES & BENEFITS ───────────────────────────────────────── */}
      <section id="features" className="vx-sec vx-dark vx-svc-page-anchor">
        <div className="vx-wrap vx-svc-page-features">
          <div className="vx-svc-page-features-head">
            <SectionHead
              num="03"
              kicker="Why choose it"
              title={['Features', '& benefits']}
              className="vx-svc-page-stackhead"
            />
            <Reveal delay={120}>
              <a href={buildQuoteWhatsAppLink(service.name)} target="_blank" rel="noopener noreferrer" className="vx-btn vx-btn-line">
                Discuss your requirement
                <span className="vx-btn-ico"><ArrowUpRight size={17} /></span>
              </a>
            </Reveal>
          </div>

          <Reveal className="vx-hairgrid vx-svc-page-feature-grid">
            {pageData.features.map((feature, i) => {
              const IconComp = feature.icon;
              return (
                <div key={feature.title} className="vx-svc-page-feature">
                  <div className="flex items-center justify-between">
                    <span className="vx-box-icon"><IconComp size={20} strokeWidth={1.6} /></span>
                    <span className="vx-box-num">{pad(i + 1)}</span>
                  </div>
                  <h3 className="vx-h3">{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              );
            })}
          </Reveal>
        </div>
      </section>

      {/* ── 04 RECENT PROJECTS ───────────────────────────────────────────── */}
      <section id="projects" className="vx-sec vx-sec-white vx-svc-page-anchor">
        <div className="vx-wrap">
          <SectionHead
            num="04"
            kicker="Recent projects"
            title={['Recent', 'work']}
            aside={
              <Link href="/projects" className="vx-link">
                View all projects <ArrowRight size={16} />
              </Link>
            }
          />
          <Reveal className="vx-svc-page-mosaic">
            <div className="vx-svc-page-mosaic-grid" data-count={projectCount}>
              {pageData.recentProjects.map((proj, idx) => (
                <Link key={idx} href={proj.href} className="vx-svc-page-proj">
                  <div className="vx-media">
                    <Image
                      src={proj.img}
                      alt={proj.title}
                      fill
                      sizes={idx === 0 ? '(max-width: 719px) 100vw, 66vw' : '(max-width: 719px) 50vw, 33vw'}
                    />
                  </div>
                  <div className="vx-svc-page-proj-cap">
                    <span className="vx-svc-page-proj-cat">{titleCase(proj.category)}</span>
                    <h3>{proj.title}</h3>
                  </div>
                  <span className="vx-svc-page-proj-go" aria-hidden="true"><ArrowUpRight size={16} /></span>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 05 OTHER SERVICES ────────────────────────────────────────────── */}
      {otherServices.length > 0 && (
        <section className="vx-sec vx-sec-tight">
          <div className="vx-wrap">
            <SectionHead
              num="05"
              kicker="More from Veldex"
              title={['Explore other', 'services']}
              aside={
                <Link href="/services" className="vx-link">
                  All services <ArrowRight size={16} />
                </Link>
              }
            />
            <ul className="vx-svc-page-others">
              {otherServices.map((s, i) => (
                <Reveal as="li" key={s.slug} delay={(i % 3) * 60}>
                  <Link href={`/services/${s.slug}`} className="vx-svc-page-other">
                    <span className="vx-box-num">{pad(i + 1)}</span>
                    <span className="vx-svc-page-other-name">{s.name}</span>
                    <span className="vx-svc-page-other-go" aria-hidden="true"><ArrowUpRight size={17} /></span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── FAQ (answers real customer questions; mirrored in FAQPage schema) ── */}
      {seo?.faqs.length ? (
        <section id="faq" className="vx-sec vx-sec-white vx-svc-page-anchor">
          <div className="vx-wrap">
            <SectionHead kicker="Questions we hear" title={[`${service.name}:`, 'common questions']} />
            <div className="vx-faq">
              {seo.faqs.map((f) => (
                <details key={f.q} className="vx-faq-item">
                  <summary><h3>{f.q}</h3><span aria-hidden="true" className="vx-faq-ico" /></summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
            {guides.length > 0 && (
              <div className="vx-faq-guides">
                <span className="vx-faq-guides-label">Related guides</span>
                <ul>
                  {guides.map((g) => (
                    <li key={g.slug}><Link href={`/blog/${g.slug}`}>{g.title} <ArrowUpRight size={15} aria-hidden="true" /></Link></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      ) : null}

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <CtaBand
        kicker="Next step"
        title="Have a project in mind?"
        text={pageData.ctaDesc || "Let's build something extraordinary together. Get in touch with our team today."}
        whatsappContext={service.name}
      />
    </div>
  );
}
