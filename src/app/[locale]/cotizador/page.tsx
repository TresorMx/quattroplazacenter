'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import {
  User, Home, LayoutPanelLeft, DollarSign, Calendar,
  FileText, Hash, Wallet, CalendarClock, StickyNote,
} from 'lucide-react';
import {
  PROYECTOS, getProyecto, esquemaLabel, cotizar, fmtMXN,
  type Esquema, type Unidad,
} from '@/lib/cotizador-data';

const DownloadPdfButton = dynamic(() => import('./DownloadPdfButton'), {
  ssr: false,
  loading: () => <span className="text-[12px] text-ink-3">Cargando PDF…</span>,
});

const todayISO = () => new Date().toISOString().slice(0, 10);

/* ─── UI helpers ─── */
function Section({ n, icon: Icon, title, children }: { n: number; icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-white/10 py-5">
      <div className="mb-3 flex items-center gap-2 text-[#FAB413]">
        <Icon size={15} strokeWidth={2} />
        <span className="text-[11px] font-bold uppercase tracking-widest">{n} · {title}</span>
      </div>
      {children}
    </div>
  );
}

const inputCls = 'w-full rounded-[10px] border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-[13px] text-white outline-none transition-all placeholder:text-white/25 hover:border-white/20 focus:border-[#FAB413]/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-[#FAB413]/15';
const selectCls = inputCls + ' cursor-pointer appearance-none bg-[length:14px] bg-[right_0.85rem_center] bg-no-repeat pr-9 [&>option]:bg-ink [&>option]:text-white';
const chevronBg = { backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none' stroke='%23FAB413' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")` };
const labelCls = 'mb-1.5 block text-[11.5px] font-medium text-white/55';

export default function CotizadorPage() {
  const [asesor, setAsesor] = useState('');
  const [esBroker, setEsBroker] = useState(false);
  const [broker, setBroker] = useState('');
  const [cliente, setCliente] = useState('');
  const [proyectoSlug, setProyectoSlug] = useState('');
  const [unidadId, setUnidadId] = useState('');
  const [modoEsq, setModoEsq] = useState<'pre' | 'custom'>('pre');
  const [esqIdx, setEsqIdx] = useState('');
  const [custom, setCustom] = useState({ desc: 0, eng: 0, dif: 0, ent: 0 });
  const [usaAdic, setUsaAdic] = useState(false);
  const [adic, setAdic] = useState<{ tipo: 'pct' | 'mxn'; valor: number }>({ tipo: 'pct', valor: 0 });
  const [fechas, setFechas] = useState({ apartado: '', enganche: '', inicioDiferidos: '', entrega: '' });
  const [numMens, setNumMens] = useState(12);
  const [montoApartado, setMontoApartado] = useState(0);
  const [fechaCotizacion, setFechaCotizacion] = useState(todayISO());
  const [obs, setObs] = useState('');

  const proyecto = getProyecto(proyectoSlug);
  const unidades = proyecto?.unidades.filter((x) => x.status === 'disponible' && x.precio != null) ?? [];
  const unidad: Unidad | undefined = unidades.find((x) => x.id === unidadId);
  const esquemasDisp: Esquema[] = proyecto && unidad ? proyecto.esquemas[unidad.nivel] : [];

  const esquema: Esquema | null = useMemo(() => {
    if (modoEsq === 'custom') return { descuento: custom.desc, enganche: custom.eng, diferido: custom.dif, entrega: custom.ent };
    const i = Number(esqIdx);
    return esquemasDisp[i] ?? null;
  }, [modoEsq, custom, esqIdx, esquemasDisp]);

  const sumaCustom = custom.eng + custom.dif + custom.ent;
  const customValido = modoEsq === 'pre' || sumaCustom === 100;

  const cot = useMemo(() => {
    if (!unidad?.precio || !esquema) return null;
    return cotizar({
      precioLista: unidad.precio,
      esquema,
      descAdicional: usaAdic ? adic : undefined,
      montoApartado,
      numMensualidades: numMens,
      fechas,
    });
  }, [unidad, esquema, usaAdic, adic, montoApartado, numMens, fechas]);

  const esquemaTxt = esquema
    ? `${esquema.enganche}/${esquema.diferido}/${esquema.entrega}, ${esquema.descuento}% desc${usaAdic && adic.valor > 0 ? (adic.tipo === 'pct' ? ` + ${adic.valor}% desc adicional` : ` + ${fmtMXN(adic.valor)} desc adicional`) : ''}`
    : '—';

  const fechaCotTxt = fechaCotizacion.split('-').reverse().join('/');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr]">
      {/* ═══ Sidebar formulario ═══ */}
      <aside className="bg-ink px-6 py-6 lg:sticky lg:top-0 lg:h-screen lg:self-start lg:overflow-y-auto">
        <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
          <Image src="/logos/quattro-white.png" alt="Quattro Plaza Center" width={140} height={99} className="h-11 w-auto" priority />
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40">Cotizador</span>
        </div>

        <Section n={1} icon={User} title="Asesor">
          <label className={labelCls}>Nombre del asesor *</label>
          <input className={inputCls} placeholder="Tu nombre completo" value={asesor} onChange={(e) => setAsesor(e.target.value)} />
          <label className="mt-3 flex cursor-pointer items-center gap-2.5 text-[12px] text-white/60">
            <input type="checkbox" className="accent-[#FAB413]" checked={esBroker} onChange={(e) => setEsBroker(e.target.checked)} />
            El cliente es de Broker
          </label>
          {esBroker && (
            <div className="mt-3">
              <label className={labelCls}>Nombre del Broker</label>
              <input className={inputCls} placeholder="Nombre del broker" value={broker} onChange={(e) => setBroker(e.target.value)} />
            </div>
          )}
        </Section>

        <Section n={2} icon={Home} title="Cliente">
          <label className={labelCls}>Nombre completo *</label>
          <input className={inputCls} placeholder="Nombre del cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} />
        </Section>

        <Section n={3} icon={LayoutPanelLeft} title="Proyecto">
          <label className={labelCls}>Proyecto *</label>
          <select className={selectCls} style={chevronBg} value={proyectoSlug} onChange={(e) => { const p = getProyecto(e.target.value); setProyectoSlug(e.target.value); setUnidadId(''); setEsqIdx(''); if (p) setMontoApartado(p.apartadoDefault); }}>
            <option value="">Selecciona proyecto</option>
            {PROYECTOS.map((p) => <option key={p.slug} value={p.slug}>{p.nombre}</option>)}
          </select>
        </Section>

        <Section n={4} icon={DollarSign} title="Unidad">
          <label className={labelCls}>Unidad disponible *</label>
          <select className={selectCls} style={chevronBg} value={unidadId} onChange={(e) => { setUnidadId(e.target.value); setEsqIdx(''); }} disabled={!proyecto}>
            <option value="">{proyecto ? 'Selecciona unidad' : 'Elige proyecto primero'}</option>
            {unidades.map((x) => (
              <option key={x.id} value={x.id}>{x.label} · {x.m2} m²</option>
            ))}
          </select>
          {unidad?.precio && (
            <p className="mt-2 text-[12px] text-white/70">Área: {unidad.m2} m² · <span className="font-bold text-[#FAB413]">{fmtMXN(unidad.precio)}</span></p>
          )}
        </Section>

        <Section n={5} icon={Calendar} title="Esquema de pago">
          <div className="mb-3 grid grid-cols-2 gap-1 rounded-lg bg-white/5 p-1">
            <button onClick={() => setModoEsq('pre')} className={`rounded-md py-1.5 text-[12px] font-semibold ${modoEsq === 'pre' ? 'bg-[#FAB413] text-ink' : 'text-white/60'}`}>Predeterminado</button>
            <button onClick={() => setModoEsq('custom')} className={`rounded-md py-1.5 text-[12px] font-semibold ${modoEsq === 'custom' ? 'bg-[#FAB413] text-ink' : 'text-white/60'}`}>Personalizado</button>
          </div>
          {modoEsq === 'pre' ? (
            <>
              <label className={labelCls}>Esquema de descuento *</label>
              <select className={selectCls} style={chevronBg} value={esqIdx} onChange={(e) => setEsqIdx(e.target.value)} disabled={!unidad}>
                <option value="">{unidad ? 'Selecciona esquema' : 'Selecciona primero una unidad'}</option>
                {esquemasDisp.map((e, i) => <option key={i} value={i}>{esquemaLabel(e)}</option>)}
              </select>
            </>
          ) : (
            <div className="space-y-2">
              {[['desc', 'Descuento (%)'], ['eng', 'Enganche (%)'], ['dif', 'Diferido (%)'], ['ent', 'Entrega (%)']].map(([k, lbl]) => (
                <div key={k}>
                  <label className={labelCls}>{lbl}</label>
                  <input type="number" className={inputCls} value={(custom as any)[k] || ''} onChange={(e) => setCustom((c) => ({ ...c, [k]: Number(e.target.value) }))} />
                </div>
              ))}
              <p className={`text-[12px] font-semibold ${sumaCustom === 100 ? 'text-green-400' : 'text-[#FAB413]'}`}>
                Suma (Enganche+Diferido+Entrega): {sumaCustom}% — debe ser 100%
              </p>
            </div>
          )}
          <label className="mt-3 flex items-center gap-2 text-[12px] text-white/60">
            <input type="checkbox" checked={usaAdic} onChange={(e) => setUsaAdic(e.target.checked)} />
            Descuento Adicional
          </label>
          {usaAdic && (
            <div className="mt-2">
              <div className="mb-2 grid grid-cols-2 gap-1 rounded-lg bg-white/5 p-1">
                <button onClick={() => setAdic((a) => ({ ...a, tipo: 'pct' }))} className={`rounded-md py-1 text-[11px] font-semibold ${adic.tipo === 'pct' ? 'bg-[#FAB413] text-ink' : 'text-white/60'}`}>Porcentaje (%)</button>
                <button onClick={() => setAdic((a) => ({ ...a, tipo: 'mxn' }))} className={`rounded-md py-1 text-[11px] font-semibold ${adic.tipo === 'mxn' ? 'bg-[#FAB413] text-ink' : 'text-white/60'}`}>Monetario ($)</button>
              </div>
              <input type="number" className={inputCls} placeholder={adic.tipo === 'pct' ? 'Valor (%)' : 'Valor ($)'} value={adic.valor || ''} onChange={(e) => setAdic((a) => ({ ...a, valor: Number(e.target.value) }))} />
            </div>
          )}
        </Section>

        <Section n={6} icon={FileText} title="Fechas de pago">
          {[['apartado', 'Fecha de Pago de Apartado'], ['enganche', 'Fecha de Pago de Enganche'], ['inicioDiferidos', 'Fecha de Inicio de Pagos Diferidos'], ['entrega', 'Fecha de Pago de Entrega']].map(([k, lbl]) => (
            <div key={k} className="mb-2">
              <label className={labelCls}>{lbl}</label>
              <input type="date" className={inputCls} value={(fechas as any)[k]} onChange={(e) => setFechas((f) => ({ ...f, [k]: e.target.value }))} />
            </div>
          ))}
        </Section>

        <Section n={7} icon={Hash} title="Mensualidades">
          <label className={labelCls}>Número de mensualidades</label>
          <input type="number" className={inputCls} value={numMens} onChange={(e) => setNumMens(Number(e.target.value))} />
        </Section>

        <Section n={8} icon={Wallet} title="Apartado">
          <label className={labelCls}>Monto de apartado ($)</label>
          <input type="number" className={inputCls} value={montoApartado || ''} onChange={(e) => setMontoApartado(Number(e.target.value))} />
        </Section>

        <Section n={9} icon={CalendarClock} title="Fecha cotización">
          <label className={labelCls}>Fecha</label>
          <input type="date" className={inputCls} value={fechaCotizacion} onChange={(e) => setFechaCotizacion(e.target.value)} />
        </Section>

        <Section n={10} icon={StickyNote} title="Observaciones">
          <textarea className={`${inputCls} min-h-[70px]`} placeholder="Notas u observaciones adicionales…" value={obs} onChange={(e) => setObs(e.target.value)} />
        </Section>
      </aside>

      {/* ═══ Preview ═══ */}
      <main className="bg-bg-soft px-4 py-6 lg:px-10">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[12px] font-semibold uppercase tracking-[0.25em] text-ink-3">Vista previa</span>
            {cot && customValido && unidad && (
              <DownloadPdfButton
                proyecto={proyecto!.nombre}
                asesor={asesor}
                broker={esBroker ? broker : ''}
                cliente={cliente}
                unidadLabel={unidad.label}
                m2={unidad.m2}
                esquemaTxt={esquemaTxt}
                fechaCotizacion={fechaCotTxt}
                cot={cot}
                bank={proyecto!.bank}
                observaciones={obs}
                fileName={`Cotizacion ${unidad.label} - ${cliente || 'cliente'}.pdf`}
              />
            )}
          </div>

          <div className="overflow-hidden rounded-xl bg-white shadow-lg">
            {/* header doc */}
            <div className="flex items-start justify-between bg-ink p-6 text-white">
              <Image src="/logos/quattro-white.png" alt="Quattro Plaza Center" width={150} height={106} className="h-14 w-auto" />
              <div className="text-right text-[11px] leading-relaxed">
                <p><span className="text-white/50">Proyecto:</span> <b>{proyecto?.nombre ?? '—'}</b></p>
                <p><span className="text-white/50">Asesor:</span> <b>{asesor || '—'}</b></p>
                {esBroker && <p><span className="text-white/50">Broker:</span> <b>{broker || '—'}</b></p>}
                <p><span className="text-white/50">Unidad:</span> <b>{unidad?.label ?? '—'}</b></p>
                <p><span className="text-white/50">Fecha:</span> <b className="text-[#FAB413]">{fechaCotTxt}</b></p>
              </div>
            </div>

            <div className="p-6">
              <h2 className="mb-4 text-lg font-bold text-ink">Cotización y calendario de pagos</h2>

              {!cot ? (
                <div className="rounded-lg border-l-4 border-[#FAB413] bg-[#FBF7EC] p-5 text-[13px] text-ink-2">
                  <p>Cliente: <b>{cliente || '—'}</b></p>
                  <p>Unidad: <b>{unidad ? `${unidad.label} - ${unidad.m2} m²` : '—'}</b></p>
                  <p>Precio de lista: <b>{unidad?.precio ? fmtMXN(unidad.precio) : '—'}</b></p>
                  <p className="mt-2 text-[12px] text-ink-3">
                    {!customValido ? 'La suma del esquema personalizado debe ser 100%.' : 'Completa proyecto, unidad y esquema para ver el calendario.'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-4 rounded-lg border-l-4 border-[#FAB413] bg-[#FBF7EC] p-4 text-[13px] text-ink-2">
                    <p>Cliente: <b>{cliente || '—'}</b></p>
                    <p>Unidad: <b>{unidad!.label} - {unidad!.m2} m²</b></p>
                    <p>Precio de lista: <b>{fmtMXN(cot.precioLista)}</b></p>
                    <p>Forma de pago: <b>{esquemaTxt}</b></p>
                    <p>Precio con descuento: <b>{fmtMXN(cot.precioConDescuento)}</b></p>
                  </div>

                  <div className="mb-4 grid grid-cols-3 gap-2">
                    {[['Enganche', cot.enganche], ['Diferido', cot.diferido], ['Entrega', cot.entrega]].map(([l, v]) => (
                      <div key={l as string} className="flex items-center justify-between rounded-lg bg-ink px-3 py-2.5">
                        <span className="text-[11px] font-bold text-white">{l}</span>
                        <span className="text-[11px] font-bold text-[#FAB413]">{fmtMXN(v as number)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="overflow-hidden rounded-lg border border-line text-[12px]">
                    <div className="flex bg-ink px-3 py-2 font-bold text-white">
                      <span className="w-[8%]">#</span>
                      <span className="w-[22%]">Fecha</span>
                      <span className="w-[45%]">Concepto</span>
                      <span className="w-[25%] text-right">Importe</span>
                    </div>
                    {cot.filas.map((f) => (
                      <div key={f.n} className="flex border-b border-line px-3 py-1.5 text-ink-2">
                        <span className="w-[8%]">{f.n}</span>
                        <span className="w-[22%]">{f.fecha || '—'}</span>
                        <span className="w-[45%]">{f.concepto}</span>
                        <span className="w-[25%] text-right">{fmtMXN(f.importe)}</span>
                      </div>
                    ))}
                    <div className="flex bg-[#FBF7EC] px-3 py-2 font-bold text-ink">
                      <span className="w-[75%]">Total</span>
                      <span className="w-[25%] text-right">{fmtMXN(cot.total)}</span>
                    </div>
                    <div className="flex bg-gray-50 px-3 py-2 text-ink-2">
                      <span className="w-[75%]">IVA Aplicable 12.8% *</span>
                      <span className="w-[25%] text-right">{fmtMXN(cot.iva)}</span>
                    </div>
                    <div className="flex bg-[#FBF7EC] px-3 py-2 font-bold text-ink">
                      <span className="w-[75%]">Gran Total</span>
                      <span className="w-[25%] text-right text-[#FAB413]">{fmtMXN(cot.granTotal)}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between rounded-lg bg-gray-50 p-4 text-[12px] text-ink-2">
                    <div>
                      <p className="mb-1 font-bold text-ink">Datos bancarios para transferencia</p>
                      <p>Beneficiario: <b>{proyecto!.bank.beneficiario}</b></p>
                      <p>Banco: <b>{proyecto!.bank.banco}</b></p>
                      <p>Cuenta: <b>{proyecto!.bank.cuenta}</b></p>
                    </div>
                    <div className="text-right">
                      <p>CLABE: <b>{proyecto!.bank.clabe}</b></p>
                      <p>Referencia: <b>{unidad!.label}</b></p>
                    </div>
                  </div>

                  {obs && <p className="mt-3 text-[12px] text-ink-2"><b>Observaciones:</b> {obs}</p>}

                  <p className="mt-4 text-[10px] leading-relaxed text-ink-3">
                    Cotizador a modo informativo sin valor contractual, sujeto a cambio. Todos los precios son + IVA.<br />
                    * Únicamente sobre la construcción del local comercial, no aplicable al valor del terreno proporcional.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
