---
title: Connect from Drizzle to Neon
subtitle: Create a Node.js project, link it with neon link, and query Lakebase Postgres through Drizzle ORM with node-postgres
summary: >-
  To connect a Drizzle app to Lakebase Postgres on Neon, run neon link to write a
  pooled DATABASE_URL and a direct DATABASE_URL_UNPOOLED to your env file, then
  configure Drizzle Kit, define a table, run a migration, and query it with Drizzle
  ORM and node-postgres. Covers loading .env.local in drizzle.config.ts, why
  migrations use the direct connection, an optional development branch, the agent
  prompt, and Neon's other backend services.
enableTableOfContents: true
updatedOn: '2026-11-20T21:27:30.279Z'
---

<PromptBlock src="/prompts/drizzle-prompt.md" labels={["Set up your agent and follow this guide", "Look up Drizzle's docs", "Connect your Drizzle app"]} />

<Steps>

## Start from a Node.js project

Use an existing Node.js 22.21 or later (or 24.10 or later) project that uses ES modules, since the examples use top-level `await`. To set one up, follow [Connect a Node.js application to Neon](/docs/guides/node), or the guide for your framework, such as [Hono](/docs/guides/hono).

## Add Neon's agent skills (optional)

Run `npx neon@latest skills` from your project directory to add Neon's [agent skills](/docs/ai/agent-skills), which teach your AI coding agent how to use the Neon CLI, branches, and Neon's backend services. The command needs Node.js 22.20 or later. The agent prompt at the top of this page installs them, so skip this step if you used it:

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

