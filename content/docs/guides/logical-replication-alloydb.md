---
title: Replicate data from AlloyDB
subtitle: Learn how to replicate data from AlloyDB to Neon
enableTableOfContents: true
isDraft: false
tag: new
updatedOn: '2024-09-17T15:08:05.541Z'
---

<LRBeta/>

This guide describes how to replicate data from AlloyDB Postgres to Neon using native Postgres logical replication. The steps in this guide follow those described in [Set up native PostgreSQL logical replication](https://cloud.google.com/sql/docs/postgres/replication/configure-logical-replication#set-up-native-postgresql-logical-replication), in the _Google AlloyDB documentation_.

## Prerequisites

- An AlloyDB Postgres instance containing the data you want to replicate. If you're just testing this out and need some data to play with, you can use the following statements to create a table with sample data.

  ```sql shouldWrap
  CREATE TABLE IF NOT EXISTS playing_with_neon(id SERIAL PRIMARY KEY, name TEXT NOT NULL, value REAL);
  INSERT INTO playing_with_neon(name, value)
  SELECT LEFT(md5(i::TEXT), 10), random() FROM generate_series(1, 10) s(i);
  ```

- A Neon project with a Postgres database to receive the replicated data. For information about creating a Neon project, see [Create a project](/docs/manage/projects#create-a-project).
- Read the [important notices about logical replication in Neon](/docs/guides/logical-replication-neon#important-notices) before you begin.
- Review our [logical replication tips](/docs/guides/logical-replication-tips), based on real-world customer data migration experiences.

## Prepare your AlloyDB source database

This section describes how to prepare your source AlloyDB Postgres instance (the publisher) for replicating data to Neon.

### Enable logical replication

Your first step is to enable logical replication at the source Postgres instance. In AlloyDB, you can enable logical replication by setting the `alloydb.enable_pglogical` and `alloydb.logical_decoding` flags to `on`. This sets the Postgres `wal_level` parameter to `logical`.

To enable these flags:

1. In the Google Cloud console, navigate to your [AlloyDB Clusters](https://console.cloud.google.com/alloydb/clusters) page.
2. From the **Actions** menu for your Primary instance, select **Edit**.
3. Scroll down to the **Advanced Configurations Options** > **Flags** section.
4. If the flags have not been set on the instance before, click **Add a Database Flag**, and set the value to `on` for the `alloydb.enable_pglogical` and `alloydb.logical_decoding`.
5. Click **Update instance** to save your changes and confirm your selections.

Afterward, you can verify that logical replication is enabled by running `SHOW wal_level;` from **AlloyDB Studio** or your terminal:

![show wal_level](/docs/guides/alloydb_show_wal_level.png)

### Allow connections from Neon

You need to allow connections to your AlloyDB Postgres instance from Neon. To do this in your AlloyDB instance:

1. In the Google Cloud console, navigate to your [AlloyDB Clusters](https://console.cloud.google.com/alloydb/clusters) page and select your **Primary instance** to open the **Overview** page.
2. Scroll down to the **Instances in your cluster** section.
3. Click **Edit Primary**.
4. Select the **Enable public IP** checkbox to allow connections over the public internet.
5. Under **Authorized external networks**, enter the Neon IP addresses you want to allow. Add an entry for each of the NAT gateway IP addresses associated with your Neon project's region. Neon has 3 to 6 IP addresses per region, corresponding to each availability zone. See [NAT Gateway IP addresses](/docs/introduction/regions#nat-gateway-ip-addresses) for the IP addresses.

   <Admonition type="note">
   AlloyDB requires addresses to be specified in CIDR notation. You can do so by appending `/32` to the NAT Gateway IP address; for example: `18.217.181.229/32`
   </Admonition>

   In the example shown below, you can see that three addresses were added in CIDR format by appending `/32`.

   ![AlloyDB network configuration](/docs/guides/alloydb_network_config.png)

6. Under **Network Security**, select **Require SSL Encryption (default)** if it's not already selected.
7. Click **Update Instance** when you are finished.

### Note your public IP address

Record the public IP address of your AlloyDB Postgres instance. You'll need this value later when you set up a subscription from your Neon database. You can find the public IP address on your AlloyDB instance's **Overview** page, under **Instances in your cluster** > **Connectivity**.

<Admonition type="note">
If you do not use a public IP address, you'll need to configure access via a private IP. See [Private IP overview](https://cloud.google.com/alloydb/docs/private-ip), in the AlloyDB documentation.
</Admonition>

![AlloyDB public IP address](/docs/guides/alloydb_public_ip.png)

### Create a Postgres role for replication

It is recommended that you create a dedicated Postgres role for replicating data from your AlloyDB Postgres instance. The role must have the `REPLICATION` privilege. On your AlloyDB Postgres instance, login in as your `postgres` user or an administrative user you use to create roles and run the following command to create a replication role. You can replace the name `replication_user` with whatever name you want to use.

```sql shouldWrap
CREATE USER replication_user WITH REPLICATION IN ROLE alloydbsuperuser LOGIN PASSWORD 'replication_user_password';
```

### Grant schema access to your Postgres role

If your replication role does not own the schemas and tables you are replicating from, make sure to grant access. For example, the following commands grant access to all tables in the `public` schema to a Postgres role named `replication_user`:

```sql
GRANT USAGE ON SCHEMA public TO replication_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO replication_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO replication_user;
```

Granting `SELECT ON ALL TABLES IN SCHEMA` instead of naming the specific tables avoids having to add privileges later if you add tables to your publication.

### Create a publication on the source database

Publications are a fundamental part of logical replication in Postgres. They define what will be replicated.

Run this command to create a publication for all tables in your source database:

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

## Prepare your Neon destination database

This section describes how to prepare your source Neon Postgres database (the subscriber) to receive replicated data from your AlloyDB Postgres instance.

### Prepare your database schema

When configuring logical replication in Postgres, the tables defined in your publication on the source database you are replicating from must also exist in the destination database, and they must have the same table names and columns. You can create the tables manually in your destination database or use utilities like `pg_dump` and `pg_restore` to dump the schema from your source database and load it to your destination database.

<Admonition type="note">
If you're just using the sample `playing_with_neon` table, you can create the same table on the destination database with the following statement:

```sql shouldWrap
CREATE TABLE IF NOT EXISTS playing_with_neon(id SERIAL PRIMARY KEY, name TEXT NOT NULL, value REAL);
```
</Admonition> 

#### Dump the schema

To dump only the schema from a database, you can run a `pg_dump` command similar to the following to create an `.sql` dump file with the schema only:

```sql
pg_dump --schema-only \
	--no-privileges \
	"postgresql://role:password@hostname:5432/dbname" \
	> schema_dump.sql
```

- With the the `--schema-only` option, only object definitions are dumped. Data is excluded.
- The `--no-privileges` option prevents dumping privileges. Neon may not support the privileges you've defined elsewhere, or if dumping a schema from Neon, there maybe Neon-specific privileges that cannot be restored to another database.

#### Review and modify the dumped schema

After dumping a schema to an `.sql` file, review it for statements that you don't want to replicate or that won't be supported on your destination database, and comment them out. For example, when dumping a schema from AlloyDB, you'll see the statements shown below, which you'll need to comment out because they won't be supported in Neon. Generally, you should remove any parameters configured on another Postgres provider and rely on Neon's default Postgres settings.

If you are replicating a large dataset, also consider removing any `CREATE INDEX` statements from the resulting dump file to avoid creating indexes when loading the schema on the destination database (the subscriber). Taking indexes out of the equation can substantially reduce the time required for initial data load performed when starting logical replication. Save the `CREATE INDEX` statements that you remove. You can add the indexes back after the initial data copy is completed.

<Admonition type="note">
To comment out a single line, you can use `--` at the beginning of the line.
</Admonition>

```sql
-- SET statement_timeout = 0;
-- SET lock_timeout = 0;
-- SET idle_in_transaction_session_timeout = 0;
-- SET client_encoding = 'UTF8';
-- SET standard_conforming_strings = on;
-- SELECT pg_catalog.set_config('search_path', '', false);
-- SET check_function_bodies = false;
-- SET xmloption = content;
-- SET client_min_messages = warning;
-- SET row_security = off;

-- ALTER SCHEMA public OWNER TO alloydbsuperuser;

-- CREATE EXTENSION IF NOT EXISTS google_columnar_engine WITH SCHEMA public;

-- CREATE EXTENSION IF NOT EXISTS google_db_advisor WITH SCHEMA public;
```

#### Load the schema

After making any necessary modifications to the dump file, load the dumped schema using `pg_restore`.

<Admonition type="tip">
When you're restoring on Neon, you can input your Neon connection string in place of `postgresql://role:password@hostname:5432/dbname`. You can find your connection string on the **Connection Details** widget on the Neon Project Dashboard.
</Admonition>

```sql
psql \
	"postgresql://role:password@hostname:5432/dbname" \
	< schema_dump.sql
```

After you've loaded the schema, you can view the result with this `psql` command:

```sql
\dt
```

### Create a subscription

After creating a publication on the source database, you need to create a subscription on your Neon destination database.

1. Create the subscription using the using a `CREATE SUBSCRIPTION` statement:

   ```sql
   CREATE SUBSCRIPTION my_subscription
   CONNECTION 'host=<primary-ip> port=5432 dbname=postgres user=replication_user password=replication_user_password'
   PUBLICATION my_publication;
   ```

   - `subscription_name`: A name you chose for the subscription.
   - `connection_string`: The connection string for the source AlloyDB database where you defined the publication. For the `<primary_ip>`, use the IP address of your AlloyDB Postgres instance that you noted earlier, and specify the name and password of your replication role. If you're replicating from a database other than `postgres`, be sure to specify that database name.
   - `publication_name`: The name of the publication you created on the source Neon database.

2. Verify the subscription was created by running the following command:

   ```sql
   SELECT * FROM pg_stat_subscription;
   ```

   The subscription (`my_subscription`) should be listed, confirming that your subscription has been created successfully.

## Test the replication

Testing your logical replication setup ensures that data is being replicated correctly from the publisher to the subscriber database.

1. Run some data modifying queries on the source database (inserts, updates, or deletes). If you're using the `playing_with_neon` database, you can use this statement to insert 10 rows:

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

```sql shouldWrap
SELECT subname, received_lsn, latest_end_lsn, last_msg_receipt_time FROM pg_catalog.pg_stat_subscription;
```

## Switch over your application

After the replication operation is complete, you can switch your application over to the destination database by swapping out your AlloyDB source database connection details for your Neon destination database connection details.

You can find your Neon connection details on the **Connection Details** widget in the Neon Console. For details, see [Connect from any application](/docs/connect/connect-from-any-app).
