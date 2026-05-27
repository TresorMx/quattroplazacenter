import { NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import { quoteStore } from '@/lib/leadStore';
import { QuotePDF } from '@/lib/pdf/QuotePDF';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const stored = quoteStore.get(id);
  if (!stored) return NextResponse.json({ error: 'Quote not found' }, { status: 404 });

  const stream = await renderToStream(
    <QuotePDF
      quoteId={stored.quoteId}
      quote={stored.computed}
      contact={stored.contact}
      siteUrl={process.env.NEXT_PUBLIC_SITE_URL}
    />,
  );

  return new NextResponse(stream as unknown as ReadableStream, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="Cotizacion-${id}.pdf"`,
      'Cache-Control': 'private, no-cache, no-store, must-revalidate',
    },
  });
}
