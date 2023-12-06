---
title: Use Prisma Migrate with Neon
subtitle: Learn how to use Prisma Migrate with Neon
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/prisma
  - /docs/integrations/prisma
updatedOn: '2023-10-07T10:43:33.387Z'
---

Prisma Migrate and other Prisma CLI operations require a direct connection to the database. This topic describes how to connect to the same Neon database from Prisma Client with a pooled connection string and from Prisma Migrate or the Prisma CLI with direct (unpooled) connection.

## Prisma Migrate with PgBouncer

Prisma Migrate and other Prisma CLI operations cannot use a pooled connection. Attempting to run Prisma Migrate commands, such as `prisma migrate dev`, with a pooled connection causes the following error:

```text
Error undefined: Database error
Error querying the database: db error: ERROR: prepared statement
"s0" already exists
```

To avoid this issue, make sure you are using a direct connection to the database for Prisma Migrate. Neon supports both pooled and direct connections to the same database. See [Enable connection pooling](/docs/connect/connection-pooling#enable-connection-pooling) for details.

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
1. Set `DIRECT_URL` to the direct (non-pooled) connection string. This is the direct connection to the database required by Prisma Migrate and other Prisma CLI operations.

When you are finished updating your `.env` file, your variable settings should appear similar to the following:

<CodeBlock shouldWrap>

```ini
# Pooled Neon connection string
DATABASE_URL=postgres://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?pgbouncer=true

# Unpooled Neon connection string for operations requiring a direct connection
DIRECT_URL=postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname
```

</CodeBlock>
