/**
 * SEO — single source for page metadata and structured data (schema.org).
 *
 * Keyword choices come from real Google autocomplete research (Oct 2026) for the
 * services Veldex offers. Customers search by design ("gate design for home",
 * "ss railing design for balcony"), by trade term ("MS gate", "SS railing",
 * "jali design", "terrace shed") and locally ("fabrication works in vijayawada",
 * "ss railing vijayawada"). Titles stay under ~60 characters and descriptions
 * ~150–160 so search engines show them in full; no keyword stuffing.
 */
import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config';

export const SITE_URL = siteConfig.seo.baseUrl.replace(/\/$/, '');
export const OG_IMAGE = '/images/og-default.jpg';
export const abs = (path: string) => (path.startsWith('http') ? path : `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`);

/** Real project locations — used for areaServed (no invented service areas). */
export const SERVICE_AREAS = ['Vijayawada', 'Guntur', 'Eluru', 'Nuzvid', 'Andhra Pradesh'];

export function pageMetadata({
  title, description, path, image = OG_IMAGE, type = 'website', noindex = false, publishedTime, modifiedTime,
}: {
  title: string; description: string; path: string; image?: string; type?: 'website' | 'article';
  noindex?: boolean; publishedTime?: string; modifiedTime?: string;
}): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type, url: path, title, description, siteName: siteConfig.brand.name, locale: 'en_IN',
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      ...(type === 'article' ? { publishedTime, modifiedTime } : {}),
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

// ── Per-page copy ────────────────────────────────────────────────────────────
export const PAGE_SEO = {
  home: {
    title: 'Veldex Fabrications – Metal Fabrication Works in Vijayawada',
    description: 'Custom gates, SS & glass railings, staircases, pergolas, terrace sheds and laser-cut elevation panels — designed, fabricated and installed in Vijayawada, AP.',
  },
  services: {
    title: 'Metal Fabrication Services in Vijayawada | Veldex',
    description: 'Gate fabrication & automation, SS and glass railings, spiral and floating staircases, pergolas, terrace roofing and laser-cut facades by Veldex in Vijayawada.',
  },
  projects: {
    title: 'Gate, Railing & Staircase Designs – Project Gallery | Veldex',
    description: 'Browse completed gates, SS railings, staircases, pergolas, terrace sheds and laser-cut facades built by Veldex Fabrications in Vijayawada and across AP.',
  },
  blog: {
    title: 'Gate, Railing & Staircase Design Guides | Veldex Blog',
    description: 'Practical guides on gate designs, SS vs MS, railing and staircase options, terrace sheds, pergolas and what affects fabrication cost — from Veldex Fabrications.',
  },
  about: {
    title: 'About Veldex Fabrications | Metal Fabricators, Vijayawada',
    description: 'Veldex Fabrications is a Vijayawada metal fabrication company: CNC laser cutting, certified welding and on-site installation of gates, railings and structures.',
  },
  contact: {
    title: 'Contact Veldex Fabrications | Vijayawada, Andhra Pradesh',
    description: 'Call, WhatsApp or email Veldex Fabrications in Vijayawada for gates, railings, staircases, pergolas, sheds and custom metalwork. Open Monday to Sunday.',
  },
  quote: {
    title: 'Request a Fabrication Quote | Veldex Fabrications',
    description: 'Tell us about your gate, railing, staircase, pergola or shed project and get a tailored estimate from Veldex Fabrications, Vijayawada. Site visits on request.',
  },
  privacy: {
    title: 'Privacy Policy | Veldex Fabrications',
    description: 'How Veldex Fabrications collects, uses and protects the personal information you share through our website, quote and contact forms.',
  },
} as const;

type ServiceSeo = { title: string; description: string; keywords: string[]; faqs: { q: string; a: string }[] };

