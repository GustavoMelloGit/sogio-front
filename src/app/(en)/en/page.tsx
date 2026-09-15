import LandingView from '@/modules/landing/view/LandingView';
import { buildLandingMetadata } from '@/seo/landingMetadata';
import { JsonLd } from '@/seo/JsonLd';

const { metadata, jsonLd } = buildLandingMetadata('en');

export { metadata };

export default function EnglishLandingPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <LandingView pageLanguage='en' />
    </>
  );
}
