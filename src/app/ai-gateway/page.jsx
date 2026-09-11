import Compatibility from 'components/pages/ai-gateway/compatibility';
import Hero from 'components/pages/ai-gateway/hero';
import Models from 'components/pages/ai-gateway/models';
import BackendPlatformPage from 'components/pages/backend-platform/backend-platform-page';
import BackendServices from 'components/pages/backend-platform/backend-services';
import BuiltForAgents from 'components/pages/backend-platform/built-for-agents';
import Faq from 'components/shared/faq';
import ProductBenefits from 'components/shared/product-benefits';
import {
  aiGatewayPageContent,
  sharedBackendPlatformContent,
} from 'constants/backend-platform-page-content';
import SEO_DATA from 'constants/seo-data';
import fairPricingImage from 'images/pages/ai-gateway/gateway-benefits/fair-pricing.jpg';
import simplifiedBillingImage from 'images/pages/ai-gateway/gateway-benefits/simplified-billing.jpg';
import unifiedAccessImage from 'images/pages/ai-gateway/gateway-benefits/unified-access.jpg';
import getMetadata from 'utils/get-metadata';

const ITEM_IMAGES = {
  'unified-access': unifiedAccessImage,
  'simplified-billing': simplifiedBillingImage,
  'fair-pricing': fairPricingImage,
};

export const metadata = getMetadata(SEO_DATA.aiGateway);

const AiGatewayPage = () => (
  <BackendPlatformPage>
    <Hero />
    <Models />
    <ProductBenefits
      className="gateway-benefits"
      {...aiGatewayPageContent.gatewayBenefits}
      itemImages={ITEM_IMAGES}
    />
    <Compatibility />
    <Faq
      items={aiGatewayPageContent.faqItems}
      titleLines={sharedBackendPlatformContent.faqTitleLines}
      variant="light"
    />
    <BackendServices />
    <BuiltForAgents />
  </BackendPlatformPage>
);

export default AiGatewayPage;

export const revalidate = false;
