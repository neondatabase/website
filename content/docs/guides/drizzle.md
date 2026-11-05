---
title: Connect from Drizzle to Neon
subtitle: Learn how to connect to Neon from Drizzle
summary: >-
  Drizzle ORM connection guide for Lakebase Postgres on Neon walks through initializing a
  TypeScript/Node.js project with supported drivers: Neon serverless HTTP, Neon
  WebSocket, node-postgres, and postgres.js. Use this page when you need
  type-safe queries plus Drizzle Kit migrations against a Lakebase Postgres database on Neon and want
  to pick the right driver for serverless or long-running environments. The
  guide also shows how to point Drizzle at different Neon branches per
  environment by selecting a connection string based on NODE_ENV.
enableTableOfContents: true
agentPrompt: 'I want to use Drizzle ORM with it.'
updatedOn: '2026-11-05T22:22:10.322Z'
---

Drizzle is a TypeScript ORM with type-safe queries. Set up your coding agent once, tell it about your app, then use the prompts below to build on Neon with Drizzle. To follow each step by hand instead, the full walkthrough is in the [Full setup, step by step](#full-setup-step-by-step) section below.

[comment]: <> (Prototype TODO: the Drizzle agent-skill install commands in public/prompts/drizzle-agent-setup.md are release-candidate per orm.drizzle.team/docs/drizzle-kit-skills and should be re-verified against that page before publishing.)

<Steps>

## Set up your agent for your project

Copy both prompts into your agent. The first sets it up for Neon; the second installs Drizzle's own agent skill so it follows Drizzle's current guidance.

<div className="not-prose grid grid-cols-2 gap-6 lg:grid-cols-1">

<div className="[&>div]:my-0!">
<AgentPrompt title="Set up Neon" src="/prompts/neon-setup.md" buttonText="Copy prompt" />
</div>

<div className="[&>div]:my-0!">
<AgentPrompt title="Set up Drizzle" src="/prompts/drizzle-agent-setup.md" buttonText="Copy prompt" />
</div>

</div>

## Tell your agent about your app

Point your agent at this project. It inspects what you have (or asks, if you are starting fresh), wires up Drizzle against Neon Postgres, and recommends which Neon services the app needs.

<AgentPrompt title="Discover and set up" src="/prompts/drizzle-discovery.md" buttonText="Copy prompt" />

## Do more with Neon

Drizzle tasks are on the left, Neon branching workflows on the right. Each prompt is grounded in the Neon docs and the neon-postgres agent skill.

<div className="not-prose grid grid-cols-2 gap-6 lg:grid-cols-1">

<div className="flex flex-col gap-4 [&>div]:my-0!">
<p className="m-0 text-sm font-medium tracking-tight text-gray-new-20 dark:text-gray-new-80">Drizzle with Neon</p>
<AgentPrompt title="Generate a migration" src="/prompts/drizzle-migration.md" buttonText="Copy prompt" />
<AgentPrompt title="Pooled vs direct URL" src="/prompts/drizzle-pooled-direct.md" buttonText="Copy prompt" />
<AgentPrompt title="Serverless HTTP driver" src="/prompts/drizzle-serverless-http.md" buttonText="Copy prompt" />
<AgentPrompt title="Add Lakebase Search" src="/prompts/drizzle-search.md" buttonText="Copy prompt" />
</div>

<div className="flex flex-col gap-4 [&>div]:my-0!">
<p className="m-0 text-sm font-medium tracking-tight text-gray-new-20 dark:text-gray-new-80">Neon branching</p>
<AgentPrompt title="Branch per pull request" src="/prompts/drizzle-branch-per-pr.md" buttonText="Copy prompt" />
<AgentPrompt title="Schema-only branch" src="/prompts/drizzle-schema-only-branch.md" buttonText="Copy prompt" />
<AgentPrompt title="Reset from parent" src="/prompts/drizzle-reset-from-parent.md" buttonText="Copy prompt" />
<AgentPrompt title="Instant restore" src="/prompts/drizzle-instant-restore.md" buttonText="Copy prompt" />
</div>

</div>

</Steps>

## Full setup, step by step

<Callout title="Realtime with Drizzle">
See how to subscribe to live SQL queries with [Neon Realtime + Drizzle](/docs/realtime/examples/drizzle)
</Callout>

<CopyPrompt src="/prompts/drizzle-prompt.md" 
description="Pre-built prompt for connecting Node/TypeScript applications to Neon using Drizzle ORM."/>

<InfoBlock>
<DocsList title="What you will learn:">
<p>How to connect from Drizzle using different drivers</p>
<p>How to configure Drizzle Kit for migrations</p>
</DocsList>

<DocsList title="Related resources" theme="docs">
  <a href="https://orm.drizzle.team/docs/tutorials/drizzle-with-neon">Drizzle with Neon Postgres (Drizzle Docs)</a>
  <a href="/docs/guides/drizzle-migrations">Schema migration with Drizzle ORM</a>
  <a href="/docs/guides/nextjs#video-walkthrough">Getting started with Neon (Next.js and Drizzle video)</a>
</DocsList>

</InfoBlock>

Drizzle is a TypeScript ORM with type-safe queries. This guide shows you how to connect your application to a database on Neon using Drizzle ORM.

To connect a TypeScript/Node.js project to Neon using Drizzle ORM, follow these steps:

<Steps>

## Create a TypeScript/Node.js project

Create a new directory for your project and navigate into it:

```bash
mkdir my-drizzle-neon-project
cd my-drizzle-neon-project
```

Initialize a new Node.js project with a `package.json` file:

```bash
npm init -y
```

## Create a Neon project

If you do not have one already, create a Neon project.

1.  Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2.  Click **New Project**.
3.  Specify your project settings and click **Create Project**.

## Get your connection string

Find your database connection string by clicking the **Connect** button in the Console nav to open the **Connect to your branch** modal. Select a branch, a user, and the database you want to connect to. A connection string is constructed for you.
![Connection details modal](/docs/connect/connect_to_branch_modal.png)
The connection string includes the user name, password, hostname, and database name.

Create a `.env` file in your project's root directory and add the connection string to it. Your `.env` file should look like this:

```text shouldWrap
# Pooled connection for your application
DATABASE_URL="postgresql://[user]:[password]@[endpoint]-pooler.[region].aws.neon.tech/[dbname]?sslmode=require&channel_binding=require"

# Unpooled connection for Drizzle Kit
DATABASE_URL_UNPOOLED="postgresql://[user]:[password]@[endpoint].[region].aws.neon.tech/[dbname]?sslmode=require&channel_binding=require"
```

<Admonition type="note">
Neon supports both direct and pooled connection strings, which you can find by clicking the **Connect** button in the Console nav. A pooled connection string (the hostname includes `-pooler`) routes through a PgBouncer connection pool, which suits your application at runtime. However, using a pooled connection string for migrations can lead to errors. Use a direct (non-pooled) connection when running Drizzle Kit migrations. If you only have the pooled string, remove `-pooler` from the hostname to get the direct one. For more information, see [Connection pooling](/docs/connect/connection-pooling) and [Schema migration with Drizzle ORM](/docs/guides/drizzle-migrations).
</Admonition>

## Install Drizzle and a driver

Install Drizzle ORM, Drizzle Kit for migrations, `tsx` to run TypeScript, and a database driver. If you're not sure which driver to use, choose `node-postgres` for a Node.js server or script, and the Neon serverless HTTP driver for serverless and edge functions. For more detail, see [Choosing your connection method](/docs/connect/choose-connection).

<Tabs labels={["Neon Serverless (HTTP)", "Neon WebSocket", "node-postgres", "postgres.js"]}>

<TabItem>

Use the Neon serverless HTTP driver for serverless environments (for example, Vercel, Netlify).

```bash
npm install drizzle-orm @neondatabase/serverless dotenv
npm install -D drizzle-kit tsx
```

</TabItem>

<TabItem>

Use the Neon WebSocket driver when you need sessions or interactive transactions in a serverless or edge environment.

```bash
npm install drizzle-orm @neondatabase/serverless ws dotenv
npm install -D drizzle-kit tsx @types/ws
```

</TabItem>

<TabItem>

Use the `node-postgres` (`pg`) driver for Node.js servers and scripts that keep a TCP connection pool.

```bash
npm install drizzle-orm pg dotenv
npm install -D drizzle-kit tsx @types/pg
```

`pg` 8.23 and later print a `SECURITY WARNING` when a connection string uses `sslmode=require`. To keep the current behavior and remove the warning, change `sslmode=require` to `sslmode=verify-full` in both connection strings.

</TabItem>

<TabItem>

Use the `postgres.js` driver, another TCP driver for Node.js servers and scripts.

```bash
npm install drizzle-orm postgres dotenv
npm install -D drizzle-kit tsx
```

</TabItem>

</Tabs>

## Configure Drizzle Kit

Drizzle Kit uses a configuration file to manage schema and migrations. Create a `drizzle.config.ts` file in your project root and add the following content. This configuration tells Drizzle where to find your schema and where to output migration files.

```typescript
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL_UNPOOLED) {
  throw new Error('DATABASE_URL_UNPOOLED is not set in the .env file');
}

export default defineConfig({
  schema: './src/schema.ts', // Your schema file path
  out: './drizzle', // Your migrations folder
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL_UNPOOLED,
  },
});
```

<Admonition type="tip" title="Loading a .env.local file">
`import 'dotenv/config'` loads variables from a `.env` file. If you keep your connection string in `.env.local` (a common convention in Next.js and other frameworks), point dotenv at it explicitly instead:

```typescript
import { config } from 'dotenv';
config({ path: '.env.local' });

import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL_UNPOOLED) {
  throw new Error('DATABASE_URL_UNPOOLED is not set in .env.local');
}

// ...rest of config unchanged
```

</Admonition>

## Initialize the Drizzle client

Create a file: `src/db.ts`, to initialize and export your Drizzle client. The setup varies depending on the driver you installed.

<Tabs labels={["Neon Serverless (HTTP)", "Neon WebSocket", "node-postgres", "postgres.js"]}>

<TabItem>

```typescript
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);
```

</TabItem>

<TabItem>

```typescript
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// For Node.js environments older than v22, you must provide a WebSocket constructor
neonConfig.webSocketConstructor = ws;

// To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
// neonConfig.poolQueryViaFetch = true

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
export const db = drizzle(pool);
```

</TabItem>

<TabItem>

```typescript
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

export const db = drizzle(pool);
```

</TabItem>

<TabItem>

```typescript
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client);
```

</TabItem>

</Tabs>

## Create a schema

Drizzle uses a schema-first approach, allowing you to define your database schema using TypeScript. This schema will be used to generate migrations and ensure type safety throughout your application.

The following example defines a schema for a simple `demo_users` table. Create a `src/schema.ts` file and add the following content:

```typescript
import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const demoUsers = pgTable('demo_users', {
  id: serial('id').primaryKey(),
  name: text('name'),
});
```

## Generate migrations

After defining your schema, you can generate migration files with Drizzle Kit. This will create the necessary SQL files to set up your database schema in Neon.

```bash
npx drizzle-kit generate
```

You should see output similar to the following, indicating that migration files have been created:

```bash
$ npx drizzle-kit generate
No config path provided, using default 'drizzle.config.ts'
Reading config file '/home/user/drizzle/drizzle.config.ts'
1 tables
demo_users 2 columns 0 indexes 0 fks

[✓] Your SQL migration file ➜ drizzle/0000_clever_purple_man.sql 🚀
```

You can find the generated SQL migration files in the `drizzle` directory specified in your `drizzle.config.ts`.

## Apply migrations

Apply the generated migrations (SQL files) to your Neon database using Drizzle Kit. This command will use the `drizzle.config.ts` file for database connection details and apply the migrations to your Neon database.

```bash
npx drizzle-kit migrate
```

You should see output similar to the following, indicating that the migrations have been applied successfully:

```bash
$ npx drizzle-kit migrate
No config path provided, using default 'drizzle.config.ts'
Reading config file '/home/user/drizzle/drizzle.config.ts'
Using 'pg' driver for database querying
```

The driver line depends on the driver you installed. With `@neondatabase/serverless`, Drizzle Kit also warns that it can only connect to Neon through a websocket. The migration still applies, so you can ignore that warning.

You can verify that the `demo_users` table has been created in your Neon database by checking the **Tables** section in the Neon Console.

## Query the database

Create a file: `src/index.ts`, to interact with your database using the Drizzle client. Here's an example of inserting a new user and querying all users from the `demo_users` table:

<Tabs labels={["Neon Serverless (HTTP)", "Neon WebSocket / node-postgres / postgres.js"]}>

<TabItem>

```typescript shouldWrap
import { db } from './db';
import { demoUsers } from './schema';

async function main() {
  try {
    await db.insert(demoUsers).values({ name: 'John Doe' });
    const result = await db.select().from(demoUsers);
    console.log('Successfully queried the database:', result);
  } catch (error) {
    console.error('Error querying the database:', error);
  }
}

main();
```

</TabItem>

<TabItem>

```typescript shouldWrap
import { db } from './db';
import { demoUsers } from './schema';

async function main() {
  try {
    await db.insert(demoUsers).values({ name: 'John Doe' });
    const result = await db.select().from(demoUsers);
    console.log('Successfully queried the database:', result);
  } catch (error) {
    console.error('Error querying the database:', error);
  } finally {
    // Close the database connection to ensure proper shutdown for Neon WebSocket, node-postgres, and postgres.js drivers
    await db.$client.end();
  }
}

main();
```

</TabItem>

</Tabs>

Run the script using `tsx`:

```bash
npx tsx src/index.ts
```

You should see output similar to the following, indicating that the user was inserted and queried successfully:

```bash
Successfully queried the database: [ { id: 1, name: 'John Doe' } ]
```

</Steps>

## Using Neon branches with Drizzle

You can point Drizzle at different Neon [branches](/docs/introduction/branching) per environment by selecting the connection string based on `NODE_ENV` (or any other environment variable):

```typescript
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

const getBranchUrl = () => {
  const env = process.env.NODE_ENV;
  if (env === 'development') return process.env.DEV_DATABASE_URL;
  if (env === 'test') return process.env.TEST_DATABASE_URL;
  return process.env.DATABASE_URL;
};

const sql = neon(getBranchUrl()!);
export const db = drizzle({ client: sql });
```

Each branch has its own connection string, available in the Neon Console or via the CLI (`neon connection-string <branch-id-or-name> --project-id <project-id>`).

## Resources

- [Get Started with Drizzle and Neon](https://orm.drizzle.team/docs/get-started/neon-new)
- [Drizzle with Neon Postgres](https://orm.drizzle.team/docs/tutorials/drizzle-with-neon)
- [Schema migration with Lakebase Postgres and Drizzle ORM](/docs/guides/drizzle-migrations)
- [Todo App with Neon Postgres and Drizzle ORM](https://orm.drizzle.team/docs/tutorials/drizzle-nextjs-neon)

## Next steps

- [Set up Managed Better Auth](/docs/auth/overview): Add managed authentication that branches with your database
- [Add Object Storage](/docs/storage/overview): S3-compatible file storage that branches with your database
- [Deploy a Function](/docs/compute/functions/overview): Run backend compute next to your database, no separate hosting needed
- [Call an LLM with AI Gateway](/docs/ai-gateway/overview): Access foundation models from Anthropic, OpenAI, Google, and more with one credential
- [Realtime](/docs/realtime/examples/drizzle): Build realtime Drizzle apps on Neon using your existing schema and queries

<NeedHelp/>
