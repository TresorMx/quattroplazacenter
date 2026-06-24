'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight, CheckCircle2, MapPin, TrendingUp, Building2,
  ShieldCheck, Phone, MessageCircle, ChevronDown, ChevronUp,
  Store, BarChart2, Clock, Star,
} from 'lucide-react';

/* ─────────────── datos ─────────────── */
const PLAZAS = [
  {
    slug: 'gardens',
    name: 'Quattro Plaza Center Gardens',
    shortName: 'Gardens',
    tagline: 'Arquitectura premium con acabados de primer nivel y 2 niveles comerciales.',
    hero: '/renders/gardens/02.jpg',
    renders: ['/renders/gardens/01.jpg', '/renders/gardens/02.jpg', '/renders/gardens/03.jpg'],
    badge: 'Lanzamiento · Preventa',
    stats: [
      { label: 'Locales', value: '32 unidades' },
      { label: 'Desde', value: '32 m²' },
      { label: 'Precio desde', value: '$1,968,600 MXN*' },
      { label: 'Entrega', value: 'JUN–SEP 2027' },
    ],
    disponibles: 18,
    highlights: ['2 niveles', 'Enganche desde $147,000 MXN'],
    href: '/plazas/gardens',
    color: '#FAB413',
  },
  {
    slug: 'long-island',
    name: 'Quattro Plaza Center Long Island',
    shortName: 'Long Island',
    tagline: '120 m lineales de frente comercial en el corazón de Cancún.',
    hero: '/renders/long-island/02.jpg',
    renders: ['/renders/long-island/01.jpg', '/renders/long-island/02.jpg', '/renders/long-island/03.jpg'],
    badge: 'Preventa · Últimas unidades',
    stats: [
      { label: 'Locales', value: '30 unidades' },
      { label: 'Desde', value: '40 m²' },
      { label: 'Precio desde', value: '$2,650,000 MXN*' },
      { label: 'Entrega', value: 'DIC 2026–MAR 2027' },
    ],
    disponibles: 11,
    highlights: ['120 m frente comercial', '2 niveles', '+80 estacionamientos', 'Entrega próxima DIC 2026'],
    href: '/plazas/long-island',
    color: '#0E0E0E',
  },
];

const BENEFITS = [
  { icon: TrendingUp,  title: 'Alta plusvalía en Cancún',       desc: 'Cancún es uno de los mercados inmobiliarios con mayor crecimiento de México. Los locales comerciales en zonas residenciales de alta demanda han mantenido plusvalía sostenida.' },
  { icon: Building2,   title: 'Desarrollador con trayectoria',  desc: 'Tresor Real Estate tiene más de 10 años desarrollando proyectos residenciales y comerciales en Quintana Roo con 100% de entregas cumplidas.' },
  { icon: Store,       title: 'Mercado cautivo garantizado',     desc: 'Nuestras plazas están ubicadas en corredores de alto tráfico residencial, con miles de familias en un radio de 2 km.' },
  { icon: BarChart2,   title: 'Planes de pago flexibles',       desc: 'Enganche desde $147,000 MXN y mensualidades sin intereses durante la construcción. Ideal para inversión o negocio propio.' },
  { icon: ShieldCheck, title: 'Apartado 100% reembolsable',     desc: 'Aparta tu local con total seguridad. Si por cualquier razón no continúas, tu apartado se devuelve completo sin penalizaciones.' },
  { icon: Clock,       title: 'Rendimiento desde el día 1',     desc: 'Locales con acabados listos para operar desde la entrega. Sin obra adicional, sin tiempos muertos.' },
];

