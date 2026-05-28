'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

function GraciasContent() {
  const params = useSearchParams();
  const name = params.get('name') ?? '';
  const variant = params.get('variant') ?? 'brochure';

  const isBrochure = variant === 'brochure';

  return (
    <main className="min-h-screen bg-bg text-ink">

      {/* Nav */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-white/95 px-6 py-4 backdrop-blur-sm">
        <Image src="/logos/logo-quattro.svg" alt="Quattro Plaza Center" width={110} height={32} className="h-7 w-auto" />
        <a href="tel:+529984045602" className="hidden text-[12px] font-semibold text-ink-3 hover:text-ink md:block">
          +52 998 404 5602
        </a>
      </header>

      {/* Confirmation strip */}
      <section className="border-b border-line bg-white py-14">
        <div className="container-wrap max-w-2xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FAB413]/20">
            <CheckCircle2 size={32} className="text-[#FAB413]" strokeWidth={1.8} />
          </div>
          <h1 className="mt-6 font-serif text-[clamp(30px,4vw,52px)] font-light italic leading-tight">
            {name ? `¡Gracias, ${name}!` : '¡Gracias!'}
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-3">
            {isBrochure
              ? 'Tu brochure se está descargando. Un asesor de Quattro Plaza se pondrá en contacto contigo muy pronto.'
              : 'Hemos recibido tu solicitud. Un asesor especializado te contactará en menos de 2 horas.'}
          </p>
          {isBrochure && (
            <a
              href="/brochures/gardens-brochure.pdf"
              download="Quattro-Plaza-Gardens-Brochure.pdf"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[12px] font-bold uppercase tracking-widest text-white"
            >
              Descargar de nuevo
            </a>
          )}
        </div>
      </section>

      {/* Calendar */}
      <section className="py-14">
        <div className="container-wrap max-w-3xl">
          <div className="mb-8 text-center">
            <span className="eyebrow eyebrow-accent">— Siguiente paso</span>
            <h2 className="mt-3 font-serif text-[clamp(26px,3vw,40px)] font-light italic">
              Agenda una visita con tu asesor
            </h2>
            <p className="mt-2 text-[14px] text-ink-3">
              Selecciona el día y hora que mejor te convenga — presencial o por Zoom, sin costo.
            </p>
          </div>

          {/* GHL Calendar embed */}
          <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
            <iframe
              src="https://api.leadconnectorhq.com/widget/booking/NFOvWvsfz00uhPm3wSDW"
              style={{ width: '100%', border: 'none', overflow: 'hidden', minHeight: '700px' }}
              scrolling="no"
              id="NFOvWvsfz00uhPm3wSDW_1780002584856"
              title="Agenda tu asesoría"
            />
          </div>
        </div>
      </section>

      {/* WhatsApp section */}
      <section className="border-t border-line bg-bg py-12 text-center">
        <p className="text-[14px] text-ink-3">¿Prefieres hablar directo?</p>
        <a
          href="https://wa.me/529984045602?text=Hola+quiero+más+información+de+Quattro+Plaza+Center+Gardens!"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-3 rounded-full bg-[#25D366] px-6 py-3 text-[13px] font-bold text-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Hablar por WhatsApp
        </a>
      </section>

      {/* Footer */}
      <footer className="bg-bg-deep py-8 text-center text-[11px] text-white/40">
        <p>© {new Date().getFullYear()} Tresor Real Estate · Quattro Plaza Center Gardens · Cancún, Q.R.</p>
        <p className="mt-1">hello@tresor.mx · +52 998 404 5602</p>
      </footer>

    </main>
  );
}

export default function GraciasPage() {
  return (
    <Suspense>
      <GraciasContent />
    </Suspense>
  );
}
