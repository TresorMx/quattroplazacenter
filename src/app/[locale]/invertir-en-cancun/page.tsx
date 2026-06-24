'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight, CheckCircle2, TrendingUp, Building2,
  ShieldCheck, Phone, MessageCircle, ChevronDown, ChevronUp,
  Star, Plane, BarChart2, Clock,
} from 'lucide-react';

const BENEFITS = [
  { icon: TrendingUp,  title: 'Plusvalía 2–3× mayor que en tu ciudad', desc: 'Los corredores comerciales de Cancún han mantenido plusvalía de 10–15% anual en los últimos 5 años, frente al 5–8% de Monterrey, CDMX o Guadalajara.' },
  { icon: Building2,   title: 'Precio de entrada hasta 3× menor',       desc: 'Un local en Cancún desde $1,968,600 MXN te da acceso a 32 m² en una plaza premium. El mismo presupuesto en San Pedro o Polanco no te alcanza ni para 15 m².' },
  { icon: BarChart2,   title: 'Rendimiento por renta del 10–15%',        desc: 'Frente al 5–6% típico en las grandes ciudades. La relación entre precio y renta en Cancún es de las mejores del país.' },
  { icon: Plane,       title: 'Proceso 100% remoto',                     desc: 'Videollamada inicial, contrato digital, mensualidades por transferencia. Si quieres visitar, es 2 horas de avión. Muchos clientes nunca vienen hasta la entrega.' },
  { icon: ShieldCheck, title: 'Desarrollador con trayectoria comprobada', desc: 'Tresor Real Estate lleva más de 10 años desarrollando proyectos en Quintana Roo. Más de 25 proyectos entregados. Apartado 100% reembolsable.' },
  { icon: Clock,       title: 'Listo para rentar desde el día 1',         desc: 'Locales con acabados de primera calidad, planta libre. Sin obra adicional. Tu inquilino puede entrar al mes de la entrega.' },
];

const FAQS = [
  {
    q: '¿Puedo comprar un local en Cancún sin vivir allá?',
    a: 'Sí. Todo el proceso previo a la entrega se puede gestionar de forma remota: la videollamada de presentación, el contrato de promesa y las mensualidades durante la construcción. Para la escrituración, puedes acudir personalmente o dar poder notarial a un representante en Cancún.',
  },
  {
    q: '¿Quién administra el local si no estoy en Cancún?',
    a: 'Existen gestores de propiedades locales en Cancún que por entre el 8% y el 12% de la renta mensual se encargan de todo: búsqueda de inquilino, cobro de renta, mantenimiento menor y reportes periódicos. Es la misma figura que se usa en cualquier inversión inmobiliaria remota.',
  },
  {
    q: '¿Cuánto necesito para invertir?',
    a: 'El enganche mínimo en Quattro Plaza Center es de $147,000 MXN (30% del precio base del local más pequeño). El resto se paga en mensualidades sin intereses durante la construcción y el saldo a la entrega. Es un esquema diseñado para que la inversión no comprometa todo tu capital de golpe.',
  },
  {
    q: '¿Por qué Cancún y no Mérida, Playa del Carmen o Los Cabos?',
    a: 'Cancún tiene la mayor base de población residente del sureste mexicano (más de 1 millón de habitantes), el aeropuerto internacional más transitado de México después del AICM y la mayor oferta de servicios comerciales de la región. Es el mercado más líquido — encontrar inquilino es más fácil que en mercados más pequeños.',
  },
  {
    q: '¿Cuándo puedo esperar recuperar mi inversión?',
    a: 'Con un local bien ubicado en preventa, comprando a precio de entrada y rentando desde el primer mes de entrega, el período de recuperación típico es de 7 a 10 años considerando renta más plusvalía. En el escenario conservador de solo renta, el flujo cubre el costo financiero del capital invertido en menos tiempo que la mayoría de los instrumentos tradicionales.',
  },
  {
    q: '¿Los precios publicados incluyen IVA?',
    a: 'No. Los precios publicados son + IVA (16%). Un asesor te puede desglosar el precio total con IVA y el plan de pagos detallado para el local específico que te interese.',
  },
];

const JSONLD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      name: 'Invertir en Cancún — Locales Comerciales para Inversionistas de Monterrey, CDMX y Guadalajara',
      description: 'Locales comerciales en preventa en Cancún con rendimientos del 10–15% anual. Proceso 100% remoto. Ideal para inversionistas de Monterrey, CDMX o Guadalajara.',
      url: 'https://www.quattroplaza.mx/invertir-en-cancun',
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
      address: { '@type': 'PostalAddress', addressLocality: 'Cancún', addressRegion: 'Quintana Roo', addressCountry: 'MX' },
    },
  ],
};

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