const FAQS = [
  {
    q: '¿Cuánto cuesta un local comercial en Cancún?',
    a: 'En Quattro Plaza Center los locales comerciales en Cancún tienen precios desde $1,968,600 MXN + IVA en la plaza Gardens, y desde $2,650,000 MXN + IVA en Long Island. Los precios varían según el tamaño (desde 32 m²) y la ubicación del local dentro de la plaza.',
  },
  {
    q: '¿Cuál es el enganche para comprar un local comercial en Cancún?',
    a: 'El enganche mínimo es de $147,000 MXN, equivalente al 30% del precio base del local más pequeño. El resto se puede financiar en mensualidades sin intereses durante el período de construcción, con un pago final a la entrega.',
  },
  {
    q: '¿Para qué giros comerciales son aptos los locales?',
    a: 'Los locales de Quattro Plaza Center están diseñados para cualquier giro comercial: restaurantes, cafeterías, tiendas de ropa, consultorios, oficinas, servicios de belleza, gimnasios, entre otros. Los espacios son de planta libre para máxima flexibilidad.',
  },
  {
    q: '¿Cuándo es la entrega de los locales?',
    a: 'Plaza Gardens tiene entrega estimada de JUN a SEP 2027. Plaza Long Island tiene entrega estimada de DIC 2026 a MAR 2027 — las unidades de Long Island son ideales para quienes buscan entrega próxima.',
  },
  {
    q: '¿Puedo rentar el local en lugar de usarlo yo mismo?',
    a: 'Sí. Muchos de nuestros clientes adquieren locales como inversión y los rentan desde el primer día de entrega. La ubicación en zonas de alto tráfico residencial garantiza demanda de arrendatarios.',
  },
  {
    q: '¿Qué diferencia hay entre Gardens y Long Island?',
    a: 'Gardens está ubicado en Cancún con locales desde 32 m². Long Island también en Cancún con locales desde 40 m² y entrega más próxima desde DIC 2026.',
  },
  {
    q: '¿El precio incluye IVA?',
    a: 'No. Los precios publicados son + IVA. El IVA (16%) se agrega al precio base del local. Un asesor puede desglosarte el precio total con IVA y los planes de pago disponibles.',
  },
  {
    q: '¿Cómo puedo apartar un local?',
    a: 'El apartado se realiza con un pago inicial reembolsable. Puedes agendar una visita al proyecto o una videollamada con un asesor para conocer disponibilidad, precios actualizados y opciones de pago.',
  },
];

const JSONLD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ItemList',
      name: 'Locales Comerciales en Venta en Cancún — Quattro Plaza Center',
      description: 'Dos plazas comerciales premium en Cancún con locales desde 32 m² y desde $1,968,600 MXN + IVA.',
      url: 'https://www.quattroplaza.mx/locales-comerciales-cancun',
      numberOfItems: 2,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          item: {
            '@type': 'RealEstateListing',
            name: 'Quattro Plaza Center Gardens — Locales Comerciales Cancún',
            description: 'Locales comerciales en venta en Cancún desde 32 m². Diseño premium, 2 niveles, acabados de primer nivel. Entrega JUN–SEP 2027.',
            url: 'https://www.quattroplaza.mx/plazas/gardens',
            image: 'https://www.quattroplaza.mx/renders/gardens/02.jpg',
            offers: { '@type': 'Offer', price: 1968600, priceCurrency: 'MXN', availability: 'https://schema.org/InStock' },
            address: { '@type': 'PostalAddress', addressLocality: 'Cancún', addressRegion: 'Quintana Roo', addressCountry: 'MX' },
          },
        },
        {
          '@type': 'ListItem',
          position: 2,
          item: {
            '@type': 'RealEstateListing',
            name: 'Quattro Plaza Center Long Island — Locales Comerciales Cancún',
            description: 'Locales comerciales en venta en Cancún desde 40 m². 120 m frente comercial, +80 estacionamientos. Entrega DIC 2026.',
            url: 'https://www.quattroplaza.mx/plazas/long-island',
            image: 'https://www.quattroplaza.mx/renders/long-island/02.jpg',
            offers: { '@type': 'Offer', price: 2650000, priceCurrency: 'MXN', availability: 'https://schema.org/InStock' },
            address: { '@type': 'PostalAddress', addressLocality: 'Cancún', addressRegion: 'Quintana Roo', addressCountry: 'MX' },
          },
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQS.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
    {
      '@type': 'LocalBusiness',
      '@id': 'https://www.quattroplaza.mx/#organization',
      name: 'Quattro Plaza Center — Tresor Real Estate',
      url: 'https://www.quattroplaza.mx',
      logo: 'https://www.quattroplaza.mx/logos/logo-quattro.svg',
      telephone: '+529984045602',
      email: 'hello@tresor.mx',
      address: { '@type': 'PostalAddress', addressLocality: 'Cancún', addressRegion: 'Quintana Roo', postalCode: '77500', addressCountry: 'MX' },
      areaServed: { '@type': 'City', name: 'Cancún' },
    },
  ],
};

