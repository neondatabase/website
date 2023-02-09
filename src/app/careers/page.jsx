'use client';

import Hero from 'components/pages/careers/hero';
import JobsList from 'components/pages/careers/jobs-list';
import Layout from 'components/shared/layout';
import SubscribeMinimalistic from 'components/shared/subscribe-minimalistic';

const CareersPage = () => (
  <Layout headerTheme="black">
    <Hero />
    <JobsList />
    <SubscribeMinimalistic />
  </Layout>
);

export default CareersPage;

export const revalidate = 60;
