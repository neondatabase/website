---
title: Neon documentation
subtitle: Neon is the backend for apps and agents.
summary: >-
  Neon documentation root covers the full Neon backend platform: serverless
  Postgres with branching and autoscaling, Neon Auth, Data API, and upcoming
  Storage and AI Gateway services. Use this page to reach quickstarts, framework
  connection guides (Next.js, Django, Prisma, and more), and MCP-based AI
  editor integrations for Cursor, Claude Code, Codex, and GitHub Copilot.
layout: wide
redirectFrom:
  - /guides/neon-azure-integration
  - /guides/azure-service-connector
  - /guides/azure-todo-static-web-app
  - /guides/azure-functions-referral-system
updatedOn: '2026-06-05T17:20:32.620Z'
---

<TwinPaths>
  <QuickPath
    title="One-command setup"
    command="npx neonctl@latest init"
    description="AI-guided setup. Creates a project, applies your schema, and writes a .env in one step."
  />
  <GuidedPath
    title="Build a full backend"
    description="Next.js + Postgres + Neon Auth + Drizzle. The full Neon stack, end-to-end, from create-next-app to deployed."
    href="/docs/get-started/full-backend-quickstart"
  />
</TwinPaths>

<div className="mt-12 mb-3.5 flex items-baseline justify-between gap-4">
  <h2 className="m-0!">Your Neon backend</h2>
  <a href="https://neon.com/blog/were-building-backends#access" className="text-sm font-medium text-[#00CC88] hover:underline dark:text-[#00E599]">Join Early Access →</a>
</div>

Build backends for web apps and agents with Neon Postgres, Auth, Storage, and AI Gateway. Every service is agent-ready: instant, branchable, and serverless.

<DetailIconCards cols={3}>

<a href="/docs/postgres/overview" description="Serverless Postgres with branching, autoscaling, scale to zero, and instant restore." icon="database">Postgres</a>

<a href="/docs/auth/overview" description="Managed auth with sign-up, OAuth, and sessions. Users live in your Postgres and branch with it." icon="lock-landscape">Neon Auth</a>

<a href="/docs/data-api/overview" description="HTTPS queries with no backend code. Drop-in compatible with Supabase." icon="binary-code">Data API</a>

<a href="https://neon.com/blog/were-building-backends#access" description="S3-compatible object storage that branches with your DB." icon="data" tag="coming soon">Storage</a>

<a href="https://neon.com/blog/were-building-backends#access" description="Serverless compute, deployed alongside your DB." icon="code" tag="coming soon">Compute</a>

<a href="https://neon.com/blog/were-building-backends#access" description="LLM gateway for AI workloads, integrated with Neon Auth." icon="sparkle" tag="coming soon">AI Gateway</a>

</DetailIconCards>

## Connect your framework

Browse our [framework](/docs/get-started/frameworks), [language](/docs/get-started/languages), and [ORM](/docs/get-started/orms) guides for full connection details.

<PromptCards withToggler>

<a href="/docs/guides/nextjs" title="Next.js" description="Connect Next.js to Neon" icon="next-js"></a>

<a href="/docs/guides/django" title="Django" description="Connect Django to Neon" icon="django"></a>

<a href="/docs/guides/drizzle" title="Drizzle" description="Connect Drizzle ORM to Neon" icon="drizzle"></a>

<a href="/docs/guides/react-router" title="React Router" description="Connect React Router to Neon" icon="react"></a>

<a href="/docs/guides/tanstack-start" title="TanStack Start" description="Connect TanStack Start to Neon" icon="tanstack"></a>

<a href="/docs/guides/express" title="Express" description="Connect Express to Neon" icon="express"></a>

<a href="/docs/guides/nestjs" title="NestJS" description="Connect NestJS to Neon" icon="nest-js"></a>

<a href="/docs/guides/astro" title="Astro" description="Connect Astro to Neon" icon="astro"></a>

