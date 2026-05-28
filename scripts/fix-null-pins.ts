/**
 * Elimina pin: null de todos los locales en Sanity.
 * Sanity espera que los campos object no existan si no tienen valor.
 *
 * Uso: npx tsx scripts/fix-null-pins.ts
 */
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token:     process.env.SANITY_API_TOKEN!,
  useCdn:    false,
});

async function main() {
  // Buscar todos los locales donde pin es null
  const units = await client.fetch<{ _id: string }[]>(
    `*[_type == "unit" && pin == null]{ _id }`
  );

  if (!units.length) {
    console.log('✅ No hay locales con pin nulo. Todo limpio.');
    return;
  }

  console.log(`🔧 Limpiando pin nulo en ${units.length} locales...`);

  for (const unit of units) {
    await client.patch(unit._id).unset(['pin']).commit();
    process.stdout.write('.');
  }

  console.log(`\n✅ Listo. ${units.length} locales corregidos.`);
}

main().catch(console.error);
