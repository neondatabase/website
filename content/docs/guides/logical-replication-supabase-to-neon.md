---
title: Replicate data from Supabase
subtitle: Learn how to replicate data from Supabase to Neon
enableTableOfContents: true
isDraft: false
updatedOn: '2025-02-14T17:05:10.002Z'
tag: new
---

This guide describes how to replicate data from Supabase to Neon using native Postgres logical replication. The steps in this guide follow those described in [Replicate to another Postgres database using Logical Replication](https://supabase.com/docs/guides/database/postgres/setup-replication-external), in the _Supabase documentation_.

## Prerequisites

- A Supabase project with a Postgres database containing the data you want to replicate. If you're just testing this out and need some data to play with, you can use the following statements in your Supabase SQL Editor to create a table with sample data:

  ```sql shouldWrap
  CREATE TABLE IF NOT EXISTS playing_with_neon(id SERIAL PRIMARY KEY, name TEXT NOT NULL, value REAL);
  INSERT INTO playing_with_neon(name, value)
  SELECT LEFT(md5(i::TEXT), 10), random() FROM generate_series(1, 10) s(i);
  ```

- A Neon project with a Postgres database to receive the replicated data. For information about creating a Neon project, see [Create a project](/docs/manage/projects#create-a-project).
- Read the [important notices about logical replication in Neon](/docs/guides/logical-replication-neon#important-notices) before you begin.
- Review our [logical replication tips](/docs/guides/logical-replication-tips), based on real-world customer data migration experiences.

<Steps>

## Prepare your Supabase source database

This section describes how to prepare your source Supabase Postgres instance (the publisher) for replicating data to Neon.

### Enable logical replication

Logical replication is enabled by default in Supabase. You can verify that `wal_level` is set to `logical` by running the following query in your Supabase SQL Editor or using `psql` connected to your Supabase database:

```sql
SHOW wal_level;
```

The output should be:

```text
wal_level
-----------
logical
(1 row)
```

If `wal_level` is not `logical`, contact Supabase support to enable it.

### Allow connections from Neon

You need to allow inbound connections to your Supabase Postgres database from the Neon NAT Gateway IP addresses. This allows Neon to connect to your Supabase database for logical replication. Follow these steps to configure network restrictions in Supabase:

1. **Obtain Neon NAT Gateway IP Addresses**: See [NAT Gateway IP addresses](/docs/introduction/regions#nat-gateway-ip-addresses) for the IP addresses for your Neon project's region. You will need to allow connections from these IP addresses in your Supabase project.
2. **Configure Network Restrictions in Supabase**:
   - Go to your Supabase project dashboard.
   - Navigate to **Project Settings** > **Database** > **Network restrictions**.
   - Ensure you have **Owner** or **Admin** permissions for the Supabase project to configure network restrictions.
   - Add inbound rules to allow connections from the Neon NAT Gateway IP addresses you obtained in the previous step. Add each IP address individually.
     ![Supabase Network Restrictions](/docs/guides/supabase_network_restrictions.png)

### Obtain a direct connection string

Logical replication requires a direct connection string, not a pooled connection string.

1. **Enable IPv4 Add-on**: In your Supabase project dashboard, navigate to **Project Settings** > **Add-ons**. Enable the **IPv4** add-on. This add-on is required to obtain a direct IPv4 connection string. Note that this add-on might incur extra costs.

   ![Supabase IPv4 Add-on](/docs/guides/supabase_ipv4_addon_image.png)

2. **Get the Direct Connection String**: After enabling the IPv4 add-on, copy the direct connection string from the **Connect** button in the Navigation bar of your Supabase dashboard. This connection string is required to create a subscription in Neon.

   ![Supabase Direct Connection String](/docs/guides/supabase_direct_connection_string.png)

    <Admonition type="warning">
    Avoid using pooled connection strings (Transaction and session poolers) for logical replication. Use the direct connection string obtained after enabling the IPv4 add-on.
    </Admonition>

### Create a publication on the source database

Publications are a fundamental part of logical replication in Postgres. They define what will be replicated. You can run the following SQL statements in your Supabase SQL Editor or using [psql](/docs/connect/query-with-psql-editor) to create a publication for the tables you want to replicate.

- To create a publication for a specific table, use the `CREATE PUBLICATION` statement. For example, to create a publication for the `playing_with_neon` table:

  ```sql shouldWrap
  CREATE PUBLICATION my_publication FOR TABLE playing_with_neon;
  ```

- To create a publication for multiple tables, provide a comma-separated list of tables:

  ```sql shouldWrap
  CREATE PUBLICATION my_publication FOR TABLE users, departments;
  ```

<Admonition type="note">
Defining specific tables lets you add or remove tables from the publication later, which you cannot do when creating publications with `FOR ALL TABLES`.
</Admonition>

For syntax details, see [CREATE PUBLICATION](https://www.postgresql.org/docs/current/sql-createpublication.html), in the PostgreSQL documentation.

## Prepare your Neon destination database

This section describes how to prepare your Neon Postgres database (the subscriber) to receive replicated data from your Supabase Postgres instance.

### Prepare your database schema

When configuring logical replication in Postgres, the tables defined in your publication on the source database you are replicating from must also exist in the destination database, and they must have the same table names and columns. You can create the tables manually in your destination database or use utilities like `pg_dump` and `pg_restore` to dump the schema from your source database and load it to your destination database. See [Import a database schema](/docs/import/import-schema-only) for instructions.

If you're using the sample `playing_with_neon` table, you can create the same table on the destination database with the following statement in your Neon SQL Editor or using `psql`:

```sql shouldWrap
CREATE TABLE IF NOT EXISTS playing_with_neon(id SERIAL PRIMARY KEY, name TEXT NOT NULL, value REAL);
```

### Create a subscription

After creating a publication on the source database, you need to create a subscription on your Neon destination database.

1. Use the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor), `psql`, or another SQL client to connect to your Neon database.

2. Create the subscription using the `CREATE SUBSCRIPTION` statement. Use the **direct connection string** you obtained from Supabase in the previous steps.

   ```sql shouldWrap
   CREATE SUBSCRIPTION my_subscription
   CONNECTION 'postgresql://<supabase_connection_string>'
   PUBLICATION my_publication;
   ```

   Replace the following placeholders in the statement:

   - `my_subscription`: A name you chose for the subscription.
   - `postgresql://<supabase_connection_string>`: The **direct connection string** for your Supabase database, obtained with the IPv4 add-on enabled.
   - `my_publication`: The name of the publication you created on the Supabase database.

3. Verify that the subscription was created in Neon by running the following query:

   ```sql
   SELECT * FROM pg_stat_subscription;

   subid   | subname         | worker_type | pid  | leader_pid | relid | received_lsn |     last_msg_send_time        |   last_msg_receipt_time      | latest_end_lsn |      latest_end_time
   --------|-----------------|-------------|------|------------|-------|--------------|-------------------------------|------------------------------|----------------|-------------------------------
   216502  | my_subscription |    apply    | 1069 |            |       | 0/75B1000    | 2025-02-11 10:00:04.142994+00 | 2025-02-11 10:00:04.14277+00 |   0/75B1000    | 2025-02-11 10:00:04.142994+00
   ```

   The subscription (`my_subscription`) should be listed, confirming that your subscription was created successfully.

<Admonition type="note">
**Replication Slots Limits**: Supabase has limits on `max_replication_slots` and `max_wal_senders` which vary based on your Supabase instance size/plan. If you encounter issues, you might need to upgrade your Supabase instance to perform logical replication, especially for larger datasets or multiple replication slots. Check [Supabase documentation](https://supabase.com/docs/guides/platform/compute-and-disk#limits-and-constraints) for the limits on your instance size.
</Admonition>

## Test the replication

Testing your logical replication setup ensures that data is being replicated correctly from the publisher to the subscriber database.

1. Run some data modifying queries on the source database (inserts, updates, or deletes) in your Supabase SQL Editor or using `psql`. If you're using the `playing_with_neon` database, you can use this statement to insert 10 rows:

   ```sql
   INSERT INTO playing_with_neon(name, value)
   SELECT LEFT(md5(i::TEXT), 10), random() FROM generate_series(1, 10) s(i);
   ```

2. Perform a row count on both the Supabase source and Neon destination databases to make sure the result matches. In both databases, run:

   ```sql
   SELECT COUNT(*) FROM playing_with_neon;

   count
   -------
   20
   (1 row)
   ```

   The count should be the same in both databases, reflecting the newly inserted rows.

Alternatively, you can run the following query on the subscriber (Neon) to make sure the `last_msg_receipt_time` is updated and as expected.

```sql shouldWrap
SELECT subname, received_lsn, latest_end_lsn, last_msg_receipt_time
FROM pg_catalog.pg_stat_subscription;
```

## Switch over your application

After the replication operation is complete and you have verified that data is being replicated correctly, you can switch your application over to the Neon database.

1. Stop writes to your Supabase database.
2. Wait for any final transactions to be replicated to Neon. Monitor `pg_stat_subscription` in Neon until `received_lsn` and `latest_end_lsn` are close or equal, indicating minimal replication lag.
3. Update your application's connection string to point to your Neon database.

You can find your Neon database connection details by clicking the **Connect** button on your **Project Dashboard** to open the **Connect to your database** modal. For details, see [Connect from any application](/docs/connect/connect-from-any-app).

</Steps>

## Reference

For more information about logical replication and Postgres client utilities, refer to the following topics in the Postgres and Neon documentation:

- [Postgres - Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)
- [Neon logical replication guide](/docs/guides/logical-replication-guide)
- [pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html)
- [psql](https://www.postgresql.org/docs/current/app-psql.html)
- [pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html)

<NeedHelp/>
