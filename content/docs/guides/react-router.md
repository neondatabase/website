---
title: Connect a React Router application to Neon
subtitle: Set up a Neon project in seconds and connect from a React Router application
summary: >-
  Step-by-step guide for connecting a React Router application to a Neon
  project, including project creation, dependency installation, and
  configuration of the Postgres client using a server-side `loader` function.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:33.036Z'
---

[React Router](https://reactrouter.com/home) is a powerful routing library for React that also includes modern, full-stack framework features. This guide explains how to connect a React Router application to Neon using a server-side `loader` function.

To create a Neon project and access it from a React Router application:

<Steps>

## Create a Neon project

If you do not have one already, create a Neon project. Save your connection details including your password. They are required when defining connection settings.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Create a React Router project and add dependencies

1. Create a React Router project using the following command:

   ```shell
   npx create-react-router@latest with-react-router --yes
   cd with-react-router
   ```

2. Add project dependencies using one of the following commands.

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

Add a `.env` file to your project's root directory and add your Neon connection string to it. You can find the connection string for your database by clicking the **Connect** button on your **Project Dashboard**. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

```shell shouldWrap
DATABASE_URL="postgresql://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require&channel_binding=require"
```

## Configure the Postgres client

With React Router, data fetching is handled in "Route Modules". We will create a new route that connects to Neon in its `loader` function, which runs on the server.

### 1. Define the route

First, define a new route in `app/routes.ts`. This tells React Router to render our new component when a user visits the `/version` path.

```typescript {5} filename=app/routes.ts
import { type RouteConfig, route, index } from '@react-router/dev/routes';

export default [
  index('./home.tsx'),
  route('version', './routes/version.tsx'),
] satisfies RouteConfig;
```

### 2. Create the route module

Create a new file at `app/routes/version.tsx`. This file will contain both the server-side data loader and the client-side React component. The `loader` function will connect to Neon, query the database version, and pass the result to the `Component` via the `loaderData` prop.

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```tsx filename=app/routes/version.tsx
import { Pool } from 'pg';
import type { Route } from './+types/version';

// The loader function runs on the server
export async function loader() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT version()');
    return { version: rows[0].version };
  } finally {
    client.release();
    await pool.end();
  }
}

// The component runs in the browser
export default function Version({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <h1>Database Version</h1>
      <p>{loaderData.version}</p>
    </div>
  );
}
```

```tsx filename=app/routes/version.tsx
import postgres from 'postgres';
import type { Route } from './+types/version';

// The loader function runs on the server
export async function loader() {
  const sql = postgres(process.env.DATABASE_URL as string);
  const response = await sql`SELECT version()`;
  return { version: response[0].version };
}

// The component runs in the browser
export default function Version({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <h1>Database Version</h1>
      <p>{loaderData.version}</p>
    </div>
  );
}
```

```tsx filename=app/routes/version.tsx
import { neon } from '@neondatabase/serverless';
import type { Route } from './+types/version';

// The loader function runs on the server
export async function loader() {
  const sql = neon(process.env.DATABASE_URL as string);
  const response = await sql`SELECT version()`;
  return { version: response[0].version };
}

// The component runs in the browser
export default function Version({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <h1>Database Version</h1>
      <p>{loaderData.version}</p>
    </div>
  );
}
```

</CodeTabs>

## Run the app

### Generate types

Run the following command to generate types for your routes:

```shell
npm run typecheck
```

### Start the development server

With the types generated, start the development server:

```shell
npm run dev
```

Now, navigate to [http://localhost:5173/version](http://localhost:5173/version) in your browser. You should see a page displaying the version of your Neon Postgres database.

```text shouldWrap
Database Version
PostgreSQL 17.5 (6bc9ef8) on aarch64-unknown-linux-gnu, compiled by gcc (Debian 12.2.0-14+deb12u1) 12.2.0, 64-bit
```

</Steps>

## Source code

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>

<a href="https://github.com/neondatabase/examples/tree/main/with-react-router" description="Get started with React Router and Neon" icon="github">Get started with React Router and Neon</a>

</DetailIconCards>

<NeedHelp/>
