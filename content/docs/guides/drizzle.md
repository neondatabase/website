---
title: Connect from Drizzle to Neon
subtitle: Set up Drizzle ORM and Drizzle Kit with Neon Postgres.
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
updatedOn: '2026-11-06T13:46:55.233Z'
---

<div className="not-prose my-8 rounded-[10px] border border-gray-new-90 bg-gray-new-95 px-6 py-7 dark:border-gray-new-15 dark:bg-gray-new-10 [&>h2]:m-0 [&>h2]:mb-7 [&>h2]:w-fit [&>h2]:text-[28px] [&>h2]:leading-tight [&>h2]:font-medium [&>h2]:tracking-tighter [&>h2]:text-black-pure dark:[&>h2]:text-white [&_h3]:relative [&_h3]:mt-7 [&_h3]:mb-2 [&_h3]:w-fit [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:tracking-tight [&_h3]:text-black-pure [&_h3]:before:absolute [&_h3]:before:-left-11 [&_h3]:before:top-px [&_h3]:before:flex [&_h3]:before:size-7 [&_h3]:before:items-center [&_h3]:before:justify-center [&_h3]:before:rounded-full [&_h3]:before:bg-black-new [&_h3]:before:text-[13px] [&_h3]:before:font-semibold [&_h3]:before:text-white [&_h3]:before:content-[counter(step)] [&_h3]:before:[counter-increment:step] dark:[&_h3]:text-white dark:[&_h3]:before:bg-white dark:[&_h3]:before:text-black-pure">

## Build with your agent

<div className="pl-11 [counter-reset:step] [&>h3:first-child]:mt-0!">

### Give your agent the skills

<p className="m-0 mb-3 text-[15px] leading-relaxed text-gray-new-30 dark:text-gray-new-70">Add skills to your project.</p>

<CopyLine text="Set me up for Neon. Fetch https://neon.com/prompts/agent-setup.md and follow it." />

<CopyLine text="Add the Drizzle skill to this project. Fetch https://orm.drizzle.team/docs/drizzle-kit-skills and follow it." />

<p className="mt-3 text-[13px] leading-relaxed text-gray-new-50 dark:text-gray-new-60">The Drizzle skill is maintained by the <a href="https://orm.drizzle.team/docs/drizzle-kit-skills">Drizzle team</a> and currently ships in Drizzle Kit's v1 pre-release (drizzle-kit@rc), so the agent installs it once Drizzle is in your project.</p>

### Set up your project

<p className="m-0 mb-3 text-[15px] leading-relaxed text-gray-new-30 dark:text-gray-new-70">The agent inspects your project, creates a Neon project if you need one, adds the connection string, and configures Drizzle to match.</p>

<CopyLine text="Look at my project (check package.json, any existing schema, and my config), then set up Drizzle against Neon Postgres: create a Neon project if I need one, add the connection string, and configure Drizzle to match what you found." />

### More things to ask for

<AgentPromptList
items={[
{ text: 'Create a Neon branch for every pull request' },
{ text: 'Test a migration on a schema-only branch first (beta)' },
{ text: 'Reset my dev branch from its parent' },
{ text: 'Switch to the Neon serverless driver so my app runs on the edge' },
{ text: 'Use instant restore to recover if a migration breaks' },
]}
/>

</div>

</div>

<div className="mt-12 [&>h2:first-child]:mt-0! [&_.numbered-step]:before:border [&_.numbered-step]:before:border-gray-new-50 [&_.numbered-step]:before:bg-transparent! [&_.numbered-step]:before:text-gray-new-40! dark:[&_.numbered-step]:before:border-gray-new-30 dark:[&_.numbered-step]:before:bg-transparent! dark:[&_.numbered-step]:before:text-gray-new-70!">

## Full setup, step by step

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
- [Getting started with Neon (Next.js and Drizzle video)](/docs/guides/nextjs#video-walkthrough)
- [Realtime with Drizzle](/docs/realtime/examples/drizzle)

## Next steps

- [Set up Managed Better Auth](/docs/auth/overview): Add managed authentication that branches with your database
- [Add Object Storage](/docs/storage/overview): S3-compatible file storage that branches with your database
- [Deploy a Function](/docs/compute/functions/overview): Run backend compute next to your database, no separate hosting needed
- [Call an LLM with AI Gateway](/docs/ai-gateway/overview): Access foundation models from Anthropic, OpenAI, Google, and more with one credential

</div>

<NeedHelp/>
