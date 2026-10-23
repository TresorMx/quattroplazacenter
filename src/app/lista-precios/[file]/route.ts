import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { getInventory } from '@/lib/inventory';
import { PriceListPdf, registerFonts } from '@/lib/pricelist/PriceListPdf';

// /lista-precios/gardens.pdf y /lista-precios/long-island.pdf — liga fija
// que siempre entrega la versión vigente (se genera en cada descarga desde
// Sanity). Esta es la liga que va en el campo "Lista de precios" de la plaza
// en Sanity, así el portal de asesores de tresor.mx baja la misma.
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const NAMES: Record<string, string> = { gardens: 'Quattro Gardens', 'long-island': 'Quattro Long Island' };

export async function GET(req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const slug = file.replace(/\.pdf$/i, '');
  if (!NAMES[slug]) return new Response('Lista no encontrada', { status: 404 });

  const plaza = (await getInventory()).find((p) => p.slug === slug);
  if (!plaza) return new Response('Lista no encontrada', { status: 404 });

  const origin = new URL(req.url).origin;
  registerFonts(origin);
  const pdf = await renderToBuffer(React.createElement(PriceListPdf, { plaza, origin }) as any);

  return new Response(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${NAMES[slug]} - Lista de Precios.pdf"`,
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
    },
  });
}
