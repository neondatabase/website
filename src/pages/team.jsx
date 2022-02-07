import React from 'react';

import CTA from 'components/pages/team/cta';
import Team from 'components/pages/team/team';
import Layout from 'components/shared/layout';

const TeamPage = () => (
  <Layout headerTheme="black">
    <Team />
    <CTA />
  </Layout>
);

export default TeamPage;
