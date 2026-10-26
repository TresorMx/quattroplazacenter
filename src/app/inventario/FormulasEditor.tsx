'use client';

import { useState, useTransition } from 'react';
import { saveFormulas, type FormulaInput, type FormulaRowInput } from './actions';
import NumInput from './NumInput';

// Editor de la hoja "Fórmulas de pago" de la lista de precios en PDF. Guarda
// todas las fórmulas de la plaza de una vez (con validación en el servidor y
// registro en la bitácora). No afecta al cotizador.

const FIELDS: { k: keyof FormulaRowInput; label: string }[] = [
  { k: 'enganche', label: 'Enganche' },
  { k: 'mensualidades', label: 'Mensualidades' },
  { k: 'entrega', label: 'Entrega' },
  { k: 'financiamiento', label: 'Financiamiento' },
  { k: 'descuento', label: 'Descuento' },
];

const cell = 'rounded-md border border-white/10 bg-white/[0.04] px-2 py-1.5 text-[13px] text-white outline-none focus:border-[#FAB413]/60';
const emptyRow = (): FormulaRowInput => ({ enganche: 0, mensualidades: 0, entrega: 0, financiamiento: 0, descuento: 0 });
const sumOf = (r: FormulaRowInput) => r.enganche + r.mensualidades + r.entrega + r.financiamiento;
// En el panel la columna se ve si sale en el PDF o si ya trae valores (aunque
// esté oculta en el PDF, el financiamiento cuenta en la suma y debe poder editarse).
const finVisible = (f: FormulaInput) => f.showFinancing || f.rows.some((r) => r.financiamiento > 0);

