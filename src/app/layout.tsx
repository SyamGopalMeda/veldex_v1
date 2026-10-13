import type { Metadata, Viewport } from 'next';
import { SITE_URL, OG_IMAGE, PAGE_SEO, organizationSchema, websiteSchema } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import { getSiteSettings, toPublicSettings, getServicesView } from '@/lib/content';
import { SiteSettingsProvider } from '@/components/layout/SiteSettingsContext';
import { Barlow_Condensed, Inter, Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { PublicSiteWrapper } from '@/components/layout/PublicSiteWrapper';
import { siteConfig } from '@/lib/config';

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-barlow',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

// Public-site typography (see `vx-` rules in globals.css):
// Geist for display + body, Geist Mono for technical annotations.
const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: PAGE_SEO.home.title,
    template: `%s | ${siteConfig.brand.name}`,
  },
  description: PAGE_SEO.home.description,
  applicationName: siteConfig.brand.name,
  authors: [{ name: siteConfig.brand.name }],
  creator: siteConfig.brand.name,
  publisher: siteConfig.brand.name,
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  formatDetection: { telephone: true, email: true, address: false },
  icons: { icon: '/favicon.ico', apple: '/images/logo.png' },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: siteConfig.brand.name,
    title: PAGE_SEO.home.title,
    description: PAGE_SEO.home.description,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: siteConfig.brand.name }],
  },
  twitter: { card: 'summary_large_image', title: PAGE_SEO.home.title, description: PAGE_SEO.home.description, images: [OG_IMAGE] },
  ...(process.env.GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } } : {}),
};

// Every public page refreshes at least hourly; admin saves refresh them immediately.
export const revalidate = 3600;

export const viewport: Viewport = { themeColor: '#0E0E0D', width: 'device-width', initialScale: 1 };

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [rawSettings, services] = await Promise.all([getSiteSettings(), getServicesView()]);
  const settings = toPublicSettings(rawSettings);
  const visibleServices = services.published.map((s) => s.slug);
  return (
    <html
      lang="en"
      className={`${barlowCondensed.variable} ${inter.variable} ${geist.variable} ${geistMono.variable}`}
    >
      <body className="bg-[#F4F2EE] text-[#121211] antialiased">
        <JsonLd data={organizationSchema(settings)} />
        <JsonLd data={websiteSchema()} />
        <SiteSettingsProvider value={settings} visibleServices={visibleServices}>
          <PublicSiteWrapper>{children}</PublicSiteWrapper>
        </SiteSettingsProvider>
      </body>
    </html>
  );
}
