import React from 'react';

import Hero from 'components/pages/thank-you/hero';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';

const ThankYouPage = () => (
  <>
    <meta httpEquiv="x-ua-compatible" content="ie=edge" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
    />
    <title>{SEO_DATA.thankYou.title}</title>

    <Layout headerTheme="white" footerWithTopBorder>
      <Hero />
    </Layout>
  </>
);

export default ThankYouPage;
