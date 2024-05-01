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
import compatibilityIcon from 'icons/ai/compatibility.svg';
import currencyIcon from 'icons/partners/currency.svg';
import speedIcon from 'icons/partners/speed.svg';
import userIcon from 'icons/partners/user.svg';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.partners);

const items = [
  {
    icon: compatibilityIcon,
    title: 'Deliver seamless experience',
    description:
      'Integrate a fully managed database directly into your platform for enhanced functionality.',
  },
  {
    icon: currencyIcon,
    title: 'Boost your revenue',
    description:
      'Tapping into additional revenue streams through Postgres as a value-added service.',
  },
  {
    icon: speedIcon,
    title: 'Accelerate onboarding',
    description:
      'Reduce friction and time-to-value for your users so they can start building instantly.',
  },
  {
    icon: userIcon,
    title: 'Meet customer demand',
    description: 'Postgres is the most-loved relational database by developers worldwide.',
  },
];

const logos = [
  'bunnyshell',
  'hasura',
  'replit',
  'vercel',
  'retool',
  'illa',
  'octolis',
  'cloudflare',
  'wundergraph',
  'fabric-io',
  'snaplet',
  'fl0',
  'encore',
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
      description="Follow the lead of Vercel, Retool, Replit, Koyeb, and many more."
      items={items}
      isGradientLabel
    />
    <Collaboration />
    <Integration />
    <Testimonial
      className="mt-[168px] 2xl:mt-40 xl:mt-36 lg:mt-28 md:mt-20"
      quoteClassName="text-[32px] xl:text-[28px] lg:text-xl md:text-lg"
      quote="We’ve been able to automate virtually all database tasks via the Neon API. This saved us a tremendous amount of time and engineering effort."
      name="Himanshu Bhandoh"
      position="Software Engineer at Retool"
    />
    <Plans className="mt-[176px] scroll-mt-5 px-safe 2xl:mt-[156px] xl:mt-32 lg:mt-28 md:mt-20" />
    <Apply />
  </Layout>
);

export default PartnersPage;
