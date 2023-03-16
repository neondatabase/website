---
title: Neon serverless driver
enableTableOfContents: true
isDraft: true
---

The Neon serverless driver (currently in Beta) allows you to query data from [Vercel Edge Functions](https://vercel.com/docs/concepts/functions/edge-functions) [Cloudflare Workers](https://workers.cloudflare.com/), and other environments that support WebSockets — places where TCP sockets are not available.

The driver is a drop-in replacement for [node-postgres](https://node-postgres.com/), the popular npm `pg` package that you may already be familiar with, and it offers the same API.

You can learn more about the driver from the [README on GitHub](https://github.com/neondatabase/serverless/blob/main/README.md).

## Install the Neon serverless driver

As a drop-in replacement for [node-postgres](https://node-postgres.com/), you simply install the Neon serverless driver where you would otherwise install `pg`.

```bash
npm install @neondatabase/serverless
```

## How to use it

You can use the driver in the same way you would use `node-postgres`. Where you normally import `pg`, you simply import `@neondatabase/serverless` instead. The following examples show how to use the Neon Serverless driver with [Vercel Edge Functions](#neon-serverless-driver-with-vercel-edge-functions) and [Cloudfare Workers](#neon-serverless-driver-with-cloudflare).

### Neon serverless driver with Edge Functions

This example shows how to create a minimal Vercel Edge Function that uses the Neon serverless driver to ask PostgreSQL for the current time. For information about Verce Edge Functions, see [Edge Functions Overview].

To complete these steps, you require:

- A [Neon project](/docs/get-started-with-neon/setting-up-a-project).
- A [a Vercel account](https://vercel.com/).

To get started:

1. Ensure that you have the latest version (>= v28.9) of the Vercel CLI. To check your version, use `vc --version`. To install or update Vercel CLI, use:

    ```bash
    npm i -g vercel@latest
    ```

1. Create a Next.js project.

    ```bash
    npx create-next-app neon-ef-demo --typescript
    ```

1. Enter the new directory.

    ```bash
    cd neon-ef-demo
    ```

1. Install the Neon serverless driver package.

    ```bash
    npm install @neondatabase/serverless
    ```

1. Set your PostgreSQL credentials by creating a `.env` file and with a `DATABASE_URL` variable set to the connection string for your Neon database.

    ```bash
    touch .env.local
    ```

    You can find the connection string for your database on the Neon **Dashboard**. For information about obtaining a Neon connection string, see [Connect from any application](/docs/connect/connect-from-any-app).

    Your configured `.env.local` file should have an entry similar to:

     ```text
     DATABASE_URL="postgres://<user>:<password>@<hostname>/<dbname>"
     ```

1. Replace the code in `/pages/api/hello.ts` with the code for your function:

    ```js
    import { NextRequest, NextResponse } from 'next/server';
    import { Client } from '@neondatabase/serverless';
    export const config = {runtime: 'edge'};  
 
    export default async (request: NowRequest, response: NextRequest) => {
      const client = new Client({
        connectionString: process.env.DATABASE_URL
      })

      await client.connect()

      const result = await client.query('SELECT NOW()')
      const currentTime = result.rows[0].now

      await client.end()

      return NextResponse.json({name: `The current time is ${currentTime}``,
      });
    }
    ```

1. Deploy your function.

    ```bash
    vercel deploy
    ```

    Follow the prompts to deploy your function and once done, open the `Production` link.

1. View the function logs.

    Click on the deployed project from the Vercel dashboard and choose the **Functions** tab. This tab displays logs from any functions running within your project. Use the dropdown to select the `api/hello` function.

### Neon serverless driver with Cloudflare

This example shows how to create a minimal Cloudflare Worker that uses the Neon serverless driver to ask PostgreSQL for the current time.

To complete these steps, you require:

- A [Neon project](/docs/get-started-with-neon/setting-up-a-project).
- A [Cloudflare account](https://dash.cloudflare.com/).

To get started:

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

    You can find the connection string for your database on the Neon **Dashboard**. It appears similar to:

    ```text
     `postgres://<user>:<password>@<hostname>/<dbname>`. 
     ```

     For information about obtaining a Neon connection string, see [Connect from any application](/docs/connect/connect-from-any-app).

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

1. Type `npx wrangler publish` to deploy the Worker around the globe.

    Go to the Worker URL, and you should see a text response similar to:

    ```text
    Wed Nov 23 2022 10:34:06 GMT+0000 (Coordinated Universal Time)
    ```

    Worker has not been run in a while, you may experience a few seconds of latency, as both Cloudflare and Neon will perform cold starts. Subsequent refreshes are quicker.

<Admonition type="note">
Brief queries such as the one used in this example can generally be run on Cloudflare’s free plan. Queries with larger result sets typically exceed the 10ms CPU time available to Workers on the free plan. In that case, you will see a Cloudflare error page, and you will need to upgrade your Cloudflare service to avoid this issue.
</Admonition>

For a more in-depth example application that showcases the Neon serverless driver with Cloudflare Workers, see our [UNESCO World Heritage Sites]( Apphttps://github.com/neondatabase/serverless-cfworker-demo) and read the accompanying [blog post](https://neon.tech/blog/serverless-driver-for-postgres).

## Serverless driver example application

Neon provides an example application to help you get started with the Neon serverless driver on Vercel Edge Functions or Cloudflare Workers. The example application generates a `JSON` listing of the 10 nearest UNESCO World Heritage sites using IP geolocation (data copyright © 1992 – 2022 UNESCO/World Heritage Centre).

![UNESCO World Heritage sites app](/docs/relnotes/unesco_sites.png)

  - The [neondatabase/neon-vercel-rawsql](https://github.com/neondatabase/neon-vercel-rawsql) version of the example application demonstrates using raw SQL with Neon's serverless driver on Vercel Edge Functions.
  - The [neondatabase/neon-vercel-zapatos](https://github.com/neondatabase/neon-vercel-zapatos) version of the example application demonstrates using [Zapatos](https://jawj.github.io/zapatos/) with Neon's serverless driver on Vercel Edge Functions. Zapatos offers zero-abstraction Postgres for TypeScript.
  - The [neondatabase/neon-vercel-kysely](https://github.com/neondatabase/neon-vercel-kysely) version of the example application demonstrates using [kysely](https://github.com/koskimas/kysely) and [kysely-codegen](https://github.com/RobinBlomberg/kysely-codegen) with Neon's serverless driver on Vercel Edge Functions. Kysely is a type-safe and autocompletion-friendly typescript SQL query builder. `kysely-codegen` generates Kysely type definitions from your database.
 - The [neondatabase/serverless-cfworker-demo](https://github.com/neondatabase/serverless-cfworker-demo) version of the example application demonstrates using the Neon serverless driver on Cloudflare Workers.
