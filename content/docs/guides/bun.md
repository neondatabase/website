---
title: Connect a Bun application to Neon
subtitle: Connect a Bun app to Lakebase Postgres on Neon, query it from a Bun.serve route, develop on a branch, deploy, and add the rest of your backend
summary: >-
  Connect a Bun app to Lakebase Postgres on Neon: optionally add Neon's agent
  skills, create a Neon project (Neon CLI, API, or Console), link it with the
  Neon CLI to pull DATABASE_URL into .env.local, optionally develop on a Neon
  branch, and query it with Bun's built-in Bun.sql client, node-postgres,
  postgres.js, or the Neon serverless driver from a Bun.serve route. Covers Bun
  1.4, plus deployment, troubleshooting, and Neon's other backend services from
  Bun. The same client module works in Hono, Elysia, and other Bun frameworks.
enableTableOfContents: true
updatedOn: '2026-11-17T16:51:54.205Z'
---

<PromptBlock src="/prompts/bun-prompt.md" labels={["Set up your agent and follow this guide", "Look up Bun's docs", "Connect your Bun app"]} />

<Steps>

## Create a Bun app

[Install Bun](https://bun.com/docs/installation) if you don't have it, then create a project if you don't have one. For other options, see [bun init](https://bun.com/docs/runtime/templating/init) in the Bun docs.

```bash filename="Terminal"
mkdir my-app
cd my-app
bun init -y
```

This guide uses Bun 1.4. Bun 1.3 doesn't have `bun check`, so run `bunx tsc --noEmit` where the guide uses it. `-y` accepts the defaults, so `bun init` runs without prompts and creates a blank TypeScript project with an `index.ts` file. When it detects Claude Code or Cursor, it also adds a `CLAUDE.md` or a Cursor rule that tells your agent to use Bun's APIs, such as `Bun.sql` for Postgres.

## Add Neon's agent skills (optional)

If your AI coding agent doesn't have Neon's [agent skills](/docs/ai/agent-skills) yet, add them to this project. The prompt above installs them, so skip this step if you used it. From your project directory, run:

```bash filename="Terminal"
npx neon@latest skills
```

To also connect the [Neon MCP Server](/docs/ai/neon-mcp-server), run `npx neon@latest mcp`.

Bun publishes its docs for AI agents at [bun.com/llms.txt](https://bun.com/llms.txt). The prompt above has your agent look up Bun docs there.

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
export NEON_API_KEY=napi_...

curl -X POST https://console.neon.tech/api/v2/projects \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"project": {"name": "my-app", "region_id": "aws-us-east-2", "org_id": "<org-id>"}}'
```

The response includes the project's connection string in `connection_uris[0].connection_uri`. See [Create a project with the API](/docs/manage/projects#create-a-project-with-the-api) for the other options.

</TabItem>

<TabItem>

Go to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console, click **New Project**, and pick one of the regions above.

</TabItem>

</Tabs>

## Connect your app to the project

Get a `DATABASE_URL` into an env file. Bun loads `.env` and `.env.local` automatically, so your code reads the variable from `process.env`.

<Tabs labels={["Neon CLI", "Without the CLI"]}>

<TabItem>

From your app's directory, link it to the Neon project (install the [Neon CLI](/docs/cli/install) and run `neon login` first if you haven't):

```bash filename="Terminal"
neon link
```

`neon link` prompts you to pick an organization and a project, or to create a new project. It writes a `.neon` file with the project context, pins a branch (pass `--branch` to choose one), and pulls that branch's `DATABASE_URL` into `.env.local`, or into `.env` if your project already has one. It also offers to create a [`neon.ts`](/docs/reference/neon-ts) file; that's optional and covered in [Add more of your backend](#add-more-of-your-backend).

To skip the prompts, pass `-y` with `--org-id` and `--project-id`, or with `--org-id`, `--project-name`, and `--region-id` to create a project. Find IDs with `neon orgs list` and `neon projects list --org-id <org-id>`.

</TabItem>

<TabItem>

Copy the connection string from **Connect** in the Console nav, or from the API response, and add it to a `.env.local` file in your project directory. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

```shell filename=".env.local" shouldWrap
DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"
```

The optional development branch step and [Add more of your backend](#add-more-of-your-backend) use the Neon CLI. To use them, run `neon link` in this directory.

</TabItem>

</Tabs>

The `.gitignore` that `bun init` creates already excludes `.env` and `.env.local`, so the connection string stays out of git. Keep `DATABASE_URL` in only one of them: if both have it, `.env.local` wins.

## Work on a development branch (optional)

If you linked your project's default branch, your app uses the branch where production data usually lives. That's `main` for projects created with the CLI or API, and `production` for projects created in the Console. Create a [branch](/docs/introduction/branching) for local development instead. A branch starts from its parent's data and schema with copy-on-write, so you can change it freely:

```bash filename="Terminal"
neon checkout dev --create
```

This creates the `dev` branch, pins it in `.neon`, and pulls its `DATABASE_URL` into the same env file, so your app now uses the branch. To switch back, run `neon checkout main` (or `production`).

## Install a Postgres driver

[`Bun.sql`](https://bun.com/docs/runtime/sql) is Bun's built-in Postgres client, so it needs no install. You can also use one of the npm drivers. The [Neon serverless driver](/docs/serverless/serverless-driver) queries over HTTP, which suits serverless and edge hosts. See [Choosing your connection method](/docs/connect/choose-connection).

<CodeTabs reverse={true} labels={["Bun.sql", "node-postgres", "postgres.js", "Neon serverless driver"]}>

```bash
# Bun.sql is built into Bun. Nothing to install.
```

```bash
bun add pg
bun add -d @types/pg
```

```bash
bun add postgres
```

```bash
bun add @neondatabase/serverless
```

</CodeTabs>

If you use node-postgres, `pg` 8.23 and later print a `SECURITY WARNING` for `sslmode=require`. Change it to `sslmode=verify-full` in your env file to keep the same behavior without the warning. `neon env pull` and `neon checkout` write `sslmode=require` again, so repeat the change after you run them.

## Create the database client

Create the client in `db.ts`. It reads `DATABASE_URL` from `process.env` and stops the app at startup if the variable isn't set:

<CodeTabs reverse={true} labels={["Bun.sql", "node-postgres", "postgres.js", "Neon serverless driver"]}>

```typescript filename="db.ts"
import { SQL } from 'bun';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not set');

export const sql = new SQL(url);
```

```typescript filename="db.ts"
import pg from 'pg';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not set');

export const pool = new pg.Pool({ connectionString: url });
```

```typescript filename="db.ts"
import postgres from 'postgres';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not set');

export const sql = postgres(url);
```

```typescript filename="db.ts"
import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not set');

export const sql = neon(url);
```

</CodeTabs>

`Bun.sql` can also read `DATABASE_URL` by itself: `import { sql } from 'bun'` gives you a client without a `db.ts` file. Without `db.ts`, a missing variable doesn't stop the app at startup.

## Query the database from a route

Serve the query from a [`Bun.serve`](https://bun.com/docs/runtime/http/server) route. If `index.ts` is still the file `bun init` created, replace it. Otherwise, add a route such as `/neon` to your server's `routes` so you don't replace one of yours. The route returns the version as JSON, and `row?.version` handles an empty result:

<CodeTabs reverse={true} labels={["Bun.sql", "node-postgres", "postgres.js", "Neon serverless driver"]}>

```typescript filename="index.ts"
import { sql } from './db';

const server = Bun.serve({
  routes: {
    '/': async () => {
      const [row] = await sql`SELECT version()`;
      return Response.json({ version: row?.version });
    },
  },
});

console.log(`Listening on ${server.url}`);
```

```typescript filename="index.ts"
import { pool } from './db';

const server = Bun.serve({
  routes: {
    '/': async () => {
      const { rows } = await pool.query('SELECT version()');
      return Response.json({ version: rows[0].version });
    },
  },
});

console.log(`Listening on ${server.url}`);
```

```typescript filename="index.ts"
import { sql } from './db';

const server = Bun.serve({
  routes: {
    '/': async () => {
      const [row] = await sql`SELECT version()`;
      return Response.json({ version: row?.version });
    },
  },
});

console.log(`Listening on ${server.url}`);
```

```typescript filename="index.ts"
import { sql } from './db';

const server = Bun.serve({
  routes: {
    '/': async () => {
      const [row] = await sql`SELECT version()`;
      return Response.json({ version: row?.version });
    },
  },
});

console.log(`Listening on ${server.url}`);
```

</CodeTabs>

If you use [Hono](https://hono.dev/docs/getting-started/bun), [Elysia](https://elysiajs.com), or another Bun framework, keep `db.ts` as it is and query it from that framework's route handlers.

## Run the app

Check types, then start the server. `--hot` reloads it when you edit a file:

```bash filename="Terminal"
bun check
bun --hot index.ts
```

Open the URL the server prints, usually [localhost:3000](http://localhost:3000). Bun uses the `BUN_PORT` or `PORT` environment variable if one is set. The response shows your Postgres version, confirming the connection:

```json
{"version":"PostgreSQL 18.6 (fd34222) on aarch64-unknown-linux-gnu, compiled by gcc ..."}
```

</Steps>

## Deploy

Set `DATABASE_URL` everywhere your app runs.

- Use your default branch for production. Get its connection string with `neon connection-string main --pooled` (or `production`), or from **Connect** in the Console.
- Start the server with `bun index.ts`. Bun loads `.env` and `.env.local` automatically, including when `NODE_ENV=production`. It skips `.env.local` only when `NODE_ENV=test`. A variable set in the host's environment takes priority over your env files. To skip env files entirely, start the server with `bun --no-env-file index.ts`.
- Bun's docs have [deployment guides](https://bun.com/docs/guides) for hosts such as Vercel, Railway, Render, Google Cloud Run, and Docker.
- On Vercel, the [Neon integration](/docs/guides/vercel-overview) sets `DATABASE_URL` for you and can create a Neon branch for each preview deployment.

## Add more of your backend

Neon's other backend services branch with your database. Object Storage, Neon Functions, the AI Gateway, and Realtime need a project in a [supported region](#create-a-neon-project). Add a service with [`neon config add`](/docs/cli/config#add), then provision it with [`neon deploy`](/docs/cli/deploy). For example, to add an Object Storage bucket:

```bash filename="Terminal"
neon config add bucket uploads
neon deploy
```

`neon config add` creates a [`neon.ts`](/docs/reference/neon-ts) file at your project root if you don't have one, installs `@neon/config` and `@neon/env`, and declares the service. `neon deploy` provisions it and writes its variables to `.env.local`. Bun loads them into `process.env`, so SDKs that read `process.env` find them. Set them on your host too.

<DefinitionList>

Managed Better Auth
: Sign-up, sign-in, and sessions stored in your database.
: Add it with `neon config add auth`. See [Managed Better Auth](/docs/auth/overview).

Object Storage
: S3-compatible buckets for uploads and files.
: Add a bucket with `neon config add bucket <name>`. In Bun, use it from server code, such as a `Bun.serve` route. See [Object Storage](/docs/storage/overview).

AI Gateway
: One credential for models from Anthropic, OpenAI, Google, and more.
: Add it with `neon config add ai-gateway`. In Bun, call models from server code, such as a route. See [AI Gateway](/docs/ai-gateway/overview).

Neon Functions
: Long-running Node.js compute next to your database.
: Add one with `neon config add function <slug>`, which also creates its handler file in `functions/`. Use a function for work that outlasts a request on your Bun host, such as agents and webhooks, and call it with `fetch`. See [Neon Functions](/docs/compute/functions/overview).

Realtime (beta)
: Live SQL query subscriptions.
: Add it with `neon config add realtime`. In Bun, seal live queries in server code with `NEON_REALTIME_SECRET`, then subscribe from the browser with `NEON_REALTIME_URL`. Keep the secret on the server. See [Realtime](/docs/realtime/overview).

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
    jobs: { name: 'Jobs', source: './functions/jobs.ts' }, // NEON_FUNCTION_HOST_SUFFIX
  },
  preview: {
    realtime: true, // NEON_REALTIME_URL, NEON_REALTIME_SECRET
  },
});
```

To skip `neon.ts`, use each service's own CLI commands, such as [`neon buckets create`](/docs/cli/buckets) or [`neon realtime enable`](/docs/cli/realtime).

## Troubleshooting

<DefinitionList>

`error: DATABASE_URL is not set`
: The app started without `DATABASE_URL`. Locally, check that your env file has it, or run `neon env pull`. On a host, set it in the host's environment. If you start the server with `--no-env-file`, Bun skips your env files, so set the variable another way.

`DATABASE_URL is not set` in `bun test`
: `bun test` sets `NODE_ENV=test`, and Bun doesn't load `.env.local` in that mode. Put a test branch's `DATABASE_URL` in `.env.test.local`, or run `bun test --env-file=.env.local`.

`error: Failed to start server. Is port 3000 in use?`
: Another server, often an earlier `bun index.ts`, is still using the port. Stop it, or set `PORT` to use another port.

</DefinitionList>

## Next steps

- **Create your first table:** run `neon psql` in your project directory to open a SQL shell on your linked branch, or use an ORM such as [Drizzle](/docs/guides/drizzle) or [Prisma](/docs/guides/prisma) to manage your schema with migrations.
- [Build a full backend](/docs/get-started/full-backend-quickstart): Postgres, Object Storage, and a Neon Function declared in one `neon.ts`.
- [Branching](/docs/introduction/branching): Give each preview deployment or pull request its own copy of your database.

<NeedHelp/>
