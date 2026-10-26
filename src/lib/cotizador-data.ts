/* ────────────────────────────────────────────────────────────
   Cotizador Quattro Plaza Center — tipos + motor de cálculo.
   Datos: Sanity (lib/inventory.ts), editables en /inventario. Precios + IVA.
   IVA aplicable 12.8% (16% sobre 80% de construcción; terreno exento).
   ──────────────────────────────────────────────────────────── */

export const IVA_RATE = 0.128;

export interface Bank {
  beneficiario: string;
  banco: string;
  cuenta: string;
  clabe: string;
}

export type Status = 'disponible' | 'apartado' | 'vendido' | 'bloqueado';

export interface Unidad {
  id: string;          // "110"
  nivel: 1 | 2;
  label: string;       // "NIVEL 1 - 110"
  m2: number;
  precio: number | null;
  entrega: string;     // "SEP 2027"
  status: Status;
}

export interface Esquema {
  enganche: number;   // %
  diferido: number;   // %
  entrega: number;    // %
  descuento: number;  // %
  /** Financiamiento directo después de la entrega (hoy solo Long Island, desde
   *  las "Fórmulas de pago" de Sanity). enganche + diferido + entrega + pct = 100. */
  financiamiento?: { pct: number; meses: number; tasaAnual: number; titulo: string };
}

export interface Proyecto {
  slug: 'gardens' | 'long-island';
  nombre: string;
  ubicacion: string;
  apartadoDefault: number;
  bank: Bank;
  unidades: Unidad[];
  /** esquemas disponibles según nivel */
  esquemas: { 1: Esquema[]; 2: Esquema[] };
}

// Los proyectos, unidades, esquemas y cuentas ya NO viven aquí: la fuente
// única es Sanity (ver src/lib/inventory.ts → getProyectos()). Este archivo
// solo conserva los tipos y el motor de cálculo del cotizador.

export const esquemaLabel = (e: Esquema) =>
  e.financiamiento
    ? `${e.descuento}% desc · ${e.enganche}/${e.diferido}/${e.entrega} + ${e.financiamiento.pct}% financiado (${e.financiamiento.meses} meses al ${e.financiamiento.tasaAnual}%)`
    : `${e.descuento}% desc · ${e.enganche}/${e.diferido}/${e.entrega}`;

/* ─────────── Motor de cálculo ─────────── */
export interface CotizarInput {
  precioLista: number;
  esquema: Esquema;
  descAdicional?: { tipo: 'pct' | 'mxn'; valor: number };
  montoApartado: number;
  numMensualidades: number;
  fechas: {
    apartado?: string;        // ISO yyyy-mm-dd
    enganche?: string;
    inicioDiferidos?: string;
    entrega?: string;
  };
}

export interface FilaPago {
  n: number;
  fecha: string;      // dd/mm/yyyy o ''
  concepto: string;
  importe: number;
}

export interface FilaFinanciamiento {
  n: number;
  fecha: string;
  pago: number;
  capital: number;
  interes: number;
  saldo: number;
}

export interface Financiamiento {
  capital: number;      // monto financiado (pct del precio con descuento)
  meses: number;
  tasaAnual: number;    // %
  mensualidad: number;
  intereses: number;    // total de intereses
  tabla: FilaFinanciamiento[];
}

