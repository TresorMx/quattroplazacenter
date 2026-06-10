'use client';

import { useState, useEffect } from 'react';
import {
  Lock, ArrowRight, FileText, ClipboardList, MapPin, Building2,
  Banknote, Megaphone, Layers, Image as ImageIcon, Receipt, ReceiptText,
  CheckSquare, FileSignature, Download
} from 'lucide-react';
import { cn } from '@/lib/utils';

const BROKER_KEY = 'quattro_broker_session';

interface BrokerSession {
  fullName: string;
  email: string;
  phone: string;
  brokerage: string;
  ts: number;
}

const PLAZAS = [
  { slug: 'long-island', label: 'Long Island' },
  { slug: 'gardens', label: 'Gardens' },
];

const MAIN_CARDS = [
  { key: 'presentation', label: 'Presentación', icon: FileText, desc: 'Pitch deck completo del proyecto', file: 'presentacion.pdf' },
  { key: 'priceList', label: 'Lista de Precios', icon: ClipboardList, desc: 'Precios actualizados por nivel', file: 'lista-precios.pdf' },
  { key: 'masterPlan', label: 'Master Plan', icon: Layers, desc: 'Distribución de locales con cotas', file: 'master-plan.pdf' },
  { key: 'bankAccounts', label: 'Cuentas Bancarias', icon: Banknote, desc: 'Datos para depósito y SPEI', file: 'cuentas-bancarias.pdf' },
  { key: 'location', label: 'Ubicación', icon: MapPin, desc: 'Coordenadas, KML y entorno', file: 'ubicacion.pdf' },
  { key: 'marketing', label: 'Materiales de Marketing', icon: Megaphone, desc: 'Posts, banners y videos', file: 'marketing.zip' },
  { key: 'developer', label: 'Desarrollador', icon: Building2, desc: 'Tresor Real Estate · trayectoria', file: 'tresor.pdf' },
  { key: 'renders', label: 'Renders', icon: ImageIcon, desc: 'Imágenes en alta resolución', file: 'renders.zip' },
];

const ADMIN_CARDS = [
  { key: 'receiptPay', label: 'Recibo de Pago', icon: Receipt, desc: 'Formato editable', file: 'recibo-pago.pdf' },
  { key: 'receiptReserve', label: 'Recibo de Apartado', icon: ReceiptText, desc: 'Para $50,000 MXN', file: 'recibo-apartado.pdf' },
  { key: 'checklist', label: 'Check List', icon: CheckSquare, desc: 'Validación previa al cierre', file: 'checklist.pdf' },
  { key: 'offerLetter', label: 'Carta Oferta', icon: FileSignature, desc: 'Plantilla institucional', file: 'carta-oferta.pdf' },
];

export default function BrokersPage() {
  const [session, setSession] = useState<BrokerSession | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    setHydrated(true);
    const raw = localStorage.getItem(BROKER_KEY);
    if (raw) {
      try {
        const parsed: BrokerSession = JSON.parse(raw);
        if (Date.now() - parsed.ts < 1000 * 60 * 60 * 24 * 30) setSession(parsed);
      } catch {}
    }
  }, []);

  if (!hydrated) return null;
  if (!session) return <BrokerGate onAccess={(s) => { localStorage.setItem(BROKER_KEY, JSON.stringify(s)); setSession(s); }} />;
  return <BrokerDrive session={session} onLogout={() => { localStorage.removeItem(BROKER_KEY); setSession(null); }} />;
}

/* ════════ Gate form ════════ */
function BrokerGate({ onAccess }: { onAccess: (s: BrokerSession) => void }) {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', brokerage: '' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch('/api/broker-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Error');
      onAccess({ ...form, ts: Date.now() });
    } catch (e: any) {
      setErr(e.message || 'No pudimos validar tu acceso');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-bg pt-24 pb-20">
      <section className="container-wrap grid items-center gap-16 py-16 md:grid-cols-[1fr_1.2fr]">
        <div>
          <span className="eyebrow eyebrow-accent">— Acceso Broker</span>
          <h1 className="mt-4 font-serif text-[clamp(40px,5.5vw,72px)] font-light italic leading-[1.05]">
            Drive de Ventas<br />
            <span style={{ color: '#FAB413' }}>Quattro</span>
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-3">
            Toda la información comercial que necesitas para vender Long Island y Gardens:
            presentaciones, listas de precios, master plans, cuentas bancarias, materiales de
            marketing y formatos administrativos.
          </p>
        </div>

        <form onSubmit={submit} className="rounded-lg border border-line bg-white p-10 shadow-sm">
          <div className="mb-7 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-bg">
              <Lock size={18} strokeWidth={1.6} />
            </div>
            <div>
              <div className="font-serif text-2xl font-light italic">Identifícate</div>
              <div className="text-[12px] text-ink-3">Tus datos quedan registrados para soporte</div>
            </div>
          </div>

          <div className="grid gap-5">
            {([
              { k: 'fullName', label: 'Nombre completo *', type: 'text', placeholder: 'Tu nombre completo' },
              { k: 'email', label: 'Email *', type: 'email', placeholder: 'tu@correo.com' },
              { k: 'phone', label: 'Teléfono *', type: 'tel', placeholder: '+52 998 404 5602' },
              { k: 'brokerage', label: 'Inmobiliaria', type: 'text', placeholder: 'Opcional' },
            ] as const).map((f) => (
              <label key={f.k} className="field">
                <span className="field-label">{f.label}</span>
                <input
                  required={f.label.includes('*')}
                  type={f.type}
                  className="field-input"
                  value={(form as any)[f.k]}
                  onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}
                  placeholder={f.placeholder}
                />
              </label>
            ))}
          </div>

          {err && <div className="mt-4 rounded bg-red-50 px-3 py-2 text-[12px] text-red-700">{err}</div>}

          <button
            type="submit"
            disabled={loading || !form.fullName || !form.email || !form.phone}
            className="btn btn-lg mt-8 w-full font-bold disabled:opacity-40"
            style={{ background: '#0E0E0E', color: '#fff' }}
          >
            {loading ? 'Verificando…' : 'Acceder al Drive'} <ArrowRight size={14} strokeWidth={1.6} />
          </button>

        </form>
      </section>
    </main>
  );
}

