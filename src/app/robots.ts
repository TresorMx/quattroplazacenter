import type { MetadataRoute } from 'next';

// Host canónico con www (el apex redirige 308 a www).
const SITE = 'https://www.quattroplaza.mx';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/studio/', '/cotizar/', '/gracias/'] },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