export default function FormulasEditor({ plazaSlug, initial, initialNote }: {
  plazaSlug: string;
  initial: FormulaInput[];
  initialNote: string;
}) {
  const [saved, setSaved] = useState({ formulas: initial, note: initialNote });
  const [formulas, setFormulas] = useState(initial);
  const [note, setNote] = useState(initialNote);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [pending, start] = useTransition();

  const dirty = JSON.stringify({ formulas, note }) !== JSON.stringify(saved);

  const update = (i: number, patch: Partial<FormulaInput>) =>
    setFormulas(formulas.map((f, j) => (j === i ? { ...f, ...patch } : f)));
  const updateRow = (i: number, r: number, k: keyof FormulaRowInput, v: number | null) => {
    update(i, { rows: formulas[i].rows.map((row, j) => (j === r ? { ...row, [k]: v ?? 0 } : row)) });
  };
  // Solo decide si la columna sale en el PDF; no toca los valores.
  const toggleFinancing = (i: number) => update(i, { showFinancing: !formulas[i].showFinancing });

  const move = (i: number, d: -1 | 1) => {
    const next = [...formulas];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    setFormulas(next);
  };

  const save = () =>
    start(async () => {
      setError(null);
      const r = await saveFormulas(plazaSlug, formulas, note);
      if (r.ok) {
        setSaved({ formulas, note });
        setOk(true);
        setTimeout(() => setOk(false), 2000);
      } else setError(r.error);
    });

  return (
    <section className="mt-12">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#FAB413]">Fórmulas de pago</h2>
          <p className="mt-1 text-[12.5px] text-white/50">
            Hoja aparte al final de la lista de precios en PDF. Las desactivadas no se muestran; sin ninguna activa, la hoja no aparece.
          </p>
        </div>
        <a href={`/lista-precios/${plazaSlug}.pdf`} target="_blank" className="rounded-full border border-[#FAB413]/50 px-3 py-1.5 text-[12.5px] text-[#FAB413] hover:bg-[#FAB413]/10">
          Ver PDF ↗
        </a>
      </div>

      <div className="space-y-4">
        {formulas.length === 0 && (
          <p className="rounded-2xl border border-white/10 px-4 py-6 text-center text-[13px] text-white/40">Esta plaza no tiene fórmulas.</p>
        )}
        {formulas.map((f, i) => (
          <div key={f.key} className={`rounded-2xl border border-white/10 p-4 ${f.active ? '' : 'opacity-60'}`}>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <input
                className={`${cell} min-w-[280px] flex-1 font-semibold`}
                value={f.title}
                onChange={(e) => update(i, { title: e.target.value })}
                placeholder="Fórmula Premium ( Entrega Marzo 2027 )"
              />
              <label className="flex items-center gap-2 text-[12.5px] text-white/70">
                <input type="checkbox" className="h-4 w-4 accent-[#FAB413]" checked={f.active} onChange={(e) => update(i, { active: e.target.checked })} />
                Activa
              </label>
              <button
                onClick={() => toggleFinancing(i)}
                className={`rounded-full border px-3 py-1 text-[12px] ${f.showFinancing ? 'border-[#FAB413]/60 text-[#FAB413]' : 'border-white/15 text-white/50 hover:text-white'}`}
                title="Muestra u oculta la columna Financiamiento en el PDF. Los valores se conservan y cuentan en la suma."
              >
                {f.showFinancing ? 'Financiamiento: visible en PDF' : finVisible(f) ? 'Financiamiento: oculto en PDF' : '+ Financiamiento'}
              </button>
              <div className="flex gap-1 text-[12px]">
                <button disabled={i === 0} onClick={() => move(i, -1)} className="rounded-md border border-white/10 px-2 py-1 text-white/60 hover:text-white disabled:opacity-30" title="Subir">↑</button>
                <button disabled={i === formulas.length - 1} onClick={() => move(i, 1)} className="rounded-md border border-white/10 px-2 py-1 text-white/60 hover:text-white disabled:opacity-30" title="Bajar">↓</button>
                <button
                  onClick={() => confirm(`¿Quitar "${f.title || 'esta fórmula'}"? Si solo quieres ocultarla, desmarca "Activa".`) && setFormulas(formulas.filter((_, j) => j !== i))}
                  className="rounded-md border border-white/10 px-2 py-1 text-white/60 hover:border-red-400/50 hover:text-red-300"
                >
                  Quitar
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead className="text-[11px] uppercase tracking-wider text-white/50">
                  <tr>
                    {FIELDS.filter((c) => c.k !== 'financiamiento' || finVisible(f)).map((c) => (
                      <th key={c.k} className="px-2 py-1.5">
                        {c.label} %{c.k === 'financiamiento' && !f.showFinancing ? <span className="ml-1 normal-case tracking-normal text-white/30">(oculto en PDF)</span> : null}
                      </th>
                    ))}
                    <th className="px-2 py-1.5">Suma</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {f.rows.map((r, ri) => {
                    const sum = sumOf(r);
                    return (
                      <tr key={ri} className="border-t border-white/5">
                        {FIELDS.filter((c) => c.k !== 'financiamiento' || finVisible(f)).map((c) => (
                          <td key={c.k} className="px-2 py-1.5">
                            <NumInput className={`${cell} w-24 text-right`} value={r[c.k]} onChange={(v) => updateRow(i, ri, c.k, v)} />
                          </td>
                        ))}
                        <td className={`px-2 text-[13px] font-semibold ${Math.abs(sum - 100) < 1e-9 ? 'text-green-400' : 'text-red-400'}`}>{sum}%</td>
                        <td className="px-2 text-right">
                          <button
                            disabled={f.rows.length === 1}
                            onClick={() => update(i, { rows: f.rows.filter((_, j) => j !== ri) })}
                            className="text-[12px] text-white/40 hover:text-red-300 disabled:opacity-30"
                          >
                            Quitar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <button onClick={() => update(i, { rows: [...f.rows, emptyRow()] })} className="mt-2 text-[12.5px] text-[#FAB413] hover:underline">
              + Agregar opción
            </button>
            {finVisible(f) && (
              <div className="mt-3 flex flex-wrap items-end gap-3 rounded-xl bg-white/[0.03] px-3 py-2.5">
                <span className="text-[11px] font-bold uppercase tracking-widest text-white/50">Financiamiento directo</span>
                <label className="text-[12px] text-white/60">
                  Meses
                  <NumInput decimals={false} className={`${cell} ml-2 w-16 text-right`} value={f.financingMonths} onChange={(v) => update(i, { financingMonths: v })} />
                </label>
                <label className="text-[12px] text-white/60">
                  Interés anual %
                  <NumInput className={`${cell} ml-2 w-20 text-right`} value={f.financingRate} onChange={(v) => update(i, { financingRate: v })} />
                </label>
                <span className="text-[11.5px] text-white/40">Lo usa el cotizador de asesores (amortización sobre saldos insolutos).</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => setFormulas([...formulas, { key: `n${Date.now()}`, title: '', active: true, showFinancing: false, financingMonths: null, financingRate: null, rows: [emptyRow()] }])}
        className="mt-4 rounded-full border border-white/15 px-4 py-2 text-[13px] text-white/80 hover:border-white/40"
      >
        + Agregar fórmula
      </button>

      <label className="mt-6 block">
        <span className="text-[11px] font-bold uppercase tracking-widest text-white/50">Nota al pie de la hoja</span>
        <textarea
          rows={2}
          className={`${cell} mt-2 w-full`}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="* Entrega de Posesión + Financiamiento Directo a 12 meses al 9.95% interés"
        />
        <span className="mt-1 block text-[12px] text-white/40">Si empieza con *, la columna Financiamiento lleva asterisco. La columna solo sale en el PDF en las fórmulas donde está visible; oculta, el financiamiento se conserva y cuenta en la suma.</span>
      </label>

      <div className="mt-4 flex items-center justify-end gap-3 text-[12.5px]">
        {error && <span className="text-red-400">{error}</span>}
        {ok && <span className="text-green-400">Guardado ✓</span>}
        {dirty && (
          <>
            <button onClick={() => { setFormulas(saved.formulas); setNote(saved.note); setError(null); }} disabled={pending} className="text-white/50 hover:text-white">
              Deshacer
            </button>
            <button onClick={save} disabled={pending} className="rounded-full bg-[#FAB413] px-4 py-1.5 font-semibold text-black disabled:opacity-50">
              {pending ? 'Guardando…' : 'Guardar fórmulas'}
            </button>
          </>
        )}
      </div>
    </section>
  );
}
