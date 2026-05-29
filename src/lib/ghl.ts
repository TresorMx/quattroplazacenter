/**
 * Adaptador para Go High Level (CRM + Calendario).
 *
 * Cuando David envíe las credenciales (Location ID + API key v2 + pipeline ID),
 * activamos `createGHLContact()` y `addGHLOpportunity()`.
 *
 * Por ahora el adaptador hace fallback silencioso a un log + email.
 */

/** Mapea slug de plaza al valor exacto del campo GHL desarrollo_de_inters */
export function plazaToDesarrollo(plaza: string): string {
  const map: Record<string, string> = {
    'gardens':     'quattro_plaza_gardens',
    'long-island': 'quattro_plaza_long_island',
    'ambos':       'proyectos_quattro',
  };
  return map[plaza] ?? 'proyectos_quattro';
}

export interface GHLLead {
  firstName: string;
  lastName?: string;
  email?: string;
  phone: string;
  company?: string;
  source: 'quote' | 'chatbot' | 'broker' | 'reservation' | 'agenda' | 'chat';
  tags?: string[];
  customFields?: Record<string, string | number | boolean>;
  notes?: string;
}

export async function sendLeadToGHL(lead: GHLLead): Promise<{ ok: boolean; contactId?: string; error?: string }> {
  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;

  if (!apiKey || !locationId) {
    console.log('[GHL] Skipped — credentials not configured. Lead:', lead.email, lead.source);
    return { ok: true };
  }

  try {
    const res = await fetch('https://services.leadconnectorhq.com/contacts/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Version: '2021-07-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: lead.firstName,
        lastName: lead.lastName ?? '',
        ...(lead.email ? { email: lead.email } : {}),
        phone: lead.phone,
        companyName: lead.company,
        locationId,
        source: `web-${lead.source}`,
        tags: lead.tags ?? [],
        customFields: lead.customFields
          ? Object.entries(lead.customFields).map(([key, value]) => ({ key, field_value: String(value) }))
          : [],
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error('[GHL] Error', res.status, text);
      return { ok: false, error: text };
    }
    const data = await res.json();
    return { ok: true, contactId: data.contact?.id };
  } catch (e) {
    console.error('[GHL] Network error', e);
    return { ok: false, error: String(e) };
  }
}
