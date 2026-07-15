---
title: Neon documentation
subtitle: Neon is the backend for apps and agents.
summary: >-
  Neon documentation root covers the full Neon backend platform: serverless
  Postgres with branching and autoscaling, Managed Better Auth, Data API, and upcoming
  Object Storage and AI Gateway services. Use this page to reach quickstarts, framework
  connection guides (Next.js, Django, Prisma, and more), and MCP-based AI
  editor integrations for Cursor, Claude Code, Codex, and GitHub Copilot.
redirectFrom:
  - /guides/neon-azure-integration
  - /guides/azure-service-connector
  - /guides/azure-todo-static-web-app
  - /guides/azure-functions-referral-system
updatedOn: '2026-07-15T19:56:50.774Z'
---

## Getting started

Start with a quick setup prompt, or follow a guided tutorial to build the full Neon stack step by step.

<TwinPaths>
  <QuickPath
    title="One-command setup"
    command="npx neon@latest init"
    description="AI-guided setup. Creates a project, applies your schema, and writes a .env in one step. Copy the prompt below and get started."
  />
  <GuidedPath
    title="Build a full backend"
    description="Next.js + Postgres + Managed Better Auth. The full Neon stack, end-to-end, from create-next-app to deployed."
    href="/docs/get-started/full-backend-quickstart"
  />
</TwinPaths>

<TourCallout
  title="Tour the Neon backend"
  description="Learn how Postgres, Managed Better Auth, Object Storage, Functions, and the AI Gateway connect across a real project, and where each one lives in your codebase."
  href="/docs/get-started/backend-overview"
/>

## Products

Build backends for web apps and agents with Neon Postgres, Auth, Object Storage, and AI Gateway. <br />
Every service is agent-ready: instant, branchable, and serverless.

<DetailIconCards className="my-7!" cols={3} theme="green-flat">

<a href="/docs/postgres/overview" description="Serverless Postgres with branching, autoscaling, scale to zero, and instant restore." icon="database">Postgres</a>

<a href="/docs/auth/overview" description="Managed Better Auth with sign-up, OAuth, and sessions. Users live in your Postgres and branch with it." icon="lock-landscape">Auth</a>

<a href="/docs/data-api/overview" description="HTTPS queries with no backend code. Drop-in compatible with Supabase." icon="network">Data API</a>

<a href="/docs/storage/overview" description="S3-compatible object storage that branches with your database." icon="data" tag="Beta" tagTheme="orange-muted">Object Storage</a>

<a href="/docs/compute/functions/overview" description="Long-running Node.js compute, deployed alongside your database." icon="code" tag="Beta" tagTheme="orange-muted">Functions</a>

<a href="/docs/ai-gateway/overview" description="One API for frontier and open-source models, built into your Neon project." icon="sparkle" tag="Beta" tagTheme="orange-muted">AI Gateway</a>

</DetailIconCards>

New to Object Storage, Functions, or AI Gateway? Start with the [Neon backend beta guide](/docs/get-started/backend-beta).

## Connect your framework

Browse our [framework](/docs/get-started/frameworks), [language](/docs/get-started/languages), and [ORM](/docs/get-started/orms) guides for full connection details.

<CompactCards className="mt-8" cols={4} withToggler>

<a href="/docs/guides/nextjs" title="Next.js" icon="next-js"></a>

<a href="/docs/guides/django" title="Django" icon="django"></a>

<a href="/docs/guides/drizzle" title="Drizzle" icon="drizzle"></a>

<a href="/docs/guides/react-router" title="React Router" icon="react"></a>

<a href="/docs/guides/tanstack-start" title="TanStack Start" icon="tanstack"></a>

<a href="/docs/guides/express" title="Express" icon="express"></a>

<a href="/docs/guides/nestjs" title="NestJS" icon="nest-js"></a>

<a href="/docs/guides/astro" title="Astro" icon="astro"></a>

<a href="/docs/guides/sveltekit" title="SvelteKit" icon="svelte"></a>

<a href="/docs/guides/nuxt" title="Nuxt" icon="nuxt"></a>

<a href="/docs/guides/laravel" title="Laravel" icon="laravel"></a>

<a href="/docs/guides/ruby-on-rails" title="Rails" icon="rails"></a>

<a href="/docs/guides/python" title="Python" icon="python"></a>

<a href="/docs/guides/go" title="Go" icon="go"></a>

<a href="/docs/guides/java" title="Java" icon="java"></a>

<a href="/docs/guides/rust" title="Rust" icon="rust"></a>

<a href="/docs/guides/dotnet-npgsql" title=".NET" icon="dotnet"></a>

<a href="/docs/guides/elixir" title="Elixir" icon="elixir"></a>

<a href="/docs/guides/phoenix" title="Phoenix" icon="phoenix"></a>

<a href="/docs/guides/prisma" title="Prisma" icon="prisma"></a>

<a href="/docs/guides/kysely" title="Kysely" icon="kysely"></a>

<a href="/docs/guides/tortoise-orm" title="Tortoise ORM" icon="tortoise-orm"></a>

<a href="/docs/guides/typeorm" title="TypeORM" icon="typeorm"></a>

<a href="/docs/guides/sqlalchemy" title="SQLAlchemy" icon="sqlalchemy"></a>

<a href="/docs/guides/hono" title="Hono" icon="hono"></a>

<a href="/docs/guides/solid-start" title="SolidStart" icon="solidstart"></a>

<a href="/docs/guides/reflex" title="Reflex" icon="reflex"></a>

<a href="/docs/guides/javascript" title="JavaScript" icon="javascript"></a>

<a href="/docs/guides/symfony" title="Symfony" icon="symfony"></a>

<a href="/docs/guides/quarkus-jdbc" title="Quarkus" icon="quarkus"></a>

<a href="/docs/guides/micronaut-kotlin" title="Micronaut" icon="micronaut"></a>

<a href="/docs/guides/redwoodsdk" title="Redwood" icon="redwoodsdk"></a>

</CompactCards>

## AI tools and agents

Neon integrates with AI coding tools and agents through MCP. Pick your editor for setup and integration details.

<CompactCards cols={2}>

<a href="/docs/ai/ai-cursor-plugin" title="Cursor" description="Connect Neon to Cursor" icon="cursor"></a>

<a href="/docs/ai/ai-claude-code-plugin" title="Claude Code" description="Connect Neon to Claude Code" icon="claude-code"></a>

<a href="/docs/ai/ai-codex-plugin" title="Codex" description="Connect Neon to OpenAI Codex" icon="codex"></a>

<a href="/docs/ai/ai-github-copilot-agents" title="GitHub Copilot" description="Connect Neon to GitHub Copilot" icon="copilot"></a>

</CompactCards>

<CommunityBanner className="mt-14" buttonText="Join the server" buttonUrl="https://discord.gg/92vNTzKDGp">Questions about Neon or Postgres? Join our Discord</CommunityBanner>
