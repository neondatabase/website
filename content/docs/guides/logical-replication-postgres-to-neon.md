---
title: Replicate data from Postgres to Neon
subtitle: Learn how to replicate data from a local Postgres instance or another Postgres
  provider to Neon
enableTableOfContents: true
isDraft: false
updatedOn: '2025-02-14T17:05:10.001Z'
---

Neon's logical replication feature allows you to replicate data from a local Postgres instance or another Postgres provider to Neon. If you're looking to replicate data from one Neon Postgres instance to another, see [Replicate data from one Neon project to another](/docs/guides/logical-replication-neon-to-neon).

## Prerequisites

- A local Postgres instance or Postgres instance hosted on another provider containing the data you want to replicate. If you're just testing this out and need some data to play with, you can use the following statements to create a table with sample data:

  ```sql shouldWrap
  CREATE TABLE IF NOT EXISTS playing_with_neon(id SERIAL PRIMARY KEY, name TEXT NOT NULL, value REAL);
  INSERT INTO playing_with_neon(name, value)
  SELECT LEFT(md5(i::TEXT), 10), random() FROM generate_series(1, 10) s(i);
  ```

- A destination Neon project. For information about creating a Neon project, see [Create a project](/docs/manage/projects#create-a-project).
- Read the [important notices about logical replication in Neon](/docs/guides/logical-replication-neon#important-notices) before you begin.
- Review our [logical replication tips](/docs/guides/logical-replication-tips), based on real-world customer data migration experiences.

<Steps>

## Prepare your source Postgres database

This section describes how to prepare your source Postgres database (the publisher) for replicating data to your destination Neon database (the subscriber).

### Enable logical replication in the source Neon project

On your source database, enable logical replication. The typical steps for a local Postgres instance are shown below. If you run Postgres on a provider, the steps may differ. Refer to your provider's documentation.

Enabling logical replication requires changing the Postgres `wal_level` configuration parameter from `replica` to `logical`.

1. Locate your `postgresql.conf` file. This is usually found in the PostgreSQL data directory. The data directory path can be identified by running the following query in your PostgreSQL database:

   ```sql
   SHOW data_directory;
   ```

2. Open the `postgresql.conf` file in a text editor. Find the `wal_level` setting in the file. If it is not present, you can add it manually. Set `wal_level` to `logical` as shown below:

   ```ini
   wal_level = logical
   ```

3. After saving the changes to `postgresql.conf`, you need to reload or restart PostgreSQL for the changes to take effect.

4. Confirm the change by running the following query in your PostgreSQL database:

   ```sql
   SHOW wal_level;
   wal_level
   -----------
   logical
   ```

### Create a Postgres role for replication

It is recommended that you create a dedicated Postgres role for replicating data. The role must have the `REPLICATION` privilege. For example:

```sql
CREATE ROLE replication_user WITH REPLICATION LOGIN PASSWORD 'your_secure_password';
```

### Grant schema access to your Postgres role

If your replication role does not own the schemas and tables you are replicating from, make sure to grant access. For example, the following commands grant access to all tables in the `public` schema to Postgres role `replication_user`:

```sql
GRANT USAGE ON SCHEMA public TO replication_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO replication_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO replication_user;
```

Granting `SELECT ON ALL TABLES IN SCHEMA` instead of naming the specific tables avoids having to add privileges later if you add tables to your publication.

### Create a publication on the source database

Publications are a fundamental part of logical replication in Postgres. They define what will be replicated.

To create a publication for a specific table:

```sql shouldWrap
CREATE PUBLICATION my_publication FOR TABLE playing_with_neon;
```

To create a publication for multiple tables, provide a comma-separated list of tables:

```sql shouldWrap
CREATE PUBLICATION my_publication FOR TABLE users, departments;
```

<Admonition type="note">
Defining specific tables lets you add or remove tables from the publication later, which you cannot do when creating publications with `FOR ALL TABLES`.
</Admonition>

For syntax details, see [CREATE PUBLICATION](https://www.postgresql.org/docs/current/sql-createpublication.html), in the PostgreSQL documentation.

## Prepare your Neon destination database

This section describes how to prepare your destination Neon Postgres database (the subscriber) to receive replicated data.

### Prepare your database schema

When configuring logical replication in Postgres, the tables in the source database you are replicating from must also exist in the destination database, and they must have the same table names and columns. You can create the tables manually in your destination database or use utilities like `pg_dump` and `pg_restore` to dump the schema from your source database and load it to your destination database. See [Import a database schema](/docs/import/import-schema-only) for instructions.

If you're using the sample `playing_with_neon` table, you can create the same table on the destination database with the following statement:

```sql shouldWrap
CREATE TABLE IF NOT EXISTS playing_with_neon(id SERIAL PRIMARY KEY, name TEXT NOT NULL, value REAL);
```

### Create a subscription

After creating a publication on the source database, you need to create a subscription on the destination database.

1. Use the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor), `psql`, or another SQL client to connect to your destination database.
2. Create the subscription using the using a `CREATE SUBSCRIPTION` statement.

   ```sql
   CREATE SUBSCRIPTION my_subscription
   CONNECTION 'host=<host-address-or-ip> port=5432 dbname=postgres user=replication_user password=replication_user_password'
   PUBLICATION my_publication;
   ```

   - `subscription_name`: A name you chose for the subscription.
   - `connection_string`: The connection string for the source Postgres database where you defined the publication.
   - `publication_name`: The name of the publication you created on the source Postgres database.

3. Verify the subscription was created by running the following command:

   ```sql
   SELECT * FROM pg_stat_subscription;
   ```

   The subscription (`my_subscription`) should be listed, confirming that your subscription has been created successfully.

## Test the replication

Testing your logical replication setup ensures that data is being replicated correctly from the publisher to the subscriber database.

1. Run some data modifying queries on the source database (inserts, updates, or deletes). If you're using the `playing_with_neon` database, you can use this statement to insert some rows:

   ```sql
   INSERT INTO playing_with_neon(name, value)
   SELECT LEFT(md5(i::TEXT), 10), random() FROM generate_series(1, 10) s(i);
   ```

2. Perform a row count on the source and destination databases to make sure the result matches.

   ```sql
   SELECT COUNT(*) FROM playing_with_neon;

   count
   -------
   30
   (1 row)
   ```

Alternatively, you can run the following query on the subscriber to make sure the `last_msg_receipt_time` is as expected. For example, if you just ran an insert option on the publisher, the `last_msg_receipt_time` should reflect the time of that operation.

```sql
SELECT subname, received_lsn, latest_end_lsn, last_msg_receipt_time FROM pg_catalog.pg_stat_subscription;
```

## Switch over your application

After the replication operation is complete, you can switch your application over to the destination database by swapping out your source database connection details for your destination database connection details.

You can find your Neon database connection details by clicking the **Connect** button on your **Project Dashboard** to open the **Connect to your database** modal. See [Connect from any application](/docs/connect/connect-from-any-app).

</Steps>
