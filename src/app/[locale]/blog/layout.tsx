import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Blog — Inversión en Locales Comerciales en Cancún | Quattro Plaza Center',
    template: '%s | Quattro Plaza Center Blog',
  },
  description:
    'Guías, análisis y consejos para invertir en locales comerciales en Cancún. Todo lo que necesitas saber antes de comprar.',
  openGraph: {
    siteName: 'Quattro Plaza Center',
    type: 'website',
    locale: 'es_MX',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
