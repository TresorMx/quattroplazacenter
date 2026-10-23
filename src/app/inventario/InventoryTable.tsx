'use client';

import { useMemo, useState, useTransition } from 'react';
import type { InventoryUnit } from '@/lib/inventory';
import type { Status } from '@/lib/cotizador-data';
import { saveUnit, type UnitPatch } from './actions';

type Plaza = { slug: string; name: string; updated: string; units: InventoryUnit[] };

const STATUS: { v: Status; label: string; cls: string }[] = [
  { v: 'disponible', label: 'Disponible', cls: 'bg-[#DDF2D4] text-black' },
  { v: 'apartado', label: 'Apartado', cls: 'bg-[#FAF06E] text-black' },
  { v: 'vendido', label: 'Vendido', cls: 'bg-[#EAA59E] text-black' },
  { v: 'bloqueado', label: 'Bloqueado', cls: 'bg-[#D9D9D9] text-black' },
];
const statusCls = (s: Status) => STATUS.find((x) => x.v === s)?.cls ?? '';

const cell = 'rounded-md border border-white/10 bg-white/[0.04] px-2 py-1.5 text-[13px] text-white outline-none focus:border-[#FAB413]/60';

function Row({ u }: { u: InventoryUnit }) {
  const [saved, setSaved] = useState(u);
  const [draft, setDraft] = useState(u);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [pending, start] = useTransition();

  const dirty = (['status', 'quotable', 'price', 'm2', 'delivery'] as const).some((k) => (draft[k] ?? null) !== (saved[k] ?? null));

  const save = () =>
    start(async () => {
      setError(null);
      const patch: UnitPatch = {};
      (['status', 'quotable', 'price', 'm2', 'delivery'] as const).forEach((k) => {
        if ((draft[k] ?? null) !== (saved[k] ?? null)) (patch as any)[k] = draft[k] ?? null;
      });
      const r = await saveUnit(u._id, patch);
      if (r.ok) {
        setSaved(draft);
        setOk(true);
        setTimeout(() => setOk(false), 2000);
      } else setError(r.error);
    });

  const numIn = (k: 'price' | 'm2') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    setDraft({ ...draft, [k]: raw === '' ? null : Number(raw) });
  };

  return (
    <tr className={`border-b border-white/5 ${dirty ? 'bg-[#FAB413]/[0.06]' : ''}`}>
      <td className="py-2 pl-3 pr-2 font-semibold">{u.code}</td>
      <td className="px-2"><input inputMode="decimal" className={`${cell} w-20 text-right`} value={draft.m2 ?? ''} onChange={numIn('m2')} /></td>
      <td className="px-2"><input inputMode="numeric" className={`${cell} w-36 text-right`} value={draft.price != null ? draft.price.toLocaleString('en-US') : ''} onChange={numIn('price')} placeholder="—" /></td>
      <td className="px-2"><input className={`${cell} w-28 uppercase`} value={draft.delivery ?? ''} onChange={(e) => setDraft({ ...draft, delivery: e.target.value || null })} placeholder="DIC 2026" /></td>
      <td className="px-2">
        <select className={`rounded-md px-2 py-1.5 text-[13px] font-medium outline-none ${statusCls(draft.status)}`} value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as Status })}>
          {STATUS.map((s) => <option key={s.v} value={s.v}>{s.label}</option>)}
        </select>
      </td>
      <td className="px-2 text-center">
        <input
          type="checkbox"
          className="h-4 w-4 accent-[#FAB413]"
          checked={draft.quotable}
          disabled={draft.status === 'disponible' || draft.status === 'vendido'}
          title={draft.status === 'disponible' ? 'Las disponibles ya se cotizan' : draft.status === 'vendido' ? 'Las vendidas no se cotizan' : 'Permitir cotizarla aunque el público la vea así'}
          onChange={(e) => setDraft({ ...draft, quotable: e.target.checked })}
        />
      </td>
      <td className="w-48 py-2 pl-2 pr-3 text-right text-[12px]">
        {error && <span className="mr-2 text-red-400">{error}</span>}
        {ok && <span className="mr-2 text-green-400">Guardado ✓</span>}
        {dirty && (
          <>
            <button onClick={() => setDraft(saved)} disabled={pending} className="mr-2 text-white/50 hover:text-white">Deshacer</button>
            <button onClick={save} disabled={pending} className="rounded-full bg-[#FAB413] px-3 py-1 font-semibold text-black disabled:opacity-50">
              {pending ? 'Guardando…' : 'Guardar'}
            </button>
          </>
        )}
      </td>
    </tr>
  );
}

