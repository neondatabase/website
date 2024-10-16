---
title: Connect Astro to Postgres on Neon
subtitle: Learn how to make server-side queries to Postgres from .astro files or API
  routes.
enableTableOfContents: true
updatedOn: '2024-10-08T12:17:44.852Z'
---

Astro builds fast content sites, powerful web applications, dynamic server APIs, and everything in-between. This guide describes how to create a Neon Postgres database and access it from an Astro site or application.

To create a Neon project and access it from an Astro site or application:

1. [Create a Neon project](#create-a-neon-project)
2. [Create an Astro project and add dependencies](#create-an-astro-project-and-add-dependencies)
3. [Configure a Postgres client](#configure-the-postgres-client)
4. [Run the app](#run-the-app)

## Create a Neon project

If you do not have one already, create a Neon project. Save your connection details including your password. They are required when defining connection settings.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Create an Astro project and add dependencies

1. Create an Astro project if you do not have one. For instructions, see [Getting Started](https://docs.astro.build/en/getting-started/), in the Astro documentation.

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

Add a `.env` file to your project directory and add your Neon connection string to it. You can find the connection string for your database in the **Connection Details** widget on the Neon **Dashboard**. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

```shell shouldWrap
DATABASE_URL="postgresql://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require"
```

## Configure the Postgres client

There a multiple ways to make server side requests with Astro. See below for the different implementations.

### .astro files

In your `.astro` files, use the following code snippet to connect to your Neon database:

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```astro
---
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: import.meta.env.DATABASE_URL,
  ssl: true
});

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
import postgres from 'postgres';

const sql = postgres(import.meta.env.DATABASE_URL, { ssl: 'require' });

const response = await sql`SELECT version()`;
const data = response[0].version;
---

{data}
```

```astro
---
import { neon } from '@neondatabase/serverless';

const sql = neon(import.meta.env.DATABASE_URL);

const response = await sql`SELECT version()`;
const data = response[0].version;
---

{data}
```

</CodeTabs>

#### Run the app

When you run `npm run dev` you can expect to see the following when you visit [localhost:4321](localhost:4321):

```shell shouldWrap
PostgreSQL 16.0 on x86_64-pc-linux-gnu, compiled by gcc (Debian 10.2.1-6) 10.2.1 20210110, 64-bit
```

### Server Endpoints (API Routes)

In your server endpoints (API Routes) in Astro application, use the following code snippet to connect to your Neon database:

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```javascript
// File: src/pages/api/index.ts

import { Pool } from 'pg';

const pool = new Pool({
  connectionString: import.meta.env.DATABASE_URL,
  ssl: true,
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
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
}
```

```javascript
// File: src/pages/api/index.ts

import postgres from 'postgres';

export async function GET() {
  const sql = postgres(import.meta.env.DATABASE_URL, { ssl: 'require' });
  const response = await sql`SELECT version()`;
  return new Response(JSON.stringify(response[0]), {
    headers: { 'Content-Type': 'application/json' },
  });
}
```

```javascript
// File: src/pages/api/index.ts

import { neon } from '@neondatabase/serverless';

export async function GET() {
  const sql = neon(import.meta.env.DATABASE_URL);
  const response = await sql`SELECT version()`;
  return new Response(JSON.stringify(response[0]), {
    headers: { 'Content-Type': 'application/json' },
  });
}
```

</CodeTabs>

#### Run the app

When you run `npm run dev` you can expect to see the following when you visit the [localhost:4321/api](localhost:4321/api) route:

```shell shouldWrap
{ version: 'PostgreSQL 16.0 on x86_64-pc-linux-gnu, compiled by gcc (Debian 10.2.1-6) 10.2.1 20210110, 64-bit' }
```

## Source code

You can find the source code for the applications described in this guide on GitHub.

<DetailIconCards>

<a href="https://github.com/neondatabase/examples/tree/main/with-astro" description="Get started with Astro and Neon" icon="github">Get started with Astro and Neon</a>

<a href="https://github.com/neondatabase/examples/tree/main/with-astro-api-routes" description="Get started with Astro API Routes and Neon" icon="github">Get started with Astro API Routes and Neon</a>

</DetailIconCards>

<NeedHelp/>
