---
title: Neon serverless driver
enableTableOfContents: true
subtitle: Connect to Neon from serverless environments over HTTP or WebSockets
updatedOn: '2023-10-13T14:08:36.352Z'
---

The [Neon serverless driver](https://github.com/neondatabase/serverless) is a low-latency Postgres driver for JavaScript and TypeScript that allows you to query data from serverless and edge environments over **HTTP** or **WebSockets** in place of TCP. The driver's low-latency capability is due to [message pipelining and other optimizations](https://neon.tech/blog/quicker-serverless-postgres).

When to query over HTTP vs WebSockets:

- **HTTP**: Querying over an HTTP [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) request is faster for single, non-interactive transactions, also referred to as "one-shot queries". Issuing [multiple queries](#issue-multiple-queries-with-the-transaction-function) via a single, non-interactive transaction is also supported. See [How to use the driver over HTTP](#how-to-use-the-driver-over-http).
- **WebSockets**: If you require session or interactive transaction support or compatibility with [node-postgres](https://node-postgres.com/) (the popular **npm** `pg` package), use WebSockets. See [How to use the driver over WebSockets](#use-the-driver-over-websockets).

## Install the Neon serverless driver

You can install the driver with your preferred JavaScript package manager. For example:

```shell
npm install @neondatabase/serverless
```

The driver includes TypeScript types (the equivalent of `@types/pg`). No additional installation is required.

## Configure your Neon database connection

You can obtain a connection string for your database from the **Connection Details** widget on the Neon **Dashboard**. Your Neon connection string will look something like this:

```shell
DATABASE_URL=postgres://[user]:[password]@[neon_hostname]/[dbname]
```

The examples that follow assume that your database connection string is assigned to a `DATABASE_URL` variable in your application's environment file.

## Use the driver over HTTP

The Neon serverless driver uses the [neon](https://github.com/neondatabase/serverless/blob/main/CONFIG.md#neon-function) function for queries over HTTP.

You can use raw SQL queries or tools such as [Drizzle-ORM](https://orm.drizzle.team/docs/quick-postgresql/neon), [kysely](https://github.com/kysely-org/kysely), [Zapatos](https://jawj.github.io/zapatos/), and others for type safety.

<CodeTabs labels={["Node.js", "Drizzle-ORM", "Vercel Edge Function", "Vercel Serverless Function"]}>

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

```javascript
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
The maximum request size and response size for queries over HTTP is 10 MB. Additionally, there is a 15-second proxy timeout for SQL requests over HTTP. Long-running queries that exceed the 15-second threshold are terminated.
</Admonition>

### neon function configuration options

The `neon(...)` function supports `arrayMode`, `fullResults`, and `fetchOptions` option keys for customizing the query function.

- `arrayMode: boolean`

  When `arrayMode` is true, rows are returned as an array of arrays instead of an array of objects:

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

  When `fullResults` is `true`, additional metadata is returned alongside the result rows, which are then found in the `rows` property of the return value. The metadata matches what would be returned by `node-postgres`:

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

  For example, to increase the priority of every database fetch request:

  ```javascript
  import { neon } from '@neondatabase/serverless';
  const sql = neon(process.env.DATABASE_URL, { fetchOptions: { priority: 'high' } });
  const rows = await sql`SELECT * FROM posts WHERE id = ${postId}`;
  ```

  Or to implement a fetch timeout:

  ```javascript
  import { neon } from '@neondatabase/serverless';
  const sql = neon(process.env.DATABASE_URL);
  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort('timed out'), 10000);
  const rows = await sql(
    'SELECT * FROM posts WHERE id = $1', [postId], 
    { fetchOptions: { signal: abortController.signal } }
  );  // throws an error if no result received within 10s
  clearTimeout(timeout);
  ```

For additional details, see [Options and configuration](https://github.com/neondatabase/serverless/blob/main/CONFIG.md#options-and-configuration).

### Issue multiple queries with the transaction() function

The `neon(...)` function also supports issuing multiple queries at once in a single, non-interactive transaction using the `transaction()` function, which is exposed as a property of the query function. For example:

```javascript
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

### Experimental connection caching

Connection caching provides server-side connection pooling so that a new connection does not have to be set up for each query over HTTP. You can enable it by setting `fetchConnectionCache` to `true` using the [neonConfig](https://github.com/neondatabase/serverless/blob/main/CONFIG.md#neonconfig-configuration) object.

```javascript
import { neonConfig } from '@neondatabase/serverless';

// Enable connection cache (pool) on the server for HTTP fetch queries
neonConfig.fetchConnectionCache = true
```

<Admonition type="note">
This experimental option is currently only recommended for use with a non-pooled Neon connection string. For information about pooled and non-pooled Neon connections, see [Connection pooling](/docs/connect/connection-pooling).
</Admonition>

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

const pool = new Pool({connectionString: process.env.DATABASE_URL});
const {rows: [post]} = await pool.query('SELECT * FROM posts WHERE id =$1', [postId]);
pool.end();
```

```typescript
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import ws from 'ws';

dotenv.config()
neonConfig.webSocketConstructor = ws;
const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);
const prisma = new PrismaClient({ adapter });

async function main(){
  const posts = await prisma.post.findMany()
}

main()
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

```javascript
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

### Pool and Client usage notes

- In Node.js and some other environments, there's no built-in WebSocket support. In these cases, supply a WebSocket constructor function.

  ```javascript
  import ws from 'ws';
  neonConfig.webSocketConstructor = ws;
  ```
- In serverless environments such as Vercel Edge Functions or Cloudflare Workers, WebSocket connections can't outlive a single request. That means `Pool` or `Client` objects must be connected, used and closed within a single request handler. Don't create them outside a request handler; don't create them in one handler and try to reuse them in another; and to avoid exhausting available connections, don't forget to close them.

For examples that demonstrate these points, see [Pool and Client](https://github.com/neondatabase/serverless?tab=readme-ov-file#pool-and-client).

### Pool and Client configuration options

For configuration options that apply to `Pool` and `Client`, see [neonConfig configuration](https://github.com/neondatabase/serverless/blob/main/CONFIG.md#neonconfig-configuration) in the driver's GitHub repository.

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
<a href="https://github.com/neondatabase/neon-hyperdrive" description="Neon + Cloudflare Hyperdrive (Beta)" icon="github">Demonstrates using Cloudflare's Hyperdrive to access your Neon database from Cloudflare Workers</a>
</DetailIconCards>

### Ping Thing

The Ping Thing application pings a Neon Serverless Postgres database using a Vercel Edge Function and shows the journey your request makes. You can read more about this application in the accompanying blog post: [How to use Postgres at the Edge](https://neon.tech/blog/how-to-use-postgres-at-the-edge)

<DetailIconCards>
<a href="https://github.com/neondatabase/ping-thing" description="Ping a Neon Serverless Postgres database using a Vercel Edge Function to see the journey your request makes" icon="github">Ping Thing</a>
</DetailIconCards>

## References

- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Neon serverless driver GitHub repository](https://github.com/neondatabase/serverless)
- [node-postgres](https://node-postgres.com/)
- [Drizzle-ORM](https://orm.drizzle.team/docs/quick-postgresql/neon)
- [kysely](https://github.com/kysely-org/kysely)
- [Zapatos](https://jawj.github.io/zapatos/)
- [Vercel Edge Functions](https://vercel.com/docs/functions/edge-functions)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)

<NeedHelp/>
