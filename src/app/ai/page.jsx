import Examples from 'components/pages/ai/examples';
import Hero from 'components/pages/ai/hero';
import Integration from 'components/pages/ai/integration';
import Stats from 'components/pages/ai/stats';
// import Testimonials from 'components/pages/ai/testimonials';
import CTAWithElephant from 'components/shared/cta-with-elephant';
import Layout from 'components/shared/layout';
import SplitViewGrid from 'components/shared/split-view-grid';
import LINKS from 'constants/links';
import SEO_DATA from 'constants/seo-data';
import compatibilityIcon from 'icons/ai/compatibility.svg';
import scalabilityIcon from 'icons/ai/scalability.svg';
import searchIcon from 'icons/ai/search.svg';
import updateIcon from 'icons/ai/update.svg';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.ai);

const items = [
  {
    icon: updateIcon,
    title: 'Reliable & actively maintained',
    description: 'The pgvector extension is open-source and actively maintained',
  },
  {
    icon: scalabilityIcon,
    title: 'Amazing scalability',
    description: 'Grow your vector stores without impacting search performance',
  },
  {
    icon: searchIcon,
    title: 'Blazingly fast search',
    description: 'Use HNSW indexes for fast and scalable vector similarity search in Postgres',
  },
  {
    icon: compatibilityIcon,
    title: 'Highly compatible',
    description: 'Use Neon with pgvector in your Postgres and LangChain projects',
  },
];

const AIPage = () => (
  <Layout
    className="bg-black-new text-white"
    headerTheme="black-new"
    footerTheme="black-new"
    footerWithTopBorder
  >
    <link
      rel="preload"
      href="/animations/pages/ai/scene.splinecode"
      as="fetch"
      crossOrigin="anonymous"
    />
    <Hero />
    <Stats />
    <Integration />
    <SplitViewGrid
      className="mt-52 xl:mt-36 lg:mt-[124px] md:mt-[88px]"
      label="Benefits"
      title="Vector search with Neon"
      description="Use the power of HNSW indexes to unlock new levels of efficiency in high-dimensional vector similarity search in Postgres"
      items={items}
      isGradientLabel
    />
    <Examples />
    {/* removed testimonials section for now as part of removing the pg_embedding references */}
    {/* <Testimonials /> */}
    <CTAWithElephant
      className="mt-[180px] 2xl:mt-40 xl:mt-[125px] lg:mt-16"
      buttonClassName="px-14 xl:px-10 lg:px-9 sm:px-14"
      title="Build your next AI app now with Neon"
      description="Neon offers flexible usage and volume-based plans. Contact our Sales team to learn more."
      buttonText="Contact Sales"
      buttonUrl={LINKS.contactSales}
      linkText="Learn more on GitHub"
      linkUrl="https://github.com/neondatabase/pg_embedding"
      linkTarget="_blank"
    />
  </Layout>
);

export default AIPage;
