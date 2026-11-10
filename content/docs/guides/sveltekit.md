---
title: Connect a SvelteKit application to Neon
subtitle: Connect a SvelteKit app to Lakebase Postgres on Neon, develop on a branch, deploy, and add the rest of your backend
summary: >-
  Connect a SvelteKit app to Lakebase Postgres on Neon: optionally add Neon's
  agent skills, create a Neon project (Neon CLI, API, or Console), link it
  with the Neon CLI to pull DATABASE_URL into .env.local, optionally develop on a
  Neon branch, declare DATABASE_URL in src/env.ts, and query it with
  node-postgres, postgres.js, or the Neon serverless driver from a server-only
  module and a +page.server.ts load function. Covers SvelteKit 3, with a note for SvelteKit 2, plus deployment,
  troubleshooting, and Neon's other backend services from SvelteKit.
enableTableOfContents: true
updatedOn: '2026-11-03T20:17:45.483Z'
---

[SvelteKit](https://svelte.dev/docs/kit) is a full-stack framework for building web apps with Svelte. Learn to connect a SvelteKit app to Postgres on Neon, query it from a server `load` function, develop on a branch, and deploy.

## Have your AI agent follow this guide

<PromptBlock src="/prompts/sveltekit-prompt.md" labels={["Set up your agent for Neon", "Add Svelte skills", "Connect your SvelteKit app"]} />

<Steps>

## Create a SvelteKit app

Create a SvelteKit project if you don't have one, then change into its directory. For other options, see [Creating a project](https://svelte.dev/docs/kit/creating-a-project) in the SvelteKit docs.

```bash filename="Terminal"
npx sv create my-app --template minimal --types ts --no-add-ons --install npm
cd my-app
```

SvelteKit 3 needs Node.js 22.17 or later. Keep `--no-add-ons`: without it, `sv` asks which add-ons to install. In a non-interactive shell, it then exits without creating the project.

## Add Neon's agent skills (optional)

If your AI coding agent doesn't have Neon's [agent skills](/docs/ai/agent-skills) yet, add them to this project. The prompt above installs them, so skip this step if you used it. From your project directory, run:

```bash filename="Terminal"
npx neon@latest skills
```

To also connect the [Neon MCP Server](/docs/ai/neon-mcp-server), run `npx neon@latest mcp`.

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

Get a `DATABASE_URL` into an env file. In development, SvelteKit reads `.env` and `.env.local` (which overrides `.env`) and exposes declared variables through `$app/env/private`.

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

The scaffolded `.gitignore` already excludes `.env` and `.env.local`, so the connection string stays out of git. Keep `DATABASE_URL` in only one of them: if both have it, `.env.local` wins.

## Work on a development branch (optional)

If you linked your project's default branch, your app uses the branch where production data usually lives. That's `main` for projects created with the CLI or API, and `production` for projects created in the Console. Create a [branch](/docs/introduction/branching) for local development instead. A branch starts from its parent's data and schema with copy-on-write, so you can change it freely:

```bash filename="Terminal"
neon checkout dev --create
```

This creates the `dev` branch, pins it in `.neon`, and pulls its `DATABASE_URL` into the same env file, so your app now uses the branch. To switch back, run `neon checkout main` (or `production`).

## Install a Postgres driver

Install one of these drivers. The [Neon serverless driver](/docs/serverless/serverless-driver) queries over HTTP, which suits serverless and edge hosts. On a long-running Node.js server, node-postgres or postgres.js work well too. See [Choosing your connection method](/docs/connect/choose-connection).

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```bash
npm install pg
npm install -D @types/pg
```

```bash
npm install postgres
```

```bash
npm install @neondatabase/serverless
```

</CodeTabs>

If you use node-postgres, `pg` 8.23 and later print a `SECURITY WARNING` for `sslmode=require`. Change it to `sslmode=verify-full` in your env file to keep the same behavior without the warning. `neon env pull` and `neon checkout` write `sslmode=require` again, so repeat the change after you run them.

## Declare the connection string

SvelteKit only exposes environment variables that you declare. Create `src/env.ts` and declare `DATABASE_URL`, or add it to `variables` if the file already exists. Variables are private by default, so SvelteKit keeps this one out of browser code. Don't declare it with `public: true` or return it in page data.

```typescript filename="src/env.ts"
import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
  DATABASE_URL: {},
});
```

A declared variable is required: the build and the running app both fail if it isn't set. See [Deploy](#deploy).

## Create the database client

Create the client in `src/lib/server/`. SvelteKit refuses to build if code that runs in the browser imports from this directory, so the client and the connection string stay on the server.

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```typescript filename="src/lib/server/db.ts"
import pg from 'pg';
import { DATABASE_URL } from '$app/env/private';

export const pool = new pg.Pool({ connectionString: DATABASE_URL });
```

```typescript filename="src/lib/server/db.ts"
import postgres from 'postgres';
import { DATABASE_URL } from '$app/env/private';

export const sql = postgres(DATABASE_URL);
```

```typescript filename="src/lib/server/db.ts"
import { neon } from '@neondatabase/serverless';
import { DATABASE_URL } from '$app/env/private';

export const sql = neon(DATABASE_URL);
```

</CodeTabs>

## Query the database in a load function

Create `src/routes/+page.server.ts`. If `src/routes/+page.svelte` is still SvelteKit's starter page, replace it. Otherwise, use a new route such as `src/routes/neon/` so you don't replace one of your pages. Its `load` function runs on the server and passes the result to the page. The `#lib` import is a subpath import that new SvelteKit 3 projects define in `package.json`:

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```typescript filename="src/routes/+page.server.ts"
import { pool } from '#lib/server/db.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const { rows } = await pool.query('SELECT version()');
  return { version: rows[0].version as string };
};
```

```typescript filename="src/routes/+page.server.ts"
import { sql } from '#lib/server/db.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const [row] = await sql`SELECT version()`;
  return { version: row.version as string };
};
```

```typescript filename="src/routes/+page.server.ts"
import { sql } from '#lib/server/db.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const [row] = await sql`SELECT version()`;
  return { version: row.version as string };
};
```

</CodeTabs>

Replace `src/routes/+page.svelte` to display it. New SvelteKit 3 projects turn on Svelte 5 runes mode in `vite.config.ts`, so read `data` with `$props()`. `export let data` fails with ``Cannot use `export let` in runes mode — use `$props()` instead``:

```svelte filename="src/routes/+page.svelte"
<script lang="ts">
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<h1>Database version</h1>
<p>{data.version}</p>
```

<Admonition type="note" title="Using SvelteKit 2?">
SvelteKit 2 reads `src/env.ts` and `$app/env/private` only with the experimental `explicitEnvironmentVariables` option, which is off by default, and its projects import from `$lib`. Skip the `src/env.ts` step. In `src/lib/server/db.ts`, import `env` with `import { env } from '$env/dynamic/private';` and pass `env.DATABASE_URL` to your driver instead of `DATABASE_URL`. Import the client from `'$lib/server/db'`. The build doesn't need `DATABASE_URL`, but the running app does, and nothing checks it at startup.
</Admonition>

## Run the app

Check types, then start the dev server:

```bash filename="Terminal"
npm run check
npm run dev
```

Open the URL `npm run dev` prints, usually [localhost:5173](http://localhost:5173). Vite picks the next free port if 5173 is taken. The page shows your Postgres version, confirming the connection:

```text
Database version
PostgreSQL 18.6 (fd34222) on aarch64-unknown-linux-gnu, compiled by gcc ...
```

</Steps>

## Deploy

Set `DATABASE_URL`, and any other variable you declare in `src/env.ts`, everywhere your app builds or runs, including CI jobs that run the build. SvelteKit checks declared variables during the build, and the app reads the value when it starts.

- Use your default branch for production. Get its connection string with `neon connection-string main --pooled` (or `production`), or from **Connect** in the Console.
- The default `adapter-auto` supports Vercel, Netlify, Cloudflare Pages, and a few other hosts. For a Node.js server, install [`@sveltejs/adapter-node`](https://svelte.dev/docs/kit/adapter-node), change the adapter import in `vite.config.ts`, and pass the variable when you start the server, for example `DATABASE_URL=... node build`.
- On Vercel, the [Neon integration](/docs/guides/vercel-overview) sets `DATABASE_URL` for you and can create a Neon branch for each preview deployment.

## Add more of your backend

Neon's other backend services branch with your database. Object Storage, Neon Functions, the AI Gateway, and Realtime need a project in a [supported region](#create-a-neon-project). Add a service with [`neon config add`](/docs/cli/config#add), then provision it with [`neon deploy`](/docs/cli/deploy). For example, to add an Object Storage bucket:

```bash filename="Terminal"
neon config add bucket uploads
neon deploy
```

`neon config add` creates a [`neon.ts`](/docs/reference/neon-ts) file at your project root if you don't have one, installs `@neon/config` and `@neon/env`, and declares the service. `neon deploy` provisions it and writes its variables to `.env.local`. To read a variable in SvelteKit, declare it in `src/env.ts` as you did `DATABASE_URL`, and set it on your host too.

SvelteKit doesn't load `.env` or `.env.local` into `process.env`, so pass values from `$app/env/private` to SDKs instead of letting them read `process.env`.

<DefinitionList>

Managed Better Auth
: Sign-up, sign-in, and sessions stored in your database.
: Add it with `neon config add auth`. Neon doesn't have a SvelteKit quick start for Auth yet. Start from [Managed Better Auth](/docs/auth/overview).

Object Storage
: S3-compatible buckets for uploads and files.
: Add a bucket with `neon config add bucket <name>`. In SvelteKit, use it from server code, such as form actions and `+server.ts` endpoints. See [Object Storage](/docs/storage/overview).

AI Gateway
: One credential for models from Anthropic, OpenAI, Google, and more.
: Add it with `neon config add ai-gateway`. In SvelteKit, call models from server code, such as a `+server.ts` endpoint. See [AI Gateway](/docs/ai-gateway/overview).

Neon Functions
: Long-running Node.js compute next to your database.
: Add one with `neon config add function <slug>`, which also creates its handler file in `functions/`. Use a function for work that outlasts a request on your SvelteKit host, such as agents and webhooks, and call it with `fetch`. See [Neon Functions](/docs/compute/functions/overview).

Realtime (beta)
: Live SQL query subscriptions.
: Add it with `neon config add realtime`. In SvelteKit, seal live queries in server code, such as a `load` function, with `NEON_REALTIME_SECRET`, then subscribe from the browser with `NEON_REALTIME_URL`. Declare the URL with `public: true` in `src/env.ts` and import it from `$app/env/public`. Keep the secret private. See [Realtime](/docs/realtime/overview).

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

`"DATABASE_URL" is not exported by "node_modules/@sveltejs/kit/src/runtime/app/env/private/index.js"`
: `DATABASE_URL` isn't declared in `src/env.ts`. Declare it as shown in [Declare the connection string](#declare-the-connection-string). In `npm run dev`, the same mistake shows `Internal Error`. With the Neon serverless driver, the terminal also logs `NeonDbError: Wrong URL scheme`.

`NeonDbError: Database connection string provided to neon() is not a valid URL`
: With the Neon serverless driver, `DATABASE_URL` is declared but empty. Check the value in your env file, or run `neon env pull`.

`env_invalid` error for `DATABASE_URL`: `Value is missing`
: The build or the running app doesn't have `DATABASE_URL` set. Set it in your host or CI environment. Locally, check that your env file has it, or run `neon env pull`.

`Cannot import #lib/server/db.ts into code that runs in the browser, as this could leak sensitive information`
: A component or other browser code imports the database client. Load data in `+page.server.ts` and pass it to the page as `data`. `npm run build` fails with this error. In `npm run dev`, the server still renders the page, but the browser's request for the module fails with `server_only_import`, and the terminal logs the same error.

`Cannot find module './$types'` from `svelte-check`
: SvelteKit generates these types. Run `npm run check`, which runs `svelte-kit sync` first, or start `npm run dev` once.

</DefinitionList>

## Next steps

- **Create your first table:** run `neon psql` in your project directory to open a SQL shell on your linked branch, or use an ORM such as [Drizzle](/docs/guides/drizzle) or [Prisma](/docs/guides/prisma) to manage your schema with migrations.
- [Build a full backend](/docs/get-started/full-backend-quickstart): Postgres, Object Storage, and a Neon Function declared in one `neon.ts`.
- [Branching](/docs/introduction/branching): Give each preview deployment or pull request its own copy of your database.

<NeedHelp/>
