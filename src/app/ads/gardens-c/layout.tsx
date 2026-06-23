import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Locales en Venta Cancún — Agenda tu Visita | Quattro Plaza Gardens',
  description:
    'Locales en venta en Cancún desde 32 m². Agenda una visita sin compromiso y conoce disponibilidad, precios y planes de pago. Enganche desde $147,000 MXN.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
