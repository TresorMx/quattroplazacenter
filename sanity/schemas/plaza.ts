import { defineField, defineType } from 'sanity';

/**
 * Plaza — un proyecto comercial de Quattro.
 *
 * Cada plaza define POR SÍ MISMA:
 *  - Qué campos describen sus locales (Área, Frente, Fondo, lo que sea)
 *  - Qué planes de pago ofrece
 *
 * Esto permite que Long Island use solo Área/Frente/Fondo
 * y, por ejemplo, Marina agregue "Altura libre" sin tocar código.
 */
export default defineType({
  name: 'plaza',
  title: 'Plaza',
  type: 'document',
  groups: [
    { name: 'basic', title: 'General', default: true },
    { name: 'media', title: 'Imágenes' },
    { name: 'location', title: 'Ubicación' },
    { name: 'specs', title: 'Campos del local' },
    { name: 'plans', title: 'Planes de pago' },
    { name: 'units', title: 'Locales' },
  ],
  fields: [
    // ── General ──────────────────────────────────────────────────
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      group: 'basic',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'shortName',
      title: 'Nombre corto',
      type: 'string',
      group: 'basic',
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      group: 'basic',
      options: { source: 'name', maxLength: 60 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'basic',
    }),
    defineField({
      name: 'status',
      title: 'Estatus del proyecto',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: 'Preventa', value: 'preventa' },
          { title: 'Lanzamiento', value: 'lanzamiento' },
          { title: 'Entregado', value: 'entregado' },
          { title: 'Próximamente', value: 'coming-soon' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'deliveryWindow',
      title: 'Ventana de entrega',
      type: 'string',
      group: 'basic',
      description: 'Ej: "DIC 2026 — SEP 2027"',
    }),
    defineField({
      name: 'comingSoon',
      title: 'Próximamente (sin landing)',
      type: 'boolean',
      group: 'basic',
      initialValue: false,
    }),

    // ── Imágenes ─────────────────────────────────────────────────
    defineField({ name: 'heroRender', title: 'Hero (render)', type: 'image', group: 'media' }),
    defineField({ name: 'logoWhite', title: 'Logo blanco', type: 'image', group: 'media' }),
    defineField({ name: 'logoDark', title: 'Logo negro', type: 'image', group: 'media' }),
    defineField({ name: 'masterPlanImage', title: 'Master plan N1', type: 'image', group: 'media' }),
    defineField({ name: 'masterPlanLevel2', title: 'Master plan N2', type: 'image', group: 'media' }),

    // ── Ubicación ────────────────────────────────────────────────
    defineField({
      name: 'location',
      title: 'Ubicación',
      type: 'object',
      group: 'location',
      fields: [
        { name: 'lat', type: 'number', title: 'Latitud' },
        { name: 'lng', type: 'number', title: 'Longitud' },
        { name: 'address', type: 'string', title: 'Dirección' },
      ],
    }),

    // ── Campos del local (DINÁMICO — el admin agrega/quita) ──────
    defineField({
      name: 'unitSpecsTemplate',
      title: 'Campos editables de cada local',
      description:
        'Define qué datos vas a llenar por local en esta plaza. Por ejemplo: Área total, Frente, Fondo. ' +
        'Puedes agregar o quitar libremente — lo que quites desaparece de la ficha y del PDF.',
      type: 'array',
      group: 'specs',
      of: [
        {
          type: 'object',
          name: 'spec',
          fields: [
            {
              name: 'key',
              title: 'Llave interna (sin espacios)',
              type: 'string',
              description: 'Ej: "areaTotal", "frente", "fondo"',
              validation: (r) => r.required().regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, 'sin espacios ni caracteres especiales'),
            },
            { name: 'label', title: 'Etiqueta (ES)', type: 'string', validation: (r) => r.required() },
            { name: 'labelEn', title: 'Etiqueta (EN)', type: 'string' },
            {
              name: 'unit',
              title: 'Unidad / sufijo',
              type: 'string',
              description: 'Ej: "m²", "m", "kVA"',
            },
            {
              name: 'type',
              title: 'Tipo',
              type: 'string',
              options: {
                list: [
                  { title: 'Número', value: 'number' },
                  { title: 'Texto libre', value: 'text' },
                ],
              },
              initialValue: 'number',
            },
            { name: 'order', title: 'Orden', type: 'number', initialValue: 1 },
          ],
          preview: {
            select: { title: 'label', subtitle: 'unit', order: 'order' },
            prepare: ({ title, subtitle, order }) => ({
              title: `${order ?? '–'}. ${title}`,
              subtitle: subtitle ? `(${subtitle})` : undefined,
            }),
          },
        },
      ],
    }),

    // ── Planes de pago (DINÁMICO — el admin agrega/quita) ────────
    defineField({
      name: 'paymentPlans',
      title: 'Planes de pago',
      description:
        'Cada plaza define sus propios planes. Marca uno como "recomendado" para que aparezca primero en el cotizador.',
      type: 'array',
      group: 'plans',
      of: [
        {
          type: 'object',
          name: 'plan',
          fields: [
            {
              name: 'code',
              title: 'Código (sin espacios)',
              type: 'string',
              description: 'Ej: "plan-a", "contado-15"',
              validation: (r) => r.required(),
            },
            { name: 'label', title: 'Nombre visible', type: 'string', validation: (r) => r.required() },
            { name: 'tagline', title: 'Subtítulo', type: 'string', description: 'Ej: "Recomendado", "Mejor descuento"' },
            { name: 'down', title: 'Enganche %', type: 'number', validation: (r) => r.min(0).max(100) },
            { name: 'monthly', title: 'Mensualidades %', type: 'number', validation: (r) => r.min(0).max(100) },
            { name: 'delivery', title: 'Contra entrega %', type: 'number', validation: (r) => r.min(0).max(100) },
            { name: 'discount', title: 'Descuento %', type: 'number', validation: (r) => r.min(0).max(100) },
            { name: 'defaultMonths', title: 'Meses sugeridos', type: 'number' },
            { name: 'isDefault', title: 'Recomendado', type: 'boolean', initialValue: false },
            { name: 'order', title: 'Orden', type: 'number', initialValue: 1 },
          ],
          preview: {
            select: { title: 'label', subtitle: 'tagline', isDefault: 'isDefault' },
            prepare: ({ title, subtitle, isDefault }) => ({
              title: isDefault ? `★ ${title}` : title,
              subtitle,
            }),
          },
          validation: (r) =>
            r.custom((plan: any) => {
              if (!plan) return true;
              const sum = (plan.down ?? 0) + (plan.monthly ?? 0) + (plan.delivery ?? 0);
              return sum === 100 || `Los porcentajes deben sumar 100% (actualmente: ${sum}%)`;
            }),
        },
      ],
    }),

    // ── Locales (referencias) ────────────────────────────────────
    defineField({
      name: 'units',
      title: 'Locales de esta plaza',
      type: 'array',
      group: 'units',
      of: [{ type: 'reference', to: [{ type: 'unit' }] }],
    }),
  ],

  preview: {
    select: { title: 'name', subtitle: 'tagline', media: 'heroRender' },
  },
});
