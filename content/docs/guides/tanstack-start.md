---
title: Connect a TanStack Start application to Neon
subtitle: Set up a Neon project in seconds and connect from a TanStack Start application
summary: >-
  How to connect a TanStack Start application to a Neon project by creating a
  Neon project, adding necessary dependencies, and configuring connection
  settings with your database credentials.
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/tanstack-start
  - /docs/integrations/tanstack-start
updatedOn: '2026-02-06T22:07:33.058Z'
---

<CopyPrompt src="/prompts/tanstack-start-prompt.md"
description="Pre-built prompt for connecting TanStack Start applications to Neon"/>

TanStack Start is an open-source, fully type-safe web framework for building feature rich React and Solid based applications using the TanStack ecosystem.

To create a Neon project and access it from a Start application:

<Steps>

## Create a Neon project

If you do not have one already, create a Neon project. Save your connection details including your password. They are required when defining connection settings.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Create a Start project and add dependencies

1. Create a Start project if you do not have one. For instructions see the [quick start guides](https://tanstack.com/start/latest), in the [TanStack](https://tanstack.com/) documentation.

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

Add a `.env` file to your project directory and add your Neon connection string to it. You can find your Neon database connection string by clicking the **Connect** button on your **Project Dashboard** to open the **Connect to your database** modal. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

```shell shouldWrap
DATABASE_URL="postgresql://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require&channel_binding=require"
```

If you haven't created a database yet, run the following command to generate a [Neon Instagres DB](https://neon.new/). It will spin up a database instance that you can use for 72 hours, or claim to keep forever.

<CodeTabs labels={["npm", "yarn", "pnpm", "bun", "deno"]}>

```bash
  npm get-db
```

```bash
  yarn dlx get-db
```

```bash
  pnpm get-db
```

```bash
  bunx get-db
```

```bash
  deno run -A get-db
```

</CodeTabs>

## Configure the Postgres client

There are multiple ways to make server side requests with TanStack Start. See below for the different implementations.

### Server Functions

In your server functions, add the following code snippet to connect to your Neon database:

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```typescript filename="src/data/get-neon-data.ts"
import { Pool } from 'pg';
import { createServerFn } from "@tanstack/react-start";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

export const getData = createServerFn({ method: "GET" }).handler(async () => {
  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT version()');
    return rows[0].version;
  } finally {
    client.release();
  }
});
```

```typescript filename="src/data/get-neon-data.ts"
import postgres from 'postgres';
import { createServerFn } from "@tanstack/react-start";

export const getData = createServerFn({ method: "GET" }).handler(async () => {
   const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });
  const response = await sql`SELECT version()`;
  return response[0].version;
});
```

```typescript filename="src/data/get-neon-data.ts"
import { neon } from "@neondatabase/serverless";
import { createServerFn } from "@tanstack/react-start";

export const getData = createServerFn({ method: "GET" }).handler(async () => {
  const sql = neon(process.env.DATABASE_URL);
  const response = await sql`SELECT version()`;

  return response[0].version;
});
```

</CodeTabs>

Then consume the data in your start application, like you would normally, with any other data fetching operation.

```typescript filename="src/routes/index.tsx"
import { createFileRoute } from "@tanstack/react-router";
import { getData } from "../data/get-neon-data.ts";

export const Route = createFileRoute("/")({
  loader: async () => {
    return getData();
  },

  component: RouteComponent,
});

export default function RouteComponent() {
  const data = Route.useLoaderData();

  return <>{data}</>;
}
```

### Static Server Functions

In your static server functions, add the following code snippet to connect to your Neon database:

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```typescript filename="src/data/get-neon-data.ts"
import { Pool } from 'pg';
import { createServerFn } from "@tanstack/react-start";
import { staticFunctionMiddleware } from "@tanstack/start-static-server-functions";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

export const getData = createServerFn({ method: "GET" })
.middleware([staticFunctionMiddleware])
.handler(async () => {
  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT version()');
    return rows[0].version;
  } finally {
    client.release();
  }
});
```

```typescript filename="src/data/get-neon-data.ts"
import postgres from 'postgres';
import { createServerFn } from "@tanstack/react-start";
import { staticFunctionMiddleware } from "@tanstack/start-static-server-functions";

export const getData = createServerFn({ method: "GET" })
.middleware([staticFunctionMiddleware])
.handler(async () => {
  const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });
  const response = await sql`SELECT version()`;
  return response[0].version;
});
```

```typescript filename="src/data/get-neon-data.ts"
import { neon } from "@neondatabase/serverless";
import { createServerFn } from "@tanstack/react-start";
import { staticFunctionMiddleware } from "@tanstack/start-static-server-functions";

export const getData = createServerFn({ method: "GET" })
.middleware([staticFunctionMiddleware])
.handler(async () => {
  const sql = neon(process.env.DATABASE_URL);
  const response = await sql`SELECT version()`;

  return response[0].version;
});
```

</CodeTabs>

Then like before you can consume the data in your components.

_Be aware Static Server Functions are executed at build time, and cached as a static asset for pre-rendering or static generation_.

```typescript filename="src/routes/index.tsx"
import { createFileRoute } from "@tanstack/react-router";
import { getData } from "../data/get-neon-data.ts";

export const Route = createFileRoute("/")({
  loader: async () => {
    return getData();
  },

  component: RouteComponent,
});

export default function RouteComponent() {
  const data = Route.useLoaderData();

  return <>{data}</>;
}
```

## Run the app

When you run `npm run dev` you can expect to see the following on [localhost:3000](http://localhost:3000/):

```shell shouldWrap
PostgreSQL 16.0 on x86_64-pc-linux-gnu, compiled by gcc (Debian 10.2.1-6) 10.2.1 20210110, 64-bit
```

</Steps>

### Where to upload and serve files?

Neon does not provide a built-in file storage service. For managing binary file data (blobs), we recommend a pattern that leverages dedicated, specialized storage services. Follow our guide on [File Storage](/docs/guides/file-storage) to learn more about how to store files in external object storage and file management services and track metadata in Neon.

## Source code

You can find the source code for the applications described in this guide on GitHub.

<DetailIconCards>
<a href="https://github.com/neondatabase/examples/tree/main/with-tanstack-start-server-functions" description="Get started with TanStack Start Server Functions and Neon" icon="github">Get started with TanStack Start Server Functions and Neon</a>

<a href="https://github.com/neondatabase/examples/tree/main/with-tanstack-start-static-server-functions" description="Get started with TanStack Start Static Server Functions and Neon" icon="github">Get started with TanStack Start Static Server Functions and Neon</a>
</DetailIconCards>

<NeedHelp/>
