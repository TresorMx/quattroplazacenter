import type { Metadata } from 'next';

const SITE = 'https://www.quattroplaza.mx';

export const metadata: Metadata = {
  title: 'Locales Comerciales en Venta Cancún — Asesoría Gratuita | Quattro Plaza Gardens',
  description:
    'Locales comerciales en venta en Cancún desde 32 m². Habla con un asesor especializado sin costo. Enganche desde $147,000 MXN. Entrega Jun–Sep 2027. Quattro Plaza Gardens.',
  keywords: [
    'locales comerciales en venta cancún',
    'locales en venta cancún',
    'asesor inmobiliario cancún',
    'plaza comercial cancún',
    'quattro plaza gardens cancún',
    'inversión comercial quintana roo',
  ],
  openGraph: {
    title: 'Locales Comerciales en Venta Cancún — Asesoría Gratuita',
    description: 'Locales comerciales en venta en Cancún desde 32 m². Habla con un asesor sin costo. Enganche desde $147,000 MXN.',
    url: `${SITE}/ads/gardens-asesoria`,
    siteName: 'Quattro Plaza Center',
    images: [{ url: `${SITE}/og/home.jpg`, width: 1200, height: 630, alt: 'Locales Comerciales en Venta Cancún — Quattro Plaza Gardens' }],
    type: 'website',
    locale: 'es_MX',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Locales Comerciales en Venta Cancún — Asesoría Gratuita',
    description: 'Locales comerciales desde 32 m² en Cancún. Asesoría sin costo.',
    images: [`${SITE}/og/home.jpg`],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
