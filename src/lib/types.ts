export type UnitStatus = 'disponible' | 'apartado' | 'vendido' | 'bloqueado';

/**
 * Plantilla de un campo de local definida POR PLAZA en Sanity.
 * Cada plaza define su propio set, con add/remove desde el admin.
 *
 * Ej: { key: 'areaTotal', label: 'Área total', unit: 'm²', order: 1 }
 */
export interface UnitSpecTemplate {
  /** Identificador estable (sin espacios), se usa como llave en unit.specs */
  key: string;
  /** Etiqueta visible en la ficha y el PDF (ES) */
  label: string;
  /** Etiqueta opcional en inglés */
  labelEn?: string;
  /** Unidad sufijo: 'm²', 'm', 'kVA', etc. (opcional) */
  unit?: string;
  /** Orden de visualización */
  order: number;
  /** Tipo de dato esperado para el input del admin */
  type?: 'number' | 'text';
}

/**
 * Plan de pago editable POR PLAZA en Sanity.
 * El admin puede crear/eliminar planes libremente desde el editor.
 */
export interface PaymentPlan {
  /** Identificador estable, se usa en URLs y registros (ej: 'plan-a', 'cash-15') */
  code: string;
  /** Nombre visible en la card del cotizador */
  label: string;
  /** Descripción corta debajo del nombre (ej: "Recomendado", "Mejor descuento") */
  tagline?: string;
  /** % del valor total como apartado/enganche al firmar */
  down: number;
  /** % del valor total a financiar mensualmente */
  monthly: number;
  /** % del valor total contra entrega */
  delivery: number;
  /** % de descuento sobre precio base */
  discount: number;
  /** Meses default sugeridos para mensualidades (override-able en el wizard) */
  defaultMonths?: number;
  /** Si está marcado como recomendado/default */
  isDefault?: boolean;
  /** Orden de visualización */
  order: number;
}

export interface Unit {
  id: string;
  code: string;
  level: 1 | 2;
  price?: number;
  delivery?: string;
  status: UnitStatus;
  isAnchor?: boolean;
  /** Coordenadas relativas (0-1) sobre la imagen del master plan */
  pin?: { x: number; y: number };
  /**
   * Valores por especificación. Las llaves corresponden a `plaza.unitSpecsTemplate[].key`.
   * Si una llave no existe, simplemente no se muestra (graceful).
   * Si el template no existe pero hay valores aquí, también se ocultan.
   */
  specs?: Record<string, string | number | undefined>;
}

export interface Plaza {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  status: 'preventa' | 'lanzamiento' | 'entregado' | 'coming-soon';
  city: string;
  state: string;
  country: string;
  deliveryWindow?: string;
  totalUnits?: number;
  soldUnits?: number;
  reservedUnits?: number;
  availableUnits?: number;
  blockedUnits?: number;
  developer: string;
  heroRender: string;
  logoWhite?: string;
  logoDark?: string;
  masterPlanImage?: string;
  masterPlanLevel2?: string;
  location?: { lat: number; lng: number; address: string };
  highlights?: { label: string; labelEn?: string; value: string }[];
  /** Campos de local que aplican PARA ESTA PLAZA (definidos en admin) */
  unitSpecsTemplate?: UnitSpecTemplate[];
  /** Planes de pago disponibles PARA ESTA PLAZA (definidos en admin) */
  paymentPlans?: PaymentPlan[];
  units?: Unit[];
  comingSoon?: boolean;
  // i18n
  nameEn?: string;
  taglineEn?: string;
  description?: string;
  descriptionEn?: string;
  // landing copy
  projectTitle?: string;
  projectTitleEn?: string;
  projectBody1?: string;
  projectBody1En?: string;
  projectBody2?: string;
  projectBody2En?: string;
  bullet1?: string;
  bullet1En?: string;
  bullet2?: string;
  bullet2En?: string;
  bullet3?: string;
  bullet3En?: string;
  floorPlansDesc?: string;
  floorPlansDescEn?: string;
  // SEO
  seoTitle?: string;
  seoTitleEn?: string;
  seoDescription?: string;
  seoDescriptionEn?: string;
  // gallery / floor plans
  gallery?: string[];
  floorPlans?: { label: string; labelEn?: string; area?: number; frente?: number; fondo?: number; order?: number; image?: string }[];
}

export interface PlazasData {
  plazas: Plaza[];
}

export interface QuoteState {
  plazaSlug: string;
  unitId: string;
  planCode: string;
  monthlyTermMonths: number;
  contact: {
    fullName: string;
    email: string;
    phone: string;
    company?: string;
    isBroker: boolean;
    brokerage?: string;
  };
}
