import Bento from 'components/pages/enterprise/bento';
import CaseStudies from 'components/pages/enterprise/case-studies';
import Faq from 'components/pages/enterprise/faq';
import Features from 'components/pages/enterprise/features';
import Hero from 'components/pages/enterprise/hero';
import HowNeonHelps from 'components/pages/enterprise/how-neon-helps';
import Usage from 'components/pages/enterprise/usage';
import CTA from 'components/shared/cta';
import Layout from 'components/shared/layout';
import Logos from 'components/shared/logos';
import TestimonialNew from 'components/shared/testimonial-new';
import LINKS from 'constants/links';
import SEO_DATA from 'constants/seo-data';
import dispatchLogo from 'icons/enterprise/case-studies/dispatch.svg';
import invencoLogo from 'icons/enterprise/case-studies/invenco.svg';
import mindvalleyLogo from 'icons/enterprise/case-studies/mindvalley.svg';
import neoTaxLogo from 'icons/enterprise/case-studies/neo-tax.svg';
import retoolLogo from 'icons/enterprise/case-studies/retool.svg';
import wordwareLogo from 'icons/enterprise/case-studies/wordware.svg';
import connectionIcon from 'icons/enterprise/connection.svg';
import durabilityIcon from 'icons/enterprise/durability.svg';
import expertiseIcon from 'icons/enterprise/expertise.svg';
import multiIcon from 'icons/enterprise/multi.svg';
import recoveryIcon from 'icons/enterprise/recovery.svg';
import scalabilityIcon from 'icons/enterprise/scalability.svg';
import authorAlexCo from 'images/authors/alex-co.jpg';
import authorCodyJenkins from 'images/authors/cody-jenkins.jpg';
import authorRobertChandler from 'images/authors/robert-chandler.jpg';
import apiMd from 'images/pages/enterprise/bento/api-md.jpg';
import api from 'images/pages/enterprise/bento/api.jpg';
import costEfficiencyMd from 'images/pages/enterprise/bento/cost-efficiency-md.jpg';
import costEfficiency from 'images/pages/enterprise/bento/cost-efficiency.jpg';
import instantDbMd from 'images/pages/enterprise/bento/instant-db-md.jpg';
import instantDb from 'images/pages/enterprise/bento/instant-db.jpg';
import integrationMd from 'images/pages/enterprise/bento/integration-md.jpg';
import integration from 'images/pages/enterprise/bento/integration.jpg';
import provenSuccessMd from 'images/pages/enterprise/bento/proven-success-md.jpg';
import provenSuccess from 'images/pages/enterprise/bento/proven-success.jpg';
import serverlessScalabilityMd from 'images/pages/enterprise/bento/serverless-scalability-md.jpg';
import serverlessScalability from 'images/pages/enterprise/bento/serverless-scalability.jpg';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.enterprise);

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
  'commure',
];

const features = [
  {
    icon: scalabilityIcon,
    title: 'Scalability',
    description:
      'Neon offers serverless Postgres, scaling CPU, memory, and connections instantly to match demand for optimal cost-performance.',
    url: '/docs/introduction/autoscaling',
  },
  {
    icon: multiIcon,
    title: 'Multi-tenancy',
    description:
      'Neon simplifies multi-tenant management by isolating tenants into regional projects, ensuring sovereignty, compliance, and no noise issues.',
    url: '/use-cases/database-per-tenant',
  },
  {
    icon: connectionIcon,
    title: 'Connection management',
    description:
      'Neon supports 10,000+ connections with no timeouts, ensuring consistent performance for real-time apps, APIs, and high-traffic systems.',
    url: '/docs/connect/connection-pooling',
  },
  {
    icon: recoveryIcon,
    title: 'Disaster recovery',
    description:
      'Neon simplifies disaster recovery with branching, letting you restore your database to any point instantly — no more lengthy backups.',
    url: '/blog/recover-large-postgres-databases',
  },
  {
    icon: durabilityIcon,
    title: 'Durability',
    description:
      'Neon ensures high availability with transactions replicated across AZs and data stored.',
    url: '/blog/our-approach-to-high-availability',
  },
  {
    icon: expertiseIcon,
    title: 'Postgres expertise',
    description:
      'Built by Postgres experts with decades of experience, Neon offers help with performance tuning, complex migrations, and more.',
    url: '/blog/top-3-features-in-postgres-17#contributions-by-neon-engineers-in-postgres-17',
  },
];

