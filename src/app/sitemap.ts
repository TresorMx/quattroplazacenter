import type { MetadataRoute } from 'next';

// Con www: es el host canónico (quattroplaza.mx redirige 308 a www). Antes
// el sitemap listaba la versión sin www y cada URL era una redirección.
const SITE = 'https://www.quattroplaza.mx';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE,                 lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${SITE}/en`,         lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${SITE}/agenda`,     lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE}/en/agenda`,  lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE}/rewards`,    lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE}/brokers`,    lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE}/privacidad`, lastModified: now, changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${SITE}/en/brokers`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ];

  // Fuera del sitemap (oct/2026): /locales-comerciales-cancun,
  // /invertir-en-cancun, las fichas /plazas/* y el blog. Todas tienen
  // canonical hacia tresor.mx (dueña del tema) y un sitemap solo debe listar
  // URLs canónicas.
  return staticRoutes;
}
