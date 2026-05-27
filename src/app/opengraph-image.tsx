import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Quattro Plaza Center — Locales en Venta Cancún';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #0E0E0E 0%, #1a1a1a 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          color: '#FFFFFF',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Halo bronze */}
        <div
          style={{
            position: 'absolute',
            top: -200,
            right: -200,
            width: 600,
            height: 600,
            borderRadius: 9999,
            background: 'radial-gradient(circle, rgba(250,180,19,0.35) 0%, transparent 70%)',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              fontSize: 22,
              letterSpacing: 8,
              fontWeight: 700,
              color: '#FAB413',
              textTransform: 'uppercase',
            }}
          >
            — Quattro Plaza Center
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            style={{
              fontSize: 76,
              fontStyle: 'italic',
              fontWeight: 300,
              lineHeight: 1.05,
              letterSpacing: -1,
              maxWidth: 920,
            }}
          >
            Locales comerciales premium en Cancún
          </div>
          <div style={{ fontSize: 24, color: 'rgba(255,255,255,0.65)', fontWeight: 300 }}>
            Long Island · Gardens · Tulum · Marina · Huayacán
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.55)' }}>
            Un desarrollo de Tresor Real Estate
          </div>
          <div
            style={{
              fontSize: 16,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: '#FAB413',
              fontWeight: 700,
            }}
          >
            quattroplaza.mx
          </div>
        </div>
      </div>
    ),
    size,
  );
}
