---
title: Choosing your connection method
subtitle: Find the right driver and connection type for your deployment platform
summary: >-
  Guides you to the right Postgres driver, connection type, and pooling strategy
  based on your language, deployment platform, and runtime environment.
enableTableOfContents: true
updatedOn: '2026-02-15T20:51:54.064Z'
---

Your connection method depends on where your code runs. Use the table below for a quick lookup, or read the scenario sections for detailed guidance.

## Quick reference by environment

Each scenario is [described in detail](#find-your-scenario) further down the page.

| Environment                                                                         | Recommended driver         | Pooling                                                                | Guide                                                   |
| ----------------------------------------------------------------------------------- | -------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------- |
| [Any platform (non-JS/TS)](#not-using-javascript-or-typescript)                     | Native Postgres driver     | [Neon pooled connection](/docs/connect/connection-pooling)             | [Language guides](/docs/get-started/languages)          |
| [Railway / Render / VPS / Docker](#running-on-a-long-lived-server-jsts)             | `pg` or `postgres.js`      | Client-side or [Neon pooling](/docs/connect/connection-pooling)        | [Framework guides](/docs/get-started/frameworks)        |
| [Vercel (Fluid)](#deploying-to-vercel-or-cloudflare-with-platform-pooling)          | `pg` (node-postgres)       | [`@vercel/functions`](https://www.npmjs.com/package/@vercel/functions) | [Vercel guide](/docs/guides/vercel-connection-methods)  |
| [Cloudflare + Hyperdrive](#deploying-to-vercel-or-cloudflare-with-platform-pooling) | `pg` (node-postgres)       | [Hyperdrive](https://developers.cloudflare.com/hyperdrive/)            | [Hyperdrive guide](/docs/guides/cloudflare-hyperdrive)  |
| [Cloudflare Workers](#deploying-to-another-serverless-or-edge-platform)             | `@neondatabase/serverless` | N/A                                                                    | [Serverless driver](/docs/serverless/serverless-driver) |
| [Netlify / Deno Deploy](#deploying-to-another-serverless-or-edge-platform)          | `@neondatabase/serverless` | N/A                                                                    | [Serverless driver](/docs/serverless/serverless-driver) |
| [Client-side (browser)](#building-a-client-side-app-without-a-backend)              | `@neondatabase/neon-js`    | N/A                                                                    | [Data API](/docs/data-api/overview)                     |

## Find your scenario

### Not using JavaScript or TypeScript?

Use a standard TCP-based Postgres driver with a [pooled connection](/docs/connect/connection-pooling). Connect from a secure backend server using your language's native driver.

| Language/Framework  | Guide                                       |
| ------------------- | ------------------------------------------- |
| Django (Python)     | [Django](/docs/guides/django)               |
| SQLAlchemy (Python) | [SQLAlchemy](/docs/guides/sqlalchemy)       |
| Elixir Ecto         | [Elixir Ecto](/docs/guides/elixir-ecto)     |
| Laravel (PHP)       | [Laravel](/docs/guides/laravel)             |
| Ruby on Rails       | [Ruby on Rails](/docs/guides/ruby-on-rails) |
| Go                  | [Go](/docs/guides/go)                       |
| Rust                | [Rust](/docs/guides/rust)                   |
| Java                | [Java](/docs/guides/java)                   |

For the full list, see [Language quickstarts](/docs/get-started/languages).

### Running on a long-lived server (JS/TS)?

If you deploy a JavaScript or TypeScript app to Railway, Render, a VPS, Docker, or any self-hosted environment with persistent processes, use a standard TCP driver with [connection pooling](/docs/connect/connection-pooling). Your server can maintain a connection pool across requests, making TCP the fastest and most efficient option.

Recommended drivers: [`pg` (node-postgres)](https://node-postgres.com/), [`postgres.js`](https://github.com/porsager/postgres), or [`Bun.SQL`](https://bun.com/docs/runtime/sql#postgresql).

### Deploying to Vercel or Cloudflare with platform pooling?

These platforms provide their own connection pooling, which makes standard TCP the best choice.

**Vercel (Fluid compute):** Use `pg` (node-postgres) with [`@vercel/functions`](https://www.npmjs.com/package/@vercel/functions). Vercel Fluid keeps functions warm long enough to reuse TCP connections, so you skip the connection setup cost on subsequent requests. See the [Vercel connection methods guide](/docs/guides/vercel-connection-methods) for details.

**Cloudflare (Hyperdrive):** Use `pg` (node-postgres) with [Hyperdrive](https://developers.cloudflare.com/hyperdrive/), which provides connection pooling for Workers. See the [Cloudflare Hyperdrive guide](/docs/guides/cloudflare-hyperdrive) for setup.

### Deploying to another serverless or edge platform?

For platforms like Netlify Functions, Deno Deploy, or Cloudflare Workers (without Hyperdrive), use the [Neon serverless driver](/docs/serverless/serverless-driver) (`@neondatabase/serverless`). It connects over HTTP or WebSockets instead of TCP, reducing connection setup latency.

Choose your transport based on your query pattern: use **HTTP** for single queries and non-interactive transactions, or **WebSocket** for interactive transactions and `node-postgres` compatibility. See [HTTP vs. WebSocket](#http-vs-websocket-serverless-driver) for details.

### Building a client-side app without a backend?

Use the [Neon Data API](/docs/data-api/overview) via [`@neondatabase/neon-js`](https://www.npmjs.com/package/@neondatabase/neon-js). Browsers cannot open TCP connections to Postgres, so the Data API provides a secure HTTP interface with Row-Level Security support.

<Admonition type="note">
The Data API is currently in beta.
</Admonition>

See the [JavaScript SDK reference](/docs/reference/javascript-sdk) for full documentation.

## Understanding the options

### Pooled vs. direct connections

A **pooled connection** routes traffic through PgBouncer, which manages a pool of reusable Postgres connections. Use pooled connections by default. They handle up to 10,000 concurrent client connections and work well for serverless apps and high-concurrency workloads.

A **direct connection** connects straight to Postgres without PgBouncer. Use direct connections for operations that require stable, long-lived connections or features PgBouncer does not support, such as:

- Schema migrations (Prisma Migrate, Drizzle Kit, django-admin migrate)
- `CREATE INDEX CONCURRENTLY`
- `LISTEN` / `NOTIFY`
- Temporary tables or prepared statements across multiple queries

Direct connections are limited by `max_connections`, which ranges from about 100 to 4,000 depending on your [compute size](/docs/reference/compatibility#parameter-settings-that-differ-by-compute-size).

You select pooled or direct by choosing the right connection string. Pooled strings include `-pooler` in the hostname:

```text
# Pooled
postgresql://user:pass@ep-cool-rain-123456-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# Direct
postgresql://user:pass@ep-cool-rain-123456.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

See [Connection pooling](/docs/connect/connection-pooling) for details.

### HTTP vs. WebSocket (serverless driver)

The [Neon serverless driver](/docs/serverless/serverless-driver) supports two transports:

- **HTTP** uses `fetch` requests. It is faster for single queries (~3 round trips vs. ~8 for TCP) and supports non-interactive transactions. Choose HTTP when your queries are independent, one-shot operations.
- **WebSocket** maintains a persistent connection within a request. It supports interactive transactions and is compatible with the `node-postgres` API (`Pool`, `Client`). Choose WebSocket when you need multi-step transactions or `pg` compatibility.

### Data API

The [Data API](/docs/data-api/overview) provides a REST interface to your database over HTTP. It works in browsers, edge runtimes, and anywhere you can make HTTP requests. It integrates with Neon Auth and enforces PostgreSQL [Row-Level Security](/docs/guides/row-level-security), making it suitable for client-side apps that query the database directly.

## ORM compatibility

Popular JavaScript and TypeScript ORMs work with Neon across all connection methods. For non-JS/TS ORMs (Django, SQLAlchemy, ActiveRecord, Ecto), use your language's native Postgres driver with a [pooled connection](#pooled-vs-direct-connections).

| ORM     | Supported drivers                               | Guide                                 |
| ------- | ----------------------------------------------- | ------------------------------------- |
| Drizzle | `pg`, `postgres.js`, `@neondatabase/serverless` | [Drizzle guide](/docs/guides/drizzle) |
| Kysely  | `pg`, `postgres.js`, `@neondatabase/serverless` | [Kysely guide](/docs/guides/kysely)   |
| Prisma  | `pg`, `@neondatabase/serverless`                | [Prisma guide](/docs/guides/prisma)   |
| TypeORM | `pg`                                            | [TypeORM guide](/docs/guides/typeorm) |

Choose the driver based on your platform (see the scenarios above), then configure your ORM to use it.

## Common pitfalls

| Issue                | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Double pooling       | **Neon-side pooling** uses PgBouncer to manage connections between your app and Postgres. **Client-side pooling** occurs within your driver before connections reach PgBouncer.<br /><br />If you use a pooled Neon connection, avoid adding client-side pooling on top. Let Neon handle it. If you must use client-side pooling, release connections back to the pool promptly to avoid conflicts with PgBouncer.                                                                                              |
| Understanding limits | `max_connections` is the maximum number of concurrent Postgres connections, determined by your [compute size](/docs/connect/connection-pooling#connection-limits-without-connection-pooling). `default_pool_size` is the maximum number of backend connections PgBouncer maintains per user/database pair.<br /><br />Increasing your compute to raise `max_connections` may not help if `default_pool_size` is the bottleneck. To increase `default_pool_size`, contact [Support](/docs/introduction/support). |
| Use request handlers | In serverless environments (Vercel Edge Functions, Cloudflare Workers), WebSocket connections cannot outlive a single request. Create, use, and close `Pool` or `Client` objects **within the same request handler**. Do not create them outside a handler or reuse them across handlers. See [Pool and Client](https://github.com/neondatabase/serverless?tab=readme-ov-file#pool-and-client) for details.                                                                                                     |

<NeedHelp/>
