/**
 * Persistencia temporal de cotizaciones (en memoria del server).
 * Para producción esto se mueve a Sanity. Por ahora sirve para que la thank you
 * page pueda leer el PDF y los datos al recargar.
 *
 * Nota: en serverless cada función puede vivir en un proceso distinto, así que
 * el store en memoria NO es confiable. Usaremos Sanity (o Vercel KV) cuando
 * tengamos las keys. Por ahora también respondemos el detalle en la primera
 * respuesta del POST para que el cliente la guarde en localStorage.
 */
import type { QuoteCalc } from './quote';

export interface StoredQuote {
  quoteId: string;
  createdAt: string;
  contact: {
    fullName: string;
    email: string;
    phone: string;
    company?: string;
    isBroker?: boolean;
    brokerage?: string;
    notes?: string;
  };
  computed: QuoteCalc;
  status: 'generated' | 'reserved' | 'paid' | 'expired';
}

declare global {
  // eslint-disable-next-line no-var
  var __quoteStore: Map<string, StoredQuote> | undefined;
}

export const quoteStore: Map<string, StoredQuote> =
  globalThis.__quoteStore ?? (globalThis.__quoteStore = new Map());
