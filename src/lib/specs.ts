/**
 * Helpers para leer specs dinámicas (plaza.unitSpecsTemplate + unit.specs).
 *
 * Si una llave existe en el template pero el local no tiene valor, NO se muestra.
 * Si una llave existe en el local pero el template fue eliminado, NO se muestra.
 * (Ambos lados son tolerantes a faltantes — graceful degradation.)
 */
import type { Plaza, Unit, UnitSpecTemplate } from './types';

export interface ResolvedSpec {
  key: string;
  label: string;
  value: string;
  unit?: string;
  /** Para uso en chips/listas: "40.6 m²" */
  display: string;
}

export function resolveSpecs(plaza: Plaza, unit: Unit): ResolvedSpec[] {
  const template = plaza.unitSpecsTemplate;
  const values = unit.specs;
  if (!template?.length || !values) return [];
  return [...template]
    .sort((a, b) => a.order - b.order)
    .map((spec): ResolvedSpec | null => {
      const raw = values[spec.key];
      if (raw === undefined || raw === '' || raw === null) return null;
      const value = String(raw);
      return {
        key: spec.key,
        label: spec.label,
        value,
        unit: spec.unit,
        display: spec.unit ? `${value} ${spec.unit}` : value,
      };
    })
    .filter((x): x is ResolvedSpec => x !== null);
}

/** Primer spec con valor — útil para listas compactas */
export function primarySpec(plaza: Plaza, unit: Unit): string {
  const all = resolveSpecs(plaza, unit);
  return all[0]?.display ?? '';
}

/** Texto resumen del local: "A-12 · Nivel 1 · 40.6 m²" */
export function unitSummary(plaza: Plaza, unit: Unit): string {
  const parts: string[] = [unit.code];
  if (unit.level) parts.push(`Nivel ${unit.level}`);
  const first = primarySpec(plaza, unit);
  if (first) parts.push(first);
  return parts.join(' · ');
}
