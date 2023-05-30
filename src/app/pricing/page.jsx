import Calculator from 'components/pages/pricing/calculator';
import CTA from 'components/pages/pricing/cta';
import Estimates from 'components/pages/pricing/estimates';
import Faq from 'components/pages/pricing/faq';
import Hero from 'components/pages/pricing/hero';
import Metrics from 'components/pages/pricing/metrics';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

// import { PreloadResources } from './preload-resources';

export const metadata = getMetadata(SEO_DATA.pricing);

const PricingPage = () => (
  <>
    {/* <PreloadResources /> */}
    <Layout
      className="bg-black-new text-white"
      headerTheme="black-new"
      footerTheme="black-new"
      footerWithTopBorder
    >
      <Hero />
      <Metrics />
      <Estimates />
      <Calculator />
      <Faq />
      <CTA />
    </Layout>
  </>
);

export default PricingPage;
