'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Link } from '@/navigation';
import { Download, ArrowRight, CheckCircle2, Calendar } from 'lucide-react';
import ReserveModal from '@/components/ReserveModal';

function ThanksContent() {
  const sp = useSearchParams();
  const id = sp.get('id') ?? '';
  const reserved = sp.get('reserved') === '1';
  const [open, setOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (reserved) setShowConfetti(true);
  }, [reserved]);

  return (
    <main className="min-h-screen bg-bg pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line bg-bg-soft/40 pt-32 pb-20">
        <div className="container-wrap text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-ink text-bg">
            <CheckCircle2 size={28} strokeWidth={1.6} />
          </div>

          <span className="eyebrow eyebrow-accent">
            {reserved ? '— Apartado confirmado' : '— Cotización generada'}
          </span>

          <h1 className="mx-auto mt-4 max-w-3xl font-serif text-[clamp(40px,5.5vw,72px)] font-light italic leading-[1.05]">
            {reserved ? (
              <>
                ¡Listo, tu local está
                <br />
                <span style={{ color: '#FAB413' }}>apartado</span>!
              </>
            ) : (
              <>
                Tu cotización está
                <br />
                <span style={{ color: '#FAB413' }}>lista.</span>
              </>
            )}
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-[15px] text-ink-3">
            {reserved
              ? 'Recibirás un correo con el comprobante y los siguientes pasos legales en las próximas horas.'
              : 'Tu propuesta es válida por 7 días. Te enviamos copia a tu correo.'}
          </p>

          {id && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 font-mono text-[12px]">
              <span className="text-ink-3">Folio:</span>
              <span className="font-bold">{id}</span>
            </div>
          )}
        </div>
      </section>

      {/* Actions */}
      <section className="container-wrap mt-12 grid gap-5 md:grid-cols-2">
        {/* Descarga PDF */}
        <a
          href={`/api/quote/${encodeURIComponent(id)}/pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-start gap-5 rounded-lg border border-line bg-white p-8 transition-all hover:border-ink"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bg-soft">
            <Download size={20} strokeWidth={1.6} />
          </div>
          <div>
            <h3 className="font-serif text-3xl font-light italic">Descarga tu cotización</h3>
            <p className="mt-2 text-[14px] text-ink-3">
              PDF con la tabla completa de pagos, datos del local y términos. Compártelo con tu socio o contador.
            </p>
          </div>
          <span className="mt-auto inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-caps text-ink group-hover:text-accent">
            Abrir PDF <ArrowRight size={14} strokeWidth={1.6} />
          </span>
        </a>

        {/* Apartar */}
        {!reserved ? (
          <button
            onClick={() => setOpen(true)}
            className="group flex flex-col items-start gap-5 rounded-lg p-8 text-left transition-all hover:-translate-y-1"
            style={{ background: '#FFEFC2' }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-bg">
              <Calendar size={20} strokeWidth={1.6} />
            </div>
            <div>
              <h3 className="font-serif text-3xl font-light italic">
                Aparta tu local con $50,000 MXN
              </h3>
              <p className="mt-2 text-[14px] text-ink-3">
                100% reembolsable. Asegura el local en este momento antes de que lo apartén. Pago seguro Stripe.
              </p>
            </div>
            <span
              className="mt-auto inline-flex items-center gap-2 rounded-full px-5 py-3 text-[11px] font-bold uppercase tracking-caps"
              style={{ background: '#0E0E0E', color: '#fff' }}
            >
              Apartar ahora <ArrowRight size={14} strokeWidth={1.6} />
            </span>
          </button>
        ) : (
          <div className="flex flex-col items-start gap-5 rounded-lg border border-line bg-white p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 size={20} strokeWidth={1.6} />
            </div>
            <div>
              <h3 className="font-serif text-3xl font-light italic">Apartado confirmado</h3>
              <p className="mt-2 text-[14px] text-ink-3">
                Te contactaremos en 24h para coordinar la firma del contrato y los siguientes pasos.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Next steps */}
      <section className="container-wrap mt-20">
        <div className="rounded-xl bg-ink p-10 text-bg md:p-16">
          <span className="eyebrow" style={{ color: '#FAB413' }}>— Siguientes pasos</span>
          <h2 className="mt-4 font-sans text-[clamp(32px,4vw,56px)] font-extralight tracking-tight">
            Te acompañamos<br /><span className="font-serif italic font-light" style={{ color: '#FAB413' }}>hasta la entrega de tu llave.</span>
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <Step n="01" title="Asesoría 1-a-1" desc="Nuestro equipo te contacta hoy mismo para resolver dudas y agendar visita al sitio." />
            <Step n="02" title="Firma de contrato" desc="Una vez aceptes el plan, firmamos contrato con asesoría legal incluida." />
            <Step n="03" title="Construcción + entrega" desc="Te mantenemos actualizado del avance hasta entregarte el local listo para operar." />
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <Link href="/" className="btn btn-lg" style={{ background: '#FAB413', color: '#0E0E0E' }}>
              Volver al inicio
            </Link>
            <a href="https://wa.me/529984045602" target="_blank" rel="noopener noreferrer" className="btn btn-lg btn-ghost-light">
              Hablar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      <ReserveModal quoteId={id} open={open} onClose={() => setOpen(false)} />

      {showConfetti && <ConfettiBurst />}
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

function ConfettiBurst() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[90]">
      <style>{`
        @keyframes confetti {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .confetti-piece {
          position: absolute; top: 0; width: 8px; height: 14px;
          animation: confetti 2.6s cubic-bezier(0.16,1,0.3,1) forwards;
        }
      `}</style>
      {Array.from({ length: 60 }).map((_, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            background: i % 3 === 0 ? '#FAB413' : i % 3 === 1 ? '#0E0E0E' : '#fff',
            animationDelay: `${Math.random() * 0.6}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  );
}

export default function ThanksPage() {
  return (
    <Suspense fallback={null}>
      <ThanksContent />
    </Suspense>
  );
}
