import Benefits from 'components/pages/ai/benefits';
import CTA from 'components/pages/ai/cta';
import Examples from 'components/pages/ai/examples';
import Hero from 'components/pages/ai/hero';
import Integration from 'components/pages/ai/integration';
import Stats from 'components/pages/ai/stats';
import Testimonials from 'components/pages/ai/testimonials';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.ai);

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
    <Benefits />
    <Examples />
    <Testimonials />
    <CTA />
  </Layout>
);

export default AIPage;
