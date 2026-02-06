---
title: Connect from Drizzle to Neon
subtitle: Learn how to connect to Neon from Drizzle
summary: >-
  How to connect a TypeScript/Node.js application to a Neon Postgres database
  using Drizzle ORM, including configuration for migrations and driver
  connections.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:32.957Z'
---

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
</DocsList>

<DocsList title="Source code" theme="repo">
  <a href="https://github.com/neondatabase/examples/tree/main/with-nextjs-drizzle-edge">Next.js Edge Functions with Drizzle</a>
</DocsList>

</InfoBlock>

Drizzle is a modern ORM for TypeScript that provides a simple and type-safe way to interact with your database. This guide demonstrates how to connect your application to a Neon Postgres database using Drizzle ORM.

<Admonition type="tip" title="AI Rules available">
Working with AI coding assistants? Check out our [AI rules for Drizzle ORM with Neon](/docs/ai/ai-rules-neon-drizzle) to help your AI assistant generate better code when using Drizzle with your Neon database.
</Admonition>

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

Find your database connection string by clicking the **Connect** button on your **Project Dashboard** to open the **Connect to your database** modal. Select a branch, a user, and the database you want to connect to. A connection string is constructed for you.
![Connection details modal](/docs/connect/connection_details.png)
The connection string includes the user name, password, hostname, and database name.

Create a `.env` file in your project's root directory and add the connection string to it. Your `.env` file should look like this:

```text shouldWrap
DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"
```

## Install Drizzle and a driver

Install Drizzle ORM, Drizzle Kit for migrations, and your preferred database driver. Choose one of the following drivers based on your application's needs:

<Tabs labels={["Neon Serverless (HTTP)", "Neon WebSocket", "node-postgres", "postgres.js"]}>

<TabItem>

Use the Neon serverless HTTP driver for serverless environments (e.g., Vercel, Netlify).

```bash
npm install drizzle-orm @neondatabase/serverless dotenv
npm install -D drizzle-kit
```

</TabItem>

<TabItem>

Use the Neon WebSocket driver for long-running applications that require a persistent connection (e.g., a standard Node.js server).

```bash
npm install drizzle-orm @neondatabase/serverless ws dotenv
npm install -D drizzle-kit @types/ws
```

</TabItem>

<TabItem>

Use the classic `node-postgres` (`pg`) driver, a widely-used and stable choice for Node.js applications.

```bash
npm install drizzle-orm pg dotenv
npm install -D drizzle-kit @types/pg
```

</TabItem>

<TabItem>

Use the `postgres.js` driver, a modern and lightweight Postgres client for Node.js.

```bash
npm install drizzle-orm postgres dotenv
npm install -D drizzle-kit
```

</TabItem>

</Tabs>

## Configure Drizzle Kit

Drizzle Kit uses a configuration file to manage schema and migrations. Create a `drizzle.config.ts` file in your project root and add the following content. This configuration tells Drizzle where to find your schema and where to output migration files.

```typescript
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in the .env file');
}

export default defineConfig({
  schema: './src/schema.ts', // Your schema file path
  out: './drizzle', // Your migrations folder
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
```

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

## Resources

- [Get Started with Drizzle and Neon](https://orm.drizzle.team/docs/get-started/neon-new)
- [Drizzle with Neon Postgres](https://orm.drizzle.team/docs/tutorials/drizzle-with-neon)
- [Schema migration with Neon Postgres and Drizzle ORM](/docs/guides/drizzle-migrations)
- [Todo App with Neon Postgres and Drizzle ORM](https://orm.drizzle.team/docs/tutorials/drizzle-nextjs-neon)

<NeedHelp/>
