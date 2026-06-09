import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Building2, Layers, MapPin } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { getActivePlazasAsync, getPlazaBySlugAsync, getMinAvailablePrice } from '@/lib/data';
import { formatMXN } from '@/lib/utils';
import MasterPlan from '@/components/MasterPlan';
import Gallery from '@/components/Gallery';
import FloorPlans from '@/components/FloorPlans';
import LocationMap from '@/components/LocationMap';
import QuoteWizard from '@/components/QuoteWizard';

export async function generateStaticParams() {
  const plazas = await getActivePlazasAsync();
  return plazas.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const plaza = await getPlazaBySlugAsync(slug);
  if (!plaza) return {};

  const isEs = locale === 'es';
  const minPrice = getMinAvailablePrice(plaza);
  const fromText = minPrice ? ` desde ${formatMXN(minPrice)}` : '';

  // Usa campos SEO del Studio si existen, si no genera automáticamente
  const title = isEs
    ? (plaza.seoTitle ?? `${plaza.name} — Locales en Venta Cancún`)
    : (plaza.seoTitleEn ?? `${plaza.nameEn ?? plaza.name} — Commercial Units Cancún`);

  const description = isEs
    ? (plaza.seoDescription ?? `${plaza.tagline}. Plaza comercial premium en ${plaza.city}. ${plaza.availableUnits ?? '+10'} locales disponibles${fromText}. Entrega ${plaza.deliveryWindow}. Por Tresor Real Estate.`)
    : (plaza.seoDescriptionEn ?? `${plaza.taglineEn ?? plaza.tagline}. Premium commercial plaza in ${plaza.city}. ${plaza.availableUnits ?? '+10'} units available${fromText}. By Tresor Real Estate.`);

  const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://quattroplaza.mx';

  return {
    title,
    description,
    alternates: {
      canonical: `/plazas/${plaza.slug}`,
      languages: {
        'es':        `${SITE}/plazas/${plaza.slug}`,
        'en':        `${SITE}/en/plazas/${plaza.slug}`,
        'x-default': `${SITE}/plazas/${plaza.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      images: plaza.heroRender
        ? [{ url: plaza.heroRender, width: 1600, height: 900, alt: plaza.name }]
        : [{ url: '/og/home.jpg', width: 1200, height: 630, alt: plaza.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [plaza.heroRender ?? '/og/home.jpg'],
    },
  };
}

export default async function PlazaPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  const plaza = await getPlazaBySlugAsync(slug);
  if (!plaza || plaza.comingSoon) notFound();

  const t = await getTranslations('plaza');
  const isEs = locale !== 'en';

  const minPrice = getMinAvailablePrice(plaza);

  // Usa imágenes de Sanity si existen, si no cae al fallback local
  const galleryImages = plaza.gallery?.length
    ? plaza.gallery.filter(Boolean)
    : plaza.slug === 'long-island'
      ? Array.from({ length: 8 }, (_, i) => `/renders/long-island/0${i + 1}.jpg`)
      : Array.from({ length: 6 }, (_, i) => `/renders/gardens/0${i + 1}.jpg`);

  // JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: plaza.name,
    description: plaza.tagline,
    image: `https://quattroplaza.mx${plaza.heroRender}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: plaza.city,
      addressRegion: plaza.state,
      addressCountry: 'MX',
    },
    geo: plaza.location
      ? { '@type': 'GeoCoordinates', latitude: plaza.location.lat, longitude: plaza.location.lng }
      : undefined,
    parentOrganization: { '@type': 'Organization', name: 'Tresor Real Estate' },
    priceRange: minPrice ? `${formatMXN(minPrice)} +` : undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ═════ HERO — logo centrado ═════ */}
      <section className="relative -mt-[72px] overflow-hidden bg-bg-deep text-bg" style={{ height: 'calc(100svh - 104px - 72px)', minHeight: '480px' }}>
        <div className="absolute inset-0 animate-hero-zoom">
          <Image src={plaza.heroRender} alt={plaza.name} fill priority sizes="100vw" className="object-cover scale-105" />
        </div>
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 flex h-full items-center justify-center pt-[72px]">
          {plaza.logoWhite ? (
            <Image
              src={plaza.logoWhite}
              alt={plaza.shortName}
              width={800}
              height={280}
              className="w-auto drop-shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
              style={{ height: 'clamp(140px, 26vh, 260px)' }}
              priority
            />
          ) : (
            <h1 className="h-display text-center text-[clamp(56px,10vw,160px)] text-white">{plaza.shortName}</h1>
          )}
        </div>
      </section>

      {/* ═════ QUICKFACTS — strip compacto ═════ */}
      <section className="overflow-hidden" style={{ background: 'linear-gradient(135deg, #f7f7f7 0%, #f0f0ef 50%, #f5f5f4 100%)' }}>
        <div className="container-wrap relative w-full">
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ minHeight: '104px' }}>
            {/* Primeros 3 highlights del CMS */}
            {plaza.highlights?.slice(0, 3).map((h, idx) => (
              <div
                key={h.label}
                className={[
                  'flex flex-col justify-center px-5 py-5 md:py-0',
                  idx % 2 === 1 ? 'border-l' : '',
                  idx > 0 ? 'md:border-l' : '',
                  idx >= 2 ? 'border-t md:border-t-0' : '',
                ].join(' ')}
                style={{ borderColor: '#e2e2e1' }}
              >
                <div className="truncate text-[clamp(17px,1.4vw,20px)] font-normal leading-tight tracking-tight">
                  {h.value}
                </div>
                <div className="mt-1.5 truncate text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3">
                  {isEs ? h.label : (h.labelEn ?? h.label)}
                </div>
              </div>
            ))}

            {/* 4ª columna — Precio base (fondo amarillo, sangra al borde en desktop) */}
            <div className="relative flex flex-col justify-center px-5 py-5 border-t md:border-t-0 md:py-0"
                 style={{ borderColor: '#e2e2e1' }}>
              {/* bg mobile: solo la celda */}
              <div className="absolute inset-0 md:hidden" style={{ background: '#FFD057' }} />
              {/* bg desktop: sangra hasta el borde derecho */}
              <div className="absolute inset-0 hidden md:block"
                   style={{ background: '#FFD057', right: 'calc(-1 * max(24px, 5vw))' }} />
              <div className="relative z-10">
                <div className="text-[clamp(17px,1.4vw,20px)] font-extrabold leading-tight tracking-tight text-ink">
                  {minPrice ? `${formatMXN(minPrice)} MXN` : '—'}
                </div>
                <div className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink/70">
                  Precio base + IVA
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═════ 1. EL PROYECTO ═════ */}
      <section className="py-20 md:py-28">
        <div className="container-wrap grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-20">
          <div>
            <span className="eyebrow eyebrow-accent block">{t('projectEyebrow')}</span>
            <h2 className="mt-5 h-display text-[clamp(34px,4vw,56px)]">
              {isEs ? (plaza.projectTitle ?? t('projectTitle')) : (plaza.projectTitleEn ?? plaza.projectTitle ?? t('projectTitle'))}
            </h2>
          </div>
          <div className="text-[17px] font-light leading-[1.7] text-ink-2">
            <p>
              {plaza.shortName} {isEs ? (plaza.projectBody1 ?? t('projectBody1')) : (plaza.projectBody1En ?? plaza.projectBody1 ?? t('projectBody1'))}
            </p>
            <p className="mt-4">
              {isEs ? (plaza.projectBody2 ?? t('projectBody2')) : (plaza.projectBody2En ?? plaza.projectBody2 ?? t('projectBody2'))}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="#master-plan" className="btn btn-outline font-semibold">
                {t('viewAvailability')}
              </Link>
              <Link href={`/cotizar/${plaza.slug}`} className="btn btn-primary font-semibold">
                {t('quoteUnit')}
                <ArrowRight size={14} strokeWidth={1.6} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═════ 2. UBICACIÓN ═════ */}
      <section className="border-t border-line py-20 md:py-28">
        <div className="container-wrap grid gap-10 md:grid-cols-[1fr_1.6fr] md:gap-16">
          <div>
            <span className="eyebrow eyebrow-accent">{t('locationEyebrow')}</span>
            <h2 className="mt-5 h-display text-[clamp(32px,3.5vw,48px)]">{t('locationTitle')}</h2>
            <p className="mt-4 text-[15px] font-light leading-relaxed text-ink-3">
              {plaza.location?.address ?? `${plaza.city}, ${plaza.state}`}
            </p>
            <div className="mt-8 space-y-3 border-t border-line pt-6">
              <Bullet icon={<Building2 size={16} strokeWidth={1.5} />} text={isEs ? (plaza.bullet1 ?? t('bullet1')) : (plaza.bullet1En ?? plaza.bullet1 ?? t('bullet1'))} />
              <Bullet icon={<Layers size={16} strokeWidth={1.5} />} text={isEs ? (plaza.bullet2 ?? t('bullet2')) : (plaza.bullet2En ?? plaza.bullet2 ?? t('bullet2'))} />
              <Bullet icon={<MapPin size={16} strokeWidth={1.5} />} text={isEs ? (plaza.bullet3 ?? t('bullet3')) : (plaza.bullet3En ?? plaza.bullet3 ?? t('bullet3'))} />
            </div>
          </div>
          <div>
            {plaza.location ? (
              <LocationMap
                lat={plaza.location.lat}
                lng={plaza.location.lng}
                address={plaza.location.address}
              />
            ) : (
              <div className="flex h-[400px] items-center justify-center rounded-[18px] border border-line bg-bg-soft text-ink-3">
                <MapPin size={32} strokeWidth={1.2} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═════ 3. GALERÍA ═════ */}
      <Gallery images={galleryImages} alt={plaza.shortName} />

      {/* ═════ 4. FLOOR PLANS ═════ */}
      <FloorPlans plaza={plaza} floorPlansDesc={isEs ? (plaza.floorPlansDesc ?? undefined) : (plaza.floorPlansDescEn ?? plaza.floorPlansDesc ?? undefined)} />

      {/* ═════ 5. MASTER PLAN INTERACTIVO ═════ */}
      <div id="master-plan">
        <MasterPlan plaza={plaza} />
      </div>

      {/* ═════ 6. COTIZADOR EMBEBIDO — APARTA TU LOCAL ═════ */}
      <section className="border-t border-line bg-white" id="aparta">
        <div className="container-wrap pb-0 pt-20 text-center md:pt-28">
          <span className="eyebrow eyebrow-accent">{t('apartaEyebrow')}</span>
          <h2 className="mx-auto mt-5 h-display max-w-3xl text-[clamp(34px,4.5vw,64px)]">
            {t('apartaTitle1')}<br />{t('apartaTitle2')}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] font-light text-ink-3">
            {t('apartaDesc')}
          </p>
        </div>
        <QuoteWizard plaza={plaza} />
      </section>
    </>
  );
}

function Bullet({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-line bg-white text-accent">
        {icon}
      </span>
      <span className="text-[14px] text-ink-2">{text}</span>
    </div>
  );
}
