---
title: Connect a RedwoodSDK application to Neon
subtitle: Connect a RedwoodSDK app to Lakebase Postgres on Neon, query it from a route on Cloudflare Workers, develop on a branch, deploy, and add the rest of your backend
summary: >-
  Connect a RedwoodSDK app to Lakebase Postgres on Neon: create the app with
  create-rwsdk, optionally add Neon's agent skills, create a Neon project (Neon
  CLI, API, or Console), link it with the Neon CLI to pull DATABASE_URL into an
  env file, optionally develop on a Neon branch, and query it with the Neon
  serverless driver from a route that runs on Cloudflare Workers. Covers
  RedwoodSDK 1.x with a note for 0.x apps, plus deployment with Wrangler,
  troubleshooting, and Neon's other backend services from RedwoodSDK.
enableTableOfContents: true
updatedOn: '2026-11-19T01:53:17.680Z'
---

<PromptBlock src="/prompts/redwood-sdk-prompt.md" labels={["Set up your agent and follow this guide", "Look up RedwoodSDK's docs", "Connect your RedwoodSDK app"]} />

[RedwoodSDK](https://rwsdk.com/) is a React framework for Cloudflare Workers. This guide creates a RedwoodSDK app, connects it to Lakebase Postgres on Neon, and queries the database from a route that runs on Workers. If your app is on RedwoodSDK 0.x, read the 0.x entry in [Troubleshooting](#troubleshooting) before you start.

<Steps>

## Create a RedwoodSDK app

Install [Node.js](https://nodejs.org/en/download) 22.12 or later if you don't have it, then create an app. Pass a project name so the scaffold doesn't prompt:

```bash filename="Terminal"
npx create-rwsdk@latest my-redwood-app
cd my-redwood-app
npm install
```

The scaffold downloads the latest RedwoodSDK starter from GitHub. It doesn't install dependencies, so run `npm install`, and it doesn't create a git repository. The starter's `.gitignore` already excludes `.env`, `.env.local`, and `.dev.vars`, so your connection string stays out of git.

This guide targets RedwoodSDK 1.x. The starter pins RedwoodSDK 1.7.5, with React 19, Vite 8, and Wrangler 4. For more on the starter, see the [RedwoodSDK Quick Start](https://docs.rwsdk.com/getting-started/quick-start/).

## Add Neon's agent skills (optional)

If your AI coding agent doesn't have Neon's [agent skills](/docs/ai/agent-skills) yet, add them to this project. The prompt above installs them, so skip this step if you used it. From your project directory, run:

```bash filename="Terminal"
npx neon@latest skills
```

To also connect the [Neon MCP Server](/docs/ai/neon-mcp-server), run `npx neon@latest mcp`. Only `skills` needs Node.js 22.20 or later. `mcp` runs on the Neon CLI's Node.js 20.19 or later.

RedwoodSDK publishes its docs for AI agents at [docs.rwsdk.com/llms.txt](https://docs.rwsdk.com/llms.txt). The prompt above has your agent look them up there.

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

Get a `DATABASE_URL` into `.env`. The development server passes values from your env files to your Worker's `env` object, which the route below uses. It reads `.dev.vars` if that file exists. Otherwise it reads `.env`, then `.env.local`. The steps below keep the value in `.env`, so there's one file to check.

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

`neon link` writes to `.env` when that file exists, so create it first with `touch .env`. Without it, the value goes to `.env.local`, and the rules under the tabs decide whether the app reads that file.

To skip the prompts, pass `-y` with `--org-id` and `--project-id`, or with `--org-id`, `--project-name`, and `--region-id` to create a project. Find IDs with `neon orgs list` and `neon projects list --org-id <org-id>`.

</TabItem>

<TabItem>

Copy the connection string from **Connect** in the Console nav, or from the API response, and add it to a `.env` file in your project directory. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

```shell filename=".env" shouldWrap
DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"
```

The optional development branch step and [Add more of your backend](#add-more-of-your-backend) use the Neon CLI. To use them, run `neon link` in this directory.

</TabItem>

</Tabs>

Which env file the app reads follows three rules:

- `npm run generate` links `.dev.vars` to `.env` only when `.env` exists and `.dev.vars` doesn't.
- Once `.dev.vars` exists, Wrangler reads only that file, so a `DATABASE_URL` in `.env.local` is ignored.
- Without `.dev.vars`, Wrangler reads `.env`, then `.env.local`.

So keep `DATABASE_URL` in `.env`, and don't copy it into `.env.local`.

## Work on a development branch (optional)

If you linked your project's default branch, your app uses the branch where production data usually lives. That's `main` for projects created with the CLI or API, and `production` for projects created in the Console. Create a [branch](/docs/introduction/branching) for local development instead. A branch starts from its parent's data and schema without copying them (copy-on-write: only the changes you make are stored), so you can change it freely:

```bash filename="Terminal"
neon checkout dev --create
```

This creates the `dev` branch, pins it in `.neon`, and pulls its `DATABASE_URL` into the same env file, so your app now uses the branch. To switch back, run `neon checkout main` (or `production`).

## Install a Postgres driver

Install the [Neon serverless driver](/docs/serverless/serverless-driver). It connects over HTTP instead of TCP, so each query is one HTTP request, which suits Cloudflare Workers. The HTTP driver supports non-interactive transactions.

For interactive transactions or sessions, use the WebSocket `Pool` or `Client`. A `Pool` or `Client` over WebSockets must be opened and closed inside one request handler.

For node-postgres, use [Hyperdrive](https://developers.cloudflare.com/hyperdrive/) instead, as Neon's [Cloudflare Workers guide](/docs/guides/cloudflare-workers) recommends. Hyperdrive pools connections and works with native Postgres drivers such as node-postgres.

For Cloudflare's own walkthrough, see the [Workers Postgres tutorial](https://developers.cloudflare.com/workers/tutorials/postgres/). To compare connection methods, see [Choosing your connection method](/docs/connect/choose-connection).

```bash filename="Terminal"
npm install @neondatabase/serverless
```

## Query the database from a route

Replace the contents of the starter home page, `src/app/pages/home.tsx`, with the code below. It reads `DATABASE_URL` from `env`, which RedwoodSDK gets from `cloudflare:workers`, and creates the query when the page renders:

```typescript filename="src/app/pages/home.tsx"
import type { RequestInfo } from "rwsdk/worker";
import { neon } from "@neondatabase/serverless";
import { env } from "cloudflare:workers";

async function getData() {
  const sql = neon(env.DATABASE_URL);
  const response = await sql`SELECT version()`;
  return response[0].version;
}

export async function Home({ ctx }: RequestInfo) {
  const data = await getData();
  return <>{data}</>;
}
```

If your app already has its own home page, leave it as it is. Put the query on a separate route instead: create `src/app/pages/neon.tsx` with the same code, rename the component to `Neon`, then import it in `src/worker.tsx` and add the route to the array you pass to `render`, next to your existing routes:

```tsx filename="src/worker.tsx"
import { Neon } from "@/app/pages/neon";

// Inside the array you pass to render(Document, [...]):
route("/neon", Neon),
```

## Run your RedwoodSDK app

Generate the Wrangler types, which add `DATABASE_URL` to the `Env` type that `env` uses, then start the development server:

```bash filename="Terminal"
npm run generate
npm run dev
```

`npm run generate` also links `.dev.vars` to `.env` when `.env` exists and `.dev.vars` doesn't. Run it again after you add a variable. The development server starts Vite on port 5173.

Open [localhost:5173](http://localhost:5173) in your browser. You should see a response similar to the following, indicating a successful connection to your Neon database:

```text
PostgreSQL 18.6 (ac70818) on aarch64-unknown-linux-gnu, compiled by gcc (Ubuntu 13.3.0-6ubuntu2~24.04.1) 13.3.0, 64-bit
```

> The specific version may vary depending on the PostgreSQL version of your Neon project.

</Steps>

## Deploy

RedwoodSDK deploys to Cloudflare Workers with a release script. Sign in to Cloudflare first:

```bash filename="Terminal"
npx wrangler login
```

Then run the release script:

```bash filename="Terminal"
npm run release
```

The script asks `Do you want to proceed with deployment? (y/N)`, so enter `y`. Every release writes a secret named `TMP_WORKER_CREATED` to the Worker. On the first release, the script also renames the Worker from the starter's placeholder name to your project directory's name. Then it builds and deploys. If you have more than one Cloudflare account, Wrangler asks which one to use. The output includes the Worker's URL.

<Callout>
On the first release, the script rewrites `wrangler.jsonc` with `JSON.stringify`, which drops its comments.
</Callout>

<Admonition type="warning">
Set the secret after the first release. Before it, `wrangler.jsonc` still has the starter's placeholder name, `__change_me__`. If you set a secret before then, `wrangler secret put` looks for a Worker with that name. If none exists, Wrangler asks whether to create one and adds the secret to a new Worker with that name. Without a terminal, it creates the Worker.
</Admonition>

Next, set the production connection string as a secret on that Worker. Use your default branch: get its connection string with `neon connection-string main --pooled` (or `production`), or from **Connect** in the Console. Then set it:

```bash filename="Terminal"
npx wrangler secret put DATABASE_URL
```

Wrangler prompts for the value, so paste the connection string there. Wrangler takes the Worker's name from `name` in `wrangler.jsonc` (or from `--name`). If no Worker has that name, it asks whether to create one, and without a terminal it creates one. `wrangler secret put` sends the value to that Worker through the Cloudflare API. For staging environments, see the RedwoodSDK [environment variables](https://docs.rwsdk.com/core/env-vars) page.

## Add more of your backend

Each service branches with your database, so a `dev` branch gets its own data for each service. Object Storage, Neon Functions, the AI Gateway, and Realtime need a project in a [supported region](#create-a-neon-project). Add a service with [`neon config add`](/docs/cli/config#add), then provision it with [`neon deploy`](/docs/cli/deploy). `neon deploy` provisions the services on the branch in your `.neon` context file. After `neon link`, that's your default branch. If you don't want to change production, check out a development branch first with `neon checkout dev --create` (or pass `--branch dev` for a branch that already exists). For example, to add an Object Storage bucket:

```bash filename="Terminal"
neon config add bucket uploads
neon deploy
```

`neon config add` creates a [`neon.ts`](/docs/reference/neon-ts) file at your project root if you don't have one, installs `@neon/config` and `@neon/env`, and declares the service. `neon deploy` writes the variables with its default env pull, which writes to `.env` if that file exists, otherwise to `.env.local`. The development server passes them to `env`. In production, set them as secrets with `npx wrangler secret put <NAME>`.

<DefinitionList>

Managed Better Auth
: Sign-up, sign-in, and sessions stored in your database.
: Add it with `neon config add auth`. See [Managed Better Auth](/docs/auth/overview).

Object Storage
: S3-compatible buckets for uploads and files.
: Add a bucket with `neon config add bucket <name>`. In RedwoodSDK, use it from route handlers. See [Object Storage](/docs/storage/overview).

AI Gateway
: One credential for models from Anthropic, OpenAI, Google, and more.
: Add it with `neon config add ai-gateway`. In RedwoodSDK, call models from route handlers. See [AI Gateway](/docs/ai-gateway/overview).

Neon Functions
: Long-running Node.js compute next to your database.
: Add one with `neon config add function <slug>`, which also creates its handler file in `functions/`. Use a function for work that outlasts a request on your Worker, such as agents and webhooks, and call it with `fetch`. See [Neon Functions](/docs/compute/functions/overview).

Realtime (beta)
: Live SQL query subscriptions.
: Add it with `neon config add realtime`. On the server, define and seal live queries with `createRealtime` from `@neon/realtime/server`, reading `NEON_REALTIME_SECRET` from `env`. Keep the secret on the server. In your browser code, pass `VITE_NEON_REALTIME_URL` as the client's `url`, set as in the note below. See [Realtime](/docs/realtime/overview).

</DefinitionList>

If you add Realtime, your browser code needs `VITE_NEON_REALTIME_URL`. After `neon deploy` has written `NEON_REALTIME_URL` to your env file, add this line to that same file:

```bash filename="Terminal"
echo 'VITE_NEON_REALTIME_URL=$NEON_REALTIME_URL' >> .env
```

Use `.env` in this command if your project has one. If it doesn't, replace `.env` with `.env.local`, the file `neon env pull` writes to when no `.env` exists. Don't point the command at a `.env` that doesn't exist yet: `>>` would create it, and a new `.env` changes which file `npm run generate` links.

Vite expands `$VAR` references in env files, and if `NEON_REALTIME_URL` is missing, the value expands to empty without an error.

Then run `npm run release` again, because Vite inlines the value at build time, and restart `npm run dev` for local development.

If `neon deploy` returns before Realtime is ready, run `neon env pull` once it is. It writes to `.env` only if `.env` exists, otherwise to `.env.local`. Then add the line to that file if it's missing. `neon env pull` keeps lines it doesn't manage.

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

`env.DATABASE_URL` is undefined, and the page errors
: The Worker doesn't see the variable. Once `.dev.vars` exists, Wrangler reads only that file, which links to `.env`, so a `DATABASE_URL` in `.env.local` is ignored. Put the line in `.env`, then restart `npm run dev`. On Cloudflare, set the value with `npx wrangler secret put DATABASE_URL`.

TypeScript reports that `DATABASE_URL` isn't part of `Env`
: The generated types are out of date, or the variable is in a file Wrangler doesn't read. Put `DATABASE_URL` in `.env`, then run `npm run generate`, which regenerates `worker-configuration.d.ts`.

Port 5173 is in use
: Vite picks the next free port and prints its URL. Use that URL, or stop the other process that's using 5173.

A RedwoodSDK 0.x app
: This guide targets RedwoodSDK 1.x. Follow RedwoodSDK's [0.x to 1.x migration guide](https://docs.rwsdk.com/migrating) first. It lists React, the Vite plugin, Wrangler, and the Workers types in your own `package.json`, and sets `compatibility_date` in `wrangler.jsonc` to 2025-08-21 or later. The migration guide says to run `pnpm generate` after you change `wrangler.jsonc`. If your `package.json` has no `generate` script, run `npx wrangler types --include-runtime false` instead. If it has no `release` script, set `name` in `wrangler.jsonc` to your project name first. The 1.x release script renames the Worker from the starter's placeholder, and a bare build and deploy skips that. Then build and deploy with the commands your app already uses, such as `npm run build` and `npx wrangler deploy`. Then follow this guide.

</DefinitionList>

## Next steps

- **Create your first table:** run `neon psql` in your project directory to open a SQL shell on your linked branch, or use an ORM such as [Drizzle](/docs/guides/drizzle) or [Prisma](/docs/guides/prisma) to manage your schema with migrations.
- [Branching](/docs/introduction/branching): Give each preview deployment or pull request its own branch of your database.
- [Set up Managed Better Auth](/docs/auth/overview): Add managed authentication that branches with your database
- [Add Object Storage](/docs/storage/overview): S3-compatible file storage that branches with your database
- [Deploy a Function](/docs/compute/functions/overview): Run backend compute next to your database, no separate hosting needed
- [Call an LLM with AI Gateway](/docs/ai-gateway/overview): Access foundation models from Anthropic, OpenAI, Google, and more with one credential

<NeedHelp/>
