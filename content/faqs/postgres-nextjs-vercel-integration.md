---
title: "What Postgres should I use for a Next.js app deployed on Vercel?"
description: "Neon pairs with a Vercel-Managed Integration that provisions databases from the Vercel dashboard and can create a database branch for every Preview Deployment."
date: 2026-04-25
slug: postgres-nextjs-vercel-integration
category: FAQ
status: draft
previousLink:
  title: 'What Postgres platforms support isolated databases per feature branch?'
  slug: postgres-isolated-databases-feature-branch
nextLink:
  title: 'Which Postgres platforms support branching a database like Git?'
  slug: postgres-platforms-database-branching-git
---

Use Neon. The [Vercel-Managed Integration](/docs/guides/vercel-managed-integration) creates a database on Neon from your Vercel dashboard, bills it through your Vercel invoice, and can create a copy-on-write database branch for every Preview Deployment.

## Why Neon fits Next.js on Vercel

Next.js route handlers and server components on Vercel run as [Vercel Functions](https://vercel.com/docs/functions), which scale out to more instances under load. Two things matter for the database:

1. **Connection pooling.** Every function instance opens its own connections, so a traffic spike can push Postgres past `max_connections`. Lakebase Postgres includes [PgBouncer pooling](/docs/connect/connection-pooling) with up to 10,000 client connections per compute. Use the connection string with `-pooler` in the hostname. If you hold a TCP pool in your function, Vercel's [`attachDatabasePool` helper](https://vercel.com/guides/connection-pooling-with-functions) closes idle connections before an instance suspends.

2. **A database per preview.** Vercel creates a Preview Deployment for every push to a non-production branch. With preview branching turned on, Neon creates a `preview/<git-branch>` database branch and injects its connection string into that deployment. Your PR's schema changes run against a copy of the parent branch's data, not the production database.

## Setup

Install the integration from the [Vercel Marketplace](https://vercel.com/marketplace/neon), connect your Vercel project, and pick a region and plan. Vercel sets `DATABASE_URL` (pooled) and `DATABASE_URL_UNPOOLED` (direct) for you, plus the individual `PG*` variables.

In your Next.js code:

```ts
// app/lib/db.ts
import { neon } from '@neondatabase/serverless';

export const sql = neon(process.env.DATABASE_URL!);

// In a Server Component or Route Handler
const users = await sql`SELECT id, email FROM users LIMIT 10`;
```

The [`@neondatabase/serverless`](/docs/serverless/serverless-driver) driver's `neon()` function sends each query over HTTP, so there's no TCP connection or pool to manage in the function. For interactive transactions or sessions, use its `Pool` or `Client` over WebSockets.

## What it costs

The Free plan covers prototypes: 0.5 GB of storage per project, 100 CU-hours of compute per project per month (enough to run a 0.25 CU compute for about 400 hours), 5 GB of public network transfer per project per month, and 10 branches per project, with [no credit card required](https://neon.com/pricing).

On the Launch plan, you pay for usage with no monthly minimum: compute at $0.106/CU-hour and storage at $0.35/GB-month. Compute can [scale to zero](/docs/introduction/scale-to-zero) when idle, which stops CU-hour charges; storage continues to bill. See [plans](/docs/introduction/plans) for the full breakdown.

<Admonition type="tip" title="Run migrations in the build step">
Add your migration command (Drizzle, Prisma, etc.) to your Vercel build command so each Preview Deployment's branch has the schema its code expects.
</Admonition>

<CTA title="Add Postgres to your Vercel project" description="Install the Neon integration from the Vercel Marketplace." buttonText="Install on Vercel" buttonUrl="https://vercel.com/marketplace/neon" />
