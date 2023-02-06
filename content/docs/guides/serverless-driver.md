---
title: Neon serverless driver
enableTableOfContents: true
isDraft: true
---

The Neon serverless driver allows you to query data from [Cloudflare Workers](https://workers.cloudflare.com/), [Vercel Edge Functions](https://vercel.com/docs/concepts/functions/edge-functions), and other environments that support WebSockets — places where TCP sockets are not available.

The driver is a drop-in replacement for [node-postgres](https://node-postgres.com/), the popular `npm pg` package that you may already be familiar with, and and offers the same API.

You can find out more about the driver from the [@neondatabase/serverless](https://www.npmjs.com/package/@neondatabase/serverless) `README` on [npmjs.com](https://www.npmjs.com/package/@neondatabase/serverless) or [GitHub](https://github.com/neondatabase/serverless).

## Install the Neon serverless driver

As a a drop-in replacement for [node-postgres](https://node-postgres.com/), you simply install the Neon serverless driver where you would otherwise install `pg` and `@types/pg`.

```bash
npm install @neondatabase/serverless
```

## How to use it

Use the Neon serverless driver in the same way that you would use `node-postgres`. For example, with your Neon database connection string defined by `env.DATABASE_URL`, you can use the driver as shown below:

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

In general, serverless platforms do not keep WebSocket connections alive between requests. As a result, connecting to a database client (or establishing a connection pool) outside of the function that is run on each request does not generally work. The Neon serverless driver exposes a `Pool` class, but at this point, that class is likely to be slower than using `Client` directly.

## Neon serverless driver with Cloudflare

The following example shows how to create a minimal Cloudflare Worker that asks PostgreSQL for the current time.

1. Create a Worker by running the following command. Accept the defaults.

    ```bash
    npx wrangler init neon-cf-demo
    ```

1. Enter the new directory.

    ```bash
    cd neon-cf-demo
    ```

1. Install the Neon serverless driver package.

    ```bash
    npm install @neondatabase/serverless.
    ```

1. Set your PostgreSQL credentials by running the following command and providing the connection string for your Neon database when prompted.

    ```bash
    npx wrangler secret put DATABASE_URL
    ```

    You can find the connection string for your database on the Neon **Dashboard**. It appears similar to: `postgres://user:password@endpoint-name-123456.region.aws.neon.tech/dbname`. For more information about obtaining a Neon connection string, see [Connect from any application](/docs/connect/connect-from-any-app).

1. Add code for the Worker by replacing the generated contents in `src/index.ts` with the following code:

    ```js
    import { Client } from '@neondatabase/serverless';
    interface Env { DATABASE_URL: string; }

    export default {
      async fetch(request: Request, env: Env, ctx: ExecutionContext) {
        const client = new Client(env.DATABASE_URL);
        await client.connect();
        const { rows: [{ now }] } = await client.query('select now();');
        ctx.waitUntil(client.end());  // this doesn’t hold up the response

        return new Response(now);
      }
    }
    ```

1. To try the Worker locally, type `npm start`. To deploy the Worker around the globe, type `npx wrangler publish`.

    Go to the worker URL, and you should see a text response similar to:

    ```text
    Wed Nov 23 2022 10:34:06 GMT+0000 (Coordinated Universal Time)
    ```

    If the Worker has not been run in a while, you may experience a few seconds of latency, as both Cloudflare and Neon will perform cold starts. Subsequent refreshes are quicker.

<Admonition type="note">
Brief queries such as the one used in the example above can generally be run on Cloudflare’s free plan. Queries with larger result sets will typically exceed the 10ms CPU time available to Workers on the free plan. In that case, you will see a Cloudflare error page, and you will need to upgrade your Cloudflare service to avoid this issue.
</Admonition>

For a more extensive example of Neon serverless driver with Cloudflare Workers, see our [UNESCO World Heritage Sites]( Apphttps://github.com/neondatabase/serverless-cfworker-demo) and read the accompanying [blog post](https://neon.tech/blog/serverless-driver-for-postgres).

## Neon serverless driver with Vercel Edge Functions

TBD
