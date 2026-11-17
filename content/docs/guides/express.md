---
title: Connect an Express application to Neon
subtitle: Connect an Express app to Lakebase Postgres on Neon, query it from a route, develop on a branch, deploy, and add the rest of your backend
summary: >-
  Connect an Express 5 app to Lakebase Postgres on Neon: optionally add Neon's
  agent skills, create a Neon project (Neon CLI, API, or Console), link it with
  the Neon CLI to pull DATABASE_URL into .env.local, load it with Node's
  --env-file-if-exists flags instead of dotenv, optionally develop on a Neon
  branch, and query it with node-postgres, postgres.js, or the Neon serverless
  driver from an Express route. Covers Node.js 24 with ES modules, plus
  deployment, troubleshooting, and Neon's other backend services from Express.
enableTableOfContents: true
updatedOn: '2026-11-17T17:17:09.707Z'
---

<PromptBlock src="/prompts/express-prompt.md" labels={["Set up your agent and follow this guide", "Look up Express's docs", "Connect your Express app"]} />

<Steps>

## Create an Express app

Install [Node.js](https://nodejs.org/en/download) 24 or later if you don't have it, then create a project if you don't have one:

```bash filename="Terminal"
mkdir my-app
cd my-app
npm init -y
npm install express
npm pkg set type=module
printf 'node_modules\n.env\n.env.local\n' > .gitignore
```

This guide uses Express 5 with ES modules. `npm init -y` creates a CommonJS project, so `npm pkg set type=module` switches it to `import` syntax. The `.gitignore` keeps your dependencies and your env files, which will hold the connection string, out of git.

If you're adding Neon to an existing app that uses `require()`, keep it CommonJS: don't run `npm pkg set type=module`, which would break its `require()` calls. Write the files below with `require()` in place of `import`, and for postgres.js use `require('postgres').default`. If your app is on Express 4, see Express 4 in [Troubleshooting](#troubleshooting).

## Add Neon's agent skills (optional)

If your AI coding agent doesn't have Neon's [agent skills](/docs/ai/agent-skills) yet, add them to this project. The prompt above installs them, so skip this step if you used it. From your project directory, run:

```bash filename="Terminal"
npx neon@latest skills
```

To also connect the [Neon MCP Server](/docs/ai/neon-mcp-server), run `npx neon@latest mcp`.

Express publishes its docs for AI agents at [expressjs.com/llms.txt](https://expressjs.com/llms.txt). The prompt above has your agent look up Express docs there.

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

Get a `DATABASE_URL` into an env file. Express doesn't read env files itself: the `dev` script in [Run the app](#run-the-app) loads them with Node's `--env-file-if-exists` flags, so you don't need `dotenv`.

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

Keep `DATABASE_URL` in only one env file: if `.env` and `.env.local` both have it, `.env.local` wins.

## Work on a development branch (optional)

If you linked your project's default branch, your app uses the branch where production data usually lives. That's `main` for projects created with the CLI or API, and `production` for projects created in the Console. Create a [branch](/docs/introduction/branching) for local development instead. A branch starts from its parent's data and schema with copy-on-write, so you can change it freely:

```bash filename="Terminal"
neon checkout dev --create
```

This creates the `dev` branch, pins it in `.neon`, and pulls its `DATABASE_URL` into the same env file, so your app now uses the branch. To switch back, run `neon checkout main` (or `production`).

## Install a Postgres driver

[node-postgres](https://node-postgres.com) (`pg`) suits a long-running Express server, and [postgres.js](https://github.com/porsager/postgres) works there too. The [Neon serverless driver](/docs/serverless/serverless-driver) queries over HTTP, which suits serverless and edge hosts. See [Choosing your connection method](/docs/connect/choose-connection).

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```bash
npm install pg
```

```bash
npm install postgres
```

```bash
npm install @neondatabase/serverless
```

</CodeTabs>

If you use node-postgres, `pg` 8.23 and later print a `SECURITY WARNING` for `sslmode=require`. Change it to `sslmode=verify-full` in your env file to keep the same behavior without the warning. `neon env pull` and `neon checkout` write `sslmode=require` again, so repeat the change after you run them.

## Create the database client

Create the client once for the whole app, in `db.js`, rather than in each route. It reads `DATABASE_URL` from `process.env` and stops the app at startup if the variable isn't set:

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```javascript filename="db.js"
import pg from 'pg';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not set');

export const pool = new pg.Pool({ connectionString: url });

// An idle connection can drop, for example when the compute scales to zero.
// Without a listener, the pool's error event stops the app.
pool.on('error', (error) => console.error('Postgres pool error:', error.message));
```

```javascript filename="db.js"
import postgres from 'postgres';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not set');

export const sql = postgres(url);
```

```javascript filename="db.js"
import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not set');

export const sql = neon(url);
```

</CodeTabs>

## Query the database from a route

Serve the query from an Express route in `index.js`. If your app doesn't have an `index.js` yet, create it. If it already has a `/` route, add a route such as `/neon` instead so you don't replace one of yours. The route returns the version as JSON:

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```javascript filename="index.js"
import express from 'express';
import { pool } from './db.js';

const app = express();
const port = process.env.PORT ?? 3000;

app.get('/', async (req, res) => {
  const { rows } = await pool.query('SELECT version()');
  res.json({ version: rows[0].version });
});

app.listen(port, (error) => {
  if (error) throw error;
  console.log(`Listening on http://localhost:${port}`);
});
```

```javascript filename="index.js"
import express from 'express';
import { sql } from './db.js';

const app = express();
const port = process.env.PORT ?? 3000;

app.get('/', async (req, res) => {
  const [row] = await sql`SELECT version()`;
  res.json({ version: row?.version });
});

app.listen(port, (error) => {
  if (error) throw error;
  console.log(`Listening on http://localhost:${port}`);
});
```

```javascript filename="index.js"
import express from 'express';
import { sql } from './db.js';

const app = express();
const port = process.env.PORT ?? 3000;

app.get('/', async (req, res) => {
  const [row] = await sql`SELECT version()`;
  res.json({ version: row?.version });
});

app.listen(port, (error) => {
  if (error) throw error;
  console.log(`Listening on http://localhost:${port}`);
});
```

</CodeTabs>

The routes don't need `try...catch`: Express 5 passes an error from an `async` route to its error handler, which responds with a `500` and keeps the server running.

## Run the app

Add `dev` and `start` scripts. `dev` loads your env files and restarts the server when you edit a file; `start` runs the server the way your host will:

```bash filename="Terminal"
npm pkg set scripts.dev="node --watch --env-file-if-exists=.env --env-file-if-exists=.env.local index.js"
npm pkg set scripts.start="node index.js"
npm run dev
```

Node prints a notice such as `.env not found. Continuing without it.` for an env file you don't have; that's expected. Open [localhost:3000](http://localhost:3000), or the port in `PORT` if you set one. The response shows your Postgres version, confirming the connection:

```json
{"version":"PostgreSQL 18.6 (fd34222) on aarch64-unknown-linux-gnu, compiled by gcc ..."}
```

</Steps>

## Deploy

Set `DATABASE_URL` everywhere your app runs.

- Use your default branch for production. Get its connection string with `neon connection-string main --pooled` (or `production`), or from **Connect** in the Console.
- Start the server with `npm start`. It doesn't load env files, so set `DATABASE_URL` in your host's environment. Locally, a variable set in your shell also takes priority over the `dev` script's env files.
- Most Node.js hosts set `PORT` for you, and the app listens on it.
- On Vercel, Express apps deploy with [zero configuration](https://vercel.com/docs/frameworks/backend/express). The [Neon integration](/docs/guides/vercel-overview) sets `DATABASE_URL` for you and can create a Neon branch for each preview deployment.

## Add more of your backend

Neon's other backend services branch with your database. Object Storage, Neon Functions, the AI Gateway, and Realtime need a project in a [supported region](#create-a-neon-project). Add a service with [`neon config add`](/docs/cli/config#add), then provision it with [`neon deploy`](/docs/cli/deploy). For example, to add an Object Storage bucket:

```bash filename="Terminal"
neon config add bucket uploads
neon deploy
```

`neon config add` creates a [`neon.ts`](/docs/reference/neon-ts) file at your project root if you don't have one, installs `@neon/config` and `@neon/env`, and declares the service. `neon deploy` provisions it and writes its variables to `.env.local`. The `dev` script loads them into `process.env`, so SDKs that read `process.env` find them. Set them on your host too.

<DefinitionList>

Managed Better Auth
: Sign-up, sign-in, and sessions stored in your database.
: Add it with `neon config add auth`. See [Managed Better Auth](/docs/auth/overview).

Object Storage
: S3-compatible buckets for uploads and files.
: Add a bucket with `neon config add bucket <name>`. In Express, use it from route handlers. See [Object Storage](/docs/storage/overview).

AI Gateway
: One credential for models from Anthropic, OpenAI, Google, and more.
: Add it with `neon config add ai-gateway`. In Express, call models from route handlers. See [AI Gateway](/docs/ai-gateway/overview).

Neon Functions
: Long-running Node.js compute next to your database.
: Add one with `neon config add function <slug>`, which also creates its handler file in `functions/`. Use a function for work that outlasts a request on your Express host, such as agents and webhooks, and call it with `fetch`. See [Neon Functions](/docs/compute/functions/overview).

Realtime (beta)
: Live SQL query subscriptions.
: Add it with `neon config add realtime`. In Express, seal live queries in a route with `NEON_REALTIME_SECRET`, then subscribe from the browser with `NEON_REALTIME_URL`. Keep the secret on the server. See [Realtime](/docs/realtime/overview).

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
: The app started without `DATABASE_URL`. Locally, start it with `npm run dev` so the env files load, and check that one of them has the variable, or run `neon env pull`. With `npm start` or on a host, set it in the environment.

`Error: listen EADDRINUSE: address already in use :::3000`
: Another server, often an earlier `npm run dev`, is still using the port. Stop it, or set `PORT` to use another port.

`SyntaxError: Cannot use import statement outside a module`
: The project is still CommonJS. Run `npm pkg set type=module`.

Express 4
: Express 4 doesn't pass errors from `async` routes to its error handler, so on current Node.js versions a failed query stops the app. Wrap each route's body in `try...catch` and pass the error to `next(error)`, or upgrade with the [Express 5 migration guide](https://expressjs.com/en/guide/migrating-5.html).

</DefinitionList>

## Next steps

- **Create your first table:** run `neon psql` in your project directory to open a SQL shell on your linked branch, or use an ORM such as [Drizzle](/docs/guides/drizzle) or [Prisma](/docs/guides/prisma) to manage your schema with migrations.
- [Build a full backend](/docs/get-started/full-backend-quickstart): Postgres, Object Storage, and a Neon Function declared in one `neon.ts`.
- [Branching](/docs/introduction/branching): Give each preview deployment or pull request its own copy of your database.

<NeedHelp/>
