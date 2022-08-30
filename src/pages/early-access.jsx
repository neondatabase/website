/* eslint-disable react/prop-types */
import React from 'react';

import Hero from 'components/pages/early-access/hero';
import SEO from 'components/shared/seo';
import SEO_DATA from 'constants/seo-data';

const EarlyAccessPage = () => (
  <main>
    <Hero />
  </main>
);

export default EarlyAccessPage;

export const Head = ({ location: { pathname } }) => (
  <SEO {...SEO_DATA.earlyAccess} pathname={pathname} />
);
