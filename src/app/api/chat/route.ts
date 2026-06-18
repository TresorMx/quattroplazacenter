import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getPlazasAsync } from '@/lib/data';
import { sendLeadToGHL } from '@/lib/ghl';
import { saveLeadToSanity } from '@/lib/sanity/saveLead';
import type { Plaza } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ─── System prompt dinámico — se construye con datos reales de Sanity ─────────

function buildSystemPrompt(plazas: Plaza[]): string {
  const active = plazas.filter((p) => !p.comingSoon);
  const coming = plazas.filter((p) => p.comingSoon);

  const activeStr = active
    .map((p) => {
      const prices = p.units?.filter((u) => u.price && u.status === 'disponible').map((u) => u.price!) ?? [];
      const minPrice = prices.length ? Math.min(...prices) : null;
      return `- ${p.name} (slug: ${p.slug}): ${p.status}, entrega ${p.deliveryWindow ?? 'TBD'}, ${p.availableUnits ?? 0} locales disponibles${minPrice ? `, desde $${minPrice.toLocaleString('es-MX')} MXN` : ''}`;
    })
    .join('\n');

  const comingStr = coming.map((p) => `- ${p.name}: próximamente`).join('\n');

  return `Eres Luis, asesor virtual de Quattro Plaza. Vendes locales comerciales premium en Cancún de Tresor Real Estate.

OBJETIVO: Capturar nombre + teléfono y llevar al prospecto a cotizar o agendar visita.

ESTILO — MUY IMPORTANTE:
- Máximo 2 oraciones por respuesta. Sin listas, sin bullets, sin emojis excesivos.
- Tono como asesor real por WhatsApp: directo, cálido, sin rodeos.
- Español mexicano por defecto; inglés si el cliente escribe en inglés.
- Nunca repitas lo que el cliente ya dijo.

PROYECTOS ACTIVOS (datos en vivo — si no aparece aquí no existe):
${activeStr || '- Sin proyectos activos en este momento'}

PRÓXIMAMENTE:
${comingStr || '- Sin proyectos próximos'}

FLUJO IDEAL — SIGUE ESTE ORDEN SIN EXCEPCIÓN:
1. En el primer mensaje del cliente, pregunta INMEDIATAMENTE su nombre y teléfono antes de cualquier otra cosa. Ejemplo: "Con gusto te ayudo. ¿Me das tu nombre y teléfono para enviarte la información?"
2. En cuanto tengas nombre + teléfono, usa capture_lead DE INMEDIATO. No esperes más datos.
3. Después de guardar el lead, pregunta qué busca (tamaño, presupuesto, giro comercial).
4. Usar get_availability para mostrar 1-2 opciones concretas que coincidan.
5. Dar link del cotizador con get_quote_link.
6. Si no quiere cotizar: invitar a agendar en /agenda.

CONTACTO DIRECTO (usa cuando el cliente quiere hablar con alguien o cuando cierras conversación):
- WhatsApp: https://wa.me/529984045602
- Email: hello@tresor.mx

REGLAS:
- NUNCA inventes precios, m² ni disponibilidad — usa las tools siempre.
- Si el local o plaza no aparece en las tools, no lo menciones.
- No prometas rentabilidades específicas.
- No des descuentos no oficiales.
- Apartado: $50,000 MXN 100% reembolsable.

MANEJO DE CONVERSACIONES FUERA DE TEMA:
- Si alguien pregunta algo que no tenga que ver con Quattro Plaza, locales comerciales o inversión inmobiliaria, responde UNA vez con algo como: "Solo puedo ayudarte con temas de Quattro Plaza. ¿Te interesa ver locales disponibles o agendar una visita?"
- Si insiste con temas irrelevantes, preguntas absurdas o groserías: cierra con "Cuando quieras información sobre nuestros locales, aquí estaré. También puedes escribirnos directo: https://wa.me/529984045602" y no respondas más al hilo.
- No te prestes a discusiones, juegos, chistes ni conversaciones que no lleven a una venta.`;
}

