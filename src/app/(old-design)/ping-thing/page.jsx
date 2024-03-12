import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

// This page is intentionally blank.
// It's been added so the redirect in next.config.js can work with a rewrite to demos/ping-thing

export const metadata = getMetadata(SEO_DATA.pingThing);

const PingThingPage = () => (
  <Layout headerTheme="white">
    <div>Ping Thing</div>
  </Layout>
);

export default PingThingPage;
