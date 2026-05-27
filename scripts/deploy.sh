#!/usr/bin/env bash
# ────────────────────────────────────────────────────────────────
# Quattro Plaza Center — Deploy script
# Uso:   ./scripts/deploy.sh
# Requiere: gh, vercel, pnpm (o npm)
# ────────────────────────────────────────────────────────────────
set -euo pipefail

REPO_NAME="quattroplaza-web"
DOMAIN="quattroplaza.mx"

echo "→ 1. Verificando dependencias…"
for cmd in git gh vercel node; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "✗ Falta '$cmd'. Instala antes de continuar."
    exit 1
  fi
done

echo "→ 2. Instalando paquetes…"
if command -v pnpm >/dev/null 2>&1; then
  pnpm install
else
  npm install
fi

echo "→ 3. Typecheck + lint…"
if command -v pnpm >/dev/null 2>&1; then
  pnpm typecheck && pnpm lint
else
  npm run typecheck && npm run lint
fi

echo "→ 4. Inicializando git (si no existe)…"
if [ ! -d .git ]; then
  git init -b main
  git add .
  git commit -m "feat: Quattro Plaza Center — initial release"
fi

echo "→ 5. Creando repo en GitHub (privado)…"
if ! gh repo view "$REPO_NAME" >/dev/null 2>&1; then
  gh repo create "$REPO_NAME" --private --source=. --push
else
  git push -u origin main || true
fi

echo "→ 6. Linkeando Vercel + deploy producción…"
vercel link --yes
vercel env pull .env.production.local || true
vercel --prod

echo ""
echo "✓ Deploy listo."
echo "  • Apunta DNS de $DOMAIN a Vercel (A 76.76.21.21 + CNAME www → cname.vercel-dns.com)"
echo "  • Agrega el dominio en vercel.com/<team>/<project>/settings/domains"
echo "  • Configura el webhook de Stripe en https://dashboard.stripe.com/webhooks"
echo "    Endpoint: https://$DOMAIN/api/stripe/webhook"
echo "    Evento:   checkout.session.completed"
