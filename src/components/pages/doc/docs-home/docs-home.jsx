import NextLink from 'next/link';
import PropTypes from 'prop-types';

import { CompactCards } from 'components/pages/doc/compact-cards';
import DetailIconCards from 'components/pages/doc/detail-icon-cards';
import DatabaseIcon from 'components/pages/doc/detail-icon-cards/images/database.inline.svg';
import Link from 'components/shared/link';
import { cn } from 'utils/cn';

import DocsHomeComposer from './docs-home-composer';
import DocsHomeCopyChip from './docs-home-copy-chip';
import { mutedText } from './docs-home-tokens';

// Capability cards, in the order of the Figma content container.
// Dashed underline for the hero links: 2px dashes on a 4px rhythm, offset 1px
// to match the Figma line. It spans the link, so it follows the text when the
// font size or fallback font changes.
const heroLinkUnderline =
  'absolute inset-x-0 bottom-0 h-px text-gray-new-50 [background-image:repeating-linear-gradient(to_right,currentColor_0_2px,transparent_2px_4px)] [background-position:-1px_0]';

const CAPABILITY_CARDS = [
  {
    title: 'Add login and users',
    line: 'Sign-in, sign-up, sessions, and OAuth, stored in your database.',
    product: 'Managed Better Auth',
    to: '/docs/auth/overview',
    icon: 'lock-landscape',
  },
  {
    title: 'Store files and media',
    line: 'Images, video, and user uploads that branch with your data.',
    product: 'Neon Object Storage',
    to: '/docs/storage/overview',
    icon: 'data',
  },
  {
    title: 'Deploy APIs and agents',
    line: 'Long-running Node.js for APIs, agents, webhooks, and cron.',
    product: 'Neon Functions',
    to: '/docs/compute/functions/overview',
    icon: 'code',
  },
  {
    title: 'Add live updates',
    line: 'UIs that update instantly when rows in your database change.',
    product: 'Neon Realtime',
    to: '/docs/realtime/overview',
    icon: 'zap',
  },
  {
    title: 'Add search',
    line: 'Vector, full-text, and hybrid search, right in Postgres.',
    product: 'Lakebase Search',
    to: '/docs/ai/lakebase-search',
    icon: 'search',
  },
  {
    title: 'Add AI to your app',
    line: 'Chat, agents, and embeddings for your users. Any model, one API key.',
    product: 'Neon AI Gateway',
    to: '/docs/ai-gateway/overview',
    icon: 'sparkle',
  },
];

// Framework, language, and ORM quickstarts. This is the full list the original
// docs front page (the retired content/docs/introduction.md) rendered, in the same order,
// so the Frameworks section can show it all with CompactCards' `withToggler`
// (first 12 shown, the rest behind a Show more toggle) instead of a short
// hardcoded grid plus a navigate-away link. `icon` is the real technology-logo
// key read by CompactCards (public/images/technology-logos/<icon>.svg); React
// Router uses the `react` logo, matching the original list.
const FRAMEWORKS = [
  { name: 'Next.js', icon: 'next-js', to: '/docs/guides/nextjs' },
  { name: 'Django', icon: 'django', to: '/docs/guides/django' },
  { name: 'Drizzle', icon: 'drizzle', to: '/docs/guides/drizzle' },
  { name: 'React Router', icon: 'react', to: '/docs/guides/react-router' },
  { name: 'TanStack Start', icon: 'tanstack', to: '/docs/guides/tanstack-start' },
  { name: 'Express', icon: 'express', to: '/docs/guides/express' },
  { name: 'NestJS', icon: 'nest-js', to: '/docs/guides/nestjs' },
  { name: 'Astro', icon: 'astro', to: '/docs/guides/astro' },
  { name: 'SvelteKit', icon: 'svelte', to: '/docs/guides/sveltekit' },
  { name: 'Nuxt', icon: 'nuxt', to: '/docs/guides/nuxt' },
  { name: 'Laravel', icon: 'laravel', to: '/docs/guides/laravel' },
  { name: 'Rails', icon: 'rails', to: '/docs/guides/ruby-on-rails' },
  { name: 'Python', icon: 'python', to: '/docs/guides/python' },
  { name: 'Go', icon: 'go', to: '/docs/guides/go' },
  { name: 'Java', icon: 'java', to: '/docs/guides/java' },
  { name: 'Kotlin', icon: 'kotlin', to: '/docs/guides/kotlin' },
  { name: 'Rust', icon: 'rust', to: '/docs/guides/rust' },
  { name: '.NET', icon: 'dotnet', to: '/docs/guides/dotnet-npgsql' },
  { name: 'Elixir', icon: 'elixir', to: '/docs/guides/elixir' },
  { name: 'Phoenix', icon: 'phoenix', to: '/docs/guides/phoenix' },
  { name: 'Prisma', icon: 'prisma', to: '/docs/guides/prisma' },
  { name: 'Kysely', icon: 'kysely', to: '/docs/guides/kysely' },
  { name: 'Tortoise ORM', icon: 'tortoise-orm', to: '/docs/guides/tortoise-orm' },
  { name: 'TypeORM', icon: 'typeorm', to: '/docs/guides/typeorm' },
  { name: 'SQLAlchemy', icon: 'sqlalchemy', to: '/docs/guides/sqlalchemy' },
  { name: 'Hono', icon: 'hono', to: '/docs/guides/hono' },
  { name: 'SolidStart', icon: 'solidstart', to: '/docs/guides/solid-start' },
  { name: 'Reflex', icon: 'reflex', to: '/docs/guides/reflex' },
  { name: 'JavaScript', icon: 'javascript', to: '/docs/guides/javascript' },
  { name: 'Symfony', icon: 'symfony', to: '/docs/guides/symfony' },
  { name: 'Quarkus', icon: 'quarkus', to: '/docs/guides/quarkus-jdbc' },
  { name: 'Micronaut', icon: 'micronaut', to: '/docs/guides/micronaut-kotlin' },
  { name: 'Redwood', icon: 'redwoodsdk', to: '/docs/guides/redwoodsdk' },
];

