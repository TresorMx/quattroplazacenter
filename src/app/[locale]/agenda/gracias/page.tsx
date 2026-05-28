'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, CalendarDays, MessageCircle } from 'lucide-react';

function formatDate(dateStr: string, locale: string) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(locale === 'en' ? 'en-US' : 'es-MX', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

function formatTime(t: string) {
  if (!t) return '';
  const [h] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  return `${h > 12 ? h - 12 : h}:00 ${period}`;
}

function AgendaGraciasContent() {
  const t = useTranslations('agenda');
  const sp = useSearchParams();
  const mode  = sp.get('mode') ?? 'presencial';
  const date  = sp.get('date') ?? '';
  const time  = sp.get('time') ?? '';
  const name  = sp.get('name') ?? '';
  const isZoom = mode === 'zoom';

  return (
    <main className="min-h-screen bg-bg pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line bg-bg-soft/40 pt-32 pb-20">
        <div className="container-wrap text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-ink text-bg">
            <CheckCircle2 size={28} strokeWidth={1.6} />
          </div>

          <span className="eyebrow eyebrow-accent">{t('thankEyebrow')}</span>

          <h1 className="mx-auto mt-4 max-w-3xl font-serif text-[clamp(40px,5.5vw,72px)] font-light italic leading-[1.05]">
            {name ? `¡Listo, ${name}!` : t('thankTitle', { name: '' })}<br />
            <span style={{ color: '#FAB413' }}>{t('thankHighlight')}</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-[15px] text-ink-3">{t('thankDesc')}</p>

          {/* Resumen de cita */}
          {(date || time) && (
            <div className="mx-auto mt-8 inline-flex flex-col items-center gap-2 rounded-xl border border-line bg-white px-8 py-5 sm:flex-row sm:gap-8">
              {date && (
                <div className="flex items-center gap-2 text-[13px]">
                  <CalendarDays size={15} strokeWidth={1.6} className="text-accent" />
                  <span className="font-medium capitalize">{formatDate(date, 'es')}</span>
                </div>
              )}
              {time && (
                <>
                  <span className="hidden h-4 w-px bg-line sm:block" />
                  <div className="text-[13px] font-medium">{formatTime(time)}</div>
                </>
              )}
              <span className="hidden h-4 w-px bg-line sm:block" />
              <div className="rounded-full border border-line px-3 py-1 text-[11px] font-semibold uppercase tracking-caps text-ink-3">
                {isZoom ? t('modeZoom') : t('modePresencial')}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Actions */}
      <section className="container-wrap mt-12 grid gap-5 md:grid-cols-2">
        {/* Agregar al calendario */}
        <div className="flex flex-col items-start gap-5 rounded-lg border border-line bg-white p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bg-soft">
            <CalendarDays size={20} strokeWidth={1.6} />
          </div>
          <div>
            <h3 className="font-serif text-3xl font-light italic">{t('calendarTitle')}</h3>
            <p className="mt-2 text-[14px] text-ink-3">{t('calendarDesc')}</p>
          </div>
          <span className="mt-auto inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-caps text-ink-3">
            {t('calendarPending')}
          </span>
        </div>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '529984045602'}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-start gap-5 rounded-lg p-8 text-left transition-all hover:-translate-y-1"
          style={{ background: '#FFEFC2' }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-bg">
            <MessageCircle size={20} strokeWidth={1.6} />
          </div>
          <div>
            <h3 className="font-serif text-3xl font-light italic">{t('whatsappTitle')}</h3>
            <p className="mt-2 text-[14px] text-ink-3">{t('whatsappDesc')}</p>
          </div>
          <span
            className="mt-auto inline-flex items-center gap-2 rounded-full px-5 py-3 text-[11px] font-bold uppercase tracking-caps"
            style={{ background: '#0E0E0E', color: '#fff' }}
          >
            {t('whatsappBtn')} <ArrowRight size={14} strokeWidth={1.6} />
          </span>
        </a>
      </section>

      {/* Next steps */}
      <section className="container-wrap mt-20">
        <div className="rounded-xl bg-ink p-10 text-bg md:p-16">
          <span className="eyebrow" style={{ color: '#FAB413' }}>{t('stepsEyebrow')}</span>
          <h2 className="mt-4 font-sans text-[clamp(32px,4vw,56px)] font-extralight tracking-tight">
            {t('stepsTitle')}<br />
            <span className="font-serif italic font-light" style={{ color: '#FAB413' }}>{t('stepsHighlight')}</span>
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <Step n={t('step01n')} title={t('step01t')} desc={t('step01d')} />
            <Step
              n={isZoom ? t('step02nZoom') : t('step02nPresencial')}
              title={isZoom ? t('step02tZoom') : t('step02tPresencial')}
              desc={isZoom ? t('step02dZoom') : t('step02dPresencial')}
            />
            <Step n={t('step03n')} title={t('step03t')} desc={t('step03d')} />
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <Link href="/" className="btn btn-lg" style={{ background: '#FAB413', color: '#0E0E0E' }}>
              {t('backHome')}
            </Link>
            <Link href="/plazas/long-island" className="btn btn-lg btn-ghost-light">
              {t('viewLongIsland')} <ArrowRight size={14} strokeWidth={1.6} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function Step({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <div>
      <div className="font-mono text-[11px] uppercase tracking-caps text-accent">{n}</div>
      <h4 className="mt-3 font-serif text-2xl font-light italic">{title}</h4>
      <p className="mt-2 text-[14px] leading-relaxed text-white/70">{desc}</p>
    </div>
  );
}

export default function AgendaGraciasPage() {
  return (
    <Suspense fallback={null}>
      <AgendaGraciasContent />
    </Suspense>
  );
}
