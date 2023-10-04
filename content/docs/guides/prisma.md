---
title: Connect from Prisma to Neon
subtitle: Learn how to connect to Neon from Prisma
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/prisma
  - /docs/integrations/prisma
  - /docs/guides/prisma-guide
updatedOn: '2023-10-03T18:28:23.119Z'
---

Prisma is an open-source, next-generation ORM that enables you to manage and interact with your database. This guide explains how to connect Prisma to Neon, establish connections when using Prisma Client in serverless functions, and resolve [connection timeout](#connection-timeouts) issues.

To configure Prisma Migrate with Neon, see [Use Prisma Migrate with Neon](/docs/guides/prisma-migrate).

## Prerequisites

- A Neon project. See [Create a project](/docs/manage/projects#create-a-project).
- A Prisma project. See [Set up Prisma](https://www.prisma.io/docs/getting-started/setup-prisma), in the _Prisma documentation_.

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

3. Add a `DATABASE_URL` variable to your `.env` file and set it to the Neon connection string that you copied in the previous step and add `?sslmode=require` to the end of the connection string. 

Your setting will appear similar to the following:

   <CodeBlock shouldWrap>

   ```text
   DATABASE_URL="postgres://daniel:<password>@ep-raspy-cherry-95040071.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```

   </CodeBlock>

<Admonition type="important">
If you are using Prisma Client from a serverless function, see [Connect from serverless functions](#connect-from-serverless-functions). To adjust your connection string to avoid connection timeouts issues, see [Connection timeouts](#connection-timeouts).
</Admonition>

## Connect from serverless functions

Serverless functions typically require a large number of database connections. When connecting from Prisma Client to Neon from a serverless function, use a pooled Neon connection string together with a `pgbouncer=true` flag, as shown:

<CodeBlock shouldWrap>

```text
DATABASE_URL=postgres://daniel:<password>@ep-raspy-cherry-95040071-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&pgbouncer=true
```

</CodeBlock>

- A pooled Neon connection string appends `-pooler` to the endpoint ID, which tells Neon to use a pooled connection rather than a direct connection. The **Connection Details** widget on the Neon **Dashboard** provides a **Pooled connection** checkbox that adds `-pooler` suffix to your connection string.
- Neon uses PgBouncer to provide [connection pooling](/docs/connect/connection-pooling). Prisma requires the `pgbouncer=true` flag when using Prisma Client with PgBouncer, as described in the [Prisma documentation](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management/configure-pg-bouncer#add-pgbouncer-to-the-connection-url).
- In summary, to use a pooled Neon connection with Prisma Client, you require **both** a pooled Neon connection string (one that includes `-pooler`) _and_ the `pgbouncer=true` flag (required by Prisma Client). See the example above.

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

When you connect to an idle compute from Prisma, Neon automatically activates it. Activation typically happens within a few seconds but added latency can result in a connection timeout. To address this issue, your can adjust your Neon connection string by adding a `connect_timeout` parameter. This parameter defines the maximum number of seconds to wait for a new connection to be opened. The default value is 5 seconds. A higher setting may provide the time required to avoid connection timeouts. For example:

<CodeBlock shouldWrap>

```text
DATABASE_URL=postgres://daniel:<password>@ep-raspy-cherry-95040071.us-east-2.aws.neon.tech/neondb?sslmode=require&connect_timeout=10`
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
DATABASE_URL=postgres://daniel:<password>@ep-raspy-cherry-95040071.us-east-2.aws.neon.tech/neondb/neondb?sslmode=require&connect_timeout=15&connection_limit=20`
```

</CodeBlock>

For configuration guidance, refer to Prisma's [Recommended connection pool size guide](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#recommended-connection-pool-size).

In addition to pool size, you can configure a `pool_timeout` setting. This setting defines the amount of time the Prisma Client query engine has to process a query before it throws an exception and moves on to the next query in the queue. The default `pool_timeout` setting is 10 seconds. If you still experience timeouts after increasing `connection_limit` setting, you can try setting the `pool_timeout` parameter to a value larger than the default (10 seconds). For configuration guidance, refer to [Increasing the pool timeout](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#increasing-the-pool-timeout), in the _Prisma documentation_.

<CodeBlock shouldWrap>

```text
DATABASE_URL=postgres://daniel:<password>@ep-raspy-cherry-95040071.us-east-2.aws.neon.tech/neondb/neondb?sslmode=require&connect_timeout=15&connection_limit=20&pool_timeout=15`
```

</CodeBlock>

You can disable the pool timeouts by setting `pool_timeout=0`.

## JSON protocol for large Prisma schemas

If you are working with a large Prisma schema, Prisma recently introduced a new preview feature that expresses queries using `JSON` instead of GraphQL. The JSON implementation uses less CPU and memory, which can help reduce latencies when connecting from Prisma.

To try the new protocol, enable the `jsonProtocol` Preview feature in your Prisma schema:

```text
generator client {
  provider        = "prisma-client-js"  
  previewFeatures = ["jsonProtocol"]
}
```

You can read more about this feature here: [Preview feature feedback](https://github.com/prisma/prisma/issues/18095).

## Learn more

For additional information about connecting from Prisma, refer to the following resources in the _Prisma documentation_:

- [Connection management](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)
- [Database connection issues](https://www.prisma.io/dataguide/managing-databases/database-troubleshooting#database-connection-issues)
- [PostgreSQL database connector](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [Increasing the pool timeout](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#increasing-the-pool-timeout)

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
