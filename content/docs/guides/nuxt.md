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
updatedOn: '2026-08-11T22:46:22.787Z'
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

If you belong to more than one organization, the CLI prompts you to choose one. To skip the prompt, pass `--org-id <id>` (find it with `neon orgs list`).

You'll link this project and pull its credentials in a later step.

</TabItem>

<TabItem>

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

</TabItem>

</Tabs>

## Create a Nuxt project and add dependencies

1. Create a Nuxt project if you do not have one, then change into its directory. The scaffolder is interactive (it asks about the template, package manager, git, and modules); for CI or an AI agent, pass those as flags to run non-interactively. See [Create a Nuxt Project](https://nuxt.com/docs/getting-started/installation#new-project) for details. The CLI commands in the next step run from this directory.

   ```bash filename="Terminal"
   # Interactive (human):
   npm create nuxt@latest my-app && cd my-app

   # Non-interactive (CI / AI agents):
   npm create nuxt@latest my-app -- --template minimal --packageManager npm --no-gitInit --modules "" && cd my-app
   ```

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
neon env pull --file .env    # writes DATABASE_URL from your default branch into .env
```

Notes:

- Not signed in yet? Run `neon auth` first.
- `neon link` prompts for an org and project. To skip the prompts, pass `--project-id <id>` (find IDs with `neon projects list`).
- For Nuxt, pass in `--file .env` to `neon env pull` as it writes to `.env.local` by default, and `nuxt dev` only reads `.env` by default.
- Which branch? `neon env pull` uses your project's default branch: `main` for CLI-created projects, `production` for Console-created ones (`neon branches list` shows yours). To use a different branch, run `neon checkout <branch>` first; it re-pins the branch in `.neon` so the next `env pull` reads from it.

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

Then open `localhost:3000/api/version`. The route returns your Postgres version, confirming the connection:

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
