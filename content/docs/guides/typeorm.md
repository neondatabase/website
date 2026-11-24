---
title: Connect from TypeORM to Neon
subtitle: Create a Neon project, link it with neon link, and query Lakebase Postgres through TypeORM 1 with the pg driver
summary: >-
  Run neon link to write pooled and direct connection strings, then run TypeORM
  1 migrations over the direct one and query Lakebase Postgres on Neon.
enableTableOfContents: true
updatedOn: '2026-11-20T21:28:11.957Z'
---

<PromptBlock src="/prompts/typeorm-prompt.md" labels={["Set up your agent and follow this guide", "Look up TypeORM's docs", "Connect your TypeORM app"]} />

<Steps>

## Start from a Node.js project

TypeORM 1, an ORM that maps TypeScript classes to database tables, needs Node.js 22.13 or later on the 22 line, or 24.11 or later on the 24 line (its engines field). The commands in this guide use the `--env-file-if-exists` flag, which is stable from 22.21 and 24.10, so use 22.21 or later, or 24.11 or later. Use a project you already have, or create one with [Connect a Node.js application to Neon](/docs/guides/node), which makes an ES module project. Skip this step if you already have a project.

## Add Neon's agent skills (optional)

Run `npx neon@latest skills` from your project directory to add Neon's [agent skills](/docs/ai/agent-skills), which teach your AI coding agent how to use the Neon CLI, branches, and Neon's backend services. The command needs Node.js 22.20 or later. The agent prompt at the top of this page installs them, so skip this step if you used it:

```bash filename="Terminal"
npx neon@latest skills
```

To also connect the [Neon MCP Server](/docs/ai/neon-mcp-server), run `npx neon@latest mcp`.

TypeORM publishes its docs for AI agents at [llms.txt](https://typeorm.io/llms.txt), and the agent prompt points your agent there.

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

Write `DATABASE_URL` (pooled) and `DATABASE_URL_UNPOOLED` (direct) to an env file. `neon link` does this for you. The **pooled** connection goes through Neon's connection pooler, and its host name has `-pooler`. Your app uses it. The **direct** connection goes straight to Postgres, and the migration commands use it (see [Why two connection strings?](#why-two-connection-strings)).

Before you connect, keep the env files and installed packages out of git. This appends them to `.gitignore`, and it applies to both tabs:

```bash filename="Terminal"
printf '\nnode_modules\n.env\n.env.local\n' >> .gitignore
```

<Tabs labels={["Neon CLI", "Without the CLI"]}>

<TabItem>

Then, from your app's directory, link it to the Neon project (install the [Neon CLI](/docs/cli/install) and run `neon login` first if you haven't):

```bash filename="Terminal"
neon link --no-config
```

`neon link` prompts you to pick an organization and a project, or to create a new project. Then it:

- writes a `.neon` file with the project context;
- pins a branch (pass `--branch` to choose one);
- pulls that branch's `DATABASE_URL` (pooled) and `DATABASE_URL_UNPOOLED` (direct) into `.env.local`, or into `.env` if your project already has one.

`--no-config` skips the offer to create a [`neon.ts`](/docs/reference/neon-ts) file, which this guide doesn't use.

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

TypeORM's `pg` driver prints a `SECURITY WARNING` for `sslmode=require`. Change it to `sslmode=verify-full` in your env file to keep the same behavior without the warning. `neon link`, `neon checkout`, `neon env pull`, and `neon deploy` write `sslmode=require` again, so repeat the change after you run them.

## Work on a development branch (optional)

Run `neon checkout dev --create` to develop on a branch of your database instead of the default branch, where production data usually lives. The default branch is `main` for projects created with the CLI or API, and `production` for projects created in the Console. A [branch](/docs/introduction/branching) starts from its parent's data and schema without copying them (copy-on-write: only the changes you make are stored), so you can change it freely:

```bash filename="Terminal"
neon checkout dev --create
```

This creates the `dev` branch, pins it in `.neon`, and pulls its `DATABASE_URL` and `DATABASE_URL_UNPOOLED` into the same env file, so your app now uses the branch. To switch back, run `neon checkout main` (or `production`).

## Install TypeORM and the pg driver

Install TypeORM 1, the `pg` driver that TypeORM uses for Postgres, and `tsx`, which runs TypeScript files and the TypeORM CLI. `@types/node` types `process.env`:

```bash filename="Terminal"
npm install typeorm@1 pg
npm install -D tsx typescript @types/node
```

