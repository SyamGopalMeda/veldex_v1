import Link from 'next/link';
import { ArrowUpRight, MessageCircle, FileText } from 'lucide-react';
import { buildQuoteWhatsAppLink } from '@/lib/config';
import { Reveal } from '../Reveal';

interface CtaBandProps {
  kicker?: string;
  title?: string;
  text?: string;
  /** Context appended to the WhatsApp quote message (e.g. a service name) */
  whatsappContext?: string;
}

/** Closing call-to-action band shared by inner pages: two action boxes. */
export function CtaBand({
  kicker = 'Have a custom requirement?',
  title = 'We love bringing your ideas to life.',
  text = 'Send us your site dimensions, blueprints, or architectural concepts. Our engineering team provides fast turnaround custom quotations.',
  whatsappContext,
}: CtaBandProps) {
  return (
    <section className="vx-sec vx-dark vx-cta-band">
      <div className="vx-wrap">
        <div className="vx-cta-grid">
          <Reveal>
            <span className="vx-kicker"><i />{kicker}</span>
            <h2 className="vx-h2" style={{ marginTop: '1.25rem' }}>{title}</h2>
            <p className="vx-body" style={{ marginTop: '1.25rem', maxWidth: '34rem' }}>{text}</p>
          </Reveal>
          <div className="vx-cta-actions">
            <Reveal delay={100} className="h-full">
              <a href={buildQuoteWhatsAppLink(whatsappContext)} target="_blank" rel="noopener noreferrer" className="vx-action vx-action-primary h-full">
                <span className="flex items-start justify-between">
                  <span className="vx-action-icon"><MessageCircle size={20} /></span>
                  <ArrowUpRight size={22} className="vx-arrow" />
                </span>
                <span>
                  <span className="block font-semibold text-lg">Get WhatsApp estimate</span>
                  <span className="block text-sm mt-1" style={{ opacity: 0.75 }}>Fast turnaround custom quotations.</span>
                </span>
              </a>
            </Reveal>
            <Reveal delay={180} className="h-full">
              <Link href="/contact" className="vx-action h-full">
                <span className="flex items-start justify-between">
                  <span className="vx-action-icon"><FileText size={20} /></span>
                  <ArrowUpRight size={22} className="vx-arrow" />
                </span>
                <span>
                  <span className="block font-semibold text-lg">Send lead form</span>
                  <span className="block text-sm mt-1" style={{ color: 'var(--vx-muted-dark)' }}>Share site dimensions, blueprints, or concepts.</span>
                </span>
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
