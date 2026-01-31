---
title: Connect from Prisma to Neon
subtitle: Learn how to connect to Neon from Prisma
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/prisma
  - /docs/integrations/prisma
  - /docs/guides/prisma-guide
  - /docs/guides/prisma-migrate
updatedOn: '2026-01-31T12:00:00.000Z'
---

<CopyPrompt src="/prompts/prisma-prompt.md" 
description="Pre-built prompt for connecting Node/TypeScript applications to Neon using Prisma ORM."/>

Prisma is an open-source, next-generation ORM that lets you to manage and interact with your database. This guide covers the following topics:

- [Connect to Neon from Prisma](#connect-to-neon-from-prisma)
- [Use the Neon serverless driver with Prisma](#use-the-neon-serverless-driver-with-prisma)
- [Use connection pooling with Prisma](#use-connection-pooling-with-prisma)
- [Connection timeouts](#connection-timeouts)
- [Connection pool timeouts](#connection-pool-timeouts)
- [JSON protocol for large Prisma schemas](#json-protocol-for-large-prisma-schemas)

## Connect to Neon from Prisma

To establish a basic connection from Prisma to Neon, perform the following steps:

1. Retrieve your Neon connection string. You can find it by clicking the **Connect** button on your **Project Dashboard**. Select a branch, a user, and the database you want to connect to. A connection string is constructed for you.
   ![Connection details modal](/docs/connect/connection_details.png)
   The connection string includes the user name, password, hostname, and database name.

2. Add the following lines to your `prisma/schema.prisma` file to identify the data source:

   ```typescript
   datasource db {
     provider = "postgresql"
   }
   ```

3. Create a `prisma.config.ts` file in your project root to configure the database URL for Prisma CLI commands:

   ```typescript
   import 'dotenv/config'
   import { defineConfig, env } from 'prisma/config'

   export default defineConfig({
     schema: 'prisma/schema.prisma',
     datasource: {
       url: env('DATABASE_URL'),
     },
   })
   ```

4. Add a `DATABASE_URL` variable to your `.env` file and set it to the Neon connection string that you copied in the first step. We also recommend adding `?sslmode=require&channel_binding=require` to the end of the connection string to ensure a [secure connection](/docs/connect/connect-securely).

   Your setting will appear similar to the following:

   ```text shouldWrap
   DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"
   ```

<Admonition type="important">
If you plan to use Prisma Client from a serverless function, we recommend using the [Neon serverless driver with Prisma](#use-the-neon-serverless-driver-with-prisma) and [connection pooling](#use-connection-pooling-with-prisma). To adjust your connection string to avoid connection timeout issues, see [Connection timeouts](#connection-timeouts).
</Admonition>

<Admonition type="note" title="Prisma 6 and earlier">
If you're using Prisma 6 or earlier, you can include the `url` property directly in your `schema.prisma` file instead of using `prisma.config.ts`:

```typescript
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Starting with Prisma 7, the `url` property is no longer supported in the schema file. You must use `prisma.config.ts` for CLI commands and pass the connection to Prisma Client via an adapter or constructor option.
</Admonition>

## Use connection pooling with Prisma

Serverless functions can require a large number of database connections as demand increases. If you use serverless functions in your application, we recommend that you use a pooled Neon connection string.

A pooled Neon connection string adds `-pooler` to the endpoint ID, which tells Neon to use a pooled connection. You can add `-pooler` to your connection string manually or copy a pooled connection string from **Connect to your database** modal — click **Connect** on your Project Dashboard to open the modal.

```ini shouldWrap
# Pooled Neon connection string
DATABASE_URL="postgresql://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require"
```

### Recommended setup with connection pooling

For the best experience with Prisma and Neon, we recommend configuring both a pooled connection (for your application) and a direct connection (for Prisma CLI commands). Here's the complete setup:

**1. Configure your `.env` file with both connection strings:**

```ini shouldWrap
# Pooled connection for Prisma Client (used by your application)
DATABASE_URL="postgresql://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require"

# Direct connection for Prisma CLI (used by migrations, introspection, etc.)
DIRECT_URL="postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require"
```

**2. Configure `prisma.config.ts` to use the direct connection for CLI commands:**

```typescript
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DIRECT_URL'),
  },
})
```

**3. Use the pooled connection in your Prisma Client via the adapter:**

```javascript
import 'dotenv/config'
import { PrismaClient } from './generated/prisma'
import { PrismaNeon } from '@prisma/adapter-neon'

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })
export const prisma = new PrismaClient({ adapter })
```

This setup ensures:

- Your application uses the pooled connection for optimal performance in serverless environments
- Prisma CLI commands (like `prisma migrate` and `prisma db push`) use the direct connection

<Admonition type="note" title="Prisma 5.10+ with pooled connections">
With Prisma ORM 5.10 or higher, you can use a pooled Neon connection string directly with Prisma Migrate without needing a separate direct connection. However, the recommended setup above provides the most flexibility and is especially useful when using driver adapters.
</Admonition>

<Admonition type="note" title="Prisma 6 and earlier">
If you're using Prisma 6 or earlier, you can configure the direct connection using the `directUrl` property in your `schema.prisma` file instead of `prisma.config.ts`:

```typescript
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

The `directUrl` property is available in Prisma version [4.10.0](https://github.com/prisma/prisma/releases/tag/4.10.0) and higher.
</Admonition>

## Use the Neon serverless driver with Prisma

The [Neon serverless driver](https://github.com/neondatabase/serverless) is a low-latency Postgres driver for JavaScript and TypeScript that allows you to query data from serverless and edge environments over HTTP or WebSockets in place of TCP. For more information about the driver, see [Neon serverless driver](/docs/serverless/serverless-driver).

You can use Prisma ORM along with the Neon serverless driver using the `@prisma/adapter-neon` driver adapter. This adapter allows you to use the Neon serverless driver instead of Prisma's default TCP-based driver.

<Admonition type="note">
The Prisma driver adapter feature has been **Generally Available** since Prisma ORM v6.16.0.
</Admonition>

### Step 1: Install dependencies

Install Prisma and the Neon adapter:

```bash
npm install prisma @prisma/client @prisma/adapter-neon
```

### Step 2: Configure your schema

Create or update your `prisma/schema.prisma` file. In Prisma 7, the datasource block should not include a `url` property:

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

// Your models here
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
}
```

### Step 3: Configure prisma.config.ts

Create a `prisma.config.ts` file in your project root. This tells Prisma CLI where to connect for migrations and other commands:

```typescript
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DIRECT_URL'),  // Use direct connection for CLI commands
  },
})
```

### Step 4: Set up environment variables

Add both connection strings to your `.env` file. Get these from your Neon Console by clicking **Connect**:

```ini shouldWrap
# Pooled connection string for your application (note the -pooler suffix)
DATABASE_URL="postgresql://[user]:[password]@[endpoint]-pooler.[region].aws.neon.tech/[dbname]?sslmode=require"