This guide is for TypeORM 1. For TypeORM 0.3 or earlier, see [Upgrading from 0.3 to 1.0](https://typeorm.io/docs/releases/1.0/upgrading-from-0.3).

## Configure TypeORM

Create `tsconfig.json` with the two decorator settings. Decorators are the `@` annotations that TypeORM reads to map a class to a table, so its entity decorators need `experimentalDecorators`. TypeORM's docs also set `emitDecoratorMetadata`. The `types` line lets TypeScript find Node's type definitions.

```json filename="tsconfig.json"
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "types": ["node"],
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

Then create `src/data-source.ts`. It defines the connection your app uses, through the pooled `DATABASE_URL`.

```typescript filename="src/data-source.ts"
import { DataSource } from 'typeorm'
import { User } from './entities/User'

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User],
  migrations: ['src/migrations/*.ts'],
})
```

The `url` option passes in `DATABASE_URL`, because TypeORM doesn't read that variable on its own. If it's unset, TypeORM connects to `localhost` on port 5432.

Create `src/migration-data-source.ts` for the migration commands. It's the same connection setup, but it reads the direct `DATABASE_URL_UNPOOLED`. The TypeORM CLI reads this file to find your database, and it doesn't load env files itself, so the commands in this guide pass `--env-file-if-exists` to `node`. That loads `.env` and then `.env.local` before the file runs.

```typescript filename="src/migration-data-source.ts"
import { DataSource } from 'typeorm'
import { User } from './entities/User'

export const MigrationDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL_UNPOOLED,
  entities: [User],
  migrations: ['src/migrations/*.ts'],
})
```

## Define a model and run a migration

Create `src/entities/User.ts`. An entity is a class that maps to a table, and each property with a `@Column` maps to a column. Every `@Column` sets its `type`, because `tsx` doesn't emit the type metadata that TypeORM uses to guess one:

```typescript filename="src/entities/User.ts"
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'text', unique: true })
  email!: string

  @Column({ type: 'text', nullable: true })
  name!: string | null
}
```

Generate a migration from the entity. A migration is a file of SQL changes that TypeORM records and runs in order. TypeORM compares the entity with your database, so the command connects to the direct URL, and writes the file to `src/migrations`:

```bash filename="Terminal" shouldWrap
node --env-file-if-exists=.env --env-file-if-exists=.env.local --import tsx node_modules/typeorm/cli.js migration:generate -d src/migration-data-source.ts src/migrations/init
```

The file's name starts with a timestamp, like `1795152834227-init.ts`, and it creates the `user` table. Apply the migration:

```bash filename="Terminal" shouldWrap
node --env-file-if-exists=.env --env-file-if-exists=.env.local --import tsx node_modules/typeorm/cli.js migration:run -d src/migration-data-source.ts
```

`migration:run` applies the pending migrations in one transaction. Running it again prints `No migrations are pending`.

## Query it

Create `src/main.ts`. It opens the connection, saves a user, reads the user back, and prints the Postgres version:

```typescript filename="src/main.ts"
import { AppDataSource } from './data-source'
import { User } from './entities/User'

await AppDataSource.initialize()
try {
  const users = AppDataSource.getRepository(User)
  const user = await users.save({ email: `ada-${Date.now()}@example.com`, name: 'Ada' })
  const found = await users.findOneBy({ id: user.id })
  console.log('User:', found)

  const [row] = await AppDataSource.query('SELECT version()')
  console.log('Postgres version:', row.version)
} finally {
  await AppDataSource.destroy()
}
```

Run the script:

```bash filename="Terminal" shouldWrap
node --env-file-if-exists=.env --env-file-if-exists=.env.local --import tsx src/main.ts
```

The output shows the new user and the Postgres version. Each run adds one user.

</Steps>

## Why two connection strings?

Your app uses the pooled `DATABASE_URL`, which goes through PgBouncer, the connection pooler Neon runs. Migrations use the direct `DATABASE_URL_UNPOOLED`, because PgBouncer runs in [transaction mode](/docs/connect/connection-pooling#connection-pooling-in-transaction-mode), and Neon's [connection pooling guide](/docs/connect/connection-pooling) lists schema migrations as direct-connection work. The `-d` option of the migration commands points at `src/migration-data-source.ts`, which reads the direct URL.

## Troubleshooting

<DefinitionList>

`Column type for User#email is not defined and cannot be guessed`
: Give the column an explicit `type`, as the entity above does. `tsx` doesn't emit the type metadata that TypeORM uses to guess it.

`TypeError: Cannot read properties of undefined (reading 'constructor')`
: `tsconfig.json` is missing `experimentalDecorators`. Add the settings from the Configure step.

`AggregateError [ECONNREFUSED]`
: A URL variable isn't set, so TypeORM connects to `localhost` on port 5432. The app reads `DATABASE_URL`, and the migration commands read `DATABASE_URL_UNPOOLED`. Check that your env file sets both, and that the command passes the two `--env-file-if-exists` flags.

`QueryFailedError: relation "user" does not exist`
: The migration hasn't run on the database your URL points to. Run the `migration:run` command from the migration step.

</DefinitionList>

## Next steps

- **Deploy:** set both `DATABASE_URL` and `DATABASE_URL_UNPOOLED` in your host's environment, and run migrations from CI or a machine with dev dependencies, because `tsx` is a dev dependency.
- **Add more of your backend:** [Managed Better Auth](/docs/auth/overview) for sign-in, [Object Storage](/docs/storage/overview) for files, [Neon Functions](/docs/compute/functions/overview) for long-running work, [AI Gateway](/docs/ai-gateway/overview) for LLM calls, and [Realtime](/docs/realtime/overview) for live updates from SQL queries. Each one branches with your database.
- [TypeORM documentation](https://typeorm.io/docs/getting-started): the TypeORM 1 reference, including [generating migrations](https://typeorm.io/docs/migrations/generating).

<NeedHelp/>
