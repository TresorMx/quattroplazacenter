import { NextRequest, NextResponse } from 'next/server';
import { sendLeadToGHL } from '@/lib/ghl';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, uso, variant } = body as {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      uso: string;
      variant: 'brochure' | 'asesoria';
    };

    if (!firstName || !email || !phone) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const tags = ['ads', 'gardens', `ads-gardens`, variant === 'brochure' ? 'brochure' : 'asesoria'];

    // Send to GHL
    const ghlRes = await sendLeadToGHL({
      firstName,
      lastName,
      email,
      phone,
      source: 'agenda',
      tags,
      customFields: { uso: uso ?? '' },
      notes: `Ads Landing — Variant: ${variant} | Uso: ${uso}`,
    });

    // Notification email to team
    try {
      await resend.emails.send({
        from: 'Quattro Plaza <hello@tresor.mx>',
        to: ['hello@tresor.mx'],
        subject: `🏬 Nuevo lead Ads Gardens — ${firstName} ${lastName}`,
        html: `
          <p><strong>Nombre:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Teléfono:</strong> ${phone}</p>
          <p><strong>Uso:</strong> ${uso}</p>
          <p><strong>Variante:</strong> ${variant}</p>
          <p><strong>GHL:</strong> ${ghlRes.ok ? `✅ ${ghlRes.contactId ?? ''}` : `❌ ${ghlRes.error}`}</p>
        `,
      });
    } catch (emailErr) {
      console.error('[ads-lead] email error', emailErr);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[ads-lead]', e);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
