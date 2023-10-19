---
title: Connect an Astro site or application to Neon
subtitle: Set up a Neon project in seconds and connect from an Astro site or application
enableTableOfContents: true
updatedOn: '2023-10-19T20:13:38.482Z'
---

Astro builds fast content sites, powerful web applications, dynamic server APIs, and everything in-between. This topic describes how to create a Neon project and access it from an Astro site or application.


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

    <CodeTabs labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

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

<CodeBlock shouldWrap>

```shell
DATABASE_URL=postgres://[user]:[password]@[neon_hostname]/[dbname]
```

</CodeBlock>

## Configure the Postgres client

From your `.astro` files, add the following code snippet to connect to your Neon database:

<CodeTabs labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```javascript
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
  console.log(response.rows[0]);
  data = response.rows[0]
} finally {
  client.release();
}
---
```

```javascript
---
import postgres from 'postgres';

const sql = postgres(import.meta.env.DATABASE_URL, { ssl: 'require' });

const response = await sql`SELECT version()`;
console.log(response);
---
```

```javascript
---
import { neon } from '@neondatabase/serverless';

const sql = neon(import.meta.env.DATABASE_URL);

const response = await sql`SELECT version()`;
console.log(response);
---
```
</CodeTabs>

## Run the app

When you run `npm run dev` you can expect to see one of the following in your terminal output:

<CodeBlock shouldWrap>

```shell
# node-postgres & Neon serverless driver 

{
  version: 'PostgreSQL 16.0 on x86_64-pc-linux-gnu, compiled by gcc (Debian 10.2.1-6) 10.2.1 20210110, 64-bit'
}

# postgres.js

Result(1) [
  {
    version: 'PostgreSQL 16.0 on x86_64-pc-linux-gnu, compiled by gcc (Debian 10.2.1-6) 10.2.1 20210110, 64-bit'
  }
]
```

</CodeBlock>

## Need help?

Join the [Neon community forum](https://community.neon.tech/) to ask questions or see what others are doing with Neon. [Neon Pro Plan](/docs/introduction/pro-plan) users can open a support ticket from the console. For more detail, see [Getting Support](/docs/introduction/support).
