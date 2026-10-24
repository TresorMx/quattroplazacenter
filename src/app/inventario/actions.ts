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
