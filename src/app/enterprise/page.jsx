import Apply from 'components/pages/enterprise/apply';
import Benefits from 'components/pages/enterprise/benefits';
import Hero from 'components/pages/enterprise/hero';
import Logos from 'components/pages/partners/logos';
import Layout from 'components/shared/layout';
import SplitViewGrid from 'components/shared/split-view-grid';
import Testimonial from 'components/shared/testimonial';
import SEO_DATA from 'constants/seo-data';
import checkIcon from 'icons/enterprise/check.svg';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.enterprise);

const items = [
  {
    icon: checkIcon,
    title: 'SOC 2 Compliant',
    description: 'Neon has achieved SOC 2 Compliance.',
  },
  {
    icon: checkIcon,
    title: 'Audit Logging',
    description: 'All actions are logged and auditable for compliance and security purposes.',
  },
  {
    icon: checkIcon,
    title: 'IP Allow Rules',
    description: 'Lock down access to databases by IP address.',
  },
  {
    icon: checkIcon,
    title: 'Bring your Own S3',
    description:
      'Enterprise customers can control data sovereignty by bringing their own object storage.',
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

const EnterprisePage = () => (
  <Layout
    className="bg-black-new text-white"
    headerClassName="lg:!absolute lg:!bg-transparent"
    headerTheme="black-new"
    footerTheme="black-new"
    footerWithTopBorder
  >
    <Hero />
    <Logos logos={logos} withGreenFade />
    <Benefits />
    <Testimonial
      className="mt-[200px] 2xl:mt-40 xl:mt-36 lg:mt-28 md:mt-20"
      quote="Branching is as useful as we hoped it would be. Our testers can now play with features earlier, since we can now stage features, requiring different database migrations, in parallel."
      name="Lynn Smeria"
      position="Principle Engineer, Proposales"
    />
    <SplitViewGrid
      className="mt-[136px] xl:mt-[104px] lg:mt-20 md:mt-16"
      label="Security"
      title="Secure and Compliant"
      description="Neon is built to meet the most stringent security and compliance requirements."
      items={items}
    />
    <Apply />
  </Layout>
);

export default EnterprisePage;
