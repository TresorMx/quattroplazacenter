import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Locales Comerciales en Venta en Cancún | Quattro Plaza Center',
  description: 'Locales comerciales en venta en Cancún desde $1,968,600 MXN + IVA. Dos plazas disponibles: Gardens y Long Island. Enganche desde $147,000 MXN. Tresor Real Estate.',
  keywords: [
    'locales comerciales en cancun',
    'locales comerciales cancun',
    'local comercial en venta cancun',
    'venta de locales comerciales cancun',
    'local comercial cancun',
    'locales en venta cancun',
    'plaza comercial cancun',
    'inversion local comercial cancun',
    'local comercial preventa cancun',
    'quattro plaza center',
  ],
  alternates: { canonical: 'https://www.quattroplaza.mx/locales-comerciales-cancun' },
  openGraph: {
    title: 'Locales Comerciales en Venta en Cancún | Quattro Plaza Center',
    description: 'Dos plazas comerciales premium en Cancún. Locales desde 32 m² y desde $1,968,600 MXN + IVA. Enganche desde $147,000 MXN. Entrega 2027.',
    url: 'https://www.quattroplaza.mx/locales-comerciales-cancun',
    images: [{ url: 'https://www.quattroplaza.mx/renders/gardens/02.jpg', width: 1200, height: 630 }],
    locale: 'es_MX',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
