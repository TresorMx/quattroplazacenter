import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { quoteStore } from '@/lib/leadStore';
import { sendLeadToGHL } from '@/lib/ghl';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) return NextResponse.json({ error: 'Missing signature' }, { status: 400 });

  const stripe = getStripe();
  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (e: any) {
    return NextResponse.json({ error: `Webhook error: ${e.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const quoteId = session.metadata?.quoteId;
    if (quoteId) {
      const quote = quoteStore.get(quoteId);
      if (quote) {
        quote.status = 'reserved';
        quoteStore.set(quoteId, quote);

        // TODO: actualizar el local en Sanity → status: "apartado"
        // sanityClient.patch(unitDoc._id).set({ status: 'apartado' }).commit()

        // Tag en GHL como apartado
        await sendLeadToGHL({
          firstName: quote.contact.fullName.split(' ')[0],
          email: quote.contact.email,
          phone: quote.contact.phone,
          source: 'reservation',
          tags: ['apartado-pagado', quote.computed.plaza.slug, `local-${quote.computed.unit.code}`],
          customFields: { quoteId, stripeSessionId: session.id },
        });

        // Meta Conversions API — Purchase server-side
        const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
        const accessToken = process.env.META_CONVERSIONS_TOKEN;
        if (pixelId && accessToken) {
          try {
            await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                data: [{
                  event_name: 'Purchase',
                  event_time: Math.floor(Date.now() / 1000),
                  action_source: 'website',
                  user_data: {
                    em: [quote.contact.email],
                    ph: [quote.contact.phone],
                  },
                  custom_data: {
                    value: session.amount_total ? session.amount_total / 100 : 0,
                    currency: 'MXN',
                    content_ids: [quote.computed.unit.id],
                    content_name: `${quote.computed.plaza.name} · Local ${quote.computed.unit.code}`,
                  },
                }],
                access_token: accessToken,
              }),
            });
          } catch (e) {
            console.error('[Meta CAPI] Purchase error', e);
          }
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
