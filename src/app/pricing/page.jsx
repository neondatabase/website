import Logos from 'components/pages/partners/logos';
import Calculator from 'components/pages/pricing/calculator';
import CTA from 'components/pages/pricing/cta';
import Estimates from 'components/pages/pricing/estimates';
import Faq from 'components/pages/pricing/faq';
import Hero from 'components/pages/pricing/hero';
import Metrics from 'components/pages/pricing/metrics';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.pricing);

const PricingPage = () => (
  <Layout
    className="bg-black-new text-white"
    headerTheme="black-new"
    footerTheme="black-new"
    footerWithTopBorder
  >
    <Hero />
    <Logos className="my-[152px] 2xl:my-32 xl:my-28 lg:my-20 md:my-16" />
    <Metrics />
    <Estimates />
    <Calculator />
    <Faq />
    <CTA />
  </Layout>
);

export default PricingPage;
