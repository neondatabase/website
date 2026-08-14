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

![Running npx neon init in a code editor to add Neon skills and the Neon MCP server](/use-cases/full-stack-apps/neon-init.png)

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

## Ask your agent to deploy a full backend

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

<Admonition type="info" title="Who this page is for">
This page is for developers building apps: you write the product, and your editor or agent wires the backend. If you are building an agent product that provisions Neon for your own end users, see [Neon for AI Agent Platforms](/use-cases/ai-agents) and [Embedded Postgres for Platforms](/platforms).
</Admonition>

What's included when you deploy Neon:

## Lakebase Postgres

Every Neon backend starts with [Lakebase Postgres](/docs/postgres/overview): fully managed Postgres on the [lakebase architecture](/docs/introduction/architecture-overview), with compute and storage separated. Compute is where queries run. Storage is where data lives, on a copy-on-write engine versioned by WAL, so a branch can point at a particular page without duplicating the dataset underneath.

That separation is what makes the rest of the Neon experience possible. You do not size an instance up front. You do not copy a database to get an isolated environment. You create a branch in about a second, and the child starts as a pointer into the same pages as its parent until one of them writes.

- **Autoscaling** - Compute adjusts between your min and max limits as load changes. ([Read more](/docs/introduction/autoscaling))
- **Scale to zero** - Idle databases suspend so you do not pay for compute while they are inactive. ([Read more](/docs/introduction/scale-to-zero))
- **Instant branching** - Create isolated copies for development, previews, CI, and agent runs, with no storage duplication up front. ([Read more](/docs/introduction/branching))
- **Instant restore** - Recover to any point in your history window without waiting on a dump-and-restore. ([Read more](/docs/introduction/branch-restore))
- **Connection pooling** - Pooled endpoints support up to 10,000 connections per compute. ([Read more](/docs/connect/connection-pooling))

Use any Postgres driver, ORM, or framework you already know. When you only need the database, start here and add other primitives as the app grows.

<video autoPlay playsInline muted loop width="320" height="320">
  <source src="/videos/pages/home/hero/postgres-database.webm?updated=20260709" type="video/webm" />
  <source src="/videos/pages/home/hero/postgres-database.mp4?updated=20260709" type="video/mp4" />
</video>

<MegaLink tag="Separated compute and storage" title="How the lakebase architecture makes Postgres branchable, serverless, and instant to restore" url="/docs/introduction/architecture-overview" />

## Managed Better Auth

[Managed Better Auth](/docs/auth/overview) stores users, sessions, and OAuth configuration in your Postgres database under the `neon_auth` schema. Auth state branches with your data, so preview branches get isolated sign-up and login flows.

- Email/password, magic links, and OAuth providers
- JWTs that work with the Neon Data API and Row Level Security
- Setup from the Console, `npx neon@latest init`, or the Neon MCP server

<video autoPlay playsInline muted loop width="320" height="244">
  <source src="/videos/pages/home/hero/authentication.webm?updated=20260709" type="video/webm" />
  <source src="/videos/pages/home/hero/authentication.mp4?updated=20260709" type="video/mp4" />
</video>

## Neon Object Storage

Apps need files: uploads, attachments, generated assets. Wired to a separate bucket vendor, those files sit outside your database environments. Preview branches point at production objects, or you invent path conventions and cleanup jobs to keep things apart.

[Neon Object Storage](/docs/storage/overview) is S3-compatible object storage built into the Neon backend, so files join the same branch workflow you already use for Postgres. When you create a branch, the child inherits your buckets and objects at that point in time. Uploads and deletes on the child never touch the parent. Storage is copy-on-write: the bill only grows if the branch diverges, and nothing is duplicated up front.

You implement the real S3 wire protocol. Point the AWS SDK, boto3, the AWS CLI, or the Files SDK at your branch endpoint and authenticate with a Neon credential. No separate cloud storage account. Access level (`private` or `public_read`) stays in Neon, so you are not maintaining two permission systems.

- **Data and files together** - One `branch_id` forks Postgres and Object Storage in the same API call
- **Isolated by default** - Preview and agent branches can test uploads without touching production objects
- **Disposable** - Delete the branch and the files go with it
- **Same credential system** - Shared with Functions and AI Gateway

Declare buckets in [`neon.ts`](/docs/reference/neon-ts), run `neon deploy`, and Neon provisions them on the linked branch and writes the AWS credentials into `.env.local`.

<video autoPlay playsInline muted loop width="280" height="381">
  <source src="/videos/pages/home/hero/storage.webm?updated=20260709" type="video/webm" />
  <source src="/videos/pages/home/hero/storage.mp4?updated=20260709" type="video/mp4" />
</video>

<MegaLink tag="Keep reading" title="How we built Neon Object Storage: S3-compatible buckets with the same branch semantics as your database" url="https://neon.com/blog/building-neon-object-storage" />

## Neon Functions