export interface Cotizacion {
  precioLista: number;
  descuentoEsquema: number;
  descAdicional: number;      // monto en MXN aplicado
  precioConDescuento: number;
  enganche: number;
  diferido: number;
  entrega: number;
  filas: FilaPago[];
  /** suma de los pagos (precio con descuento + intereses del financiamiento) */
  total: number;
  iva: number;
  granTotal: number;
  financiamiento?: Financiamiento;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

function fmtFecha(iso?: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return '';
  return `${d}/${m}/${y}`;
}

/** suma meses a una fecha ISO y regresa dd/mm/yyyy */
function addMonths(iso: string | undefined, months: number): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return '';
  // Mismo día del mes destino; si no existe (30 de febrero), el último día de
  // ese mes. Antes se desbordaba al mes siguiente (30/01 + 1 → 01/03).
  const target = new Date(y, m - 1 + months, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  const dd = String(Math.min(d, lastDay)).padStart(2, '0');
  const mm = String(target.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${target.getFullYear()}`;
}

export function cotizar(input: CotizarInput): Cotizacion {
  const { precioLista, esquema, descAdicional, montoApartado, numMensualidades, fechas } = input;

  const p1 = precioLista * (1 - esquema.descuento / 100);
  let precioConDescuento = p1;
  let descAdicMonto = 0;
  if (descAdicional && descAdicional.valor > 0) {
    if (descAdicional.tipo === 'pct') {
      descAdicMonto = p1 * (descAdicional.valor / 100);
      precioConDescuento = p1 - descAdicMonto;
    } else {
      descAdicMonto = descAdicional.valor;
      precioConDescuento = p1 - descAdicMonto;
    }
  }
  precioConDescuento = round2(precioConDescuento);

  const enganche = round2(precioConDescuento * esquema.enganche / 100);
  const diferido = round2(precioConDescuento * esquema.diferido / 100);
  const entrega  = round2(precioConDescuento * esquema.entrega / 100);

  const filas: FilaPago[] = [];
  let n = 1;

  filas.push({ n: n++, fecha: fmtFecha(fechas.apartado), concepto: 'Apartado', importe: round2(montoApartado) });
  filas.push({ n: n++, fecha: fmtFecha(fechas.enganche), concepto: 'Enganche (menos apartado)', importe: round2(enganche - montoApartado) });

  if (esquema.diferido > 0 && numMensualidades > 0) {
    const per = round2(diferido / numMensualidades);
    let acc = 0;
    for (let i = 0; i < numMensualidades; i++) {
      const importe = i < numMensualidades - 1 ? per : round2(diferido - acc);
      acc += per;
      filas.push({
        n: n++,
        fecha: addMonths(fechas.inicioDiferidos, i),
        concepto: `Pago parcial ${i + 1} de ${numMensualidades}`,
        importe,
      });
    }
  }

  filas.push({ n: n++, fecha: fmtFecha(fechas.entrega), concepto: esquema.financiamiento ? 'Entrega de posesión' : 'Entrega física', importe: entrega });

  // Financiamiento directo: amortización sobre saldos insolutos (mensualidad
  // fija; el interés de cada mes es la tasa anual / 12 sobre el saldo). Los
  // pagos empiezan un mes después de la entrega de posesión.
  let financiamiento: Financiamiento | undefined;
  if (esquema.financiamiento && esquema.financiamiento.pct > 0 && esquema.financiamiento.meses > 0) {
    const { meses, tasaAnual } = esquema.financiamiento;
    // El capital cierra el precio: lo que no cubren enganche, diferido y entrega.
    const capital = round2(precioConDescuento - enganche - diferido - entrega);
    const r = tasaAnual / 100 / 12;
    const mensualidad = round2(r > 0 ? (capital * r) / (1 - Math.pow(1 + r, -meses)) : capital / meses);
    const tabla: FilaFinanciamiento[] = [];
    let saldo = capital;
    for (let i = 1; i <= meses; i++) {
      const interes = round2(saldo * r);
      const ultimo = i === meses;
      const abono = ultimo ? saldo : round2(mensualidad - interes);
      const pago = ultimo ? round2(abono + interes) : mensualidad;
      saldo = round2(saldo - abono);
      tabla.push({ n: i, fecha: addMonths(fechas.entrega, i), pago, capital: abono, interes, saldo });
      filas.push({ n: n++, fecha: addMonths(fechas.entrega, i), concepto: `Financiamiento directo ${i} de ${meses}`, importe: pago });
    }
    financiamiento = {
      capital,
      meses,
      tasaAnual,
      mensualidad,
      intereses: round2(tabla.reduce((s, f) => s + f.interes, 0)),
      tabla,
    };
  }

  const total = round2(filas.reduce((s, f) => s + f.importe, 0));
  const iva = round2(precioConDescuento * IVA_RATE);
  const granTotal = round2(precioConDescuento + (financiamiento?.intereses ?? 0) + iva);

  return {
    precioLista,
    descuentoEsquema: esquema.descuento,
    descAdicional: round2(descAdicMonto),
    precioConDescuento,
    enganche,
    diferido,
    entrega,
    filas,
    total,
    iva,
    granTotal,
    financiamiento,
  };
}

export const fmtMXN = (n: number) =>
  n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 });
