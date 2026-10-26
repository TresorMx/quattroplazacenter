import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';
import type { InventoryPlaza, InventoryUnit, PriceListFormula } from '../inventory';

/* ────────────────────────────────────────────────────────────
   Lista de precios en PDF — réplica del Keynote oficial
   ("Quattro Gardens | Lista de Precios", oct/2026): página 1400×1600 pt,
   una página por nivel (tabla con colores por estatus; fecha de entrega solo
   en Gardens; nota de IVA) y, al
   final, una hoja de "Fórmulas de pago" si la plaza tiene fórmulas activas
   (Studio → plaza → "Lista de precios y cotizador"). Se genera en vivo desde
   Sanity: lo que cambie en /inventario aparece aquí en la siguiente descarga.
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
// Anchos de columna (suman 1140). "Fecha de Entrega" solo va en Gardens: Long
// Island la quitó el 24/oct/2026 (sus entregas van en las Fórmulas de pago) y
// Gardens la conserva (pedido de David, 26/oct/2026).
const COLS_CON_ENTREGA = [162, 150, 290, 290, 248]; // medidos sobre el Keynote
const COLS_SIN_ENTREGA = [230, 220, 400, 290];
const muestraEntrega = (plaza: InventoryPlaza) => plaza.slug === 'gardens';

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

// Encabezado común a todas las hojas: Tresor · Quattro + plaza · fecha /
// Perfect Space / título de la hoja.
function Header({ plaza, origin, date, children }: { plaza: InventoryPlaza; origin: string; date: string; children: React.ReactNode }) {
  const plazaWord = plaza.slug === 'gardens' ? 'GARDENS' : 'LONG ISLAND';
  const letters = plazaWord.split('').join(' ');
  return (
    <>
      <Image src={`${origin}/lista-precios-assets/tresor.png`} style={[s.abs, { left: 134, top: 118, width: 180 }]} />
      <Image src={`${origin}/lista-precios-assets/quattro.png`} style={[s.abs, { left: 576, top: 54, width: 248 }]} />
      <View style={[s.abs, { left: 580, top: 236, width: 240, height: 1, backgroundColor: '#BFBFBF' }]} />
      <Text style={[s.abs, { left: 500, top: 252, width: 400, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 500, fontSize: 17, letterSpacing: 4 }]}>{letters}</Text>
      <Text style={[s.abs, { left: 1040, top: 66, width: 210, textAlign: 'center', fontFamily: 'Montserrat', fontSize: 14, letterSpacing: 1 }]}>{date}</Text>
      <Image src={`${origin}/lista-precios-assets/perfect-space-dark.png`} style={[s.abs, { left: 1016, top: 150, width: 250 }]} />
      <Text style={[s.abs, { left: 990, top: 234, width: 300, textAlign: 'center', fontSize: 21 }]}>{children}</Text>
    </>
  );
}

const noteStyle = { paddingHorizontal: 10, fontFamily: 'Montserrat', fontSize: 12.5, letterSpacing: 0.8 } as const;

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
  const conEntrega = muestraEntrega(plaza);
  const COLS = conEntrega ? COLS_CON_ENTREGA : COLS_SIN_ENTREGA;
  const last = COLS.length - 1;

  return (
    <Page size={PAGE} style={s.page}>
      <Header plaza={plaza} origin={origin} date={date}>
        Lista de Precios <Text style={{ fontFamily: 'Helvetica-Oblique' }}>Nivel {level}</Text>
      </Header>

      {/* Tabla */}
      <View style={[s.abs, { left: TABLE.left, top: TABLE.top, width: TABLE.width, height: tableH, borderWidth: 3, borderColor: C.ink }]}>
        <View style={{ flexDirection: 'row', height: TABLE.header, backgroundColor: C.header, borderBottomWidth: 3, borderBottomColor: C.ink }}>
          {[levelHeader, 'm2', 'Precio de lista', ...(conEntrega ? ['Fecha de Entrega'] : []), 'Disponibilidad'].map((h, i) => (
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
            {conEntrega && (
              <View style={[s.cell, { width: COLS[3], borderRightWidth: 3, borderRightColor: C.ink }]}>
                <Text style={s.td}>{u.delivery ?? ''}</Text>
              </View>
            )}
            <View style={[s.cell, { width: COLS[last] - 3, backgroundColor: C.status[u.status] ?? '#fff' }]}>
              <Text style={s.td}>{LABEL[u.status] ?? u.status}</Text>
            </View>
            {r < units.length - 1 && (
              <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, borderTopWidth: 1.6, borderTopColor: '#333', borderStyle: 'dotted' }} />
            )}
          </View>
        ))}
      </View>

      {/* Nota de IVA. Las condiciones de pago ya no van aquí: viven en la
          hoja "Fórmulas de pago" (FormulasPage). */}
      {plaza.footnote ? (
        <Text style={[s.abs, noteStyle, { left: TABLE.left + 4, top: TABLE.top + tableH + 40, width: TABLE.width - 4 }]}>
          {plaza.footnote}
        </Text>
      ) : null}
    </Page>
  );
}

