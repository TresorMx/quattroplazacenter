# QA final — Quattro Plaza Center

Ejecutar antes de cada deploy a producción.

## Build
- [ ] `pnpm typecheck` → sin errores
- [ ] `pnpm lint` → sin warnings críticos
- [ ] `pnpm build` → completa sin fallos
- [ ] `pnpm start` y navegar localmente → todo se ve igual que en `pnpm dev`

## Rutas (ES y EN)
- [ ] `/` y `/en` cargan home
- [ ] `/plazas/long-island` y `/en/plazas/long-island`
- [ ] `/plazas/gardens` y `/en/plazas/gardens`
- [ ] `/cotizar/long-island?unit=LI-A-12` → wizard, 4 pasos
- [ ] `/gracias?ref=…` → descarga PDF + modal Stripe
- [ ] `/brokers` → gate; al enviar form, drive con 12 cards
- [ ] `/studio` → admin Sanity

## Funcional
- [ ] Cotizador: cambiar enganche, plazo, descuento → totales recalculan correctos
- [ ] Cotizador: enviar → recibe PDF + email Resend + lead en GHL
- [ ] Stripe: pagar $50K MXN test (4242…) → webhook marca local como apartado en Sanity
- [ ] Chatbot: preguntar "¿qué locales hay en Long Island bajo $3M?" → responde con datos live
- [ ] Master plan: clicar pin → muestra ficha con precio + CTA "Cotizar"
- [ ] Master plan: filtros (disponible/apartado/vendido) funcionan
- [ ] Brokers: gate guarda lead 30 días, drive descarga PDFs

## Responsive
- [ ] Mobile (375px): bar inferior visible, header colapsa, master plan scroll
- [ ] Tablet (768px)
- [ ] Desktop (1440px+): container 90% viewport

## SEO
- [ ] `/sitemap.xml` lista todas las plazas en ES + EN
- [ ] `/robots.txt` correcto (allow `/`, disallow `/api/`, `/studio/`)
- [ ] `/opengraph-image` se renderiza
- [ ] `<title>` y `<meta description>` únicos por ruta
- [ ] JSON-LD `RealEstateListing` en cada landing de plaza

## Lighthouse (mobile + desktop)
Target: 95+ en las 4 categorías.
- [ ] Performance ≥ 95
- [ ] Accessibility ≥ 95
- [ ] Best practices ≥ 95
- [ ] SEO ≥ 95

```bash
npx lighthouse https://quattroplaza.mx --view --preset=desktop
npx lighthouse https://quattroplaza.mx --view  # mobile por defecto
```

## Post-deploy
- [ ] HTTPS activo con cert válido en `quattroplaza.mx` y `www.quattroplaza.mx`
- [ ] `www` redirige a apex (o viceversa, según preferencia)
- [ ] Google Search Console: verificar propiedad + enviar sitemap
- [ ] Google Business Profile: añadir link al sitio
- [ ] Stripe webhook responde 200 a evento de prueba

## Smoke test post-deploy (5 min)
1. Abrir https://quattroplaza.mx en incógnito
2. Cambiar a EN
3. Entrar a Long Island, abrir master plan, clickar un pin
4. Iniciar cotización, llenar form, recibir PDF
5. Probar chatbot
6. Brokers: pasar gate con email de prueba
