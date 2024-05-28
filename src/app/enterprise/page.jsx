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

export const metadata = getMetadata(SEO_DATA.enterprise);

const items = [
  {
    icon: socIcon,
    title: 'SOC 2 Compliant',
    description: 'Neon has achieved SOC 2 Compliance.',
  },
  {
    icon: auditIcon,
    title: 'Audit Logging',
    description: 'All actions are logged and auditable for compliance and security purposes.',
  },
  {
    icon: ipIcon,
    title: 'IP Allow Rules',
    description: 'Lock down access to databases by IP address.',
  },
  {
    icon: s3Icon,
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
  <Layout isHeaderSticky isHeaderStickyOverlay>
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
      title="Secure and Compliant"
      description="Neon is built to meet the most stringent security and compliance requirements."
      items={items}
    />
    <Apply />
  </Layout>
);

export default EnterprisePage;
