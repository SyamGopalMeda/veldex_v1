'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Project {
  title: string;
  category: string;
  location: string;
  img: string;
}

interface ProjectsShowcaseProps {
  projects: Project[];
}

export function ProjectsShowcase({ projects }: ProjectsShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : Math.max(0, projects.length - 1)));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < projects.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="relative w-full">
      {/* Horizontal Carousel Viewport with smooth scroll / translation */}
      <div 
        ref={containerRef}
        className="w-full overflow-hidden"
      >
        <div 
          className="flex gap-4 transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(calc(-${activeIndex * 20}%))`,
          }}
        >
          {projects.map((item, idx) => (
            <div 
              key={idx}
              className="w-full sm:w-[calc(50%-8px)] md:w-[calc(33.333%-11px)] lg:w-[calc(20%-13px)] shrink-0"
            >
              <div
                className="overflow-hidden group rounded-lg transition-all duration-300"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #DDE3DE',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#174A32'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#DDE3DE'; }}
              >
                <div className="aspect-[4/5] bg-[#EEF5ED] relative overflow-hidden flex items-center justify-center">
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                  
                  {/* Card bottom metadata */}
                  <div className="absolute bottom-0 inset-x-0 p-4 z-20">
                    <span className="text-[10px] font-bold text-[#DCEBDD] uppercase tracking-wider block mb-1 font-[family-name:var(--font-barlow)]">
                      {item.category}
                    </span>
                    <h4 className="text-sm font-extrabold text-white uppercase font-[family-name:var(--font-barlow)] tracking-wide group-hover:text-[#DCEBDD] transition-colors line-clamp-2">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-white/60 block mt-1 font-[family-name:var(--font-inter)]">
                      {item.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Left / Right Buttons */}
      <button
        onClick={handlePrev}
        aria-label="Previous project"
        style={{
          position: 'absolute',
          left: '-12px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 30,
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: '#FFFFFF',
          border: '1px solid #DDE3DE',
          color: '#151A18',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'border-color 0.2s, color 0.2s, box-shadow 0.2s',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}
        onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = '#174A32'; el.style.color = '#174A32'; }}
        onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = '#DDE3DE'; el.style.color = '#151A18'; }}
      >
        <ChevronLeft size={18} />
      </button>

      <button
        onClick={handleNext}
        aria-label="Next project"
        style={{
          position: 'absolute',
          right: '-12px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 30,
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: '#FFFFFF',
          border: '1px solid #DDE3DE',
          color: '#151A18',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'border-color 0.2s, color 0.2s, box-shadow 0.2s',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}
        onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = '#174A32'; el.style.color = '#174A32'; }}
        onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = '#DDE3DE'; el.style.color = '#151A18'; }}
      >
        <ChevronRight size={18} />
      </button>

      {/* Carousel Pagination Dots */}
      <div className="flex items-center justify-center gap-1.5 mt-6">
        {projects.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            style={{
              width: idx === activeIndex ? '16px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: idx === activeIndex ? '#174A32' : '#DDE3DE',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}
