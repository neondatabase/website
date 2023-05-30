import Hero from 'components/pages/404/hero';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';

const NotFoundPage = () => (
  <>
    <title>{SEO_DATA[404].title}</title>
    <Layout headerTheme="white" footerWithTopBorder>
      <Hero />
    </Layout>
  </>
);

export default NotFoundPage;
