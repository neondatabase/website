import Bento from 'components/pages/enterprise/bento';
import CaseStudies from 'components/pages/enterprise/case-studies';
import Faq from 'components/pages/enterprise/faq';
import Hero from 'components/pages/enterprise/hero';
import HowNeonHelps from 'components/pages/enterprise/how-neon-helps';
import Usage from 'components/pages/enterprise/usage';
import CTA from 'components/shared/cta';
import Layout from 'components/shared/layout';
import Logos from 'components/shared/logos';
import SplitViewGridNew from 'components/shared/split-view-grid-new';
import TestimonialNew from 'components/shared/testimonial-new';
import LINKS from 'constants/links';
import SEO_DATA from 'constants/seo-data';
import connectionIcon from 'icons/enterprise/connection.svg';
import durabilityIcon from 'icons/enterprise/durability.svg';
import expertiseIcon from 'icons/enterprise/expertise.svg';
import dispatch from 'icons/enterprise/impact/dispatch.svg';
import neoTax from 'icons/enterprise/impact/neo-tax.svg';
import multiIcon from 'icons/enterprise/multi.svg';
import recoveryIcon from 'icons/enterprise/recovery.svg';
import scalabilityIcon from 'icons/enterprise/scalability.svg';
import invenco from 'images/pages/contact-sales/invenco.svg';
import mindvalley from 'images/pages/contact-sales/mindvalley.svg';
import retool from 'images/pages/contact-sales/retool.svg';
import wordware from 'images/pages/contact-sales/wordware.svg';
import api from 'images/pages/enterprise/bento/api.jpg';
import costEfficiency from 'images/pages/enterprise/bento/cost-efficiency.jpg';
import instantDb from 'images/pages/enterprise/bento/instant-db.jpg';
import integration from 'images/pages/enterprise/bento/integration.jpg';
import provenSuccess from 'images/pages/enterprise/bento/proven-success.jpg';
import serverlessScalability from 'images/pages/enterprise/bento/serverless-scalability.jpg';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata({
  ...SEO_DATA.enterprise,
  robotsNoindex: 'noindex',
});

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

const splitItems = [
  {
    icon: scalabilityIcon,
    title: 'Scalability',
    description:
      'Neon offers serverless Postgres, scaling CPU, memory, and connections instantly to match demand for optimal cost-performance.',
    linkText: 'Learn more',
    linkUrl: '/',
  },
  {
    icon: multiIcon,
    title: 'Multi-tenancy',
    description:
      'Neon simplifies multi-tenant management by isolating tenants into regional projects, ensuring sovereignty, compliance, and no noise issues.',
    linkText: 'Learn more',
    linkUrl: '/',
  },
  {
    icon: connectionIcon,
    title: 'Connection management',
    description:
      'Neon supports 10,000+ connections with no timeouts, ensuring consistent performance for real-time apps, APIs, and high-traffic systems.',
    linkText: 'Learn more',
    linkUrl: '/',
  },
  {
    icon: recoveryIcon,
    title: 'Disaster recovery',
    description:
      'Neon simplifies disaster recovery with branching, letting you restore your database to any point instantly — no more lengthy backups.',
    linkText: 'Learn more',
    linkUrl: '/',
  },
  {
    icon: durabilityIcon,
    title: 'Durability',
    description:
      'Neon ensures high availability with transactions replicated across zones and data stored in object storage with 99.99999999% durability.',
    linkText: 'Learn more',
    linkUrl: '/',
  },
  {
    icon: expertiseIcon,
    title: 'Postgres expertise',
    description:
      'Built by Postgres experts with decades of experience, Neon offers help with performance tuning, complex migrations, and more.',
    linkText: 'Learn more',
    linkUrl: '/',
  },
];

