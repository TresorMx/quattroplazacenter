'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import type { Plaza, UnitSpecTemplate } from '@/lib/types';

interface Typology {
  id: string;
  label: string;
  desc: string;
  width: number;
  depth: number;
  area: number;
}

/** Genera tipologías representativas a partir de los locales reales de la plaza */
function buildTypologies(plaza: Plaza): Typology[] {
  const units = plaza.units ?? [];
  const available = units.filter((u) => u.status === 'disponible' && u.specs?.areaTotal);

  if (!available.length) {
    return [
      { id: 'std', label: 'Estándar', desc: 'Ideal para retail, cafetería boutique u oficina. Doble altura, instalaciones listas.', width: 5, depth: 8, area: 40 },
      { id: 'prem', label: 'Premium', desc: 'Mayor frente comercial, visibilidad desde vialidad. Fachada vidriada de piso a techo.', width: 6.5, depth: 9, area: 58 },
    ];
  }

  const areas = available.map((u) => Number(u.specs!.areaTotal)).sort((a, b) => a - b);
  const min = areas[0];
  const max = areas[areas.length - 1];
  const mid = areas[Math.floor(areas.length / 2)];

  const types: Typology[] = [
    {
      id: 'std',
      label: 'Estándar',
      desc: 'Ideal para retail, cafetería boutique u oficina pequeña. Doble altura, instalaciones eléctricas e hidráulicas listas.',
      width: Math.round((min ** 0.5) * 10) / 10,
      depth: Math.round((min / (min ** 0.5)) * 10) / 10,
      area: min,
    },
  ];

  if (max - min > 15) {
    types.push({
      id: 'prem',
      label: 'Premium',
      desc: 'Mayor frente comercial y visibilidad desde la vialidad. Fachada vidriada de piso a techo, ideal para restaurante o showroom.',
      width: Math.round((mid ** 0.5) * 10) / 10,
      depth: Math.round((mid / (mid ** 0.5)) * 10) / 10,
      area: mid,
    });
  }

  if (max - min > 40) {
    types.push({
      id: 'ancla',
      label: 'Ancla',
      desc: 'Local de esquina o ancla con frente doble y mayor superficie. Capacidad para supermercado, farmacia o banco.',
      width: Math.round((max ** 0.5) * 10) / 10,
      depth: Math.round((max / (max ** 0.5)) * 10) / 10,
      area: max,
    });
  }

  return types;
}

/** SVG simplificado de planta arquitectónica */
function FloorPlanSVG({ width, depth, area }: { width: number; depth: number; area: number }) {
  const scaleW = 340 / Math.max(width, 1);
  const scaleD = 220 / Math.max(depth, 1);
  const scale = Math.min(scaleW, scaleD, 30);
  const pw = width * scale;
  const pd = depth * scale;
  const ox = (360 - pw) / 2;
  const oy = (240 - pd) / 2;
  const bathW = Math.min(pw * 0.28, 80);
  const bathH = Math.min(pd * 0.38, 80);

  return (
    <svg viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <pattern id="dots" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="0.5" fill="#DDD7CB" />
        </pattern>
      </defs>

      {/* Contorno */}
      <rect x={ox} y={oy} width={pw} height={pd} fill="url(#dots)" stroke="#0E0E0E" strokeWidth="2" rx="2" />

      {/* Baño */}
      <line x1={ox + pw - bathW} y1={oy} x2={ox + pw - bathW} y2={oy + bathH} stroke="#0E0E0E" strokeWidth="1.2" />
      <line x1={ox + pw - bathW} y1={oy + bathH} x2={ox + pw} y2={oy + bathH} stroke="#0E0E0E" strokeWidth="1.2" />
      <rect x={ox + pw - bathW + 6} y={oy + 8} width={bathW - 12} height={bathH - 16} fill="#fff" stroke="#0E0E0E" strokeWidth="0.8" rx="1" />
      <text x={ox + pw - bathW / 2} y={oy + bathH / 2 + 4} textAnchor="middle" fontFamily="Manrope, sans-serif" fontSize="8" letterSpacing="1.5" fill="#6B6863">WC</text>

      {/* Área comercial */}
      <text x={ox + (pw - bathW) / 2} y={oy + pd / 2 - 8} textAnchor="middle" fontFamily="Cormorant Garamond, Georgia, serif" fontStyle="italic" fontSize="20" fill="#0E0E0E">
        Local comercial
      </text>
      <text x={ox + (pw - bathW) / 2} y={oy + pd / 2 + 14} textAnchor="middle" fontFamily="Manrope, sans-serif" fontSize="10" fill="#6B6863">
        {(area * 0.8).toFixed(0)} m²
      </text>

      {/* Entrada */}
      <line x1={ox + pw * 0.35} y1={oy + pd} x2={ox + pw * 0.6} y2={oy + pd} stroke="#FAB413" strokeWidth="4" />

      {/* Cotas */}
      <text x={ox + pw / 2} y={oy - 6} textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#6B6863">
        {width.toFixed(2)} m
      </text>
      <text x={ox + pw + 14} y={oy + pd / 2 + 4} textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#6B6863" transform={`rotate(90, ${ox + pw + 14}, ${oy + pd / 2 + 4})`}>
        {depth.toFixed(2)} m
      </text>
    </svg>
  );
}

