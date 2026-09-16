import type { TranslateFn } from '@/i18n/useTranslation';
import type { Language } from '@/i18n/language';
import { ROUTES } from '@/routes/routes';

export const FAQ_ITEM_KEYS = [
  'item1',
  'item2',
  'item3',
  'item4',
  'item5',
  'item6',
  'item7',
  'item8',
] as const;

/**
 * Perfis reais, do produto e de quem o constrói.
 *
 * "Sogio" disputa a busca com entidades homônimas (há músicas e uma empresa
 * holandesa com esse nome), e `sameAs` apontando para perfis verificáveis é o
 * sinal que o buscador usa para separar uma entidade da outra. Só entra perfil
 * que existe e que aponta de volta para este domínio: é a checagem de mão dupla
 * que dá valor ao campo.
 */
const ORGANIZATION_PROFILES = ['https://www.linkedin.com/company/sogioapp/'];

const FOUNDER_PROFILES = ['https://www.linkedin.com/in/gustavo-marques-mello/'];

/**
 * JSON-LD da landing.
 *
 * `WebSite` nomeia o site no resultado de busca; `Organization` e
 * `SoftwareApplication` dão a um assistente de IA o nome, a categoria e o
 * público do produto; `FAQPage` entrega perguntas e respostas já pareadas, que
 * é o formato que esses modelos citam com mais facilidade.
 */
export const buildStructuredData = (
  t: TranslateFn,
  siteUrl: string,
  pageUrl: string,
  language: Language
) => {
  const organizationId = `${siteUrl}/#organization`;
  const supportedLanguages = ['pt-BR', 'en'];

  return [
    // O nome exibido acima do título no resultado de busca sai daqui. Sem este
    // bloco o buscador cai no domínio e mostra "sogio.app" em vez de "Sogio".
    // A especificação só considera o markup servido na raiz, então ele não vai
    // para /en.
    ...(pageUrl === `${siteUrl}/`
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            '@id': `${siteUrl}/#website`,
            name: 'Sogio',
            url: `${siteUrl}/`,
            inLanguage: supportedLanguages,
            publisher: { '@id': organizationId },
          },
        ]
      : []),
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': organizationId,
      name: 'Sogio',
      url: `${siteUrl}/`,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/web-app-manifest-512x512.png`,
        width: 512,
        height: 512,
      },
      image: `${siteUrl}/og-cover.png`,
      description: t('meta.description'),
      sameAs: ORGANIZATION_PROFILES,
      areaServed: { '@type': 'Country', name: 'BR' },
      founder: {
        '@type': 'Person',
        name: 'Gustavo Marques de Mello',
        sameAs: FOUNDER_PROFILES,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      '@id': `${siteUrl}/#software`,
      name: 'Sogio',
      applicationCategory: 'BusinessApplication',
      applicationSubCategory: t('meta.category'),
      operatingSystem: 'Web, iOS, Android',
      url: pageUrl,
      inLanguage: supportedLanguages,
      description: t('meta.description'),
      publisher: { '@id': organizationId },
      audience: {
        '@type': 'Audience',
        audienceType: t('meta.audience'),
      },
      // `MON` é o código UN/CEFACT de mês, que diz que a cobrança é recorrente
      // sem depender do idioma da página.
      offers: {
        '@type': 'Offer',
        price: '25.00',
        priceCurrency: 'BRL',
        availability: 'https://schema.org/InStock',
        url: `${siteUrl}${ROUTES.signup}`,
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '25.00',
          priceCurrency: 'BRL',
          unitCode: 'MON',
        },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: language === 'en' ? 'en' : 'pt-BR',
      mainEntity: FAQ_ITEM_KEYS.map(item => ({
        '@type': 'Question',
        name: t(`faq.${item}.question`),
        acceptedAnswer: {
          '@type': 'Answer',
          text: t(`faq.${item}.answer`),
        },
      })),
    },
  ];
};
