import BackendPlatformPage from 'components/pages/backend-platform/backend-platform-page';
import BackendServices from 'components/pages/backend-platform/backend-services';
import BackendHero from 'components/pages/backend-platform/hero';
import Architecture from 'components/pages/lakebase/architecture';
import Autoscaling from 'components/pages/lakebase/autoscaling';
import DynamicDatabases from 'components/pages/lakebase/dynamic-databases';
import FromFirstLine from 'components/pages/lakebase/from-first-line';
import HeroIllustration from 'components/pages/lakebase/hero/illustration';
import Configuration from 'components/shared/configuration';
import Faq from 'components/shared/faq';
import { lakebasePageContent } from 'constants/backend-platform-page-content';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.lakebase);

const LakebasePage = () => (
  <BackendPlatformPage>
    <BackendHero
      className="hero relative pt-46.5 pb-16"
      content={lakebasePageContent.hero}
      headingClassName="max-w-206.5 leading-none 2xl:max-w-190 2xl:text-[4rem] xl:max-w-180 lg:max-w-160 md:max-w-136"
      headingId="lakebase-hero-heading"
      headingRowClassName="gap-x-16 xl:flex-col xl:items-start xl:gap-y-8"
      illustration={<HeroIllustration />}
      logosClassName="relative"
      testIdPrefix="lakebase"
    />
    <Architecture />
    <Autoscaling />
    <DynamicDatabases />
    <Configuration content={lakebasePageContent.configuration} id="data-api" />
    <FromFirstLine />
    <Faq items={lakebasePageContent.faqItems} variant="lakebase" />
    <BackendServices
      className="pb-40 lg:pt-12 md:pt-10"
      contentClassName="mt-[73.5px] min-h-[441px]"
    />
  </BackendPlatformPage>
);

export default LakebasePage;

export const revalidate = false;
