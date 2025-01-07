import Faq from 'components/pages/pricing/faq';
import Hero from 'components/pages/pricing/hero';
import Plans from 'components/pages/pricing/plans';
import CTA from 'components/shared/cta';
import Layout from 'components/shared/layout';
import Logos from 'components/shared/logos';
import LINKS from 'constants/links';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.pricing);

const logos = [
  'eqt',
  'openai',
  'zimmer',
  'outfront',
  'adobe',
  'genomics',
  'replit',
  'retool',
  'albertsons',
  'akqa',
  'vercel',
  'bcg',
  'wordware',
];

const PricingPage = () => (
  <Layout>
    <Hero />
    <Logos className="mt-[136px] xl:mt-28 lg:mt-24 lg:pt-0 md:mt-20" logos={logos} />
    <Plans className="my-[184px] scroll-mt-5 px-safe xl:my-40 lg:mt-32 md:my-20" />
    <Faq />
    <CTA
      className="pb-[350px] pt-[445px] xl:pb-[200px] xl:pt-[260px] lg:pb-[150px] lg:pt-[220px] sm:pb-[100px] sm:pt-[160px]"
      title="Still have a question?"
      description="Complete the form below to get in touch with our Sales team."
      buttonText="Talk to Sales"
      buttonUrl={LINKS.contactSales}
    />
  </Layout>
);

export default PricingPage;
