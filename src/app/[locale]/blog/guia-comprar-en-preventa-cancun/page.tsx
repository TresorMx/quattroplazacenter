import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import BlogCTA from '@/components/BlogCTA';

export const metadata: Metadata = {
  title: 'Guía para Comprar en Preventa en Cancún: Todo lo que Debes Saber',
  description:
    'Todo sobre comprar en preventa en Cancún: ventajas, riesgos, documentos que pedir, checklist y las preguntas clave que debes hacerle al desarrollador antes de firmar.',
  keywords: [
    'preventa cancun',
    'comprar en preventa cancun',
    'local comercial preventa cancun',
    'como comprar en preventa cancun',
    'preventa inmobiliaria cancun 2026',
  ],
  alternates: {
    canonical: 'https://www.quattroplaza.mx/blog/guia-comprar-en-preventa-cancun',
  },
  openGraph: {
    title: 'Guía para Comprar en Preventa en Cancún: Todo lo que Debes Saber',
    description: 'Checklist, documentos y preguntas clave para comprar en preventa en Cancún sin errores. Guía completa para el inversionista inteligente.',
    url: 'https://www.quattroplaza.mx/blog/guia-comprar-en-preventa-cancun',
    images: [{ url: 'https://www.quattroplaza.mx/renders/gardens/02.jpg', width: 1200, height: 630 }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Guía para Comprar en Preventa en Cancún: Todo lo que Debes Saber',
  datePublished: '2026-06-23',
  dateModified: '2026-06-23',
  author: { '@type': 'Organization', name: 'Quattro Plaza Center' },
  publisher: {
    '@type': 'Organization',
    name: 'Quattro Plaza Center',
    logo: 'https://www.quattroplaza.mx/logos/logo-quattro.svg',
  },
  image: 'https://www.quattroplaza.mx/renders/gardens/02.jpg',
  mainEntityOfPage: 'https://www.quattroplaza.mx/blog/guia-comprar-en-preventa-cancun',
};

export default function ArticlePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <div className="relative h-[55vh] min-h-[400px] overflow-hidden">
        <Image
          src="/renders/gardens/02.jpg"
          alt="Preventa de locales comerciales en Cancún — Quattro Plaza Center Gardens"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-10">
          <div className="container-wrap">
            <p className="eyebrow eyebrow-accent mb-3">Guía del Comprador</p>
            <h1 className="font-serif italic text-3xl md:text-5xl text-white max-w-3xl leading-tight">
              Guía para Comprar en Preventa en Cancún: Todo lo que Debes Saber
            </h1>
            <div className="flex items-center gap-4 mt-4 text-white/60 text-sm">
              <span>23 de junio de 2026</span>
              <span>·</span>
              <span>7 min de lectura</span>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="py-4 px-6 border-b border-line">
        <div className="container-wrap">
          <ol className="flex items-center gap-2 text-sm text-ink-3">
            <li><Link href="/" className="hover:text-accent transition-colors">Inicio</Link></li>
            <li>/</li>
            <li><Link href="/blog" className="hover:text-accent transition-colors">Blog</Link></li>
            <li>/</li>
            <li className="text-ink truncate max-w-[200px] md:max-w-none">Guía para comprar en preventa en Cancún</li>
          </ol>
        </div>
      </nav>

      {/* Content */}
      <article className="py-16 px-6">
        <div className="max-w-3xl mx-auto">

          <p className="text-lg text-ink-2 leading-relaxed mb-8">
            Comprar un local comercial en preventa en Cancún puede ser la mejor decisión inmobiliaria de tu vida — o una fuente de dolores de cabeza si no sabes qué verificar. La diferencia está en la información: saber exactamente qué documentos pedir, qué preguntas hacer y qué señales de alerta identificar antes de firmar.
          </p>
          <p className="text-ink-2 leading-relaxed mb-8">
            En esta guía te explicamos todo el proceso de compra en preventa, desde la selección del proyecto hasta la escrituración, incluyendo un checklist completo y las 10 preguntas que debes hacerle a cualquier desarrollador.
          </p>

          <h2 className="font-serif italic text-3xl text-ink mt-12 mb-6">
            ¿Qué es la preventa y por qué conviene?
          </h2>
          <p className="text-ink-2 leading-relaxed mb-4">
            La preventa es la etapa en la que un desarrollador vende unidades de un proyecto antes de que este esté construido — o durante las etapas iniciales de construcción. Los compradores en preventa obtienen el precio más bajo del ciclo de vida del inmueble, a cambio de esperar el tiempo de construcción.
          </p>
          <p className="text-ink-2 leading-relaxed mb-4">
            Las ventajas son claras:
          </p>
          <ul className="space-y-3 mb-6 text-ink-2">
            <li className="flex gap-2"><span className="text-accent font-bold">→</span> <span><strong>Precio más bajo del mercado:</strong> Los precios de preventa suelen estar 20–35% por debajo del valor de mercado una vez que el proyecto está terminado y operando.</span></li>
            <li className="flex gap-2"><span className="text-accent font-bold">→</span> <span><strong>Plusvalía asegurada desde el día uno:</strong> Desde el momento de la firma hasta la entrega, el valor del inmueble sube aunque tú no hagas nada.</span></li>
            <li className="flex gap-2"><span className="text-accent font-bold">→</span> <span><strong>Pagos escalonados durante la construcción:</strong> Puedes pagar en mensualidades durante el tiempo de obra, lo que facilita la planeación financiera.</span></li>
            <li className="flex gap-2"><span className="text-accent font-bold">→</span> <span><strong>Elección de las mejores unidades:</strong> Los compradores tempranos tienen acceso a los locales con mejor ubicación dentro de la plaza.</span></li>
          </ul>
          <p className="text-ink-2 leading-relaxed mb-8">
            En el mercado actual de Cancún, proyectos como <Link href="/locales-comerciales-cancun" className="text-accent hover:underline">Quattro Plaza Center</Link> ofrecen exactamente estas condiciones: precios desde $1,968,600 MXN + IVA con enganche desde $147,000 MXN.
          </p>

          <h2 className="font-serif italic text-3xl text-ink mt-12 mb-6">
            Los riesgos reales de comprar en preventa y cómo mitigarlos
          </h2>
          <p className="text-ink-2 leading-relaxed mb-4">
            La preventa no está exenta de riesgos. El principal es que el proyecto no se termine, se retrase o no se entregue según lo prometido. Para mitigar estos riesgos:
          </p>

          <h3 className="font-sans font-semibold text-xl text-ink mt-8 mb-4">
            Verifica el historial del desarrollador
          </h3>
          <p className="text-ink-2 leading-relaxed mb-6">
            Un desarrollador con proyectos anteriores entregados a tiempo tiene el mejor aval posible. Pide referencias de compradores anteriores y visita proyectos ya terminados del mismo desarrollador. La reputación en el mercado de Cancún es pública y verificable.
          </p>

          <h3 className="font-sans font-semibold text-xl text-ink mt-8 mb-4">
            Revisa la situación legal del terreno
          </h3>
          <p className="text-ink-2 leading-relaxed mb-6">
            El terreno debe estar libre de gravámenes y el desarrollador debe poder acreditar la propiedad o el derecho de construir. Solicita el folio real del Registro Público de la Propiedad y verifica que no haya hipotecas, embargos o litigios pendientes.
          </p>

          <h3 className="font-sans font-semibold text-xl text-ink mt-8 mb-4">
            Confirma los permisos de construcción
          </h3>
          <p className="text-ink-2 leading-relaxed mb-6">
            El desarrollador debe tener la licencia de construcción emitida por el municipio de Benito Juárez. Sin este documento, el proyecto puede ser detenido en cualquier momento. Pide una copia y verifica su autenticidad.
          </p>

          <h3 className="font-sans font-semibold text-xl text-ink mt-8 mb-4">
            Lee el contrato con un abogado
          </h3>
          <p className="text-ink-2 leading-relaxed mb-6">
            Nunca firmes un contrato de preventa sin revisión legal independiente. Los puntos clave a revisar: cláusulas de entrega y penalidades por retraso, especificaciones técnicas prometidas, condiciones de escrituración y qué pasa si el proyecto no se concluye.
          </p>

          <h2 className="font-serif italic text-3xl text-ink mt-12 mb-6">
            Documentos que debes pedir al desarrollador
          </h2>
          <ol className="space-y-4 mb-10 text-ink-2">
            {[
              'Escritura del terreno o título de propiedad',
              'Constancia de no adeudo de impuesto predial',
              'Licencia de construcción vigente',
              'Planos arquitectónicos firmados y sellados',
              'Memoria descriptiva del proyecto',
              'Contrato de preventa o promesa de compraventa (borrador)',
              'Tabla de pagos detallada con fechas e importes',
              'Referencias de proyectos anteriores entregados',
              'Información de la fiduciaria (si aplica fideicomiso de garantía)',
              'RFC y acta constitutiva de la empresa desarrolladora',
            ].map((doc, i) => (
              <li key={i} className="flex gap-3">
                <span className="font-serif italic text-accent text-xl flex-shrink-0 leading-none">{String(i + 1).padStart(2, '0')}</span>
                <span>{doc}</span>
              </li>
            ))}
          </ol>

          <h2 className="font-serif italic text-3xl text-ink mt-12 mb-6">
            10 preguntas que debes hacerle al desarrollador
          </h2>
          <div className="space-y-4 mb-10">
            {[
              '¿Cuáles son los hitos de construcción y qué pasa si hay retraso?',
              '¿El precio incluye IVA? ¿Qué gastos de escrituración corresponden al comprador?',
              '¿Cuáles son las especificaciones exactas del acabado del local?',
              '¿Cuántos metros cuadrados son de construcción y cuántos de uso exclusivo?',
              '¿Hay cuotas de mantenimiento y cuál es el monto estimado?',
              '¿Qué tipo de mix comercial planean para la plaza?',
              '¿Hay restricciones de giro para mi local?',
              '¿Cuándo inicia y termina formalmente la etapa de preventa?',
              '¿Puedo ceder o vender mi contrato antes de la entrega si lo necesito?',
              '¿Qué garantías ofrece el desarrollador en caso de incumplimiento?',
            ].map((q, i) => (
              <div key={i} className="flex gap-3 p-4 bg-bg-soft rounded-xl border border-line">
                <span className="font-serif italic text-accent text-lg flex-shrink-0">{i + 1}.</span>
                <p className="text-ink-2">{q}</p>
              </div>
            ))}
          </div>

          <h2 className="font-serif italic text-3xl text-ink mt-12 mb-6">
            El proceso de compra en preventa paso a paso
          </h2>
          <ol className="space-y-6 mb-8">
            {[
              { n: '01', title: 'Visita el proyecto y evalúa la ubicación', body: 'Ir en persona a ver el terreno (aunque esté vacío) te da una perspectiva que ningún render puede dar: tráfico real, vecinos, accesos, competencia cercana.' },
              { n: '02', title: 'Solicita la información oficial del proyecto', body: 'Pide la carpeta de información: planos, precios, tabla de pagos, renders y memoria descriptiva. Compara con al menos 2 proyectos similares en la zona.' },
              { n: '03', title: 'Revisa el contrato con tu abogado', body: 'No omitas este paso. El costo de un abogado inmobiliario (tipicamente $3,000–$8,000 MXN) es insignificante comparado con lo que te puede salvar.' },
              { n: '04', title: 'Firma la promesa de compraventa y paga el enganche', body: 'Al firmar y pagar el enganche, el local queda reservado a tu nombre. Guarda todos los recibos y comprobantes de pago.' },
              { n: '05', title: 'Realiza los pagos de mensualidades según la tabla acordada', body: 'Mantén un registro de todos tus pagos. Algunos desarrolladores ofrecen recibos digitales o acceso a plataforma de seguimiento.' },
              { n: '06', title: 'Sigue el avance de obra', body: 'Un buen desarrollador te enviará reportes de avance fotográficos. Puedes pedir visitas a la obra en etapas clave.' },
              { n: '07', title: 'Liquidación y escrituración', body: 'Al momento de la entrega pagas el saldo pendiente y se procede a la escrituración ante notario. Aquí se formaliza la transferencia de propiedad.' },
            ].map((step) => (
              <li key={step.n} className="flex gap-4">
                <span className="font-serif italic text-3xl text-accent flex-shrink-0 leading-none">{step.n}</span>
                <div>
                  <strong className="block text-ink mb-1">{step.title}</strong>
                  <p className="text-ink-2 leading-relaxed">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <h2 className="font-serif italic text-3xl text-ink mt-12 mb-6">
            Preventa en Cancún 2026: las oportunidades disponibles
          </h2>
          <p className="text-ink-2 leading-relaxed mb-4">
            En este momento, <Link href="/locales-comerciales-cancun" className="text-accent hover:underline">Quattro Plaza Center</Link> tiene dos proyectos en preventa activa en Cancún:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 rounded-xl border border-line bg-bg-soft">
              <h3 className="font-sans font-bold text-ink mb-2">
                <Link href="/plazas/gardens" className="hover:text-accent transition-colors">Quattro Plaza Center Gardens</Link>
              </h3>
              <ul className="space-y-1 text-sm text-ink-2">
                <li>32 locales desde 32 m²</li>
                <li>Desde $1,968,600 MXN + IVA</li>
                <li>Enganche desde $147,000 MXN</li>
                <li>Entrega JUN–SEP 2027</li>
                <li>Diseño con vegetación integrada y áreas verdes</li>
              </ul>
            </div>
            <div className="p-6 rounded-xl border border-line bg-bg-soft">
              <h3 className="font-sans font-bold text-ink mb-2">
                <Link href="/plazas/long-island" className="hover:text-accent transition-colors">Quattro Plaza Center Long Island</Link>
              </h3>
              <ul className="space-y-1 text-sm text-ink-2">
                <li>30 locales desde 40 m²</li>
                <li>Desde $2,650,000 MXN + IVA</li>
                <li>120 m lineales de frente comercial</li>
                <li>Entrega DIC 2026–MAR 2027</li>
                <li>Entrega más próxima del mercado</li>
              </ul>
            </div>
          </div>

          <h2 className="font-serif italic text-3xl text-ink mt-12 mb-6">
            Conclusión: la preventa es para el inversionista informado
          </h2>
          <p className="text-ink-2 leading-relaxed mb-4">
            Comprar en preventa en Cancún es una de las estrategias de mayor retorno disponibles en el mercado inmobiliario mexicano — siempre y cuando se haga con información y diligencia. Los riesgos son reales pero gestionables: se mitigan eligiendo desarrolladores con historial, revisando documentos legales y firmando contratos claros.
          </p>
          <p className="text-ink-2 leading-relaxed mb-8">
            Si quieres aprender más sobre cómo evaluar una inversión en locales comerciales en Cancún, lee nuestra <Link href="/blog/como-invertir-en-locales-comerciales-en-cancun" className="text-accent hover:underline">Guía Completa de Inversión</Link> y nuestro análisis sobre <Link href="/blog/cuanto-cuesta-un-local-comercial-en-cancun" className="text-accent hover:underline">precios del mercado en 2026</Link>.
          </p>

          {/* Related articles */}
          <h2 className="font-serif italic text-2xl text-ink mt-16 mb-6">Artículos relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
            {[
              { slug: 'como-invertir-en-locales-comerciales-en-cancun', title: 'Cómo Invertir en Locales Comerciales en Cancún: Guía Completa', img: '/renders/gardens/01.jpg' },
              { slug: 'cuanto-cuesta-un-local-comercial-en-cancun', title: '¿Cuánto Cuesta un Local Comercial en Cancún en 2026?', img: '/renders/long-island/02.jpg' },
              { slug: 'local-comercial-vs-departamento-cancun', title: 'Local Comercial vs Departamento en Cancún', img: '/renders/long-island/01.jpg' },
            ].map((rel) => (
              <Link key={rel.slug} href={`/blog/${rel.slug}`} className="group rounded-xl overflow-hidden border border-line hover:shadow-md transition-shadow">
                <div className="relative aspect-video">
                  <Image src={rel.img} alt={rel.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="300px" />
                </div>
                <p className="p-4 text-sm font-semibold text-ink group-hover:text-accent transition-colors leading-snug">{rel.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </article>

      <div className="px-6">
        <div className="max-w-3xl mx-auto">
          <BlogCTA title="Entra en preventa antes de que se agoten los mejores locales" />
        </div>
      </div>
    </>
  );
}