Get two connection strings into an env file. The **pooled** connection goes through Neon's connection pooler, and its host name has `-pooler`. Your app uses it. The **direct** connection goes straight to Postgres, and Drizzle Kit's migrations use it (see [Why two connection strings?](#why-two-connection-strings)).

<Tabs labels={["Neon CLI", "Without the CLI"]}>

<TabItem>

Before you link, check that `.gitignore` lists `.env.local`, so the connection strings stay out of git. Then, from your app's directory, link it to the Neon project (install the [Neon CLI](/docs/cli/install) and run `neon login` first if you haven't):

```bash filename="Terminal"
neon link
```

`neon link` prompts you to pick an organization and a project, or to create a new project. Then it:

- writes a `.neon` file with the project context;
- pins a branch (pass `--branch` to choose one);
- pulls that branch's `DATABASE_URL` (pooled) and `DATABASE_URL_UNPOOLED` (direct) into `.env.local`, or into `.env` if your project already has one;
- offers to create a [`neon.ts`](/docs/reference/neon-ts) file, which is optional.

To skip the prompts, pass `-y` with `--org-id` and `--project-id`, or with `--org-id`, `--project-name`, and `--region-id` to create a project. Find IDs with `neon orgs list` and `neon projects list --org-id <org-id>`.

</TabItem>

<TabItem>

Copy both connection strings from **Connect** in the Neon Console, or from the API response, and add them to a `.env.local` file in your project directory. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

```shell filename=".env.local" shouldWrap
DATABASE_URL="postgresql://[user]:[password]@[endpoint]-pooler.[region].aws.neon.tech/[dbname]?sslmode=require&channel_binding=require"
DATABASE_URL_UNPOOLED="postgresql://[user]:[password]@[endpoint].[region].aws.neon.tech/[dbname]?sslmode=require&channel_binding=require"
```

The optional development branch step needs the Neon CLI, so run `neon link` in this directory first.

</TabItem>

</Tabs>

## Work on a development branch (optional)

Run `neon checkout dev --create` to develop on a branch of your database instead of the default branch, where production data usually lives. The default branch is `main` for projects created with the CLI or API, and `production` for projects created in the Console. A [branch](/docs/introduction/branching) starts from its parent's data and schema without copying them (copy-on-write: only the changes you make are stored), so you can change it freely:

```bash filename="Terminal"
neon checkout dev --create
```

This creates the `dev` branch, pins it in `.neon`, and pulls its `DATABASE_URL` and `DATABASE_URL_UNPOOLED` into the same env file, so your app and migrations now use the branch. To switch back, run `neon checkout main` (or `production`).

## Install Drizzle and a driver

Install Drizzle ORM, an ORM that maps your TypeScript code to database tables, plus `pg` (the node-postgres driver) and `dotenv`, which loads your env file. Then install Drizzle Kit, the migration CLI, `tsx`, which runs TypeScript, and the `pg` types:

```bash filename="Terminal"
npm install drizzle-orm@0.45 pg dotenv
npm install -D drizzle-kit@0.31 tsx @types/pg
```

The `@0.45` and `@0.31` pins are the latest stable releases of Drizzle ORM and Drizzle Kit. Drizzle 1.0 is still in release candidates, and the pins keep `npm install` from moving to it once it's stable.

This guide uses node-postgres because it's the driver for a Node.js server or script that keeps a pool of TCP connections. Drizzle Kit uses `pg` too when it's installed, so migrations need no second driver. For edge and serverless functions, see [Choosing your connection method](/docs/connect/choose-connection).

Current `pg` versions print a `SECURITY WARNING` for `sslmode=require`. Change it to `sslmode=verify-full` in your env file to keep the same behavior without the warning. `neon link` writes `sslmode=require` again, so repeat the change after you run it.

## Configure Drizzle

Create `drizzle.config.ts` in the project root. Drizzle Kit reads it for the schema file, the migrations folder, and the direct database URL. Drizzle Kit loads `.env` on its own but not `.env.local`, so this file loads both with `dotenv`:

```typescript filename="drizzle.config.ts"
import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// neon link writes .env.local, or .env if that file exists
config({ path: ['.env.local', '.env'], quiet: true });

export default defineConfig({
  schema: './src/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL_UNPOOLED!,
  },
});
```

Create `src/db.ts` to make the one Drizzle client the app uses. It calls `dotenv` too, the same loader as `drizzle.config.ts`, so `DATABASE_URL` is set before the pool starts. Neon can [scale a compute to zero](/docs/introduction/scale-to-zero) after a period without queries, which closes its idle connections. The pool listener keeps that from stopping the app:

```typescript filename="src/db.ts"
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

config({ path: ['.env.local', '.env'], quiet: true });

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.on('error', (error) => console.error('Postgres pool error:', error.message));

export const db = drizzle(pool);
```

## Define a model and run a migration

Create `src/schema.ts`, which defines a `demo_users` table:

```typescript filename="src/schema.ts"
import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const demoUsers = pgTable('demo_users', {
  id: serial('id').primaryKey(),
  name: text('name'),
});
```

Generate a SQL migration from the schema, then apply it:

```bash filename="Terminal"
npx drizzle-kit generate
npx drizzle-kit migrate
```

`generate` writes a SQL file to `drizzle/` and doesn't connect to your database. `migrate` applies the migrations that haven't run yet and records each one in the `drizzle.__drizzle_migrations` table, so run it again after each schema change. It ends with `migrations applied successfully!`.

## Query it

Create `src/index.ts`, a script that inserts a row, reads the table back, and prints the Postgres version:

```typescript filename="src/index.ts"
import { sql } from 'drizzle-orm';
import { db, pool } from './db';
import { demoUsers } from './schema';

try {
  await db.insert(demoUsers).values({ name: 'Ada' });
  const rows = await db.select().from(demoUsers);
  console.log('demo_users:', rows);

  const version = await db.execute<{ version: string }>(sql`SELECT version()`);
  console.log('Postgres version:', version.rows[0].version);
} finally {
  await pool.end();
}
```

Run the script:

```bash filename="Terminal"
npx tsx src/index.ts
```

The output lists the rows in `demo_users` and the Postgres version. Each run adds one row.

</Steps>

## Why two connection strings?

Your app uses the pooled `DATABASE_URL`, which goes through PgBouncer, the connection pooler Neon runs. Migrations use the direct `DATABASE_URL_UNPOOLED`, because PgBouncer runs in [transaction mode](/docs/connect/connection-pooling#connection-pooling-in-transaction-mode). Drizzle Kit's migrations follow the same rule, and `drizzle.config.ts` reads the direct connection. For when to use each, see [Connection pooling](/docs/connect/connection-pooling).

## Troubleshooting

<DefinitionList>

`Please provide required params for Postgres driver: url: undefined`
: `drizzle-kit` ran without `DATABASE_URL_UNPOOLED`. Check that your env file sets it (`neon link` writes it), and that `drizzle.config.ts` loads the file.

`DrizzleQueryError: Failed query` with `ECONNREFUSED 127.0.0.1:5432`
: The app ran without `DATABASE_URL`, so the driver tried to connect to a local Postgres. Check that `src/db.ts` loads the env file and that the file sets `DATABASE_URL`.

`relation "demo_users" does not exist`
: The migration hasn't run on the branch your `DATABASE_URL` points at. Run `npx drizzle-kit migrate`.

</DefinitionList>

## Next steps

- **Deploy:** set `DATABASE_URL` and `DATABASE_URL_UNPOOLED` in your host's environment, not in a file. Run `npx drizzle-kit migrate` once per deploy, not from each instance, before you start the app.
- [Drizzle with Neon](https://orm.drizzle.team/docs/get-started/neon-existing): Drizzle's guide for an existing Neon project, with schemas, queries, and migrations.
- **Add more of your backend:** [Managed Better Auth](/docs/auth/overview) for sign-in, [Object Storage](/docs/storage/overview) for files, [Neon Functions](/docs/compute/functions/overview) for long-running work, [AI Gateway](/docs/ai-gateway/overview) for LLM calls, and [Realtime](/docs/realtime/examples/drizzle) for live updates from SQL queries with your Drizzle schema. Each one branches with your database.

<NeedHelp/>
