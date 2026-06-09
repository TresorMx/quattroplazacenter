/**
 * Estructura del sidebar del Studio.
 * Nombrado desk.ts para evitar colisión circular con el módulo npm 'sanity/structure'
 * cuando baseUrl="." está configurado en tsconfig.
 *
 * El tipo de `S` se infiere en runtime desde structureTool({ structure });
 * TS no puede resolver sanity/structure types via exports map (falta condición "types"),
 * así que usamos any acotado — seguro en runtime.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const structure = (S: any) =>
  S.list()
    .title('Quattro Plaza Center')
    .items([
      S.listItem()
        .title('🏢 Plazas')
        .child(
          S.documentTypeList('plaza')
            .title('Plazas')
            .defaultOrdering([{ field: 'name', direction: 'asc' }])
        ),

      S.listItem()
        .title('🏪 Locales')
        .child(
          S.documentTypeList('unit')
            .title('Locales')
            .defaultOrdering([{ field: 'code', direction: 'asc' }])
        ),

      S.divider(),

      S.listItem()
        .title('📁 Drive de brokers')
        .child(S.documentTypeList('brokerDoc').title('Documentos')),

      S.listItem()
        .title('👥 Leads')
        .child(
          S.documentTypeList('lead')
            .title('Leads')
            .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
        ),

      S.divider(),

      S.listItem()
        .title('⚙️ Configuración del sitio')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),
    ]);
