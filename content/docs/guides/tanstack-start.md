---
title: Connect a TanStack Start application to Neon
subtitle: Connect a TanStack Start app to Lakebase Postgres on Neon, query it from a server function, develop on a branch, deploy, and add the rest of your backend
summary: >-
  Connect a TanStack Start app to Lakebase Postgres on Neon: optionally add
  Neon's agent skills, create a Neon project (Neon CLI, API, or Console), link
  it with the Neon CLI to pull DATABASE_URL into .env.local, optionally develop
  on a Neon branch, and query it with node-postgres, postgres.js, or the Neon
  serverless driver from a server function. Covers TanStack Start with React,
  plus static server functions, deployment, troubleshooting, and Neon's other
  backend services from TanStack Start.
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/tanstack-start
  - /docs/integrations/tanstack-start
updatedOn: '2026-11-19T01:52:12.257Z'
---

<Callout title="Realtime with TanStack">
Build full-stack reactive apps with SSR and end-to-end type-safety using the [TanStack example](/docs/realtime/examples/tanstack).
</Callout>

<PromptBlock src="/prompts/tanstack-start-prompt.md" labels={["Set up your agent and follow this guide", "Use TanStack's docs", "Connect your TanStack Start app"]} />

[TanStack Start](https://tanstack.com/start/latest) is a full-stack framework built on TanStack Router and Vite, with server functions and server-side rendering. This guide uses React. TanStack Start also supports Solid, which this page doesn't cover.

<Steps>

## Create a TanStack Start app

Create a TanStack Start project if you don't have one, then change into its directory. For interactive setup and other options, see [Getting started](https://tanstack.com/start/latest/docs/framework/react/getting-started) in the TanStack docs.

```bash filename="Terminal"
npx @tanstack/cli@latest create my-app --blank --deployment nitro --package-manager npm --no-git --no-install -y
cd my-app
printf '\n.env.local\n' >> .gitignore
npm install
```

`--blank` creates a minimal app with one route and no demo pages or Tailwind. `--deployment nitro` adds Nitro, which builds the server into `.output` when you run `npm run build`. `--no-git` turns off the git repository the CLI would create. `--no-install` turns off its dependency install, and the `npm install` line does that instead. Run `git init` yourself if you want version control. TanStack Start and the Nitro version the scaffold adds need Node.js 22.12 or later, and `npx neon@latest skills` in the next step needs 22.20. The TanStack `start-basic` example pins Vite 8, so check the version with `npm ls vite` if the build complains.

## Add Neon's agent skills (optional)

If your AI coding agent doesn't have Neon's [agent skills](/docs/ai/agent-skills) yet, add them to this project. The agent setup step in the prompt above installs them, so skip this step if you used it. From your project directory, run:

```bash filename="Terminal"
npx neon@latest skills
```

To also connect the [Neon MCP Server overview](/docs/ai/neon-mcp-server), run `npx neon@latest mcp`.

TanStack publishes its documentation as an [llms.txt index](https://tanstack.com/start/latest/llms.txt) for agents, and `@tanstack/react-start` ships a React Start skill for your agent. To have your agent load TanStack's skill in later sessions, run `npx @tanstack/intent@latest install --map` in your project after `npm install`. `--map` skips the skill-permissions setup, so you aren't asked to review the permissions the skills get.

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

`--region-id` sets the region. `--no-secrets` keeps the connection string out of the output, since the next step pulls it into your env file. Pass `--org-id` to choose the organization (find IDs with `neon orgs list`).

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

Get a `DATABASE_URL` into an env file. In development, Vite loads `.env` and `.env.local`, and `.env.local` overrides `.env`. Server functions read unprefixed variables from `process.env`.

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

The `printf` line in [Create a TanStack Start app](#create-a-tanstack-start-app) adds `.env.local` to `.gitignore`, which keeps the connection string out of git. Keep `DATABASE_URL` in only one of the two env files: if both have it, `.env.local` wins.

## Work on a development branch (optional)

Run `neon checkout dev --create` to develop on a branch of your database instead of the default branch, where production data usually lives. The default branch is `main` for projects created with the CLI or API, and `production` for projects created in the Console. A [branch](/docs/introduction/branching) starts from its parent's data and schema without copying them (copy-on-write: only the changes you make are stored), so you can change it freely:

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

Create `src/lib/db.server.ts`. The `.server.ts` suffix keeps the file out of browser code: TanStack Start's import protection stops client code from importing it. Each helper reads `DATABASE_URL` the first time a function calls it, not when the module loads.

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```typescript filename="src/lib/db.server.ts"
import pg from 'pg';

let pool: InstanceType<typeof pg.Pool> | undefined;

export function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set. Add it to .env.local.');
  }
  if (!pool) {
    pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    // An idle connection can drop when the compute scales to zero. Without an error listener, that error stops the app.
    pool.on('error', (error) => console.error('Postgres pool error:', error.message));
  }
  return pool;
}

export async function getPostgresVersion() {
  const { rows } = await getPool().query('SELECT version()');
  return rows[0].version as string;
}
```

```typescript filename="src/lib/db.server.ts"
import postgres from 'postgres';

let sql: postgres.Sql | undefined;

export function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set. Add it to .env.local.');
  }
  // Close idle connections after 20 seconds, so a build that prerenders a page exits about 20 seconds after its last query.
  sql ??= postgres(process.env.DATABASE_URL, { idle_timeout: 20 });
  return sql;
}

export async function getPostgresVersion() {
  const [row] = await getSql()`SELECT version()`;
  return row.version as string;
}
```

```typescript filename="src/lib/db.server.ts"
import { neon } from '@neondatabase/serverless';

export function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set. Add it to .env.local.');
  }
  return neon(process.env.DATABASE_URL);
}

export async function getPostgresVersion() {
  const [row] = await getSql()`SELECT version()`;
  return row.version as string;
}
```

</CodeTabs>

## Query the database from a server function

Create `src/data/get-neon-data.ts`. A server function runs on the server, and its result goes to whichever component or loader calls it:

```typescript filename="src/data/get-neon-data.ts"
import { createServerFn } from '@tanstack/react-start';
import { getPostgresVersion } from '../lib/db.server';

export const getData = createServerFn({ method: 'GET' }).handler(() => getPostgresVersion());
```

Replace the contents of `src/routes/index.tsx` with the code below. If that file has content you want to keep, put this code in a new route, such as `src/routes/neon.tsx`, and open `/neon`. The route's `loader` calls the server function and passes the result to the page:

```tsx filename="src/routes/index.tsx"
import { createFileRoute } from '@tanstack/react-router';
import { getData } from '../data/get-neon-data';

export const Route = createFileRoute('/')({
  loader: () => getData(),
  component: Home,
});

function Home() {
  const version = Route.useLoaderData();

  return (
    <>
      <h1>Database version</h1>
      <p>{version}</p>
    </>
  );
}
```

### Static server functions (experimental)

Static server functions run at build time, when the build prerenders the page, and the build saves each result as static JSON. TanStack marks them experimental. To make one, install the middleware package:

```bash filename="Terminal"
npm install @tanstack/start-static-server-functions
```

Then add `staticFunctionMiddleware` as the last middleware of the function, in a file of its own:

```typescript filename="src/data/static-neon-data.ts"
import { createServerFn } from '@tanstack/react-start';
import { staticFunctionMiddleware } from '@tanstack/start-static-server-functions';
import { getPostgresVersion } from '../lib/db.server';

export const getStaticData = createServerFn({ method: 'GET' })
  .middleware([staticFunctionMiddleware])
  .handler(() => getPostgresVersion());
```

Without prerendering, the middleware saves no result, so the page's client code can't find the saved JSON. In `vite.config.ts`, the scaffold already calls `tanstackStart()`. Replace that call with this one, which prerenders only `/static`. Without these settings, TanStack also prerenders the home page. Its live query would then run at build time:

```typescript filename="vite.config.ts"
tanstackStart({
  pages: [{ path: '/static' }],
  prerender: {
    enabled: true,
    filter: ({ path }) => path === '/static',
  },
}),
```

`pages` is a top-level option of `tanstackStart()`, not a `prerender` key. The filter keeps `/` out of the build.

Keep the other plugins in the array. The build runs the static function while it prerenders `/static`, so the build needs `DATABASE_URL` set too. The saved result stays the same until the next build. See [Static prerendering](https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering) in the TanStack docs.

To see it on a page, add a route that calls it, such as `src/routes/static.tsx`:

```tsx filename="src/routes/static.tsx"
import { createFileRoute } from '@tanstack/react-router';
import { getStaticData } from '../data/static-neon-data';

export const Route = createFileRoute('/static')({
  loader: () => getStaticData(),
  component: Static,
});

function Static() {
  const version = Route.useLoaderData();

  return (
    <>
      <h1>Static database version</h1>
      <p>{version}</p>
    </>
  );
}
```

## Run the app

Check the build, then start the dev server:

```bash filename="Terminal"
npm run build
npm run dev
```

Open the URL that `npm run dev` prints. The page shows your Postgres version, confirming the connection:

```shell shouldWrap
PostgreSQL 18.6 (ac70818) on aarch64-unknown-linux-gnu, compiled by gcc (Ubuntu 13.3.0-6ubuntu2~24.04.1) 13.3.0, 64-bit
```

</Steps>

## Deploy

Set `DATABASE_URL` wherever you build the app and wherever it runs. The build needs it for static server functions, and a built server gets its variables from the environment where it starts. Development reads `.env` and `.env.local`, and `.env.local` wins when both set a variable. To run the built server locally with both env files, run:

```bash filename="Terminal"
npm run build
node --env-file-if-exists=.env --env-file-if-exists=.env.local .output/server/index.mjs
```

`--env-file-if-exists` is stable from Node.js 24.10 and 22.21. Node skips an env file that doesn't exist, so you can have only one of them.

- Use your default branch for production. Get its connection string with `neon connection-string main --pooled` (or `production`), or from **Connect** in the Console.
- The `--deployment nitro` scaffold builds the server to `.output`, the directory the hosting guide runs with `node`. For other hosts, such as Cloudflare, Netlify, Railway, or Vercel, follow [Hosting](https://tanstack.com/start/latest/docs/framework/react/guide/hosting) in the TanStack docs. Run its [production checklist](https://tanstack.com/start/latest/docs/framework/react/guide/production-checklist) before you go live.
- On Vercel, [Integrating Neon with Vercel](/docs/guides/vercel-overview) sets `DATABASE_URL` for you and can create a Neon branch for each preview deployment.

<Admonition type="warning">
Don't prefix `DATABASE_URL` with `VITE_`. Vite only puts `VITE_` variables into browser code, so unprefixed variables stay on the server. Don't return the connection string from a server function.
</Admonition>

## Add more of your backend

Neon's other backend services branch with your database, so a `dev` branch gets its own data for each service. Object Storage, Neon Functions, the AI Gateway, and Realtime need a project in a [supported region](#create-a-neon-project). Add a service with [`neon config add`](/docs/cli/config#add), then provision it with [`neon deploy`](/docs/cli/deploy). For example, to add an Object Storage bucket:

```bash filename="Terminal"
neon config add bucket uploads
neon deploy
```

`neon config add` creates a [`neon.ts`](/docs/reference/neon-ts) file at your project root if you don't have one, installs `@neon/config` and `@neon/env`, and declares the service. `neon deploy` provisions it and writes its variables to your env file (`.env` if it exists, otherwise `.env.local`). Read them with `process.env` in a server function, and set them on your host too.

<DefinitionList>

Managed Better Auth
: Sign-up, sign-in, and sessions stored in your database.
: Add it with `neon config add auth`. See [Managed Better Auth](/docs/auth/overview), and [Use Managed Better Auth with TanStack Router](/docs/auth/quick-start/tanstack-router).

Object Storage
: S3-compatible buckets for uploads and files.
: Add a bucket with `neon config add bucket <name>`. Use it from server functions. See [Neon Object Storage](/docs/storage/overview).

AI Gateway
: One credential for models from Anthropic, OpenAI, Google, and more.
: Add it with `neon config add ai-gateway`. Call models from a server function. See [Neon AI Gateway](/docs/ai-gateway/overview).

Neon Functions
: Long-running Node.js compute next to your database.
: Add one with `neon config add function <slug>`, which also creates its handler file in `functions/`. Use a function for work that outlasts a request, such as agents and webhooks, and call it with `fetch`. See [Neon Functions](/docs/compute/functions/overview).

Realtime (beta)
: Live SQL query subscriptions.
: Add it with `neon config add realtime`. For the TanStack setup, see the [TanStack example](/docs/realtime/examples/tanstack). See also [Neon Realtime](/docs/realtime/overview).

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

`DATABASE_URL is not set. Add it to .env.local.`
: The server can't find `DATABASE_URL`. Check the env file for the name and value, and restart `npm run dev` after you change it. On a host, set the variable in the host's environment.

`SECURITY WARNING` from `pg` about `sslmode=require`
: Current `pg` versions print this for `sslmode=require`. Change it to `sslmode=verify-full` in your env file. See [Connect your app to the project](#connect-your-app-to-the-project).

`Pool` errors such as `Postgres pool error:` in the terminal
: An idle connection dropped, usually after the compute scaled to zero. The error listener in `src/lib/db.server.ts` logs it and keeps the app running. The next query opens a new connection.

Import-protection error for `src/lib/db.server.ts`
: TanStack Start's import protection blocks `.server.ts` files from client code. Only the build fails: `npm run dev` logs a warning and serves a mock instead. Keep every reference to `db.server.ts` inside a server function's handler, as `src/data/get-neon-data.ts` does. The compiler removes handler code, and the imports only it uses, from the browser bundle.

</DefinitionList>

## Next steps

- **Create your first table:** run `neon psql` in your project directory to open a SQL shell on your linked branch, or use an ORM such as [Drizzle](/docs/guides/drizzle) or [Prisma](/docs/guides/prisma) to manage your schema with migrations.
- [Build a full backend with Next.js and Neon](/docs/get-started/full-backend-quickstart): A Next.js walkthrough of Postgres, Object Storage, and a Neon Function declared in one `neon.ts`.
- [Branching](/docs/introduction/branching): Give each preview deployment or pull request its own branch of your database.

## Source code

You can find the source code for example applications that use this guide's patterns on GitHub.

<DetailIconCards>
<a href="https://github.com/neondatabase/examples/tree/main/with-tanstack-start-server-functions" description="Get started with TanStack Start Server Functions and Neon" icon="github">Get started with TanStack Start Server Functions and Neon</a>

<a href="https://github.com/neondatabase/examples/tree/main/with-tanstack-start-static-server-functions" description="Get started with TanStack Start Static Server Functions and Neon" icon="github">Get started with TanStack Start Static Server Functions and Neon</a>
</DetailIconCards>

<NeedHelp/>
