export interface BlogSection {
  number: string;
  title: string;
  content: string;
  image?: string;
  imageAlt?: string;
  internalLink?: {
    text: string;
    href: string;
    linkTitle: string;
  };
}

export interface RelatedProjectRef {
  title: string;
  slug: string;
  category: string;
  location: string;
  image: string;
  description: string;
}

export interface SocialContentCard {
  platform: 'instagram' | 'youtube';
  title: string;
  caption: string;
  url: string;
  thumbnail: string;
  videoUrl?: string;
  badge: string;
}

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  titleAccent?: string; // Part of title styled in brand green
  excerpt: string;
  category: string;
  categorySlug: string;
  date: string;
  datePublishedISO: string;
  dateModifiedISO: string;
  author: string;
  authorRole?: string;
  readTime: string;
  featuredImage: string;
  featuredImageAlt: string;
  intro?: string;
  sections?: BlogSection[];
  conclusion?: string;
  tags: string[];
  isPopular?: boolean;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl?: string;
  socialImage?: string;
  relatedProject?: RelatedProjectRef;
  relatedArticleSlugs?: string[];
  socialContent?: SocialContentCard;
  status: 'published' | 'draft';
}

export interface BlogCategory {
  name: string;
  slug: string;
  count: number;
}

export const blogCategories: BlogCategory[] = [
  { name: 'All Articles', slug: 'all', count: 6 },
  { name: 'Gates & Automation', slug: 'gates-automation', count: 1 },
  { name: 'Staircases', slug: 'staircases', count: 1 },
  { name: 'Railings & Balustrades', slug: 'railings-balustrades', count: 1 },
  { name: 'Pergolas & Outdoor', slug: 'pergolas-outdoor', count: 1 },
  { name: 'Terrace Sheds & Roofing', slug: 'sheds-roofing', count: 1 },
  { name: 'Metal Fabrication', slug: 'metal-fabrication', count: 1 },
];

