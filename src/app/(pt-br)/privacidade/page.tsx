import LegalView from '@/modules/legal/view/LegalView';
import { PRIVACY_POLICY } from '@/modules/legal/service/legal';
import { ROUTES } from '@/routes/routes';
import { buildLegalMetadata } from '@/seo/legalMetadata';
import { JsonLd } from '@/seo/JsonLd';

const { metadata, jsonLd } = buildLegalMetadata(
  PRIVACY_POLICY,
  ROUTES.privacyPolicy
);

export { metadata };

export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <LegalView document={PRIVACY_POLICY} />
    </>
  );
}
