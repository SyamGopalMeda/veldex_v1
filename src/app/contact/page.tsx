import { Metadata } from 'next';
import { pageMetadata, PAGE_SEO, breadcrumbSchema } from '@/lib/seo';
import { getSiteSettings, toPublicSettings } from '@/lib/content';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Headphones,
  Wrench,
  ShieldCheck,
  Users2,
  Settings,
  MessageCircle,
  ArrowRight,
  ArrowUpRight,
} from 'lucide-react';
import { siteConfig, buildQuoteWhatsAppLink } from '@/lib/config';
import { JsonLd } from '@/components/seo/JsonLd';
import { PageHero, Reveal } from '@/components/vx/kit';
import { ContactFormClient } from './ContactFormClient';

export const metadata: Metadata = pageMetadata({ ...PAGE_SEO.contact, path: '/contact' });

const highlights = [
  { Icon: Headphones, label: 'Expert consultation' },
  { Icon: Wrench, label: 'Custom solutions' },
  { Icon: ShieldCheck, label: 'Quality assured' },
  { Icon: Clock, label: 'On time delivery' },
];

const reasons = [
  { Icon: Users2, label: 'Experienced team' },
  { Icon: ShieldCheck, label: 'Premium quality' },
  { Icon: Settings, label: 'Custom solutions' },
  { Icon: Headphones, label: 'Reliable support' },
];

export default async function ContactPage() {
  const S = toPublicSettings(await getSiteSettings());
  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Veldex Fabrications',
    url: `${siteConfig.seo.baseUrl}/contact`,
    mainEntity: {
      '@type': 'LocalBusiness',
      name: siteConfig.brand.name,
      telephone: S.phoneHref,
      email: S.email,
      address: {
        '@type': 'PostalAddress',
        addressLocality: siteConfig.location.city,
        addressRegion: siteConfig.location.state,
        addressCountry: 'IN',
      },
    },
  };

  const telHref = `tel:${S.phoneHref}`;

  const channels = [
    { Icon: Phone, label: 'Call us', value: S.phoneDisplay, href: telHref },
    { Icon: MessageCircle, label: 'WhatsApp', value: S.whatsappDisplay, href: buildQuoteWhatsAppLink(), external: true },
    { Icon: Mail, label: 'Email us', value: S.email, href: `mailto:${S.email}` },
    { Icon: MapPin, label: 'Visit our office', value: S.address },
    { Icon: Clock, label: 'Working hours', value: S.hoursSummary },
  ];

  return (
    <div className="vx">
      <JsonLd data={contactSchema} />
      <JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }])} />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <PageHero
        compact
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
        kicker="Get in touch"
        title={['We’d love to', 'hear from you.']}
        lead="Have a project in mind? Need a custom solution? Our team is here to help you."
        actions={
          <>
            <a href={telHref} className="vx-btn vx-btn-signal">
              Call {S.phoneDisplay}
              <span className="vx-btn-ico"><Phone size={17} /></span>
            </a>
            <a href="#enquiry" className="vx-link" style={{ color: '#fff' }}>Write to us <ArrowRight size={16} /></a>
          </>
        }
        meta={
          <ul className="vx-contact-highlights">
            {highlights.map(({ Icon, label }) => (
              <li key={label}><Icon size={16} strokeWidth={1.6} aria-hidden="true" />{label}</li>
            ))}
          </ul>
        }
      />

      {/* ── 01 FORM + CHANNELS ───────────────────────────────────────────── */}
      <section className="vx-sec vx-contact-main" id="enquiry">
        <div className="vx-wrap vx-contact-grid">
          <Reveal className="vx-box vx-contact-formbox">
            <span className="vx-kicker"><b>01</b><i />Enquiry form</span>
            <h2 className="vx-h3 vx-contact-title">Send us a message</h2>
            <p className="vx-contact-sub">Tell us about your site and what you’d like built. We’ll get back to you with next steps.</p>
            <ContactFormClient />
          </Reveal>

          <Reveal delay={120} className="vx-contact-side">
            <div className="vx-box vx-box-dark vx-contact-channels">
              <span className="vx-kicker"><b>02</b><i />Direct lines</span>
              <h2 className="vx-h3 vx-contact-title">Get in touch</h2>
              <ul className="vx-contact-list">
                {channels.map(({ Icon, label, value, href, external }) => {
                  const inner = (
                    <>
                      <span className="vx-box-icon"><Icon size={18} strokeWidth={1.6} aria-hidden="true" /></span>
                      <span className="vx-contact-ch-text">
                        <span className="vx-contact-ch-label">{label}</span>
                        <span className="vx-contact-ch-value">
                          {/* allow the email to wrap after "@" instead of mid-word on narrow phones */}
                          {value.includes('@') ? <>{value.split('@')[0]}<wbr />@{value.split('@')[1]}</> : value}
                        </span>
                      </span>
                      {href && <ArrowUpRight size={18} className="vx-contact-ch-arrow" aria-hidden="true" />}
                    </>
                  );
                  return (
                    <li key={label}>
                      {href ? (
                        <a
                          href={href}
                          className="vx-contact-ch is-link"
                          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        >
                          {inner}
                        </a>
                      ) : (
                        <div className="vx-contact-ch">{inner}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── MAP ──────────────────────────────────────────────────────────── */}
      <section className="vx-contact-map" aria-label="Location map">
        <div className="vx-contact-map-frame">
          <iframe
            title="Veldex Fabrications Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d122428.16912389146!2d80.57366579589333!3d16.51016843477815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35eff9482d944b%3A0x939b7e84ab4a0265!2sVijayawada%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="vx-wrap vx-contact-map-wrap">
          <div className="vx-contact-map-card">
            <span className="vx-box-icon"><MapPin size={18} strokeWidth={1.6} aria-hidden="true" /></span>
            <div>
              <span className="vx-contact-ch-label">Our location</span>
              <strong>Veldex Fabrications</strong>
              <p>Vijayawada, Andhra Pradesh, India</p>
              <a
                href="https://maps.google.com/?q=Vijayawada,+Andhra+Pradesh"
                target="_blank"
                rel="noopener noreferrer"
                className="vx-link"
              >
                View larger map <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY VELDEX + PROJECT CTA ─────────────────────────────────────── */}
      <section className="vx-sec vx-sec-tight vx-sec-white">
        <div className="vx-wrap vx-contact-why">
          <Reveal>
            <span className="vx-kicker"><b>03</b><i />Why choose Veldex?</span>
            <ul className="vx-hairgrid vx-contact-reasons">
              {reasons.map(({ Icon, label }) => (
                <li key={label}>
                  <span className="vx-box-icon"><Icon size={18} strokeWidth={1.6} aria-hidden="true" /></span>
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={120} className="vx-contact-cta">
            <h2 className="vx-h2">Have a project in mind?</h2>
            <p className="vx-body">Let’s build something extraordinary together.</p>
            <div className="vx-contact-cta-actions">
              <a href={buildQuoteWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="vx-btn vx-btn-signal">
                Get WhatsApp estimate
                <span className="vx-btn-ico"><MessageCircle size={17} /></span>
              </a>
              <a href="#clientName" className="vx-btn vx-btn-line">
                Send lead form
                <span className="vx-btn-ico"><ArrowRight size={17} /></span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
