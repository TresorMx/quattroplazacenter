import { defineField, defineType } from 'sanity';
import { PinPlacer } from '../components/PinPlacer';

export default defineType({
  name: 'unit',
  title: 'Local',
  type: 'document',
  fields: [
    defineField({
      name: 'plazaSlug',
      title: 'Plaza (slug)',
      type: 'string',
      description: 'Slug de la plaza a la que pertenece. Necesario para el pin visual.',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'code',  title: 'Código (ej. A-12, 101)', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'level', title: 'Nivel', type: 'number',
      options: { list: [{ title: 'Nivel 1', value: 1 }, { title: 'Nivel 2', value: 2 }] },
      initialValue: 1,
    }),
    defineField({ name: 'price', title: 'Precio (MXN, sin IVA)', type: 'number' }),
    defineField({
      name: 'status', title: 'Estatus', type: 'string',
      options: {
        list: [
          { title: '🟢 Disponible', value: 'disponible' },
          { title: '🟡 Apartado',   value: 'apartado' },
          { title: '🔴 Vendido',    value: 'vendido' },
          { title: '⚫ Bloqueado',   value: 'bloqueado' },
        ],
        layout: 'radio',
      },
      initialValue: 'disponible',
    }),
    defineField({ name: 'delivery', title: 'Entrega (override por local)', type: 'string', description: 'Si está vacío usa la ventana de entrega de la plaza.' }),
    defineField({ name: 'isAnchor', title: 'Local ancla', type: 'boolean', initialValue: false }),

    // ── Specs dinámicas ──────────────────────────────────────────
    defineField({
      name: 'specs', title: 'Datos del local',
      description: 'Las llaves se controlan desde la plaza. Aquí solo llenas los valores.',
      type: 'array',
      of: [{
        type: 'object', name: 'specEntry',
        fields: [
          { name: 'key',   title: 'Llave (debe coincidir con la plaza)', type: 'string', validation: (r) => r.required() },
          { name: 'value', title: 'Valor', type: 'string', validation: (r) => r.required() },
        ],
        preview: { select: { title: 'key', subtitle: 'value' } },
      }],
    }),

    // ── Pin visual ───────────────────────────────────────────────
    defineField({
      name: 'pin',
      title: 'Posición en master plan',
      description: 'Haz click sobre el master plan para colocar el pin.',
      type: 'object',
      components: { input: PinPlacer },
      fields: [
        { name: 'x', type: 'number', title: 'X (0–1)', validation: (r) => r.min(0).max(1) },
        { name: 'y', type: 'number', title: 'Y (0–1)', validation: (r) => r.min(0).max(1) },
      ],
    }),
  ],

  preview: {
    select: { title: 'code', subtitle: 'price', status: 'status', plaza: 'plazaSlug' },
    prepare: ({ title, subtitle, status, plaza }: any) => ({
      title: `${plaza ? `[${plaza}] ` : ''}${title}`,
      subtitle:
        (subtitle
          ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(subtitle)
          : '—') + `  ·  ${status ?? ''}`,
    }),
  },
});
