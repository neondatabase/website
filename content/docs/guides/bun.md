---
title: Connect a Bun application to Neon
subtitle: Set up a Neon project in seconds and connect from a Bun application
summary: >-
  Step-by-step guide for creating a Neon project and connecting it to a Bun
  application, including examples for using Bun's SQL client and the Neon
  serverless driver.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:32.933Z'
---

<CopyPrompt src="/prompts/bun-prompt.md" description="Pre-built prompt for connecting Bun applications to Neon"/>

This guide describes how to create a Neon project and connect to it from a Bun application. Examples are provided for using [Bun's built-in SQL client](https://bun.sh/docs/api/sql) and the [@neondatabase/serverless](/docs/serverless/serverless-driver) driver. Choose **Connect with neon init** for a quick, guided setup or **Connect manually** for step-by-step instructions.

<Admonition type="note">
The same configuration steps can be used for [Hono](https://hono.dev/docs/getting-started/bun), [Elysia](https://elysiajs.com), and other Bun-based web frameworks.
</Admonition>

<Tabs labels={["Connect with neon init", "Connect manually"]}>

<TabItem>

To connect your Bun app to Neon using AI-assisted setup:

<Steps>

## Create a Bun project

Create a Bun project if you do not have one:

```shell
mkdir bun-neon-example
cd bun-neon-example
bun init -y
```

## Run neon init

1. From your Bun project root, run [`neon init`](/docs/reference/cli-init):

   ```bash
   npx neonctl@latest init
   ```

2. Follow the interactive prompts to sign up for Neon (or log in) and select your editor(s). This installs the AI development tooling for your coding environment:
   - MCP server
   - Agent skills
   - IDE extensions
   - Plugins

3. **Restart your editor** to pick up the new tooling.

## Ask your AI assistant to get started

Open your AI assistant's chat and type:

> Get started with Neon

Your AI assistant will walk you through:

- Creating a database branch in a new or existing Neon project
- Storing the connection string in your project's `.env` file
- Installing the appropriate client libraries
- Configuring your Bun app to connect to Neon
- Setting up [Neon Auth](/docs/auth/overview) for managed authentication, if your app needs it

## Run the app

Run `bun run index.ts` (or `bun index.js`) to view the result.

```shell
$ bun run index.ts
{
  version: "PostgreSQL 17.2 on x86_64-pc-linux-gnu, compiled by gcc (Debian 12.2.0-14) 12.2.0, 64-bit",
}
```

</Steps>

<Admonition type="tip">
For details on what `neon init` creates and how to customize it, see the [CLI init reference](/docs/reference/cli-init).
</Admonition>

</TabItem>

<TabItem>

To create a Neon project and access it from a Bun application:

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

Add a `.env.local` file to your project directory and add your Neon connection details to it. Bun automatically loads variables from `.env`, `.env.local`, and other `.env.*` files. You can find the connection details for your database by clicking the **Connect** button on your **Project Dashboard** to open the **Connect to your database** modal. Select Bun from the **Connection string** dropdown. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

```shell shouldWrap
POSTGRES_URL='postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require'
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

## Run the app

Run `bun run index.ts` (or `bun index.js`) to view the result.

```shell
$ bun run index.ts
{
  version: "PostgreSQL 17.2 on x86_64-pc-linux-gnu, compiled by gcc (Debian 12.2.0-14) 12.2.0, 64-bit",
}
```

## Add authentication (optional)

If your app requires user authentication, Neon provides [Neon Auth](/docs/auth/overview), a managed authentication service that branches with your database.

</Steps>

</TabItem>

</Tabs>

## Source code

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>
<a href="https://github.com/neondatabase/examples/tree/main/with-bun" description="Get started with Bun and Neon" icon="github">Get started with Bun and Neon</a>
</DetailIconCards>

## References

- [Bun SQL client](https://bun.sh/docs/api/sql)
- [@neondatabase/serverless driver](/docs/serverless/serverless-driver)

<NeedHelp/>
