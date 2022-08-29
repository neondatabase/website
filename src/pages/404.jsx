/* eslint-disable react/prop-types */
import React from 'react';

import Hero from 'components/pages/404/hero';
import Layout from 'components/shared/layout';

const NotFoundPage = ({ location: { pathname } }) => (
  <Layout seo={{ pathname }} headerTheme="white">
    <Hero />
  </Layout>
);

export default NotFoundPage;
