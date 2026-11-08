---
title: Connect a Sveltekit application to Neon
subtitle: Set up a project on Neon in seconds and connect from a Sveltekit application
summary: >-
  SvelteKit integration with Lakebase Postgres connects a SvelteKit app to a
  serverless Postgres database through a secure server-side route using
  node-postgres, postgres.js, or the Neon serverless driver. Use this guide
  when setting up a new SvelteKit project that needs a Postgres backend, covering
  project creation, db.server.ts configuration, and a +page.server.ts load
  function. Requires a DATABASE_URL connection string with sslmode=require and
  channel_binding=require.
enableTableOfContents: true
updatedOn: '2026-10-08T19:32:04.700Z'
---

<CopyPrompt src="/prompts/sveltekit-prompt.md"
description="Pre-built prompt for connecting SvelteKit applications to Lakebase Postgres."/>

SvelteKit is the application framework for Svelte. This guide explains how to connect a SvelteKit app to Neon and query your database in a server-side `load` function. It uses SvelteKit 3, which reads environment variables through `$app/env/private` and requires Svelte 5 runes in components.

To create a project on Neon and access it from a SvelteKit application:

<Steps>

## Create a Neon project

If you do not have one already, create a Neon project. Save your connection details including your password. They are required when defining connection settings.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Create a SvelteKit project and add dependencies

1. Create a SvelteKit project using the following commands:

   ```shell
   npx sv create my-app --template minimal --no-add-ons --types ts
   cd my-app
   ```

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

## Store your Neon credentials

Add a `.env` file to your project directory and add your Neon connection string to it. You can find the connection string for your database by clicking the **Connect** button in the Console nav. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

```shell shouldWrap
DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"
```

If you use node-postgres, `pg` 8.23 and later print a `SECURITY WARNING` for `sslmode=require`. Change it to `sslmode=verify-full` to keep the same behavior without the warning.

Then declare the variable in `src/env.ts`. SvelteKit loads `.env` in development and reads declared variables from the environment when the app starts, so your password isn't built into the app:

```typescript filename="src/env.ts"
import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
  DATABASE_URL: {
    description: 'Neon connection string',
  },
});
```

## Configure the Postgres client

There are two parts to connecting a SvelteKit application to Neon. The first is `db.server.ts`, which contains the database configuration. The second is the server-side route where the connection to the database will be used.

### Database module

Create a `db.server.ts` file at the root of your `src` directory and add the following code to connect to your Neon database. The `.server` suffix keeps the module, and your connection string, out of client-side code.

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```typescript filename="src/db.server.ts"
import pg from 'pg';
import { DATABASE_URL } from '$app/env/private';

export const pool = new pg.Pool({
  connectionString: DATABASE_URL,
  ssl: true,
});
```

```typescript filename="src/db.server.ts"
import postgres from 'postgres';
import { DATABASE_URL } from '$app/env/private';

export const sql = postgres(DATABASE_URL, { ssl: 'require' });
```

```typescript filename="src/db.server.ts"
import { neon } from '@neondatabase/serverless';
import { DATABASE_URL } from '$app/env/private';

export const sql = neon(DATABASE_URL);
```

</CodeTabs>

### Server load function

Create a `src/routes/+page.server.ts` file and import the database configuration:

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```typescript
import { pool } from '../db.server';

export async function load() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT version()');
    const { version } = rows[0];
    return {
      version,
    };
  } finally {
    client.release();
  }
}
```

```typescript
import { sql } from '../db.server';

export async function load() {
  const response = await sql`SELECT version()`;
  const { version } = response[0];
  return {
    version,
  };
}
```

```typescript
import { sql } from '../db.server';

export async function load() {
  const response = await sql`SELECT version()`;
  const { version } = response[0];
  return {
    version,
  };
}
```

</CodeTabs>

### Page component

Replace the contents of `src/routes/+page.svelte` to display the data. SvelteKit 3 uses Svelte 5 runes, so read `data` with `$props()` (`export let data` fails with `Cannot use export let in runes mode`):

```svelte filename="src/routes/+page.svelte"
<script lang="ts">
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<h1>Database Version</h1>
<p>{data.version}</p>
```

## Run the app

When you run `npm run dev` you can expect to see the following on [localhost:5173](http://localhost:5173):

```shell shouldWrap
Database Version
PostgreSQL 18.6 (ac70818) on aarch64-unknown-linux-gnu, compiled by gcc (Ubuntu 13.3.0-6ubuntu2~24.04.1) 13.3.0, 64-bit
```

To run a production build on Node.js, switch the adapter in `vite.config.ts` from `@sveltejs/adapter-auto` to [`@sveltejs/adapter-node`](https://svelte.dev/docs/kit/adapter-node) (`npm install -D @sveltejs/adapter-node`), run `npm run build`, and start the server with `DATABASE_URL` in its environment, for example `node --env-file=.env build`.

</Steps>

## Next steps

- [Set up Managed Better Auth](/docs/auth/overview): Add managed authentication that branches with your database
- [Add Object Storage](/docs/storage/overview): S3-compatible file storage that branches with your database
- [Deploy a Function](/docs/compute/functions/overview): Run backend compute next to your database, no separate hosting needed
- [Call an LLM with AI Gateway](/docs/ai-gateway/overview): Access foundation models from Anthropic, OpenAI, Google, and more with one credential
- [Realtime](/docs/realtime/quickstart): Build realtime apps with end-to-end reactivity &raquo;

<NeedHelp/>
