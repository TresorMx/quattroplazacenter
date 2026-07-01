/* ────────────────────────────────────────────────────────────
   Cotizador Quattro Plaza Center — data + motor de cálculo
   Fuente: listas de precios oficiales (Gardens 25/06/2026,
   Long Island 08/05/2026). Precios + IVA.
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

const u = (
  id: string, nivel: 1 | 2, m2: number, precio: number | null,
  entrega: string, status: Status,
): Unidad => ({ id, nivel, label: `NIVEL ${nivel} - ${id}`, m2, precio, entrega, status });

/* ─────────── GARDENS ─────────── */
const GARDENS: Proyecto = {
  slug: 'gardens',
  nombre: 'Quattro Plaza Center Gardens',
  ubicacion: 'Av. Josefa Ortiz de Domínguez y Av. 127',
  apartadoDefault: 50000,
  bank: {
    beneficiario: 'VALKIRA S DE RL DE CV',
    banco: 'INBURSA',
    cuenta: '50075915337',
    clabe: '036691500759153372',
  },
  esquemas: {
    1: [
      { enganche: 20, diferido: 10, entrega: 70, descuento: 1 },
      { enganche: 20, diferido: 20, entrega: 60, descuento: 5 },
      { enganche: 30, diferido: 20, entrega: 50, descuento: 7.5 },
    ],
    2: [
      { enganche: 10, diferido: 10, entrega: 80, descuento: 0 },
      { enganche: 20, diferido: 10, entrega: 70, descuento: 1 },
      { enganche: 20, diferido: 20, entrega: 60, descuento: 5 },
      { enganche: 30, diferido: 20, entrega: 50, descuento: 7.5 },
    ],
  },
  unidades: [
    // Nivel 1
    u('101', 1, 119.03, 8685927.97, 'JUN 2027', 'bloqueado'),
    u('102', 1, 32.58, 2650000, 'JUN 2027', 'bloqueado'),
    u('103', 1, 32.60, null, 'JUN 2027', 'vendido'),
    u('104', 1, 32.60, null, 'JUN 2027', 'apartado'),
    u('105', 1, 32.55, null, 'JUN 2027', 'vendido'),
    u('106', 1, 40.74, null, 'JUN 2027', 'vendido'),
    u('107', 1, 40.75, null, 'JUN 2027', 'vendido'),
    u('108', 1, 41.36, null, 'JUN 2027', 'vendido'),
    u('109', 1, 41.36, 3350000, 'SEP 2027', 'disponible'),
    u('110', 1, 40.75, 3250000, 'SEP 2027', 'disponible'),
    u('111', 1, 40.96, 3250000, 'SEP 2027', 'disponible'),
    u('112', 1, 32.81, null, 'SEP 2027', 'apartado'),
    u('113', 1, 32.60, null, 'SEP 2027', 'vendido'),
    u('114', 1, 32.60, 2650000, 'SEP 2027', 'disponible'),
    u('115', 1, 32.58, 2650000, 'SEP 2027', 'bloqueado'),
    u('116', 1, 119.20, 8950000, 'SEP 2027', 'bloqueado'),
    // Nivel 2
    u('201', 2, 119.20, 6765405.41, 'JUN 2027', 'disponible'),
    u('202', 2, 32.58, null, 'JUN 2027', 'apartado'),
    u('203', 2, 32.60, null, 'JUN 2027', 'vendido'),
    u('204', 2, 32.60, 1968600, 'JUN 2027', 'disponible'),
    u('205', 2, 32.81, null, 'JUN 2027', 'disponible'),
    u('206', 2, 40.96, 2375000, 'JUN 2027', 'disponible'),
    u('207', 2, 40.75, 2375000, 'JUN 2027', 'disponible'),
    u('208', 2, 41.36, 2475000, 'JUN 2027', 'disponible'),
    u('209', 2, 41.36, 2475000, 'SEP 2027', 'disponible'),
    u('210', 2, 40.75, 2375000, 'SEP 2027', 'disponible'),
    u('211', 2, 40.96, 2375000, 'SEP 2027', 'disponible'),
    u('212', 2, 32.81, 1968600, 'SEP 2027', 'disponible'),
    u('213', 2, 32.60, 1968600, 'SEP 2027', 'disponible'),
    u('214', 2, 32.60, 1968600, 'SEP 2027', 'disponible'),
    u('215', 2, 32.58, 1968600, 'SEP 2027', 'disponible'),
    u('216', 2, 119.20, 6950000, 'SEP 2027', 'disponible'),
  ],
};

