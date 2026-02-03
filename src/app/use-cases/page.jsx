import Hero from 'components/pages/use-cases/hero';
import UseCaseCards from 'components/pages/use-cases/use-case-cards';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.useCases);

// TODO: Replace with CMS data
const USE_CASES_DATA = [
  {
    icon: 'connections',
    title: 'SaaS apps',
    description:
      'Build and scale your SaaS faster thanks to autoscaling, database branching, and the serverless operating model.',
    link: '/use-cases/saas',
    logo: 'retool',
    testimonial: {
      quote: (
        <>
          "Neon lets us <mark>spin up and manage databases</mark> programmatically, without thinking
          about infrastructure or long-running capacity."
        </>
      ),
      author: 'Jane Doe – Co-founder at Retool',
      caseStudyLink: '/case-studies/retool',
    },
    tags: [
      { title: 'SaaS apps', icon: 'incognito' },
      { title: 'Autoscaling', icon: 'incognito' },
    ],
  },
  {
    icon: 'scale-from-bottom-left',
    title: 'Platforms',
    description:
      'Allow your customers to have dedicated databases with instant provisioning and no database cluster to maintain.',
    link: '/use-cases/platforms',
    logo: 'invenco',
    testimonial: {
      quote: (
        <>
          "We migrated to Neon and now have <mark>zero database cluster to maintain</mark>. Our team
          can focus on product development."
        </>
      ),
      author: 'Mike Chen – VP Engineering at Invenco',
      caseStudyLink: '/case-studies/invenco',
    },
    tags: [
      { title: 'Platforms', icon: 'incognito' },
      { title: 'Multi-tenant', icon: 'incognito' },
    ],
  },
  {
    icon: 'window-code',
    title: 'Dev / Test',
    description:
      'Create instant database branches for development, testing, and CI/CD pipelines with zero infrastructure overhead.',
    link: '/use-cases/dev-test',
    logo: 'mindvalley',
    testimonial: {
      quote: (
        <>
          "Branching databases per deployment <mark>removed friction from our dev workflow</mark>.
          Every PR now gets its own database."
        </>
      ),
      author: 'Sarah Johnson – Engineering Lead at Mindvalley',
      caseStudyLink: '/case-studies/mindvalley',
    },
    tags: [
      { title: 'Branching', icon: 'incognito' },
      { title: 'CI/CD', icon: 'incognito' },
    ],
  },
  {
    icon: 'database',
    title: 'Database-per-tenant',
    description:
      'Manage millions of tenant databases with instant provisioning, allowing teams to manage many tenant databases efficiently.',
    link: '/use-cases/database-per-tenant',
    logo: 'neo-tax',
    testimonial: {
      quote: (
        <>
          "We stopped managing database infrastructure and{' '}
          <mark>reduced our ops burden by 80%</mark>. Neon handles the scaling automatically."
        </>
      ),
      author: 'Alex Rivera – CTO at NeoTax',
      caseStudyLink: '/case-studies/neo-tax',
    },
    tags: [
      { title: 'Multi-tenant', icon: 'incognito' },
      { title: 'Isolation', icon: 'incognito' },
    ],
  },
  {
    icon: 'sparkle-3',
    title: 'AI agents',
    description:
      'Power your AI agents with instant database provisioning. Connect to databases instantly as part of AI-driven workflows.',
    link: '/use-cases/ai-agents',
    logo: 'dispatch',
    testimonial: {
      quote: (
        <>
          "Our AI agents can <mark>spin up isolated databases in milliseconds</mark>. This changed
          how we build AI-powered applications."
        </>
      ),
      author: 'Emma Watson – Head of AI at Dispatch',
      caseStudyLink: '/case-studies/dispatch',
    },
    tags: [
      { title: 'AI agents', icon: 'incognito' },
      { title: 'Instant provisioning', icon: 'incognito' },
    ],
  },
  {
    icon: 'connections',
    title: 'Variable workloads',
    description:
      'Handle unpredictable traffic with autoscaling that adjusts compute resources based on demand, scaling to zero when idle.',
    link: '/use-cases/variable-workloads',
    logo: 'wordware',
    testimonial: {
      quote: (
        <>
          "With Neon's autoscaling, we <mark>pay only for what we use</mark>. Our costs dropped 60%
          while handling 10x more traffic spikes."
        </>
      ),
      author: 'David Kim – Founder at Wordware',
      caseStudyLink: '/case-studies/wordware',
    },
    tags: [
      { title: 'Autoscaling', icon: 'incognito' },
      { title: 'Scale to zero', icon: 'incognito' },
    ],
  },
];

const UseCasesPage = () => (
  <Layout>
    <Hero />
    <UseCaseCards
      className="pb-48 pt-24 lg:pb-32 lg:pt-20 md:pb-24 md:pt-16"
      items={USE_CASES_DATA}
    />
  </Layout>
);

export default UseCasesPage;
