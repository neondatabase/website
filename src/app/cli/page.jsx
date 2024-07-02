import Features from 'components/pages/cli/features';
import Hero from 'components/pages/cli/hero';
import Try from 'components/pages/cli/try';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.cli);

const CliPage = () => (
  <Layout>
    <Hero />
    <Features />
    <Try />
  </Layout>
);

export default CliPage;
