import '@/styles/globals.css';

// Layout propio (como /studio): sin Header, Footer ni i18n del sitio.
export default function InventarioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, background: '#0E0E0E', color: '#fff', fontFamily: 'system-ui, -apple-system, Segoe UI, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
