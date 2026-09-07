import BackendPlatformPage from 'components/pages/backend-platform/backend-platform-page';
import BackendCompute from 'components/pages/functions/backend-compute';
import Branching from 'components/pages/functions/branching';
import Hero from 'components/pages/functions/hero';
import { functionsPageContent } from 'constants/backend-platform-page-content';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.functions);

const FunctionsPage = () => (
  <BackendPlatformPage faqItems={functionsPageContent.faqItems}>
    <Hero />
    <BackendCompute />
    <Branching />
  </BackendPlatformPage>
);

export default FunctionsPage;
