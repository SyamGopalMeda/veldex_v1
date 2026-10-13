'use client';

import { useState, useEffect, type MouseEvent } from 'react';
import { flushSync } from 'react-dom';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  UserCheck,
  Settings,
  ShieldCheck,
  Lock,
  Cookie,
  Mail,
  ExternalLink,
  Users,
  RefreshCw,
  PhoneCall,
  Headphones,
  ArrowUpRight,
  ChevronDown,
  type LucideIcon,
} from 'lucide-react';
import { useSiteSettings } from '@/components/layout/SiteSettingsContext';
import { siteConfig } from '@/lib/config';
import { PageHero } from '@/components/vx/kit';

interface PolicySection {
  id: string;
  number: string;
  title: string;
  icon: LucideIcon;
  summary: string;
  details: string[];
}

const basePolicySections: PolicySection[] = [
  {
    id: 'information-we-collect',
    number: '01',
    title: 'INFORMATION WE COLLECT',
    icon: UserCheck,
    summary:
      'We may collect personal information such as your name, email address, phone number, and project details when you contact us or fill out forms on our website.',
    details: [
      'Contact Information: Name, phone number, email address, and physical location provided via quote requests, contact forms, or direct phone and WhatsApp conversations.',
      'Project Specifications: Architectural drawings, dimension measurements, material preferences, and photos submitted for fabrication estimates.',
      'Website Interaction Data: Standard device details, browser types, IP addresses, and page navigation statistics gathered to enhance performance and user experience.',
    ],
  },
  {
    id: 'how-we-use-information',
    number: '02',
    title: 'HOW WE USE YOUR INFORMATION',
    icon: Settings,
    summary:
      'We use the information we collect to respond to your inquiries, provide our services, send updates, and improve our website and customer experience.',
    details: [
      'Delivering custom quotes, structural design recommendations, and precise material cost estimates.',
      'Coordinating on-site measurements, fabrication schedules, delivery timelines, and installation at your premises.',
      'Answering technical inquiries through telephone, email, and WhatsApp communications.',
      'Improving our fabrication service offerings and optimizing our website functionality.',
    ],
  },
  {
    id: 'information-sharing',
    number: '03',
    title: 'INFORMATION SHARING',
    icon: ShieldCheck,
    summary:
      'We do not sell, trade, or rent your personal information. We may share your information with trusted service providers who help us operate our website and services.',
    details: [
      'Zero Data Commercialization: Veldex Fabrications strictly never sells, leases, or trades your personal details to third-party advertisers.',
      'Trusted Logistics & Service Partners: Essential details (such as delivery contact numbers and project site address) may be shared with trusted logistics and transport personnel for site deliveries.',
      'Legal Compliance: Disclosures are made solely if mandated by applicable law, statutory authorities, or court orders.',
    ],
  },
  {
    id: 'data-security',
    number: '04',
    title: 'DATA SECURITY',
    icon: Lock,
    summary:
      'We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.',
    details: [
      'Encrypted Transmissions: All data transferred through our web forms is transmitted using standard SSL / TLS encryption protocols.',
      'Restricted Access: Internal access to client specifications and contact records is restricted to designated project engineers and administrative personnel.',
      'Routine Audits: Periodic system reviews and security checks are conducted to maintain information safeguards.',
    ],
  },
  {
    id: 'cookies',
    number: '05',
    title: 'COOKIES',
    icon: Cookie,
    summary:
      'Our website may use cookies to enhance your experience. You can choose to disable cookies through your browser settings.',
    details: [
      'Session Management: Cookies assist in retaining your preferred view configurations and form progress.',
      'Performance Analytics: Anonymous analytical cookies help us evaluate page load speeds and identify navigation bottlenecks.',
      'User Control: You may configure your browser to decline cookies, though certain interactive features may function with reduced convenience.',
    ],
  },
  {
    id: 'your-rights',
    number: '06',
    title: 'YOUR RIGHTS',
    icon: Mail,
    summary:
      'You have the right to access, update, or delete your personal information. Please contact us if you wish to exercise these rights.',
    details: [
      'Access & Verification: You can request confirmation regarding what contact details we have on file for your project.',
      'Correction: You may request immediate correction of inaccurate or outdated contact information.',
      'Removal: You may request the deletion of non-statutory communication records at any time by contacting our support team.',
    ],
  },
  {
    id: 'third-party-links',
    number: '07',
    title: 'THIRD-PARTY LINKS',
    icon: ExternalLink,
    summary:
      'Our website may contain links to external third-party services like WhatsApp and social media platforms that maintain independent privacy guidelines.',
    details: [
      'External Platforms: Clicking links to external platforms such as WhatsApp or Instagram directs you to services governed by their respective privacy policies.',
      'Independence: We encourage you to review the privacy documentation of third-party platforms before submitting personal details on them.',
    ],
  },
  {
    id: 'childrens-privacy',
    number: '08',
    title: "CHILDREN'S PRIVACY",
    icon: Users,
    summary:
      'Our website and architectural fabrication services are intended for adults, property owners, and business enterprises.',
    details: [
      'Target Audience: Our digital services and quotes are tailored for property owners, architects, builders, and corporate clients aged 18 and above.',
      'Prompt Deletion: If we learn that personal information from minors has been collected inadvertently, it will be promptly removed from our databases.',
    ],
  },
  {
    id: 'changes-to-policy',
    number: '09',
    title: 'CHANGES TO THIS POLICY',
    icon: RefreshCw,
    summary:
      'We may update this Privacy Policy periodically to reflect changes in regulatory standards or our fabrication service operations.',
    details: [
      'Periodic Review: Any revisions will be published on this page accompanied by an updated "Last Updated" timestamp.',
      'Continuous Acceptance: Continued interaction with our website and services following updates denotes acceptance of modified terms.',
    ],
  },
  {
    id: 'contact-us',
    number: '10',
    title: 'CONTACT US',
    icon: PhoneCall,
    summary:
      'If you have questions, clarifications, or requests concerning this Privacy Policy, our team is readily reachable.',
    details: [
      `Phone: ${siteConfig.contact.phoneDisplay} (${siteConfig.hours.display})`,
      `Email: ${siteConfig.contact.email}`,
      `Operating Location: ${siteConfig.location.publicDisplay}`,
      `Registered Office: ${siteConfig.location.registeredOffice}`,
    ],
  },
];

