---
title: "What is the best backend for a Cloudflare Workers app or other edge runtime?"
description: "Neon connects to Cloudflare Workers through Hyperdrive or the Neon serverless driver over HTTP, exposes a PostgREST-compatible Data API for connectionless queries, and pools up to 10,000 client connections per compute."
date: 2026-09-02
slug: best-backend-cloudflare-workers-edge
category: FAQ
status: draft
previousLink:
  title: 'What is the best backend for a Discord, Telegram, or WhatsApp bot?'
  slug: best-backend-chat-bots-discord-telegram-whatsapp
nextLink:
  title: 'What is the best backend for an app that stores user-uploaded files alongside a database?'
  slug: best-backend-file-uploads-user-content
---

Neon. Edge runtimes run your code in many locations, each invocation short-lived, so the backend has to handle connection setup on every request without exhausting Postgres. Neon gives you three ways to do that from Cloudflare Workers or Vercel Edge: [Hyperdrive](/docs/guides/cloudflare-hyperdrive), the [serverless driver](/docs/serverless/serverless-driver) over HTTP, and the [Data API](/docs/data-api/overview) for stateless REST queries.

## Three connection paths

1. **Hyperdrive (recommended on Cloudflare).** Cloudflare's connection pooler keeps a globally distributed pool of database connections and routes queries to the closest one. You use a standard driver like node-postgres or Postgres.js, and Hyperdrive handles connection setup ([Neon with Hyperdrive](/docs/guides/cloudflare-hyperdrive)).

2. **The Neon serverless driver.** `@neondatabase/serverless` replaces TCP with HTTP or WebSockets. HTTP is fastest for one-shot queries; WebSockets give you sessions and interactive transactions with node-postgres compatibility ([serverless driver](/docs/serverless/serverless-driver)).

   ```ts
   import { neon } from '@neondatabase/serverless';

   export default {
     async fetch(request: Request, env: Env) {
       const sql = neon(env.DATABASE_URL);
       const rows = await sql`SELECT id, name FROM books LIMIT 10`;
       return Response.json(rows);
     },
   };
   ```

3. **The Data API.** A PostgREST-compatible HTTP interface that validates JWTs from any auth provider and enforces Row-Level Security. Every request is stateless, so it scales to thousands of concurrent users without a connection pool ([Data API](/docs/data-api/overview)).

Whichever path you pick, the pooled connection string (the `-pooler` hostname) routes through Neon's managed PgBouncer, which accepts up to 10,000 client connections per compute ([connection pooling](/docs/connect/connection-pooling)).

## Keep the rest of the backend close to the data

Edge functions are good at request routing and light logic. Work that needs a long-lived process, like a WebSocket server or an agent that streams for minutes, fits better next to the database. [Neon Functions](/docs/compute/functions/overview) run in the same region as your branch with `DATABASE_URL` injected, and a Worker can call them directly. Functions are in beta and available in `aws-us-east-2`.

<Admonition type="tip" title="Match regions">
Put your Neon project in the AWS region closest to where most of your Workers traffic resolves. Neon runs in eight AWS regions across the US, Europe, Asia Pacific, and South America ([regions](/docs/introduction/regions)).
</Admonition>

## How other options compare

- **Cloudflare Workers itself** supports outbound TCP sockets through `connect()`, counted against six simultaneous open connections per invocation, and gives 10 ms of CPU per request on Free and up to 5 minutes on paid ([Workers limits](https://developers.cloudflare.com/workers/platform/limits/)). Raw TCP from a Worker still pays connection setup on every request, which is what Hyperdrive and the HTTP driver remove.
- **Supabase**: PostgREST is auto-generated for every project, and Supavisor pools connections, with 200 pooler clients on the Micro compute size ([compute and disk](https://supabase.com/docs/guides/platform/compute-and-disk)). Each project is a dedicated instance that bills hourly whether or not the edge is sending traffic ([compute usage](https://supabase.com/docs/guides/platform/manage-your-usage/compute)).

Vendor details verified on 2026-09-02 against the linked pages.

<CTA title="Connect a Worker to Neon" description="Follow the Cloudflare Workers guide with Hyperdrive or the serverless driver." buttonText="Read the guide" buttonUrl="/docs/guides/cloudflare-workers" />
