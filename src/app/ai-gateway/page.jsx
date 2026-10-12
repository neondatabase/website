import Compatibility from 'components/pages/ai-gateway/compatibility';
import HeroIllustration from 'components/pages/ai-gateway/hero/hero-diagram';
import Models from 'components/pages/ai-gateway/models';
import BackendPlatformPage from 'components/pages/backend-platform/backend-platform-page';
import BackendServices from 'components/pages/backend-platform/backend-services';
import BuiltForAgents from 'components/pages/backend-platform/built-for-agents';
import BackendHero from 'components/pages/backend-platform/hero';
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
    <BackendHero
      className="hero relative pt-40"
      content={aiGatewayPageContent.hero}
      headingClassName="max-w-240 2xl:text-[4rem] xl:max-w-196 lg:max-w-172 md:max-w-136"
      headingId="ai-gateway-hero-heading"
      headingRowClassName="mt-5.5 gap-x-16 xl:flex-col xl:items-start xl:gap-y-8 md:mt-5"
      illustration={<HeroIllustration />}
      illustrationClassName="mt-13"
      logosClassName="relative"
      testIdPrefix="ai-gateway"
    />
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
