import Link from 'next/link';
import {
  Home,
  Layers,
  MessageCircle,
  Compass,
  ShieldCheck,
  Settings,
  Headphones,
  ArrowUpRight,
} from 'lucide-react';
import { buildQuoteWhatsAppLink } from '@/lib/config';
import { PageHero } from '@/components/vx/kit';

export const metadata = {
  title: '404 - Page Not Found | Veldex Fabrications',
  description: "The page you're looking for doesn't exist or has been moved. Let's get you back on track.",
};

const trustItems = [
  {
    icon: Compass,
    title: 'PRECISION ENGINEERING',
    desc: 'Built with accuracy and expertise',
  },
  {
    icon: ShieldCheck,
    title: 'PREMIUM QUALITY',
    desc: 'High quality materials and finish',
  },
  {
    icon: Settings,
    title: 'CUSTOM SOLUTIONS',
    desc: 'Tailored to your needs',
  },
  {
    icon: Headphones,
    title: 'RELIABLE SUPPORT',
    desc: "We're always here to help",
  },
];

/** Other public pages that are useful starting points. */
const shortcuts = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/projects', label: 'Projects' },
  { href: '/quote', label: 'Get a quote' },
  { href: '/contact', label: 'Contact' },
];

const sentence = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();

export default function NotFound() {
  return (
    <div className="vx">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <PageHero
        compact
        crumbs={[{ label: 'Home', href: '/' }, { label: '404' }]}
        kicker="Error 404"
        title={['Oops! Page', 'not found.']}
        lead="The page you're looking for doesn't exist or has been moved. Let's get you back on track."
        actions={
          <>
            <Link href="/" className="vx-btn vx-btn-signal">
              Go to home
              <span className="vx-btn-ico"><Home size={17} /></span>
            </Link>
            <Link href="/services" className="vx-btn vx-404-btn-ghost">
              Browse services
              <span className="vx-btn-ico"><Layers size={17} /></span>
            </Link>
          </>
        }
      />

      {/* ── WHERE TO NEXT ────────────────────────────────────────────────── */}
      <section className="vx-sec vx-sec-tight">
        <div className="vx-wrap vx-404-grid">
          <div className="vx-404-mark" aria-hidden="true">
            <span>4</span><span className="vx-404-zero">0</span><span>4</span>
          </div>

          <div className="vx-404-help">
            <span className="vx-kicker"><i />Where to next</span>
            <nav aria-label="Helpful links">
              <ul className="vx-404-links">
                {shortcuts.map((s, i) => (
                  <li key={s.href}>
                    <Link href={s.href}>
                      <span className="vx-404-num">{String(i + 1).padStart(2, '0')}</span>
                      <span className="vx-404-label">{s.label}</span>
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="vx-404-ask">
              <div>
                <h2 className="vx-404-ask-title">Need help finding something?</h2>
                <p>Our team is here to help you.</p>
              </div>
              <a
                href={buildQuoteWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="vx-btn vx-btn-line"
              >
                Chat on WhatsApp
                <span className="vx-btn-ico"><MessageCircle size={17} /></span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ──────────────────────────────────────────────────── */}
      <section className="vx-404-trust">
        <div className="vx-wrap">
          <ul className="vx-hairgrid vx-grid-4 vx-404-trust-grid">
            {trustItems.map((item) => {
              const IconComp = item.icon;
              return (
                <li key={item.title}>
                  <span className="vx-box-icon"><IconComp size={18} strokeWidth={1.6} aria-hidden="true" /></span>
                  <div>
                    <h3 className="vx-404-trust-title">{sentence(item.title)}</h3>
                    <p>{item.desc}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
