import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.serverlessApps);

const ServerlessAppsPage = () => (
  <Layout headerWithBorder burgerWithoutBorder isHeaderSticky>
    <h1>Serverless Apps</h1>
  </Layout>
);

export default ServerlessAppsPage;
