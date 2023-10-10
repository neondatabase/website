---
title: Connect a Next.js application to Neon
subtitle: Set up a Neon project in seconds and connect from a Next.js application
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/vercel
  - /docs/integrations/vercel
updatedOn: '2023-10-10T08:41:39.905Z'
---

Next.js by Vercel is an open-source web development framework that enables React-based web applications. This topic describes how to create a Neon project and access it from a Next.js application.

To create a Neon project and access it from a Next.js application:

1. [Create a Neon project](#create-a-neon-project)
2. [Create a Next.js project and add dependencies](#create-a-nextjs-project-and-add-dependencies)
3. [Configure a Postgres client](#configure-the-postgres-client)
4. [Run the app](#run-the-app)

## Create a Neon project

If you do not have one already, create a Neon project. Save your connection details including your password. They are required when defining connection settings.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Create a Next.js project and add dependencies

1. Create a Next.js project if you do not have one. For instructions, see [Create a Next.js App](https://nextjs.org/learn/basics/create-nextjs-app/setup), in the Vercel documentation.

2. Add project dependencies using one of the following commands:

    <CodeTabs labels={["node-postgres", "postgres.js"]}>

      ```shell
      npm install pg
      ```

      ```shell
      npm install postgres
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

There a multiple ways to make server side requests with Next.js. See below for the different implementations.

### App Router

From your server functions using the App Router, add the following code snippet to connect to your Neon database:

<CodeTabs labels={["node-postgres", "postgres.js"]}>

```javascript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
  },
});

async function getData() {
  const client = await pool.connect();

  try {
    const response = await client.query('SELECT version()');
    console.log(response.rows[0]);
    return response.rows[0];
  } finally {
    client.release();
  }
}

export default async function Page() {
  const data = await getData();
}
```

```javascript
import postgres from 'postgres';

async function getData() {
  const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

  const response = await sql`select version()`;
  console.log(response);
  return response;
}

export default async function Page() {
  const data = await getData();
}
```

</CodeTabs>

### Pages Router

From your server functions using the Pages Router, add the following code snippet to connect to your Neon database:

<CodeTabs labels={["node-postgres", "postgres.js"]}>

```javascript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
  },
});

export async function getServerSideProps() {
  const client = await pool.connect();

  try {
    const response = await client.query('SELECT version()');
    console.log(response.rows[0]);
    return { props: { data: response.rows[0] } };
  } finally {
    client.release();
  }
}

export default function Page({ data }) {}
```

```javascript
import postgres from 'postgres';

export async function getServerSideProps() {
  const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

  const response = await sql`select version()`;
  console.log(response);
  return { props: { data: response } };
}

export default function Page({ data }) {}

```

</CodeTabs>

### API Routes

From your API handlers, add the following code snippet to connect to your Neon database:

<CodeTabs labels={["node-postgres", "postgres.js"]}>

```javascript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
  },
});

export default async function handler(req, res) {
  const client = await pool.connect();

  try {
    const response = await client.query('SELECT version()');
    console.log(response.rows[0]);
  } finally {
    client.release();
  }
}
```

```javascript
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

export default async function handler(req, res) {
  const response = await sql`select version()`;
  console.log(response);
}
```

</CodeTabs>

## Run the app

For API handlers, and server functions you can expect to see one of the following in your terminal output:

<CodeBlock shouldWrap>

```shell
# node-postgres

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
