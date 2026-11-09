---
title: Connect from Prisma to Neon
subtitle: Learn how to connect to Neon from Prisma
summary: >-
  Prisma ORM (Node.js/TypeScript) connects to Neon using the
  `@prisma/adapter-neon` serverless driver adapter, which routes queries over
  WebSockets for compatibility with serverless environments. The setup requires
  two connection strings: a pooled URL (`DATABASE_URL`) for application queries
  and a direct URL (`DATABASE_URL_UNPOOLED`) for Prisma CLI commands such as migrations and
  `db push`. Newer Prisma versions configure the direct connection in
  a Prisma config file (`prisma.config.ts`, or `prisma7.config.ts` in 7.10+); older versions use the `directUrl` property in
  `schema.prisma`.
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/prisma
  - /docs/integrations/prisma
  - /docs/guides/prisma-guide
  - /docs/guides/prisma-migrate
updatedOn: '2026-10-05T14:25:23.981Z'
---

<CopyPrompt src="/prompts/prisma-prompt.md" 
description="Pre-built prompt for connecting Node/TypeScript applications to Neon using Prisma ORM."/>

Prisma is an open-source ORM for Node.js and TypeScript. This guide shows you how to connect a Prisma application to Neon using the recommended setup with the Neon serverless driver adapter.

## Prerequisites

- A [Neon account and project](/docs/get-started-with-neon/signing-up)
- Node.js 20.19+, 22.12+, or 24+ installed (required by Prisma ORM 7)
- A Node.js or TypeScript project (or create a new one)

## Setup

### Step 1: Install dependencies

```bash
npm install @prisma/client@7 @prisma/adapter-neon@7 dotenv
npm install prisma@7 tsx --save-dev
```

<Admonition type="note">
This guide uses Prisma ORM 7. Install the `prisma` CLI, `@prisma/client`, and `@prisma/adapter-neon` at the same major version (`@7`). The `prisma` package's `latest` npm tag currently points to a Prisma 8 prerelease, so an unpinned `npm install prisma` installs a CLI that doesn't match the rest of this setup. If the Prisma CLI later prints an "Update available" notice for Prisma 8, ignore it for this guide.
</Admonition>

### Step 2: Get your connection strings

From your Neon Console, click **Connect** and copy both connection strings:

- **Pooled connection** (has `-pooler` in the hostname): for your application
- **Direct (unpooled) connection**: for Prisma CLI commands (migrations, introspection)

![Connection details modal](/docs/connect/connect_to_branch_modal.png)

Add them to your `.env` file:

```ini shouldWrap
# Pooled connection for your application
DATABASE_URL="postgresql://[user]:[password]@[endpoint]-pooler.[region].aws.neon.tech/[dbname]?sslmode=require&channel_binding=require"

# Direct (unpooled) connection for Prisma CLI
DATABASE_URL_UNPOOLED="postgresql://[user]:[password]@[endpoint].[region].aws.neon.tech/[dbname]?sslmode=require&channel_binding=require"
```

<Admonition type="tip">
The pooled connection has `-pooler` in the hostname. The direct (unpooled) connection does not. Both are available in your Neon Console. If you only have the pooled string, remove `-pooler` from the hostname to get the direct one.
</Admonition>

### Step 3: Configure your Prisma schema

If you don't have a Prisma schema yet, run `npx prisma init` to create one. Then update `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
}
```

<Admonition type="note">
In Prisma 7+, do not include a `url` property in the datasource block. The connection is configured in the Prisma config file (Step 4) and the adapter.
</Admonition>

### Step 4: Configure the Prisma CLI connection

The Prisma CLI reads its connection from a config file in your project root. If you ran `npx prisma init`, it already created one: `prisma7.config.ts` in Prisma 7.10 and later, or `prisma.config.ts` in earlier 7.x releases. Replace that file's contents with the following. If you don't have a config file yet, create `prisma.config.ts`:

```typescript
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL_UNPOOLED'),
  },
})
```

<Admonition type="warning">
Keep only one Prisma config file. If both `prisma7.config.ts` and `prisma.config.ts` exist, the CLI loads `prisma7.config.ts` and ignores the other, so CLI commands can end up on the pooled connection. The first line of `npx prisma db push` output shows which file was loaded (`Loaded Prisma config from ...`).
</Admonition>

### Step 5: Create your Prisma Client

Create a file to instantiate Prisma Client with the Neon adapter (for example, `src/db.ts`):

```typescript
import 'dotenv/config'
import { PrismaClient } from './generated/prisma'
import { PrismaNeon } from '@prisma/adapter-neon'

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
})

export const prisma = new PrismaClient({ adapter })
```

### Step 6: Generate client and push schema

```bash
npx prisma generate
npx prisma db push
```

You're connected. You can now use Prisma Client in your application:

```typescript
import { prisma } from './db'

const users = await prisma.user.findMany()
```

To verify the full setup, create a `src/main.ts` script that exercises CRUD operations:

```typescript
import { prisma } from './db'