Most serverless handlers talk to the database over the public internet. Every query pays a cross-network round trip, you wire secrets yourself, and runtimes often cap at a few seconds, so an agent mid-tool-loop or a WebSocket never gets a fair shot.

[Neon Functions](/docs/compute/functions/overview) flip that. They are Node.js 24 compute you deploy onto a Neon branch, in the same region as Lakebase Postgres, with `DATABASE_URL` injected automatically. If the branch also uses Object Storage or AI Gateway, those credentials land too. A function that reads from Postgres, pulls an attachment from Object Storage, and streams an answer through the AI Gateway does not assemble three third-party accounts. It reads `process.env` on the branch it was deployed to.

They are long-running enough that agents can stream for minutes and WebSockets or SSE can stay open while data flows. Keep the UI on Vercel, Netlify, or wherever you already host frontends. Reach for Neon Functions when the work starts inside Neon, or when the primary job is reading and writing Neon primitives.

Functions follow the same `branch_id` as the rest of the stack. Deploy onto `main`, create a child branch, and the child gets its own copy of the function at its own URL against its own database state. Delete the branch and the function goes with it.

- **Next to your data** - Same region as the branch, with credentials injected automatically
- **Long-running** - Built for agent loops, WebSockets, and SSE, not short lambda caps
- **Branch-scoped** - Each branch runs its own function against isolated state
- **Request/response** - Always invoked over HTTP and always returns a web response; pair with Inngest or similar for queued background jobs

Declare functions in [`neon.ts`](/docs/reference/neon-ts) and deploy with `neon deploy`. Hono is the recommended framework.

<video autoPlay playsInline muted loop width="320" height="193">
  <source src="/videos/pages/home/hero/compute.webm?updated=20260709" type="video/webm" />
  <source src="/videos/pages/home/hero/compute.mp4?updated=20260709" type="video/mp4" />
</video>

<MegaLink tag="Keep reading" title="Neon Functions: long-running Node.js handlers that live on your branch beside Lakebase Postgres" url="https://neon.com/blog/neon-functions-backend-logic-next-to-your-data" />

## Neon AI Gateway

Most apps end up calling a model somewhere. Wired directly, that means a separate account, key, and invoice for every lab, and a new integration every time a better model ships.

[Neon AI Gateway](/docs/ai-gateway/overview) collapses that into one credential and one bill. A single endpoint serves frontier and open-weight models from OpenAI, Google, Meta, Databricks, and Alibaba, and standard SDKs work with a URL change: point the OpenAI SDK or `google-genai` at your branch endpoint and leave the rest of your code alone. Native provider routes are still there when you need provider-specific features like reasoning modes and prompt caching, and streaming works on every endpoint.

The gateway runs on the Databricks AI infrastructure that already serves [more than 145 trillion tokens a month](https://neon.com/blog/neon-backend-is-beta), hardened by enterprise requirements: day-0 coverage of new models, high availability, deep metrics, logging, and granular cost controls.

- **One credential, one bill** - No separate accounts, keys, or invoices per provider
- **No markup** - Neon charges the same per-token rate as the model provider, with no margin on top ([pricing](/docs/ai-gateway/overview#pricing))
- **Inference that branches with your app** - Each branch gets its own gateway endpoint, so model calls from a preview branch stay isolated from production
- **Wired into Functions automatically** - Gateway credentials are injected into [Neon Functions](/docs/compute/functions/overview), so a model-backed handler runs next to Postgres and Object Storage on the same branch

<video autoPlay playsInline muted loop width="320" height="141">
  <source src="/videos/pages/home/hero/ai-gateway.webm?updated=20260709" type="video/webm" />
  <source src="/videos/pages/home/hero/ai-gateway.mp4?updated=20260709" type="video/mp4" />
</video>

## Neon Data API

The [Neon Data API](/docs/data-api/get-started) exposes each database branch as a PostgREST-compatible REST endpoint. Pair it with Managed Better Auth JWTs for branch-scoped access without writing a custom API layer for every table.

Every branch has its own endpoint, which fits preview deployments and agent-generated apps that need quick CRUD access over HTTPS.

## A Free plan with enough room to build

You can start building on the [Neon Free plan](/docs/introduction/plans). It comes with enough resources to support fully working apps, not just experiments:

- **$0/month** with no credit card required
- **100 projects** and **100 CU-hours per project** (enough to run a 0.25 CU compute for 400 active hours)
- **0.5 GB storage per project** and **5 GB of public network transfer per project per month**
- **Autoscaling** up to 2 CU (≈8 GB RAM) with scale to zero after 5 minutes of inactivity
- **Managed Better Auth** up to 60,000 MAU (beta)


<CTA title="Start building" description="Create a project on the Free plan, run npx neon@latest init, and deploy your first backend primitive in minutes." buttonText="Get started" buttonUrl="https://console.neon.tech/signup" linkText="Browse templates" linkUrl="https://build-on-neon.vercel.app/" />
