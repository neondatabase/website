---
title: 'Where do I find a copy-pasteable Postgres connection string in Neon?'
subtitle: 'Project Dashboard → Connect. Pick branch, database, and role; copy the string for your framework.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-05-18T19:11:12.829Z'
isDraft: false
redirectFrom: []
---

## Quick answer

Open your project's dashboard in the [Neon Console](https://console.neon.tech), click the **Connect** button at the top right, and copy the connection string from the modal. You can choose the branch, compute, database, and role, and the string is regenerated for your selection. The modal also has a framework dropdown that gives you ready-made snippets for Node.js, Prisma, Drizzle, psql, Python, and more.

## Get the connection string

1. Go to the [Neon Console](https://console.neon.tech) and open your project.
2. Click **Connect** at the top right of the **Project Dashboard**.
3. In the **Connect to your database** modal:
   - Pick the **branch** (default is `production` or `main`).
   - Pick the **compute**, **database**, and **role**.
   - Choose **Connection pooling** if you want a pooled string (recommended for serverless and high-concurrency workloads).
4. Click the copy icon next to the connection string.

A Neon connection string looks like this:

```text shouldWrap
postgresql://alex:AbC123dEf@ep-cool-darkness-a1b2c3d4-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

The pieces:

- `alex`: the role
- `AbC123dEf`: the role's password
- `ep-cool-darkness-a1b2c3d4-pooler.us-east-2.aws.neon.tech`: the compute hostname (the `-pooler` suffix appears on pooled strings)
- `dbname`: the database name
- `sslmode=require&channel_binding=require`: required SSL settings

See [Connect from any application](/docs/connect/connect-from-any-app) for the full breakdown.

## Framework and language snippets

The same modal has a dropdown with code snippets for popular frameworks and drivers. Pick yours and the snippet updates with your actual credentials and hostname.

Options include Node.js (`pg`), Prisma, Drizzle, the [Neon serverless driver](/docs/serverless/serverless-driver) for edge runtimes, Python (`psycopg2`, `asyncpg`), Go (`pgx`), Java (JDBC), Ruby, Rust, PHP, .NET, and more. Each snippet shows how to use the connection string with that library's connection helper.

For more in-depth setup, browse the [framework guides](/docs/get-started/frameworks) and [language guides](/docs/get-started/languages).

## CLI

If you want the connection string from the terminal:

```bash
neon connection-string
```

Pass the branch name as a positional argument, and use `--database-name <db>`, `--role-name <role>`, or `--pooled` to control the output. See [`neon connection-string`](/docs/reference/cli-connection-string).

<Admonition type="tip" title="Save it to a password manager">
The Console's modal has a **Save in 1Password** button if you have the 1Password browser extension installed. It pushes the connection details straight into a new 1Password item so you don't have to copy-paste into the secret manager separately.
</Admonition>

<CTA title="Need a pooled vs unpooled connection?" description="Use the pooler for serverless and high-concurrency workloads. Use the direct string for migrations, replication, and Prisma Migrate." buttonText="Connection pooling guide" buttonUrl="/docs/connect/connection-pooling" />
