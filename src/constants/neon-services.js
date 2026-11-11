import LINKS from 'constants/links';

// Neon services in the order the Console lists them, with the Console's names and descriptions,
// so a service reads the same on the website and in the product.
const NEON_SERVICES = [
  {
    id: 'postgres',
    label: 'Postgres database',
    description: 'Serverless Postgres with branching.',
    href: LINKS.lakebase,
  },
  {
    id: 'object-storage',
    label: 'Object storage',
    description: 'Buckets for files and media.',
    href: LINKS.objectStorage,
  },
  {
    id: 'functions',
    label: 'Functions',
    description: 'Serverless functions next to your data.',
    href: LINKS.functions,
  },
  {
    id: 'ai-gateway',
    label: 'AI gateway',
    description: 'One endpoint for many AI models.',
    href: LINKS.aiGateway,
  },
  {
    id: 'realtime',
    label: 'Realtime',
    description: 'Live query results that update as your data changes.',
    href: LINKS.realtime,
  },
  {
    id: 'auth',
    label: 'Better Auth',
    description: 'Ready-to-use authentication for your app.',
    href: LINKS.authPage,
  },
];

export default NEON_SERVICES;
