import LINKS from './links';

export const DEFAULT_IMAGE_PATH = '/images/social-previews/index.jpg';

export default {
  index: {
    title: 'Neon Serverless Postgres — Ship faster',
    description:
      'The database you love, on a serverless platform designed to help you build reliable and scalable applications faster.',
    pathname: '',
  },
  ai: {
    title: 'Postgres for AI — Neon',
    description:
      'Build AI agents faster with Neon, the serverless Postgres optimized for vectors, scale, and speed.',
    imagePath: '/images/social-previews/ai.jpg',
    pathname: LINKS.ai,
  },
  aiChat: {
    title: 'Neon AI Chat',
    description: 'AI assistant trained on documentation, help articles, and other content',
    pathname: LINKS.aiChat,
  },
  awsIsrael: {
    title: 'AWS Launches in Israel — Neon',
    description: 'Neon is delighted to support the 2023 launch of AWS in Israel.',
    imagePath: '/images/social-previews/aws-israel.jpg',
    pathname: LINKS.awsIsrael,
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
  branching: {
    title: 'Instant branching for Postgres — Neon',
    description:
      'Neon allows you to instantly branch your data the same way that you branch your code.',
    imagePath: '/images/social-previews/branching.jpg',
    pathname: LINKS.branching,
  },
  careers: {
    title: 'Careers — Neon',
    description:
      'Neon is a distributed team building open-source, cloud-native Postgres. We are a well-funded startup with deep knowledge of Postgres internals and decades of experience building databases.',
    imagePath: '/images/social-previews/careers.jpg',
    pathname: LINKS.careers,
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
  faster: {
    title: 'Faster is what we help you ship - Neon',
    description: 'A page dedicated to teams shipping faster experiences faster on Neon.',
    imagePath: '/images/social-previews/faster.jpg',
    pathname: LINKS.faster,
    type: 'article',
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
  deploy: {
    title: 'Neon Deploy — Neon',
    description:
      'Join us online on October 30th at 10:00 AM PT to learn how Neon empowers developers to ship faster with Postgres.',
    pathname: LINKS.deploy,
    imagePath: '/images/social-previews/deploy.jpg',
  },
  developerDays1: {
    title: 'Neon Developer Days — Neon',
    description:
      'Join us virtually on December 6th, 7th, and 8th to learn about Neon and how to build better with Serverless Postgres.',
    imagePath: '/images/social-previews/developer-days-1.jpg',
    pathname: LINKS.developerDays1,
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
  thankYou: {
    title: 'Thank you for subscribing — Neon',
    description: 'Thank you for subscribing to the Neon newsletter',
    pathname: LINKS.thankYou,
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
  flow: {
    title: 'Database Branching Workflows - Neon',
    description: 'Boost development velocity by adding data to your existing GitHub workflows',
    imagePath: '/images/social-previews/flow.jpg',
    pathname: LINKS.flow,
    type: 'article',
  },
  platforms: {
    title: 'Embedded Postgres for Platforms - Neon',
    description: 'Offer Postgres to your users',
    pathname: LINKS.platforms,
    type: 'article',
  },
  scalableArchitecture: {
    title: 'Neon Scalable Architecture — Neon',
    description:
      'Neon is a distributed team building open-source, cloud-native Postgres. We are a well-funded startup with deep knowledge of Postgres internals and decades of experience building databases.',
    pathname: LINKS.scalableArchitecture,
  },
  stage: {
    title: 'Neon Deploy Stage — Neon',
    description:
      'Join us online on October 30th at 10:00 AM PT to learn how Neon empowers developers to ship faster with Postgres.',
    pathname: LINKS.stage,
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
  generateTicket: {
    title: 'Grab the ticket for Neon Deploy',
    description:
      "Generate a unique ticket image with your GitHub profile and participate in Neon's right after the conference.",
    pathname: LINKS.generateTicket,
  },
  ticket({ name, login: gitHubHandle }) {
    const userName = name || gitHubHandle;

    return {
      title: `${userName}'s ticket for Neon Deploy - Neon`,
      description: `Join ${userName} virtually at Deploy on October 30th to learn how Neon empowers developers to ship faster with Postgres.`,
    };
  },
  '404-ticket': {
    title: 'Ticket Not Found - Neon',
    imagePath: '/images/social-previews/no-name-ticket.jpg',
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
