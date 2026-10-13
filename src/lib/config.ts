/**
 * CENTRALIZED SITE CONFIGURATION
 *
 * This file is the SINGLE SOURCE OF TRUTH for all contact and brand configuration.
 * NEVER hardcode phone, email, WhatsApp, or location in any component.
 * Always import from this file.
 *
 * Contact values are PROVISIONAL — marked HIGH-CONFIDENCE but pending final owner confirmation.
 * They can be updated here, or overridden dynamically from Firestore settings/general.
 *
 * @see knowledge/development-input/01-business-facts.md
 * @see knowledge/development-input/FINAL-DEVELOPMENT-CONTRACT.md (DEC-003)
 */

export const siteConfig = {
  // ── Brand ────────────────────────────────────────────────────────────────
  brand: {
    name: 'Veldex Fabrications',
    legalName: 'Veldex Fabrications (OPC) Private Limited',
    tagline: 'Precision in Every Cut. Perfection in Every Detail.',
    description:
      'Custom metal fabrication specialists in Vijayawada — automated gates, architectural railings, spiral staircases, Kerala-style gazebos, and structural metalwork.',
  },

  // ── Contact (PROVISIONAL — DEC-003: pending final owner confirmation) ───
  contact: {
    // TODO: Confirm with owner before launch
    phone: '+916305066077',
    phoneDisplay: '+91 63050 66077',
    // TODO: Confirm with owner before launch
    whatsapp: '916305066077',
    whatsappDisplay: '+91 63050 66077',
    // TODO: Confirm with owner before launch
    email: 'veldexfabrications@gmail.com',
  },

  // ── Location (DEC-002: City-level only — street address pending) ─────────
  location: {
    // APPROVED: City-level display only. Do NOT show street address.
    publicDisplay: 'Vijayawada, Andhra Pradesh',
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    country: 'India',
    pincode: '520003',
    // Statutory registered office — for legal footer only
    registeredOffice: 'Durga Puram, 94 Gandhi Nagar, Vijayawada – 520003, Andhra Pradesh',
    // Workshop address — RESEARCH-BASED / NOT published on website
    // TODO: Confirm before publishing or adding Google Maps pin
    workshopAddress_INTERNAL_DO_NOT_PUBLISH:
      'Door No. 24-1-70, Kottavantena Circle, Sambamurthy Road, Durgapuram, Vijayawada – 520003',
  },

  // ── Operating Hours (RESEARCH-BASED — verify before launch) ─────────────
  hours: {
    display: 'Monday – Sunday: 9:00 AM – 9:00 PM',
  },

  // ── Social Media (CONFIRMED — verified Instagram profile) ────────────────
  social: {
    instagram: 'https://www.instagram.com/veldex_fabrications/',
    instagramHandle: '@veldex_fabrications',
    threads: 'https://www.threads.net/@veldex_fabrications',
    whatsappLink: '/wa',
  },

  // ── SEO ──────────────────────────────────────────────────────────────────
  seo: {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://www.veldexfabrications.com',
    defaultOgImage: '/images/og-default.jpg',
    twitterHandle: '',
  },

  // ── Copyright ─────────────────────────────────────────────────────────────
  copyright: {
    year: 2026,
    text: '© 2026 Veldex Fabrications. All Rights Reserved.',
  },
} as const;

// Whatsapp message helpers
/** Links go through /wa, which forwards to the WhatsApp number set in the admin. */
export function buildWhatsAppLink(message: string): string {
  return `/wa?text=${encodeURIComponent(message)}`;
}

export function buildQuoteWhatsAppLink(context?: string): string {
  const base = `Hi Veldex Fabrications! I'm interested in getting a custom quote.`;
  const msg = context ? `${base}\n\nService/Product: ${context}` : base;
  return buildWhatsAppLink(msg);
}
