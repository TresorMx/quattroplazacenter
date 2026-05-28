import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'No API key' }, { status: 500 });

  const body = await req.json();
  const {
    name, tagline, description,
    projectTitle, projectBody1, projectBody2,
    bullet1, bullet2, bullet3,
    floorPlansDesc,
    highlights,
  } = body;

  const client = new Anthropic({ apiKey });

  const prompt = `Translate the following real estate project content from Spanish to English.
Return ONLY a valid JSON object with exactly these keys (translate only non-empty values, leave empty strings for fields that have no source):

{
  "nameEn": "",
  "taglineEn": "",
  "descriptionEn": "",
  "projectTitleEn": "",
  "projectBody1En": "",
  "projectBody2En": "",
  "bullet1En": "",
  "bullet2En": "",
  "bullet3En": "",
  "floorPlansDescEn": "",
  "highlights": [{ "labelEn": "" }]
}

Source content (Spanish):
- name: ${name ?? ''}
- tagline: ${tagline ?? ''}
- description: ${description ?? ''}
- projectTitle: ${projectTitle ?? ''}
- projectBody1: ${projectBody1 ?? ''}
- projectBody2: ${projectBody2 ?? ''}
- bullet1: ${bullet1 ?? ''}
- bullet2: ${bullet2 ?? ''}
- bullet3: ${bullet3 ?? ''}
- floorPlansDesc: ${floorPlansDesc ?? ''}
- highlights (array of labels to translate): ${JSON.stringify(highlights ?? [])}

Rules:
- Keep proper nouns (Cancún, Tresor Real Estate, Quattro Plaza Center) as-is.
- Keep numbers, symbols, abbreviations (m², MXN, DIC 2026) as-is.
- Tone: professional real estate, confident, premium.
- For projectBody1: the site prepends the plaza name, so start with a lowercase verb. E.g. "is located in..."
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
