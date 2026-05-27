import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');

  return (
    <footer className="relative overflow-hidden bg-bg-deep pt-24 text-bg">
      <div className="container-wrap">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 pb-20 md:grid-cols-[1.4fr_1fr_1fr_1.2fr] md:gap-[60px]">

          {/* Brand — full width on mobile */}
          <div className="col-span-2 text-center md:col-span-1 md:text-left">
            <Image
              src="/logos/LogoTresor.svg"
              alt="Tresor Real Estate"
              width={168}
              height={56}
              className="mb-6 mx-auto h-[67px] w-auto md:mx-0 md:h-14"
            />
            <p className="font-serif text-[22px] font-light italic leading-[1.25] text-white/95">
              We develop, we manage,<br />we are your sales partner.
            </p>
            <p className="mt-5 text-[15px] leading-snug text-white">
              <span className="block">{t('developmentBy1')}</span>
              <span className="block">{t('developmentBy2')}</span>
            </p>
          </div>

          {/* Developments */}
          <div>
            <h4 className="mb-5 text-[11px] uppercase tracking-eyebrow font-medium text-accent">
              {t('developments')}
            </h4>
            <ul className="flex flex-col gap-3 text-[13px] text-white/85 md:text-[14px]">
              <li><Link href="/plazas/long-island" className="hover:text-accent">Long Island</Link></li>
              <li><Link href="/plazas/gardens" className="hover:text-accent">Gardens</Link></li>
              <li><Link href="/#plazas" className="hover:text-accent">Tulum · Coming soon</Link></li>
              <li><Link href="/#plazas" className="hover:text-accent">Marina · Coming soon</Link></li>
              <li><Link href="/#plazas" className="hover:text-accent">Huayacán · Coming soon</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-5 text-[11px] uppercase tracking-eyebrow font-medium text-accent">
              {t('contact')}
            </h4>
            <ul className="flex flex-col gap-3 text-[13px] text-white/85 md:text-[14px]">
              <li><a href="mailto:ventas@quattroplaza.mx" className="hover:text-accent break-all">ventas@quattroplaza.mx</a></li>
              <li><a href="tel:+529980000000" className="hover:text-accent">+52 998 000 0000</a></li>
              <li className="text-white/70">Cancún, Q. Roo · México</li>
              <li><Link href="/brokers" className="hover:text-accent">{tNav('brokers')}</Link></li>
              <li><Link href="/privacidad" className="hover:text-accent">{t('privacy')}</Link></li>
            </ul>
          </div>

          {/* Broker CTA card — full width on mobile */}
          <div className="col-span-2 flex flex-col gap-4 rounded-lg border border-white/15 bg-gradient-to-br from-white/[0.04] to-transparent p-7 md:col-span-1">
            <span className="text-[11px] uppercase tracking-eyebrow font-medium text-accent">
              {t('brokerAccess')}
            </span>
            <div className="font-serif text-[26px] font-light italic leading-[1.15] text-bg">
              {t('brokerLabel')}<br />{t('brokerSub')}
            </div>
            <p className="text-[13px] leading-relaxed text-white/60">{t('brokerDesc')}</p>
            <Link
              href="/brokers"
              className="inline-flex w-fit items-center gap-2.5 rounded-full bg-accent px-[22px] py-3 text-[11px] font-bold uppercase tracking-caps text-ink transition-all hover:bg-white"
            >
              {t('brokerBtn')}
              <ArrowRight size={14} strokeWidth={1.6} />
            </Link>
          </div>

        </div>

        {/* Bottom: copyright + The Art of Luxury Living + Tresor logo */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-7 text-[11px] uppercase tracking-caps text-white/40 md:flex-row">
          <span className="whitespace-nowrap text-center text-[9px] font-semibold md:text-left md:text-[11px]">{t('rights')}</span>
          <div className="flex items-center gap-3.5">
            <span
              className="font-tresor text-[10px] normal-case tracking-[0.14em] text-white/60"
              style={{ fontFamily: 'Javacom, var(--font-manrope), sans-serif' }}
            >
              The Art of Luxury Living
            </span>
            <Image src="/logos/LogoTresor.svg" alt="Tresor Real Estate" width={108} height={36} className="h-9 w-auto" />
          </div>
        </div>
      </div>

      {/* Logo footer — el borde inferior del footer recorta el logo */}
      <div aria-hidden className="mt-12 pointer-events-none select-none" style={{ marginBottom: '-3%' }}>
        <Image src="/footerlogo.svg" alt="" width={1200} height={200} className="block w-full h-auto" />
      </div>
    </footer>
  );
}
