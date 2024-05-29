import Hero from 'components/pages/404/hero';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';

const NotFoundPage = () => (
  <>
    <meta httpEquiv="x-ua-compatible" content="ie=edge" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
    />
    <title>{SEO_DATA[404].title}</title>

    <Layout>
      <Hero />
    </Layout>
  </>
);

export default NotFoundPage;
