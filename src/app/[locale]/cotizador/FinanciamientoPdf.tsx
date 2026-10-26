'use client';

import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import { fmtMXN, IVA_INTERESES_RATE, type Financiamiento } from '@/lib/cotizador-data';

/* Tabla de amortización del financiamiento directo, en un PDF aparte de la
   cotización (sin datos bancarios). El interés de cada mes va con IVA 16%. */

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
  tHead: { flexDirection: 'row', backgroundColor: INK, paddingVertical: 5, paddingHorizontal: 8 },
  th: { color: '#fff', fontFamily: 'Helvetica-Bold', fontSize: 7.5 },
  tRow: { flexDirection: 'row', paddingVertical: 3.6, paddingHorizontal: 8, borderBottomWidth: 0.5, borderBottomColor: '#e5e5e5' },
  totalRow: { flexDirection: 'row', backgroundColor: '#FBF7EC', paddingVertical: 5, paddingHorizontal: 8, marginTop: 2 },
  cNum: { width: '7%' },
  cFecha: { width: '17%' },
  cMoney: { width: '19%', textAlign: 'right' },
  disclaimer: { marginTop: 8, fontSize: 6.5, color: '#888', lineHeight: 1.35 },
});

interface Props {
  proyecto: string;
  asesor: string;
  broker: string;
  cliente: string;
  unidadLabel: string;
  m2: number;
  fechaCotizacion: string;
  fin: Financiamiento;
}

export default function FinanciamientoPdf(p: Props) {
  const { fin } = p;
  const ivaPct = Math.round(IVA_INTERESES_RATE * 100);
  const totalPagos = fin.capital + fin.interesesConIva;
  return (
    <Document>
      <Page size="A4" style={s.page}>
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

        <Text style={s.title}>Tabla de financiamiento directo</Text>

        <View style={s.resumen}>
          <Text style={s.rLine}>Cliente: <Text style={s.rBold}>{p.cliente || '—'}</Text></Text>
          <Text style={s.rLine}>Unidad: <Text style={s.rBold}>{p.unidadLabel} - {p.m2} m²</Text></Text>
          <Text style={s.rLine}>Monto a financiar sin IVA: <Text style={s.rBold}>{fmtMXN(fin.capital)}</Text></Text>
          <Text style={s.rLine}>Plazo y tasa: <Text style={s.rBold}>{fin.meses} meses al {fin.tasaAnual}% anual</Text></Text>
        </View>

        <View style={s.tHead}>
          <Text style={[s.th, s.cNum]}>#</Text>
          <Text style={[s.th, s.cFecha]}>Fecha</Text>
          <Text style={[s.th, s.cMoney]}>Mensualidad</Text>
          <Text style={[s.th, s.cMoney]}>Capital</Text>
          <Text style={[s.th, s.cMoney]}>Interés (IVA incluido)</Text>
          <Text style={[s.th, s.cMoney]}>Saldo</Text>
        </View>
        {fin.tabla.map((f) => (
          <View style={s.tRow} key={f.n}>
            <Text style={s.cNum}>{f.n}</Text>
            <Text style={s.cFecha}>{f.fecha || '—'}</Text>
            <Text style={s.cMoney}>{fmtMXN(f.pagoConIva)}</Text>
            <Text style={s.cMoney}>{fmtMXN(f.capital)}</Text>
            <Text style={s.cMoney}>{fmtMXN(f.interesConIva)}</Text>
            <Text style={s.cMoney}>{fmtMXN(f.saldo)}</Text>
          </View>
        ))}
        <View style={s.totalRow}>
          <Text style={[{ width: '24%' }, s.rBold]}>Total</Text>
          <Text style={[s.cMoney, s.rBold]}>{fmtMXN(totalPagos)}</Text>
          <Text style={[s.cMoney, s.rBold]}>{fmtMXN(fin.capital)}</Text>
          <Text style={[s.cMoney, s.rBold]}>{fmtMXN(fin.interesesConIva)}</Text>
          <Text style={s.cMoney}></Text>
        </View>

        <Text style={s.disclaimer}>
          Amortización sobre saldos insolutos: el interés de cada mes es la tasa anual / 12 sobre el saldo, más IVA del {ivaPct}%. Los pagos inician un mes después de la entrega de posesión.{'\n'}
          Tabla a modo informativo sin valor contractual, sujeta a cambio.
        </Text>
      </Page>
    </Document>
  );
}
