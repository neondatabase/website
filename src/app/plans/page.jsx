import Estimates from 'components/pages/plans/estimates';
import Faq from 'components/pages/plans/faq';
import Hero from 'components/pages/plans/hero';
import Layout from 'components/shared/layout';

const PlansPage = () => (
  <Layout
    className="bg-black text-white"
    headerTheme="black"
    footerTheme="black"
    footerWithTopBorder
  >
    <Hero />
    <Estimates />
    <Faq />
  </Layout>
);

export default PlansPage;
