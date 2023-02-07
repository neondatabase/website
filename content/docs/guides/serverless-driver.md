---
title: Neon serverless driver
enableTableOfContents: true
isDraft: true
---

The Neon serverless driver (currently in Beta) allows you to query data from [Cloudflare Workers](https://workers.cloudflare.com/), [Vercel Edge Functions](https://vercel.com/docs/concepts/functions/edge-functions), and other environments that support WebSockets — places where TCP sockets are not available.

The driver is a drop-in replacement for [node-postgres](https://node-postgres.com/), the popular `npm pg` package that you may already be familiar with, and it offers the same API.

You learn more about the driver from the `README` on [GitHub](https://github.com/neondatabase/serverless).

## Install the Neon serverless driver

As a drop-in replacement for the [node-postgres](https://node-postgres.com/) package, you simply install the Neon serverless driver where you would otherwise install `pg` and `@types/pg`.

```bash
npm install @neondatabase/serverless
```

## How to use it

You can use the Neon serverless driver in the same way you would use `node-postgres`. For example, with your Neon database connection string defined by `env.DATABASE_URL`, you can use the driver in a serverless function as shown below:

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

## Neon serverless driver with Cloudflare

This example shows how to create a minimal Cloudflare Worker that uses the Neon serverless driver to ask PostgreSQL for the current time.

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
    npm install @neondatabase/serverless
    ```

1. Set your PostgreSQL credentials by running the following command and providing the connection string for your Neon database when prompted.

    ```bash
    npx wrangler secret put DATABASE_URL
    ```

    You can find the connection string for your database on the Neon **Dashboard**. It appears similar to: `postgres://<user>:<password>@<hostname>/<dbname>`. For information about obtaining your Neon connection string, see [Connect from any application](/docs/connect/connect-from-any-app).

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

    Go to the Worker URL, and you should see a text response similar to:

    ```text
    Wed Nov 23 2022 10:34:06 GMT+0000 (Coordinated Universal Time)
    ```

    If the Worker has not been run in a while, you may experience a few seconds of latency, as both Cloudflare and Neon will perform cold starts. Subsequent refreshes are quicker.

<Admonition type="note">
Brief queries such as the one used in the example above can generally be run on Cloudflare’s free plan. Queries with larger result sets typically exceed the 10ms CPU time available to Workers on the free plan. In that case, you will see a Cloudflare error page, and you will need to upgrade your Cloudflare service to avoid this issue.
</Admonition>

For a more extensive example that showcases the Neon serverless driver with Cloudflare Workers, see our [UNESCO World Heritage Sites]( Apphttps://github.com/neondatabase/serverless-cfworker-demo) and read the accompanying [blog post](https://neon.tech/blog/serverless-driver-for-postgres).

## Neon serverless driver with Vercel Edge Functions

This example shows how to create a minimal Vercel Edge Function with Next.js that uses the Neon serverless driver to ask PostgreSQL for the current time.

1. Ensure that you have the latest version (>= v28.9) of the Vercel CLI. To check your version, use `vc --version`. To install or update Vercel CLI, use:

    ```bash
    npm i -g vercel@latest
    ```

1. Create a Next.js project.

    ```bash
    npx create-next-app --typescript
    ```

    This example accepts the option to create the `/src` directory for the project, which contains a `hello.ts` file where the function code will be added.

1. Enter the new directory.

    ```bash
    cd neon-vercel-ef-demo
    ```

1. Install the Neon serverless driver package.

    ```bash
    npm install @neondatabase/serverless
    ```

1. Add code to your function. In this example, the code is added to `/src/pages/api/hello.ts`

    ```js
    import { NowRequest, NowResponse } from '@now/node'
    import { Client } from '@neondatabase/serverless'
    import * as dotenv from 'dotenv'

    dotenv.config()

    export default async (request: NowRequest, response: NowResponse) => {
      const client = new Client({
        connectionString: process.env.DATABASE_URL
      })

      await client.connect()

      const result = await client.query('SELECT NOW()')
      const currentTime = result.rows[0].now

      await client.end()

      response.status(200).send(`The current time is ${currentTime}`)
    }

    export const config = {
      runtime: 'edge',
    };
    ```

1. Deploy your function.

    ```bash
    vercel deploy
    ```

    Follow the prompts to deploy your function and once done, open the `Production` link.

1. View the function logs.

    From your dashboard, click on the deployed project and choose the **Functions** tab. This tab displays logs from any running functions within your project. Use the dropdown to select the `api/hello` function.