export default function InvertirEnCancun() {
  const formRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({ firstName: '', phone: '', ciudad: '', plaza: '' });
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
        body: JSON.stringify({
          firstName: form.firstName,
          phone: form.phone,
          uso: form.plaza,
          variant: 'seo-locales-cancun',
        }),
      });
      if (!res.ok) throw new Error('Error');
      if (typeof (window as any).gtag === 'function') {
        (window as any).gtag('event', 'conversion', { send_to: 'AW-17453917774/wazACPXDnMQcEM7M1oJB' });
      }
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Lead', { content_name: 'Invertir en Cancún', content_category: 'seo' });
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
      <section className="relative overflow-hidden bg-ink py-24 md:py-40">
        <div className="absolute inset-0">
          <Image
            src="/blog/AdobeStock_841077811.jpeg"
            alt="Invertir en Cancún — Locales comerciales en preventa"
            fill priority sizes="100vw"
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/70 to-ink" />
        </div>
        <div className="container-wrap relative z-10 text-center text-white">
          <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/70 backdrop-blur-sm">
            Para inversionistas de Monterrey · CDMX · Guadalajara
          </span>
          <h1 className="mt-6 font-serif text-[clamp(36px,5.5vw,76px)] font-light italic leading-[1.05]">
            Invierte en Cancún<br />
            <span className="text-[#FAB413]">sin salir de tu ciudad</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[16px] font-light leading-relaxed text-white/70">
            Locales comerciales en preventa con rendimientos del 10–15% anual.
            Proceso 100% remoto. Videollamada, contrato digital, mensualidades por transferencia.
            Desarrollado por Tresor Real Estate.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={scrollToForm}
              className="inline-flex items-center gap-2 rounded-full bg-[#FAB413] px-7 py-3.5 text-[12px] font-bold uppercase tracking-widest text-ink transition hover:bg-[#FAB413]/90"
            >
              Solicitar Información <ArrowRight size={14} strokeWidth={2} />
            </button>
            <a
              href="https://wa.me/529984045602?text=Hola+quiero+información+para+invertir+en+Cancún"
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
              { value: '10–15%',           label: 'Rendimiento anual estimado' },
              { value: 'Desde $1.96 MDP*', label: 'Precio de entrada + IVA' },
              { value: '2 hrs de avión',   label: 'Desde MTY / CDMX / GDL' },
              { value: '100% remoto',      label: 'Todo el proceso previo' },
            ].map((s, i) => (
              <div key={i} className={`flex flex-col justify-center px-5 py-5 md:py-0 ${i > 0 ? 'border-l border-line' : ''} ${i >= 2 ? 'border-t md:border-t-0 border-line' : ''}`}>
                <div className="text-[clamp(18px,1.5vw,22px)] font-bold leading-tight text-ink">{s.value}</div>
                <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-3">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Por qué Cancún ── */}
      <section className="bg-bg py-16 md:py-24">
        <div className="container-wrap max-w-3xl">
          <span className="eyebrow eyebrow-accent">— El contexto</span>
          <h2 className="mt-4 font-serif text-[clamp(28px,3vw,44px)] font-light italic">
            Tu mercado local ya no da los rendimientos de antes
          </h2>
          <div className="mt-6 space-y-4 text-[15px] font-light leading-relaxed text-ink-2">
            <p>
              Los precios en Monterrey, CDMX y Guadalajara subieron tanto en la última década que el rendimiento por renta de un local comercial ya no supera el 6% anual en la mayoría de las zonas. Antes de impuestos y vacancia, estás por debajo de lo que ofrece un instrumento de deuda.
            </p>
            <p>
              Cancún tiene la ecuación inversa: <strong>precio de entrada bajo, rentas altas y una plusvalía histórica de 10–15% anual</strong> sostenida por crecimiento poblacional real, escasez de suelo y turismo como piso mínimo de demanda. Es el mercado que las grandes ciudades fueron hace 20 años.
            </p>
            <p>
              Y lo mejor: no necesitas mudarte. El proceso de compra en preventa es completamente remoto. Tu local trabaja en Cancún mientras tú sigues en tu ciudad.
            </p>
          </div>
          <Link
            href="/blog/invertir-en-cancun-desde-monterrey-cdmx"
            className="mt-8 inline-flex items-center gap-2 text-accent text-sm font-semibold hover:underline"
          >
            Leer el análisis completo <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── Comparativa ── */}
      <section className="bg-white py-16 md:py-20">
        <div className="container-wrap max-w-4xl">
          <div className="mb-10 text-center">
            <span className="eyebrow eyebrow-accent">— Comparativa</span>
            <h2 className="mt-4 font-serif text-[clamp(28px,3vw,44px)] font-light italic">
              ¿Qué obtienes con $2,000,000 MXN en cada ciudad?
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { ciudad: 'Monterrey', emoji: '🏔', desc: '~16 m² en zona secundaria. Renta: $9,000–$11,000/mes.', rendimiento: '~5.4–6.6% anual', destacado: false },
              { ciudad: 'CDMX', emoji: '🏙', desc: '~14 m² en colonia media. Renta: $8,500–$10,000/mes.', rendimiento: '~5.1–6.0% anual', destacado: false },
              { ciudad: 'Cancún · Quattro', emoji: '🌴', desc: 'Local de 32 m² en plaza premium. Renta: $20,000–$25,000/mes.', rendimiento: '~12–15% anual', destacado: true },
            ].map((c) => (
              <div key={c.ciudad} className={`rounded-2xl border p-7 ${c.destacado ? 'border-accent bg-accent/5' : 'border-line bg-bg-soft'}`}>
                <div className="text-3xl mb-3">{c.emoji}</div>
                <h3 className={`font-serif text-xl font-light italic mb-2 ${c.destacado ? 'text-accent' : 'text-ink'}`}>{c.ciudad}</h3>
                <p className="text-ink-2 text-sm leading-relaxed mb-4">{c.desc}</p>
                <p className={`text-sm font-bold ${c.destacado ? 'text-accent' : 'text-ink-3'}`}>{c.rendimiento}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-[11px] text-ink-3 text-center">*Precios + IVA. Estimaciones basadas en datos de mercado 2025–2026. Los rendimientos son proyectados y no garantizados.</p>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="bg-bg py-16 md:py-24">
        <div className="container-wrap">
          <div className="mb-12 text-center">
            <span className="eyebrow eyebrow-accent">— Por qué Quattro</span>
            <h2 className="mt-4 font-serif text-[clamp(28px,3vw,44px)] font-light italic">
              Diseñado para el inversionista que no vive en Cancún
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

      {/* ── Plazas ── */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-wrap max-w-4xl">
          <div className="mb-10 text-center">
            <span className="eyebrow eyebrow-accent">— Proyectos disponibles</span>
            <h2 className="mt-4 font-serif text-[clamp(28px,3vw,44px)] font-light italic">
              Dos plazas en preventa · Cancún
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                name: 'Gardens',
                slug: 'gardens',
                render: '/renders/gardens/02.jpg',
                badge: 'Lanzamiento · Preventa',
                stats: ['32 locales', 'Desde 32 m²', 'Desde $1,968,600 MXN*', 'Entrega JUN–SEP 2027'],
                desc: 'Arquitectura premium con vegetación integrada y 2 niveles. Enganche desde $147,000 MXN.',
              },
              {
                name: 'Long Island',
                slug: 'long-island',
                render: '/renders/long-island/02.jpg',
                badge: 'Preventa · Entrega próxima',
                stats: ['30 locales', 'Desde 40 m²', 'Desde $2,650,000 MXN*', 'Entrega DIC 2026–MAR 2027'],
                desc: '120 m lineales de frente comercial. Entrega más próxima, ideal para rentar cuanto antes.',
              },
            ].map((p) => (
              <div key={p.slug} className="rounded-2xl border border-line overflow-hidden">
                <div className="relative aspect-video">
                  <Image src={p.render} alt={`Quattro Plaza Center ${p.name}`} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                  <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">{p.badge}</span>
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-[22px] font-light italic mb-1">Quattro Plaza Center {p.name}</h3>
                  <p className="text-ink-3 text-sm mb-5">{p.desc}</p>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {p.stats.map((s) => (
                      <div key={s} className="flex items-center gap-2 text-sm text-ink-2">
                        <CheckCircle2 size={14} strokeWidth={1.5} className="shrink-0 text-accent" />
                        {s}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Link href={`/plazas/${p.slug}`}
                      className="flex-1 rounded-full border border-ink py-2.5 text-center text-[12px] font-bold uppercase tracking-widest text-ink transition hover:bg-ink hover:text-white">
                      Ver proyecto
                    </Link>
                    <button onClick={scrollToForm}
                      className="flex-1 rounded-full py-2.5 text-center text-[12px] font-bold uppercase tracking-widest text-ink transition"
                      style={{ background: '#FAB413' }}>
                      Me interesa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[11px] text-ink-3 text-center">*Precio + IVA</p>
        </div>
      </section>

      {/* ── Formulario ── */}
      <section ref={formRef} id="solicitar-info" className="border-t border-line bg-bg py-20 md:py-28">
        <div className="container-wrap grid gap-12 md:grid-cols-[1fr_480px]">
          <div>
            <span className="eyebrow eyebrow-accent">— Primer paso</span>
            <h2 className="mt-4 font-serif text-[clamp(28px,3.5vw,48px)] font-light italic leading-[1.1]">
              Habla con un asesor especializado
            </h2>
            <p className="mt-4 text-[15px] font-light leading-relaxed text-ink-3">
              Te contactamos en menos de 2 horas. Videollamada por Zoom, sin compromiso, desde donde estés.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                'Disponibilidad actualizada al momento',
                'Comparativa de las dos plazas',
                'Plan de pagos personalizado',
                'Apartado 100% reembolsable',
                'Videollamada o visita presencial en Cancún',
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
              <a href="https://wa.me/529984045602?text=Hola+quiero+información+para+invertir+en+Cancún"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-full bg-[#25D366] px-5 py-3 text-[13px] font-semibold text-white transition hover:bg-[#25D366]/90">
                <MessageCircle size={15} strokeWidth={1.5} /> WhatsApp directo
              </a>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-xl">
            {done ? (
              <div className="flex flex-col items-center py-8 text-center">
                <CheckCircle2 size={48} strokeWidth={1} className="text-[#FAB413]" />
                <h3 className="mt-4 font-serif text-[22px] font-light italic">¡Listo!</h3>
                <p className="mt-2 text-[14px] text-ink-3">Un asesor te contactará en menos de 2 horas.</p>
                <a
                  href={`https://wa.me/529984045602?text=Hola+soy+${encodeURIComponent(form.firstName)}+quiero+información+para+invertir+en+Cancún`}
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
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-ink-3">Nombre *</label>
                    <div className="rounded-lg border border-line bg-bg-soft px-3.5 py-2.5">
                      <input required type="text" placeholder="Tu nombre completo"
                        className="w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-ink-3"
                        value={form.firstName} onChange={(e) => set('firstName', e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-ink-3">Teléfono / WhatsApp *</label>
                    <div className="rounded-lg border border-line bg-bg-soft px-3.5 py-2.5">
                      <input required type="tel" placeholder="+52 818 000 0000"
                        className="w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-ink-3"
                        value={form.phone} onChange={(e) => set('phone', e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-ink-3">¿Desde qué ciudad inviertes?</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Monterrey', 'CDMX', 'Guadalajara'].map((c) => (
                        <button key={c} type="button" onClick={() => set('ciudad', c)}
                          className={`rounded-lg border py-2.5 text-[11px] font-semibold transition-all ${form.ciudad === c ? 'border-ink bg-ink text-white' : 'border-line bg-bg text-ink-3 hover:border-ink-3'}`}>
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-ink-3">¿Qué plaza te interesa? *</label>
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
              Todo lo que necesitas saber para invertir en Cancún desde otra ciudad
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
            Tu próxima inversión está<br />
            <span className="text-[#FAB413]">a 2 horas de avión</span>
          </h2>
          <p className="mt-4 text-[14px] text-white/60">
            Asesor disponible en menos de 2 horas · Videollamada sin compromiso
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button onClick={scrollToForm}
              className="inline-flex items-center gap-2 rounded-full bg-[#FAB413] px-8 py-4 text-[12px] font-bold uppercase tracking-widest text-ink transition hover:bg-[#FAB413]/90">
              Solicitar Información <ArrowRight size={14} strokeWidth={2} />
            </button>
            <a href="https://wa.me/529984045602?text=Hola+quiero+información+para+invertir+en+Cancún"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-4 text-[12px] font-bold uppercase tracking-widest text-white transition hover:border-white/60">
              <MessageCircle size={14} /> WhatsApp
            </a>
          </div>
          <p className="mt-8 text-[12px] text-white/40">
            ¿Ya conoces nuestros proyectos? → <Link href="/locales-comerciales-cancun" className="underline hover:text-white/60">Locales Comerciales en Cancún</Link>
          </p>
        </div>
      </section>
    </>
  );
}