export const SERVICE_SEO: Record<string, ServiceSeo> = {
  'gate-automation': {
    title: 'Gate Fabrication & Automatic Gates in Vijayawada | Veldex',
    description: 'MS, SS and laser-cut main gates — sliding, swing and trackless designs with motor automation. Custom gate fabrication and installation in Vijayawada, AP.',
    keywords: ['gate design for home', 'main gate design', 'MS gate design', 'sliding gate design', 'laser cut gate design', 'automatic gate', 'gate fabrication Vijayawada'],
    faqs: [
      { q: 'Which is better for a main gate — MS or SS?', a: 'Mild steel (MS) is strong and economical and suits heavy sliding or swing gates once it is primed and powder- or PU-coated. Stainless steel (SS 304) costs more but resists rust with little maintenance, which helps near the coast or where the gate is washed often. Many homes use an MS frame with SS or laser-cut infill panels.' },
      { q: 'Can an existing gate be automated?', a: 'Often, yes. A sliding gate needs a level track (or a cantilever setup) and a sound frame; a swing gate needs strong pillars and hinges. We inspect the gate on site and recommend a motor sized to its weight and width.' },
      { q: 'What decides the cost of a custom gate?', a: 'Size and weight of steel, the material (MS, SS or a mix), laser-cut or decorative infill, the finish (powder coat or PU), hardware and wheels, and whether automation is added. We give an itemised estimate after measuring.' },
      { q: 'Do you make laser-cut gate designs?', a: 'Yes. Patterns are cut on CNC laser machines from MS or SS sheet, so geometric, floral, jali or custom name and logo designs can be produced accurately.' },
    ],
  },
  railings: {
    title: 'SS & Glass Railing Work in Vijayawada | Veldex Fabrications',
    description: 'Stainless steel (SS 304/316), toughened glass and MS designer railings for balconies, staircases and terraces — fabricated and fitted in Vijayawada, AP.',
    keywords: ['SS railing design', 'glass railing for balcony', 'staircase railing design', 'balcony railing design', 'SS railing Vijayawada', 'glass railing Vijayawada'],
    faqs: [
      { q: 'SS 304 or SS 316 — which grade should I choose?', a: 'SS 304 suits most homes. SS 316 contains molybdenum and resists corrosion better, so it is preferred for coastal, poolside or heavily exposed balconies.' },
      { q: 'How thick should glass be for a balcony or staircase railing?', a: 'Toughened (tempered) safety glass is used; 10–12 mm is common for railings, and laminated toughened glass adds safety because it holds together if broken. The right thickness depends on panel size and how it is fixed.' },
      { q: 'How is railing priced?', a: 'Railing is usually quoted per running foot. The rate depends on the material and grade, pipe and post sizes, glass type and thickness, the design and the fixing method. We confirm the price after measuring the site.' },
    ],
  },
  staircases: {
    title: 'Spiral, Floating & MS Staircases in Vijayawada | Veldex',
    description: 'Custom metal staircases — spiral, floating (cantilever) and MS outdoor stairs with SS or glass railings. Designed, fabricated and installed in Vijayawada, AP.',
    keywords: ['spiral staircase', 'floating staircase', 'MS staircase design', 'staircase design for home', 'outdoor staircase', 'staircase railing design'],
    faqs: [
      { q: 'Where does a spiral staircase work best?', a: 'Where floor space is tight — terrace access, duplex lofts or shops. It needs a small circular footprint, so it fits places a straight staircase cannot.' },
      { q: 'Is a floating staircase safe?', a: 'Yes, when it is engineered properly. Floating (cantilever or mono-stringer) stairs rely on a strong supporting wall or a hidden steel stringer, so the structure is checked before fabrication.' },
      { q: 'Can the treads be wood or granite?', a: 'Yes. A steel structure can carry wooden, granite, chequered-plate or glass treads, finished to match the interior.' },
    ],
  },
  'pergolas-gazebos': {
    title: 'Pergola & Gazebo Design for Terraces, Vijayawada | Veldex',
    description: 'Steel pergolas, Kerala-style gazebos and terrace canopies with polycarbonate or louvered roofs — designed and built for homes in Vijayawada and across AP.',
    keywords: ['pergola design for terrace', 'gazebo design on terrace', 'pergola design for home', 'Kerala style gazebo', 'terrace pergola'],
    faqs: [
      { q: 'Which roof is best for a terrace pergola?', a: 'Multiwall or solid polycarbonate lets light through while blocking rain and UV; metal sheet gives full shade; louvers let you adjust light and airflow. The choice depends on how you plan to use the space.' },
      { q: 'Do pergolas need a strong roof slab?', a: 'The structure is anchored to the slab or parapet, so we check the anchoring points and wind exposure on site before designing the frame.' },
    ],
  },
  'sheds-roofing': {
    title: 'Terrace Shed & Roofing Work in Vijayawada | Veldex',
    description: 'Terrace sheds, car parking sheds and industrial roofing on engineered steel frames — polycarbonate, metal and insulated sheets, installed in Vijayawada, AP.',
    keywords: ['terrace shed design', 'terrace roofing', 'polycarbonate roofing sheet', 'balcony shed design', 'car parking shed', 'roofing Vijayawada'],
    faqs: [
      { q: 'Polycarbonate or metal sheet for a terrace shed?', a: 'Polycarbonate keeps the space bright and is light; metal sheets give full shade; insulated (puff) panels reduce heat and noise. Many terraces mix them.' },
      { q: 'How long does a terrace shed take to install?', a: 'Most residential sheds are fabricated in the workshop and installed in a few days, depending on size and weather. We share a schedule with the estimate.' },
    ],
  },
  'elevations-facades': {
    title: 'Laser-Cut Elevation Panels & Jali Screens | Veldex',
    description: 'CNC laser-cut facade panels, jali screens, compound-wall and balcony panels and decorative cladding for building elevations — made in Vijayawada, AP.',
    keywords: ['jali design', 'front elevation design', 'laser cut panels', 'CNC laser cutting Vijayawada', 'compound wall design', 'facade panels'],
    faqs: [
      { q: 'Can you cut a custom jali or elevation pattern?', a: 'Yes. Patterns are drawn in CAD and cut on CNC laser machines, so geometric, floral, traditional jali or fully custom designs can be produced to size.' },
      { q: 'Which material is used for exterior panels?', a: 'Mild steel with a protective coating, stainless steel, or corten-look finishes, chosen for the look you want and the exposure of the wall.' },
    ],
  },
};

