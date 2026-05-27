'use client';

import { useState } from 'react';
import { X, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ReserveModal({
  quoteId,
  open,
  onClose,
}: {
  quoteId: string;
  open: boolean;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function goCheckout() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quoteId }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? 'Error');
      window.location.href = data.url;
    } catch (e: any) {
      setErr(e.message ?? 'No pudimos iniciar el pago');
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          aria-label="Cerrar"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-bg-soft text-ink-3 hover:text-ink"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="border-b border-line bg-bg-soft/40 px-8 py-7">
          <span className="eyebrow eyebrow-accent">— Apartado</span>
          <h2 className="mt-3 font-serif text-3xl font-light italic leading-tight">
            Aparta tu local con<br />
            <span style={{ color: '#FAB413' }}>$50,000 MXN</span>
          </h2>
          <p className="mt-3 text-[13px] text-ink-3">
            Reembolsable · Asesoría legal incluida · Pago seguro Stripe
          </p>
        </div>

        {/* Body */}
        <div className="space-y-3 px-8 py-7">
          <Bullet icon={<ShieldCheck size={16} strokeWidth={1.6} />} text="Tu pago se procesa por Stripe (PCI-DSS Nivel 1)" />
          <Bullet icon={<Lock size={16} strokeWidth={1.6} />} text="Acepta tarjeta de crédito/débito y OXXO" />
          <Bullet icon={<ShieldCheck size={16} strokeWidth={1.6} />} text="100% reembolsable durante 14 días" />
        </div>

        <div className="px-8 pb-7">
          {err && (
            <div className="mb-3 rounded bg-red-50 px-3 py-2 text-[12px] text-red-700">{err}</div>
          )}
          <button
            disabled={loading}
            onClick={goCheckout}
            className={cn(
              'btn w-full font-bold disabled:opacity-50',
            )}
            style={{ background: '#0E0E0E', color: '#fff' }}
          >
            {loading ? 'Conectando con Stripe…' : (
              <>
                Continuar al pago seguro <ArrowRight size={14} strokeWidth={1.6} />
              </>
            )}
          </button>
          <p className="mt-3 text-center text-[10.5px] uppercase tracking-caps text-ink-3">
            Cotización {quoteId}
          </p>
        </div>
      </div>
    </div>
  );
}

function Bullet({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-bg-soft text-ink-2">
        {icon}
      </span>
      <span className="text-[14px] leading-relaxed">{text}</span>
    </div>
  );
}
