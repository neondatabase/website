---
title: Connect an Astro application to Neon
subtitle: Connect an Astro app to Lakebase Postgres on Neon, query it in an on-demand page, develop on a branch, deploy, and add the rest of your backend
summary: >-
  Connect an Astro app to Lakebase Postgres on Neon: optionally add Neon's agent
  skills, create a Neon project (Neon CLI, API, or Console), link it with the
  Neon CLI to pull DATABASE_URL into .env.local, optionally develop on a Neon
  branch, add the Node adapter, declare DATABASE_URL with astro:env, and query it
  with node-postgres, postgres.js, or the Neon serverless driver from a
  server-only module in the frontmatter of an on-demand page. Covers Astro 7,
  with a note for Astro 6, plus deployment, troubleshooting, and Neon's other
  backend services from Astro.
enableTableOfContents: true
updatedOn: '2026-11-27T01:39:33.820Z'
---

<PromptBlock src="/prompts/astro-serverless-prompt.md" labels={["Set up your agent and follow this guide", "Use Astro's docs MCP server (optional)", "Connect your Astro app"]} />

<Steps>

## Create an Astro app

Create an Astro project if you don't have one, then change into its directory. For other options, see [Install Astro](https://docs.astro.build/en/install-and-setup/) in the Astro docs.

```bash filename="Terminal"
npm create astro@latest my-app -- --template minimal --install --yes
cd my-app
```

Astro 7 needs Node.js 22.23.4 or later. `--yes` accepts the defaults, so the command runs without prompts and also creates a git repository. New projects include an `AGENTS.md` file for AI coding agents.

## Add Neon's agent skills (optional)

If your AI coding agent doesn't have Neon's [agent skills](/docs/ai/agent-skills) yet, add them to this project. The prompt above installs them, so skip this step if you used it. From your project directory, run:

```bash filename="Terminal"
npx neon@latest skills
```

To also connect the [Neon MCP Server](/docs/ai/neon-mcp-server), run `npx neon@latest mcp`.

