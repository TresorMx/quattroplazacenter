import 'server-only';
import { createClient } from 'next-sanity';
import type { Proyecto, Unidad, Status, Esquema } from './cotizador-data';

/* ────────────────────────────────────────────────────────────
   Inventario de Quattro — FUENTE ÚNICA: Sanity.
   Alimenta el cotizador de asesores (/cotizador), la lista de precios
   en PDF (/lista-precios/<slug>.pdf) y el panel (/inventario).
   Cliente sin CDN: un cambio en el panel debe verse en segundos, no en el
   minuto que tarda la CDN de Sanity en refrescar.
   ──────────────────────────────────────────────────────────── */
export const inventoryClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export const PLAZA_SLUGS = ['gardens', 'long-island'] as const;
export type PlazaSlug = (typeof PLAZA_SLUGS)[number];

export interface InventoryUnit {
  _id: string;
  code: string;
  level: 1 | 2;
  m2: number | null;
  price: number | null;
  delivery: string | null;
  status: Status;
  quotable: boolean;
  _updatedAt: string;
}

export interface PriceListFormulaRow {
  enganche: number;
  mensualidades: number;
  entrega: number;
  financiamiento: number;
  descuento: number;
}

export interface PriceListFormula {
  title: string;
  rows: PriceListFormulaRow[];
}

export interface InventoryPlaza {
  _id: string;
  slug: PlazaSlug;
  name: string;
  shortName: string;
  quoterAddress: string;
  apartadoDefault: number;
  bank: Proyecto['bank'];
  schemes: { 1: Esquema[]; 2: Esquema[] };
  footnote: string;
  /** Fórmulas de pago activas para la hoja aparte del PDF (lista de precios). */
  formulas: PriceListFormula[];
  formulasNote: string;
  deliveryWindow: string | null;
  units: InventoryUnit[];
  /** Última modificación de la plaza o de cualquiera de sus locales. */
  updatedAt: string;
}

const QUERY = `*[_type == "plaza" && slug.current in $slugs]{
  _id, "slug": slug.current, name, shortName, quoterAddress, apartadoDefault, bank,
  "schemes1": quoterSchemes.level1[]{enganche, diferido, entrega, descuento},
  "schemes2": quoterSchemes.level2[]{enganche, diferido, entrega, descuento},
  "footnote": priceListFootnote, deliveryWindow, _updatedAt,
  "formulas": priceListFormulas[coalesce(active, true) == true]{title, rows[]{enganche, mensualidades, entrega, financiamiento, descuento}},
  "formulasNote": priceListFormulasNote,
  "units": *[_type == "unit" && plazaSlug == ^.slug.current]{
    _id, code, level, m2, price, delivery, status, "quotable": coalesce(quotable, false), _updatedAt
  }
}`;

const num = (c: string) => parseInt(c, 10) || 0;

export async function getInventory(): Promise<InventoryPlaza[]> {
  const raw: any[] = await inventoryClient.fetch(QUERY, { slugs: PLAZA_SLUGS }, { cache: 'no-store' });
  return PLAZA_SLUGS.map((slug) => raw.find((p) => p.slug === slug))
    .filter(Boolean)
    .map((p) => {
      const units: InventoryUnit[] = (p.units ?? [])
        .map((u: any) => ({ ...u, level: (u.level === 2 ? 2 : 1) as 1 | 2, status: (u.status ?? 'disponible') as Status }))
        .sort((a: InventoryUnit, b: InventoryUnit) => num(a.code) - num(b.code));
      const updatedAt = [p._updatedAt, ...units.map((u) => u._updatedAt)].sort().at(-1);
      return {
        _id: p._id,
        slug: p.slug,
        name: p.name,
        shortName: p.shortName ?? p.name,
        quoterAddress: p.quoterAddress ?? '',
        apartadoDefault: p.apartadoDefault ?? 50000,
        bank: p.bank ?? { beneficiario: '', banco: '', cuenta: '', clabe: '' },
        schemes: { 1: p.schemes1 ?? [], 2: p.schemes2 ?? [] },
        footnote: p.footnote ?? '',
        formulas: (p.formulas ?? [])
          .filter((f: any) => f?.title && f.rows?.length)
          .map((f: any) => ({
            title: f.title,
            rows: f.rows.map((r: any) => ({
              enganche: r.enganche ?? 0,
              mensualidades: r.mensualidades ?? 0,
              entrega: r.entrega ?? 0,
              financiamiento: r.financiamiento ?? 0,
              descuento: r.descuento ?? 0,
            })),
          })),
        formulasNote: p.formulasNote ?? '',
        deliveryWindow: p.deliveryWindow ?? null,
        units,
        updatedAt,
      } satisfies InventoryPlaza;
    });
}

/* El cotizador habilita una unidad si está disponible al público O si un
   asesor la marcó como "Cotizable" (bloqueada/apartada pero liberada solo
   para cotizar). Vendidas nunca se cotizan. */
export function toProyecto(p: InventoryPlaza): Proyecto {
  const unidades: Unidad[] = p.units.map((u) => ({
    id: u.code,
    nivel: u.level,
    label: `NIVEL ${u.level} - ${u.code}`,
    m2: u.m2 ?? 0,
    precio: u.price,
    entrega: u.delivery ?? p.deliveryWindow ?? '',
    status: u.status !== 'vendido' && u.quotable ? 'disponible' : u.status,
  }));
  return {
    slug: p.slug,
    nombre: p.name,
    ubicacion: p.quoterAddress,
    apartadoDefault: p.apartadoDefault,
    bank: p.bank,
    esquemas: p.schemes,
    unidades,
  };
}

export async function getProyectos(): Promise<Proyecto[]> {
  return (await getInventory()).map(toProyecto);
}
