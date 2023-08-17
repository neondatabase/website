import Cli from 'components/pages/aws/cli';
import Features from 'components/pages/aws/features';
import Hero from 'components/pages/aws/hero';
import Regions from 'components/pages/aws/regions';
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
    <Cli />
    <Regions />
  </Layout>
);

export default AWSPage;
