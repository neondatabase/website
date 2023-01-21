---
title: Connect from Prisma to Neon
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/prisma
  - /docs/integrations/prisma
---

Prisma is an open-source, next-generation ORM that allows you to easily manage and interact with your database. This guide describes how to connect to Neon from Prisma.

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
  DATABASE_URL="postgres://<user>:<password>@<endpoint_hostname>:5432/neondb"
  ```

where:

- `<endpoint_hostname>` the hostname of the branch endpoint. The endpoint hostname has an `ep-` prefix and appears similar to this: `ep-tight-salad-272396.us-east-2.aws.neon.tech`.
- `<user>` is the database user.
- `<password>` is the database user's password, which is provided to you when you create a Neon project.

You can find all of the connection details listed above, except for your password,  in the **Connection Details** widget on the Neon **Dashboard**. For more information, see [Connect from any application](../../connect/connect-from-any-app). If you have misplaced your password, see [Reset a password](../../manage/users/#reset-a-password).

<Admonition type="note">
Using Prisma Client from a serverless function may require adding the `?pgbouncer=true` flag to your connection URL to enable connection pooling. For example:

```text
postgres://<user>:<password>@<endpoint_hostname>:5432/neondb?pgbouncer=true
```

For more information, refer to the [Prisma documentation](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management/configure-pg-bouncer#add-pgbouncer-to-the-connection-url).
</Admonition>

## Configure a shadow database for Prisma Migrate

Prisma Migrate is a migration tool that allows you to easily evolve your database schema from prototyping to production. Prisma Migrate requires a shadow database to detect schema drift. This section describes how to configure a second Neon database as a shadow database, which is required to run the `prisma migrate dev` command.

<Admonition type="note">
Prisma Migrate requires a direct connection to the database and currently does not support connection pooling with PgBouncer. Migrations fail with an error if connection pooling is enabled in Neon. For more information, see [Prisma Migrate and with PgBouncer](../prisma-connection-issues/#prisma-migrate-with-pgbouncer).
</Admonition>

To configure a shadow database:

1. Create another database in your Neon project and copy the connection string. Refer to [Create a database](../../manage/databases/#create-a-database) for instructions. For information about obtaining a connection string, see [Connect from any application](../../connect/connect-from-any-app/).

1. Add the `shadowDatabaseUrl` setting to your `prisma/schema.prisma` file to identify the shadow database URL:

   ```typescript
   datasource db {
     provider = "postgresql"
     url   = env("DATABASE_URL")
     shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
   }
   ```

1. Add a `SHADOW_DATABASE_URL` setting to your `.env` file and set it to the Neon connection string that you copied in the previous step.

   ```shell
   SHADOW_DATABASE_URL="postgres://<user>:<password>@<endpoint_hostname>:5432/<dbname>"
   ```

For additional information about shadow databases, refer to [About the shadow database](https://www.prisma.io/docs/concepts/components/prisma-migrate/shadow-database), in the _Prisma documentation_.

## Troublshooting

### Connection timeouts

A connection timeout when attempting to connect to Prisma from Neon results in the following error:

```text
Error: P1001: Can't reach database server at `ep-white-thunder-826300.us-east-2.aws.neon.tech`:`5432`
Please make sure your database server is running at `ep-white-thunder-826300.us-east-2.aws.neon.tech`:`5432`.
```

A compute node in Neon has two main states: Active and Idle.

Active means that PostgreSQL is currently running. If there are no active queries for 5 minutes, the activity monitor gracefully places the compute node into the Idle state to save energy and resources.

When you connect to an idle compute (in your case, using Prisma), Neon automatically activates it. Activation typically happens within a few seconds.

Now when this error is thrown, it most likely means that the Prisma query engine timed out before the compute node is active (or you’re trying to connect to a deleted project).

The solution would be to [increase the connection pool timeout](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#increasing-the-pool-timeout). You can do that by setting the `pool_timeout` ****parameter to a value larger than the default (10 seconds) so, for example, appending `&pool_timeout=20` to the end of the connection string.

In the future, when we bring down the time to activate an idle compute node, you wouldn’t need this workaround. Also, supporting more regions in the future will most likely decrease latency as well

### Prisma Migrate with PgBouncer

Prisma Migrate requires a direct connection to the database and currently does not support connection pooling with PgBouncer. Attempting to run Prisma Migrate commands in an environment that enables PgBouncer for connection pooling results in the following error:

```text
Error: undefined: Database error
Error querying the database: db error: ERROR: prepared statement 
"s0" already exists
```

If you encounter this error, ensure that connection pooling in Neon is disabled. See [Enable connection pooling](../../connect/connection-pooling/#enable-connection-pooling).

For more information about this issue, refer to the [Prisma documentation](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management/configure-pg-bouncer#prisma-migrate-and-pgbouncer-workaround).


## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