async function main() {
  // CREATE
  const newUser = await prisma.user.create({
    data: { name: 'Alice', email: `alice-${Date.now()}@example.com` },
  })
  console.log('Created user:', newUser)

  // READ
  const foundUser = await prisma.user.findUnique({ where: { id: newUser.id } })
  console.log('Found user:', foundUser)

  // UPDATE
  const updatedUser = await prisma.user.update({
    where: { id: newUser.id },
    data: { name: 'Alice Smith' },
  })
  console.log('Updated user:', updatedUser)

  // DELETE
  await prisma.user.delete({ where: { id: newUser.id } })
  console.log('Deleted user.')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

Run it with:

```bash
npx tsx src/main.ts
```

## Why two connection strings?

Neon uses connection pooling to manage database connections in serverless environments:

- **Pooled connection (`DATABASE_URL`)**: Your application connects through Neon's connection pooler, which suits serverless functions that create many short-lived connections.
- **Direct (unpooled) connection (`DATABASE_URL_UNPOOLED`)**: Prisma CLI commands like `prisma migrate` and `prisma db push` need a direct connection for schema operations.

## Advanced configuration

### Using a non-public Postgres schema

If you're using a Postgres schema other than `public`, pass a `schema` option when creating the adapter:

```typescript
const adapter = new PrismaNeon(
  { connectionString: process.env.DATABASE_URL! },
  { schema: 'myPostgresSchema' }
)
```

### Setting the search path for raw SQL queries

For raw SQL queries that reference tables without schema qualification, use the Postgres `options` parameter in your connection string:

```text shouldWrap
postgresql://[user]:[password]@[neon_hostname]/[dbname]?options=-c%20search_path%3Dmyschemaname
```

This works only on the direct (unpooled) connection. The pooler rejects `search_path` in startup options, so with the pooled `DATABASE_URL`, use the adapter's `schema` option or schema-qualified table names instead.

## Troubleshooting

<details>
<summary>**Connection timeouts**</summary>

If you see an error like:

```text shouldWrap
Error: P1001: Can't reach database server at `ep-example-123456.us-east-2.aws.neon.tech`:`5432`
```

This usually means the connection timed out before Neon activated the compute. Neon computes scale to zero after inactivity and take a few seconds to wake up.

Add a `connect_timeout` parameter to your connection string:

```text shouldWrap
DATABASE_URL="postgresql://...?sslmode=require&connect_timeout=15"
```

A value of `0` means no timeout.

</details>

<details>
<summary>**Connection pool timeouts**</summary>

With the Neon adapter, the connection pool belongs to the Neon serverless driver, not Prisma. In Prisma 7, the `connection_limit` and `pool_timeout` URL parameters have no effect. Pass pool options to the adapter instead:

```typescript
const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
  max: 20, // maximum connections in the pool
  connectionTimeoutMillis: 15_000, // how long to wait for a connection
})
```

See Prisma's [connection pool guide](https://www.prisma.io/docs/orm/v7/prisma-client/setup-and-configuration/databases-connections/connection-pool) for details.

</details>

<details>
<summary>**Using Prisma 6 or earlier**</summary>

In Prisma 6 and earlier, you configure the connection directly in `schema.prisma` instead of a Prisma config file:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DATABASE_URL_UNPOOLED")
}
```

The `directUrl` property is available in Prisma 4.10.0 and higher.

</details>

## Next steps

- [Schema migrations with Prisma](/docs/guides/prisma-migrations): Full tutorial for building an app with migrations
- [Neon serverless driver](/docs/serverless/serverless-driver): Learn more about the driver powering the adapter

## Next steps: Neon backend services

- [Set up Managed Better Auth](/docs/auth/overview): Add managed authentication that branches with your database
- [Add Object Storage](/docs/storage/overview): S3-compatible file storage that branches with your database
- [Deploy a Function](/docs/compute/functions/overview): Run backend compute next to your database, no separate hosting needed
- [Call an LLM with AI Gateway](/docs/ai-gateway/overview): Access foundation models from Anthropic, OpenAI, Google, and more with one credential

## Resources

- [Prisma documentation](https://www.prisma.io/docs/)
- [Prisma connection management](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)
- [PostgreSQL connector reference](https://www.prisma.io/docs/concepts/database-connectors/postgresql)

<details>
<summary>**Notes for AI-assisted setup**</summary>

- Import `PrismaClient` from `./generated/prisma` (or your configured `output` path), not from `@prisma/client`. The import path changed in Prisma 7.
- Do not install `@neondatabase/serverless` or `ws` as separate packages. The `@prisma/adapter-neon` package bundles everything needed for the Neon connection.
- In Prisma 7+, do not include a `url` property in the `prisma/schema.prisma` datasource block. The connection is configured in the Prisma config file and the adapter.
- `npx prisma init` in Prisma 7.10+ creates `prisma7.config.ts`. Edit that file instead of adding a second `prisma.config.ts`; when both exist, the CLI loads `prisma7.config.ts`.
- You need both a pooled connection (`DATABASE_URL`) for your application and a direct (unpooled) connection (`DATABASE_URL_UNPOOLED`) for Prisma CLI commands.
- Call `prisma.$disconnect()` in a `.finally()` block when running standalone scripts. Omitting this can leave connections open.

</details>

<NeedHelp/>
