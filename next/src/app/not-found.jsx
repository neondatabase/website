import Hero from 'components/pages/404/hero';
import Layout from 'components/shared/layout';
import SEO from 'components/shared/seo';
import SEO_DATA from 'constants/seo-data';

const NotFoundPage = () => (
  <>
    <SEO {...SEO_DATA[404]} />
    <Layout headerTheme="white" footerWithTopBorder>
      <Hero />
    </Layout>
  </>
);

export default NotFoundPage;
