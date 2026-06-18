import { NextResponse } from 'next/server';
import { sendLeadToGHL } from '@/lib/ghl';
import { saveLeadToSanity } from '@/lib/sanity/saveLead';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function addGHLNote(contactId: string, body: string) {
  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!apiKey || !locationId || !contactId) return;

  await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/notes`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Version: '2021-07-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ body, userId: locationId }),
  });
}

export async function POST(req: Request) {
  try {
    const { referrerName, referrerPhone, advisorName, referidoFirstName, referidoLastName, referidoPhone } =
      await req.json();

    if (!referidoFirstName || !referidoPhone || !referrerName || !referrerPhone) {
      return NextResponse.json({ ok: false, error: 'missing fields' }, { status: 400 });
    }

    const observaciones = `Referido por: ${referrerName} (${referrerPhone})${advisorName ? ` | Asesor: ${advisorName}` : ''}`;

    const [ghlResult] = await Promise.all([
      sendLeadToGHL({
        firstName: referidoFirstName,
        lastName: referidoLastName ?? '',
        phone: referidoPhone,
        source: 'agenda',
        tags: ['Referidos Quattro'],
        customFields: { observaciones },
      }),
      saveLeadToSanity({
        source: 'rewards',
        fullName: `${referidoFirstName} ${referidoLastName ?? ''}`.trim(),
        phone: referidoPhone,
        message: observaciones,
      }),
    ]);

    if (ghlResult.contactId) {
      await addGHLNote(ghlResult.contactId, observaciones);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[rewards]', e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
