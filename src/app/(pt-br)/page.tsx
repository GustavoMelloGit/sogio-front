import LandingView from '@/modules/landing/view/LandingView';
import { buildLandingMetadata } from '@/seo/landingMetadata';
import { JsonLd } from '@/seo/JsonLd';

const { metadata, jsonLd } = buildLandingMetadata('pt');

export { metadata };

export default function LandingPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <LandingView pageLanguage='pt' />
    </>
  );
}
