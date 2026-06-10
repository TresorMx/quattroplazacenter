'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { CalendarDays, Video, MapPin, ArrowRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { pixel } from '@/lib/pixel';
import type { Plaza } from '@/lib/types';

const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00',
  '14:00', '15:00', '16:00', '17:00',
];

const formatTime = (t: string) => {
  const [h] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const display = h > 12 ? h - 12 : h;
  return `${display}:00 ${period}`;
};

function minDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

interface AgendaWidgetProps {
  plaza: Plaza;
}

export default function AgendaWidget({ plaza }: AgendaWidgetProps) {
  const t = useTranslations('agenda');
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    mode: '' as 'presencial' | 'zoom' | '',
    date: '',
    time: '',
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const valid =
    form.firstName && form.lastName && form.email && form.phone &&
    form.mode && form.date && form.time;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch('/api/agenda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, plaza: plaza.slug }),
      });
      if (!res.ok) throw new Error(t('errorMsg'));
      const { id } = await res.json();
      pixel.lead({ content_name: 'Agenda Visita', content_category: plaza.slug });
      router.push(
        `/agenda/gracias?id=${id}&mode=${form.mode}&date=${form.date}&time=${form.time}&name=${encodeURIComponent(form.firstName)}&plaza=${plaza.slug}`
      );
    } catch (e: any) {
      setErr(e.message || t('errorMsg'));
    } finally {
      setLoading(false);
    }
  }

  const modalities = [
    { value: 'presencial', icon: MapPin,  title: t('presencial'), desc: t('presencialDesc') },
    { value: 'zoom',       icon: Video,   title: t('zoom'),       desc: t('zoomDesc') },
  ] as const;

  return (
    <div className="container-wrap pb-20 pt-12 md:pb-28 md:pt-16">
      <form onSubmit={submit} className="mx-auto max-w-2xl">

        {/* Nombre + Apellido */}
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="field">
            <span className="field-label">{t('firstName')}</span>
            <input required type="text" className="field-input" placeholder="Tu nombre"
              value={form.firstName} onChange={(e) => set('firstName', e.target.value)} />
          </label>
          <label className="field">
            <span className="field-label">{t('lastName')}</span>
            <input required type="text" className="field-input" placeholder="Tu apellido"
              value={form.lastName} onChange={(e) => set('lastName', e.target.value)} />
          </label>
        </div>

        {/* Email + Teléfono */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <label className="field">
            <span className="field-label">{t('email')}</span>
            <input required type="email" className="field-input" placeholder="tu@correo.com"
              value={form.email} onChange={(e) => set('email', e.target.value)} />
          </label>
          <label className="field">
            <span className="field-label">{t('phone')}</span>
            <input required type="tel" className="field-input" placeholder="+52 998 404 5602"
              value={form.phone} onChange={(e) => set('phone', e.target.value)} />
          </label>
        </div>

        {/* Modalidad */}
        <div className="mt-10">
          <span className="field-label block mb-4">{t('modalityLabel')}</span>
          <div className="grid gap-4 sm:grid-cols-2">
            {modalities.map(({ value, icon: Icon, title, desc }) => (
              <button
                key={value}
                type="button"
                onClick={() => set('mode', value)}
                className={cn(
                  'flex items-start gap-4 rounded-lg border p-5 text-left transition-all',
                  form.mode === value ? 'border-ink bg-ink text-bg' : 'border-line bg-white hover:border-ink-3',
                )}
              >
                <div className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                  form.mode === value ? 'bg-white/10 text-bg' : 'bg-bg-soft text-ink',
                )}>
                  <Icon size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-[13px] font-semibold">{title}</div>
                  <div className={cn('mt-0.5 text-[12px] leading-relaxed', form.mode === value ? 'text-white/70' : 'text-ink-3')}>
                    {desc}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Fecha */}
        <div className="mt-10">
          <label className="field">
            <span className="field-label flex items-center gap-1.5">
              <CalendarDays size={11} strokeWidth={2} /> {t('dateLabel')}
            </span>
            <input required type="date" min={minDate()} className="field-input cursor-pointer"
              value={form.date} onChange={(e) => set('date', e.target.value)} />
          </label>
        </div>

        {/* Hora */}
        <div className="mt-8">
          <span className="field-label flex items-center gap-1.5 mb-4">
            <Clock size={11} strokeWidth={2} /> {t('timeLabel')}
          </span>
          <div className="grid grid-cols-4 gap-2">
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => set('time', slot)}
                className={cn(
                  'rounded-full border py-2.5 text-[11px] font-semibold uppercase tracking-caps transition-all',
                  form.time === slot
                    ? 'border-ink bg-ink text-bg'
                    : 'border-line bg-white text-ink-3 hover:border-ink hover:text-ink',
                )}
              >
                {formatTime(slot)}
              </button>
            ))}
          </div>
        </div>

        {err && (
          <div className="mt-6 rounded bg-red-50 px-4 py-3 text-[13px] text-red-700">{err}</div>
        )}

        {/* Submit */}
        <div className="mt-10 border-t border-line pt-8">
          <button
            type="submit"
            disabled={!valid || loading}
            className="btn btn-lg w-full bg-ink text-bg hover:bg-ink/80 disabled:opacity-40"
          >
            {loading ? t('submitting') : t('submit')}
            {!loading && <ArrowRight size={15} strokeWidth={1.6} />}
          </button>
          <p className="mt-4 text-center text-[11px] text-ink-3">{t('submitNote')}</p>
        </div>
      </form>
    </div>
  );
}
