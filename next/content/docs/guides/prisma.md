---
title: Connect from Prisma to Neon
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/prisma
  - /docs/integrations/prisma
---

Prisma is an open-source, next-generation ORM that allows you to easily manage and interact with your database. This guide describes how to connect from Prisma to Neon.

## Create a Neon project

If you do not have one already, create a Neon project. Save your connection connection string. It is required when defining connection settings.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify a name, a PostgreSQL version, a region, and click **Create Project**.

## Connect to Neon from Prisma

To connect to Neon from Prisma:

1. Add the following lines to your `prisma/schema.prisma` file to identify the data source and database URL:

   ```typescript
   datasource db {
     provider = "postgresql"
     url   = env("DATABASE_URL")
   }
   ```

2. Add a `DATABASE_URL` setting to your `.env` file and set it to the Neon connection string that you copied in the previous step.

  ```shell
  DATABASE_URL="postgres://<user>:<password>@<host>:5432/neondb"
  ```

where:

- `<host>` the hostname of the Neon endpoint. An endpoint hostname has an `ep-` prefix and appears similar to this: `ep-tight-salad-272396.us-east-2.aws.neon.tech`.
- `<user>` is the database user.
- `<password>` is the database user's password, which is provided to you when you create a Neon project.

You can find all of the connection details listed above, except for your password,  in the **Connection Details** widget on the Neon **Dashboard**. For more information, see [Connect from any application](/docs/connect/connect-from-any-app). If you have misplaced your password, see [Reset a password](/docs/manage/users#reset-a-password).

## Configure a shadow database for Prisma Migrate

Prisma Migrate is a migration tool that allows you to easily evolve your database schema from prototyping to production. Prisma Migrate requires a shadow database to detect schema drift. This section describes how to configure a second Neon database as a shadow database, which is required to run the `prisma migrate dev` command.

<Admonition type="note">
Prisma Migrate requires a direct connection to the database and currently does not support connection pooling with PgBouncer. Migrations fail with an error if connection pooling is enabled in Neon. For more information, see [Prisma Migrate with PgBouncer](#prisma-migrate-with-pgbouncer).
</Admonition>

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

Prisma Migrate requires a single, direct connection to the database. It currently does not support connection pooling with PgBouncer. Attempting to run Prisma Migrate commands in any environment that enables PgBouncer for connection pooling causes the following error:

```text
Error undefined: Database error
Error querying the database: db error: ERROR: prepared statement 
"s0" already exists
```

If you encounter this error, ensure that connection pooling in Neon is disabled. See [Enable connection pooling](/docs/connect/connection-pooling#enable-connection-pooling).

For more information about this issue, refer to the [Prisma documentation](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management/configure-pg-bouncer#prisma-migrate-and-pgbouncer-workaround).

## Prisma Client with PgBouncer for serverless functions

Serverless functions may require a large number of database connections. If you are using Prisma Client from a serverless function, add the `?pgbouncer=true` flag to your connection URL to enable connection pooling. For example:

```text
postgres://<user>:<password>@<host>:5432/neondb?pgbouncer=true
```

Neon runs PgBouncer in [Transaction mode](https://www.pgbouncer.org/features.html).

For more information, refer to the [Prisma documentation](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management/configure-pg-bouncer#add-pgbouncer-to-the-connection-url).

## Connection timeouts

A connection timeout that occurs when connecting from Prisma to Neon causes an error similar to the following:

```text
Error: P1001: Can't reach database server at `ep-white-thunder-826300.us-east-2.aws.neon.tech`:`5432`
Please make sure your database server is running at `ep-white-thunder-826300.us-east-2.aws.neon.tech`:`5432`.
```

This error most likely means that the Prisma query engine timed out before the Neon compute instance was activated.

A Neon compute instance has two main states: _Active_ and _Idle_. Active means that the compute instance is currently running. If there is no query activity for 5 minutes, Neon places a compute instance into an idle state. For more information, see [Compute lifecycle](/docs/introduction/compute-lifecycle/).

When you connect to an idle compute instance from Prisma, Neon automatically activates it. Activation typically happens within a few seconds, but added latency can result in a connection timeout. To address this issue, try adjusting your Neon connection string with the following parameters:

- Set `connect_timeout` to 0 or a higher value. This setting defines the maximum number of seconds to wait for a new connection to be opened. The default value is 5 seconds. A setting of 0 means no timeout. A higher setting should provide the time required to avoid connection timeout issues. For example:

  ```bash
  postgres://<user>:<password>@<host>:5432/neondb?connect_timeout=10
  ```

- If you are using connection pooling, set `pool_timeout` to 0 or a higher value. This setting defines the number of seconds to wait for a new connection from the pool. The default is 10 seconds. A setting of 0 means no timeout. A higher setting should provide the time required to avoid connection timeout issues. For example:

```bash
postgres://<user>:<password>@<host>:5432/neondb?pgbouncer=true&pool_timeout=20
```

For additional information about connecting from Prisma, refer to the following resources in the _Prisma documentation_:

- [Connection management](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)
- [Database connection issues](https://www.prisma.io/dataguide/managing-databases/database-troubleshooting#database-connection-issues)
- [PostgreSQL database connector](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [Increasing the pool timeout](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#increasing-the-pool-timeout)

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
