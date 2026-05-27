import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'lead',
  title: 'Lead',
  type: 'document',
  fields: [
    defineField({ name: 'source', title: 'Origen', type: 'string', options: { list: ['form', 'chatbot', 'broker', 'cotizacion'] } }),
    defineField({ name: 'fullName', title: 'Nombre', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'phone', title: 'Teléfono', type: 'string' }),
    defineField({ name: 'company', title: 'Empresa', type: 'string' }),
    defineField({ name: 'isBroker', title: 'Es broker', type: 'boolean' }),
    defineField({ name: 'brokerage', title: 'Inmobiliaria', type: 'string' }),
    defineField({ name: 'plazaSlug', title: 'Plaza de interés', type: 'string' }),
    defineField({ name: 'unitCode', title: 'Local de interés', type: 'string' }),
    defineField({ name: 'message', title: 'Mensaje / contexto', type: 'text' }),
    defineField({ name: 'utm', title: 'UTM', type: 'object', fields: [
      { name: 'source', type: 'string' },
      { name: 'medium', type: 'string' },
      { name: 'campaign', type: 'string' },
    ]}),
    defineField({ name: 'sentToGHL', title: 'Enviado a GHL', type: 'boolean', initialValue: false }),
    defineField({ name: 'createdAt', title: 'Creado', type: 'datetime', initialValue: () => new Date().toISOString() }),
  ],
  preview: {
    select: { title: 'fullName', subtitle: 'email', desc: 'source' },
    prepare: ({ title, subtitle, desc }) => ({ title: title || subtitle || '(sin nombre)', subtitle: `${desc ?? ''} · ${subtitle ?? ''}` }),
  },
});
