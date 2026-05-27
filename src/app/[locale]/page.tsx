import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { getAllPlazas } from '@/lib/data';
import PlazaCard from '@/components/PlazaCard';
import RevealOnScroll from '@/components/RevealOnScroll';

export default async function HomePage() {
  const plazas = getAllPlazas();
  const t = await getTranslations('home');

  return (
    <>
      {/* ════════════════ HERO ════════════════ */}
      <section className="relative -mt-[72px] h-[100svh] overflow-hidden bg-bg-deep text-bg">
        <div className="absolute inset-0">
          <Image
            src="/renders/long-island/WEB.jpg"
            alt="Quattro Plaza Center"
            fill
            priority
            sizes="100vw"
            className="object-cover hero-img-reveal"
          />
        </div>
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-8">
          <Image
            src="/brand/perfect-space.png"
            alt="The Perfect Space for your next business"
            width={1200}
            height={140}
            priority
            className="h-auto w-full max-w-[736px] animate-fade-up opacity-0 [animation-fill-mode:forwards]"
          />
        </div>

        {/* Scroll hint */}
        <div className="absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-3 text-[10px] uppercase tracking-eyebrow text-white/70">
          <span>{t('scrollHint')}</span>
          <span className="scroll-line h-10 w-px" />
        </div>

        {/* Bottom left — Tresor logo + The Art of Luxury Living */}
        <div className="absolute bottom-7 z-10 flex items-center gap-4" style={{ left: '5%' }}>
          <Image
            src="/logos/LogoTresor.svg"
            alt="Tresor Real Estate"
            width={100}
            height={34}
            className="h-[38px] w-auto opacity-70"
          />
          <span
            className="text-[13px] normal-case tracking-[0.16em] text-white/70"
            style={{ fontFamily: 'Javacom, var(--font-manrope), sans-serif' }}
          >
            The Art of Luxury Living
          </span>
        </div>
      </section>

      {/* ════════════════ PORTFOLIO ════════════════ */}
      <section id="plazas" className="py-20 md:py-32">
        <div className="container-wrap">
          <RevealOnScroll className="mb-14 grid items-end gap-10 md:grid-cols-[1fr_auto]">
            <div>
              <span className="eyebrow eyebrow-accent block font-bold">{t('portfolioEyebrow')}</span>
              <h2 className="mt-4 font-serif text-[clamp(28px,3.5vw,56px)] font-light italic leading-[1.05] tracking-tight">
                {t('portfolioTitle')}
              </h2>
            </div>
            <div className="hidden eyebrow font-bold text-ink-3 md:block">{t('currentLocations')}</div>
          </RevealOnScroll>

          <div className="plaza-grid-4">
            {plazas.map((plaza) => (
              <PlazaCard key={plaza.slug} plaza={plaza} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ APPROACH ════════════════ */}
      <section className="relative overflow-hidden bg-white text-ink">
        {/* Fade top y bottom para suavizar cortes de sección */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-white to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-white to-transparent" />
        {/* Background render en B&N + overlay blanco */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <Image
            src="/renders/gardens/02.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover grayscale"
          />
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(255,255,255,0.94)' }} />
        </div>
        <div className="container-wrap relative z-10 py-0">
          <div className="grid items-end gap-10 md:grid-cols-2 md:gap-16">
            <div>
              <span className="eyebrow text-accent font-bold">{t('approachEyebrow')}</span>
              <h3 className="mt-6 h-sans font-extralight text-[clamp(28px,3.5vw,56px)] text-ink">
                {t('approachTitleA')}
                <br />
                {t('approachTitleB')}<span className="font-serif italic font-light text-accent">{t('approachHighlight')}</span>
                <br />
                {t('approachTitleC')}
              </h3>
            </div>
            <p className="max-w-[48ch] text-[clamp(15px,1.2vw,18px)] font-semibold leading-[1.9] tracking-wide text-ink-2">
              {t('approachDesc')}
            </p>
          </div>

          <div className="mt-16 grid border-t border-line md:grid-cols-4">
            <Pillar n={t('p01n')} title={t('p01t')} desc={t('p01d')} />
            <Pillar n={t('p02n')} title={t('p02t')} desc={t('p02d')} />
            <Pillar n={t('p03n')} title={t('p03t')} desc={t('p03d')} />
            <Pillar n={t('p04n')} title={t('p04t')} desc={t('p04d')} />
          </div>
        </div>
      </section>

      {/* ════════════════ BROKER STRIP ════════════════ */}
      <section className="border-b border-line bg-white py-20 md:py-24">
        <div className="container-wrap">
          <div className="grid items-center gap-8 md:grid-cols-[auto_1fr_auto]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent text-ink md:mx-0">
              <CalendarDays size={20} strokeWidth={1.5} />
            </div>
            <div className="text-center md:text-left">
              <h3 className="font-serif text-[clamp(28px,3vw,44px)] font-light italic leading-tight">
                {t('brokerCtaTitle')}
              </h3>
              <p className="mt-2 text-sm text-ink-3">
                {t('brokerCtaDesc')}
              </p>
            </div>
            <Link
              href="/agenda"
              className="mx-auto inline-flex items-center gap-2.5 rounded-full bg-accent px-[22px] py-3 text-[11px] font-bold uppercase tracking-caps text-ink transition-all hover:brightness-90 md:mx-0"
            >
              {t('brokerCtaBtn')}
              <ArrowRight size={14} strokeWidth={1.6} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Pillar({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <div className="flex flex-col gap-5 border-r border-line px-7 py-9 last:border-r-0 max-md:border-r-0 max-md:border-b">
      <div className="eyebrow eyebrow-accent font-bold">{n}</div>
      <h4 className="font-serif text-[clamp(24px,2.4vw,32px)] font-light italic leading-tight tracking-tight text-ink">
        {title}
      </h4>
      <p className="text-sm font-light leading-relaxed text-ink-2">{desc}</p>
    </div>
  );
}
