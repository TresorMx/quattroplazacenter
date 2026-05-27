# Quattro Plaza Center — Handover

David, este es el resumen de entrega del sitio **quattroplaza.mx**.

## 1. Qué está listo

**Frontend (Next.js 15 + App Router, TS estricto, Tailwind, i18n ES/EN):**
- Home con hero PNG, intro editorial, grid 3 columnas con las 5 plazas (Long Island, Gardens, Tulum, Marina, Huayacán), broker strip y footer matón.
- Landing de plaza con hero fit-to-height (solo logo), quickfacts (Ubicación / Locales / Entrega / Precios), Proyecto, Ubicación con mapa blanco custom, Galería (imagen grande + carrusel), Floor Plans (3 tipologías), Disponibilidad con master plan interactivo y pines reales sobre la imagen, y cotizador embebido en "Aparta tu local".
- Cotizador 4 pasos (selector local → datos → plan de pago → resumen) con generación de PDF.
- Thank you page con confetti, botón "Descargar PDF" y modal Stripe ($50,000 MXN apartado).
- Portal de Brokers con gate (captura broker) → drive con 8 cards (Presentación, Lista de Precios, Master Plan, Cuentas Bancarias, Ubicación, Materiales, Desarrollador, Renders) + 4 cards de Formatos Administrativos.
- Chatbot flotante (Claude Sonnet 4.6 con tool use a Sanity para disponibilidad live).
- Mobile bar inferior (Agendar visita + WhatsApp).

**Backend / integraciones:**
- Sanity CMS embebido en `/studio` (admin completo de precios, locales, pines, leads, docs).
- Stripe Checkout para apartado ($50,000 MXN, tarjeta + OXXO + SPEI, locale es-419).
- API de chat (`/api/chat`) con agentic loop hasta 5 iteraciones.
- API de cotización (`/api/quote`) que guarda lead, envía email Resend y registra en Go High Level.
- Stripe webhook (`/api/stripe/webhook`) que marca el local como apartado.
- Generador PDF brandeado con `@react-pdf/renderer`.
- Adaptador Go High Level (fallback gracioso si no hay keys).

**SEO / brand:**
- Sitemap dinámico, robots.txt, OG images por ruta, JSON-LD, favicon SVG.
- Design tokens: `#FAB413` (Quattro gold), Cormorant Garamond + Manrope + Javacom.
- Container 90% viewport (`padding: max(24px, 5vw)`).
- Bilingüe ES/EN con `next-intl`.

## 2. Qué necesito de ti para ir a producción

Estas 7 credenciales son lo único que falta — son tuyas y debes generarlas en cada plataforma:

| # | Plataforma | Variable(s) | Dónde sacarlas |
|---|-----------|-------------|----------------|
| 1 | **Sanity** | `NEXT_PUBLIC_SANITY_PROJECT_ID`, `SANITY_API_TOKEN` | sanity.io/manage → crear proyecto `quattroplaza` |
| 2 | **Stripe** | `..._PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | dashboard.stripe.com → API keys + Webhooks |
| 3 | **Anthropic** | `ANTHROPIC_API_KEY` | console.anthropic.com → API Keys |
| 4 | **Resend** | `RESEND_API_KEY` + verificar `quattroplaza.mx` | resend.com/api-keys + /domains |
| 5 | **Go High Level** | `GHL_API_KEY`, `GHL_LOCATION_ID`, `NEXT_PUBLIC_GHL_CALENDAR_URL` | app.gohighlevel.com → Settings → API |
| 6 | **Google Maps** | `NEXT_PUBLIC_GMAPS_API_KEY` | console.cloud.google.com → APIs (Maps JS + Geocoding) |
| 7 | **WhatsApp** | `NEXT_PUBLIC_WHATSAPP_NUMBER` (tu número con `+52…`) | Tu número de WhatsApp Business |

Cuando las tengas, las pegas en `.env.local` (copia desde `.env.example`) y corres el script de deploy.

## 3. Deploy en 1 comando

Desde la carpeta del proyecto:

```bash
./scripts/deploy.sh
```

El script:
1. Verifica `gh`, `vercel`, `node`.
2. Instala dependencias.
3. Corre typecheck + lint.
4. Inicializa git + crea repo privado en GitHub.
5. Linkea Vercel y hace deploy de producción.
6. Te dice cómo apuntar el DNS de `quattroplaza.mx`.

Después: en Vercel → Settings → Domains, agregas `quattroplaza.mx` y `www.quattroplaza.mx`. En tu proveedor de DNS:
- `A` → `76.76.21.21`
- `CNAME www` → `cname.vercel-dns.com`

## 4. Stripe webhook (post-deploy)

Una vez en producción, en dashboard.stripe.com → Webhooks → Add endpoint:
- Endpoint: `https://quattroplaza.mx/api/stripe/webhook`
- Evento: `checkout.session.completed`
- Copia el signing secret → pégalo como `STRIPE_WEBHOOK_SECRET` en Vercel env vars → redeploy.

## 5. Sanity Studio (admin)

Una vez deployado, entras a `https://quattroplaza.mx/studio` con tu email. Ahí editas:
- Precios y disponibilidad de cada uno de los 62 locales.
- Información de cada plaza (descripción, amenidades, fechas).
- Master plans (subes imagen, marcas pines con click).
- Leads capturados (form, chatbot, broker access).
- Documentos del Drive de brokers.

Los cambios se publican en segundos vía ISR on-demand.

## 6. Estructura de archivos

```
quattro-plaza-web/
├── HANDOVER.md              ← este archivo
├── README.md                ← documentación técnica
├── .env.example             ← plantilla de variables
├── package.json
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── content/data/plazas.json ← seed de 62 locales reales
├── messages/                ← traducciones ES/EN
├── public/                  ← logos, renders, master plans
├── scripts/deploy.sh        ← deploy en 1 comando
├── src/
│   ├── app/                 ← rutas Next.js (i18n + APIs)
│   ├── components/          ← Header, Footer, MasterPlan, QuoteWizard, Chatbot…
│   ├── lib/                 ← types, quote, stripe, ghl, pdf
│   ├── styles/globals.css   ← design tokens
│   └── middleware.ts        ← i18n
└── preview-*.html           ← previews standalone (validación visual)
```

## 7. Previews (validación visual, sin servidor)

Estos archivos los puedes abrir directo en cualquier navegador, sin instalar nada:
- `preview-home.html` — Home completo
- `preview-plaza.html` — Landing de plaza con master plan y cotizador embebido
- `preview-cotizar.html` — Wizard 4 pasos
- `preview-gracias.html` — Thank you + Stripe modal
- `preview-brokers-gate.html` — Gate de broker
- `preview-brokers-drive.html` — Drive con 8 + 4 cards

## 8. Plan inmediato sugerido

1. **Hoy**: validas los previews y me confirmas que el diseño está OK.
2. **Mañana**: generas las 7 credenciales (te toma ~1 hora total).
3. **Mismo día**: corremos `./scripts/deploy.sh` y `quattroplaza.mx` queda en vivo.
4. **Siguientes días**: entras a `/studio` y subes el resto de assets/info que falte (descripciones largas, imágenes de Marina/Huayacán cuando estén).

---

Cualquier ajuste de copy, foto o color lo hacemos en minutos. Cuando tengas las keys, mándamelas y deployamos.
