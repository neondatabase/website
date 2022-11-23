import React from 'react';

import BranchData from 'components/pages/branching/branch-data';
import Hero from 'components/pages/branching/hero';
import Workflows from 'components/pages/branching/workflows';
import Layout from 'components/shared/layout';

const BranchingPage = () => (
  <Layout headerTheme="black" footerTheme="black">
    <Hero />
    <BranchData />
    <Workflows />
  </Layout>
);

export default BranchingPage;
