---
title: Connect a React Router application to Neon
subtitle: Create a Neon project, link it with neon link, and query Lakebase Postgres from a React Router route loader with node-postgres, postgres.js, or the Neon serverless driver
summary: >-
  To connect a React Router app to Lakebase Postgres on Neon, create a Neon
  project, run neon link to write DATABASE_URL to your env file, and query it
  from a route loader with node-postgres, postgres.js, or the Neon serverless
  driver. Covers React Router 8 in framework mode on Node.js 22.22 or later with
  TypeScript: an optional Neon development branch and agent skills, deployment,
  troubleshooting, and Neon's other backend services from React Router.
enableTableOfContents: true
updatedOn: '2026-11-20T23:14:28.585Z'
---

<PromptBlock src="/prompts/react-router-prompt.md" labels={["Set up your agent and follow this guide", "Look up React Router's docs", "Connect your React Router app"]} />

<Steps>

## Create a React Router app

Create a project with `create-react-router`, React Router's scaffold, then change into its directory. This guide targets React Router 8 in framework mode, which is the default for new projects:

```bash filename="Terminal"
npx create-react-router@latest my-app --yes --no-git-init
cd my-app
printf '\n.env.local\n' >> .gitignore
```

This creates a TypeScript project, installs its dependencies, and, in React Router 8, adds React Router's agent skill in `.agents/skills/react-router`, all without prompts. It needs [Node.js](https://nodejs.org/en/download) 22.22 or later, which React Router 8 requires. The `.gitignore` the scaffold writes covers `.env` but not `.env.local`, so the `printf` line adds it. That keeps the connection string out of git. `--no-git-init` skips creating a git repository; run `git init` yourself if you want one.

If you're adding Neon to an existing React Router app:

- Keep its React Router version. The steps also work on React Router 7, whose runtime needs Node.js 20 or later and React 18 or later, and whose scaffold doesn't add the agent skill. To move to version 8, follow [React Router's v8 requirements](https://reactrouter.com/upgrading/v7).
- The steps assume framework mode: an app with `@react-router/dev` and an `app/routes.ts` file.
- Make sure its `.gitignore` excludes `.env.local` before you link it (the `printf` line in the command does this).

## Add Neon's agent skills (optional)

Run `npx neon@latest skills` from your project directory to add Neon's [agent skills](/docs/ai/agent-skills), which teach your AI coding agent how to use the Neon CLI, branches, and Neon's backend services. The agent prompt at the top of this page installs them, so skip this step if you used it:

```bash filename="Terminal"
npx neon@latest skills
```

To also connect the [Neon MCP Server](/docs/ai/neon-mcp-server), run `npx neon@latest mcp`.

React Router's docs are at [reactrouter.com](https://reactrouter.com/home), and its [agent skill](https://github.com/remix-run/react-router/tree/main/.agents/skills/react-router) covers the framework's routes, loaders, and modes. React Router 8's scaffold adds the skill to `.agents/skills/react-router`.

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

Get a `DATABASE_URL` into an env file. React Router reads `DATABASE_URL` from `process.env` on the server, and `npm run dev` loads the env files in your project, so you don't need `dotenv`.

<Tabs labels={["Neon CLI", "Without the CLI"]}>

<TabItem>

From your app's directory, link it to the Neon project (install the [Neon CLI](/docs/cli/install) and run `neon login` first if you haven't):

```bash filename="Terminal"
neon link
```

`neon link` prompts you to pick an organization and a project, or to create a new project. Then it:

