import type { Metadata } from 'next';

const SITE = 'https://www.quattroplaza.mx';

export const metadata: Metadata = {
  title: 'Locales en Venta Cancún — Descarga Brochure | Quattro Plaza Gardens',
  description:
    'Locales comerciales en venta en Cancún desde 32 m². Enganche desde $147,000 MXN. Entrega Jun–Sep 2027. Descarga el brochure con precios, planos y renders en alta resolución.',
  keywords: [
    'locales en venta cancún',
    'locales comerciales en venta cancún',
    'plaza comercial cancún',
    'inversión inmobiliaria cancún',
    'quattro plaza gardens',
    'locales preventa quintana roo',
  ],
  openGraph: {
    title: 'Locales en Venta Cancún — Quattro Plaza Gardens',
    description: 'Locales comerciales en venta en Cancún desde 32 m². Enganche desde $147,000 MXN. Entrega Jun–Sep 2027.',
    url: `${SITE}/ads/gardens`,
    siteName: 'Quattro Plaza Center',
    images: [{ url: `${SITE}/og/home.jpg`, width: 1200, height: 630, alt: 'Locales en Venta Cancún — Quattro Plaza Gardens' }],
    type: 'website',
    locale: 'es_MX',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Locales en Venta Cancún — Quattro Plaza Gardens',
    description: 'Locales comerciales desde 32 m² en Cancún. Enganche desde $147,000 MXN.',
    images: [`${SITE}/og/home.jpg`],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
