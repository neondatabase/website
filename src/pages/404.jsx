/* eslint-disable react/prop-types */
import React from 'react';

import Hero from 'components/pages/404/hero';
import Layout from 'components/shared/layout';
import SEO from 'components/shared/seo';

const NotFoundPage = () => (
  <Layout headerTheme="white">
    <Hero />
  </Layout>
);

export default NotFoundPage;

export const Head = ({ location: { pathname } }) => <SEO pathname={pathname} />;
