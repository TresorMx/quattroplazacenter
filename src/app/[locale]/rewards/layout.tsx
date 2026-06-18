import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Programa Rewards — Refiere y Gana | Quattro Plaza Center',
  description:
    'Refiere a familiares o conocidos a Quattro Plaza Center y gana la cancelería de tu local. Regístralos en minutos y empieza a ganar.',
  openGraph: {
    title: 'Programa Rewards — Refiere y Gana | Quattro Plaza Center',
    description:
      'Refiere a familiares o conocidos a Quattro Plaza Center y gana la cancelería de tu local. Regístralos en minutos y empieza a ganar.',
    url: 'https://www.quattroplaza.mx/rewards',
    siteName: 'Quattro Plaza Center',
    images: [{ url: 'https://www.quattroplaza.mx/og/home.jpg', width: 1200, height: 630, alt: 'Quattro Plaza Center — Programa Rewards' }],
    type: 'website',
    locale: 'es_MX',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Programa Rewards — Refiere y Gana | Quattro Plaza Center',
    description:
      'Refiere a familiares o conocidos a Quattro Plaza Center y gana la cancelería de tu local.',
    images: ['https://www.quattroplaza.mx/og/home.jpg'],
  },
  alternates: {
    canonical: 'https://www.quattroplaza.mx/rewards',
  },
};

export default function RewardsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
