import React from 'react';

import CTA from 'components/pages/home/cta';
import Hero from 'components/pages/home/hero';
import Layout from 'components/shared/layout';

const HomePage = () => (
  <Layout>
    <Hero />
    <CTA />
  </Layout>
);

export default HomePage;
