import React from 'react';

import Advantages from 'components/pages/home/advantages';
import CTA from 'components/pages/home/cta';
import Features from 'components/pages/home/features';
import Hero from 'components/pages/home/hero';
import SaaS from 'components/pages/home/saas';
import Layout from 'components/shared/layout';
import Subscribe from 'components/shared/subscribe';

const HomePage = () => (
  <Layout>
    <Hero />
    <CTA />
    <Advantages />
    <Features />
    <SaaS />
    <Subscribe />
  </Layout>
);

export default HomePage;
