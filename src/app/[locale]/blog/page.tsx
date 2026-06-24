import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Guía de Inversión en Locales Comerciales en Cancún',
  description:
    'Artículos, análisis y guías para invertir con éxito en locales comerciales en Cancún. Aprende sobre precios, zonas, preventa y más.',
  keywords: [
    'blog locales comerciales cancun',
    'inversión inmobiliaria cancun',
    'guia comprar local cancun',
    'locales comerciales cancun 2026',
  ],
  alternates: {
    canonical: 'https://www.quattroplaza.mx/blog',
  },
  openGraph: {
    title: 'Blog — Guía de Inversión en Locales Comerciales en Cancún',
    description:
      'Artículos expertos sobre inversión en locales comerciales en Cancún: precios, zonas, preventa y análisis del mercado.',
    url: 'https://www.quattroplaza.mx/blog',
    images: [{ url: 'https://www.quattroplaza.mx/blog/AdobeStock_791905652.jpeg', width: 1200, height: 630 }],
  },
};

const articles = [
  {
    slug: 'como-invertir-en-locales-comerciales-en-cancun',
    title: 'Cómo Invertir en Locales Comerciales en Cancún: Guía Completa 2026',
    description:
      'Todo lo que necesitas saber para invertir en locales comerciales en Cancún: desde elegir la ubicación correcta hasta entender el retorno de inversión.',
    image: '/blog/AdobeStock_791905652.jpeg',
    readTime: '8 min',
    date: '23 de junio de 2026',
  },
  {
    slug: 'cuanto-cuesta-un-local-comercial-en-cancun',
    title: '¿Cuánto Cuesta un Local Comercial en Cancún en 2026?',
    description:
      'Análisis detallado de precios por zona, m² y tipo de local en Cancún. Conoce el rango actual del mercado y qué factores influyen en el precio.',
    image: '/blog/AdobeStock_804358854.jpeg',
    readTime: '7 min',
    date: '10 de junio de 2026',
  },
  {
    slug: 'mejores-zonas-para-negocio-en-cancun',
    title: 'Las Mejores Zonas para Poner un Negocio en Cancún',
    description:
      'Comparativa de las principales zonas comerciales de Cancún: tráfico peatonal, tipo de cliente, precios y potencial de crecimiento.',
    image: '/blog/AdobeStock_838554951.jpeg',
    readTime: '7 min',
    date: '20 de mayo de 2026',
  },
  {
    slug: 'local-comercial-vs-departamento-cancun',
    title: 'Local Comercial vs Departamento en Cancún: ¿Qué Conviene Más como Inversión?',
    description:
      'Comparamos rendimientos, riesgos, plusvalía y flujo de caja entre locales comerciales y departamentos en Cancún para que tomes la mejor decisión.',
    image: '/blog/AdobeStock_862766615.jpeg',
    readTime: '7 min',
    date: '15 de abril de 2026',
  },
  {
    slug: 'guia-comprar-en-preventa-cancun',
    title: 'Guía para Comprar en Preventa en Cancún: Todo lo que Debes Saber',
    description:
      'Ventajas, riesgos y pasos para comprar un local comercial en preventa en Cancún. Incluye checklist y preguntas clave que debes hacerle al desarrollador.',
    image: '/blog/AdobeStock_887006964.jpeg',
    readTime: '7 min',
    date: '3 de marzo de 2026',
  },
  {
    slug: 'invertir-en-cancun-desde-monterrey-cdmx',
    title: 'Por Qué Invertir en Cancún desde Monterrey, CDMX o Guadalajara',
    description:
      'Si buscas rendimientos mayores que en tu ciudad, Cancún ofrece locales comerciales desde .96 MDP con plusvalía de 10–15% anual y proceso 100% remoto.',
    image: '/blog/AdobeStock_841077811.jpeg',
    readTime: '8 min',
    date: '23 de junio de 2026',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Blog — Inversión en Locales Comerciales en Cancún',
  url: 'https://www.quattroplaza.mx/blog',
  itemListElement: articles.map((a, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    url: `https://www.quattroplaza.mx/blog/${a.slug}`,
    name: a.title,
  })),
};

export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="bg-ink text-white py-20 overflow-hidden">
        <div className="container-wrap grid md:grid-cols-[1fr_400px] gap-12 items-center">
          <div>
            <p className="eyebrow eyebrow-accent mb-4">Blog</p>
            <h1 className="font-serif italic text-4xl md:text-5xl lg:text-6xl mb-4 leading-tight">
              Guía de Inversión en Locales Comerciales en Cancún
            </h1>
            <p className="text-white/60 text-lg max-w-xl">
              Análisis, guías y consejos para tomar mejores decisiones de inversión inmobiliaria en Cancún.
            </p>
          </div>
          {/* collage 2 fotos */}
          <div className="hidden md:grid grid-cols-2 gap-3 h-64">
            <div className="relative rounded-xl overflow-hidden">
              <Image
                src="/blog/AdobeStock_656227413.jpeg"
                alt="Inversión inmobiliaria en Cancún"
                fill sizes="200px"
                className="object-cover"
              />
            </div>
            <div className="relative rounded-xl overflow-hidden mt-8">
              <Image
                src="/blog/AdobeStock_811104407.jpeg"
                alt="Locales comerciales en Cancún"
                fill sizes="200px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Articles grid */}
      <section className="py-20 px-6">
        <div className="container-wrap">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group flex flex-col rounded-2xl overflow-hidden border border-line hover:shadow-xl transition-shadow"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 text-xs text-ink-3 mb-3">
                    <span>{article.date}</span>
                    <span>·</span>
                    <span>{article.readTime} de lectura</span>
                  </div>
                  <h2 className="font-serif italic text-xl text-ink leading-snug mb-3 group-hover:text-accent transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-ink-2 text-sm leading-relaxed flex-1">{article.description}</p>
                  <span className="mt-4 text-sm font-semibold text-accent">Leer artículo →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
