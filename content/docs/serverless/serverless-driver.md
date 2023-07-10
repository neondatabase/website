---
title: Neon serverless driver
enableTableOfContents: true
subtitle: Learn how to connect to Neon from serverless and edge environments over HTTP or WebSockets
---

The [Neon serverless driver](https://github.com/neondatabase/serverless) is a low-latency PostgreSQL driver for JavaScript and TypeScript that allows you to query data from serverless and edge environments over HTTP or WebSockets in place of TCP.

The driver is a drop-in replacement for [node-postgres](https://node-postgres.com/), the popular npm `pg` package you may already be familiar with.

The driver's low-latency capability is due to [message pipelining and other optimizations](https://neon.tech/blog/quicker-serverless-postgres).

## Install the Neon serverless driver

You can install the driver with your preferred JavaScript package manager. For example:

```shell
npm install @neondatabase/serverless
```

The driver includes TypeScript types (the equivalent of `@types/pg`). No additional installation is required.

## Configure your Neon database connection

You can obtain a connection string for your database from the **Connection Details** widget on the Neon **Dashboard** and set it as an environment variable. Your Neon connection string will look something like this:

```shell
DATABASE_URL=postgres://<user>:<password>@<endpoint>.<region>.aws.neon.tech/<dbname>
```

## How to use the driver

To use the Neon serverless driver, you must use the driver's `neon` function. You can use raw SQL queries or [Drizzle-ORM](https://orm.drizzle.team/docs/installation-and-db-connection/postgresql/neon) for type safety. For example: -->

<CodeTabs labels={["Node.js",  "Drizzle-ORM", "Vercel Edge Function", "Vercel Serverless Function"]}>

```javascript
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
const {rows: [post]} = await sql('SELECT * FROM posts WHERE id =$1', [postId]);
// `post` is now [{ id: 12, title: 'My post', ... }] (or undefined)
```

```typescript
import { drizzle } from 'drizzle-orm/neon-http;
import { eq } from 'drizzle-orm';
import { neon } from '@neondatabase/serverless;
import { posts } from './schema';

export default async () => {
  const postId = 12;
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);
  const [onePost] = await db.select().from(posts).where(eq(posts.id, postId));
  return new Response(JSON.stringify({ post: onePost }));
}
```
```js
import { neon } from '@neondatabase/serverless';

export default async (req: Request) => {
  const sql = neon(process.env.DATABASE_URL!);
  const {rows: [post]} = await sql('SELECT * FROM posts WHERE id = $1', [postId]);
  return new Response(JSON.stringify(post));
}

export const config = {
  runtime: 'edge',
};
```

```ts
import type { NextApiRequest, NextApiResponse } from 'next';
 
export default async function handler(
  request: NextApiRequest,
  res: NextApiResponse,
) {
  const sql = neon(process.env.DATABASE_URL!);
  const {rows: [post]} = await sql('SELECT * FROM posts WHERE id = $1', [postId]);
 
  return res.status(500).send(post);
}
```

</CodeTabs>

### Use experimental caching

Connection caching allows Neon proxy to find the compute node attached to your database quicker. Connection caching is experimental and on opt-in only. You can try it by setting `fetchConnectionCache` to true in the `neonConfig` object.

```ts
import { neon, neonConfig } from '@neondatabase/serverless';

neonConfig.fetchConnectionCache = true; // Opt-in to experimental connection caching
const sql = neon(process.env.DATABASE_URL!);
```

## Using node-postgres Pool or Client

You can use the driver in the same way you would use `node-postgres` with `Pool` and `Client`. Where you usually import `pg`, import `@neondatabase/serverless` instead.

<CodeTabs labels={["Node.js","Drizzle-ORM", "Vercel Edge Function", "Vercel Serverless Function"]}>

```javascript
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({connectionString: process.env.DATABASE_URL});
const {rows: [post]}= await pool.query('SELECT * FROM posts WHERE id =$1', [postId]);
```

```typescript
import { drizzle } from 'drizzle-orm/neon-serverless;
import { eq } from 'drizzle-orm';
import { Pool } from '@neondatabase/serverless;
import { posts } from './schema';

export default async () => {
  const postId = 12;
  const pool = new Pool({connectionString: process.env.DATABASE_URL});
  const db = drizzle(pool);
  const [onePost] = await db.select().from(posts).where(eq(posts.id, postId));
  return new Response(JSON.stringify({ post: onePost }));
}
```
```js
import { Pool } from '@neondatabase/serverless';

export default async (req: Request, ctx: any) => {
  const pool = new Pool({connectionString: process.env.DATABASE_URL});
  await pool.connect();

  const {rows: [post]} = await pool.query('SELECT * FROM posts WHERE id = $1', [postId]);
  ctx.waitUntil(pool.end());

  return new Response(JSON.stringify(post), { 
    headers: { 'content-type': 'application/json' }
  });
}

export const config = {
  runtime: 'edge',
  regions: ['iad1'],  // specify the region nearest your Neon DB
};
```
```ts
import type { NextApiRequest, NextApiResponse } from 'next';
 
export default async function handler(
  request: NextApiRequest,
  res: NextApiResponse,
) {
  const pool = new Pool({connectionString: process.env.DATABASE_URL});
  const {rows: [post]} = await pool.query('SELECT * FROM posts WHERE id = $1', [postId]);
 
  return res.status(500).send(post);
}
```

</CodeTabs>

## When should you use Pool and neon

### Use the driver with neon

The Neon serverless driver supports querying over HTTP with the `neon` function and WebSockets using `Pool` or `Client`. Querying over an HTTP [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) request is faster for single-shot queries such as the one shown below: 

```js
const post = await sql('SELECT * FROM posts WHERE id =$1', [postId]);
```

If you use single-shot queries with no sessions or transactions, consider using HTTP for faster responses.

### Additional configuration options

The `neon(...)` function has configuration options for customizing the return format of the query function. See [options and configuration](https://github.com/neondatabase/serverless/blob/main/CONFIG.md#options-and-configuration) in the driver's GitHub repository for information about those options.

### Use the driver with Pool or Client

To use the Neon serverless driver over WebSockets, use either the `Pool` or `Client` constructor. These constructors provide session and transaction support, as well as `node-postgres` compatibility. The full API guide for the `Pool` and `Client` constructors can be found in the [node-postgres](https://node-postgres.com/) documentation.

You should use the driver with `Pool` or `Client` in the following scenarios:
- You already use `node-postgres` in your code base and would like to migrate to using `@neondatabase/serverless`.
- Your backend service executes several queries per connection.

### Configuration options for `Pool` and `Client`

There are additional configuration options that apply to `Pool` and `Client`. See [options and configuration](https://github.com/neondatabase/serverless/blob/main/CONFIG.md#options-and-configuration) in the driver's GitHub repository for more information.

## More examples

Neon provides an example application to help you get started with the Neon serverless driver. The application generates a `JSON` listing of the 10 nearest UNESCO World Heritage sites using IP geolocation (data copyright © 1992 – 2022 UNESCO/World Heritage Centre).

![UNESCO World Heritage sites app](/docs/relnotes/unesco_sites.png)

There are different implementations of the application to choose from:

- [Raw SQL + Vercel Edge Functions](https://github.com/neondatabase/neon-vercel-rawsql): Demonstrates using raw SQL with Neon's serverless driver on Vercel Edge Functions.
- [Raw SQL via https + Vercel Edge Functions](https://github.com/neondatabase/neon-vercel-http): Demonstrates Neon's serverless driver over HTTP on Vercel Edge Functions.
- [Raw SQL + Cloudflare Workers](https://github.com/neondatabase/serverless-cfworker-demo): Demonstrates using the Neon serverless driver on Cloudflare Workers and employs caching for high performance. There is an accompanying blog post for this example. See [Edge-compatible Serverless Driver for Postgres](https://neon.tech/blog/serverless-driver-for-postgres).
- [Kysely + Vercel Edge Functions](https://github.com/neondatabase/neon-vercel-kysely): Demonstrates using [kysely](https://github.com/koskimas/kysely) and [kysely-codegen](https://github.com/RobinBlomberg/kysely-codegen) with Neon's serverless driver on Vercel Edge Functions. Kysely is a type-safe and autocompletion-friendly typescript SQL query builder. `kysely-codegen` generates Kysely type definitions from your database.
- [Zapatos + Vercel Edge Functions](https://github.com/neondatabase/neon-vercel-zapatos): Demonstrates using [Zapatos](https://jawj.github.io/zapatos/) with Neon's serverless driver on Vercel Edge Functions. Zapatos offers zero-abstraction Postgres for TypeScript.
