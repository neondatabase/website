import LINKS from './links';

export const DEFAULT_IMAGE_PATH = '/images/social-previews/index.jpg?updated=2026-01-15';

export default {
  index: {
    title: 'Neon Serverless Postgres — Ship faster',
    description:
      'The database you love, on a serverless platform designed to help you build reliable and scalable applications faster.',
    pathname: '',
  },
  about: {
    title: 'About Us - Neon',
    description:
      'The Neon team consists of PostgreSQL contributors and technologists on a mission to create a cloud-native database service for every developer.',
    pathname: '',
  },
  ai: {
    title: 'Postgres for AI — Neon',
    description:
      'Build AI agents faster with Neon, the serverless Postgres optimized for vectors, scale, and speed.',
    imagePath: '/images/social-previews/ai.jpg',
    pathname: LINKS.ai,
  },
  aboutUs: {
    title: 'About Us — Neon',
    description:
      'The Neon team consists of PostgreSQL contributors and technologists on a mission to create a cloud-native database service for every developer.',
    pathname: LINKS.aboutUs,
  },
  blog: {
    title: 'Our Blog — Neon',
    description:
      'Learn about Neon and how it can help you build better with Serverless Postgres by reading our blog posts.',
    imagePath: '/images/social-previews/blog.jpg',
    pathname: LINKS.blog,
  },
  guides: {
    title: 'Guides — Neon',
    description: 'Learn how to use Neon with our guides.',
    pathname: LINKS.guides,
  },
  caseStudies: {
    title: 'Case Studies — Neon',
    description: 'Discover how other companies are using Neon.',
    pathname: LINKS.caseStudies,
    imagePath: '/images/social-previews/case-studies.jpg',
  },
  cli: {
    title: 'Your Neon workflow lives in the terminal',
    description: 'The Neon CLI brings serverless Postgres to your terminal.',
    pathname: LINKS.cli,
    imagePath: '/images/social-previews/cli.jpg',
  },
  contactSales: {
    title: 'Contact Sales — Neon',
    description: 'Interested in learning more about our plans and pricing? Contact our sales team.',
    pathname: LINKS.contactSales,
  },
  demos: {
    title: 'Serverless showcase: unleashing the power of Neon',
    description: 'Explore interactive demos unveiling cutting-edge apps in the serverless era.',
    pathname: LINKS.demos,
    imagePath: '/images/social-previews/demos.jpg',
  },
  enterprise: {
    title: 'Neon for Enterprise - Neon',
    description:
      'Switch to Neon for improved scalability, reliability, and engineering efficiency. For developers and AI Agents.',
    pathname: LINKS.enterprise,
    imagePath: '/images/social-previews/enterprise.jpg',
  },
  migration: {
    title: 'Postgres Migration — Neon',
    description: 'Learn how to migrate your Postgres database to Neon.',
    pathname: LINKS.migration,
    imagePath: '/images/social-previews/migration.jpg',
  },
  multiTB: {
    title: 'Neon for Multi-TB Migrations - Neon',
    description: 'Migrating a multi-TB workload? We can help.',
    pathname: LINKS.multiTB,
    imagePath: '/images/social-previews/multi-tb.jpg',
  },
  useCases: {
    title: 'Use Cases — Neon',
    description:
      'Explore how teams use Neon to support branching databases, CI pipelines, preview environments, and production workloads.',
    pathname: LINKS.useCases,
  },
  serverlessApps: {
    title: 'Postgres for serverless apps — Neon',
    description:
      'Scale your app effortlessly with Neon’s serverless Postgres. With automatic scaling, pooler built on pgBouncer, and usage-based pricing.',
    pathname: `${LINKS.useCases}/serverless-apps`,
    imagePath: '/images/social-previews/serverless-apps.jpg',
  },
  partners: {
    title: 'Accelerate your business with Neon partnership — Neon',
    description: 'Bring familiar, reliable and scalable Postgres experience to your customers.',
    imagePath: '/images/social-previews/partners.jpg',
    pathname: LINKS.partners,
  },
  pingThing: {
    robotsNoindex: 'noindex',
  },
  pricing: {
    title: 'Pricing — Neon',
    description:
      'Neon brings serverless architecture to Postgres, which allows us to offer you flexible usage and volume-based plans.',
    imagePath: '/images/social-previews/pricing.jpg',
    pathname: LINKS.pricing,
  },
  report: {
    title: 'Impact of Postgres restores survey',
    description:
      'We asked 50 developers managing production Postgres about recovery times and their business impact.',
    pathname: LINKS.report,
    imagePath: '/images/social-previews/report.jpg',
  },
  variable: {
    title: 'Dynamically scale your Postgres database — Neon',
    description:
      'Discover how Neon dynamically scales Postgres compute resources for optimal performance during peak traffic without overpaying.',
    imagePath: '/images/social-previews/variable.jpg',
    pathname: LINKS.variable,
  },
  costFleets: {
    title: 'Neon for platforms: Cost estimator',
    description:
      'Run thousands of Postgres databases for a fraction of the cost with Neon. Great for building your free tier.',
    imagePath: '/images/social-previews/cost-fleets.jpg',
    pathname: LINKS.costFleets,
  },
  branching: {
    title: 'Database Branching Workflows - Neon',
    description:
      'A new paradigm for managing Postgres. Instantly create, test, preview, and roll back environments with Neon’s powerful database branching.',
    imagePath: '/images/social-previews/branching.jpg',
    pathname: LINKS.branching,
    type: 'article',
  },
  platforms: {
    title: 'Embedded Postgres for Platforms - Neon',
    description: 'Offer Postgres to your users',
    pathname: LINKS.platforms,
    type: 'article',
  },
  security: {
    title: 'Security — Neon',
    description:
      "Discover Neon's security & compliance standards, including SOC 2, GDPR, and HIPAA, with encryption and access controls to protect your data.",
    imagePath: '/images/social-previews/security.jpg',
    pathname: LINKS.security,
  },
  startups: {
    title: 'Neon Startup Program',
    description:
      'Apply to the Neon Startup Program and get up to 100k in Neon credits. For venture-backed companies and startup accelerator programs.',
    pathname: LINKS.startups,
  },
  error: {
    title: 'Page Is Broken — Neon',
  },
  404: {
    title: 'Page Not Found — Neon',
  },
};

export const getBlogCategoryDescription = (category) => {
  switch (category) {
    case 'company':
      return 'Stay updated on the latest Neon company new and partnership announcements. Explore our blog posts for valuable insights and stay ahead in the world of serverless Postgres.';
    case 'engineering':
      return 'Dive into the technical depths of Neon serverless Postgres. Optimize performance, scalability, and reliability. Explore our cutting-edge approach.';
    case 'community':
      return 'Join the vibrant serverless Postgres community. Engage in discussions, tutorials, and success stories. Connect with developers and industry experts.';
    default:
      return 'Learn about Neon and how it can help you build better with Serverless Postgres by reading our blog posts.';
  }
};
