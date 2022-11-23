import React from 'react';

import BranchData from 'components/pages/branching/branch-data';
import Hero from 'components/pages/branching/hero';
import Layout from 'components/shared/layout';

const BranchingPage = () => (
  <Layout headerTheme="black" footerTheme="black">
    <Hero />
    <BranchData />
  </Layout>
);

export default BranchingPage;
