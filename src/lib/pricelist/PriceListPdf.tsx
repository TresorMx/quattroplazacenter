import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';
import type { InventoryPlaza, InventoryUnit } from '../inventory';
import type { Esquema } from '../cotizador-data';

/* ────────────────────────────────────────────────────────────
   Lista de precios en PDF — réplica del Keynote oficial
   ("Quattro Gardens | Lista de Precios", oct/2026): página 1400×1600 pt,
   una página por nivel, tabla con colores por estatus, condiciones de pago
   del nivel y nota de IVA. Se genera en vivo desde Sanity: lo que cambie en
   /inventario aparece aquí en la siguiente descarga.
   ──────────────────────────────────────────────────────────── */

export function registerFonts(origin: string) {
  Font.register({
    family: 'Montserrat',
    fonts: [
      { src: `${origin}/lista-precios-assets/fonts/Montserrat-Regular.ttf` },
      { src: `${origin}/lista-precios-assets/fonts/Montserrat-Medium.ttf`, fontWeight: 500 },
      { src: `${origin}/lista-precios-assets/fonts/Montserrat-Bold.ttf`, fontWeight: 700 },
    ],
  });
  Font.registerHyphenationCallback((w) => [w]);
}

const PAGE = { width: 1400, height: 1600 };
const TABLE = { left: 130, width: 1140, top: 308, header: 40, maxBody: 962 };
// Anchos de columna medidos sobre el Keynote (suman 1140).
const COLS = [162, 150, 290, 290, 248];

const C = {
  ink: '#111111',
  header: '#D9D9D9',
  code: '#F2D488',
  price: '#D9D9D9',
  status: {
    disponible: '#DDF2D4',
    vendido: '#EAA59E',
    apartado: '#FAF06E',
    bloqueado: '#D9D9D9',
  } as Record<string, string>,
  condHead: '#EEF0EF',
};

const LABEL: Record<string, string> = {
  disponible: 'Disponible',
  vendido: 'Vendido',
  apartado: 'Apartado',
  bloqueado: 'Bloqueado',
};

const s = StyleSheet.create({
  page: { backgroundColor: '#FFFFFF', color: C.ink, fontFamily: 'Helvetica', position: 'relative' },
  abs: { position: 'absolute' },
  cell: { justifyContent: 'center', alignItems: 'center', height: '100%' },
  td: { fontSize: 19 },
  th: { fontSize: 19, fontFamily: 'Montserrat', fontWeight: 700 },
});

const money = (n: number) =>
  '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function formatDate(iso: string) {
  const d = new Date(iso);
  const parts = new Intl.DateTimeFormat('es-MX', { timeZone: 'America/Cancun', day: '2-digit', month: '2-digit', year: 'numeric' }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return `${get('day')} / ${get('month')} / ${get('year')}`;
}

// El Keynote solo publica precio de locales disponibles o bloqueados.
const showsPrice = (u: InventoryUnit) => u.price != null && (u.status === 'disponible' || u.status === 'bloqueado');

function schemeText(e: Esquema) {
  return e.diferido > 0
    ? `${e.enganche}% de enganche, ${e.diferido}% en mensualidades y ${e.entrega}% contra entrega física.`
    : `${e.enganche}% de enganche y ${e.entrega}% contra entrega física.`;
}