/* ════════ Drive (logged in) ════════ */
function BrokerDrive({ session, onLogout }: { session: BrokerSession; onLogout: () => void }) {
  const [plaza, setPlaza] = useState<'long-island' | 'gardens'>('long-island');

  return (
    <main className="min-h-screen bg-bg pt-24 pb-20">
      <section className="border-b border-line bg-bg-soft/40 py-10">
        <div className="container-wrap">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="eyebrow eyebrow-accent">— Drive de Ventas</span>
              <h1 className="mt-3 font-serif text-[clamp(36px,4.5vw,56px)] font-light italic leading-tight">
                Bienvenido, {session.fullName.split(' ')[0]}
              </h1>
              <p className="mt-2 text-[14px] text-ink-3">
                Toda la información comercial actualizada en un solo lugar.
              </p>
            </div>
            <button onClick={onLogout} className="text-[11px] font-semibold uppercase tracking-caps text-ink-3 hover:text-ink">
              Salir
            </button>
          </div>

          {/* Plaza switcher */}
          <div className="mt-6 inline-flex items-center gap-px rounded-full bg-white p-[3px]">
            {PLAZAS.map((p) => (
              <button
                key={p.slug}
                onClick={() => setPlaza(p.slug as any)}
                className={cn(
                  'rounded-full px-5 py-2 text-[11px] font-semibold uppercase tracking-caps transition-colors',
                  plaza === p.slug ? 'bg-ink text-bg' : 'text-ink-3 hover:text-ink',
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main drive */}
      <section className="container-wrap pt-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="font-serif text-3xl font-light italic">Drive principal</h2>
          <span className="caps text-ink-3">8 secciones</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MAIN_CARDS.map((c) => (
            <DriveCard key={c.key} card={c} plaza={plaza} />
          ))}
        </div>
      </section>

      {/* Admin formats */}
      <section className="container-wrap pt-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <span className="eyebrow eyebrow-accent">— Administrativo</span>
            <h2 className="mt-3 font-serif text-3xl font-light italic">Formatos Administrativos</h2>
          </div>
          <span className="caps text-ink-3">4 formatos</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ADMIN_CARDS.map((c) => (
            <DriveCard key={c.key} card={c} plaza={plaza} variant="admin" />
          ))}
        </div>
      </section>
    </main>
  );
}

function DriveCard({
  card,
  plaza,
  variant = 'main',
}: {
  card: { key: string; label: string; icon: any; desc: string; file: string };
  plaza: string;
  variant?: 'main' | 'admin';
}) {
  const Icon = card.icon;
  return (
    <a
      href={`/api/broker/file?plaza=${plaza}&doc=${card.key}`}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group flex flex-col gap-5 rounded-lg border bg-white p-7 transition-all hover:-translate-y-1 hover:border-ink hover:shadow-md',
        variant === 'admin' ? 'border-line/80' : 'border-line',
      )}
    >
      <div
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-full transition-colors',
          variant === 'admin' ? 'bg-bg-soft text-ink-2' : 'bg-bg-soft text-ink group-hover:bg-ink group-hover:text-bg',
        )}
      >
        <Icon size={20} strokeWidth={1.4} />
      </div>
      <div className="flex-1">
        <div className="font-serif text-xl font-light italic leading-tight">{card.label}</div>
        <p className="mt-2 text-[12.5px] leading-relaxed text-ink-3">{card.desc}</p>
      </div>
      <span className="mt-1 inline-flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-caps text-ink-3 group-hover:text-accent">
        <Download size={12} strokeWidth={1.8} /> Descargar
      </span>
    </a>
  );
}
