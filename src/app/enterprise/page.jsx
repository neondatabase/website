import Apply from 'components/pages/enterprise/apply';
import Benefits from 'components/pages/enterprise/benefits';
import Hero from 'components/pages/enterprise/hero';
import Layout from 'components/shared/layout';
import Logos from 'components/shared/logos';
import SplitViewGrid from 'components/shared/split-view-grid';
import Testimonial from 'components/shared/testimonial';
import SEO_DATA from 'constants/seo-data';
import auditIcon from 'icons/enterprise/audit.svg';
import ipIcon from 'icons/enterprise/ip.svg';
import s3Icon from 'icons/enterprise/s3.svg';
import socIcon from 'icons/enterprise/soc-2.svg';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata({
  ...SEO_DATA.enterprise,
  robotsNoindex: 'noindex',
});

const items = [
  {
    icon: socIcon,
    title: 'Compliant and secure',
    description: 'With SOC 2 Compliance. All actions are logged and auditable.',
  },
  {
    icon: auditIcon,
    title: 'Direct support',
    description: 'Submit issues via ticketing and get help from a dedicated team of engineers.',
  },
  {
    icon: ipIcon,
    title: 'Restrict access',
    description: 'Lock down access to production databases by IP address.',
  },
  {
    icon: s3Icon,
    title: 'For dev and prod',
    description: 'Reduce the costs of your entire deployment via scale-to-zero and autoscaling .',
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

const EnterprisePage = () => (
  <Layout headerClassName="!absolute !bg-transparent">
    <Hero />
    <Logos logos={logos} withGreenFade />
    <Benefits />
    <Testimonial
      className="mt-[200px] 2xl:mt-40 xl:mt-36 lg:mt-28 md:mt-20"
      quote="Branching is as useful as we hoped it would be. Our testers can now play with features earlier, since we can now stage features, requiring different database migrations, in parallel."
      name="Lynn Smeria"
      position="Principal Engineer, Proposales"
    />
    <SplitViewGrid
      className="mt-[136px] xl:mt-[104px] lg:mt-20 md:mt-16"
      label="Security"
      title="Built for teams"
      description="Improve your database efficiency while satisfying your security and compliance requirements."
      items={items}
    />
    <Apply />
  </Layout>
);

export default EnterprisePage;
