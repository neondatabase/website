import LINKS from 'constants/links';

// Neon services in the order the Console lists them, named the way the website names them
// (Lakebase Postgres, AI Gateway, ...), so a service reads the same on every page.
const NEON_SERVICES = [
  {
    id: 'postgres',
    label: 'Lakebase Postgres',
    description: 'Serverless Postgres with branching.',
    href: LINKS.lakebase,
  },
  {
    id: 'object-storage',
    label: 'Object Storage',
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
    label: 'AI Gateway',
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
    label: 'Managed Better Auth',
    description: 'Ready-to-use authentication for your app.',
    href: LINKS.authPage,
  },
];

export default NEON_SERVICES;
