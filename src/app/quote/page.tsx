import { Metadata } from 'next';
import { pageMetadata, PAGE_SEO, breadcrumbSchema } from '@/lib/seo';
import { getSiteSettings, toPublicSettings } from '@/lib/content';
import {
  Headphones,
  FileText,
  ShieldCheck,
  Clock,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { siteConfig } from '@/lib/config';
import { JsonLd } from '@/components/seo/JsonLd';
import { PageHero, SectionHead, Reveal } from '@/components/vx/kit';
import { QuoteFormClient } from './QuoteFormClient';

export const metadata: Metadata = pageMetadata({ ...PAGE_SEO.quote, path: '/quote' });

const processSteps = [
  {
    step: '01',
    title: 'WE REVIEW',
    desc: 'We review your requirements carefully.',
  },
  {
    step: '02',
    title: 'WE ANALYZE',
    desc: 'Our team analyzes and plans your project.',
  },
  {
    step: '03',
    title: 'WE QUOTE',
    desc: 'You receive a detailed and transparent quote.',
  },
  {
    step: '04',
    title: 'WE BUILD',
    desc: 'Once approved, we build with precision and deliver.',
  },
];

const trust = [
  { Icon: Headphones, label: 'Expert consultation' },
  { Icon: FileText, label: 'Transparent quotation' },
  { Icon: ShieldCheck, label: 'Best quality' },
  { Icon: Clock, label: 'On time delivery' },
];

/** "WE REVIEW" → "We review" */
const sentence = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();

export default async function GetAQuotePage() {
  const S = toPublicSettings(await getSiteSettings());
  const quoteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Get a Quote | Veldex Fabrications',
    url: `${siteConfig.seo.baseUrl}/quote`,
    description: metadata.description,
  };

  const telHref = `tel:${S.phoneHref}`;

  return (
    <div className="vx">
      <JsonLd data={quoteSchema} />
      <JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Get a quote', path: '/quote' }])} />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <PageHero
        compact
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Get a quote' }]}
        kicker="Get a quote"
        title={['Let’s build', 'something great.']}
        lead="Share your requirements with us and get a customized quote for your project."
        actions={
          <a href="#brief" className="vx-link" style={{ color: '#fff' }}>
            Start your brief <ArrowRight size={16} />
          </a>
        }
        meta={
          <ul className="vx-contact-highlights">
            {trust.map(({ Icon, label }) => (
              <li key={label}><Icon size={16} strokeWidth={1.6} aria-hidden="true" />{label}</li>
            ))}
          </ul>
        }
      />

      {/* ── 01 QUOTE REQUEST FORM ────────────────────────────────────────── */}
      <section className="vx-sec vx-quote-main" id="brief">
        <div className="vx-wrap">
          <SectionHead
            num="01"
            kicker="Quote request form"
            title={['Tell us about', 'your project']}
            aside="Three short steps. Your brief summary updates as you go — review it, then send it to our estimation team."
          />
          <QuoteFormClient />
        </div>
      </section>

      {/* ── 02 WHAT HAPPENS NEXT ─────────────────────────────────────────── */}
      <section className="vx-sec vx-sec-white">
        <div className="vx-wrap">
          <SectionHead num="02" kicker="Process" title={['What happens next?']} />
          <ol className="vx-quote-process">
            {processSteps.map((step, i) => (
              <Reveal as="li" key={step.step} delay={i * 90} className="vx-quote-process-step">
                <span className="vx-quote-process-num">{step.step}</span>
                <h3 className="vx-h3">{sentence(step.title)}</h3>
                <p>{step.desc}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ── CONTACT STRIP ────────────────────────────────────────────────── */}
      <section className="vx-sec vx-sec-tight">
        <div className="vx-wrap">
          <Reveal className="vx-hairgrid vx-grid-4 vx-quote-contact">
            <a href={telHref} className="vx-quote-contact-cell">
              <span className="vx-box-icon"><Phone size={18} strokeWidth={1.6} aria-hidden="true" /></span>
              <span className="vx-quote-contact-label">Call us</span>
              <span className="vx-quote-contact-value">{S.phoneDisplay}</span>
            </a>
            <a href={`mailto:${S.email}`} className="vx-quote-contact-cell">
              <span className="vx-box-icon"><Mail size={18} strokeWidth={1.6} aria-hidden="true" /></span>
              <span className="vx-quote-contact-label">Email us</span>
              <span className="vx-quote-contact-value">{S.email.split('@')[0]}<wbr />@{S.email.split('@')[1]}</span>
            </a>
            <div className="vx-quote-contact-cell">
              <span className="vx-box-icon"><MapPin size={18} strokeWidth={1.6} aria-hidden="true" /></span>
              <span className="vx-quote-contact-label">Visit our office</span>
              <span className="vx-quote-contact-value">
                {S.address}
              </span>
            </div>
            <div className="vx-quote-contact-cell">
              <span className="vx-box-icon"><Clock size={18} strokeWidth={1.6} aria-hidden="true" /></span>
              <span className="vx-quote-contact-label">Working hours</span>
              <span className="vx-quote-contact-value">{S.hoursSummary}</span>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
