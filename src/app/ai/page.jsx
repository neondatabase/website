import Hero from 'components/pages/ai/hero';
import Stats from 'components/pages/ai/stats';
import Layout from 'components/shared/layout';

const AIPage = () => (
  <Layout
    className="bg-black-new text-white"
    headerTheme="black-new"
    footerTheme="black-new"
    footerWithTopBorder
  >
    <Hero />
    <Stats />
  </Layout>
);

export default AIPage;
