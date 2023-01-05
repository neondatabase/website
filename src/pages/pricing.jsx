/* eslint-disable react/prop-types */
import React from 'react';

import Hero from 'components/pages/pricing/hero';
import Layout from 'components/shared/layout';
import SEO from 'components/shared/seo';
import SEO_DATA from 'constants/seo-data';

const Pricing = () => (
  <Layout headerTheme="black" footerTheme="black" footerWithTopBorder>
    <Hero />
  </Layout>
);

export default Pricing;

export const Head = ({ location: { pathname } }) => (
  <SEO {...SEO_DATA.pricing} pathname={pathname} />
);
