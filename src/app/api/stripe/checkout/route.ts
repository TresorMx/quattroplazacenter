import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getStripe, RESERVATION_AMOUNT_MXN } from '@/lib/stripe';
import { quoteStore } from '@/lib/leadStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const Schema = z.object({ quoteId: z.string() });

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const quote = quoteStore.get(parsed.data.quoteId);
  if (!quote) return NextResponse.json({ error: 'Quote not found' }, { status: 404 });

  try {
    const stripe = getStripe();
    const origin = req.headers.get('origin') ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://quattroplaza.mx';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card', 'oxxo'],
      customer_email: quote.contact.email,
      currency: 'mxn',
      line_items: [
        {
          price_data: {
            currency: 'mxn',
            unit_amount: RESERVATION_AMOUNT_MXN * 100, // centavos
            product_data: {
              name: `Apartado · ${quote.computed.plaza.shortName} Local ${quote.computed.unit.code}`,
              description: `Cotización ${quote.quoteId}. Apartado reembolsable.`,
              images: quote.computed.plaza.heroRender
                ? [`${process.env.NEXT_PUBLIC_SITE_URL ?? origin}${quote.computed.plaza.heroRender}`]
                : undefined,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        quoteId: quote.quoteId,
        plazaSlug: quote.computed.plaza.slug,
        unitId: quote.computed.unit.id,
        contactEmail: quote.contact.email,
      },
      success_url: `${origin}/gracias?id=${quote.quoteId}&reserved=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/gracias?id=${quote.quoteId}`,
      locale: 'es-419',
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    console.error('[Stripe checkout] error', e);
    return NextResponse.json({ error: e.message ?? 'Stripe error' }, { status: 500 });
  }
}
