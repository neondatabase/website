import React from 'react';

import Advantages from 'components/pages/home/advantages';
import CTA from 'components/pages/home/cta';
import DataBranching from 'components/pages/home/data-branching';
import Features from 'components/pages/home/features';
import Hero from 'components/pages/home/hero';
import SaaS from 'components/pages/home/saas';
import Scalability from 'components/pages/home/scalability';
import Storage from 'components/pages/home/storage';
import Layout from 'components/shared/layout';

const HomePage = () => (
  <Layout>
    <Hero />
    <CTA />
    <Advantages />
    <Features />
    <SaaS />
    <Scalability />
    <Storage />
    <DataBranching />
  </Layout>
);

export default HomePage;
