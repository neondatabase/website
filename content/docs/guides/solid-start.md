---
title: Connect a SolidStart application to Neon
subtitle: Set up a Neon project in seconds and connect from a SolidStart application
summary: >-
  SolidStart integration with Neon walks through creating a Neon project and
  querying a serverless Postgres database from a SolidJS meta-framework app.
  Covers server-side data loading and API routes using node-postgres,
  postgres.js, or the Neon serverless driver.
enableTableOfContents: true
updatedOn: '2026-09-16T19:45:35.340Z'
---

<CopyPrompt src="/prompts/solidstart-prompt.md"
description="Pre-built prompt for connecting SolidStart applications to Neon"/>

SolidStart is an open-source meta-framework designed to integrate the components that make up a web application.<sup><a target="_blank" href="https://docs.solidjs.com/solid-start#overview">1</a></sup>. This guide explains how to connect SolidStart with Neon using a secure server-side request.

<Admonition type="note">
This guide uses SolidStart 2, which requires Node.js 24 or later. Run `node --version` to check your version.
</Admonition>

To create a Neon project and access it from a SolidStart application:

<Steps>

## Create a Neon project

If you do not have one already, create a Neon project. Save your connection details including your password. They are required when defining connection settings.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Create a SolidStart project and add dependencies

1. Create a SolidStart 2 project if you do not have one. The `-s` and `--v2` flags select SolidStart 2 without prompts. For more options, see the [SolidStart documentation](https://docs.solidjs.com/solid-start).

   ```shell
   npm create solid@latest my-solidstart-app -- -s --v2 -t basic --ts
   cd my-solidstart-app
   ```

2. Add project dependencies using one of the following commands:

   <CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

   ```shell
   npm install pg
   npm install -D @types/pg
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

<Admonition type="note">
`pg` 8.23 and later print a `SECURITY WARNING` when a connection string uses `sslmode=require`. If you use node-postgres, change `sslmode=require` to `sslmode=verify-full` in `DATABASE_URL` to keep the same behavior and remove the warning.
</Admonition>

## Configure the Postgres client

There are multiple ways to make server-side requests with SolidStart. See below for the different implementations.

### Server-side data loading

To [load data on the server](https://docs.solidjs.com/solid-start/building-your-application/data-loading#data-loading-always-on-the-server) in SolidStart, add the following code snippet to `src/routes/index.tsx` to connect to your Neon database:

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```typescript filename="src/routes/index.tsx"
import pg from 'pg';
import { createAsync, query } from "@solidjs/router";

const getVersion = query(async () => {
    "use server";
    const client = new pg.Client({
        connectionString: process.env.DATABASE_URL,
    });
    await client.connect();
    try {
      const response = await client.query('SELECT version()');
      return response.rows[0].version;
    } finally {
      await client.end();
    }
}, 'version')

export const route = {
  preload: () => getVersion(),
};

export default function Page() {
  const version = createAsync(() => getVersion());
  return <>{version()}</>;
}
```

```typescript filename="src/routes/index.tsx"
import postgres from 'postgres';
import { createAsync, query } from "@solidjs/router";

const getVersion = query(async () => {
    "use server";
    const sql = postgres(process.env.DATABASE_URL!, { ssl: 'require' });
    const response = await sql`SELECT version()`;
    return response[0].version;
}, 'version')

export const route = {
  preload: () => getVersion(),
};

export default function Page() {
  const version = createAsync(() => getVersion());
  return <>{version()}</>;
}
```

```typescript filename="src/routes/index.tsx"
import { neon } from "@neondatabase/serverless";
import { createAsync, query } from "@solidjs/router";

const getVersion = query(async () => {
    "use server";
    const sql = neon(process.env.DATABASE_URL!);
    const response = await sql`SELECT version()`;
    const { version } = response[0];

    return version;
}, 'version')

export const route = {
  preload: () => getVersion(),
};

export default function Page() {
  const version = createAsync(() => getVersion());
  return <>{version()}</>;
}
```

</CodeTabs>

### Server endpoints (API routes)

In your server endpoints (API routes) in your SolidStart application, use the following code snippet to connect to your Neon database. Create the file at `src/routes/api/test.ts`:

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```typescript filename="src/routes/api/test.ts"
import { Pool } from 'pg';
import { json } from '@solidjs/router';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  const client = await pool.connect();
  let data = {};
  try {
    const { rows } = await client.query('SELECT version()');
    data = rows[0];
  } finally {
    client.release();
  }
  return json(data);
}
```

```typescript filename="src/routes/api/test.ts"
import postgres from 'postgres';
import { json } from '@solidjs/router';

export async function GET() {
  const sql = postgres(process.env.DATABASE_URL!, { ssl: 'require' });
  const response = await sql`SELECT version()`;

  return json(response[0]);
}
```

```typescript filename="src/routes/api/test.ts"
import { neon } from '@neondatabase/serverless';
import { json } from '@solidjs/router';

export async function GET() {
  const sql = neon(process.env.DATABASE_URL!);
  const response = await sql`SELECT version()`;

  return json(response[0]);
}
```

</CodeTabs>

<Admonition type="note">
If `tsc` or your editor reports `Cannot find name 'process'`, the default template doesn't include Node.js types. Run `npm install -D @types/node` to add them.
</Admonition>

## Run the app

When you run `npm run dev` you can expect to see the following on [localhost:3000](http://localhost:3000):

```shell shouldWrap
PostgreSQL 18.6 (ac70818) on aarch64-unknown-linux-gnu, compiled by gcc (Ubuntu 13.3.0-6ubuntu2~24.04.1) 13.3.0, 64-bit
```

The API route returns the same value as JSON at [localhost:3000/api/test](http://localhost:3000/api/test).

<Admonition type="note">
`npm run dev` loads the `.env` file automatically. The production server does not. To run a production build, set `DATABASE_URL` in your environment, then run `npm run build` and `npm start`. Without the variable, the app fails to connect.
</Admonition>

</Steps>

## Next steps

- [Set up Managed Better Auth](/docs/auth/overview): Add managed authentication that branches with your database
- [Add Object Storage](/docs/storage/overview): S3-compatible file storage that branches with your database
- [Deploy a Function](/docs/compute/functions/overview): Run backend compute next to your database, no separate hosting needed
- [Call an LLM with AI Gateway](/docs/ai-gateway/overview): Access foundation models from Anthropic, OpenAI, Google, and more with one credential

<NeedHelp/>
