/* eslint-disable react/prop-types */
import React from 'react';

import Hero from 'components/pages/404/hero';
import Layout from 'components/shared/layout';
import SEO from 'components/shared/seo';
import SEO_DATA from 'constants/seo-data';

const NotFoundPage = () => (
  <Layout headerTheme="white">
    <Hero />
  </Layout>
);

export default NotFoundPage;

export const Head = ({ location: { pathname } }) => <SEO {...SEO_DATA[404]} pathname={pathname} />;