<a href="/docs/guides/sveltekit" title="SvelteKit" description="Connect SvelteKit to Neon" icon="svelte"></a>

<a href="/docs/guides/nuxt" title="Nuxt" description="Connect Nuxt to Neon" icon="nuxt"></a>

<a href="/docs/guides/laravel" title="Laravel" description="Connect Laravel to Neon" icon="laravel"></a>

<a href="/docs/guides/ruby-on-rails" title="Rails" description="Connect Ruby on Rails to Neon" icon="rails"></a>

<a href="/docs/guides/python" title="Python" description="Connect Python to Neon" icon="python"></a>

<a href="/docs/guides/go" title="Go" description="Connect Go to Neon" icon="go"></a>

<a href="/docs/guides/java" title="Java" description="Connect Java to Neon" icon="java"></a>

<a href="/docs/guides/rust" title="Rust" description="Connect Rust to Neon" icon="rust"></a>

<a href="/docs/guides/dotnet-npgsql" title=".NET" description="Connect .NET to Neon" icon="dotnet"></a>

<a href="/docs/guides/elixir" title="Elixir" description="Connect Elixir to Neon" icon="elixir"></a>

<a href="/docs/guides/phoenix" title="Phoenix" description="Connect Phoenix to Neon" icon="phoenix"></a>

<a href="/docs/guides/prisma" title="Prisma" description="Connect Prisma ORM to Neon" icon="prisma"></a>

<a href="/docs/guides/kysely" title="Kysely" description="Connect Kysely to Neon" icon="kysely"></a>

<a href="/docs/guides/tortoise-orm" title="Tortoise ORM" description="Connect Tortoise ORM to Neon" icon="tortoise-orm"></a>

<a href="/docs/guides/typeorm" title="TypeORM" description="Connect TypeORM to Neon" icon="typeorm"></a>

<a href="/docs/guides/sqlalchemy" title="SQLAlchemy" description="Connect SQLAlchemy to Neon" icon="sqlalchemy"></a>

<a href="/docs/guides/hono" title="Hono" description="Connect Hono to Neon" icon="hono"></a>

<a href="/docs/guides/solid-start" title="SolidStart" description="Connect SolidStart to Neon" icon="solidstart"></a>

<a href="/docs/guides/reflex" title="Reflex" description="Connect Reflex to Neon" icon="reflex"></a>

<a href="/docs/guides/javascript" title="JavaScript" description="Connect JavaScript to Neon" icon="javascript"></a>

<a href="/docs/guides/symfony" title="Symfony" description="Connect Symfony to Neon" icon="symfony"></a>

<a href="/docs/guides/quarkus-jdbc" title="Quarkus" description="Connect Quarkus to Neon" icon="quarkus"></a>

<a href="/docs/guides/micronaut-kotlin" title="Micronaut" description="Connect Micronaut Kotlin to Neon" icon="micronaut"></a>

<a href="/docs/guides/redwoodsdk" title="Redwood" description="Connect Redwood SDK to Neon" icon="redwoodsdk"></a>

</PromptCards>

## AI tools and agents

Neon integrates with AI coding tools and agents through MCP. Pick your editor for setup and integration details.

<DetailIconCards cols={4}>

<a href="/docs/ai/ai-cursor-plugin" description="Connect Neon to Cursor with the MCP server" icon="cli-cursor">Cursor</a>

<a href="/docs/ai/ai-claude-code-plugin" description="Connect Neon to Claude Code with the MCP server" icon="cli">Claude Code</a>

<a href="/docs/ai/ai-codex-plugin" description="Connect Neon to OpenAI Codex" icon="code">Codex</a>

<a href="/docs/ai/ai-github-copilot-agents" description="Connect Neon to GitHub Copilot" icon="github">GitHub Copilot</a>

</DetailIconCards>

Questions about Neon or Postgres? [Join our Discord →](https://discord.com/invite/92vNTzKDGp)
