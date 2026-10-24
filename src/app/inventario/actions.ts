'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { inventoryClient, PLAZA_SLUGS } from '@/lib/inventory';
import { checkPassword, currentUser, endSession, startSession } from '@/lib/inventory-auth';
import type { Status } from '@/lib/cotizador-data';

export async function login(_prev: string | null, form: FormData): Promise<string | null> {
  const name = String(form.get('name') ?? '').trim();
  const pw = String(form.get('password') ?? '');
  if (name.length < 2) return 'Escribe tu nombre.';
  if (!checkPassword(pw)) return 'Contraseña incorrecta.';
  await startSession(name);
  redirect('/inventario');
}

export async function logout() {
  await endSession();
  redirect('/inventario');
}

// ── Fórmulas de pago (hoja aparte de la lista de precios en PDF) ──────────
// Se guardan en `plaza.priceListFormulas` / `priceListFormulasNote`. El PDF
// las lee en vivo; el cotizador NO las usa (sigue con quoterSchemes).

export interface FormulaRowInput {
  enganche: number;
  mensualidades: number;
  entrega: number;
  financiamiento: number;
  descuento: number;
}

export interface FormulaInput {
  key: string;
  title: string;
  active: boolean;
  /** Muestra la columna Financiamiento. Apagada, el financiamiento cuenta como 0. */
  showFinancing: boolean;
  rows: FormulaRowInput[];
}

const ROW_FIELDS = ['enganche', 'mensualidades', 'entrega', 'financiamiento', 'descuento'] as const;
const newKey = () => crypto.randomUUID().replace(/-/g, '').slice(0, 12);

export async function saveFormulas(
  plazaSlug: string,
  formulas: FormulaInput[],
  note: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const by = await currentUser();
  if (!by) return { ok: false, error: 'Tu sesión expiró. Vuelve a entrar.' };
  if (!PLAZA_SLUGS.includes(plazaSlug as any)) return { ok: false, error: 'Plaza no encontrada.' };
  if (!Array.isArray(formulas) || formulas.length > 10) return { ok: false, error: 'Máximo 10 fórmulas.' };
  if (typeof note !== 'string' || note.length > 1000) return { ok: false, error: 'La nota es demasiado larga.' };

  // Validación del lado del servidor: el cliente no es confiable.
  const clean: { _key: string; _type: 'formula'; title: string; active: boolean; showFinancing: boolean; rows: Record<string, unknown>[] }[] = [];
  for (const [i, f] of formulas.entries()) {
    const title = String(f?.title ?? '').trim();
    const label = title || `Fórmula ${i + 1}`;
    if (!title) return { ok: false, error: `La fórmula ${i + 1} necesita título.` };
    if (title.length > 120) return { ok: false, error: `El título de "${label}" es demasiado largo.` };
    if (!Array.isArray(f.rows) || f.rows.length < 1 || f.rows.length > 10) return { ok: false, error: `"${label}" debe tener de 1 a 10 opciones.` };
    const rows: Record<string, unknown>[] = [];
    for (const [j, r] of f.rows.entries()) {
      const vals = Object.fromEntries(ROW_FIELDS.map((k) => [k, Number(r?.[k] ?? 0)])) as Record<(typeof ROW_FIELDS)[number], number>;
      if (!f.showFinancing) vals.financiamiento = 0;
      if (ROW_FIELDS.some((k) => !Number.isFinite(vals[k]) || vals[k] < 0 || vals[k] > 100)) {
        return { ok: false, error: `"${label}", opción ${j + 1}: los porcentajes van de 0 a 100.` };
      }
      const sum = vals.enganche + vals.mensualidades + vals.entrega + vals.financiamiento;
      if (Math.abs(sum - 100) > 1e-9) return { ok: false, error: `"${label}", opción ${j + 1}: debe sumar 100 % (suma ${sum} %).` };
      rows.push({
        _key: newKey(), _type: 'formulaRow',
        enganche: vals.enganche, mensualidades: vals.mensualidades, entrega: vals.entrega, descuento: vals.descuento,
        ...(vals.financiamiento > 0 ? { financiamiento: vals.financiamiento } : {}),
      });
    }
    const key = /^[A-Za-z0-9_-]{1,40}$/.test(f.key ?? '') ? f.key : newKey();
    clean.push({ _key: key, _type: 'formula', title, active: !!f.active, showFinancing: !!f.showFinancing, rows });
  }

  const plaza: any = await inventoryClient.fetch(
    `*[_type == "plaza" && slug.current == $slug][0]{ _id, priceListFormulas, priceListFormulasNote }`,
    { slug: plazaSlug },
  );
  if (!plaza) return { ok: false, error: 'Plaza no encontrada.' };

  // Resumen para la bitácora: qué fórmulas se agregaron, quitaron o cambiaron.
  const showsFin = (f: any) => f.showFinancing ?? (f.rows ?? []).some((r: any) => (r.financiamiento ?? 0) > 0);
  const sig = (f: any) => JSON.stringify([f.title, f.active !== false, showsFin(f), (f.rows ?? []).map((r: any) => ROW_FIELDS.map((k) => r[k] ?? 0))]);
  const before = new Map<string, any>((plaza.priceListFormulas ?? []).map((f: any) => [f._key, f]));
  const parts: string[] = [];
  for (const f of clean) {
    const prev = before.get(f._key);
    if (!prev) parts.push(`agregó "${f.title}"`);
    else if (sig(prev) !== sig(f)) {
      // Si solo cambió el interruptor, dilo así; si no, "modificó".
      const onlyToggle = sig({ ...prev, active: f.active }) === sig(f);
      parts.push(onlyToggle ? `${f.active ? 'activó' : 'desactivó'} "${f.title}"` : `modificó "${f.title}"`);
    }
    before.delete(f._key);
  }
  for (const f of before.values()) parts.push(`quitó "${f.title}"`);
  const prevOrder = (plaza.priceListFormulas ?? []).map((f: any) => f._key).filter((k: string) => clean.some((c) => c._key === k));
  const newOrder = clean.map((c) => c._key).filter((k) => prevOrder.includes(k));
  if (!parts.length && prevOrder.join() !== newOrder.join()) parts.push('cambió el orden');
  const noteClean = note.trim();
  if ((plaza.priceListFormulasNote ?? '') !== noteClean) parts.push('cambió la nota al pie');
  if (!parts.length) return { ok: true };

  await inventoryClient
    .transaction()
    .patch(plaza._id, (p) => (noteClean ? p.set({ priceListFormulas: clean, priceListFormulasNote: noteClean }) : p.set({ priceListFormulas: clean }).unset(['priceListFormulasNote'])))
    .create({ _type: 'inventoryLog', at: new Date().toISOString(), by, plazaSlug, code: 'Fórmulas', summary: parts.join(' · ') })
    .commit();

  // El PDF se genera en vivo; solo hay que refrescar el panel.
  revalidatePath('/inventario');
  return { ok: true };
}

