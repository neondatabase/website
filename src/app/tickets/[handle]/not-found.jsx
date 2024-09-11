import HeroNotFound from 'components/pages/tickets/social-share/hero-not-found';
import Layout from 'components/shared/layout';
import SEO from 'components/shared/seo';
import SEO_DATA from 'constants/seo-data';

const NotFoundPage = () => (
  <>
    <SEO {...SEO_DATA['404-ticket']} />
    <Layout>
      <HeroNotFound />
    </Layout>
  </>
);

export default NotFoundPage;
