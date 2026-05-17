---
title: Neon documentation
summary: >-
  How to set up Neon, a serverless Postgres solution, with commands for
  launching, signing up, connecting to tech stacks, and integrating branching
  into workflows.
redirectFrom:
  - /guides/neon-azure-integration
  - /guides/azure-service-connector
  - /guides/azure-todo-static-web-app
  - /guides/azure-functions-referral-system
updatedOn: '2026-05-17T10:06:14.681Z'
---

Neon is serverless Postgres designed to help you build faster. **Autoscaling**, **branching**, **instant restore**, and more. Get started with our [Free plan](https://console.neon.tech)

<CTA
  title="Set up Neon in one command"
  description="Run this command to launch AI-guided setup. <a href='https://neon.com/blog/one-command-to-bridge-cursor-and-neon'>Learn more<svg width='16' height='12' viewBox='0 0 16 12' fill='none' xmlns='http://www.w3.org/2000/svg' style='display:inline-block;vertical-align:middle;margin-left:8px' aria-hidden='true'><path d='M11.1084 10.9211L14.9999 7.02965L11.1084 3.13816' stroke='currentColor' stroke-width='1.4' stroke-linecap='square'/><path d='M0.938093 7.03198L13.666 7.03198' stroke='currentColor' stroke-width='1.4' stroke-linecap='square'/></svg></a>"
  command="npx neonctl@latest init"
  trackingLabel="Copy neonctl init - docs intro"
/>

## Get started

<DetailIconCards withNumbers compact>

<a href="/docs/get-started/signing-up" description="Sign up and learn database branching basics">Learn the basics</a>

<a href="/docs/get-started/connect-neon" description="Connect to your tech stack">Connect your stack</a>

<a href="/docs/get-started/workflow-primer" description="Integrate branching into your workflow">Learn about branching</a>

<a href="/docs/auth/overview" description="Set up managed auth that branches with your database" icon="lock-landscape">Set up Neon Auth</a>

</DetailIconCards>

## Quickstarts

Step-by-step guides for frameworks, languages, and ORMs to connect your application to Neon. Using Next.js, React, or TanStack Router? Add [Neon Auth](/docs/auth/overview) after you connect.

<TechCards withToggler>

<a href="/docs/guides/nextjs" title="Next.js" description="Connect a Next.js application to Neon" icon="next-js"></a>

<a href="/docs/guides/django" title="Django" description="Connect a Django application to Neon" icon="django"></a>

<a href="/docs/guides/drizzle" title="Drizzle" description="Learn how to use Drizzle ORM with your Neon Postgres database" icon="drizzle"></a>

<a href="/docs/guides/react-router" title="React Router" description="Connect a React Router application to Neon" icon="react"></a>

<a href="/docs/guides/tanstack-start" title="TanStack Start" description="Connect a TanStack Start application to Neon" icon="tanstack"></a>

<a href="/docs/guides/express" title="Express" description="Connect an Express application to Neon" icon="express"></a>

<a href="/docs/guides/nestjs" title="NestJS" description="Connect a NestJS application to Neon" icon="nest-js"></a>

<a href="/docs/guides/astro" title="Astro" description="Connect an Astro site or app to Neon" icon="astro"></a>

<a href="/docs/guides/sveltekit" title="SvelteKit" description="Connect a Sveltekit application to Neon" icon="svelte"></a>

<a href="/docs/guides/nuxt" title="Nuxt" description="Connect a Nuxt application to Neon" icon="nuxt"></a>

<a href="/docs/guides/laravel" title="Laravel" description="Connect a Laravel application to Neon" icon="laravel"></a>

<a href="/docs/guides/ruby-on-rails" title="Rails" description="Connect a Ruby on Rails application to Neon" icon="rails"></a>

<a href="/docs/guides/python" title="Python" description="Connect a Python application to Neon" icon="python"></a>

<a href="/docs/guides/go" title="Go" description="Connect a Go application to Neon" icon="go"></a>

<a href="/docs/guides/java" title="Java" description="Connect a Java application to Neon" icon="java"></a>

<a href="/docs/guides/rust" title="Rust" description="Connect a Rust application to Neon" icon="rust"></a>

<a href="/docs/guides/dotnet-npgsql" title=".NET" description="Connect a .NET (C#) application to Neon" icon="dotnet"></a>

<a href="/docs/guides/elixir" title="Elixir" description="Connect an Elixir application to Neon" icon="elixir"></a>

<a href="/docs/guides/phoenix" title="Phoenix" description="Connect a Phoenix site or app to Neon" icon="phoenix"></a>

<a href="/docs/guides/prisma" title="Prisma" description="Learn how to connect from Prisma ORM to your Neon Postgres database" icon="prisma"></a>

<a href="/docs/guides/kysely" title="Kysely" description="Learn how to connect from Kysely to your Neon Postgres database" icon="kysely"></a>

<a href="/docs/guides/tortoise-orm" title="Tortoise ORM" description="Connect a Tortoise ORM application to Neon" icon="tortoise-orm"></a>

<a href="/docs/guides/typeorm" title="TypeORM" description="Connect a TypeORM application to Neon" icon="typeorm"></a>

<a href="/docs/guides/sqlalchemy" title="SQLAlchemy" description="Connect a SQLAlchemy application to Neon" icon="sqlalchemy"></a>

<a href="/docs/guides/hono" title="Hono" description="Connect a Hono application to Neon" icon="hono"></a>

<a href="/docs/guides/solid-start" title="SolidStart" description="Connect a SolidStart site or app to Neon" icon="solidstart"></a>

<a href="/docs/guides/reflex" title="Reflex" description="Build Python Apps with Reflex and Neon" icon="reflex"></a>

<a href="/docs/guides/javascript" title="JavaScript" description="Connect a JavaScript application to Neon" icon="javascript"></a>

<a href="/docs/guides/symfony" title="Symfony" description="Connect from Symfony with Doctrine to Neon" icon="symfony"></a>

<a href="/docs/guides/quarkus-jdbc" title="Quarkus" description="Connect Quarkus (JDBC) to Neon" icon="quarkus"></a>

<a href="/docs/guides/micronaut-kotlin" title="Micronaut" description="Connect a Micronaut Kotlin application to Neon" icon="micronaut"></a>

<a href="/docs/guides/redwoodsdk" title="Redwood" description="Connect a RedwoodSDK application to Neon" icon="redwoodsdk"></a>

</TechCards>

## Explore the docs

<DetailIconCards compact>

<a href="/docs/connect/connect-intro" description="Connect from any application" icon="audio-jack">Connect</a>

<a href="/docs/import/import-intro" description="Migrate your data to Neon" icon="import">Import data</a>

<a href="/docs/ai/ai-intro" description="Build AI apps with pgvector" icon="openai">AI & embeddings</a>

<a href="/docs/auth/overview" description="Managed authentication that branches with your database" icon="lock-landscape">Neon Auth</a>

<a href="/docs/guides/branching-intro" description="Optimize development workflows" icon="split-branch">Branching</a>

<a href="/docs/extensions/pg-extensions" description="Extend Postgres capabilities" icon="app-store">Extensions</a>

<a href="/docs/reference/neon-cli" description="Manage from the terminal" icon="transactions">Neon CLI</a>

</DetailIconCards>

## Join the community

Questions about Neon or Postgres? Join our [Discord Server](https://discord.com/invite/92vNTzKDGp)

<CommunityBanner buttonText="Join server" buttonUrl="https://discord.gg/92vNTzKDGp" logo="discord">Welcome to the Neon Discord Server!</CommunityBanner>