// Cursor, Claude Code, and Codex link to the install section of their own
// plugin page. GitHub Copilot has no plugin page, so it keeps pointing at its
// section of the MCP clients page.
const MCP_HREF = '/docs/ai/connect-mcp-clients-to-neon';
const AGENTS = [
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
const GUIDED_PATHS = [
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
  },
  {
    title: 'Build a reactive app',
    line: 'Live queries with Realtime.',
    to: '/docs/realtime/quickstart',
    icon: 'zap',
  },
];

// Section introductions sit beside their content, stacking when the page narrows.
const Section = ({ heading, description, children }) => (
  <section className="grid grid-cols-[240px_minmax(0,1fr)] items-start gap-x-14 border-t border-gray-new-90 pt-14 pb-24 @max-[900px]:grid-cols-1 @max-[900px]:gap-y-6 dark:border-gray-new-20 xl:gap-x-10 md:pt-10 md:pb-16">
    <div className="grid content-start gap-2">
      <h2 className="m-0 font-sans text-[26px] leading-tight font-medium tracking-[-0.04em] text-balance dark:text-white md:text-2xl">
        {heading}
      </h2>
      {description && (
        <span className={cn('text-base leading-[1.5] opacity-90', mutedText)}>{description}</span>
      )}
    </div>
    <div className="@container min-w-0">{children}</div>
  </section>
);

Section.propTypes = {
  heading: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.node,
};

// Full-width Postgres foundation card from the Figma content container.
const FoundationCard = () => (
  <div
    className={cn(
      'group relative flex min-h-[142px] items-end justify-between gap-6 border p-4 transition-colors hover:border-green-44 @max-[680px]:flex-col @max-[680px]:items-start @max-[680px]:gap-5',
      'border-green-44/70 bg-[#E4F1EB]/40 dark:border-green-44/30 dark:bg-[#101815]'
    )}
  >
    <NextLink
      href="/docs/postgres/overview"
      aria-label="Create a database"
      className="absolute inset-0"
    />
    <div className="flex min-w-0 flex-col gap-8">
      <span className="flex items-center gap-3 text-green-44 dark:text-green-52">
        <DatabaseIcon className="size-6 shrink-0 [&_*]:[stroke-width:1.5] [&_*]:[stroke-linecap:round] [&_*]:[stroke-linejoin:round] [&_*]:[vector-effect:non-scaling-stroke]" />
        <span className="font-mono text-xs leading-4 font-medium tracking-[0.02em] uppercase">
          Lakebase Postgres
        </span>
      </span>
      <div className="flex flex-col gap-1.5">
        <span className="font-sans text-lg leading-snug font-medium tracking-[-0.02em] text-black-pure dark:text-white">
          Create a database
        </span>
        <span className="text-[15px] leading-snug text-gray-new-45 dark:text-gray-new-60">
          Serverless Postgres that branches with your app.
        </span>
      </div>
    </div>
    <div className="relative z-10 flex shrink-0 gap-2">
      {[
        ['Connect', '/docs/connect/connect-hub'],
        ['Branching', '/docs/introduction/branching'],
      ].map(([label, to]) => (
        <Link
          key={label}
          to={to}
          className="flex items-center gap-1.5 rounded-full border border-green-44/50 bg-white px-3 py-1.5 text-sm leading-5 tracking-[-0.01em] text-[#1A1A1A] transition-colors hover:border-green-44 hover:bg-green-44/5 dark:border-gray-new-40 dark:bg-white/[0.02] dark:text-white dark:hover:border-gray-new-60"
        >
          {label}
          <span
            className="font-mono text-[13px] leading-5 font-medium tracking-normal text-green-44 dark:text-green-52"
            aria-hidden
          >
            →
          </span>
        </Link>
      ))}
    </div>
  </div>
);

