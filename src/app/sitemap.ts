import type { MetadataRoute } from 'next';
import { getActivePlazas } from '@/lib/data';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://quattroplaza.mx';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const plazas = getActivePlazas();

  const staticRoutes = [
    { url: SITE, lastModified: now, changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: `${SITE}/en`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${SITE}/brokers`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 },
  ];

  const plazaRoutes = plazas.flatMap((p) => [
    { url: `${SITE}/plazas/${p.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${SITE}/en/plazas/${p.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${SITE}/cotizar/${p.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 },
  ]);

  return [...staticRoutes, ...plazaRoutes];
}
