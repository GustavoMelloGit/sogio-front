import LegalView from '@/modules/legal/view/LegalView';
import { TERMS_OF_USE } from '@/modules/legal/service/legal';
import { ROUTES } from '@/routes/routes';
import { buildLegalMetadata } from '@/seo/legalMetadata';
import { JsonLd } from '@/seo/JsonLd';

const { metadata, jsonLd } = buildLegalMetadata(
  TERMS_OF_USE,
  ROUTES.termsOfUse
);

export { metadata };

export default function TermsOfUsePage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <LegalView document={TERMS_OF_USE} />
    </>
  );
}
