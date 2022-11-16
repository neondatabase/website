/* eslint-disable react/prop-types */
import React from 'react';

import Hero from 'components/pages/developer-days/hero';
import Layout from 'components/shared/layout';
import SEO from 'components/shared/seo';
import SEO_DATA from 'constants/seo-data';

const DeveloperDays1 = () => (
  <Layout headerTheme="black" footerTheme="black" footerWithTopBorder>
    <Hero />
  </Layout>
);

export default DeveloperDays1;

export const Head = ({ location: { pathname } }) => (
  <SEO pathname={pathname} {...SEO_DATA.developerDays1} />
);
