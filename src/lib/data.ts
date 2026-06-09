/**
 * Loader del catálogo.
 * Lee de Sanity si NEXT_PUBLIC_SANITY_PROJECT_ID está configurado,
 * de lo contrario usa el JSON estático en /content/data/plazas.json como fallback.
 * La interfaz Plaza[] es estable — los consumidores no cambian.
 */
import { cache } from 'react';
import type { Plaza, PlazasData, Unit } from './types';

const USE_SANITY = !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

// ─── Fallback: JSON estático ──────────────────────────────────────────────────
import plazasData from '../../content/data/plazas.json';
const staticData = plazasData as unknown as PlazasData;

// ─── Cache en memoria (evita re-fetch por cada getPlazaBySlug) ────────────────
let _cache: Plaza[] | null = null;
let _cacheTs = 0;
const CACHE_TTL = 60_000; // 1 minuto

async function loadPlazas(): Promise<Plaza[]> {
  if (!USE_SANITY) return staticData.plazas;

  const now = Date.now();
  if (_cache && now - _cacheTs < CACHE_TTL) return _cache;

  try {
    const { fetchAllPlazas } = await import('./sanity/queries');
    const plazas = await fetchAllPlazas();
    _cache  = plazas.length > 0 ? plazas : staticData.plazas;
    _cacheTs = now;
    return _cache;
  } catch (e) {
    console.error('[data] Sanity fetch failed, falling back to JSON', e);
    return staticData.plazas;
  }
}

// ─── API sincrónica (para API routes y server components que ya esperan sync) ─
// Retorna el cache o el JSON — se hidrata con getPlazasAsync en layouts

function getStaticOrCached(): Plaza[] {
  return _cache ?? staticData.plazas;
}

export function getAllPlazas(): Plaza[] {
  return getStaticOrCached();
}

export function getActivePlazas(): Plaza[] {
  return getStaticOrCached().filter((p) => !p.comingSoon);
}

export function getComingSoonPlazas(): Plaza[] {
  return getStaticOrCached().filter((p) => p.comingSoon);
}

export function getPlazaBySlug(slug: string): Plaza | undefined {
  return getStaticOrCached().find((p) => p.slug === slug);
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

// ─── API async (úsala en Server Components / layouts) ─────────────────────────
export async function loadAndCachePlazas(): Promise<Plaza[]> {
  return loadPlazas();
}

// ─── API async deduplicada con React.cache() ──────────────────────────────────
// React.cache() garantiza que dentro de un mismo request, loadPlazas() se
// llama UNA sola vez aunque layout y páginas lo pidan en paralelo.
export const getPlazasAsync = cache((): Promise<Plaza[]> => loadPlazas());

export async function getPlazaBySlugAsync(slug: string): Promise<Plaza | undefined> {
  const plazas = await getPlazasAsync();
  return plazas.find((p) => p.slug === slug);
}

export async function getActivePlazasAsync(): Promise<Plaza[]> {
  const plazas = await getPlazasAsync();
  return plazas.filter((p) => !p.comingSoon);
}

export async function getSiteSettings() {
  const fallback = { showAgendaWidget: false, agendaEyebrow: '— Agenda tu visita', agendaTitle1: 'Agenda', agendaTitle2: 'tu visita', agendaDesc: 'Elige fecha, hora y modalidad. Te confirmamos en menos de 24 hrs.' };
  if (!USE_SANITY) return fallback;
  try {
    const { fetchSiteSettings } = await import('./sanity/queries');
    return fetchSiteSettings();
  } catch {
    return fallback;
  }
}
