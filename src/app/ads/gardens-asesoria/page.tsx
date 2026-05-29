'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, MapPin, TrendingUp, Building2, ShieldCheck, Users } from 'lucide-react';

const RENDERS = [
  '/renders/gardens/02.jpg',
  '/renders/gardens/01.jpg',
  '/renders/gardens/03.jpg',
  '/renders/gardens/04.jpg',
  '/renders/gardens/05.jpg',
  '/renders/gardens/06.jpg',
];

const FEATURES = [
  { icon: MapPin,      title: 'Ubicación privilegiada',   desc: 'Corredor comercial de alto tráfico en Cancún, rodeado de zonas residenciales de alta demanda.' },
  { icon: TrendingUp,  title: 'Alta plusvalía',           desc: 'Zona con crecimiento sostenido. Ideal como inversión a largo plazo o negocio propio.' },
  { icon: Building2,   title: 'Diseño premium',           desc: 'Arquitectura contemporánea, acabados de primera, espacios flexibles para cualquier giro comercial.' },
  { icon: ShieldCheck, title: 'Desarrollador respaldado', desc: 'Tresor Real Estate — trayectoria comprobada en desarrollos residenciales y comerciales.' },
];

const STEPS = [
  { n: '01', title: 'Llena el formulario',  desc: 'Comparte tus datos en menos de 30 segundos.' },
  { n: '02', title: 'Asesor te contacta',   desc: 'Un experto te llama o escribe en menos de 2 horas.' },
  { n: '03', title: 'Agenda tu visita',     desc: 'Presencial o por Zoom, sin compromisos.' },
];

