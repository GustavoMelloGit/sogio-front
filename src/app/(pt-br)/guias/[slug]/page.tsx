import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import GuideView from '@/modules/guides/view/GuideView';
import { findGuide, GUIDES } from '@/modules/guides/service/guides';
import type { Guide } from '@/modules/guides/types/Guide';
import { ROUTES } from '@/routes/routes';
import { buildGuideMetadata, guideBreadcrumb } from '@/seo/guideMetadata';
import { JsonLd } from '@/seo/JsonLd';

// Todo guia existe no build; um slug desconhecido é 404, e não uma página
// renderizada sob demanda.
export const dynamicParams = false;

export const generateStaticParams = () =>
  GUIDES.map(guide => ({ slug: guide.slug }));

const headFor = (guide: Guide) =>
  buildGuideMetadata({
    title: guide.title,
    description: guide.description,
    path: ROUTES.guide(guide.slug),
    article: { updatedAt: guide.updatedAt },
    breadcrumb: guideBreadcrumb(guide.slug, guide.title),
  });

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const guide = findGuide((await params).slug);
  return guide ? headFor(guide).metadata : {};
}

export default async function GuidePage({ params }: GuidePageProps) {
  const guide = findGuide((await params).slug);
  if (!guide) notFound();

  return (
    <>
      <JsonLd data={headFor(guide).jsonLd} />
      <GuideView guide={guide} />
    </>
  );
}
