import Compatibility from 'components/pages/ai-gateway/compatibility';
import GatewayBenefits from 'components/pages/ai-gateway/gateway-benefits';
import Hero from 'components/pages/ai-gateway/hero';
import Models from 'components/pages/ai-gateway/models';
import BackendPlatformPage from 'components/pages/backend-platform/backend-platform-page';
import { aiGatewayPageContent } from 'constants/backend-platform-page-content';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.aiGateway);

const AiGatewayPage = () => (
  <BackendPlatformPage faqItems={aiGatewayPageContent.faqItems}>
    <Hero />
    <Models />
    <GatewayBenefits />
    <Compatibility />
  </BackendPlatformPage>
);

export default AiGatewayPage;

export const revalidate = false;
