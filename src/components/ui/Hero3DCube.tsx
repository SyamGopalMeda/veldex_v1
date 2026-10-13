'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface Hero3DArchitecturalFanProps {
  className?: string;
}

export function Hero3DCube({ className = '' }: Hero3DArchitecturalFanProps) {
  // Pool of verified Veldex fabrication photography assets
  const projectItems = [
    { id: 0, src: '/images/gate.jpg', alt: 'Premium Laser-Cut Gate & Architectural Entrance' },
    { id: 1, src: '/images/stairs.jpg', alt: 'Structural Spiral Staircase' },
    { id: 2, src: '/images/gazebo.jpg', alt: 'Kerala Style Gazebo & Outdoor Structures' },
    { id: 3, src: '/images/elevation.jpg', alt: 'CNC Laser-Cut Architectural Facade' },
    { id: 4, src: '/images/railings.jpg', alt: 'SS & Glass Balustrades' },
    { id: 5, src: '/images/hero_welder.jpg', alt: 'Precision Metal Fabrication & Welding' },
  ];

  // Current active center item index
  const [centerItemIndex, setCenterItemIndex] = useState(0);

  // Cycle the COMPLETE FRAMED PANELS through the 3D arc positions
  // 1.5s center hold + 1.5s smooth transition between positions
  useEffect(() => {
    const timer = setInterval(() => {
      setCenterItemIndex((prev) => (prev + 1) % projectItems.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [projectItems.length]);

  // Define 3D Arc Slot Position presets relative to the Center Slot (relative offset: -3, -2, -1, 0, +1, +2, +3)
  // Each slot defines the exact width, height, 3D translation, rotation, scale, z-index, and border styling
  const getSlotStyle = (offset: number) => {
    switch (offset) {
      case -3: // Far Left Exit
        return {
          transform: 'translate3d(-240px, 45px, -90px) rotateY(42deg) rotateZ(-14deg) scale(0.72)',
          zIndex: 5,
          opacity: 0.4,
          isCenter: false,
          width: 140,
          height: 250,
        };
      case -2: // Outer Left
        return {
          transform: 'translate3d(-180px, 30px, -40px) rotateY(32deg) rotateZ(-10deg) scale(0.80)',
          zIndex: 15,
          opacity: 0.75,
          isCenter: false,
          width: 155,
          height: 280,
        };
      case -1: // Inner Left (Approaching exit)
        return {
          transform: 'translate3d(-95px, 10px, 35px) rotateY(18deg) rotateZ(-5deg) scale(0.90)',
          zIndex: 30,
          opacity: 0.9,
          isCenter: false,
          width: 170,
          height: 310,
        };
      case 0: // CENTER HERO POSITION (Tallest, Sharpest, Largest Zoom Focus)
        return {
          transform: 'translate3d(0px, -25px, 110px) rotateY(0deg) rotateZ(0deg) scale(1.08)',
          zIndex: 50,
          opacity: 1,
          isCenter: true,
          width: 195,
          height: 350,
        };
      case 1: // Inner Right (Next in line to become center)
        return {
          transform: 'translate3d(95px, 10px, 35px) rotateY(-18deg) rotateZ(5deg) scale(0.90)',
          zIndex: 30,
          opacity: 0.9,
          isCenter: false,
          width: 170,
          height: 310,
        };
      case 2: // Outer Right
        return {
          transform: 'translate3d(180px, 30px, -40px) rotateY(-32deg) rotateZ(10deg) scale(0.80)',
          zIndex: 15,
          opacity: 0.75,
          isCenter: false,
          width: 155,
          height: 280,
        };
      case 3: // Far Right Entry
      default:
        return {
          transform: 'translate3d(240px, 45px, -90px) rotateY(-42deg) rotateZ(14deg) scale(0.72)',
          zIndex: 5,
          opacity: 0.4,
          isCenter: false,
          width: 140,
          height: 250,
        };
    }
  };

  return (
    <div
      className={`relative w-full flex items-center justify-center select-none py-6 lg:py-0 ${className}`}
    >
      {/* ── SUBTLE GREEN SHINING PARTICLES — NO RINGS, NO ORBITS ──────────────── */}
      {/* These are sparse, tiny luminous green star-like points only */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Soft ambient green glow — very low opacity, not a ring */}
        <div className="absolute w-[320px] h-[320px] rounded-full bg-[#2E6B45]/8 blur-[80px] pointer-events-none" />

        {/* Subtle green particle — top right area */}
        <div
          className="absolute animate-twinkle"
          style={{
            top: '12%', right: '18%',
            width: '5px', height: '5px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(46,107,69,0.9) 0%, rgba(46,107,69,0) 70%)',
            boxShadow: '0 0 6px 2px rgba(46,107,69,0.35)',
            animationDelay: '0s',
            animationDuration: '3.2s',
          }}
        />

        {/* Subtle green particle — upper left */}
        <div
          className="absolute animate-twinkle"
          style={{
            top: '22%', left: '14%',
            width: '3px', height: '3px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(23,74,50,0.85) 0%, rgba(23,74,50,0) 70%)',
            boxShadow: '0 0 5px 2px rgba(23,74,50,0.30)',
            animationDelay: '1.1s',
            animationDuration: '4s',
          }}
        />

        {/* Slightly brighter particle — center right */}
        <div
          className="absolute animate-twinkle"
          style={{
            top: '45%', right: '8%',
            width: '4px', height: '4px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(46,107,69,1) 0%, rgba(46,107,69,0) 70%)',
            boxShadow: '0 0 8px 3px rgba(46,107,69,0.40)',
            animationDelay: '0.6s',
            animationDuration: '3.6s',
          }}
        />

        {/* Tiny faint particle — bottom left */}
        <div
          className="absolute animate-twinkle"
          style={{
            bottom: '28%', left: '10%',
            width: '3px', height: '3px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(46,107,69,0.7) 0%, rgba(46,107,69,0) 70%)',
            boxShadow: '0 0 4px 1px rgba(46,107,69,0.25)',
            animationDelay: '2s',
            animationDuration: '4.5s',
          }}
        />

        {/* Star-like point — bottom right area */}
        <div
          className="absolute animate-twinkle"
          style={{
            bottom: '18%', right: '20%',
            width: '4px', height: '4px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(46,107,69,0.8) 0%, rgba(46,107,69,0) 70%)',
            boxShadow: '0 0 7px 2px rgba(46,107,69,0.32)',
            animationDelay: '1.7s',
            animationDuration: '3.8s',
          }}
        />

        {/* Very faint top center particle */}
        <div
          className="absolute animate-twinkle"
          style={{
            top: '8%', left: '44%',
            width: '2px', height: '2px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(23,74,50,0.6) 0%, rgba(23,74,50,0) 70%)',
            boxShadow: '0 0 4px 1px rgba(23,74,50,0.20)',
            animationDelay: '2.8s',
            animationDuration: '5s',
          }}
        />

        {/* Natural grounding shadow */}
        <div className="absolute -bottom-6 w-3/4 h-10 bg-[#DDE3DE]/60 blur-2xl rounded-full" />
      </div>

      {/* ── 3D PERSPECTIVE STAGE (INDIVIDUAL COMPLETE FRAMED PANELS ANIMATE) ─────────── */}
      <div className="fan-stage relative z-10 w-[340px] h-[340px] sm:w-[440px] sm:h-[420px] md:w-[500px] md:h-[460px]">
        
        <div className="fan-core-track w-full h-full relative flex items-center justify-center">
          
          {/* Render each project item as a COMPLETE PANEL OBJECT (Image + Frame + Shadow) */}
          {projectItems.map((item, index) => {
            // Calculate shortest angular offset relative to the active center item
            let offset = index - centerItemIndex;
            if (offset > projectItems.length / 2) offset -= projectItems.length;
            if (offset < -projectItems.length / 2) offset += projectItems.length;

            const slot = getSlotStyle(offset);

            return (
              <div
                key={item.id}
                className="complete-panel-object absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{
                  width: `${slot.width}px`,
                  height: `${slot.height}px`,
                  transform: slot.transform,
                  zIndex: slot.zIndex,
                  opacity: slot.opacity,
                  transition: 'all 1.4s cubic-bezier(0.25, 1, 0.5, 1)',
                }}
              >
                {/* Clean frame — green accent on center panel only, subtle border on others */}
                <div
                  className={`panel-chassis w-full h-full rounded-2xl overflow-hidden bg-[#EEF5ED] transition-all duration-1000 ${
                    slot.isCenter
                      ? 'border-[2px] border-[#174A32] shadow-[0_8px_40px_rgba(23,74,50,0.20),0_20px_50px_rgba(0,0,0,0.12)]'
                      : 'border border-[#DDE3DE] shadow-[0_4px_20px_rgba(0,0,0,0.08),0_10px_30px_rgba(0,0,0,0.06)]'
                  }`}
                >
                  <div className="w-full h-full relative overflow-hidden">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 768px) 180px, 240px"
                      className={`object-cover transition-all duration-1000 ${
                        slot.isCenter
                          ? 'brightness-100 contrast-105'
                          : 'brightness-90 contrast-100'
                      }`}
                      priority={slot.isCenter}
                    />

                    {/* Very subtle light vignette bottom */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-t from-black/50 via-transparent transition-colors duration-1000 ${
                        slot.isCenter ? 'to-transparent' : 'to-transparent'
                      }`}
                    />
                    <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* ── SCOPED CSS FOR 3D PERSPECTIVE TRACK ──────────────────────────────────────── */}
      <style jsx>{`
        .fan-stage {
          perspective: 1500px;
          perspective-origin: 50% 50%;
        }

        .fan-core-track {
          transform-style: preserve-3d;
          transform: rotateX(-6deg) rotateY(0deg);
        }

        .complete-panel-object {
          transform-style: preserve-3d;
          will-change: transform, opacity, z-index;
        }

        .panel-chassis {
          will-change: transform, box-shadow, border-color;
        }

        @media (max-width: 640px) {
          .fan-stage {
            perspective: 950px;
          }
          .complete-panel-object {
            transform-origin: center bottom;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .complete-panel-object {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