// ─── Tools ────────────────────────────────────────────────────────────────────

function buildTools(plazas: Plaza[]): Anthropic.Tool[] {
  const activeSlugs = plazas.filter((p) => !p.comingSoon).map((p) => p.slug);
  const allSlugs = plazas.map((p) => p.slug);

  return [
    {
      name: 'get_availability',
      description:
        'Locales disponibles de una plaza con precio y specs. Úsala cuando el cliente pregunte por disponibilidad, precios, tamaño o quiera comparar opciones.',
      input_schema: {
        type: 'object' as const,
        properties: {
          plaza_slug: {
            type: 'string',
            enum: activeSlugs.length ? activeSlugs : [''],
            description: 'Slug de la plaza',
          },
          max_price_mxn: { type: 'number', description: 'Precio máximo en MXN (sin IVA)' },
          min_price_mxn: { type: 'number', description: 'Precio mínimo en MXN (sin IVA)' },
          level: { type: 'number', enum: [1, 2], description: 'Nivel del local' },
          max_area: { type: 'number', description: 'Área máxima en m²' },
          min_area: { type: 'number', description: 'Área mínima en m²' },
        },
        required: ['plaza_slug'],
      },
    },
    {
      name: 'get_plaza_details',
      description:
        'Información general de una plaza: ubicación, entrega, status, resumen de precios. Útil cuando preguntan por un proyecto específico.',
      input_schema: {
        type: 'object' as const,
        properties: {
          plaza_slug: {
            type: 'string',
            enum: allSlugs.length ? allSlugs : [''],
          },
        },
        required: ['plaza_slug'],
      },
    },
    {
      name: 'capture_lead',
      description:
        'Guarda el nombre y teléfono del prospecto en el CRM. Úsala en cuanto tengas nombre + teléfono. No pidas el email si el cliente no lo ofrece.',
      input_schema: {
        type: 'object' as const,
        properties: {
          nombre: { type: 'string' },
          telefono: { type: 'string' },
          plaza_interes: { type: 'string', description: 'slug del proyecto de interés (opcional)' },
          notas: { type: 'string', description: 'Qué busca, presupuesto, giro, etc.' },
        },
        required: ['nombre', 'telefono'],
      },
    },
    {
      name: 'get_quote_link',
      description:
        'Genera el link directo al cotizador. Úsala después de capturar el lead para enviar al cliente a cotizar.',
      input_schema: {
        type: 'object' as const,
        properties: {
          plaza_slug: { type: 'string', enum: activeSlugs.length ? activeSlugs : [''] },
          unit_id: { type: 'string', description: 'ID del local específico (opcional)' },
        },
        required: ['plaza_slug'],
      },
    },
  ];
}

// ─── Tool runner (async para capture_lead) ────────────────────────────────────