const caseStudies = [
  {
    title: '300k+ databases',
    description: 'managed by 1 engineer.',
    logo: {
      src: retool,
      alt: 'Retool',
      width: 100,
      height: 24,
    },
    link: `${LINKS.blog}/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases`,
  },
  {
    title: '5x faster',
    description: 'environments creation.',
    logo: {
      src: mindvalley,
      alt: 'Mindvalley',
      width: 118,
      height: 24,
    },
    link: `${LINKS.blog}/how-mindvalley-minimizes-time-to-launch-with-neon-branches`,
  },
  {
    title: 'From days to minutes',
    description: 'development cycles.',
    logo: {
      src: neoTax,
      alt: 'Neo.Tax',
      width: 91,
      height: 24,
    },
    link: `${LINKS.blog}/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases`,
  },
  {
    title: '95% fewer migration issues',
    description: 'thanks to preview branches.',
    logo: {
      src: wordware,
      alt: 'Wordware',
      width: 125,
      height: 24,
    },
    link: `${LINKS.blog}/building-ai-agents-just-got-faster-with-wordware-and-neon`,
  },
  {
    title: '80% savings',
    description: 'in&nbsp;database costs.',
    logo: {
      src: invenco,
      alt: 'Invenco',
      width: 98,
      height: 24,
    },
    link: `${LINKS.blog}/why-invenco-migrated-from-aurora-serverless-v2-to-neon`,
  },
  {
    title: '10x less capacity',
    description: 'vs Aurora Global.',
    logo: {
      src: dispatch,
      alt: 'Dispatch',
      width: 104,
      height: 24,
    },
    link: `${LINKS.blog}/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases`,
  },
];

const howNeonHelpsTabs = [
  {
    title: 'Built-in environments',
    challenge:
      'Maintaining separate instances for development, testing, staging, and production is complex and resource-intensive.',
    description:
      'You can spin up new ephemeral environments instantly via branching within your production project, with data and schema reflecting the latest state.',
  },
  {
    title: 'Realistic test data',
    challenge:
      'Maintaining separate instances for development, testing, staging, and production is complex and resource-intensive.',
    description:
      'You can spin up new ephemeral environments instantly via branching within your production project, with data and schema reflecting the latest state.',
  },
  {
    title: 'Simplified maintenance',
    challenge:
      'Maintaining separate instances for development, testing, staging, and production is complex and resource-intensive.',
    description:
      'You can spin up new ephemeral environments instantly via branching within your production project, with data and schema reflecting the latest state.',
  },
  {
    title: 'Data consistency',
    challenge:
      'Maintaining separate instances for development, testing, staging, and production is complex and resource-intensive.',
    description:
      'You can spin up new ephemeral environments instantly via branching within your production project, with data and schema reflecting the latest state.',
  },
];

const bentoCards = [
  {
    title: 'Instant database provisioning.',
    description:
      'Neon enables the creation of new databases in under a second, allowing your users to start building right away.',
    image: {
      src: instantDb,
      width: 480,
      height: 384,
      // className: 'bottom-0 left-0 sm:-bottom-5 sm:-left-5 sm:w-[540px] sm:max-w-none',
    },
    className: 'col-span-3', // md:col-span-2 md:order-1 md:aspect-[1.882]
  },
  {
    title: 'Proven success.',
    description: 'Top products like Replit, Vercel Postgres, and RetoolDB are built on Neon.',
    image: {
      src: provenSuccess,
      width: 316,
      height: 384,
      // className: 'left-0 bottom-0 sm:inset-x-0 sm:mx-auto sm:bottom-2.5 sm:w-[262px]',
    },
    className: 'col-span-2', // md:col-span-1 md:order-2 md:aspect-[0.906]
  },
  {
    title: 'Cost efficiency.',
    description: 'Scale-to-zero minimizes costs for inactive databases, saving money.',
    image: {
      src: costEfficiency,
      width: 316,
      height: 384,
      // className: 'left-0 bottom-0 sm:inset-x-0 sm:mx-auto sm:bottom-2.5 sm:w-[262px]',
    },
    className: 'col-span-2', // md:col-span-1 md:order-3 md:aspect-[0.906]
  },
  {
    title: 'Powerful API.',
    description: 'Use the Neon API to create databases, run migrations, and manage limits.',
    image: {
      src: api,
      width: 316,
      height: 384,
      // className:
      //   'bottom-[55px] px-[34px] left-0 lg:px-5 lg:left-1.5 lg:bottom-[42px] md:px-9 md:-left-0.5 sm:left-0 sm:px-11 sm:bottom-8',
    },
    className: 'col-span-2', // md:col-span-1 md:order-5 md:aspect-[0.906]
  },
  {
    title: 'Seamless integration.',
    description: 'Neon supports OAuth and more for effortless Postgres embedding.',
    image: {
      src: integration,
      width: 316,
      height: 384,
      // className: 'bottom-0 left-0 md:-bottom-8',
    },
    className: 'col-span-2', // md:col-span-1 md:order-6 md:aspect-[0.906]
  },
  {
    title: 'Serverless scalability.',
    description:
      "Neon's architecture automatically adjusts resources based on demand, reducing manual load for developers and agents.",
    image: {
      src: serverlessScalability,
      width: 480,
      height: 384,
      // className: 'bottom-0 left-0 sm:-bottom-5 sm:-left-5 sm:w-[540px] sm:max-w-none',
    },
    className: 'col-span-3', // md:col-span-2 md:order-4 md:aspect-[1.882]
  },
];

