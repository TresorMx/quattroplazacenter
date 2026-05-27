import { ImageResponse } from 'next/og';
import { getPlazaBySlug, getMinAvailablePrice } from '@/lib/data';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Quattro Plaza Center';

export default async function OG({ params }: { params: { slug: string } }) {
  const plaza = getPlazaBySlug(params.slug);
  if (!plaza) return new Response('', { status: 404 });

  const minPrice = getMinAvailablePrice(plaza);
  const fromText = minPrice ? `Desde $${(minPrice / 1_000_000).toFixed(1)}M MXN` : '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0E0E0E',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 80,
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.85) 100%)`,
          }}
        />
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div
            style={{
              fontSize: 18,
              letterSpacing: 6,
              fontWeight: 700,
              color: '#FAB413',
              textTransform: 'uppercase',
            }}
          >
            — Quattro Plaza Center · {plaza.status === 'preventa' ? 'Preventa' : 'Lanzamiento'}
          </div>
          <div
            style={{
              fontSize: 96,
              fontStyle: 'italic',
              fontWeight: 300,
              lineHeight: 1,
              letterSpacing: -2,
            }}
          >
            {plaza.shortName}
          </div>
          <div style={{ fontSize: 24, color: 'rgba(255,255,255,0.8)', fontWeight: 300, maxWidth: 800 }}>
            {plaza.tagline}.
          </div>
          {fromText && (
            <div style={{ marginTop: 12, fontSize: 28, color: '#FAB413', fontWeight: 600 }}>
              {fromText}
            </div>
          )}
        </div>
      </div>
    ),
    size,
  );
}
