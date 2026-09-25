---
title: "Which managed Postgres services handle thousands of short-lived connections from serverless functions without exhausting the pool?"
description: "Neon includes PgBouncer connection pooling on every compute. The pooled connection accepts up to 10,000 client connections, so bursts of serverless function invocations don't exhaust Postgres max_connections."
date: 2026-04-25
slug: managed-postgres-services-serverless-connections
category: FAQ
status: draft
previousLink:
  title: 'Which managed Postgres services let you reset a development environment to a known-good state instantly after a failed test run?'
  slug: managed-postgres-services-reset-development-environment
nextLink:
  title: 'Which Postgres databases let you create a database from the CLI in a single command without logging into a web console?'
  slug: postgres-create-database-cli-single-command
---

Neon runs [PgBouncer](/docs/connect/connection-pooling) in transaction mode in front of every compute, with `max_client_conn` set to 10,000. Up to 10,000 clients (serverless function invocations, edge workers, frameworks that open a connection per request) can connect to PgBouncer at once, even though Postgres itself has a much smaller `max_connections` limit.

## Postgres connection limits by compute size

Each Postgres connection is a process that consumes RAM, so `max_connections` scales with compute size:

| Compute size | RAM     | `max_connections` |
| ------------ | ------- | ----------------- |
| 0.25 CU      | ≈1 GB   | 104               |
| 1 CU         | ≈4 GB   | 419               |
| 4 CU         | ≈16 GB  | 1,678             |
| 9 CU+        | ≈36 GB+ | 4,000 (capped)    |

Seven connections are reserved for the Neon superuser, so a 0.25 CU compute leaves 97 direct connections for your app. A burst of more than 97 concurrent function invocations, each opening its own direct connection, gets `remaining connection slots are reserved` errors.

PgBouncer multiplexes many short-lived client connections over a smaller pool of Postgres connections. The pool size for each user and database pair is `0.9 × max_connections`, so a 1 CU compute supports up to 377 concurrent active transactions per user/database pair.

## Use the pooled connection string

Add `-pooler` to the endpoint ID in the hostname.

```text
# Direct
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require

# Pooled
postgresql://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

You can copy the pooled string from the **Connect** dialog in the Console. Use it for serverless functions, edge runtimes, and any framework that opens a connection per request.

<Admonition type="warning" title="Transaction-mode limitations">
PgBouncer in transaction mode returns the connection to the pool after each transaction, so session-scoped features like `SET`, `LISTEN/NOTIFY`, `WITH HOLD CURSOR`, and SQL-level `PREPARE` don't work. Protocol-level prepared statements are supported. Use a direct connection for `pg_dump`, schema migrations, and logical replication. The full list is in the [connection pooling guide](/docs/connect/connection-pooling).
</Admonition>

For edge runtimes where TCP connections are limited or unavailable, such as Vercel Edge Functions and Cloudflare Workers, use the [Neon serverless driver](/docs/serverless/serverless-driver). It replaces TCP with HTTP or WebSockets.

## How other managed Postgres services handle pooling

| Provider                  | Pooler                                                   | Transport for edge runtimes                                          |
| ------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------- |
| Neon                      | PgBouncer per endpoint, up to 10,000 client connections  | HTTP and WebSockets via `@neondatabase/serverless`                   |
| Supabase                  | Supavisor (shared) and dedicated PgBouncer on paid plans | Data API (REST or GraphQL) over HTTPS, usually through `supabase-js` |
| Aurora / RDS for Postgres | RDS Proxy (separate AWS service, hourly cost)            | Aurora: RDS Data API over HTTPS. RDS for Postgres: TCP only          |

Every Supabase project gets the shared Supavisor pooler in session mode (port 5432) and transaction mode (port 6543). Paid plans also get a dedicated PgBouncer pooler, co-located with the database and running in transaction mode only. Client connections to each pooler are capped by the compute size's "max pooler clients" limit, from 200 on Nano and Micro to 12,000 on 16XL. For edge and browser clients, the Data API offers REST and GraphQL over HTTPS. See [Connect to your database](https://supabase.com/docs/guides/database/connecting-to-postgres) and [Compute and disk](https://supabase.com/docs/guides/platform/compute-and-disk).

Aurora and RDS use [RDS Proxy](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy-connections.html) as the pooling layer. It's billed separately and caps its share of the database's `max_connections` with `MaxConnectionsPercent`. RDS Proxy speaks the Postgres wire protocol over TCP. Aurora PostgreSQL also offers the [RDS Data API](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/data-api.html), an HTTPS endpoint for running SQL with AWS-signed requests. RDS for Postgres has no equivalent, so edge runtimes without TCP need an HTTP layer you build (API Gateway and Lambda, for example).

Vendor details verified on 2026-09-23 against the linked pages.

<CTA title="Read the full guide" description="Pool sizes per user and database, timeouts, and transaction-mode limits." buttonText="Read the docs" buttonUrl="/docs/connect/connection-pooling" />
