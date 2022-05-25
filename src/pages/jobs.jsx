/* eslint-disable react/prop-types */
import React from 'react';

import Hero from 'components/pages/jobs/hero';
import JobsList from 'components/pages/jobs/jobs-list';
import Layout from 'components/shared/layout';
import SubscribeMinimalistic from 'components/shared/subscribe-minimalistic';
import SEO_DATA from 'constants/seo-data';

const JobsPage = ({ location: { pathname } }) => (
  <Layout seo={{ ...SEO_DATA.jobs, pathname }} headerTheme="black">
    <Hero />
    <JobsList />
    <SubscribeMinimalistic />
  </Layout>
);

export default JobsPage;
