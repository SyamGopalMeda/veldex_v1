/**
 * Default home-hero content. Used until the admin saves hero content (Firestore
 * `settings/hero`), and as the starting point the admin edits from.
 */
export interface HeroSlideConfig {
  id: string;
  enabled: boolean;
  img: string;            // landscape (desktop / tablet landscape)
  mobileImg?: string;     // portrait (phones / upright tablets)
  alt: string;
  eyebrow: string;
  headline: string;
  text: string;
  ctaLabel: string;
  ctaHref: string;
  /** Service whose materials are listed under the buttons (desktop) */
  materialsService?: string;
}

export interface HeroStat { value: string; label: string }

export interface HeroConfig {
  intervalMs: number;     // time each slide stays on screen
  slides: HeroSlideConfig[];
  stats: HeroStat[];      // phone stats card
  updatedAt?: string;
}

export const DEFAULT_HERO: HeroConfig = {
  intervalMs: 7500,
  stats: [
    { value: '100+', label: 'Happy clients' },
    { value: '250+', label: 'Projects completed' },
    { value: '10+', label: 'Years experience' },
  ],
  slides: [
    {
      id: 'floating-staircase', enabled: true,
      img: '/images/hero/desktop/d-floating-staircase.jpg', mobileImg: '/images/hero/mobile/m-floating-oak-staircase.jpg',
      alt: 'Floating staircase with solid oak treads on a black steel stringer and vertical steel balusters',
      eyebrow: 'Custom structural staircases', headline: 'Precision in every cut.',
      text: 'Your vision. Our fabrication. Stronger together.',
      ctaLabel: 'Explore staircases', ctaHref: '/services/staircases', materialsService: 'staircases',
    },
    {
      id: 'oak-stair-balusters', enabled: true,
      img: '/images/hero/desktop/d-oak-stair-balusters.jpg', mobileImg: '/images/hero/mobile/m-oak-stair-balusters.jpg',
      alt: 'Oak staircase with black steel loop balusters in a bright white home',
      eyebrow: 'Steel railings & balusters', headline: 'Perfection in every detail.',
      text: 'CNC laser-cut panels, facades & custom metal works that define architecture.',
      ctaLabel: 'Explore railings', ctaHref: '/services/railings', materialsService: 'railings',
    },
    {
      id: 'curved-foyer', enabled: true,
      img: '/images/hero/desktop/d-curved-foyer-staircase.jpg', mobileImg: '/images/hero/mobile/m-curved-foyer-staircase.jpg',
      alt: 'Curved staircase with black iron balusters rising through a double-height foyer under a chandelier',
      eyebrow: 'Grand & curved staircases', headline: 'Engineered solutions. Built to last.',
      text: 'Custom metal fabrication specialists in Vijayawada — automated gates, architectural railings, spiral staircases, Kerala-style gazebos, and structural metalwork.',
      ctaLabel: 'View projects', ctaHref: '/projects', materialsService: 'staircases',
    },
    {
      id: 'laser-cut-partition', enabled: true,
      img: '/images/hero/desktop/d-laser-cut-partition.jpg', mobileImg: '/images/hero/mobile/m-laser-cut-partition.jpg',
      alt: 'Black CNC laser-cut metal partition screen with an ornamental pattern and warm downlights',
      eyebrow: 'Laser-cut partitions & screens', headline: 'Built on trust. Engineered to last.',
      text: 'From precision laser-cut screens to heavy-duty cantilever gate assemblies, Veldex Fabrications is committed to setting new benchmarks in architectural metal engineering.',
      ctaLabel: 'Explore elevations', ctaHref: '/services/elevations-facades', materialsService: 'elevations-facades',
    },
    {
      id: 'laser-cut-gate', enabled: true,
      img: '/images/hero/desktop/d-laser-cut-gate.jpg', mobileImg: '/images/hero/mobile/m-laser-cut-gate.jpg',
      alt: 'Modern laser-cut steel main gate with wooden slat panels between stone pillars in front of a contemporary house',
      eyebrow: 'Laser-cut main gates', headline: 'Your vision. Our fabrication.',
      text: 'CNC laser-cut panels, facades & custom metal works that define architecture.',
      ctaLabel: 'Explore gates', ctaHref: '/services/gate-automation', materialsService: 'gate-automation',
    },
    {
      id: 'sliding-gate-villa', enabled: true,
      img: '/images/hero/desktop/d-sliding-gate-villa.jpg', mobileImg: '/images/hero/mobile/m-sliding-gate-villa.jpg',
      alt: 'Black steel sliding main gate with slatted and laser-cut Art Deco panels in front of a modern house at sunset',
      eyebrow: 'Sliding & automated gates', headline: 'Building trust. Delivering excellence.',
      text: 'Custom heavy-duty sliding, swing, and trackless gates engineered with automated motor drives and remote smart access.',
      ctaLabel: 'Contact us', ctaHref: '/contact', materialsService: 'gate-automation',
    },
  ],
};
