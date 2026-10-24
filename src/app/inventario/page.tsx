import type { Metadata } from 'next';
import { getInventory, inventoryClient, PLAZA_SLUGS } from '@/lib/inventory';
import type { FormulaInput } from './actions';
import { currentUser, isConfigured } from '@/lib/inventory-auth';
import { formatDate } from '@/lib/pricelist/PriceListPdf';
import LoginForm from './LoginForm';
import InventoryTable from './InventoryTable';
import { logout } from './actions';

export const metadata: Metadata = { title: 'Inventario · Quattro Plaza Center', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function InventarioPage() {
  if (!isConfigured()) {
    return (
      <Shell>
        <p className="text-white/70">El panel no está configurado: falta la variable <code className="text-[#FAB413]">INVENTARIO_PASSWORD</code> en Vercel.</p>
      </Shell>
    );
  }
  const user = await currentUser();
  if (!user) return <Shell><LoginForm /></Shell>;

  const [plazas, log, formulaDocs] = await Promise.all([
    getInventory(),
    inventoryClient.fetch<{ _id: string; at: string; by: string; plazaSlug: string; code: string; summary: string }[]>(
      `*[_type == "inventoryLog"] | order(at desc)[0...25]{ _id, at, by, plazaSlug, code, summary }`, {}, { cache: 'no-store' },
    ),
    // Todas las fórmulas (activas e inactivas) para editarlas; getInventory
    // solo trae las activas porque es lo que usa el PDF.
    inventoryClient.fetch<{ slug: string; formulas: any[] | null; note: string | null }[]>(
      `*[_type == "plaza" && slug.current in $slugs]{ "slug": slug.current, "formulas": priceListFormulas, "note": priceListFormulasNote }`,
      { slugs: PLAZA_SLUGS }, { cache: 'no-store' },
    ),
  ]);
  const formulasOf = (slug: string): FormulaInput[] =>
    (formulaDocs.find((d) => d.slug === slug)?.formulas ?? []).map((f: any) => ({
      key: f._key,
      title: f.title ?? '',
      active: f.active !== false,
      showFinancing: f.showFinancing ?? (f.rows ?? []).some((r: any) => (r.financiamiento ?? 0) > 0),
      rows: (f.rows ?? []).map((r: any) => ({
        enganche: r.enganche ?? 0, mensualidades: r.mensualidades ?? 0, entrega: r.entrega ?? 0,
        financiamiento: r.financiamiento ?? 0, descuento: r.descuento ?? 0,
      })),
    }));

  return (
    <Shell wide>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#FAB413]">Quattro Plaza Center</p>
          <h1 className="mt-1 text-[28px] font-semibold tracking-tight">Inventario</h1>
          <p className="mt-1 text-[13px] text-white/50">
            Un cambio aquí actualiza el cotizador, las listas de precios en PDF y las fichas de quattroplaza.mx y tresor.mx.
          </p>
        </div>
        <form action={logout} className="flex items-center gap-3 text-[12px] text-white/60">
          <span>Hola, <strong className="text-white">{user}</strong></span>
          <button className="rounded-full border border-white/15 px-3 py-1.5 hover:border-white/40">Salir</button>
        </form>
      </div>

      <InventoryTable
        plazas={plazas.map((p) => ({
          slug: p.slug, name: p.shortName, updated: formatDate(p.updatedAt), units: p.units,
          formulas: formulasOf(p.slug), formulasNote: formulaDocs.find((d) => d.slug === p.slug)?.note ?? '',
        }))}
      />

      <section className="mt-12">
        <h2 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-[#FAB413]">Últimos cambios</h2>
        {log.length === 0 ? (
          <p className="text-[13px] text-white/40">Todavía no hay cambios registrados.</p>
        ) : (
          <ul className="divide-y divide-white/5 rounded-2xl border border-white/10">
            {log.map((l) => (
              <li key={l._id} className="flex flex-wrap gap-x-4 gap-y-1 px-4 py-2.5 text-[12.5px]">
                <span className="w-36 shrink-0 text-white/40">{new Date(l.at).toLocaleString('es-MX', { timeZone: 'America/Cancun', dateStyle: 'short', timeStyle: 'short' })}</span>
                <span className="w-28 shrink-0 text-white/70">{l.by}</span>
                <span className="w-32 shrink-0 font-semibold">{l.plazaSlug === 'gardens' ? 'Gardens' : 'Long Island'} {l.code}</span>
                <span className="text-white/70">{l.summary}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </Shell>
  );
}

function Shell({ children, wide }: { children: React.ReactNode; wide?: boolean }) {
  return <main className={`mx-auto px-5 py-10 ${wide ? 'max-w-6xl' : 'max-w-sm pt-24'}`}>{children}</main>;
}
