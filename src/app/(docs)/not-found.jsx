import Hero from 'components/pages/error/hero';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';

const DocsNotFoundPage = () => (
  <div className="fixed inset-0 z-50 overflow-auto bg-white">
    <meta httpEquiv="x-ua-compatible" content="ie=edge" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
    />
    <title>{SEO_DATA[404].title}</title>

    <Layout>
      <Hero
        title="Page not found..."
        text="Sorry, the page you are looking for doesn't exist or has been moved."
      />
    </Layout>
  </div>
);

export default DocsNotFoundPage;
