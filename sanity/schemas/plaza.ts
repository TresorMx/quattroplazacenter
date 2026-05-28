import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'plaza',
  title: 'Plaza',
  type: 'document',
  groups: [
    { name: 'basic',    title: 'General',             default: true },
    { name: 'texts',    title: 'Textos landing' },
    { name: 'media',    title: 'Imágenes y renders' },
    { name: 'location', title: 'Ubicación' },
    { name: 'specs',    title: 'Campos del local' },
    { name: 'plans',    title: 'Planes de pago' },
    { name: 'units',    title: 'Locales' },
    { name: 'seo',      title: '🔍 SEO' },
  ],
  fields: [

    // ── GENERAL ──────────────────────────────────────────────────
    defineField({ name: 'name',      title: 'Nombre completo',            type: 'string',  group: 'basic', validation: (r) => r.required() }),
    defineField({ name: 'nameEn',    title: 'Nombre (EN)',                type: 'string',  group: 'basic' }),
    defineField({ name: 'shortName', title: 'Nombre corto (hero)',        type: 'string',  group: 'basic' }),
    defineField({ name: 'slug',      title: 'Slug (URL)',                 type: 'slug',    group: 'basic', options: { source: 'name', maxLength: 60 }, validation: (r) => r.required() }),
    defineField({ name: 'tagline',   title: 'Tagline (ES)',               type: 'string',  group: 'basic' }),
    defineField({ name: 'taglineEn', title: 'Tagline (EN)',               type: 'string',  group: 'basic' }),
    defineField({
      name: 'status', title: 'Estatus', type: 'string', group: 'basic',
      options: {
        list: [
          { title: 'Preventa',     value: 'preventa' },
          { title: 'Lanzamiento',  value: 'lanzamiento' },
          { title: 'Entregado',    value: 'entregado' },
          { title: 'Próximamente', value: 'coming-soon' },
        ],
        layout: 'radio',
      },
    }),
    defineField({ name: 'comingSoon',     title: 'Próximamente (sin landing)',  type: 'boolean', group: 'basic', initialValue: false }),
    defineField({ name: 'deliveryWindow', title: 'Ventana de entrega',          type: 'string',  group: 'basic', description: 'Ej: "DIC 2026 — MAR 2027"' }),
    defineField({ name: 'developer',      title: 'Desarrollador',               type: 'string',  group: 'basic', initialValue: 'Tresor Real Estate' }),

    // ── TEXTOS LANDING ───────────────────────────────────────────
    defineField({ name: 'description',   title: 'Descripción del proyecto (ES)', type: 'text', rows: 4, group: 'texts' }),
    defineField({ name: 'descriptionEn', title: 'Descripción del proyecto (EN)', type: 'text', rows: 4, group: 'texts' }),

    // — Sección "El Proyecto" —
    defineField({
      name: 'projectTitle', title: '📌 Frase principal del proyecto (ES)',
      type: 'string', group: 'texts',
      description: 'Aparece como título grande. Ej: "Mucho más que un local comercial."',
    }),
    defineField({
      name: 'projectTitleEn', title: '📌 Frase principal del proyecto (EN)',
      type: 'string', group: 'texts',
    }),
    defineField({
      name: 'projectBody1', title: '📝 Descripción de la plaza — qué la hace única (ES)',
      type: 'text', rows: 3, group: 'texts',
      description: 'El sitio antepone el nombre de la plaza. Empieza en minúscula. Ej: "se ubica en una zona de alta densidad..."',
    }),
    defineField({
      name: 'projectBody1En', title: '📝 Descripción de la plaza — qué la hace única (EN)',
      type: 'text', rows: 3, group: 'texts',
      description: 'The site prepends the plaza name. Start lowercase. E.g. "is located in a high-density area..."',
    }),
    defineField({
      name: 'projectBody2', title: '🔧 Qué incluye cada local (ES)',
      type: 'text', rows: 3, group: 'texts',
      description: 'Ej: "Cada local cuenta con instalaciones eléctricas, hidráulicas y sanitarias listas para tu giro."',
    }),
    defineField({
      name: 'projectBody2En', title: '🔧 Qué incluye cada local (EN)',
      type: 'text', rows: 3, group: 'texts',
    }),

    // — Sección Ubicación (3 ventajas clave) —
    defineField({
      name: 'bullet1', title: '📍 Ventaja de ubicación 1 (ES)',
      type: 'string', group: 'texts',
      description: 'Ej: "Alta densidad residencial circundante"',
    }),
    defineField({ name: 'bullet1En', title: '📍 Ventaja de ubicación 1 (EN)', type: 'string', group: 'texts' }),
    defineField({
      name: 'bullet2', title: '📍 Ventaja de ubicación 2 (ES)',
      type: 'string', group: 'texts',
      description: 'Ej: "Flujo vehicular validado por estudio de mercado"',
    }),
    defineField({ name: 'bullet2En', title: '📍 Ventaja de ubicación 2 (EN)', type: 'string', group: 'texts' }),
    defineField({
      name: 'bullet3', title: '📍 Ventaja de ubicación 3 (ES)',
      type: 'string', group: 'texts',
      description: 'Ej: "Frente a vialidad primaria"',
    }),
    defineField({ name: 'bullet3En', title: '📍 Ventaja de ubicación 3 (EN)', type: 'string', group: 'texts' }),

    // — Sección Floor Plans —
    defineField({
      name: 'floorPlansDesc', title: '🏗️ Texto introductorio de las plantas (ES)',
      type: 'text', rows: 2, group: 'texts',
      description: 'Aparece debajo del título "Plantas y tipologías". Ej: "Plantas arquitectónicas de los tipos disponibles. Todos incluyen instalaciones listas."',
    }),
    defineField({ name: 'floorPlansDescEn', title: '🏗️ Texto introductorio de las plantas (EN)', type: 'text', rows: 2, group: 'texts' }),

    defineField({
      name: 'highlights', title: 'Datos clave (quickfacts strip)',
      description: 'Los 3 primeros se muestran en el strip. El precio se toma automáticamente.',
      type: 'array', group: 'texts',
      of: [{
        type: 'object', name: 'highlight',
        fields: [
          { name: 'label',   title: 'Etiqueta (ES)', type: 'string', validation: (r: any) => r.required() },
          { name: 'labelEn', title: 'Etiqueta (EN)', type: 'string' },
          { name: 'value',   title: 'Valor',         type: 'string', validation: (r: any) => r.required() },
        ],
        preview: { select: { title: 'value', subtitle: 'label' } },
      }],
    }),

    // ── IMÁGENES Y RENDERS ───────────────────────────────────────
    defineField({ name: 'heroRender',       title: 'Hero (render principal)',  type: 'image', group: 'media', options: { hotspot: true } }),
    defineField({ name: 'logoWhite',        title: 'Logo blanco (SVG/PNG)',    type: 'image', group: 'media' }),
    defineField({ name: 'logoDark',         title: 'Logo negro (SVG/PNG)',     type: 'image', group: 'media' }),
    defineField({ name: 'masterPlanImage',  title: 'Master Plan Nivel 1',      type: 'image', group: 'media' }),
    defineField({ name: 'masterPlanLevel2', title: 'Master Plan Nivel 2',      type: 'image', group: 'media' }),
    defineField({
      name: 'gallery', title: 'Galería de renders',
      description: 'Imágenes del slider de la landing. Máx 12.',
      type: 'array', group: 'media',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: (r) => r.max(12),
    }),
    defineField({
      name: 'floorPlans', title: 'Floor plans / tipologías',
      type: 'array', group: 'media',
      of: [{
        type: 'object', name: 'floorPlan',
        fields: [
          { name: 'label',   title: 'Nombre tipología (ES)', type: 'string', validation: (r: any) => r.required() },
          { name: 'labelEn', title: 'Nombre tipología (EN)', type: 'string' },
          { name: 'image',   title: 'Imagen del plano',      type: 'image' },
          { name: 'area',   title: 'Área total (m²) — solo el número', type: 'number', description: 'Ej: 42.5  →  se muestra como "42.5 m²"' },
          { name: 'frente', title: 'Frente (m) — solo el número',     type: 'number', description: 'Ej: 5.5  →  se muestra como "5.5 m"' },
          { name: 'fondo',  title: 'Fondo (m) — solo el número',      type: 'number', description: 'Ej: 8  →  se muestra como "8 m"' },
          { name: 'order',   title: 'Orden',                 type: 'number', initialValue: 1 },
        ],
        preview: { select: { title: 'label', subtitle: 'area', media: 'image' }, prepare: ({ title, subtitle, media }: any) => ({ title, subtitle: subtitle ? `${subtitle} m²` : undefined, media }) },
      }],
    }),

    // ── UBICACIÓN ────────────────────────────────────────────────
    defineField({ name: 'city',    title: 'Ciudad',  type: 'string', group: 'location' }),
    defineField({ name: 'state',   title: 'Estado',  type: 'string', group: 'location' }),
    defineField({ name: 'country', title: 'País',    type: 'string', group: 'location', initialValue: 'México' }),
    defineField({
      name: 'location', title: 'Coordenadas y dirección',
      type: 'object', group: 'location',
      fields: [
        { name: 'lat',     type: 'number', title: 'Latitud' },
        { name: 'lng',     type: 'number', title: 'Longitud' },
        { name: 'address', type: 'string', title: 'Dirección completa' },
      ],
    }),

    // ── CAMPOS DEL LOCAL (DINÁMICO) ──────────────────────────────
    defineField({
      name: 'unitSpecsTemplate', title: 'Campos editables de cada local',
      description: 'Define qué datos lleva cada local (Área, Frente, Fondo...). Lo que quites desaparece de la ficha y el PDF.',
      type: 'array', group: 'specs',
      of: [{
        type: 'object', name: 'spec',
        fields: [
          { name: 'key',     title: 'Llave interna (sin espacios)', type: 'string', validation: (r) => r.required().regex(/^[a-zA-Z][a-zA-Z0-9_]*$/) },
          { name: 'label',   title: 'Etiqueta (ES)',   type: 'string', validation: (r) => r.required() },
          { name: 'labelEn', title: 'Etiqueta (EN)',   type: 'string' },
          { name: 'unit',    title: 'Unidad sufijo',   type: 'string', description: 'Ej: m², m, kVA' },
          { name: 'type', title: 'Tipo', type: 'string', options: { list: [{ title: 'Número', value: 'number' }, { title: 'Texto', value: 'text' }] }, initialValue: 'number' },
          { name: 'order', title: 'Orden', type: 'number', initialValue: 1 },
        ],
        preview: { select: { title: 'label', subtitle: 'unit', order: 'order' }, prepare: ({ title, subtitle, order }: any) => ({ title: `${order ?? '–'}. ${title}`, subtitle: subtitle ? `(${subtitle})` : undefined }) },
      }],
    }),

    // ── PLANES DE PAGO (DINÁMICO) ────────────────────────────────
    defineField({
      name: 'paymentPlans', title: 'Planes de pago',
      description: 'Marca uno como recomendado (★). Los % deben sumar 100.',
      type: 'array', group: 'plans',
      of: [{
        type: 'object', name: 'plan',
        fields: [
          { name: 'code',          title: 'Código',           type: 'string', validation: (r) => r.required() },
          { name: 'label',         title: 'Nombre visible',   type: 'string', validation: (r) => r.required() },
          { name: 'tagline',       title: 'Subtítulo',        type: 'string' },
          { name: 'down',          title: 'Enganche %',       type: 'number', validation: (r) => r.min(0).max(100) },
          { name: 'monthly',       title: 'Mensualidades %',  type: 'number', validation: (r) => r.min(0).max(100) },
          { name: 'delivery',      title: 'Contra entrega %', type: 'number', validation: (r) => r.min(0).max(100) },
          { name: 'discount',      title: 'Descuento %',      type: 'number', validation: (r) => r.min(0).max(100) },
          { name: 'defaultMonths', title: 'Meses sugeridos',  type: 'number' },
          { name: 'isDefault',     title: '★ Recomendado',    type: 'boolean', initialValue: false },
          { name: 'order',         title: 'Orden',            type: 'number', initialValue: 1 },
        ],
        preview: { select: { title: 'label', subtitle: 'tagline', isDefault: 'isDefault' }, prepare: ({ title, subtitle, isDefault }: any) => ({ title: isDefault ? `★ ${title}` : title, subtitle }) },
        validation: (r) => r.custom((plan: any) => {
          if (!plan) return true;
          const sum = (plan.down ?? 0) + (plan.monthly ?? 0) + (plan.delivery ?? 0);
          return sum === 100 || `Los % deben sumar 100 (actual: ${sum}%)`;
        }),
      }],
    }),

    // ── SEO ───────────────────────────────────────────────────────
    defineField({
      name: 'seoTitle',
      title: 'SEO Title (ES)',
      type: 'string',
      group: 'seo',
      description: 'Título para Google. Si se deja vacío usa el nombre de la plaza. Recomendado: 50-60 caracteres.',
      validation: (r) => r.max(60),
    }),
    defineField({
      name: 'seoTitleEn',
      title: 'SEO Title (EN)',
      type: 'string',
      group: 'seo',
      validation: (r) => r.max(60),
    }),
    defineField({
      name: 'seoDescription',
      title: 'Meta Description (ES)',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'Descripción para Google y redes sociales. Recomendado: 140-160 caracteres.',
      validation: (r) => r.max(160),
    }),
    defineField({
      name: 'seoDescriptionEn',
      title: 'Meta Description (EN)',
      type: 'text',
      rows: 3,
      group: 'seo',
      validation: (r) => r.max(160),
    }),

    // ── LOCALES ──────────────────────────────────────────────────
    defineField({
      name: 'units', title: 'Locales de esta plaza',
      type: 'array', group: 'units',
      of: [{ type: 'reference', to: [{ type: 'unit' }] }],
    }),
  ],

  preview: { select: { title: 'name', subtitle: 'tagline', media: 'heroRender' } },
});
