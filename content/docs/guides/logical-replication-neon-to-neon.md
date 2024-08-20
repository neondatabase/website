---
title: Replicate data from one Neon project to another
subtitle: Use logical replication to migrate data to a different Neon project, account, Postgres version, or region
enableTableOfContents: true
isDraft: false
updatedOn: '2024-08-02T17:25:18.435Z'
---

<LRBeta/>

Neon's logical replication feature allows you to replicate data from one Neon project to another. This enables different replication scenarios, including:

- **Postgres version migration**: Moving data from one Postgres version to another; for example, from a Neon project that runs Postgres 15 to one that runs Postgres 16.
- **Region migration**: Moving data from one region to another; for example, from a Neon project in one region to a Neon project in a different region.
- **Neon account migration**: Moving data from a Neon project owned by one account to a project owned by a different account; for example, from a personal Neon account to a business-owned Neon account.

These are some common Neon-to-Neon replication scenarios. There may be others. You can follow the steps in this guide for any scenario that requires replicating data between different Neon projects.

## Prerequisites

- A Neon project with a database containing the data you want to replicate. If you're just testing this out and need some data to play with, you can use the following statements to create a table with sample data:

  ```sql shouldWrap
  CREATE TABLE IF NOT EXISTS playing_with_neon(id SERIAL PRIMARY KEY, name TEXT NOT NULL, value REAL);
  INSERT INTO playing_with_neon(name, value)
  SELECT LEFT(md5(i::TEXT), 10), random() FROM generate_series(1, 10) s(i);
  ```

- A destination Neon project.

For information about creating a Neon project, see [Create a project](/docs/manage/projects#create-a-project).

## Important notices

- Neon does not autosuspend a compute that has an active connection from a logical replication subscriber. In other words, a Neon Postgres instance with an active subscriber will not scale to zero, which may result in increased compute usage. For more information, see [Logical replication and autosuspend](/docs/guides/logical-replication-neon#logical-replication-and-autosuspend).
- To prevent storage bloat, **Neon automatically removes _inactive_ replication slots if there are other _active_ replication slots**. If you will have more than one replication slot, please read [Unused replication slots](/docs/guides/logical-replication-neon#unused-replication-slots) before you begin.

## Prepare your source Neon database

This section describes how to prepare your source Neon database (the publisher) for replicating data to your destination Neon database (the subscriber).

### Enable logical replication in the source Neon project

In the Neon project containing your source database, enable logical replication. You only need to perform this step on the source Neon project.

<Admonition type="important">
Enabling logical replication modifies the Postgres `wal_level` configuration parameter, changing it from `replica` to `logical` for all databases in your Neon project. Once the `wal_level` setting is changed to `logical`, it cannot be reverted. Enabling logical replication restarts all computes in your Neon project, meaning that active connections will be dropped and have to reconnect.
</Admonition>

To enable logical replication:

1. Select your project in the Neon Console.
2. On the Neon **Dashboard**, select **Settings**.
3. Select **Logical Replication**.
4. Click **Enable** to enable logical replication.

You can verify that logical replication is enabled by running the following query:

```sql
SHOW wal_level;
 wal_level
-----------
 logical
```

### Create a publication on the source database

Publications are a fundamental part of logical replication in Postgres. They define what will be replicated.
To create a publication for all tables in your database:

```sql
CREATE PUBLICATION my_publication FOR ALL TABLES;
```

<Admonition type="note">
It's also possible to create a publication for specific tables; for example, to create a publication for the `playing_with_neon` table, you can use the following syntax:

```sql shouldWrap
CREATE PUBLICATION playing_with_neon_publication FOR TABLE playing_with_neon;
```

For details, see [CREATE PUBLICATION](https://www.postgresql.org/docs/current/sql-createpublication.html), in the PostgreSQL documentation.
</Admonition>

## Prepare your Neon destination database

This section describes how to prepare your destination Neon Postgres database (the subscriber) to receive replicated data.

### Prepare your database schema

When configuring logical replication in Postgres, the tables in the source database you are replicating from must also exist in the destination database, and they must have the same table names and columns. You can create the tables manually in your destination database or use utilities like `pg_dump` and `pg_restore` to dump the schema from your source database and load it to your destination database.

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
   CONNECTION 'postgresql://neondb_owner:<password>@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb'
   PUBLICATION my_publication;
   ```

   - `subscription_name`: A name you chose for the subscription.
   - `connection_string`: The connection string for the source Neon database where you defined the publication.
   - `publication_name`: The name of the publication you created on the source Neon database.

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

## Switch over your application

After the replication operation is complete, you can switch your application over to the destination database by swapping out your source database connection details for your destination database connection details.

You can find the connection details for a Neon database on the **Connection Details** widget in the Neon Console. For details, see [Connect from any application](/docs/connect/connect-from-any-app).
