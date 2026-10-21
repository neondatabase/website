---
title: Replicate data from Lakebase Postgres on Databricks to Neon
subtitle: Use logical replication to migrate or stream data from Lakebase Postgres on
  Databricks to a Neon database
summary: >-
  Logical replication from Lakebase Postgres on Databricks to Neon streams
  row-level changes from a publication on a Lakebase database to a
  subscription on a Neon database. Use this guide for a low-downtime migration
  from Databricks to Neon, or to keep a Neon copy of Lakebase data in sync.
  Lakebase runs at wal_level = logical by default. Steps cover enabling
  password connections and creating a native Postgres password role with
  REPLICATION on Lakebase, creating a publication, allowing Neon NAT gateway IPs
  in the Databricks workspace IP access list, creating the target schema and
  subscription on Neon, verifying replication, resetting sequences, and cutting
  over.
enableTableOfContents: true
isDraft: false
---

Neon's logical replication feature lets you replicate data from Lakebase Postgres on Databricks to a Neon database. Neon subscribes to a publication on your Lakebase database, copies the existing data, and then applies each insert, update, and delete as it happens. Use it to:

- **Migrate from Databricks to Neon with minimal downtime**: Keep the Neon database current while your application still runs on Lakebase, then cut over when you're ready.
- **Keep a Neon copy of Lakebase data**: Replicate selected tables to Neon for use with apps and agents built on Neon.

To replicate in the other direction, see [Replicate data from Neon to Lakebase Postgres on Databricks](/docs/guides/logical-replication-neon-to-lakebase).

## Prerequisites

- A Lakebase project on Databricks with a database containing the data you want to replicate, in a workspace on AWS or Azure. If you're just testing this out and need some data to play with, you can use the following statements to create a table with sample data:

  ```sql shouldWrap
  CREATE TABLE IF NOT EXISTS playing_with_neon(id SERIAL PRIMARY KEY, name TEXT NOT NULL, value REAL);
  INSERT INTO playing_with_neon(name, value)
  SELECT LEFT(md5(i::TEXT), 10), random() FROM generate_series(1, 10) s(i);
  ```

