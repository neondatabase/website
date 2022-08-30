/* eslint-disable react/prop-types */
import React from 'react';

import CTA from 'components/pages/team/cta';
import Team from 'components/pages/team/team';
import Layout from 'components/shared/layout';
import SEO from 'components/shared/seo';
import SEO_DATA from 'constants/seo-data';

const TeamPage = ({ location: { pathname } }) => (
  <Layout seo={{ ...SEO_DATA.team, pathname }} headerTheme="white">
    <Team />
    <CTA />
  </Layout>
);

export default TeamPage;

export const Head = ({ location: { pathname } }) => <SEO {...SEO_DATA.team} pathname={pathname} />;
