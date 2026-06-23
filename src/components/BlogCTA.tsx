import Image from 'next/image';

interface BlogCTAProps {
  title?: string;
}

export default function BlogCTA({ title = '¿Listo para invertir en Cancún?' }: BlogCTAProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-ink my-16">
      <Image
        src="/renders/long-island/WEB.jpg"
        alt="Locales comerciales Quattro Plaza Center Cancún"
        fill
        className="object-cover opacity-30"
        sizes="(max-width: 768px) 100vw, 900px"
      />
      <div className="relative z-10 px-8 py-16 md:px-16 md:py-20 text-center">
        <p className="eyebrow eyebrow-accent mb-4">Quattro Plaza Center</p>
        <h2 className="font-serif italic text-3xl md:text-4xl lg:text-5xl text-white mb-4 leading-tight">
          {title}
        </h2>
        <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
          Habla con un asesor hoy. Locales comerciales desde $1,968,600 MXN + IVA.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/locales-comerciales-cancun"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-accent text-ink font-semibold text-sm tracking-wide hover:opacity-90 transition-opacity"
          >
            Ver locales disponibles
          </a>
          <a
            href="https://wa.me/529981234567?text=Hola%2C%20me%20interesa%20un%20local%20comercial%20en%20Cancún"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-white text-white font-semibold text-sm tracking-wide hover:bg-white/10 transition-colors"
          >
            Hablar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
