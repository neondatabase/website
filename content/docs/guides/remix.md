---
title: Connect a Remix application to Neon
subtitle: Set up a project on Neon in seconds and connect from a Remix application
summary: >-
  Connecting an existing Remix v2 application to Lakebase Postgres requires a
  server-side `db.server` file that holds the database connection, preventing
  credentials from leaking into the client bundle. This guide walks through
  creating a project on Neon, storing the DATABASE_URL in `.env`, and wiring up a
  loader route using node-postgres, postgres.js, or the Neon serverless driver.
enableTableOfContents: true
updatedOn: '2026-10-08T19:32:04.700Z'
---

<Admonition type="note">
Remix v2 is now part of React Router and is in maintenance mode. This guide covers existing Remix v2 applications. If you are starting a new project, use React Router instead. Follow our [React Router guide](/docs/guides/react-router) to connect to Neon.

For more information, see the [Remix announcement](https://remix.run/blog/merging-remix-and-react-router).
</Admonition>

Remix is an open-source full stack JavaScript framework that lets you focus on building out the user interface using familiar web standards. This guide explains how to connect Remix with Lakebase Postgres using a secure server-side request.

To create a project on Neon and access it from a Remix application:

<Steps>

## Create a Neon project

If you do not have one already, create a Neon project. Save your connection details including your password. They are required when defining connection settings.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Add dependencies to your Remix project

1. Open your existing Remix v2 project in a terminal. The `~/` import path in this guide maps to the `app` directory in the default Remix template.

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

There are two parts to connecting a Remix application to Neon. The first is `db.server`. Remix ensures any code added to this file isn't included in the client bundle. The second is the route where the connection to the database is used.

### db.server

Create a `db.server.ts` file at the root of your `app` directory and add the following code snippet to connect to your Neon database:

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```typescript filename="app/db.server.ts"
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export { pool };
```

```typescript filename="app/db.server.ts"
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!, { ssl: 'require' });

export { sql };
```

```typescript filename="app/db.server.ts"
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export { sql };
```

</CodeTabs>

### Create a route

Create a file named `app/routes/version.tsx`. Remix maps this file to the `/version` path. The `loader` function runs on the server, so the database call stays out of the browser bundle.

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```typescript filename="app/routes/version.tsx"
import { useLoaderData } from '@remix-run/react';
import { pool } from '~/db.server';

export const loader = async () => {
  const client = await pool.connect();
  try {
    const response = await client.query('SELECT version()');
    return response.rows[0].version;
  } finally {
    client.release();
  }
};

export default function Page() {
  const data = useLoaderData<typeof loader>();
  return <>{data}</>;
}
```

```typescript filename="app/routes/version.tsx"
import { useLoaderData } from '@remix-run/react';
import { sql } from '~/db.server';

export const loader = async () => {
  const response = await sql`SELECT version()`;
  return response[0].version;
};

export default function Page() {
  const data = useLoaderData<typeof loader>();
  return <>{data}</>;
}
```

```typescript filename="app/routes/version.tsx"
import { useLoaderData } from '@remix-run/react';
import { sql } from '~/db.server';

export const loader = async () => {
  const response = await sql`SELECT version()`;
  return response[0].version;
};

export default function Page() {
  const data = useLoaderData<typeof loader>();
  return <>{data}</>;
}
```

</CodeTabs>

## Run the app

Start the development server:

```shell
npm run dev
```

Open [localhost:5173/version](http://localhost:5173/version) in your browser. Vite serves the app on port 5173 in development. You should see output similar to the following:

```text shouldWrap
PostgreSQL 18.6 (ac70818) on aarch64-unknown-linux-gnu, compiled by gcc (Ubuntu 13.3.0-6ubuntu2~24.04.1) 13.3.0, 64-bit
```

<Admonition type="note">
`npm run dev` loads the `.env` file automatically. The production server does not. To run a production build, set `DATABASE_URL` in your environment, then run `npm run build` and `npm start`. The server listens on [localhost:3000](http://localhost:3000). Without the variable, the app fails to connect.
</Admonition>

</Steps>

## Next steps

- [Set up Managed Better Auth](/docs/auth/overview): Add managed authentication that branches with your database
- [Add Object Storage](/docs/storage/overview): S3-compatible file storage that branches with your database
- [Deploy a Function](/docs/compute/functions/overview): Run backend compute next to your database, no separate hosting needed
- [Call an LLM with AI Gateway](/docs/ai-gateway/overview): Access foundation models from Anthropic, OpenAI, Google, and more with one credential
- [Realtime](/docs/realtime/sdks/typescript#react): Build realtime React apps on Neon with end-to-end reactivity and type-safety &raquo;

<NeedHelp/>
