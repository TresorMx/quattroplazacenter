import { sanityClient } from './client';
import { urlFor } from './image';
import type { Plaza, Unit } from '../types';

// ─── GROQ fragments ──────────────────────────────────────────────────────────

const UNIT_FIELDS = `
  "id": _id,
  code,
  level,
  price,
  delivery,
  status,
  isAnchor,
  pin,
  "specs": specs[]{"key": key, "value": value}
`;

const PLAZA_FIELDS = `
  slug,
  "slug": slug.current,
  name,
  nameEn,
  shortName,
  tagline,
  taglineEn,
  status,
  city,
  state,
  country,
  deliveryWindow,
  comingSoon,
  developer,
  description,
  descriptionEn,
  projectTitle,
  projectTitleEn,
  projectBody1,
  projectBody1En,
  projectBody2,
  projectBody2En,
  bullet1,
  bullet1En,
  bullet2,
  bullet2En,
  bullet3,
  bullet3En,
  floorPlansDesc,
  floorPlansDescEn,
  seoTitle,
  seoTitleEn,
  seoDescription,
  seoDescriptionEn,
  highlights,
  "heroRender":       heroRender.asset->url,
  "logoWhite":        logoWhite.asset->url,
  "logoDark":         logoDark.asset->url,
  "masterPlanImage":  masterPlanImage.asset->url,
  "masterPlanLevel2": masterPlanLevel2.asset->url,
  "gallery":          gallery[].asset->url,
  "floorPlans":       floorPlans[]{
    label, labelEn, area, frente, fondo, order,
    "image": image.asset->url
  },
  location,
  unitSpecsTemplate,
  paymentPlans,
  "units": units[]->{${UNIT_FIELDS}}
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function mapSpecs(rawSpecs: any[]): Record<string, string | number> {
  if (!Array.isArray(rawSpecs)) return {};
  return Object.fromEntries(rawSpecs.map((s) => [s.key, isNaN(Number(s.value)) ? s.value : Number(s.value)]));
}

function normalizePlaza(raw: any): Plaza {
  const units: Unit[] = (raw.units ?? []).map((u: any) => ({
    ...u,
    specs: mapSpecs(u.specs ?? []),
  }));

  const available  = units.filter((u) => u.status === 'disponible').length;
  const reserved   = units.filter((u) => u.status === 'apartado').length;
  const sold       = units.filter((u) => u.status === 'vendido').length;
  const blocked    = units.filter((u) => u.status === 'bloqueado').length;

  return {
    ...raw,
    units,
    availableUnits: available,
    reservedUnits:  reserved,
    soldUnits:      sold,
    blockedUnits:   blocked,
    totalUnits:     units.length,
  } as Plaza;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function fetchAllPlazas(): Promise<Plaza[]> {
  const raws = await sanityClient.fetch(
    `*[_type == "plaza"] | order(name asc) { ${PLAZA_FIELDS} }`,
    {},
    { cache: 'no-store' }
  );
  return (raws ?? []).map(normalizePlaza);
}

export async function fetchPlazaBySlug(slug: string): Promise<Plaza | null> {
  const raw = await sanityClient.fetch(
    `*[_type == "plaza" && slug.current == $slug][0] { ${PLAZA_FIELDS} }`,
    { slug },
    { cache: 'no-store' }
  );
  return raw ? normalizePlaza(raw) : null;
}

export interface SiteSettings {
  showAgendaWidget: boolean;
  agendaEyebrow: string;
  agendaTitle1: string;
  agendaTitle2: string;
  agendaDesc: string;
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  const raw = await sanityClient.fetch(
    `*[_type == "siteSettings" && _id == "siteSettings"][0]{ showAgendaWidget, agendaEyebrow, agendaTitle1, agendaTitle2, agendaDesc }`,
    {},
    { cache: 'no-store' }
  );
  return {
    showAgendaWidget: raw?.showAgendaWidget ?? false,
    agendaEyebrow:    raw?.agendaEyebrow    ?? '— Agenda tu visita',
    agendaTitle1:     raw?.agendaTitle1     ?? 'Agenda',
    agendaTitle2:     raw?.agendaTitle2     ?? 'tu visita',
    agendaDesc:       raw?.agendaDesc       ?? 'Elige fecha, hora y modalidad. Te confirmamos en menos de 24 hrs.',
  };
}
