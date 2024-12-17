---
title: Connect a Next.js application to Neon
subtitle: Set up a Neon project in seconds and connect from a Next.js application
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/vercel
  - /docs/integrations/vercel
updatedOn: '2024-10-25T10:38:21.887Z'
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

Add a `.env` file to your project directory and add your Neon connection string to it. You can find the connection string for your database in the **Connection Details** widget on the Neon **Dashboard** and add a pooler flag to the connection string. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

```shell shouldWrap
DATABASE_URL="postgresql://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require"
```

## Configure the Postgres client

There are multiple ways to make server side requests with Next.js. See below for the different implementations.

### App Router

There are two methods for fetching and mutating data using server-side requests in Next.js App Router, they are:

1. `Server Components` fetches data at runtime on the server.
2. `Server Actions` functions executed on the server to perform data mutations.

#### Server Components

In your server components using the App Router, add the following code snippet to connect to your Neon database:

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```javascript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

async function getData() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT version()');
    return rows[0].version;
  } finally {
    client.release();
  }
}

export default async function Page() {
  const data = await getData();
  return <>{data}</>;
}
```

```javascript
import postgres from 'postgres';

async function getData() {
  const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });
  const response = await sql`SELECT version()`;
  return response[0].version;
}

export default async function Page() {
  const data = await getData();
  return <>{data}</>;
}
```

```javascript
import { neon } from '@neondatabase/serverless';

async function getData() {
  const sql = neon(process.env.DATABASE_URL);
  const response = await sql`SELECT version()`;
  return response[0].version;
}

export default async function Page() {
  const data = await getData();
  return <>{data}</>;
}
```

</CodeTabs>

#### Server Actions

In your server actions using the App Router, add the following code snippet to connect to your Neon database:

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```javascript
import { Pool } from 'pg';

export default async function Page() {
  async function create(formData: FormData) {
    "use server";
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: true
    });
    const client = await pool.connect();
    await client.query("CREATE TABLE IF NOT EXISTS comments (comment TEXT)");
    const comment = formData.get("comment");
    await client.query("INSERT INTO comments (comment) VALUES ($1)", [comment]);
  }
  return (
    <form action={create}>
      <input type="text" placeholder="write a comment" name="comment" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

```javascript
import postgres from 'postgres';

