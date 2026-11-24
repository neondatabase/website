---
title: Self-Host Medusa with Neon
subtitle: Run a Medusa store on Lakebase Postgres on Neon, migrate and seed it, develop on a branch, deploy, and add the rest of your backend
summary: >-
  Self-host Medusa, the open-source headless commerce platform, on Lakebase
  Postgres on Neon: create the store with create-medusa-app --skip-db,
  optionally add Neon's agent skills, create a Neon project (Neon CLI, API, or
  Console), link apps/backend with the Neon CLI to pull DATABASE_URL into
  .env, run medusa db:migrate to create the tables and initial data, create an
  admin user, and check the connection from a custom API route.
  Covers Medusa 2.22 on Node.js 22.23.4 or later, plus deployment,
  troubleshooting, and Neon's other backend services from Medusa.
enableTableOfContents: true
updatedOn: '2026-11-17T21:48:45.445Z'
---

<PromptBlock src="/prompts/medusajs-prompt.md" labels={["Set up your agent and follow this guide", "Use Medusa's docs and skill", "Connect your Medusa store"]} />

[Medusa](https://medusajs.com/) is an open-source headless commerce platform. It stores products, orders, and customers in Postgres, so a Neon database can back the whole store.

<Steps>

## Create a Medusa app

Install an LTS release of [Node.js](https://nodejs.org/en/download), 22.23.4 or later, if you don't have it. Medusa supports LTS releases only, and with the storefront, Node.js 24 or lower. Then create the store with [`create-medusa-app`](https://docs.medusajs.com/resources/create-medusa-app) if you don't have one:

```bash filename="Terminal"
printf 'n\n' | npx create-medusa-app@latest my-store --skip-db
cd my-store/apps/backend
```

`--skip-db` skips the local database that `create-medusa-app` would otherwise create, since Neon provides it, along with migrations and the admin user, which come later in this guide. The installer asks whether to add the Next.js storefront; `printf 'n\n'` answers no, so it runs without prompts. To add the storefront, pass `--with-nextjs-starter` instead of piping the answer.

The store is a monorepo: the Medusa server is in `apps/backend`, and the storefront, if you add it, in `apps/storefront`. Run this guide's commands from `apps/backend`. A store created with an earlier Medusa 2 release has no `apps/` directory; run them from its project root, where `medusa-config.ts` is. The backend's `.gitignore` already excludes `.env`, which will hold your connection string. The installer doesn't create a git repository, so run `git init` at the root if you want one.

## Add Neon's agent skills (optional)

If your AI coding agent doesn't have Neon's [agent skills](/docs/ai/agent-skills) yet, add them to this project. The prompt above installs them, so skip this step if you used it. From the directory you open in your agent, usually `my-store`, run:

```bash filename="Terminal"
npx neon@latest skills
```

To also connect the [Neon MCP Server](/docs/ai/neon-mcp-server), run `npx neon@latest mcp`.

Medusa publishes [docs for AI agents](https://docs.medusajs.com/llms.txt) and a backend skill, which the prompt above also uses: `npx skills add medusajs/medusa-agent-skills --skill building-with-medusa`.

## Create a Neon project

Skip this step if you already have a Neon project you want to use.

Choose a region close to where your Medusa server will run. If you also want Neon's other backend services, pick one that supports all of them: US East (Ohio), US East (N. Virginia), Europe (Frankfurt), or Asia Pacific (Singapore). Postgres and Managed Better Auth run in every region, while Object Storage, Neon Functions, the AI Gateway, and Realtime run in those four, with support expanding toward [all regions](/docs/introduction/regions#product-availability).

<Tabs labels={["Neon CLI", "API", "Console"]}>

<TabItem>

Install the [Neon CLI](/docs/cli/install), sign in, and create the project:

```bash filename="Terminal"
npm i -g neon@latest
neon login
neon projects create --name my-store --region-id aws-us-east-2 --no-secrets
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
  -d '{"project": {"name": "my-store", "region_id": "aws-us-east-2", "org_id": "<org-id>"}}'
```

See [Create a project with the API](/docs/manage/projects#create-a-project-with-the-api) for the other options.

</TabItem>

<TabItem>

Go to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console, click **New Project**, and pick a region.

</TabItem>

</Tabs>

## Connect your app to the project

Medusa reads its settings from `apps/backend/.env`, which `create-medusa-app` created. It doesn't read `.env.local`.

<Tabs labels={["Neon CLI", "Without the CLI"]}>

<TabItem>

From `apps/backend`, link it to the Neon project (install the [Neon CLI](/docs/cli/install) and run `neon login` first if you haven't):

```bash filename="Terminal"
neon link
```

`neon link` prompts you to pick an organization and a project, or to create a new project. It writes a `.neon` file with the project context, pins a branch (pass `--branch` to choose one), and adds that branch's `DATABASE_URL` to `.env`, keeping the settings already there. Medusa's `medusa-config.ts` reads `DATABASE_URL`, so it needs no changes. It also offers to create a [`neon.ts`](/docs/reference/neon-ts) file; that's optional and covered in [Add more of your backend](#add-more-of-your-backend).

To skip the prompts, pass `-y` with `--org-id` and `--project-id`, or with `--org-id`, `--project-name`, and `--region-id` to create a project. Find IDs with `neon orgs list` and `neon projects list --org-id <org-id>`.

</TabItem>

<TabItem>

Click **Connect** in the Console nav and copy the connection string. Add it to `apps/backend/.env` as `DATABASE_URL`. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

```shell filename=".env" shouldWrap
DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"
```

The optional development branch step and [Add more of your backend](#add-more-of-your-backend) use the Neon CLI. To use them, run `neon link` in `apps/backend`.

</TabItem>

</Tabs>

An idle connection in Medusa's pool doesn't keep the compute running, so it can still [scale to zero](/docs/introduction/scale-to-zero) when the store is quiet. Any query wakes it, including scheduled jobs you add to the store.

## Work on a development branch (optional)

If you linked your project's default branch, your store uses the branch where production data usually lives. That's `main` for projects created with the CLI or API, and `production` for projects created in the Console. Create a [branch](/docs/introduction/branching) for local development instead. A branch starts from its parent's data and schema with copy-on-write, so you can change it freely:

```bash filename="Terminal"
neon checkout dev --create
```

This creates the `dev` branch, pins it in `.neon`, and writes its connection strings to `.env`, so your store now uses the branch. To switch back, run `neon checkout main` (or `production`).

## Run the migrations

Create Medusa's tables and its initial data, such as the default store, sales channel, and regions:

```bash filename="Terminal"
npx medusa db:migrate
```

To add the starter's 50 demo products too, run `npx medusa exec ./src/scripts/seed-demo-products.ts`. It uses the sales channel and shipping profile that `db:migrate` created, so run it afterward. Running it again skips products it already added.

Medusa connects with node-postgres (`pg`), and `pg` 8.23 and later print a `SECURITY WARNING` for `sslmode=require`. Change it to `sslmode=verify-full` in `.env` to keep the same behavior without the warning. `neon env pull` and `neon checkout` write `sslmode=require` again, so repeat the change after you run them.

You don't need the `databaseDriverOptions.ssl` setting that Medusa's configuration docs show for production databases. The connection string's `sslmode` turns on TLS, and Neon's certificates come from a public certificate authority, so don't turn off certificate checks with `rejectUnauthorized: false`.

## Create an admin user

Create the user you'll sign in to the Medusa Admin with:

```bash filename="Terminal"
npx medusa user -e admin@example.com -p <password>
```

To set the password in the browser instead, pass `--invite` in place of `-p`. Medusa prints an invite token; with the server running, open `http://localhost:9000/app/invite?token=<token>` and set the password there.

## Query the database from a route

Check the connection from a [custom API route](https://docs.medusajs.com/learn/fundamentals/api-routes). Medusa maps `src/api/neon/route.ts` to `GET /neon`. The route queries through Medusa's own database connection and returns the Postgres version as JSON:

```typescript filename="src/api/neon/route.ts"
import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { ContainerRegistrationKeys } from '@medusajs/framework/utils';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const pg = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION);
  const { rows } = await pg.raw('SELECT version()');
  res.json({ version: rows[0].version });
}
```

## Run the app

Start the Medusa server:

```bash filename="Terminal"
npm run dev
```

It listens on port 9000, or on `PORT` if you set it. Open [localhost:9000/neon](http://localhost:9000/neon) to see your Postgres version, confirming the connection:

```json
{"version":"PostgreSQL 18.6 (fd34222) on aarch64-unknown-linux-gnu, compiled by gcc ..."}
```

Then open the Medusa Admin at [localhost:9000/app](http://localhost:9000/app) and sign in with the admin user. To see Medusa's tables in Neon, open your project in the Neon Console and select **Postgres database** > **Tables**.

</Steps>

## Deploy

Set your connection string everywhere your store runs, along with Medusa's other settings. Medusa's deployment guide starts the production build from `.medusa/server` and sets every setting in the host's environment, for both its server and worker instances. `create-medusa-app` sets `JWT_SECRET` and `COOKIE_SECRET` to `supersecret`; replace both with long random values, and set the CORS settings to your production URLs.

- Use your default branch for production. Get its connection string with `neon connection-string main --pooled` (or `production`), or from **Connect** in the Console, and set it as `DATABASE_URL`.
- Migrate the production database before a new version starts. Medusa's deployment guide adds a `predeploy` script, `"predeploy": "medusa db:migrate"`, to `apps/backend/package.json`.
- In development, Medusa keeps sessions, events, workflows, and locks in memory, and logs `Local Event Bus installed. This is not recommended for production.` For production, Medusa's deployment guide adds Redis: `redisUrl` for sessions, and its Redis caching, event bus, workflow engine, and locking modules.
- Medusa's [deployment guide](https://docs.medusajs.com/learn/deployment/general) covers the server and worker instances, the production build, and hosts such as a VPS or Railway.
- To limit which servers can reach your database, use [IP Allow](/docs/introduction/ip-allow).

## Add more of your backend

Neon's other backend services branch with your database. Object Storage, Neon Functions, the AI Gateway, and Realtime need a project in a [supported region](#create-a-neon-project). Add a service with [`neon config add`](/docs/cli/config#add), then provision it with [`neon deploy`](/docs/cli/deploy). For example, to add an Object Storage bucket:

```bash filename="Terminal"
neon config add bucket uploads
neon deploy
```

`neon config add` creates a [`neon.ts`](/docs/reference/neon-ts) file next to `.neon`, in `apps/backend`, if you don't have one, installs `@neon/config` and `@neon/env`, and declares the service. `neon deploy` provisions it. Then run `neon env pull` in `apps/backend` to add its variables to `.env`, the file Medusa loads. Set them on your host too.

<DefinitionList>

Object Storage
: S3-compatible buckets for uploads and files.
: Add a bucket with `neon config add bucket <name>`. Medusa's [S3 File Module Provider](https://docs.medusajs.com/resources/infrastructure-modules/file/s3) can store product images and other uploads in it, using the bucket's `AWS_*` variables. See [Object Storage](/docs/storage/overview).

AI Gateway
: One credential for models from Anthropic, OpenAI, Google, and more.
: Add it with `neon config add ai-gateway`. In Medusa, call models from API routes, workflows, or subscribers. See [AI Gateway](/docs/ai-gateway/overview).

Neon Functions
: Long-running Node.js compute next to your database.
: Add one with `neon config add function <slug>`, which also creates its handler file in `functions/`. Use a function for work that outlasts a request on your Medusa host, such as agents and webhooks, and call it with `fetch`. See [Neon Functions](/docs/compute/functions/overview).

Realtime (beta)
: Live SQL query subscriptions.
: Add it with `neon config add realtime`. In Medusa, seal live queries in an API route with `NEON_REALTIME_SECRET`, then subscribe from the storefront with `NEON_REALTIME_URL`. Keep the secret on the server. See [Realtime](/docs/realtime/overview).

</DefinitionList>

Medusa has its own customer and admin authentication, so this guide doesn't add Managed Better Auth.

To declare several services at once before you have a `neon.ts`, run `neon config init --services functions,realtime`, or edit the file directly. With the services above declared, it looks like this. The comments list the variables each service adds:

```typescript filename="neon.ts"
import { defineConfig } from '@neon/config/v1';

export default defineConfig({
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

`ExitPromptError: User force closed the prompt`
: `create-medusa-app` asked whether to install the storefront, and nothing answered. Pipe the answer as in [Create a Medusa app](#create-a-medusa-app), or pass `--with-nextjs-starter`.

`Medusa requires at least v22.22.0 of Node.js`
: `create-medusa-app` checks your Node.js version before it creates the store, and the store itself asks for 22.23.4 or later. Check with `node --version` and upgrade.

`Error: listen EADDRINUSE: address already in use :::9000`
: Another server, often an earlier `npm run dev`, is still using the port. Stop it, or set `PORT` to use another port.

</DefinitionList>

## Next steps

- [Medusa documentation](https://docs.medusajs.com/): customize your store with modules, workflows, and API routes.
- [Build a full backend](/docs/get-started/full-backend-quickstart): Postgres, Object Storage, and a Neon Function declared in one `neon.ts`.
- [Branching](/docs/introduction/branching): Give each preview deployment or pull request its own copy of your database.

<NeedHelp/>
