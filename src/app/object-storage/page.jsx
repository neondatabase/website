import BackendPlatformPage from 'components/pages/backend-platform/backend-platform-page';
import BackendServices from 'components/pages/backend-platform/backend-services';
import BuiltForAgents from 'components/pages/backend-platform/built-for-agents';
import BackendHero from 'components/pages/backend-platform/hero';
import HeroAnimation from 'components/pages/object-storage/hero/hero-animation';
import Configuration from 'components/shared/configuration';
import Faq from 'components/shared/faq';
import NumberedSteps from 'components/shared/numbered-steps';
import ProductBenefits from 'components/shared/product-benefits';
import { objectStoragePageContent } from 'constants/object-storage-page-content';
import SEO_DATA from 'constants/seo-data';
import branchableStorageImage from 'images/pages/object-storage/branchable-storage.jpg';
import oneCredentialImage from 'images/pages/object-storage/one-credential.jpg';
import s3CompatibleImage from 'images/pages/object-storage/s3-compatible.jpg';
import getMetadata from 'utils/get-metadata';

const LOGOS = ['replit', 'outfront', 'doordash', 'bcg', 'pepsi', 'retool', 'meta'];

const ITEM_IMAGES = {
  's3-compatible': s3CompatibleImage,
  'one-credential': oneCredentialImage,
  'branchable-storage': branchableStorageImage,
};

export const metadata = getMetadata(SEO_DATA.objectStorage);

const ObjectStoragePage = () => (
  <BackendPlatformPage>
    <BackendHero
      className="relative pt-46.5 text-white md:pt-24"
      content={objectStoragePageContent.hero}
      dataFigmaNodeId="2070:4694"
      headingClassName="max-w-209.5 leading-none xl:max-w-196 lg:max-w-172 md:max-w-136 md:text-4xl"
      headingId="object-storage-hero-heading"
      illustration={<HeroAnimation />}
      illustrationClassName="overflow-hidden"
      logos={LOGOS}
      logosDataFigmaNodeId="2070:4889"
      testIdPrefix="object-storage"
    />
    <ProductBenefits
      className="storage-benefits"
      {...objectStoragePageContent.storageBenefits}
      itemImages={ITEM_IMAGES}
      unoptimizedImages
    />
    <NumberedSteps
      className="isolated-environments"
      id="object-storage-isolated-environments"
      figmaNodeId="2070:6669"
      {...objectStoragePageContent.isolatedEnvironments}
    />
    <Configuration
      content={objectStoragePageContent.configuration}
      id="object-storage-configuration"
      figmaNodeId="2070:6690"
    />
    <Faq
      items={objectStoragePageContent.faqItems}
      titleLines={['Your questions,', 'answered.']}
      variant="light"
    />
    <BackendServices title={objectStoragePageContent.backendServicesTitle} />
    <BuiltForAgents />
  </BackendPlatformPage>
);

export default ObjectStoragePage;

export const revalidate = false;
