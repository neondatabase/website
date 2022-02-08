import React from 'react';

import Hero from 'components/pages/jobs/hero';
import JobsList from 'components/pages/jobs/jobs-list';
import Layout from 'components/shared/layout';
import Subscribe from 'components/shared/subscribe';

const HomePage = () => (
  <Layout headerTheme="black">
    <Hero />
    <JobsList />
    <Subscribe />
  </Layout>
);

export default HomePage;