export default function FloorPlans({ plaza, floorPlansDesc }: { plaza: Plaza; floorPlansDesc?: string }) {
  const t = useTranslations('plaza');
  const locale = useLocale();
  const isEs = locale !== 'en';
  const [active, setActive] = useState(0);

  const fpLabel = (fp: { label: string; labelEn?: string }) =>
    isEs ? fp.label : (fp.labelEn ?? fp.label);

  // ── Modo A: imágenes reales de Sanity ──────────────────────────
  const sanityPlans = (plaza.floorPlans ?? [])
    .filter((fp) => fp.image)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  if (sanityPlans.length > 0) {
    const current = sanityPlans[active];
    return (
      <section className="border-t border-line py-20 md:py-28" id="floor-plans">
        <div className="container-wrap">
          <div className="mb-10 grid items-end gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <span className="eyebrow eyebrow-accent block">{t('fpEyebrow')}</span>
              <h2 className="mt-4 h-display text-[clamp(34px,4vw,56px)]">{t('fpTitle')}</h2>
              <p className="mt-3 max-w-[52ch] text-[15px] font-light text-ink-3">
                {floorPlansDesc ?? t('fpDesc')}
              </p>
            </div>
            {sanityPlans.length > 1 && (
              <div className="flex items-center gap-1 rounded-full border border-line bg-white p-1">
                {sanityPlans.map((fp, i) => (
                  <button
                    key={fp.label}
                    onClick={() => setActive(i)}
                    className={`rounded-full px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors ${
                      active === i ? 'bg-ink text-bg' : 'text-ink-3 hover:text-ink'
                    }`}
                  >
                    {fpLabel(fp)}{fp.area != null ? ` — ${fp.area} m²` : ''}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
            {/* Imagen del floor plan */}
            <div className="flex items-center justify-center rounded-[18px] border border-line bg-white overflow-hidden aspect-[1.4/1]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current.image!}
                alt={fpLabel(current)}
                className="w-full h-full object-contain p-6"
              />
            </div>

            {/* Info panel */}
            <div className="rounded-[18px] border border-line bg-white p-8">
              <div className="text-[10.5px] uppercase tracking-[0.18em] text-ink-3">{t('fpTypical')}</div>
              <div className="mt-1.5 font-serif text-[32px] font-light italic leading-tight">
                {fpLabel(current)}{current.area != null ? ` — ${current.area} m²` : ''}
              </div>
              {(current.area != null || current.frente != null || current.fondo != null) && (
                <div className="mt-4 flex flex-col gap-3 border-t border-line pt-4">
                  {current.area != null && (
                    <div className="flex justify-between text-[13px]">
                      <span className="text-ink-3">Área total</span>
                      <span className="font-medium tabular-nums">{current.area} m²</span>
                    </div>
                  )}
                  {current.frente != null && (
                    <div className="flex justify-between text-[13px]">
                      <span className="text-ink-3">Frente</span>
                      <span className="font-medium tabular-nums">{current.frente} m</span>
                    </div>
                  )}
                  {current.fondo != null && (
                    <div className="flex justify-between text-[13px]">
                      <span className="text-ink-3">Fondo</span>
                      <span className="font-medium tabular-nums">{current.fondo} m</span>
                    </div>
                  )}
                </div>
              )}
              <Link
                href="#master-plan"
                className="mt-6 inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-ink transition-colors hover:text-accent"
              >
                {t('fpViewAvail')}
                <ArrowRight size={14} strokeWidth={1.6} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── Modo B: SVG generado a partir de los locales (fallback) ────
  const typologies = buildTypologies(plaza);
  const currentTyp = typologies[Math.min(active, typologies.length - 1)];

  const specTemplate: UnitSpecTemplate[] = plaza.unitSpecsTemplate ?? [
    { key: 'areaTotal', label: 'Área total', unit: 'm²', order: 1, type: 'number' },
    { key: 'frente',    label: 'Frente',     unit: 'm',  order: 2, type: 'number' },
    { key: 'fondo',     label: 'Fondo',      unit: 'm',  order: 3, type: 'number' },
  ];
  const specValues: Record<string, string> = {
    areaTotal: `${currentTyp.area.toFixed(2)} m²`,
    frente:    `${currentTyp.width.toFixed(2)} m`,
    fondo:     `${currentTyp.depth.toFixed(2)} m`,
  };

  return (
    <section className="border-t border-line py-20 md:py-28" id="floor-plans">
      <div className="container-wrap">
        <div className="mb-10 grid items-end gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <span className="eyebrow eyebrow-accent block">{t('fpEyebrow')}</span>
            <h2 className="mt-4 h-display text-[clamp(34px,4vw,56px)]">{t('fpTitle')}</h2>
            <p className="mt-3 max-w-[52ch] text-[15px] font-light text-ink-3">
              {floorPlansDesc ?? t('fpDesc')}
            </p>
          </div>
          {typologies.length > 1 && (
            <div className="flex items-center gap-1 rounded-full border border-line bg-white p-1">
              {typologies.map((typ, i) => (
                <button
                  key={typ.id}
                  onClick={() => setActive(i)}
                  className={`rounded-full px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors ${
                    active === i ? 'bg-ink text-bg' : 'text-ink-3 hover:text-ink'
                  }`}
                >
                  {typ.label} {typ.area.toFixed(0)} m²
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
          <div className="flex items-center justify-center rounded-[18px] border border-line bg-white p-8 aspect-[1.4/1]">
            <FloorPlanSVG width={currentTyp.width} depth={currentTyp.depth} area={currentTyp.area} />
          </div>
          <div className="rounded-[18px] border border-line bg-white p-8">
            <div className="text-[10.5px] uppercase tracking-[0.18em] text-ink-3">{t('fpTypical')}</div>
            <div className="mt-1.5 font-serif text-[32px] font-light italic leading-tight">
              {currentTyp.label} — {currentTyp.area.toFixed(0)} m²
            </div>
            <p className="mt-3.5 text-[14px] leading-[1.6] text-ink-2">{currentTyp.desc}</p>
            <div className="mt-6 flex flex-col gap-3.5 border-t border-line pt-5">
              {specTemplate.sort((a, b) => a.order - b.order).map((spec) => {
                const val = specValues[spec.key];
                if (!val) return null;
                return (
                  <div key={spec.key} className="flex justify-between text-[13px]">
                    <span className="text-ink-3">{spec.label}</span>
                    <span className="font-medium tabular-nums">{val}</span>
                  </div>
                );
              })}
            </div>
            <Link
              href="#master-plan"
              className="mt-6 inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-ink transition-colors hover:text-accent"
            >
              {t('fpViewAvail')}
              <ArrowRight size={14} strokeWidth={1.6} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
