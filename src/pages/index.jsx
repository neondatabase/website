import React from 'react';

import Advantages from 'components/pages/home/advantages';
import CTA from 'components/pages/home/cta';
import Hero from 'components/pages/home/hero';
import Video from 'components/pages/home/video';
import Layout from 'components/shared/layout';

const HomePage = () => (
  <Layout>
    <Hero />
    <CTA />
    <Video />
    <Advantages />
  </Layout>
);

export default HomePage;
