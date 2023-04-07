---
title: Use Prisma Migrate with Neon
subtitle: Learn how to use Prisma Migrate with Neon 
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/prisma
  - /docs/integrations/prisma
---

Prisma Migrate is a migration tool that allows you to evolve your database schema from prototyping to production. Prisma Migrate requires a shadow database to detect schema drift. This section describes how to configure a second Neon database as a shadow database.

For more information about shadow databases, refer to [About the shadow database](https://www.prisma.io/docs/concepts/components/prisma-migrate/shadow-database), in the _Prisma documentation_.

<Admonition type="note">
Prisma Migrate requires a direct connection to the database. Migrations fail with an error if you use a pooled connection. If your applications use Prisma Client with a pooled connection, you will need to configure both a pooled and direct connection to your database. Refer to [Prisma Migrate with PgBouncer](#prisma-migrate-with-pgbouncer) for  instructions.
</Admonition>

## Configure a shadow database for Prisma Migrate

To configure a shadow database:

1. Create another database in your Neon project and copy the connection string. Refer to [Create a database](/docs/manage/databases#create-a-database) for instructions. You can name the shadow database whatever you like.

    For information about obtaining a connection string, see [Connect from any application](/docs/connect/connect-from-any-app/).

1. Add the `shadowDatabaseUrl` setting to your `prisma/schema.prisma` file to identify the shadow database URL:

   ```typescript
   datasource db {
     provider = "postgresql"
     url   = env("DATABASE_URL")
     shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
   }
   ```

1. Add a `SHADOW_DATABASE_URL` environment variable to your `.env` file and set it to the databasen connection string that you copied in the previous step. The following example uses a shadow database named `shadow_db`. Use the database name that you gave to your shadow database.

   ```shell
   SHADOW_DATABASE_URL="postgres://daniel:<password>@ep-restless-rice-862380.us-east-2.aws.neon.tech:5432/shadow_db"
   ```

## Prisma Migrate with PgBouncer

Prisma Migrate requires a direct connection to the database. It does not support connection pooling with PgBouncer. Attempting to run Prisma Migrate commands such as `prisma migrate dev` with a pooled connection causes the following error:

```text
Error undefined: Database error
Error querying the database: db error: ERROR: prepared statement
"s0" already exists
```

If you encounter this error, ensure that you are using a direct connection to the database. Neon supports both pooled and direct connections to the same database. See [Enable connection pooling](/docs/connect/connection-pooling#enable-connection-pooling) for more information.

You can configure Prisma Migrate to use a direct connection string while allowing applications that use Prisma Client with a pooled connection by adding a `directUrl` property to the datasource block in your `schema.prisma` file. For example:

```text
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

After adding the `directUrl` property to your `schema.prisma` file, update your `.env` file with the `DATABASE_URL` and `DIRECT_URL` variables settings. Set `DATABASE_URL` to the pooled connection string for your Neon database, and set `DIRECT_URL` to the direct (non-pooled) connection string. Your `SHADOW_DATABASE_URL` variable can continue to use the same direct data connection string. For example:

```text
DATABASE_URL="postgres://daniel:<password>@ep-restless-rice-862380-pooler.us-east-2.aws.neon.tech:5432/neondb?pgbouncer=true"
SHADOW_DATABASE_URL="postgres://daniel:<password>@ep-restless-rice-862380.us-east-2.aws.neon.tech:5432/shadow_db"
DIRECT_URL="postgres://daniel:<password>@ep-restless-rice-862380.us-east-2.aws.neon.tech:5432/neondb"
```
