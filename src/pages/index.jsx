import React from 'react';

import Advantages from 'components/pages/home/advantages';
import CTA from 'components/pages/home/cta';
import Features from 'components/pages/home/features';
import Hero from 'components/pages/home/hero';
import SaaS from 'components/pages/home/saas';
import Scalability from 'components/pages/home/scalability';
import Layout from 'components/shared/layout';

const HomePage = () => (
  <Layout>
    <Hero />
    <CTA />
    <Advantages />
    <Features />
    <SaaS />
    <Scalability />
  </Layout>
);

export default HomePage;
