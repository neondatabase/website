import LINKS from './links';

export const DEFAULT_IMAGE_PATH = '/images/social-previews/index.jpg?updated=2026-05-27';

export default {
  index: {
    title: 'Neon — Postgres backends for apps and agents',
    description:
      'The backend for apps and agents. Build with Lakebase Postgres, Auth, Functions, Storage, and an AI Gateway: instant, branchable, serverless.',
    pathname: '',
    markdownPath: '/index.md',
  },
  about: {
    title: 'About Neon: The Team Building the Backend for Apps and Agents',
    description:
      'Neon builds Lakebase Postgres and the backend for apps and agents. The team includes Postgres contributors, and Neon is part of Databricks.',
    pathname: '',
  },
  aiGateway: {
    title: 'AI Gateway — One API for frontier models | Neon',
    description:
      'Call frontier and open-weight models from your Neon backend with one credential, one bill, and zero markup.',
    pathname: LINKS.aiGateway,
    markdownPath: `${LINKS.aiGateway}.md`,
  },
  lakebase: {
    title: 'Lakebase Postgres — Postgres for apps and agents | Neon',
    description:
      'Build apps and agents on Lakebase Postgres: standard Postgres with instant branching, point-in-time restore, autoscaling, and scale to zero.',
    pathname: LINKS.lakebase,
    markdownPath: `${LINKS.lakebase}.md`,
  },
  aboutUs: {
    title: 'About Neon: The Team Building the Backend for Apps and Agents',
    description:
      'Neon builds Lakebase Postgres and the backend for apps and agents. The team includes Postgres contributors, and Neon is part of Databricks.',
    pathname: LINKS.aboutUs,
  },
  blog: {
    title: 'Neon Blog: Postgres, Backends for Agents, and Product Updates',
    description:
      'Engineering deep dives, product launches, and customer stories from the Neon team, covering Lakebase Postgres, branching, Managed Better Auth, Functions, Object Storage, and AI Gateway.',
    imagePath: '/images/social-previews/blog.jpg',
    pathname: LINKS.blog,
  },
  guides: {
    title: 'Neon Guides: Use Neon With Your Framework, ORM, and Tools',
    description:
      'Step-by-step guides for building with Neon: connect from frameworks and ORMs, add auth, run migrations, deploy functions, and integrate with third-party services.',
    pathname: LINKS.guides,
  },
  faqs: {
    title: 'Neon FAQs: Postgres, Auth, Storage, Functions, and AI Gateway',
    description:
      'Answers to common questions about building on Neon: Lakebase Postgres, Managed Better Auth, Object Storage, Functions, and AI Gateway, plus pricing, plans, and how Neon compares.',
    pathname: LINKS.faqs,
  },
  caseStudies: {
    title: 'Neon Case Studies: How Retool, Replit, and Others Build on the Neon Backend',
    description:
      'Customer stories from teams running on Neon, from Retool managing 300,000+ Postgres databases with one engineer to Replit provisioning a database for every app its agent builds.',
    pathname: LINKS.caseStudies,
    imagePath: '/images/social-previews/case-studies.jpg',
  },
  claimableNeon: {
    title: 'Claimable Neon for agents — Neon',
    description:
      'Let agents provision a temporary Neon project (Lakebase Postgres, Data API, and Managed Better Auth) before a human creates a Neon account.',
    pathname: LINKS.claimableNeon,
  },
  cli: {
    title: 'Neon CLI: Manage Postgres, Branches, and Your Backend From the Terminal',
    description:
      'Create projects, branch databases, get connection strings, and run neon init to set up your coding agent, all from the terminal. Scriptable for CI and easy for agents to call.',
    pathname: LINKS.cli,
    imagePath: '/images/social-previews/cli.jpg',
  },
  functions: {
    title: 'Neon Functions — Long-running serverless functions',
    description:
      'Run long-running Node.js functions next to Lakebase Postgres, with branch-aware data and Neon service credentials injected automatically.',
    pathname: LINKS.functions,
    markdownPath: `${LINKS.functions}.md`,
  },
  functionsTemplates: {
    title: 'Neon Function Registry: Templates for Neon Functions',
    description:
      "Open-source function templates, built with tools like Vercel's Chat SDK, Mastra, and TanStack AI, that you or your agent add to a Neon project with one command and start from working code.",
    pathname: LINKS.functionsTemplates,
  },
  auth: {
    title: 'Neon Auth — Managed Better Auth that branches with your backend',
    description:
      'Managed Better Auth built into Neon. Keep users, sessions, and auth configuration in Postgres, and test real login flows in isolated database branches.',
    pathname: LINKS.authPage,
    markdownPath: '/md/auth-page.md',
  },
  objectStorage: {
    title: 'Neon Object Storage — S3-compatible storage that branches',
    description:
      'S3-compatible object storage built into the Neon backend. Branch files alongside Postgres, use your existing S3 tools, and authenticate with a Neon credential.',
    pathname: LINKS.objectStorage,
    markdownPath: `${LINKS.objectStorage}.md`,
  },
  contactSales: {
    title: 'Contact Neon Sales: Enterprise Plans, Migrations, and Agent Platforms',
    description:
      'Talk to the Neon team about enterprise plans, multi-TB migrations, pricing for agent platforms and database fleets, and compliance requirements such as HIPAA.',
    pathname: LINKS.contactSales,
  },
  useCases: {
    title: 'Neon Use Cases: Full-Stack Apps, Agents, Platforms, Branching, and More',
    description:
      'How teams use Neon: full-stack apps deployed by coding agents, backends for app-generation agents, isolated Postgres for every platform user, a branch per pull request and preview, autoscaling for bursty workloads, and instant restores for multi-TB databases.',
    pathname: LINKS.useCases,
  },
  partners: {
    title: 'Accelerate your business with Neon partnership — Neon',
    description: 'Bring familiar, reliable and scalable Postgres experience to your customers.',
    imagePath: '/images/social-previews/partners.jpg',
    pathname: LINKS.partners,
  },
  pingThing: {
    pathname: LINKS.pingThing,
    robotsNoindex: 'noindex',
  },
  pricing: {
    title: 'Neon Pricing: Free Plan With 100 Projects, Typical Spend $15/Month',
    description:
      "Neon's Free plan is $0 with no credit card: 100 projects, each with 100 CU-hours and 1 GB of storage. Paid plans are usage-based with no monthly minimum and no per-project fee; typical spend is about $15/month for a small database on Launch and $701/month for a production workload on Scale.",
    imagePath: '/images/social-previews/pricing.jpg',
    pathname: LINKS.pricing,
  },
  report: {
    title: 'Impact of Postgres restores survey',
    description:
      'We asked 50 developers managing production Postgres about recovery times and their business impact.',
    pathname: LINKS.restoresSurvey,
    imagePath: '/images/social-previews/report.jpg',
  },
  variable: {
    title: 'Postgres Autoscaling: Compute That Follows Your Traffic | Neon',
    description:
      'Neon autoscales Postgres compute up and down as load changes, within limits you set, and scales to zero when idle. Stop provisioning for peak traffic and resizing instances by hand.',
    imagePath: '/images/social-previews/variable.jpg',
    pathname: LINKS.variableLoad,
  },
  branching: {
    title: 'Postgres Branching Workflows: Copy a Database in a Second | Neon',
    description:
      'Neon branches copy a Postgres database in about a second at any size, without duplicating storage. Give every developer, pull request, preview, and test run its own branch, and restore to any point in time.',
    imagePath: '/images/social-previews/branching.jpg',
    pathname: LINKS.branching,
    type: 'article',
  },
  platforms: {
    title: 'Embedded Postgres for Platforms: A Database per User via API | Neon',
    description:
      'Give every user, workspace, or generated app its own Postgres database. Neon projects provision in about a second, scale to zero when idle, and are managed through the API with per-project quotas. Retool manages 300,000+ databases this way.',
    pathname: LINKS.platforms,
    type: 'article',
    imagePath: '/images/social-previews/platforms.jpg',
  },
  storage: {
    title: 'Lakebase Postgres Storage: Bottomless, Copy-on-Write Database Storage',
    description:
      'How Lakebase Postgres separates database storage from compute. Data lives in cloud object storage with copy-on-write history, so you pay for what you store, branch multi-TB databases in seconds, and restore to any point.',
    pathname: LINKS.storage,
  },
  faster: {
    title: 'Faster on Neon: Open Source Demos and Customers Shipping Fast Apps',
    description:
      "Fast apps built on Neon: NextFaster's 400 ms initial page load, Retool's 300,000+ databases managed by one engineer, and Magic Circle's 2M+ game sessions, plus a latency calculator for your stack.",
    pathname: LINKS.faster,
  },
  security: {
    title: 'Neon Security and Compliance: SOC 2 Type II, ISO 27001, GDPR, HIPAA',
    description:
      'Neon is SOC 2 Type II, ISO 27001, and ISO 27701 certified and supports GDPR, CCPA, and HIPAA. Review encryption, access controls, sub-processors, and the Trust Center.',
    imagePath: '/images/social-previews/security.jpg',
    pathname: LINKS.security,
  },
  startups: {
    title: 'Neon Credits for Startups',
    description:
      'Apply to the Databricks Startup Program and get up to $200K in Neon and Databricks credits. For venture-backed companies and startup accelerator programs.',
    pathname: LINKS.startups,
  },
  tools: {
    title: 'Postgres Upgrade Assessment and Migration Assistant | Neon',
    description:
      'Plan a Postgres major version upgrade or migration: see what changes between versions, catch compatibility issues before you upgrade, and pick the right migration method for your database.',
    pathname: LINKS.tools,
  },
  autoscalingReport: {
    title: 'Neon Autoscaling Report: 2.4x Less Compute for Production Postgres',
    description:
      'What autoscaling does across production databases on Neon: 2.4x less compute and 50% lower cost than provisioning for peak, 4x less compute for read replicas, and 7.5x lower cost for small scale-to-zero workloads.',
    imagePath: '/images/social-previews/compute-autoscaling-report.jpg',
    pathname: LINKS.autoscalingReport,
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
