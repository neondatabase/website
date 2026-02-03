---
title: Neon serverless driver
enableTableOfContents: true
subtitle: Connect to Neon from serverless environments over HTTP or WebSockets
updatedOn: '2026-01-31T00:00:00.000Z'
---

<Admonition type="important" title="The Neon serverless driver is now generally available (GA)">
The GA version of the Neon serverless driver, v1.0.0 and higher, requires Node.js version 19 or higher. It also includes a **breaking change** but only if you're calling the HTTP query template function as a conventional function. For details, please see the [1.0.0 release notes](https://github.com/neondatabase/serverless/pull/149) or read the [blog post](/blog/serverless-driver-ga).
</Admonition>

The [Neon serverless driver](https://github.com/neondatabase/serverless) is a low-latency Postgres driver for JavaScript and TypeScript that allows you to query data from serverless and edge environments over **HTTP** or **WebSockets** in place of TCP. The driver's low-latency capability is due to [message pipelining and other optimizations](/blog/quicker-serverless-postgres).

## Get this working

<Tabs labels={["HTTP (recommended)", "WebSockets (sessions + pg compatibility)"]}>

<TabItem>

**Use HTTP** for one-shot queries and short, non-interactive transactions. It's the fastest option for most serverless request/response flows.

<Admonition type="tip" title="Actions">
<CopyPrompt
  src="/prompts/serverless-driver-choose-http-vs-websockets.md"
  displayText="Have an AI assistant confirm which mode you should use for your runtime."
  buttonText="Copy mode prompt"
/>

<CopyPrompt
  src="/prompts/serverless-driver-generate-snippet.md"
  displayText="Generate a minimal working snippet for your runtime (HTTP path)."
  buttonText="Copy snippet prompt"
/>

Working with AI coding assistants? Check out our [AI rules for the Neon Serverless Driver](/docs/ai/ai-rules-neon-serverless).
</Admonition>

<CheckList title="Neon serverless driver quick start checklist (HTTP)">

<CheckItem title="Install the package" href="#install-the-neon-serverless-driver">
Install `@neondatabase/serverless` using your preferred package manager.
</CheckItem>

<CheckItem title="Set DATABASE_URL" href="#configure-your-neon-database-connection">
Set your connection string in an environment variable.
</CheckItem>

<CheckItem title="Run a smoke test query" href="#http-smoke-test">
Run `SELECT 1` (or a simple table query) to confirm basic connectivity.
</CheckItem>

<CheckItem title="Choose your runtime snippet" href="#http-runtime-snippets">
Pick the example that matches your environment (Node, Vercel Edge, etc.).
</CheckItem>

</CheckList>

### HTTP smoke test

```ts
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
const rows = await sql`SELECT 1 as ok`;
console.log(rows); // [{ ok: 1 }]
```

### HTTP runtime snippets

<CodeTabs labels={["Node.js", "Drizzle-ORM", "Vercel edge function", "Vercel serverless function"]}>

```ts
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
const postId = 12;

const posts = await sql`SELECT * FROM posts WHERE id = ${postId}`;
// or for manually parameterized queries:
const posts2 = await sql.query('SELECT * FROM posts WHERE id = $1', [postId]);
```

```ts
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

```ts
import { neon } from '@neondatabase/serverless';

export default async (req: Request) => {
  const sql = neon(process.env.DATABASE_URL!);
  const postId = 12;

  const posts = await sql`SELECT * FROM posts WHERE id = ${postId}`;
  return new Response(JSON.stringify(posts), { headers: { 'content-type': 'application/json' } });
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
  const postId = 12;

  const posts = await sql`SELECT * FROM posts WHERE id = ${postId}`;
  return res.status(200).json(posts);
}
```

</CodeTabs>

<Admonition type="note">
The maximum request size and response size for queries over HTTP is 64 MB.
</Admonition>

</TabItem>

<TabItem>

**Use WebSockets** if you need session or interactive transaction support, or compatibility with [node-postgres](https://node-postgres.com/) (the **npm** `pg` package).

<Admonition type="tip" title="Actions">
<CopyPrompt
  src="/prompts/serverless-driver-choose-http-vs-websockets.md"
  displayText="Have an AI assistant confirm which mode you should use for your runtime."
  buttonText="Copy mode prompt"
/>

Working with AI coding assistants? Check out our [AI rules for the Neon Serverless Driver](/docs/ai/ai-rules-neon-serverless).
</Admonition>

<CheckList title="Neon serverless driver quick start checklist (WebSockets)">

<CheckItem title="Install the package" href="#install-the-neon-serverless-driver">
Install `@neondatabase/serverless` using your preferred package manager.
</CheckItem>

<CheckItem title="Set DATABASE_URL" href="#configure-your-neon-database-connection">
Set your connection string in an environment variable.
</CheckItem>

<CheckItem title="Provide a WebSocket constructor (Node.js)" href="#use-the-driver-over-websockets">
Some environments require you to supply a WebSocket implementation.
</CheckItem>

<CheckItem title="Use Pool or Client" href="#use-the-driver-over-websockets">
Use `Pool` / `Client` for `pg` compatibility, sessions, and interactive transactions.
</CheckItem>

</CheckList>

### WebSockets smoke test (Pool)

```ts
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const result = await pool.query('SELECT 1 as ok');
await pool.end();
console.log(result.rows); // [{ ok: 1 }]
```

</TabItem>

</Tabs>

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

You can obtain a connection string for your database by clicking the **Connect** button on your **Project Dashboard**. Your Neon connection string will look something like this:

```shell
DATABASE_URL=postgresql://[user]:[password]@[neon_hostname]/[dbname]
```

The examples that follow assume that your database connection string is assigned to a `DATABASE_URL` variable in your application's environment file.

## Use the driver over HTTP

The Neon serverless driver uses the [neon](https://github.com/neondatabase/serverless/blob/main/CONFIG.md#neon-function) function for queries over HTTP. The function returns a query function that can only be used as a template function for improved safety against SQL injection vulnerabilities.

For example:

```ts
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);
const id = 1;

