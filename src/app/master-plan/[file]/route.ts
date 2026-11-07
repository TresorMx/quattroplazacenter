import { PDFDocument, rgb } from 'pdf-lib';
import { getInventory, type PlazaSlug } from '@/lib/inventory';
import { MASTER_PLAN_PINS, PIN_COLORS, PIN_RADIUS } from '@/lib/masterplan/pins';

// /master-plan/gardens.pdf y /master-plan/long-island.pdf — liga fija que siempre
// entrega el estatus vigente: se pintan las bolitas sobre la base en cada descarga.
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const NAMES: Record<PlazaSlug, string> = { gardens: 'Quattro Gardens', 'long-island': 'Quattro Long Island' };
const bases = new Map<PlazaSlug, ArrayBuffer>();

async function loadBase(slug: PlazaSlug, origin: string) {
  const cached = bases.get(slug);
  if (cached) return cached;
  const res = await fetch(`${origin}/master-plan-base/${slug}.pdf`);
  if (!res.ok) throw new Error(`Base del master plan no disponible: ${res.status}`);
  const bytes = await res.arrayBuffer();
  bases.set(slug, bytes);
  return bytes;
}

export async function GET(req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const slug = file.replace(/\.pdf$/i, '') as PlazaSlug;
  if (!NAMES[slug]) return new Response('Master plan no encontrado', { status: 404 });

  const plaza = (await getInventory()).find((p) => p.slug === slug);
  if (!plaza) return new Response('Master plan no encontrado', { status: 404 });

  const pdf = await PDFDocument.load(await loadBase(slug, new URL(req.url).origin));
  const pages = pdf.getPages();
  for (const unit of plaza.units) {
    const pin = MASTER_PLAN_PINS[slug][unit.code];
    const color = PIN_COLORS[slug][unit.status];
    const page = pages[unit.level - 1];
    if (!pin || !color || !page) continue;
    page.drawCircle({
      x: pin[0],
      y: pin[1],
      size: PIN_RADIUS,
      color: rgb(color[0] / 255, color[1] / 255, color[2] / 255),
    });
  }
  pdf.setTitle(`${NAMES[slug]} | Master Plan`);

  return new Response(new Uint8Array(await pdf.save()), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${NAMES[slug]} - Master Plan.pdf"`,
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
    },
  });
}