// ── Structured data ──────────────────────────────────────────────────────────
const ORG_ID = `${SITE_URL}/#organization`;

export function organizationSchema(live?: { phoneHref?: string; email?: string; social?: Record<string, string> }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': ORG_ID,
    name: siteConfig.brand.name,
    legalName: siteConfig.brand.legalName,
    url: SITE_URL,
    logo: abs('/images/logo.png'),
    image: abs(OG_IMAGE),
    description: siteConfig.brand.description,
    telephone: live?.phoneHref ?? siteConfig.contact.phone,
    email: live?.email ?? siteConfig.contact.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteConfig.location.city,
      addressRegion: siteConfig.location.state,
      postalCode: siteConfig.location.pincode,
      addressCountry: 'IN',
    },
    areaServed: SERVICE_AREAS.map((name) => ({ '@type': name === 'Andhra Pradesh' ? 'State' : 'City', name })),
    openingHoursSpecification: [{
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '09:00', closes: '21:00',
    }],
    sameAs: [...new Set([...(live?.social ? Object.values(live.social) : [siteConfig.social.instagram]), siteConfig.social.threads].filter(Boolean))],
    knowsAbout: ['Metal fabrication', 'Gate automation', 'Stainless steel railings', 'Glass railings', 'Spiral staircases', 'Pergolas', 'Terrace roofing', 'CNC laser cutting'],
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: siteConfig.brand.name,
    inLanguage: 'en-IN',
    publisher: { '@id': ORG_ID },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.path) })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

export function itemListSchema(name: string, items: { name: string; path: string; image?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(it.path), name: it.name, ...(it.image ? { image: abs(it.image) } : {}) })),
  };
}

export const orgRef = { '@id': ORG_ID };
