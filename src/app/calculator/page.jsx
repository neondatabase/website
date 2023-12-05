import Calculator from 'components/pages/pricing/calculator';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata({ ...SEO_DATA.calculator });

const PricingPage = () => (
  <Layout
    className="bg-black-new text-white"
    headerTheme="black-new"
    footerTheme="black-new"
    footerWithTopBorder
  >
    <Calculator className="mb-40 mt-44 xl:mb-36 xl:mt-40 lg:mb-16 lg:mt-32 md:my-20" />
  </Layout>
);

export default PricingPage;
