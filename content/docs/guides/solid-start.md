---
title: Connect a SolidStart application to Neon
subtitle: Set up a Neon project in seconds and connect from a SolidStart application
enableTableOfContents: true
updatedOn: '2024-08-07T21:36:52.665Z'
tag: new
---

SolidStart is an open-source meta-framework designed to integrate the components that make up a web application.<sup><a target="_blank" href="https://docs.solidjs.com/solid-start#overview">1</a></sup>. This guide explains how to connect SolidStart with Neon using a secure server-side request.

To create a Neon project and access it from a SolidStart application:

1. [Create a Neon project](#create-a-neon-project)
2. [Create a SolidStart project and add dependencies](#create-a-solidstart-project-and-add-dependencies)
3. [Configure a Postgres client](#configure-the-postgres-client)
4. [Run the app](#run-the-app)

## Create a Neon project

If you do not have one already, create a Neon project. Save your connection details including your password. They are required when defining connection settings.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Create a SolidStart project and add dependencies

1. Create a SolidStart project if you do not have one. For instructions, see [Quick Start](https://docs.solidjs.com/solid-start/getting-started), in the SolidStart documentation.

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

There a multiple ways to make server-side requests with SolidStart. See below for the different implementations.

### Server-Side Data Loading

To [load data on the server](https://docs.solidjs.com/solid-start/building-your-application/data-loading#data-loading-always-on-the-server) in SolidStart, add the following code snippet to connect to your Neon database:

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```typescript
import pg from 'pg';
import { createAsync } from "@solidjs/router";

const getVersion = async () => {
    "use server";
    const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
    });
    const client = await pool.connect();
    const response = await client.query('SELECT version()');
    return response.rows[0].version;
}

export const route = {
  load: () => getVersion(),
};

export default function Page() {
  const version = createAsync(() => getVersion());
  return <>{version()}</>;
}
```

```typescript
import postgres from 'postgres';
import { createAsync } from "@solidjs/router";

const getVersion = async () => {
    "use server";
    const sql = postgres(import.meta.env.DATABASE_URL, { ssl: 'require' });
    const response = await sql`SELECT version()`;
    return response[0].version;
}

export const route = {
  load: () => getVersion(),
};

export default function Page() {
  const version = createAsync(() => getVersion());
  return <>{version()}</>;
}
```

```typescript
import { neon } from "@neondatabase/serverless";
import { createAsync } from "@solidjs/router";

const getVersion = async () => {
    "use server";
    const sql = neon(`${process.env.DATABASE_URL}`);
    const response = await sql`SELECT version()`;
    const { version } = response[0];
    return version;
}

export const route = {
  load: () => getVersion(),
};

export default function Page() {
  const version = createAsync(() => getVersion());
  return <>{version()}</>;
}
```

</CodeTabs>

### Server Endpoints (API Routes)

In your server endpoints (API Routes) in your SolidStart application, use the following code snippet to connect to your Neon database:

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```javascript
// File: routes/api/test.ts

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
// File: routes/api/test.ts

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
// File: routes/api/test.ts

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

## Run the app

When you run `npm run dev` you can expect to see the following on [localhost:3000](localhost:3000):

```shell shouldWrap
PostgreSQL 16.0 on x86_64-pc-linux-gnu, compiled by gcc (Debian 10.2.1-6) 10.2.1 20210110, 64-bit
```

## Source code

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>

<a href="https://github.com/neondatabase/examples/tree/main/with-solid-start" description="Get started with SolidStart and Neon" icon="github">Get started with SolidStart and Neon</a>

</DetailIconCards>

<NeedHelp/>
