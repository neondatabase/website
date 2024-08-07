---
title: Connect a Remix application to Neon
subtitle: Set up a Neon project in seconds and connect from a Remix application
enableTableOfContents: true
updatedOn: '2024-08-07T21:36:52.664Z'
---

Remix is an open-source full stack JavaScript framework that lets you focus on building out the user interface using familiar web standards. This guide explains how to connect Remix with Neon using a secure server-side request.

To create a Neon project and access it from a Remix application:

1. [Create a Neon project](#create-a-neon-project)
2. [Create a Remix project and add dependencies](#create-a-remix-project-and-add-dependencies)
3. [Configure a Postgres client](#configure-the-postgres-client)
4. [Run the app](#run-the-app)

## Create a Neon project

If you do not have one already, create a Neon project. Save your connection details including your password. They are required when defining connection settings.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Create a Remix project and add dependencies

1. Create a Remix project if you do not have one. For instructions, see [Quick Start](https://remix.run/docs/en/main/start/quickstart), in the Remix documentation.

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

There are two parts to connecting a Remix application to Neon. The first is `db.server`. Remix will ensure any code added to this file won't be included in the client bundle. The second is the route where the connection to the database will be used.

### db.server

Create a `db.server.ts` file at the root of your `/app` directory and add the following code snippet to connect to your Neon database:

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```javascript
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

export { pool };
```

```javascript
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

export { sql };
```

```javascript
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export { sql };
```

</CodeTabs>

### route

Create a new route in your `app/routes` directory and import the `db.server` file.

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```javascript
import { pool } from '~/db.server';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

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
  const data = useLoaderData();
  return <>{data}</>;
}
```

```javascript
import { sql } from '~/db.server';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

export const loader = async () => {
  const response = await sql`SELECT version()`;
  return response[0].version;
};

export default function Page() {
  const data = useLoaderData();
  return <>{data}</>;
}
```

```javascript
import { sql } from '~/db.server';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

export const loader = async () => {
  const response = await sql`SELECT version()`;
  return response[0].version;
};

export default function Page() {
  const data = useLoaderData();
  return <>{data}</>;
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

<a href="https://github.com/neondatabase/examples/tree/main/with-remix" description="Get started with Remix and Neon" icon="github">Get started with Remix and Neon</a>

</DetailIconCards>

<NeedHelp/>
