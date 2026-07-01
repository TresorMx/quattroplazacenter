'use client';

import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import { fmtMXN, type Cotizacion, type Bank } from '@/lib/cotizador-data';

const YELLOW = '#FAB413';
const INK = '#0E0E0E';

const s = StyleSheet.create({
  page: { paddingTop: 28, paddingBottom: 36, paddingHorizontal: 30, fontSize: 8.5, fontFamily: 'Helvetica', color: INK },
  header: { backgroundColor: INK, borderRadius: 6, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  logo: { width: 116, height: 82, objectFit: 'contain' },
  metaRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 2 },
  metaLabel: { color: '#bbb', fontSize: 7.5 },
  metaVal: { color: '#fff', fontSize: 7.5, fontFamily: 'Helvetica-Bold', marginLeft: 4 },
  metaValYellow: { color: YELLOW, fontSize: 7.5, fontFamily: 'Helvetica-Bold', marginLeft: 4 },
  title: { fontSize: 13, fontFamily: 'Helvetica-Bold', marginTop: 18, marginBottom: 12 },
  resumen: { backgroundColor: '#FBF7EC', borderLeftWidth: 3, borderLeftColor: YELLOW, padding: 12, marginBottom: 12 },
  rLine: { marginBottom: 3 },
  rBold: { fontFamily: 'Helvetica-Bold' },
  splitRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  splitBox: { flex: 1, backgroundColor: INK, borderRadius: 4, padding: 9, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  splitLabel: { color: '#fff', fontFamily: 'Helvetica-Bold', fontSize: 8 },
  splitVal: { color: YELLOW, fontFamily: 'Helvetica-Bold', fontSize: 8 },
  tHead: { flexDirection: 'row', backgroundColor: INK, paddingVertical: 6, paddingHorizontal: 8 },
  th: { color: '#fff', fontFamily: 'Helvetica-Bold', fontSize: 7.5 },
  tRow: { flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 8, borderBottomWidth: 0.5, borderBottomColor: '#e5e5e5' },
  cNum: { width: '8%' },
  cFecha: { width: '20%' },
  cConcepto: { width: '47%' },
  cImporte: { width: '25%', textAlign: 'right' },
  totalRow: { flexDirection: 'row', backgroundColor: '#FBF7EC', paddingVertical: 7, paddingHorizontal: 8, marginTop: 2 },
  ivaRow: { flexDirection: 'row', backgroundColor: '#f4f4f4', paddingVertical: 7, paddingHorizontal: 8 },
  granRow: { flexDirection: 'row', backgroundColor: '#FBF7EC', paddingVertical: 8, paddingHorizontal: 8 },
  bank: { marginTop: 18, backgroundColor: '#f4f4f4', borderRadius: 6, padding: 12, flexDirection: 'row', justifyContent: 'space-between' },
  bankTitle: { fontFamily: 'Helvetica-Bold', fontSize: 9, marginBottom: 5 },
  bankLine: { fontSize: 7.5, marginBottom: 2 },
  disclaimer: { marginTop: 14, fontSize: 6.5, color: '#888', lineHeight: 1.4 },
});

interface Props {
  proyecto: string;
  asesor: string;
  broker: string;
  cliente: string;
  unidadLabel: string;
  m2: number;
  esquemaTxt: string;
  fechaCotizacion: string;
  cot: Cotizacion;
  bank: Bank;
}

export default function CotizadorPdf(p: Props) {
  const { cot } = p;
  return (
    <Document>
      <Page size="A4" style={s.page}>
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
          <Text style={s.rLine}>Unidad: <Text style={s.rBold}>{p.unidadLabel} - {p.m2} m²</Text></Text>
          <Text style={s.rLine}>Precio de lista: <Text style={s.rBold}>{fmtMXN(cot.precioLista)}</Text></Text>
          <Text style={s.rLine}>Forma de pago: <Text style={s.rBold}>{p.esquemaTxt}</Text></Text>
          <Text style={s.rLine}>Precio con descuento: <Text style={s.rBold}>{fmtMXN(cot.precioConDescuento)}</Text></Text>
        </View>

        {/* Split */}
        <View style={s.splitRow}>
          <View style={s.splitBox}><Text style={s.splitLabel}>Enganche</Text><Text style={s.splitVal}>{fmtMXN(cot.enganche)}</Text></View>
          <View style={s.splitBox}><Text style={s.splitLabel}>Diferido</Text><Text style={s.splitVal}>{fmtMXN(cot.diferido)}</Text></View>
          <View style={s.splitBox}><Text style={s.splitLabel}>Entrega</Text><Text style={s.splitVal}>{fmtMXN(cot.entrega)}</Text></View>
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
          <Text style={s.cConcepto}>IVA Aplicable 12.8% *</Text>
          <Text style={s.cImporte}>{fmtMXN(cot.iva)}</Text>
        </View>
        <View style={s.granRow}>
          <Text style={[{ fontFamily: 'Helvetica-Bold' }, s.cNum]}></Text>
          <Text style={[{ fontFamily: 'Helvetica-Bold' }, s.cFecha]}></Text>
          <Text style={[{ fontFamily: 'Helvetica-Bold' }, s.cConcepto]}>Gran Total</Text>
          <Text style={[{ fontFamily: 'Helvetica-Bold', color: YELLOW }, s.cImporte]}>{fmtMXN(cot.granTotal)}</Text>
        </View>

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

        <Text style={s.disclaimer}>
          Cotizador a modo informativo sin valor contractual, sujeto a cambio. Todos los precios son + IVA.{'\n'}
          * Únicamente sobre la construcción del local comercial, no aplicable al valor del terreno proporcional.
        </Text>
      </Page>
    </Document>
  );
}
