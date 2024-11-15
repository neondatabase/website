---
title: Neon serverless driver
enableTableOfContents: true
subtitle: Connect to Neon from serverless environments over HTTP or WebSockets
updatedOn: '2024-11-05T20:56:00.570Z'
---

The [Neon serverless driver](https://github.com/neondatabase/serverless) is a low-latency Postgres driver for JavaScript and TypeScript that allows you to query data from serverless and edge environments over **HTTP** or **WebSockets** in place of TCP. The driver's low-latency capability is due to [message pipelining and other optimizations](https://neon.tech/blog/quicker-serverless-postgres).

When to query over HTTP vs WebSockets:

- **HTTP**: Querying over an HTTP [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) request is faster for single, non-interactive transactions, also referred to as "one-shot queries". Issuing [multiple queries](#issue-multiple-queries-with-the-transaction-function) via a single, non-interactive transaction is also supported. See [Use the driver over HTTP](#use-the-driver-over-http).
- **WebSockets**: If you require session or interactive transaction support or compatibility with [node-postgres](https://node-postgres.com/) (the popular **npm** `pg` package), use WebSockets. See [Use the driver over WebSockets](#use-the-driver-over-websockets).

## Install the Neon serverless driver

You can install the driver with your preferred JavaScript package manager. For example:

```shell
npm install @neondatabase/serverless
```

The driver includes TypeScript types (the equivalent of `@types/pg`). No additional installation is required.

<Admonition type="note">
The Neon serverless driver is also available as a [JavaScript Registry (JSR)](https://jsr.io/docs/introduction) package: [https://jsr.io/@neon/serverless](https://jsr.io/@neon/serverless). The JavaScript Registry (JSR) is a package registry for JavaScript and TypeScript. JSR works with many runtimes (Node.js, Deno, browsers, and more) and is backward compatible with `npm`.
</Admonition>

## Configure your Neon database connection

You can obtain a connection string for your database from the **Connection Details** widget on the Neon **Dashboard**. Your Neon connection string will look something like this:

```shell
DATABASE_URL=postgresql://[user]:[password]@[neon_hostname]/[dbname]
```

The examples that follow assume that your database connection string is assigned to a `DATABASE_URL` variable in your application's environment file.

## Use the driver over HTTP

The Neon serverless driver uses the [neon](https://github.com/neondatabase/serverless/blob/main/CONFIG.md#neon-function) function for queries over HTTP.

You can use raw SQL queries or tools such as [Drizzle-ORM](https://orm.drizzle.team/docs/quick-postgresql/neon), [kysely](https://github.com/kysely-org/kysely), [Zapatos](https://jawj.github.io/zapatos/), and others for type safety.

<CodeTabs labels={["Node.js", "Drizzle-ORM", "Vercel Edge Function", "Vercel Serverless Function"]}>

```javascript
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);
const posts = await sql('SELECT * FROM posts WHERE id = $1', [postId]);
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
};
```

```javascript
import { neon } from '@neondatabase/serverless';

export default async (req: Request) => {
  const sql = neon(process.env.DATABASE_URL);
  const posts = await sql('SELECT * FROM posts WHERE id = $1', [postId]);
  return new Response(JSON.stringify(post));
}

export const config = {
  runtime: 'edge',
};
```

```ts
import { neon } from '@neondatabase/serverless';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(request: NextApiRequest, res: NextApiResponse) {
  const sql = neon(process.env.DATABASE_URL!);
  const posts = await sql('SELECT * FROM posts WHERE id = $1', [postId]);

  return res.status(500).send(post);
}
```

</CodeTabs>

<Admonition type="note">
The maximum request size and response size for queries over HTTP is 64 MB.
</Admonition>

### neon function configuration options

The `neon(...)` function returns a query function that can be used both as a tagged-template function and as an ordinary function:

```javascript
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

// as a tagged-template function
const rowsA = await sql`SELECT * FROM posts WHERE id = ${postId}`;

// as an ordinary function (exactly equivalent)
const rowsB = await sql('SELECT * FROM posts WHERE id = $1', [postId]);
```

By default, the query function returned by `neon(...)` returns only the rows resulting from the provided SQL query, and it returns them as an array of objects where the keys are column names. For example:

```javascript
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);
const rows = await sql`SELECT * FROM posts WHERE id = ${postId}`;
// -> [{ id: 12, title: "My post", ... }]
```

However, you can customize the return format of the query function using the configuration options `fullResults` and `arrayMode`. These options are available both on the `neon(...)` function and on the query function it returns (but only when the query function is called as an ordinary function, not as a tagged-template function).

- `arrayMode: boolean`, `false` by default

  The default `arrayMode` value is `false`. When it is true, rows are returned as an array of arrays instead of an array of objects:

  ```javascript
  import { neon } from '@neondatabase/serverless';
  const sql = neon(process.env.DATABASE_URL, { arrayMode: true });
  const rows = await sql`SELECT * FROM posts WHERE id = ${postId}`;
  // -> [[12, "My post", ...]]
  ```

  Or, with the same effect:

  ```javascript
  import { neon } from '@neondatabase/serverless';
  const sql = neon(process.env.DATABASE_URL);
  const rows = await sql('SELECT * FROM posts WHERE id = $1', [postId], { arrayMode: true });
  // -> [[12, "My post", ...]]
  ```

- `fullResults: boolean`

  The default `fullResults` value is `false`. When it is `true`, additional metadata is returned alongside the result rows, which are then found in the `rows` property of the return value. The metadata matches what would be returned by `node-postgres`:

  ```javascript
  import { neon } from '@neondatabase/serverless';
  const sql = neon(process.env.DATABASE_URL, { fullResults: true });
  const results = await sql`SELECT * FROM posts WHERE id = ${postId}`;
  /* -> {
    rows: [{ id: 12, title: "My post", ... }],
    fields: [
      { name: "id", dataTypeID: 23, ... },
      { name: "title", dataTypeID: 25, ... },
      ...
    ],
    rowCount: 1,
    rowAsArray: false,
    command: "SELECT"
  } 
  */
  ```

  Or, with the same effect:

  ```javascript
  import { neon } from '@neondatabase/serverless';
  const sql = neon(process.env.DATABASE_URL);
  const results = await sql('SELECT * FROM posts WHERE id = $1', [postId], { fullResults: true });
  // -> { ... same as above ... }
  ```

- `fetchOptions: Record<string, any>`

  The `fetchOptions` option can also be passed to either `neon(...)` or the `query` function. This option takes an object that is merged with the options to the `fetch` call.

  For example, to increase the priority of every database `fetch` request:

  ```javascript
  import { neon } from '@neondatabase/serverless';
  const sql = neon(process.env.DATABASE_URL, { fetchOptions: { priority: 'high' } });
  const rows = await sql`SELECT * FROM posts WHERE id = ${postId}`;
  ```

  Or to implement a `fetch` timeout:

  ```javascript
  import { neon } from '@neondatabase/serverless';
  const sql = neon(process.env.DATABASE_URL);
  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort('timed out'), 10000);
  const rows = await sql('SELECT * FROM posts WHERE id = $1', [postId], {
    fetchOptions: { signal: abortController.signal },
  }); // throws an error if no result received within 10s
  clearTimeout(timeout);
  ```

For additional details, see [Options and configuration](https://github.com/neondatabase/serverless/blob/main/CONFIG.md#options-and-configuration).

### Issue multiple queries with the transaction() function

The `transaction(queriesOrFn, options)` function is exposed as a property on the query function. It allows multiple queries to be executed within a single, non-interactive transaction.

The first argument to `transaction(), queriesOrFn`, is either an array of queries or a non-async function that receives a query function as its argument and returns an array of queries.

The array-of-queries case looks like this:

```javascript
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);
const showLatestN = 10;

const [posts, tags] = await sql.transaction(
  [sql`SELECT * FROM posts ORDER BY posted_at DESC LIMIT ${showLatestN}`, sql`SELECT * FROM tags`],
  {
    isolationLevel: 'RepeatableRead',
    readOnly: true,
  }
);
```

Or as an example of the function case:

```javascript
const [authors, tags] = await neon(process.env.DATABASE_URL).transaction((txn) => [
  txn`SELECT * FROM authors`,
  txn`SELECT * FROM tags`,
]);
```

The optional second argument to `transaction()`, `options`, has the same keys as the options to the ordinary query function -- `arrayMode`, `fullResults` and `fetchOptions` — plus three additional keys that concern the transaction configuration. These transaction-related keys are: `isolationMode`, `readOnly` and `deferrable`.

Note that options **cannot** be supplied for individual queries within a transaction. Query and transaction options must instead be passed as the second argument of the `transaction()` function. For example, this `arrayMode` setting is ineffective (and TypeScript won't compile it): `await sql.transaction([sql('SELECT now()', [], { arrayMode: true })])`. Instead, use `await sql.transaction([sql('SELECT now()')], { arrayMode: true })`.

- `isolationMode`

  This option selects a Postgres [transaction isolation mode](https://www.postgresql.org/docs/current/transaction-iso.html). If present, it must be one of `ReadUncommitted`, `ReadCommitted`, `RepeatableRead`, or `Serializable`.

- `readOnly`

  If `true`, this option ensures that a `READ ONLY` transaction is used to execute the queries passed. This is a boolean option. The default value is `false`.

- `deferrable`

  If `true` (and if `readOnly` is also `true`, and `isolationMode` is `Serializable`), this option ensures that a `DEFERRABLE` transaction is used to execute the queries passed. This is a boolean option. The default value is `false`.

For additional details, see [transaction(...) function](https://github.com/neondatabase/serverless/blob/main/CONFIG.md#transaction-function).

## Use the driver over WebSockets

The Neon serverless driver supports the [Pool and Client](https://github.com/neondatabase/serverless?tab=readme-ov-file#pool-and-client) constructors for querying over WebSockets.

The `Pool` and `Client` constructors, provide session and transaction support, as well as `node-postgres` compatibility. You can find the API guide for the `Pool` and `Client` constructors in the [node-postgres](https://node-postgres.com/) documentation.

Consider using the driver with `Pool` or `Client` in the following scenarios:

- You already use `node-postgres` in your code base and would like to migrate to using `@neondatabase/serverless`.
- You are writing a new code base and want to use a package that expects a `node-postgres-compatible` driver.
- Your backend service uses sessions / interactive transactions with multiple queries per connection.

You can use the Neon serverless driver in the same way you would use `node-postgres` with `Pool` and `Client`. Where you usually import `pg`, import `@neondatabase/serverless` instead.

<CodeTabs labels={["Node.js", "Prisma", "Drizzle-ORM", "Vercel Edge Function", "Vercel Serverless Function"]}>

```javascript
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const posts = await pool.query('SELECT * FROM posts WHERE id =$1', [postId]);
pool.end();
```

```typescript
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import ws from 'ws';

dotenv.config();
neonConfig.webSocketConstructor = ws;
const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const posts = await prisma.post.findMany();
}

main();
```

```typescript
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq } from 'drizzle-orm';
import { Pool } from '@neondatabase/serverless';
import { posts } from './schema';

export default async () => {
  const postId = 12;
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);
  const [onePost] = await db.select().from(posts).where(eq(posts.id, postId));

  ctx.waitUntil(pool.end());

  return new Response(JSON.stringify({ post: onePost }));
};
```

```javascript
import { Pool } from '@neondatabase/serverless';

export default async (req: Request, ctx: any) => {
  const pool = new Pool({connectionString: process.env.DATABASE_URL});
  await pool.connect();

  const posts = await pool.query('SELECT * FROM posts WHERE id = $1', [postId]);

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

export default async function handler(request: NextApiRequest, res: NextApiResponse) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const posts = await pool.query('SELECT * FROM posts WHERE id = $1', [postId]);

  await pool.end();

  return res.status(500).send(post);
}
```

</CodeTabs>

### Pool and Client usage notes

- In Node.js and some other environments, there's no built-in WebSocket support. In these cases, supply a WebSocket constructor function.

  ```javascript
  import { Pool, neonConfig } from '@neondatabase/serverless';
  import ws from 'ws';
  neonConfig.webSocketConstructor = ws;
  ```

- In serverless environments such as Vercel Edge Functions or Cloudflare Workers, WebSocket connections can't outlive a single request. That means `Pool` or `Client` objects must be connected, used and closed within a single request handler. Don't create them outside a request handler; don't create them in one handler and try to reuse them in another; and to avoid exhausting available connections, don't forget to close them.

For examples that demonstrate these points, see [Pool and Client](https://github.com/neondatabase/serverless?tab=readme-ov-file#pool-and-client).

### Advanced configuration options

For advanced configuration options, see [neonConfig configuration](https://github.com/neondatabase/serverless/blob/main/CONFIG.md#neonconfig-configuration), in the Neon serverless driver GitHub readme.

## Developing locally with the Neon serverless driver

The Neon serverless driver enables you to query data over **HTTP** or **WebSockets** instead of TCP, even though Postgres does not natively support these connection methods. To use the Neon serverless driver locally, you must run a local instance of Neon's proxy and configure it to connect to your local Postgres database.

For a step-by-step guide to setting up a local environment, refer to this community guide: [Local Development with Neon](https://neon.tech/guides/local-development-with-neon). The guide demonstrates how to use a [community-developed Docker Compose file](https://github.com/TimoWilhelm/local-neon-http-proxy) to configure a local Postgres database and a Neon proxy service. This setup allows connections over both WebSockets and HTTP.

## Example applications

Explore the example applications that use the Neon serverless driver.

### UNESCO World Heritage sites app

Neon provides an example application to help you get started with the Neon serverless driver. The application generates a `JSON` listing of the 10 nearest UNESCO World Heritage sites using IP geolocation (data copyright © 1992 – 2022 UNESCO/World Heritage Centre).

![UNESCO World Heritage sites app](/docs/relnotes/unesco_sites.png)

There are different implementations of the application to choose from.

<DetailIconCards>
<a href="https://github.com/neondatabase/neon-vercel-rawsql" description="Demonstrates using raw SQL with Neon's serverless driver on Vercel Edge Functions" icon="github">Raw SQL + Vercel Edge Functions</a>
<a href="https://github.com/neondatabase/neon-vercel-http" description="Demonstrates Neon's serverless driver over HTTP on Vercel Edge Functions" icon="github">Raw SQL via https + Vercel Edge Functions</a>
<a href="https://github.com/neondatabase/serverless-cfworker-demo" description="Demonstrates using the Neon serverless driver on Cloudflare Workers and employs caching for high performance." icon="github">Raw SQL + Cloudflare Workers</a>
<a href="https://github.com/neondatabase/neon-vercel-kysely" description="Demonstrates using kysely and kysely-codegen with Neon's serverless driver on Vercel Edge Functions" icon="github">Kysely + Vercel Edge Functions</a>
<a href="https://github.com/neondatabase/neon-vercel-zapatos" description="Demonstrates using Zapatos with Neon's serverless driver on Vercel Edge Functions" icon="github">Zapatos + Vercel Edge Functions</a>
<a href="https://github.com/neondatabase/neon-vercel-pgtyped" description="Demonstrates using using pgTyped with Neon's serverless driver on Vercel Edge Functions" icon="github">Neon + pgTyped on Vercel Edge Functions</a>
<a href="https://github.com/neondatabase/neon-vercel-knex" description="Demonstrates using using Knex with Neon's serverless driver on Vercel Edge Functions" icon="github">Neon + Knex on Vercel Edge Functions</a>
</DetailIconCards>

### Ping Thing

The Ping Thing application pings a Neon Serverless Postgres database using a Vercel Edge Function and shows the journey your request makes. You can read more about this application in the accompanying blog post: [How to use Postgres at the Edge](https://neon.tech/blog/how-to-use-postgres-at-the-edge)

<DetailIconCards>
<a href="https://github.com/neondatabase/ping-thing" description="Ping a Neon Serverless Postgres database using a Vercel Edge Function to see the journey your request makes" icon="github">Ping Thing</a>
</DetailIconCards>

## Neon serverless driver GitHub repository and changelog

The GitHub repository and [changelog](https://github.com/neondatabase/serverless/blob/main/CHANGELOG.md) for the Neon serverless driver are found [here](https://github.com/neondatabase/serverless).

## References

- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [node-postgres](https://node-postgres.com/)
- [Drizzle-ORM](https://orm.drizzle.team/docs/quick-postgresql/neon)
- [Schema migration with Neon Postgres and Drizzle ORM](/docs/guides/drizzle-migrations)
- [kysely](https://github.com/kysely-org/kysely)
- [Zapatos](https://jawj.github.io/zapatos/)
- [Vercel Edge Functions](https://vercel.com/docs/functions/edge-functions)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Use Neon with Cloudflare Workers](/docs/guides/cloudflare-workers)

<NeedHelp/>
