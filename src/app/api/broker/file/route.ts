import { NextResponse } from 'next/server';

/**
 * Resuelve la ruta del archivo en función de plaza + doc.
 * Cuando Sanity esté configurado, este endpoint hará fetch del asset y servirá
 * la URL firmada. Por ahora redirige a archivos estáticos en /public/broker/.
 */

const FILE_MAP: Record<string, Record<string, string>> = {
  'long-island': {
    presentation: '/broker/long-island/presentacion.pdf',
    priceList:    '/broker/long-island/lista-precios.pdf',
    masterPlan:   '/broker/long-island/master-plan.pdf',
    bankAccounts: '/broker/long-island/datos-bancarios.pdf',
    location:     '/broker/long-island/ubicacion.jpg',
    marketing:    '/broker/long-island/marketing.zip',
    developer:    '/broker/long-island/desarrollador.pdf',
    renders:      '/broker/long-island/renders.zip',
    receiptPay:      '/broker/long-island/recibo-de-pago.docx',
    receiptReserve:  '/broker/long-island/recibo-de-reserva.docx',
    checklist:       '/broker/long-island/check-list.docx',
    offerLetter:     '/broker/long-island/carta-oferta.docx',
  },
  gardens: {
    presentation:  '/broker/gardens/presentacion.pdf',
    priceList:     '/broker/gardens/lista-precios.pdf',
    masterPlan:    '/broker/gardens/master-plan.pdf',
    bankAccounts:  '/broker/gardens/datos-bancarios.pdf',
    location:      '/broker/gardens/ubicacion.pdf',
    marketing:     '/broker/gardens/marketing.zip',
    developer:     '/broker/gardens/desarrollador.pdf',
    renders:       '/broker/gardens/renders.zip',
    receiptPay:     '/broker/gardens/recibo-de-pago.docx',
    receiptReserve: '/broker/gardens/recibo-de-reserva.docx',
    checklist:      '/broker/gardens/check-list.docx',
    offerLetter:    '/broker/gardens/carta-oferta.docx',
  },
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const plaza = searchParams.get('plaza') ?? '';
  const doc = searchParams.get('doc') ?? '';

  const url = FILE_MAP[plaza]?.[doc];
  if (!url) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.redirect(new URL(url, req.url), 302);
}
