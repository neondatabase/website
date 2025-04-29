---
title: Connect a Hono application to Neon
subtitle: Set up a Neon project in seconds and connect from a Hono application
enableTableOfContents: true
updatedOn: '2025-04-29T00:00:00.000Z'
---

[Hono](https://hono.dev/) is a lightweight, multi-runtime web framework for the Edge, Node.js, Deno, Bun, and other runtimes. This topic describes how to create a Neon project and access it from a Hono application.

To create a Neon project and access it from a Hono application:

<Steps>

## Create a Neon project

If you do not have one already, create a Neon project. Save your connection details including your password. They are required when defining connection settings.

1.  Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2.  Click **New Project**.
3.  Specify your project settings and click **Create Project**.

## Create a Hono project and add dependencies

1.  Create a Hono project if you do not have one. For instructions, see [Quick Start](https://hono.dev/docs/getting-started/basic), in the Hono documentation.

2.  Add project dependencies using one of the following commands:

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```shell
npm install pg
```

```shell
npm install postgres
```

```shell
npm install @neondatabase/serverless
```

   </CodeTabs>

## Store your Neon credentials

Add a `.env` file to your project directory and add your Neon connection string to it. You can find your connection details by clicking **Connect** on the Neon **Project Dashboard**. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

```shell shouldWrap
DATABASE_URL="postgresql://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require"
```

## Configure the Postgres client

In your Hono application (e.g., in `src/index.ts` or a specific route file), import the driver and use it within your route handlers.

Here's how you can set up a simple route to query the database:

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```typescript
import { Pool } from 'pg';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';

const app = new Hono();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

app.get('/', async (c) => {
  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT version()');
    return c.json({ version: rows[0].version });
  } catch (error) {
    console.error('Database query failed:', error);
    return c.text('Failed to connect to database', 500);
  } finally {
    client.release();
  }
});

serve(app);
```

```typescript
import { Hono } from 'hono';
import postgres from 'postgres';
import { serve } from '@hono/node-server';

const app = new Hono();

app.get('/', async (c) => {
  try {
    const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });
    const response = await sql`SELECT version()`;
    return c.json({ version: response[0].version });
  } catch (error) {
    console.error('Database query failed:', error);
    return c.text('Failed to connect to database', 500);
  }
});

serve(app);
```

```typescript
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { neon } from '@neondatabase/serverless';

const app = new Hono();

app.get('/', async (c) => {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const response = await sql`SELECT version()`;
    return c.json({ version: response[0]?.version });
  } catch (error) {
    console.error('Database query failed:', error);
    return c.text('Failed to connect to database', 500);
  }
});

serve(app);
```

</CodeTabs>

## 5. Run the app

Start your Hono development server. You can use the following command:

```bash
npm run dev
```

Navigate to your application's URL ([localhost:3000](http://localhost:3000)). You should see a JSON response with the PostgreSQL version:

```json shouldWrap
{
  "version": "PostgreSQL 17.4 on x86_64-pc-linux-gnu, compiled by gcc (Debian 12.2.0-14) 12.2.0, 64-bit"
}
```

> The specific version may vary depending on the PostgreSQL version you are using.

</Steps>

## Source code

You can find a sample Hono application configured for Neon on GitHub:

<DetailIconCards>

<a href="https://github.com/neondatabase/examples/tree/main/with-hono" description="Get started with Hono and Neon" icon="github">Get started with Hono and Neon</a>

</DetailIconCards>

<NeedHelp/>
