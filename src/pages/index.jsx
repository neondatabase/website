import React from 'react';

import CTA from 'components/pages/home/cta';
import Hero from 'components/pages/home/hero';
import Video from 'components/pages/home/video';
import Layout from 'components/shared/layout';

const HomePage = () => (
  <Layout>
    <Hero />
    <CTA />
    <Video />
  </Layout>
);

export default HomePage;
