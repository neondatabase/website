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
  'zimmer',
  'outfront',
  'genomics',
  'supergood',
  'code-institute',
  'branch',
  'eqt',
  'retool',
  'master-school',
  'encore',
];

const sliderItems = [
  {
    text: 'Branching is as useful as we hoped it would be. Our testers can now play with features earlier, since we can now stage features, requiring different database migrations, in parallel.',
    authorName: 'Lynn Smeria',
    authorTitle: 'Principal Engineer at Proposales',
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
    <Plans className="my-[200px] scroll-mt-5 px-safe 2xl:mt-[156px] xl:mt-32 lg:mt-28 md:mt-20" />
    <Testimonials
      className="mb-[200px] min-h-[312px] 2xl:mb-[156px] xl:mb-32 xl:min-h-[290px] lg:mb-28 lg:min-h-[257px] md:mb-20 md:min-h-[225px] sm:min-h-[310px]"
      items={sliderItems}
    />
    <Faq />
    <CTA />
  </Layout>
);

export default PricingPage;
