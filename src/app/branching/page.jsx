import BranchData from 'components/pages/branching/branch-data';
import CTA from 'components/pages/branching/cta';
import Features from 'components/pages/branching/features';
import Hero from 'components/pages/branching/hero';
import Recovery from 'components/pages/branching/recovery';
import Workflows from 'components/pages/branching/workflows';
import Layout from 'components/shared/layout';

const BranchingPage = () => (
  <Layout headerTheme="black" footerTheme="black" footerWithTopBorder>
    <Hero />
    <BranchData />
    <Workflows />
    <Recovery />
    <Features />
    <CTA />
  </Layout>
);

export default BranchingPage;

export const revalidate = 60;