const faqItems = [
  {
    question: 'Which companies are using Neon?',
    answer: `Neon serves a wide range of companies, from startups to large enterprises, across many industries. Over 4,000 new databases are created daily on Neon, supporting everything from startups building the next wave of AI tools to platforms like Vercel, Replit, and Retool. Visit our <a href="/case-studies">case studies page</a> to explore customer stories.`,
    initialState: 'open',
  },
  {
    question: 'Is Neon compliant?',
    answer: `Neon serves a wide range of companies, from startups to large enterprises, across many industries. Over 4,000 new databases are created daily on Neon, supporting everything from startups building the next wave of AI tools to platforms like Vercel, Replit, and Retool. Visit our <a href="/case-studies">case studies page</a> to explore customer stories.`,
  },
  {
    question: 'How secure is Neon’s platform?',
    answer: `Neon serves a wide range of companies, from startups to large enterprises, across many industries. Over 4,000 new databases are created daily on Neon, supporting everything from startups building the next wave of AI tools to platforms like Vercel, Replit, and Retool. Visit our <a href="/case-studies">case studies page</a> to explore customer stories.`,
  },
  {
    question: 'What level of uptime can I expect with Neon?',
    answer: `Neon serves a wide range of companies, from startups to large enterprises, across many industries. Over 4,000 new databases are created daily on Neon, supporting everything from startups building the next wave of AI tools to platforms like Vercel, Replit, and Retool. Visit our <a href="/case-studies">case studies page</a> to explore customer stories.`,
  },
  {
    question: 'What kind of technical support does Neon provide?',
    answer: `Neon serves a wide range of companies, from startups to large enterprises, across many industries. Over 4,000 new databases are created daily on Neon, supporting everything from startups building the next wave of AI tools to platforms like Vercel, Replit, and Retool. Visit our <a href="/case-studies">case studies page</a> to explore customer stories.`,
  },
  {
    question: 'In which cloud environments is Neon available?',
    answer: `Neon serves a wide range of companies, from startups to large enterprises, across many industries. Over 4,000 new databases are created daily on Neon, supporting everything from startups building the next wave of AI tools to platforms like Vercel, Replit, and Retool. Visit our <a href="/case-studies">case studies page</a> to explore customer stories.`,
  },
];

const EnterprisePage = () => (
  <Layout headerClassName="!absolute !bg-transparent">
    <Hero />
    <Logos className="mt-[105px]" logos={logos} />
    <TestimonialNew
      className="mt-[122px]"
      quote="Neon worked out of the box, handling hundreds of Lambdas without any of the connection issues we saw in Aurora v2. On top of that, it costs us 1/6 of what we were paying with AWS."
      name="Cody Jenkins"
      position="Head of Engineering at Invenco"
      logo={{ src: invenco, alt: 'Invenco', width: 98, height: 24 }}
    />
    <SplitViewGridNew
      className="mt-[200px]"
      title="Hundreds of Enterprises are switching to Neon. Here’s why"
      items={splitItems}
    />
    <Usage />
    <CaseStudies items={caseStudies} />
    <HowNeonHelps tabs={howNeonHelpsTabs} />
    <TestimonialNew
      className="mt-[144px]"
      quote="Time to launch is crucial for us: when we tried Neon and saw that spinning up a new ephemeral environment takes seconds, we were blown away."
      name="Alex Co"
      position="Head of Platform Engineering at Mindvalley"
      logo={{ src: mindvalley, alt: 'Mindvalley', width: 138, height: 28 }}
    />
    <Bento cards={bentoCards} />
    <TestimonialNew
      className="mt-[146px]"
      quote="With Neon’s preview branches, we can catch issues early and fix them before they hit production."
      name="Robert Chandler"
      position="CTO at Wordware.ai"
      logo={{ src: wordware, alt: 'Wordware', width: 144, height: 28 }}
    />
    <Faq items={faqItems} />
    <CTA
      className="pb-[300px] pt-[390px]"
      title="The Postgres of tomorrow, <br /> available today"
      titleClassName="!text-[68px]"
      buttonText="Book a meeting with our team"
      buttonUrl={LINKS.contactSales}
    />
  </Layout>
);

export default EnterprisePage;
