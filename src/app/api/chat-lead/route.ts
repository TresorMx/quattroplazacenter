import { NextResponse } from 'next/server';
import { sendLeadToGHL } from '@/lib/ghl';
import { saveLeadToSanity } from '@/lib/sanity/saveLead';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { fullName, phone } = await req.json();
    if (!fullName || !phone) return NextResponse.json({ ok: false }, { status: 400 });

    const [first, ...rest] = fullName.trim().split(' ');
    await Promise.all([
      sendLeadToGHL({
        firstName: first || fullName,
        lastName: rest.join(' '),
        phone,
        source: 'chat',
        tags: ['Ads Quattro', 'Chatbot'],
        customFields: { 'fuente_de_contacto': 'digital' },
      }),
      saveLeadToSanity({
        source: 'chatbot',
        fullName,
        phone,
        message: 'Captado desde formulario inicial del chatbot',
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[chat-lead]', e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
