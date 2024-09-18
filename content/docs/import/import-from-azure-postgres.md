---
title: Migrate from Azure PostgreSQL to Neon
subtitle: Learn how to migrate your database from Azure PostgreSQL to Neon using logical
  replication
tag: new
enableTableOfContents: true
updatedOn: '2024-09-18T09:52:58.422Z'
---

<LRBeta/>

This guide describes how to migrate your database from Azure Database for PostgreSQL to Neon, using logical replication.

Logical replication for Postgres transfers data from a source Postgres database to another, as a stream of tuples (records) or SQL statements. This allows for minimal downtime during the migration process, since all the records don't need to be copied at once.

## Prerequisites

- An Azure Database for PostgreSQL instance containing the data you want to migrate.
- A Neon project to move the data to.

  For detailed information on creating a Neon project, see [Create a project](/docs/manage/projects#create-a-project). Make sure to create a project with the same Postgres version as your Azure PostgreSQL deployment.

- Read the [important notices about logical replication in Neon](/docs/guides/logical-replication-neon#important-notices) before you begin.
- Review our [logical replication tips](/docs/guides/logical-replication-tips), based on real-world customer data migration experiences.

## Prepare your Azure PostgreSQL database

This section describes how to prepare your Azure PostgreSQL database (the publisher) for replicating data to your destination Neon database (the subscriber).

To illustrate the migration workflow, we set up the [AdventureWorks sample database](https://wiki.postgresql.org/wiki/Sample_Databases) on an Azure Database for PostgreSQL deployment. This database contains data corresponding to a fictionaly bicycle parts company, organized across 5 schemas and almost 70 tables.

### Enable logical replication in Azure PostgreSQL

1. Navigate to your Azure Database for PostgreSQL instance in the Azure portal.
2. From the left sidebar, select **Server parameters** under the **Settings** section.
3. Search for the `wal_level` parameter and set its value to `LOGICAL`.
4. Click **Save** to apply the changes.

   <Admonition type="note">
   Changing the `wal_level` parameter on Azure requires a server restart. This may cause a brief interruption to your database service.
   </Admonition>

### Create a PostgreSQL role for replication

It is recommended that you create a dedicated Postgres role for replicating data. Connect to your Azure PostgreSQL database using a tool like [psql](https://www.postgresql.org/docs/current/app-psql.html) or [Azure Data Studio](https://learn.microsoft.com/en-us/azure-data-studio/?view=sql-server-ver15), then create a new role with `REPLICATION` privileges:

```sql shouldWrap
CREATE ROLE replication_user WITH REPLICATION LOGIN PASSWORD 'your_secure_password';
```

### Grant schema access to your PostgreSQL role

Grant the necessary permissions to your replication role. For example, the following commands grant access to all tables in the `sales` schema to Postgres role `replication_user`:

```sql
GRANT USAGE ON SCHEMA sales TO replication_user;
GRANT SELECT ON ALL TABLES IN SCHEMA sales TO replication_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA sales GRANT SELECT ON TABLES TO replication_user;
```

Granting `SELECT ON ALL TABLES IN SCHEMA` instead of naming the specific tables avoids having to add privileges later if you add tables to your publication.

If you have data split across multiple schemas, you can run a similar command for each schema, or use a PL/pgSQL function to dynamically grant access to all schemas in the database.

```sql
-- Thanks to this Stackoverflow answer - https://dba.stackexchange.com/a/241266

DO $do$
DECLARE
    sch text;
BEGIN
    FOR sch IN SELECT nspname FROM pg_namespace
    where
        -- Exclude system schemas
        nspname != 'pg_toast'
        and nspname != 'pg_temp_1'
        and nspname != 'pg_toast_temp_1'
        and nspname != 'pg_statistic'
        and nspname != 'pg_catalog'
        and nspname != 'information_schema'
    LOOP
        EXECUTE format($$ GRANT USAGE ON SCHEMA %I TO replication_user $$, sch);
        EXECUTE format($$ GRANT SELECT ON ALL TABLES IN SCHEMA %I TO replication_user $$, sch);
        EXECUTE format($$ ALTER DEFAULT PRIVILEGES IN SCHEMA %I GRANT SELECT ON TABLES TO replication_user $$, sch);
    END LOOP;
END;
$do$;
```

### Create a publication on the Azure PostgreSQL database

Publications define which tables will be replicated to the destination database. To create a publication for all tables in your database, run the following query:

```sql
CREATE PUBLICATION azure_publication FOR ALL TABLES;
```

This command creates a publication named `azure_publication` that includes all tables in the `public` schema, since we want to copy all the data. For details, see [CREATE PUBLICATION](https://www.postgresql.org/docs/current/sql-createpublication.html), in the PostgreSQL documentation.

<Admonition type="important">
Avoid defining publications with `FOR ALL TABLES` if you want the flexibility to add or drop tables from the publication later. It is not possible to modify a publication defined with `FOR ALL TABLES` to include or exclude specific tables. For details, see [Logical replication tips](/docs/guides/logical-replication-tips).

To create a publication for a specific table, you can use the following syntax:

```sql shouldWrap
CREATE PUBLICATION my_publication FOR TABLE playing_with_neon;
```

To create a publication for multiple tables, provide a comma-separated list of tables:

```sql shouldWrap
CREATE PUBLICATION my_publication FOR TABLE users, departments;
```

For syntax details, see [CREATE PUBLICATION](https://www.postgresql.org/docs/current/sql-createpublication.html), in the PostgreSQL documentation.
</Admonition>

### Allow inbound traffic from Neon

You need to allow inbound traffic from Neon Postgres servers so it can connect to your Azure database. To do this, follow these steps:

1. Log into the Azure portal and navigate to your Azure Postgres Server resource.

2. Click on the **Networking** option under the `Settings` section in the sidebar. Navigate to the **Firewall Rules** section under the `Public access` tab.

3. Click on `Add a Firewall Rule`, which generates a modal to add the range of IP addresses from which we want to allow connections. You will need to perform this step for each of the NAT gateway IP addresses associated with your Neon project's region. For each IP address, create a new rule and fill both the `Start IP` and `End IP` fields with the IP address.

   Neon uses 3 to 6 IP addresses per region for this outbound communication, corresponding to each availability zone in the region. See [NAT Gateway IP addresses](/docs/introduction/regions#nat-gateway-ip-addresses) for Neon's NAT gateway IP addresses.

4. To fetch the database schema using `pg_dump`, you also need to allow inbound traffic from your local machine (or where you are running `pg_dump`) so it can connect to your Azure database. Add another firewall rule entry with that IP address as the start and end IP address.

5. CLick `Save` at the bottom to make sure all changes are saved.

## Prepare your Neon destination database

This section describes how to prepare your destination Neon PostgreSQL database (the subscriber) to receive replicated data.

You can find the connection details for the Neon database on the **Connection Details** widget in the Neon Console. For details, see [Connect from any application](/docs/connect/connect-from-any-app).

### Create the Neon database

To keep parity with the Azure PostgreSQL deployment, create a new database with the same name. See [Create a database](/docs/manage/databases#create-a-database) for more information.

For this example, we run the following query to create a new database named `AdventureWorks` in the Neon project.

```sql
CREATE DATABASE "AdventureWorks";
```

### Import the database schema

To ensure that the Neon `AdventureWorks` database has the same schema as the Azure PostgreSQL database, we'll need to import the schema. You can use the `pg_dump` utility to export the schema and then `psql` to import it into Neon.

1. Export the schema from Azure PostgreSQL:

   ```shell shouldWrap
   pg_dump --schema-only --no-owner --no-privileges -h <azure-host> -U <azure-user> -d <azure-database> > schema.sql
   ```

2. Import the schema into your Neon database:

   ```shell
   psql <neon-connection-string> < schema.sql
   ```

### Create a subscription

After importing the schema, create a subscription on the Neon database:

1. Use the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor), [psql](/docs/connect/query-with-psql-editor), or another SQL client to connect to your Neon database.

2. Create the subscription using the `CREATE SUBSCRIPTION` statement:

   ```sql
   CREATE SUBSCRIPTION neon_subscription
   CONNECTION 'host=<azure-host> port=5432 dbname=<azure-database> user=replication_user password=your_secure_password'
   PUBLICATION azure_publication;
   ```

3. Verify that the subscription was created by running the following query, and confirming that the subscription (`neon_subscription`) is listed:

   ```sql
   SELECT * FROM pg_stat_subscription;
   ```

## Monitor and verify the replication

To ensure that data is being replicated correctly:

1. Monitor the replication status on Neon, by running the following query:

   ```sql
   SELECT * FROM pg_stat_subscription;
   ```

   This query should return an output similar to the following:

   ```text
    subid |      subname      | pid | leader_pid | relid | received_lsn |      last_msg_send_time       |     last_msg_receipt_time     | latest_end_lsn |        latest_end_time
    -------+-------------------+-----+------------+-------+--------------+-------------------------------+-------------------------------+----------------+-------------------------------
    24576 | neon_subscription | 540 |            |       | 1/3D0020A8   | 2024-09-11 11:34:24.841807+00 | 2024-09-11 11:34:24.869991+00 | 1/3D0020A8     | 2024-09-11 11:34:24.841807+00
    (1 row)
   ```

   - An active `pid` indicates that the subscription is active and running.
   - The `received_lsn` and `latest_end_lsn` columns show the LSN (Log Sequence Number) of the last received (at Neon) and last written data (at Azure source), respectively.
   - In this example, they have the same value, which means that all the data has been successfully replicated from Azure to Neon.

2. To verify that the data has been replicated correctly, compare row counts between Azure PostgreSQL and Neon for some key tables. For example, you can run the following query to check the number of rows in the `addresses` table:

   ```sql
   SELECT COUNT(*) FROM person.address;
   ```

   It returns the same output on both databases:

   ```text
     count
    -------
    19614
    (1 row)
   ```

3. Optionally, you can run some queries from your application against the Neon database to verify that it returns the same output as the Azure instance.

## Complete the migration

Once the initial data sync is complete and you've verified that ongoing changes are being replicated:

1. Stop writes to your Azure PostgreSQL database.
2. Wait for any final transactions to be replicated to Neon.
3. Update your application's connection string to point to your Neon database.

This ensures a much shorter downtime for the application, as you only need to wait for the last few transactions to be replicated before switching the application over to the Neon database.

<Admonition type="note">
Remember to update any Azure-specific configurations or extensions in your application code to be compatible with Neon. For Neon Postgres parameter settings, see [Postgres parameter settings](/docs/reference/compatibility#postgres-parameter-settings). For Postgres extensions supported by Neon, see [Supported Postgres extensions](/docs/extensions/pg-extensions).
</Admonition>

## Clean up

After successfully migrating and verifying your data on Neon, you can:

1. Drop the subscription on the Neon database:

   ```sql
   DROP SUBSCRIPTION neon_subscription;
   ```

2. Remove the publication from the Azure PostgreSQL database:

   ```sql
   DROP PUBLICATION azure_publication;
   ```

3. Consider backing up your Azure PostgreSQL database before decommissioning it.

## Other migration options

This section discusses migration options other than using logical replication.

- **pg_dump and pg_restore**

  If your database size is not large, you can use the `pg_dump` utility to create a dump file of your database, and then use `pg_restore` to restore the dump file to Neon. Please refer to the [Import from Postgres](/docs/import/import-from-postgres) guide for more information on this method.

- **Postgres GUI clients**

  Some Postgres clients offer backup and restore capabilities. These include [pgAdmin](https://www.pgadmin.org/docs/pgadmin4/latest/backup_and_restore.html) and [phppgadmin](https://github.com/phppgadmin/phppgadmin/releases), among others. We have not tested migrations using these clients, but if you are uncomfortable using command-line utilities, they may provide an alternative.

- **Table-level data migration using CSV files**

  Table-level data migration (using CSV files, for example) does not preserve database schemas, constraints, indexes, types, or other database features. You will have to create these separately. Table-level migration is simple but could result in significant downtime depending on the size of your data and the number of tables. For instructions, see [Import data from CSV](/docs/import/import-from-csv).

## Reference

For more information about logical replication and Postgres client utilities, refer to the following topics in the Postgres and Neon documentation:

- [pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html)
- [pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html)
- [psql](https://www.postgresql.org/docs/current/app-psql.html)
- [Postgres - Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)
- [Neon logical replication guide](https://neon.tech/docs/guides/logical-replication-guide)

<NeedHelp/>
