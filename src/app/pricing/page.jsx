import Calculator from 'components/pages/pricing/calculator';
import CTA from 'components/pages/pricing/cta';
import Estimates from 'components/pages/pricing/estimates';
import Faq from 'components/pages/pricing/faq';
import Hero from 'components/pages/pricing/hero';
import Metrics from 'components/pages/pricing/metrics';
import Layout from 'components/shared/layout';

const PricingPage = () => (
  <Layout
    className="bg-black-new text-white"
    headerTheme="pricing"
    footerTheme="pricing"
    footerWithTopBorder
  >
    <Hero />
    <Metrics />
    <Estimates />
    <Calculator />
    <Faq />
    <CTA />
  </Layout>
);

export default PricingPage;
