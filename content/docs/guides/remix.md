---
title: Connect a Remix application to Neon
subtitle: Set up a Neon project in seconds and connect from a Remix application
enableTableOfContents: true
updatedOn: '2023-10-06T17:44:14.691Z'
---

Remix is a full stack web framework that lets you focus on the user interface and work back through web standards to deliver a fast, slick, and resilient user experience. People are gonna love using your stuff.


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

TODO. Add explanation for why a `.db.server` file is required.

### db.server

Create a `db.server.ts` file at the root of your `/app` directory add the following code snippet to connect to your Neon database:


<CodeTabs labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

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

<CodeTabs labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```javascript
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { pool } from '~/db.server';

export const loader = async () => {
  const client = await pool.connect();

  try {
    const response = await client.query('SELECT version()');
    console.log(response.rows[0]);
    return json({ data: response.rows[0] });
  } finally {
    client.release();
  }
};

export default function Page() {
  const data = useLoaderData();
}
```

```javascript
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { sql } from '~/db.server';

export const loader = async () => {
  const response = await sql`SELECT version()`;
  console.log(response);
  return json({ data: response });
};

export default function Page() {
  const data = useLoaderData();
}
```

```javascript
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { sql } from '~/db.server';

export const loader = async () => {
  const response = await sql`SELECT version()`;
  console.log(response);
  return json({ data: response });
};

export default function Page() {
  const data = useLoaderData();
}
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

To get help from our support team, open a ticket from the console. Look for the **Support** link in the left sidebar. For more detail, see [Getting Support](/docs/introduction/support). You can also join the [Neon community forum](https://community.neon.tech/) to ask questions or see what others are doing with Neon.
