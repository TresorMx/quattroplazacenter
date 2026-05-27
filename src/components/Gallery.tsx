'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);

  const prev = () => setActive((i) => (i - 1 + images.length) % images.length);
  const next = () => setActive((i) => (i + 1) % images.length);

  return (
    <section className="border-t border-line py-20 md:py-28">
      <div className="container-wrap">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <span className="eyebrow eyebrow-accent block">— Galería</span>
            <h2 className="mt-3 h-display text-[clamp(32px,3.5vw,52px)]">{alt}</h2>
          </div>
          <span className="caps text-ink-3">Renders del proyecto</span>
        </div>

        {/* Main stage */}
        <div className="relative aspect-[16/7] max-h-[640px] w-full overflow-hidden rounded-[18px] bg-bg-soft">

          {/* All images stacked — crossfade via opacity */}
          {images.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt={`${alt} ${i + 1}`}
              fill
              sizes="100vw"
              priority={i === 0}
              className={`object-cover transition-opacity duration-700 ease-in-out ${
                i === active ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}

          {/* Prev / Next */}
          <button
            onClick={prev}
            aria-label="Anterior"
            className="absolute left-5 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur-sm transition-all hover:scale-105 hover:bg-white"
          >
            <ChevronLeft size={20} strokeWidth={1.8} />
          </button>
          <button
            onClick={next}
            aria-label="Siguiente"
            className="absolute right-5 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur-sm transition-all hover:scale-105 hover:bg-white"
          >
            <ChevronRight size={20} strokeWidth={1.8} />
          </button>

          {/* Counter */}
          <div className="absolute bottom-5 right-5 z-10 rounded-full bg-black/60 px-4 py-2 font-mono text-[11px] tracking-widest text-white backdrop-blur-sm">
            {String(active + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
          </div>
        </div>

        {/* Thumbnail carousel */}
        <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              className={`relative aspect-[4/3] h-[88px] flex-none overflow-hidden rounded-lg border-2 transition-all duration-300 ${
                active === i
                  ? 'border-accent-deep opacity-100 scale-[1.04]'
                  : 'border-transparent opacity-55 hover:opacity-80'
              }`}
            >
              <Image
                src={src}
                alt={`${alt} ${i + 1}`}
                fill
                sizes="140px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
