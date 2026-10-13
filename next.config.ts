import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Default sizes plus 2560/2880 so 2x laptop screens get a sharp hero
    // without decoding a full 3840px image.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560, 2880, 3840],
    // WebP only: on App Hosting's 1 vCPU, a first-time AVIF encode of a 4K hero took
    // 2–5 s (slides showed black while waiting); WebP encodes in ~1 s.
    formats: ['image/webp'],
    // Firebase App Hosting turns Next image optimisation off unless this is set
    // explicitly — without it the 4K hero originals (1–2 MB) ship to phones.
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'veldexfabrications.com', 'www.veldexfabrications.com'],
    },
  },
  async redirects() {
    return [
      {
        source: '/products',
        destination: '/services',
        permanent: true,
      },
      {
        // duplicate of /quote — consolidate to one URL for search engines
        source: '/get-a-quote',
        destination: '/quote',
        permanent: true,
      },
      {
        source: '/products/:slug',
        destination: '/services',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
