---
title: Use Prisma Migrate with Neon
subtitle: Learn how to use Prisma Migrate with Neon 
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/prisma
  - /docs/integrations/prisma
---

Prisma Migrate is a migration tool that allows you to evolve your database schema from prototyping to production. Prisma Migrate requires a shadow database to detect schema drift. This topic describes configuring a second Neon database as a shadow database.

This topic also describes how to configure Prisma Migrate when you need to connect to the same Neon database from Prisma Migrate, which requires a direct database connection, and serverless functions that require a pooled database connection.

For more information about shadow databases, refer to [About the shadow database](https://www.prisma.io/docs/concepts/components/prisma-migrate/shadow-database), in the _Prisma documentation_.

## Configure a shadow database for Prisma Migrate

To configure a shadow database:

1. Create another database in your Neon project and copy the connection string. Refer to [Create a database](../manage/databases#create-a-database) for instructions. You can name the shadow database whatever you like.

    For information about obtaining a connection string, see [Connect from any application](../connect/connect-from-any-app/).

1. Add the `shadowDatabaseUrl` setting to your `prisma/schema.prisma` file to identify the shadow database URL:

   ```typescript
   datasource db {
     provider = "postgresql"
     url   = env("DATABASE_URL")
     shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
   }
   ```

1. Add a `SHADOW_DATABASE_URL` environment variable to your `.env` file and set it to the database connection string that you copied in the previous step. The following example uses a shadow database named `shadow_db`. Use the database name that you gave to your shadow database.

   <CodeBlock shouldWrap>

   ```text
   SHADOW_DATABASE_URL="postgres://daniel:<password>@ep-restless-rice-862380.us-east-2.aws.neon.tech:5432/shadow_db"
   ```

   </CodeBlock>

## Prisma Migrate with PgBouncer

Prisma Migrate requires a direct connection to the database. It does not support connection pooling with PgBouncer. Attempting to run Prisma Migrate commands, such as `prisma migrate dev`, with a pooled connection causes the following error:

```text
Error undefined: Database error
Error querying the database: db error: ERROR: prepared statement
"s0" already exists
```

To avoid this issue, ensure that you are using a direct connection to the database for Prisma Migrate. Neon supports both pooled and direct connections to the same database. See [Enable connection pooling](../connect/connection-pooling#enable-connection-pooling) for more information.

You can configure Prisma Migrate to use a direct connection while allowing applications to use Prisma Client with a pooled connection by adding a `directUrl` property to the datasource block in your `schema.prisma` file. For example:

```typescript
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

<Admonition type="note">
The `directUrl` property is available in Prisma version [4.10.0](https://github.com/prisma/prisma/releases/tag/4.10.0) and higher.
</Admonition>

After adding the `directUrl` property to your `schema.prisma` file, update the `DATABASE_URL` and `DIRECT_URL` variables settings in your your `.env` file:

1. Set `DATABASE_URL` to the pooled connection string for your Neon database. Applications that require a pooled connection should use this connection.
1. Set `DIRECT_URL` to the direct (non-pooled) connection string. This is the direct connection to the database required by Prisma Migrate.

Your `SHADOW_DATABASE_URL` variable can continue to use the same direct database connection string.

When you are finished updating your `.env` file, your variable settings should appear similar to the following:

<CodeBlock shouldWrap>

```text
DATABASE_URL="postgres://daniel:<password>@ep-restless-rice-862380-pooler.us-east-2.aws.neon.tech:5432/neondb?pgbouncer=true"
SHADOW_DATABASE_URL="postgres://daniel:<password>@ep-restless-rice-862380.us-east-2.aws.neon.tech:5432/shadow_db"
DIRECT_URL="postgres://daniel:<password>@ep-restless-rice-862380.us-east-2.aws.neon.tech:5432/neondb"
```

</CodeBlock>
