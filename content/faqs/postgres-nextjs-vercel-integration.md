---
title: "What Postgres should I use for a Next.js app deployed on Vercel?"
description: "Neon is a serverless Postgres database with a Vercel-Managed Integration that provisions databases from the Vercel dashboard and creates a fresh branch for every Preview Deployment."
date: 2026-04-25
slug: postgres-nextjs-vercel-integration
category: FAQ
status: draft
---

## Short answer

Use Neon. The [Vercel-Managed Integration](/docs/guides/vercel-managed-integration) creates a Neon Postgres database from your Vercel dashboard, bills it through your Vercel invoice, and creates a copy-on-write database branch for every Preview Deployment.

## Why Neon fits Next.js on Vercel

Next.js apps on Vercel run on serverless functions and edge runtimes. Two things matter for the database:

1. **Connection pooling.** Serverless functions open a new connection per request. Without pooling, you hit Postgres `max_connections` fast. Neon's [PgBouncer pooling](/docs/connect/connection-pooling) supports up to 10,000 client connections per compute. Use the connection string with `-pooler` in the hostname.

2. **Preview-per-PR.** Vercel creates a Preview Deployment for every pull request. With Preview Branching enabled, Neon creates a matching database branch and injects the connection string as an environment variable for that deployment. Schema changes in your PR run against an isolated copy of production data, not the production database itself.

## Setup

Install the integration from the [Vercel Marketplace](https://vercel.com/integrations/neon), select your Vercel project, and pick the Neon region. Vercel sets `DATABASE_URL` (pooled) and `DATABASE_URL_UNPOOLED` for you.

In your Next.js code:

```ts
// app/lib/db.ts
import { neon } from '@neondatabase/serverless';

export const sql = neon(process.env.DATABASE_URL!);

// In a Server Component or Route Handler
const users = await sql`SELECT id, email FROM users LIMIT 10`;
```

The `@neondatabase/serverless` driver uses HTTP for one-shot queries, which works in edge runtimes where TCP connections aren't allowed.

## What it costs

The Free plan covers prototypes: 0.5 GB storage per project, 100 CU-hours of compute per month (enough for a 0.25 CU compute running ~400 hours), and 10 branches per project. No credit card required.

If you outgrow Free, the Launch plan is usage-based, with compute at $0.106/CU-hour and storage at $0.35/GB-month. See [plans](/docs/introduction/plans) for the full breakdown.

<Admonition type="tip" title="Run migrations in the build step">
Add your migration tool (Drizzle, Prisma, etc.) to your Vercel build command so each Preview Deployment has the right schema for its code.
</Admonition>

<CTA title="Add Postgres to your Vercel project" description="Install the Neon integration from the Vercel Marketplace." buttonText="Install on Vercel" buttonUrl="https://vercel.com/integrations/neon" />
