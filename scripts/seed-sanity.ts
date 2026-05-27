/**
 * Seeder: importa plazas.json → Sanity
 *
 * Uso:
 *   SANITY_API_TOKEN=<token> pnpm tsx scripts/seed-sanity.ts
 *
 * Obtén el token en: sanity.io/manage → Quattro Plaza Center → API → Tokens
 * Permisos requeridos: Editor (o superior)
 *
 * El script es idempotente: usa el slug como _id para no duplicar documentos.
 */

import { createClient } from '@sanity/client';
import plazasData from '../content/data/plazas.json' assert { type: 'json' };

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'hg48pwsi',
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET   ?? 'production',
  apiVersion: '2024-01-01',
  token:     process.env.SANITY_API_TOKEN,
  useCdn:    false,
});

const plazas = (plazasData as any).plazas;

async function seed() {
  console.log(`\n🌱  Quattro Plaza Center — Sanity Seeder`);
  console.log(`   Proyecto: ${client.config().projectId} / ${client.config().dataset}\n`);

  for (const plaza of plazas) {
    const plazaId = `plaza-${plaza.slug}`;

    // ── 1. Crear/actualizar locales ──────────────────────────────
    const unitRefs: { _type: 'reference'; _ref: string; _key: string }[] = [];

    for (const unit of plaza.units ?? []) {
      const unitId = `unit-${plaza.slug}-${unit.id ?? unit.code}`;

      const unitDoc = {
        _id:       unitId,
        _type:     'unit',
        plazaSlug: plaza.slug,
        code:      unit.code,
        level:     unit.level ?? 1,
        price:     unit.price ?? null,
        delivery:  unit.delivery ?? null,
        status:    unit.status ?? 'disponible',
        isAnchor:  unit.isAnchor ?? false,
        pin:       unit.pin ?? null,
        specs:     Object.entries(unit.specs ?? {}).map(([key, value]) => ({
          _key: key,
          key,
          value: String(value),
        })),
      };

      await client.createOrReplace(unitDoc);
      unitRefs.push({ _type: 'reference', _ref: unitId, _key: unitId });
      process.stdout.write('  .');
    }

    if (plaza.units?.length) console.log(` ${plaza.units.length} locales`);

    // ── 2. Crear/actualizar plaza ────────────────────────────────
    const plazaDoc = {
      _id:   plazaId,
      _type: 'plaza',

      name:           plaza.name,
      shortName:      plaza.shortName,
      slug:           { _type: 'slug', current: plaza.slug },
      tagline:        plaza.tagline,
      status:         plaza.status,
      comingSoon:     plaza.comingSoon ?? false,
      deliveryWindow: plaza.deliveryWindow ?? null,
      developer:      plaza.developer ?? 'Tresor Real Estate',

      city:    plaza.city,
      state:   plaza.state,
      country: plaza.country ?? 'México',
      location: plaza.location ?? null,

      highlights: (plaza.highlights ?? []).map((h: any, i: number) => ({
        _key:  `h${i}`,
        label: h.label,
        value: h.value,
      })),

      unitSpecsTemplate: (plaza.unitSpecsTemplate ?? []).map((s: any) => ({
        _key:    s.key,
        key:     s.key,
        label:   s.label,
        labelEn: s.labelEn ?? null,
        unit:    s.unit ?? null,
        type:    s.type ?? 'number',
        order:   s.order ?? 1,
      })),

      paymentPlans: (plaza.paymentPlans ?? []).map((p: any) => ({
        _key:          p.code,
        code:          p.code,
        label:         p.label,
        tagline:       p.tagline ?? null,
        down:          p.down,
        monthly:       p.monthly,
        delivery:      p.delivery,
        discount:      p.discount ?? 0,
        defaultMonths: p.defaultMonths ?? 0,
        isDefault:     p.isDefault ?? false,
        order:         p.order ?? 1,
      })),

      units: unitRefs,
    };

    await client.createOrReplace(plazaDoc);
    console.log(`✅  ${plaza.name} (${plaza.slug})`);
  }

  console.log('\n🎉  Seeder completado!\n');
  console.log('   Siguiente paso: abre el Studio en /studio y verifica los datos.');
  console.log('   Luego sube imágenes desde la UI (hero, logos, galería, master plan).\n');
}

seed().catch((e) => {
  console.error('\n❌  Error en seeder:', e.message ?? e);
  process.exit(1);
});
