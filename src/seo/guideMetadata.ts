import type { Metadata } from 'next';
import { ROUTES } from '@/routes/routes';
import { OG_IMAGE, SITE_URL } from './site';

export interface Crumb {
  name: string;
  /** Caminho absoluto, começando com `/`. */
  path: string;
}

export const GUIDES_INDEX = {
  title: 'Guias para quem aluga por temporada',
  description:
    'Contas, comparações e rotinas de quem cuida de imóveis de aluguel por temporada, explicadas sem jargão.',
} as const;

const HOME: Crumb = { name: 'Início', path: ROUTES.landing };
const INDEX: Crumb = { name: 'Guias', path: ROUTES.guides };

export const GUIDES_INDEX_BREADCRUMB: Crumb[] = [HOME, INDEX];

export const guideBreadcrumb = (slug: string, title: string): Crumb[] => [
  HOME,
  INDEX,
  { name: title, path: ROUTES.guide(slug) },
];

interface GuideHeadInput {
  title: string;
  description: string;
  /** Caminho absoluto da página, começando com `/`. */
  path: string;
  /** Ausente no índice, que não é um `Article`. */
  article?: { updatedAt: string };
  breadcrumb: Crumb[];
}

/**
 * Monta o `<head>` das páginas de conteúdo.
 *
 * As páginas existem só em português, então não há `hreflang`: declarar uma
 * alternativa em inglês que não existe é pior do que não declarar nada.
 */
export const buildGuideMetadata = ({
  title,
  description,
  path,
  article,
  breadcrumb,
}: GuideHeadInput) => {
  const pageUrl = `${SITE_URL}${path}`;
  const pageTitle = `${title} · Sogio`;

  const jsonLd: unknown[] = [];

  if (article) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description,
      dateModified: article.updatedAt,
      datePublished: article.updatedAt,
      inLanguage: 'pt-BR',
      mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
      image: OG_IMAGE,
      author: { '@type': 'Organization', name: 'Sogio', url: SITE_URL },
      publisher: { '@id': `${SITE_URL}/#organization` },
    });
  }

  jsonLd.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumb.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.path}`,
    })),
  });

  const metadata: Metadata = {
    title: { absolute: pageTitle },
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      type: article ? 'article' : 'website',
      siteName: 'Sogio',
      title: pageTitle,
      description,
      url: pageUrl,
      locale: 'pt_BR',
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: [OG_IMAGE],
    },
  };

  return { metadata, jsonLd };
};
