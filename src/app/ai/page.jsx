import CTA from 'components/pages/ai/cta';
import Examples from 'components/pages/ai/examples';
import Hero from 'components/pages/ai/hero';
import Integration from 'components/pages/ai/integration';
import Stats from 'components/pages/ai/stats';
import Testimonials from 'components/pages/ai/testimonials';
import Layout from 'components/shared/layout';
import SplitViewGrid from 'components/shared/split-view-grid';
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
    title: 'Reliable, fast updates',
    description: 'pg_embedding is open-source and maintained by a team of Postgres Hackers at Neon',
  },
  {
    icon: scalabilityIcon,
    title: 'Amazing scalability',
    description: 'Grow your vector stores without a drop in search performance',
  },
  {
    icon: searchIcon,
    title: 'Blazingly fast search',
    description: 'pg_embedding uses HNSW index, optimized faster vector search',
  },
  {
    icon: compatibilityIcon,
    title: 'High compatibility',
    description: 'Easily switch to pg_embedding in your Postgres and LangChain projects',
  },
];

const AIPage = () => (
  <Layout
    className="bg-black-new text-white"
    headerTheme="black-new"
    footerTheme="black-new"
    footerWithTopBorder
  >
    <Hero />
    <Stats />
    <Integration />
    <SplitViewGrid
      className="mt-52 xl:mt-36 lg:mt-[124px] md:mt-[88px]"
      label="Benefits"
      title="Vector search with Neon"
      description="Use the power of HNSW index to unlock new levels of efficiency in high-dimensional
            similarity search in Postgres"
      items={items}
      isGradientLabel
    />
    <Examples />
    <Testimonials />
    <CTA />
  </Layout>
);

export default AIPage;
