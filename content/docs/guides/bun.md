---
title: Connect a Bun application to Neon
subtitle: Set up a Neon project in seconds and connect from a Bun application
enableTableOfContents: true
updatedOn: '2025-01-25T00:00:00.000Z'
---

This guide describes how to create a Neon project and connect to it from a Bun application. Examples are provided for using [Bun's built-in SQL client](https://bun.sh/docs/api/sql) and the [@neondatabase/serverless](/docs/serverless/serverless-driver) driver. Use the client you prefer.

<Admonition type="note">
The same configuration steps can be used for [Hono](https://hono.dev/docs/getting-started/bun), [Elysia](https://elysiajs.com), and other Bun-based web frameworks.
</Admonition>

<Steps>

## Create a Neon project

If you do not have one already, create a Neon project.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Create a Bun project and add dependencies

Create a Bun project and change to the newly created directory:

```shell
mkdir bun-neon-example
cd bun-neon-example
bun init -y
```

Next, add project dependencies if you intend to use the Neon serverless driver. Otherwise, Bun's built-in `sql` client is readily available.

<CodeTabs labels={["Bun.sql", "Neon serverless driver"]}>

```shell
# No dependencies needed for Bun's built-in SQL client
```

```shell
bun add @neondatabase/serverless
```

</CodeTabs>

## Store your Neon credentials

Add a `.env.local` file to your project directory and add your Neon connection details to it. Bun automatically loads variables from `.env`, `.env.local`, and other `.env.*` files. You can find the connection details for your database in the **Connection Details** widget on the Neon **Dashboard**. Please select Bun from the **Connection string** dropdown. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

```shell shouldWrap
POSTGRES_URL='postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require'
```

<Admonition type="note">
`Bun.sql` uses `POSTGRES_URL` as the default environment variable for the Primary connection URL for Postgres
</Admonition>

<Admonition type="important">
To ensure the security of your data, never expose your Neon credentials directly in your code or commit them to version control.
</Admonition>

## Configure the Postgres client

Add an `index.ts` file (or `index.js`) to your project directory and add the following code snippet to connect to your Neon database. Choose the configuration that matches your preferred client.

<CodeTabs labels={["Bun.sql", "Neon serverless driver"]}>

```typescript
import { sql } from 'bun';

async function getPgVersion() {
  const result = await sql`SELECT version()`;
  console.log(result[0]);
}

getPgVersion();
```

```typescript
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.POSTGRES_URL);

async function getPgVersion() {
  const result = await sql`SELECT version()`;
  console.log(result[0]);
}

getPgVersion();
```

</CodeTabs>

## Run index.ts

Run `bun run index.ts` (or `bun index.js`) to view the result.

```shell
$ bun run index.ts
{
  version: "PostgreSQL 17.2 on x86_64-pc-linux-gnu, compiled by gcc (Debian 12.2.0-14) 12.2.0, 64-bit",
}
```

</Steps>

## Source code

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>
<a href="https://github.com/neondatabase/examples/tree/main/with-bun" description="Get started with Bun and Neon" icon="github">Get started with Bun and Neon</a>
</DetailIconCards>

## References

- [Bun SQL client](https://bun.sh/docs/api/sql)
- [@neondatabase/serverless driver](/docs/serverless/serverless-driver)

<NeedHelp/>
