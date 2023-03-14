import Estimates from 'components/pages/pricing/estimates';
import Hero from 'components/pages/pricing/hero';
import Layout from 'components/shared/layout';

const PricingPage = () => (
  <Layout
    className="bg-black text-white"
    headerTheme="black"
    footerTheme="black"
    footerWithTopBorder
  >
    <Hero />
    <Estimates />
  </Layout>
);

export default PricingPage;
