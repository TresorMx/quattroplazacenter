import { defineField, defineType } from 'sanity';

/** Documento del Drive de brokers (PDF, link a Drive, render pack, etc.) */
export default defineType({
  name: 'brokerDoc',
  title: 'Documento de brokers',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'description', title: 'Descripción', type: 'string' }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'string',
      options: {
        list: [
          { title: 'Material comercial', value: 'comercial' },
          { title: 'Formatos administrativos', value: 'admin' },
        ],
        layout: 'radio',
      },
    }),
    defineField({ name: 'plazaSlug', title: 'Plaza (opcional)', type: 'string', description: 'Si aplica a una plaza específica' }),
    defineField({ name: 'file', title: 'Archivo', type: 'file' }),
    defineField({ name: 'externalUrl', title: 'URL externa (Drive, Dropbox)', type: 'url' }),
    defineField({ name: 'order', title: 'Orden', type: 'number', initialValue: 1 }),
  ],
  preview: { select: { title: 'title', subtitle: 'category' } },
});
