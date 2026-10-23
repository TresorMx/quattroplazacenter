import { getProyectos } from '@/lib/inventory';
import CotizadorClient from './CotizadorClient';

// Inventario en vivo desde Sanity (fuente única, ver lib/inventory.ts): un
// cambio en /inventario se refleja aquí en la siguiente carga, sin deploy.
export const dynamic = 'force-dynamic';

export default async function CotizadorPage() {
  const proyectos = await getProyectos();
  return <CotizadorClient proyectos={proyectos} />;
}