export const blogArticles: BlogArticle[] = [
  {
    id: '1',
    slug: 'top-5-gate-design-trends-for-modern-homes',
    title: 'Top 5 Gate Design Trends for Modern Homes',
    titleAccent: 'FOR MODERN HOMES',
    excerpt: 'Explore modern gate design trends, CNC laser-cut patterns, smart automation options and architectural considerations for Indian villas.',
    category: 'GATES',
    categorySlug: 'gates-automation',
    date: 'May 10, 2024',
    datePublishedISO: '2024-05-10T09:00:00+05:30',
    dateModifiedISO: '2024-05-10T14:30:00+05:30',
    author: 'Veldex Team',
    authorRole: 'Fabrication Engineering Specialists',
    readTime: '5 min read',
    featuredImage: '/images/gate.jpg',
    featuredImageAlt: 'Modern automatic laser-cut entrance gate for a contemporary residential villa in Vijayawada',
    metaTitle: 'Modern Gate Design Trends for Homes | Veldex Fabrications',
    metaDescription: 'Explore modern gate design trends, materials, smart automation options and precision fabrication insights from Veldex Fabrications, Vijayawada.',
    status: 'published',
    intro:
      'Your entrance gate establishes the architectural identity of your property. In 2024, residential metal gates across Andhra Pradesh and Telangana are transitioning from purely utilitarian barriers to sculpted architectural statements that combine perimeter security, CNC precision, and effortless smart automation.',
    sections: [
      {
        number: '1',
        title: 'CNC LASER-CUT JAALI DESIGNS',
        content:
          'Fiber-laser cutting technology allows intricate geometric lattices and traditional floral motifs to be carved directly into 3mm to 5mm mild steel sheets. These screens provide optimal ventilation, privacy from street sightlines, and dramatic ambient backlighting after dusk.',
        image: '/images/gate_overview.jpg',
        imageAlt: 'CNC laser cut mild steel jaali gate panel with backlighting',
        internalLink: {
          text: 'Explore Gate Automation Solutions',
          href: '/services/gate-automation',
          linkTitle: 'Veldex Gate Fabrication & Automation Service',
        },
      },
      {
        number: '2',
        title: 'MINIMAL & MODERN SLAT GEOMETRIES',
        content:
          'Horizontal and vertical hollow structural sections (HSS) with flush mitred corners deliver a timeless minimalist aesthetic. Paired with hidden concealed hinges and acoustic rubber dampeners, modern slat gates complement both contemporary villas and commercial frontages.',
        image: '/images/gate_proj_2.jpg',
        imageAlt: 'Minimalist horizontal slat entrance gate with powder coated matte finish',
      },
      {
        number: '3',
        title: 'HYBRID COMPOSITE MATERIALS',
        content:
          'Pairing heavy mild steel perimeter frames with wood-finish aluminium composites, frosted tempered glass, or natural teak inserts produces textural warmth while drastically reducing total dead-weight on motor drive systems.',
        image: '/images/gate_proj_3.jpg',
        imageAlt: 'Architectural metal gate combining mild steel frame with wood-textured infill',
      },
      {
        number: '4',
        title: 'SMART TRACKLESS CANTILEVER AUTOMATION',
        content:
          'Ground track grooves frequently trap gravel, rainwater, and sand. Trackless cantilever sliding gate assemblies suspend the gate body entirely above the ground on sealed internal bearing carriages, opening smoothly via remote control, smartphone apps, or loop sensors.',
        image: '/images/gate.jpg',
        imageAlt: 'Trackless cantilever automated sliding gate mechanism in motion',
      },
      {
        number: '5',
        title: 'EXTERIOR ARCHITECTURAL POWDER COATING',
        content:
          'Coastal humidity and intense subtropical sunlight require multi-layer protection. Electrostatic thermoset powder coatings over epoxy zinc-rich primer seal raw steel against rust and maintain deep charcoal and bronze tones for decades with minimal maintenance.',
        image: '/images/elevation.jpg',
        imageAlt: 'Anti-corrosion powder coated metal gate surface inspection',
      },
    ],
    conclusion:
      'Selecting the ideal gate design requires balancing curb appeal, wind resistance, automation mechanisms, and anti-rust treatments. At Veldex Fabrications, every gate is custom-engineered and installed to perfection by certified metal craftsmen.',
    tags: [
      'Gate Design',
      'Modern Homes',
      'Laser Cut',
      'Automation',
      'Home Security',
      'Metal Gates',
      'Trends 2024',
    ],
    isPopular: true,
    relatedProject: {
      title: 'Modern Villa Gate',
      slug: 'modern-villa-gate',
      category: 'Gate Fabrication & Automation',
      location: 'Vijayawada, Andhra Pradesh',
      image: '/images/gate.jpg',
      description: 'Custom laser-cut mild steel gate with smart automation motor and weather-resistant black finish.',
    },
    relatedArticleSlugs: [
      'choosing-the-perfect-staircase-for-your-space',
      'the-metal-fabrication-process-explained',
    ],
    socialContent: {
      platform: 'instagram',
      title: 'Automated Sliding Gate In Motion',
      caption: 'Watch our custom-fabricated trackless cantilever sliding gate operating effortlessly at a private residence in Vijayawada.',
      url: 'https://www.instagram.com/veldexfabrications',
      thumbnail: '/images/gate_proj_2.jpg',
      videoUrl: '/images/gate_sliding_action.mp4',
      badge: 'Instagram Reel',
    },
  },
  {
    id: '2',
    slug: 'choosing-the-perfect-staircase-for-your-space',
    title: 'Choosing the Perfect Staircase for Your Space',
    titleAccent: 'FOR YOUR SPACE',
    excerpt: 'A complete guide to structural steel staircases, monostringers, spiral steps, glass balustrades and architectural ergonomics.',
    category: 'STAIRCASES',
    categorySlug: 'staircases',
    date: 'May 5, 2024',
    datePublishedISO: '2024-05-05T10:00:00+05:30',
    dateModifiedISO: '2024-05-05T16:00:00+05:30',
    author: 'Veldex Team',
    authorRole: 'Structural Steel Specialists',
    readTime: '4 min read',
    featuredImage: '/images/stairs.jpg',
    featuredImageAlt: 'Modern structural steel floating staircase with glass balustrade in a duplex villa',
    metaTitle: 'Architectural Staircase Design Guide | Veldex Fabrications',
    metaDescription: 'Explore structural steel staircase types, spiral stairs, floating monostringers and glass railing engineering from Veldex Fabrications.',
    status: 'published',
    intro:
      'Staircases are structural sculptures that define vertical flow within duplex residences, commercial showrooms, and terrace penthouses. Choosing the optimal steel structure, step cantilever, and balustrade configuration transforms utilitarian floor access into breathtaking interior art.',
    sections: [
      {
        number: '1',
        title: 'MONOSTRINGER & FLOATING TREAD STYLES',
        content:
          'A central load-bearing steel spine concealed beneath the stair treads eliminates bulky riser walls. This allows ambient natural daylight to pour through open risers, creating a weightless, floating aesthetic that makes duplex interiors feel substantially larger.',
        image: '/images/stairs.jpg',
        imageAlt: 'Steel spine monostringer floating staircase',
        internalLink: {
          text: 'View Custom Staircase Engineering',
          href: '/services/staircases',
          linkTitle: 'Veldex Custom Staircase Services',
        },
      },
      {
        number: '2',
        title: 'COMPACT HELICAL & SPIRAL DESIGNS',
        content:
          'When square footage is constrained, helical spiral staircases provide safe vertical transit within footprints as compact as 5 ft by 5 ft. Engineered around a heavy-gauge central structural steel pipe, continuous helical handrails add fluid organic drama.',
        image: '/images/railing_overview.jpg',
        imageAlt: 'Compact spiral staircase with helical handrail',
      },
      {
        number: '3',
        title: 'SAFETY BALUSTRADES & MATERIAL COMBINATIONS',
        content:
          'Pairing structural mild steel stringers with 12mm toughened safety glass or Grade 304 stainless steel balustrades guarantees zero vibration and conforms to rigorous building safety codes without sacrificing visual transparency.',
        image: '/images/railings.jpg',
        imageAlt: 'Frameless glass and stainless steel safety balustrade installation',
      },
    ],
    conclusion:
      'From preliminary 3D load analysis to precision on-site alignment and structural anchoring, Veldex Fabrications designs staircases engineered for lifetime rigidity and modern elegance.',
    tags: ['Staircases', 'Spiral Stairs', 'Interior Design', 'Structural Steel', 'Modern Architecture'],
    isPopular: true,
    relatedProject: {
      title: 'Glass Staircase',
      slug: 'glass-staircase',
      category: 'Custom Staircases',
      location: 'Guntur, Andhra Pradesh',
      image: '/images/stairs.jpg',
      description: 'Modern steel spine staircase with frameless 12mm toughened glass balustrades and wooden treads.',
    },
    relatedArticleSlugs: [
      'top-5-gate-design-trends-for-modern-homes',
      'the-metal-fabrication-process-explained',
    ],
    socialContent: {
      platform: 'instagram',
      title: 'Structural Staircase Installation Tour',
      caption: 'Step inside this Guntur duplex villa to see how our steel spine monostringer staircase anchors the entire living space.',
      url: 'https://www.instagram.com/veldexfabrications',
      thumbnail: '/images/stairs.jpg',
      videoUrl: '/images/stairs_showcase_bg.mp4',
      badge: 'Instagram Video',
    },
  },
  {
    id: '3',
    slug: 'benefits-of-adding-a-pergola-to-your-home',
    title: 'Benefits of Adding a Pergola to Your Home',
    titleAccent: 'TO YOUR HOME',
    excerpt: 'Discover how architectural steel pergolas, rooftop gazebos, and climate-resistant canopies transform outdoor living spaces.',
    category: 'PERGOLAS',
    categorySlug: 'pergolas-outdoor',
    date: 'April 28, 2024',
    datePublishedISO: '2024-04-28T09:30:00+05:30',
    dateModifiedISO: '2024-04-28T15:00:00+05:30',
    author: 'Veldex Team',
    authorRole: 'Outdoor Living Architectural Designers',
    readTime: '4 min read',
    featuredImage: '/images/gazebo.jpg',
    featuredImageAlt: 'Luxury rooftop gazebo pergola with evening warm lighting and ambient seating',
    metaTitle: 'Benefits of Adding a Pergola to Your Home | Veldex Fabrications',
    metaDescription: 'Discover how custom steel pergolas, gazebos and terrace canopies expand livable space and reduce thermal heat from Veldex Fabrications.',
    status: 'published',
    intro:
      'Urban homeowners across South India are reclaiming their rooftop terraces and garden patios. A bespoke architectural metal pergola bridges the gap between indoor luxury and fresh open-air living while providing essential relief from intense subtropical solar heat.',
    sections: [
      {
        number: '1',
        title: 'EXPANDED YEAR-ROUND OUTDOOR LIVING',
        content:
          'A covered pergola creates a protected setting for family gatherings, morning yoga, and evening entertainment, effectively adding hundreds of usable square feet of livable real estate to your villa or penthouse terrace.',
        image: '/images/gazebo.jpg',
        imageAlt: 'Outdoor terrace lounge protected by metal pergola canopy',
        internalLink: {
          text: 'Explore Pergolas & Gazebos Services',
          href: '/services/pergolas-gazebos',
          linkTitle: 'Veldex Pergolas & Gazebos Services',
        },
      },
      {
        number: '2',
        title: 'SOLAR HEAT SHIELDING & ENERGY SAVINGS',
        content:
          'Direct sunlight on exposed concrete roofs causes massive heat absorption into the upper floors. Adding a pergola structure with insulated polycarbonate or clay-tile cladding lowers slab temperatures by up to 7°C, significantly reducing air conditioning load.',
        image: '/images/sheds.jpg',
        imageAlt: 'Thermal heat reduction roofing sheets on steel pergola structure',
      },
      {
        number: '3',
        title: 'ROBUST COASTAL MONSOON RESISTANCE',
        content:
          'Unlike lightweight aluminum kits that rattle in monsoon windstorms, heavy-gauge structural steel pergolas are anchored into reinforced column footings with concealed chemical fasteners, engineered to withstand high wind velocity and heavy rainfall.',
        image: '/images/gazebo.jpg',
        imageAlt: 'Heavy duty steel rafter joints and weatherproof roofing',
      },
    ],
    conclusion:
      'From traditional Kerala-inspired pitched roof gazebos to minimalist flat-roof motorized louvered pergolas, Veldex Fabrications designs outdoor structures engineered to stand firm for decades.',
    tags: ['Pergolas', 'Gazebos', 'Outdoor Living', 'Rooftop Lounge', 'Villa Design'],
    isPopular: true,
    relatedProject: {
      title: 'Rooftop Pergola',
      slug: 'rooftop-pergola',
      category: 'Pergolas & Gazebos',
      location: 'Vijayawada, Andhra Pradesh',
      image: '/images/gazebo.jpg',
      description: 'Kerala-inspired pitched roof steel pergola with warm ambient illumination and tile coverage.',
    },
    relatedArticleSlugs: [
      'the-metal-fabrication-process-explained',
      'top-5-gate-design-trends-for-modern-homes',
    ],
    socialContent: {
      platform: 'instagram',
      title: 'Rooftop Gazebo Sunset View',
      caption: 'See how this rooftop pergola in Vijayawada transformed an unshaded concrete terrace into a tranquil private sanctuary.',
      url: 'https://www.instagram.com/veldexfabrications',
      thumbnail: '/images/gazebo.jpg',
      badge: 'Instagram Showcase',
    },
  },
  {
    id: '4',
    slug: 'the-metal-fabrication-process-explained',
    title: 'The Metal Fabrication Process Explained',
    titleAccent: 'PROCESS EXPLAINED',
    excerpt: 'A behind-the-scenes look at precision metal fabrication: CAD modeling, CNC fiber lasers, certified structural welding and powder coating.',
    category: 'FABRICATION',
    categorySlug: 'metal-fabrication',
    date: 'April 20, 2024',
    datePublishedISO: '2024-04-20T08:30:00+05:30',
    dateModifiedISO: '2024-04-20T17:00:00+05:30',
    author: 'Veldex Team',
    authorRole: 'Chief Fabrication Technicians',
    readTime: '6 min read',
    featuredImage: '/images/hero_welder.jpg',
    featuredImageAlt: 'Certified welder fabricating heavy structural steel components in Veldex workshop',
    metaTitle: 'Precision Metal Fabrication Process | Veldex Fabrications',
    metaDescription: 'Discover our end-to-end metal fabrication process: 3D CAD design, CNC laser cutting, TIG/MIG welding and anti-rust finishes at Veldex Fabrications.',
    status: 'published',
    intro:
      'True architectural metalwork is where engineering discipline meets artistic craftsmanship. Take a step inside the Veldex Fabrications workshop in Vijayawada to see how raw structural steel is shaped into millimeter-precise gates, staircases, and facades.',
    sections: [
      {
        number: '1',
        title: 'SITE AUDIT & DIGITAL 3D CAD MODELING',
        content:
          'Every fabrication project begins with digital laser distance measurements at the client site. Our design engineers translate architectural drawings into 3D CAD models, performing virtual fit checks and load-bearing stress calculations before cutting steel.',
        image: '/images/hero_welder.jpg',
        imageAlt: 'Digital CAD engineering model and fabrication blueprint',
        internalLink: {
          text: 'Discover Our Fabrication Services',
          href: '/services/elevations-facades',
          linkTitle: 'Veldex Elevations & Metalwork Services',
        },
      },
      {
        number: '2',
        title: 'HIGH-PRECISION CNC FIBER LASER CUTTING',
        content:
          'Computer-controlled fiber lasers slice through thick mild steel, stainless steel, and aluminum sheets at ultra-high temperatures. The cut edges are burr-free with zero heat-induced metal warping, allowing intricate custom jaali patterns to be cut cleanly.',
        image: '/images/hero_welder.jpg',
        imageAlt: 'CNC laser cutting high tensile steel plate',
      },
      {
        number: '3',
        title: 'CERTIFIED TIG & MIG STRUCTURAL WELDING',
        content:
          'Skilled metalworkers align components in rigid jigs before executing full-penetration TIG (Tungsten Inert Gas) and MIG welds. Welds are ground flush and ultrasonically checked to ensure joint strength equals or exceeds the parent metal.',
        image: '/images/hero_welder.jpg',
        imageAlt: 'Structural MIG welding with argon shielding gas',
      },
      {
        number: '4',
        title: 'FOUR-STAGE ANTI-CORROSION FINISHING',
        content:
          'Metal components undergo chemical degreasing, grit blasting, zinc phosphating, and epoxy primer coating before electrostatic powder coating or marine-grade polyurethane enameling is baked on at 200°C for lifetime rust resistance.',
        image: '/images/hero_welder.jpg',
        imageAlt: 'Electrostatic powder coat curing oven process',
      },
    ],
    conclusion:
      'Whether building an automated gate or a multi-story building facade, Veldex Fabrications adheres to uncompromising quality standards that guarantee structural stability and refined aesthetics.',
    tags: ['Metal Fabrication', 'CNC Laser Cutting', 'Welding', 'Engineering', 'Powder Coating'],
    isPopular: true,
    relatedProject: {
      title: 'Industrial Shed',
      slug: 'industrial-shed',
      category: 'Terrace Sheds & Roofing',
      location: 'Vijayawada, Andhra Pradesh',
      image: '/images/sheds.jpg',
      description: 'Heavy structural steel warehouse shed with 40-foot clear span and motorized rolling shutters.',
    },
    relatedArticleSlugs: [
      'top-5-gate-design-trends-for-modern-homes',
      'benefits-of-adding-a-pergola-to-your-home',
    ],
    socialContent: {
      platform: 'youtube',
      title: 'Behind the Scenes: Laser Cutting & Welding',
      caption: 'Watch our master fabricators slice and weld heavy structural steel inside the Veldex workshop.',
      url: 'https://www.instagram.com/veldexfabrications',
      thumbnail: '/images/hero_welder.jpg',
      videoUrl: '/images/hero_laser_cutting.mp4',
      badge: 'Workshop Video',
    },
  },
  {
    id: '5',
    slug: 'stainless-steel-vs-mild-steel-railings',
    title: 'Stainless Steel vs Mild Steel Railings: Complete Comparison Guide',
    titleAccent: 'COMPLETE COMPARISON GUIDE',
    excerpt: 'Detailed comparison of Grade 304/316 stainless steel vs powder-coated mild steel for balcony railings, stair balustrades, and coastal longevity.',
    category: 'RAILINGS',
    categorySlug: 'railings-balustrades',
    date: 'April 12, 2024',
    datePublishedISO: '2024-04-12T09:00:00+05:30',
    dateModifiedISO: '2024-04-12T16:45:00+05:30',
    author: 'Veldex Team',
    authorRole: 'Architectural Railing Engineers',
    readTime: '5 min read',
    featuredImage: '/images/railings.jpg',
    featuredImageAlt: 'Modern glass balustrade and stainless steel railing installation on residential balcony',
    metaTitle: 'Stainless Steel vs Mild Steel Railings | Veldex Fabrications',
    metaDescription: 'Compare Grade 304/316 stainless steel and powder-coated mild steel railings for cost, durability, rust resistance and aesthetics with Veldex Fabrications.',
    status: 'published',
    intro:
      'Balcony and staircase railings serve as critical life-safety barriers and prominent visual features of your home. Deciding between architectural Grade 304/316 Stainless Steel and precision-fabricated Mild Steel requires understanding durability, coastal weather exposure, maintenance cycles, and budget parameters.',
    sections: [
      {
        number: '1',
        title: 'CORROSION RESISTANCE & COASTAL EXPOSURE',
        content:
          'Grade 304 and 316 Stainless Steel contain high chromium and nickel ratios that form a self-healing passive chromium oxide film, providing unmatched rust immunity even in humid environments. Mild steel requires zinc-primer and electrostatic powder coating to prevent oxidation.',
        image: '/images/railing_overview.jpg',
        imageAlt: 'Grade 304 stainless steel railing post with satin hairline finish',
        internalLink: {
          text: 'Explore Railing Fabrication Services',
          href: '/services/railings',
          linkTitle: 'Veldex Railings & Balustrades Services',
        },
      },
      {
        number: '2',
        title: 'DESIGN FLEXIBILITY & CNC JAALI PATTERNS',
        content:
          'Mild steel offers superior ductility and weldability, making it ideal for complex CNC laser-cut jaali screens, decorative geometric patterns, and bespoke color finishes matching your building elevation.',
        image: '/images/railings.jpg',
        imageAlt: 'Laser cut mild steel railing panel with matte black finish',
      },
      {
        number: '3',
        title: 'GLASS COMBINATIONS & MODERN SLIM PROFILES',
        content:
          'Both materials pair seamlessly with 12mm to 15mm toughened safety glass. Stainless steel spigots and continuous base shoes deliver ultra-minimalist frameless aesthetics with unobstructed views.',
        image: '/images/railing_hero.jpg',
        imageAlt: 'Frameless glass balcony railing with bottom base profile',
      },
    ],
    conclusion:
      'For maximum rust resistance in exposed balconies, Stainless Steel Grade 304/316 is the gold standard. For interior stairs and custom laser-cut patterns, powder-coated Mild Steel delivers high design versatility at a competitive cost.',
    tags: ['Railings', 'Balustrades', 'Stainless Steel', 'Mild Steel', 'Glass Railings', 'Safety Codes'],
    isPopular: true,
    relatedProject: {
      title: 'Stainless Steel Balcony Railing',
      slug: 'ss-railing',
      category: 'Railings & Balustrades',
      location: 'Vijayawada, Andhra Pradesh',
      image: '/images/railings.jpg',
      description: 'Grade 304 stainless steel balcony railings with satin brushed finish and continuous ergonomic handrails.',
    },
    relatedArticleSlugs: [
      'choosing-the-perfect-staircase-for-your-space',
      'top-5-gate-design-trends-for-modern-homes',
    ],
    socialContent: {
      platform: 'instagram',
      title: 'Frameless Glass Railing Installation',
      caption: 'Testing the structural rigidity and optical clarity of our frameless glass balcony railings in Vijayawada.',
      url: 'https://www.instagram.com/veldexfabrications',
      thumbnail: '/images/railings.jpg',
      badge: 'Instagram Showcase',
    },
  },
  {
    id: '6',
    slug: 'terrace-sheds-polycarbonate-vs-insulated-panels',
    title: 'Terrace Sheds & Roofing: Polycarbonate vs Insulated Panels',
    titleAccent: 'POLYCARBONATE VS INSULATED PANELS',
    excerpt: 'Comprehensive guide to choosing the best roofing material for rooftop terrace sheds, car parking canopies, thermal insulation and weather protection.',
    category: 'SHEDS & ROOFING',
    categorySlug: 'sheds-roofing',
    date: 'April 05, 2024',
    datePublishedISO: '2024-04-05T11:00:00+05:30',
    dateModifiedISO: '2024-04-05T18:00:00+05:30',
    author: 'Veldex Team',
    authorRole: 'Structural Roofing Specialists',
    readTime: '5 min read',
    featuredImage: '/images/sheds.jpg',
    featuredImageAlt: 'Modern structural steel terrace shed canopy covering rooftop lounge',
    metaTitle: 'Terrace Sheds & Roofing Materials Guide | Veldex Fabrications',
    metaDescription: 'Compare polycarbonate sheets, insulated puff panels and color-coated steel roofing for terrace sheds and car canopies with Veldex Fabrications.',
    status: 'published',
    intro:
      'A rooftop terrace shed or cantilevered car park canopy protects your property from torrential monsoon rains and scorching summer heat. Selecting between multiwall polycarbonate sheets and sandwich insulated panels determines the light transmission, thermal insulation, and lifespan of your roofing structure.',
    sections: [
      {
        number: '1',
        title: 'POLYCARBONATE SHEETS: NATURAL LIGHT & IMPACT RESISTANCE',
        content:
          'UV-coated polycarbonate sheets offer 200 times the impact resistance of glass while permitting pleasant diffused natural daylight. Multiwall hollow honeycomb structures scatter harsh sunlight, preventing glare while maintaining bright terrace usability.',
        image: '/images/sheds.jpg',
        imageAlt: 'UV protected multiwall polycarbonate roofing installation',
        internalLink: {
          text: 'Explore Terrace Sheds & Roofing Services',
          href: '/services/sheds-roofing',
          linkTitle: 'Veldex Terrace Sheds & Roofing Services',
        },
      },
      {
        number: '2',
        title: 'INSULATED PUF PANELS: MAXIMUM HEAT REDUCTION',
        content:
          'Polyurethane foam (PUF) sandwich panels with pre-painted steel exterior skins deliver thermal insulation that lowers ambient temperatures underneath the shed by 6°C to 10°C, making them the ultimate choice for habitable rooftop gyms, offices, and utility spaces.',
        image: '/images/sheds.jpg',
        imageAlt: 'Insulated PUF sandwich panel roof on steel truss structure',
      },
      {
        number: '3',
        title: 'ENGINEERED STEEL TRUSSES & DRAINAGE GUTTERS',
        content:
          'A reliable roof requires heavy structural steel purlins and integrated high-capacity rain gutters. Seamless flashing and sloped drainage prevent water ponding and eliminate ceiling leakages during cyclonic storms.',
        image: '/images/sheds.jpg',
        imageAlt: 'Structural steel roofing framework with integrated rainwater gutter',
      },
    ],
    conclusion:
      'Choose Polycarbonate when natural daylight transmission is your primary goal, and Insulated PUF Panels when maximum thermal heat insulation and rain acoustic dampening are desired.',
    tags: ['Terrace Sheds', 'Roofing', 'Polycarbonate', 'PUF Panels', 'Weather Protection', 'Steel Truss'],
    isPopular: true,
    relatedProject: {
      title: 'Terrace Roofing Project',
      slug: 'terrace-roofing',
      category: 'Terrace Sheds & Roofing',
      location: 'Vijayawada, Andhra Pradesh',
      image: '/images/sheds.jpg',
      description: 'Heavy duty terrace roofing structure with heat-reduction insulated panels and integrated rainwater gutter system.',
    },
    relatedArticleSlugs: [
      'benefits-of-adding-a-pergola-to-your-home',
      'the-metal-fabrication-process-explained',
    ],
    socialContent: {
      platform: 'instagram',
      title: 'Terrace Shed Monsoon Rain Test',
      caption: 'Watch our terrace shed gutter system channel heavy rainwater cleanly away during peak monsoon.',
      url: 'https://www.instagram.com/veldexfabrications',
      thumbnail: '/images/sheds.jpg',
      badge: 'Instagram Showcase',
    },
  },
  // ── SEO content (Oct 2026): long-tail guides chosen from real search demand ──
  {
    id: '7',
    slug: 'ss-railing-price-per-feet-cost-factors',
    title: 'SS Railing Price per Feet: What Actually Decides the Cost',
    titleAccent: 'WHAT DECIDES THE COST',
    excerpt: 'Why stainless steel railing quotes differ so much — grade, pipe size, glass, design and fixing — and how to compare estimates fairly.',
    category: 'RAILINGS',
    categorySlug: 'railings-balustrades',
    date: 'Oct 12, 2026',
    datePublishedISO: '2026-10-12T09:00:00+05:30',
    dateModifiedISO: '2026-10-12T09:00:00+05:30',
    author: 'Veldex Team',
    authorRole: 'Fabrication Engineering Specialists',
    readTime: '6 min read',
    featuredImage: '/images/railings.jpg',
    featuredImageAlt: 'Stainless steel and glass balcony railing fabricated by Veldex in Vijayawada',
    metaTitle: 'SS Railing Price per Feet: What Decides the Cost',
    metaDescription: 'SS railing is priced per running foot, but grade (SS 304 or 316), pipe size, glass, design and fixing change the rate. How to compare railing quotes fairly.',
    status: 'published',
    intro:
      '“SS railing price per feet” is one of the most searched railing questions — and the honest answer is that there is no single rate. Two quotes for the same balcony can differ widely because they describe different railings. This guide explains what goes into the price so you can compare estimates like-for-like.',
    sections: [
      {
        number: '1',
        title: 'HOW RAILING IS MEASURED',
        content:
          'Railing is normally quoted per running foot (rft) — the length along the edge being protected, measured on site. Staircase railings follow the slope, so their running length is longer than the floor plan suggests. Corners, end posts and wall plates are usually included in the rate, while special items such as curved sections may be listed separately.',
        image: '/images/railings.jpg',
        imageAlt: 'Measuring a balcony edge for a stainless steel railing',
      },
      {
        number: '2',
        title: 'STEEL GRADE: SS 202, 304 OR 316',
        content:
          'Grade is the biggest hidden difference between quotes. SS 304 is the dependable choice for homes; SS 316 adds molybdenum for better corrosion resistance near the coast, pools or industrial air. Lower grades look similar when new but can stain sooner outdoors. Always ask which grade — and which pipe wall thickness — the price is for.',
        internalLink: {
          text: 'Compare stainless and mild steel railings',
          href: '/blog/stainless-steel-vs-mild-steel-railings',
          linkTitle: 'Stainless steel vs mild steel railings',
        },
      },
      {
        number: '3',
        title: 'DESIGN: PIPES, GLASS OR PANELS',
        content:
          'A simple handrail with vertical balusters uses the least material. Toughened-glass railings add the cost of the glass (thickness, laminated or not) and the clamps or channels that hold it. Laser-cut panels and designer patterns add cutting and finishing time. The more custom the design, the more the rate depends on drawings rather than a standard price list.',
        image: '/images/stock/interior-steel-stair-railing.jpg',
        imageAlt: 'Steel staircase railing with slim vertical balusters',
      },
      {
        number: '4',
        title: 'FINISH, FIXING AND SITE CONDITIONS',
        content:
          'Mirror or satin (hairline) finish, the fixing method (top-mounted, side-mounted or core-drilled), floor material and access all affect labour. Upper floors, narrow stairwells and work on finished marble take more care and time.',
      },
      {
        number: '5',
        title: 'HOW TO COMPARE QUOTES',
        content:
          'Ask every fabricator for the same details in writing: steel grade, pipe sizes and wall thickness, glass type and thickness, finish, fixing method, what is included (corners, end caps, wall plates) and installation. With those listed, rates become comparable — and you avoid paying less for a railing that will not last.',
        internalLink: {
          text: 'Get a measured railing estimate',
          href: '/services/railings',
          linkTitle: 'SS & glass railing work in Vijayawada',
        },
      },
    ],
    conclusion:
      'The cheapest rate per foot is rarely the best value. Choose the grade and design that suit the location, insist on itemised quotes, and have the site measured before you decide. Veldex measures every railing on site in and around Vijayawada and gives an itemised estimate.',
    tags: ['SS Railing', 'Railing Price', 'Balcony Railing', 'Glass Railing', 'SS 304', 'SS 316'],
    relatedProject: {
      title: 'SS Railing',
      slug: 'ss-railing',
      category: 'Railings & Balustrades',
      location: 'Vijayawada, Andhra Pradesh',
      image: '/images/railings.jpg',
      description: 'Stainless steel and glass railing fabricated and installed by Veldex.',
    },
    relatedArticleSlugs: ['stainless-steel-vs-mild-steel-railings', 'glass-railing-balcony-staircase-guide', 'choosing-the-perfect-staircase-for-your-space'],
  },
  {
    id: '8',
    slug: 'ms-gate-vs-ss-gate-main-gate-guide',
    title: 'MS Gate vs SS Gate: Choosing the Right Main Gate',
    titleAccent: 'THE RIGHT MAIN GATE',
    excerpt: 'Mild steel or stainless steel for your main gate? Strength, rust, weight, design options and upkeep compared for Indian homes.',
    category: 'GATES',
    categorySlug: 'gates-automation',
    date: 'Oct 12, 2026',
    datePublishedISO: '2026-10-12T09:30:00+05:30',
    dateModifiedISO: '2026-10-12T09:30:00+05:30',
    author: 'Veldex Team',
    authorRole: 'Fabrication Engineering Specialists',
    readTime: '6 min read',
    featuredImage: '/images/gate_overview.jpg',
    featuredImageAlt: 'Mild steel main gate with laser-cut panels at a home entrance',
    metaTitle: 'MS Gate vs SS Gate: Which Main Gate Is Right for You?',
    metaDescription: 'MS or SS for a main gate? Compare strength, rust resistance, weight for automation, laser-cut design options and maintenance before you choose.',
    status: 'published',
    intro:
      'Most homeowners searching for a main gate design end up choosing between mild steel (MS) and stainless steel (SS). Both make excellent gates — they simply suit different budgets, locations and designs.',
    sections: [
      {
        number: '1',
        title: 'MILD STEEL (MS): STRONG AND VERSATILE',
        content:
          'MS is strong, easy to weld and economical, which makes it the usual choice for large sliding and swing gates. Its weakness is rust, so it must be cleaned, primed and finished — powder coating or a PU paint system — and touched up if the coating is damaged.',
        image: '/images/gate.jpg',
        imageAlt: 'Black powder-coated mild steel sliding gate',
      },
      {
        number: '2',
        title: 'STAINLESS STEEL (SS): LOW MAINTENANCE',
        content:
          'SS resists corrosion without paint and keeps a clean metallic look. It costs more per kilo and is usually chosen for modern facades, coastal areas or where the owner wants minimal upkeep. Grade matters: SS 304 for most homes, SS 316 for harsher exposure.',
      },
      {
        number: '3',
        title: 'WEIGHT AND AUTOMATION',
        content:
          'Heavier gates need larger motors, stronger hinges or sliding hardware, and solid foundations for pillars and tracks. A well-designed gate keeps weight under control with hollow sections and lighter infill, which makes automation smoother and extends motor life.',
        internalLink: {
          text: 'See gate fabrication & automation',
          href: '/services/gate-automation',
          linkTitle: 'Gate fabrication and automatic gates in Vijayawada',
        },
      },
      {
        number: '4',
        title: 'DESIGN: LASER-CUT, SLATS OR MIXED',
        content:
          'CNC laser cutting works on both MS and SS, so jali patterns, names and logos are possible either way. Many popular designs combine an MS frame with SS strips, wood-look panels or laser-cut infill to balance cost, weight and appearance.',
        image: '/images/gate_proj_2.jpg',
        imageAlt: 'Modern gate combining a steel frame with slatted infill',
      },
    ],
    conclusion:
      'Choose MS for strength and value with a good protective finish; choose SS for low maintenance and a modern look; or combine them. Tell us the opening size, the look you want and whether you plan automation, and we will recommend the right build.',
    tags: ['Gate Design', 'MS Gate', 'SS Gate', 'Main Gate', 'Sliding Gate', 'Gate Automation'],
    relatedProject: {
      title: 'Modern Villa Gate',
      slug: 'modern-villa-gate',
      category: 'Gate Fabrication & Automation',
      location: 'Vijayawada, Andhra Pradesh',
      image: '/images/gate.jpg',
      description: 'Custom laser-cut mild steel gate with smart automation motor and weather-resistant black finish.',
    },
    relatedArticleSlugs: ['top-5-gate-design-trends-for-modern-homes', 'laser-cut-jali-design-guide', 'the-metal-fabrication-process-explained'],
  },
  {
    id: '9',
    slug: 'glass-railing-balcony-staircase-guide',
    title: 'Glass Railing for Balconies & Stairs: Safety, Thickness and Care',
    titleAccent: 'SAFETY, THICKNESS AND CARE',
    excerpt: 'Toughened vs laminated glass, common thicknesses, fixing systems and cleaning tips for glass railings on balconies and staircases.',
    category: 'RAILINGS',
    categorySlug: 'railings-balustrades',
    date: 'Oct 12, 2026',
    datePublishedISO: '2026-10-12T10:00:00+05:30',
    dateModifiedISO: '2026-10-12T10:00:00+05:30',
    author: 'Veldex Team',
    authorRole: 'Fabrication Engineering Specialists',
    readTime: '5 min read',
    featuredImage: '/images/stairs.jpg',
    featuredImageAlt: 'Staircase with toughened glass railing and steel handrail',
    metaTitle: 'Glass Railing for Balcony & Stairs: Safety & Thickness',
    metaDescription: 'Glass railing guide for balconies and staircases: toughened vs laminated glass, common thicknesses, clamp and channel fixing, and easy care tips.',
    status: 'published',
    intro:
      'Glass railings keep views open and make small balconies and stairwells feel larger. Because they are a safety barrier, the glass type and the way it is fixed matter more than the look.',
    sections: [
      {
        number: '1',
        title: 'TOUGHENED AND LAMINATED GLASS',
        content:
          'Railings use toughened (tempered) safety glass, which is several times stronger than ordinary glass and breaks into small blunt pieces. Laminated toughened glass adds a plastic interlayer that holds the pieces in place if it breaks — the safer choice for balconies at height.',
      },
      {
        number: '2',
        title: 'WHAT THICKNESS IS COMMON?',
        content:
          '10–12 mm toughened glass is common for residential railings; frameless designs and larger panels may need thicker or laminated glass. The right specification depends on panel size, height above floor and the fixing system, so it should be confirmed during design.',
        image: '/images/railings.jpg',
        imageAlt: 'Balcony glass railing panels with stainless steel fittings',
      },
      {
        number: '3',
        title: 'FIXING SYSTEMS',
        content:
          'Glass can be held by SS spigots or clamps on posts, or slotted into a continuous floor channel for a frameless look. A top handrail adds stiffness and a comfortable grip — especially on staircases.',
        internalLink: {
          text: 'Explore railing options',
          href: '/services/railings',
          linkTitle: 'SS & glass railing work in Vijayawada',
        },
      },
      {
        number: '4',
        title: 'CARE AND CLEANING',
        content:
          'Clean glass with a soft cloth and mild cleaner, and wipe stainless fittings to remove dust and salt. Check clamps and grub screws once a year, and have any chipped glass replaced rather than left in place.',
      },
    ],
    conclusion:
      'A glass railing should be designed as a safety barrier first and a design feature second. We specify the glass and fixings for each site in Vijayawada and install them with matching SS hardware.',
    tags: ['Glass Railing', 'Balcony Railing', 'Staircase Railing', 'Toughened Glass', 'SS Railing'],
    relatedProject: {
      title: 'Glass Staircase',
      slug: 'glass-staircase',
      category: 'Staircases',
      location: 'Guntur, Andhra Pradesh',
      image: '/images/stairs.jpg',
      description: 'Staircase with glass railing fabricated and installed by Veldex.',
    },
    relatedArticleSlugs: ['ss-railing-price-per-feet-cost-factors', 'stainless-steel-vs-mild-steel-railings', 'choosing-the-perfect-staircase-for-your-space'],
  },
  {
    id: '10',
    slug: 'laser-cut-jali-design-guide',
    title: 'Laser-Cut Jali Designs for Gates, Balconies and Elevations',
    titleAccent: 'GATES, BALCONIES AND ELEVATIONS',
    excerpt: 'How CNC laser-cut jali panels are designed and made, where they work best, and how to choose a pattern, material and finish.',
    category: 'FABRICATION',
    categorySlug: 'metal-fabrication',
    date: 'Oct 12, 2026',
    datePublishedISO: '2026-10-12T10:30:00+05:30',
    dateModifiedISO: '2026-10-12T10:30:00+05:30',
    author: 'Veldex Team',
    authorRole: 'Fabrication Engineering Specialists',
    readTime: '5 min read',
    featuredImage: '/images/elevation.jpg',
    featuredImageAlt: 'Building elevation with CNC laser-cut metal jali panels',
    metaTitle: 'Laser-Cut Jali Design Ideas for Gates & Elevations',
    metaDescription: 'Laser-cut jali panels for gates, balconies, compound walls and front elevations: pattern ideas, MS vs SS, sheet thickness, finishes and lighting.',
    status: 'published',
    intro:
      'Jali — the perforated screen of Indian architecture — is back in a modern form. CNC laser cutting turns any drawing into a precise metal panel, so the same idea can become a gate infill, a balcony screen, a compound-wall panel or a full building elevation.',
    sections: [
      {
        number: '1',
        title: 'WHERE JALI PANELS WORK BEST',
        content:
          'Gates and compound walls (privacy with airflow), balcony and staircase screens, and front elevations where panels shade windows and give the building a signature look. Indoors, jali makes elegant partitions and wall features.',
        image: '/images/stock/exterior-metal-screen-facade.jpg',
        imageAlt: 'Perforated metal screen facade on a modern building',
        internalLink: {
          text: 'See elevation & facade panels',
          href: '/services/elevations-facades',
          linkTitle: 'Laser-cut elevation panels and jali screens',
        },
      },
      {
        number: '2',
        title: 'CHOOSING A PATTERN',
        content:
          'Geometric patterns suit modern homes; floral and traditional motifs suit classic elevations; custom designs can include names or logos. Open patterns let in more light and air, denser ones give more privacy — useful facing the street.',
        image: '/images/stock/exterior-decorative-panel.jpg',
        imageAlt: 'Decorative laser-cut metal panel with an organic pattern',
      },
      {
        number: '3',
        title: 'MATERIAL, THICKNESS AND FINISH',
        content:
          'Mild steel sheet is economical and is powder- or PU-coated for colour and protection. Stainless steel suits low-maintenance and coastal locations. Thicker sheet and a supporting frame keep large panels flat and rigid.',
      },
      {
        number: '4',
        title: 'LIGHT AND SHADOW',
        content:
          'Backlighting a jali panel at night turns it into a feature, and sunlight casts its pattern across walls and floors during the day. Plan the lighting and the panel position together.',
        image: '/images/gate_overview.jpg',
        imageAlt: 'Laser-cut gate panel with a light and shadow pattern',
      },
    ],
    conclusion:
      'A good jali design balances pattern, privacy, airflow and structure. Share a photo or sketch of the look you like — Veldex draws it in CAD, cuts it on CNC laser machines and installs it in Vijayawada and across Andhra Pradesh.',
    tags: ['Jali Design', 'Laser Cut', 'Front Elevation', 'Gate Design', 'Balcony Screen', 'CNC'],
    relatedProject: {
      title: 'Decorative Facade',
      slug: 'decorative-facade',
      category: 'Elevations & Metalwork',
      location: 'Guntur, Andhra Pradesh',
      image: '/images/elevation.jpg',
      description: 'Laser-cut decorative facade panels fabricated by Veldex.',
    },
    relatedArticleSlugs: ['top-5-gate-design-trends-for-modern-homes', 'ms-gate-vs-ss-gate-main-gate-guide', 'the-metal-fabrication-process-explained'],
  },
];

// Keep category counts in sync with the published articles
for (const c of blogCategories) {
  const published = blogArticles.filter((a) => a.status === 'published');
  c.count = c.slug === 'all' ? published.length : published.filter((a) => a.categorySlug === c.slug).length;
}

export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return blogArticles.find((article) => article.slug === slug);
}

export function getArticlesByCategory(categorySlug: string): BlogArticle[] {
  if (!categorySlug || categorySlug === 'all') {
    return blogArticles;
  }
  return blogArticles.filter((article) => article.categorySlug === categorySlug);
}

export function getPopularArticles(): BlogArticle[] {
  return blogArticles.filter((article) => article.isPopular);
}

export function getRelatedArticles(currentSlug: string, limit = 3): BlogArticle[] {
  const current = getArticleBySlug(currentSlug);
  if (current && current.relatedArticleSlugs && current.relatedArticleSlugs.length > 0) {
    const matched = current.relatedArticleSlugs
      .map((s) => getArticleBySlug(s))
      .filter((a): a is BlogArticle => Boolean(a));
    if (matched.length >= limit) return matched.slice(0, limit);
  }
  return blogArticles.filter((a) => a.slug !== currentSlug).slice(0, limit);
}
