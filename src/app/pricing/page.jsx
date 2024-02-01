import Logos from 'components/pages/partners/logos';
import CaseStudies from 'components/pages/pricing/case-studies';
import CTA from 'components/pages/pricing/cta';
import Estimates from 'components/pages/pricing/estimates';
import Faq from 'components/pages/pricing/faq';
import Hero from 'components/pages/pricing/hero';
import Layout from 'components/shared/layout';
import Testimonials from 'components/shared/testimonials';
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

const sliderItems = [
  {
    text: 'Branching is as useful as we hoped it would be. Our testers can now play with features earlier, since we can now stage features, requiring different database migrations, in parallel.',
    authorName: 'Lynn Smeria',
    authorTitle: 'Principle Engineer of Proposales',
  },
  {
    text: 'Branching is as useful as we hoped it would be. Our testers can now play with features earlier, since we can now stage features, requiring different database migrations, in parallel.',
    authorName: 'Lynn Smeria',
    authorTitle: 'Principle Engineer of Proposales',
  },
  {
    text: 'Branching is as useful as we hoped it would be. Our testers can now play with features earlier, since we can now stage features, requiring different database migrations, in parallel.',
    authorName: 'Lynn Smeria',
    authorTitle: 'Principle Engineer of Proposales',
  },
];

const PricingPage = () => (
  <Layout
    className="bg-black-new text-white"
    headerTheme="black-new"
    footerTheme="black-new"
    footerWithTopBorder
  >
    <Hero />
    <Logos className="mt-36 pt-2 lg:mt-28 lg:pt-0 md:mt-20" logos={logos} />
    <CaseStudies className="mt-64 xl:mt-48 lg:mt-[124px] md:mt-[88px]" />
    <Testimonials className="mt-[156px] xl:mt-32 lg:mt-28 md:mt-20" items={sliderItems} />
    <Estimates />
    <Faq />
    <CTA />
  </Layout>
);

export default PricingPage;
