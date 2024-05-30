import Examples from 'components/pages/cli/examples';
import Hero from 'components/pages/cli/hero';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.cli);

const CliPage = () => (
  <Layout>
    <Hero />
    <Examples />
  </Layout>
);

export default CliPage;
