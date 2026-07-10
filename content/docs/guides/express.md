---
title: Connect an Express application to Neon
subtitle: Set up a Neon project in seconds and connect from an Express application
summary: >-
  Express and Neon Postgres connection guide covering Node.js driver options:
  `@neondatabase/serverless` for edge and serverless platforms such as Vercel
  and Cloudflare Workers, `pg` (node-postgres) for long-running servers, and
  `postgres.js` for both. Use this page when connecting an Express API to a
  Neon database and choosing the right driver for your deployment target, from
  traditional Node.js servers to serverless runtimes without TCP support. Also
  covers project creation, `DATABASE_URL` setup via `dotenv`, and connection
  pool initialization outside route handlers.
enableTableOfContents: true
updatedOn: '2026-07-08T18:21:32.749Z'
---

<CopyPrompt src="/prompts/express-prompt.md"
description="Pre-built prompt for connecting ExpressJS applications to Neon Postgres"/>

This guide describes how to create a Neon project and connect to it from an Express application.

## Choose a driver

- **`@neondatabase/serverless`** connects over HTTP or WebSockets instead of TCP. Use it for serverless and edge platforms without built-in connection pooling (Vercel, Netlify Functions, Deno Deploy, Cloudflare Workers without Hyperdrive).
- **`postgres` (postgres.js)** is a fast, full-featured client for both serverless and traditional Node.js server environments.
- **`pg` (node-postgres)** is the classic, widely-used driver for traditional, long-running Node.js servers. Also the standard choice for [Vercel Fluid compute](https://vercel.com/docs/functions/fluid-compute) and Cloudflare with [Hyperdrive](https://developers.cloudflare.com/hyperdrive/).

For a detailed comparison including all platforms, see [Choosing your connection method](/docs/connect/choose-connection).

<Steps>

## Create a Neon project

If you do not have one already, create a Neon project.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Create an Express project and add dependencies

1. Create an Express project and change to the newly created directory.

   ```shell
   mkdir neon-express-example
   cd neon-express-example
   npm init -y
   npm install express
   ```

2. Add project dependencies using one of the following commands:

   <CodeTabs labels={["Neon serverless driver", "node-postgres", "postgres.js"]}>

   ```shell
   npm install @neondatabase/serverless dotenv
   ```

   ```shell
   npm install pg dotenv
   ```

   ```shell
   npm install postgres dotenv
   ```

   </CodeTabs>

## Store your Neon credentials

Add a `.env` file to your project directory and add your Neon connection details to it. Find your database connection details by clicking the **Connect** button on your **Project Dashboard** to open the **Connect to your database** modal. Select Node.js from the **Connection string** dropdown. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

```shell shouldWrap
DATABASE_URL="postgresql://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require&channel_binding=require"
```

<Admonition type="important">
Never hardcode credentials in source code files. Always use environment variables via `process.env`. For more information, see [Security overview](/docs/security/security-overview).
</Admonition>

## Configure the Postgres client

Add an `index.js` file to your project directory and add the following code snippet to connect to your Neon database:

<CodeTabs labels={["Neon serverless driver", "node-postgres", "postgres.js"]}>

```javascript
require('dotenv').config();

const express = require('express');
const { neon } = require('@neondatabase/serverless');

const app = express();
const PORT = process.env.PORT || 4242;

const sql = neon(process.env.DATABASE_URL);

app.get('/', async (req, res) => {
  try {
    const [result] = await sql`SELECT version()`;
    const version = result?.version || 'No version found';
    res.json({ version });
  } catch (error) {
    console.error('Database query failed:', error);
    res.status(500).json({ error: 'Failed to connect to the database.' });
  }
});

app.listen(PORT, () => {
  console.log(`Listening to http://localhost:${PORT}`);
});
```

```javascript
require('dotenv').config();

const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 4242;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get('/', async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    const { rows } = await client.query('SELECT version()');
    const version = rows[0]?.version || 'No version found';
    res.json({ version });
  } catch (error) {
    console.error('Database query failed:', error);
    res.status(500).json({ error: 'Failed to connect to the database.' });
  } finally {
    client?.release();
  }
});

app.listen(PORT, () => {
  console.log(`Listening to http://localhost:${PORT}`);
});
```

<Admonition type="note">
Recent versions of `pg` print a warning that `sslmode=require` will be treated as `verify-full` in a future major version, which has weaker security guarantees than the current behavior. If you see this warning, either add `uselibpqcompat=true` to your connection string to keep the current behavior, or use `sslmode=verify-full` directly. See the [pg-connection-string documentation](https://www.postgresql.org/docs/current/libpq-ssl.html) for details on libpq SSL mode definitions.
</Admonition>

```javascript
require('dotenv').config();

const express = require('express');
const postgres = require('postgres');

const app = express();
const PORT = process.env.PORT || 4242;

const sql = postgres(process.env.DATABASE_URL);

app.get('/', async (req, res) => {
  try {
    const [result] = await sql`SELECT version()`;
    const version = result?.version || 'No version found';
    res.json({ version });
  } catch (error) {
    console.error('Database query failed:', error);
    res.status(500).json({ error: 'Failed to connect to the database.' });
  }
});

app.listen(PORT, () => {
  console.log(`Listening to http://localhost:${PORT}`);
});
```

</CodeTabs>

## Run index.js

Run `node index.js` to view the result on [localhost:4242](localhost:4242) as follows:

```shell
{ version: 'PostgreSQL 16.0 on x86_64-pc-linux-gnu, compiled by gcc (Debian 10.2.1-6) 10.2.1 20210110, 64-bit' }
```

</Steps>

## Connection issues

- If you see an `endpoint ID is not specified` error, the TLS client your Postgres driver depends on doesn't support Server Name Indication (SNI), which Neon uses to route connections. For `pg` (node-postgres), this means an outdated `libpq`-compatible TLS stack; upgrading `pg` usually resolves it.
- If you encounter an `SSL SYSCALL error: EOF detected` (or a similar connection-reset error), this typically happens when an application tries to reuse a connection after the Neon compute has been suspended due to inactivity. This mainly affects long-running servers that keep a connection pool open, like the `pg` example above — closing and recreating idle connections, or reconnecting on error, resolves it.

<details>
<summary>**Notes for AI-assisted setup**</summary>

- Do not hardcode credentials or connection strings in any `.js` source file. Always use environment variables via `process.env` and `dotenv`.
- Wrap all database queries in a `try...catch` block. Return a `500` status with an error message on failure.
- When using `pg` (node-postgres), declare `let client` before the `try` block and call `client?.release()` in the `finally` block. This safely handles cases where `pool.connect()` itself fails.
- Initialize the connection pool or client outside the route handler, not inside it. Creating a new pool on every request wastes resources.
- Choose the right driver for your platform. `@neondatabase/serverless` is for serverless/edge platforms without TCP support. For long-running Express servers, use `pg` or `postgres`. See [Choosing your connection method](/docs/connect/choose-connection).

</details>

<NeedHelp/>
