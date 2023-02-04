---
title: Neon serverless driver
enableTableOfContents: true
isDraft: true
---

The Neon serverless driver shims the [node-postgres](https://node-postgres.com/) library to work on serverless runtimes such as Cloudflare Workers and Vercel Edge Functions — places where TCP sockets are not available — via a WebSocket proxy.

The driver also works in web browsers, but in most cases, it's not appropriate to publicly deploy the driver in that way because it would reveal your PostgreSQL credentials.

## Install the Neon serverless driver

Where you would otherwise install `pg` and `@types/pg`, instead run:

```bash
npm install @neondatabase/serverless
```

## How to use it

You can use the Neon serverless driver in the same same way that you use `node-postgres`. For example, with your Neon database connection string available in `env.DATABASE_URL`:

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

In general, serverless platforms do not keep WebSocket connections alive between requests. As a result, connecting to a database client (or establishing a connection pool) outside of the function that is run on each request does not work, generally. The Neon serverless driver exposes a `Pool` class, but at this point, that class is likely to be slower than using `Client` directly.

## Using the Neon serverless driver with Cloudflare

Brief queries such as the one used in the connection example above can generally be run on Cloudflare’s free plan. Queries with larger result sets will typically exceed the 10ms CPU time available to Workers on the free plan. In that case, you will see a Cloudflare error page, and you will need to upgrade your Cloudflare service to avoid this issue.
