// Links and copy prompts for the docs home page.
//
// `promptSrc` is the prompt file that the linked page shows in its own
// <AgentPrompt> or <CopyPrompt>. When the linked page has no prompt, leave
// `promptSrc` out and the copy button falls back to `fallbackPrompt(to)`.
// docs-home-links.test.js checks each `promptSrc` against the linked page.

const SITE_URL = 'https://neon.com';

// Markdown version of a docs page, e.g. /docs/guides/nextjs ->
// https://neon.com/docs/guides/nextjs.md. Anchors are dropped.
export const markdownUrl = (to) => `${SITE_URL}${to.split('#')[0]}.md`;

export const fallbackPrompt = (to) =>
  `Fetch ${markdownUrl(to)} and follow the setup in this guide.`;

// Returns the props for a PromptCopyButton: the page's prompt file when there
// is one, otherwise the fallback text.
export const promptProps = ({ to, promptSrc }) =>
  promptSrc ? { src: promptSrc } : { text: fallbackPrompt(to) };

export const HERO_LINKS = [
  { title: 'Full backend quickstart', to: '/docs/get-started/full-backend-quickstart' },
  { title: 'Connect an existing app', to: '/docs/connect/connect-hub' },
];

export const FOUNDATION_CARD = {
  title: 'Create a database',
  line: 'Serverless Postgres that branches with your app.',
  product: 'Lakebase Postgres',
  to: '/docs/postgres/overview',
  promptSrc: '/prompts/postgres-landing.md',
};

// Capability cards, in the order of the Figma content container.
export const CAPABILITY_CARDS = [
  {
    title: 'Add login and users',
    line: 'Sign-in, sign-up, sessions, and OAuth, stored in your database.',
    product: 'Managed Better Auth',
    to: '/docs/auth/overview',
    icon: 'lock-landscape',
    promptSrc: '/prompts/auth-landing.md',
  },
  {
    title: 'Store files and media',
    line: 'Images, video, and user uploads that branch with your data.',
    product: 'Neon Object Storage',
    to: '/docs/storage/overview',
    icon: 'data',
    promptSrc: '/prompts/object-storage-landing.md',
  },
  {
    title: 'Deploy APIs and agents',
    line: 'Long-running Node.js for APIs, agents, webhooks, and cron.',
    product: 'Neon Functions',
    to: '/docs/compute/functions/overview',
    icon: 'code',
    promptSrc: '/prompts/functions-landing.md',
  },
  {
    title: 'Add live updates',
    line: 'UIs that update instantly when rows in your database change.',
    product: 'Neon Realtime',
    to: '/docs/realtime/overview',
    icon: 'zap',
    promptSrc: '/prompts/realtime-landing.md',
  },
  {
    title: 'Add search',
    line: 'Vector, full-text, and hybrid search, right in Postgres.',
    product: 'Lakebase Search',
    to: '/docs/ai/lakebase-search',
    icon: 'search',
    promptSrc: '/prompts/lakebase-search-landing.md',
  },
  {
    title: 'Add AI to your app',
    line: 'Chat, agents, and embeddings. Any model, one key.',
    product: 'Neon AI Gateway',
    to: '/docs/ai-gateway/overview',
    icon: 'sparkle',
    promptSrc: '/prompts/ai-gateway-landing.md',
  },
];