- A Lakebase Postgres role that is a member of the `databricks_superuser` role, to create the publication. See [Create Postgres roles](https://docs.databricks.com/aws/en/oltp/projects/postgres-roles).
- A destination Neon project. For information about creating a Neon project, see [Create a project](/docs/manage/projects#create-a-project).
- Read the [important notices about logical replication in Neon](/docs/guides/logical-replication-neon#important-notices) before you begin.
- Review our [logical replication tips](/docs/guides/logical-replication-tips), based on real-world customer data migration experiences.

<Admonition type="important" title="Compute usage on Lakebase">
While Neon is subscribed, the Lakebase compute that publishes changes stays active and doesn't scale to zero. See [Logical replication and scale to zero](https://docs.databricks.com/aws/en/oltp/projects/logical-replication-manage#scale-zero) in the Databricks documentation.
</Admonition>

<Steps>

## Prepare your source Lakebase database

This section describes how to prepare your source Lakebase database (the publisher) for replicating data to your Neon database (the subscriber).

Lakebase runs at `wal_level = logical` by default, so you don't need to enable logical replication on the Lakebase project. You also don't need to enable it on the Neon project, because Neon is only the subscriber.

### Enable password connections

Neon connects to Lakebase with a Postgres username and password. Password connections are disabled by default for new Lakebase projects. Enable them for your project. See [Manage password connections](https://docs.databricks.com/aws/en/oltp/projects/manage-roles#block-connections).

### Create a Postgres role for replication

Create a dedicated role for Neon to connect as. Use a **native Postgres password role**, not an OAuth role. OAuth roles authenticate with short-lived Databricks tokens, which a subscription connection string can't use.

The role must have the `REPLICATION` attribute. Roles you create in the Lakebase App, CLI, or API have this attribute automatically. See [Create a native Postgres password role](https://docs.databricks.com/aws/en/oltp/projects/postgres-roles#create-native).

To set the password yourself, create the role with SQL instead. Include the `REPLICATION` attribute, because roles created with SQL don't receive it automatically:

```sql
CREATE ROLE replication_user WITH LOGIN REPLICATION PASSWORD 'AbC123dEf';
```

### Grant schema access to your Postgres role

If your replication role doesn't own the schemas and tables you're replicating from, grant access. For example, the following commands grant access to all tables in the `public` schema to the `replication_user` role:

```sql
GRANT USAGE ON SCHEMA public TO replication_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO replication_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO replication_user;
```

Granting `SELECT ON ALL TABLES IN SCHEMA` instead of naming the specific tables avoids having to add privileges later if you add tables to your publication.

### Create a publication on the source database

Connect to the Lakebase database as a member of the `databricks_superuser` role, then create a publication. Publications define what gets replicated. Each table in the publication must have a primary key or a [replica identity](https://www.postgresql.org/docs/current/logical-replication-publication.html#LOGICAL-REPLICATION-PUBLICATION-REPLICA-IDENTITY) so that updates and deletes can be replicated.

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

### Allow connections from Neon

Neon connects in to Lakebase over the public internet. Private Link isn't supported for logical replication on Lakebase.

If your Databricks workspace uses an IP access list, add the NAT gateway IP addresses for your Neon project's region to it. Neon uses 3 to 6 IP addresses per region for outbound communication, one for each availability zone, so be sure to add all of them. See [NAT Gateway IP addresses](/docs/introduction/regions#nat-gateway-ip-addresses) for the list, and [Manage the IP access list](https://docs.databricks.com/aws/en/security/network/front-end/ip-access-list) in the Databricks documentation for instructions.

## Prepare your Neon destination database

This section describes how to prepare your destination Neon database (the subscriber) to receive replicated data.

### Prepare your database schema

Logical replication copies data, not schema. The tables you replicate must exist in the Neon database with the same names and columns before you create the subscription. Create them empty. The initial copy fails on duplicate keys or constraint violations if a target table already contains rows.

You can create the tables manually or use `pg_dump` and `pg_restore` to dump the schema from Lakebase and load it into Neon. See [Import a database schema](/docs/import/migrate-schema-only) for instructions. Lakebase dumps can include ownership and privileges for Databricks-specific roles that don't exist on Neon, so restore with `--no-owner` and `--no-acl`. See [Database object ownership considerations](/docs/import/migrate-from-postgres#database-object-ownership-considerations).

If you're using the sample `playing_with_neon` table, you can create the same table on the Neon database with the following statement:

```sql shouldWrap
CREATE TABLE IF NOT EXISTS playing_with_neon(id SERIAL PRIMARY KEY, name TEXT NOT NULL, value REAL);
```

### Create a subscription

After creating a publication on the source database, create a subscription on the Neon database.

1. Use the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor), `psql`, or another SQL client to connect to your Neon database. Roles created using the Neon CLI, Console, or API, including the default role created with your project, can create subscriptions.
2. Create the subscription using a `CREATE SUBSCRIPTION` statement.

   ```sql shouldWrap
   CREATE SUBSCRIPTION my_subscription
   CONNECTION 'host=<lakebase-host> port=5432 dbname=databricks_postgres user=replication_user password=AbC123dEf sslmode=verify-full sslrootcert=system'
   PUBLICATION my_publication;
   ```

   - `subscription_name`: A name you chose for the subscription.
   - `connection_string`: The connection details for the source Lakebase database where you defined the publication. Replace `<lakebase-host>` with your Lakebase endpoint hostname, and `databricks_postgres` with your database name if it's different. You can find both in the **Connect** dialog for your Lakebase project. Use the direct hostname, not the `-pooler` connection pooler hostname, because logical replication requires a persistent connection. `sslmode=verify-full` with `sslrootcert=system` encrypts the connection and verifies Lakebase's publicly trusted certificate. It requires Postgres 16 or later on Neon. On earlier versions, use `sslmode=require`.
   - `publication_name`: The name of the publication you created on the source Lakebase database.

   Creating the subscription creates a replication slot on your Lakebase database, copies the existing rows, and then streams ongoing changes.

3. Verify the subscription was created by running the following command:

   ```sql
   SELECT * FROM pg_stat_subscription;
   ```

   The subscription (`my_subscription`) should be listed, confirming that your subscription has been created successfully.

<Admonition type="warning" title="Replication slots and inactive subscriptions">
If the Neon subscription stops consuming changes, for example because it's disabled or failing, the replication slot on Lakebase becomes inactive. Lakebase removes inactive replication slots after about 40 hours, and the subscription must then be re-created. See [Automatic removal of inactive slots](https://docs.databricks.com/aws/en/oltp/projects/logical-replication-manage#auto-slot-removal) in the Databricks documentation.
</Admonition>

## Test the replication

Testing your logical replication setup ensures that data is being replicated correctly from Lakebase to Neon.

1. Run some data modifying queries on the Lakebase database (inserts, updates, or deletes). If you're using the `playing_with_neon` table, you can use this statement to insert some rows:

   ```sql
   INSERT INTO playing_with_neon(name, value)
   SELECT LEFT(md5(i::TEXT), 10), random() FROM generate_series(1, 10) s(i);
   ```

2. Perform a row count on the Lakebase and Neon databases to make sure the result matches.

   ```sql
   SELECT COUNT(*) FROM playing_with_neon;

   count
   -------
   20
   (1 row)
   ```

Alternatively, you can run the following query on Neon to make sure the `last_msg_receipt_time` is as expected. For example, if you just ran an insert on Lakebase, the `last_msg_receipt_time` should reflect the time of that operation.

```sql
SELECT subname, received_lsn, latest_end_lsn, last_msg_receipt_time FROM pg_catalog.pg_stat_subscription;
```

## Switch over your application

When the Neon database has caught up, stop writes on Lakebase and confirm that Neon is fully current.

Logical replication doesn't copy sequence values. Before you resume writes on Neon, reset each sequence to match the replicated data. Otherwise, new inserts into `SERIAL` or identity columns can generate duplicate primary keys. For example:

```sql shouldWrap
SELECT setval(pg_get_serial_sequence('playing_with_neon', 'id'), (SELECT MAX(id) FROM playing_with_neon));
```

Then switch your application to the Neon connection details. You can find them by clicking the **Connect** button in the Console nav to open the **Connect to your branch** modal. See [Connect from any application](/docs/connect/connect-from-any-app).

After your application is running against Neon, drop the subscription on Neon to stop replicating. Dropping the subscription also removes the replication slot on Lakebase.

```sql
DROP SUBSCRIPTION my_subscription;
```

</Steps>

## Related docs

**Neon**

- [Logical replication in Neon](/docs/guides/logical-replication-neon)
- [Replicate data from Neon to Lakebase Postgres on Databricks](/docs/guides/logical-replication-neon-to-lakebase)

**Databricks**

- [Logical replication](https://docs.databricks.com/aws/en/oltp/projects/logical-replication)
- [Replicate data from Lakebase](https://docs.databricks.com/aws/en/oltp/projects/logical-replication-publication)
- [Manage and monitor logical replication](https://docs.databricks.com/aws/en/oltp/projects/logical-replication-manage)

<NeedHelp/>