// Safe and convenient template function usage
const result = await sql`SELECT * FROM table WHERE id = ${id}`;

// For manually parameterized queries, use the query() function
const result2 = await sql.query('SELECT * FROM table WHERE id = $1', [id]);

// For interpolating trusted strings (like column or table names), use the unsafe() function
const table = condition ? 'table1' : 'table2'; // known-safe string values
const result3 = await sql`SELECT * FROM ${sql.unsafe(table)} WHERE id = ${id}`;
```

## Use the driver over WebSockets

The Neon serverless driver supports the [Pool and Client](https://github.com/neondatabase/serverless?tab=readme-ov-file#pool-and-client) constructors for querying over WebSockets.

Consider using the driver with `Pool` or `Client` in the following scenarios:

- You already use `node-postgres` in your code base and would like to migrate to using `@neondatabase/serverless`.
- You are writing a new code base and want to use a package that expects a `node-postgres-compatible` driver.
- Your backend service uses sessions / interactive transactions with multiple queries per connection.

## Example applications

Explore the example applications that use the Neon serverless driver.

<DetailIconCards>
<a href="https://github.com/neondatabase/neon-vercel-rawsql" description="Demonstrates using raw SQL with Neon's serverless driver on Vercel Edge Functions" icon="github">Raw SQL + Vercel Edge Functions</a>
<a href="https://github.com/neondatabase/neon-vercel-http" description="Demonstrates Neon's serverless driver over HTTP on Vercel Edge Functions" icon="github">Raw SQL via HTTPS + Vercel Edge Functions</a>
<a href="https://github.com/neondatabase/serverless-cfworker-demo" description="Demonstrates using the Neon serverless driver on Cloudflare Workers and employs caching for high performance." icon="github">Raw SQL + Cloudflare Workers</a>
<a href="https://github.com/neondatabase/neon-vercel-kysely" description="Demonstrates using kysely and kysely-codegen with Neon's serverless driver on Vercel Edge Functions" icon="github">Kysely + Vercel Edge Functions</a>
<a href="https://github.com/neondatabase/neon-vercel-zapatos" description="Demonstrates using Zapatos with Neon's serverless driver on Vercel Edge Functions" icon="github">Zapatos + Vercel Edge Functions</a>
<a href="https://github.com/neondatabase/neon-vercel-pgtyped" description="Demonstrates using pgTyped with Neon's serverless driver on Vercel Edge Functions" icon="github">Neon + pgTyped on Vercel Edge Functions</a>
<a href="https://github.com/neondatabase/neon-vercel-knex" description="Demonstrates using Knex with Neon's serverless driver on Vercel Edge Functions" icon="github">Neon + Knex on Vercel Edge Functions</a>
<a href="https://github.com/neondatabase/ping-thing" description="Ping a Neon Serverless Postgres database using a Vercel Edge Function to see the journey your request makes" icon="github">Ping Thing</a>
</DetailIconCards>

<NeedHelp/>
