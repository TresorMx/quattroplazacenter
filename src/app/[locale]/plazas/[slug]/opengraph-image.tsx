import { ImageResponse } from 'next/og';
import { getPlazaBySlugAsync, getMinAvailablePrice } from '@/lib/data';
import { formatMXN } from '@/lib/utils';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Quattro Plaza Center';

export default async function OG({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const plaza = await getPlazaBySlugAsync(slug);
  if (!plaza) return new Response('', { status: 404 });

  const isEs = locale !== 'en';
  const name    = isEs ? plaza.name    : (plaza.nameEn    ?? plaza.name);
  const tagline = isEs ? plaza.tagline : (plaza.taglineEn ?? plaza.tagline);
  const minPrice = getMinAvailablePrice(plaza);
  const priceText = minPrice ? `Desde ${formatMXN(minPrice)} MXN` : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          background: '#16151C',
          position: 'relative',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Hero background from Sanity CDN */}
        {plaza.heroRender && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={plaza.heroRender}
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.45,
            }}
          />
        )}

        {/* Gradient overlay — bottom heavy */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(10,9,15,0.96) 0%, rgba(10,9,15,0.55) 50%, rgba(10,9,15,0.15) 100%)',
            display: 'flex',
          }}
        />

        {/* Top-right: brand */}
        <div
          style={{
            position: 'absolute',
            top: 48,
            right: 64,
            display: 'flex',
            color: 'rgba(255,255,255,0.55)',
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          TRESOR REAL ESTATE
        </div>

        {/* Top-left: status pill */}
        <div
          style={{
            position: 'absolute',
            top: 48,
            left: 72,
            display: 'flex',
          }}
        >
          <div
            style={{
              background: 'rgba(255,208,87,0.15)',
              border: '1px solid rgba(255,208,87,0.4)',
              borderRadius: 100,
              padding: '6px 18px',
              fontSize: 12,
              fontWeight: 700,
              color: '#FFD057',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              display: 'flex',
            }}
          >
            {plaza.status === 'preventa' ? 'Preventa' : plaza.status === 'lanzamiento' ? 'Lanzamiento' : plaza.status}
            {plaza.deliveryWindow ? ` · Entrega ${plaza.deliveryWindow}` : ''}
          </div>
        </div>

        {/* Bottom content */}
        <div
          style={{
            position: 'absolute',
            bottom: 56,
            left: 72,
            right: 200,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {/* Location */}
          <div style={{ display: 'flex' }}>
            <div
              style={{
                background: '#FFD057',
                borderRadius: 100,
                padding: '6px 18px',
                fontSize: 13,
                fontWeight: 700,
                color: '#16151C',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                display: 'flex',
              }}
            >
              {plaza.city} · {plaza.state}
            </div>
          </div>

          {/* Plaza name */}
          <div
            style={{
              fontSize: 78,
              fontWeight: 300,
              color: '#FFFFFF',
              lineHeight: 1.0,
              display: 'flex',
              letterSpacing: '-0.02em',
            }}
          >
            {name}
          </div>

          {/* Tagline */}
          {tagline && (
            <div
              style={{
                fontSize: 21,
                color: 'rgba(255,255,255,0.6)',
                fontWeight: 300,
                display: 'flex',
              }}
            >
              {tagline}
            </div>
          )}
        </div>

        {/* Bottom-right: price */}
        {priceText && (
          <div
            style={{
              position: 'absolute',
              bottom: 56,
              right: 64,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: 4,
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: 'rgba(255,255,255,0.4)',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                display: 'flex',
              }}
            >
              Precio base
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: '#FFD057',
                display: 'flex',
              }}
            >
              {priceText}
            </div>
          </div>
        )}
      </div>
    ),
    size,
  );
}
