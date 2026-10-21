---
title: Replicate data from Neon to Lakebase Postgres on Databricks
subtitle: Use logical replication to migrate or stream data from a Neon database to
  Lakebase Postgres on Databricks
summary: >-
  Logical replication from Neon to Lakebase Postgres on Databricks streams
  row-level changes from a publication on a Neon database to a subscription on
  a Lakebase database. Use this guide for a low-downtime migration from Neon to
  Databricks, or to keep a Lakebase copy of Neon data in sync. Steps cover
  enabling logical replication on the Neon project, creating a replication role
  and publication, allowing Lakebase to reach Neon, creating the target schema
  and subscription on Lakebase, verifying replication, resetting sequences, and
  cutting over. Enabling logical replication on Neon is irreversible and
  restarts all computes in the project.
enableTableOfContents: true
isDraft: false
---

Neon's logical replication feature lets you replicate data from a Neon database to Lakebase Postgres on Databricks. Lakebase subscribes to a publication on your Neon database, copies the existing data, and then applies each insert, update, and delete as it happens. Use it to:

- **Migrate from Neon to Databricks with minimal downtime**: Keep the Lakebase database current while your application still runs on Neon, then cut over when you're ready.
- **Keep a Lakebase copy of Neon data**: Replicate selected tables to Lakebase for use alongside other Databricks workloads.

If a short write outage is acceptable, a dump and restore is simpler. See [Migrate Neon to Lakebase](/docs/guides/migrate-neon-to-lakebase). To replicate in the other direction, see [Replicate data from Lakebase Postgres on Databricks to Neon](/docs/guides/logical-replication-lakebase-to-neon).

## Prerequisites

- A Neon project with a database containing the data you want to replicate. If you're just testing this out and need some data to play with, you can use the following statements to create a table with sample data:

  ```sql shouldWrap
  CREATE TABLE IF NOT EXISTS playing_with_neon(id SERIAL PRIMARY KEY, name TEXT NOT NULL, value REAL);
  INSERT INTO playing_with_neon(name, value)
  SELECT LEFT(md5(i::TEXT), 10), random() FROM generate_series(1, 10) s(i);
  ```

