/**
 * Website settings shared by server and browser code (no server-only imports).
 * Defaults come from the verified site config; Firestore `settings/general`
 * (edited in Admin → Website settings) overrides them.
 */
import { siteConfig } from '@/lib/config';
import type { WebsiteSettingsData } from '@/lib/adminStore';

export const DEFAULT_SETTINGS: WebsiteSettingsData = {
  websiteName: siteConfig.brand.name,
  tagline: siteConfig.brand.tagline,
  logoUrl: '/images/logo.png',
  faviconUrl: '/favicon.ico',
  footerDescription: siteConfig.brand.description,
  phone: siteConfig.contact.phoneDisplay,
  whatsapp: siteConfig.contact.whatsappDisplay,
  email: siteConfig.contact.email,
  address: siteConfig.location.publicDisplay,
  googleMapsUrl: 'https://maps.google.com/?q=Vijayawada,+Andhra+Pradesh',
  instagram: siteConfig.social.instagram,
  facebook: '',
  youtube: '',
  linkedin: '',
  defaultSeoTitle: '',
  defaultMetaDescription: '',
  defaultKeywords: '',
  defaultOgImage: '/images/og-default.jpg',
  businessHours: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => ({ day, open: true, hours: '9:00 AM – 9:00 PM' })),
};


/** Public, client-safe shape derived from the settings (digits for tel/wa.me links). */
export type PublicSettings = ReturnType<typeof toPublicSettings>;
export function toPublicSettings(s: WebsiteSettingsData) {
  const digits = (v: string) => v.replace(/[^0-9]/g, '');
  const wa = digits(s.whatsapp || s.phone);
  return {
    name: s.websiteName,
    tagline: s.tagline,
    description: s.footerDescription,
    phoneDisplay: s.phone,
    whatsappDisplay: s.whatsapp || s.phone,
    phoneHref: `+${digits(s.phone).replace(/^0+/, '')}`.replace(/^\+(\d{10})$/, '+91$1'),
    whatsappNumber: wa.length === 10 ? `91${wa}` : wa,
    email: s.email,
    address: s.address,
    mapsUrl: s.googleMapsUrl,
    social: { instagram: s.instagram, facebook: s.facebook, youtube: s.youtube, linkedin: s.linkedin },
    hours: s.businessHours,
    hoursSummary: s.businessHours.every((h) => h.open && h.hours === s.businessHours[0].hours)
      ? `Monday – Sunday: ${s.businessHours[0].hours}`
      : s.businessHours.map((h) => `${h.day.slice(0, 3)} ${h.open ? h.hours : 'Closed'}`).join(' · '),
  };
}