const caseStudies = [
  {
    title: '300k+ databases',
    description: 'managed by 1 engineer.',
    logo: {
      src: retoolLogo,
      width: 95,
      height: 24,
    },
    link: `${LINKS.blog}/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases`,
  },
  {
    title: '5x faster',
    description: 'environments creation.',
    logo: {
      src: mindvalleyLogo,
      width: 118,
      height: 24,
    },
    link: `${LINKS.blog}/how-mindvalley-minimizes-time-to-launch-with-neon-branches`,
  },
  {
    title: 'From days to minutes',
    description: 'development cycles.',
    logo: {
      src: neoTaxLogo,
      width: 91,
      height: 24,
    },
    link: `${LINKS.blog}/from-days-to-minutes-how-neo-tax-accelerated-their-development-lifecycle`,
  },
  {
    title: '95% fewer migration issues',
    description: 'thanks to preview branches.',
    logo: {
      src: wordwareLogo,
      width: 121,
      height: 24,
    },
    link: `${LINKS.blog}/building-ai-agents-just-got-faster-with-wordware-and-neon`,
  },
  {
    title: '80% savings',
    description: 'in&nbsp;database costs.',
    logo: {
      src: invencoLogo,
      width: 97,
      height: 24,
    },
    link: `${LINKS.blog}/why-invenco-migrated-from-aurora-serverless-v2-to-neon`,
  },
  {
    title: '10x less capacity',
    description: 'vs Aurora Global.',
    logo: {
      src: dispatchLogo,
      width: 104,
      height: 24,
    },
    link: `${LINKS.blog}/how-dispatch-speeds-up-development-with-neon-while-keeping-workloads-on-aurora`,
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
    challenge: 'Testing with incomplete or artificial data fails to uncover edge cases.',
    description:
      'You can directly deploy a branch with a transformed sample of production data, preserving production patterns and compliance without manual work.',
  },
  {
    title: 'Data consistency',
    challenge: 'Environments quickly get out of sync, making it harder to reproduce issues.',
    description:
      'You can update all environments in a single click, so developers can reproduce production issues accurately in a controlled environment.',
  },
  {
    title: 'Simplified maintenance',
    challenge:
      'Managing environments slows down development, introduces errors, and creates deployment bottlenecks.',
    description:
      'Ephemeral environments are created and discarded automatically via CI/CD and APIs, accelerating releases while boosting engineering productivity.',
  },
];

const bentoCards = [
  {
    title: 'Instant database provisioning.',
    description:
      'Neon enables the creation of new databases in under a second, allowing your users to start building right away.',
    image: instantDb,
    imageMd: instantDbMd,
    className: 'col-span-3 lg:col-span-4 sm:col-span-1',
  },
  {
    title: 'Proven success.',
    description: 'Top products like Replit, Vercel Postgres, and RetoolDB are built on Neon.',
    image: provenSuccess,
    imageMd: provenSuccessMd,
    className: 'col-span-2 lg:col-span-3 sm:col-span-1',
  },
  {
    title: 'Cost efficiency.',
    description: 'Scale-to-zero minimizes costs for inactive databases, saving money.',
    image: costEfficiency,
    imageLg: costEfficiencyMd,
    imageMd: costEfficiencyMd,
    className: 'col-span-2 lg:col-span-3 lg:-mr-[18%] sm:mx-0 sm:col-span-1',
  },
  {
    title: 'Powerful API.',
    description: 'Use the Neon API to create databases, run migrations, and manage limits.',
    image: api,
    imageLg: apiMd,
    imageMd: apiMd,
    className: 'col-span-2 lg:col-span-3 lg:col-start-5 lg:-ml-[18%] sm:mx-0 sm:col-span-1',
  },
  {
    title: 'Seamless integration.',
    description: 'Integrate Neon into your developer platform or AI Agent via API or OAuth.',
    image: integration,
    imageMd: integrationMd,
    className: 'col-span-2 lg:col-span-3 sm:col-span-1',
  },
  {
    title: 'Serverless scalability.',
    description:
      "Neon's architecture automatically adjusts resources based on demand, reducing manual load for developers and agents.",
    image: serverlessScalability,
    imageMd: serverlessScalabilityMd,
    className: 'col-span-3 lg:col-span-4 sm:col-span-1',
  },
];

