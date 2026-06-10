import { Link } from '@/navigation';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import type { Plaza } from '@/lib/types';
import { formatMXN, cn } from '@/lib/utils';
import { getMinAvailablePrice } from '@/lib/data';

export default async function PlazaCard({ plaza, large = false }: { plaza: Plaza; large?: boolean }) {
  const t = await getTranslations('plaza');

  const isComing = plaza.comingSoon;
  const href = isComing ? '#proximos' : `/plazas/${plaza.slug}`;

  const statusLabel =
    plaza.status === 'preventa'
      ? t('inPresale')
      : plaza.status === 'lanzamiento'
        ? t('inLaunch')
        : plaza.status === 'coming-soon'
          ? t('comingSoonLabel')
          : t('delivered');

  const minPrice = !isComing ? getMinAvailablePrice(plaza) : null;
  const availCount = !isComing ? (plaza.units ?? []).filter((u) => u.status === 'disponible').length : 0;

  return (
    <Link
      href={href}
      aria-label={plaza.name}
      className={cn(
        'group relative block overflow-hidden rounded-2xl bg-bg-deep text-bg transition-transform duration-500 ease-soft hover:-translate-y-1',
        large ? 'aspect-[2/1]' : 'aspect-square',
      )}
    >
      {/* Cover image */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={plaza.heroRender}
          alt={plaza.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className={cn(
            'object-cover transition-transform duration-700 ease-soft group-hover:scale-105',
            isComing && 'grayscale blur-sm scale-110',
          )}
        />
        {/* Gradiente: pesado abajo para el strip, suave arriba para el logo */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/25" />
      </div>

      {/* Top badge + ciudad */}
      <div className="absolute inset-x-6 top-6 z-10 flex items-center justify-between">
        <span className={cn(
          'rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-eyebrow backdrop-blur-sm',
          isComing ? 'bg-white/10 text-white/70' : 'bg-white/90 text-ink',
        )}>
          {statusLabel}
        </span>
        {!isComing && plaza.city && (
          <span className="text-[9px] font-semibold uppercase tracking-caps text-white/50">
            {plaza.city}
          </span>
        )}
      </div>

      {/* Centro: logo o nombre */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-8 text-center">
        {plaza.logoWhite ? (
          <Image
            src={plaza.logoWhite}
            alt={plaza.shortName}
            width={260}
            height={170}
            className={cn(
              'drop-shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
              isComing
                ? 'w-[180px] h-auto md:w-[210px] lg:w-[240px]'
                : 'h-[132px] w-auto md:h-[140px] lg:h-[160px]',
            )}
          />
        ) : (
          <div className={cn(
            'font-serif text-7xl font-light italic leading-none tracking-tight drop-shadow-[0_8px_32px_rgba(0,0,0,0.4)] md:text-8xl lg:text-[124px]',
            isComing ? 'text-white/50' : 'text-white',
          )}>
            {plaza.shortName}
          </div>
        )}
      </div>

      {/* Bottom strip — active cards only */}
      {!isComing && (
        <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-6 pt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="font-serif text-[26px] font-light italic leading-tight text-white">
                {plaza.shortName}
              </div>
              {minPrice && (
                <div className="mt-1 text-[10px] font-semibold uppercase tracking-caps text-accent">
                  {t('from')} {formatMXN(minPrice)}
                </div>
              )}
            </div>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/40 backdrop-blur-sm transition-all group-hover:border-white group-hover:bg-white group-hover:text-ink">
              <ArrowRight size={15} strokeWidth={1.6} />
            </span>
          </div>
        </div>
      )}
    </Link>
  );
}
