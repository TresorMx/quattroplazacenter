import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Manrope, JetBrains_Mono, Montserrat } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileBar from '@/components/MobileBar';
import Chatbot from '@/components/Chatbot';
import MetaPixel from '@/components/MetaPixel';
import { locales, type Locale } from '@/i18n';
import { getPlazasAsync } from '@/lib/data';
import '@/styles/globals.css';

// force-dynamic: cada visita hace un fetch fresco a Sanity.
// Garantiza que los cambios del Studio se reflejan de inmediato.
export const dynamic = 'force-dynamic';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-montserrat',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://quattroplaza.mx';

export const viewport: Viewport = {
  themeColor: '#F6F4EF',
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: isEs
        ? 'Quattro Plaza Center — Locales en Venta Cancún'
        : 'Quattro Plaza Center — Commercial Units for Sale in Cancún',
      template: '%s · Quattro Plaza Center',
    },
    description: isEs
      ? 'Plazas comerciales premium en Cancún. Locales en preventa con alto retorno. Long Island y Gardens disponibles. Por Tresor Real Estate.'
      : 'Premium commercial plazas in Cancún. Pre-sale units with high returns. Long Island & Gardens available. By Tresor Real Estate.',
    keywords: isEs
      ? [
          'locales en venta Cancún',
          'plaza comercial Cancún',
          'inversión inmobiliaria Cancún',
          'locales preventa Quintana Roo',
          'desarrollo comercial Cancún',
          'Quattro Plaza Center',
          'Long Island Cancún',
          'Gardens Cancún',
          'Tresor Real Estate',
        ]
      : ['commercial units Cancún', 'real estate investment Cancún', 'Quattro Plaza Center'],
    authors: [{ name: 'Tresor Real Estate' }],
    creator: 'Tresor Real Estate',
    publisher: 'Tresor Real Estate',
    formatDetection: { telephone: true, address: true, email: true },
    alternates: {
      canonical: isEs ? SITE_URL : `${SITE_URL}/en`,
      languages: {
        'es':        SITE_URL,
        'en':        `${SITE_URL}/en`,
        'x-default': SITE_URL,
      },
    },
    openGraph: {
      type: 'website',
      locale: isEs ? 'es_MX' : 'en_US',
      siteName: 'Quattro Plaza Center',
      title: isEs
        ? 'Quattro Plaza Center — Locales en Venta Cancún'
        : 'Quattro Plaza Center — Commercial Units in Cancún',
      description: isEs
        ? 'Plazas comerciales premium en Cancún. Long Island y Gardens en preventa.'
        : 'Premium commercial plazas in Cancún. Long Island and Gardens in pre-sale.',
      images: [{ url: '/og/home.jpg', width: 1200, height: 630, alt: 'Quattro Plaza Center' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Quattro Plaza Center',
      description: isEs
        ? 'Locales comerciales premium en Cancún.'
        : 'Premium commercial units in Cancún.',
      images: ['/og/home.jpg'],
    },
    verification: { google: 'google682c8dbc86478744' },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    icons: {
      icon: [
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      ],
      apple: '/apple-touch-icon.png',
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();

  // Carga plazas desde Sanity (deduplicado con React.cache — una sola llamada por request)
  await getPlazasAsync();

  const messages = await getMessages();

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Quattro Plaza Center',
    url: SITE_URL,
    logo: `${SITE_URL}/logos/logo-quattro.svg`,
    parentOrganization: { '@type': 'Organization', name: 'Tresor Real Estate' },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Cancún',
      addressRegion: 'Quintana Roo',
      addressCountry: 'MX',
    },
    sameAs: ['https://www.instagram.com/quattroplazacenter'],
  };

  return (
    <html
      lang={locale}
      className={`${cormorant.variable} ${manrope.variable} ${jetbrains.variable} ${montserrat.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Header />
          <main className="min-h-screen pt-[72px]">{children}</main>
          <Footer />
          <MobileBar />
          <Chatbot />
        </NextIntlClientProvider>
        <MetaPixel />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
