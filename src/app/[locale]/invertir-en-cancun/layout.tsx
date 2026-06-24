import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Invertir en Cancún — Locales Comerciales para Inversionistas de Monterrey, CDMX y GDL',
  description:
    'Locales comerciales en preventa en Cancún con rendimientos del 10–15% anual. Proceso 100% remoto. Ideal para inversionistas de Monterrey, CDMX o Guadalajara que buscan diversificar fuera de su ciudad.',
  keywords: [
    'invertir en cancun',
    'inversión inmobiliaria cancun monterrey',
    'invertir en cancun desde monterrey',
    'locales comerciales cancun inversionista',
    'bienes raices cancun cdmx',
    'invertir fuera de mi ciudad cancun',
  ],
  alternates: {
    canonical: 'https://www.quattroplaza.mx/invertir-en-cancun',
  },
  openGraph: {
    title: 'Invertir en Cancún — Para Inversionistas de Monterrey, CDMX y Guadalajara',
    description: 'Rendimientos del 10–15% anual. Proceso 100% remoto. Locales en preventa desde $1,968,600 MXN + IVA.',
    url: 'https://www.quattroplaza.mx/invertir-en-cancun',
    images: [{ url: 'https://www.quattroplaza.mx/blog/AdobeStock_841077811.jpeg', width: 1200, height: 630 }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
