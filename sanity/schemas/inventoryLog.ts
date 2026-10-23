import { defineField, defineType } from 'sanity';

// Bitácora del panel /inventario: un documento por cambio guardado. Sirve
// para saber quién apartó, liberó o cambió el precio de un local y cuándo.
export default defineType({
  name: 'inventoryLog',
  title: 'Historial de inventario',
  type: 'document',
  readOnly: true,
  fields: [
    defineField({ name: 'at', title: 'Fecha', type: 'datetime' }),
    defineField({ name: 'by', title: 'Quién', type: 'string' }),
    defineField({ name: 'plazaSlug', title: 'Plaza', type: 'string' }),
    defineField({ name: 'code', title: 'Local', type: 'string' }),
    defineField({ name: 'summary', title: 'Cambio', type: 'string' }),
  ],
  orderings: [{ title: 'Más reciente', name: 'atDesc', by: [{ field: 'at', direction: 'desc' }] }],
  preview: {
    select: { code: 'code', plaza: 'plazaSlug', summary: 'summary', by: 'by', at: 'at' },
    prepare: ({ code, plaza, summary, by, at }: any) => ({
      title: `[${plaza}] ${code} — ${summary}`,
      subtitle: `${by ?? '—'} · ${at ? new Date(at).toLocaleString('es-MX', { timeZone: 'America/Cancun' }) : ''}`,
    }),
  },
});
