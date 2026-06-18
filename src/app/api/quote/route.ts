import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { getPlazaBySlugAsync } from '@/lib/data';
import { saveLeadToSanity } from '@/lib/sanity/saveLead';
import { computeQuote, type QuoteCalc } from '@/lib/quote';
import { quoteStore } from '@/lib/leadStore';
import { sendLeadToGHL, plazaToDesarrollo } from '@/lib/ghl';
import { getAvailablePlans } from '@/lib/quote';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PayloadSchema = z.object({
  quoteId: z.string(),
  plazaSlug: z.string(),
  unitId: z.string(),
  planCode: z.string(),
  monthlyTerm: z.number().int().min(0).max(48),
  contact: z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(7),
    company: z.string().optional(),
    isBroker: z.boolean().optional(),
    brokerage: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = PayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', issues: parsed.error.issues }, { status: 400 });
  }

  const { quoteId, plazaSlug, unitId, planCode, monthlyTerm, contact } = parsed.data;

  const plaza = await getPlazaBySlugAsync(plazaSlug);
  const unit = plaza?.units?.find((u) => u.id === unitId);
  if (!plaza || !unit) {
    return NextResponse.json({ error: 'Plaza or unit not found' }, { status: 404 });
  }
  const plan = getAvailablePlans(plaza).find((p) => p.code === planCode);
  if (!plan) return NextResponse.json({ error: 'Plan not found' }, { status: 404 });

  let computed: QuoteCalc;
  try {
    computed = computeQuote({ plaza, unit, plan, monthlyTerm });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 400 });
  }

  // Persistir (in-memory; reemplazar por Sanity en producción)
  quoteStore.set(quoteId, {
    quoteId,
    createdAt: new Date().toISOString(),
    contact,
    computed,
    status: 'generated',
  });

  // 1) Guardar en Sanity
  await saveLeadToSanity({
    source: 'cotizacion',
    fullName: contact.fullName,
    email: contact.email,
    phone: contact.phone,
    company: contact.company,
    isBroker: contact.isBroker,
    brokerage: contact.brokerage,
    plazaSlug: plaza.slug,
    unitCode: unit.code,
    message: `Plan ${plan.code} · Total $${Math.round(computed.total).toLocaleString('es-MX')} MXN`,
  });

  // 2) Enviar a GHL (no bloquea si no hay keys)
  const [first, ...rest] = contact.fullName.trim().split(' ');
  await sendLeadToGHL({
    firstName: first || contact.fullName,
    lastName: rest.join(' '),
    email: contact.email,
    phone: contact.phone,
    company: contact.company,
    source: 'quote',
    tags: ['Ads Quattro'],
    customFields: {
      'desarrollo_de_inters': plazaToDesarrollo(plaza.slug),
      'fuente_de_contacto': 'digital',
      'observaciones': `Cotización · ${plaza.name} · Local ${unit.code} · Plan ${plan.code} · Total $${Math.round(computed.total).toLocaleString('es-MX')} MXN`,
    },
    notes: contact.notes,
  });

  // 2) Email interno (si hay Resend)
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? 'hello@tresor.mx',
        to: process.env.LEADS_EMAIL_TO ?? 'david.baena@gmail.com',
        subject: `🔥 Nueva cotización · ${plaza.shortName} Local ${unit.code} · ${contact.fullName}`,
        html: leadEmailHTML({ quoteId, plaza: plaza.name, unit: unit.code, contact, total: computed.total }),
      });
    } catch (e) {
      console.error('[Resend] error', e);
    }
  }

  return NextResponse.json({ ok: true, quoteId });
}

function leadEmailHTML({
  quoteId,
  plaza,
  unit,
  contact,
  total,
}: {
  quoteId: string;
  plaza: string;
  unit: string;
  contact: { fullName: string; email: string; phone: string; company?: string; isBroker?: boolean; brokerage?: string; notes?: string };
  total: number;
}) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 540px; margin: 0 auto; color: #0E0E0E;">
      <div style="border-bottom: 2px solid #FAB413; padding-bottom: 12px; margin-bottom: 24px;">
        <h2 style="margin: 0; font-size: 22px;">Nueva cotización generada</h2>
        <div style="color: #6B6863; font-size: 13px; margin-top: 4px;">${quoteId}</div>
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr><td style="padding: 8px 0; color: #6B6863;">Plaza</td><td style="text-align: right; font-weight: 600;">${plaza}</td></tr>
        <tr><td style="padding: 8px 0; color: #6B6863;">Local</td><td style="text-align: right; font-weight: 600;">${unit}</td></tr>
        <tr><td style="padding: 8px 0; color: #6B6863;">Total</td><td style="text-align: right; font-weight: 600;">$${total.toLocaleString('es-MX')} MXN</td></tr>
        <tr style="border-top: 1px solid #EEEAE1;"><td style="padding: 12px 0 8px; color: #6B6863;">Cliente</td><td style="text-align: right; font-weight: 600;">${contact.fullName}</td></tr>
        <tr><td style="padding: 8px 0; color: #6B6863;">Email</td><td style="text-align: right;"><a href="mailto:${contact.email}">${contact.email}</a></td></tr>
        <tr><td style="padding: 8px 0; color: #6B6863;">Teléfono</td><td style="text-align: right;"><a href="tel:${contact.phone}">${contact.phone}</a></td></tr>
        ${contact.company ? `<tr><td style="padding: 8px 0; color: #6B6863;">Empresa</td><td style="text-align: right;">${contact.company}</td></tr>` : ''}
        ${contact.isBroker ? `<tr><td style="padding: 8px 0; color: #6B6863;">Broker</td><td style="text-align: right;">${contact.brokerage ?? 'Sí'}</td></tr>` : ''}
        ${contact.notes ? `<tr><td style="padding: 8px 0; color: #6B6863;" colspan="2">Notas: ${contact.notes}</td></tr>` : ''}
      </table>
    </div>
  `;
}
