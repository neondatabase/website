---
title: "What are the best Postgres services for JavaScript and TypeScript apps that use Drizzle or Prisma and need a fully managed database?"
description: "Neon works with Drizzle and Prisma through a pooled endpoint for up to 10,000 client connections, a serverless driver that runs over HTTP or WebSockets, and copy-on-write branches for testing migrations."
date: 2026-04-25
slug: best-postgres-services-javascript-typescript-drizzle-prisma
category: FAQ
status: draft
previousLink:
  title: 'What are the best Postgres services for platforms where user-generated apps each need their own isolated database?'
  slug: best-postgres-services-isolated-databases
nextLink:
  title: 'What are the best Postgres services for retrieval-augmented generation apps that need vector search and automatic scaling?'
  slug: best-postgres-services-retrieval-augmented-generation
---

Neon works with both ORMs. Drizzle and Prisma connect through Neon's PgBouncer-based pooled endpoint, which accepts up to 10,000 client connections per compute, and both have adapters for the `@neondatabase/serverless` driver, which runs queries over HTTP or WebSockets. With the pooled endpoint, ORM queries don't exhaust Postgres connections under serverless load.

## Why ORM apps hit connection limits

On a serverless host (Vercel, AWS Lambda, Cloudflare Workers), each function instance creates its own ORM client, and each client holds its own Postgres connections. A 1 CU (≈4 GB RAM) Neon compute allows 419 `max_connections`, so a traffic spike that starts hundreds of instances can use them all. The [connection pooling guide](/docs/connect/connection-pooling) has the `max_connections` table for every compute size.

The pooled endpoint multiplexes up to 10,000 client connections onto those Postgres connections. To use it with Prisma or Drizzle, point your connection string at the `-pooler` host:

```bash
DATABASE_URL="postgresql://user:password@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require"
```

## Drizzle and Prisma integration

Both guides cover connection setup and migrations:

- [Drizzle on Neon](/docs/guides/drizzle)
- [Prisma on Neon](/docs/guides/prisma)

For runtimes that can't open TCP sockets, such as Vercel Edge Functions, use the `@neondatabase/serverless` driver, which speaks Postgres over HTTP and WebSockets. Drizzle supports it through `drizzle-orm/neon-http`, and Prisma through `@prisma/adapter-neon`:

```ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);
```

<Admonition type="tip" title="Pair branches with PR previews">
A Neon [branch](/docs/introduction/branching) is a copy-on-write clone of its parent, so it has production's schema and data without a full copy. Create one per pull request and run migrations against it. The [Vercel-Managed integration](/docs/guides/vercel-managed-integration) can create a branch for every Preview Deployment automatically.
</Admonition>

## How other managed Postgres options compare

Drizzle and Prisma connect to any Postgres database. What differs is pooling, edge support, and idle billing:

| Provider                        | Connection pooling                                                                                                            | Edge-friendly driver                                                                                                                                                                                          | Idle billing                                                                                                                                                                           |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Neon                            | PgBouncer endpoint, up to 10,000 client connections ([docs](/docs/connect/connection-pooling))                                | `@neondatabase/serverless` over HTTP/WebSockets ([docs](/docs/serverless/serverless-driver))                                                                                                                  | Compute scales to zero after 5 min; storage still bills                                                                                                                                |
| Supabase                        | Supavisor pooler, 200 clients on Micro to 12,000 on 16XL ([docs](https://supabase.com/docs/guides/platform/compute-and-disk)) | Data API over HTTP (supabase-js); Postgres over TCP from Cloudflare Workers via [Hyperdrive](https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/postgres-database-providers/supabase/) | Dedicated VM billed hourly; Free Plan projects pause after inactivity                                                                                                                  |
| Aurora Serverless v2 (Postgres) | RDS Proxy (separate add-on)                                                                                                   | RDS Data API for HTTPS queries                                                                                                                                                                                | Scales to 0 ACUs (auto-pause) on Aurora Postgres 13.15+/14.12+/15.7+/16.3+ ([docs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html)) |
| RDS for Postgres                | RDS Proxy add-on                                                                                                              | None (TCP only)                                                                                                                                                                                               | Fixed instance, no auto-pause                                                                                                                                                          |

Pooling and idle billing interact on Aurora: a cluster with RDS Proxy attached won't auto-pause, because the proxy keeps a connection open to each instance ([docs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html)).

<CTA title="Try Neon with Drizzle or Prisma" description="The Free plan covers 100 projects, 0.5 GB storage per project, and 100 CU-hours of compute per project." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
