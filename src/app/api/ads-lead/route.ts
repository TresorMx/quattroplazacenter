import { NextRequest, NextResponse } from 'next/server';
import { sendLeadToGHL, plazaToDesarrollo } from '@/lib/ghl';
import { saveLeadToSanity } from '@/lib/sanity/saveLead';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, uso, variant } = body as {
      firstName: string;
      lastName?: string;
      email?: string;
      phone: string;
      uso?: string;
      variant: 'brochure' | 'asesoria' | 'gardens-c' | 'seo-locales-cancun';
    };

    if (!firstName || !phone) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    // Send to GHL + Sanity en paralelo
    const [ghlRes] = await Promise.all([
      sendLeadToGHL({
      firstName,
      lastName: lastName ?? '',
      ...(email ? { email } : {}),
      phone,
      source: 'agenda',
      tags: variant === 'seo-locales-cancun' ? ['SEO Quattro'] : ['Ads Quattro'],
      customFields: {
        'desarrollo_de_inters': plazaToDesarrollo(variant === 'seo-locales-cancun' ? (uso === 'long-island' ? 'long-island' : 'gardens') : 'gardens'),
        'fuente_de_contacto': 'digital',
      },
        notes: variant === 'seo-locales-cancun'
          ? `SEO Locales Cancún — Plaza: ${uso} | Página: /locales-comerciales-cancun`
          : `Ads Landing Gardens — Variant: ${variant} | Uso: ${uso}`,
      }),
      saveLeadToSanity({
        source: 'form',
        fullName: `${firstName} ${lastName ?? ''}`.trim(),
        ...(email ? { email } : {}),
        phone,
        plazaSlug: 'gardens',
        message: `Variant: ${variant} | Uso: ${uso ?? 'visita'}`,
      }),
    ]);

    // Notification email to team (only if Resend key is configured)
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
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
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[ads-lead]', e);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
