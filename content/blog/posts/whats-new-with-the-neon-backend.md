---
title: What's new with the Neon backend
description: >-
  A roundup of what we've shipped lately across Lakebase Postgres, Managed
  Better Auth, Functions, Object Storage, AI Gateway, and Realtime
excerpt: >-
  We ship updates to all of the Neon backend primitives every week. This post
  rounds up a few of the recent ones worth knowing about.
date: '2026-11-10T12:00:00'
updatedOn: '2026-11-09T18:10:00.000Z'
category: product
categories:
  - product
authors:
  - carlota-soto
cover:
  image: null
  alt: null
isFeatured: false
seo:
  title: What's new with the Neon backend - Neon
  description: >-
    A roundup of what we've shipped lately across Lakebase Postgres, Managed
    Better Auth, Functions, Object Storage, AI Gateway, and Realtime
  keywords: []
  noindex: false
  ogTitle: What's new with the Neon backend - Neon
  ogDescription: >-
    A roundup of what we've shipped lately across Lakebase Postgres, Managed
    Better Auth, Functions, Object Storage, AI Gateway, and Realtime
  image: null
---

Neon now includes a complete set of backend primitives - the database ([Lakebase Postgres](https://neon.com/lakebase)), [Managed Better Auth](https://neon.com/auth), [Functions](https://neon.com/functions), [Object Storage](https://neon.com/object-storage), [AI Gateway](https://neon.com/ai-gateway), and we just launched [Realtime](https://neon.com/docs/realtime/overview) in beta. We ship updates to all of them every week, which we list in our [changelog](https://neon.com/docs/changelog) - this post rounds up a few of the recent ones worth knowing about.

## What's new with Lakebase Postgres

<Admonition type="note" title="Lakebase Postgres">
[Lakebase Postgres](https://neon.com/lakebase) is the Neon database: serverless Postgres that scales and branches with your app, built on object storage and the WAL. It takes you from your first users to the Fortune 500, with coding agents as a first-class interface.
</Admonition>

### More storage on the Free plan

The Neon [Free Plan](https://neon.com/pricing) now includes 1 GB of Postgres storage per project, up from 0.5 GB.

### Stripe data in your database

[Stripe Data Pipeline can now stream Stripe data straight into Lakebase Postgres](https://neon.com/blog/stripe-data-pipeline-realtime-sync-to-postgres), in public preview. Stripe backfills your existing data and keeps it in sync, so checking whether a user has an active subscription is a join instead of an API call.

### Search in Chinese, Japanese, and Korean, plus index tuning

<Admonition type="note" title="Lakebase Search">
[Lakebase Search](https://neon.com/docs/ai/lakebase-search) is a set of extensions to run scalable vector, keyword, and hybrid search inside Lakebase Postgres.
</Admonition>

Two Lakebase Search updates shipped recently:

- **Chinese, Japanese, and Korean full-text search -** These languages don't put spaces between words, so Postgres's built-in full-text search can't split them into terms. The `lakebase_tokenizer` extension now ships ready-made configurations for all three. The output is a standard `tsvector`, so it works with GIN indexes and with `lakebase_text` for BM25 ranking.
- **Index tuning -** `lakebase_vector` 1.1.2 adds functions that recommend `probes` settings for a vector index, with estimated recall and measured latency, so you can trade one for the other without trial and error.

### Operational updates

- **Automatic updates for computes up to 16 CU -** Every compute up to 16 CU, including all autoscaling computes, now gets [compute updates](https://neon.com/docs/manage/updates) automatically. An update restarts the compute in a few seconds, and Neon prewarms the cache so queries don't run cold afterward. On paid plans, updates run in the window you choose.
- **More read replicas for paid plans -** they now support up to 6 [read replicas](https://neon.com/docs/introduction/read-replicas) per branch
- **Recover deleted projects from the console -** A deleted project can be [recovered](https://neon.com/docs/manage/projects#recover-a-deleted-project) for 7 days, now from the Console as well as the CLI and API
- **Least-privilege roles for agents -** `neon roles create --access read_only` (or `read_write`) creates a scoped role instead of an admin. The same option is on the Neon MCP Server, and the MCP Server can now run every SQL tool as a [Postgres role you choose](https://neon.com/docs/ai/neon-mcp-server#postgres-role), so the role's grants decide what an agent can read and change.

## Just shipped in Neon Functions

<Admonition type="note" title="Neon Functions">
[Neon Functions](https://neon.com/docs/compute/functions/overview) are long-running serverless functions right next to your database. [You can use them in the Free plan](https://neon.com/pricing), with 10 active Capacity-Hours, 400 waiting Capacity-Hours, and 1 million invocations per project each month.
</Admonition>

### Give your app its own MCP server

Two pieces we shipped in the last few weeks make it easier to build MCPs on Neon:

- The `mcp-postgres` template gives you an MCP server on Functions, with tools that read and write a Postgres table
- The [OAuth provider plugin](https://neon.com/docs/auth/guides/plugins/oauth-provider) turns Managed Better Auth into an OAuth 2.1 authorization server, so users sign in to your MCP server with the account they already have in your app

You can start from the template:

```bash
neon functions new mcp-postgres
```

### Function Registry

`neon functions new` scaffolds a function from a template in the [Function Registry](https://neon.com/functions/templates). It includes ready-to-use code to help you build things like

- AI agents and chatbots ([mastra](https://neon.com/functions/templates/mastra), [openai-agents](https://neon.com/functions/templates/openai-agents), [chat-sdk](https://neon.com/functions/templates/chat-sdk), [tanstack-ai](https://neon.com/functions/templates/tanstack-ai), [telegram-bot](https://neon.com/functions/templates/telegram-bot))
- REST and OpenAPI endpoints for a Postgres table, APIs that only signed-in users can call, rate-limited APIs, and paid APIs that charge per request ([rest-api-postgres](https://neon.com/functions/templates/rest-api-postgres), [openapi-postgres](https://neon.com/functions/templates/openapi-postgres), [authenticated-api](https://neon.com/functions/templates/authenticated-api), [rate-limit-postgres](https://neon.com/functions/templates/rate-limit-postgres), [x402-paid-api](https://neon.com/functions/templates/x402-paid-api))
- Background workflows and email ([inngest-workflow](https://neon.com/functions/templates/inngest-workflow), [upstash-workflow](https://neon.com/functions/templates/upstash-workflow), [resend-email](https://neon.com/functions/templates/resend-email), [aiinbx](https://neon.com/functions/templates/aiinbx))
- Features that use other Neon services, like describing uploaded images with a vision model on the AI Gateway ([image-analysis](https://neon.com/functions/templates/image-analysis)), generating images and storing them in Object Storage ([image-generation](https://neon.com/functions/templates/image-generation)), presigned upload URLs ([presigned-uploads](https://neon.com/functions/templates/presigned-uploads)), and live polls over WebSockets ([websocket-live-poll](https://neon.com/functions/templates/websocket-live-poll))

To list all templates, run

```bash
neon functions templates list
neon functions new openai-agents
```

## Updates for Managed Better Auth

<Admonition type="note" title="Managed Better Auth">
All Neon users can add [Managed Better Auth](https://neon.com/auth) to their projects - an auth service built on Better Auth that branches with your database and lives right next to your data.
</Admonition>

### OAuth provider (beta)

[Managed Better Auth can now act as an OAuth 2.1 authorization server](https://neon.com/docs/auth/guides/plugins/oauth-provider), so your users can sign in to your MCP server, API, or other apps with their existing accounts. The `@neon/oauth` SDK (beta) verifies access tokens and serves the resource metadata for an MCP server, which is how the MCP server pattern in the Functions section works.

### Apple and Microsoft sign-in

[Apple and Microsoft Entra ID are now OAuth providers](https://neon.com/docs/auth/guides/setup-oauth), alongside Google, GitHub, and Vercel. Add them with your own app credentials from your project's Better Auth settings, the Neon CLI, or the Neon API.

### Better Auth 1.7, kept up to date for you

Managed Better Auth moved to Better Auth 1.7 and existing apps kept working without changes. When Better Auth published a security release on November 3, we rolled out the fixed version (1.7.16) server-side in every region. Customers didn't need to upgrade an SDK or rotate a secret.

## Credits and new models for AI gateway

<Admonition type="note" title="AI Gateway">
You can call your AI models right from Neon via our [AI Gateway](https://neon.com/ai-gateway), served with top-performance by Databricks Foundation APIs.
</Admonition>

### New models

We keep [adding models to the catalog](https://neon.com/models), with new ones landing almost every week - some of the recent additions:

- Gemini 4 Argon, Google's latest model, with a 1M-token context window and text, image, video, audio, and PDF input
- Claude Opus 5.5, Claude Sonnet 5.5, and Claude Haiku 5.5 from Anthropic
- GPT-6 Sol, GPT-6 Luna, and GPT-6.1 Sol from OpenAI, and Grok 4.7 from xAI
- Jev 1.14 and OpenJev, TypeSafe's decision models, which answer questions about your input with a choice, a score, or a probability instead of generated text
- Embedding models like `qwen3-embedding-0-6b` and `gte-large-en`, which return 1024-dimension vectors you can store and search next to your data with Lakebase Search or pgvector

### Use AI Gateway from the Free Plan

Every Neon user can now buy AI Gateway credits, starting at $5, including on the Free plan. Once you [add credits](https://neon.com/docs/ai-gateway/prepaid-credits), you can call every model in the catalog at the same per-token price you'd pay using the labs' own APIs.

## And lastly, an update in Neon Object Storage

<Admonition type="note" title="Neon Object Storage">
[Neon Object Storage](https://neon.com/object-storage) gives you S3-compatible files that branch with your database, the same way you already branch Postgres.
</Admonition>

### Branch resets now include your files

[Reset from parent](https://neon.com/docs/guides/reset-from-parent) now rolls back a branch's Object Storage along with its Postgres data. Any uploads, overwrites, and deletes made on the branch are discarded, and its buckets return to the parent's current state. If a preview environment or an agent run filled a branch with test files, one reset puts both the data and the files back where they started.

## Tell your coding agent to deploy the Neon backend

The fastest way to try any of this is through your coding agent. This prompt installs the Neon CLI, signs you in, and adds Neon's agent skills and MCP server:

```text
Set me up for Neon. Fetch https://neon.com/prompts/agent-setup.md and follow it.
```

Keep an eye out for our [weekly changelog](https://neon.com/docs/changelog) to not miss any updates!
