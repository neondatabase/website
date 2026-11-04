---
title: Connect a Nuxt application to Neon
subtitle: Connect a Nuxt app to Lakebase Postgres on Neon, develop on a branch, deploy, and add the rest of your backend
summary: >-
  Connect a Nuxt app to Lakebase Postgres on Neon: add Neon's agent skills to
  the project, create a Neon project (Neon CLI, API, or Console), link it with
  the Neon CLI to pull DATABASE_URL into .env, which nuxt dev reads, optionally
  develop on a Neon branch, and query it with the Neon serverless driver from a
  Nitro server route that the page fetches with useFetch. Covers Nuxt 4, with a note for Nuxt 3, plus deployment,
  troubleshooting, and Neon's other backend services from Nuxt.
enableTableOfContents: true
updatedOn: '2026-11-04T00:23:33.667Z'
---

<CopyPrompt src="/prompts/nuxt-neon-prompt.md"
description="Prompt to connect your Nuxt app to Lakebase Postgres on Neon: skills, a project, a development branch, and a working query."/>

[Nuxt](https://nuxt.com/) is a full-stack framework for building web apps with Vue. Learn to connect a Nuxt app to Postgres on Neon, query it from a Nitro server route, develop on a branch, and deploy.

<Steps>

## Create a Nuxt app

Create a Nuxt project if you don't have one, then change into its directory. For other options, see [Installation](https://nuxt.com/docs/getting-started/installation) in the Nuxt docs.

```bash filename="Terminal"
npm create nuxt@latest my-app -- --template minimal --packageManager npm --no-gitInit --no-modules
cd my-app
```

Nuxt 4 supports Node.js 22.22.3, 24.15, or 26 or later.

## Set up your AI coding agent (optional)

To help your AI coding agent, such as Claude Code, Cursor, or Codex, set up Neon connections, branches, and backend services correctly, add Neon's [agent skills](/docs/ai/agent-skills) to this project. From your project directory, run:

```bash filename="Terminal"
npx neon@latest skills
```

It installs the skills into this project for the agents it finds (Node.js 22.20 or later). To also connect the [Neon MCP Server](/docs/ai/neon-mcp-server), run `npx neon@latest mcp`. To have your agent install the Neon CLI, sign you in, and add the skills and MCP Server for you, paste the [agent setup prompt](https://neon.com/prompts/agent-setup.md) into it instead.

## Create a Neon project

Skip this step if you already have a Neon project you want to use.

Consider picking a region that supports all Neon backend services: US East (Ohio), US East (N. Virginia), Europe (Frankfurt), or Asia Pacific (Singapore). Postgres and Managed Better Auth run in every region, while Object Storage, Neon Functions, the AI Gateway, and Realtime run in those four, with support expanding toward [all regions](/docs/introduction/regions#product-availability).

<Tabs labels={["Neon CLI", "API", "Console"]}>

<TabItem>

Install the [Neon CLI](/docs/cli/install), sign in, and create the project:

```bash filename="Terminal"
npm i -g neon@latest
neon login
neon projects create --name my-app --region-id aws-us-east-2 --no-secrets
```

`--region-id` sets the region; pass a different one to pick another of the regions above. `--no-secrets` keeps the connection string out of the output, since the next step pulls it into your env file. Pass `--org-id` to choose the organization (find IDs with `neon orgs list`).

</TabItem>

<TabItem>

Create an [API key](https://console.neon.tech/app/settings/api-keys), export it, then create the project in your organization:

```bash filename="Terminal"
export NEON_API_KEY=neon_...

curl -X POST https://console.neon.tech/api/v2/projects \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"project": {"name": "my-app", "region_id": "aws-us-east-2", "org_id": "<org-id>"}}'
```

The response includes the project's connection string in `connection_uris[0].connection_uri`. See [Create a project](/docs/manage/projects#create-a-project) for the other options.

</TabItem>

<TabItem>

Go to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console, click **New Project**, and pick one of the regions above.

</TabItem>

</Tabs>

## Connect your app to the project

Get a `DATABASE_URL` into `.env`, which Nuxt loads into `process.env` in development.

<Tabs labels={["Neon CLI", "Without the CLI"]}>

<TabItem>

From your app's directory, create an empty `.env`, then link it to the Neon project (install the [Neon CLI](/docs/cli/install) and run `neon login` first if you haven't):

```bash filename="Terminal"
touch .env
neon link
```

The Neon CLI writes to `.env` only when it exists, and otherwise to `.env.local`, which Nuxt doesn't load. `neon link` prompts you to pick an organization and a project, or to create a new project. It writes a `.neon` file with the project context, pins a branch (pass `--branch` to choose one), and pulls that branch's `DATABASE_URL` into `.env`. It also offers to create a [`neon.ts`](/docs/reference/neon-ts) file; that's optional and covered in [Add more of your backend](#add-more-of-your-backend).

To skip the prompts, pass `-y` with `--org-id` and `--project-id`. Find IDs with `neon orgs list` and `neon projects list`.

</TabItem>

<TabItem>

Copy the connection string from **Connect** in the Console nav, or from the API response, and add it to a `.env` file in your project directory. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

```shell filename=".env" shouldWrap
DATABASE_URL="postgresql://<user>:<password>@<endpoint_hostname>.neon.tech/<dbname>?sslmode=require&channel_binding=require"
```

The optional development branch step and [Add more of your backend](#add-more-of-your-backend) use the Neon CLI. To use them, run `neon link` in this directory.

</TabItem>

</Tabs>

The scaffolded `.gitignore` already excludes `.env`, so the connection string stays out of git.

## Work on a development branch (optional)

If you linked your project's default branch, your app uses the branch where production data usually lives. That's `main` for projects created with the CLI or API, and `production` for projects created in the Console. Create a [branch](/docs/introduction/branching) for local development instead. A branch starts from its parent's data and schema with copy-on-write, so you can change it freely:

```bash filename="Terminal"
neon checkout dev --create
```

This creates the `dev` branch, pins it in `.neon`, and pulls its `DATABASE_URL` into `.env`, so your app now uses the branch. To switch back, run `neon checkout main` (or `production`).

## Install the Neon serverless driver

```bash filename="Terminal"
npm install @neondatabase/serverless
```

The [Neon serverless driver](/docs/serverless/serverless-driver) queries over HTTP, which suits serverless and edge hosts. On a long-running Node.js server, `pg` or `postgres` work too. See [Choosing your connection method](/docs/connect/choose-connection).

## Create the database client

Create the client in `server/utils/`, which Nuxt auto-imports into server code:

```typescript filename="server/utils/db.ts"
import { neon } from '@neondatabase/serverless';

export const sql = neon(process.env.DATABASE_URL!);
```

Read `DATABASE_URL` from `process.env`, not `runtimeConfig`: at runtime, `runtimeConfig` only picks up `NUXT_`-prefixed variables.

Code in `app/` also runs in the browser, and Nuxt doesn't stop it from importing `server/utils/`. Import the client only in server code, and fetch data from a server route.

## Query the database in a server route

Create `server/api/version.get.ts`. `sql` is available without an import:

```typescript filename="server/api/version.get.ts"
export default defineEventHandler(async () => {
  const [row] = await sql`SELECT version()`;
  return { version: row.version as string };
});
```

Replace `app/app.vue` to fetch the route and display the result. `useFetch` calls the route on the server during the first render:

```vue filename="app/app.vue"
<script setup lang="ts">
const { data } = await useFetch('/api/version');
</script>

<template>
  <h1>Database version</h1>
  <p>{{ data?.version }}</p>
</template>
```

<Admonition type="note" title="Using Nuxt 3?">
Nuxt 3 has no `app/` directory, so put `app.vue` at the project root. The rest of this guide is the same. To create a Nuxt 3 app, use `-t v3` instead of `--template minimal`. Nuxt 3 needs Node.js 20.19, or 22.12 or later. Nuxt 3 reached [end of life](https://nuxt.com/docs/4.x/community/roadmap) on July 31, 2026.
</Admonition>

## Run the app

```bash filename="Terminal"
npm run dev
```

Open [localhost:3000](http://localhost:3000). The page shows your Postgres version, confirming the connection:

```text
Database version
PostgreSQL 18.6 (fd34222) on aarch64-unknown-linux-gnu, compiled by gcc ...
```

</Steps>

## Deploy

Set `DATABASE_URL`, and any other variable your server code reads, where your app runs. The build doesn't need it and doesn't include it in the output, and the built server doesn't read `.env`.

- Use your default branch for production. Get its connection string with `neon connection-string main --pooled` (or `production`), or from **Connect** in the Console.
- The default `node-server` preset builds a Node.js server. Pass the variable when you start it, for example `node --env-file=.env .output/server/index.mjs`. For other hosts, see [Deployment](https://nuxt.com/docs/getting-started/deployment) in the Nuxt docs.
- On Vercel, the [Neon integration](/docs/guides/vercel-overview) sets `DATABASE_URL` for you and can create a Neon branch for each preview deployment.

## Add more of your backend

Neon's other backend services branch with your database. Object Storage, Neon Functions, the AI Gateway, and Realtime need a project in a [supported region](#create-a-neon-project). Add a service with [`neon config add`](/docs/cli/config#add), then provision it with [`neon deploy`](/docs/cli/deploy). For example, to add an Object Storage bucket:

```bash filename="Terminal"
neon config add bucket uploads
neon deploy
```

`neon config add` creates a [`neon.ts`](/docs/reference/neon-ts) file at your project root if you don't have one, installs `@neon/config` and `@neon/env`, and declares the service. `neon deploy` provisions it and writes its variables to `.env`. Read them from `process.env` in server code, and set them on your host too.

<DefinitionList>

Managed Better Auth
: Sign-up, sign-in, and sessions stored in your database.
: Add it with `neon config add auth`. In Nuxt route middleware, check the session with `useRequestFetch()` rather than `$fetch`, which doesn't forward the browser's cookies during server rendering. See [Managed Better Auth](/docs/auth/overview).

Object Storage
: S3-compatible buckets for uploads and files.
: Add a bucket with `neon config add bucket <name>`. In Nuxt, use it from server routes in `server/api/`. The AWS SDK reads the bucket's credentials from `process.env`, so `new S3Client({ forcePathStyle: true, requestChecksumCalculation: 'WHEN_REQUIRED' })` needs no keys in code. See [Object Storage](/docs/storage/overview).

AI Gateway
: One credential for models from Anthropic, OpenAI, Google, and more.
: Add it with `neon config add ai-gateway`. In Nuxt, call models from a server route. [`@neon/ai-sdk-provider`](https://www.npmjs.com/package/@neon/ai-sdk-provider) reads the gateway's variables from `process.env`, so `neon('gpt-5-mini')` works with the AI SDK as is. See [AI Gateway](/docs/ai-gateway/overview).

Neon Functions
: Long-running Node.js compute next to your database.
: Add one with `neon config add function <slug>`, which also creates its handler file in `functions/`. Use a function for work that outlasts a request on your Nuxt host, such as agents and webhooks, and call it with `fetch`. See [Neon Functions](/docs/compute/functions/overview).

Realtime (beta)
: Live SQL query subscriptions.
: Add it with `neon config add realtime`. In Nuxt, seal live queries in a server route with `NEON_REALTIME_SECRET`, and return the sealed query with `NEON_REALTIME_URL`. Then subscribe from the browser, in `onMounted`, with that URL. Keep the secret on the server. See [Realtime](/docs/realtime/overview).

</DefinitionList>

To declare several services at once before you have a `neon.ts`, run `neon config init --services auth,functions,realtime`, or edit the file directly. With every service declared, it looks like this. The comments list the variables each service adds:

```typescript filename="neon.ts"
import { defineConfig } from '@neon/config/v1';

export default defineConfig({
  auth: true, // NEON_AUTH_BASE_URL, NEON_AUTH_JWKS_URL
  buckets: {
    uploads: {}, // AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_ENDPOINT_URL_S3, AWS_REGION
  },
  aiGateway: true, // NEON_AI_GATEWAY_TOKEN, NEON_AI_GATEWAY_BASE_URL
  functions: {
    jobs: { name: 'Jobs', source: './functions/jobs.ts' }, // NEON_FUNCTION_JOBS_BASE_URL
  },
  preview: {
    realtime: true, // NEON_REALTIME_URL, NEON_REALTIME_SECRET
  },
});
```

To skip `neon.ts`, use each service's own CLI commands, such as [`neon buckets create`](/docs/cli/buckets) or [`neon realtime enable`](/docs/cli/realtime).

## Troubleshooting

<DefinitionList>

`NeonDbError (500): Wrong URL scheme or missing user, host or database in connection parameters` in `npm run dev`
: `DATABASE_URL` isn't in `.env`. If `neon link` wrote it to `.env.local`, move the variables to `.env`, or create an empty `.env` and run `neon env pull`.

The built server returns `500` and logs `NeonDbError: Wrong URL scheme`
: The built server doesn't read `.env`. Set `DATABASE_URL` in your host's environment, or start the server with `node --env-file=.env .output/server/index.mjs`.

</DefinitionList>

## Next steps

- **Create your first table:** run `neon psql` in your project directory to open a SQL shell on your linked branch, or use an ORM such as [Drizzle](/docs/guides/drizzle) or [Prisma](/docs/guides/prisma) to manage your schema with migrations.
- [Build a full backend](/docs/get-started/full-backend-quickstart): Postgres, Object Storage, and a Neon Function declared in one `neon.ts`.
- [Branching](/docs/introduction/branching): Give each preview deployment or pull request its own copy of your database.

<NeedHelp/>
