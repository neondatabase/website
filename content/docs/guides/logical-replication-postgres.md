---
title: Replicate data to an external Postgres instance
subtitle: Learn how to replicate data from Neon to an external Postgres instance
enableTableOfContents: true
isDraft: false
updatedOn: '2024-09-04T18:53:01.154Z'
---

Neon's logical replication feature allows you to replicate data from Neon to external subscribers. This guide shows you how to stream data from a Neon Postgres database to an external Postgres database (a Postgres destination other than Neon). If you're looking to replicate data from one Neon Postgres instance to another, see [Replicate data from one Neon project to another](/docs/guides/logical-replication-neon-to-neon).

## Prerequisites

- A Neon project with a database containing the data you want to replicate. If you're just testing this out and need some data to play with, you can use the following statements to create a table with sample data:

  ```sql shouldWrap
  CREATE TABLE IF NOT EXISTS playing_with_neon(id SERIAL PRIMARY KEY, name TEXT NOT NULL, value REAL);
  INSERT INTO playing_with_neon(name, value)
  SELECT LEFT(md5(i::TEXT), 10), random() FROM generate_series(1, 10) s(i);
  ```

  For information about creating a Neon project, see [Create a project](/docs/manage/projects#create-a-project).

- A destination Postgres instance other than Neon.
- Read the [important notices about logical replication in Neon](/docs/guides/logical-replication-neon#important-notices) before you begin.
- Review our [logical replication tips](/docs/guides/logical-replication-tips), based on real-world customer data migration experiences.

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

### Create a Postgres role for replication

It is recommended that you create a dedicated Postgres role for replicating data. The role must have the `REPLICATION` privilege. The default Postgres role created with your Neon project and roles created using the Neon CLI, Console, or API are granted membership in the [neon_superuser](/docs/manage/roles#the-neonsuperuser-role) role, which has the required `REPLICATION` privilege.

<Tabs labels={["CLI", "Console", "API"]}>

<TabItem>

The following CLI command creates a role. To view the CLI documentation for this command, see [Neon CLI commands — roles](https://api-docs.neon.tech/reference/createprojectbranchrole)

```bash
neon roles create --name replication_user
```

</TabItem>

<TabItem>

To create a role in the Neon Console:

1. Navigate to the [Neon Console](https://console.neon.tech).
2. Select a project.
3. Select **Branches**.
4. Select the branch where you want to create the role.
5. Select the **Roles & Databases** tab.
6. Click **Add Role**.
7. In the role creation dialog, specify a role name.
8. Click **Create**. The role is created, and you are provided with the password for the role.

</TabItem>

<TabItem>

The following Neon API method creates a role. To view the API documentation for this method, refer to the [Neon API reference](/docs/reference/cli-roles).

```bash
curl 'https://console.neon.tech/api/v2/projects/hidden-cell-763301/branches/br-blue-tooth-671580/roles' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
  "role": {
    "name": "replication_user"
  }
}' | jq
```

</TabItem>

</Tabs>

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
To create a publication for all tables in your database:

```sql
CREATE PUBLICATION my_publication FOR ALL TABLES;
```

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

## Prepare your destination database

This section describes how to prepare your destination Postgres database (the subscriber) to receive replicated data.

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

Alternatively, you can run the following query on the subscriber to make sure the `last_msg_receipt_time` is as expected. For example, if you just ran an insert option on the publisher, the `last_msg_receipt_time` should reflect the time of that operation.

```sql
SELECT subname, received_lsn, latest_end_lsn, last_msg_receipt_time FROM pg_catalog.pg_stat_subscription;
```

## Switch over your application

After the replication operation is complete, you can switch your application over to the destination database by swapping out your source database connection details for your destination database connection details.

You can find the connection details for a Neon database on the **Connection Details** widget in the Neon Console. For details, see [Connect from any application](/docs/connect/connect-from-any-app).

<NeedHelp/>