- A Lakebase project on Databricks for the destination database, in a workspace on AWS or Azure. See [Lakebase Postgres](https://docs.databricks.com/aws/en/oltp).
- A Lakebase Postgres role that can create subscriptions: a member of the `databricks_superuser` role, or a role granted the `pg_create_subscription` predefined role. See [Create Postgres roles](https://docs.databricks.com/aws/en/oltp/projects/postgres-roles).
- Read the [important notices about logical replication in Neon](/docs/guides/logical-replication-neon#important-notices) before you begin.
- Review our [logical replication tips](/docs/guides/logical-replication-tips), based on real-world customer data migration experiences.

<Admonition type="important" title="Compute and billing">
Replication keeps your Neon compute active (no [scale to zero](/docs/introduction/scale-to-zero)) while Lakebase is subscribed, which can increase your bill. See [Important notices about logical replication in Neon](/docs/guides/logical-replication-neon#important-notices).
</Admonition>

<Steps>

## Prepare your source Neon database

This section describes how to prepare your source Neon database (the publisher) for replicating data to your Lakebase database (the subscriber).

### Enable logical replication in the source Neon project

In the Neon project containing your source database, enable logical replication. You don't need to change anything on Lakebase. As a subscriber, Lakebase doesn't require a `wal_level` change.

<Admonition type="important">
Enabling logical replication modifies the Postgres `wal_level` configuration parameter, changing it from `replica` to `logical` for all databases in your Neon project. Once the `wal_level` setting is changed to `logical`, it cannot be reverted. Enabling logical replication restarts all computes in your Neon project, meaning that active connections will be dropped and have to reconnect.
</Admonition>

To enable logical replication:

1. Select your project in the Neon Console.
2. Select **Settings** in the sidebar.
3. Select **Postgres**, then **Logical replication**.
4. Click **Enable** to enable logical replication.

You can verify that logical replication is enabled by running the following query:

```sql
SHOW wal_level;
 wal_level
-----------
 logical
```

### Create a Postgres role for replication

Create a dedicated Postgres role for Lakebase to connect as. The role must have the `REPLICATION` privilege. Roles created using the Neon CLI, Console, or API are granted membership in the [neon_superuser](/docs/manage/roles#the-neonsuperuser-role) role, which has the required `REPLICATION` privilege. Roles created with SQL don't have this privilege, and it can't be granted. See [Replication roles](/docs/guides/logical-replication-neon#replication-roles).

<Tabs labels={["CLI", "Console", "API"]}>

<TabItem>

The following CLI command creates a role. To view the CLI documentation for this command, see [Neon CLI roles command](/docs/cli/roles).

```bash
neon roles create --name replication_user
```

</TabItem>

<TabItem>

To create a role in the Neon Console:

1. Navigate to the [Neon Console](https://console.neon.tech).
2. Select a project.
3. Select your branch from the project/branch menu at the top of the sidebar.
4. Under **Postgres database**, select **Roles**.
5. Click **Add Role**.
6. In the role creation dialog, specify a role name.
7. Click **Create**. The role is created, and you are provided with the password for the role.

</TabItem>

<TabItem>

The following Neon API method creates a role. To view the API documentation for this method, refer to the [Neon API Reference](/docs/reference/api/branches/create-project-branch-role).

```bash
curl 'https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/roles' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
  "role": {
    "name": "replication_user"
  }
}' | jq
```

> Replace `{project_id}` and `{branch_id}` with your actual Neon project and branch IDs, and set the `NEON_API_KEY` environment variable with your Neon API key.

</TabItem>

</Tabs>

### Grant schema access to your Postgres role

If your replication role doesn't own the schemas and tables you're replicating from, grant access. For example, the following commands grant access to all tables in the `public` schema to the `replication_user` role:

```sql
GRANT USAGE ON SCHEMA public TO replication_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO replication_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO replication_user;
```

Granting `SELECT ON ALL TABLES IN SCHEMA` instead of naming the specific tables avoids having to add privileges later if you add tables to your publication.

### Create a publication on the source database

Publications define what gets replicated. Each table in the publication must have a primary key or a [replica identity](https://www.postgresql.org/docs/current/logical-replication-publication.html#LOGICAL-REPLICATION-PUBLICATION-REPLICA-IDENTITY) so that updates and deletes can be replicated.

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

### Allow Lakebase to connect to Neon

As the subscriber, Lakebase connects out to your Neon database over the public internet. Private Link isn't supported for logical replication on Lakebase.

- **On Neon**: No action is needed unless you use Neon's **IP Allow** feature. If you do, the Lakebase connection must come from an allowed address. See [Subscriber access](/docs/guides/logical-replication-neon#subscriber-access).
- **On Databricks**: If your Databricks account enforces a network policy for serverless workloads, add your Neon hostname (for example, `ep-cool-darkness-123456.us-east-2.aws.neon.tech`) to the allowed internet destinations. Otherwise, Databricks rejects the subscription when you create it. See [Manage network policies](https://docs.databricks.com/aws/en/security/network/serverless-network-security/manage-network-policies).

## Prepare your Lakebase destination database

This section describes how to prepare your destination Lakebase database (the subscriber) to receive replicated data.

### Prepare your database schema

Logical replication copies data, not schema. The tables you replicate must exist in the Lakebase database with the same names and columns before you create the subscription. Create them empty. The initial copy fails on duplicate keys or constraint violations if a target table already contains rows.

You can create the tables manually or dump the schema from Neon with `pg_dump --schema-only` and load it into Lakebase. Neon dumps include ownership and privileges for Neon-specific roles such as `neondb_owner` and `neon_superuser`, which don't exist on Lakebase, so restore with `--no-owner` and `--no-acl`. See [Restore into Lakebase](/docs/guides/migrate-neon-to-lakebase#restore-into-lakebase) for details.

If you're using the sample `playing_with_neon` table, you can create the same table on the Lakebase database with the following statement:

```sql shouldWrap
CREATE TABLE IF NOT EXISTS playing_with_neon(id SERIAL PRIMARY KEY, name TEXT NOT NULL, value REAL);
```

### Create a subscription

After creating a publication on the source database, create a subscription on the Lakebase database.

1. Connect to your Lakebase database as a role that can create subscriptions (see [Prerequisites](#prerequisites)). You can use the SQL editor in the Lakebase App, `psql`, or another SQL client. See [Connect to your database](https://docs.databricks.com/aws/en/oltp/projects/connect).
2. Create the subscription using a `CREATE SUBSCRIPTION` statement.

   ```sql shouldWrap
   CREATE SUBSCRIPTION my_subscription
   CONNECTION 'host=ep-cool-darkness-123456.us-east-2.aws.neon.tech port=5432 dbname=neondb user=replication_user password=AbC123dEf sslmode=verify-full sslrootcert=system'
   PUBLICATION my_publication;
   ```

   - `subscription_name`: A name you chose for the subscription.
   - `connection_string`: The connection details for the source Neon database where you defined the publication. Use the direct hostname, not the pooled one. Logical replication requires a persistent connection and isn't compatible with connection poolers, so the hostname must not include the `-pooler` suffix. See [Connection pooling](/docs/connect/connection-pooling). `sslmode=verify-full` with `sslrootcert=system` encrypts the connection and verifies Neon's publicly trusted certificate.
   - `publication_name`: The name of the publication you created on the source Neon database.

   Creating the subscription creates a replication slot on your Neon database, copies the existing rows, and then streams ongoing changes.

3. Verify the subscription was created by running the following command:

   ```sql
   SELECT * FROM pg_stat_subscription;
   ```

   The subscription (`my_subscription`) should be listed, confirming that your subscription has been created successfully.

<Admonition type="warning" title="Replication slots and inactive subscriptions">
If the Lakebase subscription stops consuming changes, for example because it's disabled or failing, the replication slot on Neon becomes inactive. Neon removes inactive replication slots after approximately 40 hours, and the subscription must then be re-created. See [Unused replication slots](/docs/guides/logical-replication-neon#unused-replication-slots).
</Admonition>

## Test the replication

Testing your logical replication setup ensures that data is being replicated correctly from Neon to Lakebase.

1. Run some data modifying queries on the Neon database (inserts, updates, or deletes). If you're using the `playing_with_neon` table, you can use this statement to insert some rows:

   ```sql
   INSERT INTO playing_with_neon(name, value)
   SELECT LEFT(md5(i::TEXT), 10), random() FROM generate_series(1, 10) s(i);
   ```

2. Perform a row count on the Neon and Lakebase databases to make sure the result matches.

   ```sql
   SELECT COUNT(*) FROM playing_with_neon;

   count
   -------
   20
   (1 row)
   ```

Alternatively, you can run the following query on Lakebase to make sure the `last_msg_receipt_time` is as expected. For example, if you just ran an insert on Neon, the `last_msg_receipt_time` should reflect the time of that operation.

```sql
SELECT subname, received_lsn, latest_end_lsn, last_msg_receipt_time FROM pg_catalog.pg_stat_subscription;
```

To confirm that the initial copy of every table has finished, see [Monitor replication](https://docs.databricks.com/aws/en/oltp/projects/logical-replication-manage#monitor) in the Databricks documentation.

## Switch over your application

When the Lakebase database has caught up, stop writes on Neon and confirm that Lakebase is fully current.

Logical replication doesn't copy sequence values. Before you resume writes on Lakebase, reset each sequence to match the replicated data. Otherwise, new inserts into `SERIAL` or identity columns can generate duplicate primary keys. For example:

```sql shouldWrap
SELECT setval(pg_get_serial_sequence('playing_with_neon', 'id'), (SELECT MAX(id) FROM playing_with_neon));
```

Then switch your application to the Lakebase connection details. See [Connect to your database](https://docs.databricks.com/aws/en/oltp/projects/connect).

After your application is running against Lakebase, drop the subscription on Lakebase to stop replicating. Dropping the subscription also removes the replication slot on Neon.

```sql
DROP SUBSCRIPTION my_subscription;
```

If you no longer need the Neon project, you can delete it. See [Delete a project](/docs/manage/projects#delete-a-project).

</Steps>

## Related docs

**Neon**

- [Logical replication in Neon](/docs/guides/logical-replication-neon)
- [Migrate Neon to Lakebase](/docs/guides/migrate-neon-to-lakebase)
- [Replicate data from Lakebase Postgres on Databricks to Neon](/docs/guides/logical-replication-lakebase-to-neon)

**Databricks**

- [Logical replication](https://docs.databricks.com/aws/en/oltp/projects/logical-replication)
- [Replicate data into Lakebase](https://docs.databricks.com/aws/en/oltp/projects/logical-replication-subscription)
- [Manage and monitor logical replication](https://docs.databricks.com/aws/en/oltp/projects/logical-replication-manage)

<NeedHelp/>
