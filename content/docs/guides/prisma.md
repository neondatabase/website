---
title: Connect from Prisma to Neon
subtitle: Learn how to connect to Neon from Prisma
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/prisma
  - /docs/integrations/prisma
  - /docs/guides/prisma-guide
  - /docs/guides/prisma-migrate
updatedOn: '2023-11-24T11:25:06.754Z'
---

Prisma is an open-source, next-generation ORM that enables you to manage and interact with your database. This guide covers the following topics:

- [Connect to Neon from Prisma](#connect-to-neon-from-prisma)
- [Use connection pooling with Prisma](#use-connection-pooling-with-prisma)
- [Use the Neon serverless driver with Prisma](#use-the-neon-serverless-driver-with-prisma)
- [Connection timeouts](#connection-timeouts)
- [Connection pool timeouts](#connection-pool-timeouts)
- [JSON protocol for large Prisma schemas](#json-protocol-for-large-prisma-schemas)

<Admonition type="note">
This topic discusses several connection string parameters you can addd to your Neon connection string, such as `sslmode=require`, `pgbouncer=true`, and `connect_timeout=10`. A `?` character is used in a connection string to signify the end of the main part of the connection string and the start of additional options or parameters. You can use an `&` character to separate multiple parameters. For example:

```ini
postgres://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&pgbouncer=true
```
</Admonition>

## Connect to Neon from Prisma

To establish a basic connection from Prisma to Neon, perform the following steps:

1. Retrieve your Neon connection string. In the **Connection Details** widget on the Neon **Dashboard**, select a branch, a user, and the database you want to connect to. A connection string is constructed for you.
  ![Connection details widget](/docs/connect/connection_details.png)
  The connection string includes the user name, password, hostname, and database name.

2. Add the following lines to your `prisma/schema.prisma` file to identify the data source and database URL:

   ```typescript
   datasource db {
     provider = "postgresql"
     url   = env("DATABASE_URL")
   }
   ```

3. Add a `DATABASE_URL` variable to your `.env` file and set it to the Neon connection string that you copied in the previous step. We also recommend adding `?sslmode=require` to the end of the connection string to ensure a [secure connection](/docs/connect/connect-securely).

   Your setting will appear similar to the following:

   <CodeBlock shouldWrap>

   ```text
   DATABASE_URL="postgres://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require"
   ```

   </CodeBlock>

<Admonition type="important">
If you plan to use Prisma Client from a serverless function, see [Use connection pooling with Prisma](#use-connection-pooling-with-prisma) for additional configuration instructions. To adjust your connection string to avoid connection timeout issues, see [Connection timeouts](#connection-timeouts).
</Admonition>

## Use connection pooling with Prisma

Serverless functions typically require a large number of database connections. If you use serverless functions in your application, it is recommended that you use a pooled Neon connection string with the `pgbouncer=true` option, as shown:

<CodeBlock shouldWrap>

```ini
# Pooled Neon connection string
DATABASE_URL=postgres://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&pgbouncer=true
```

</CodeBlock>

- A pooled Neon connection string adds `-pooler` to the endpoint ID, which tells Neon to use a pooled connection. You can add `-pooler` to your connection string manually or copy a pooled connection string from the **Connection Details** widget on the Neon **Dashboard**. Use the **Pooled connection** checkbox to add the `-pooler` suffix.
- Neon uses PgBouncer to provide [connection pooling](/docs/connect/connection-pooling). Prisma requires the `pgbouncer=true` flag when using Prisma Client with PgBouncer, as described in the [Prisma documentation](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management/configure-pg-bouncer#add-pgbouncer-to-the-connection-url).
- Both the pooled Neon connection string and the `pgbouncer=true` flag are required to use Noen's connection pooler with Prisma. See the example above.

### Connection pooling with Prisma Migrate

You cannot use a pooled connection string to perform certain operations with Prisma that require a direct connection to the database, such as schema migration with Prisma Migrate. Attempting to run Prisma Migrate commands, such as `prisma migrate dev`, with a pooled connection causes the following error:

```text
Error undefined: Database error
Error querying the database: db error: ERROR: prepared statement
"s0" already exists
```

To avoid this issue, make sure you are using a direct connection to the database for Prisma Migrate. Neon supports both pooled and direct connections to the same database.

You can configure a direct connection while allowing applications to use Prisma Client with a pooled connection by adding a `directUrl` property to the datasource block in your `schema.prisma` file. For example:

```typescript
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

<Admonition type="note">
The `directUrl` property is available in Prisma version [4.10.0](https://github.com/prisma/prisma/releases/tag/4.10.0) and higher. For more information about this property, refer to the [Prisma schema reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#fields).
</Admonition>

After adding the `directUrl` property to your `schema.prisma` file, update the `DATABASE_URL` and `DIRECT_URL` variables settings in your `.env` file:

1. Set `DATABASE_URL` to the pooled connection string for your Neon database. Applications that require a pooled connection should use this connection.
1. Set `DIRECT_URL` to the direct (non-pooled) connection string. This is the direct connection to the database required by Prisma Migrate. Other Prisma CLI operations may also require a direct connection.

When you finish updating your `.env` file, your variable settings should appear similar to the following:

<CodeBlock shouldWrap>

```ini
# Pooled Neon connection string
DATABASE_URL=postgres://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&pgbouncer=true

# Unpooled Neon connection string
DIRECT_URL=postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require&
```

</CodeBlock>

## Use the Neon serverless driver with Prisma

The Neon serverless driver is a low-latency Postgres driver for JavaScript and TypeScript that allows you to query data from serverless and edge environments. For more information about the driver, see [Neon serverless driver](/docs/serverless/serverless-driver).

To use Prisma with the Neon serverless driver, you can use the Prisma driver adapter feature. The driver adapter allows you to use a database driver other than the default driver that Prisma provides for communicating with your database.

The Prisma driver adapter feature is available in **Preview** in Prisma version 5.4.2 and later.

To get started, enable the `driverAdapters` Preview feature flag in your `schema.prisma` file, as shown:

```javascript
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Next, generate the Prisma Client:

```bash
npx prisma generate
```

Install the Prisma adapter for Neon, the Neon serverless driver, and `ws` packages:

```bash
npm install @prisma/adapter-neon @neondatabase/serverless ws
npm install --save-dev @types/ws
```

Update your Prisma Client instance:

```javascript
import { Pool, neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import ws from 'ws'

dotenv.config()
neonConfig.webSocketConstructor = ws
const connectionString = `${process.env.DATABASE_URL}`

const pool = new Pool({ connectionString })
const adapter = new PrismaNeon(pool)
const prisma = new PrismaClient({ adapter })
```

You can now use Prisma Client as you normally would with full type-safety. Prisma Migrate, introspection, and Prisma Studio will continue working as before, using the Neon connection string defined by the `DATABASE_URL` variable in your `schema.prisma` file.

## Connection timeouts

A connection timeout that occurs when connecting from Prisma to Neon causes an error similar to the following:

<CodeBlock shouldWrap>

```text
Error: P1001: Can't reach database server at `ep-white-thunder-826300.us-east-2.aws.neon.tech`:`5432`
Please make sure your database server is running at `ep-white-thunder-826300.us-east-2.aws.neon.tech`:`5432`.
```

</CodeBlock>

This error most likely means that the Prisma query engine timed out before the Neon compute was activated.

A Neon compute has two main states: _Active_ and _Idle_. Active means that the compute is currently running. If there is no query activity for 5 minutes, Neon places a compute into an idle state by default.

When you connect to an idle compute from Prisma, Neon automatically activates it. Activation typically happens within a few seconds but added latency can result in a connection timeout. To address this issue, you can adjust your Neon connection string by adding a `connect_timeout` parameter. This parameter defines the maximum number of seconds to wait for a new connection to be opened. The default value is 5 seconds. A higher setting may provide the time required to avoid connection timeouts. For example:

<CodeBlock shouldWrap>

```text
DATABASE_URL=postgres://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&connect_timeout=10`
```

</CodeBlock>

<Admonition type="note">
A `connect_timeout` setting of 0 means no timeout.
</Admonition>

## Connection pool timeouts

Another possible cause of timeouts is [Prisma's connection pool](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/). The Prisma query engine manages a pool of connections. The pool is instantiated when a Prisma Client opens a first connection to the database. For an explanation of how this connection pool functions, read [How the connection pool works](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/connection-pool#how-the-connection-pool-works), in the _Prisma documentation_.

The default size of the Prisma connection pool is determined by the following formula: `num_physical_cpus * 2 + 1`,  where `num_physical_cpus` represents the number of physical CPUs on the machine where your application runs. For example, if your machine has four physical CPUs, your connection pool will contain nine connections (4 * 2 + 1 = 9). As mentioned in the [Prisma documentation](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/connection-pool#default-connection-pool-size), this formula is a good starting point, but the recommended connection limit also depends on your deployment paradigm — particularly if you are using serverless. You can specify the number of connections explicitly by setting the `connection_limit` parameter in your database connection URL. For example:

<CodeBlock shouldWrap>

```text
DATABASE_URL=postgres://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&connect_timeout=15&connection_limit=20`
```

</CodeBlock>

For configuration guidance, refer to Prisma's [Recommended connection pool size guide](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#recommended-connection-pool-size).

In addition to pool size, you can configure a `pool_timeout` setting. This setting defines the amount of time the Prisma Client query engine has to process a query before it throws an exception and moves on to the next query in the queue. The default `pool_timeout` setting is 10 seconds. If you still experience timeouts after increasing `connection_limit` setting, you can try setting the `pool_timeout` parameter to a value larger than the default (10 seconds). For configuration guidance, refer to [Increasing the pool timeout](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#increasing-the-pool-timeout), in the _Prisma documentation_.

<CodeBlock shouldWrap>

```text
DATABASE_URL=postgres://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&connect_timeout=15&connection_limit=20&pool_timeout=15
```

</CodeBlock>

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

<NeedHelp/>
