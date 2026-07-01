import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ['@react-pdf/renderer'],
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async headers() {
    const base = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
    ];
    // Dominios de GoHighLevel / LeadConnector que pueden embeber el cotizador
    const cotizadorCsp = {
      key: 'Content-Security-Policy',
      value: "frame-ancestors 'self' https://crm.tresor.mx https://*.tresor.mx https://*.gohighlevel.com https://*.leadconnectorhq.com https://*.msgsndr.com https://*.myclientportal.com",
    };
    return [
      // Cotizador: se puede embeber dentro del CRM (GHL)
      { source: '/cotizador', headers: [...base, cotizadorCsp] },
      { source: '/:locale/cotizador', headers: [...base, cotizadorCsp] },
      // Todo lo demás: bloquea framing (anti-clickjacking)
      {
        source: '/((?!.*cotizador).*)',
        headers: [...base, { key: 'X-Frame-Options', value: 'DENY' }],
      },
    ];
  },
  async redirects() {
    return [
      { source: '/long-island', destination: '/plazas/long-island', permanent: true },
      { source: '/gardens', destination: '/plazas/gardens', permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
