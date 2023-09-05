---
title: Neon serverless driver
enableTableOfContents: true
subtitle: Learn how to connect to Neon from serverless and edge environments over HTTP or WebSockets
---

The [Neon serverless driver](https://github.com/neondatabase/serverless) is a low-latency Postgres driver for JavaScript and TypeScript that allows you to query data from serverless and edge environments over HTTP or WebSockets in place of TCP.

You can use the driver as a drop-in replacement for [node-postgres](https://node-postgres.com/), the popular npm `pg` package you may already be familiar with. See [Using node-postgres Pool or Client](#using-node-postgres-pool-or-client).

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

## How to use the driver over HTTP

To use the Neon serverless driver over HTTP, you must use the driver's `neon` function. You can use raw SQL queries or tools such as [Drizzle-ORM](https://orm.drizzle.team/docs/installation-and-db-connection/postgresql/neon), [kysely](https://github.com/kysely-org/kysely), [Zapatos](https://jawj.github.io/zapatos/), and others for type safety.

<CodeTabs labels={["Node.js",  "Drizzle-ORM", "Vercel Edge Function", "Vercel Serverless Function"]}>

```javascript
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
const {rows: [post]} = await sql('SELECT * FROM posts WHERE id =$1', [postId]);
// `post` is now [{ id: 12, title: 'My post', ... }] (or undefined)
```

```typescript
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { neon } from '@neondatabase/serverless';
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
import { neon } from '@neondatabase/serverless';
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

<Admonition type="note">
The maximum response size for queries over HTTP is 10 MB.
</Admonition>

## Experimental connection caching

Connection caching provides server-side connection pooling, so that a new connection does not  have to be set up for each query over HTTP. You can enable it by setting `fetchConnectionCache` to `true` in the `neonConfig` object.

## Using node-postgres Pool or Client

You can use the Neon serverless driver in the same way you would use `node-postgres` with `Pool` and `Client`. Where you usually import `pg`, import `@neondatabase/serverless` instead.

<Admonition type="note">
The `Pool` and `Client` objects must be connected, used and closed within a single request handler. Don't create them outside a request handler; don't create them in one handler and try to reuse them in another; and to avoid exhausting available connections, don't forget to close them.
</Admonition>

<CodeTabs labels={["Node.js","Drizzle-ORM", "Vercel Edge Function", "Vercel Serverless Function"]}>

```javascript
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({connectionString: process.env.DATABASE_URL});
const {rows: [post]} = await pool.query('SELECT * FROM posts WHERE id =$1', [postId]);
pool.end();
```

```typescript
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq } from 'drizzle-orm';
import { Pool } from '@neondatabase/serverless';
import { posts } from './schema';

export default async () => {
  const postId = 12;
  const pool = new Pool({connectionString: process.env.DATABASE_URL});
  const db = drizzle(pool);
  const [onePost] = await db.select().from(posts).where(eq(posts.id, postId));
  
  ctx.waitUntil(pool.end())
  
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
};
```

```ts
import { Pool } from '@neondatabase/serverless';
import type { NextApiRequest, NextApiResponse } from 'next';
 
export default async function handler(
  request: NextApiRequest,
  res: NextApiResponse,
) {
  const pool = new Pool({connectionString: process.env.DATABASE_URL});
  const {rows: [post]} = await pool.query('SELECT * FROM posts WHERE id = $1', [postId]);
  
  await pool.end();

  return res.status(500).send(post);
}

```

</CodeTabs>

## When to use the neon function vs Pool or Client

The Neon serverless driver supports the `neon` function for queries over HTTP, and `Pool` and `Client` constructors for querying over WebSockets.

### The neon function

Querying over an HTTP [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) request is faster for single, non-interactive transactions. If you do not require sessions or transactions, consider using HTTP for faster response times.

### neon function configuration options

The `neon(...)` function supports `arrayMode`, `fullResults`, and `fetchOptions` option keys for customizing the query function. For usage information, see [Options and configuration](https://github.com/neondatabase/serverless/blob/main/CONFIG.md#options-and-configuration).

The `neon(...)` function also supports issuing multiple queries at once in a single, non-interactive transaction using the `transaction()` function, which is exposed as a property of the query function. For example:

```js
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);
const showLatestN = 10;

const [posts, tags] = await sql.transaction([
  sql`SELECT * FROM posts ORDER BY posted_at DESC LIMIT ${showLatestN}`,
  sql`SELECT * FROM tags`,
]);
```

The `transaction()` function supports the same option keys as the ordinary query function — `arrayMode`, `fullResults`, and `fetchOptions` — plus three additional keys concerning transaction configuration:

- `isolationMode`

  Must be one of `ReadUncommitted`, `ReadCommitted`, `RepeatableRead`, or `Serializable`.

- `readOnly`
  
  Ensures that a `READ ONLY` transaction is used to execute queries. This is a boolean option. The default value is `false`.

- `deferrable`

  Ensures that a `DEFERRABLE` transaction is used to execute queries. This is a boolean option. The default value is `false`.

For additional details, see [transaction(...) function](https://github.com/neondatabase/serverless/blob/main/CONFIG.md#transaction-function).

### Pool or Client

The `Pool` and `Client` constructors, which support querying over WebSockets, provide session and transaction support, as well as `node-postgres` compatibility. You can find the API guide for the `Pool` and `Client` constructors in the [node-postgres](https://node-postgres.com/) documentation.

You should use the driver with `Pool` or `Client` in the following scenarios:

- You already use `node-postgres` in your code base and would like to migrate to using `@neondatabase/serverless`.
- You are writing a new code base and want to use a package that expects a `node-postgres-compatible` driver.
- Your backend service uses sessions / interactive transactions with multiple queries per connection.

### Pool and Client configuration options

For configuration options that apply to `Pool` and `Client`, see [options and configuration](https://github.com/neondatabase/serverless/blob/main/CONFIG.md#options-and-configuration) in the driver's GitHub repository.

## Example application

Neon provides an example application to help you get started with the Neon serverless driver. The application generates a `JSON` listing of the 10 nearest UNESCO World Heritage sites using IP geolocation (data copyright © 1992 – 2022 UNESCO/World Heritage Centre).

![UNESCO World Heritage sites app](/docs/relnotes/unesco_sites.png)

There are different implementations of the application to choose from.

<DetailIconCards>
<a href="https://github.com/neondatabase/neon-vercel-rawsql" description="Demonstrates using raw SQL with Neon's serverless driver on Vercel Edge Functions" icon="github">Raw SQL + Vercel Edge Functions</a>
<a href="https://github.com/neondatabase/neon-vercel-http" description="Demonstrates Neon's serverless driver over HTTP on Vercel Edge Functions" icon="github">Raw SQL via https + Vercel Edge Functions</a>
<a href="https://github.com/neondatabase/serverless-cfworker-demo" description="Demonstrates using the Neon serverless driver on Cloudflare Workers and employs caching for high performance." icon="github">Raw SQL + Cloudflare Workers</a>
<a href="https://github.com/neondatabase/neon-vercel-kysely" description="Demonstrates using kysely and kysely-codegen with Neon's serverless driver on Vercel Edge Functions" icon="github">Kysely + Vercel Edge Functions</a>
<a href="https://github.com/neondatabase/neon-vercel-zapatos" description="Demonstrates using Zapatos with Neon's serverless driver on Vercel Edge Functions" icon="github">Zapatos + Vercel Edge Functions</a>
</DetailIconCards>
