'use client';

import { useEffect, useState } from 'react';
import { siteConfig } from '@/lib/config';

/**
 * Floating WhatsApp button. Tucks away while it would get in the way:
 *  • a form field is focused (typing / on-screen keyboard open)
 *  • the footer is on screen (it has its own WhatsApp button, and the FAB
 *    would otherwise permanently cover the footer's last row)
 */
export function WhatsAppFAB() {
  const [typing, setTyping] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const isField = (t: EventTarget | null) =>
      t instanceof HTMLElement && t.matches('input:not([type=checkbox]):not([type=radio]):not([type=file]), textarea, select');
    const onIn = (e: FocusEvent) => { if (isField(e.target)) setTyping(true); };
    const onOut = (e: FocusEvent) => { if (isField(e.target)) setTyping(false); };
    document.addEventListener('focusin', onIn);
    document.addEventListener('focusout', onOut);

    let io: IntersectionObserver | undefined;
    const footer = document.querySelector('footer');
    if (footer) {
      io = new IntersectionObserver(([e]) => setFooterVisible(e.isIntersecting), { rootMargin: '0px 0px -40px 0px' });
      io.observe(footer);
    }
    return () => {
      document.removeEventListener('focusin', onIn);
      document.removeEventListener('focusout', onOut);
      io?.disconnect();
    };
  }, []);

  const hidden = typing || footerVisible;

  return (
    <a
      href={siteConfig.social.whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Veldex Fabrications on WhatsApp"
      className={`vx-fab ${hidden ? 'is-hidden' : ''}`}
      tabIndex={hidden ? -1 : undefined}
      aria-hidden={hidden || undefined}
    >
      {/* Pulse ring animation */}
      <span style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        border: '2px solid #25D366',
        animation: 'pulse-ring 2s ease-out infinite',
        pointerEvents: 'none',
      }} />
      {/* WhatsApp SVG icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="white"
        width="28"
        height="28"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.846L.057 23.786c-.072.272.187.522.455.437l5.987-1.948A11.935 11.935 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.825 9.825 0 01-5.011-1.374l-.361-.213-3.757 1.222 1.26-3.657-.235-.377A9.827 9.827 0 012.182 12C2.182 6.567 6.567 2.182 12 2.182S21.818 6.567 21.818 12 17.433 21.818 12 21.818z"/>
      </svg>
    </a>
  );
}
