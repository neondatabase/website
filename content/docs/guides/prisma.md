---
title: Connect from Prisma to Neon
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/prisma
  - /docs/integrations/prisma
---

Prisma is an open-source, next-generation ORM that allows you to easily manage and interact with your database. This guide describes how to create a Neon project, connect to it from Prisma, and optionally configure a shadow database for Prisma Migrate.

To create a Neon project and connect to it from Prisma:

1. [Create a Neon project](#create-a-neon-project)
2. [Connect to Neon from Prisma](#connect-to-neon-from-prisma)
3. Optionally, [Configure a shadow database for Prisma Migrate](#configure-a-shadow-database-for-prisma-migrate).

## Create a Neon project

To create a Neon project:

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify a name, a PostgreSQL version, a region, and click **Create Project**.
4. After creating a project, you are directed to the Neon **Dashboard**, where a connection string with your password is provided under **Connection Details**. The connection string includes your password until you navigate away from the Neon Console or refresh the browser page. Copy the connection string. It is required to connect to Neon from your Prisma app.

## Connect to Neon from Prisma

To connect to Neon from Prisma:

1. Add the following lines to `prisma/schema.prisma` to identify the data source and database URL:

   ```typescript
   datasource db {
     provider = "postgresql"
     url   = env("DATABASE_URL")
   }
   ```

2. Add a `DATABASE_URL` setting to your Prisma `.env` file and set it to the Neon connection string that you copied in the previous step.

  ```shell
  DATABASE_URL="postgres://<user>:<password>@<endpoint_hostname>:5432/neondb"
  ```

where:

- `<endpoint_hostname>` the hostname of the branch endpoint, which is found on the Neon **Dashboard**, under **Connection Settings**.
- `<user>` is the database user, which is found on the Neon Console **Dashboard** tab, under **Connection Details**.
- `<password>` is the database user's password, which is provided to you when you create a Neon project.

<Admonition type="note">
Neon enables connection pooling by default using PgBouncer. Using Prisma Client in a PgBouncer-enabled environment from a serverless function may require adding the `?pgbouncer=true` flag to your connection URL. For example:

```text
postgres://<user>:<password>@<endpoint_hostname>:5432/neondb?pgbouncer=true
```

For more information, refer to the [Prisma documentation](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management/configure-pg-bouncer#add-pgbouncer-to-the-connection-url).
</Admonition>

## Configure a shadow database for Prisma Migrate

Prisma Migrate is a migration tool that allows you to easily evolve your database schema from prototyping to production. Prisma Migrate requires a shadow database to detect schema drift. This section describes how to configure a second Neon database, which is required to run the `prisma migrate dev` command.

<Admonition type="note">
Neon enables connection pooling by default using PgBouncer. Prisma Migrate requires a direct connection to the database and currently does not support connection pooling with PgBouncer. Attempting to run Prisma Migrate commands in an environment that uses PgBouncer for connection pooling results in the following error:

```text
Error: undefined: Database error
Error querying the database: db error: ERROR: prepared statement "s0" already exists
```

If you encounter this error, try disabling connection pooling for your Neon project. See [Configure connection pooling](../../connect/connection-pooling/#configure-connection-pooling).

For more information about this issue, refer to the [Prisma documentation](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management/configure-pg-bouncer#add-pgbouncer-to-the-connection-url).
</Admonition>

To configure a shadow database:

1. Create a second Neon project and make sure to copy the connection string. Refer to [Create a Neon project](#create-a-neon-project) for instructions.

1. Add the `shadowDatabaseUrl` setting to your `prisma/schema.prisma` file to identify the shadow database URL:

   ```typescript
   datasource db {
     provider = "postgresql"
     url   = env("DATABASE_URL")
     shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
   }
   ```

1. Add a `SHADOW_DATABASE_URL` setting to your Prisma `.env` file and set it to the Neon connection string that you copied in the previous step.

   ```shell
   SHADOW_DATABASE_URL="postgres://<user>:<password>@<endpoint_hostname>:5432/main"
   ```

For additional information about shadow databases, refer to [About the shadow database](https://www.prisma.io/docs/concepts/components/prisma-migrate/shadow-database), in the Prisma documentation.
