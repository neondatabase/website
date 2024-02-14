import CaseStudies from 'components/pages/pricing/case-studies';
import CTA from 'components/pages/pricing/cta';
import Faq from 'components/pages/pricing/faq';
import Hero from 'components/pages/pricing/hero';
import Plans from 'components/pages/pricing/plans';
import Layout from 'components/shared/layout';
import Logos from 'components/shared/logos';
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
    text: 'Using Neon has meant our developers can continue to spend their time on things that meaningfully drive the business forward, instead of babysitting infrastructure.',
    authorName: 'Adithya Reddy',
    authorTitle: 'Developer at Branch',
  },
  {
    text: 'The combination of flexible resource limits and nearly instant database provisioning made Neon a no-brainer.',
    authorName: 'Lincoln Bergeson',
    authorTitle: 'Infrastructure Engineer at Replit',
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
    <Logos className="mt-36 pt-2.5 lg:mt-28 lg:pt-0 md:mt-20" logos={logos} />
    <CaseStudies className="mt-60 xl:mt-48 lg:mt-[124px] md:mt-[88px]" />
    <Testimonials className="mt-[156px] xl:mt-32 lg:mt-28 md:mt-20" items={sliderItems} />
    <Plans className="my-[200px] px-safe 2xl:mt-[156px] xl:mt-32 lg:mt-28 md:mt-20" />
    <Faq />
    <CTA />
  </Layout>
);

export default PricingPage;
