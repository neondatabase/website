import Apply from 'components/pages/partners/apply';
import Collaboration from 'components/pages/partners/collaboration';
import Hero from 'components/pages/partners/hero';
import Integration from 'components/pages/partners/integration';
import Plans from 'components/pages/partners/plans';
import Layout from 'components/shared/layout';
import Logos from 'components/shared/logos';
import SplitViewGrid from 'components/shared/split-view-grid';
import Testimonial from 'components/shared/testimonial';
import SEO_DATA from 'constants/seo-data';
import currencyIcon from 'icons/partners/currency.svg';
import priorityLowIcon from 'icons/partners/priority-low.svg';
import screenIcon from 'icons/partners/screen.svg';
import userIcon from 'icons/partners/user.svg';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.partners);

const items = [
  {
    icon: currencyIcon,
    title: 'Boost your revenue',
    description:
      'Offer Serverless Postgres to your customers by reselling Neon. We offer volume discounts.',
  },
  {
    icon: priorityLowIcon,
    title: 'Reduce costs',
    description:
      'Neon scales to zero when not in use and never overprovisions, making it cost-effective.',
  },
  {
    icon: userIcon,
    title: 'Meet customer demand',
    description:
      'Providing your customers with a fully-managed Postgres solution has never been easier.',
  },
  {
    icon: screenIcon,
    title: 'Scale effortlessly',
    description: 'Host fleets of databases that scale automatically to handle demanding workloads.',
  },
];

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
];

const PartnersPage = () => (
  <Layout
    className="bg-black-new text-white"
    headerClassName="lg:!absolute lg:!bg-transparent"
    headerTheme="black-new"
    footerTheme="black-new"
    footerWithTopBorder
  >
    <Hero />
    <Logos logos={logos} withGreenFade />
    <SplitViewGrid
      className="mt-36 xl:mt-[104px] lg:mt-20 md:mt-16"
      label="Benefits"
      title="Why become a partner?"
      description="At Neon, we deeply value our partners and believe they are vital to our mission of
            making Serverless Postgres the go-to choice for developers everywhere."
      items={items}
      isGradientLabel
    />
    <Testimonial
      className="mt-[200px] 2xl:mt-40 xl:mt-36 lg:mt-28 md:mt-20"
      quote="By partnering with Neon, Vercel’s frontend platform is now the end&#8209;to&#8209;end
          serverless solution for building on the Web, from Next.js all&nbsp;the way to SQL."
      name="Guillermo Rauch"
      position="CEO of Vercel"
    />
    <Plans className="my-[200px] scroll-mt-5 px-safe 2xl:mt-[156px] xl:mt-32 lg:mt-28 md:mt-20" />
    <Collaboration />
    <Integration />
    <Apply />
  </Layout>
);

export default PartnersPage;
