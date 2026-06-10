'use client';

import { useState, useMemo } from 'react';
import { Link } from '@/navigation';
import { ArrowRight, Maximize2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { Plaza, Unit, UnitStatus, UnitSpecTemplate } from '@/lib/types';
import { formatMXN } from '@/lib/utils';
import { cn } from '@/lib/utils';

/**
 * MasterPlan interactivo.
 * Desktop: imagen del master plan + pines SVG con coordenadas relativas.
 * Mobile: lista filtrable de locales con thumbnail del master plan arriba.
 *
 * Las coordenadas de los pines se editan en Sanity. Si no hay pin definido,
 * se posiciona en grid automático según el código del local.
 */
export default function MasterPlan({ plaza, showAgendaWidget = false }: { plaza: Plaza; showAgendaWidget?: boolean }) {
  const t = useTranslations('plaza');
  const [level, setLevel] = useState<1 | 2>(1);
  const [statusFilter, setStatusFilter] = useState<UnitStatus | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const units = plaza.units ?? [];
  const levelUnits = useMemo(() => units.filter((u) => u.level === level), [units, level]);
  const filtered = useMemo(
    () => (statusFilter === 'all' ? levelUnits : levelUnits.filter((u) => u.status === statusFilter)),
    [levelUnits, statusFilter],
  );

  const selected = selectedId ? units.find((u) => u.id === selectedId) : null;

  const masterPlanImg =
    level === 1
      ? plaza.masterPlanImage ?? `/master-plans/${plaza.slug}-n1.png`
      : plaza.masterPlanLevel2 ?? `/master-plans/${plaza.slug}-n2.png`;

  const statusCounts = useMemo(() => {
    const c = { disponible: 0, apartado: 0, vendido: 0, bloqueado: 0 };
    levelUnits.forEach((u) => c[u.status]++);
    return c;
  }, [levelUnits]);

  return (
    <section className="bg-bg-soft/40 py-20 md:py-28">
      <div className="container-wrap">
        <div className="mb-12 grid items-end gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <span className="eyebrow eyebrow-accent block">{t('masterPlanEyebrow')}</span>
            <h2 className="mt-4 h-display text-[clamp(34px,4vw,56px)]">
              {t('masterPlanTitle')}
            </h2>
            <p className="mt-3 max-w-[52ch] text-[15px] font-light text-ink-3">
              {t('masterPlanDesc')}
            </p>
          </div>

          {/* Level switcher */}
          <div className="flex items-center gap-2 self-start rounded-full border border-line bg-white p-1 md:self-end">
            {[1, 2].map((n) => (
              <button
                key={n}
                onClick={() => {
                  setLevel(n as 1 | 2);
                  setSelectedId(null);
                }}
                className={cn(
                  'rounded-full px-5 py-2 text-[11px] font-semibold uppercase tracking-caps transition-colors',
                  level === n ? 'bg-ink text-bg' : 'text-ink-3 hover:text-ink',
                )}
              >
                {t('level')} {n}
              </button>
            ))}
          </div>
        </div>

        {/* Status legend + filters */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            {(['disponible', 'apartado', 'vendido', 'bloqueado'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(statusFilter === s ? 'all' : s)}
                className={cn(
                  `avail avail-${s} cursor-pointer rounded-full px-3 py-1.5 transition-colors`,
                  statusFilter === s ? 'bg-ink text-bg' : 'hover:bg-bg-soft',
                )}
              >
                {s} ({statusCounts[s]})
              </button>
            ))}
            {statusFilter !== 'all' && (
              <button
                onClick={() => setStatusFilter('all')}
                className="text-[11px] uppercase tracking-caps text-ink-3 underline-offset-4 hover:underline"
              >
                {t('clearFilter')}
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[1.6fr_1fr]">
          {/* ──── Master plan image with interactive pins ──── */}
          <div className="relative overflow-hidden rounded-lg border border-line bg-white shadow-sm">
            {/* Container sin aspect ratio fijo: la imagen determina la altura */}
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={masterPlanImg}
                alt={`Master plan ${plaza.shortName} Nivel ${level}`}
                className="block w-full"
                draggable={false}
              />

              {/* Pins overlay — divs absolutos en % para evitar distorsión SVG */}
              {filtered.map((u) => {
                // Sin pin en Sanity → no se muestra (no autopin)
                if (!u.pin) return null;
                const isSelected = selectedId === u.id;
                const fill = statusColor(u.status);
                const isClickable = u.status === 'disponible';

                return (
                  <div
                    key={u.id}
                    onClick={() => setSelectedId(u.id)}
                    style={{
                      position: 'absolute',
                      left: `${u.pin.x * 100}%`,
                      top: `${u.pin.y * 100}%`,
                      transform: 'translate(-50%, -50%)',
                      width: isSelected ? '2.2%' : '1.8%',
                      aspectRatio: '1',
                      borderRadius: '50%',
                      background: fill,
                      opacity: isClickable ? 0.95 : 0.6,
                      border: '2px solid white',
                      boxShadow: isSelected
                        ? `0 0 0 3px ${fill}55, 0 2px 8px rgba(0,0,0,0.3)`
                        : '0 1px 4px rgba(0,0,0,0.3)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      zIndex: isSelected ? 10 : 1,
                    }}
                  />
                );
              })}

              <button
                aria-label="Pantalla completa"
                className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-ink shadow-sm transition-colors hover:bg-white"
              >
                <Maximize2 size={14} strokeWidth={1.6} />
              </button>
            </div>
          </div>

          {/* ──── Right column: selected unit OR list (mobile) ──── */}
          <div className="flex flex-col gap-4">
            {/* Selected unit detail */}
            {selected ? (
              <div className="rounded-lg border border-line bg-white p-7">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10.5px] uppercase tracking-caps text-ink-3">
                      Local
                    </span>
                    <div className="font-serif text-5xl font-light italic leading-none">
                      {selected.code}
                    </div>
                  </div>
                  <span className={`avail avail-${selected.status} text-[11px]`}>
                    {selected.status}
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-5 border-y border-line py-5">
                  {/* Specs dinámicas (definidas en plaza.unitSpecsTemplate) */}
                  {renderDynamicSpecs(plaza.unitSpecsTemplate, selected.specs)}
                  <Spec label={t('level')} value={`${t('level')} ${selected.level}`} />
                  {selected.delivery && <Spec label="Entrega" value={selected.delivery} />}
                  {selected.price && (
                    <Spec label="Precio + IVA" value={formatMXN(selected.price)} highlight />
                  )}
                </div>

                {selected.status === 'disponible' && selected.price ? (
                  showAgendaWidget ? (
                    <button
                      onClick={() => document.getElementById('aparta')?.scrollIntoView({ behavior: 'smooth' })}
                      className="btn btn-primary mt-5 w-full font-semibold"
                    >
                      {t('agendaThis')}
                      <ArrowRight size={14} strokeWidth={1.6} />
                    </button>
                  ) : (
                    <Link
                      href={`/cotizar/${plaza.slug}?unit=${selected.id}`}
                      className="btn btn-primary mt-5 w-full font-semibold"
                    >
                      {t('quoteThis')}
                      <ArrowRight size={14} strokeWidth={1.6} />
                    </Link>
                  )
                ) : (
                  <div className="mt-5 rounded bg-bg-soft px-4 py-3 text-[12px] text-ink-3">
                    {selected.status === 'vendido' && t('soldMsg')}
                    {selected.status === 'apartado' && t('reservedMsg')}
                    {selected.status === 'bloqueado' && t('blockedMsg')}
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-line bg-white/60 p-7 text-center">
                <div className="font-serif text-2xl font-light italic text-ink-3">
                  {t('selectUnit')}
                </div>
                <p className="mt-2 text-[13px] text-ink-3">
                  {t('selectUnitHint')}
                </p>
              </div>
            )}

            {/* Unit list (always visible, compact) */}
            <div className="overflow-hidden rounded-lg border border-line bg-white">
              <div className="border-b border-line bg-bg-soft px-5 py-3 text-[10.5px] uppercase tracking-caps text-ink-3">
                {t('unitList')} · {t('level')} {level} ({filtered.length})
              </div>
              <ul className="max-h-[280px] overflow-y-auto">
                {filtered.map((u) => (
                  <li key={u.id}>
                    <button
                      onClick={() => setSelectedId(u.id)}
                      className={cn(
                        'flex w-full items-center justify-between gap-3 border-b border-line/60 px-5 py-3 text-left transition-colors last:border-b-0 hover:bg-bg-soft',
                        selectedId === u.id && 'bg-bg-soft',
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[12px] font-medium text-ink">{u.code}</span>
                        <span className="text-[12px] text-ink-3">{primarySpec(plaza.unitSpecsTemplate, u.specs)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {u.price && (
                          <span className="text-[12px] tabular-nums text-ink-2">
                            {formatMXN(u.price)}
                          </span>
                        )}
                        <span className={`avail avail-${u.status} !text-[10px]`} />
                      </div>
                    </button>
                  </li>
                ))}
                {filtered.length === 0 && (
                  <li className="px-5 py-6 text-center text-[13px] text-ink-3">
                    {t('noUnitsFilter')}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Spec({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <div className="text-[10.5px] uppercase tracking-caps text-ink-3">{label}</div>
      <div className={cn('mt-1.5 font-sans text-[15px] font-medium tabular-nums', highlight && 'text-accent text-base font-semibold')}>
        {value}
      </div>
    </div>
  );
}

function statusColor(s: UnitStatus) {
  return {
    disponible: '#5E9A4B',
    apartado: '#D4A23A',
    vendido: '#C8543E',
    bloqueado: '#9A968D',
  }[s];
}

/**
 * Renderiza las specs definidas por la plaza, en orden, ignorando las que vengan vacías.
 * Si la plaza no tiene template, no muestra nada (no inventa campos).
 */
function renderDynamicSpecs(
  template: UnitSpecTemplate[] | undefined,
  values: Record<string, string | number | undefined> | undefined,
) {
  if (!template?.length || !values) return null;
  return [...template]
    .sort((a, b) => a.order - b.order)
    .map((spec) => {
      const raw = values[spec.key];
      if (raw === undefined || raw === '' || raw === null) return null;
      const display = spec.unit ? `${raw} ${spec.unit}` : String(raw);
      return <Spec key={spec.key} label={spec.label} value={display} />;
    })
    .filter(Boolean);
}

/** Devuelve el primer spec con valor (usado en la lista compacta). */
function primarySpec(
  template: UnitSpecTemplate[] | undefined,
  values: Record<string, string | number | undefined> | undefined,
): string {
  if (!template?.length || !values) return '';
  const sorted = [...template].sort((a, b) => a.order - b.order);
  for (const spec of sorted) {
    const raw = values[spec.key];
    if (raw !== undefined && raw !== '' && raw !== null) {
      return spec.unit ? `${raw} ${spec.unit}` : String(raw);
    }
  }
  return '';
}

