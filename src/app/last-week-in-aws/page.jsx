import Community from 'components/pages/home/community';
import DataBranching from 'components/pages/home/data-branching';
import FirstSection from 'components/pages/home/first-section';
import Scalability from 'components/pages/home/scalability';
import SecondSection from 'components/pages/home/second-section';
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
  <Layout headerTheme="black" isSignIn footerWithTopBorder withOverflowHidden>
    <FirstSection />
    <Community />
    <Scalability />
    <Storage />
    <DataBranching />
    <SecondSection />
    <Subscribe />
  </Layout>
);

export default LastWeekInAWS;

export const revalidate = 60;
