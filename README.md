# Quattro Plaza Center — quattroplaza.mx

Sitio oficial de Quattro Plaza Center. Plazas comerciales premium en Cancún.
Desarrollado por **Tresor Real Estate**.

## Stack

- **Next.js 15** (App Router, RSC)
- **TypeScript** estricto
- **Tailwind CSS** + design system editorial (Cormorant Garamond + Manrope + JetBrains Mono)
- **next-intl** — i18n ES/EN
- **Sanity CMS** — admin de precios, disponibilidad, leads, docs
- **Stripe Checkout** — apartado de $50K MXN (tarjeta + OXXO + SPEI)
- **Anthropic Claude Sonnet 4.6** — chatbot con tool use a Sanity
- **Resend** — emails transaccionales
- **Go High Level** — CRM y calendario (vía API)
- **Framer Motion** — micro-interacciones
- **Vercel** — hosting + Analytics + Speed Insights

## Estructura

```
src/
  app/
    [locale]/               # i18n routes (es | en)
      page.tsx              # Home
      plazas/[slug]/        # Landing por plaza
      cotizar/[slug]/[unit] # Cotizador multi-paso
      gracias/              # Thank you + descarga PDF + Stripe
      brokers/              # Portal broker (gate + drive)
    api/
      chat/                 # Claude chatbot endpoint
      lead/                 # Form submissions → GHL + Resend + Sanity
      quote-pdf/            # Generador de PDF de cotización
      stripe/webhook/       # Stripe → marca local como apartado
    studio/                 # Sanity Studio embebido
  components/               # Header, Footer, Chatbot, MasterPlan, etc.
  lib/                      # data, types, sanity, utils
  styles/                   # globals.css con design tokens
content/data/plazas.json    # Seed data (de los PDFs)
messages/                   # Traducciones ES/EN
public/                     # Logos, renders, master plans
```

## Quick start

```bash
pnpm install
cp .env.example .env.local   # llena las keys (ver checklist al final)
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) (ES) o [/en](http://localhost:3000/en).

## Administración

El admin completo está en **`/studio`** (Sanity).
Desde ahí editas:
- Precios y disponibilidad de cada local
- Master plans (subes imagen, marcas pines con click)
- Información de plazas
- Leads capturados (form, chatbot, broker access)
- Documentos del Drive de brokers

Cualquier cambio se refleja en producción en segundos (ISR on-demand).

## Checklist de keys antes del deploy

- [ ] Sanity project (sanity.io/manage) → `NEXT_PUBLIC_SANITY_PROJECT_ID` + `SANITY_API_TOKEN`
- [ ] Stripe (dashboard.stripe.com) → publishable + secret + webhook signing
- [ ] Anthropic (console.anthropic.com) → `ANTHROPIC_API_KEY`
- [ ] Resend (resend.com) → `RESEND_API_KEY` + verificar dominio quattroplaza.mx
- [ ] Go High Level → API key, Location ID, link público del calendario
- [ ] Google Maps Platform → `NEXT_PUBLIC_GMAPS_API_KEY` (Maps JS + Geocoding)
- [ ] WhatsApp Business → número en `NEXT_PUBLIC_WHATSAPP_NUMBER`

## Deploy

```bash
vercel link
vercel env pull
vercel --prod
```

Apuntar `quattroplaza.mx` a Vercel (DNS A/AAAA + CNAME `www`).
# quattroplazacenter
