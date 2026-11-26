---
title: Connect from Kysely to Neon
subtitle: Create a Neon project, link it with neon link, and query Lakebase Postgres from Kysely with the node-postgres driver
summary: >-
  To connect a Kysely app to Lakebase Postgres on Neon, run neon link to get a
  pooled DATABASE_URL and a direct DATABASE_URL_UNPOOLED, then define a table,
  run a migration with Kysely's Migrator, and query it with Kysely's
  PostgresDialect and node-postgres. Covers loading env files with Node's
  --env-file-if-exists flags, why migrations use the direct connection, an
  optional development branch, the agent prompt, and a link for Kysely 0.28
  users.
enableTableOfContents: true
updatedOn: '2026-11-20T21:27:50.666Z'
---

<PromptBlock src="/prompts/kysely-prompt.md" labels={["Set up your agent and follow this guide", "Look up Kysely's docs", "Connect your Kysely app"]} />

<Steps>

## Start from a Node.js project

This guide needs Node.js 22.21 or 24.10 or later, for running `.ts` files directly and for the `--env-file-if-exists` flag used below. Kysely, a query builder that turns typed TypeScript calls into SQL, works on Node.js 22 and later. Use a project you already have, or create one with [Connect a Node.js application to Neon](/docs/guides/node), or the guide for your framework, such as [Hono](/docs/guides/hono). Skip this step if you already have a project.

