import React from 'react';

import Hero from 'components/pages/early-access/hero';
import SEO from 'components/shared/seo';
import SEO_DATA from 'constants/seo-data';

const EarlyAccessPage = () => (
  <>
    <SEO {...SEO_DATA.earlyAccess} />
    <main>
      <Hero />
    </main>
  </>
);

export default EarlyAccessPage;
