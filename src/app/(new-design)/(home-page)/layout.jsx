import AiIndex from 'components/pages/home/ai-index';
import Bento from 'components/pages/home/bento';
import GetStarted from 'components/pages/home/get-started';
import Hero from 'components/pages/home/hero/hero';
import Industry from 'components/pages/home/industry';
import Lightning from 'components/pages/home/lightning';
import Logos from 'components/pages/home/logos';
import Multitenancy from 'components/pages/home/multitenancy';
import Trusted from 'components/pages/home/trusted';
import Layout from 'components/shared/layout';

const HomeLayout = () => (
  <Layout
    className="bg-black-pure"
    headerTheme="black-pure"
    footerTheme="black-pure"
    withOverflowHidden
    isNewDesign
  >
    <Hero />
    <Logos />
    <Lightning />
    <Bento />
    <AiIndex />
    <Multitenancy />
    <Industry />
    <Trusted />
    <GetStarted />
  </Layout>
);

export default HomeLayout;

export const revalidate = 60;
