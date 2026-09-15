import GuidesIndexView from '@/modules/guides/view/GuidesIndexView';
import { ROUTES } from '@/routes/routes';
import {
  buildGuideMetadata,
  GUIDES_INDEX,
  GUIDES_INDEX_BREADCRUMB,
} from '@/seo/guideMetadata';
import { JsonLd } from '@/seo/JsonLd';

const { metadata, jsonLd } = buildGuideMetadata({
  title: GUIDES_INDEX.title,
  description: GUIDES_INDEX.description,
  path: ROUTES.guides,
  breadcrumb: GUIDES_INDEX_BREADCRUMB,
});

export { metadata };

export default function GuidesIndexPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <GuidesIndexView />
    </>
  );
}
