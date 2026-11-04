import { randomUUID } from 'crypto';
import { sanityClient } from './client';

interface LeadData {
  source: 'form' | 'chatbot' | 'broker' | 'cotizacion' | 'agenda' | 'rewards';
  fullName?: string;
  email?: string;
  phone?: string;
  company?: string;
  isBroker?: boolean;
  brokerage?: string;
  plazaSlug?: string;
  unitCode?: string;
  message?: string;
  sentToGHL?: boolean;
}

export async function saveLeadToSanity(data: LeadData): Promise<void> {
  if (!process.env.SANITY_API_TOKEN) return;
  try {
    await sanityClient.create({
      // Con "private." la API pública de Sanity no puede leerlo (solo con token).
      _id: `private.lead.${randomUUID()}`,
      _type: 'lead',
      ...data,
      createdAt: new Date().toISOString(),
      sentToGHL: data.sentToGHL ?? true,
    });
  } catch (e) {
    console.error('[Sanity] saveLeadToSanity error', e);
  }
}
