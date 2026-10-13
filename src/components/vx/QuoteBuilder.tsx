'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { buildQuoteWhatsAppLink } from '@/lib/config';

export interface BuilderService {
  slug: string;
  name: string;
  materials: string[];
}

const PROJECT_TYPES = ['Residential', 'Commercial', 'Industrial'];

/**
 * Three-step brief (service → material → project type) with a live spec
 * sheet. Sends through the existing WhatsApp quote helper, so the enquiry
 * lands exactly where quotes already go.
 */
export function QuoteBuilder({ services }: { services: BuilderService[] }) {
  const [svc, setSvc] = useState<BuilderService | null>(null);
  const [material, setMaterial] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);

  const context = [svc?.name, material, type].filter(Boolean).join(' · ');
  const href = buildQuoteWhatsAppLink(context || undefined);

  const pickService = (s: BuilderService) => {
    setSvc(s);
    if (material && !s.materials.includes(material)) setMaterial(null);
  };

  return (
    <div className="vx-builder">
      <div className="vx-builder-steps">
        <div>
          <div className={`vx-step-label ${svc ? 'is-done' : ''}`}><b>1</b> Service</div>
          <div className="vx-chips">
            {services.map((s) => (
              <button key={s.slug} type="button" className={`vx-chip ${svc?.slug === s.slug ? 'is-on' : ''}`} aria-pressed={svc?.slug === s.slug} onClick={() => pickService(s)}>
                {s.name}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className={`vx-step-label ${material ? 'is-done' : ''}`}><b>2</b> Material</div>
          <div className="vx-chips">
            {(svc?.materials.length ? svc.materials : ['Select a service first']).map((m) => (
              <button
                key={m}
                type="button"
                disabled={!svc}
                className={`vx-chip ${material === m ? 'is-on' : ''}`}
                aria-pressed={material === m}
                onClick={() => setMaterial(m)}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className={`vx-step-label ${type ? 'is-done' : ''}`}><b>3</b> Project type</div>
          <div className="vx-chips">
            {PROJECT_TYPES.map((t) => (
              <button key={t} type="button" className={`vx-chip ${type === t ? 'is-on' : ''}`} aria-pressed={type === t} onClick={() => setType(t)}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="vx-sheet" aria-live="polite">
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--vx-muted-dark)', marginBottom: '0.75rem' }}>
          <span>Project brief</span>
          <span style={{ color: 'var(--vx-signal)' }}>{[svc, material, type].filter(Boolean).length}/3</span>
        </div>
        <dl style={{ margin: 0 }}>
          {[
            ['Service', svc?.name],
            ['Material', material],
            ['Type', type],
          ].map(([k, v]) => (
            <div className="vx-sheet-row" key={k as string}>
              <dt>{k}</dt>
              <dd key={(v as string) || 'empty'} className={v ? 'is-new' : 'is-empty'}>{v || '—'}</dd>
            </div>
          ))}
        </dl>
        <div style={{ marginTop: 'auto', paddingTop: '2rem', display: 'grid', gap: '0.6rem' }}>
          <a href={href} target="_blank" rel="noopener noreferrer" className="vx-btn vx-btn-signal" style={{ justifyContent: 'space-between', fontFamily: 'var(--vx-sans)' }}>
            Send brief on WhatsApp
            <span className="vx-btn-ico"><ArrowUpRight size={18} /></span>
          </a>
          <Link href="/contact" className="vx-btn vx-btn-line" style={{ justifyContent: 'space-between', fontFamily: 'var(--vx-sans)' }}>
            Detailed enquiry form
            <span className="vx-btn-ico"><ArrowUpRight size={18} /></span>
          </Link>
        </div>
      </div>
    </div>
  );
}
