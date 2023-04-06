---
title: Use Prisma Migrate with Neon
subtitle: Learn how to use Prisma Migrate with Neon 
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/prisma
  - /docs/integrations/prisma
---

Prisma Migrate is a migration tool that allows you to evolve your database schema from prototyping to production. Prisma Migrate requires a shadow database to detect schema drift. This section describes how to configure a second Neon database as a shadow database, which is required to run the `prisma migrate dev` command.

<Admonition type="note">
Prisma Migrate requires a direct connection to the database and does not support connection pooling with PgBouncer. Migrations fail with an error if you use a pooled connection. For more information, see [Prisma Migrate with PgBouncer](#prisma-migrate-with-pgbouncer).
</Admonition>

## Configure a shadow database for Prisma Migrate

To configure a shadow database:

1. Create another database in your Neon project and copy the connection string. Refer to [Create a database](/docs/manage/databases#create-a-database) for instructions. For information about obtaining a connection string, see [Connect from any application](/docs/connect/connect-from-any-app/).

1. Add the `shadowDatabaseUrl` setting to your `prisma/schema.prisma` file to identify the shadow database URL:

   ```typescript
   datasource db {
     provider = "postgresql"
     url   = env("DATABASE_URL")
     shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
   }
   ```

1. Add a `SHADOW_DATABASE_URL` environment variable to your `.env` file and set it to the Neon connection string that you copied in the previous step.

   ```shell
   SHADOW_DATABASE_URL="postgres://<user>:<password>@<host>:5432/<dbname>"
   ```

For more information about shadow databases, refer to [About the shadow database](https://www.prisma.io/docs/concepts/components/prisma-migrate/shadow-database), in the _Prisma documentation_.

## Prisma Migrate with PgBouncer

As mentioned above, Prisma Migrate requires a direct connection to the database. It does not support connection pooling with PgBouncer. Attempting to run Prisma Migrate commands with a pooled connection causes the following error:

```text
Error undefined: Database error
Error querying the database: db error: ERROR: prepared statement
"s0" already exists
```

If you encounter this error, ensure that you are using a direct connection to the database. Neon supports both pooled and non-pooled connections to the same database. See [Enable connection pooling](/docs/connect/connection-pooling#enable-connection-pooling) for more information.

You can configure Prisma Migrate to use a non-pooled connection string by adding a `directUrl` property to the datasource block in your `schema.prisma` file. For example:

```text
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

<Admonition type="note">
This feature is available from Prisma version [4.10.0](https://github.com/prisma/prisma/releases/tag/4.10.0) and higher.
</Admonition>

After adding the `directUrl` property to your `schema.prisma` file, update your `.env` file with both the `DATABASE_URL` and `DIRECT_URL` variables settings. As shown in the following example, set `DATABASE_URL` to the pooled connection string for your Neon database, and set `DIRECT_URL` to the non-pooled connection string.

```text
DATABASE_URL="postgres://casey:<password>@ep-square-sea-260584-pooler.us-east-2.aws.neon.tech:5432/neondb?pgbouncer=true"
DIRECT_URL="postgres://casey:<password>@ep-square-sea-260584.us-east-2.aws.neon.tech:5432/neondb"
```
