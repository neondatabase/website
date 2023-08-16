import Hero from 'components/pages/aws/hero';
import Features from 'components/pages/aws/hero/features';
import Layout from 'components/shared/layout';

const AWSPage = () => (
  <Layout
    className="bg-black-new text-white"
    headerTheme="black-new"
    footerTheme="black-new"
    footerWithTopBorder
  >
    <Hero />
    <Features />
  </Layout>
);

export default AWSPage;
