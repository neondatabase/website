---
title: 'Build Full-Stack Apps on Neon'
subtitle: Deploy a Neon backend end to end with your agent or your editor
summary: >-
  Covers how developers and coding agents build full-stack apps on Neon:
  Lakebase Postgres plus Managed Better Auth, Object Storage, Functions, Data
  API, and AI Gateway. Includes agent setup with neon init, MCP, and starter
  templates from the Build on Neon collection.
enableTableOfContents: true
updatedOn: '2026-08-14T13:30:00.000Z'
image: '/images/social-previews/use-cases/ai-agents.jpg'
---

<Admonition type="note" title="Summary">
Neon is a complete set of cloud backend primitives built around Lakebase Postgres. You can deploy the database, auth, object storage, serverless functions, and model access from one project, then wire it into your app with your editor or a coding agent.

- **[Lakebase Postgres](/docs/postgres/overview)** - Serverless Postgres with autoscaling, branching, and scale to zero
- **[Managed Better Auth](/docs/auth/overview)** - Users and sessions stored in Postgres, branching with your data
- **[Neon Object Storage](/docs/storage/overview)** - S3-compatible storage that branches with your project
- **[Neon Functions](/docs/compute/functions/overview)** - Long-running serverless compute on the same branch as your database
- **[Neon AI Gateway](/docs/ai-gateway/overview)** - One credential for models across providers
- **[Neon Data API](/docs/data-api/get-started)** - PostgREST-compatible REST access to every branch

Run `npx neon@latest init` from your project root to connect your agent, then browse runnable templates at [build-on-neon.vercel.app](https://build-on-neon.vercel.app/).
</Admonition>

![Agent-friendly database lifecycle with Neon](/use-cases/fast-dev-workflows/agent-database-lifecycle-workflow.png)

## Build with your agent or editor

Agents and AI-native editors are a first-class way to work with Neon. One command connects your project to Neon, installs agent skills, and configures the Neon MCP server for Cursor, VS Code, Claude Code, and other supported clients.

```bash
npx neon@latest init
```

After `init`, restart your editor and ask your agent to get started with Neon. The flow authenticates via OAuth, writes MCP config, and installs the `neon-postgres` skill so your agent can provision projects, run SQL, enable auth, and deploy functions. See [`neon init`](/docs/cli/init) for what gets created.

### Runnable templates

Browse working apps at [build-on-neon.vercel.app](https://build-on-neon.vercel.app/). Each template is a complete project you can read on GitHub or scaffold locally:

```bash
neon bootstrap --template hono
neon bootstrap --template ai-sdk
neon bootstrap --template realtime-chat
```

Templates cover REST APIs, image-generation agents, realtime chat, MCP servers, and more. See [Neon Functions starter templates](/docs/compute/functions/overview#starter-templates) for the full list.

## A complete set of backend primitives built around Postgres

Fully functional apps need more than a connection string - you'll need to handle users, files, APIs, and often model calls. Neon brings those pieces into one backend you can provision from a single project. Lakebase Postgres, our serverless database, stays at the center; auth, storage, functions, and model access branch with it - all your dev environments get isolated users, files, and endpoints without extra setup.

This page is for developers building apps: you write the product, and your editor or agent wires the backend. If you are building an agent product that provisions Neon for your own end users, see [Neon for AI Agent Platforms](/use-cases/ai-agents) and [Embedded Postgres for Platforms](/platforms).

## Lakebase Postgres

Every Neon backend starts with [Lakebase Postgres](/docs/postgres/overview): fully managed Postgres with separated compute and storage.

- **Autoscaling** - Compute adjusts between your min and max limits as load changes ([autoscaling](/docs/introduction/autoscaling))
- **Scale to zero** - Idle databases suspend so you do not pay for compute while they are inactive ([scale to zero](/docs/introduction/scale-to-zero))
- **Branching** - Create instant copies for development, previews, and CI ([branching](/docs/introduction/branching))
- **Connection pooling** - Pooled endpoints support up to 10,000 connections per compute ([connection pooling](/docs/connect/connection-pooling))

Use any Postgres driver, ORM, or framework you already know. When you only need the database, start here and add other primitives as the app grows.

## Managed Better Auth

[Managed Better Auth](/docs/auth/overview) stores users, sessions, and OAuth configuration in your Postgres database under the `neon_auth` schema. Auth state branches with your data, so preview branches get isolated sign-up and login flows.

- Email/password, magic links, and OAuth providers
- JWTs that work with the Neon Data API and Row Level Security
- Setup from the Console, `npx neon@latest init`, or the Neon MCP server

Managed Better Auth is in beta and available in AWS regions. See [Managed Better Auth overview](/docs/auth/overview#availability) for current limits.

## Neon Object Storage

[Neon Object Storage](/docs/storage/overview) is S3-compatible object storage built into the Neon backend. Each branch gets its own isolated namespace, so preview uploads do not touch production files.

- Use standard S3 SDKs and tools
- `private` and `public_read` bucket access modes
- Same credential system as Functions and AI Gateway

Object Storage is in beta and currently available in AWS US East (Ohio) (`aws-us-east-2`). See [Object Storage overview](/docs/storage/overview) for details.

## Neon Functions

[Neon Functions](/docs/compute/functions/overview) deploy serverless Node.js compute onto a Neon branch, in the same region as Lakebase Postgres. `DATABASE_URL`, Object Storage credentials, and AI Gateway credentials are injected automatically.

- Long-running handlers for agents, WebSockets, and streaming responses
- Each branch runs its own function at its own URL
- JavaScript and TypeScript on Node.js during beta

Functions are in beta and currently available in AWS US East (Ohio) (`aws-us-east-2`). See [Neon Functions overview](/docs/compute/functions/overview) for runtime limits.

## Neon AI Gateway

[Neon AI Gateway](/docs/ai-gateway/overview) routes model calls through one Neon credential. Standard OpenAI-compatible SDKs work with a URL change. Each branch gets its own gateway endpoint.

AI Gateway is in beta, requires a paid Neon plan (Launch or Scale), and is currently available in AWS US East (Ohio) (`aws-us-east-2`). Inference is free on paid plans during beta. See [AI Gateway pricing](/docs/ai-gateway/overview#pricing).

## Neon Data API

The [Neon Data API](/docs/data-api/get-started) exposes each database branch as a PostgREST-compatible REST endpoint. Pair it with Managed Better Auth JWTs for branch-scoped access without writing a custom API layer for every table.

Every branch has its own endpoint, which fits preview deployments and agent-generated apps that need quick CRUD access over HTTPS.


## Start on the Free plan

You can start building on the [Neon Free plan](/docs/introduction/plans). It comes with enough resources to support fully working apps, not just experiments:

- **$0/month** with no credit card required
- **100 projects** and **100 CU-hours per project** (enough to run a 0.25 CU compute for 400 active hours)
- **0.5 GB storage per project** and **5 GB of public network transfer per project per month**
- **Autoscaling** up to 2 CU (≈8 GB RAM) with scale to zero after 5 minutes of inactivity
- **Managed Better Auth** up to 60,000 MAU (beta)


<CTA title="Start building" description="Create a project on the Free plan, run npx neon@latest init, and deploy your first backend primitive in minutes." buttonText="Get started" buttonUrl="https://console.neon.tech/signup" linkText="Browse templates" linkUrl="https://build-on-neon.vercel.app/" />
