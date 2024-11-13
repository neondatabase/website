---
title: Connect SvelteKit to Postgres on Neon
subtitle: Learn how to make server-side queries to Postgres from SvelteKit endpoints or server-side components
enableTableOfContents: true
updatedOn: '2024-10-08T12:17:44.852Z'
---

SvelteKit is a modern framework for building fast and dynamic web applications. This guide describes how to create a Neon Postgres database and access it from a SvelteKit application.

To create a Neon project and access it from an Astro site or application:

1. [Create a Neon project](#create-a-neon-project)
2. [Create SvelteKit project and add dependencies](#create-an-astro-project-and-add-dependencies)
3. [Configure a Postgres client](#configure-the-postgres-client)
4. [Run the app](#run-the-app)

## Create a Neon project

If you do not have one already, create a Neon project. Save your connection details, including your password. They are required when defining connection settings.

If you do not have one already, create a Neon project. Save your connection details including your password. They are required when defining connection settings.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Create a SvelteKit project and add dependencies

### Create a SvelteKit project

If you do not have a SvelteKit project, create one using the following commands:

```bash
# Create a new SvelteKit project
npm create svelte@latest my-svelte-app

# Navigate into the project directory
cd my-svelte-app

# Install dependencies
npm install
```

Follow the prompts to set up your project as desired.

### Add project dependencies

Choose one of the following Postgres clients and install it:

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

Add a `.env` file to your project directory and add your Neon connection string to it. You can find the connection string for your database in the **Connection Details** widget on the Neon **Dashboard**. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

```shell shouldWrap
DATABASE_URL="postgresql://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require"
```

## Configure the Postgres client

In SvelteKit, you can make server-side requests in endpoints (src/routes) or in server-side scripts. Below are implementations using different Postgres clients.

Using the Neon serverless driver
Create an endpoint to connect to your Neon database.

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```javascript
import { Pool } from 'pg';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export const GET: RequestHandler = async () => {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT version()');
    return new Response(JSON.stringify(res.rows[0]), {
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    client.release();
  }
};
```

```javascript
import postgres from 'postgres';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  const sql = postgres(env.DATABASE_URL, { ssl: 'require' });
  const response = await sql`SELECT version()`;
  return new Response(JSON.stringify(response[0]), {
    headers: { 'Content-Type': 'application/json' },
  });
};
```

```javascript
import { neon } from '@neondatabase/serverless';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  const sql = neon(env.DATABASE_URL);
  const response = await sql`SELECT version()`;
  return new Response(JSON.stringify(response[0]), {
    headers: { 'Content-Type': 'application/json' },
  });
};
```

## Run the app

Start your development server:

```bash
npm run dev
```

When you visit http://localhost:5173/api/version in your browser, you can expect to see output similar to:

```json
{
  "version": "PostgreSQL 16.0 on x86_64-pc-linux-gnu, compiled by gcc (Debian 10.2.1-6) 10.2.1 20210110, 64-bit"
}
```

## Server-Side Rendering (SSR) with SvelteKit

You can also fetch data from your Neon database in server-side load functions.

Using the Neon serverless driver in a page
File: src/routes/+page.server.ts

```typescript
import { neon } from '@neondatabase/serverless';
import { env } from '$env/dynamic/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const sql = neon(env.DATABASE_URL);
  const response = await sql`SELECT version()`;
  return {
    version: response[0].version,
  };
};
```

**File:** `src/routes/+page.svelte`

```html
<script>
  export let data;
</script>

<h1>PostgreSQL Version</h1>
<p>{data.version}</p>
```

## Run the app

Visit http://localhost:5173/ to see the PostgreSQL version displayed on the page.

## Conclusion

You have successfully connected your SvelteKit application to a Neon Postgres database and performed server-side queries. You can now build dynamic applications using SvelteKit and Neon.

Feel free to explore more features of SvelteKit and Neon to enhance your application.

</CodeTabs>

<NeedHelp/>
