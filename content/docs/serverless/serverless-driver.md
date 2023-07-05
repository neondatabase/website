---
title: Neon serverless driver
enableTableOfContents: true
subtitle: Learn how to Connect to Neon from Vercel Edge Functions and Cloudflare Workers
---

The [Neon serverless driver](https://github.com/neondatabase/serverless) is a POstgreSQL driver for JavaScript and TypeScript allows you to query data from [Vercel Edge Functions](https://vercel.com/docs/concepts/functions/edge-functions), [Cloudflare Workers](https://workers.cloudflare.com/), and other environments using HTTP or WebSockets in place of TCP. If you are using TypeScript, the driver includes types. No additional installation is required.

The driver is a drop-in replacement for [node-postgres](https://node-postgres.com/), the popular npm `pg` package that you may already be familiar with. It supports the same API.

## Install the Neon serverless driver

As a drop-in replacement for [node-postgres](https://node-postgres.com/), you simply install the Neon serverless driver where you would otherwise install `pg`. The driver includes TypeScript types (the equivalent of `@types/pg`).

```bash
npm install @neondatabase/serverless
```

## How to use it

You can use the driver in the same way you would use `node-postgres`. Where you normally import `pg`, simply import `@neondatabase/serverless` instead. The following examples show how to use the Neon Serverless driver with [Vercel Edge Functions](#neon-serverless-driver-with-vercel-edge-functions) and [Cloudfare Workers](#neon-serverless-driver-with-cloudflare).

### Neon serverless driver with Vercel Edge Functions

This example shows how to create a minimal Vercel Edge Function that uses the Neon serverless driver to ask PostgreSQL for the current time. For more information about Vercel Edge Functions, see Vercel's [Edge Functions Overview](https://vercel.com/docs/concepts/functions/edge-functions).

To complete these steps, you require:

- A [Neon project](/docs/get-started-with-neon/setting-up-a-project).
- A [Vercel account](https://vercel.com/).

To get started:

1. Ensure that you have the latest version (>= v28.9) of the Vercel CLI. To check your version, use `vercel --version`. To install or update the Vercel CLI globally, use:

    ```bash
    npm install -g vercel@latest
    ```

1. Create a Next.js project.

    ```bash
    npx create-next-app@latest neon-ef-demo --typescript
    ```

    Accept all defaults by pressing [Return].

1. Enter the new directory.

    ```bash
    cd neon-ef-demo
    ```

1. Link your new project to your Vercel account.

    ```bash
    vercel link
    ```

    Again, accept all defaults by pressing [Return].

1. Set your PostgreSQL credentials on Vercel.

    ```bash
    vercel env add DATABASE_URL
    ```

    Paste in your Neon connection string, which you can find on the Neon **Dashboard**. It will look something like this:

    ```text
    postgres://<user>:<password>@<hostname>.neon.tech/<dbname>
    ```

    Press `a` to select all Vercel environments, then [Return].

    For more information about obtaining a Neon connection string, see [Connect from any application](/docs/connect/connect-from-any-app).

1. Install the Neon serverless driver package.

    ```bash
    npm install @neondatabase/serverless
    ```

1. Replace the code in `/pages/api/hello.ts` with the code for your function:

    ```js
    import { Pool } from '@neondatabase/serverless';
    import type { NextRequest, NextFetchEvent } from 'next/server';
    
    export const config = { runtime: 'edge' };
    
    export default async (req: NextRequest, event: NextFetchEvent) => {
      const pool = new Pool({ connectionString: process.env.DATABASE_URL });
      const { rows: [{ now }] } = await pool.query('SELECT now()');
      event.waitUntil(pool.end());  // doesn't hold up the response
      return new Response(`The time is ${now}`);
    }
    ```

1. Deploy your function.

    ```bash
    vercel deploy
    ```

    Follow the prompts to deploy your function and once done, open the `Production` link. Add `/api/hello` to the URL to see the result of your Edge Function. You should see a text response similar to:

    ```text
    The time is Thu Mar 16 2023 18:23:59 GMT+0000 (Coordinated Universal Time)
    ```

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

    You can find the connection string for your database on the Neon **Dashboard**. It will look something like this:

    ```text
    postgres://<user>:<password>@<hostname>.neon.tech/<dbname> 
    ```

    For information about obtaining a Neon connection string, see [Connect from any application](/docs/connect/connect-from-any-app).

1. Add code for the Worker by replacing the generated contents in `src/index.ts` with the following code:

    ```js
    import { Pool } from '@neondatabase/serverless';
    interface Env { DATABASE_URL: string; }

    export default {
      async fetch(request: Request, env: Env, ctx: ExecutionContext) {
        const pool = new Pool({ connectionString: env.DATABASE_URL });
        const { rows: [{ now }] } = await pool.query('SELECT now()');
        ctx.waitUntil(pool.end());  // this doesn’t hold up the response
        return new Response(`The time is ${now}`);
      }
    }
    ```

1. Type `npx wrangler publish` to deploy the Worker around the globe.

    Go to the Worker URL, and you should see a text response similar to:

    ```text
    The time is Thu Mar 16 2023 18:23:59 GMT+0000 (Coordinated Universal Time)
    ```

    If the Worker has not been run in a while, you may experience a few seconds of latency, as both Cloudflare and Neon will perform cold starts. Subsequent refreshes are quicker.

<Admonition type="note">
Brief queries such as the one used in this example can generally be run on Cloudflare’s free plan. Queries with larger result sets may exceed the 10ms CPU time available to Workers on the free plan. In that case, you will see a Cloudflare error page, and you will need to upgrade your Cloudflare service to avoid this issue.
</Admonition>

## Example application

Neon provides an example application to help you get started with the Neon serverless driver on Vercel Edge Functions or Cloudflare Workers. The application generates a `JSON` listing of the 10 nearest UNESCO World Heritage sites using IP geolocation (data copyright © 1992 – 2022 UNESCO/World Heritage Centre).

![UNESCO World Heritage sites app](/docs/relnotes/unesco_sites.png)

There are different implementations of the application to choose from:

- [neondatabase/neon-vercel-rawsql](https://github.com/neondatabase/neon-vercel-rawsql) demonstrates using raw SQL with Neon's serverless driver on Vercel Edge Functions.
- [neondatabase/neon-vercel-zapatos](https://github.com/neondatabase/neon-vercel-zapatos) demonstrates using [Zapatos](https://jawj.github.io/zapatos/) with Neon's serverless driver on Vercel Edge Functions. Zapatos offers zero-abstraction Postgres for TypeScript.
- [neondatabase/neon-vercel-kysely](https://github.com/neondatabase/neon-vercel-kysely) demonstrates using [kysely](https://github.com/koskimas/kysely) and [kysely-codegen](https://github.com/RobinBlomberg/kysely-codegen) with Neon's serverless driver on Vercel Edge Functions. Kysely is a type-safe and autocompletion-friendly typescript SQL query builder. `kysely-codegen` generates Kysely type definitions from your database.
- [neondatabase/serverless-cfworker-demo](https://github.com/neondatabase/serverless-cfworker-demo) demonstrates using the Neon serverless driver on Cloudflare Workers and employs caching for high performance. There is an accompanying blog post for this example. See [Edge-compatible Serverless Driver for Postgres](https://neon.tech/blog/serverless-driver-for-postgres).
