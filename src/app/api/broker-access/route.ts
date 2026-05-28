import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { sendLeadToGHL } from '@/lib/ghl';

export const runtime = 'nodejs';

const Schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  brokerage: z.string().optional(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid' }, { status: 400 });

  const { fullName, email, phone, brokerage } = parsed.data;
  const [first, ...rest] = fullName.split(' ');

  // GHL
  await sendLeadToGHL({
    firstName: first,
    lastName: rest.join(' '),
    email,
    phone,
    company: brokerage,
    source: 'broker',
    tags: ['broker-acceso-drive', brokerage ? `inm-${brokerage.toLowerCase().slice(0, 30)}` : 'inm-individual'],
  });

  // Email interno
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? 'hello@tresor.mx',
        to: process.env.LEADS_EMAIL_TO ?? 'david.baena@gmail.com',
        subject: `🔑 Broker accedió al Drive · ${fullName}${brokerage ? ` (${brokerage})` : ''}`,
        html: `
          <div style="font-family: -apple-system, sans-serif; max-width: 480px;">
            <h3 style="border-bottom: 2px solid #FAB413; padding-bottom: 8px;">Nuevo acceso al Drive de Brokers</h3>
            <p><b>${fullName}</b> ${brokerage ? `· ${brokerage}` : ''}</p>
            <p>📧 <a href="mailto:${email}">${email}</a></p>
            <p>📞 <a href="tel:${phone}">${phone}</a></p>
          </div>
        `,
      });
    } catch (e) {
      console.error('[Resend] broker access', e);
    }
  }

  return NextResponse.json({ ok: true });
}