# Direct connection string for Prisma CLI (migrations, introspection)
DIRECT_URL="postgresql://[user]:[password]@[endpoint].[region].aws.neon.tech/[dbname]?sslmode=require"
```

<Admonition type="important">
The pooled connection string has `-pooler` in the hostname. The direct connection string does not. Both are available in your Neon Console under **Connect**.
</Admonition>

### Step 5: Create your Prisma Client

Create a file to instantiate Prisma Client with the Neon adapter (e.g., `src/db.ts`):

```typescript
import 'dotenv/config'
import { PrismaClient } from './generated/prisma'
import { PrismaNeon } from '@prisma/adapter-neon'

// Create the Neon adapter with your pooled connection string
const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!
})

// Create Prisma Client with the adapter
export const prisma = new PrismaClient({ adapter })
```

### Step 6: Generate client and push schema

```bash
# Generate the Prisma Client
npx prisma generate

# Push your schema to the database (or use prisma migrate dev)
npx prisma db push
```

### Step 7: Use Prisma Client

You can now use Prisma Client as you normally would:

```typescript
import { prisma } from './db'

async function main() {
  // Create a user
  const user = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice',
    },
  })
  console.log('Created user:', user)

  // Query users
  const users = await prisma.user.findMany()
  console.log('All users:', users)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

<Admonition type="tip">
We strongly recommend using a pooled connection string (`-pooler`) in your `DATABASE_URL` for optimal performance in serverless environments.
</Admonition>

### Configuring the PostgreSQL schema

If you're using a PostgreSQL schema other than `public`, pass a `schema` option when creating the `PrismaNeon` instance:

```typescript
const adapter = new PrismaNeon(
  { connectionString: process.env.DATABASE_URL! },
  { schema: 'myPostgresSchema' }
)
```

<Admonition type="note" title="For Prisma 6 users">
In Prisma 6, you may have used a `?schema=` parameter in your connection URL. In Prisma 7, you must use the `schema` option shown above instead.
</Admonition>

### Configuring the search path for raw SQL queries

