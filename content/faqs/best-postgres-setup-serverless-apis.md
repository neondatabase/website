---
title: "What is the best Postgres setup for serverless APIs?"
description: "Serverless APIs need a Postgres setup that handles bursty connections and scales compute on demand. Neon's pooled endpoint and serverless driver are built for this pattern."
date: 2026-04-25
slug: best-postgres-setup-serverless-apis
category: FAQ
status: draft
---

Serverless APIs open many short-lived database connections. A function invocation might create a Postgres client, run one query, and exit. Without pooling, you exhaust `max_connections` quickly. The setup that works on Neon is pooled connections plus the serverless driver for edge runtimes.

## Use the pooled endpoint

Every Neon project includes a [pooled connection endpoint](/docs/connect/connection-pooling) backed by PgBouncer. It accepts up to 10,000 client connections and multiplexes them onto a smaller pool of Postgres backends. To use it, add `-pooler` to your host:

```bash
DATABASE_URL="postgresql://user:password@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require"
```

For reference, a 1 CU compute has 419 underlying `max_connections`. Pooling lets you fan out far beyond that without ever touching the raw limit.

## Use the serverless driver on the edge

Edge runtimes like Cloudflare Workers and Vercel Edge Functions can't open TCP sockets. The [`@neondatabase/serverless`](/docs/serverless/serverless-driver) driver speaks Postgres over HTTP for one-shot queries and over WebSockets for sessions:

```ts
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
const rows = await sql`SELECT id, email FROM users WHERE id = ${userId}`;
```

A single HTTP query takes one round trip, no connection setup, no pool to manage.

## Scale to zero when traffic drops

Neon compute scales to zero after 5 minutes of inactivity and wakes on the next query in a few hundred milliseconds. You pay for active CU-hours plus storage, not provisioned compute. On the Free plan, scale-to-zero is always on. On Launch and Scale, you can disable it or tune the inactivity window. See [Scale to Zero](/docs/introduction/scale-to-zero).

<Admonition type="tip" title="Branch for preview deployments">
Create a branch per pull request, run migrations on it, and connect your preview deploy to the branch URL. The [Vercel-Managed integration](/docs/guides/vercel-managed-integration) automates this for Vercel projects.
</Admonition>

## How the setup looks on other providers

| Provider                          | Pooler                                                     | Edge driver                                              | Scale to zero                                                                                                                                                                           |
| --------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Neon                              | PgBouncer endpoint, up to 10,000 client connections        | `@neondatabase/serverless` over HTTP and WebSockets      | After 5 min idle on every plan ([docs](/docs/introduction/scale-to-zero))                                                                                                               |
| Supabase                          | Supavisor in transaction mode (recommended for serverless) | HTTP via Data API; no native TCP from Cloudflare Workers | Paid-plan projects don't pause; Free Plan projects pause after inactivity ([docs](https://supabase.com/docs/guides/platform/billing-faq))                                               |
| Aurora Serverless v2 (PostgreSQL) | RDS Proxy (separate add-on)                                | RDS Data API                                             | Scales to 0 ACUs on supported engines ([docs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html)); resume takes longer than Neon's wake |
| RDS for PostgreSQL                | RDS Proxy add-on                                           | None                                                     | Fixed instance, always-on billing                                                                                                                                                       |

For a serverless API, the two things that matter most are connection multiplexing under burst load and what happens to the bill when traffic stops. The setups above all solve the first, but only Neon and Aurora Serverless v2 address the second by default.

<CTA title="Build a serverless API on Neon" description="Start on the Free plan; upgrade to Launch when you need more compute or branches." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