// Framework, language, and ORM quickstarts. This is the full list the original
// docs front page (the retired content/docs/introduction.md) rendered, in the same order,
// so the Frameworks section can show it all with CompactCards' `withToggler`
// (first 12 shown, the rest behind a Show more toggle) instead of a short
// hardcoded grid plus a navigate-away link. `icon` is the real technology-logo
// key read by CompactCards (public/images/technology-logos/<icon>.svg); React
// Router uses the `react` logo, matching the original list.
export const FRAMEWORKS = [
  {
    name: 'Next.js',
    icon: 'next-js',
    to: '/docs/guides/nextjs',
    promptSrc: '/prompts/nextjs-prompt.md',
  },
  {
    name: 'Django',
    icon: 'django',
    to: '/docs/guides/django',
    promptSrc: '/prompts/django-prompt.md',
  },
  {
    name: 'Drizzle',
    icon: 'drizzle',
    to: '/docs/guides/drizzle',
    promptSrc: '/prompts/drizzle-prompt.md',
  },
  { name: 'React Router', icon: 'react', to: '/docs/guides/react-router' },
  {
    name: 'TanStack Start',
    icon: 'tanstack',
    to: '/docs/guides/tanstack-start',
    promptSrc: '/prompts/tanstack-start-prompt.md',
  },
  {
    name: 'Express',
    icon: 'express',
    to: '/docs/guides/express',
    promptSrc: '/prompts/express-prompt.md',
  },
  {
    name: 'NestJS',
    icon: 'nest-js',
    to: '/docs/guides/nestjs',
    promptSrc: '/prompts/nestjs-prompt.md',
  },
  {
    name: 'Astro',
    icon: 'astro',
    to: '/docs/guides/astro',
    promptSrc: '/prompts/astro-serverless-prompt.md',
  },
  {
    name: 'SvelteKit',
    icon: 'svelte',
    to: '/docs/guides/sveltekit',
    promptSrc: '/prompts/sveltekit-prompt.md',
  },
  {
    name: 'Nuxt',
    icon: 'nuxt',
    to: '/docs/guides/nuxt',
    promptSrc: '/prompts/nuxt-neon-prompt.md',
  },
  {
    name: 'Laravel',
    icon: 'laravel',
    to: '/docs/guides/laravel',
    promptSrc: '/prompts/laravel-prompt.md',
  },
  {
    name: 'Rails',
    icon: 'rails',
    to: '/docs/guides/ruby-on-rails',
    promptSrc: '/prompts/ruby-on-rails-prompt.md',
  },
  {
    name: 'Python',
    icon: 'python',
    to: '/docs/guides/python',
    promptSrc: '/prompts/python-prompt.md',
  },
  { name: 'Go', icon: 'go', to: '/docs/guides/go', promptSrc: '/prompts/golang-prompt.md' },
  { name: 'Java', icon: 'java', to: '/docs/guides/java', promptSrc: '/prompts/java-prompt.md' },
  {
    name: 'Kotlin',
    icon: 'kotlin',
    to: '/docs/guides/kotlin',
    promptSrc: '/prompts/kotlin-prompt.md',
  },
  { name: 'Rust', icon: 'rust', to: '/docs/guides/rust', promptSrc: '/prompts/rust-prompt.md' },
  {
    name: '.NET',
    icon: 'dotnet',
    to: '/docs/guides/dotnet-npgsql',
    promptSrc: '/prompts/dotnet-prompt.md',
  },
  {
    name: 'Elixir',
    icon: 'elixir',
    to: '/docs/guides/elixir',
    promptSrc: '/prompts/elixir-prompt.md',
  },
  {
    name: 'Phoenix',
    icon: 'phoenix',
    to: '/docs/guides/phoenix',
    promptSrc: '/prompts/phoenix-prompt.md',
  },
  {
    name: 'Prisma',
    icon: 'prisma',
    to: '/docs/guides/prisma',
    promptSrc: '/prompts/prisma-prompt.md',
  },
  {
    name: 'Kysely',
    icon: 'kysely',
    to: '/docs/guides/kysely',
    promptSrc: '/prompts/kysely-prompt.md',
  },
  {
    name: 'Tortoise ORM',
    icon: 'tortoise-orm',
    to: '/docs/guides/tortoise-orm',
    promptSrc: '/prompts/tortoise-orm-prompt.md',
  },
  {
    name: 'TypeORM',
    icon: 'typeorm',
    to: '/docs/guides/typeorm',
    promptSrc: '/prompts/typeorm-prompt.md',
  },
  {
    name: 'SQLAlchemy',
    icon: 'sqlalchemy',
    to: '/docs/guides/sqlalchemy',
    promptSrc: '/prompts/sqlalchemy-prompt.md',
  },
  { name: 'Hono', icon: 'hono', to: '/docs/guides/hono', promptSrc: '/prompts/hono-prompt.md' },
  {
    name: 'SolidStart',
    icon: 'solidstart',
    to: '/docs/guides/solid-start',
    promptSrc: '/prompts/solidstart-prompt.md',
  },
  {
    name: 'Reflex',
    icon: 'reflex',
    to: '/docs/guides/reflex',
    promptSrc: '/prompts/reflex-prompt.md',
  },
  {
    name: 'JavaScript',
    icon: 'javascript',
    to: '/docs/guides/javascript',
    promptSrc: '/prompts/javascript-prompt.md',
  },
  {
    name: 'Symfony',
    icon: 'symfony',
    to: '/docs/guides/symfony',
    promptSrc: '/prompts/symfony-prompt.md',
  },
  {
    name: 'Quarkus',
    icon: 'quarkus',
    to: '/docs/guides/quarkus-jdbc',
    promptSrc: '/prompts/quarkus-jdbc-prompt.md',
  },
  {
    name: 'Micronaut',
    icon: 'micronaut',
    to: '/docs/guides/micronaut-kotlin',
    promptSrc: '/prompts/micronaut-kotlin-prompt.md',
  },
  {
    name: 'Redwood',
    icon: 'redwoodsdk',
    to: '/docs/guides/redwoodsdk',
    promptSrc: '/prompts/redwood-sdk-prompt.md',
  },
];

// Cursor, Claude Code, and Codex link to the install section of their own
// plugin page. GitHub Copilot has no plugin page, so it keeps pointing at its
// section of the MCP clients page. None of these pages has a prompt, so their
// copy buttons use the fallback prompt.
const MCP_HREF = '/docs/ai/connect-mcp-clients-to-neon';
export const AGENTS = [
  { name: 'Cursor', icon: 'cursor', to: '/docs/ai/ai-cursor-plugin#install-the-plugin-in-cursor' },
  {
    name: 'Claude Code',
    icon: 'claude-code',
    to: '/docs/ai/ai-claude-code-plugin#install-the-plugin-in-claude-code',
  },
  { name: 'Codex', icon: 'codex', to: '/docs/ai/ai-codex-plugin#install-the-plugin-in-codex' },
  { name: 'GitHub Copilot', icon: 'copilot', to: `${MCP_HREF}#vs-code-with-github-copilot` },
];

// Longer walkthroughs. `icon` is a real DetailIconCards monochrome icon name.
export const GUIDED_PATHS = [
  {
    title: 'Full backend quickstart',
    line: 'Next.js on Postgres, Auth, Storage, and AI, to deployed.',
    to: '/docs/get-started/full-backend-quickstart',
    icon: 'rocket',
  },
  {
    title: 'Tour the backend',
    line: 'How the pieces fit on one branch.',
    to: '/docs/get-started/backend-overview',
    icon: 'puzzle',
    promptSrc: '/prompts/neon-backend.md',
  },
  {
    title: 'Build a reactive app',
    line: 'Live queries with Realtime.',
    to: '/docs/realtime/quickstart',
    icon: 'zap',
    promptSrc: '/prompts/neon-realtime.md',
  },
];
