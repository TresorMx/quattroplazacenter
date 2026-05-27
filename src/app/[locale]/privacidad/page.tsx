import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad — Quattro Plaza Center',
  description: 'Conoce cómo Urban Brokers / Quattro Plaza Center trata y protege tus datos personales.',
};

const sections = [
  {
    n: '1.',
    title: 'Datos personales que recabamos',
    body: 'Los datos personales que podemos recabar a través de este sitio web, formularios de contacto, WhatsApp, correo electrónico o campañas publicitarias son:',
    list: [
      'Nombre completo',
      'Teléfono',
      'Correo electrónico',
      'Información relacionada con intereses inmobiliarios',
    ],
    note: 'No recabamos datos personales sensibles.',
  },
  {
    n: '2.',
    title: 'Finalidad del tratamiento de datos',
    body: 'Los datos personales que recabamos serán utilizados para las siguientes finalidades:',
    list: [
      'Contactarlo para brindarle información sobre desarrollos, productos o servicios inmobiliarios',
      'Dar seguimiento a solicitudes, cotizaciones o asesorías',
      'Enviar información comercial, promocional o publicitaria relacionada con nuestros servicios',
      'Cumplir con obligaciones legales aplicables',
    ],
  },
  {
    n: '3.',
    title: 'Uso de cookies y tecnologías similares',
    body: 'Este sitio web puede utilizar cookies y tecnologías similares para mejorar la experiencia del usuario y analizar hábitos de navegación. Usted puede deshabilitar el uso de cookies desde la configuración de su navegador.',
  },
  {
    n: '4.',
    title: 'Protección y resguardo de la información',
    body: 'Urban Brokers adopta las medidas de seguridad administrativas, técnicas y físicas necesarias para proteger sus datos personales contra daño, pérdida, alteración, destrucción o uso no autorizado.',
  },
  {
    n: '5.',
    title: 'Transferencia de datos personales',
    body: 'Sus datos personales no serán compartidos con terceros sin su consentimiento, salvo cuando sea requerido por autoridad competente o por disposición legal.',
  },
  {
    n: '6.',
    title: 'Derechos ARCO',
    body: 'Usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse al tratamiento de sus datos personales (derechos ARCO). Para ejercer estos derechos, puede enviar una solicitud al correo electrónico que se indique en este sitio web.',
  },
  {
    n: '7.',
    title: 'Cambios a la política de privacidad',
    body: 'Urban Brokers se reserva el derecho de modificar o actualizar la presente Política de Privacidad en cualquier momento. Cualquier cambio será publicado en este mismo sitio web.',
  },
  {
    n: '8.',
    title: 'Consentimiento',
    body: 'Al proporcionar sus datos personales a través de este sitio web, usted manifiesta su consentimiento para que sean tratados conforme a la presente Política de Privacidad.',
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-bg pt-28 pb-24">
      <div className="container-wrap max-w-[760px]">

        {/* Header */}
        <div className="mb-14">
          <span className="eyebrow eyebrow-accent">— Legal</span>
          <h1 className="mt-4 font-serif text-[clamp(36px,5vw,60px)] font-light italic leading-[1.05]">
            Política de Privacidad
          </h1>
          <p className="mt-5 text-[14px] leading-relaxed text-ink-3">
            Urban Brokers, con RFC <span className="font-medium text-ink">UBR141031DL6</span> (en adelante, "Urban Brokers"), con domicilio en México, es responsable del uso y protección de sus datos personales, y al respecto le informa lo siguiente:
          </p>
        </div>

        {/* Sections */}
        <div className="flex flex-col divide-y divide-line">
          {sections.map((s) => (
            <div key={s.n} className="py-9">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-mono text-[11px] font-semibold tracking-widest text-accent">{s.n}</span>
                <h2 className="font-serif text-[22px] font-light italic leading-tight text-ink">{s.title}</h2>
              </div>
              <p className="text-[14px] leading-relaxed text-ink-2">{s.body}</p>
              {s.list && (
                <ul className="mt-4 flex flex-col gap-2">
                  {s.list.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[14px] text-ink-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {s.note && (
                <p className="mt-4 text-[13px] font-medium text-ink-3">{s.note}</p>
              )}
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-10 border-t border-line pt-8 text-[12px] text-ink-3">
          Última actualización: <span className="font-medium text-ink">Enero de 2026</span>
        </div>

      </div>
    </main>
  );
}
