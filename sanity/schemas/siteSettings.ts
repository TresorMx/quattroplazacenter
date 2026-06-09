import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Configuración del sitio',
  type: 'document',
  fields: [
    defineField({
      name: 'showAgendaWidget',
      title: 'Mostrar "Agenda tu visita" en lugar del cotizador',
      type: 'boolean',
      initialValue: false,
      description: 'Activa esto para reemplazar el cotizador en todas las páginas de plaza por el formulario de agenda de visita.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Configuración del sitio' };
    },
  },
});
