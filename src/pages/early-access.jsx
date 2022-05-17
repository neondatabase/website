/* eslint-disable react/prop-types */
import React from 'react';

import Hero from 'components/pages/early-access/hero';
import SEO from 'components/shared/seo';
import SEO_DATA from 'constants/seo-data';

const EarlyAccessPage = ({ location: { pathname } }) => (
  <>
    <SEO {...SEO_DATA.earlyAccess} pathname={pathname} />
    <main>
      <Hero />
    </main>
  </>
);

export default EarlyAccessPage;