export interface UnitPatch {
  status?: Status;
  quotable?: boolean;
  price?: number | null;
  m2?: number | null;
  delivery?: string | null;
}

const STATUSES: Status[] = ['disponible', 'apartado', 'vendido', 'bloqueado'];
const LABEL: Record<string, string> = { status: 'estatus', quotable: 'cotizable', price: 'precio', m2: 'm²', delivery: 'entrega' };
const fmt = (k: string, v: unknown) =>
  v == null || v === '' ? '—'
  : k === 'price' ? `$${Number(v).toLocaleString('en-US')}`
  : k === 'quotable' ? (v ? 'sí' : 'no')
  : String(v);

export async function saveUnit(unitId: string, patch: UnitPatch): Promise<{ ok: true; updatedAt: string } | { ok: false; error: string }> {
  const by = await currentUser();
  if (!by) return { ok: false, error: 'Tu sesión expiró. Vuelve a entrar.' };

  const current: any = await inventoryClient.fetch(
    `*[_type == "unit" && _id == $id][0]{ _id, code, plazaSlug, status, quotable, price, m2, delivery }`,
    { id: unitId },
  );
  if (!current || !PLAZA_SLUGS.includes(current.plazaSlug)) return { ok: false, error: 'Local no encontrado.' };

  // Validación del lado del servidor: el cliente no es confiable.
  const set: Record<string, unknown> = {};
  if (patch.status !== undefined) {
    if (!STATUSES.includes(patch.status)) return { ok: false, error: 'Estatus inválido.' };
    set.status = patch.status;
  }
  if (patch.quotable !== undefined) set.quotable = !!patch.quotable;
  for (const k of ['price', 'm2'] as const) {
    if (patch[k] === undefined) continue;
    const v = patch[k];
    if (v !== null && (!Number.isFinite(v) || v < 0)) return { ok: false, error: `Valor inválido en ${LABEL[k]}.` };
    set[k] = v;
  }
  if (patch.delivery !== undefined) set.delivery = patch.delivery?.trim().toUpperCase() || null;

  const changes = Object.entries(set).filter(([k, v]) => (current[k] ?? null) !== (v ?? null));
  if (!changes.length) return { ok: true, updatedAt: new Date().toISOString() };
  if (set.status === 'disponible' || (set.quotable === true && current.status !== 'vendido')) {
    const price = 'price' in set ? set.price : current.price;
    if (price == null) return { ok: false, error: 'Para liberarlo necesita precio.' };
  }

  const summary = changes.map(([k, v]) => `${LABEL[k]}: ${fmt(k, current[k])} → ${fmt(k, v)}`).join(' · ');
  const now = new Date().toISOString();
  const unset = changes.filter(([, v]) => v === null).map(([k]) => k);
  const toSet = Object.fromEntries(changes.filter(([, v]) => v !== null));

  await inventoryClient
    .transaction()
    .patch(unitId, (p) => {
      let q = p;
      if (Object.keys(toSet).length) q = q.set(toSet);
      if (unset.length) q = q.unset(unset);
      return q;
    })
    .create({ _type: 'inventoryLog', at: now, by, plazaSlug: current.plazaSlug, code: current.code, summary })
    .commit();

  // Fichas y plano de quattroplaza.mx. El cotizador y el PDF leen en vivo.
  revalidatePath('/[locale]/plazas/[slug]', 'page');
  revalidatePath('/inventario');
  // tresor.mx (fichas estáticas): solo si el secreto está configurado. Su
  // /api/revalidate exige el slug en el body (mismo formato que el webhook de
  // Sanity); los slugs de plaza coinciden con los de la ficha en tresor.mx.
  const secret = process.env.TRESOR_REVALIDATE_SECRET;
  if (secret) {
    // Con await: en Vercel la función puede terminar antes de que salga un
    // fetch sin esperar. Si tresor.mx no responde en 3 s, el guardado sigue OK.
    await fetch('https://www.tresor.mx/api/revalidate', {
      method: 'POST',
      headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'unit', slug: current.plazaSlug }),
      signal: AbortSignal.timeout(3000),
    }).catch(() => {});
  }
  return { ok: true, updatedAt: now };
}