// Match the reference's 1200px page while keeping the mobile container gutters.
const DocsHome = () => (
  <div className="@container w-full min-w-0 font-sans tracking-[-0.02em] text-black-pure dark:bg-black-pure dark:text-white">
    <div className="@container w-full max-w-[1200px] px-[clamp(0px,2cqi,24px)] lg:px-0">
      {/* The intro and composer share the hero row on wide screens. */}
      <section className="grid grid-cols-[minmax(0,47fr)_minmax(0,53fr)] items-start gap-x-16 gap-y-10 pt-0 pb-24 @max-[900px]:grid-cols-1 xl:gap-x-10 xl:pt-3 lg:py-16 md:py-14">
        <div className="grid content-start gap-6">
          {/*
            Heading unit: the docs label as the H1, with the product descriptor
            as a calm subhead held close beneath it. The links sit a step below.
          */}
          <div className="grid gap-3">
            <h1 className="m-0 font-sans text-[40px] leading-[1.25] font-medium tracking-[-0.04em] text-balance md:text-[36px]">
              Neon Docs
            </h1>
            <p className="m-0 text-lg leading-normal tracking-[-0.025em] [text-wrap:pretty] text-gray-new-30 dark:text-gray-new-80 md:text-base">
              Learn to build and scale apps with Neon&apos;s complete backend platform.
            </p>
          </div>
          <div className="flex flex-wrap items-start gap-x-6 gap-y-2 text-base">
            <Link
              to="/docs/get-started/full-backend-quickstart"
              className="relative text-base leading-8 text-gray-new-45 transition-colors hover:text-gray-new-30 dark:text-gray-new-70 dark:hover:text-white"
            >
              Full backend quickstart
              <span className={heroLinkUnderline} aria-hidden />
            </Link>
            <Link
              to="/docs/connect/connect-hub"
              className="relative text-base leading-8 text-gray-new-45 transition-colors hover:text-gray-new-30 dark:text-gray-new-70 dark:hover:text-white"
            >
              Connect an existing app
              <span className={heroLinkUnderline} aria-hidden />
            </Link>
          </div>
        </div>
        <DocsHomeComposer />
      </section>

      {/* Start building */}
      <Section
        heading="Start building"
        description="Add these to your app. Every capability runs on the same Postgres branch."
      >
        <div className="grid gap-5">
          <FoundationCard />
          {/*
            Capability cards rendered with the real docs card component
            (DetailIconCards), fed MDX-style <a> children, in the site's regular
            `green-flat` theme (the same green-tinted treatment the former
            docs front page used for its Products grid). The product name sits in
            a lockup line at the top of the card (icon + name, via the
            component's `lockup` prop), so the card keeps its task-first title
            while still teaching the product name. The eslint-disable keeps the
            component-only props (`description`, `icon`, `lockup`) from being
            stripped by `eslint --fix` as unknown DOM attributes.
          */}
          {/* eslint-disable react/no-unknown-property */}
          <DetailIconCards
            className="my-0! @max-[720px]:grid-cols-2 @max-[480px]:grid-cols-1"
            cols={3}
            theme="green-flat"
            appearance="home"
          >
            {CAPABILITY_CARDS.map((c) => (
              <a key={c.to} href={c.to} description={c.line} icon={c.icon} lockup={c.product}>
                {c.title}
              </a>
            ))}
          </DetailIconCards>
          {/* eslint-enable react/no-unknown-property */}
        </div>
      </Section>

      {/* Frameworks */}
      <Section
        heading="Frameworks"
        description="Quickstart guides to connect Neon to your framework."
      >
        <CompactCards className="my-0!" cols={4} withToggler appearance="home">
          {/* All frameworks render here; CompactCards shows the first 12 and
              collapses the rest behind a Show more / Hide toggle, expanding in
              place instead of linking away. */}
          {FRAMEWORKS.map((f) => (
            <a key={f.name} href={f.to} title={f.name} icon={f.icon}>
              {f.name}
            </a>
          ))}
        </CompactCards>
      </Section>

      {/* Coding agents */}
      <Section
        heading="Coding agents"
        description="Connect over MCP to create branches, run SQL, and read docs."
      >
        <div className="grid gap-8">
          <CompactCards className="my-0!" cols={2} appearance="home">
            {AGENTS.map((g) => (
              <a key={g.name} href={g.to} title={g.name} icon={g.icon}>
                {g.name}
              </a>
            ))}
          </CompactCards>
          <div className="grid gap-2.5">
            <span className={cn('text-base leading-normal', mutedText)}>
              Point your agent at this Markdown index to find any doc.
            </span>
            <DocsHomeCopyChip label="/docs/llms.txt" url="https://neon.com/docs/llms.txt" />
          </div>
        </div>
      </Section>

      {/* Guided paths */}
      <Section
        heading="Guided paths"
        description="Step-by-step tutorials that build a complete backend."
      >
        {/* eslint-disable react/no-unknown-property */}
        <DetailIconCards
          className="my-0! @max-[720px]:grid-cols-2 @max-[480px]:grid-cols-1"
          cols={3}
          theme="green-flat"
          appearance="home"
        >
          {GUIDED_PATHS.map((p) => (
            <a key={p.to} href={p.to} description={p.line} icon={p.icon}>
              {p.title}
            </a>
          ))}
        </DetailIconCards>
        {/* eslint-enable react/no-unknown-property */}
      </Section>
    </div>
  </div>
);

export default DocsHome;
