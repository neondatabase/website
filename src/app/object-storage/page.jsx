import BackendPlatformPage from 'components/pages/backend-platform/backend-platform-page';
import BackendServices from 'components/pages/backend-platform/backend-services';
import BuiltForAgents from 'components/pages/backend-platform/built-for-agents';
import BackendHero from 'components/pages/backend-platform/hero';
import Configuration from 'components/pages/object-storage/configuration';
import HeroAnimation from 'components/pages/object-storage/hero/hero-animation';
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
      className="relative pt-46.5 safe-paddings text-white xl:pt-36 lg:pt-32 md:pt-24"
      content={objectStoragePageContent.hero}
      dataFigmaNodeId="2070:4694"
      headingClassName="max-w-209.5 text-[4.5rem] leading-none tracking-tighter xl:max-w-196 xl:text-[3.75rem] lg:max-w-172 lg:text-5xl md:max-w-136 md:text-4xl sm:text-[2.25rem]"
      headingId="object-storage-hero-heading"
      headingRowClassName="mt-5 flex items-end justify-between gap-x-12 xl:flex-col xl:items-start xl:gap-y-8"
      illustration={<HeroAnimation />}
      illustrationClassName="mt-12 overflow-hidden md:mt-10"
      logos={LOGOS}
      logosClassName="mt-14 lg:mt-12 md:mt-10"
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
    <Configuration />
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