export default async function Page() {
  async function create(formData: FormData) {
    "use server";
    const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });
    await sql`CREATE TABLE IF NOT EXISTS comments (comment TEXT)`;
    const comment = formData.get("comment");
    await sql`INSERT INTO comments (comment) VALUES (${comment})`;
  }
  return (
    <form action={create}>
      <input type="text" placeholder="write a comment" name="comment" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

```javascript
import { neon } from '@neondatabase/serverless';

export default async function Page() {
  async function create(formData: FormData) {
    "use server";
    const sql = neon(process.env.DATABASE_URL);
    await sql`CREATE TABLE IF NOT EXISTS comments (comment TEXT)`;
    const comment = formData.get("comment");
    await sql("INSERT INTO comments (comment) VALUES ($1)", [comment]);
  }
  return (
    <form action={create}>
      <input type="text" placeholder="write a comment" name="comment" />
      <button type="submit">Submit</button>
    </form>
  );
}

```

</CodeTabs>

### Pages Router

There are two methods for fetching data using server-side requests in Next.js Pages Router, they are:

1. `getServerSideProps` fetches data at runtime so that content is always fresh.
2. `getStaticProps` pre-renders pages at build time for data that is static or changes infrequently.

#### getServerSideProps

From `getServerSideProps` using the Pages Router, add the following code snippet to connect to your Neon database:

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```javascript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

export async function getServerSideProps() {
  const client = await pool.connect();
  try {
    const response = await client.query('SELECT version()');
    return { props: { data: response.rows[0].version } };
  } finally {
    client.release();
  }
}

export default function Page({ data }) {
  return <>{data}</>;
}
```

```javascript
import postgres from 'postgres';

export async function getServerSideProps() {
  const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });
  const response = await sql`SELECT version()`;
  return { props: { data: response[0].version } };
}

export default function Page({ data }) {
  return <>{data}</>;
}
```

```javascript
import { neon } from '@neondatabase/serverless';

export async function getServerSideProps() {
  const sql = neon(process.env.DATABASE_URL);
  const response = await sql`SELECT version()`;
  return { props: { data: response[0].version } };
}

export default function Page({ data }) {
  return <>{data}</>;
}
```

</CodeTabs>

#### getStaticProps

From `getStaticProps` using the Pages Router, add the following code snippet to connect to your Neon database:

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```javascript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

export async function getStaticProps() {
  const client = await pool.connect();
  try {
    const response = await client.query('SELECT version()');
    return { props: { data: response.rows[0].version } };
  } finally {
    client.release();
  }
}

export default function Page({ data }) {
  return <>{data}</>;
}
```

```javascript
import postgres from 'postgres';

export async function getStaticProps() {
  const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });
  const response = await sql`SELECT version()`;
  return { props: { data: response[0].version } };
}

export default function Page({ data }) {
  return <>{data}</>;
}
```

```javascript
import { neon } from '@neondatabase/serverless';

export async function getStaticProps() {
  const sql = neon(process.env.DATABASE_URL);
  const response = await sql`SELECT version()`;
  return { props: { data: response[0].version } };
}

export default function Page({ data }) {
  return <>{data}</>;
}
```

</CodeTabs>

### Serverless Functions

From your Serverless Functions, add the following code snippet to connect to your Neon database:

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```javascript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

export default async function handler(req, res) {
  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT version()');
    const { version } = rows[0];
    res.status(200).json({ version });
  } finally {
    client.release();
  }
}
```

```javascript
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

export default async function handler(req, res) {
  const response = await sql`SELECT version()`;
  const { version } = response[0];
  res.status(200).json({ version });
}
```

```javascript
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  const response = await sql`SELECT version()`;
  const { version } = response[0];
  res.status(200).json({ version });
}
```

</CodeTabs>

### Edge Functions

From your Edge Functions, add the following code snippet and connect to your Neon database using the [Neon serverless driver](/docs/serverless/serverless-driver):

```javascript
export const config = {
  runtime: 'edge',
};

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  const response = await sql`SELECT version()`;
  const { version } = response[0];
  return Response.json({ version });
}
```

## Run the app

When you run `npm run dev` you can expect to see the following on [localhost:3000](localhost:3000):

```shell shouldWrap
PostgreSQL 16.0 on x86_64-pc-linux-gnu, compiled by gcc (Debian 10.2.1-6) 10.2.1 20210110, 64-bit
```

## Source code

You can find the source code for the applications described in this guide on GitHub.

<DetailIconCards>

<a href="https://github.com/neondatabase/examples/tree/main/with-nextjs-edge-functions" description="Get started with Next.js Edge Functions and Neon" icon="github">Get started with Next.js Edge Functions and Neon</a>

<a href="https://github.com/neondatabase/examples/tree/main/with-nextjs-serverless-functions" description="Get started with Next.js Serverless Functions and Neon" icon="github">Get started with Next.js Serverless Functions and Neon</a>

<a href="https://github.com/neondatabase/examples/tree/main/with-nextjs-get-server-side-props" description="Get started with Next.js getServerSideProps and Neon" icon="github">Get started with Next.js getServerSideProps and Neon</a>

<a href="https://github.com/neondatabase/examples/tree/main/with-nextjs-get-static-props" description="Get started with Next.js getStaticProps and Neon" icon="github">Get started with Next.js getStaticProps and Neon</a>

<a href="https://github.com/neondatabase/examples/tree/main/with-nextjs-server-actions" description="Get started with Next.js Server Actions and Neon" icon="github">Get started with Next.js Server Actions and Neon</a>

<a href="https://github.com/neondatabase/examples/tree/main/with-nextjs-server-components" description="Get started with Next.js Server Components and Neon" icon="github">Get started with Next.js Server Components and Neon</a>

</DetailIconCards>

<NeedHelp/>
