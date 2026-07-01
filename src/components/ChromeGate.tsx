'use client';

import { usePathname } from 'next/navigation';

/**
 * Oculta el chrome del sitio (Header, Footer, barras, chatbot) en rutas
 * de herramienta como /cotizador, que se muestran a pantalla completa.
 */
export default function ChromeGate({
  header,
  footer,
  extras,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  extras: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const bare = pathname?.includes('/cotizador');

  if (bare) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      {header}
      <main className="min-h-screen pt-[72px]">{children}</main>
      {footer}
      {extras}
    </>
  );
}
