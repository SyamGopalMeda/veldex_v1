'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ArrowUpRight } from 'lucide-react';
import { useSiteSettings, useVisibleServiceLinks } from '@/components/layout/SiteSettingsContext';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Services',
    href: '/services',
    children: [
      { label: 'Gate Fabrication & Automation', href: '/services/gate-automation' },
      { label: 'Railings & Balustrades', href: '/services/railings' },
      { label: 'Custom Staircases', href: '/services/staircases' },
      { label: 'Pergolas & Gazebos', href: '/services/pergolas-gazebos' },
      { label: 'Terrace Sheds & Roofing', href: '/services/sheds-roofing' },
      { label: 'Elevations & Metalwork', href: '/services/elevations-facades' },
    ],
  },
  { label: 'Projects', href: '/projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export function Navbar() {
  const S = useSiteSettings();
  const visibleChildren = useVisibleServiceLinks(navLinks.find((l) => l.children)?.children ?? []);
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [overHero, setOverHero] = useState(true);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      // Clear over the dark home hero, frosted glass everywhere else
      setOverHero(y < window.innerHeight - 120);
      // Tuck away while reading down, return on any upward scroll
      setHidden(y > 420 && y > lastY.current + 4);
      if (y < lastY.current - 4 || y <= 420) setHidden(false);
      lastY.current = y;
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const clear = isOpen || (isHome && overHero);
  const navClass = [
    'vx-nav',
    clear ? 'is-clear' : 'is-solid',
    hidden && !isOpen && !servicesOpen ? 'is-hidden' : '',
  ].join(' ');

  return (
    <div className="vx">
      <header className={navClass}>
        <nav className="vx-nav-inner" aria-label="Main">
          {/* Logo */}
          <Link href="/" className="vx-nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', textDecoration: 'none', color: 'inherit' }}>
            <img src="/images/logo-128.png" alt="Veldex Fabrications Logo" style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '3px' }} />
            <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span style={{ fontWeight: 600, fontSize: '1.05rem', letterSpacing: '0.16em' }}>VELDEX</span>
              <span className="vx-mono" style={{ fontSize: '0.58rem', letterSpacing: '0.22em', opacity: 0.6, marginTop: '0.3rem' }}>FABRICATIONS</span>
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="vx-nav-links">
            {navLinks.map((link) =>
              link.children ? (
                <li key={link.href} style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Link href={link.href} className={`vx-nav-link ${isActive(link.href) ? 'is-active' : ''}`} style={{ paddingRight: '0.3rem' }}>
                      {link.label}
                    </Link>
                    <button
                      onClick={() => setServicesOpen((v) => !v)}
                      onBlur={() => setTimeout(() => setServicesOpen(false), 200)}
                      className="vx-nav-link"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.55rem 0.35rem' }}
                      aria-label="Toggle services menu"
                      aria-expanded={servicesOpen}
                    >
                      <ChevronDown size={15} style={{ transform: servicesOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.35s' }} />
                    </button>
                  </div>
                  {servicesOpen && (
                    <div className="vx-dropdown">
                      {visibleChildren.map((child, i) => (
                        <Link key={child.href} href={child.href} className={`vx-drop-link ${pathname === child.href ? 'is-active' : ''}`}>
                          <span>{String(i + 1).padStart(2, '0')}</span>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              ) : (
                <li key={link.href}>
                  <Link href={link.href} className={`vx-nav-link ${isActive(link.href) ? 'is-active' : ''}`}>
                    {link.label}
                  </Link>
                </li>
              )
            )}
          </ul>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <Link href="/quote" className="vx-btn vx-btn-signal vx-nav-cta" style={{ height: '46px', fontSize: '0.88rem' }}>
              Get a quote
              <span className="vx-btn-ico" style={{ width: 34, height: 34 }}><ArrowUpRight size={16} /></span>
            </Link>
            <button
              type="button"
              className={`vx-burger ${isOpen ? 'is-open' : ''}`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              <span /><span />
            </button>
          </div>
        </nav>
      </header>

      {/* Full-screen mobile menu */}
      <div className={`vx-menu ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen}>
        <nav aria-label="Mobile">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              tabIndex={isOpen ? 0 : -1}
              className={`vx-menu-link ${isActive(link.href) ? 'is-active' : ''}`}
              style={{ ['--i' as string]: i }}
            >
              <small>{String(i + 1).padStart(2, '0')}</small>
              {link.label}
            </Link>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', paddingTop: '2rem', display: 'grid', gap: '1rem' }}>
          <Link href="/contact" tabIndex={isOpen ? 0 : -1} className="vx-btn vx-btn-signal" style={{ justifyContent: 'space-between' }}>
            Get a Quote
            <span className="vx-btn-ico"><ArrowUpRight size={18} /></span>
          </Link>
          <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: '1.25rem' }}>
          <a href={`tel:${S.phoneHref}`} tabIndex={isOpen ? 0 : -1} className="vx-mono vx-menu-contact">
            {S.phoneDisplay}
          </a>
          <a href={`mailto:${S.email}`} tabIndex={isOpen ? 0 : -1} className="vx-mono vx-menu-contact">
            {S.email}
          </a>
          </div>
        </div>
      </div>

      {/* Spacer for the fixed bar (the home hero sits underneath it) */}
      {!isHome && <div style={{ height: 'var(--vx-nav-h)' }} />}
    </div>
  );
}
