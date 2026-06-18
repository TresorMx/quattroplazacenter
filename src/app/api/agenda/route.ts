import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { Resend } from 'resend';
import { sendLeadToGHL, plazaToDesarrollo } from '@/lib/ghl';
import { saveLeadToSanity } from '@/lib/sanity/saveLead';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PLAZA_LABELS: Record<string, string> = {
  'long-island': 'Long Island',
  'gardens': 'Gardens',
  'ambos': 'Long Island + Gardens',
};

const MODE_LABELS: Record<string, string> = {
  presencial: 'Visita presencial',
  zoom: 'Videollamada Zoom',
};

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('es-MX', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

function formatTime(t: string) {
  const [h] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  return `${h > 12 ? h - 12 : h}:00 ${period}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, plaza, mode, date, time } = body;

    if (!firstName || !lastName || !email || !phone || !plaza || !mode || !date || !time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const id = `AGD-${randomUUID().split('-')[0].toUpperCase()}`;

    // 1) Guardar en Sanity
    await saveLeadToSanity({
      source: 'agenda',
      fullName: `${firstName} ${lastName}`,
      email,
      phone,
      plazaSlug: plaza,
      message: `${MODE_LABELS[mode] ?? mode} · ${formatDate(date)} ${formatTime(time)}`,
    });

    // 2) Enviar a GHL
    await sendLeadToGHL({
      firstName,
      lastName,
      email,
      phone,
      source: 'agenda',
      tags: ['Ads Quattro', 'Cita Quattro'],
      customFields: {
        'desarrollo_de_inters': plazaToDesarrollo(plaza),
        'fuente_de_contacto': 'digital',
        'observaciones': `Visita agendada · ${PLAZA_LABELS[plaza] ?? plaza} · ${MODE_LABELS[mode] ?? mode} · ${formatDate(date)} ${formatTime(time)}`,
      },
      notes: `Visita agendada · ${PLAZA_LABELS[plaza] ?? plaza} · ${MODE_LABELS[mode] ?? mode} · ${formatDate(date)} ${formatTime(time)}`,
    });

    // 2) Email de notificación interna
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL ?? 'hello@tresor.mx',
          to: process.env.LEADS_EMAIL_TO ?? 'david.baena@gmail.com',
          subject: `📅 Nueva visita agendada · ${PLAZA_LABELS[plaza] ?? plaza} · ${firstName} ${lastName}`,
          html: agendaEmailHTML({ id, firstName, lastName, email, phone, plaza, mode, date, time }),
        });
      } catch (e) {
        console.error('[Resend] agenda error', e);
      }
    }

    console.log('[Agenda] Booked:', { id, firstName, lastName, email, plaza, mode, date, time });

    return NextResponse.json({ id, success: true });
  } catch (err) {
    console.error('[Agenda] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function agendaEmailHTML({
  id, firstName, lastName, email, phone, plaza, mode, date, time,
}: {
  id: string; firstName: string; lastName: string; email: string; phone: string;
  plaza: string; mode: string; date: string; time: string;
}) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 540px; margin: 0 auto; color: #0E0E0E;">
      <div style="border-bottom: 2px solid #FAB413; padding-bottom: 12px; margin-bottom: 24px;">
        <h2 style="margin: 0; font-size: 22px;">📅 Nueva visita agendada</h2>
        <div style="color: #6B6863; font-size: 13px; margin-top: 4px;">${id}</div>
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr><td style="padding: 8px 0; color: #6B6863;">Proyecto</td><td style="text-align: right; font-weight: 600;">${PLAZA_LABELS[plaza] ?? plaza}</td></tr>
        <tr><td style="padding: 8px 0; color: #6B6863;">Modalidad</td><td style="text-align: right; font-weight: 600;">${MODE_LABELS[mode] ?? mode}</td></tr>
        <tr><td style="padding: 8px 0; color: #6B6863;">Fecha</td><td style="text-align: right; font-weight: 600;">${formatDate(date)}</td></tr>
        <tr><td style="padding: 8px 0; color: #6B6863;">Hora</td><td style="text-align: right; font-weight: 600;">${formatTime(time)}</td></tr>
        <tr style="border-top: 1px solid #EEEAE1;">
          <td style="padding: 12px 0 8px; color: #6B6863;">Nombre</td>
          <td style="text-align: right; font-weight: 600;">${firstName} ${lastName}</td>
        </tr>
        <tr><td style="padding: 8px 0; color: #6B6863;">Email</td><td style="text-align: right;"><a href="mailto:${email}">${email}</a></td></tr>
        <tr><td style="padding: 8px 0; color: #6B6863;">Teléfono</td><td style="text-align: right;"><a href="tel:${phone}">${phone}</a></td></tr>
      </table>
    </div>
  `;
}
