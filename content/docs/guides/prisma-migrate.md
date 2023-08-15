---
title: Use Prisma Migrate with Neon
subtitle: Learn how to use Prisma Migrate with Neon 
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/prisma
  - /docs/integrations/prisma
---

This topic also describes how to configure Prisma Migrate when you need to connect to the same Neon database from Prisma Migrate, which requires a direct database connection, and serverless functions that require a pooled database connection.


## Prisma Migrate with PgBouncer

Prisma Migrate requires a direct connection to the database. It does not support connection pooling with PgBouncer. Attempting to run Prisma Migrate commands, such as `prisma migrate dev`, with a pooled connection causes the following error:

```text
Error undefined: Database error
Error querying the database: db error: ERROR: prepared statement
"s0" already exists
```

To avoid this issue, ensure that you are using a direct connection to the database for Prisma Migrate. Neon supports both pooled and direct connections to the same database. See [Enable connection pooling](/docs/connect/connection-pooling#enable-connection-pooling) for more information.

You can configure Prisma Migrate to use a direct connection while allowing applications to use Prisma Client with a pooled connection by adding a `directUrl` property to the datasource block in your `schema.prisma` file. For example:

```typescript
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

<Admonition type="note">
The `directUrl` property is available in Prisma version [4.10.0](https://github.com/prisma/prisma/releases/tag/4.10.0) and higher.
</Admonition>

After adding the `directUrl` property to your `schema.prisma` file, update the `DATABASE_URL` and `DIRECT_URL` variables settings in your `.env` file:

1. Set `DATABASE_URL` to the pooled connection string for your Neon database. Applications that require a pooled connection should use this connection.
1. Set `DIRECT_URL` to the direct (non-pooled) connection string. This is the direct connection to the database required by Prisma Migrate.

When you are finished updating your `.env` file, your variable settings should appear similar to the following:

<CodeBlock shouldWrap>

```text
DATABASE_URL="postgres://daniel:<password>@ep-restless-rice-862380-pooler.us-east-2.aws.neon.tech:5432/neondb?pgbouncer=true"
DIRECT_URL="postgres://daniel:<password>@ep-restless-rice-862380.us-east-2.aws.neon.tech:5432/neondb"
```

</CodeBlock>
