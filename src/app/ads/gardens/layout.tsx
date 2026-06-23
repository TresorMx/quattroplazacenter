import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Locales en Venta Cancún — Quattro Plaza Gardens | Tresor Real Estate',
  description:
    'Locales comerciales en venta en Cancún desde 32 m². Zona de alto tráfico, enganche desde $147,000 MXN, entrega Jun–Sep 2027. Descarga el brochure con precios y planos.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
