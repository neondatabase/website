import BackendPlatformPage from 'components/pages/backend-platform/backend-platform-page';
import BackendServices from 'components/pages/backend-platform/backend-services';
import BuiltForAgents from 'components/pages/backend-platform/built-for-agents';
import BackendHero from 'components/pages/backend-platform/hero';
import BackendCompute from 'components/pages/functions/backend-compute';
import Branching from 'components/pages/functions/branching';
import HeroIllustration from 'components/pages/functions/hero/illustration';
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
    <BackendHero
      className="bg-black-pure pt-[146px] pb-20 text-white xl:pt-[122px] lg:pt-[98px] md:pt-24 md:pb-16"
      content={functionsPageContent.hero}
      dataFigmaNodeId="3122:1263"
      headingClassName="max-w-[878px] leading-[1.125] xl:text-6xl sm:text-[2.5rem]"
      headingId="functions-hero-heading"
      headingRowClassName="gap-12 lg:flex-col lg:items-start"
      illustration={<HeroIllustration />}
      illustrationClassName="overflow-hidden"
      logosClassName="mt-[59px] lg:mt-[59px]"
      logosDataFigmaNodeId="3122:1938"
    />
    <BackendCompute />
    <Branching />
    <Faq
      items={functionsPageContent.faqItems}
      titleLines={sharedBackendPlatformContent.faqTitleLines}
      variant="light"
    />
    <BackendServices title={functionsPageContent.backendServices.title} />
    <BuiltForAgents />
  </BackendPlatformPage>
);

export default FunctionsPage;
