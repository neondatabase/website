---
title: Neon serverless driver
enableTableOfContents: true
subtitle: Learn how to Connect to Neon from Serverless and Edge environments over HTTP or Websockets
---

The [Neon serverless driver](https://github.com/neondatabase/serverless) is a low-latency PostgreSQL driver for JavaScript and TypeScript that allows you to query data from serverless and edge environments over HTTP or WebSockets in place of TCP.

The driver is a drop-in replacement for [node-postgres](https://node-postgres.com/), the popular npm `pg` package that you may already be familiar with.

The driver's low-latency capability is due to message pipelining and other optimizations. You can read about those optimizations [here](https://neon.tech/blog/quicker-serverless-postgres).

## HTTP or Websockets?

The Neon Serverless driver supports querying over HTTP and Websockets. Querying over an HTTP [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) request is fast but only supports sending one query at a time. If you are using single-shot queries, such as the one shown below, with no sessions or transactions, consider using HTTP for faster responses.

```js
const [post] = await sql`SELECT * FROM posts WHERE id = ${postId}`;
```

If you are working with sessions and transactions, as in the example below, or require full `node-postgres` compatibility to enable query libraries like [Kysely](https://kysely.dev/) or [Zapatos](https://jawj.github.io/zapatos/), use Websockets.

```js
try {
  await client.query('BEGIN');
  const { rows: [{ id: postId }] } = await client.query('INSERT INTO posts (title) VALUES ($1) RETURNING id', ['Welcome']);
  await client.query('INSERT INTO photos (post_id, url) VALUES ($1, $2)', [postId, 's3.bucket/photo/url']);
  await client.query('COMMIT');

} catch (err) {
  await client.query('ROLLBACK');
  throw err;

} finally {
  client.release();
}
```

## Install the Neon serverless driver

You can install the driver with your preferred JavaScript package manager. For example:

```shell
npm install @neondatabase/serverless
```

The driver includes TypeScript types (the equivalent of `@types/pg`). No additional installation is required.

## Configure your Neon database connection

You can obtain a connection string for your database from **Connection Details** widget on the Neon **Dashboard** and set it as an environment variable in your project's `.env` file, for example. Your Neon connection string will look something like this:

```shell
DATABASE_URL=postgres://<user>:<password>@ep-icy-sun-148107.us-east-2.aws.neon.tech/<dbname>
```

## How to use the driver

You can use the driver in the same way you would use `node-postgres`. Where you usually import `pg`, import `@neondatabase/serverless` instead. The following sections show how to use the driver over HTTP and Websockets.

## Use the driver over HTTP

To use the Neon Serverless driver over HTTP, you must use the driver's `neon` function. For example:

```js
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

const [post] = await sql`SELECT * FROM posts WHERE id = ${postId}`;
// `post` is now { id: 12, title: 'My post', ... } (or undefined)
```

<Admonition type="note">
Interpolating `${postId}` in the example above is [safe from SQL injection](https://neon.tech/blog/sql-template-tags).
</Admonition>

You can turn this example into a complete API endpoint deployed on Vercel Edge Functions at https://myapp.vercel.dev/api/post?postId=123 by following these steps:

1. Create a new file, `api/post.ts`, and add the following code:

    ```js
    import { neon } from '@neondatabase/serverless';
    const sql = neon(process.env.DATABASE_URL);

    export default async (req: Request, ctx: any) => {
    // get and validate the `postId` query parameter
    const postId = parseInt(new URL(req.url).searchParams.get('postId'), 10);
    if (isNaN(postId)) return new Response('Bad request', { status: 400 });

    // query and validate the post
    const [post] = await sql`SELECT * FROM posts WHERE id = ${postId}`;
    if (!post) return new Response('Not found', { status: 404 });

    // return the post as JSON
    return new Response(JSON.stringify(post), { 
        headers: { 'content-type': 'application/json' }
    });
    }

    export const config = {
    runtime: 'edge',
    regions: ['iad1'],  // specify the region nearest your Neon DB
    };
    ```

2. Deploy the Vercel Edge function using the following commands:

    ```shell
    npm install -g vercel  # install vercel CLI
    npx vercel env add DATABASE_URL  # paste Neon connection string, select all environments
    npx vercel dev  # check working locally, then ...
    npx vercel deploy
    ```

### Additional configuration options

The `neon(...)` function has configuration options for customizing the return format of the query function. See [Options and configuration](https://github.com/neondatabase/serverless/blob/main/CONFIG.md#options-and-configuration), in the driver's GitHub repository, for information about those options.

## Use the driver over Websockets

To use the Neon Serverless driver over Websockets, use either the `Pool` or `Client` constructor. These constructors provide session and transaction support, as well as `node-postgres` compatibility. The full API guide for the `Pool` and `Client` constructors can be found in the [node-postgres](https://node-postgres.com/) documentation.

When using these constructors, there are two key points you need to know:

- In Node.js and some other environments, there's no built-in WebSocket support. In these cases, you must supply a WebSocket constructor function.
- In serverless environments such as Vercel Edge Functions or Cloudflare Workers, WebSocket connections cannot outlive a single request. That means `Pool` or `Client` objects must be connected, used, and closed within a single request handler. Don't create these objects outside a request handler; don't create them in one handler and try to reuse them in another; and to avoid exhausting available connections, don't forget to close them.

These points are demonstrated in the following examples.

### Node.js with `Pool.connect()`

In Node.js, it takes two lines to configure WebSocket support. For example:

```js
import { Pool, neonConfig } from '@neondatabase/serverless';

import ws from 'ws';
neonConfig.webSocketConstructor = ws;  // <-- this is the key part

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.on('error', err => console.error(err));
// ...

const client = await pool.connect();

try {
  await client.query('BEGIN');
  const { rows: [{ id: postId }] } = await client.query('INSERT INTO posts (title) VALUES ($1) RETURNING id', ['Welcome']);
  await client.query('INSERT INTO photos (post_id, url) VALUES ($1, $2)', [postId, 's3.bucket/photo/url']);
  await client.query('COMMIT');

} catch (err) {
  await client.query('ROLLBACK');
  throw err;

} finally {
  client.release();
}

// ...
await pool.end();
```

Other WebSocket libraries are available. For example, you could replace `ws` in the above example with `undici`:

```js
import { WebSocket } from 'undici';
neonConfig.webSocketConstructor = WebSocket; 
```

### Vercel Edge Function with `Pool.query()`

You can rewrite the example above as a Vercel Edge Function using `Pool`, as follows:

```js
import { Pool } from '@neondatabase/serverless';

// *don't* create a `Pool` or `Client` here, outside the request handler

export default async (req: Request, ctx: any) => {
  // create a `Pool` inside the request handler
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  // get and validate the `postId` query parameter
  const postId = parseInt(new URL(req.url).searchParams.get('postId'), 10);
  if (isNaN(postId)) return new Response('Bad request', { status: 400 });

  // query and validate the post
  const [post] = await pool.query('SELECT * FROM posts WHERE id = $1', [postId]);
  if (!post) return new Response('Not found', { status: 404 });

  // end the `Pool` inside the same request handler 
  // (unlike `await`, `ctx.waitUntil` won't hold up the response)
  ctx.waitUntil(pool.end());

  // return the post as JSON
  return new Response(JSON.stringify(post), { 
    headers: { 'content-type': 'application/json' }
  });
}

export const config = {
  runtime: 'edge',
  regions: ['iad1'],  // specify the region nearest your Neon DB
};
```

<Admonition type="note">
The pooling capabilities of `Pool` are not used in this example. But it's slightly briefer than using `Client` and, because `Pool.query` is designed for one-shot queries, we may in the future automatically route these queries over HTTPS for lower latency.
</Admonition>

### Vercel Edge Function with `Client`

Using `Client` instead, the Vercel Edge Function example looks like this:

```js
import { Client } from '@neondatabase/serverless';

// don't create a `Pool` or `Client` here, outside the request handler

export default async (req: Request, ctx: any) => {
  // create a `Client` inside the request handler
  const client = new Client(process.env.DATABASE_URL);
  await client.connect();

  // get and validate the `postId` query parameter
  const postId = parseInt(new URL(req.url).searchParams.get('postId'), 10);
  if (isNaN(postId)) return new Response('Bad request', { status: 400 });

  // query and validate the post
  const [post] = await client.query('SELECT * FROM posts WHERE id = $1', [postId]);
  if (!post) return new Response('Not found', { status: 404 });

  // end the `Client` inside the same request handler 
  // (unlike `await`, `ctx.waitUntil` won't hold up the response)
  ctx.waitUntil(client.end());

  // return the post as JSON
  return new Response(JSON.stringify(post), { 
    headers: { 'content-type': 'application/json' }
  });
}

export const config = {
  runtime: 'edge',
  regions: ['iad1'],  // specify the region nearest your Neon DB
};
```

### Configuration options for `Pool` and `Client`

There are additional configuration options that apply to `Pool` and `Client`. See [Options and configuration](https://github.com/neondatabase/serverless/blob/main/CONFIG.md#options-and-configuration), in the driver's GitHub repository, for information.

## More examples

Neon provides an example application to help you get started with the Neon serverless driver. The application generates a `JSON` listing of the 10 nearest UNESCO World Heritage sites using IP geolocation (data copyright © 1992 – 2022 UNESCO/World Heritage Centre).

![UNESCO World Heritage sites app](/docs/relnotes/unesco_sites.png)

There are different implementations of the application to choose from:

- [Raw SQL + Vercel Edge Functions](https://github.com/neondatabase/neon-vercel-rawsql): Demonstrates using raw SQL with Neon's serverless driver on Vercel Edge Functions.
- [Raw SQL via https + Vercel Edge Functions](https://github.com/neondatabase/neon-vercel-http): Demonstrates Neon's serverless driver over HTTP on Vercel Edge Functions.
- [Raw SQL + Cloudflare Workers](https://github.com/neondatabase/serverless-cfworker-demo): Demonstrates using the Neon serverless driver on Cloudflare Workers and employs caching for high performance. There is an accompanying blog post for this example. See [Edge-compatible Serverless Driver for Postgres](https://neon.tech/blog/serverless-driver-for-postgres).
- [Kysely + Vercel Edge Functions](https://github.com/neondatabase/neon-vercel-kysely): Demonstrates using [kysely](https://github.com/koskimas/kysely) and [kysely-codegen](https://github.com/RobinBlomberg/kysely-codegen) with Neon's serverless driver on Vercel Edge Functions. Kysely is a type-safe and autocompletion-friendly typescript SQL query builder. `kysely-codegen` generates Kysely type definitions from your database.
- [Zapatos + Vercel Edge Functions](https://github.com/neondatabase/neon-vercel-zapatos): Demonstrates using [Zapatos](https://jawj.github.io/zapatos/) with Neon's serverless driver on Vercel Edge Functions. Zapatos offers zero-abstraction Postgres for TypeScript.
