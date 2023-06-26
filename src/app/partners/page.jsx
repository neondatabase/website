import Benefits from 'components/pages/partners/benefits';
import Hero from 'components/pages/partners/hero';
import Layout from 'components/shared/layout';

const PartnersPage = () => (
  <Layout
    className="bg-black-new text-white"
    headerTheme="black-new"
    footerTheme="black-new"
    footerWithTopBorder
  >
    <Hero />
    <Benefits />
  </Layout>
);

export default PartnersPage;
