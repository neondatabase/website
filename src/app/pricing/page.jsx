import Calculator from 'components/pages/pricing/calculator';
import CTA from 'components/pages/pricing/cta';
import Estimates from 'components/pages/pricing/estimates';
import Faq from 'components/pages/pricing/faq';
import Hero from 'components/pages/pricing/hero';
import Metrics from 'components/pages/pricing/metrics';
import Layout from 'components/shared/layout';

const PricingPage = () => (
  <Layout
    className="bg-pricing-black text-white"
    headerTheme="pricing"
    footerTheme="pricing"
    footerWithTopBorder
  >
    <div id="pricing-content" className="md:!h-auto">
      <div id="pricing-sticky" className="md:!static">
        <Hero />
        <Metrics />
        <Estimates />
        <Calculator />
        <Faq />
        <CTA />
      </div>
    </div>
  </Layout>
);

export default PricingPage;
