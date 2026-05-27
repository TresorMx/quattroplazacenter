'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/navigation';
import { cn } from '@/lib/utils';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  function switchLocale(next: 'es' | 'en') {
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  }

  const links = [
    { href: '/plazas/long-island', label: t('longIsland') },
    { href: '/plazas/gardens', label: t('gardens') },
  ];

  return (
    <header
      data-scrolled={scrolled}
      className={cn(
        'fixed inset-x-0 top-0 z-50 bg-white py-3 transition-shadow duration-300',
        scrolled && 'shadow-[0_8px_24px_rgba(0,0,0,0.05)]',
      )}
    >
      <div className="mx-auto flex w-[90%] items-center justify-between">
        <Link href="/" aria-label="Quattro Plaza Center" className="flex shrink-0 items-center">
          <Image
            src="/logos/logo-quattro.svg"
            alt="Quattro Plaza Center"
            width={150}
            height={69}
            priority
            className={cn(
              'w-auto transition-all duration-300 ease-in-out',
              scrolled ? 'h-14 md:h-[69px]' : 'h-16 md:h-[79px]',
            )}
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[11px] font-semibold uppercase tracking-caps text-ink transition-colors hover:text-accent"
            >
              {l.label}
            </Link>
          ))}

          <div className="inline-flex items-center gap-px rounded-full bg-bg-soft p-[3px]" role="group" aria-label="Idioma">
            {(['es', 'en'] as const).map((lng) => (
              <button
                key={lng}
                onClick={() => switchLocale(lng)}
                aria-pressed={locale === lng}
                className={cn(
                  'rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-caps transition-colors',
                  locale === lng ? 'bg-ink text-bg' : 'text-ink-3 hover:text-ink',
                )}
              >
                {lng.toUpperCase()}
              </button>
            ))}
          </div>

          <Link
            href="/agenda"
            className="inline-flex items-center gap-2.5 rounded-full bg-accent px-[22px] py-3 text-[11px] font-bold uppercase tracking-caps text-ink transition-all hover:brightness-90"
          >
            {t('scheduleVisit')}
          </Link>
        </nav>

        <button
          aria-label="Abrir menú"
          onClick={() => setOpen((v) => !v)}
          className="flex flex-col gap-[5px] p-2 md:hidden"
        >
          <span className={cn('h-px w-5 bg-ink transition-transform', open && 'translate-y-[6px] rotate-45')} />
          <span className={cn('h-px w-5 bg-ink transition-opacity', open && 'opacity-0')} />
          <span className={cn('h-px w-5 bg-ink transition-transform', open && '-translate-y-[6px] -rotate-45')} />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 top-[60px] z-40 flex flex-col bg-bg p-8 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="border-b border-line py-5 font-serif text-3xl font-light italic tracking-tight text-ink"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/agenda"
            className="mt-8 inline-flex w-fit items-center gap-2.5 rounded-full bg-accent px-6 py-3 text-[11px] font-bold uppercase tracking-caps text-ink"
          >
            {t('scheduleVisit')}
          </Link>
        </div>
      )}
    </header>
  );
}
