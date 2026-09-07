import BackendPlatformPage from 'components/pages/backend-platform/backend-platform-page';
import Configuration from 'components/pages/object-storage/configuration';
import Hero from 'components/pages/object-storage/hero';
import IsolatedEnvironments from 'components/pages/object-storage/isolated-environments';
import ProductBenefits from 'components/shared/product-benefits';
import { objectStoragePageContent } from 'constants/object-storage-page-content';
import SEO_DATA from 'constants/seo-data';
import branchableStorageImage from 'images/pages/object-storage/branchable-storage.jpg';
import oneCredentialImage from 'images/pages/object-storage/one-credential.jpg';
import s3CompatibleImage from 'images/pages/object-storage/s3-compatible.jpg';
import getMetadata from 'utils/get-metadata';

const ITEM_IMAGES = {
  's3-compatible': s3CompatibleImage,
  'one-credential': oneCredentialImage,
  'branchable-storage': branchableStorageImage,
};

export const metadata = getMetadata(SEO_DATA.objectStorage);

const ObjectStoragePage = () => (
  <BackendPlatformPage
    faqItems={objectStoragePageContent.faqItems}
    faqTitleLines={['Your questions,', 'answered.']}
    backendServicesTitle={objectStoragePageContent.backendServicesTitle}
  >
    <Hero />
    <ProductBenefits
      className="storage-benefits"
      {...objectStoragePageContent.storageBenefits}
      itemImages={ITEM_IMAGES}
      unoptimizedImages
    />
    <IsolatedEnvironments />
    <Configuration />
  </BackendPlatformPage>
);

export default ObjectStoragePage;

export const revalidate = false;
