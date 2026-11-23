---
title: Connect from Prisma to Neon
subtitle: Create a Neon project, link it with neon link, and query Lakebase Postgres through Prisma 7 with the Neon driver adapter
summary: >-
  To connect a Prisma app to Lakebase Postgres on Neon, run neon link to get a
  pooled DATABASE_URL and a direct DATABASE_URL_UNPOOLED, then define a model,
  run a migration, and query it with Prisma 7 and the @prisma/adapter-neon
  driver adapter. Covers the prisma.config.ts file, why migrations use the
  direct connection, an optional development branch, the agent prompt, and
  a link for Prisma 6 users.
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/prisma
  - /docs/integrations/prisma
  - /docs/guides/prisma-guide
  - /docs/guides/prisma-migrate
updatedOn: '2026-11-23T15:52:09.688Z'
---

<PromptBlock src="/prompts/prisma-prompt.md" labels={["Set up your agent and follow this guide", "Look up Prisma's docs", "Connect your Prisma app"]} />

<Steps>

## Start from a Node.js project

Prisma 7, an ORM that maps your code to database tables, needs Node.js 22.12 or later. Node.js 21 and earlier lack the global WebSocket that the Neon driver uses, so don't use them. Use a project you already have, or create one with [Connect a Node.js application to Neon](/docs/guides/node), or the guide for your framework, such as [Hono](/docs/guides/hono). Skip this step if you already have a project.

## Add Neon's agent skills (optional)

Run `npx neon@latest skills` from your project directory to add Neon's [agent skills](/docs/ai/agent-skills), which teach your AI coding agent how to use the Neon CLI, branches, and Neon's backend services. The command needs Node.js 22.20 or later. The agent prompt at the top of this page installs them, so skip this step if you used it:

```bash filename="Terminal"
npx neon@latest skills
```

To also connect the [Neon MCP Server](/docs/ai/neon-mcp-server), run `npx neon@latest mcp`.

