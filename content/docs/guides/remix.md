---
title: Connect a Remix application to Neon
subtitle: Create a Neon project, link it with neon link, and query Lakebase Postgres from a Remix route loader with node-postgres, postgres.js, or the Neon serverless driver
summary: >-
  To connect an existing Remix v2 app to Lakebase Postgres on Neon, create a Neon
  project, run neon link to write DATABASE_URL to your env file, and query it
  from a route loader in a server-only module with node-postgres, postgres.js,
  or the Neon serverless driver. Covers Remix v2 apps on Vite or the classic compiler, optional Neon
  development branch and agent skills, deployment, troubleshooting, and Neon's
  other backend services from Remix. Remix v2 is end of life, so new projects
  should use React Router.
enableTableOfContents: true
updatedOn: '2026-11-20T23:37:18.475Z'
---

<PromptBlock src="/prompts/remix-prompt.md" labels={["Set up your agent and follow this guide", "Look up Remix's docs", "Connect your Remix app"]} />

<Admonition type="note">
Remix v2 was merged into React Router and reached end of life with the React Router v8 release (June 17, 2026), so it no longer gets security updates. This guide covers existing Remix v2 applications. For a new project, use the [React Router guide](/docs/guides/react-router). To move an existing app to React Router, follow the [Remix upgrade guide](https://reactrouter.com/upgrading/remix). Remix 3 is a different framework, which this guide doesn't cover.
</Admonition>

[Remix](https://remix.run) v2 is a full-stack React framework whose route loaders and actions run on the server. This guide connects an existing Remix v2 app on Vite (one whose `package.json` depends on `@remix-run/react` 2.x and that has a `vite.config.ts` or `vite.config.js` file) to Lakebase Postgres on Neon. On the classic Remix compiler, `remix dev` reads only `.env`, so create an empty `.env` before you run `neon link` (it then writes there), and open the app on port 3000.

<Steps>

## Add Neon's agent skills (optional)

Run `npx neon@latest skills` from your Remix project directory to add Neon's [agent skills](/docs/ai/agent-skills), which teach your AI coding agent how to use the Neon CLI, branches, and Neon's backend services. The agent prompt at the top of this page installs them, so skip this step if you used it:

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

Get a `DATABASE_URL` into an env file in your Remix project directory. `npm run dev` loads both `.env` and `.env.local`, so you don't need `dotenv`. Add `.env.local` to `.gitignore` so the connection string stays out of git:

```bash filename="Terminal"
printf '\n.env.local\n' >> .gitignore
```

<Tabs labels={["Neon CLI", "Without the CLI"]}>

<TabItem>

From your project directory, link it to the Neon project (install the [Neon CLI](/docs/cli/install) and run `neon login` first if you haven't):

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

Install one of three Postgres drivers with `npm install`: [node-postgres](https://node-postgres.com) (`pg`), [postgres.js](https://github.com/porsager/postgres), or the [Neon serverless driver](/docs/serverless/serverless-driver). For a Remix server on Node.js, use node-postgres or postgres.js; both keep a pool of TCP connections open. For serverless and edge hosts, use the [Neon serverless driver](/docs/serverless/serverless-driver), which queries over HTTP. See [Choosing your connection method](/docs/connect/choose-connection).

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

If you use node-postgres, current `pg` versions print a `SECURITY WARNING` for `sslmode=require`. Change it to `sslmode=verify-full` in `.env` or `.env.local`, whichever holds `DATABASE_URL`, to keep the same behavior without the warning. `neon link`, `neon checkout`, `neon env pull`, and `neon deploy` write `sslmode=require` again, so repeat the change after you run them.

## Create the database client

Create one database client for the whole app in `app/db.server.ts`, and import it in your routes. The `.server` suffix keeps the file out of the browser bundle, so the connection string never reaches the browser. The file reads `DATABASE_URL` from `process.env`, throws `DATABASE_URL is not set` when it loads if the variable is missing, and exports `pool` (node-postgres) or `sql` (postgres.js and the Neon serverless driver). Neon scales a compute to zero after a period of inactivity, which closes its open connections, so the node-postgres pool listens for errors on idle connections:

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```typescript filename="app/db.server.ts"
import pg from 'pg';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not set');

export const pool = new pg.Pool({ connectionString: url });

// Without a listener, an idle connection that drops stops the app.
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

## Query the database from a route

Create `app/routes/version.tsx`. Remix maps this file to the `/version` path, and `~/` in the import maps to `app/`, as in the default Remix template. Its `loader` runs on the server and queries Postgres with the `pool` or `sql` client that `app/db.server.ts` exports, so the query stays out of the browser bundle. The component renders the result. If `/version` is already taken, use another file name, since the file name sets the path. The postgres.js and Neon serverless driver samples are the same code, since both export `sql`.

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js or Neon serverless driver"]}>

```typescript filename="app/routes/version.tsx"
import { useLoaderData } from '@remix-run/react';
import { pool } from '~/db.server';

export const loader = async () => {
  const { rows } = await pool.query('SELECT version()');
  return { version: rows[0].version as string };
};

export default function Version() {
  const { version } = useLoaderData<typeof loader>();
  return <p>{version}</p>;
}
```

```typescript filename="app/routes/version.tsx"
import { useLoaderData } from '@remix-run/react';
import { sql } from '~/db.server';

export const loader = async () => {
  const [row] = await sql`SELECT version()`;
  return { version: row.version as string };
};

export default function Version() {
  const { version } = useLoaderData<typeof loader>();
  return <p>{version}</p>;
}
```

</CodeTabs>

If a loader throws, Remix shows the route's error boundary and logs the error in the terminal, and the server keeps running.

## Run the app

Start the development server with `npm run dev`. It loads `.env` and `.env.local`, so the app can read `DATABASE_URL`. Open [localhost:5173/version](http://localhost:5173/version), the port Vite uses in development. The page shows your Postgres version string, which starts with `PostgreSQL`:

```text shouldWrap
PostgreSQL 18.7 on aarch64-unknown-linux-gnu, compiled by gcc ...
```

</Steps>

## Deploy

To deploy, set `DATABASE_URL` in the host's environment, not in a committed env file, then build with `npm run build` and start the server with `npm start`. The Vite template's `start` script runs `remix-serve`, which doesn't read env files, so the host's environment must set `DATABASE_URL`.

- Use your default branch for production. Get its pooled connection string, which goes through Neon's connection pooler and suits many short-lived connections. Run `neon connection-string main --pooled` (or `production`) in your own terminal, since it prints the password, or copy it from **Connect** in the Console.
- Pick the driver for your host:
  - node-postgres or postgres.js: long-running servers, [Vercel Fluid compute](https://vercel.com/docs/functions/fluid-compute) (which reuses function instances across requests), and Cloudflare Workers with [Hyperdrive](https://developers.cloudflare.com/hyperdrive/) (Cloudflare's connection pooler).
  - The Neon serverless driver: serverless platforms that don't keep connections open, such as Netlify Functions or Cloudflare Workers without Hyperdrive.

  See [Choosing your connection method](/docs/connect/choose-connection).

- On Vercel, the [Neon integration](/docs/guides/vercel-overview) sets `DATABASE_URL` for you and can create a Neon branch for each preview deployment.

## Add more of your backend

Add a Neon backend service to your Remix app with [`neon config add`](/docs/cli/config#add), then provision it with [`neon deploy`](/docs/cli/deploy). Each service branches with your database, so a `dev` branch gets its own data for each service. Object Storage, Neon Functions, the AI Gateway, and Realtime need a project in a [supported region](#create-a-neon-project). For example, to add an Object Storage bucket:

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
: Add a bucket with `neon config add bucket <name>`. In Remix, use it from loaders and actions. See [Object Storage](/docs/storage/overview).

AI Gateway
: One credential for models from Anthropic, OpenAI, Google, and more.
: Add it with `neon config add ai-gateway`. In Remix, call models from loaders and actions. See [AI Gateway](/docs/ai-gateway/overview).

Neon Functions
: Long-running Node.js compute next to your database.
: Add one with `neon config add function <slug>`, which also creates its handler file in `functions/`. Use a function for work that outlasts a request on your Remix host, such as agents and webhooks, and call it with `fetch`. See [Neon Functions](/docs/compute/functions/overview).

Realtime (beta)
: Live SQL query subscriptions.
: Add it with `neon config add realtime`. In a Remix loader, [seal](/docs/realtime/guides/queries#sealing-queries) the live query with `@neon/realtime/server` and `NEON_REALTIME_SECRET`: sealing signs the query so the browser can subscribe to it but can't change it. Return the sealed query, and `NEON_REALTIME_URL`, from the loader; the browser subscribes with `@neon/realtime/client`. Keep the secret on the server. See [Realtime](/docs/realtime/overview).

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
: The app started without `DATABASE_URL`, so the route returns a `500` response and the terminal logs this error. Start the app with `npm run dev` from the project directory so the env files load, and check that one of them has the variable, or run `neon link` again. In a deployed app, set the variable in the host's environment.

`SSL SYSCALL error: EOF detected`, or a similar connection-reset error
: The app reused a connection after the Neon compute was suspended for inactivity. This mainly affects long-running servers that keep a connection pool open, like the node-postgres example. The `pool.on('error')` listener in `app/db.server.ts` keeps it from stopping the app. The request that hits the closed connection can fail with a `500`; the next request opens a new connection, so retrying the request resolves it. The Neon serverless driver isn't affected, since it opens a new HTTP connection per query.

`500 Internal Server Error` from a route
: A loader or action threw an error, and Remix logged it in the terminal where the app runs. Read the logged error for the cause, such as a `DATABASE_URL` that doesn't point to your project.

</DefinitionList>

## Next steps

- **Create your first table:** run `neon psql` in your project directory to open a SQL shell on your linked branch, or use an ORM such as [Drizzle](/docs/guides/drizzle) or [Prisma](/docs/guides/prisma) to manage your schema with migrations.
- [Build a full backend with Next.js and Neon](/docs/get-started/full-backend-quickstart): A Next.js walkthrough of Postgres, Object Storage, and a Neon Function declared in one `neon.ts`.
- [Branching](/docs/introduction/branching): Give each preview deployment or pull request its own branch of your database.

<NeedHelp/>
