import type { Metadata } from 'next';
import type { Language } from '@/i18n/language';
import { ROUTES } from '@/routes/routes';
import { buildStructuredData } from './landingStructuredData';
import { OG_IMAGE, SITE_URL } from './site';
import { landingTranslator } from './translator';

/**
 * Monta o `<head>` da landing a partir das traduções.
 *
 * Metadata e JSON-LD saem do mesmo tradutor, então título, descrição e FAQ do
 * resultado de busca nunca divergem do que a página mostra.
 */
export const buildLandingMetadata = (language: Language) => {
  const t = landingTranslator(language);
  const isEnglish = language === 'en';
  const pageUrl = isEnglish
    ? `${SITE_URL}${ROUTES.landingEn}`
    : `${SITE_URL}${ROUTES.landing}`;
  const title = t('meta.title');
  const description = t('meta.description');

  const metadata: Metadata = {
    title: { absolute: title },
    description,
    alternates: {
      canonical: pageUrl,
      languages: {
        'pt-BR': `${SITE_URL}/`,
        en: `${SITE_URL}${ROUTES.landingEn}`,
        'x-default': `${SITE_URL}/`,
      },
    },
    openGraph: {
      type: 'website',
      siteName: 'Sogio',
      title,
      description,
      url: pageUrl,
      locale: isEnglish ? 'en_US' : 'pt_BR',
      // Arte dedicada em 1200x630. O ícone quadrado do PWA continua servindo o
      // `logo` do JSON-LD, mas como card social ele vira miniatura cortada.
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          type: 'image/png',
          alt: 'Sogio',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE],
    },
  };

  return {
    metadata,
    jsonLd: buildStructuredData(t, SITE_URL, pageUrl, language),
  };
};
