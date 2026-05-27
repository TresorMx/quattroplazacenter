import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getAllPlazas, getPlazaBySlug, getAvailableUnits, getMinAvailablePrice } from '@/lib/data';
import type { Plaza } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SYSTEM_PROMPT = `Eres el Asesor Virtual de Quattro Plaza Center, un desarrollo de plazas comerciales premium en Cancún de Tresor Real Estate.

Tu misión es ayudar a clientes interesados (inversionistas, emprendedores, brokers) a entender el proyecto, ver disponibilidad real, recomendar locales según sus necesidades, y guiarlos a cotizar o agendar visita.

ESTILO:
- Tono cálido y profesional. Habla en español mexicano por defecto, cambia a inglés si el usuario escribe en inglés.
- Respuestas concisas (3-5 oraciones). NO uses bullets ni listas largas, prefiere prosa natural.
- Si el cliente pide datos específicos (precios, disponibilidad), usa SIEMPRE la tool 'get_availability' o 'get_plaza_details' — no inventes números.
- Cuando recomiendes locales, sugiere 1-2 opciones concretas con código de local, m² y precio.
- Para apartar o cotizar, dirige al cliente a /cotizar/[slug del proyecto].
- Para agendar visita, sugiere "agenda una visita desde el header" o usa el WhatsApp.

QUÉ SABES:
- Plazas activas: Long Island (preventa, entrega DIC 2026—MAR 2027), Gardens (lanzamiento, entrega JUN—SEP 2027).
- Coming soon: Tulum, Marina, Huayacán.
- Cada local tiene precio + IVA, esquemas de pago con enganche/mensualidades/contra entrega y descuentos del 1% al 7.5%.
- Apartado: $50,000 MXN, 100% reembolsable.
- Desarrollador: Tresor Real Estate, +25 años, +25 proyectos.

QUÉ NO HACES:
- No prometes rentabilidades específicas sin contexto.
- No negocias precios ni das descuentos no oficiales.
- Si el cliente pide algo fuera de Quattro (mercado, otras plazas), redirígelo amablemente.`;

const TOOLS: Anthropic.Tool[] = [
  {
    name: 'get_availability',
    description: 'Devuelve los locales disponibles de una plaza con precio y specs (campos definidos por plaza: área total, frente, fondo, etc.). Usa esta tool cuando el cliente pregunte por disponibilidad, precios, o quiera comparar opciones.',
    input_schema: {
      type: 'object',
      properties: {
        plaza_slug: { type: 'string', enum: ['long-island', 'gardens'], description: 'Slug de la plaza' },
        max_price_mxn: { type: 'number', description: 'Filtro opcional de precio máximo en MXN (sin IVA)' },
        level: { type: 'number', enum: [1, 2], description: 'Filtro opcional por nivel' },
      },
      required: ['plaza_slug'],
    },
  },
  {
    name: 'get_plaza_details',
    description: 'Devuelve información general de una plaza: ubicación, ventana de entrega, status, totales y rango de precios. Usa esta tool cuando el cliente pregunte por una plaza en general.',
    input_schema: {
      type: 'object',
      properties: {
        plaza_slug: { type: 'string', enum: ['long-island', 'gardens', 'tulum', 'marina', 'huayacan'] },
      },
      required: ['plaza_slug'],
    },
  },
  {
    name: 'list_all_plazas',
    description: 'Lista todas las plazas (activas y coming soon) con nombre y status. Útil cuando el cliente pregunte qué tienen disponible o cuántos proyectos hay.',
    input_schema: { type: 'object', properties: {} },
  },
];

function runTool(name: string, input: any): any {
  switch (name) {
    case 'get_availability': {
      const plaza = getPlazaBySlug(input.plaza_slug);
      if (!plaza) return { error: 'plaza not found' };
      let units = getAvailableUnits(plaza.slug);
      if (input.max_price_mxn) units = units.filter((u) => u.price && u.price <= input.max_price_mxn);
      if (input.level) units = units.filter((u) => u.level === input.level);
      return {
        plaza: plaza.shortName,
        count: units.length,
        units: units.map((u) => ({
          code: u.code,
          level: u.level,
          // Specs dinámicas (área total, frente, fondo, lo que la plaza defina)
          specs: u.specs ?? {},
          priceMXN: u.price,
          deliveryWindow: u.delivery,
        })),
      };
    }
    case 'get_plaza_details': {
      const p = getPlazaBySlug(input.plaza_slug);
      if (!p) return { error: 'plaza not found' };
      return summarizePlaza(p);
    }
    case 'list_all_plazas': {
      return { plazas: getAllPlazas().map(summarizePlaza) };
    }
  }
  return { error: 'unknown tool' };
}

function summarizePlaza(p: Plaza) {
  return {
    slug: p.slug,
    name: p.shortName,
    status: p.status,
    city: p.city,
    deliveryWindow: p.deliveryWindow,
    available: p.availableUnits ?? 0,
    fromPriceMXN: getMinAvailablePrice(p),
    isComingSoon: !!p.comingSoon,
  };
}

interface ChatMessage { role: 'user' | 'assistant'; content: string }

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      message: 'El asesor virtual está temporalmente desconectado. Mientras tanto puedes contactarnos por WhatsApp o agendar una visita desde el menú superior.',
    });
  }

  let body: { messages: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });
  const history: Anthropic.MessageParam[] = body.messages
    .filter((m) => m.content?.trim())
    .map((m) => ({ role: m.role, content: m.content }));

  try {
    let response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 600,
      system: SYSTEM_PROMPT,
      tools: TOOLS,
      messages: history,
    });

    // Agentic loop para tool use
    let safety = 0;
    while (response.stop_reason === 'tool_use' && safety < 5) {
      safety++;
      const toolUses = response.content.filter((c) => c.type === 'tool_use') as Anthropic.ToolUseBlock[];
      const toolResults: Anthropic.ToolResultBlockParam[] = toolUses.map((tu) => ({
        type: 'tool_result',
        tool_use_id: tu.id,
        content: JSON.stringify(runTool(tu.name, tu.input)),
      }));

      history.push({ role: 'assistant', content: response.content });
      history.push({ role: 'user', content: toolResults });

      response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 600,
        system: SYSTEM_PROMPT,
        tools: TOOLS,
        messages: history,
      });
    }

    const text = response.content
      .filter((c) => c.type === 'text')
      .map((c) => (c as Anthropic.TextBlock).text)
      .join('\n')
      .trim();

    return NextResponse.json({ message: text || 'Cuéntame más, ¿en qué te puedo ayudar?' });
  } catch (e: any) {
    console.error('[Chat] error', e);
    return NextResponse.json({
      message: 'Tuve un problema técnico. ¿Puedes intentarlo de nuevo? Si urge, escríbenos por WhatsApp.',
    });
  }
}
