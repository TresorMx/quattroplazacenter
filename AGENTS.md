# AGENTS.md — guía para cualquier IA que trabaje en este repo

## Qué es esto

**quattroplaza.mx**: sitio de marca de **Quattro Plaza Center** (locales comerciales de Tresor Real Estate en Cancún:
plazas **Gardens** y **Long Island**). Además del sitio público, aquí viven las herramientas internas de inventario:

| Ruta | Qué es | Quién la usa |
|---|---|---|
| `/inventario` | Panel para editar m², precio, entrega, estatus y "Cotizable" de cada local | Equipo comercial (contraseña `INVENTARIO_PASSWORD`) |
| `/lista-precios/gardens.pdf`, `/lista-precios/long-island.pdf` | Listas de precios generadas en vivo | Asesores y brokers |
| `/cotizador` | Cotizador interno con esquemas por nivel | Asesores y brokers. **Abierto a propósito**, sin contraseña, pero noindex |
| `/[locale]/plazas/[slug]` | Ficha pública de cada plaza con plano interactivo | Público |
| `/[locale]/cotizar/[slug]` | Cotizador público (QuoteWizard) | Público |
| `/studio` | Sanity Studio | David |

**Este sitio comparte el mismo Sanity (proyecto `hg48pwsi`, dataset `production`) con tresor.mx**
(repo `TresorMx/tresor-new-site`, carpeta `~/Desktop/ORGANICA/tresor-web`). Un cambio de inventario aquí se ve en los dos sitios.

## Documentación central (vive en el repo de tresor.mx)

La explicación completa del ecosistema está en tresor-web, para no tener dos versiones que se contradigan:

| Necesito… | Archivo en `TresorMx/tresor-new-site` |
|---|---|
| Cómo fluyen inventario, precios, cotizadores, leads y pagos | [`docs/SISTEMA.md`](https://github.com/TresorMx/tresor-new-site/blob/main/docs/SISTEMA.md) (secciones 2, 4, 5 y 6 son de Quattro) |
| Qué revisar si algo falla | [`docs/RUNBOOK.md`](https://github.com/TresorMx/tresor-new-site/blob/main/docs/RUNBOOK.md) (sección "Inventario y precios") |
| Estado del proyecto y pendientes | [`HANDOVER.md`](https://github.com/TresorMx/tresor-new-site/blob/main/HANDOVER.md) |

En local: `~/Desktop/ORGANICA/tresor-web/docs/`.

## Archivos clave de este repo

- `src/lib/inventory.ts`: lectura del inventario (Sanity sin CDN) y mapeo al formato del cotizador. Un local
  `quotable` y no vendido se ofrece como disponible en el cotizador interno.
- `src/app/inventario/actions.ts`: guardado validado en el servidor, bitácora (`inventoryLog`) y revalidación de los dos sitios.
- `src/lib/inventory-auth.ts`: login del panel (cookie HMAC `qinv`, 12 h).
- `src/lib/pricelist/PriceListPdf.tsx` + `src/app/lista-precios/[file]/route.ts`: PDF de lista de precios.
- `src/lib/cotizador-data.ts`: tipos, cálculo de la cotización e IVA (12.8 % = 16 % sobre el 80 % de construcción).
- `sanity/schemas/{unit,plaza,inventoryLog}.ts`: `unit.m2`, `unit.quotable`; en `plaza`, la pestaña
  "📄 Lista de precios y cotizador" (`quoterSchemes`, `bank`, `apartadoDefault`, `quoterAddress`, `priceListFootnote`).
- `src/middleware.ts`: el matcher excluye `inventario` y `lista-precios` del i18n.

## Reglas que no se rompen

1. **No inventar datos** (precios, m², fechas de entrega). Salen del panel o de la lista oficial.
2. **Schema de Sanity: solo cambios aditivos.** tresor.mx lee los mismos documentos.
3. `@react-pdf/renderer` va en `serverExternalPackages` de `next.config.mjs`. Si se empaqueta, el PDF truena.
4. **No hacer commit de los archivos sueltos de David:** `public/logos/QuattroGardensLogoWhite.svg`, `public/mapagardens.png`,
   `public/broker/gardens/*.png`, `.claude/`. `git add` solo de lo que tocaste; nunca `.env*`.
5. Verificar con `npx tsc --noEmit` + `pnpm build`, luego commit y push a `main`.
6. "Libera el local X solo en el cotizador" = marcar **Cotizable**, sin cambiar su estatus público.
7. Gardens y Long Island **no** están sobre Av. Huayacán.
8. `/cotizador` y `/lista-precios/*` son **abiertos a propósito** (se comparten con brokers) y **no indexables**: meta
   `noindex, nofollow` en el cotizador y header `X-Robots-Tag: noindex` en los PDF. No bloquearlos en robots.txt
   (Google dejaría de ver el noindex) y no ponerles contraseña sin que David lo pida.

## Documentos viejos de este repo

`HANDOVER.md`, `INSTALACION.md` y `QA-CHECKLIST.md` son de la entrega original del sitio (2026) y **no describen el
inventario actual**. `README.md` sirve para el stack base. Para el sistema actual, usa los documentos de arriba.
