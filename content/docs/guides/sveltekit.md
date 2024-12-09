---
title: Connect a Sveltekit application to Neon
subtitle: Set up a Neon project in seconds and connect from a Sveltekit application
enableTableOfContents: true
tag: new
updatedOn: '2024-11-28T11:50:49.804Z'
---

Sveltekit is a modern JavaScript framework that compiles your code to tiny, framework-less vanilla JS. This guide explains how to connect Sveltekit with Neon using a secure server-side request.

To create a Neon project and access it from a Sveltekit application:

1. [Create a Neon project](#create-a-neon-project)
2. [Create a Sveltekit project and add dependencies](#create-a-sveltekit-project-and-add-dependencies)
3. [Configure a Postgres client](#configure-the-postgres-client)
4. [Run the app](#run-the-app)

## Create a Neon project

If you do not have one already, create a Neon project. Save your connection details including your password. They are required when defining connection settings.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Create a Sveltekit project and add dependencies

1. Create a Sveltekit project using the following commands:

   ```shell
   npx sv create my-app --template minimal --no-add-ons --types ts
   cd my-app
   ```

2. Add project dependencies using one of the following commands:

   <CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

   ```shell
   npm install pg dotenv
   ```

   ```shell
   npm install postgres dotenv
   ```

   ```shell
   npm install @neondatabase/serverless dotenv
   ```

   </CodeTabs>

## Store your Neon credentials

Add a `.env` file to your project directory and add your Neon connection string to it. You can find the connection string for your database in the **Connection Details** widget on the Neon **Dashboard**. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

```shell shouldWrap
DATABASE_URL="postgresql://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require"
```

## Configure the Postgres client

There are two parts to connecting a SvelteKit application to Neon. The first is `db.server.ts`, which contains the database configuration. The second is the server-side route where the connection to the database will be used.

### db.server

Create a `db.server.ts` file at the root of your `/src` directory and add the following code snippet to connect to your Neon database:

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```typescript
import 'dotenv/config';
import pg from 'pg';

const connectionString: string = process.env.DATABASE_URL as string;

const pool = new pg.Pool({
  connectionString,
  ssl: true,
});

export { pool };
```

```typescript
import 'dotenv/config';
import postgres from 'postgres';

const connectionString: string = process.env.DATABASE_URL as string;

const sql = postgres(connectionString, { ssl: 'require' });

export { sql };
```

```typescript
import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const connectionString: string = process.env.DATABASE_URL as string;

const sql = neon(connectionString);
export { sql };
```

</CodeTabs>

### route

Create a `+page.server.ts` file in your route directory and import the database configuration:

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

### Page Component

Create a `+page.svelte` file to display the data:

```svelte
<script>
    export let data;
</script>

<h1>Database Version</h1>
<p>{data.version}</p>
```

## Run the app

When you run `npm run dev` you can expect to see the following on [localhost:5173](localhost:5173):

```shell shouldWrap
Database Version
PostgreSQL 17.2 on x86_64-pc-linux-gnu, compiled by gcc (Debian 12.2.0-14) 12.2.0, 64-bit
```

## Source code

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>

<a href="https://github.com/neondatabase/examples/tree/main/with-sveltekit" description="Get started with Sveltekit and Neon" icon="github">Get started with Sveltekit and Neon</a>

</DetailIconCards>

<NeedHelp/>
