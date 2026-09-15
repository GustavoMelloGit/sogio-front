import type { MetadataRoute } from 'next';
import { GUIDES } from '@/modules/guides/service/guides';
import { ROUTES } from '@/routes/routes';
import { SITE_URL } from '@/seo/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Só a landing tem versão em outro idioma; declarar alternativa para um guia
  // que existe só em português seria mentira para o buscador.
  const landingAlternates = {
    languages: {
      'pt-BR': `${SITE_URL}/`,
      en: `${SITE_URL}${ROUTES.landingEn}`,
      'x-default': `${SITE_URL}/`,
    },
  };

  return [
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
      alternates: landingAlternates,
    },
    {
      url: `${SITE_URL}${ROUTES.landingEn}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: landingAlternates,
    },
    {
      url: `${SITE_URL}${ROUTES.guides}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...GUIDES.map(guide => ({
      url: `${SITE_URL}${ROUTES.guide(guide.slug)}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
