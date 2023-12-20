import Logos from 'components/pages/partners/logos';
import CTA from 'components/pages/pricing/cta';
import Estimates from 'components/pages/pricing/estimates';
import Faq from 'components/pages/pricing/faq';
import Forecasting from 'components/pages/pricing/forecasting';
import Hero from 'components/pages/pricing/hero';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.pricing);

const logos = [
  'bunnyshell',
  'hasura',
  'replit',
  'vercel',
  'illa',
  'octolis',
  'cloudflare',
  'airplane',
  'wundergraph',
  'fabric-io',
  'snaplet',
  'fl0',
  'dynaboard',
  'opus',
];

const PricingPage = () => (
  <Layout
    className="bg-black-new text-white"
    headerTheme="black-new"
    footerTheme="black-new"
    footerWithTopBorder
  >
    <Hero />
    <Logos className="mt-36 xl:mt-40 lg:mt-28 md:mt-20" logos={logos} />
    <Forecasting />
    <Estimates />
    <Faq />
    <CTA />
  </Layout>
);

export default PricingPage;
