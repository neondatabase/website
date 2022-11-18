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
3. Specify a name, a PostgreSQL version, and click **Create Project**.
4. After creating a project, you are directed to the Neon **Dashboard** tab, where a connection string with your password is provided under **Connection Details**. The connection string includes your password until you navigate away from the **Dashboard** tab. Copy the connection string. It is required to connect to Neon from your Prisma app.

## Connect to Neon from Prisma

To connect to Neon from Prisma:

1. Add the following lines to `prisma/schema.prisma` to identify the data source and database URL:

   ```typescript
   datasource db {
     provider = "postgresql"
     url   = env("DATABASE_URL")
   }
   ```

2. Add a `DATABASE_URL` setting to your Prisma `.env` file and set it to the Neon project connection string that you copied in the previous step.

```shell
    DATABASE_URL="postgres://<user>:<password>@<project_id>.cloud.neon.tech:5432/main"
```

<Admonition type="note">
If connection pooling is enabled for your Neon project, which is the default setting, append `?pgbouncer=true` to the connection string, as described in the [Prisma documentation](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management/configure-pg-bouncer#add-pgbouncer-to-the-connection-url).

```shell
    DATABASE_URL="postgres://<user>:<password>@<project_id>.cloud.neon.tech:5432/main?pgbouncer=true"
```

For information about enabling and disabling connection pooling for your Neon project, see [Connection pooling](../../get-started-with-neon/connection-pooling/).
</Admonition>

where:

- `<user>` is the database user, which is found on the Neon Console **Dashboard** tab, under **Connection Details**.
- `<password>` is the database user's password, which is provided to you when you create a Neon project.
- `<project_id>` is the ID of the Neon project, which is found on the Neon Console **Settings** tab, under **General Settings**.

## Configure a shadow database for Prisma Migrate

Prisma Migrate is a migration tool that allows you to easily evolve your database schema from prototyping to production. Prisma Migrate requires a shadow database to detect schema drift. This section describes how to configure a second Neon database, which is required to run the `prisma migrate dev` command.

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

1. Add a `SHADOW_DATABASE_URL` setting to your Prisma `.env` file and set it to the Neon project connection string that you copied in the previous step.

   ```shell
   SHADOW_DATABASE_URL="postgres://<user>:<password>@<project_id>.cloud.neon.tech:5432/main"
   ```

For additional information about shadow databases, refer to [About the shadow database](https://www.prisma.io/docs/concepts/components/prisma-migrate/shadow-database), in the Prisma documentation.
