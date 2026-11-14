---
title: Connect Astro to Postgres on Neon
subtitle: Learn how to make server-side queries to Postgres from .astro files or API
  routes.
summary: >-
  Connecting Astro to Lakebase Postgres requires the Astro Node adapter for
  on-demand (SSR) rendering so pages query the database at request time rather
  than only at build time. The guide covers driver options including
  node-postgres, postgres.js, and the Neon serverless driver, and shows query
  patterns for both .astro page components and server endpoint API routes.
enableTableOfContents: true
updatedOn: '2026-10-09T15:55:57.334Z'
---

<CopyPrompt src="/prompts/astro-serverless-prompt.md" 
description="Pre-built prompt for connecting Astro to Neon using the Neon serverless driver"/>

Astro is a web framework for content sites, web applications, and server APIs. This guide describes how to create a database on Neon and query it from an Astro site or application at request time.

To create a Neon project and access it from an Astro site or application:

<Steps>

## Create a Neon project

If you do not have one already, create a Neon project. Save your connection details including your password. They are required when defining connection settings.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Create an Astro project and add dependencies

1. Create an Astro project if you do not have one, for example with `npm create astro@latest`. For instructions, see [Getting Started](https://docs.astro.build/en/getting-started/) in the Astro documentation.

2. Add project dependencies using one of the following commands:

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

## Enable on-demand rendering

Astro needs an adapter and server output to query your database at request time. Add the Node adapter:

```shell
npx astro add node
```

Then set `output: 'server'` in `astro.config.mjs` so every page and endpoint uses [on-demand rendering](https://docs.astro.build/en/guides/on-demand-rendering/) (also known as server-side rendering or SSR):

```javascript filename="astro.config.mjs"
// @ts-check
import { defineConfig, envField } from 'astro/config';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'server', // [!code ++]
  adapter: node({
    mode: 'standalone',
  }),
  env: {
    schema: {
      DATABASE_URL: envField.string({ context: 'server', access: 'secret' }),
    },
  },
});
```

The `env.schema` entry declares `DATABASE_URL` as a server-only secret. Astro reads secrets from the environment at runtime instead of copying them into the build output, so your password doesn't end up in `dist/`. For more, see [Type-safe environment variables](https://docs.astro.build/en/guides/environment-variables/#type-safe-environment-variables) in the Astro documentation.

<Admonition type="note">
The adapter alone isn't enough. Astro's default output is `static`, so without `output: 'server'`, `npm run build` prerenders your pages and API routes at build time and production serves the build-time results. To render only some routes on demand, keep the default and add `export const prerender = false;` to those pages and endpoints. Development mode (`npm run dev`) renders every request, so you won't see the difference until you build.
</Admonition>

If your project already deploys with another adapter, such as `@astrojs/vercel` or `@astrojs/netlify`, keep it instead of adding the Node adapter. Set `output: 'server'` and the `env.schema` entry the same way, and add `DATABASE_URL` to your hosting platform's environment variables.

## Store your Neon credentials

Add a `.env` file to your project directory and add your Neon connection string to it. You can find the connection string for your database by clicking the **Connect** button in the Console nav to open the **Connect to your branch** modal. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

```shell shouldWrap
DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"
```

If you use node-postgres, `pg` 8.23 and later print a `SECURITY WARNING` for `sslmode=require`. Change it to `sslmode=verify-full` to keep the same behavior without the warning.

The `channel_binding=require` parameter is optional. If your connection string doesn't include it, you can use the string as is.

## Create a database utility

Create a reusable database client that you can import throughout your application. This approach centralizes your database configuration and follows best practices for code organization.

Create a new file at `src/lib/neon.ts` (or `src/lib/neon.js`) with the following code:

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```typescript
import { Pool } from 'pg';
import { DATABASE_URL } from 'astro:env/server';

export const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: true,
});
```

```typescript
import postgres from 'postgres';
import { DATABASE_URL } from 'astro:env/server';

export const sql = postgres(DATABASE_URL, { ssl: 'require' });
```

```typescript
import { neon } from '@neondatabase/serverless';
import { DATABASE_URL } from 'astro:env/server';

export const sql = neon(DATABASE_URL);
```

</CodeTabs>

## Configure the Postgres client

There are multiple ways to make server side requests with Astro. See below for two of those options: **Page Components (.astro files)** and **Server Endpoints (API Routes)**.

### Page Components (.astro files)

In your `.astro` page components (for example, `src/pages/index.astro`), you can query the database in the frontmatter section (between the `---` fences). Import the database client from your utility file:

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```astro
---
import { pool } from '../lib/neon';

const client = await pool.connect();

let data = null;

try {
  const response = await client.query('SELECT version()');
  data = response.rows[0].version;
} finally {
  client.release();
}
---

{data}
```

```astro
---
import { sql } from '../lib/neon';

const response = await sql`SELECT version()`;
const data = response[0].version;
---

{data}
```

```astro
---
import { sql } from '../lib/neon';

const response = await sql`SELECT version()`;
const data = response[0].version;
---

{data}
```

</CodeTabs>

<Admonition type="note">
You can also initialize the database connection directly in each `.astro` file, but using a shared utility file is recommended for maintainability and code organization.
</Admonition>

#### Run the app

When you run `npm run dev` you can expect to see something like the following when you visit `localhost:4321`:

```shell shouldWrap
PostgreSQL 18.6 (ac70818) on aarch64-unknown-linux-gnu, compiled by gcc (Ubuntu 13.3.0-6ubuntu2~24.04.1) 13.3.0, 64-bit
```

### Server Endpoints (API Routes)

In your server endpoints (API routes), import the database client from your utility file. Create `src/pages/api/index.ts`:

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```typescript filename="src/pages/api/index.ts"
import { pool } from '../../lib/neon';

export async function GET() {
  const client = await pool.connect();
  let data = {};
  try {
    const { rows } = await client.query('SELECT version()');
    data = rows[0];
  } finally {
    client.release();
  }
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
}
```

```typescript filename="src/pages/api/index.ts"
import { sql } from '../../lib/neon';

export async function GET() {
  const response = await sql`SELECT version()`;
  return new Response(JSON.stringify(response[0]), {
    headers: { 'Content-Type': 'application/json' },
  });
}
```

```typescript filename="src/pages/api/index.ts"
import { sql } from '../../lib/neon';

export async function GET() {
  const response = await sql`SELECT version()`;
  return new Response(JSON.stringify(response[0]), {
    headers: { 'Content-Type': 'application/json' },
  });
}
```

</CodeTabs>

#### Run the app (#run-the-app-2)

When you run `npm run dev` you can expect to see something like the following when you visit the `localhost:4321/api` route:

```json shouldWrap
{"version":"PostgreSQL 18.6 (ac70818) on aarch64-unknown-linux-gnu, compiled by gcc (Ubuntu 13.3.0-6ubuntu2~24.04.1) 13.3.0, 64-bit"}
```

To run the production build, run `npm run build`, then start the server with `DATABASE_URL` set in its environment. For example, load it from your `.env` file with Node's `--env-file` option (Node 20.6 or later):

```shell
node --env-file=.env ./dist/server/entry.mjs
```

The server listens on port 4321 by default; set the `PORT` environment variable to change it. With `output: 'server'`, each request queries your database. If `DATABASE_URL` isn't set, Astro fails the request with an `EnvInvalidVariables` error. This command applies to the Node adapter. With another adapter, build and deploy the way your hosting platform documents.

</Steps>

## Next steps

- [Set up Managed Better Auth](/docs/auth/overview): Add managed authentication that branches with your database
- [Add Object Storage](/docs/storage/overview): S3-compatible file storage that branches with your database
- [Deploy a Function](/docs/compute/functions/overview): Run backend compute next to your database, no separate hosting needed
- [Call an LLM with AI Gateway](/docs/ai-gateway/overview): Access foundation models from Anthropic, OpenAI, Google, and more with one credential

<NeedHelp/>
