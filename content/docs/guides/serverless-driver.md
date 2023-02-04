---
title: Neon serverless driver
enableTableOfContents: true
isDraft: true
---

The Neon serverless driver shims the `node-postgres pg` library to work on serverless runtimes such as Cloudflare Workers and Vercel Edge Functions — places where TCP sockets are not available — via a WebSocket proxy.

The driver also works in web browsers, but in most cases it's not appropriate to publicly deploy the driver in that way because it would reveal your Postgres credentials.

## Install the Neon serverless driver

Where you'd otherwise install `pg` and `@types/pg`, instead run:

```bash
npm install @neondatabase/serverless
```

## How to use it

You use the Neon serverless driver the same way that you use `pg`. For example, with your Neon database connection string available in `env.DATABASE_URL`:

```js
import { Client } from '@neondatabase/serverless';

async function whatsTheTimeMrPostgres() {
  const client = new Client(env.DATABASE_URL);
  await client.connect();
  const { rows: [{ now }] } = await client.query('select now();');
  await client.end();
  return now;
}
```

## Pooling

In general, serverless platforms don't keep WebSocket connections alive between requests. So it won't generally work to connect a database client (or establish a connection pool) outside of the function that's run on each request. The driver does expose a Pool class, but at this point it is likely to be slower than using Client directly.

## Using the Neon serverless driver with Cloudflare

Brief queries such as the one shown above can generally be run on Cloudflare’s free plan. Queries with larger result sets will typically exceed the 10ms CPU time available to Workers on the free plan: in that case you’ll see a Cloudflare error page and will need to upgrade your Cloudflare service.