import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'No API key' }, { status: 500 });

  const body = await req.json();
  const { name, tagline, description, highlights, unitSpecsTemplate, floorPlans } = body;

  const client = new Anthropic({ apiKey });

  const prompt = `Translate the following real estate project content from Spanish to English.
Return ONLY a valid JSON object with these keys (keep the same structure, translate only the text values):

{
  "nameEn": "<translated name>",
  "taglineEn": "<translated tagline>",
  "descriptionEn": "<translated description>"
}

Source content:
- name: ${name ?? ''}
- tagline: ${tagline ?? ''}
- description: ${description ?? ''}

Rules:
- Keep proper nouns (Cancún, Tresor Real Estate, Quattro Plaza Center) as-is.
- Keep numbers, symbols, abbreviations (m², MXN, DIC 2026) as-is.
- Tone: professional real estate, confident, premium.
- Return ONLY the JSON, no markdown, no explanation.`;

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 800,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = (response.content[0] as any).text.trim();

  try {
    const json = JSON.parse(text);
    return NextResponse.json(json);
  } catch {
    // Try to extract JSON if wrapped in markdown
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return NextResponse.json(JSON.parse(match[0]));
    return NextResponse.json({ error: 'Failed to parse response', raw: text }, { status: 500 });
  }
}
