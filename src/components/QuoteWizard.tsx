'use client';

import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, MapPin, Ruler, Calendar } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { Plaza, Unit, PaymentPlan } from '@/lib/types';
import { computeQuote, generateQuoteId, getAvailablePlans, getDefaultPlan, type QuoteCalc } from '@/lib/quote';
import { formatMXN, cn } from '@/lib/utils';
import { primarySpec, unitSummary } from '@/lib/specs';

interface QuoteWizardProps {
  plaza: Plaza;
  preselectedUnit?: Unit;
}

interface ContactInfo {
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  isBroker: boolean;
  brokerage?: string;
  notes?: string;
}

// Steps are built dynamically inside the component using t()
const STEP_KEYS = ['step1', 'step2', 'step3', 'step4'] as const;

export default function QuoteWizard({ plaza, preselectedUnit }: QuoteWizardProps) {
  const router = useRouter();
  const t = useTranslations('quote');
  const wizardRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(preselectedUnit ? 2 : 1);

  function goToStep(n: number) {
    setStep(n);
    // Pequeño delay para que React renderice el nuevo paso antes del scroll
    setTimeout(() => {
      wizardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 40);
  }
  const [unit, setUnit] = useState<Unit | null>(preselectedUnit ?? null);
  const [plan, setPlan] = useState<PaymentPlan | null>(null);
  const [monthlyTerm, setMonthlyTerm] = useState(12);
  const [contact, setContact] = useState<ContactInfo>({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    isBroker: false,
    brokerage: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const availableUnits = useMemo(
    () => (plaza.units ?? []).filter((u) => u.status === 'disponible' && u.price),
    [plaza.units],
  );

  const plans = useMemo(() => getAvailablePlans(plaza), [plaza]);

  useMemo(() => {
    if (unit && plans.length && !plan) {
      const defaultPlan = getDefaultPlan(plaza);
      setPlan(defaultPlan ?? plans[0]);
      if (defaultPlan?.defaultMonths) setMonthlyTerm(defaultPlan.defaultMonths);
    }
  }, [unit, plans, plan, plaza]);

  const quote: QuoteCalc | null = useMemo(() => {
    if (!unit || !plan) return null;
    return computeQuote({ plaza, unit, plan, monthlyTerm });
  }, [plaza, unit, plan, monthlyTerm]);

  const canNext =
    (step === 1 && unit) ||
    (step === 2 && contact.fullName && contact.email && contact.phone) ||
    (step === 3 && plan) ||
    step === 4;

  async function submit() {
    if (!quote) return;
    setSubmitting(true);
    try {
      const quoteId = generateQuoteId(plaza.slug, quote.unit.code, quote.plan.code);
      const payload = {
        quoteId,
        plazaSlug: plaza.slug,
        unitId: quote.unit.id,
        planCode: quote.plan.code,
        monthlyTerm,
        contact,
        computed: {
          total: quote.total,
          subtotal: quote.subtotal,
          discount: quote.discount,
          iva: quote.iva,
          downPayment: quote.downPayment,
          monthlyAmount: quote.monthlyAmount,
          deliveryAmount: quote.deliveryAmount,
          validUntil: quote.validUntil,
        },
      };

      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Submit failed');
      router.push(`/gracias?id=${encodeURIComponent(quoteId)}`);
    } catch (e) {
      console.error(e);
      alert(t('errorMsg'));
      setSubmitting(false);
    }
  }

  return (
    <div ref={wizardRef} className="container-wrap py-16 md:py-24">
      {/* ─── Stepper ─── */}
      <div className="mb-12 flex items-center justify-center gap-3 md:gap-6">
        {STEP_KEYS.map((key, i) => {
          const n = i + 1;
          return (
            <div key={n} className="flex items-center gap-3 md:gap-6">
              <button
                onClick={() => n < step && setStep(n)}
                className={cn(
                  'flex items-center gap-3 transition-opacity',
                  n > step && 'opacity-40 cursor-not-allowed',
                )}
              >
                <span
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full border text-[12px] font-semibold transition-colors',
                    n < step
                      ? 'border-ink bg-ink text-bg'
                      : n === step
                        ? 'border-ink bg-bg text-ink'
                        : 'border-line bg-bg text-ink-3',
                  )}
                >
                  {n < step ? <Check size={14} strokeWidth={2} /> : n}
                </span>
                <span
                  className={cn(
                    'hidden text-[11px] font-semibold uppercase tracking-caps md:inline',
                    n === step ? 'text-ink' : 'text-ink-3',
                  )}
                >
                  {t(key)}
                </span>
              </button>
              {i < STEP_KEYS.length - 1 && <div className="h-px w-6 bg-line md:w-12" />}
            </div>
          );
        })}
      </div>

      {/* ─── Body ─── */}
      <div className="grid gap-8 md:grid-cols-[1.5fr_1fr]">
        <div className="rounded-lg border border-line bg-white p-8 md:p-12">
          {step === 1 && (
            <Step1Units
              plaza={plaza}
              units={availableUnits}
              selectedId={unit?.id ?? null}
              onSelect={(u) => {
                setUnit(u);
                setPlan(null);
              }}
            />
          )}
          {step === 2 && <Step2Contact contact={contact} setContact={setContact} />}
          {step === 3 && plans.length > 0 && (
            <Step3Plan
              plans={plans}
              selectedCode={plan?.code ?? null}
              monthlyTerm={monthlyTerm}
              setMonthlyTerm={setMonthlyTerm}
              onSelect={setPlan}
            />
          )}
          {step === 4 && quote && <Step4Summary quote={quote} contact={contact} />}
        </div>

        {/* ─── Sticky summary side ─── */}
        <aside className="h-fit rounded-lg border border-line bg-bg-soft/40 p-7">
          <h3 className="font-serif text-2xl font-light italic leading-tight">{t('yourSelection')}</h3>

          {unit ? (
            <>
              <div className="mt-5 border-b border-line pb-4">
                <div className="text-[10.5px] uppercase tracking-caps text-ink-3">{plaza.shortName}</div>
                <div className="mt-1 font-serif text-4xl font-light italic">Local {unit.code}</div>
                <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-ink-3">
                  {primarySpec(plaza, unit) && (
                    <span className="inline-flex items-center gap-1.5">
                      <Ruler size={12} /> {primarySpec(plaza, unit)}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={12} /> {t('levelLabel')}{unit.level}
                  </span>
                  {unit.delivery && (
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar size={12} /> {unit.delivery}
                    </span>
                  )}
                </div>
              </div>

              {quote && (
                <>
                  <SumRow label={t('listPrice')} value={formatMXN(quote.basePrice)} />
                  {quote.discount > 0 && (
                    <SumRow label={t('discountLabel', { pct: quote.plan.discount })} value={`− ${formatMXN(quote.discount)}`} accent />
                  )}
                  <SumRow label={t('vatLabel')} value={formatMXN(quote.iva)} />
                  <div className="my-3 h-px bg-line" />
                  <SumRow label={t('totalLabel')} value={formatMXN(quote.total)} bold />
                  <p className="mt-4 text-[11px] leading-relaxed text-ink-3">
                    {t('quoteNote')}
                  </p>
                </>
              )}
            </>
          ) : (
            <p className="mt-5 text-[14px] text-ink-3">{t('selectUnitToStart')}</p>
          )}
        </aside>
      </div>

      {/* ─── Nav buttons ─── */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <button
          disabled={step === 1}
          onClick={() => goToStep(Math.max(1, step - 1))}
          className="btn btn-ghost disabled:opacity-30"
        >
          <ArrowLeft size={14} strokeWidth={1.6} /> {t('back')}
        </button>

        {step < 4 ? (
          <button
            disabled={!canNext}
            onClick={() => goToStep(Math.min(4, step + 1))}
            className="btn btn-primary disabled:opacity-30"
          >
            {t('next')} <ArrowRight size={14} strokeWidth={1.6} />
          </button>
        ) : (
          <button
            disabled={submitting || !quote}
            onClick={submit}
            className="btn btn-accent disabled:opacity-50"
            style={{ background: '#FAB413', color: '#0E0E0E' }}
          >
            {submitting ? t('submitting') : t('submit')}
            <ArrowRight size={14} strokeWidth={1.6} />
          </button>
        )}
      </div>
    </div>
  );
}

/* ════════ Step 1: Selector de local ════════ */
function Step1Units({
  plaza,
  units,
  selectedId,
  onSelect,
}: {
  plaza: Plaza;
  units: Unit[];
  selectedId: string | null;
  onSelect: (u: Unit) => void;
}) {
  const t = useTranslations('quote');
  return (
    <>
      <span className="eyebrow eyebrow-accent">— {t('step1')}</span>
      <h2 className="mt-3 font-serif text-3xl font-light italic md:text-4xl">{t('pickUnit')}</h2>
      <p className="mt-3 text-[14px] text-ink-3">
        {t('unitsAvailable', { count: units.length })}
      </p>

      <div className="mt-6 grid gap-2 sm:grid-cols-3">
        {units.map((u) => (
          <button
            key={u.id}
            onClick={() => onSelect(u)}
            className={cn(
              'flex items-center justify-between gap-2 rounded-lg border bg-white px-4 py-3 text-left transition-all hover:border-ink',
              selectedId === u.id ? 'border-ink bg-bg-soft/40' : 'border-line',
            )}
          >
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-xl font-light italic leading-none">{u.code}</span>
                <span className="text-[10px] uppercase tracking-caps text-ink-3">{t('levelLabel')}{u.level}</span>
              </div>
              <div className="mt-0.5 truncate text-[11px] text-ink-3">{primarySpec(plaza, u)}{u.delivery ? ` · ${u.delivery}` : ''}</div>
            </div>
            <div className="shrink-0 text-[12px] font-medium tabular-nums text-ink-2">
              {u.price ? formatMXN(u.price) : '—'}
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

/* ════════ Step 2: Datos de contacto ════════ */
function Step2Contact({
  contact,
  setContact,
}: {
  contact: ContactInfo;
  setContact: (c: ContactInfo) => void;
}) {
  const t = useTranslations('quote');
  return (
    <>
      <span className="eyebrow eyebrow-accent">— {t('step2')}</span>
      <h2 className="mt-3 font-serif text-3xl font-light italic md:text-4xl">{t('yourDetails')}</h2>
      <p className="mt-3 text-[14px] text-ink-3">{t('detailsDesc')}</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Field label={t('fullName')}>
          <input
            className="field-input"
            value={contact.fullName}
            onChange={(e) => setContact({ ...contact, fullName: e.target.value })}
            placeholder="David Baena"
          />
        </Field>
        <Field label={t('email')}>
          <input
            type="email"
            className="field-input"
            value={contact.email}
            onChange={(e) => setContact({ ...contact, email: e.target.value })}
            placeholder="tu@correo.com"
          />
        </Field>
        <Field label={t('phone')}>
          <input
            type="tel"
            className="field-input"
            value={contact.phone}
            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
            placeholder="+52 998 000 0000"
          />
        </Field>
        <Field label={t('company')}>
          <input
            className="field-input"
            value={contact.company}
            onChange={(e) => setContact({ ...contact, company: e.target.value })}
          />
        </Field>
        <Field label={t('notes')} className="sm:col-span-2">
          <textarea
            rows={2}
            className="field-input resize-none"
            value={contact.notes}
            onChange={(e) => setContact({ ...contact, notes: e.target.value })}
            placeholder={t('notesPlaceholder')}
          />
        </Field>

        <label className="mt-2 flex cursor-pointer items-center gap-3 sm:col-span-2">
          <input
            type="checkbox"
            checked={contact.isBroker}
            onChange={(e) => setContact({ ...contact, isBroker: e.target.checked })}
            className="h-4 w-4 accent-ink"
          />
          <span className="text-[13px]">{t('isBroker')}</span>
        </label>

        {contact.isBroker && (
          <Field label={t('brokerage')} className="sm:col-span-2">
            <input
              className="field-input"
              value={contact.brokerage}
              onChange={(e) => setContact({ ...contact, brokerage: e.target.value })}
            />
          </Field>
        )}
      </div>
    </>
  );
}

/* ════════ Step 3: Plan de pago ════════ */
function Step3Plan({
  plans,
  selectedCode,
  monthlyTerm,
  setMonthlyTerm,
  onSelect,
}: {
  plans: PaymentPlan[];
  selectedCode: string | null;
  monthlyTerm: number;
  setMonthlyTerm: (n: number) => void;
  onSelect: (p: PaymentPlan) => void;
}) {
  const t = useTranslations('quote');
  const selected = plans.find((p) => p.code === selectedCode);
  return (
    <>
      <span className="eyebrow eyebrow-accent">— {t('step3')}</span>
      <h2 className="mt-3 font-serif text-3xl font-light italic md:text-4xl">{t('paymentPlan')}</h2>
      <p className="mt-3 text-[14px] text-ink-3">{t('paymentPlanDesc')}</p>

      <div className="mt-8 space-y-3">
        {plans.map((p) => (
          <button
            key={p.code}
            onClick={() => onSelect(p)}
            className={cn(
              'flex w-full items-center justify-between gap-4 rounded-lg border bg-white p-5 text-left transition-all hover:border-ink',
              selectedCode === p.code ? 'border-ink bg-bg-soft/40' : 'border-line',
            )}
          >
            <div className="flex flex-col gap-1">
              <span className="font-serif text-2xl font-light italic">{t('scheme')} {p.code}</span>
              <span className="text-[13px] text-ink-2">{p.label}</span>
            </div>
            {p.discount > 0 && (
              <span
                className="shrink-0 rounded-full px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-caps"
                style={{ background: '#FAB413', color: '#0E0E0E' }}
              >
                −{p.discount}%
              </span>
            )}
          </button>
        ))}
      </div>

      {selected && selected.monthly > 0 && (
        <div className="mt-8 rounded-lg border border-line bg-bg-soft/40 p-6">
          <div className="text-[10.5px] uppercase tracking-caps text-ink-3">{t('months')}</div>
          <div className="mt-3 flex items-center gap-3">
            <input
              type="range"
              min={6}
              max={24}
              step={1}
              value={monthlyTerm}
              onChange={(e) => setMonthlyTerm(parseInt(e.target.value))}
              className="flex-1 accent-ink"
            />
            <span className="w-24 text-right font-mono text-[14px]">{monthlyTerm} {t('monthsUnit')}</span>
          </div>
        </div>
      )}
    </>
  );
}

/* ════════ Step 4: Resumen ════════ */
function Step4Summary({ quote, contact }: { quote: QuoteCalc; contact: ContactInfo }) {
  const t = useTranslations('quote');
  return (
    <>
      <span className="eyebrow eyebrow-accent">— {t('step4')}</span>
      <h2 className="mt-3 font-serif text-3xl font-light italic md:text-4xl">{t('summary')}</h2>
      <p className="mt-3 text-[14px] text-ink-3">
        {t('summaryDesc', { email: contact.email })}
      </p>

      <div className="mt-8 space-y-6">
        <Block title={t('blockUnit')}>
          <Row k={t('rowPlaza')} v={quote.plaza.name} />
          <Row k={t('rowUnit')} v={unitSummary(quote.plaza, quote.unit)} />
          <Row k={t('rowDelivery')} v={quote.unit.delivery ?? quote.plaza.deliveryWindow ?? '—'} />
        </Block>

        <Block title={t('blockPlan')}>
          <Row k={t('rowScheme')} v={`${quote.plan.code} — ${quote.plan.label}`} />
          {quote.plan.discount > 0 && <Row k={t('rowDiscount')} v={`${quote.plan.discount}%`} />}
        </Block>

        <Block title={t('blockPayTable')}>
          <div className="space-y-3">
            {quote.schedule.map((item, i) => (
              <div key={i} className="flex items-start justify-between gap-4 border-b border-line/60 pb-3 last:border-0">
                <div>
                  <div className="font-medium text-[14px]">{item.label}</div>
                  {item.note && <div className="text-[11.5px] text-ink-3">{item.note}</div>}
                </div>
                <div className="shrink-0 font-mono text-[14px] tabular-nums">{formatMXN(item.amount)}</div>
              </div>
            ))}
          </div>
        </Block>

        <Block title={t('blockContact')}>
          <Row k={t('rowName')} v={contact.fullName} />
          <Row k={t('rowEmail')} v={contact.email} />
          <Row k={t('rowPhone')} v={contact.phone} />
          {contact.company && <Row k={t('rowCompany')} v={contact.company} />}
          {contact.isBroker && <Row k={t('rowBroker')} v={contact.brokerage || '✓'} />}
        </Block>
      </div>
    </>
  );
}

/* ════════ Helpers ════════ */
function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={cn('flex flex-col gap-1.5', className)}>
      <span className="field-label">{label}</span>
      {children}
    </label>
  );
}
function SumRow({ label, value, bold = false, accent = false }: { label: string; value: string; bold?: boolean; accent?: boolean }) {
  return (
    <div className="mt-3 flex items-center justify-between text-[13px]">
      <span className="text-ink-3">{label}</span>
      <span className={cn('tabular-nums', bold && 'font-serif text-2xl font-light italic', accent && 'text-accent')}>
        {value}
      </span>
    </div>
  );
}
function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-line bg-bg-soft/30 p-5">
      <div className="mb-3 text-[10.5px] uppercase tracking-caps text-ink-3">{title}</div>
      <div>{children}</div>
    </div>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 text-[13px]">
      <span className="text-ink-3">{k}</span>
      <span className="text-right font-medium">{v}</span>
    </div>
  );
}
