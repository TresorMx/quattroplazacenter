'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { X, ArrowRight } from 'lucide-react';

const STORAGE_KEY = 'qpc_exit_intent_date';

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function hasShownToday() {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === todayStr();
  } catch {
    return false;
  }
}

function markShownToday() {
  try {
    localStorage.setItem(STORAGE_KEY, todayStr());
  } catch {}
}

export default function ExitIntent({ agendaHref = '/agenda' }: { agendaHref?: string }) {
  const [visible, setVisible] = useState(false);

  const show = useCallback(() => {
    if (hasShownToday()) return;
    setVisible(true);
    markShownToday();
  }, []);

  const close = useCallback(() => setVisible(false), []);

  useEffect(() => {
    // Desktop: mouse leaves through top of viewport
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5) show();
    };

    // Mobile: page hidden (user switches tab / goes back)
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') show();
    };

    // Delay so it doesn't fire immediately on page load
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', onMouseLeave);
      document.addEventListener('visibilitychange', onVisibilityChange);
    }, 4000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [show]);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(14,14,14,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={close}
    >
      <div
        className="relative flex w-full max-w-3xl overflow-hidden rounded-2xl bg-ink shadow-[0_32px_80px_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={close}
          aria-label="Cerrar"
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
        >
          <X size={16} />
        </button>

        {/* Imagen — oculta en mobile */}
        <div className="relative hidden w-[45%] shrink-0 md:block">
          <Image
            src="/promo.png"
            alt="Quattro Plaza Center — Programa Rewards"
            fill
            className="object-cover"
          />
        </div>

        {/* Contenido */}
        <div className="flex flex-1 flex-col justify-center px-8 py-10 md:px-10">
          <span className="mb-4 text-[11px] font-bold uppercase tracking-eyebrow text-accent">
            — Quattro Plaza Center
          </span>
          <h2 className="font-serif text-[36px] font-light italic leading-[1.15] text-white md:text-[42px]">
            ¿Listo para ver<br />tu próximo local?
          </h2>
          <p className="mt-4 text-[14px] leading-relaxed text-white/60">
            Agenda una visita sin compromiso y un asesor te mostrará los locales disponibles, precios y planes de pago en persona.
          </p>
          <a
            href={agendaHref}
            onClick={close}
            className="mt-8 inline-flex w-fit items-center gap-2.5 rounded-full bg-accent px-6 py-3.5 text-[12px] font-bold uppercase tracking-caps text-ink transition hover:brightness-95"
          >
            Agenda tu visita <ArrowRight size={14} strokeWidth={1.8} />
          </a>
          <p className="mt-4 text-[11px] text-white/30">Sin compromiso · Respuesta en menos de 2 hrs</p>
        </div>
      </div>
    </div>
  );
}
