/**
 * Loader del catálogo. Hoy lee el JSON estático en /content/data/plazas.json.
 * Cuando Sanity esté configurado, se sustituye por un fetch a Sanity vía GROQ
 * sin tocar los consumidores: la interfaz Plaza[] es estable.
 */
import plazasData from '../../content/data/plazas.json';
import type { Plaza, PlazasData, Unit } from './types';

const data = plazasData as unknown as PlazasData;

export function getAllPlazas(): Plaza[] {
  return data.plazas;
}

export function getActivePlazas(): Plaza[] {
  return data.plazas.filter((p) => !p.comingSoon);
}

export function getComingSoonPlazas(): Plaza[] {
  return data.plazas.filter((p) => p.comingSoon);
}

export function getPlazaBySlug(slug: string): Plaza | undefined {
  return data.plazas.find((p) => p.slug === slug);
}

export function getUnit(plazaSlug: string, unitId: string): Unit | undefined {
  return getPlazaBySlug(plazaSlug)?.units?.find((u) => u.id === unitId);
}

export function getAvailableUnits(plazaSlug: string): Unit[] {
  return getPlazaBySlug(plazaSlug)?.units?.filter((u) => u.status === 'disponible') ?? [];
}

export function getPriceRange(plaza: Plaza): { min: number; max: number } | null {
  const prices = plaza.units?.filter((u) => u.price && u.status === 'disponible').map((u) => u.price!) ?? [];
  if (!prices.length) return null;
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function getMinAvailablePrice(plaza: Plaza): number | null {
  const range = getPriceRange(plaza);
  return range?.min ?? null;
}
