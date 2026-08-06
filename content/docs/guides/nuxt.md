---
title: Connect Nuxt to Postgres on Neon
subtitle: Learn how to make server-side queries to Postgres using Nitro API routes
summary: >-
  Connect Nuxt (Vue meta-framework) to serverless Postgres on Neon: use the Neon
  CLI to create the project and pull DATABASE_URL into your .env, then run SQL
  from a Nitro server route with the Neon serverless driver. Choose this guide
  when building a full-stack Nuxt app that needs server-side Postgres queries,
  covering CLI setup, driver selection (Neon serverless driver, node-postgres,
  or postgres.js), and reading the connection string in server code.
enableTableOfContents: true
updatedOn: '2026-08-11T21:10:25.139Z'
---

<CopyPrompt src="/prompts/nuxt-neon-prompt.md"
description="Pre-built prompt for connecting Nuxt applications to Neon."/>

[Nuxt](https://nuxt.com/) is an open-source full-stack meta framework that enables Vue-based web applications. This topic describes how to connect a Nuxt application to a Postgres database on Neon.

To create a Neon project and access it from a Nuxt.js application:

<Steps>

## Create a Neon project

Create a Neon project with the [Neon CLI](/docs/cli/install) or the Console.

<Tabs labels={["Neon CLI", "Console"]}>

<TabItem>

Install the CLI (`npm i -g neon`), then sign in and create the project:

```bash filename="Terminal"
neon auth
neon projects create --name my-app
```

You'll link this project and pull its credentials in a later step.

</TabItem>

<TabItem>

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

</TabItem>

</Tabs>

## Create a Nuxt project and add dependencies

1. Create a Nuxt project if you do not have one, then change into its directory. `npm create nuxt@latest my-app && cd my-app` scaffolds a new app and enters it; see [Create a Nuxt Project](https://nuxt.com/docs/getting-started/installation#new-project) for details. The CLI commands in the next step run from this directory.

2. Add a Postgres driver. This guide's examples use the Neon serverless driver, which suits serverless and edge deployments; for long-lived servers, `pg` or `postgres.js` are recommended. See [Choosing your connection method](/docs/connect/choose-connection).

   <CodeTabs labels={["Neon serverless driver", "postgres.js", "node-postgres"]}>

   ```shell
   npm install @neondatabase/serverless
   ```

   ```shell
   npm install postgres
   ```

   ```shell
   npm install pg
   ```

   </CodeTabs>

## Store your Neon credentials

Get your `DATABASE_URL` into a `.env` file the app can read.

<Tabs labels={["Neon CLI", "Console"]}>

<TabItem>

From your project directory, link the app to your Neon project and pull its connection string:

```bash filename="Terminal"
neon link                    # connects this directory to your project (writes .neon)
neon checkout main           # pins the branch
neon env pull --file .env    # writes DATABASE_URL into .env
```

If you haven't signed in to the CLI yet, run `neon auth` first. CLI-created projects get a default branch named `main`; if yours differs (Console-created projects use `production`), run `neon branches list` to check. `neon env pull` defaults to `.env.local`, but `nuxt dev` only loads `.env`, so pass `--file .env`.

</TabItem>

<TabItem>

Add a `.env` file and paste your connection string, which you can copy from the **Connect** button on your **Project Dashboard**. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

```shell filename=".env" shouldWrap
DATABASE_URL="postgresql://<user>:<password>@<endpoint_hostname>.neon.tech/<dbname>?sslmode=require&channel_binding=require"
```

</TabItem>

</Tabs>

## Configure the Postgres client

The connection string is a server-side secret, so query it from Nitro server code, which reads `process.env.DATABASE_URL` directly (no `runtimeConfig` needed).

This example uses the Neon serverless driver (`@neondatabase/serverless`). Create a server utility that holds the database client:

```typescript filename="server/utils/db.ts"
import { neon } from '@neondatabase/serverless';

export const sql = neon(process.env.DATABASE_URL!);
```

Then use it in a server API route. Files in `server/utils/` are auto-imported, so `sql` is available without an import:

```typescript filename="server/api/version.get.ts"
export default defineEventHandler(async () => {
  const [row] = await sql`SELECT version()`;
  return row;
});
```

<Admonition type="note">
Keep the database client in `server/` only. Never import `server/utils/db.ts` from a Vue component or `app/` code; the connection string must stay server-side.
</Admonition>

## Run the app

Start the dev server:

```bash filename="Terminal"
npm run dev
```

Then open [localhost:3000/api/version](http://localhost:3000/api/version). The route returns your Postgres version, confirming the connection:

```json
{ "version": "PostgreSQL 18.4 on aarch64-unknown-linux-gnu, compiled by gcc ..." }
```

</Steps>

## Next steps

- [Set up Managed Better Auth](/docs/auth/overview): Add managed authentication that branches with your database
- [Add Object Storage](/docs/storage/overview): S3-compatible file storage that branches with your database
- [Deploy a Function](/docs/compute/functions/overview): Run backend compute next to your database, no separate hosting needed
- [Call an LLM with AI Gateway](/docs/ai-gateway/overview): Access foundation models from Anthropic, OpenAI, Google, and more with one credential

<NeedHelp/>