/* ─────────────── componente FAQ ─────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-line">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-[15px] font-medium text-ink">{q}</span>
        {open ? <ChevronUp size={18} className="shrink-0 text-ink-3" /> : <ChevronDown size={18} className="shrink-0 text-ink-3" />}
      </button>
      {open && <p className="pb-5 text-[14px] leading-relaxed text-ink-3">{a}</p>}
    </div>
  );
}

/* ─────────────── página ─────────────── */
export default function LocalesComercialesCancun() {
  const formRef = useRef<HTMLDivElement>(null);
  const [activeImgs, setActiveImgs] = useState({ gardens: 0, 'long-island': 0 });
  const [form, setForm] = useState({ firstName: '', phone: '', plaza: '', uso: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState('');

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const valid = form.firstName.trim() && form.phone.trim() && form.plaza;

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    setErr('');
    setLoading(true);
    try {
      const res = await fetch('/api/ads-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: form.firstName, phone: form.phone, uso: form.plaza, variant: 'seo-locales-cancun' }),
      });
      if (!res.ok) throw new Error('Error');
      if (typeof (window as any).gtag === 'function') {
        (window as any).gtag('event', 'conversion', { send_to: 'AW-17453917774/wazACPXDnMQcEM7M1oJB' });
      }
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Lead', { content_name: 'Locales Cancún SEO', content_category: 'seo' });
      }
      setDone(true);
    } catch {
      setErr('Hubo un problema. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-ink py-24 md:py-36">
        <div className="absolute inset-0">
          <Image src="/renders/gardens/02.jpg" alt="Locales comerciales en venta en Cancún — Quattro Plaza Center" fill priority sizes="100vw" className="object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/70 to-ink" />
        </div>
        <div className="container-wrap relative z-10 text-center text-white">
          <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/70 backdrop-blur-sm">
            Cancún · Quintana Roo · México
          </span>
          <h1 className="mt-6 font-serif text-[clamp(36px,5.5vw,76px)] font-light italic leading-[1.05]">
            Locales Comerciales<br />
            <span className="text-[#FAB413]">en Venta en Cancún</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[16px] font-light leading-relaxed text-white/70">
            Dos plazas comerciales premium en los mejores corredores de Cancún.
            Locales desde 32 m² y desde $1,968,600 MXN + IVA.
            Desarrollado por Tresor Real Estate — más de 10 años en el mercado.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={scrollToForm}
              className="inline-flex items-center gap-2 rounded-full bg-[#FAB413] px-7 py-3.5 text-[12px] font-bold uppercase tracking-widest text-ink transition hover:bg-[#FAB413]/90"
            >
              Solicitar Información <ArrowRight size={14} strokeWidth={2} />
            </button>
            <a
              href="https://wa.me/529984045602?text=Hola+quiero+información+sobre+locales+comerciales+en+Cancún"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-[12px] font-bold uppercase tracking-widest text-white transition hover:border-white/50"
            >
              <MessageCircle size={14} strokeWidth={2} /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-b border-line bg-white">
        <div className="container-wrap">
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ minHeight: '96px' }}>
            {[
              { value: '2 Plazas',         label: 'Proyectos activos' },
              { value: '62+ locales',       label: 'Total disponibles' },
              { value: 'Desde 32 m²',       label: 'Tamaño mínimo' },
              { value: 'Desde $1.96 MDP*',  label: 'Precio + IVA' },
            ].map((s, i) => (
              <div key={i} className={`flex flex-col justify-center px-5 py-5 md:py-0 ${i > 0 ? 'border-l border-line' : ''} ${i >= 2 ? 'border-t md:border-t-0 border-line' : ''}`}>
                <div className="text-[clamp(18px,1.5vw,22px)] font-bold leading-tight text-ink">{s.value}</div>
                <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-3">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Intro SEO ── */}
      <section className="bg-bg py-16 md:py-20">
        <div className="container-wrap max-w-3xl">
          <span className="eyebrow eyebrow-accent">— El mercado</span>
          <h2 className="mt-4 font-serif text-[clamp(28px,3vw,44px)] font-light italic">
            ¿Por qué invertir en un local comercial en Cancún?
          </h2>
          <div className="mt-6 space-y-4 text-[15px] font-light leading-relaxed text-ink-2">
            <p>
              Cancún es hoy uno de los destinos de inversión inmobiliaria más dinámicos de México. Su crecimiento poblacional sostenido, el flujo constante de turismo y la expansión de zonas residenciales de alta demanda han convertido a los <strong>locales comerciales en Cancún</strong> en una de las inversiones más sólidas del sureste mexicano.
            </p>
            <p>
              <strong>Quattro Plaza Center</strong> ofrece locales comerciales en venta en Cancún en dos plazas de diseño premium: <strong>Gardens</strong>, con arquitectura premium y acabados de primer nivel, y <strong>Long Island</strong>, con 120 metros lineales de frente comercial en uno de los corredores con mayor tráfico de la ciudad.
            </p>
            <p>
              Ambos proyectos están desarrollados por <strong>Tresor Real Estate</strong>, empresa con más de 10 años de trayectoria y más de 25 proyectos entregados en Quintana Roo. Los locales están diseñados de planta libre para adaptarse a cualquier giro comercial: restaurantes, tiendas, consultorios, servicios, y más.
            </p>
          </div>
        </div>
      </section>

      {/* ── Plazas ── */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-wrap">
          <div className="mb-12 text-center">
            <span className="eyebrow eyebrow-accent">— Proyectos</span>
            <h2 className="mt-4 font-serif text-[clamp(28px,3vw,44px)] font-light italic">
              Locales Comerciales en Cancún — Nuestras Plazas
            </h2>
            <p className="mt-3 text-[14px] text-ink-3">Dos opciones de inversión, un mismo estándar de calidad</p>
          </div>

          <div className="grid gap-10 lg:grid-cols-2">
            {PLAZAS.map((p) => (
              <div key={p.slug} className="rounded-2xl border border-line bg-bg overflow-hidden">
                {/* imagen principal */}
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <Image
                    src={p.renders[activeImgs[p.slug as keyof typeof activeImgs]]}
                    alt={`${p.name} — locales comerciales en venta Cancún`}
                    fill sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-all duration-500"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                    {p.badge}
                  </span>
                  <span className="absolute right-4 top-4 rounded-full px-3 py-1 text-[11px] font-bold text-white" style={{ background: p.color === '#FAB413' ? '#FAB413' : '#16151C', color: p.color === '#FAB413' ? '#0E0E0E' : '#fff' }}>
                    {p.disponibles} disponibles
                  </span>
                </div>
                {/* thumbnails */}
                <div className="flex gap-2 border-b border-line p-3">
                  {p.renders.map((src, i) => (
                    <button key={i} onClick={() => setActiveImgs((s) => ({ ...s, [p.slug]: i }))}
                      className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${activeImgs[p.slug as keyof typeof activeImgs] === i ? 'border-ink' : 'border-transparent opacity-50 hover:opacity-80'}`}>
                      <Image src={src} alt={`${p.shortName} render ${i + 1}`} fill sizes="80px" className="object-cover" />
                    </button>
                  ))}
                </div>
                {/* contenido */}
                <div className="p-6">
                  <h3 className="font-serif text-[22px] font-light italic leading-tight">{p.name}</h3>
                  <p className="mt-2 text-[13px] text-ink-3">{p.tagline}</p>
                  {/* stats */}
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {p.stats.map((s) => (
                      <div key={s.label} className="rounded-lg bg-white px-4 py-3 border border-line">
                        <div className="text-[13px] font-bold text-ink">{s.value}</div>
                        <div className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-ink-3">{s.label}</div>
                      </div>
                    ))}
                  </div>
                  {/* highlights */}
                  <ul className="mt-5 space-y-2">
                    {p.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2.5 text-[13px] text-ink-2">
                        <CheckCircle2 size={14} strokeWidth={1.5} className="shrink-0 text-[#FAB413]" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-[10.5px] text-ink-3">*Precio + IVA</p>
                  <div className="mt-6 flex gap-3">
                    <Link href={p.href}
                      className="flex-1 rounded-full border border-ink py-2.5 text-center text-[12px] font-bold uppercase tracking-widest text-ink transition hover:bg-ink hover:text-white">
                      Ver proyecto
                    </Link>
                    <button onClick={scrollToForm}
                      className="flex-1 rounded-full py-2.5 text-center text-[12px] font-bold uppercase tracking-widest text-ink transition"
                      style={{ background: '#FAB413' }}>
                      Solicitar info
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="bg-bg py-16 md:py-24">
        <div className="container-wrap">
          <div className="mb-12 text-center">
            <span className="eyebrow eyebrow-accent">— Por qué elegirnos</span>
            <h2 className="mt-4 font-serif text-[clamp(28px,3vw,44px)] font-light italic">
              Ventajas de invertir en locales comerciales en Cancún con Quattro
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-xl border border-line bg-white p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bg-soft text-ink">
                  <Icon size={22} strokeWidth={1.5} />
                </div>
                <h3 className="mt-5 font-serif text-[18px] font-light italic">{title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-3">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Guía de inversión (contenido SEO largo) ── */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-wrap max-w-3xl">
          <span className="eyebrow eyebrow-accent">— Guía de inversión</span>
          <h2 className="mt-4 font-serif text-[clamp(28px,3vw,44px)] font-light italic">
            Cómo comprar un local comercial en Cancún
          </h2>
          <div className="mt-8 space-y-10">
            {[
              {
                n: '01',
                title: 'Define tu objetivo: inversión o negocio propio',
                body: 'Antes de adquirir un local comercial en Cancún, es importante definir si tu objetivo es rentar el espacio a un tercero (inversión pasiva) o instalar tu propio negocio. Ambas estrategias son válidas: Cancún tiene alta demanda tanto de arrendatarios como de comercios nuevos. Si es inversión, los locales en planta baja con mayor flujo peatonal tienen los mejores rendimientos en renta.',
              },
              {
                n: '02',
                title: 'Elige la plaza y el local correcto',
                body: 'No todos los locales comerciales en Cancún son iguales. La ubicación dentro de la plaza (planta baja vs. segunda planta), el tamaño, el frente comercial y el uso de suelo son factores clave. En Quattro Plaza Center ofrecemos asesoría personalizada para ayudarte a elegir el local que mejor se adapta a tu giro y presupuesto.',
              },
              {
                n: '03',
                title: 'Conoce el plan de pagos',
                body: 'Los locales comerciales en preventa en Cancún tienen la ventaja de planes de pago durante la construcción: pagas mensualidades sin intereses mientras el proyecto avanza y liquidas el resto a la entrega. Esto permite invertir con un capital inicial menor y aprovechar el precio de preventa antes de que suba al completarse la obra.',
              },
              {
                n: '04',
                title: 'Agenda tu visita o videollamada',
                body: 'Visita el terreno del proyecto, conoce la maqueta y habla con un asesor especializado. En Quattro Plaza Center atendemos de forma presencial en Cancún o por videollamada para clientes fuera de la ciudad. Un asesor te presenta disponibilidad actualizada, planos y proyección de plusvalía.',
              },
            ].map(({ n, title, body }) => (
              <div key={n} className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FAB413] font-mono text-[12px] font-bold text-ink">
                  {n}
                </div>
                <div>
                  <h3 className="font-serif text-[19px] font-light italic">{title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink-3">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Formulario ── */}
      <section ref={formRef} id="solicitar-info" className="border-t border-line bg-bg py-20 md:py-28">
        <div className="container-wrap grid gap-12 md:grid-cols-[1fr_480px]">
          {/* left */}
          <div>
            <span className="eyebrow eyebrow-accent">— Contacto</span>
            <h2 className="mt-4 font-serif text-[clamp(28px,3.5vw,48px)] font-light italic leading-[1.1]">
              Agenda tu visita o solicita información
            </h2>
            <p className="mt-4 text-[15px] font-light leading-relaxed text-ink-3">
              Un asesor especializado en locales comerciales en Cancún te contacta en menos de 2 horas.
              Visita presencial o por Zoom, sin compromisos.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                'Disponibilidad actualizada al momento',
                'Precios y planes de pago personalizados',
                'Visita al proyecto o videollamada',
                'Apartado 100% reembolsable',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[14px] text-ink-2">
                  <CheckCircle2 size={15} strokeWidth={1.5} className="shrink-0 text-[#FAB413]" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a href="tel:+529984045602"
                className="flex items-center gap-2.5 rounded-full border border-line bg-white px-5 py-3 text-[13px] font-semibold text-ink transition hover:border-ink">
                <Phone size={15} strokeWidth={1.5} /> +52 998 404 5602
              </a>
              <a href="https://wa.me/529984045602?text=Hola+quiero+información+sobre+locales+comerciales+en+Cancún"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-full bg-[#25D366] px-5 py-3 text-[13px] font-semibold text-white transition hover:bg-[#25D366]/90">
                <MessageCircle size={15} strokeWidth={1.5} /> WhatsApp directo
              </a>
            </div>
          </div>

          {/* form */}
          <div className="rounded-2xl bg-white p-8 shadow-xl">
            {done ? (
              <div className="flex flex-col items-center py-8 text-center">
                <CheckCircle2 size={48} strokeWidth={1} className="text-[#FAB413]" />
                <h3 className="mt-4 font-serif text-[22px] font-light italic">¡Listo!</h3>
                <p className="mt-2 text-[14px] text-ink-3">Un asesor te contactará en menos de 2 horas.</p>
                <a
                  href={`https://wa.me/529984045602?text=Hola+soy+${encodeURIComponent(form.firstName)}+quiero+información+de+locales+comerciales+en+Cancún`}
                  target="_blank" rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-[12px] font-bold uppercase tracking-widest text-white"
                >
                  <MessageCircle size={14} /> Escribir por WhatsApp
                </a>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="flex items-center gap-2.5">
                    <Star size={16} strokeWidth={1.5} className="text-[#FAB413]" />
                    <span className="font-serif text-[20px] font-light italic">Solicitar Información</span>
                  </div>
                  <p className="mt-1 text-[12px] text-ink-3">Asesor disponible en menos de 2 horas · Sin compromiso</p>
                </div>
                <form onSubmit={submit} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-ink-3">
                      Nombre *
                    </label>
                    <div className="rounded-lg border border-line bg-bg-soft px-3.5 py-2.5">
                      <input required type="text" placeholder="Tu nombre completo"
                        className="w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-ink-3"
                        value={form.firstName} onChange={(e) => set('firstName', e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-ink-3">
                      Teléfono / WhatsApp *
                    </label>
                    <div className="rounded-lg border border-line bg-bg-soft px-3.5 py-2.5">
                      <input required type="tel" placeholder="+52 998 000 0000"
                        className="w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-ink-3"
                        value={form.phone} onChange={(e) => set('phone', e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-ink-3">
                      ¿Qué plaza te interesa? *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { v: 'gardens',     label: 'Gardens',     sub: 'Desde $1.96 MDP' },
                        { v: 'long-island', label: 'Long Island', sub: 'Desde $2.65 MDP' },
                      ].map(({ v, label, sub }) => (
                        <button key={v} type="button" onClick={() => set('plaza', v)}
                          className={`flex flex-col items-center rounded-lg border py-3 text-center text-[12px] font-semibold transition-all ${form.plaza === v ? 'border-ink bg-ink text-white' : 'border-line bg-bg text-ink-3 hover:border-ink-3'}`}>
                          {label}
                          <span className={`mt-0.5 text-[10px] font-normal ${form.plaza === v ? 'text-white/70' : 'text-ink-3'}`}>{sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-ink-3">
                      ¿Para qué lo buscas?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { v: 'inversion', label: 'Inversión' },
                        { v: 'negocio',   label: 'Negocio propio' },
                      ].map(({ v, label }) => (
                        <button key={v} type="button" onClick={() => set('uso', v)}
                          className={`rounded-lg border py-2.5 text-[12px] font-semibold transition-all ${form.uso === v ? 'border-ink bg-ink text-white' : 'border-line bg-bg text-ink-3 hover:border-ink-3'}`}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {err && <p className="rounded bg-red-50 px-3 py-2 text-[12px] text-red-700">{err}</p>}
                  <button type="submit" disabled={!valid || loading}
                    className="mt-2 w-full rounded-full py-3.5 text-[12px] font-bold uppercase tracking-widest text-ink disabled:opacity-40 transition"
                    style={{ background: '#FAB413' }}>
                    {loading ? 'Enviando…' : 'Solicitar Información'} {!loading && <ArrowRight size={13} strokeWidth={2} className="inline ml-1" />}
                  </button>
                  <p className="text-center text-[10.5px] text-ink-3">Tus datos están seguros. Sin spam. *Precio + IVA</p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-wrap max-w-3xl">
          <div className="mb-10 text-center">
            <span className="eyebrow eyebrow-accent">— Preguntas frecuentes</span>
            <h2 className="mt-4 font-serif text-[clamp(28px,3vw,44px)] font-light italic">
              Todo sobre locales comerciales en venta en Cancún
            </h2>
          </div>
          <div>
            {FAQS.map(({ q, a }) => <FaqItem key={q} q={q} a={a} />)}
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="bg-ink py-20 text-white">
        <div className="container-wrap text-center">
          <h2 className="font-serif text-[clamp(28px,3.5vw,52px)] font-light italic">
            Tu local comercial en Cancún<br />te está esperando
          </h2>
          <p className="mt-4 text-[14px] text-white/60">
            Habla hoy con un asesor especializado · Visita presencial o por Zoom
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button onClick={scrollToForm}
              className="inline-flex items-center gap-2 rounded-full bg-[#FAB413] px-8 py-4 text-[12px] font-bold uppercase tracking-widest text-ink transition hover:bg-[#FAB413]/90">
              Solicitar Información <ArrowRight size={14} strokeWidth={2} />
            </button>
            <a href="https://wa.me/529984045602?text=Hola+quiero+información+sobre+locales+comerciales+en+Cancún"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-4 text-[12px] font-bold uppercase tracking-widest text-white transition hover:border-white/60">
              <MessageCircle size={14} /> WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
