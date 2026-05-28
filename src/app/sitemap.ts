import type { MetadataRoute } from 'next';
import { getActivePlazasAsync } from '@/lib/data';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://quattroplaza.mx';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const plazas = await getActivePlazasAsync();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE,               lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${SITE}/en`,       lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${SITE}/brokers`,  lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE}/agenda`,   lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE}/en/brokers`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE}/en/agenda`,  lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];

  const plazaRoutes: MetadataRoute.Sitemap = plazas.flatMap((p) => [
    {
      url: `${SITE}/plazas/${p.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${SITE}/en/plazas/${p.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.75,
    },
  ]);

  return [...staticRoutes, ...plazaRoutes];
}
