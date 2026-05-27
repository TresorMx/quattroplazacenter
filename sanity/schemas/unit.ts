import { defineField, defineType } from 'sanity';

/**
 * Unit — un local dentro de una plaza.
 *
 * Los campos descriptivos (Área, Frente, Fondo, etc.) NO están hardcoded.
 * Vienen del template definido en la plaza padre (plaza.unitSpecsTemplate)
 * y se llenan dinámicamente desde el array `specs` de abajo.
 *
 * Cuando agregas o quitas una entrada en `plaza.unitSpecsTemplate`,
 * el admin de cada local refleja el cambio automáticamente.
 */
export default defineType({
  name: 'unit',
  title: 'Local',
  type: 'document',
  fields: [
    defineField({
      name: 'code',
      title: 'Código (ej. A-12, B-05)',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'level',
      title: 'Nivel',
      type: 'number',
      options: {
        list: [
          { title: 'Nivel 1', value: 1 },
          { title: 'Nivel 2', value: 2 },
        ],
      },
      initialValue: 1,
    }),
    defineField({
      name: 'price',
      title: 'Precio (MXN, sin IVA)',
      type: 'number',
    }),
    defineField({
      name: 'status',
      title: 'Estatus',
      type: 'string',
      options: {
        list: [
          { title: 'Disponible', value: 'disponible' },
          { title: 'Apartado', value: 'apartado' },
          { title: 'Vendido', value: 'vendido' },
          { title: 'Bloqueado (no se muestra)', value: 'bloqueado' },
        ],
        layout: 'radio',
      },
      initialValue: 'disponible',
    }),
    defineField({
      name: 'delivery',
      title: 'Fecha de entrega (texto libre)',
      type: 'string',
      description: 'Override por local. Si está vacío usa el de la plaza.',
    }),
    defineField({
      name: 'isAnchor',
      title: 'Local ancla',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'pin',
      title: 'Posición en master plan (0–1)',
      type: 'object',
      description: 'Coordenadas relativas sobre la imagen del master plan',
      fields: [
        { name: 'x', type: 'number', validation: (r) => r.min(0).max(1) },
        { name: 'y', type: 'number', validation: (r) => r.min(0).max(1) },
      ],
    }),

    // ── Specs dinámicas ──────────────────────────────────────────
    defineField({
      name: 'specs',
      title: 'Datos del local',
      description:
        'Las llaves se controlan desde la plaza (campo "Campos editables de cada local"). ' +
        'Aquí solo llenas los valores. Si quitas una llave allá, desaparece de la ficha.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'specEntry',
          fields: [
            {
              name: 'key',
              title: 'Llave (debe coincidir con la plaza)',
              type: 'string',
              validation: (r) => r.required(),
            },
            {
              name: 'value',
              title: 'Valor',
              type: 'string',
              description: 'Numérico o texto, según tipo definido en la plaza',
              validation: (r) => r.required(),
            },
          ],
          preview: {
            select: { title: 'key', subtitle: 'value' },
          },
        },
      ],
    }),
  ],

  preview: {
    select: { title: 'code', subtitle: 'price', status: 'status' },
    prepare: ({ title, subtitle, status }) => ({
      title,
      subtitle:
        (subtitle ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(subtitle as number) : '—') +
        `  ·  ${status ?? ''}`,
    }),
  },
});
