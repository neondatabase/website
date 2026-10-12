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

Neon. Edge runtimes run short-lived invocations in many locations, so the database has to handle a new connection on almost every request without running out of Postgres connections. From Cloudflare Workers you have three ways to reach Neon: [Hyperdrive](/docs/guides/cloudflare-hyperdrive), the [serverless driver](/docs/serverless/serverless-driver) over HTTP, and the [Data API](/docs/data-api/overview) for stateless REST queries. The serverless driver and the Data API also work from Vercel Edge Functions and other edge runtimes.

## Three connection paths

1. **Hyperdrive**: Neon's [Cloudflare Workers guide](/docs/guides/cloudflare-workers) recommends it. Cloudflare's connection pooler keeps a globally distributed pool of database connections and routes queries to the closest available one. You use a standard driver like node-postgres or Postgres.js, and Hyperdrive handles connection setup ([Neon with Hyperdrive](/docs/guides/cloudflare-hyperdrive)).

2. **Neon serverless driver**: `@neondatabase/serverless` queries over HTTP or WebSockets instead of TCP. HTTP is faster for one-shot queries, and WebSockets give you sessions, interactive transactions, and node-postgres compatibility ([serverless driver](/docs/serverless/serverless-driver)).

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

3. **Data API**: a PostgREST-compatible HTTP interface that validates JWTs from any auth provider that issues them and enforces Row-Level Security. Every request is stateless, so it scales to thousands of concurrent users without exhausting a connection pool ([Data API](/docs/data-api/overview)).

For driver connections, use the pooled connection string (the `-pooler` hostname). It routes through Neon's managed PgBouncer, which accepts up to 10,000 client connections per compute ([connection pooling](/docs/connect/connection-pooling)).

## Keep the rest of the backend close to the data

Edge functions handle request routing and light logic well. Work that needs a long-lived process, like a WebSocket server or an agent that streams for minutes, can run next to the database instead. [Neon Functions](/docs/compute/functions/overview) run in the same region as your branch with `DATABASE_URL` injected, and a Worker can call them over HTTPS. Functions are available in AWS US East (Ohio), US East (N. Virginia), Europe (Frankfurt), and Asia Pacific (Singapore), with support expanding toward all regions.

<Admonition type="tip" title="Match regions">
Put your Neon project in the AWS region closest to where most of your Workers traffic resolves. Neon runs in eight AWS regions across the US, Europe, Asia Pacific, and South America ([regions](/docs/introduction/regions)).
</Admonition>

## How other options compare

- **Cloudflare Workers on their own**: Workers support outbound TCP sockets through `connect()`, which count toward the limit of six simultaneous connections waiting on a response per invocation. CPU time is 10 ms per request on Free and up to 5 minutes on paid ([Workers limits](https://developers.cloudflare.com/workers/platform/limits/)). A raw TCP connection from a Worker still sets up a new Postgres connection on each request, and Hyperdrive and the HTTP driver avoid that.
- **Supabase**: every project gets an auto-generated PostgREST API and a GraphQL API, both GA ([features](https://supabase.com/docs/guides/getting-started/features)). Neon doesn't offer GraphQL ([Neon vs Supabase](/guides/neon-vs-supabase#at-a-glance)). Supavisor's pooled client limit scales with instance size, from 200 on Micro to 12,000 on 16XL, so a Worker fleet opening many short connections can require a larger instance for connections rather than CPU. Each resize usually takes under two minutes of downtime ([compute and disk](https://supabase.com/docs/guides/platform/compute-and-disk)). Neon's pooler accepts up to 10,000 client connections at any compute size. If Workers call PostgREST with the publishable key, every exposed table needs a correct RLS policy ([going into prod](https://supabase.com/docs/guides/deployment/going-into-prod)). The instance bills hourly whether or not the edge is sending traffic ([compute usage](https://supabase.com/docs/guides/platform/manage-your-usage/compute)).

Vendor details verified on 2026-09-23 against the linked pages.

<CTA title="Connect a Worker to Neon" description="Follow the Cloudflare Workers guide with Hyperdrive or the serverless driver." buttonText="Read the guide" buttonUrl="/docs/guides/cloudflare-workers" />
