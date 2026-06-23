import type { Metadata } from 'next';

const SITE = 'https://www.quattroplaza.mx';

export const metadata: Metadata = {
  title: 'Locales en Venta Cancún — Agenda tu Visita | Quattro Plaza Gardens',
  description:
    'Locales en venta en Cancún desde 32 m². Agenda tu visita sin compromiso. Enganche desde $147,000 MXN. Entrega Jun–Sep 2027. Un asesor te contacta en menos de 2 horas.',
  keywords: [
    'locales en venta cancún',
    'locales comerciales en venta cancún',
    'agenda visita local comercial cancún',
    'quattro plaza gardens',
    'plaza comercial cancún preventa',
    'inversión inmobiliaria quintana roo',
  ],
  openGraph: {
    title: 'Locales en Venta Cancún — Agenda tu Visita',
    description: 'Locales en venta en Cancún desde 32 m². Agenda tu visita sin compromiso. Enganche desde $147,000 MXN.',
    url: `${SITE}/ads/gardens-c`,
    siteName: 'Quattro Plaza Center',
    images: [{ url: `${SITE}/og/home.jpg`, width: 1200, height: 630, alt: 'Locales en Venta Cancún — Quattro Plaza Gardens' }],
    type: 'website',
    locale: 'es_MX',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Locales en Venta Cancún — Agenda tu Visita',
    description: 'Locales desde 32 m² en Cancún. Agenda una visita sin compromiso.',
    images: [`${SITE}/og/home.jpg`],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
