import BackendPlatformPage from 'components/pages/backend-platform/backend-platform-page';
import BackendServices from 'components/pages/backend-platform/backend-services';
import BuiltForAgents from 'components/pages/backend-platform/built-for-agents';
import BackendCompute from 'components/pages/functions/backend-compute';
import Branching from 'components/pages/functions/branching';
import Hero from 'components/pages/functions/hero';
import Faq from 'components/shared/faq';
import {
  functionsPageContent,
  sharedBackendPlatformContent,
} from 'constants/backend-platform-page-content';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.functions);

const FunctionsPage = () => (
  <BackendPlatformPage>
    <Hero />
    <BackendCompute />
    <Branching />
    <Faq
      items={functionsPageContent.faqItems}
      titleLines={sharedBackendPlatformContent.faqTitleLines}
      variant="light"
    />
    <BackendServices />
    <BuiltForAgents />
  </BackendPlatformPage>
);

export default FunctionsPage;
