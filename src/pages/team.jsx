import React from 'react';

import CTA from 'components/pages/team/cta';
import Team from 'components/pages/team/team';
import Layout from 'components/shared/layout';

const pageMetadata = {
  title: 'Zenith - Team',
  description:
    'The Zenith team consists of PostgreSQL contributors and technologists on a mission to create a cloud-native database service for every developer.',
};

const TeamPage = () => (
  <Layout headerTheme="white" pageMetadata={pageMetadata}>
    <Team />
    <CTA />
  </Layout>
);

export default TeamPage;