const faqItems = [
  {
    question: 'Which companies are using Neon?',
    answer: `Neon serves a wide range of companies, from startups to large enterprises, across many industries. Over 18k new databases are created daily on Neon, supporting everything from startups building the next wave of AI tools to platforms like Vercel, Replit, and Retool. Visit our <a href="/case-studies">case studies page</a> to explore customer stories.`,
    initialState: 'open',
  },
  {
    question: 'Is Neon compliant?',
    answer: `Yes. Neon adheres to SOC 2, ISO 27001, ISO 27701 standards and complies with GDPR, CCPA, and HIPAA. <a href="/docs/security/compliance">Read more.</a>`,
  },
  {
    question: 'How secure is Neon’s platform?',
    answer: `Neon offers enterprise-grade security with SSL/TLS encryption, IP allowlisting, and AES-256 encryption for data at rest. Protected branches add additional layers of security. <a href="/docs/security/security-overview">Read more.</a>`,
  },
  {
    question: 'What level of uptime can I expect with Neon?',
    answer: `Neon offers a 99.95% uptime SLA for enterprise customers, ensuring consistent availability and performance for mission-critical applications. <a href="/neon-business-sla">Read more.</a>`,
  },
  {
    question: 'What kind of technical support does Neon provide?',
    answer: `Enterprise customers benefit from 24/7 priority support, giving you round-the-clock access to database experts for any issues or guidance needed. <a href="/docs/introduction/support">Read more.</a>`,
  },
  {
    question: 'In which cloud environments is Neon available?',
    answer: `Neon is available on both AWS and Azure cloud platforms. If you’re interested in Google Cloud Provider, <a href="/docs/introduction/regions#request-a-region">tell us here.</a>`,
  },
  {
    question: 'Does Neon offer annual contracts?',
    answer: `Yes, we provide annual contracts for Enterprise clients accounting for higher resource limits and dedicated requirements. If you’re interested, <a href="/contact-sales">contact us.</a>`,
  },
  {
    question: 'Can Neon help with migrations?',
    answer: `Absolutely. Our expert team assists Enterprise clients throughout the migration process. <a href="/contact-sales">Contact us</a> if you're considering migrating to Neon.`,
  },
  {
    question: 'What can I expect during the sales process?',
    answer: `Our sales process is designed to be smooth and flexible: <ol><li><b>Reach Out:</b> Fill out our contact form.</li><li><b>Information Gathering:</b> We’ll email you to learn more about your workload and requirements.</li><li><b>Call with Solutions Team:</b> Discuss timelines, configurations, and request demos or follow-ups.</li><li><b>Pricing Proposal:</b> Based on your inputs, we’ll provide a pricing proposal, often with a proof-of-concept migration plan.</li><li><b>Additional Details (if needed):</b> For complex setups, we may request more information, like itemized bills or specifics about your current environment.</li><li><b>Stakeholder Support:</b> We assist with security reviews, documentation, and answering any stakeholder questions.</li></ol> We’re always happy to adjust the process to fit your unique needs. <a href="/contact-sales">Reach out to us</a> and tell us about your use case: we're here to help.`,
  },
];

const EnterprisePage = () => (
  <Layout headerClassName="!absolute !bg-transparent">
    <Hero />
    <Logos className="mt-[102px] xl:mt-[86px] lg:mt-[76px] md:mt-[68px]" logos={logos} />
    <TestimonialNew
      className="mt-[118px] xl:mt-[80px] lg:mt-[76px]"
      quote="Neon worked out of the box, handling hundreds of Lambdas without any of the connection issues we saw in Aurora v2. On top of that, it costs us 1/6 of what we were paying with AWS."
      author={{
        name: 'Cody Jenkins',
        position: 'Head of Engineering at Invenco',
        avatar: authorCodyJenkins,
      }}
      isPriority
    />
    <Features title="Hundreds of Enterprises are switching to Neon. Here’s why" items={features} />
    <Usage />
    <CaseStudies items={caseStudies} />
    <HowNeonHelps tabs={howNeonHelpsTabs} />
    <TestimonialNew
      className="mt-[126px] xl:mt-[106px] lg:mt-[70px] md:mt-[58px]"
      quote="Time to launch is crucial for us: when we tried Neon and saw that spinning up a new ephemeral environment takes seconds, we were blown away."
      author={{
        name: 'Alex Co',
        position: 'Head of Platform Engineering at Mindvalley',
        avatar: authorAlexCo,
      }}
    />
    <Bento cards={bentoCards} />
    <TestimonialNew
      className="mt-[130px] xl:mt-[106px] lg:mt-[48px] md:mt-[62px]"
      quote="With Neon’s preview branches, we can catch issues early and fix them before they hit production."
      author={{
        name: 'Robert Chandler',
        position: 'CTO at Wordware.ai',
        avatar: authorRobertChandler,
      }}
    />
    <Faq items={faqItems} />
    <CTA
      className="pb-[300px] pt-[390px] xl:pb-[266px] xl:pt-[322px] lg:pb-[270px] lg:pt-[288px] md:pb-[170px] md:pt-[163px]"
      title="The Postgres of tomorrow, <br /> available today"
      titleClassName="!text-[68px] leading-none xl:!text-[56px] lg:!text-[40px] md:!text-[32px]"
      buttonText="Book a meeting with our team"
      buttonUrl={LINKS.contactSales}
    />
  </Layout>
);

export default EnterprisePage;