function LevelPage({ plaza, level, units, origin, date, levelHeader }: {
  plaza: InventoryPlaza;
  level: 1 | 2;
  units: InventoryUnit[];
  origin: string;
  date: string;
  levelHeader: string;
}) {
  const rowH = Math.min(60, TABLE.maxBody / Math.max(units.length, 1));
  const tableH = TABLE.header + rowH * units.length;
  const condTop = TABLE.top + tableH + 36;
  const schemes = plaza.schemes[level] ?? [];
  const plazaWord = plaza.slug === 'gardens' ? 'GARDENS' : 'LONG ISLAND';
  const letters = plazaWord.split('').join(' ');

  return (
    <Page size={PAGE} style={s.page}>
      {/* Encabezado: Tresor · Quattro + plaza · fecha / Perfect Space / título */}
      <Image src={`${origin}/lista-precios-assets/tresor.png`} style={[s.abs, { left: 134, top: 118, width: 180 }]} />
      <Image src={`${origin}/lista-precios-assets/quattro.png`} style={[s.abs, { left: 576, top: 54, width: 248 }]} />
      <View style={[s.abs, { left: 580, top: 236, width: 240, height: 1, backgroundColor: '#BFBFBF' }]} />
      <Text style={[s.abs, { left: 500, top: 252, width: 400, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 500, fontSize: 17, letterSpacing: 4 }]}>{letters}</Text>
      <Text style={[s.abs, { left: 1040, top: 66, width: 210, textAlign: 'center', fontFamily: 'Montserrat', fontSize: 14, letterSpacing: 1 }]}>{date}</Text>
      <Image src={`${origin}/lista-precios-assets/perfect-space-dark.png`} style={[s.abs, { left: 1016, top: 150, width: 250 }]} />
      <Text style={[s.abs, { left: 990, top: 234, width: 300, textAlign: 'center', fontSize: 21 }]}>
        Lista de Precios <Text style={{ fontFamily: 'Helvetica-Oblique' }}>Nivel {level}</Text>
      </Text>

      {/* Tabla */}
      <View style={[s.abs, { left: TABLE.left, top: TABLE.top, width: TABLE.width, height: tableH, borderWidth: 3, borderColor: C.ink }]}>
        <View style={{ flexDirection: 'row', height: TABLE.header, backgroundColor: C.header, borderBottomWidth: 3, borderBottomColor: C.ink }}>
          {[levelHeader, 'm2', 'Precio de lista', 'Fecha de Entrega', 'Disponibilidad'].map((h, i) => (
            <View key={h} style={[s.cell, { width: COLS[i] - (i === 0 ? 3 : 0) }]}>
              <Text style={s.th}>{h}</Text>
            </View>
          ))}
        </View>
        {units.map((u, r) => (
          <View key={u._id} style={{ flexDirection: 'row', height: rowH, position: 'relative' }}>
            <View style={[s.cell, { width: COLS[0] - 3, backgroundColor: C.code, borderRightWidth: 3, borderRightColor: C.ink }]}>
              <Text style={s.td}>{u.code}</Text>
            </View>
            <View style={[s.cell, { width: COLS[1], borderRightWidth: 3, borderRightColor: C.ink }]}>
              <Text style={s.td}>{u.m2 != null ? (Number.isInteger(u.m2) ? String(u.m2) : u.m2.toFixed(2)) : ''}</Text>
            </View>
            <View style={[s.cell, { width: COLS[2], backgroundColor: C.price, borderRightWidth: 3, borderRightColor: C.ink }]}>
              <Text style={s.td}>{showsPrice(u) ? money(u.price!) : ''}</Text>
            </View>
            <View style={[s.cell, { width: COLS[3], borderRightWidth: 3, borderRightColor: C.ink }]}>
              <Text style={s.td}>{u.delivery ?? ''}</Text>
            </View>
            <View style={[s.cell, { width: COLS[4] - 3, backgroundColor: C.status[u.status] ?? '#fff' }]}>
              <Text style={s.td}>{LABEL[u.status] ?? u.status}</Text>
            </View>
            {r < units.length - 1 && (
              <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, borderTopWidth: 1.6, borderTopColor: '#333', borderStyle: 'dotted' }} />
            )}
          </View>
        ))}
      </View>

      {/* Condiciones de pago + nota de IVA (la nota fluye debajo: con 4
          esquemas, una posición fija se encimaba con la última fila) */}
      <View style={[s.abs, { left: TABLE.left + 4, top: condTop, width: TABLE.width - 4 }]}>
        {schemes.length > 0 && (
          <>
            <View style={{ flexDirection: 'row', backgroundColor: C.condHead, paddingVertical: 6, paddingHorizontal: 16 }}>
              <Text style={{ flex: 1, fontFamily: 'Montserrat', fontWeight: 700, fontSize: 22 }}>Condiciones de pago Nivel {level}:</Text>
              <Text style={{ width: 200, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 700, fontSize: 22 }}>Descuento</Text>
            </View>
            {schemes.map((e, i) => (
              <View key={i} style={{ flexDirection: 'row', backgroundColor: i % 2 === 1 ? C.condHead : '#FFFFFF', paddingVertical: 5, paddingHorizontal: 16 }}>
                <Text style={{ flex: 1, fontFamily: 'Montserrat', fontSize: 21 }}>
                  <Text style={{ fontWeight: 700 }}>- Esquema {String.fromCharCode(65 + i)}:</Text> {schemeText(e)}
                </Text>
                <Text style={{ width: 200, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 700, fontSize: 21 }}>
                  {e.descuento ? `${e.descuento}%` : 'N/A'}
                </Text>
              </View>
            ))}
          </>
        )}
        {plaza.footnote ? (
          <Text style={{ marginTop: schemes.length > 3 ? 22 : 40, paddingHorizontal: 10, fontFamily: 'Montserrat', fontSize: 12.5, letterSpacing: 0.8 }}>
            {plaza.footnote}
          </Text>
        ) : null}
      </View>
    </Page>
  );
}

export function PriceListPdf({ plaza, origin }: { plaza: InventoryPlaza; origin: string }) {
  const date = formatDate(plaza.updatedAt);
  return (
    <Document title={`Quattro ${plaza.slug === 'gardens' ? 'Gardens' : 'Long Island'} | Lista de Precios`} author="Tresor Real Estate">
      {([1, 2] as const).map((level) => {
        const units = plaza.units.filter((u) => u.level === level);
        if (!units.length) return null;
        return (
          <LevelPage
            key={level}
            plaza={plaza}
            level={level}
            units={units}
            origin={origin}
            date={date}
            levelHeader={plaza.slug === 'gardens' ? `Nivel ${level}` : 'Local'}
          />
        );
      })}
    </Document>
  );
}
