---
title: Neon serverless driver
enableTableOfContents: true
subtitle: Connect to Neon from serverless environments over HTTP or WebSockets
summary: >-
  The Neon serverless driver (`@neondatabase/serverless`) is a JavaScript
  and TypeScript Postgres driver that replaces TCP with HTTP or WebSockets,
  enabling Postgres queries from serverless and edge runtimes such as Vercel
  Edge Functions and Cloudflare Workers. Use the `neon()` function over HTTP
  for single or non-interactive batched queries, or the `Pool`/`Client`
  constructors over WebSockets when sessions, interactive transactions, or
  node-postgres drop-in compatibility are required. TypeScript types are
  bundled; install with `npm install @neondatabase/serverless`.
updatedOn: '2026-10-05T12:59:42.154Z'
---

<CopyPrompt src="/prompts/serverless-driver-prompt.md" 
description= "Pre-built prompt for setting up the Neon serverless driver (JS/TS)"/>

The [Neon serverless driver](https://github.com/neondatabase/serverless) is a low-latency Postgres driver for JavaScript and TypeScript that allows you to query data from serverless and edge environments over **HTTP** or **WebSockets** in place of TCP. The driver's low-latency capability is due to [message pipelining and other optimizations](/blog/quicker-serverless-postgres).

When to query over HTTP vs WebSockets:

- **HTTP**: Querying over an HTTP [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) request is faster for single, non-interactive transactions, also referred to as "one-shot queries". Issuing [multiple queries](#issue-multiple-queries-with-the-transaction-function) via a single, non-interactive transaction is also supported. See [Use the driver over HTTP](#use-the-driver-over-http).
- **WebSockets**: If you require session or interactive transaction support or compatibility with [node-postgres](https://node-postgres.com/) (the popular **npm** `pg` package), use WebSockets. See [Use the driver over WebSockets](#use-the-driver-over-websockets).

<AgentSkillsTip skill_topic="the Neon Serverless Driver, general connection advice," />

## Install the Neon serverless driver

You can install the driver with your preferred JavaScript package manager. For example:

```shell
npm install @neondatabase/serverless
```

The driver includes TypeScript types (the equivalent of `@types/pg`). No additional installation is required. In Node.js, the driver requires version 19 or later.

<Admonition type="important" title="Install from npm, not JSR">
The driver is no longer published to the [JavaScript Registry (JSR)](https://jsr.io/@neon/serverless). The JSR package, `@neon/serverless`, stays at version 1.0.1 and won't get new releases. This only affects JSR: the driver itself is actively maintained on npm as `@neondatabase/serverless`.

If you installed the JSR package (for example, with `deno add jsr:@neon/serverless`), switch to the npm package:

```shell
deno add npm:@neondatabase/serverless
```

Then change your imports from `@neon/serverless` to `@neondatabase/serverless`.
</Admonition>

## Configure your Neon database connection

You can obtain a connection string for your database by clicking the **Connect** button in the Console nav. Your Neon connection string will look something like this:

```shell
DATABASE_URL=postgresql://[user]:[password]@[neon_hostname]/[dbname]
```

The examples that follow assume that your database connection string is assigned to a `DATABASE_URL` variable in your application's environment file (for example, `.env`). Frameworks such as Next.js load `.env` automatically. For a plain Node.js script, load it with `node --env-file=.env index.js`, or add `import 'dotenv/config';` at the top of the script after installing the `dotenv` package. If `DATABASE_URL` isn't loaded, you'll see [this error](#wrong-url-scheme-or-missing-user-host-or-database).

## Quick start

This complete example creates a table, writes rows over HTTP, and reads them back over WebSockets. Save it as `index.js` in a project with `"type": "module"` in its `package.json`, then run it with `node --env-file=.env index.js`.

```javascript filename="index.js"
import { neon, Pool } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

// HTTP: one-shot queries
await sql`CREATE TABLE IF NOT EXISTS posts (id serial PRIMARY KEY, title text NOT NULL)`;
await sql`INSERT INTO posts (title) VALUES (${'First post'})`;

// HTTP: multiple queries in one non-interactive transaction
await sql.transaction([
  sql`INSERT INTO posts (title) VALUES (${'Second post'})`,
  sql`INSERT INTO posts (title) VALUES (${'Third post'})`,
]);

// WebSockets: a node-postgres-compatible Pool (Node.js 22 and later have a built-in WebSocket)
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const { rows } = await pool.query('SELECT * FROM posts ORDER BY id');
console.log(rows);
await pool.end();
```

On the first run, the output is:

```text
[
  { id: 1, title: 'First post' },
  { id: 2, title: 'Second post' },
  { id: 3, title: 'Third post' }
]
```

The sections that follow explain each part in more detail.

## Use the driver over HTTP

The Neon serverless driver uses the [neon](https://github.com/neondatabase/serverless/blob/main/CONFIG.md#neon-function) function for queries over HTTP. The function returns a query function that can only be used as a template function for improved safety against SQL injection vulnerabilities.

For example:

```javascript
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);
const id = 1;
const useArchive = false;

// Safe and convenient template function usage
const rows = await sql`SELECT * FROM posts WHERE id = ${id}`;

// For manually parameterized queries, use the query() function
const queryRows = await sql.query('SELECT * FROM posts WHERE id = $1', [id]);

// For interpolating trusted strings (like column or table names), use the unsafe() function
const tableName = useArchive ? 'archived_posts' : 'posts'; // known-safe string values
const unsafeRows = await sql`SELECT * FROM ${sql.unsafe(tableName)} WHERE id = ${id}`;

// Alternatively, use template literals for known-safe values
const table = useArchive ? sql`archived_posts` : sql`posts`;
const templateRows = await sql`SELECT * FROM ${table} WHERE id = ${id}`;
```

SQL template queries are fully composable, including those with parameters:

```javascript
const title = 'My post';
const limit = 1;
const whereClause = sql`WHERE title = ${title}`;
const limitClause = sql`LIMIT ${limit}`;

// Parameters are numbered appropriately at query time
const rows = await sql`SELECT * FROM posts ${whereClause} ${limitClause}`;
```

You can use raw SQL queries or tools such as [Drizzle-ORM](https://orm.drizzle.team/docs/quick-postgresql/neon), [kysely](https://github.com/kysely-org/kysely), [Zapatos](https://jawj.github.io/zapatos/), and others for type safety.

<CodeTabs labels={["Node.js", "Drizzle-ORM", "Vercel Edge Function", "Vercel Serverless Function"]}>

```javascript
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);
const postId = 12;

await sql`INSERT INTO posts (id, title) VALUES (${postId}, ${'My post'})`;
const posts = await sql`SELECT * FROM posts WHERE id = ${postId}`;
// or using query() for parameterized queries:
// const posts = await sql.query('SELECT * FROM posts WHERE id = $1', [postId]);
// `posts` is now [{ id: 12, title: 'My post' }]
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

```typescript
import { neon } from '@neondatabase/serverless';

export default async (req: Request) => {
  const postId = new URL(req.url).searchParams.get('id');
  const sql = neon(process.env.DATABASE_URL!);
  const posts = await sql`SELECT * FROM posts WHERE id = ${postId}`;
  // or using query() for parameterized queries:
  // const posts = await sql.query('SELECT * FROM posts WHERE id = $1', [postId]);
  return new Response(JSON.stringify(posts));
}

export const config = {
  runtime: 'edge',
};
```

```ts
import { neon } from '@neondatabase/serverless';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(request: NextApiRequest, res: NextApiResponse) {
  const postId = request.query.id;
  const sql = neon(process.env.DATABASE_URL!);
  const posts = await sql`SELECT * FROM posts WHERE id = ${postId}`;
  // or using query() for parameterized queries:
  // const posts = await sql.query('SELECT * FROM posts WHERE id = $1', [postId]);
  return res.status(200).json(posts);
}
```

</CodeTabs>

<Admonition type="note">
The maximum request size and response size for queries over HTTP is 64 MB.
</Admonition>

To change the result format, set `fetch` options such as a timeout, or pass individual connection parameters, see [Neon serverless driver configuration](/docs/serverless/serverless-driver-configuration).

### Issue multiple queries with the transaction() function

The `transaction(queriesOrFn, options)` function is exposed as a property on the query function. It allows multiple queries to be executed within a single, non-interactive transaction.

The first argument to `transaction()`, `queriesOrFn`, is either an array of queries or a non-async function that receives a query function as its argument and returns an array of queries.

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

To set the isolation level, read-only mode, or result format for a transaction, see [Transaction options](/docs/serverless/serverless-driver-configuration#transaction-options). To set JWT claims for Row-Level Security inside a transaction, see [Using transactions with JWT self-verification](/docs/serverless/serverless-driver-configuration#using-transactions-with-jwt-self-verification).

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
const postId = 12;
const { rows } = await pool.query('SELECT * FROM posts WHERE id = $1', [postId]);
await pool.end();
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

  await pool.end();

  return new Response(JSON.stringify({ post: onePost }));
};
```

```typescript
import { Pool } from '@neondatabase/serverless';

export default async (req: Request, ctx: any) => {
  const postId = new URL(req.url).searchParams.get('id');
  if (!postId) return new Response('Missing id', { status: 400 });

  const pool = new Pool({connectionString: process.env.DATABASE_URL});
  const posts = await pool.query('SELECT * FROM posts WHERE id = $1', [postId]);
  const post = posts.rows[0];

  ctx.waitUntil(pool.end());

  if (!post) return new Response('Not found', { status: 404 });
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
  const postId = Array.isArray(request.query.id) ? request.query.id[0] : request.query.id;
  if (!postId) return res.status(400).send('Missing id');

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const posts = await pool.query('SELECT * FROM posts WHERE id = $1', [postId]);

  await pool.end();

  const post = posts.rows[0];
  if (!post) return res.status(404).send('Not found');
  return res.status(200).json(post);
}
```

</CodeTabs>

### Pool and Client usage notes

- Node.js 21 and earlier, and some other environments, have no built-in WebSocket support. In these cases, supply a WebSocket constructor function, such as the one from the [ws](https://www.npmjs.com/package/ws) package. Node.js 22 and later include a built-in `WebSocket`, so this step is optional.

  ```javascript
  import { Pool, neonConfig } from '@neondatabase/serverless';
  import ws from 'ws';
  neonConfig.webSocketConstructor = ws;
  ```

- In serverless environments such as Vercel Edge Functions or Cloudflare Workers, WebSocket connections can't outlive a single request. That means `Pool` or `Client` objects must be connected, used and closed within a single request handler. Don't create them outside a request handler; don't create them in one handler and try to reuse them in another; and to avoid exhausting available connections, don't forget to close them.

For examples that demonstrate these points, see [Pool and Client](https://github.com/neondatabase/serverless?tab=readme-ov-file#pool-and-client).

### Advanced configuration options

For `Pool` and `Client` settings such as a custom WebSocket constructor, pipelining, and proxy options, see [neonConfig options](/docs/serverless/serverless-driver-configuration#neonconfig-options).

## Developing locally with the Neon serverless driver

The Neon serverless driver enables you to query data over **HTTP** or **WebSockets** instead of TCP, even though Postgres does not natively support these connection methods. To use the Neon serverless driver locally, you must run a local instance of Neon's proxy and configure it to connect to your local Postgres database.

For a step-by-step guide to setting up a local environment, refer to this community guide: [Local Development with Neon](/guides/local-development-with-neon). The guide demonstrates how to use a [community-developed Docker Compose file](https://github.com/TimoWilhelm/local-neon-http-proxy) to configure a local Postgres database and a Neon proxy service. This setup allows connections over both WebSockets and HTTP.

## Handling transient connection drops

Like any cloud database service, Neon may occasionally experience brief connection drops during maintenance, updates, or network interruptions. When using the Neon serverless driver, especially over HTTP, you should implement retry logic to handle these transient errors gracefully.

Here's a minimal retry example using the `async-retry` library with the HTTP driver:

```javascript
import { neon } from '@neondatabase/serverless';
import retry from 'async-retry';

const sql = neon(process.env.DATABASE_URL);

const result = await retry(
  async () => {
    return await sql`SELECT * FROM users WHERE id = ${userId}`;
  },
  {
    retries: 5,
    factor: 2,
    minTimeout: 1000,
    randomize: true,
  }
);
```

## Troubleshooting

### This function can now be called only as a tagged-template function

```text
This function can now be called only as a tagged-template function: sql`SELECT ${value}`, not sql("SELECT $1", [value], options). For a conventional function call with value placeholders ($1, $2, etc.), use sql.query("SELECT $1", [value], options).
```

Since version 1.0.0, the query function returned by `neon()` only works as a tagged template, which protects against SQL injection. Code written for earlier versions that calls it as a conventional function, such as `sql('SELECT * FROM posts WHERE id = $1', [postId])`, throws this error. Use a tagged template or `sql.query()` instead:

```javascript
const rows = await sql`SELECT * FROM posts WHERE id = ${postId}`;
// or
const rows = await sql.query('SELECT * FROM posts WHERE id = $1', [postId]);
```

For details, see the [1.0.0 release notes](https://github.com/neondatabase/serverless/blob/main/CHANGELOG.md#100-2025-03-25).

### Wrong URL scheme or missing user, host or database

```text
Wrong URL scheme or missing user, host or database in connection parameters
```

```text
Database connection string provided to neon() is not a valid URL (connection string: )
```

The connection string passed to `neon()` is missing or malformed. This usually means the `DATABASE_URL` environment variable isn't set where your code runs, so `neon()` receives `undefined` or an empty string. Check that the variable is defined in that environment (for example, in your hosting platform's environment settings), and that its value is a full connection string that starts with `postgresql://`.

### No database host or connection string was set

```text
No database host or connection string was set, and key parameters have default values (host: localhost, user: ..., db: ..., password: null). Is an environment variable missing?
```

This is the `Pool` and `Client` version of the previous error. The `connectionString` you passed is `undefined`, usually because `DATABASE_URL` isn't set in that environment.

### All attempts to open a WebSocket to connect to the database failed

```text
All attempts to open a WebSocket to connect to the database failed. Please refer to https://github.com/neondatabase/serverless/blob/main/CONFIG.md#websocketconstructor-typeof-websocket--undefined.
```

`Pool` and `Client` connect over WebSockets, and your runtime has no built-in `WebSocket`. This happens in Node.js 21 and earlier. Upgrade to Node.js 22 or later, or supply a WebSocket constructor, as described in [Pool and Client usage notes](#pool-and-client-usage-notes). If you only need one-shot queries or non-interactive transactions, you can use the [HTTP](#use-the-driver-over-http) `neon()` function instead, which doesn't need WebSockets.

### Security warning in the browser console

```text
WARNING: Running SQL directly from the browser can have security implications.
```

The driver prints this warning when it connects from a web browser, because running SQL from client-side code can expose your database to misuse. If you've assessed the risks (for example, you're prototyping, or your data is protected by [Row-Level Security](/docs/guides/row-level-security)), you can suppress the warning:

```javascript
// HTTP
const sql = neon(process.env.DATABASE_URL, { disableWarningInBrowsers: true });

// WebSockets
neonConfig.disableWarningInBrowsers = true;
```

## Example applications

Explore the example applications that use the Neon serverless driver.

### UNESCO World Heritage sites app

Neon provides an example application to help you get started with the Neon serverless driver. The application generates a `JSON` listing of the 10 nearest UNESCO World Heritage sites using IP geolocation (data copyright © 1992 – 2022 UNESCO/World Heritage Centre).

![UNESCO World Heritage sites app](/docs/changelog/unesco_sites.png)

There are different implementations of the application to choose from.

<DetailIconCards>
<a href="https://github.com/neondatabase/neon-vercel-rawsql" description="Demonstrates using raw SQL with Neon's serverless driver on Vercel Edge Functions" icon="github">Raw SQL + Vercel Edge Functions</a>
<a href="https://github.com/neondatabase/neon-vercel-http" description="Demonstrates Neon's serverless driver over HTTP on Vercel Edge Functions" icon="github">Raw SQL via https + Vercel Edge Functions</a>
<a href="https://github.com/neondatabase/serverless-cfworker-demo" description="Demonstrates using the Neon serverless driver on Cloudflare Workers and employs caching for high performance." icon="github">Raw SQL + Cloudflare Workers</a>
<a href="https://github.com/neondatabase/neon-vercel-kysely" description="Demonstrates using kysely and kysely-codegen with Neon's serverless driver on Vercel Edge Functions" icon="github">Kysely + Vercel Edge Functions</a>
<a href="https://github.com/neondatabase/neon-vercel-zapatos" description="Demonstrates using Zapatos with Neon's serverless driver on Vercel Edge Functions" icon="github">Zapatos + Vercel Edge Functions</a>
<a href="https://github.com/neondatabase/neon-vercel-pgtyped" description="Demonstrates using pgTyped with Neon's serverless driver on Vercel Edge Functions" icon="github">Neon + pgTyped on Vercel Edge Functions</a>
<a href="https://github.com/neondatabase/neon-vercel-knex" description="Demonstrates using Knex with Neon's serverless driver on Vercel Edge Functions" icon="github">Neon + Knex on Vercel Edge Functions</a>
</DetailIconCards>

### Ping Thing

The Ping Thing application pings a Neon Serverless Postgres database using a Vercel Edge Function and shows the journey your request makes. You can read more about this application in the accompanying blog post: [How to use Postgres at the Edge](/blog/how-to-use-postgres-at-the-edge)

<DetailIconCards>
<a href="https://github.com/neondatabase/ping-thing" description="Ping a Neon Serverless Postgres database using a Vercel Edge Function to see the journey your request makes" icon="github">Ping Thing</a>
</DetailIconCards>

## Neon serverless driver GitHub repository and changelog

The GitHub repository and [changelog](https://github.com/neondatabase/serverless/blob/main/CHANGELOG.md) for the Neon serverless driver are found [here](https://github.com/neondatabase/serverless).

## References

- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [node-postgres](https://node-postgres.com/)
- [Drizzle-ORM](https://orm.drizzle.team/docs/quick-postgresql/neon)
- [Schema migration with Lakebase Postgres and Drizzle ORM](/docs/guides/drizzle-migrations)
- [kysely](https://github.com/kysely-org/kysely)
- [Zapatos](https://jawj.github.io/zapatos/)
- [Vercel Edge Functions](https://vercel.com/docs/functions/edge-functions)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Use Neon with Cloudflare Workers](/docs/guides/cloudflare-workers)

<NeedHelp/>
