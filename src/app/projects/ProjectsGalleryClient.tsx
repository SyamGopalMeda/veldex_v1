'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPin, 
  ArrowRight, 
  X, 
  Search,
  Building,
  Columns,
  ArrowUpRight,
  Home as HomeIcon,
  Layers,
  Grid3X3,
  ShieldCheck,
  MessageCircle
} from 'lucide-react';
import { siteConfig, buildQuoteWhatsAppLink } from '@/lib/config';

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  categoryValue: string;
  categoryIcon: any;
  description: string;
  location: string;
  img: string;
}

const portfolioProjects: ProjectItem[] = [
  {
    id: 'p-1',
    slug: 'automatic-sliding-gate',
    title: 'Automatic Sliding Gate',
    category: 'Gate Fabrication & Automation',
    categoryValue: 'gates',
    categoryIcon: ShieldCheck,
    description: 'Custom automatic sliding gate with laser cut design and smart automation.',
    location: 'Vijayawada, Andhra Pradesh',
    img: '/images/gate.jpg',
  },
  {
    id: 'p-2',
    slug: 'stainless-steel-staircase',
    title: 'Stainless Steel Staircase',
    category: 'Staircases',
    categoryValue: 'staircases',
    categoryIcon: ArrowUpRight,
    description: 'Modern stainless steel staircase with glass railing and wooden treads.',
    location: 'Guntur, Andhra Pradesh',
    img: '/images/railing_overview.jpg',
  },
  {
    id: 'p-3',
    slug: 'rooftop-pergola',
    title: 'Rooftop Pergola',
    category: 'Pergolas & Gazebos',
    categoryValue: 'pergolas',
    categoryIcon: HomeIcon,
    description: 'Custom rooftop pergola providing shade and style for outdoor living.',
    location: 'Hyderabad, Telangana',
    img: '/images/gazebo.jpg',
  },
  {
    id: 'p-4',
    slug: 'terrace-roofing-structure',
    title: 'Terrace Roofing Structure',
    category: 'Terrace Sheds & Roofing',
    categoryValue: 'roofing',
    categoryIcon: Layers,
    description: 'Strong and durable terrace roofing with insulated panels for heat protection.',
    location: 'Vijayawada, Andhra Pradesh',
    img: '/images/sheds.jpg',
  },
  {
    id: 'p-5',
    slug: 'decorative-facade-elevation',
    title: 'Decorative Facade Elevation',
    category: 'Elevations & Metalwork',
    categoryValue: 'elevations',
    categoryIcon: Building,
    description: 'Elegant laser cut metal facade enhancing the look and value of the property.',
    location: 'Visakhapatnam, Andhra Pradesh',
    img: '/images/elevation.jpg',
  },
  {
    id: 'p-6',
    slug: 'glass-balustrade',
    title: 'Glass Balustrade',
    category: 'Railings & Balustrades',
    categoryValue: 'railings',
    categoryIcon: Columns,
    description: 'Frameless glass balustrade for balcony with SS handrail.',
    location: 'Vijayawada, Andhra Pradesh',
    img: '/images/railing_hero.jpg',
  },
  {
    id: 'p-7',
    slug: 'compound-wall-design',
    title: 'Compound Wall Design',
    category: 'Elevations & Metalwork',
    categoryValue: 'elevations',
    categoryIcon: Grid3X3,
    description: 'Custom compound wall with decorative laser cut panels.',
    location: 'Tadepalligudem, Andhra Pradesh',
    img: '/images/gate_proj_2.jpg',
  },
  {
    id: 'p-8',
    slug: 'spiral-staircase',
    title: 'Spiral Staircase',
    category: 'Staircases',
    categoryValue: 'staircases',
    categoryIcon: ArrowUpRight,
    description: 'Beautiful spiral staircase with mild steel structure and wooden steps.',
    location: 'Hyderabad, Telangana',
    img: '/images/stairs.jpg',
  },
  {
    id: 'p-9',
    slug: 'garden-gazebo',
    title: 'Garden Gazebo',
    category: 'Pergolas & Gazebos',
    categoryValue: 'pergolas',
    categoryIcon: HomeIcon,
    description: 'Bespoke outdoor gazebo with metal framework and ambient illumination.',
    location: 'Vijayawada, Andhra Pradesh',
    img: '/images/gazebo.jpg',
  },
  {
    id: 'p-10',
    slug: 'ss-railing-design',
    title: 'SS Railing Design',
    category: 'Railings & Balustrades',
    categoryValue: 'railings',
    categoryIcon: Columns,
    description: 'High-grade stainless steel safety railing for residential balconies.',
    location: 'Guntur, Andhra Pradesh',
    img: '/images/railings.jpg',
  },
  {
    id: 'p-11',
    slug: 'industrial-shed',
    title: 'Industrial Shed',
    category: 'Terrace Sheds & Roofing',
    categoryValue: 'roofing',
    categoryIcon: Layers,
    description: 'Heavy duty steel truss roofing shed for commercial vehicle parking.',
    location: 'Vijayawada, Andhra Pradesh',
    img: '/images/sheds.jpg',
  },
  {
    id: 'p-12',
    slug: 'decorative-balcony-screen',
    title: 'Decorative Balcony Screen',
    category: 'Elevations & Metalwork',
    categoryValue: 'elevations',
    categoryIcon: Building,
    description: 'Laser cut privacy screen and architectural balcony facade panels.',
    location: 'Visakhapatnam, Andhra Pradesh',
    img: '/images/mat_decorative.jpg',
  },
];

