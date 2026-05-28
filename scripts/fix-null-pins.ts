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
  // Borrar pin de TODOS los locales (null o con valor incorrecto del seeder)
  const units = await client.fetch<{ _id: string; code: string }[]>(
    `*[_type == "unit" && defined(pin)]{ _id, code }`
  );

  if (!units.length) {
    console.log('✅ No hay locales con pin. Todo limpio.');
    return;
  }

  console.log(`🔧 Borrando pin de ${units.length} locales...`);

  for (const unit of units) {
    await client.patch(unit._id).unset(['pin']).commit();
    process.stdout.write(` ${unit.code}`);
  }

  console.log(`\n✅ Listo. Ahora coloca los pins desde Studio → cada local → "Posición en master plan".`);
}

main().catch(console.error);