- writes a `.neon` file with the project context;
- pins a branch (pass `--branch` to choose one);
- pulls that branch's `DATABASE_URL` into `.env.local`, or into `.env` if your project already has one;
- offers to create a [`neon.ts`](/docs/reference/neon-ts) file, which is optional and covered in [Add more of your backend](#add-more-of-your-backend).

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

Keep `DATABASE_URL` in only one env file: if `.env` and `.env.local` both have it, `.env.local` wins.

## Work on a development branch (optional)

Run `neon checkout dev --create` to develop on a branch of your database instead of the default branch, where production data usually lives. The default branch is `main` for projects created with the CLI or API, and `production` for projects created in the Console. A [branch](/docs/introduction/branching) starts from its parent's data and schema without copying them (copy-on-write: only the changes you make are stored), so you can change it freely:

```bash filename="Terminal"
neon checkout dev --create
```

This creates the `dev` branch, pins it in `.neon`, and pulls its `DATABASE_URL` into the same env file, so your app now uses the branch. To switch back, run `neon checkout main` (or `production`).

## Install a Postgres driver

Install one of three Postgres drivers. For a React Router server on Node.js, use [node-postgres](https://node-postgres.com) (`pg`) or [postgres.js](https://github.com/porsager/postgres); both keep a pool of TCP connections open. For serverless and edge hosts, use the [Neon serverless driver](/docs/serverless/serverless-driver), which queries over HTTP. See [Choosing your connection method](/docs/connect/choose-connection).

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

Create one database client for the whole app in `app/db.server.ts`, and import it in your route modules. The `.server` in the file name keeps the module on the server, out of the browser bundle. The file reads `DATABASE_URL` from `process.env`, throws `DATABASE_URL is not set` when the server loads it if the variable is missing, and exports `pool` (node-postgres) or `sql` (postgres.js and the Neon serverless driver):

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```typescript filename="app/db.server.ts"
import pg from 'pg';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not set');

export const pool = new pg.Pool({ connectionString: url });

// An idle connection can drop, for example when the compute scales to zero.
// Without a listener, the pool's error event stops the server.
pool.on('error', (error) => console.error('Postgres pool error:', error.message));
```

```typescript filename="app/db.server.ts"
import postgres from 'postgres';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not set');

export const sql = postgres(url);
```

```typescript filename="app/db.server.ts"
import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not set');

export const sql = neon(url);
```

</CodeTabs>

## Add a route that queries the database

Add a `/version` route that runs `SELECT version()` on the server. A route is a route module: a file under `app/routes/` that exports a `loader`, which is server-side code that runs before the page renders, and a default component, which receives the loader's result as `loaderData`.

First, add the route to `app/routes.ts`. Keep the `index` route that the scaffold wrote:

```typescript filename="app/routes.ts"
import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('version', 'routes/version.tsx'),
] satisfies RouteConfig;
```

Then create `app/routes/version.tsx`. Its loader imports the client from `app/db.server.ts`, and its component renders the version it receives:

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js and Neon serverless driver"]}>

```tsx filename="app/routes/version.tsx"
import type { Route } from './+types/version';
import { pool } from '../db.server';

// The loader runs on the server
export async function loader() {
  const { rows } = await pool.query('SELECT version()');
  return { version: rows[0].version as string };
}

// The component renders on the server for the first page load, then in the browser, with the loader's result as loaderData
export default function Version({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <h1>Database Version</h1>
      <p>{loaderData.version}</p>
    </div>
  );
}
```

```tsx filename="app/routes/version.tsx"
import type { Route } from './+types/version';
import { sql } from '../db.server';

// The loader runs on the server
export async function loader() {
  const [row] = await sql`SELECT version()`;
  return { version: row.version as string };
}

// The component renders on the server for the first page load, then in the browser, with the loader's result as loaderData
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

Generate the route types, then check the project with TypeScript:

```bash filename="Terminal"
npm run typecheck
```

Start the development server:

```bash filename="Terminal"
npm run dev
```

Open [http://localhost:5173/version](http://localhost:5173/version). The terminal shows the address if Vite uses another port because 5173 is taken. The page shows your Postgres version, starting with `PostgreSQL`.

<Admonition type="note">
`npm run dev` loads `.env` and `.env.local` into `process.env`. `npm start` loads neither, so set `DATABASE_URL` in your environment before you start the production server.
</Admonition>

</Steps>

## Deploy

To deploy to a Node.js host, set `DATABASE_URL` in the host's environment, build with `npm run build`, and start with `npm start`. `npm start` runs `react-router-serve`, which listens on the `PORT` variable, and most Node.js hosts set that for you. The scaffold also includes a Dockerfile that builds the app and runs `npm run start` in its final image, so set `DATABASE_URL` as a container environment variable (for example with `docker run -e DATABASE_URL=...`).

- Use your default branch for production. Get its pooled connection string, which goes through Neon's connection pooler and suits many short-lived connections. Run `neon connection-string main --pooled` (or `production`) in your own terminal, since it prints the password, or copy it from **Connect** in the Console.
- Pick the driver for your host:
  - node-postgres or postgres.js: long-running servers, [Vercel Fluid compute](https://vercel.com/docs/functions/fluid-compute) (which reuses function instances across requests), and Cloudflare Workers with [Hyperdrive](https://developers.cloudflare.com/hyperdrive/) (Cloudflare's connection pooler).
  - The Neon serverless driver: serverless platforms that don't keep connections open, such as Netlify Functions or Cloudflare Workers without Hyperdrive.

  See [Choosing your connection method](/docs/connect/choose-connection).

- On Vercel, the [Neon integration](/docs/guides/vercel-overview) sets `DATABASE_URL` for you and can create a Neon branch for each preview deployment.

## Add more of your backend

Add a Neon backend service to your React Router app with [`neon config add`](/docs/cli/config#add), then provision it with [`neon deploy`](/docs/cli/deploy). Each service branches with your database, so a `dev` branch gets its own data for each service. Object Storage, Neon Functions, the AI Gateway, and Realtime need a project in a [supported region](#create-a-neon-project). For example, to add an Object Storage bucket:

```bash filename="Terminal"
neon config add bucket uploads
neon deploy
```

`neon config add` creates a [`neon.ts`](/docs/reference/neon-ts) file at your project root if you don't have one, installs `@neon/config` and `@neon/env`, and declares the service. `neon deploy` provisions it and writes its variables to your env file (`.env` if it exists, otherwise `.env.local`). The `dev` script loads them into `process.env`, so SDKs that read `process.env` find them. Set them on your host too.

<DefinitionList>

Managed Better Auth
: Sign-up, sign-in, and sessions stored in your database.
: Add it with `neon config add auth`. See [Managed Better Auth](/docs/auth/overview).

Object Storage
: S3-compatible buckets for uploads and files.
: Add a bucket with `neon config add bucket <name>`. In React Router, use it from a route's `action` or `loader`. See [Object Storage](/docs/storage/overview).

AI Gateway
: One credential for models from Anthropic, OpenAI, Google, and more.
: Add it with `neon config add ai-gateway`. In React Router, call models from a route's `action` or `loader`. See [AI Gateway](/docs/ai-gateway/overview).

Neon Functions
: Long-running Node.js compute next to your database.
: Add one with `neon config add function <slug>`, which also creates its handler file in `functions/`. Use a function for work that outlasts a request on your React Router host, such as agents and webhooks, and call it with `fetch`. See [Neon Functions](/docs/compute/functions/overview).

Realtime (beta)
: Live SQL query subscriptions.
: Add it with `neon config add realtime`. In a route's loader, [seal](/docs/realtime/guides/queries#sealing-queries) the live query with `@neon/realtime/server` and `NEON_REALTIME_SECRET`: sealing signs the query so the browser can subscribe to it but can't change it. Return the sealed query, and `NEON_REALTIME_URL`, from the loader; the browser subscribes with `@neon/realtime/client`, and for React see the [Realtime React SDK](/docs/realtime/sdks/typescript/react). Keep the secret on the server. See [Realtime](/docs/realtime/overview).

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
: The server started without `DATABASE_URL`, so `app/db.server.ts` threw when the server loaded it. React Router loads every route module at startup, so the error stops the whole app: in development, every page returns an error, and `npm start` exits. Locally, check that `.env.local` or `.env` has the variable, or run `neon env pull`, then restart `npm run dev`. With `npm start` or on a host, set it in the environment.

`Endpoint ID is not specified`
: The client doesn't send Server Name Indication (SNI), which Neon uses to route connections. Current node-postgres and postgres.js send SNI, so this usually means an older client or a libpq older than Postgres 14. If upgrading doesn't fix it, append `&options=endpoint%3D<endpoint-id>` to `DATABASE_URL` (use `?` instead of `&` if the URL has no query string). The endpoint ID is the first part of the host name without `-pooler`, for example `ep-cool-darkness-123456`. See [The endpoint ID is not specified](/docs/connect/connection-errors#the-endpoint-id-is-not-specified).

`SSL SYSCALL error: EOF detected`, or a similar connection-reset error
: The app reused a connection after the Neon compute was suspended for inactivity. This mainly affects node-postgres, which keeps a pool of connections open. The `pool.on('error')` listener in `app/db.server.ts` keeps it from stopping the server. The request that hits the closed connection can fail; the next request opens a new connection, so retrying the request resolves it. The Neon serverless driver isn't affected, since it opens a new HTTP connection per query.

Error page on `/version`
: The loader threw an error, and the terminal running the app logs it. Read the logged error for the cause, such as a `DATABASE_URL` that doesn't point to your project.

</DefinitionList>

## Next steps

- **Create your first table:** run `neon psql` in your project directory to open a SQL shell on your linked branch, or use an ORM such as [Drizzle](/docs/guides/drizzle) or [Prisma](/docs/guides/prisma) to manage your schema with migrations.
- [Build a full backend with Next.js and Neon](/docs/get-started/full-backend-quickstart): A Next.js walkthrough of Postgres, Object Storage, and a Neon Function declared in one `neon.ts`.
- [Branching](/docs/introduction/branching): Give each preview deployment or pull request its own branch of your database.

<NeedHelp/>
