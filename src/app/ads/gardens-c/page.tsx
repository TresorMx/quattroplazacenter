'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, Clock, Users, TrendingUp, Star, Building2, Layers, MapPin } from 'lucide-react';
import LocationMap from '@/components/LocationMap';

const HERO_IMG = '/renders/gardens/02.jpg';
const GALLERY = [
  '/renders/gardens/01.jpg',
  '/renders/gardens/02.jpg',
  '/renders/gardens/03.jpg',
  '/renders/gardens/04.jpg',
  '/renders/gardens/05.jpg',
  '/renders/gardens/06.jpg',
];

const STATS = [
  { value: 'Desde 32 m²', label: 'Locales disponibles' },
  { value: '$1.96 MDP*', label: 'Precio desde' },
  { value: 'Jun–Sep 2027', label: 'Entrega estimada' },
];

const BULLETS = [
  'Zona de alto tráfico residencial — miles de familias cerca',
  'Enganche desde $147,000 MXN · mensualidades sin intereses',
  'Arquitectura premium · doble altura · vegetación integrada',
  'Locales listos para abrir desde el primer día',
];


export default function GardensCPage() {
  const [activeImg, setActiveImg] = useState(0);
  const [mapOpen, setMapOpen] = useState(false);
  const [mapHeight, setMapHeight] = useState<number | null>(null);
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
      if (typeof window !== 'undefined') {
        if (typeof window.fbq === 'function') window.fbq('track', 'Lead', { content_name: 'Visita Gardens C', content_category: 'gardens' });
        if (typeof (window as any).gtag === 'function') (window as any).gtag('event', 'conversion', { send_to: 'AW-17453917774/wazACPXDnMQcEM7M1oJB' });
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: 'Locales en Venta Cancún — Agenda tu Visita | Quattro Plaza Gardens',
    description: 'Locales en venta en Cancún desde 32 m². Agenda tu visita sin compromiso. Enganche desde $147,000 MXN. Entrega Jun–Sep 2027.',
    url: 'https://www.quattroplaza.mx/ads/gardens-c',
    image: 'https://www.quattroplaza.mx/renders/gardens/02.jpg',
    offers: {
      '@type': 'Offer',
      price: 1968600,
      priceCurrency: 'MXN',
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'Tresor Real Estate', url: 'https://tresor.mx' },
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Cancún',
      addressRegion: 'Quintana Roo',
      postalCode: '77500',
      addressCountry: 'MX',
    },
  };

  return (
    <main className="min-h-screen bg-white text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/95 px-6 py-4 backdrop-blur-sm">
        <div className="relative flex items-center justify-center container-wrap">
          <Image src="/logos/logo-quattro.svg" alt="Quattro Plaza Center" width={256} height={77} style={{ height: '58px', width: 'auto', filter: 'brightness(0) invert(1)' }} />
          <button
            onClick={scrollToForm}
            className="absolute right-0 rounded-full bg-accent px-5 py-2.5 text-[11px] font-bold uppercase tracking-caps text-ink transition hover:brightness-95"
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
              <Clock size={11} /> Locales en Venta Cancún · Unidades limitadas
            </div>

            <h1 className="font-serif text-[clamp(40px,5.5vw,78px)] font-light italic leading-[1.05]">
              Locales Comerciales<br />en Venta <span className="text-accent">Cancún</span>
            </h1>
            <p className="mt-5 max-w-lg text-[17px] font-light leading-relaxed text-white/80">
              Locales en venta en Cancún desde 32 m² en Quattro Plaza Gardens — una de las zonas de mayor crecimiento del Caribe Mexicano. Invierte o instala tu negocio con planes accesibles.
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
                <p className="mt-1 text-[11px] text-ink-3">*Precio + IVA</p>

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

      {/* ── El Proyecto ── */}
      <section className="py-20 md:py-28">
        <div className="container-wrap grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-20">
          <div>
            <span className="eyebrow eyebrow-accent block">— El proyecto</span>
            <h2 className="mt-5 font-serif text-[clamp(34px,4vw,56px)] font-light italic leading-[1.1] text-ink">
              Mucho más que un local comercial.
            </h2>
          </div>
          <div className="text-[17px] font-light leading-[1.7] text-ink-2">
            <p>
              Gardens se ubica en una zona de alta densidad residencial con flujo vehicular y peatonal validado. El diseño arquitectónico de doble altura, las fachadas con vegetación integrada y el cuidadoso mix de tenants generan un ecosistema retail que impulsa la rentabilidad de cada negocio.
            </p>
            <p className="mt-4">
              Cada local cuenta con instalaciones eléctricas, hidráulicas y sanitarias listas para tu giro. Estacionamiento amplio, accesos peatonales y áreas comunes diseñadas para incrementar el tiempo de permanencia.
            </p>
            <button
              onClick={scrollToForm}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-[12px] font-bold uppercase tracking-caps text-ink transition hover:brightness-95"
            >
              Agenda tu visita <ArrowRight size={14} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Ubicación ── */}
      <section className="border-t border-line py-20 md:py-28">
        <div className="container-wrap grid gap-10 md:grid-cols-[1fr_1.6fr] md:gap-16">
          <div>
            <span className="eyebrow eyebrow-accent">— Ubicación</span>
            <h2 className="mt-5 font-serif text-[clamp(32px,3.5vw,48px)] font-light italic leading-[1.1] text-ink">
              Ubicación estratégica
            </h2>
            <p className="mt-4 text-[15px] font-light leading-relaxed text-ink-3">
              Cancún, Q. Roo, México
            </p>
            <div className="mt-8 space-y-3 border-t border-line pt-6">
              {[
                { icon: <Building2 size={16} strokeWidth={1.5} />, text: 'Alta densidad residencial circundante' },
                { icon: <Layers size={16} strokeWidth={1.5} />,   text: 'Flujo vehicular validado por estudio de mercado' },
                { icon: <MapPin size={16} strokeWidth={1.5} />,   text: 'Frente a vialidad primaria' },
              ].map((b) => (
                <div key={b.text} className="flex items-center gap-3 text-[14px] text-ink-2">
                  <span className="text-accent">{b.icon}</span>
                  {b.text}
                </div>
              ))}
            </div>
          </div>
          <div
            className="relative mx-auto w-4/5 overflow-hidden rounded-xl border border-line"
            style={mapOpen && mapHeight ? { height: mapHeight } : undefined}
          >
            {mapOpen ? (
              /* el wrapper fuerza al LocationMap a llenar la altura capturada */
              <div className="[&>div]:!h-full h-full">
                <LocationMap lat={21.086815082087483} lng={-86.88777051510452} address="Cancún, Q. Roo, México" />
              </div>
            ) : (
              <>
                {/* imagen en flujo natural — el contenedor adopta su altura */}
                <Image
                  src="/mapagardens.png"
                  alt="Ubicación Quattro Plaza Gardens, Cancún"
                  width={0}
                  height={0}
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="block h-auto w-full"
                  onLoad={(e) => setMapHeight((e.target as HTMLImageElement).offsetHeight)}
                />
                <div className="absolute inset-0 bg-black/10" />
                <button
                  onClick={() => setMapOpen(true)}
                  className="absolute inset-0 flex items-center justify-center"
                  aria-label="Ver en Google Maps"
                >
                  <span className="flex items-center gap-2.5 rounded-full bg-white/80 px-5 py-2.5 text-[13px] font-semibold text-ink shadow-lg backdrop-blur-sm transition hover:bg-white">
                    <MapPin size={15} strokeWidth={2} className="text-[#EA4335]" />
                    Ver en Google Maps
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Highlights bar ── */}
      <section className="border-y border-line bg-white">
        <div className="container-wrap">
          <div className="grid grid-cols-2 md:grid-cols-5" style={{ minHeight: '104px' }}>
            {[
              { value: 'Jardines · Zienna · Ciudadela', label: 'Ubicación' },
              { value: '32 Locales',                    label: '' },
              { value: '2 Niveles',                     label: '' },
              { value: 'JUN – SEP 2027',                label: 'Entrega' },
            ].map((h, idx) => (
              <div
                key={idx}
                className={[
                  'flex flex-col justify-center px-5 py-5 md:py-0',
                  idx % 2 === 1 ? 'border-l' : '',
                  idx > 0 ? 'md:border-l' : '',
                  idx >= 2 ? 'border-t md:border-t-0' : '',
                ].join(' ')}
                style={{ borderColor: '#e2e2e1' }}
              >
                <div className="text-[clamp(13px,1.1vw,17px)] font-normal leading-tight tracking-tight">
                  {h.value}
                </div>
                {h.label && (
                  <div className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3">
                    {h.label}
                  </div>
                )}
              </div>
            ))}
            {/* Última columna — precio, fondo amarillo */}
            <div className="relative flex flex-col justify-center px-5 py-5 border-t md:border-l md:border-t-0 md:py-0" style={{ borderColor: '#e2e2e1' }}>
              <div className="absolute inset-0 md:hidden" style={{ background: '#FFD057' }} />
              <div className="absolute inset-0 hidden md:block" style={{ background: '#FFD057', right: 'calc(-1 * max(24px, 5vw))' }} />
              <div className="relative z-10">
                <div className="text-[clamp(13px,1.1vw,17px)] font-extrabold leading-tight tracking-tight text-ink">
                  $1,968,600 MXN
                </div>
                <div className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink/70">
                  Precio base + IVA
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Gallery ── */}
      <section className="bg-white py-16">
        <div className="container-wrap">
          <div className="mb-8 text-center">
            <span className="eyebrow eyebrow-accent">— El Proyecto</span>
            <h2 className="mt-3 font-serif text-[clamp(28px,3vw,44px)] font-light italic">
              Locales Comerciales en Venta en Cancún
            </h2>
          </div>
          <div className="relative mb-3 aspect-[16/9] w-full overflow-hidden rounded-xl">
            <Image
              src={GALLERY[activeImg]}
              alt={`Quattro Plaza Gardens render ${activeImg + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 80vw"
              className="object-cover transition-all duration-500"
            />
          </div>
          <div className="grid grid-cols-6 gap-2">
            {GALLERY.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                  activeImg === i ? 'border-ink' : 'border-transparent opacity-60 hover:opacity-90'
                }`}
              >
                <Image src={src} alt={`Local comercial Quattro Plaza Gardens — render ${i + 1}`} fill sizes="15vw" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Por qué Gardens ── */}
      <section className="bg-ink py-16 text-white">
        <div className="container-wrap">
          <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-eyebrow text-accent">— Por qué invertir</p>
          <h2 className="mb-12 text-center font-serif text-[36px] font-light italic" id="por-que">
            Por qué elegir locales en venta<br />en Cancún con Quattro Plaza
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
            Agenda tu visita a estos locales en venta en Cancún
          </h2>
          <p className="mt-3 text-[15px] text-ink/70">Locales comerciales disponibles · Preventa exclusiva · Cancún, Q. Roo</p>
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
