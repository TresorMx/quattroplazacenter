import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Locales Comerciales en Venta Cancún — Asesoría Gratuita | Quattro Plaza Gardens',
  description:
    'Locales comerciales en venta en Cancún. Habla con un asesor especializado sin costo. Quattro Plaza Gardens — desde 32 m², enganche desde $147,000 MXN, entrega Jun–Sep 2027.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
