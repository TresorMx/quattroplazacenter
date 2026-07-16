/**
 * Actualización puntual: nueva lista de precios/m2 de Gardens (16/7/2026).
 * Patch (no replace) — solo toca price/status/specs.areaTotal de las
 * unidades que cambiaron, sin tocar pines/imágenes ya cargados en Studio.
 *
 * Uso: pnpm tsx scripts/update-gardens-prices.ts
 */

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'hg48pwsi',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

interface Change {
  code: string;
  price?: number;
  status?: 'disponible' | 'apartado' | 'vendido' | 'bloqueado';
  areaTotal?: number;
  unsetPrice?: boolean;
}

const CHANGES: Change[] = [
  { code: '101', price: 9685000 },
  { code: '102', areaTotal: 32.6 },
  { code: '105', areaTotal: 32.6 },
  { code: '106', areaTotal: 40.75 },
  { code: '111', areaTotal: 40.75 },
  { code: '112', status: 'vendido', areaTotal: 32.6, unsetPrice: true },
  { code: '113', status: 'vendido', unsetPrice: true },
  { code: '115', areaTotal: 32.6 },
  { code: '116', price: 9685000 },
  { code: '202', areaTotal: 32.6 },
  { code: '205', areaTotal: 32.6 },
  { code: '206', areaTotal: 40.75 },
  { code: '211', areaTotal: 40.75 },
  { code: '212', areaTotal: 32.6 },
  { code: '215', areaTotal: 32.6 },
];

async function run() {
  console.log(`\nActualizando ${CHANGES.length} locales de Gardens...\n`);

  for (const c of CHANGES) {
    const id = `unit-gardens-G-${c.code}`;
    const patch = client.patch(id);

    const setFields: Record<string, unknown> = {};
    if (c.price !== undefined) setFields.price = c.price;
    if (c.status !== undefined) setFields.status = c.status;
    if (c.areaTotal !== undefined) {
      setFields.specs = [{ _key: 'areaTotal', key: 'areaTotal', value: String(c.areaTotal) }];
    }

    if (Object.keys(setFields).length) patch.set(setFields);
    if (c.unsetPrice) patch.unset(['price']);

    await patch.commit({ autoGenerateArrayKeys: true });
    console.log(`  ✓ ${id}`, setFields, c.unsetPrice ? '(price unset)' : '');
  }

  console.log('\nListo.\n');
}

run().catch((e) => {
  console.error('\nError:', e.message ?? e);
  process.exit(1);
});
