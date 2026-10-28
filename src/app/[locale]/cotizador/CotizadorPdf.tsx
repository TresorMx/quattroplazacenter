'use client';

import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import { fmtMXN, type Cotizacion, type Bank } from '@/lib/cotizador-data';

const YELLOW = '#FAB413';
const INK = '#0E0E0E';

const s = StyleSheet.create({
  page: { paddingTop: 24, paddingBottom: 24, paddingHorizontal: 30, fontSize: 8, fontFamily: 'Helvetica', color: INK },
  header: { backgroundColor: INK, borderRadius: 6, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  logo: { width: 104, height: 74, objectFit: 'contain' },
  metaRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 2 },
  metaLabel: { color: '#bbb', fontSize: 7 },
  metaVal: { color: '#fff', fontSize: 7, fontFamily: 'Helvetica-Bold', marginLeft: 4 },
  metaValYellow: { color: YELLOW, fontSize: 7, fontFamily: 'Helvetica-Bold', marginLeft: 4 },
  title: { fontSize: 12, fontFamily: 'Helvetica-Bold', marginTop: 11, marginBottom: 7 },
  resumen: { backgroundColor: '#FBF7EC', borderLeftWidth: 3, borderLeftColor: YELLOW, padding: 9, marginBottom: 8 },
  rLine: { marginBottom: 2.5 },
  rBold: { fontFamily: 'Helvetica-Bold' },
  splitRow: { flexDirection: 'row', gap: 8, marginBottom: 9 },
  splitBox: { flex: 1, backgroundColor: INK, borderRadius: 4, padding: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  splitLabel: { color: '#fff', fontFamily: 'Helvetica-Bold', fontSize: 8 },
  splitVal: { color: YELLOW, fontFamily: 'Helvetica-Bold', fontSize: 8 },
  tHead: { flexDirection: 'row', backgroundColor: INK, paddingVertical: 5, paddingHorizontal: 8 },
  th: { color: '#fff', fontFamily: 'Helvetica-Bold', fontSize: 7.5 },
  tRow: { flexDirection: 'row', paddingVertical: 3.6, paddingHorizontal: 8, borderBottomWidth: 0.5, borderBottomColor: '#e5e5e5' },
  cNum: { width: '8%' },
  cFecha: { width: '20%' },
  cConcepto: { width: '47%' },
  cImporte: { width: '25%', textAlign: 'right' },
  totalRow: { flexDirection: 'row', backgroundColor: '#FBF7EC', paddingVertical: 5, paddingHorizontal: 8, marginTop: 2 },
  ivaRow: { flexDirection: 'row', backgroundColor: '#f4f4f4', paddingVertical: 5, paddingHorizontal: 8 },
  granRow: { flexDirection: 'row', backgroundColor: '#FBF7EC', paddingVertical: 5.5, paddingHorizontal: 8 },
  bank: { marginTop: 9, backgroundColor: '#f4f4f4', borderRadius: 6, padding: 10, flexDirection: 'row', justifyContent: 'space-between' },
  bankTitle: { fontFamily: 'Helvetica-Bold', fontSize: 8.5, marginBottom: 4 },
  bankLine: { fontSize: 7.5, marginBottom: 2 },
  obs: { marginTop: 8, borderWidth: 0.5, borderColor: '#e0e0e0', borderRadius: 4, padding: 8 },
  obsTitle: { fontFamily: 'Helvetica-Bold', fontSize: 8, marginBottom: 3 },
  obsText: { fontSize: 7.5, color: '#444', lineHeight: 1.4 },
  disclaimer: { marginTop: 8, fontSize: 6.5, color: '#888', lineHeight: 1.35 },
  finBox: { marginTop: 9, borderWidth: 0.5, borderColor: '#e0e0e0', borderRadius: 4 },
  finHead: { backgroundColor: INK, paddingVertical: 6, paddingHorizontal: 8 },
  finTitle: { color: '#fff', fontFamily: 'Helvetica-Bold', fontSize: 8.5 },
  finSub: { color: '#bbb', fontSize: 6.8, marginTop: 2 },
  fRow: { flexDirection: 'row', paddingVertical: 2.6, paddingHorizontal: 8, borderBottomWidth: 0.5, borderBottomColor: '#eee' },
  fNum: { width: '8%' },
  fFecha: { width: '18%' },
  fMoney: { width: '18.5%', textAlign: 'right' },
});

/* La descripción del plan va en una sola línea: si no cabe a 8 pt se reduce la
   letra. Ancho útil = A4 (595) − márgenes (60) − relleno y borde del recuadro (21) − sangría (58).
   0.52 em es el ancho medio de Helvetica para este tipo de texto (con holgura). */
const DESC_WIDTH = 595 - 60 - 21 - 58;
const fitFont = (txt: string, width: number) => Math.max(5.5, Math.min(8, width / (txt.length * 0.52)));

interface Props {
  proyecto: string;
  asesor: string;
  broker: string;
  cliente: string;
  unidadLabel: string;
  m2: number;
  esquemaTxt: string;
  /** nombre del plan (va arriba de la descripción en "Forma de pago") */
  planNombre?: string;
  fechaCotizacion: string;
  cot: Cotizacion;
  bank: Bank;
  observaciones: string;
  /** cotización multilocal: desglose de cada local (mismo nivel) */
  locales?: { label: string; m2: number; precio: number }[];
}

export default function CotizadorPdf(p: Props) {
  const { cot } = p;
  return (
    <Document>
      {/* Con financiamiento directo la tabla crece: se permite pasar a una segunda hoja. */}
      <Page size="A4" wrap={cot.financiamientoDesglosado} style={s.page}>
        {/* Header */}
        <View style={s.header}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image style={s.logo} src="/logos/quattro-white.png" />
          <View>
            <View style={s.metaRow}><Text style={s.metaLabel}>Proyecto:</Text><Text style={s.metaVal}>{p.proyecto}</Text></View>
            <View style={s.metaRow}><Text style={s.metaLabel}>Asesor:</Text><Text style={s.metaVal}>{p.asesor || '—'}</Text></View>
            {p.broker ? <View style={s.metaRow}><Text style={s.metaLabel}>Broker:</Text><Text style={s.metaVal}>{p.broker}</Text></View> : null}
            <View style={s.metaRow}><Text style={s.metaLabel}>Unidad:</Text><Text style={s.metaVal}>{p.unidadLabel}</Text></View>
            <View style={s.metaRow}><Text style={s.metaLabel}>Fecha:</Text><Text style={s.metaValYellow}>{p.fechaCotizacion}</Text></View>
          </View>
        </View>

        <Text style={s.title}>Cotización y calendario de pagos</Text>

        {/* Resumen */}
        <View style={s.resumen}>
          <Text style={s.rLine}>Cliente: <Text style={s.rBold}>{p.cliente || '—'}</Text></Text>
          <Text style={s.rLine}>{p.locales ? 'Locales' : 'Unidad'}: <Text style={s.rBold}>{p.unidadLabel} - {p.m2} m²</Text></Text>
          {p.locales?.map((l) => (
            <Text key={l.label} style={[s.rLine, { paddingLeft: 12, fontSize: 7.5 }]}>
              {l.label} · {l.m2} m² · <Text style={s.rBold}>{fmtMXN(l.precio)}</Text>
            </Text>
          ))}
          <Text style={s.rLine}>Precio de lista{p.locales ? ' total' : ''}: <Text style={s.rBold}>{fmtMXN(cot.precioLista)}</Text></Text>
          <Text style={s.rLine}>Forma de pago: <Text style={s.rBold}>{p.planNombre || p.esquemaTxt}</Text></Text>
          {p.planNombre ? <Text style={[s.rLine, { paddingLeft: 58, fontSize: fitFont(p.esquemaTxt, DESC_WIDTH) }]}>{p.esquemaTxt}</Text> : null}
          <Text style={s.rLine}>Precio con descuento: <Text style={s.rBold}>{fmtMXN(cot.precioConDescuento)}</Text></Text>
        </View>

        {/* Split */}
        <View style={s.splitRow}>
          {/* Con 4 recuadros se baja un punto la letra y el relleno para que nada se parta en dos líneas. */}
          {cot.bloques.map((b) => {
            const four = cot.bloques.length > 3;
            const fs = four ? 7.2 : 8;
            return (
              <View key={b.label} style={[s.splitBox, four ? { padding: 6 } : {}]}>
                <Text style={[s.splitLabel, { fontSize: fs }]}>{b.label} <Text style={{ fontFamily: 'Helvetica', color: '#ddd' }}>{b.pct}%</Text></Text>
                <Text style={[s.splitVal, { fontSize: fs }]}>{fmtMXN(b.monto)}</Text>
              </View>
            );
          })}
        </View>

        {/* Tabla */}
        <View style={s.tHead}>
          <Text style={[s.th, s.cNum]}>Pago #</Text>
          <Text style={[s.th, s.cFecha]}>Fecha</Text>
          <Text style={[s.th, s.cConcepto]}>Concepto</Text>
          <Text style={[s.th, s.cImporte]}>Importe</Text>
        </View>
        {cot.filas.map((f) => (
          <View style={s.tRow} key={f.n}>
            <Text style={s.cNum}>{f.n}</Text>
            <Text style={s.cFecha}>{f.fecha || '—'}</Text>
            <Text style={s.cConcepto}>{f.concepto}</Text>
            <Text style={s.cImporte}>{fmtMXN(f.importe)}</Text>
          </View>
        ))}

        {/* Totales */}
        <View style={s.totalRow}>
          <Text style={[{ fontFamily: 'Helvetica-Bold' }, s.cNum]}></Text>
          <Text style={[{ fontFamily: 'Helvetica-Bold' }, s.cFecha]}></Text>
          <Text style={[{ fontFamily: 'Helvetica-Bold' }, s.cConcepto]}>Total</Text>
          <Text style={[{ fontFamily: 'Helvetica-Bold' }, s.cImporte]}>{fmtMXN(cot.total)}</Text>
        </View>
        <View style={s.ivaRow}>
          <Text style={s.cNum}></Text>
          <Text style={s.cFecha}></Text>
          <Text style={s.cConcepto}>IVA Aplicable 12.8% *{cot.ivaIncluyeIntereses ? ' (sobre precio + intereses)' : ''}</Text>
          <Text style={s.cImporte}>{fmtMXN(cot.iva)}</Text>
        </View>
        <View style={s.granRow}>
          <Text style={[{ fontFamily: 'Helvetica-Bold' }, s.cNum]}></Text>
          <Text style={[{ fontFamily: 'Helvetica-Bold' }, s.cFecha]}></Text>
          <Text style={[{ fontFamily: 'Helvetica-Bold' }, s.cConcepto]}>Gran Total</Text>
          <Text style={[{ fontFamily: 'Helvetica-Bold', color: YELLOW }, s.cImporte]}>{fmtMXN(cot.granTotal)}</Text>
        </View>

        {/* Financiamiento directo: tabla de amortización */}
        {cot.financiamiento && cot.financiamientoDesglosado ? (
          <View style={s.finBox} wrap={false}>
            <View style={s.finHead}>
              <Text style={s.finTitle}>Financiamiento directo · {cot.financiamiento.meses} meses al {cot.financiamiento.tasaAnual}% anual</Text>
              <Text style={s.finSub}>
                Capital {fmtMXN(cot.financiamiento.capital)} · mensualidad {fmtMXN(cot.financiamiento.mensualidad)} · intereses {fmtMXN(cot.financiamiento.intereses)} · amortización sobre saldos insolutos
              </Text>
            </View>
            <View style={[s.fRow, { backgroundColor: '#FBF7EC' }]}>
              <Text style={[s.fNum, s.rBold]}>#</Text>
              <Text style={[s.fFecha, s.rBold]}>Fecha</Text>
              <Text style={[s.fMoney, s.rBold]}>Mensualidad</Text>
              <Text style={[s.fMoney, s.rBold]}>Capital</Text>
              <Text style={[s.fMoney, s.rBold]}>Interés</Text>
              <Text style={[s.fMoney, s.rBold]}>Saldo</Text>
            </View>
            {cot.financiamiento.tabla.map((f) => (
              <View style={s.fRow} key={f.n}>
                <Text style={s.fNum}>{f.n}</Text>
                <Text style={s.fFecha}>{f.fecha || '—'}</Text>
                <Text style={s.fMoney}>{fmtMXN(f.pago)}</Text>
                <Text style={s.fMoney}>{fmtMXN(f.capital)}</Text>
                <Text style={s.fMoney}>{fmtMXN(f.interes)}</Text>
                <Text style={s.fMoney}>{fmtMXN(f.saldo)}</Text>
              </View>
            ))}
            <View style={[s.fRow, { backgroundColor: '#FBF7EC', borderBottomWidth: 0 }]}>
              <Text style={[{ width: '26%' }, s.rBold]}>Total</Text>
              <Text style={[s.fMoney, s.rBold]}>{fmtMXN(cot.financiamiento.capital + cot.financiamiento.intereses)}</Text>
              <Text style={[s.fMoney, s.rBold]}>{fmtMXN(cot.financiamiento.capital)}</Text>
              <Text style={[s.fMoney, s.rBold]}>{fmtMXN(cot.financiamiento.intereses)}</Text>
              <Text style={s.fMoney}></Text>
            </View>
          </View>
        ) : null}

        {/* Banco */}
        <View style={s.bank}>
          <View>
            <Text style={s.bankTitle}>Datos bancarios para transferencia</Text>
            <Text style={s.bankLine}>Beneficiario: <Text style={s.rBold}>{p.bank.beneficiario}</Text></Text>
            <Text style={s.bankLine}>Banco: <Text style={s.rBold}>{p.bank.banco}</Text></Text>
            <Text style={s.bankLine}>Cuenta: <Text style={s.rBold}>{p.bank.cuenta}</Text></Text>
          </View>
          <View>
            <Text style={[s.bankLine, { marginTop: 14 }]}>CLABE: <Text style={s.rBold}>{p.bank.clabe}</Text></Text>
            <Text style={s.bankLine}>Referencia: <Text style={s.rBold}>{p.unidadLabel}</Text></Text>
          </View>
        </View>

        {p.observaciones?.trim() ? (
          <View style={s.obs}>
            <Text style={s.obsTitle}>Observaciones</Text>
            <Text style={s.obsText}>{p.observaciones.trim()}</Text>
          </View>
        ) : null}

        <Text style={s.disclaimer}>
          Cotizador a modo informativo sin valor contractual, sujeto a cambio. Todos los precios son + IVA.{'\n'}
          * Únicamente sobre la construcción del local comercial, no aplicable al valor del terreno proporcional.
        </Text>
      </Page>
    </Document>
  );
}
