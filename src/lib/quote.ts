/**
 * Lógica de cotización: aplica esquema de pago + descuento, genera tabla de pagos.
 * Los planes vienen 100% del CMS (plaza.paymentPlans) — sin valores hardcoded.
 */
import type { Plaza, PaymentPlan, Unit } from './types';

export interface QuoteCalc {
  unit: Unit;
  plaza: Plaza;
  plan: PaymentPlan;
  monthlyTerm: number;
  basePrice: number;
  discount: number;
  subtotal: number;
  iva: number;
  total: number;
  reservation: number;
  downPayment: number;
  monthly: number;
  monthlyAmount: number;
  deliveryAmount: number;
  schedule: Array<{ label: string; amount: number; note?: string }>;
  validUntil: string;
}

const IVA_RATE = 0.16;
const RESERVATION_MXN = 50000;

/**
 * Devuelve los planes disponibles para una plaza, ordenados.
 * (Antes filtraba por nivel; ahora cada plaza define qué planes ofrece
 *  y se aplican igual a todos los locales — lo más común en preventa).
 */
export function getAvailablePlans(plaza: Plaza): PaymentPlan[] {
  if (!plaza.paymentPlans?.length) return [];
  return [...plaza.paymentPlans].sort((a, b) => a.order - b.order);
}

export function getDefaultPlan(plaza: Plaza): PaymentPlan | undefined {
  const plans = getAvailablePlans(plaza);
  return plans.find((p) => p.isDefault) ?? plans[0];
}

export function computeQuote({
  plaza,
  unit,
  plan,
  monthlyTerm,
}: {
  plaza: Plaza;
  unit: Unit;
  plan: PaymentPlan;
  monthlyTerm: number;
}): QuoteCalc {
  if (!unit.price) throw new Error('Unit price required');

  const basePrice = unit.price;
  const discount = basePrice * (plan.discount / 100);
  const subtotal = basePrice - discount;
  const iva = subtotal * IVA_RATE;
  const total = subtotal + iva;

  const downPayment = total * (plan.down / 100);
  const monthlyAmount = total * (plan.monthly / 100);
  const deliveryAmount = total * (plan.delivery / 100);
  const monthlyPayment = monthlyTerm > 0 ? monthlyAmount / monthlyTerm : 0;

  const schedule: QuoteCalc['schedule'] = [
    { label: 'Apartado', amount: RESERVATION_MXN, note: 'Reembolsable' },
    {
      label: 'Enganche',
      amount: Math.max(downPayment - RESERVATION_MXN, 0),
      note: `${plan.down}% del valor total — al firmar contrato`,
    },
  ];

  if (plan.monthly > 0 && monthlyTerm > 0) {
    schedule.push({
      label: `Mensualidades (${monthlyTerm})`,
      amount: monthlyPayment,
      note: `${plan.monthly}% en pagos iguales durante ${monthlyTerm} meses`,
    });
  }

  if (plan.delivery > 0) {
    schedule.push({
      label: 'Contra entrega',
      amount: deliveryAmount,
      note: `${plan.delivery}% al entregarse el local — ${unit.delivery ?? plaza.deliveryWindow ?? ''}`,
    });
  }

  const validUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  return {
    unit,
    plaza,
    plan,
    monthlyTerm,
    basePrice,
    discount,
    subtotal,
    iva,
    total,
    reservation: RESERVATION_MXN,
    downPayment,
    monthly: plan.monthly,
    monthlyAmount,
    deliveryAmount,
    schedule,
    validUntil,
  };
}

/** Genera un ID de cotización legible: QPC-LI-A12-PLANA-7M2K */
export function generateQuoteId(plazaSlug: string, unitCode: string, planCode: string): string {
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  const slugAbbr = plazaSlug
    .split('-')
    .map((p) => p[0])
    .join('')
    .toUpperCase();
  const planAbbr = planCode.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
  return `QPC-${slugAbbr}-${unitCode}-${planAbbr}${random}`;
}
