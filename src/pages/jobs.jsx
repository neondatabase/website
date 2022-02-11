import React from 'react';

import Hero from 'components/pages/jobs/hero';
import JobsList from 'components/pages/jobs/jobs-list';
import Layout from 'components/shared/layout';
import SubscribeMinimalistic from 'components/shared/subscribe-minimalistic';

const pageMetadata = {
  title: 'Zenith - Jobs',
  description: 'Become a part of our team',
};

const HomePage = () => (
  <Layout headerTheme="black" pageMetadata={pageMetadata}>
    <Hero />
    <JobsList />
    <SubscribeMinimalistic />
  </Layout>
);

export default HomePage;