If you need to set the search path for raw SQL queries (where you refer to tables without schema qualification), use PostgreSQL's native `options` parameter in your connection string:

```text shouldWrap
postgresql://[user]:[password]@[neon_hostname]/[dbname]?options=-c%20search_path%3Dmyschemaname
```

Both `-c search_path=` and `--search_path=` syntaxes are supported. This approach is only needed for raw SQL queries — for Prisma Client queries, use the `schema` option shown above.

## Connection timeouts

A connection timeout that occurs when connecting from Prisma to Neon causes an error similar to the following:

```text shouldWrap
Error: P1001: Can't reach database server at `ep-white-thunder-826300.us-east-2.aws.neon.tech`:`5432`
Please make sure your database server is running at `ep-white-thunder-826300.us-east-2.aws.neon.tech`:`5432`.
```

This error most likely means that the Prisma query engine timed out before the Neon compute was activated.

A Neon compute has two main states: _Active_ and _Idle_. Active means that the compute is currently running. If there is no query activity for 5 minutes, Neon places a compute into an idle state by default.

When you connect to an idle compute from Prisma, Neon automatically activates it. Activation typically happens within a few seconds but added latency can result in a connection timeout. To address this issue, you can adjust your Neon connection string by adding a `connect_timeout` parameter. This parameter defines the maximum number of seconds to wait for a new connection to be opened. The default value is 5 seconds. A higher setting may provide the time required to avoid connection timeouts. For example:

```text shouldWrap
DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require&connect_timeout=10"
```

<Admonition type="note">
A `connect_timeout` setting of 0 means no timeout.
</Admonition>

## Connection pool timeouts

Another possible cause of timeouts is [Prisma's connection pool](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/). The Prisma query engine manages a pool of connections. The pool is instantiated when a Prisma Client opens a first connection to the database. For an explanation of how this connection pool functions, read [How the connection pool works](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/connection-pool#how-the-connection-pool-works), in the _Prisma documentation_.

The default size of the Prisma connection pool is determined by the following formula: `num_physical_cpus * 2 + 1`, where `num_physical_cpus` represents the number of physical CPUs on the machine where your application runs. For example, if your machine has four physical CPUs, your connection pool will contain nine connections (4 \* 2 + 1 = 9). As mentioned in the [Prisma documentation](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/connection-pool#default-connection-pool-size), this formula is a good starting point, but the recommended connection limit also depends on your deployment paradigm — particularly if you are using serverless. You can specify the number of connections explicitly by setting the `connection_limit` parameter in your database connection URL. For example:

```text shouldWrap
DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require&connect_timeout=15&connection_limit=20"
```

For configuration guidance, refer to Prisma's [Recommended connection pool size guide](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#recommended-connection-pool-size).

In addition to pool size, you can configure a `pool_timeout` setting. This setting defines the amount of time the Prisma Client query engine has to process a query before it throws an exception and moves on to the next query in the queue. The default `pool_timeout` setting is 10 seconds. If you still experience timeouts after increasing `connection_limit` setting, you can try setting the `pool_timeout` parameter to a value larger than the default (10 seconds). For configuration guidance, refer to [Increasing the pool timeout](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#increasing-the-pool-timeout), in the _Prisma documentation_.

```text shouldWrap
DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require&connect_timeout=15&connection_limit=20&pool_timeout=15"
```

You can disable pool timeouts by setting `pool_timeout=0`.

## JSON protocol for large Prisma schemas

If you are working with a large Prisma schema, Prisma recently introduced a `jsonProtocol` wire protocol feature that expresses queries using `JSON` instead of GraphQL. The JSON implementation uses less CPU and memory, which can help reduce latencies when connecting from Prisma.

`jsonProtocol` is the default wire protocol as of Prisma version 5.0.0. If you run Prisma version 5.0.0 or later, you are already using the new protocol. If you run Prisma version 4 or earlier, you must use a feature flag to enable the `jsonProtocol`. You can read more about this feature here: [jsonProtocol changes](https://www.prisma.io/docs/guides/upgrade-guides/upgrading-versions/upgrading-to-prisma-5/jsonprotocol-changes).

## Learn more

For additional information about connecting from Prisma, refer to the following resources in the _Prisma documentation_:

- [Connection management](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)
- [Database connection issues](https://www.prisma.io/dataguide/managing-databases/database-troubleshooting#database-connection-issues)
- [PostgreSQL database connector](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [Increasing the pool timeout](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#increasing-the-pool-timeout)
- [Schema migration with Neon Postgres and Prisma ORM](/docs/guides/prisma-migrations)

<NeedHelp/>
