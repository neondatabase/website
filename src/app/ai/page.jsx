import Boost from 'components/pages/ai/boost';
import Examples from 'components/pages/ai/examples';
import Hero from 'components/pages/ai/hero';
import Integration from 'components/pages/ai/integration';
import Stats from 'components/pages/ai/stats';
import CTAWithElephant from 'components/shared/cta-with-elephant';
import Layout from 'components/shared/layout';
import SplitViewGrid from 'components/shared/split-view-grid';
// import Testimonials from 'components/shared/testimonials';
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

// TODO: add links to original tweets?
// const sliderItems = [
//   {
//     text: 'What if PGVector was on steroids ?! <a href="https://twitter.com/raoufdevrel" target="_blank" rel="noreferrer noopener">@raoufdevrel</a> from <a href="https://twitter.com/neondatabase" target="_blank" rel="noreferrer noopener">@neondatabase</a> just did that with pg_embedding and made it available through <a href="https://twitter.com/LangChainAI" target="_blank" rel="noreferrer noopener">@LangChainAI</a>. I&apos;ll definitely give it a try on <a href="https://twitter.com/quivr_brain" target="_blank" rel="noreferrer noopener">@quivr_brain</a> and our 10 GiB of vectors that use PGVector',
//     authorName: 'Stan Girard',
//     authorTitle: 'Founder, Quivr',
//   },
//   {
//     text: '<a href="https://twitter.com/postgresql" target="_blank" rel="noreferrer noopener">@PostgreSQL</a> is popular database choice. Excited to share a new extension from <a href="https://twitter.com/neondatabase" target="_blank" rel="noreferrer noopener">@neondatabase</a> to help you use it for embeddings as well (with HNSW)!',
//     authorName: 'Harrison Chase',
//     authorTitle: 'Co-Founder and CEO, LangChainAI',
//   },
// ];

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
    <Boost />
    <Examples />
    {/* removed testimonials section for now as part of removing the pg_embedding references */}
    {/* <Testimonials
      className="mt-40 xl:mt-[120px] lg:mt-28 md:mt-20"
      itemClassName="min-h-[222px] md:min-h-[184px] sm:min-h-[252px]"
      items={sliderItems}
      theme="twitter"
    /> */}
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
