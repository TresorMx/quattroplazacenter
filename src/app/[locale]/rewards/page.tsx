'use client';

import { useState } from 'react';
import { CheckCircle2, ChevronRight, Medal, UserPlus, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

type Step = 1 | 2 | 'done';

interface Form1 {
  referrerFirstName: string;
  referrerLastName: string;
  referrerPhone: string;
  advisorName: string;
}

interface Form2 {
  referidoFirstName: string;
  referidoLastName: string;
  referidoPhone: string;
}

const EMPTY1: Form1 = { referrerFirstName: '', referrerLastName: '', referrerPhone: '', advisorName: '' };
const EMPTY2: Form2 = { referidoFirstName: '', referidoLastName: '', referidoPhone: '' };

export default function RewardsPage() {
  const [step, setStep] = useState<Step>(1);
  const [form1, setForm1] = useState<Form1>(EMPTY1);
  const [form2, setForm2] = useState<Form2>(EMPTY2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function resetAll() {
    setForm1(EMPTY1);
    setForm2(EMPTY2);
    setError('');
    setStep(1);
  }

  async function handleSubmit() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referrerName: `${form1.referrerFirstName} ${form1.referrerLastName}`.trim(),
          referrerPhone: form1.referrerPhone,
          advisorName: form1.advisorName,
          referidoFirstName: form2.referidoFirstName,
          referidoLastName: form2.referidoLastName,
          referidoPhone: form2.referidoPhone,
        }),
      });
      if (!res.ok) throw new Error('server error');
      setStep('done');
    } catch {
      setError('Hubo un error. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-bg-soft">
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink py-24 text-center">
        <Image
          src="/renders/long-island/WEB.jpg"
          alt=""
          fill
          className="object-cover grayscale opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        <div className="container-wrap relative">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-eyebrow text-accent">
            <Medal size={13} /> Refiere y Gana
          </span>
          <h1 className="font-serif mt-4 text-[52px] font-light italic leading-[1.1] text-accent md:text-[72px]">
            Programa Rewards
          </h1>
          <p className="mt-4 text-[16px] font-semibold uppercase tracking-wider text-accent">
            Gana la cancelería de tu local*
          </p>
          <p className="mx-auto mt-6 max-w-xl text-[15px] font-semibold leading-relaxed text-white">
            Recomienda Quattro Plaza Center a familiares o conocidos. Si compran, tú recibes la cancelería de tu local sin costo adicional.
          </p>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-20">
        <div className="container-wrap">
          <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-eyebrow text-accent">— Cómo funciona</p>
          <h2 className="mb-14 text-center font-serif text-[36px] font-light italic leading-tight text-ink">
            3 pasos, un gran beneficio
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <Users size={22} />,
                num: '01',
                title: 'Refiere Quattro',
                desc: 'Comparte el proyecto con familiares o conocidos que busquen un local comercial premium.',
              },
              {
                icon: <UserPlus size={22} />,
                num: '02',
                title: 'Regístralos',
                desc: 'Usa el formulario de esta página para registrar sus datos con tu asesor de Quattro.',
              },
              {
                icon: <Medal size={22} />,
                num: '03',
                title: 'Si compran, tú ganas',
                desc: 'Cuando tu referido adquiera su local, tú recibes la cancelería de tu local sin costo extra.*',
              },
            ].map((s) => (
              <div key={s.num} className="flex flex-col rounded-xl border border-line bg-white p-8">
                <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-accent">
                  {s.icon}
                </span>
                <span className="mb-1 text-[11px] font-bold uppercase tracking-eyebrow text-ink/30">{s.num}</span>
                <h3 className="mb-2 text-[20px] font-semibold text-ink">{s.title}</h3>
                <p className="text-[14px] leading-relaxed text-ink-2">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulario */}
      <section id="registro" className="pb-24">
        <div className="container-wrap">
          <div className="mx-auto max-w-lg">
            <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-eyebrow text-accent">— Registro</p>
            <h2 className="mb-10 text-center font-serif text-[36px] font-light italic leading-tight text-ink">
              Registra tu referido
            </h2>

            {/* Progress */}
            {step !== 'done' && (
              <div className="mb-8 flex items-center gap-3">
                {([1, 2] as const).map((s, i) => (
                  <div key={s} className="flex flex-1 items-center gap-3">
                    <div
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold transition-colors',
                        step === s
                          ? 'bg-accent text-ink'
                          : step > s
                          ? 'bg-ink text-white'
                          : 'bg-line text-ink/30'
                      )}
                    >
                      {s}
                    </div>
                    <span className={cn('text-[13px] font-medium', step === s ? 'text-ink' : 'text-ink/40')}>
                      {s === 1 ? 'Tus datos' : 'Datos del referido'}
                    </span>
                    {i < 1 && <ChevronRight size={16} className="shrink-0 text-ink/20" />}
                  </div>
                ))}
              </div>
            )}

            <div className="rounded-2xl border border-line bg-white p-8 shadow-sm">
              {/* Step 1 */}
              {step === 1 && (
                <div className="flex flex-col gap-5">
                  <h3 className="text-[17px] font-semibold text-ink">Tus datos como cliente</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-medium text-ink/60">Nombre *</label>
                      <input
                        className="rounded-lg border border-line bg-bg-soft px-3.5 py-2.5 text-[14px] outline-none transition focus:border-ink"
                        value={form1.referrerFirstName}
                        onChange={(e) => setForm1((f) => ({ ...f, referrerFirstName: e.target.value }))}
                        placeholder="María"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-medium text-ink/60">Apellido *</label>
                      <input
                        className="rounded-lg border border-line bg-bg-soft px-3.5 py-2.5 text-[14px] outline-none transition focus:border-ink"
                        value={form1.referrerLastName}
                        onChange={(e) => setForm1((f) => ({ ...f, referrerLastName: e.target.value }))}
                        placeholder="García"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-medium text-ink/60">Teléfono *</label>
                    <input
                      type="tel"
                      className="rounded-lg border border-line bg-bg-soft px-3.5 py-2.5 text-[14px] outline-none transition focus:border-ink"
                      value={form1.referrerPhone}
                      onChange={(e) => setForm1((f) => ({ ...f, referrerPhone: e.target.value }))}
                      placeholder="+52 998 000 0000"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-medium text-ink/60">Nombre de tu asesor Quattro *</label>
                    <input
                      className="rounded-lg border border-line bg-bg-soft px-3.5 py-2.5 text-[14px] outline-none transition focus:border-ink"
                      value={form1.advisorName}
                      onChange={(e) => setForm1((f) => ({ ...f, advisorName: e.target.value }))}
                      placeholder="Nombre del asesor"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (!form1.referrerFirstName || !form1.referrerPhone || !form1.advisorName) {
                        setError('Por favor completa todos los campos obligatorios.');
                        return;
                      }
                      setError('');
                      setStep(2);
                    }}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-[13px] font-bold uppercase tracking-caps text-ink transition hover:brightness-95"
                  >
                    Siguiente <ChevronRight size={15} />
                  </button>
                  {error && <p className="text-center text-[13px] text-red-500">{error}</p>}
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div className="flex flex-col gap-5">
                  <h3 className="text-[17px] font-semibold text-ink">Datos de tu referido</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-medium text-ink/60">Nombre *</label>
                      <input
                        className="rounded-lg border border-line bg-bg-soft px-3.5 py-2.5 text-[14px] outline-none transition focus:border-ink"
                        value={form2.referidoFirstName}
                        onChange={(e) => setForm2((f) => ({ ...f, referidoFirstName: e.target.value }))}
                        placeholder="Carlos"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-medium text-ink/60">Apellido</label>
                      <input
                        className="rounded-lg border border-line bg-bg-soft px-3.5 py-2.5 text-[14px] outline-none transition focus:border-ink"
                        value={form2.referidoLastName}
                        onChange={(e) => setForm2((f) => ({ ...f, referidoLastName: e.target.value }))}
                        placeholder="López"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-medium text-ink/60">Teléfono *</label>
                    <input
                      type="tel"
                      className="rounded-lg border border-line bg-bg-soft px-3.5 py-2.5 text-[14px] outline-none transition focus:border-ink"
                      value={form2.referidoPhone}
                      onChange={(e) => setForm2((f) => ({ ...f, referidoPhone: e.target.value }))}
                      placeholder="+52 998 000 0000"
                    />
                  </div>
                  {error && <p className="text-[13px] text-red-500">{error}</p>}
                  <div className="flex gap-3">
                    <button
                      onClick={() => { setError(''); setStep(1); }}
                      className="flex-1 rounded-full border border-line py-3.5 text-[13px] font-medium text-ink/60 transition hover:border-ink hover:text-ink"
                    >
                      Atrás
                    </button>
                    <button
                      onClick={() => {
                        if (!form2.referidoFirstName || !form2.referidoPhone) {
                          setError('Por favor completa nombre y teléfono del referido.');
                          return;
                        }
                        handleSubmit();
                      }}
                      disabled={loading}
                      className="flex-[2] rounded-full bg-accent px-6 py-3.5 text-[13px] font-bold uppercase tracking-caps text-ink transition hover:brightness-95 disabled:opacity-50"
                    >
                      {loading ? 'Registrando…' : 'Registrar referido'}
                    </button>
                  </div>
                </div>
              )}

              {/* Done */}
              {step === 'done' && (
                <div className="flex flex-col items-center gap-5 py-6 text-center">
                  <CheckCircle2 size={56} className="text-accent" strokeWidth={1.5} />
                  <h3 className="text-[22px] font-semibold text-ink">¡Registro exitoso!</h3>
                  <p className="max-w-xs text-[14px] leading-relaxed text-ink-2">
                    Tu referido ha sido registrado. Nuestro equipo se pondrá en contacto con él a la brevedad.
                  </p>
                  <button
                    onClick={resetAll}
                    className="mt-2 flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-[13px] font-bold uppercase tracking-caps text-ink transition hover:brightness-95"
                  >
                    <UserPlus size={15} /> Registrar a alguien más
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Políticas */}
      <section className="border-t border-line bg-white py-16">
        <div className="container-wrap">
          <div className="mx-auto max-w-2xl">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-eyebrow text-accent">— Términos y condiciones</p>
            <h2 className="mb-8 font-serif text-[28px] font-light italic text-ink">Políticas del Programa Rewards</h2>
            <ul className="flex flex-col gap-4 text-[14px] leading-relaxed text-ink-2">
              {[
                'El beneficio aplica exclusivamente para clientes que ya cuenten con un local adquirido en Quattro Plaza Center (Long Island o Gardens).',
                'El referido debe ser una persona que no haya tenido contacto previo con el equipo de ventas de Quattro Plaza Center.',
                'El registro del referido debe realizarse antes de que el referido tenga cualquier contacto con el equipo comercial.',
                'El beneficio (cancelería del local) se otorga una vez que el referido formalice la compra de su local mediante contrato y pago inicial.',
                'El beneficio no es acumulable con otras promociones, descuentos u ofertas vigentes.',
                'Tresor Real Estate se reserva el derecho de verificar la elegibilidad del referido y del cliente antes de otorgar el beneficio.',
                'El programa puede modificarse o cancelarse en cualquier momento sin previo aviso, sin afectar los registros previamente validados.',
                '*Aplican restricciones. Para más información consulta a tu asesor de Quattro.',
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 shrink-0 text-[11px] font-bold text-accent">{String(i + 1).padStart(2, '0')}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
