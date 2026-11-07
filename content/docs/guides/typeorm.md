---
title: Connect from TypeORM to Neon
subtitle: Learn how to connect to Lakebase Postgres from TypeORM
summary: >-
  TypeORM connects to Lakebase Postgres through the `pg` driver: install `pg`,
  set the `DataSource` type to `postgres`, load the connection string from
  `DATABASE_URL` with `dotenv`, and enable `ssl: true`. Serverless deployments
  should use a pooled connection string (add `-pooler` to the endpoint ID) to
  handle high concurrency without exhausting connections. If you set TypeORM's
  `connectTimeoutMS`, leave room for a suspended compute to start.
enableTableOfContents: true
updatedOn: '2026-09-16T20:12:32.981Z'
---

<CopyPrompt src="/prompts/typeorm-prompt.md" 
description="Pre-built prompt for connecting Node.js applications to Lakebase Postgres using TypeORM."/>

TypeORM is an open-source ORM for TypeScript and JavaScript. This guide assumes you have a TypeORM project. To create one, run `npx typeorm init --name my-project --database postgres`. This guide covers the following topics:

- [Connect to a database on Neon from TypeORM](#connect-to-a-database-on-neon-from-typeorm)
- [Use connection pooling with TypeORM](#use-connection-pooling-with-typeorm)
- [Connection timeouts](#connection-timeouts)

## Connect to a database on Neon from TypeORM

To establish a basic connection from TypeORM to a database on Neon, perform the following steps:

1. Retrieve your database connection string. You can find the connection string for your database by clicking the **Connect** button in the Console nav. Select a branch, a user, and the database you want to connect to. A connection string is constructed for you.
   ![Connection details modal](/docs/connect/connect_to_branch_modal.png)
   The connection string includes the user name, password, hostname, and database name.

2. Install the `pg` driver, which TypeORM uses for Postgres, and `dotenv` to load your `.env` file. `npx typeorm init` doesn't install `pg`.

   ```bash
   npm install pg dotenv
   ```

3. Update the TypeORM `DataSource` initialization in your application (`src/data-source.ts` in a project created with `typeorm init`) to the following. Replace the `host`, `port`, `username`, `password`, and `database` options with `url`, and keep your other options, such as `entities` and `migrations`.

   ```typescript {1,7,8}
   import 'dotenv/config';
   import 'reflect-metadata';
   import { DataSource } from 'typeorm';

   export const AppDataSource = new DataSource({
     type: 'postgres',
     url: process.env.DATABASE_URL,
     ssl: true,
     entities: [
       /*list of entities*/
     ],
   });
   ```

   The `import 'dotenv/config'` line loads `.env` before the `DataSource` reads `process.env.DATABASE_URL`. Without it, `DATABASE_URL` is undefined and TypeORM tries to connect to `localhost`.

4. Create a `.env` file in your project root, add a `DATABASE_URL` variable, and set it to the connection string you copied in the first step. Add `.env` to your `.gitignore` so you don't commit the password.

   ```text shouldWrap
   DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"
   ```

   `pg` 8.23 and later print a `SECURITY WARNING` when a connection string uses `sslmode=require`. Change `sslmode=require` to `sslmode=verify-full` to keep the current behavior and remove the warning. For more about SSL modes, see [Connect securely](/docs/connect/connect-securely).

5. Run your application. In a project created with `typeorm init`, run `npm start`. The sample app inserts a user and prints the users it loads from your database.

<Admonition type="tip">
TypeORM uses a [node-postgres](https://node-postgres.com) `Pool` to connect to your Postgres database. Installing [pg-native](https://npmjs.com/package/pg-native) and setting the `NODE_PG_FORCE_NATIVE` environment variable to `true` switches the `pg` driver to `pg-native`, which uses the `libpq` C library.
</Admonition>

## Use connection pooling with TypeORM

Serverless functions can require a large number of database connections as demand increases. If you use serverless functions in your application, we recommend that you use a pooled Neon connection string, as shown:

```ini shouldWrap
# Pooled Neon connection string
DATABASE_URL="postgresql://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require"
```

A pooled Neon connection string adds `-pooler` to the endpoint ID, which tells Neon to use a pooled connection. You can add `-pooler` to your connection string manually or copy a pooled connection string from the **Connect to your branch** modal, which you can access by clicking **Connect** in the Console nav. Enable the **Connection pooling** toggle to add the `-pooler` suffix.

<Admonition type="important">
Use a pooled connection string for your application at runtime, but use a direct (non-pooled) connection string when running TypeORM migrations. Neon's pooled connection uses PgBouncer in transaction mode, which doesn't support all session-level operations that migration tools rely on, so running migrations over a pooled connection can lead to errors. See [Connection pooling](/docs/connect/connection-pooling).
</Admonition>

## Connection timeouts

If your compute has been suspended after a period of inactivity, the first connection starts it again. This usually takes a few hundred milliseconds. See [Scale to zero](/docs/introduction/scale-to-zero).

By default, TypeORM waits for a connection with no timeout. If you set a timeout with TypeORM's `connectTimeoutMS` option, give it enough time for the compute to start:

```typescript {5}
export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: true,
  connectTimeoutMS: 10000,
  entities: [
    /*list of entities*/
  ],
});
```

When the timeout is reached, `pg` throws `Error: Connection terminated due to connection timeout`.

<Admonition type="note">
TypeORM ignores the `connect_timeout` parameter in the connection string. Use `connectTimeoutMS` instead.
</Admonition>

## Next steps

- [Set up Managed Better Auth](/docs/auth/overview): Add managed authentication that branches with your database
- [Add Object Storage](/docs/storage/overview): S3-compatible file storage that branches with your database
- [Deploy a Function](/docs/compute/functions/overview): Run backend compute next to your database, no separate hosting needed
- [Call an LLM with AI Gateway](/docs/ai-gateway/overview): Access foundation models from Anthropic, OpenAI, Google, and more with one credential

<NeedHelp/>