export default function GardensLandingAsesoria() {
  const [activeImg, setActiveImg] = useState(0);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', uso: '' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const valid = form.firstName && form.lastName && form.email && form.phone && form.uso;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch('/api/ads-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, variant: 'asesoria' }),
      });
      if (!res.ok) throw new Error('Error');
      window.location.href = `/ads/gracias?name=${encodeURIComponent(form.firstName)}&variant=asesoria`;
    } catch {
      setErr('Hubo un problema. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-bg text-ink">

      {/* ── Nav bar ── */}
      <header className="sticky top-0 z-40 border-b border-line bg-white/95 px-6 py-4 backdrop-blur-sm">
        <div className="flex justify-center">
          <Image src="/logos/logo-quattro.svg" alt="Quattro Plaza Center" width={186} height={54} style={{ height: '47px', width: 'auto' }} />
        </div>
      </header>

      {/* ── Hero + Form ── */}
      <section className="relative overflow-hidden flex items-center" style={{ minHeight: '100svh' }}>
        {/* BG image */}
        <div className="absolute inset-0">
          <Image
            src={RENDERS[0]}
            alt="Quattro Plaza Gardens"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/[0.69]" />
        </div>

        <div className="relative z-10 w-full container-wrap grid items-center gap-10 py-16 md:grid-cols-[1fr_420px] md:py-24">
          {/* Left — copy */}
          <div className="text-white">
            <span className="inline-block rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/80 backdrop-blur-sm">
              Locales Comerciales en Venta Cancún
            </span>
            <h1 className="mt-5 font-serif text-[clamp(36px,5vw,72px)] font-light italic leading-[1.05]">
              Quattro Plaza<br />
              <span className="text-[#FAB413]">Gardens</span>
            </h1>
            <p className="mt-5 max-w-md font-light leading-relaxed text-white/80" style={{ fontSize: '17px' }}>
              Habla con un asesor especializado y encuentra el local perfecto para tu inversión o negocio en Cancún.
              Sin compromisos, sin costo.
            </p>
            <ul className="mt-7 space-y-2.5">
              {[
                'Desde $1,968,600 MXN · Preventa exclusiva',
                'Asesoría personalizada sin costo',
                'Visita presencial o por Zoom',
                'Respuesta en menos de 2 horas',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-white/90" style={{ fontSize: '15px' }}>
                  <CheckCircle2 size={16} className="shrink-0 text-[#FAB413]" strokeWidth={1.5} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — form card */}
          <div className="rounded-2xl bg-white p-8 shadow-2xl">
            <div className="mb-6">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FAB413] text-ink">
                  <Users size={16} strokeWidth={1.5} />
                </div>
                <div className="font-serif text-[22px] font-light italic leading-tight text-ink">
                  Asesoría sin Costo
                </div>
              </div>
              <p className="mt-2 text-[12px] text-ink-3">
                Un experto te contacta en menos de 2 horas
              </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <label className="field">
                  <span className="field-label">Nombre *</span>
                  <input required type="text" className="field-input" placeholder="Tu nombre"
                    value={form.firstName} onChange={(e) => set('firstName', e.target.value)} />
                </label>
                <label className="field">
                  <span className="field-label">Apellido *</span>
                  <input required type="text" className="field-input" placeholder="Tu apellido"
                    value={form.lastName} onChange={(e) => set('lastName', e.target.value)} />
                </label>
              </div>
              <label className="field">
                <span className="field-label">Email *</span>
                <input required type="email" className="field-input" placeholder="tu@correo.com"
                  value={form.email} onChange={(e) => set('email', e.target.value)} />
              </label>
              <label className="field">
                <span className="field-label">Teléfono *</span>
                <input required type="tel" className="field-input" placeholder="+52 998 404 5602"
                  value={form.phone} onChange={(e) => set('phone', e.target.value)} />
              </label>

              {/* Uso */}
              <div>
                <span className="field-label block mb-2">¿Para qué lo buscas? *</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { v: 'inversion', label: '💰 Inversión' },
                    { v: 'negocio',   label: '🏪 Negocio Propio' },
                  ].map(({ v, label }) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => set('uso', v)}
                      className={`rounded-lg border py-2.5 text-[12px] font-semibold transition-all ${
                        form.uso === v
                          ? 'border-ink bg-ink text-white'
                          : 'border-line bg-bg text-ink-3 hover:border-ink-3'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {err && <p className="rounded bg-red-50 px-3 py-2 text-[12px] text-red-700">{err}</p>}

              <button
                type="submit"
                disabled={!valid || loading}
                className="btn btn-lg mt-1 w-full disabled:opacity-40"
                style={{ background: '#0E0E0E', color: '#fff', fontWeight: 700 }}
              >
                {loading ? 'Enviando…' : 'Solicitar Asesoría sin Costo'}
                {!loading && <ArrowRight size={14} strokeWidth={1.5} />}
              </button>
              <p className="text-center text-[10.5px] text-ink-3">
                Tus datos están seguros. Sin spam.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-white py-16">
        <div className="container-wrap">
          <div className="mb-10 text-center">
            <span className="eyebrow eyebrow-accent">— Proceso</span>
            <h2 className="mt-3 font-serif text-[clamp(28px,3vw,44px)] font-light italic">
              Así de sencillo
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {STEPS.map(({ n, title, desc }) => (
              <div key={n} className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FAB413] font-mono text-[13px] font-bold text-ink">
                  {n}
                </div>
                <h3 className="mt-4 font-serif text-xl font-light italic">{title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-3">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery ── */}
      <section className="bg-bg py-16">
        <div className="container-wrap">
          <div className="mb-8 text-center">
            <span className="eyebrow eyebrow-accent">— El Proyecto</span>
            <h2 className="mt-3 font-serif text-[clamp(28px,3vw,44px)] font-light italic">
              Descubre Quattro Plaza
            </h2>
          </div>
          <div className="relative mb-3 aspect-[16/9] w-full overflow-hidden rounded-xl">
            <Image
              src={RENDERS[activeImg]}
              alt={`Quattro Plaza Gardens render ${activeImg + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 80vw"
              className="object-cover transition-all duration-500"
            />
          </div>
          <div className="grid grid-cols-6 gap-2">
            {RENDERS.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                  activeImg === i ? 'border-ink' : 'border-transparent opacity-60 hover:opacity-90'
                }`}
              >
                <Image src={src} alt="" fill sizes="15vw" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-white py-16 md:py-20">
        <div className="container-wrap">
          <div className="mb-10 text-center">
            <span className="eyebrow eyebrow-accent">— Por qué Gardens</span>
            <h2 className="mt-3 font-serif text-[clamp(28px,3vw,44px)] font-light italic">
              Una inversión que trabaja por ti
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-xl border border-line bg-bg p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bg-soft text-ink">
                  <Icon size={22} strokeWidth={1.5} />
                </div>
                <h3 className="mt-5 font-serif text-xl font-light italic">{title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-3">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="border-t border-line bg-ink py-16 text-white">
        <div className="container-wrap text-center">
          <h2 className="font-serif text-[clamp(28px,3vw,44px)] font-light italic">
            Da el primer paso hoy
          </h2>
          <p className="mt-3 text-[14px] text-white/60">
            Habla directo con un asesor o escríbenos por WhatsApp
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="inline-flex items-center gap-2 rounded-full bg-[#FAB413] px-6 py-3 text-[12px] font-bold uppercase tracking-widest text-ink"
            >
              Solicitar Asesoría <ArrowRight size={14} strokeWidth={1.5} />
            </a>
            <a
              href="https://wa.me/529984045602?text=Hola+quiero+más+información+de+Quattro+Plaza+Center+Gardens!"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-[12px] font-bold uppercase tracking-widest text-white"
            >
              Hablar por WhatsApp
            </a>
          </div>
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
