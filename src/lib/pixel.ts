/**
 * Meta Pixel — helpers client-side para disparar eventos estándar.
 * Requiere que MetaPixel ya haya inicializado fbq en el window.
 */

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export function trackPixel(event: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', event, params);
  }
}

export const pixel = {
  viewContent: (params: { content_name: string; content_category?: string; content_ids?: string[] }) =>
    trackPixel('ViewContent', params),

  lead: (params?: { content_name?: string; content_category?: string }) =>
    trackPixel('Lead', params),

  initiateCheckout: (params: { value: number; currency?: string; content_ids?: string[] }) =>
    trackPixel('InitiateCheckout', { currency: 'MXN', ...params }),

  purchase: (params: { value: number; currency?: string; content_ids?: string[] }) =>
    trackPixel('Purchase', { currency: 'MXN', ...params }),
};