The scripts use `import` and top-level `await`, so the project must be an ES module project. Run `npm pkg set type=module` in it. The [Node.js guide](/docs/guides/node#create-a-nodejs-project) explains what to do with an app that uses `require()`.

## Add Neon's agent skills (optional)

Run `npx neon@latest skills` from your project directory to add Neon's [agent skills](/docs/ai/agent-skills), which teach your AI coding agent how to use the Neon CLI, branches, and Neon's backend services. The command needs Node.js 22.20 or later. The agent prompt at the top of this page installs them, so skip this step if you used it:

```bash filename="Terminal"
npx neon@latest skills
```

To also connect the [Neon MCP Server](/docs/ai/neon-mcp-server), run `npx neon@latest mcp`.

Kysely publishes its docs for AI agents at [llms.txt](https://kysely.dev/llms.txt), and the agent prompt points your agent there.

## Create a Neon project

Create a Neon project in a region that runs every Neon backend service: `aws-us-east-2` (Ohio), `aws-us-east-1` (N. Virginia), `aws-eu-central-1` (Frankfurt), or `aws-ap-southeast-1` (Singapore). Postgres and Managed Better Auth run in every region; Object Storage, Neon Functions, the AI Gateway, and Realtime run in those four (see [product availability](/docs/introduction/regions#product-availability)). Skip this step if you already have a Neon project you want to use.

<Tabs labels={["Neon CLI", "API", "Console"]}>

<TabItem>

Install the [Neon CLI](/docs/cli/install), sign in, and create the project. The npm install needs Node.js 20.19 or later; without Node.js, run `brew install neonctl` (Homebrew) or use another option on the install page:

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

Run `neon link` to write `DATABASE_URL` and `DATABASE_URL_UNPOOLED` into `.env.local`. The **pooled** connection (`DATABASE_URL`) goes through Neon's connection pooler, and its host name has `-pooler`. Your app uses it. The **direct** connection (`DATABASE_URL_UNPOOLED`) goes straight to Postgres, and the migration script uses it (see [Why two connection strings?](#why-two-connection-strings)).

Add the env files and `node_modules` to `.gitignore` first, so the connection strings and installed packages stay out of git:

```bash filename="Terminal"
printf '\nnode_modules\n.env\n.env.local\n' >> .gitignore
```

<Tabs labels={["Neon CLI", "Without the CLI"]}>

<TabItem>

From your app's directory, link it to the Neon project (install the [Neon CLI](/docs/cli/install) and run `neon login` first if you haven't):

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

This creates the `dev` branch, pins it in `.neon`, and pulls its `DATABASE_URL` and `DATABASE_URL_UNPOOLED` into the same env file, so your app now uses the branch. To switch back, run `neon checkout main` (or `production`).

## Install Kysely and a driver

Install Kysely and `pg`, the node-postgres driver that Kysely's built-in `PostgresDialect` connects through. Install the TypeScript tools too, for type checking:

```bash filename="Terminal"
npm install kysely pg
npm install -D typescript @types/node @types/pg
```

This guide uses `PostgresDialect` with node-postgres because it works on any Node.js server and supports the transactions that migrations need. node-postgres doesn't run on edge runtimes, such as Cloudflare Workers. The `kysely-neon` dialect sends queries over HTTP, so it can serve app queries on an edge runtime, but it rejects transactions and can't run Kysely's Migrator. For the Neon serverless driver, see [the serverless driver](/docs/serverless/serverless-driver).

Add a `tsconfig.json` with `strict` on, so TypeScript checks the types Kysely infers from your table definitions:

```json filename="tsconfig.json"
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "strict": true,
    "noEmit": true,
    "allowImportingTsExtensions": true
  }
}
```

Node runs the `.ts` files in this guide without a build step, but it doesn't check their types. Your editor does, and so does `npx tsc --noEmit`.

Current `pg` versions print a `SECURITY WARNING` for `sslmode=require`. Change `sslmode=require` to `sslmode=verify-full` in both connection strings in your env file to keep the same behavior without the warning. `neon link` writes `sslmode=require` again, so repeat the change after you run it.

## Configure Kysely

Create `src/db.ts` to make one Kysely instance for the app. It connects with the pooled `DATABASE_URL` from the Connect step. Kysely's `PostgresDialect` takes a node-postgres `Pool`, and the `Database` type comes from the next step:

```typescript filename="src/db.ts"
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import type { Database } from './types.ts';

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({ connectionString: process.env.DATABASE_URL }),
  }),
});
```

The scripts in this guide load the env file with Node's `--env-file-if-exists` flags, which run before any of your modules, so `process.env` is set when `src/db.ts` runs. The Query step shows the flags, as in the [Node.js guide](/docs/guides/node#connect-and-run-a-query).

## Define a model and run a migration

Describe the `users` table in `src/types.ts`. Kysely doesn't read your schema from the database, so this interface is what it type-checks your queries against:

```typescript filename="src/types.ts"
import type { Generated, Selectable, Insertable, Updateable } from 'kysely';

export interface Database {
  users: UsersTable;
}

export interface UsersTable {
  // Generated marks columns that the database fills in
  id: Generated<number>;
  name: string;
  email: string;
  created_at: Generated<Date>;
}

export type User = Selectable<UsersTable>;
export type NewUser = Insertable<UsersTable>;
export type UserUpdate = Updateable<UsersTable>;
```

Create the table with a migration: a file in `migrations/` with an `up` function that creates it and a `down` function that drops it. Kysely's Migrator runs each migration once, in name order, and records what ran in a `kysely_migration` table:

```typescript filename="migrations/001_create_users.ts"
import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('users')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('email', 'text', (col) => col.notNull().unique())
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('users').execute();
}
```

Create `src/migrate.ts`, which runs the migrations through the direct `DATABASE_URL_UNPOOLED` connection:

```typescript filename="src/migrate.ts"
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { Kysely, PostgresDialect } from 'kysely';
import { FileMigrationProvider, Migrator } from 'kysely/migration';
import { Pool } from 'pg';

// Migrations use the direct connection (see Why two connection strings?)
const db = new Kysely<any>({
  dialect: new PostgresDialect({
    pool: new Pool({ connectionString: process.env.DATABASE_URL_UNPOOLED }),
  }),
});

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: path.join(import.meta.dirname, '../migrations'),
  }),
});

const { error, results } = await migrator.migrateToLatest();

results?.forEach((it) => {
  if (it.status === 'Success') {
    console.log(`Migration "${it.migrationName}" was executed successfully`);
  } else if (it.status === 'Error') {
    console.error(`Migration "${it.migrationName}" failed`);
  }
});

await db.destroy();

if (error) {
  console.error('Failed to migrate:', error);
  process.exit(1);
}
```

Run the migration, with the env flags from the Query step. If you made a development branch, it runs there:

```bash filename="Terminal"
node --env-file-if-exists=.env --env-file-if-exists=.env.local src/migrate.ts
```

The output shows `Migration "001_create_users" was executed successfully`. Run the command again, and no migration runs, because the migration is already recorded. To change the schema later, add a new file to `migrations/` with the next number. Don't edit a migration that has already run.

## Query it

Create `src/index.ts`, a script that inserts a user, reads the row back, and prints the Postgres version:

```typescript filename="src/index.ts"
import { sql } from 'kysely';
import { db } from './db.ts';

try {
  const user = await db
    .insertInto('users')
    .values({ name: 'Ada', email: `ada-${Date.now()}@example.com` })
    .returning(['id', 'name', 'email'])
    .executeTakeFirstOrThrow();
  console.log('User:', user);

  const found = await db.selectFrom('users').selectAll().where('id', '=', user.id).executeTakeFirst();
  console.log('Read back:', found);

  const { rows } = await sql<{ version: string }>`SELECT version()`.execute(db);
  console.log('Postgres version:', rows[0].version);
} finally {
  await db.destroy();
}
```

Run the script with the `--env-file-if-exists` flags, which load `.env` and `.env.local` if they exist. Node skips a file that doesn't exist and may print a note such as `.env not found. Continuing without it.`, so you can have either file or both. If both set a variable, `.env.local` wins:

```bash filename="Terminal"
node --env-file-if-exists=.env --env-file-if-exists=.env.local src/index.ts
```

The output shows the new user and the Postgres version. Each run adds one user.

</Steps>

## Why two connection strings?

Your app uses the pooled `DATABASE_URL`, which goes through PgBouncer, the connection pooler Neon runs. Migrations use the direct `DATABASE_URL_UNPOOLED`, because Kysely's Migrator takes a session-level advisory lock (a lock on a database-wide key, so only one run changes the schema at a time), which PgBouncer in transaction mode doesn't hold reliably. Concurrent runs through the pooled connection can apply the same migration twice. [Neon's pooling docs](/docs/connect/connection-pooling#connection-pooling-in-transaction-mode) list session-level advisory locks as unsupported in transaction mode. For how Kysely locks migrations, see [Kysely's migration docs](https://kysely.dev/docs/migrations).

## Troubleshooting

<DefinitionList>

`AggregateError [ECONNREFUSED]`
: The script ran without a connection string, so node-postgres tried a local server. Check that the env file sets `DATABASE_URL` for `src/index.ts`, or `DATABASE_URL_UNPOOLED` for `src/migrate.ts`. Run the script from your project directory with the `--env-file-if-exists` flags. On a host, set the variables in the environment.

`Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'pg'`
: The package isn't installed in this project, or you ran the script from another directory. Run the install commands from [Install Kysely and a driver](#install-kysely-and-a-driver) in your project directory. The package name in the message tells you which one is missing.

`Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: Package subpath './migration' is not defined by "exports"`
: You have Kysely 0.28 or older, which exports `Migrator` from `kysely`. Import `Migrator` and `FileMigrationProvider` from `kysely` in `src/migrate.ts`, or upgrade to Kysely 0.29. The [Kysely docs](https://kysely.dev/docs/migrations) show the current import.

`column "..." of relation "users" already exists`
: Two migration runs started at the same time through the pooled connection, and both tried to apply the same migration. Run migrations with `DATABASE_URL_UNPOOLED`, as `src/migrate.ts` does, and check that the variable holds the direct connection string, which has no `-pooler` in its host name.

</DefinitionList>

## Next steps

- [Kysely documentation](https://kysely.dev/docs/intro): the query builder API, including joins, transactions, and subqueries.
- **Deploy:** set `DATABASE_URL` and `DATABASE_URL_UNPOOLED` in your host's environment, and run `src/migrate.ts` before you start the app. Set them on the server only, because they hold your credentials.
- **Pool errors:** the node-postgres `Pool` in `src/db.ts` emits an `error` event when an idle connection drops, for example after a compute scales to zero (Neon stops an idle compute until the next query). Attach an `error` listener to the pool so the app doesn't stop. See [Connection latency](/docs/connect/connection-latency) for scale to zero.
- **Add more of your backend:** [Managed Better Auth](/docs/auth/overview) for sign-in, [Object Storage](/docs/storage/overview) for files, [Neon Functions](/docs/compute/functions/overview) for long-running work, [AI Gateway](/docs/ai-gateway/overview) for LLM calls, and [Realtime](/docs/realtime/overview) for live updates from SQL queries. Each one branches with your database.
- **Realtime with Kysely:** [use your Kysely queries for live updates](/docs/realtime/examples/kysely).

<NeedHelp/>
