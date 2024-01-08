import Advantages from 'components/pages/home/advantages';
import CTA from 'components/pages/home/cta';
import DataBranching from 'components/pages/home/data-branching';
import Hero from 'components/pages/home/hero';
import NeonCli from 'components/pages/home/neon-cli';
import Partnership from 'components/pages/home/partnership';
import SaaS from 'components/pages/home/saas';
import Scalability from 'components/pages/home/scalability';
import Storage from 'components/pages/home/storage';
import Layout from 'components/shared/layout';
import Subscribe from 'components/shared/subscribe';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata({
  title: SEO_DATA.index.title,
  description: SEO_DATA.index.description,
  pathname: '/last-week-in-aws',
  robotsNoindex: 'noindex',
});

const LastWeekInAWS = () => (
  <Layout headerTheme="black" footerWithTopBorder withOverflowHidden>
    <Hero />
    <CTA />
    <Advantages />
    <Scalability />
    <Storage />
    <DataBranching />
    <NeonCli />
    <SaaS />
    <Partnership />
    <Subscribe />
  </Layout>
);

export default LastWeekInAWS;

export const revalidate = 60;