export default function InventoryTable({ plazas }: { plazas: Plaza[] }) {
  const [slug, setSlug] = useState(plazas[0]?.slug);
  const [filter, setFilter] = useState<'todos' | Status>('todos');
  const plaza = plazas.find((p) => p.slug === slug)!;
  const counts = useMemo(() => Object.fromEntries(STATUS.map((s) => [s.v, plaza.units.filter((u) => u.status === s.v).length])), [plaza]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {plazas.map((p) => (
          <button key={p.slug} onClick={() => setSlug(p.slug)} className={`rounded-full px-4 py-2 text-[13px] font-semibold ${p.slug === slug ? 'bg-white text-black' : 'border border-white/15 text-white/70 hover:border-white/40'}`}>
            {p.name}
          </button>
        ))}
        <div className="ml-auto flex flex-wrap gap-2 text-[12.5px]">
          <a href={`/lista-precios/${plaza.slug}.pdf`} target="_blank" className="rounded-full border border-[#FAB413]/50 px-3 py-1.5 text-[#FAB413] hover:bg-[#FAB413]/10">Lista de precios PDF ↗</a>
          <a href="/cotizador" target="_blank" className="rounded-full border border-white/15 px-3 py-1.5 text-white/70 hover:border-white/40">Cotizador ↗</a>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2 text-[12px]">
        {(['todos', ...STATUS.map((s) => s.v)] as const).map((v) => (
          <button key={v} onClick={() => setFilter(v)} className={`rounded-full px-3 py-1 ${filter === v ? 'bg-white/15 text-white' : 'text-white/50 hover:text-white'}`}>
            {v === 'todos' ? `Todos (${plaza.units.length})` : `${STATUS.find((s) => s.v === v)!.label} (${counts[v]})`}
          </button>
        ))}
        <span className="ml-auto text-white/40">Última modificación: {plaza.updated}</span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[860px] border-collapse text-left">
          <thead className="bg-white/[0.04] text-[11px] uppercase tracking-wider text-white/50">
            <tr>
              <th className="py-2.5 pl-3 pr-2">Local</th>
              <th className="px-2">m²</th>
              <th className="px-2">Precio (MXN + IVA)</th>
              <th className="px-2">Entrega</th>
              <th className="px-2">Estatus</th>
              <th className="px-2 text-center" title="Permite cotizarla en el cotizador aunque el público la vea bloqueada o apartada">Cotizable</th>
              <th className="px-3" />
            </tr>
          </thead>
          {([1, 2] as const).map((lvl) => {
            const rows = plaza.units.filter((u) => u.level === lvl && (filter === 'todos' || u.status === filter));
            if (!rows.length) return null;
            return (
              <tbody key={`${plaza.slug}-${lvl}`}>
                <tr><td colSpan={7} className="bg-white/[0.02] px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#FAB413]">Nivel {lvl}</td></tr>
                {rows.map((u) => <Row key={u._id} u={u} />)}
              </tbody>
            );
          })}
        </table>
      </div>
      <p className="mt-3 text-[12px] text-white/40">
        Cotizable: el cotizador la habilita aunque el público la vea bloqueada o apartada. Las condiciones de pago, cuentas y nota del PDF se editan en el Studio (pestaña “Lista de precios y cotizador” de cada plaza).
      </p>
    </div>
  );
}