const categoryFilters = [
  { label: 'ALL PROJECTS', value: 'ALL' },
  { label: 'GATES', value: 'gates' },
  { label: 'RAILINGS & BALUSTRADES', value: 'railings' },
  { label: 'STAIRCASES', value: 'staircases' },
  { label: 'PERGOLAS & GAZEBOS', value: 'pergolas' },
  { label: 'TERRACE SHEDS & ROOFING', value: 'roofing' },
  { label: 'ELEVATIONS & METALWORK', value: 'elevations' },
];

export function ProjectsGalleryClient() {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);

  const filteredProjects = useMemo(() => {
    return portfolioProjects.filter((project) => {
      const matchesCategory = activeFilter === 'ALL' || project.categoryValue === activeFilter;
      const matchesSearch = searchQuery.trim() === '' || 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  return (
    <>
      {/* ── FILTER TABS & SEARCH BAR ────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-10">
        
        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {categoryFilters.map((tab) => {
            const isActive = activeFilter === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveFilter(tab.value)}
                className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all font-[family-name:var(--font-barlow)] cursor-pointer ${
                  isActive
                    ? 'text-white shadow-sm'
                    : 'text-[#66635B] hover:text-[#121211] hover:bg-[#EBE8E1]'
                }`}
                style={{
                  background: isActive ? '#0E0E0D' : '#FFFFFF',
                  border: `1px solid ${isActive ? '#0E0E0D' : '#DCD8CF'}`,
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Input Box */}
        <div className="relative w-full lg:w-64">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs py-2 pl-3 pr-8 rounded-md outline-none transition-all font-[family-name:var(--font-inter)]"
            style={{
              background: '#FFFFFF',
              border: '1px solid #DCD8CF',
              color: '#121211',
            }}
          />
          <Search size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C8980]" />
        </div>

      </div>

      {/* ── 12-PROJECT GRID (4 COLS ON DESKTOP) ───────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProjects.map((project) => {
          const IconComp = project.categoryIcon;
          return (
            <div
              key={project.id}
              onClick={() => setActiveModalProject(project)}
              className="group rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:border-[#121211] cursor-pointer"
              style={{
                background: '#FFFFFF',
                border: '1px solid #DCD8CF',
              }}
            >
              <div>
                {/* Project Image */}
                <div className="aspect-[16/10] relative overflow-hidden bg-[#EBE8E1]">
                  <Image
                    src={project.img}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 opacity-40 group-hover:opacity-10 transition-opacity" />
                </div>

                {/* Card Content */}
                <div className="p-5 pb-3">
                  <h3 
                    className="text-base font-extrabold uppercase font-[family-name:var(--font-barlow)] leading-tight group-hover:text-[#121211] transition-colors mb-1.5"
                    style={{ color: '#121211' }}
                  >
                    {project.title}
                  </h3>

                  {/* Category with icon */}
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider font-[family-name:var(--font-barlow)] mb-2" style={{ color: '#121211' }}>
                    <IconComp size={13} strokeWidth={2.2} />
                    <span>{project.category}</span>
                  </div>

                  {/* Description */}
                  <p className="text-xs font-[family-name:var(--font-inter)] leading-relaxed mb-3 line-clamp-2" style={{ color: '#66635B' }}>
                    {project.description}
                  </p>

                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-[11px] font-medium font-[family-name:var(--font-inter)]" style={{ color: '#8C8980' }}>
                    <MapPin size={12} className="shrink-0 text-[#121211]" />
                    <span className="line-clamp-1">{project.location}</span>
                  </div>
                </div>
              </div>

              {/* View Project Action */}
              <div className="p-5 pt-3 border-t flex items-center justify-between" style={{ borderColor: '#E8E5DE' }}>
                <span className="text-xs font-bold uppercase tracking-wider font-[family-name:var(--font-barlow)] group-hover:text-[#121211] transition-colors" style={{ color: '#121211' }}>
                  VIEW PROJECT
                </span>
                <ArrowRight size={14} style={{ color: '#121211' }} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#DCD8CF]">
          <p className="text-sm font-semibold text-[#66635B] font-[family-name:var(--font-inter)]">
            No projects found matching your search. Try adjusting filters.
          </p>
        </div>
      )}

      {/* ── PROJECT DETAIL MODAL / LIGHTBOX ──────────────────────────── */}
      {activeModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div 
            className="card max-w-2xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto shadow-2xl rounded-3xl"
            style={{
              background: '#FFFFFF',
              border: '1px solid #DCD8CF',
            }}
          >
            <button
              onClick={() => setActiveModalProject(null)}
              className="absolute top-4 right-4 p-2 rounded-full transition-colors cursor-pointer"
              style={{
                background: '#EBE8E1',
                color: '#121211',
              }}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="mb-4">
              <span className="text-xs font-bold uppercase tracking-[0.2em] font-[family-name:var(--font-barlow)] block mb-1" style={{ color: '#121211' }}>
                {activeModalProject.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold uppercase font-[family-name:var(--font-barlow)]" style={{ color: '#121211' }}>
                {activeModalProject.title}
              </h2>
              <div className="flex items-center gap-1.5 text-xs mt-2 font-[family-name:var(--font-inter)]" style={{ color: '#66635B' }}>
                <MapPin size={14} style={{ color: '#121211' }} />
                <span>{activeModalProject.location}</span>
              </div>
            </div>

            {/* Photo */}
            <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-6 relative border" style={{ borderColor: '#DCD8CF' }}>
              <Image
                src={activeModalProject.img}
                alt={activeModalProject.title}
                fill
                className="object-cover"
              />
            </div>

            <p className="text-xs sm:text-sm font-[family-name:var(--font-inter)] leading-relaxed mb-6" style={{ color: '#66635B' }}>
              {activeModalProject.description} Precision fabrication executed by Veldex Fabrications to exact structural specifications and high architectural aesthetics.
            </p>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t" style={{ borderColor: '#E8E5DE' }}>
              <a
                href={buildQuoteWhatsAppLink(activeModalProject.title)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brand text-xs py-2.5 px-5 flex items-center gap-2"
                style={{ background: '#121211' }}
              >
                <MessageCircle size={15} />
                <span>Inquire on WhatsApp</span>
              </a>
              <button
                onClick={() => setActiveModalProject(null)}
                className="btn-outline text-xs py-2.5 px-5 cursor-pointer"
                style={{
                  background: '#FFFFFF',
                  borderColor: '#DCD8CF',
                  color: '#121211',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