Prisma publishes its Prisma ORM 7 docs for AI agents at [llms.txt](https://www.prisma.io/docs/llms/orm-v7.txt), and the agent prompt points your agent there.

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

Get two connection strings into an env file. The **pooled** connection goes through Neon's connection pooler, and its host name has `-pooler`. Your app uses it. The **direct** connection goes straight to Postgres, and Prisma's CLI uses it for migrations (see [Why two connection strings?](#why-two-connection-strings)).

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

This creates the `dev` branch, pins it in `.neon`, and pulls its `DATABASE_URL` and `DATABASE_URL_UNPOOLED` into the same env file, so your app now uses the branch. To switch back, run `neon checkout main` (or `production`).

## Install Prisma and the Neon driver adapter

Install Prisma 7, `@prisma/adapter-neon` (the driver adapter that connects Prisma to Neon's serverless driver), and `dotenv`, which loads your env file:

```bash filename="Terminal"
npm install @prisma/client@7 @prisma/adapter-neon@7 dotenv
npm install -D prisma@7 tsx
```

Pin every Prisma package to `@7`: the `prisma` package's `latest` tag points to a Prisma 8 prerelease. The adapter connects Prisma Client to the Neon serverless driver, so you don't install `@neondatabase/serverless` yourself. `tsx` runs TypeScript files.

## Configure Prisma

Edit `prisma7.config.ts` if it exists, otherwise create `prisma.config.ts` in the project root. Put the following in whichever file you use. Prisma CLI commands read the direct connection from this file. Prisma doesn't load env files itself, so the file loads them with `dotenv`:

```typescript filename="prisma.config.ts"
import { config } from 'dotenv'
import { defineConfig, env } from 'prisma/config'

// neon link writes .env.local, or .env if that file exists
config({ path: ['.env.local', '.env'] })

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL_UNPOOLED'),
  },
})
```

Then create `prisma/schema.prisma` with a generator and a datasource. The generator writes Prisma Client, the typed query API for your models, to `src/generated/prisma`:

```prisma filename="prisma/schema.prisma"
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}
```

The datasource has no `url`, because Prisma 7 reads it from the config file. Skip `npx prisma init`: it writes a placeholder `.env` with a local database URL, and it creates `prisma7.config.ts` when no config file exists. If both config files exist, the CLI loads `prisma7.config.ts`, so keep only one.

This guide is for Prisma ORM 7. For Prisma 6 or earlier, see Prisma's [upgrade guide to Prisma 7](https://www.prisma.io/docs/guides/upgrade-prisma-orm/v7).

## Define a model and run a migration

Add a `User` model below the datasource block in `prisma/schema.prisma`:

```prisma filename="prisma/schema.prisma"
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
}
```

Create the table, then generate the client:

```bash filename="Terminal"
npx prisma migrate dev --name init
npx prisma generate
```

`prisma migrate dev` writes SQL files to `prisma/migrations` and applies them through the direct connection. In Prisma 7.10, it doesn't generate the client, so run `npx prisma generate` after each schema change.

## Query it

Create `src/db.ts` to make one Prisma Client for the app, with the Neon adapter. Import `PrismaClient` from the generated folder, not from `@prisma/client`. Like the config file, this loads the env file first, so `DATABASE_URL` is set when the client starts:

```typescript filename="src/db.ts"
import { config } from 'dotenv'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from './generated/prisma/client'

config({ path: ['.env.local', '.env'] })

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
})

export const prisma = new PrismaClient({ adapter })
```

Create `src/main.ts`, a script that writes a user, reads it back, and prints the Postgres version:

```typescript filename="src/main.ts"
import { prisma } from './db'

async function main() {
  const user = await prisma.user.create({
    data: { email: `ada-${Date.now()}@example.com`, name: 'Ada' },
  })
  const found = await prisma.user.findUnique({ where: { id: user.id } })
  console.log('User:', found)

  const [row] = await prisma.$queryRaw<{ version: string }[]>`SELECT version()`
  console.log('Postgres version:', row.version)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
```

Run the script:

```bash filename="Terminal"
npx tsx src/main.ts
```

The output shows the new user and the Postgres version. Each run adds one user.

</Steps>

## Why two connection strings?

Your app uses the pooled `DATABASE_URL`, which goes through PgBouncer, the connection pooler Neon runs. Migrations use the direct `DATABASE_URL_UNPOOLED`, because PgBouncer runs in [transaction mode](/docs/connect/connection-pooling#connection-pooling-in-transaction-mode) and Prisma's CLI needs a single connection (see [Prisma's PgBouncer guide](https://www.prisma.io/docs/orm/v7/prisma-client/setup-and-configuration/databases-connections/pgbouncer)).

## Troubleshooting

<DefinitionList>

`Cannot resolve environment variable: DATABASE_URL_UNPOOLED`
: The env file doesn't set `DATABASE_URL_UNPOOLED`, so the Prisma CLI can't load `prisma.config.ts`. Run `neon env pull` to write both connection strings, or add the direct one to `.env.local` yourself.

`Cannot find module './generated/prisma/client'`
: Prisma Client hasn't been generated. Run `npx prisma generate`, and run it again after each schema change.

`No database host or connection string was set`
: `DATABASE_URL` is missing when the script starts. Check that your env file sets it, or set it in the environment before you run the script.

`P1002` with `Timed out trying to acquire a postgres advisory lock`
: Another migration is running, or an earlier migration ran through the pooled connection and left its advisory lock held. An advisory lock is a lock on a database-wide key, and Prisma Migrate takes one so only one migration runs at a time. In our tests, a migration through the pooled connection left the lock held, and the next migration timed out. Run migrations with `DATABASE_URL_UNPOOLED`, which `prisma.config.ts` already does. If no other migration is running, open [`neon psql`](/docs/cli/psql), which uses the direct connection, and find the session that holds the lock with `SELECT pid, granted FROM pg_locks WHERE locktype = 'advisory' AND classid = 0 AND objid = 72707369 AND objsubid = 1;`. The row with `granted` set to `t` is the holder. End that one session with `SELECT pg_terminate_backend(<pid>);`, using its `pid`.

`Connection terminated due to connection timeout`
: The adapter gave up on a connection attempt. Set `connectionTimeoutMillis` in the `PrismaNeon` config in `src/db.ts`, in milliseconds. The `connect_timeout` URL parameter doesn't apply to the adapter. [Connection latency](/docs/connect/connection-latency) covers scale to zero, when a compute suspends after inactivity.

`Timed out fetching a new connection from the connection pool`
: Prisma's pool error. With the Neon adapter, a query that waits for a free connection fails with `timeout exceeded when trying to connect` instead, once `connectionTimeoutMillis` passes. The pool holds 10 connections by default, so raise `max` in the `PrismaNeon` config to allow more. The `connection_limit` and `pool_timeout` URL parameters don't apply to the adapter; see [Prisma's connection pool guide](https://www.prisma.io/docs/orm/v7/prisma-client/setup-and-configuration/databases-connections/connection-pool).

</DefinitionList>

## Next steps

- [Schema migrations with Prisma](/docs/guides/prisma-migrations): a full tutorial that builds an Express API and changes its schema with several migrations.
- **Deploy:** set `DATABASE_URL` and `DATABASE_URL_UNPOOLED` in your host's environment, and run `npx prisma migrate deploy` before you start the app.
- **Add more of your backend:** [Managed Better Auth](/docs/auth/overview) for sign-in, [Object Storage](/docs/storage/overview) for files, [Neon Functions](/docs/compute/functions/overview) for long-running work, [AI Gateway](/docs/ai-gateway/overview) for LLM calls, and [Realtime](/docs/realtime/overview) for live updates from SQL queries. Each one branches with your database.
- [Prisma documentation](https://www.prisma.io/docs/orm/v7/): the Prisma ORM 7 reference.

<NeedHelp/>
