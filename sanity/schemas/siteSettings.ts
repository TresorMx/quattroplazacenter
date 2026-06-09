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
    defineField({
      name: 'agendaEyebrow',
      title: 'Eyebrow agenda',
      type: 'string',
      initialValue: '— Agenda tu visita',
      description: 'Texto pequeño sobre el título cuando el widget de agenda está activo.',
    }),
    defineField({
      name: 'agendaTitle1',
      title: 'Título agenda — línea 1',
      type: 'string',
      initialValue: 'Agenda',
      description: 'Primera línea del título cuando el widget de agenda está activo.',
    }),
    defineField({
      name: 'agendaTitle2',
      title: 'Título agenda — línea 2',
      type: 'string',
      initialValue: 'tu visita',
      description: 'Segunda línea del título cuando el widget de agenda está activo.',
    }),
    defineField({
      name: 'agendaDesc',
      title: 'Descripción agenda',
      type: 'string',
      initialValue: 'Elige fecha, hora y modalidad. Te confirmamos en menos de 24 hrs.',
      description: 'Texto descriptivo debajo del título del widget de agenda.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Configuración del sitio' };
    },
  },
});
