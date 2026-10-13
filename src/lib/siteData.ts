/**
 * SEED DATA — INITIALIZATION ONLY
 *
 * This file is used EXCLUSIVELY to seed Firestore on first deployment.
 * After seeding, Firestore becomes the canonical source of truth for
 * services and products. This file should NOT be treated as live content.
 *
 * Classification: RESEARCH-BASED CORE CANDIDATES (not owner-confirmed final list)
 *
 * @see knowledge/development-input/02-service-taxonomy.md
 * @see knowledge/development-input/03-product-taxonomy.md
 * @see scripts/seedFirestore.ts (how this data is used)
 */

import type { Service, Product } from '@/types';

// ── Research-Based Core Service Candidates ─────────────────────────────────
export const seedServices: Service[] = [
  {
    id: 'gate-automation',
    slug: 'gate-automation',
    name: 'Gate Fabrication & Automation',
    shortDescription:
      'Custom heavy-duty sliding, swing, and trackless gates engineered with automated motor drives and remote smart access.',
    description: `Our gate fabrication and automation service covers the complete engineering, manufacturing, and installation of heavy-duty entry gates for residential, commercial, and industrial premises. We work with mild steel (MS), stainless steel (SS 304), and wrought iron to create gates that combine strength with aesthetic appeal. Our automation integration includes leading motor brands, remote controls, sensor systems, and RFID access compatibility.`,
    icon: 'ShieldCheck',
    features: [
      'Heavy-duty MS and SS fabrication',
      'Automated sliding & swing motor integration',
      'Trackless cantilever gate systems',
      'Laser-cut aesthetic infill panels',
      'Remote control, sensor & RFID access compatibility',
      'Custom width and height fabrication',
    ],
    materials: ['Mild Steel (MS)', 'Stainless Steel SS 304', 'Wrought Iron', 'Galvanized Steel'],
    targetKeywords: [
      'automatic gate fabrication vijayawada',
      'sliding gate automation vijayawada',
      'trackless gate manufacturers andhra pradesh',
    ],
    isCoreCandidate: true,
    isPublished: true,
  },
  {
    id: 'railings-balustrades',
    slug: 'railings',
    name: 'Architectural Railings & Glass Balustrades',
    shortDescription:
      'Premium stainless steel (SS 304/316), toughened glass, and designer metal balustrades for balconies and staircases.',
    description: `We design and install architectural railing systems that combine structural integrity with visual elegance. Our range includes frameless toughened glass balustrades with stainless steel spigots, Grade 304 and 316 SS handrail systems, and custom laser-cut metal balustrades. All railings are engineered to IS standards with corrosion-resistant finishes suitable for both interior and coastal exterior applications.`,
    icon: 'Columns',
    features: [
      'Grade 304 & 316 Stainless Steel railings',
      'Frameless & spigot-mounted toughened glass systems',
      'Modern horizontal and vertical balustrade designs',
      'Corrosion-resistant exterior finishes',
      'Custom handrail profiles and lengths',
    ],
    materials: [
      'SS 304 / SS 316 Stainless Steel',
      '12mm / 15mm Toughened Safety Glass',
      'Mild Steel (MS)',
    ],
    targetKeywords: [
      'glass railing fabrication vijayawada',
      'ss balcony railing price vijayawada',
      'staircase railing manufacturers andhra pradesh',
    ],
    isCoreCandidate: true,
    isPublished: true,
  },
  {
    id: 'staircases',
    slug: 'staircases',
    name: 'Custom Structural Staircases',
    shortDescription:
      'Engineered metal spiral, monostring, floating, and industrial access staircases designed for interior and exterior impact.',
    description: `Our staircase fabrication service covers everything from compact space-saving spiral staircases to large-scale industrial access stairs and modern architectural floating designs. Each staircase is custom-engineered to the client's space, load requirements, and aesthetic vision, fabricated in our workshop and installed on-site with precision.`,
    icon: 'ArrowUpRight',
    features: [
      'Space-saving spiral metal staircases',
      'Modern central spine & floating tread designs',
      'Heavy-duty external fire escape stairs',
      'Precision step fabrication with anti-skid surfaces',
      'Integrated balustrade and handrail systems',
    ],
    materials: ['Mild Steel (MS)', 'Stainless Steel SS 304', 'Wood-Metal Composite Treads'],
    targetKeywords: [
      'spiral staircase fabrication vijayawada',
      'metal staircase manufacturers vijayawada',
      'custom steel stairs andhra pradesh',
    ],
    isCoreCandidate: true,
    isPublished: true,
  },
  {
    id: 'pergolas-gazebos',
    slug: 'pergolas-gazebos',
    name: 'Pergolas, Gazebos & Rooftop Canopies',
    shortDescription:
      'Architectural outdoor living spaces — modern Kerala-style gazebos, louvered pergolas, and terrace shade structures.',
    description: `We design and fabricate premium outdoor living structures that transform rooftops, gardens, and villa exteriors. Our signature Kerala-style traditional-modern gazebos blend traditional pitched-roof architecture with contemporary steel framing. We also build louvered pergolas, polycarbonate canopies, and bespoke rooftop leisure frameworks, all finished with weatherproof PU and epoxy coatings.`,
    icon: 'Home',
    features: [
      'Traditional-modern Kerala style gazebo design',
      'Rooftop leisure steel frameworks',
      'Polycarbonate, glass, and tile roof integration',
      'Weatherproof PU and epoxy exterior coatings',
      'Custom size and footprint fabrication',
    ],
    materials: [
      'Heavy MS Hollow Sections',
      'Clay / Mangalore Tiles',
      'Polycarbonate Sheets',
      'GI Roofing Sheets',
    ],
    targetKeywords: [
      'kerala style gazebo fabrication',
      'pergola manufacturers vijayawada',
      'rooftop gazebo construction andhra pradesh',
    ],
    isCoreCandidate: true,
    isPublished: true,
  },
  {
    id: 'sheds-roofing',
    slug: 'sheds-roofing',
    name: 'Terrace Sheds & Structural Roofing',
    shortDescription:
      'Engineered steel framing for residential terrace coverage, commercial parking sheds, and industrial warehouses.',
    description: `Our shed and roofing fabrication service delivers engineered steel structural solutions for residential terraces, commercial parking areas, and large-scale industrial warehouses. We use galvanized iron (GI) roofing sheets, color-coated profiles, and heavy MS truss systems. All structures are designed for heat reduction, storm resistance, and long-term structural durability.`,
    icon: 'Layers',
    features: [
      'Residential terrace heat-reduction sheds',
      'Industrial truss & structural steel framing',
      'Galvanized iron (GI) & color-coated roofing sheets',
      'Rapid on-site installation',
      'Storm-resistant anchoring systems',
    ],
    materials: ['MS Hollow Sections', 'GI Roofing Sheets', 'Color-Coated Steel Profiles', 'Polycarbonate'],
    targetKeywords: [
      'terrace shed fabrication vijayawada',
      'industrial roofing contractor vijayawada',
      'metal roof shed construction',
    ],
    isCoreCandidate: true,
    isPublished: true,
  },
  {
    id: 'elevations-facades',
    slug: 'elevations-facades',
    name: 'Building Elevations & Architectural Metalwork',
    shortDescription:
      'CNC laser-cut facade panels, decorative exterior screens, and architectural cladding that elevate building aesthetics.',
    description: `Our architectural metalwork service brings precision engineering to building exteriors. We design and fabricate CNC laser-cut metal screens, decorative jaali panels, ACP cladding systems, and custom compound wall feature elements. These products add visual depth, privacy, and architectural character to residential villas, commercial buildings, and hospitality projects across Andhra Pradesh.`,
    icon: 'Grid3X3',
    features: [
      'Precision CNC laser-cut metal screens & jaalis',
      'ACP and metal facade cladding panels',
      'Decorative entryway portals and compound features',
      'Custom architectural metal prototyping',
      'Powder-coated and PU painted finishes',
    ],
    materials: ['MS Laser-Cut Sheets', 'ACP (Aluminium Composite Panels)', 'SS 304 Decorative Sheets'],
    targetKeywords: [
      'laser cut elevation panels vijayawada',
      'building elevation metal work andhra pradesh',
      'architectural facade screens vijayawada',
    ],
    isCoreCandidate: true,
    isPublished: true,
  },
];

