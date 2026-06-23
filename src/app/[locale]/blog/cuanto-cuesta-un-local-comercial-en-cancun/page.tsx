import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import BlogCTA from '@/components/BlogCTA';

export const metadata: Metadata = {
  title: '¿Cuánto Cuesta un Local Comercial en Cancún en 2026?',
  description:
    'Análisis completo de precios de locales comerciales en Cancún 2026: precio por m², rangos por zona, qué incluye el precio y cómo comparar ofertas del mercado.',
  keywords: [
    'precio local comercial cancun',
    'cuánto cuesta local cancun',
    'precio m2 local comercial cancun',
    'locales comerciales cancun 2026 precio',
  ],
  alternates: {
    canonical: 'https://www.quattroplaza.mx/blog/cuanto-cuesta-un-local-comercial-en-cancun',
  },
  openGraph: {
    title: '¿Cuánto Cuesta un Local Comercial en Cancún en 2026?',
    description: 'Precios reales de locales comerciales en Cancún por zona y m². Todo lo que necesitas saber antes de comprar.',
    url: 'https://www.quattroplaza.mx/blog/cuanto-cuesta-un-local-comercial-en-cancun',
    images: [{ url: 'https://www.quattroplaza.mx/blog/AdobeStock_804358854.jpeg', width: 1200, height: 630 }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '¿Cuánto Cuesta un Local Comercial en Cancún en 2026?',
  datePublished: '2026-06-23',
  dateModified: '2026-06-23',
  author: { '@type': 'Organization', name: 'Quattro Plaza Center' },
  publisher: {
    '@type': 'Organization',
    name: 'Quattro Plaza Center',
    logo: 'https://www.quattroplaza.mx/logos/logo-quattro.svg',
  },
  image: 'https://www.quattroplaza.mx/blog/AdobeStock_804358854.jpeg',
  mainEntityOfPage: 'https://www.quattroplaza.mx/blog/cuanto-cuesta-un-local-comercial-en-cancun',
};

const zonas = [
  { zona: 'Zona Hotelera', rango: '$80,000 – $150,000 /m²', perfil: 'Turístico premium, alta rotación', renta: '$900 – $1,500 /m²/mes' },
  { zona: 'Av. Tulum / Av. Kabah', rango: '$55,000 – $85,000 /m²', perfil: 'Comercial mixto, alta demanda', renta: '$550 – $800 /m²/mes' },
  { zona: 'SM 59–70 (corredores residenciales)', rango: '$40,000 – $65,000 /m²', perfil: 'Residencial + servicios, alta densidad', renta: '$400 – $600 /m²/mes' },
  { zona: 'Av. Huayacán / Periférico', rango: '$35,000 – $55,000 /m²', perfil: 'Zona consolidada, alta densidad residencial', renta: '$450 – $650 /m²/mes' },
  { zona: 'Plazas comerciales en preventa', rango: '$45,000 – $70,000 /m²', perfil: 'Mayor potencial de plusvalía', renta: '$500 – $700 /m²/mes (proyectado)' },
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
          src="/blog/AdobeStock_804358854.jpeg"
          alt="Precios de locales comerciales en Cancún — Quattro Plaza Center Long Island"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-10">
          <div className="container-wrap">
            <p className="eyebrow eyebrow-accent mb-3">Precios y Mercado</p>
            <h1 className="font-serif italic text-3xl md:text-5xl text-white max-w-3xl leading-tight">
              ¿Cuánto Cuesta un Local Comercial en Cancún en 2026?
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
            <li className="text-ink truncate max-w-[200px] md:max-w-none">¿Cuánto cuesta un local comercial en Cancún?</li>
          </ol>
        </div>
      </nav>

      {/* Content */}
      <article className="py-16 px-6">
        <div className="max-w-3xl mx-auto">

          <p className="text-lg text-ink-2 leading-relaxed mb-8">
            El precio de un local comercial en Cancún varía enormemente según la zona, el tamaño, el estado del inmueble (nuevo o usado) y si se compra en preventa o en el mercado secundario. En 2026, el rango va desde los $1,200,000 MXN para locales pequeños en zonas emergentes hasta más de $15,000,000 MXN para espacios prime en la Zona Hotelera.
          </p>
          <p className="text-ink-2 leading-relaxed mb-8">
            En este artículo desglosamos los precios reales del mercado, los factores que los determinan y cómo saber si lo que estás mirando es un buen precio o no.
          </p>

          <h2 className="font-serif italic text-3xl text-ink mt-12 mb-6">
            Precio por m² de locales comerciales en Cancún por zona
          </h2>
          <p className="text-ink-2 leading-relaxed mb-6">
            La siguiente tabla muestra los rangos actuales de precios por metro cuadrado y rentas estimadas en las principales zonas comerciales de Cancún:
          </p>

          <div className="overflow-x-auto mb-10 rounded-xl border border-line">
            <table className="w-full text-sm">
              <thead className="bg-bg-soft">
                <tr>
                  <th className="text-left p-4 font-semibold text-ink">Zona</th>
                  <th className="text-left p-4 font-semibold text-ink">Precio por m²</th>
                  <th className="text-left p-4 font-semibold text-ink hidden md:table-cell">Perfil</th>
                  <th className="text-left p-4 font-semibold text-ink hidden md:table-cell">Renta estimada</th>
                </tr>
              </thead>
              <tbody>
                {zonas.map((z, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-bg-soft/50'}>
                    <td className="p-4 text-ink font-medium">{z.zona}</td>
                    <td className="p-4 text-ink-2">{z.rango}</td>
                    <td className="p-4 text-ink-2 hidden md:table-cell">{z.perfil}</td>
                    <td className="p-4 text-ink-2 hidden md:table-cell">{z.renta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="font-serif italic text-3xl text-ink mt-12 mb-6">
            ¿Qué factores determinan el precio de un local comercial?
          </h2>

          <h3 className="font-sans font-semibold text-xl text-ink mt-8 mb-4">
            Ubicación dentro de la ciudad
          </h3>
          <p className="text-ink-2 leading-relaxed mb-6">
            La regla de oro del mercado inmobiliario aplica con más fuerza en los locales comerciales: ubicación, ubicación, ubicación. Un local sobre Av. Kabah puede costar el doble que uno similar en una calle paralela sin salida. El tráfico peatonal y vehicular es el factor número uno de valoración.
          </p>

          <h3 className="font-sans font-semibold text-xl text-ink mt-8 mb-4">
            Visibilidad y acceso
          </h3>
          <p className="text-ink-2 leading-relaxed mb-6">
            Un local en esquina, con amplio frente comercial y fácil acceso vehicular vale entre 15% y 25% más que uno en posición intermedia. Los locales de planta baja siempre tienen mayor demanda y precio que los de segundo nivel.
          </p>

          <h3 className="font-sans font-semibold text-xl text-ink mt-8 mb-4">
            Nuevo vs. usado
          </h3>
          <p className="text-ink-2 leading-relaxed mb-6">
            Los locales nuevos en plazas con diseño moderno generan rentas 20–35% más altas que locales usados del mismo tamaño. Los inquilinos comerciales — especialmente franquicias y marcas — prefieren espacios nuevos con instalaciones modernas, lo que reduce el tiempo de vacancia.
          </p>

          <h3 className="font-sans font-semibold text-xl text-ink mt-8 mb-4">
            Tamaño y formato
          </h3>
          <p className="text-ink-2 leading-relaxed mb-6">
            Paradójicamente, los locales pequeños (30–60 m²) suelen tener un mayor precio por m² que los grandes, porque hay más demanda de negocios que buscan espacios eficientes. Para una tienda, consultorio o cafetería, 40 m² bien diseñados son suficientes. Los locales de 100+ m² tienen menor demanda relativa y menor precio por m².
          </p>

          <h3 className="font-sans font-semibold text-xl text-ink mt-8 mb-4">
            Preventa vs. mercado secundario
          </h3>
          <p className="text-ink-2 leading-relaxed mb-6">
            Comprar en preventa puede significar un ahorro de 20–35% frente al precio de mercado una vez que el proyecto está terminado y en operación. Sin embargo, implica esperar el tiempo de construcción. Para quien no necesita el local de forma inmediata, la preventa es la opción con mayor potencial de plusvalía. Aprende más sobre esto en nuestra <Link href="/blog/guia-comprar-en-preventa-cancun" className="text-accent hover:underline">Guía para Comprar en Preventa en Cancún</Link>.
          </p>

          <h2 className="font-serif italic text-3xl text-ink mt-12 mb-6">
            Ejemplos de precios reales en 2026
          </h2>
          <p className="text-ink-2 leading-relaxed mb-6">
            Para que tengas referencias concretas, aquí algunos ejemplos de proyectos actualmente disponibles en el mercado de Cancún:
          </p>
          <div className="space-y-4 mb-10">
            {[
              { titulo: 'Local 32 m² en preventa — plaza nueva, zona norte', precio: 'Desde $1,968,600 MXN + IVA', eje: 'Quattro Plaza Center Gardens' },
              { titulo: 'Local 40 m² en preventa — frente comercial 120 m', precio: 'Desde $2,650,000 MXN + IVA', eje: 'Quattro Plaza Center Long Island' },
              { titulo: 'Local 50 m² usado — Av. Kabah, segundo nivel', precio: '$2,800,000 – $3,200,000 MXN', eje: 'Mercado secundario' },
              { titulo: 'Local 80 m² nuevo — Av. Tulum, planta baja', precio: '$5,500,000 – $7,000,000 MXN', eje: 'Mercado general' },
            ].map((ex, i) => (
              <div key={i} className="flex gap-4 p-5 bg-bg-soft rounded-xl border border-line">
                <div className="flex-1">
                  <p className="font-semibold text-ink mb-1">{ex.titulo}</p>
                  <p className="text-sm text-ink-3">{ex.eje}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-accent">{ex.precio}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-ink-2 text-sm leading-relaxed mb-8 italic">
            * Precios vigentes a junio 2026. Sujetos a cambio según disponibilidad.
          </p>

          <h2 className="font-serif italic text-3xl text-ink mt-12 mb-6">
            ¿Cómo saber si el precio que te ofrecen es justo?
          </h2>
          <p className="text-ink-2 leading-relaxed mb-4">
            Antes de decidir, compara al menos 3–5 opciones similares en la misma zona. Los aspectos clave a evaluar:
          </p>
          <ul className="space-y-3 mb-8 text-ink-2">
            <li className="flex gap-2"><span className="text-accent font-bold">→</span> <span>Precio por m² vs. el rango de mercado de esa zona</span></li>
            <li className="flex gap-2"><span className="text-accent font-bold">→</span> <span>Nivel de renta que puedes esperar razonablemente</span></li>
            <li className="flex gap-2"><span className="text-accent font-bold">→</span> <span>Tasa de vacancia histórica en la plaza o zona</span></li>
            <li className="flex gap-2"><span className="text-accent font-bold">→</span> <span>Plusvalía esperada basada en proyectos de infraestructura cercanos</span></li>
            <li className="flex gap-2"><span className="text-accent font-bold">→</span> <span>Condiciones de pago: enganche, mensualidades, precio de lista vs. descuento de contado</span></li>
          </ul>

          <h2 className="font-serif italic text-3xl text-ink mt-12 mb-6">
            Financiamiento: cuánto necesitas para entrar
          </h2>
          <p className="text-ink-2 leading-relaxed mb-4">
            No siempre es necesario tener el precio total del local. En proyectos en preventa como <Link href="/locales-comerciales-cancun" className="text-accent hover:underline">Quattro Plaza Center</Link>, puedes entrar con un enganche desde $147,000 MXN y pagar el resto en mensualidades durante la construcción.
          </p>
          <p className="text-ink-2 leading-relaxed mb-4">
            Las opciones de financiamiento más comunes en el mercado de locales comerciales en Cancún son:
          </p>
          <ul className="space-y-3 mb-8 text-ink-2">
            <li className="flex gap-2"><span className="text-accent font-bold">→</span> <span><strong>Financiamiento directo del desarrollador:</strong> Enganche + mensualidades + liquidación al momento de la entrega.</span></li>
            <li className="flex gap-2"><span className="text-accent font-bold">→</span> <span><strong>Crédito bancario o hipoteca comercial:</strong> Requiere mayor trámite pero libera capital propio.</span></li>
            <li className="flex gap-2"><span className="text-accent font-bold">→</span> <span><strong>Pago de contado:</strong> Generalmente obtiene descuentos adicionales de 5–10%.</span></li>
          </ul>

          <h2 className="font-serif italic text-3xl text-ink mt-12 mb-6">
            Conclusión: el precio es solo el principio
          </h2>
          <p className="text-ink-2 leading-relaxed mb-4">
            En el mercado de locales comerciales en Cancún, el precio de compra es importante, pero lo que realmente determina si fue una buena inversión es la combinación de renta generada + plusvalía a lo largo del tiempo. Un local bien ubicado a $2,000,000 MXN puede ser mejor inversión que uno a $1,500,000 MXN en una zona con poco tráfico.
          </p>
          <p className="text-ink-2 leading-relaxed mb-8">
            La clave es entender el mercado, comparar correctamente y actuar con información. Si quieres aprender más sobre cómo invertir en locales comerciales en Cancún, lee nuestra <Link href="/blog/como-invertir-en-locales-comerciales-en-cancun" className="text-accent hover:underline">Guía Completa de Inversión en Locales Comerciales</Link>.
          </p>

          {/* Related articles */}
          <h2 className="font-serif italic text-2xl text-ink mt-16 mb-6">Artículos relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
            {[
              { slug: 'como-invertir-en-locales-comerciales-en-cancun', title: 'Cómo Invertir en Locales Comerciales en Cancún: Guía Completa 2026', img: '/blog/AdobeStock_663402090.jpeg' },
              { slug: 'mejores-zonas-para-negocio-en-cancun', title: 'Las Mejores Zonas para Poner un Negocio en Cancún', img: '/blog/AdobeStock_841077811.jpeg' },
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
          <BlogCTA title="¿Buscas un local a buen precio en Cancún?" />
        </div>
      </div>
    </>
  );
}
