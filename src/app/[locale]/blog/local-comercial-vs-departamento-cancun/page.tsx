import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import BlogCTA from '@/components/BlogCTA';

export const metadata: Metadata = {
  title: 'Local Comercial vs Departamento en Cancún: ¿Qué Conviene Más como Inversión?',
  description:
    'Comparamos local comercial vs departamento en Cancún: rendimiento por renta, plusvalía, riesgos, gestión y retorno total. ¿Cuál es la mejor inversión en 2026?',
  keywords: [
    'local comercial vs departamento cancun',
    'mejor inversion cancun',
    'rendimiento local vs departamento cancun',
    'invertir cancun 2026',
  ],
  alternates: {
    canonical: 'https://www.quattroplaza.mx/blog/local-comercial-vs-departamento-cancun',
  },
  openGraph: {
    title: 'Local Comercial vs Departamento en Cancún: ¿Qué Conviene Más como Inversión?',
    description: 'Análisis objetivo entre invertir en local comercial o departamento en Cancún. Rendimientos, riesgos y qué conviene según tu perfil.',
    url: 'https://www.quattroplaza.mx/blog/local-comercial-vs-departamento-cancun',
    images: [{ url: 'https://www.quattroplaza.mx/renders/long-island/01.jpg', width: 1200, height: 630 }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Local Comercial vs Departamento en Cancún: ¿Qué Conviene Más como Inversión?',
  datePublished: '2026-06-23',
  dateModified: '2026-06-23',
  author: { '@type': 'Organization', name: 'Quattro Plaza Center' },
  publisher: {
    '@type': 'Organization',
    name: 'Quattro Plaza Center',
    logo: 'https://www.quattroplaza.mx/logos/logo-quattro.svg',
  },
  image: 'https://www.quattroplaza.mx/renders/long-island/01.jpg',
  mainEntityOfPage: 'https://www.quattroplaza.mx/blog/local-comercial-vs-departamento-cancun',
};

const comparacion = [
  { aspecto: 'Rendimiento por renta (anual)', local: '8% – 12%', depto: '4% – 7%', ganador: 'local' },
  { aspecto: 'Duración típica del contrato', local: '2 – 5 años', depto: '1 – 2 años', ganador: 'local' },
  { aspecto: 'Plusvalía anual estimada', local: '10% – 18%', depto: '8% – 14%', ganador: 'local' },
  { aspecto: 'Facilidad para encontrar inquilino', local: 'Media (depende de zona)', depto: 'Alta', ganador: 'depto' },
  { aspecto: 'Gestión del inmueble', local: 'Baja (menos mantenimiento)', depto: 'Mayor (desgaste físico)', ganador: 'local' },
  { aspecto: 'Precio de entrada mínimo', local: '$1,968,600 MXN (preventa)', depto: '$2,200,000 MXN (zona media)', ganador: 'empate' },
  { aspecto: 'Mercado de reventa', local: 'Menor liquidez', depto: 'Mayor liquidez', ganador: 'depto' },
  { aspecto: 'Riesgo de impago', local: 'Menor (negocios establecidos)', depto: 'Moderado', ganador: 'local' },
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
          src="/renders/long-island/01.jpg"
          alt="Local comercial vs departamento en Cancún — comparativa de inversión"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-10">
          <div className="container-wrap">
            <p className="eyebrow eyebrow-accent mb-3">Análisis de Inversión</p>
            <h1 className="font-serif italic text-3xl md:text-5xl text-white max-w-3xl leading-tight">
              Local Comercial vs Departamento en Cancún: ¿Qué Conviene Más como Inversión?
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
            <li className="text-ink truncate max-w-[200px] md:max-w-none">Local comercial vs departamento en Cancún</li>
          </ol>
        </div>
      </nav>

      {/* Content */}
      <article className="py-16 px-6">
        <div className="max-w-3xl mx-auto">

          <p className="text-lg text-ink-2 leading-relaxed mb-8">
            Si tienes capital disponible para invertir en bienes raíces en Cancún, es probable que te hayas hecho esta pregunta: ¿conviene más comprar un local comercial o un departamento? Es una de las decisiones más importantes — y la respuesta no es simple, porque depende de tu perfil como inversionista, tu horizonte de tiempo y lo que buscas: flujo de caja inmediato, plusvalía a largo plazo o una combinación de ambos.
          </p>
          <p className="text-ink-2 leading-relaxed mb-8">
            En este análisis comparamos ambas opciones de forma objetiva, con datos reales del mercado de Cancún en 2026.
          </p>

          <h2 className="font-serif italic text-3xl text-ink mt-12 mb-6">
            Tabla comparativa: local comercial vs departamento en Cancún
          </h2>
          <div className="overflow-x-auto mb-10 rounded-xl border border-line">
            <table className="w-full text-sm">
              <thead className="bg-bg-soft">
                <tr>
                  <th className="text-left p-4 font-semibold text-ink">Aspecto</th>
                  <th className="text-left p-4 font-semibold text-accent">Local Comercial</th>
                  <th className="text-left p-4 font-semibold text-ink">Departamento</th>
                </tr>
              </thead>
              <tbody>
                {comparacion.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-bg-soft/50'}>
                    <td className="p-4 text-ink-2 font-medium">{row.aspecto}</td>
                    <td className={`p-4 font-semibold ${row.ganador === 'local' ? 'text-accent' : 'text-ink-2'}`}>{row.local}</td>
                    <td className={`p-4 font-semibold ${row.ganador === 'depto' ? 'text-accent' : 'text-ink-2'}`}>{row.depto}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="font-serif italic text-3xl text-ink mt-12 mb-6">
            Rendimiento por renta: los locales ganan por amplio margen
          </h2>
          <p className="text-ink-2 leading-relaxed mb-4">
            El rendimiento por renta anual es el factor más importante para quienes buscan flujo de caja pasivo. En Cancún, los locales comerciales bien ubicados generan entre el 8% y el 12% anual sobre su valor, mientras que los departamentos promedian entre 4% y 7%.
          </p>
          <p className="text-ink-2 leading-relaxed mb-4">
            Ejemplo concreto: un local de $2,000,000 MXN bien ubicado puede rentar por $18,000–$20,000/mes ($216,000–$240,000 anuales), un rendimiento del 10.8%–12%. Un departamento de $2,200,000 MXN en una zona similar renta típicamente entre $12,000 y $15,000/mes, un rendimiento del 6.5%–8.2%.
          </p>
          <p className="text-ink-2 leading-relaxed mb-8">
            La diferencia se amplia si consideramos que los contratos comerciales son más largos (2–5 años) y tienen cláusulas de incremento de renta ligadas a la inflación, lo que protege el rendimiento real del inversionista.
          </p>

          <h2 className="font-serif italic text-3xl text-ink mt-12 mb-6">
            Plusvalía: ambos suben, pero los locales más en zonas emergentes
          </h2>
          <p className="text-ink-2 leading-relaxed mb-4">
            El mercado residencial de Cancún ha mostrado plusvalías históricas de 8%–14% anual, especialmente en zonas como la Zona Hotelera y los corredores de Av. Bonampak. Los departamentos de gama media-alta en zonas consolidadas tienen un mercado de reventa líquido.
          </p>
          <p className="text-ink-2 leading-relaxed mb-4">
            Los locales comerciales en plazas nuevas bien ubicadas han superado esas cifras, con apreciaciones de 15%–20% anual entre la fecha de preventa y la entrega del proyecto. La escasez de locales bien diseñados en zonas con crecimiento poblacional crea un premio de escasez que no existe en el mercado residencial.
          </p>
          <p className="text-ink-2 leading-relaxed mb-8">
            Para entender los precios actuales del mercado de locales, lee nuestro análisis sobre <Link href="/blog/cuanto-cuesta-un-local-comercial-en-cancun" className="text-accent hover:underline">cuánto cuesta un local comercial en Cancún</Link>.
          </p>

          <h2 className="font-serif italic text-3xl text-ink mt-12 mb-6">
            Gestión del inmueble: locales requieren menos trabajo
          </h2>
          <p className="text-ink-2 leading-relaxed mb-4">
            Una ventaja que se pasa por alto frecuentemente: los locales comerciales son mucho más fáciles de gestionar que los departamentos. Los inquilinos residenciales cambian con más frecuencia, requieren más mantenimiento (pintura, plomería, electrodomésticos) y el desgaste físico del inmueble es mayor.
          </p>
          <p className="text-ink-2 leading-relaxed mb-4">
            Un negocio que renta tu local tiene incentivo propio de cuidarlo bien: es su imagen de cara a sus propios clientes. Además, los contratos comerciales pueden incluir cláusulas de responsabilidad del inquilino sobre el mantenimiento del espacio.
          </p>
          <p className="text-ink-2 leading-relaxed mb-8">
            Para el inversionista que no quiere pasar horas respondiendo reportes de mantenimiento, el local comercial es la opción de menor estrés operativo.
          </p>

          <h2 className="font-serif italic text-3xl text-ink mt-12 mb-6">
            ¿Dónde gana el departamento?
          </h2>
          <p className="text-ink-2 leading-relaxed mb-4">
            Sería injusto no reconocer los puntos a favor del departamento:
          </p>
          <ul className="space-y-3 mb-8 text-ink-2">
            <li className="flex gap-2"><span className="text-accent font-bold">→</span> <span><strong>Mayor liquidez en la reventa:</strong> Hay más compradores potenciales para departamentos que para locales comerciales en el mercado secundario.</span></li>
            <li className="flex gap-2"><span className="text-accent font-bold">→</span> <span><strong>Mercado de renta a corto plazo (Airbnb):</strong> En la Zona Hotelera, un departamento bien gestionado en plataformas de renta vacacional puede generar rendimientos muy altos, aunque con mayor involucramiento operativo.</span></li>
            <li className="flex gap-2"><span className="text-accent font-bold">→</span> <span><strong>Financiamiento más accesible:</strong> Los créditos hipotecarios para vivienda tienen mejores tasas y plazos que el crédito comercial.</span></li>
            <li className="flex gap-2"><span className="text-accent font-bold">→</span> <span><strong>Uso personal como alternativa:</strong> Si el negocio de renta no funciona, puedes habitarlo tú mismo o prestarlo a familiares.</span></li>
          </ul>

          <h2 className="font-serif italic text-3xl text-ink mt-12 mb-6">
            ¿Para qué perfil de inversionista es cada opción?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="p-6 rounded-xl border border-accent/30 bg-accent/5">
              <h3 className="font-sans font-bold text-ink mb-3">Local comercial es mejor si...</h3>
              <ul className="space-y-2 text-ink-2 text-sm">
                <li>• Buscas el mayor rendimiento por renta posible</li>
                <li>• Tienes horizonte de inversión de 5+ años</li>
                <li>• Prefieres inquilinos con contratos largos y estables</li>
                <li>• Quieres mínima gestión post-arrendamiento</li>
                <li>• Puedes comprar en preventa y esperar la entrega</li>
                <li>• Ya tienes experiencia en bienes raíces</li>
              </ul>
            </div>
            <div className="p-6 rounded-xl border border-line bg-bg-soft">
              <h3 className="font-sans font-bold text-ink mb-3">Departamento es mejor si...</h3>
              <ul className="space-y-2 text-ink-2 text-sm">
                <li>• Quieres mayor liquidez al momento de vender</li>
                <li>• Tienes acceso a crédito hipotecario favorable</li>
                <li>• Consideras Airbnb o renta vacacional como modelo</li>
                <li>• Es tu primera inversión inmobiliaria</li>
                <li>• Podrías necesitar el inmueble para uso personal</li>
                <li>• Prefieres la Zona Hotelera como ubicación</li>
              </ul>
            </div>
          </div>

          <h2 className="font-serif italic text-3xl text-ink mt-12 mb-6">
            El veredicto: para inversión pura, el local comercial gana
          </h2>
          <p className="text-ink-2 leading-relaxed mb-4">
            Si el objetivo es maximizar el retorno sobre inversión en bienes raíces en Cancún, los locales comerciales bien ubicados son superiores en casi todos los indicadores clave: rendimiento por renta, estabilidad del flujo de caja, duración de contratos y potencial de plusvalía en zonas emergentes.
          </p>
          <p className="text-ink-2 leading-relaxed mb-4">
            La clave está en elegir el proyecto correcto. Proyectos como <Link href="/plazas/gardens" className="text-accent hover:underline">Quattro Plaza Center Gardens</Link> y <Link href="/plazas/long-island" className="text-accent hover:underline">Long Island</Link> están en preventa con precios desde $1,968,600 MXN + IVA, ofreciendo una ventana de entrada excepcional para inversionistas que quieren capturar tanto la plusvalía de preventa como el flujo de renta a futuro.
          </p>
          <p className="text-ink-2 leading-relaxed mb-8">
            Para conocer más sobre cómo elegir el local correcto, lee nuestra <Link href="/blog/como-invertir-en-locales-comerciales-en-cancun" className="text-accent hover:underline">Guía Completa de Inversión en Locales Comerciales en Cancún</Link>.
          </p>

          {/* Related articles */}
          <h2 className="font-serif italic text-2xl text-ink mt-16 mb-6">Artículos relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
            {[
              { slug: 'como-invertir-en-locales-comerciales-en-cancun', title: 'Cómo Invertir en Locales Comerciales en Cancún: Guía Completa', img: '/renders/gardens/01.jpg' },
              { slug: 'cuanto-cuesta-un-local-comercial-en-cancun', title: '¿Cuánto Cuesta un Local Comercial en Cancún en 2026?', img: '/renders/long-island/02.jpg' },
              { slug: 'guia-comprar-en-preventa-cancun', title: 'Guía para Comprar en Preventa en Cancún', img: '/renders/gardens/02.jpg' },
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
          <BlogCTA title="El local comercial que buscas está aquí" />
        </div>
      </div>
    </>
  );
}