Astro runs its own [docs MCP server](https://docs.astro.build/en/guides/build-with-ai/), which lets your agent search the Astro docs. The prompt above has your agent use it and offer to connect it.

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

Get a `DATABASE_URL` into an env file. In development, Astro loads `.env` and `.env.local`, and the `astro:env` step below declares the variable so your server code can read it.

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

Astro's scaffolded `.gitignore` excludes `.env` but not `.env.local`. When `neon link` writes `.env.local`, it adds the file to `.gitignore`, so the connection string stays out of git. If you created `.env.local` yourself, add it to `.gitignore`. Keep `DATABASE_URL` in only one env file.

## Work on a development branch (optional)

If you linked your project's default branch, your app uses the branch where production data usually lives. That's `main` for projects created with the CLI or API, and `production` for projects created in the Console. Create a [branch](/docs/introduction/branching) for local development instead. A branch starts from its parent's data and schema with copy-on-write, so you can change it freely:

```bash filename="Terminal"
neon checkout dev --create
```

This creates the `dev` branch, pins it in `.neon`, and pulls its `DATABASE_URL` into the same env file, so your app now uses the branch. To switch back, run `neon checkout main` (or `production`).

## Add the Node adapter

Astro prerenders pages at build time by default. To query the database on each request, a page has to render on demand, which needs an [adapter](https://docs.astro.build/en/guides/on-demand-rendering/). Add the Node adapter:

```bash filename="Terminal"
npx astro add node
```

`astro add` installs `@astrojs/node` and adds it to `astro.config.mjs`. To do it by hand, run `npm install @astrojs/node` and add the adapter as shown in the next step. To deploy somewhere other than a Node.js server, see [Deploy](#deploy).

## Declare the connection string

Declare `DATABASE_URL` in `astro.config.mjs` with [`astro:env`](https://docs.astro.build/en/guides/environment-variables/), as a server secret. Server secrets aren't part of your build output, and only server code can import them:

```javascript filename="astro.config.mjs"
// @ts-check
import { defineConfig, envField } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  adapter: node({ mode: 'standalone' }),
  env: {
    schema: {
      DATABASE_URL: envField.string({ context: 'server', access: 'secret' }),
    },
  },
});
```

The build doesn't need `DATABASE_URL`. Astro checks it when the server reads it, so the running app fails if it isn't set. See [Deploy](#deploy).

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

## Create the database client

Create the client in `src/lib/db.ts`. It reads `DATABASE_URL` from `astro:env/server`, so import it only from server code, such as page frontmatter and endpoints:

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```typescript filename="src/lib/db.ts"
import pg from 'pg';
import { DATABASE_URL } from 'astro:env/server';

export const pool = new pg.Pool({ connectionString: DATABASE_URL });
```

```typescript filename="src/lib/db.ts"
import postgres from 'postgres';
import { DATABASE_URL } from 'astro:env/server';

export const sql = postgres(DATABASE_URL);
```

```typescript filename="src/lib/db.ts"
import { neon } from '@neondatabase/serverless';
import { DATABASE_URL } from 'astro:env/server';

export const sql = neon(DATABASE_URL);
```

</CodeTabs>

## Query the database in a page

Query in a page's frontmatter, which runs on the server. If `src/pages/index.astro` is still Astro's starter page, replace it. Otherwise, add a new page such as `src/pages/neon.astro` so you don't replace one of yours. `export const prerender = false` makes the page render on each request:

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```astro filename="src/pages/index.astro"
---
import { pool } from '../lib/db';

export const prerender = false;

const { rows } = await pool.query('SELECT version()');
const version: string = rows[0].version;
---

<h1>Database version</h1>
<p>{version}</p>
```

```astro filename="src/pages/index.astro"
---
import { sql } from '../lib/db';

export const prerender = false;

const [row] = await sql`SELECT version()`;
const version: string = row.version;
---

<h1>Database version</h1>
<p>{version}</p>
```

```astro filename="src/pages/index.astro"
---
import { sql } from '../lib/db';

export const prerender = false;

const [row] = await sql`SELECT version()`;
const version: string = row.version;
---

<h1>Database version</h1>
<p>{version}</p>
```

</CodeTabs>

To return data as JSON instead, query the same client from an [endpoint](https://docs.astro.build/en/guides/endpoints/), such as `src/pages/api/version.ts`, with `export const prerender = false`.

<Admonition type="note" title="Using Astro 6?">
The steps are the same, with two differences. Astro 6 needs Node.js 22.12 or later, and uses `@astrojs/node` 10 (`npm install @astrojs/node@10`). Stop the dev server with **Ctrl+C**. `astro dev stop` is new in Astro 7, and in Astro 6 it starts another dev server instead.
</Admonition>

## Run the app

Install Astro's type checker, check types, then start the dev server:

```bash filename="Terminal"
npm install -D @astrojs/check typescript
npx astro check
npm run dev
```

Open the URL `npm run dev` prints, usually [localhost:4321](http://localhost:4321). The page shows your Postgres version, confirming the connection:

```text
Database version
PostgreSQL 18.6 (fd34222) on aarch64-unknown-linux-gnu, compiled by gcc ...
```

When an AI coding agent runs `astro dev` on macOS or Linux, Astro 7 starts the server in the background. Stop it with `npx astro dev stop`.

</Steps>

## Deploy

Set `DATABASE_URL` everywhere your app runs. The build doesn't need it, and Astro reads it at runtime.

- Use your default branch for production. Get its connection string with `neon connection-string main --pooled` (or `production`), or from **Connect** in the Console.
- With the Node adapter, build the app, then start the server with `DATABASE_URL` in its environment. For example, load it from your env file with Node's `--env-file` flag:

  ```bash filename="Terminal"
  npm run build
  node --env-file=.env.local ./dist/server/entry.mjs
  ```

- To deploy to another host, swap the adapter, for example with `npx astro add vercel`, `npx astro add netlify`, or `npx astro add cloudflare`. See [Deploy your Astro site](https://docs.astro.build/en/guides/deploy/).
- On Vercel, the [Neon integration](/docs/guides/vercel-overview) sets `DATABASE_URL` for you and can create a Neon branch for each preview deployment.

## Add more of your backend

Neon's other backend services branch with your database. Object Storage, Neon Functions, the AI Gateway, and Realtime need a project in a [supported region](#create-a-neon-project). Add a service with [`neon config add`](/docs/cli/config#add), then provision it with [`neon deploy`](/docs/cli/deploy). For example, to add an Object Storage bucket:

```bash filename="Terminal"
neon config add bucket uploads
neon deploy
```

`neon config add` creates a [`neon.ts`](/docs/reference/neon-ts) file at your project root if you don't have one, installs `@neon/config` and `@neon/env`, and declares the service. `neon deploy` provisions it and writes its variables to `.env.local`. To read a variable in Astro, declare it in `env.schema` in `astro.config.mjs` as you did `DATABASE_URL`, import it from `astro:env/server`, and pass it to SDKs. Set it on your host too.

<DefinitionList>

Managed Better Auth
: Sign-up, sign-in, and sessions stored in your database.
: Add it with `neon config add auth`. See [Managed Better Auth](/docs/auth/overview).

Object Storage
: S3-compatible buckets for uploads and files.
: Add a bucket with `neon config add bucket <name>`. In Astro, use it from server code, such as endpoints and [Actions](https://docs.astro.build/en/guides/actions/). See [Object Storage](/docs/storage/overview).

AI Gateway
: One credential for models from Anthropic, OpenAI, Google, and more.
: Add it with `neon config add ai-gateway`. In Astro, call models from server code, such as an endpoint. See [AI Gateway](/docs/ai-gateway/overview).

Neon Functions
: Long-running Node.js compute next to your database.
: Add one with `neon config add function <slug>`, which also creates its handler file in `functions/`. Use a function for work that outlasts a request on your Astro host, such as agents and webhooks, and call it with `fetch`. For a static Astro site with no adapter, a function can be the site's whole API: see [Add a backend API to a frontend app](/docs/compute/functions/frontend-api). See [Neon Functions](/docs/compute/functions/overview).

Realtime (beta)
: Live SQL query subscriptions.
: Add it with `neon config add realtime`. In Astro, seal live queries in server code, such as page frontmatter, with `NEON_REALTIME_SECRET`, then subscribe from the browser with `NEON_REALTIME_URL`. Declare the URL with `context: 'client', access: 'public'` and import it from `astro:env/client`. Keep the secret a server secret. See [Realtime](/docs/realtime/overview).

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

``[EnvInvalidVariables] The following environment variables defined in `env.schema` are invalid: - DATABASE_URL is missing``
: The running app doesn't have `DATABASE_URL` set, so the page returns a 500 error. Locally, check that your env file has it, or run `neon env pull`. When you run the built server, pass it in, for example with `node --env-file=.env.local`. On a host, set it in the host's environment.

`Cannot find module '@astrojs/node'`
: `astro.config.mjs` imports the Node adapter, but it isn't installed. Run `npx astro add node`, or `npm install @astrojs/node`.

`Another astro dev server is already running.`
: An Astro 7 dev server started in the background, for example by an AI agent, is still running. The error shows its URL and process ID. Stop it with `npx astro dev stop`, or replace it with `npx astro dev --force`. Check it with `npx astro dev status`.

</DefinitionList>

## Next steps

- **Create your first table:** run `neon psql` in your project directory to open a SQL shell on your linked branch, or use an ORM such as [Drizzle](/docs/guides/drizzle) or [Prisma](/docs/guides/prisma) to manage your schema with migrations.
- [Build a full backend](/docs/get-started/full-backend-quickstart): Postgres, Object Storage, and a Neon Function declared in one `neon.ts`.
- [Branching](/docs/introduction/branching): Give each preview deployment or pull request its own copy of your database.

<NeedHelp/>