// Hoja "Fórmulas de pago": una tabla por fórmula activa, con el mismo
// lenguaje visual que la lista (borde negro, encabezado gris, primera columna
// amarilla, separadores punteados). La columna Financiamiento solo aparece si
// la fórmula la tiene activada (interruptor en /inventario); su asterisco
// remite a la nota al pie.
const FORMULA = { title: 34, gap: 14, after: 46, notes: 110, bottom: 1530 };

function FormulasPage({ plaza, formulas, origin, date }: {
  plaza: InventoryPlaza;
  formulas: PriceListFormula[];
  origin: string;
  date: string;
}) {
  const totalRows = formulas.reduce((n, f) => n + f.rows.length, 0);
  const fixed = formulas.length * (FORMULA.title + FORMULA.gap + TABLE.header + FORMULA.after);
  const rowH = Math.min(60, (FORMULA.bottom - TABLE.top - FORMULA.notes - fixed) / Math.max(totalRows, 1));
  const star = plaza.formulasNote.trim().startsWith('*') ? '*' : '';

  return (
    <Page size={PAGE} style={s.page}>
      <Header plaza={plaza} origin={origin} date={date}>
        Fórmulas de pago
      </Header>

      <View style={[s.abs, { left: TABLE.left, top: TABLE.top, width: TABLE.width }]}>
        {formulas.map((f, fi) => {
          const withFin = f.showFinancing;
          const cols: { h: string; v: (r: PriceListFormula['rows'][number]) => string }[] = [
            { h: 'Enganche', v: (r) => `${r.enganche}%` },
            { h: 'Mensualidades', v: (r) => `${r.mensualidades}%` },
            { h: 'Entrega', v: (r) => `${r.entrega}%` },
            ...(withFin ? [{ h: `Financiamiento${star}`, v: (r: PriceListFormula['rows'][number]) => `${r.financiamiento}%${star}` }] : []),
            { h: 'Descuento', v: (r) => `${r.descuento}%` },
          ];
          const w = TABLE.width / cols.length;
          return (
            <View key={fi} style={{ marginBottom: FORMULA.after }}>
              <Text style={{ height: FORMULA.title, marginBottom: FORMULA.gap, fontFamily: 'Montserrat', fontWeight: 700, fontSize: 26 }}>
                {f.title}
              </Text>
              <View style={{ borderWidth: 3, borderColor: C.ink }}>
                <View style={{ flexDirection: 'row', height: TABLE.header, backgroundColor: C.header, borderBottomWidth: 3, borderBottomColor: C.ink }}>
                  {cols.map((c) => (
                    <View key={c.h} style={[s.cell, { width: w }]}>
                      <Text style={s.th}>{c.h}</Text>
                    </View>
                  ))}
                </View>
                {f.rows.map((r, ri) => (
                  <View key={ri} style={{ flexDirection: 'row', height: rowH, position: 'relative' }}>
                    {cols.map((c, ci) => (
                      <View
                        key={c.h}
                        style={[s.cell, {
                          width: w - (ci === 0 || ci === cols.length - 1 ? 1.5 : 0),
                          backgroundColor: ci === 0 ? C.code : ci === cols.length - 1 ? C.price : '#FFFFFF',
                          ...(ci < cols.length - 1 ? { borderRightWidth: 3, borderRightColor: C.ink } : {}),
                        }]}
                      >
                        <Text style={ci === cols.length - 1 ? [s.td, { fontFamily: 'Helvetica-Bold' }] : s.td}>{c.v(r)}</Text>
                      </View>
                    ))}
                    {ri < f.rows.length - 1 && (
                      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, borderTopWidth: 1.6, borderTopColor: '#333', borderStyle: 'dotted' }} />
                    )}
                  </View>
                ))}
              </View>
            </View>
          );
        })}

        {plaza.formulasNote ? <Text style={[noteStyle, { fontSize: 15, marginTop: -16 }]}>{plaza.formulasNote}</Text> : null}
        {plaza.footnote ? <Text style={[noteStyle, { marginTop: 14 }]}>{plaza.footnote}</Text> : null}
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
      {plaza.formulas.length > 0 && (
        <FormulasPage plaza={plaza} formulas={plaza.formulas} origin={origin} date={date} />
      )}
    </Document>
  );
}
