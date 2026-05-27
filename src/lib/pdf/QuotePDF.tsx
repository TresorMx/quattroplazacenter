/**
 * PDF de cotización con @react-pdf/renderer.
 * Branding Quattro: serif Cormorant + sans Inter (Helvetica como fallback).
 */
/* eslint-disable jsx-a11y/alt-text */
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import type { QuoteCalc } from '@/lib/quote';
import { resolveSpecs } from '@/lib/specs';

// Web-safe fonts; en producción se pueden cargar las verdaderas vía Font.register
const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#0E0E0E',
    backgroundColor: '#F6F4EF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 22,
    borderBottom: 1,
    borderColor: '#DDD7CB',
  },
  logo: { width: 100, height: 'auto' },
  meta: { fontSize: 9, textAlign: 'right', color: '#6B6863' },
  metaBold: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#0E0E0E', marginBottom: 4 },

  hero: { marginTop: 36 },
  eyebrow: {
    fontSize: 8,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: '#C88C00',
    marginBottom: 12,
    fontFamily: 'Helvetica-Bold',
  },
  title: { fontSize: 28, fontFamily: 'Times-Italic', letterSpacing: -0.5, lineHeight: 1.1 },
  subtitle: { fontSize: 12, color: '#6B6863', marginTop: 6 },

  section: { marginTop: 24, padding: 16, backgroundColor: '#FFFFFF', borderRadius: 4 },
  sectionTitle: {
    fontSize: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#6B6863',
    marginBottom: 10,
    fontFamily: 'Helvetica-Bold',
  },

  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  rowKey: { color: '#6B6863', fontSize: 10 },
  rowVal: { fontSize: 10, fontFamily: 'Helvetica-Bold' },

  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottom: 1,
    borderColor: '#EEEAE1',
  },
  scheduleLabel: { fontSize: 11, fontFamily: 'Helvetica-Bold' },
  scheduleNote: { fontSize: 8.5, color: '#9A968D', marginTop: 2 },
  scheduleAmount: { fontSize: 11, fontFamily: 'Helvetica-Bold', textAlign: 'right' },

  totals: { marginTop: 16, padding: 16, backgroundColor: '#0E0E0E', borderRadius: 4 },
  totalsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  totalsLabel: { fontSize: 9, color: 'rgba(255,255,255,0.6)' },
  totalsVal: { fontSize: 10, color: '#FFFFFF', fontFamily: 'Helvetica-Bold' },
  totalsGrand: { fontSize: 18, color: '#FAB413', fontFamily: 'Times-Italic', marginTop: 8 },

  footer: {
    position: 'absolute',
    bottom: 24,
    left: 48,
    right: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#9A968D',
    paddingTop: 12,
    borderTop: 1,
    borderColor: '#DDD7CB',
  },
  note: {
    fontSize: 8,
    color: '#9A968D',
    marginTop: 12,
    lineHeight: 1.4,
  },
});

function mxn(n: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n);
}

export interface QuotePDFProps {
  quote: QuoteCalc;
  quoteId: string;
  contact: {
    fullName: string;
    email: string;
    phone: string;
    company?: string;
  };
  siteUrl?: string;
}

export function QuotePDF({ quote, quoteId, contact, siteUrl = 'https://quattroplaza.mx' }: QuotePDFProps) {
  const today = new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
  const valid = new Date(quote.validUntil).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <Document title={`Cotización ${quoteId}`} author="Quattro Plaza Center">
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', letterSpacing: 2 }}>QUATTRO PLAZA CENTER</Text>
          <View>
            <Text style={styles.metaBold}>{quoteId}</Text>
            <Text style={styles.meta}>Emitida {today} · Válida hasta {valid}</Text>
          </View>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>— Cotización</Text>
          <Text style={styles.title}>
            Local {quote.unit.code} · {quote.plaza.shortName}
          </Text>
          <Text style={styles.subtitle}>
            {[
              ...resolveSpecs(quote.plaza, quote.unit).map((s) => s.display),
              `Nivel ${quote.unit.level}`,
              `Entrega ${quote.unit.delivery ?? quote.plaza.deliveryWindow ?? '—'}`,
            ].join(' · ')}
          </Text>
        </View>

        {/* Cliente */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cliente</Text>
          <View style={styles.row}>
            <Text style={styles.rowKey}>Nombre</Text>
            <Text style={styles.rowVal}>{contact.fullName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowKey}>Email</Text>
            <Text style={styles.rowVal}>{contact.email}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowKey}>Teléfono</Text>
            <Text style={styles.rowVal}>{contact.phone}</Text>
          </View>
          {contact.company && (
            <View style={styles.row}>
              <Text style={styles.rowKey}>Empresa</Text>
              <Text style={styles.rowVal}>{contact.company}</Text>
            </View>
          )}
        </View>

        {/* Plan de pago */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plan de Pago — Esquema {quote.plan.code}</Text>
          <Text style={{ fontSize: 10, marginBottom: 12 }}>{quote.plan.label}</Text>

          {quote.schedule.map((s, i) => (
            <View key={i} style={styles.scheduleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.scheduleLabel}>{s.label}</Text>
                {s.note && <Text style={styles.scheduleNote}>{s.note}</Text>}
              </View>
              <Text style={styles.scheduleAmount}>{mxn(s.amount)}</Text>
            </View>
          ))}
        </View>

        {/* Totales */}
        <View style={styles.totals}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Precio de lista</Text>
            <Text style={styles.totalsVal}>{mxn(quote.basePrice)}</Text>
          </View>
          {quote.discount > 0 && (
            <View style={styles.totalsRow}>
              <Text style={[styles.totalsLabel, { color: '#FAB413' }]}>Descuento {quote.plan.discount}%</Text>
              <Text style={[styles.totalsVal, { color: '#FAB413' }]}>− {mxn(quote.discount)}</Text>
            </View>
          )}
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Subtotal</Text>
            <Text style={styles.totalsVal}>{mxn(quote.subtotal)}</Text>
          </View>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>IVA 16%</Text>
            <Text style={styles.totalsVal}>{mxn(quote.iva)}</Text>
          </View>
          <View style={[styles.totalsRow, { marginTop: 6, paddingTop: 6, borderTop: 1, borderColor: 'rgba(255,255,255,0.15)' }]}>
            <Text style={[styles.totalsLabel, { color: '#FFFFFF', fontFamily: 'Helvetica-Bold', fontSize: 10 }]}>Total con IVA</Text>
            <Text style={styles.totalsGrand}>{mxn(quote.total)}</Text>
          </View>
        </View>

        <Text style={styles.note}>
          * El apartado de $50,000 MXN es reembolsable. Cotización válida 7 días. Precios + IVA aplicable sobre el valor de la construcción del local comercial. No aplica al valor proporcional del terreno.
        </Text>

        <View style={styles.footer} fixed>
          <Text>Quattro Plaza Center · Tresor Real Estate</Text>
          <Text>{siteUrl}</Text>
        </View>
      </Page>
    </Document>
  );
}
