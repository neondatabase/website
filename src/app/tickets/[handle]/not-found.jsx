import HeroNotFound from 'components/pages/tickets/social-share/hero-not-found';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA['404-ticket']);

const NotFoundPage = () => (
  <Layout>
    <HeroNotFound />
  </Layout>
);

export default NotFoundPage;
