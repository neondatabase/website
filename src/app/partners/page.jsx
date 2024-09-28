import Apply from 'components/pages/partners/apply';
import Collaboration from 'components/pages/partners/collaboration';
import Hero from 'components/pages/partners/hero';
import Integration from 'components/pages/partners/integration';
import CTAWithElephant from 'components/shared/cta-with-elephant';
import Layout from 'components/shared/layout';
import Logos from 'components/shared/logos';
import SplitViewGrid from 'components/shared/split-view-grid';
import Testimonial from 'components/shared/testimonial';
import LINKS from 'constants/links';
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
    title: 'Level up your platform',
    description: 'Start offering managed Postgres, the most-loved database by developers.',
  },
  {
    icon: currencyIcon,
    title: 'Budget-friendly',
    description: 'Thanks to scale-to-zero, empty databases cost you pennies. Pay for what you use.',
  },
  {
    icon: userIcon,
    title: 'On your terms',
    description: 'Integrate Neon as a third-party via OAuth or build your own product on top of it.',
  },
  {
    icon: speedIcon,
    title: 'Let us do the work',
    description: 'We host Postgres, you build. Handle all database tasks via an API.',
  },
];

const logos = [
  'bunnyshell',
  'hasura',
  'replit',
  'shakudo',
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
  <Layout headerClassName="!absolute !bg-transparent">
    <Hero />
    <Logos logos={logos} withGreenFade />
    <SplitViewGrid
      className="mt-36 xl:mt-[104px] lg:mt-20 md:mt-16"
      label="Benefits"
      title="Why partnering with Neon?"
      description="Let your end-users create isolated Postgres databases—while we handle the database management for you."
      items={items}
      isGradientLabel
    />
    <Testimonial
      className="mt-[176px] 2xl:mt-40 xl:mt-36 lg:mt-28 md:mt-20"
      quoteClassName="text-[32px] xl:text-[28px] lg:text-xl md:text-lg"
      quote="We’ve built RetoolDB while virtually automating all database tasks. This saved us a tremendous amount of time and engineering effort."
      name="Himanshu Bhandoh"
      position="Software Engineer at Retool"
    />
    <Collaboration />
    <Apply />
    <Integration />
    <CTAWithElephant
      className="mt-[178px] 2xl:mt-40 xl:mt-[125px] lg:mt-16 sm:mt-0"
      titleClassName="-mr-10 sm:max-w-[300px]"
      buttonClassName="px-[77px] xl:px-10 lg:px-9 sm:px-14"
      title="Don't know Neon? Try it first"
      description="Start by creating a Free account to get a feel for the platform."
      buttonText="Sign up"
      buttonUrl={LINKS.signup}
    />
  </Layout>
);

export default PartnersPage;
