export interface ProjectSpec {
  label: string;
  value: string;
}

export interface ProjectData {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  category: string;
  categoryValue: 'gates' | 'staircases' | 'railings' | 'pergolas' | 'roofing' | 'elevations' | 'other';
  location: string;
  city: string;
  completionDate: string;
  year: string;
  projectType: 'Residential' | 'Commercial' | 'Industrial';
  mainImage: string;
  galleryImages: { src: string; alt: string }[];
  sideImage?: string;
  videoUrl?: string;
  videoThumbnail?: string;
  shortDescription: string;
  aboutProject: string;
  projectDescription: string;
  highlights: string[];
  specs: ProjectSpec[];
  isFeatured?: boolean;
}

export const allProjects: ProjectData[] = [
  {
    id: 'p-1',
    slug: 'modern-villa-gate',
    title: 'Modern Villa Gate',
    subtitle: 'Vijayawada',
    category: 'Gates',
    categoryValue: 'gates',
    location: 'Vijayawada, Andhra Pradesh',
    city: 'Vijayawada, AP',
    completionDate: 'April 2024',
    year: '2024',
    projectType: 'Residential',
    mainImage: '/images/gate.jpg',
    sideImage: '/images/gate_overview.jpg',
    videoUrl: '/images/gate_sliding_action.mp4',
    videoThumbnail: '/images/gate_proj_2.jpg',
    shortDescription: 'Custom laser-cut mild steel gate with smart automation motor and weather-resistant black finish.',
    aboutProject:
      'This modern villa gate is designed with a combination of precision laser cut patterns and vertical structural slats giving a perfect blend of elegance and perimeter security. The gate is fully automated for smooth operation and safety.',
    projectDescription:
      'The client wanted a premium looking main gate with high security and low maintenance for their contemporary villa. We engineered this custom entrance gate using 4mm laser-cut MS sheets combined with heavy-duty hollow sections. The automated drive system includes dual remote controls, infrared safety obstacle sensors, and manual mechanical override.',
    highlights: [
      'Laser Cut Design',
      'Automated Gate',
      'Powder Coated Finish',
      'Heavy Duty Structure',
      'Weather Resistant',
      'Custom Made',
    ],
    specs: [
      { label: 'Project Type', value: 'Main Gate' },
      { label: 'Material', value: 'Mild Steel (MS)' },
      { label: 'Finish', value: 'Powder Coated' },
      { label: 'Color', value: 'Matte Black' },
      { label: 'Automation', value: 'Yes (Remote + Sensors)' },
      { label: 'Area / Size', value: '16 ft (W) x 6 ft (H)' },
      { label: 'Completion', value: 'April 2024' },
    ],
    galleryImages: [
      { src: '/images/gate.jpg', alt: 'Full project entrance view' },
      { src: '/images/gate_overview.jpg', alt: 'Gate close-up showing jaali patterns' },
      { src: '/images/gate_proj_2.jpg', alt: 'Side angle with pillar integration' },
      { src: '/images/gate_proj_3.jpg', alt: 'Craftsmanship detail and hinge hardware' },
      { src: '/images/mat_decorative.jpg', alt: 'Precision laser cut jaali pattern' },
      { src: '/images/hero_welder.jpg', alt: 'Workshop fabrication and welding' },
    ],
    isFeatured: true,
  },
  {
    id: 'p-2',
    slug: 'glass-staircase',
    title: 'Glass Staircase',
    subtitle: 'Guntur',
    category: 'Staircases',
    categoryValue: 'staircases',
    location: 'Guntur, Andhra Pradesh',
    city: 'Guntur, AP',
    completionDate: 'May 2024',
    year: '2024',
    projectType: 'Residential',
    mainImage: '/images/stairs.jpg',
    sideImage: '/images/railing_overview.jpg',
    videoUrl: '/images/stairs_showcase_bg.mp4',
    videoThumbnail: '/images/stairs.jpg',
    shortDescription: 'Modern steel spine staircase with frameless 12mm toughened glass balustrades and wooden treads.',
    aboutProject:
      'Engineered for an open-concept duplex villa, this staircase features a hidden central steel stringer that allows natural daylight to cascade across both floors without visual obstruction.',
    projectDescription:
      'The homeowners desired an artistic architectural centerpiece that felt airy yet structurally unyielding. Veldex fabricated a monostring steel spine with vibration-dampened cantilevered brackets, topped with 12mm toughened safety glass and Grade 304 stainless steel handrails.',
    highlights: [
      'Central Steel Spine',
      'Toughened Glass Balustrade',
      'Grade 304 SS Handrail',
      'Concealed Fastenings',
      'Anti-Vibration Engineering',
      'Custom Step Treads',
    ],
    specs: [
      { label: 'Project Type', value: 'Architectural Staircase' },
      { label: 'Material', value: 'MS Spine + SS 304 + Glass' },
      { label: 'Finish', value: 'Satin PU Coat & Polished SS' },
      { label: 'Color', value: 'Charcoal Grey & Natural Wood' },
      { label: 'Glass Specs', value: '12mm Toughened Safety Glass' },
      { label: 'Floor Height', value: '11 ft Floor-to-Floor' },
      { label: 'Completion', value: 'May 2024' },
    ],
    galleryImages: [
      { src: '/images/stairs.jpg', alt: 'Main staircase elevation' },
      { src: '/images/railing_overview.jpg', alt: 'Glass balustrade detail' },
      { src: '/images/mat_wood_treads.jpg', alt: 'Tread craftsmanship close-up' },
      { src: '/images/mat_toughened_glass.jpg', alt: 'Glass spigot hardware' },
    ],
    isFeatured: true,
  },
  {
    id: 'p-3',
    slug: 'rooftop-pergola',
    title: 'Rooftop Pergola',
    subtitle: 'Vijayawada',
    category: 'Pergolas',
    categoryValue: 'pergolas',
    location: 'Vijayawada, Andhra Pradesh',
    city: 'Vijayawada, AP',
    completionDate: 'March 2024',
    year: '2024',
    projectType: 'Residential',
    mainImage: '/images/gazebo.jpg',
    sideImage: '/images/gazebo.jpg',
    shortDescription: 'Kerala-inspired pitched roof steel pergola with warm ambient illumination and tile coverage.',
    aboutProject:
      'Transforming a bare rooftop terrace into a tranquil outdoor lounge, this pergola marries traditional pitched-roof warmth with high-tensile steel structural engineering.',
    projectDescription:
      'The client requested a private rooftop retreat that could withstand coastal monsoons and summer heat. We fabricated heavy hollow-section steel columns with custom trusses, integrated rainwater drainage gutters, and concealed lighting channels.',
    highlights: [
      'Weatherproof Steel Frame',
      'Integrated LED Channels',
      'Concealed Rain Gutters',
      'Coastal Heat Shielding',
      'Epoxy Primer Finish',
      'Modular Expansion Ready',
    ],
    specs: [
      { label: 'Project Type', value: 'Rooftop Pergola & Canopy' },
      { label: 'Material', value: 'Heavy MS Hollow Sections' },
      { label: 'Roofing', value: 'Weather-Shield Polycarbonate' },
      { label: 'Finish', value: 'Multi-layer Epoxy + PU Enamel' },
      { label: 'Color', value: 'Architectural Bronze / Matte' },
      { label: 'Footprint', value: '20 ft x 14 ft' },
      { label: 'Completion', value: 'March 2024' },
    ],
    galleryImages: [
      { src: '/images/gazebo.jpg', alt: 'Evening illuminated rooftop lounge' },
      { src: '/images/sheds.jpg', alt: 'Structural rafters and joints' },
      { src: '/images/mat_polycarbonate.jpg', alt: 'Roof sheeting detail' },
      { src: '/images/mat_powder_coat.jpg', alt: 'Coating durability inspection' },
    ],
    isFeatured: true,
  },
  {
    id: 'p-4',
    slug: 'terrace-roofing',
    title: 'Terrace Roofing',
    subtitle: 'Vijayawada',
    category: 'Roofing',
    categoryValue: 'roofing',
    location: 'Vijayawada, Andhra Pradesh',
    city: 'Vijayawada, AP',
    completionDate: 'February 2024',
    year: '2024',
    projectType: 'Residential',
    mainImage: '/images/sheds.jpg',
    sideImage: '/images/sheds.jpg',
    shortDescription: 'Engineered structural steel terrace shed with insulated color-coated roofing sheets for heat reduction.',
    aboutProject:
      'Designed to reduce summer thermal absorption by up to 7°C on the upper living floor while creating a fully sheltered terrace utility and leisure space.',
    projectDescription:
      'Fabricated using heavy-gauge MS truss framework anchored into structural columns without compromising terrace waterproofing. Topped with multi-layer insulated roofing sheets and anti-rust zinc coatings.',
    highlights: [
      'Thermal Heat Reduction',
      'Heavy MS Truss Design',
      'Storm Resistant Anchoring',
      'Waterproof Joint Seals',
      'Galvanized Durability',
      'Zero Leak Guarantee',
    ],
    specs: [
      { label: 'Project Type', value: 'Terrace Structural Roofing' },
      { label: 'Material', value: 'MS Trusses + GI Sheets' },
      { label: 'Finish', value: 'Zinc Chromate + Synthetic Enamel' },
      { label: 'Color', value: 'Off-White / Forest Green Trim' },
      { label: 'Area Covered', value: '1,200 sq.ft.' },
      { label: 'Wind Rating', value: '150 km/h Tested' },
      { label: 'Completion', value: 'February 2024' },
    ],
    galleryImages: [
      { src: '/images/sheds.jpg', alt: 'Full terrace shed framework' },
      { src: '/images/mat_color_coated.jpg', alt: 'Color coated roofing sheets' },
      { src: '/images/mat_galvanized.jpg', alt: 'Galvanized iron joint plates' },
    ],
  },
  {
    id: 'p-5',
    slug: 'ss-railing',
    title: 'SS Railing',
    subtitle: 'Vijayawada',
    category: 'Railings',
    categoryValue: 'railings',
    location: 'Vijayawada, Andhra Pradesh',
    city: 'Vijayawada, AP',
    completionDate: 'April 2024',
    year: '2024',
    projectType: 'Residential',
    mainImage: '/images/railings.jpg',
    sideImage: '/images/railing_hero.jpg',
    shortDescription: 'Grade 304 stainless steel balcony railings with satin brushed finish and continuous ergonomic handrails.',
    aboutProject:
      'Sleek modern balustrades installed across 120 running feet of curved exterior balconies, engineered for zero corrosion in humid regional climates.',
    projectDescription:
      'Precision TIG welded Grade 304 SS horizontal safety pipes with invisible base plate fastenings. Buffed to an architectural satin sheen that resists fingerprint staining and ambient oxidation.',
    highlights: [
      'Grade 304 Stainless Steel',
      'Satin Brushed Texture',
      'Seamless TIG Welds',
      'Concealed Base Anchors',
      'Child-Safe Spacing',
      'Zero Corrosion Risk',
    ],
    specs: [
      { label: 'Project Type', value: 'Balcony Balustrade' },
      { label: 'Material', value: 'Stainless Steel (SS 304)' },
      { label: 'Finish', value: '320-Grit Satin Brushed' },
      { label: 'Color', value: 'Natural Metallic Silver' },
      { label: 'Height', value: '3.5 ft Standard Height' },
      { label: 'Length', value: '120 Running Feet' },
      { label: 'Completion', value: 'April 2024' },
    ],
    galleryImages: [
      { src: '/images/railings.jpg', alt: 'Curved balcony railing view' },
      { src: '/images/railing_hero.jpg', alt: 'Handrail corner transition' },
      { src: '/images/mat_stainless_steel.jpg', alt: 'Grade 304 material texture' },
    ],
  },
  {
    id: 'p-6',
    slug: 'compound-wall-design',
    title: 'Compound Wall Design',
    subtitle: 'Nuzvid',
    category: 'Other',
    categoryValue: 'other',
    location: 'Nuzvid, Andhra Pradesh',
    city: 'Nuzvid, AP',
    completionDate: 'January 2024',
    year: '2024',
    projectType: 'Residential',
    mainImage: '/images/elevation.jpg',
    sideImage: '/images/gate_proj_3.jpg',
    shortDescription: 'Decorative laser-cut boundary wall panels and steel grill work with integrated backlighting recesses.',
    aboutProject:
      'Elevating boundary wall architecture from plain masonry into a lighted night feature with CNC laser jaali panels and weather-shielded paint.',
    projectDescription:
      'Fabricated for a private luxury farmhouse perimeter in Nuzvid. Customized floral geometric motifs cut from heavy mild steel sheets and coated in anti-UV exterior PU coatings.',
    highlights: [
      'CNC Jaali Infill Panels',
      'Integrated LED Backlighting',
      'Anti-UV Polyurethane Coat',
      'Anti-Climb Geometry',
      'Farmhouse Architecture',
      'Masonry Flush Fitting',
    ],
    specs: [
      { label: 'Project Type', value: 'Perimeter Wall Metalwork' },
      { label: 'Material', value: 'Laser Cut Mild Steel' },
      { label: 'Finish', value: 'PU Exterior Enamel' },
      { label: 'Color', value: 'Deep Charcoal & Warm Gold' },
      { label: 'Panel Dimensions', value: '6 ft x 4 ft per bay' },
      { label: 'Total Span', value: '180 Running Feet' },
      { label: 'Completion', value: 'January 2024' },
    ],
    galleryImages: [
      { src: '/images/elevation.jpg', alt: 'Boundary wall elevation view' },
      { src: '/images/gate_proj_3.jpg', alt: 'Laser cut panel detailing' },
      { src: '/images/mat_decorative.jpg', alt: 'CNC motif precision' },
    ],
  },
  {
    id: 'p-7',
    slug: 'spiral-staircase',
    title: 'Spiral Staircase',
    subtitle: 'Vijayawada',
    category: 'Staircases',
    categoryValue: 'staircases',
    location: 'Vijayawada, Andhra Pradesh',
    city: 'Vijayawada, AP',
    completionDate: 'December 2023',
    year: '2023',
    projectType: 'Residential',
    mainImage: '/images/stairs.jpg',
    sideImage: '/images/railing_overview.jpg',
    videoUrl: '/images/stairs_showcase_bg.mp4',
    videoThumbnail: '/images/stairs.jpg',
    shortDescription: 'Compact circular metal staircase engineered around a precision structural pipe column with continuous rail.',
    aboutProject:
      'Designed to provide seamless rooftop access within an extremely tight 5 ft x 5 ft footprint while presenting an eye-catching spiral silhouette.',
    projectDescription:
      'Constructed with an engineered 150mm thick-wall central steel column, individual laser-cut treads with anti-skid embossing, and a hand-formed helical steel pipe balustrade.',
    highlights: [
      'Compact 5ft Footprint',
      'Anti-Skid Laser Treads',
      'Helical Continuous Railing',
      'High-Load Core Column',
      'Rooftop Weatherproof Coat',
      'Smooth Ergonomic Rise',
    ],
    specs: [
      { label: 'Project Type', value: 'Circular Spiral Stair' },
      { label: 'Material', value: 'Heavy Gauge Mild Steel' },
      { label: 'Finish', value: 'Electrostatic Powder Coat' },
      { label: 'Color', value: 'Matte Jet Black' },
      { label: 'Total Height', value: '10.5 ft' },
      { label: 'Diameter', value: '54 Inches' },
      { label: 'Completion', value: 'December 2023' },
    ],
    galleryImages: [
      { src: '/images/stairs.jpg', alt: 'Circular spiral staircase overview' },
      { src: '/images/railing_overview.jpg', alt: 'Helical railing view' },
      { src: '/images/mat_wood_treads.jpg', alt: 'Tread welds and mounting' },
    ],
  },
  {
    id: 'p-8',
    slug: 'decorative-facade',
    title: 'Decorative Facade',
    subtitle: 'Guntur',
    category: 'Elevations',
    categoryValue: 'elevations',
    location: 'Guntur, Andhra Pradesh',
    city: 'Guntur, AP',
    completionDate: 'November 2023',
    year: '2023',
    projectType: 'Commercial',
    mainImage: '/images/elevation.jpg',
    sideImage: '/images/elevation.jpg',
    shortDescription: 'Three-story architectural laser cut exterior screen for commercial retail showroom in Guntur.',
    aboutProject:
      'A striking 3-story perforated metal facade engineered to block harsh afternoon solar glare while preserving open city sightlines from inside.',
    projectDescription:
      'Engineered with sub-frame steel brackets tested for wind load dynamics. Powder coated in weather-resistant architectural metallic finish to guarantee minimal thermal degradation.',
    highlights: [
      'Solar Heat Shading',
      'Perforated Architectural Jaali',
      'Structural Subframe Brackets',
      'Three-Story Coverage',
      'High Durability Powder Coat',
      'Retail Brand Impact',
    ],
    specs: [
      { label: 'Project Type', value: 'Commercial Building Facade' },
      { label: 'Material', value: '3mm MS Laser Cut Sheets' },
      { label: 'Finish', value: 'Exterior Architectural Powder Coat' },
      { label: 'Color', value: 'Titanium Grey & Champagne Gold' },
      { label: 'Elevation Height', value: '36 ft (3 Floors)' },
      { label: 'Area', value: '1,450 sq.ft.' },
      { label: 'Completion', value: 'November 2023' },
    ],
    galleryImages: [
      { src: '/images/elevation.jpg', alt: 'Full building exterior facade' },
      { src: '/images/mat_decorative.jpg', alt: 'Perforation pattern detail' },
      { src: '/images/hero_welder.jpg', alt: 'Subframe bracket fabrication' },
    ],
  },
  {
    id: 'p-9',
    slug: 'garden-gazebo',
    title: 'Garden Gazebo',
    subtitle: 'Vijayawada',
    category: 'Pergolas',
    categoryValue: 'pergolas',
    location: 'Vijayawada, Andhra Pradesh',
    city: 'Vijayawada, AP',
    completionDate: 'October 2023',
    year: '2023',
    projectType: 'Residential',
    mainImage: '/images/gazebo.jpg',
    sideImage: '/images/gazebo.jpg',
    shortDescription: 'Hexagonal landscape garden gazebo with ornamental steel fretwork and clay tile roofing.',
    aboutProject:
      'An idyllic garden centerpiece custom-fabricated for a riverside villa estate, offering shaded outdoor seating surrounded by lush landscaping.',
    projectDescription:
      'Built using durable galvanized steel columns with decorative traditional corner brackets. The pitched hexagonal roof is clad in genuine clay Mangalore tiles over waterproof sub-decking.',
    highlights: [
      'Hexagonal Steel Structure',
      'Clay Tile Roof Cladding',
      'Decorative Rafter Brackets',
      'Anti-Termite & Weatherproof',
      'Landscape Integration',
      'Built-in Bench Seating',
    ],
    specs: [
      { label: 'Project Type', value: 'Landscape Gazebo' },
      { label: 'Material', value: 'Galvanized Steel + Mangalore Tiles' },
      { label: 'Finish', value: 'Woodgrain PU Paint' },
      { label: 'Color', value: 'Deep Teak & Matte Black' },
      { label: 'Diameter', value: '14 ft Across' },
      { label: 'Capacity', value: '8-10 Persons Seating' },
      { label: 'Completion', value: 'October 2023' },
    ],
    galleryImages: [
      { src: '/images/gazebo.jpg', alt: 'Garden gazebo evening illumination' },
      { src: '/images/sheds.jpg', alt: 'Rafter trusses and tile underlay' },
      { src: '/images/mat_polycarbonate.jpg', alt: 'Finishing craftsmanship' },
    ],
  },
  {
    id: 'p-10',
    slug: 'industrial-shed',
    title: 'Industrial Shed',
    subtitle: 'Vijayawada',
    category: 'Roofing',
    categoryValue: 'roofing',
    location: 'Vijayawada, Andhra Pradesh',
    city: 'Vijayawada, AP',
    completionDate: 'September 2023',
    year: '2023',
    projectType: 'Commercial',
    mainImage: '/images/sheds.jpg',
    sideImage: '/images/hero_welder.jpg',
    videoUrl: '/images/hero_laser_cutting.mp4',
    videoThumbnail: '/images/hero_welder.jpg',
    shortDescription: 'Heavy structural steel warehouse shed with 40-foot clear span and motorized rolling shutters.',
    aboutProject:
      'Engineered for an industrial manufacturing facility, this clear-span steel warehouse maximizes internal floor usability with zero central column obstructions.',
    projectDescription:
      'Fabricated with certified structural steel universal beams and portal frames. Complete with motorized industrial rolling shutters, turbo ridge ventilators, and polycarbonate skylight panels for natural daylight.',
    highlights: [
      '40-ft Clear Span Portal Frame',
      'Zero Central Columns',
      'Turbo Roof Ventilators',
      'Motorized Rolling Shutters',
      'Natural Daylight Skylights',
      'IS Standard Compliance',
    ],
    specs: [
      { label: 'Project Type', value: 'Industrial Warehouse Shed' },
      { label: 'Material', value: 'IS 2062 Grade Structural Steel' },
      { label: 'Roofing', value: '0.50mm Galvalume Color Sheets' },
      { label: 'Finish', value: 'Epoxy Zinc Primer + Industrial PU' },
      { label: 'Clear Height', value: '20 ft Eaves Height' },
      { label: 'Total Floor Area', value: '5,000 sq.ft.' },
      { label: 'Completion', value: 'September 2023' },
    ],
    galleryImages: [
      { src: '/images/sheds.jpg', alt: 'Warehouse steel portal frame' },
      { src: '/images/hero_welder.jpg', alt: 'Structural column welding' },
      { src: '/images/mat_color_coated.jpg', alt: 'Galvalume roof sheets' },
    ],
  },
  {
    id: 'p-11',
    slug: 'balcony-screen',
    title: 'Balcony Screen',
    subtitle: 'Vijayawada',
    category: 'Other',
    categoryValue: 'other',
    location: 'Vijayawada, Andhra Pradesh',
    city: 'Vijayawada, AP',
    completionDate: 'August 2023',
    year: '2023',
    projectType: 'Residential',
    mainImage: '/images/elevation.jpg',
    sideImage: '/images/mat_decorative.jpg',
    shortDescription: 'Privacy jaali screens with sliding track mechanism for luxury apartment terrace balcony.',
    aboutProject:
      'A bespoke sliding privacy screen system allowing the homeowner to modulate shade, natural ventilation, and sightline privacy on demand.',
    projectDescription:
      'Lightweight but rigid aluminum composite and laser-cut steel composite panels mounted on heavy-duty stainless steel top-hung sliding tracks with silent nylon roller carriages.',
    highlights: [
      'Sliding Track Operation',
      'Modulated Privacy & Ventilation',
      'Silent Nylon Rollers',
      'Laser Cut Floral Motifs',
      'Corrosion Free Aluminium & SS',
      'Slim Profile Construction',
    ],
    specs: [
      { label: 'Project Type', value: 'Sliding Privacy Screen' },
      { label: 'Material', value: 'Laser Cut Metal + SS Track' },
      { label: 'Finish', value: 'Matte Champagne Powder Coat' },
      { label: 'Color', value: 'Champagne Gold & Charcoal' },
      { label: 'Panel Dimensions', value: '4 ft x 7 ft (4 Panels)' },
      { label: 'Total Run', value: '16 Running Feet' },
      { label: 'Completion', value: 'August 2023' },
    ],
    galleryImages: [
      { src: '/images/elevation.jpg', alt: 'Balcony privacy screen in place' },
      { src: '/images/mat_decorative.jpg', alt: 'Perforation pattern' },
      { src: '/images/gate_proj_3.jpg', alt: 'Sliding hardware and runner' },
    ],
  },
  {
    id: 'p-12',
    slug: 'sliding-gate',
    title: 'Sliding Gate',
    subtitle: 'Vijayawada',
    category: 'Gates',
    categoryValue: 'gates',
    location: 'Vijayawada, Andhra Pradesh',
    city: 'Vijayawada, AP',
    completionDate: 'July 2023',
    year: '2023',
    projectType: 'Residential',
    mainImage: '/images/gate.jpg',
    sideImage: '/images/gate_overview.jpg',
    videoUrl: '/images/gate_sliding_action.mp4',
    videoThumbnail: '/images/gate.jpg',
    shortDescription: 'Heavy-duty motorized horizontal sliding gate with trackless cantilever drive mechanism.',
    aboutProject:
      'Engineered for a sloped driveway entrance where ground tracks were impossible due to rainwater drainage and uneven paving stones.',
    projectDescription:
      'The cantilever mechanism suspends the entire gate above the ground, gliding effortlessly on sealed structural bearings without touching the driveway surface. Fully automated with remote controls and soft-start/stop motor.',
    highlights: [
      'Trackless Cantilever Drive',
      'Zero Ground Track Obstruction',
      'Heavy-Duty Sealed Bearings',
      'Automated Remote Access',
      'Sloped Driveway Compatible',
      'High-Cycle Durability',
    ],
    specs: [
      { label: 'Project Type', value: 'Cantilever Sliding Gate' },
      { label: 'Material', value: 'Heavy Mild Steel (MS)' },
      { label: 'Finish', value: 'Hot-Dip Galvanized + Powder Coat' },
      { label: 'Color', value: 'Matte Textured Black' },
      { label: 'Motor Rating', value: '800kg Capacity Motor' },
      { label: 'Span', value: '18 ft Opening' },
      { label: 'Completion', value: 'July 2023' },
    ],
    galleryImages: [
      { src: '/images/gate.jpg', alt: 'Cantilever gate closed position' },
      { src: '/images/gate_overview.jpg', alt: 'Cantilever overhang and roller carriages' },
      { src: '/images/gate_proj_2.jpg', alt: 'Motor unit and safety sensor' },
    ],
  },
];

export function getProjectBySlug(slug: string): ProjectData | undefined {
  return allProjects.find((p) => p.slug === slug);
}

export function getRelatedProjects(currentSlug: string, categoryValue: string, limit = 3): ProjectData[] {
  const others = allProjects.filter((p) => p.slug !== currentSlug);
  const sameCategory = others.filter((p) => p.categoryValue === categoryValue);
  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }
  const differentCategory = others.filter((p) => p.categoryValue !== categoryValue);
  return [...sameCategory, ...differentCategory].slice(0, limit);
}
