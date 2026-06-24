import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import BlogCTA from '@/components/BlogCTA';

export const metadata: Metadata = {
  title: 'Por Qué Invertir en Cancún desde Monterrey, CDMX o Guadalajara',
  description:
    'Si vives en Monterrey, CDMX o Guadalajara y buscas invertir en bienes raíces, Cancún ofrece rendimientos superiores, precios de entrada más bajos y plusvalía del Caribe. Aquí te explicamos cómo hacerlo.',
  keywords: [
    'invertir en cancun desde monterrey',
    'invertir en cancun desde cdmx',
    'inversión inmobiliaria cancun fuera de la ciudad',
    'locales comerciales cancun inversionista',
    'bienes raices cancun monterrey',
    'invertir en cancun sin vivir ahi',
  ],
  alternates: {
    canonical: 'https://www.quattroplaza.mx/blog/invertir-en-cancun-desde-monterrey-cdmx',
  },
  openGraph: {
    title: 'Por Qué Invertir en Cancún desde Monterrey, CDMX o Guadalajara',
    description: 'Cancún ofrece mayor rendimiento y menor precio de entrada que Monterrey, CDMX o GDL. Todo lo que necesitas saber para invertir sin vivir allá.',
    url: 'https://www.quattroplaza.mx/blog/invertir-en-cancun-desde-monterrey-cdmx',
    images: [{ url: 'https://www.quattroplaza.mx/blog/AdobeStock_841077811.jpeg', width: 1200, height: 630 }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Por Qué Invertir en Cancún desde Monterrey, CDMX o Guadalajara',
  datePublished: '2026-06-23',
  dateModified: '2026-06-23',
  author: { '@type': 'Organization', name: 'Quattro Plaza Center' },
  publisher: {
    '@type': 'Organization',
    name: 'Quattro Plaza Center',
    logo: 'https://www.quattroplaza.mx/logos/logo-quattro.svg',
  },
  image: 'https://www.quattroplaza.mx/blog/AdobeStock_841077811.jpeg',
  mainEntityOfPage: 'https://www.quattroplaza.mx/blog/invertir-en-cancun-desde-monterrey-cdmx',
};

const comparativa = [
  { ciudad: 'Monterrey (San Pedro)', precio: '$90,000–$140,000/m²', renta: '$400–$600/m²/mes', plusvalia: '6–9% anual' },
  { ciudad: 'CDMX (Polanco / Condesa)', precio: '$80,000–$160,000/m²', renta: '$450–$700/m²/mes', plusvalia: '5–8% anual' },
  { ciudad: 'Guadalajara (Zapopan)', precio: '$60,000–$100,000/m²', renta: '$350–$550/m²/mes', plusvalia: '6–9% anual' },
  { ciudad: 'Cancún (corredor Huayacán)', precio: '$35,000–$55,000/m²', renta: '$450–$650/m²/mes', plusvalia: '10–15% anual' },
];

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
          src="/blog/AdobeStock_841077811.jpeg"
          alt="Invertir en Cancún desde Monterrey CDMX o Guadalajara — Quattro Plaza Center"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-10">
          <div className="container-wrap">
            <p className="eyebrow eyebrow-accent mb-3">Inversión desde el Norte</p>
            <h1 className="font-serif italic text-3xl md:text-5xl text-white max-w-3xl leading-tight">
              Por Qué Invertir en Cancún desde Monterrey, CDMX o Guadalajara
            </h1>
            <div className="flex items-center gap-4 mt-4 text-white/60 text-sm">
              <span>23 de junio de 2026</span>
              <span>·</span>
              <span>8 min de lectura</span>
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
            <li className="text-ink truncate max-w-[200px] md:max-w-none">Invertir en Cancún desde Monterrey o CDMX</li>
          </ol>
        </div>
      </nav>

      {/* Content */}
      <article className="py-16 px-6">
        <div className="max-w-3xl mx-auto">

          <p className="text-lg text-ink-2 leading-relaxed mb-8">
            Si vives en Monterrey, CDMX o Guadalajara y estás buscando dónde poner tu dinero a trabajar, probablemente ya sabes que el mercado inmobiliario en tu ciudad está caro, saturado y con rendimientos cada vez más comprimidos. Lo que quizás no has calculado es que a 2 horas de avión existe un mercado donde el precio de entrada es hasta 3 veces menor, la plusvalía duplica la nacional y puedes generar renta desde el primer día sin mudarte.
          </p>
          <p className="text-ink-2 leading-relaxed mb-8">
            Ese mercado es Cancún. Y no estamos hablando del Cancún turístico de la Zona Hotelera: hablamos de los corredores comerciales donde vive y consume más de un millón de residentes permanentes, con una demanda de locales comerciales que supera con creces la oferta disponible.
          </p>

          <h2 className="font-serif italic text-3xl text-ink mt-12 mb-6">
            El problema de invertir en tu propia ciudad
          </h2>
          <p className="text-ink-2 leading-relaxed mb-4">
            Los inversionistas en Monterrey, CDMX y Guadalajara enfrentan el mismo dilema: los precios subieron tanto en la última década que el rendimiento por renta ya no justifica la inversión. Un local en San Pedro Garza García puede costar $120,000/m² y rentar a $500/m²/mes — un rendimiento bruto de apenas 5% anual. Antes de considerar mantenimiento, vacancia e impuestos, estás por debajo de lo que ofrece un CETE.
          </p>
          <p className="text-ink-2 leading-relaxed mb-8">
            Cancún tiene la ecuación inversa: precios de entrada bajos, rentas altas en relación al valor del inmueble y una plusvalía histórica que ha superado el 12% anual en los últimos cinco años. Es el mercado que Monterrey y CDMX fueron hace 20 años.
          </p>

          <h2 className="font-serif italic text-3xl text-ink mt-12 mb-6">
            Comparativa: rendimientos por ciudad
          </h2>
          <p className="text-ink-2 leading-relaxed mb-6">
            La siguiente tabla compara el mercado de locales comerciales en las principales ciudades del país frente a Cancún:
          </p>

          <div className="overflow-x-auto mb-10 rounded-xl border border-line">
            <table className="w-full text-sm">
              <thead className="bg-bg-soft">
                <tr>
                  <th className="text-left p-4 font-semibold text-ink">Ciudad / Zona</th>
                  <th className="text-left p-4 font-semibold text-ink">Precio por m²</th>
                  <th className="text-left p-4 font-semibold text-ink hidden md:table-cell">Renta estimada</th>
                  <th className="text-left p-4 font-semibold text-ink hidden md:table-cell">Plusvalía anual</th>
                </tr>
              </thead>
              <tbody>
                {comparativa.map((r, i) => (
                  <tr key={i} className={`${i % 2 === 0 ? 'bg-white' : 'bg-bg-soft/50'} ${i === comparativa.length - 1 ? 'font-semibold text-accent' : ''}`}>
                    <td className="p-4 text-ink">{r.ciudad}</td>
                    <td className="p-4 text-ink-2">{r.precio}</td>
                    <td className="p-4 text-ink-2 hidden md:table-cell">{r.renta}</td>
                    <td className="p-4 text-ink-2 hidden md:table-cell">{r.plusvalia}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-ink-2 leading-relaxed mb-8 text-sm italic">
            Fuente: estimaciones de mercado basadas en datos de Lamudi, Inmuebles24 y operaciones propias de Tresor Real Estate. 2025–2026.
          </p>

          <h2 className="font-serif italic text-3xl text-ink mt-12 mb-6">
            ¿Por qué Cancún crece más rápido que tu ciudad?
          </h2>

          <h3 className="font-sans font-semibold text-xl text-ink mt-8 mb-4">
            1. Migración interna récord
          </h3>
          <p className="text-ink-2 leading-relaxed mb-6">
            Cancún recibe cada año miles de familias del interior del país — muchas de ellas de Monterrey, CDMX y Guadalajara — en busca de empleo, clima y calidad de vida. Esta población nueva necesita servicios, comercios y espacios donde consumir. La demanda de locales comerciales crece con cada familia que llega.
          </p>

          <h3 className="font-sans font-semibold text-xl text-ink mt-8 mb-4">
            2. Escasez de suelo en corredores consolidados
          </h3>
          <p className="text-ink-2 leading-relaxed mb-6">
            A diferencia de ciudades del norte donde aún hay expansión horizontal disponible, los corredores comerciales de Cancún como Av. Huayacán o Av. Kabah tienen cada vez menos terrenos disponibles para desarrollo. Esa escasez presiona los precios al alza de forma estructural — no cíclica.
          </p>

          <h3 className="font-sans font-semibold text-xl text-ink mt-8 mb-4">
            3. Turismo como piso mínimo de demanda
          </h3>
          <p className="text-ink-2 leading-relaxed mb-6">
            El turismo no es la razón principal para invertir en locales en Cancún — es el seguro. Con más de 8 millones de visitantes al año, la economía local nunca está en cero. Incluso en años de contracción, la actividad turística sostiene el consumo y la demanda de servicios.
          </p>

          <h3 className="font-sans font-semibold text-xl text-ink mt-8 mb-4">
            4. El Tren Maya como catalizador de largo plazo
          </h3>
          <p className="text-ink-2 leading-relaxed mb-6">
            La conectividad de Cancún con Mérida, Playa del Carmen, Tulum y la Riviera Maya a través del Tren Maya amplía el radio de influencia económica de la ciudad. Los inversionistas que entran hoy están comprando antes de que ese efecto se refleje plenamente en los precios.
          </p>

          <h2 className="font-serif italic text-3xl text-ink mt-12 mb-6">
            ¿Se puede invertir en Cancún sin vivir allá?
          </h2>
          <p className="text-ink-2 leading-relaxed mb-4">
            Sí, y de hecho es lo que hace la mayoría de los inversionistas foráneos. El proceso es completamente remoto hasta el momento de firmar escrituras — y eso también puede hacerse por poder notarial si prefieres no viajar.
          </p>
          <p className="text-ink-2 leading-relaxed mb-8">
            El flujo típico de un inversionista de Monterrey o CDMX que compra en Cancún es:
          </p>

          <ol className="space-y-6 mb-8">
            {[
              { n: '01', title: 'Primera videollamada con el asesor', body: 'Conoces el proyecto, ves los planos, precios y disponibilidad. Todo esto se hace por Zoom sin necesidad de viajar.' },
              { n: '02', title: 'Visita al proyecto (opcional pero recomendable)', body: 'Con un vuelo de 2 horas y una tarde en Cancún puedes conocer el terreno, la maqueta y la zona. Muchos lo hacen un fin de semana.' },
              { n: '03', title: 'Apartado y contrato remoto', body: 'El apartado se hace con transferencia bancaria. El contrato de promesa de compraventa se firma de forma digital o por mensajería certificada.' },
              { n: '04', title: 'Mensualidades durante la construcción', body: 'Pagas mensualidades cómodas sin intereses mientras el proyecto avanza. No tienes que estar presente.' },
              { n: '05', title: 'Entrega y escrituración', body: 'A la entrega, o acudes o mandas un representante con poder notarial. El local queda a tu nombre y listo para rentar.' },
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
            ¿Y quién administra el local cuando no estoy?
          </h2>
          <p className="text-ink-2 leading-relaxed mb-4">
            Esta es la pregunta más frecuente de los inversionistas foráneos — y tiene respuesta sencilla: un <strong>administrador de propiedades local</strong>. En Cancún existen gestores especializados que por entre el 8% y el 12% de la renta mensual se encargan de todo: buscar inquilino, cobrar renta, gestionar mantenimiento menor y reportarte el estado del local.
          </p>
          <p className="text-ink-2 leading-relaxed mb-8">
            Con ese modelo, un local en <Link href="/plazas/gardens" className="text-accent hover:underline">Quattro Plaza Center Gardens</Link> puede generar flujo de caja positivo desde el primer mes de operación, completamente remoto desde tu ciudad.
          </p>

          <h2 className="font-serif italic text-3xl text-ink mt-12 mb-6">
            El argumento financiero en números concretos
          </h2>
          <p className="text-ink-2 leading-relaxed mb-4">
            Supongamos que tienes $2,000,000 MXN para invertir. Esto es lo que obtienes en cada mercado:
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-10">
            {[
              {
                ciudad: 'Monterrey',
                desc: '~16 m² en una zona secundaria. Renta estimada: $9,000–$11,000/mes.',
                rendimiento: '5.4–6.6% anual',
                bad: true,
              },
              {
                ciudad: 'CDMX',
                desc: '~14 m² en colonia media. Renta estimada: $8,500–$10,000/mes.',
                rendimiento: '5.1–6.0% anual',
                bad: true,
              },
              {
                ciudad: 'Cancún (Quattro)',
                desc: 'Local completo desde 32 m² en plaza premium. Renta estimada: $20,000–$25,000/mes.',
                rendimiento: '12–15% anual',
                bad: false,
              },
            ].map((c) => (
              <div key={c.ciudad} className={`rounded-xl border p-6 ${c.bad ? 'border-line bg-bg-soft' : 'border-accent bg-accent/5'}`}>
                <p className={`font-semibold text-base mb-2 ${c.bad ? 'text-ink' : 'text-accent'}`}>{c.ciudad}</p>
                <p className="text-ink-2 text-sm leading-relaxed mb-4">{c.desc}</p>
                <p className={`text-sm font-bold ${c.bad ? 'text-ink-3' : 'text-accent'}`}>Rendimiento bruto: {c.rendimiento}</p>
              </div>
            ))}
          </div>

          <h2 className="font-serif italic text-3xl text-ink mt-12 mb-6">
            Quattro Plaza Center: la opción concreta para el inversionista foráneo
          </h2>
          <p className="text-ink-2 leading-relaxed mb-4">
            <Link href="/invertir-en-cancun" className="text-accent hover:underline">Quattro Plaza Center</Link> tiene dos plazas comerciales en preventa en Cancún diseñadas exactamente para el perfil del inversionista que no vive en la ciudad: proceso 100% remoto, asesor dedicado, plan de pagos durante la construcción y entrega llave en mano.
          </p>
          <ul className="space-y-3 mb-6 text-ink-2">
            <li className="flex gap-2"><span className="text-accent font-bold">→</span> <span><Link href="/plazas/gardens" className="text-accent hover:underline font-semibold">Gardens</Link>: 32 locales desde 32 m² · Precio desde $1,968,600 MXN + IVA · Entrega JUN–SEP 2027</span></li>
            <li className="flex gap-2"><span className="text-accent font-bold">→</span> <span><Link href="/plazas/long-island" className="text-accent hover:underline font-semibold">Long Island</Link>: 30 locales desde 40 m² · 120 m frente comercial · Entrega DIC 2026–MAR 2027</span></li>
          </ul>
          <p className="text-ink-2 leading-relaxed mb-8">
            Enganche desde $147,000 MXN y mensualidades sin intereses durante la obra. Un asesor te atiende por Zoom, WhatsApp o presencialmente si decides hacer la visita.
          </p>

          <h2 className="font-serif italic text-3xl text-ink mt-12 mb-6">
            La ventana de oportunidad se cierra
          </h2>
          <p className="text-ink-2 leading-relaxed mb-4">
            Los inversionistas de otras ciudades que ya descubrieron Cancún están comprando. Los locales con mejor ubicación dentro de cada plaza se van primero — no porque haya prisa artificial, sino porque la oferta es limitada y la demanda va en aumento.
          </p>
          <p className="text-ink-2 leading-relaxed mb-8">
            Si en tu ciudad ya perdiste el momento de comprar antes de que subieran los precios, Cancún es esa oportunidad que todavía existe. Pero como todo mercado en crecimiento acelerado, el reloj corre.
          </p>

          {/* Related articles */}
          <h2 className="font-serif italic text-2xl text-ink mt-16 mb-6">Artículos relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
            {[
              { slug: 'como-invertir-en-locales-comerciales-en-cancun', title: 'Cómo Invertir en Locales Comerciales en Cancún: Guía Completa 2026', img: '/blog/AdobeStock_663402090.jpeg' },
              { slug: 'cuanto-cuesta-un-local-comercial-en-cancun', title: '¿Cuánto Cuesta un Local Comercial en Cancún en 2026?', img: '/blog/AdobeStock_664567241.jpeg' },
              { slug: 'local-comercial-vs-departamento-cancun', title: 'Local Comercial vs Departamento en Cancún', img: '/blog/AdobeStock_680719717.jpeg' },
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
          <BlogCTA />
        </div>
      </div>
    </>
  );
}
