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
    title: 'Supercharge your platform',
    description: 'Offer managed Postgres, the most-loved relational database by developers.',
  },
  {
    icon: currencyIcon,
    title: 'Scale as you go',
    description: 'Pay only for what you use, with scale to zero and usage-based pricing.',
  },
  {
    icon: userIcon,
    title: 'Accelerate onboarding',
    description: 'Reduce friction for your users so they can start building instantly.',
  },
  {
    icon: speedIcon,
    title: 'Easy management',
    description: 'Give dedicated URLs to your users and handle all database tasks via an API.',
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
      title="Why become a partner?"
      description="Follow the lead of Vercel, Retool, Replit, Koyeb, and many more."
      items={items}
      isGradientLabel
    />
    <Collaboration />
    <Apply />
    <Integration />
    <Testimonial
      className="mt-[176px] 2xl:mt-40 xl:mt-36 lg:mt-28 md:mt-20"
      quoteClassName="text-[32px] xl:text-[28px] lg:text-xl md:text-lg"
      quote="We’ve been able to automate virtually all database tasks via the Neon API. This saved us a tremendous amount of time and engineering effort."
      name="Himanshu Bhandoh"
      position="Software Engineer at Retool"
    />
    <CTAWithElephant
      className="mt-[178px] 2xl:mt-40 xl:mt-[125px] lg:mt-16 sm:mt-0"
      titleClassName="-mr-10 sm:max-w-[300px]"
      buttonClassName="px-[77px] xl:px-10 lg:px-9 sm:px-14"
      title="Ready to get started with Neon?"
      description="The fully managed multi-cloud Postgres with a generous free tier. We separated storage and compute to offer autoscaling, branching, and bottomless storage."
      buttonText="Sign up"
      buttonUrl={LINKS.signup}
    />
  </Layout>
);

export default PartnersPage;