/* ─────────── LONG ISLAND ─────────── */
const LONG_ISLAND: Proyecto = {
  slug: 'long-island',
  nombre: 'Quattro Plaza Center Long Island',
  ubicacion: 'Long Island - Río - Aqua',
  apartadoDefault: 50000,
  bank: {
    beneficiario: 'VALKIRA S DE RL DE CV',
    banco: 'INBURSA',
    cuenta: '50073869590',
    clabe: '036691500738695903',
  },
  esquemas: {
    1: [
      { enganche: 30, diferido: 0, entrega: 70, descuento: 2.5 },
      { enganche: 20, diferido: 20, entrega: 60, descuento: 5 },
      { enganche: 30, diferido: 20, entrega: 50, descuento: 7.5 },
    ],
    2: [
      { enganche: 10, diferido: 10, entrega: 80, descuento: 0 },
      { enganche: 20, diferido: 10, entrega: 70, descuento: 1 },
      { enganche: 20, diferido: 20, entrega: 60, descuento: 5 },
      { enganche: 30, diferido: 20, entrega: 50, descuento: 7.5 },
    ],
  },
  unidades: [
    // Nivel 1
    u('101', 1, 195.03, 19163625, 'DIC 2026', 'bloqueado'),
    u('105', 1, 50.75, null, 'DIC 2026', 'vendido'),
    u('106', 1, 40.60, null, 'DIC 2026', 'vendido'),
    u('107', 1, 40.60, null, 'DIC 2026', 'vendido'),
    u('108', 1, 40.60, null, 'DIC 2026', 'vendido'),
    u('109', 1, 40.60, null, 'DIC 2026', 'vendido'),
    u('110', 1, 40.60, null, 'DIC 2026', 'vendido'),
    u('111', 1, 40.60, null, 'DIC 2026', 'vendido'),
    u('112', 1, 40.60, null, 'DIC 2026', 'vendido'),
    u('113', 1, 40.60, null, 'DIC 2026', 'vendido'),
    u('114', 1, 40.60, null, 'DIC 2026', 'vendido'),
    u('115', 1, 40.60, null, 'DIC 2026', 'vendido'),
    u('116', 1, 151.64, 14962500, 'MAR 2027', 'bloqueado'),
    // Nivel 2
    u('201', 2, 104.30, 6483513.51, 'DIC 2026', 'bloqueado'),
    u('202', 2, 50, null, 'DIC 2026', 'vendido'),
    u('203', 2, 45.45, 2850000, 'DIC 2026', 'disponible'),
    u('205', 2, 50.75, 3350000, 'DIC 2026', 'disponible'),
    u('206', 2, 40.60, null, 'DIC 2026', 'vendido'),
    u('207', 2, 40.60, null, 'DIC 2026', 'vendido'),
    u('208', 2, 40.60, null, 'DIC 2026', 'vendido'),
    u('209', 2, 40.60, 2650000, 'DIC 2026', 'disponible'),
    u('210', 2, 40.60, 2750000, 'DIC 2026', 'disponible'),
    u('211', 2, 40.60, null, 'DIC 2026', 'vendido'),
    u('212', 2, 40.60, 2650000, 'MAR 2027', 'disponible'),
    u('213', 2, 40.60, 2650000, 'MAR 2027', 'disponible'),
    u('214', 2, 40.60, 2650000, 'MAR 2027', 'disponible'),
    u('215', 2, 40.60, 2650000, 'MAR 2027', 'bloqueado'),
    u('216', 2, 50.75, 3350000, 'MAR 2027', 'bloqueado'),
    u('217', 2, 102.26, 6900000, 'MAR 2027', 'bloqueado'),
  ],
};

export const PROYECTOS: Proyecto[] = [GARDENS, LONG_ISLAND];

export const getProyecto = (slug: string) =>
  PROYECTOS.find((p) => p.slug === slug);

export const esquemaLabel = (e: Esquema) =>
  `${e.descuento}% desc · ${e.enganche}/${e.diferido}/${e.entrega}`;

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

export interface Cotizacion {
  precioLista: number;
  descuentoEsquema: number;
  descAdicional: number;      // monto en MXN aplicado
  precioConDescuento: number;
  enganche: number;
  diferido: number;
  entrega: number;
  filas: FilaPago[];
  total: number;
  iva: number;
  granTotal: number;
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
  const base = new Date(y, m - 1, d);
  base.setMonth(base.getMonth() + months);
  const dd = String(base.getDate()).padStart(2, '0');
  const mm = String(base.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${base.getFullYear()}`;
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

  filas.push({ n: n++, fecha: fmtFecha(fechas.entrega), concepto: 'Entrega física', importe: entrega });

  const total = round2(filas.reduce((s, f) => s + f.importe, 0));
  const iva = round2(precioConDescuento * IVA_RATE);
  const granTotal = round2(precioConDescuento + iva);

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
  };
}

export const fmtMXN = (n: number) =>
  n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 });
