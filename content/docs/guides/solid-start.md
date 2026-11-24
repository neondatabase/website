---
title: Connect a SolidStart application to Neon
subtitle: Connect a SolidStart app to Lakebase Postgres on Neon, query it from a route and an API route, develop on a branch, deploy, and add the rest of your backend
summary: >-
  Connect a SolidStart 2 app to Lakebase Postgres on Neon: create the app with
  create-solid, optionally add Neon's agent skills, create a Neon project (Neon
  CLI, API, or Console), link it with the Neon CLI to pull DATABASE_URL into an
  env file, optionally develop on a Neon branch, and query it with node-postgres,
  postgres.js, or the Neon serverless driver from a shared database module, a
  route's query function, and an API route. Covers SolidStart 2 on Node.js 24,
  plus deployment, troubleshooting, and Neon's other backend services from
  SolidStart.
enableTableOfContents: true
updatedOn: '2026-11-19T01:50:59.814Z'
---

<PromptBlock src="/prompts/solidstart-prompt.md" labels={["Set up your agent and follow this guide", "Look up SolidStart's docs", "Connect your SolidStart app"]} />

<Steps>

## Create a SolidStart app

Install [Node.js](https://nodejs.org/en/download) 24 or later if you don't have it, then create a project if you don't have one. The `-s`, `--v2`, `-t basic`, and `--ts` flags choose SolidStart 2, the basic template, and TypeScript, so the command runs without prompts:

```bash filename="Terminal"
npm create solid@latest my-app -- -s --v2 -t basic --ts
cd my-app
npm install
```

The CLI copies the template but doesn't install its dependencies, so `npm install` is the step that does. For other templates and options, see the [create-solid](https://github.com/solidjs-community/solid-cli) docs.

The CLI writes a `.gitignore` that excludes `.env` and `.env*.local`, so the connection string you add to an env file, including `.env.local`, stays out of git.

This guide covers SolidStart 2 (`@solidjs/start` 2.x), which requires Node.js 24 or later. The `npm create` command above makes a SolidStart 2 app. Apps on SolidStart 1 (`@solidjs/start` 1.x) aren't covered here.

## Add Neon's agent skills (optional)

If your AI coding agent doesn't have Neon's [agent skills](/docs/ai/agent-skills) yet, add them to this project. The prompt above installs them, so skip this step if you used it. From your project directory, run:

```bash filename="Terminal"
npx neon@latest skills
```

To also connect the [Neon MCP Server](/docs/ai/neon-mcp-server), run `npx neon@latest mcp`.

## Create a Neon project

Create a Neon project in a region that runs every Neon backend service: `aws-us-east-2` (Ohio), `aws-us-east-1` (N. Virginia), `aws-eu-central-1` (Frankfurt), or `aws-ap-southeast-1` (Singapore). Postgres and Managed Better Auth run in every region; Object Storage, Neon Functions, the AI Gateway, and Realtime run in those four (see [product availability](/docs/introduction/regions#product-availability)). Skip this step if you already have a Neon project you want to use.

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

Get a `DATABASE_URL` into an env file. Nitro, the server toolkit SolidStart builds on, uses its Vite plugin to load `.env`, `.env.local`, and the mode-specific variants of each into `process.env` for `npm run dev` and `npm run build`. Server code reads `process.env.DATABASE_URL`.

<Tabs labels={["Neon CLI", "Without the CLI"]}>

<TabItem>

From your app's directory, link it to the Neon project (install the [Neon CLI](/docs/cli/install) and run `neon login` first if you haven't):

```bash filename="Terminal"
neon link
```

`neon link` prompts you to pick an organization and a project, or to create a new project. It writes a `.neon` file with the project context and pins a branch (pass `--branch` to choose one). It pulls that branch's `DATABASE_URL` into `.env.local`, or into `.env` if your project already has one. It also offers to create a [`neon.ts`](/docs/reference/neon-ts) file; that's optional and covered in [Add more of your backend](#add-more-of-your-backend).

To skip the prompts, pass `-y` with `--org-id` and `--project-id`, or with `--org-id`, `--project-name`, and `--region-id` to create a project. Find IDs with `neon orgs list` and `neon projects list --org-id <org-id>`.

</TabItem>

<TabItem>

In the [Neon Console](https://console.neon.tech/app/projects), click **Connect** in the nav, choose **Pooled connection**, and copy the connection string. Use the pooled string because it routes connections through Neon's pooler, which suits serverless and long-running hosts alike. Then add it to a `.env` file in your project directory. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

```shell filename=".env" shouldWrap
DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"
```

The optional development branch step and [Add more of your backend](#add-more-of-your-backend) use the Neon CLI. To use them, run `neon link` in this directory.

</TabItem>

</Tabs>

Keep `DATABASE_URL` in only one of the two files: if both have it, `.env.local` wins.

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

If you use node-postgres, current `pg` versions print a `SECURITY WARNING` for `sslmode=require`. Change it to `sslmode=verify-full` in your env file to keep the same behavior without the warning. `neon link`, `neon checkout`, `neon env pull`, and `neon deploy` write `sslmode=require` again, so repeat the change after you run them.

## Create the database client

Create the client once for the whole app, in `src/lib/db.ts`, rather than in each route. It starts with `import 'server-only'`, so the build fails if browser code imports it, and it stops the app at startup if `DATABASE_URL` isn't set:

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```typescript filename="src/lib/db.ts"
import 'server-only';
import pg from 'pg';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not set');

export const pool = new pg.Pool({ connectionString: url });

// An idle connection can drop, for example when the compute scales to zero.
// Without a listener, the pool's error event stops the app.
pool.on('error', (error) => console.error('Postgres pool error:', error.message));
```

```typescript filename="src/lib/db.ts"
import 'server-only';
import postgres from 'postgres';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not set');

export const sql = postgres(url, { ssl: 'require' });
```

```typescript filename="src/lib/db.ts"
import 'server-only';
import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not set');

export const sql = neon(url);
```

</CodeTabs>

The examples below import this module with `~/lib/db`, the `~/` alias the SolidStart basic template configures for `src/`.

## Query the database from a route

SolidStart runs a query function marked `"use server"` on the server only, and the route reads its result with `createAsync`. If `src/routes/index.tsx` is still the starter page, replace its contents. Otherwise, add a route such as `src/routes/neon.tsx` so you don't replace one of your pages. The `route` export starts the query as soon as the route matches:

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```typescript filename="src/routes/index.tsx"
import { createAsync, query } from '@solidjs/router';
import { pool } from '~/lib/db';

const getVersion = query(async () => {
  'use server';
  const { rows } = await pool.query('SELECT version()');
  return rows[0].version as string;
}, 'version');

export const route = {
  preload: () => void getVersion(),
};

export default function Page() {
  const version = createAsync(() => getVersion());
  return (
    <main>
      <h1>Database version</h1>
      <p>{version()}</p>
    </main>
  );
}
```

```typescript filename="src/routes/index.tsx"
import { createAsync, query } from '@solidjs/router';
import { sql } from '~/lib/db';

const getVersion = query(async () => {
  'use server';
  const [row] = await sql`SELECT version()`;
  return row.version as string;
}, 'version');

export const route = {
  preload: () => void getVersion(),
};

export default function Page() {
  const version = createAsync(() => getVersion());
  return (
    <main>
      <h1>Database version</h1>
      <p>{version()}</p>
    </main>
  );
}
```

```typescript filename="src/routes/index.tsx"
import { createAsync, query } from '@solidjs/router';
import { sql } from '~/lib/db';

const getVersion = query(async () => {
  'use server';
  const [row] = await sql`SELECT version()`;
  return row.version as string;
}, 'version');

export const route = {
  preload: () => void getVersion(),
};

export default function Page() {
  const version = createAsync(() => getVersion());
  return (
    <main>
      <h1>Database version</h1>
      <p>{version()}</p>
    </main>
  );
}
```

</CodeTabs>

The query function's name (`'version'`) is its cache key. A query function is the server boundary: the code inside it, including the connection string, never reaches the browser.

## Add a server endpoint (API route)

An API route is a file in `src/routes/api/` that exports a `GET` handler. Create `src/routes/api/version.ts`. It returns the version as JSON with `json` from `@solidjs/router`:

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```typescript filename="src/routes/api/version.ts"
import { json } from '@solidjs/router';
import { pool } from '~/lib/db';

export async function GET() {
  const { rows } = await pool.query('SELECT version()');
  return json({ version: rows[0].version });
}
```

```typescript filename="src/routes/api/version.ts"
import { json } from '@solidjs/router';
import { sql } from '~/lib/db';

export async function GET() {
  const [row] = await sql`SELECT version()`;
  return json({ version: row.version });
}
```

```typescript filename="src/routes/api/version.ts"
import { json } from '@solidjs/router';
import { sql } from '~/lib/db';

export async function GET() {
  const [row] = await sql`SELECT version()`;
  return json({ version: row.version });
}
```

</CodeTabs>

<Admonition type="note">
If `tsc` or your editor reports `Cannot find name 'process'`, add the Node.js types with `npm install -D @types/node`.
</Admonition>

## Run the app

Start the development server:

```bash filename="Terminal"
npm run dev
```

Open the URL the dev server prints. The page shows your Postgres version, confirming the connection:

```shell shouldWrap
PostgreSQL 18.6 (ac70818) on aarch64-unknown-linux-gnu, compiled by gcc (Ubuntu 13.3.0-6ubuntu2~24.04.1) 13.3.0, 64-bit
```

The API route returns the same value as JSON at `/api/version` on that URL.

<Admonition type="note">
`npm run dev` loads your env files. `npm run preview` reads only `.env.preview`, `.env.production`, and `.env`, not `.env.local`, and serves on port 3000. A production server doesn't read env files either. `npm start` runs the built server with only the variables in its environment. See [Deploy](#deploy).
</Admonition>

</Steps>

## Deploy

Set `DATABASE_URL` everywhere your app runs.

- Use your default branch for production. Get its connection string with `neon connection-string main --pooled` (or `production`), or from **Connect** in the Console.
- Build with `npm run build`, then start the server with `npm start`. `npm start` doesn't read env files, so set `DATABASE_URL` in your host's environment.
- Pick the driver for your host. node-postgres or postgres.js suit long-running Node.js servers. On serverless or edge platforms, use the Neon serverless driver. See [Choosing your connection method](/docs/connect/choose-connection).

## Add more of your backend

Neon's other backend services branch with your database. Object Storage, Neon Functions, the AI Gateway, and Realtime need a project in a [supported region](#create-a-neon-project). Add a service with [`neon config add`](/docs/cli/config#add), then provision it with [`neon deploy`](/docs/cli/deploy). For example, to add an Object Storage bucket:

```bash filename="Terminal"
neon config add bucket uploads
neon deploy
```

`neon config add` creates a [`neon.ts`](/docs/reference/neon-ts) file at your project root if you don't have one, installs `@neon/config` and `@neon/env`, and declares the service. `neon deploy` provisions it and writes its variables to your env file (`.env` if it exists, otherwise `.env.local`). The dev server loads them into `process.env`, so SDKs that read `process.env` find them. Set them on your host too.

<DefinitionList>

Managed Better Auth
: Sign-up, sign-in, and sessions stored in your database.
: Add it with `neon config add auth`. See [Managed Better Auth](/docs/auth/overview).

Object Storage
: S3-compatible buckets for uploads and files.
: Add a bucket with `neon config add bucket <name>`. In SolidStart, use it from query functions and API routes. See [Object Storage](/docs/storage/overview).

AI Gateway
: One credential for models from Anthropic, OpenAI, Google, and more.
: Add it with `neon config add ai-gateway`. In SolidStart, call models from a query function or API route. See [AI Gateway](/docs/ai-gateway/overview).

Neon Functions
: Long-running Node.js compute next to your database.
: Add one with `neon config add function <slug>`. It also creates the handler file in `functions/`. Use a function for work that outlasts a request on your SolidStart host. Examples include agents your host calls with `fetch`, webhook handlers that outside services call, and scheduled jobs. Neon runs scheduled jobs on a cron schedule with [Function Triggers](/docs/compute/functions/triggers/overview), which invoke a function on a schedule instead of over HTTP. See [Neon Functions](/docs/compute/functions/overview).

Realtime (beta)
: Live SQL query subscriptions.
: Add it with `neon config add realtime`. In SolidStart, seal live queries in a query function with `NEON_REALTIME_SECRET`, then return `NEON_REALTIME_URL` to the browser from a query function or API route. Keep the secret on the server. See [Realtime](/docs/realtime/overview).

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

`Error: DATABASE_URL is not set`
: The app started without `DATABASE_URL`, so `src/lib/db.ts` throws this error. Locally, start it with `npm run dev` so the env files load, and check that one of them has the variable, or run `neon env pull`. With `npm start` or on a host, set it in the environment.

`Attempt to import 'server-only' in a client module`
: Browser code imports `server-only`. Either a component imports the database module, `src/lib/db.ts`, or it imports a SolidStart module that imports `server-only` itself, such as `@solidjs/start/http`. Import the database module only from query functions and API routes, which run on the server. The build fails with this error.

`Cannot find name 'process'`
: The template doesn't include Node.js types. Run `npm install -D @types/node`.

`SSL SYSCALL error: EOF detected`, or a similar connection-reset error
: The app reused a connection after the Neon compute was suspended for inactivity. This mainly affects node-postgres, which keeps a connection pool open. The `pool.on('error')` listener in `src/lib/db.ts` keeps the error from stopping the app. Reconnecting on error, or closing and recreating idle connections, resolves it.

`Endpoint ID is not specified`
: The client doesn't send Server Name Indication (SNI), which Neon uses to route connections. Current node-postgres and postgres.js send SNI, so this usually means an older client, or a libpq (the official Postgres client library) older than Postgres 14. If upgrading doesn't fix it, append `&options=endpoint%3D<endpoint-id>` to `DATABASE_URL` (use `?` instead of `&` if the URL has no query string). The endpoint ID is the first part of the host name without `-pooler`, for example `ep-cool-darkness-123456`. See [The endpoint ID is not specified](/docs/connect/connection-errors#the-endpoint-id-is-not-specified).

</DefinitionList>

## Next steps

- **Create your first table:** run `neon psql` in your project directory to open a SQL shell on your linked branch, or use an ORM such as [Drizzle](/docs/guides/drizzle) or [Prisma](/docs/guides/prisma) to manage your schema with migrations.
- [Build a full backend](/docs/get-started/full-backend-quickstart): Postgres, Object Storage, and a Neon Function declared in one `neon.ts`.
- [Branching](/docs/introduction/branching): Give each preview deployment or pull request its own branch of your database.

<NeedHelp/>
