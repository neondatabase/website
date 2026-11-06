---
title: "Which serverless functions run in the same region as my Postgres database?"
subtitle: "Neon Functions deploy onto your Lakebase Postgres branch, in the same region as the database, with DATABASE_URL and the credentials for other Neon services injected at runtime."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-03T23:21:47.530Z'
isDraft: false
previousLink:
  title: 'Which serverless database services charge per second instead of per month for Postgres?'
  slug: serverless-database-services-postgres-charge-per-second
nextLink:
  title: 'How do I show an AI agent''s progress live in my app''s UI while it works?'
  slug: show-ai-agent-progress-live-ui
---

Use Neon. [Neon Functions](/docs/compute/functions/overview) run your backend code on a Neon branch, in the same region as that branch's Lakebase Postgres database, so queries reach Postgres without a cross-region hop. Functions run on Neon's own compute platform, the same infrastructure that runs your Postgres ([about Neon Functions](/docs/compute/functions/overview#about-neon-functions)).

## Why region matters for every query

A request that runs five queries pays the network round trip five times. When the function runs in one cloud region and the database in another, every one of those round trips crosses regions, and the cost compounds in transactions, ORMs that issue several statements per call, and agents that query between model calls. Keeping the code and the data in one region removes that cost without caching or query batching.

The usual way to get there is to pin your host's function region to match the database by hand, and keep the two in sync as you add environments. With Neon Functions, the function is deployed to the branch, so it's always where the data is.

## Credentials come with the branch

Neon injects connection strings and service credentials at runtime, resolved from the branch the function is deployed to ([environment variables](/docs/compute/functions/environment-variables#neon-injected-variables)):

- `DATABASE_URL` (pooled, for most queries) and `DATABASE_URL_UNPOOLED` (direct, for migrations, `LISTEN`/`NOTIFY`, and multi-round-trip transactions).
- `NEON_BRANCH`, plus Managed Better Auth URLs, the Data API URL, AI Gateway credentials, and `AWS_*` variables for Object Storage when those services are enabled on the branch.

Because the values are branch-scoped, a function deployed to a preview branch connects to the preview's database. There's no connection string to copy between environments.

## Connecting from the function

Functions are long-running, so create a `pg` pool once at module scope with a small `max` and reuse it across requests. Call `attachDatabasePool` so idle disconnects after scale to zero or a pooler reclaim don't crash the process ([quickstart](/docs/compute/functions/get-started)):

```ts
import { Pool } from 'pg';
import { attachDatabasePool } from '@neon/functions';

const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
attachDatabasePool(pool);

export default {
  async fetch() {
    const { rows } = await pool.query('SELECT now() AS time');
    return Response.json(rows[0]);
  },
};
```

You don't need to drain the pool on shutdown. When the runtime evicts an idle function, Neon's pooler reclaims those connections.

## What they're good for

Functions fit REST APIs, AI agents that stream across several model calls, WebSocket and SSE servers, MCP servers, webhook handlers, and scheduled or upload-driven jobs through [Function Triggers](/docs/compute/functions/triggers/overview) ([when to use Functions](/docs/compute/functions/overview#when-to-use-neon-functions)). A handler can take up to 15 minutes to start responding, then keep streaming while data flows ([runtime limits](/docs/compute/functions/reference/runtime-limits)).

Keep your frontend on Vercel, Netlify, or another host. Neon Functions don't host websites; they're the slice of your backend that belongs next to the data ([how Functions fit with your app](/docs/compute/functions/overview#how-functions-fit-with-your-app)).

## Limits

- JavaScript and TypeScript on Node.js 24 only.
- Available in AWS US East (Ohio), US East (N. Virginia), Europe (Frankfurt), and Asia Pacific (Singapore), with support expanding toward [all regions](/docs/introduction/regions). Create the project in one of these regions to use Functions.
- Memory is fixed at 2048 MiB, and an account has a default of 100 concurrent invocations.
- On the Free plan, each project includes 10 active and 400 waiting Capacity-Hours and 1 million invocations per month. You're billed for function compute only while a request is being processed ([plans](/docs/introduction/plans#functions)).

<CTA title="Deploy a function next to your data" description="Create a Neon Function on your branch and query Postgres in the same region." buttonText="Functions quickstart" buttonUrl="/docs/compute/functions/get-started" />
