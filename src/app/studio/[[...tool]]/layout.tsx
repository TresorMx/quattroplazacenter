// Layout standalone para el Studio — sin Header, Footer ni i18n
export const metadata = { title: 'Quattro CMS' };

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