async function runTool(name: string, input: any, plazas: Plaza[]): Promise<any> {
  switch (name) {
    case 'get_availability': {
      const plaza = plazas.find((p) => p.slug === input.plaza_slug);
      if (!plaza) return { error: 'plaza not found' };
      let units = (plaza.units ?? []).filter((u) => u.status === 'disponible');
      if (input.max_price_mxn) units = units.filter((u) => u.price && u.price <= input.max_price_mxn);
      if (input.min_price_mxn) units = units.filter((u) => u.price && u.price >= input.min_price_mxn);
      if (input.level) units = units.filter((u) => u.level === input.level);
      if (input.max_area) units = units.filter((u) => {
        const area = Number(u.specs?.areaTotal ?? u.specs?.area ?? u.specs?.m2 ?? u.specs?.metros ?? 0);
        return area > 0 && area <= input.max_area;
      });
      if (input.min_area) units = units.filter((u) => {
        const area = Number(u.specs?.areaTotal ?? u.specs?.area ?? u.specs?.m2 ?? u.specs?.metros ?? 0);
        return area > 0 && area >= input.min_area;
      });
      return {
        plaza: plaza.shortName,
        disponibles: units.length,
        locales: units.slice(0, 8).map((u) => ({
          id: u.id,
          code: u.code,
          nivel: u.level,
          specs: u.specs ?? {},
          precioMXN: u.price,
          entrega: u.delivery,
        })),
      };
    }
    case 'get_plaza_details': {
      const p = plazas.find((pl) => pl.slug === input.plaza_slug);
      if (!p) return { error: 'plaza not found' };
      const prices = (p.units ?? []).filter((u) => u.price && u.status === 'disponible').map((u) => u.price!);
      return {
        slug: p.slug,
        nombre: p.name,
        status: p.status,
        ciudad: p.city,
        entrega: p.deliveryWindow,
        disponibles: p.availableUnits ?? 0,
        precioDesde: prices.length ? Math.min(...prices) : null,
        precioHasta: prices.length ? Math.max(...prices) : null,
        comingSoon: !!p.comingSoon,
      };
    }
    case 'capture_lead': {
      try {
        const [first, ...rest] = (input.nombre as string).trim().split(' ');
        await Promise.all([
          sendLeadToGHL({
            firstName: first || input.nombre,
            lastName: rest.join(' '),
            phone: input.telefono,
            source: 'chat',
            tags: ['Ads Quattro'],
            customFields: { 'fuente_de_contacto': 'digital' },
            notes: input.notas,
          }),
          saveLeadToSanity({
            source: 'chatbot',
            fullName: input.nombre,
            phone: input.telefono,
            message: input.notas,
          }),
        ]);
        return { ok: true, message: 'Lead guardado correctamente' };
      } catch (e) {
        console.error('[capture_lead]', e);
        return { ok: false, message: 'Error guardando lead, continúa la conversación' };
      }
    }
    case 'get_quote_link': {
      const plaza = plazas.find((p) => p.slug === input.plaza_slug);
      if (!plaza) return { error: 'plaza not found' };
      const base = `https://quattroplazacenter.vercel.app/cotizar/${plaza.slug}`;
      const url = input.unit_id ? `${base}?unit=${input.unit_id}` : base;
      return { url, plaza: plaza.shortName };
    }
    default:
      return { error: 'unknown tool' };
  }
}

// ─── POST handler ─────────────────────────────────────────────────────────────

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      message: 'El asesor está temporalmente fuera. Contáctanos por WhatsApp o agenda una visita.',
    });
  }

  let body: { messages: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  // Datos frescos de Sanity para tools + system prompt
  const plazas = await getPlazasAsync();
  const systemPrompt = buildSystemPrompt(plazas);
  const tools = buildTools(plazas);

  const client = new Anthropic({ apiKey });
  const history: Anthropic.MessageParam[] = body.messages
    .filter((m) => m.content?.trim())
    .map((m) => ({ role: m.role, content: m.content }));

  try {
    let response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',  // más rápido y económico para chat
      max_tokens: 280,
      system: systemPrompt,
      tools,
      messages: history,
    });

    // Agentic loop
    let safety = 0;
    while (response.stop_reason === 'tool_use' && safety < 5) {
      safety++;
      const toolUses = response.content.filter((c) => c.type === 'tool_use') as Anthropic.ToolUseBlock[];
      const toolResults: Anthropic.ToolResultBlockParam[] = await Promise.all(
        toolUses.map(async (tu) => ({
          type: 'tool_result' as const,
          tool_use_id: tu.id,
          content: JSON.stringify(await runTool(tu.name, tu.input, plazas)),
        }))
      );

      history.push({ role: 'assistant', content: response.content });
      history.push({ role: 'user', content: toolResults });

      response = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 280,
        system: systemPrompt,
        tools,
        messages: history,
      });
    }

    const text = response.content
      .filter((c) => c.type === 'text')
      .map((c) => (c as Anthropic.TextBlock).text)
      .join('\n')
      .trim();

    return NextResponse.json({ message: text || '¿En qué te puedo ayudar?' });
  } catch (e: any) {
    console.error('[Chat] error', e);
    return NextResponse.json({
      message: 'Tuve un problema. ¿Puedes intentarlo de nuevo?',
    });
  }
}
