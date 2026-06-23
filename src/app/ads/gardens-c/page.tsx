'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, Clock, Users, TrendingUp, Star } from 'lucide-react';

const HERO_IMG = '/renders/gardens/02.jpg';
const GALLERY = [
  '/renders/gardens/01.jpg',
  '/renders/gardens/03.jpg',
  '/renders/gardens/04.jpg',
  '/renders/gardens/05.jpg',
  '/renders/gardens/06.jpg',
];

const STATS = [
  { value: 'Desde 25 m²', label: 'Locales disponibles' },
  { value: '$1.96 MDP', label: 'Precio desde' },
  { value: '2026', label: 'Entrega estimada' },
];

const BULLETS = [
  'Zona de alto tráfico residencial — miles de familias cerca',
  'Enganche desde 10% · mensualidades sin intereses',
  'Arquitectura premium · doble altura · vegetación integrada',
  'Locales listos para abrir desde el primer día',
];

const TRUST = [
  { n: '+25', label: 'proyectos\nentregados' },
  { n: '+2,000', label: 'casas y depart.\ndesarrollados' },
  { n: '10+', label: 'años en el\nmercado' },
  { n: '100%', label: 'apartado\nreembolsable' },
];

export default function GardensCPage() {
  const [form, setForm] = useState({ firstName: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState('');
  const formRef = useRef<HTMLDivElement>(null);

  const valid = form.firstName.trim() && form.phone.trim();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    setErr('');
    setLoading(true);
    try {
      const res = await fetch('/api/ads-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, lastName: '', email: '', uso: 'visita', variant: 'gardens-c' }),
      });
      if (!res.ok) throw new Error();
      if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
        window.fbq('track', 'Lead', { content_name: 'Visita Gardens C', content_category: 'gardens' });
      }
      setDone(true);
    } catch {
      setErr('Hubo un problema. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return (
    <main className="min-h-screen bg-white text-ink">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/95 px-6 py-4 backdrop-blur-sm">
        <div className="flex items-center justify-between container-wrap">
          <Image src="/logos/LogoQuattro.svg" alt="Quattro Plaza Center" width={160} height={48} style={{ height: '36px', width: 'auto', filter: 'brightness(0) invert(1)' }} />
          <button
            onClick={scrollToForm}
            className="rounded-full bg-accent px-5 py-2.5 text-[11px] font-bold uppercase tracking-caps text-ink transition hover:brightness-95"
          >
            Agenda visita
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden">
        <Image src={HERO_IMG} alt="Quattro Plaza Gardens" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />

        <div className="relative z-10 w-full container-wrap grid gap-10 py-20 md:grid-cols-[1fr_400px] md:items-center">

          {/* Copy */}
          <div className="text-white">
            {/* Urgency badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/15 px-4 py-1.5 text-[11px] font-bold uppercase tracking-eyebrow text-accent backdrop-blur">
              <Clock size={11} /> Lanzamiento · Unidades limitadas
            </div>

            <h1 className="font-serif text-[clamp(40px,5.5vw,78px)] font-light italic leading-[1.05]">
              Tu local propio<br />en <span className="text-accent">Cancún</span>
            </h1>
            <p className="mt-5 max-w-lg text-[17px] font-light leading-relaxed text-white/80">
              Quattro Plaza Gardens — locales comerciales premium en una de las zonas de mayor crecimiento de Cancún. Invierte o instala tu negocio con planes accesibles.
            </p>

            <ul className="mt-7 space-y-3">
              {BULLETS.map((b) => (
                <li key={b} className="flex items-start gap-3 text-[15px] text-white/85">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-accent" strokeWidth={1.6} />
                  {b}
                </li>
              ))}
            </ul>

            {/* Stats strip */}
            <div className="mt-8 flex flex-wrap gap-6">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="text-[22px] font-bold text-accent">{s.value}</div>
                  <div className="text-[11px] uppercase tracking-wide text-white/50">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Form card */}
          <div ref={formRef} className="rounded-2xl bg-white p-8 shadow-[0_24px_64px_rgba(0,0,0,0.35)]">
            {!done ? (
              <>
                <div className="mb-1 flex items-center gap-2">
                  <Star size={14} className="text-accent" fill="#FAB413" />
                  <Star size={14} className="text-accent" fill="#FAB413" />
                  <Star size={14} className="text-accent" fill="#FAB413" />
                  <Star size={14} className="text-accent" fill="#FAB413" />
                  <Star size={14} className="text-accent" fill="#FAB413" />
                  <span className="text-[11px] text-ink-2">+25 proyectos entregados</span>
                </div>
                <h2 className="mt-3 font-serif text-[26px] font-light italic leading-tight text-ink">
                  Agenda tu visita<br />
                  <span className="text-accent">sin compromiso</span>
                </h2>
                <p className="mt-2 text-[13px] text-ink-2">
                  Un asesor te contacta en menos de 2 horas con disponibilidad y precios actualizados.
                </p>

                <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-medium text-ink/60">Nombre *</label>
                    <input
                      required
                      type="text"
                      placeholder="Tu nombre"
                      value={form.firstName}
                      onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                      className="rounded-lg border border-line bg-bg-soft px-3.5 py-3 text-[14px] outline-none transition focus:border-ink"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-medium text-ink/60">Teléfono *</label>
                    <input
                      required
                      type="tel"
                      placeholder="+52 998 000 0000"
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      className="rounded-lg border border-line bg-bg-soft px-3.5 py-3 text-[14px] outline-none transition focus:border-ink"
                    />
                  </div>

                  {err && <p className="rounded-lg bg-red-50 px-3 py-2 text-[12px] text-red-600">{err}</p>}

                  <button
                    type="submit"
                    disabled={!valid || loading}
                    className="mt-1 flex w-full items-center justify-center gap-2.5 rounded-full py-4 text-[13px] font-bold uppercase tracking-caps transition disabled:opacity-40"
                    style={{ background: '#FAB413', color: '#0E0E0E' }}
                  >
                    {loading ? 'Un momento…' : <>Quiero agendar mi visita <ArrowRight size={14} strokeWidth={2} /></>}
                  </button>
                  <p className="text-center text-[11px] text-ink-3">
                    Sin spam · Tu información está segura
                  </p>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center gap-4 py-6 text-center">
                <CheckCircle2 size={52} className="text-accent" strokeWidth={1.5} />
                <h3 className="font-serif text-[24px] font-light italic text-ink">
                  ¡Gracias, {form.firstName}!
                </h3>
                <p className="text-[14px] leading-relaxed text-ink-2">
                  Un asesor te contactará en menos de 2 horas para confirmar tu visita.
                </p>
                <a
                  href="https://wa.me/529984045602?text=Hola!+Acabo+de+registrarme+para+una+visita+a+Quattro+Plaza+Gardens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-6 py-3 text-[12px] font-bold uppercase tracking-caps text-white"
                >
                  También escríbenos por WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <section className="border-y border-line bg-bg-soft py-10">
        <div className="container-wrap">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {TRUST.map((t) => (
              <div key={t.label} className="flex flex-col items-center text-center">
                <span className="text-[32px] font-bold text-ink">{t.n}</span>
                <span className="mt-1 whitespace-pre-line text-[11px] uppercase tracking-wide text-ink-3">{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery ── */}
      <section className="py-16">
        <div className="container-wrap">
          <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-eyebrow text-accent">— El proyecto</p>
          <h2 className="mb-10 text-center font-serif text-[36px] font-light italic text-ink">
            Quattro Plaza Gardens
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {GALLERY.map((src, i) => (
              <div
                key={i}
                className={`relative overflow-hidden rounded-xl ${i === 0 ? 'sm:col-span-2 md:col-span-2 aspect-[16/9]' : 'aspect-square'}`}
              >
                <Image src={src} alt={`Render ${i + 1}`} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover transition-transform duration-500 hover:scale-105" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Por qué Gardens ── */}
      <section className="bg-ink py-16 text-white">
        <div className="container-wrap">
          <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-eyebrow text-accent">— Por qué invertir</p>
          <h2 className="mb-12 text-center font-serif text-[36px] font-light italic">
            Una plaza que trabaja<br />por tu negocio
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {[
              { icon: Users,     title: 'Alto tráfico garantizado',  desc: 'Miles de familias residentes a menos de 5 minutos. Flujo vehicular y peatonal validado.' },
              { icon: TrendingUp, title: 'Plusvalía comprobada',     desc: 'Zona con crecimiento sostenido año tras año. Ideal como inversión a mediano y largo plazo.' },
              { icon: CheckCircle2, title: 'Entrega llave en mano',  desc: 'Instalaciones eléctricas, hidráulicas y sanitarias listas. Tu local listo para abrir desde el día uno.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-xl border border-white/10 bg-white/5 p-7">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-accent/15">
                  <Icon size={20} className="text-accent" strokeWidth={1.5} />
                </div>
                <h3 className="mb-2 text-[18px] font-semibold text-white">{title}</h3>
                <p className="text-[13px] leading-relaxed text-white/60">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-accent py-16 text-center">
        <div className="container-wrap">
          <h2 className="font-serif text-[clamp(28px,4vw,48px)] font-light italic text-ink">
            ¿Listo para ver tu próximo local?
          </h2>
          <p className="mt-3 text-[15px] text-ink/70">Locales disponibles · Preventa exclusiva · Cancún</p>
          <button
            onClick={scrollToForm}
            className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-ink px-8 py-4 text-[13px] font-bold uppercase tracking-caps text-white transition hover:bg-ink/90"
          >
            Agenda mi visita ahora <ArrowRight size={14} strokeWidth={2} />
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-bg-deep py-8 text-center text-[11px] text-white/40">
        <p>© {new Date().getFullYear()} Tresor Real Estate · Quattro Plaza Center Gardens · Cancún, Q.R.</p>
        <p className="mt-1">hello@tresor.mx · +52 998 404 5602</p>
      </footer>

    </main>
  );
}
