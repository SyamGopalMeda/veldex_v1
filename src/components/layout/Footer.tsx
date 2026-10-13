'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, MessageCircle, ArrowUpRight } from 'lucide-react';
import { siteConfig } from '@/lib/config';
import { useSiteSettings, useVisibleServiceLinks } from '@/components/layout/SiteSettingsContext';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Projects', href: '/projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

const serviceLinks = [
  { label: 'Gate Automation', href: '/services/gate-automation' },
  { label: 'Railings & Balustrades', href: '/services/railings' },
  { label: 'Custom Staircases', href: '/services/staircases' },
  { label: 'Pergolas & Gazebos', href: '/services/pergolas-gazebos' },
  { label: 'Sheds & Roofing', href: '/services/sheds-roofing' },
  { label: 'Elevations & Metalwork', href: '/services/elevations-facades' },
];

export function Footer() {
  const S = useSiteSettings();
  const visibleServiceLinks = useVisibleServiceLinks(serviceLinks);
  const phoneDisplay = S.phoneDisplay;
  const phoneRaw = S.phoneHref;
  const email = S.email;
  const address = S.address;
  return (
    <footer className="vx vx-foot">
      <div className="vx-wrap" style={{ paddingTop: 'clamp(4.5rem, 8vw, 7rem)' }}>
        {/* Statement row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '2rem', paddingBottom: 'clamp(3rem, 6vw, 4.5rem)', borderBottom: '1px solid var(--vx-line-dark)' }}>
          <p style={{ margin: 0, color: '#FFFFFF', fontSize: 'clamp(2rem, 4.6vw, 4rem)', fontWeight: 500, letterSpacing: '-0.045em', lineHeight: 1 }}>
            Precision in every cut.<br />
            <span style={{ color: 'var(--vx-muted-dark)' }}>Perfection in every detail.</span>
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <Link href="/quote" className="vx-btn vx-btn-signal">
              Get a quote
              <span className="vx-btn-ico"><ArrowUpRight size={16} /></span>
            </Link>
            <a href={siteConfig.social.whatsappLink} target="_blank" rel="noopener noreferrer" className="vx-btn vx-btn-line" style={{ borderColor: 'var(--vx-line-dark-2)', color: '#fff' }}>
              WhatsApp
              <span className="vx-btn-ico" style={{ background: 'rgba(255,255,255,0.08)' }}><MessageCircle size={16} /></span>
            </a>
          </div>
        </div>

        {/* Columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.75rem', padding: '3.5rem 0' }}>
          <div>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.8rem', textDecoration: 'none', color: '#fff', marginBottom: '1.25rem' }}>
              <img src="/images/logo-128.png" alt="Veldex Fabrications Logo" style={{ width: '42px', height: '42px', objectFit: 'contain', borderRadius: '3px' }} />
              <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                <span style={{ fontWeight: 600, fontSize: '1.05rem', letterSpacing: '0.16em' }}>VELDEX</span>
                <span className="vx-mono" style={{ fontSize: '0.58rem', letterSpacing: '0.22em', opacity: 0.55, marginTop: '0.3rem' }}>FABRICATIONS</span>
              </span>
            </Link>
            <p style={{ color: 'var(--vx-muted-dark)', fontSize: '0.92rem', lineHeight: 1.7, margin: 0, maxWidth: '290px' }}>
              Custom metal fabrication specialists in Vijayawada. Precision engineering for gates, railings, staircases, and architectural metalwork.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
              <a href={S.social.instagram || siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="vx-foot-link"
                style={{ width: 40, height: 40, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--vx-line-dark-2)', borderRadius: 4 }}
                aria-label="Veldex Fabrications on Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a href={siteConfig.social.whatsappLink} target="_blank" rel="noopener noreferrer" className="vx-foot-link"
                style={{ width: 40, height: 40, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--vx-line-dark-2)', borderRadius: 4 }}
                aria-label="WhatsApp">
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          <div>
            <h2 className="vx-foot-head">Quick Links</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.7rem' }}>
              {quickLinks.map((link) => (
                <li key={link.href}><Link href={link.href} className="vx-foot-link">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="vx-foot-head">Our Services</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.7rem' }}>
              {visibleServiceLinks.map((link) => (
                <li key={link.href}><Link href={link.href} className="vx-foot-link">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="vx-foot-head">Get in Touch</h2>
            <div style={{ display: 'grid', gap: '0.95rem' }}>
              <a href={`tel:${phoneRaw}`} className="vx-foot-link" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Phone size={15} style={{ color: 'var(--vx-signal)', flexShrink: 0 }} />
                {phoneDisplay}
              </a>
              <a href={`mailto:${email}`} className="vx-foot-link" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', wordBreak: 'break-all' }}>
                <Mail size={15} style={{ color: 'var(--vx-signal)', flexShrink: 0 }} />
                {email}
              </a>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', color: 'var(--vx-muted-dark)', fontSize: '0.92rem' }}>
                <MapPin size={15} style={{ color: 'var(--vx-signal)', flexShrink: 0, marginTop: '4px' }} />
                {address}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid var(--vx-line-dark)' }}>
        <div className="vx-wrap vx-mono" style={{ padding: '1.25rem 0', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '0.75rem', fontSize: '0.72rem', letterSpacing: '0.04em', color: 'var(--vx-muted-dark)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <span>{siteConfig.copyright.text}</span>
            <Link href="/privacy-policy" className="vx-foot-link" style={{ fontSize: '0.72rem' }}>Privacy Policy</Link>
          </div>
          <span>Designed with Precision. Built to last.</span>
        </div>
      </div>
    </footer>
  );
}