// ── Research-Based Core Product Candidates ─────────────────────────────────
export const seedProducts: Product[] = [
  {
    id: 'automated-sliding-gate',
    slug: 'automated-sliding-gate',
    name: 'Automated Sliding Gate',
    category: 'Gates & Access Systems',
    serviceRef: 'gate-automation',
    shortDescription:
      'Heavy-duty motorized sliding gate for smooth, secure, and remote-operated perimeter protection.',
    description: `Our automated sliding gates are fabricated from high-grade mild steel or stainless steel and integrated with industry-standard automation motors for smooth, reliable operation. Custom-engineered to your driveway width and load requirements, these gates combine aesthetic design with robust structural integrity.`,
    images: [],
    materialsAvailable: ['Mild Steel (MS)', 'Stainless Steel (SS 304)', 'Wrought Iron'],
    finishOptions: ['Powder Coated', 'Epoxy Primer + PU Enamel', 'Hot-Dip Galvanized'],
    pricingModel: 'Custom Quoted — dimensions and motor specification required',
    tags: ['Automated', 'Sliding Gate', 'Residential', 'Commercial'],
    isCoreCandidate: true,
    isAvailable: true,
  },
  {
    id: 'trackless-cantilever-gate',
    slug: 'trackless-cantilever-gate',
    name: 'Trackless Cantilever Gate',
    category: 'Gates & Access Systems',
    serviceRef: 'gate-automation',
    shortDescription:
      'Modern trackless gate suspended above driveway — no ground tracks, no debris jams, no excavation.',
    description: `Trackless cantilever gates are the premium alternative to conventional sliding gates. Suspended by the structural frame itself with no ground track required, these gates open and close smoothly regardless of driveway surface conditions — ideal for sloped driveways, textured pavements, and premium villa entrances.`,
    images: [],
    materialsAvailable: ['High-Tensile Steel', 'Architectural Laser-Cut MS'],
    finishOptions: ['Matte Black Powder Coat', 'Custom RAL Color'],
    pricingModel: 'Custom Quoted — width and structural load required',
    tags: ['Trackless', 'Cantilever', 'Modern Villa', 'Premium'],
    isCoreCandidate: true,
    isAvailable: true,
  },
  {
    id: 'modern-kerala-style-gazebo',
    slug: 'modern-kerala-style-gazebo',
    name: 'Modern Kerala-Style Rooftop Gazebo',
    category: 'Outdoor & Rooftop Living',
    serviceRef: 'pergolas-gazebos',
    shortDescription:
      'Signature outdoor leisure structure blending traditional Kerala pitched-roof aesthetics with contemporary steel framing.',
    description: `Our Kerala-style rooftop gazebo is one of our most recognized and admired products. Designed to bring the warmth and character of traditional Kerala architecture into a modern steel framework, these gazebos transform flat rooftops into premium outdoor living spaces. Available with clay Mangalore tile roofing or polycarbonate alternatives.`,
    images: [],
    materialsAvailable: ['Heavy MS Hollow Sections', 'Clay / Mangalore Tile or Polycarbonate Sheet'],
    finishOptions: ['Wood-Finish PU Paint', 'Corrosion-Resistant Exterior Black'],
    pricingModel: 'Custom Quoted — square footage and roof material selection required',
    tags: ['Gazebo', 'Rooftop', 'Kerala Architecture', 'Flagship'],
    isCoreCandidate: true,
    isAvailable: true,
  },
  {
    id: 'architectural-spiral-staircase',
    slug: 'architectural-spiral-staircase',
    name: 'Architectural Spiral Metal Staircase',
    category: 'Custom Staircases',
    serviceRef: 'staircases',
    shortDescription:
      'Space-saving circular staircase with precision central column, laser-cut treads, and custom balustrades.',
    description: `Our spiral staircases are engineered for both function and visual impact. Built around a precision central column with individually welded treads and continuous balustrade systems, they are ideal for compact interior spaces requiring rooftop access or as feature staircases in open-plan homes. Available in mild steel or stainless steel with a variety of powder-coat finishes.`,
    images: [],
    materialsAvailable: ['Mild Steel', 'Stainless Steel SS 304', 'Wood-Metal Composite Treads'],
    finishOptions: ['Powder Coated Matte', 'Industrial Gloss Finish'],
    pricingModel: 'Custom Quoted — floor-to-floor height and number of treads required',
    tags: ['Spiral Stairs', 'Space Saving', 'Interior', 'Rooftop Access'],
    isCoreCandidate: true,
    isAvailable: true,
  },
  {
    id: 'toughened-glass-balcony-railing',
    slug: 'toughened-glass-balcony-railing',
    name: 'Toughened Glass Balcony Railing',
    category: 'Architectural Railings',
    serviceRef: 'railings-balustrades',
    shortDescription:
      'Frameless or stanchion-mounted architectural glass balustrade with SS 316 handrails — unobstructed views guaranteed.',
    description: `Our toughened glass balcony railings combine structural safety with visual openness. Available in frameless spigot-mounted and post-mounted configurations, these railings use 12mm or 15mm safety-grade toughened glass panels with Grade 316 stainless steel hardware for superior coastal and humid climate durability.`,
    images: [],
    materialsAvailable: ['12mm / 15mm Toughened Safety Glass', 'SS 304/316 Spigots & Top Rails'],
    finishOptions: ['Brushed Satin SS', 'Mirror Polish SS', 'Matte Black SS'],
    pricingModel: 'Custom Quoted — linear running feet and glass thickness required',
    tags: ['Glass Railing', 'Balcony', 'Modern Villa', 'Luxury'],
    isCoreCandidate: true,
    isAvailable: true,
  },
  {
    id: 'motorized-commercial-rolling-shutter',
    slug: 'motorized-commercial-rolling-shutter',
    name: 'Motorized Commercial Rolling Shutter',
    category: 'Commercial & Security',
    serviceRef: 'sheds-roofing',
    shortDescription:
      'High-durability interlocking steel rolling shutters for commercial shops, garages, and warehouses.',
    description: `Our commercial rolling shutters are fabricated from cold-rolled steel (CRCA) or galvanized iron (GI) interlocking lath profiles and can be supplied in manual or motorized configurations. Suitable for shop fronts, commercial garages, warehouses, and industrial loading bays — built for high-cycle durability and long service life.`,
    images: [],
    materialsAvailable: ['Galvanized Iron (GI)', 'Cold Rolled Steel (CRCA)'],
    finishOptions: ['Zinc Galvanized', 'Enamel Painted'],
    pricingModel: 'Custom Quoted — width × height (square feet) required',
    tags: ['Rolling Shutter', 'Commercial', 'Warehouse', 'Security'],
    isCoreCandidate: true,
    isAvailable: true,
  },
];
