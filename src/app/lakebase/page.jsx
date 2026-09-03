import BackendPlatformPage from 'components/pages/backend-platform/backend-platform-page';
import BackendServices from 'components/pages/backend-platform/backend-services';
import Architecture from 'components/pages/lakebase/architecture';
import Autoscaling from 'components/pages/lakebase/autoscaling';
import DynamicDatabases from 'components/pages/lakebase/dynamic-databases';
import FromFirstLine from 'components/pages/lakebase/from-first-line';
import Hero from 'components/pages/lakebase/hero';
import Faq from 'components/shared/faq';
import { lakebasePageContent } from 'constants/backend-platform-page-content';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.lakebase);

const LakebasePage = () => (
  <BackendPlatformPage>
    <Hero />
    <Architecture />
    <Autoscaling />
    <DynamicDatabases />
    <FromFirstLine />
    <Faq items={lakebasePageContent.faqItems} variant="lakebase" />
    <BackendServices className="pb-40" contentClassName="mt-[73.5px] min-h-[441px]" />
  </BackendPlatformPage>
);

export default LakebasePage;

export const revalidate = false;