/** Distance (px) from the viewport top at which a section becomes "current". */
const SPY_LINE = 160;
/** Scroll offset that clears the fixed navbar when jumping to a section. */
const SCROLL_OFFSET = 90;

/** Display form of the uppercase data titles: "HOW WE USE YOUR INFORMATION" → "How we use your information". */
const titleCase = (t: string) => t.charAt(0) + t.slice(1).toLowerCase();

/** Splits "Label: text" detail lines so the label can be emphasised; text is unchanged. */
function splitDetail(d: string): [string | null, string] {
  const i = d.indexOf(': ');
  if (i > 0 && i < 40 && !d.slice(0, i).includes(',')) return [d.slice(0, i + 1), d.slice(i + 1)];
  return [null, d];
}

export function PrivacyPolicyView() {
  const S = useSiteSettings();
  // Contact details always reflect Admin → Website settings
  const policySections = basePolicySections.map((sec) => ({
    ...sec,
    details: sec.details.map((d) =>
      d.replace(siteConfig.contact.phoneDisplay, S.phoneDisplay).replace(siteConfig.hours.display, S.hoursSummary)
        .replace(siteConfig.contact.email, S.email).replace(siteConfig.location.publicDisplay, S.address)),
  }));
  const [activeSection, setActiveSection] = useState(policySections[0].id);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scroll-spy: a 1px observation band SPY_LINE px below the viewport top.
  // The section crossing that line is current — same rule as the old scroll handler
  // ("last section whose top is above scrollY + 160"), without per-scroll layout reads.
  useEffect(() => {
    let io: IntersectionObserver | null = null;
    const setup = () => {
      io?.disconnect();
      const bottom = Math.max(0, window.innerHeight - SPY_LINE - 1);
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) setActiveSection(entry.target.id);
          }
        },
        { rootMargin: `-${SPY_LINE}px 0px -${bottom}px 0px`, threshold: 0 }
      );
      policySections.forEach((s) => {
        const el = document.getElementById(s.id);
        if (el) io?.observe(el);
      });
    };
    setup();
    window.addEventListener('resize', setup);
    return () => {
      window.removeEventListener('resize', setup);
      io?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobileMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileMenuOpen]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Collapse the mobile menu first so its height doesn't skew the target position.
      flushSync(() => setMobileMenuOpen(false));
      const offset = SCROLL_OFFSET;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({
        top: offsetPosition,
        behavior: reduce ? 'auto' : 'smooth',
      });
      setActiveSection(id);
      setMobileMenuOpen(false);
    }
  };

  const onNav = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToSection(id);
  };

  const active = policySections.find((s) => s.id === activeSection) ?? policySections[0];

  return (
    <div className="vx">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <PageHero
        compact
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Privacy policy' }]}
        kicker="Our commitment"
        title={['Privacy policy']}
        lead="Your privacy is important to us. This policy explains how Veldex Fabrications collects, uses and protects your personal information."
        meta={
          <dl className="vx-privacy-dates">
            <div>
              <dt><Calendar size={14} aria-hidden="true" />Effective Date</dt>
              <dd>May 10, 2024</dd>
            </div>
            <div>
              <dt><Clock size={14} aria-hidden="true" />Last Updated</dt>
              <dd>May 10, 2024</dd>
            </div>
          </dl>
        }
      />

      <section className="vx-sec vx-privacy-main">
        <div className="vx-wrap vx-privacy-layout">
          {/* ── Mobile: collapsible "On this page" ─────────────────────────── */}
          <div className="vx-privacy-mnav">
            <button
              type="button"
              className="vx-privacy-mnav-btn"
              aria-expanded={mobileMenuOpen}
              aria-controls="privacy-mobile-toc"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="vx-privacy-mnav-label">On this page</span>
              <span className="vx-privacy-mnav-current">
                <b>{active.number}</b> {titleCase(active.title)}
              </span>
              <ChevronDown size={18} className={`vx-privacy-chev ${mobileMenuOpen ? 'is-open' : ''}`} aria-hidden="true" />
            </button>

            {mobileMenuOpen && (
              <nav id="privacy-mobile-toc" aria-label="Privacy policy sections" className="vx-toc vx-privacy-mnav-list">
                {policySections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    onClick={onNav(sec.id)}
                    className={activeSection === sec.id ? 'is-active' : undefined}
                    aria-current={activeSection === sec.id ? 'location' : undefined}
                  >
                    <span>{sec.number}</span>
                    {titleCase(sec.title)}
                  </a>
                ))}
              </nav>
            )}
          </div>

          {/* ── Desktop: sticky section nav ────────────────────────────────── */}
          <aside className="vx-privacy-aside">
            <div className="vx-aside-sticky">
              <span className="vx-kicker"><i />On this page</span>
              <nav aria-label="Privacy policy sections" className="vx-toc vx-privacy-toc">
                {policySections.map((sec) => {
                  const isActive = activeSection === sec.id;
                  return (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      onClick={onNav(sec.id)}
                      className={isActive ? 'is-active' : undefined}
                      aria-current={isActive ? 'location' : undefined}
                    >
                      <span>{sec.number}</span>
                      {titleCase(sec.title)}
                    </a>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* ── Policy body ────────────────────────────────────────────────── */}
          <div className="vx-privacy-body">
            <p className="vx-privacy-intro">
              At Veldex Fabrications, we respect your privacy and are committed to protecting your personal information.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit
              our website or use our services.
            </p>

            {policySections.map((section) => {
              const Icon = section.icon;
              return (
                <article key={section.id} id={section.id} className="vx-privacy-sec" aria-labelledby={`${section.id}-title`}>
                  <div className="vx-privacy-sec-meta">
                    <span className="vx-box-icon"><Icon size={18} strokeWidth={1.6} aria-hidden={true} /></span>
                    <span className="vx-privacy-sec-num">Section {section.number}</span>
                  </div>
                  <h2 id={`${section.id}-title`} className="vx-privacy-sec-title">{titleCase(section.title)}</h2>
                  <p className="vx-privacy-summary">{section.summary}</p>
                  <ul className="vx-privacy-list">
                    {section.details.map((detail, idx) => {
                      const [label, rest] = splitDetail(detail);
                      return (
                        <li key={idx}>
                          {label ? <><strong>{label}</strong>{rest}</> : detail}
                        </li>
                      );
                    })}
                  </ul>
                </article>
              );
            })}

            {/* Bottom contact callout */}
            <div className="vx-box vx-box-dark vx-privacy-callout">
              <span className="vx-box-icon"><Headphones size={20} strokeWidth={1.6} aria-hidden="true" /></span>
              <div className="vx-privacy-callout-text">
                <p className="vx-privacy-callout-title">
                  If you have any questions about this Privacy Policy, please contact us.
                </p>
                <p className="vx-privacy-callout-sub">
                  We are pleased to assist with any security, personal data, or fabrication inquiries.
                </p>
              </div>
              <Link href="/contact" className="vx-btn vx-btn-signal">
                Contact us
                <span className="vx-btn-ico"><ArrowUpRight size={18} /></span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
