---
title: Replicate data from Amazon RDS Postgres
subtitle: Learn how to replicate data from Amazon RDS Postgres to Neon
enableTableOfContents: true
isDraft: false
updatedOn: '2024-08-02T17:25:18.435Z'
---

Neon's logical replication feature allows you to replicate data from Amazon RDS PostgreSQL to Neon. The steps described can be used for a near-zero downtime migration.

## Prerequisites

- A source database in Amazon RDS for PostgreSQL containing the data you want to replicate.
- A destination Neon project. For information about creating a Neon project, see [Create a project](/docs/manage/projects#create-a-project).

## Prepare your source database

### Enable logical replication in the source Amazon RDS PostgreSQL instance

Enabling logical replication in Postgres requires changing the `wal_level` configuration parameter from `replica` to `logical`. Before you begin, you can check your current setting with the following command:

```bash
rdsdb_owner@publisher=> show wal_level;
 wal_level
-----------
 replica
(1 row)
```

If your current setting is `replica`, follow these steps to enable logical replication:

1. Navigate to the **Configuration** tab of your RDS instance.
2. Click on the DB instance parameter group.
3. Search for `rds.logical_replication` and set it to `1`. If you have the default parameter group, you will need to create a new parameter group to set the value.
4. Click **Modify** on your RDS instance page, select new parameter group, then click **Continue and Apply**. After this step, reboot your instance.
5. Check to maker sure that the `wal_level` parameter is set to `logical`.

   ```sql
   rdsdb_owner@publisher=> show wal_level;
   wal_level
   -----------
   logical
   (1 row)
   ```

### Allow connections from Neon

You need to allow connections to your AWS RDS Postgres instance from Neon. You can do this by editing your instance's security group, which you can find a link to from your AWS RDS Postgres instance page.

Add a rule that allows traffic from all of the IP addresses for your Neon project's region.

Neon uses 3 to 6 IP addresses per region for this outbound communication, corresponding to each availability zone in the region. See [NAT Gateway IP addresses](/docs/introduction/regions#nat-gateway-ip-addresses) for Neon's NAT gateway IP addresses by region.

<Admonition type="note">
You could specify a rule for `0.0.0.0/0` to allow traffic from any IP address. However, this configuration is not considered secure.
</Admonition>

### Create a publication on the source database

This step is performed on your source RDS instance.

Publications are a fundamental part of logical replication in Postgres. They allow you to define the database changes to be replicated to subscribers.

To create a publication for all tables in your source database:

```sql
CREATE PUBLICATION my_publication FOR ALL TABLES;
```

<Admonition type="note">
It's also possible to create a publication for specific tables; for example, to create a publication for the `playing_with_neon` table, you can use the following syntax:

```sql
CREATE PUBLICATION playing_with_neon_publication FOR TABLE playing_with_neon;
```

For details, see [CREATE PUBLICATION](https://www.postgresql.org/docs/current/sql-createpublication.html), in the PostgreSQL documentation.
</Admonition>

## Prepare your destination database

This section describes how to prepare your source Neon Postgres database (the subscriber) to receive replicated data from your AWS RDS Postgres instance.

### Prepare your database schema

When configuring logical replication in Postgres, the tables in the source database that you are replicating from must also exist in the destination database, and they must have the same table names and columns. You can create the tables manually in your destination database or use a utility like `pg_dump` to dump the schema from your source database.

If you're using the sample `playing_with_neon` table, you can create the same table on the destination database with the following statement:

```sql shouldWrap
CREATE TABLE IF NOT EXISTS playing_with_neon(id SERIAL PRIMARY KEY, name TEXT NOT NULL, value REAL);
```

### Create a subscription

After defining a publication on the source database, you need to define a subscription on the destination database.

1. Use `psql` or another SQL client to connect to your destination database.
2. Create the subscription using the using a `CREATE SUBSCRIPTION` statement.

   ```sql
   CREATE SUBSCRIPTION my_subscription
   CONNECTION 'postgresql://neondb_owner:<password>@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb'
   PUBLICATION my_publication;
   ```

   - `subscription_name`: A name you chose for the subscription.
   - `connection_string`: The connection string for the source Neon database, where you defined the publication.
   - `publication_name`: The name of the publication you created on the source Neon database.

3. Verify the subscription was created by running the following command:

   ```sql
   SELECT * FROM pg_stat_subscription;
   ```

   The subscription (`my_subscription`) should be listed, confirming that your subscription has been successfully created.

## Test the replication

Testing your logical replication setup ensures that data is being replicated correctly from the publisher to the subscriber database. You can do this in three steps:

1. Run some data modifying queries on the source database (inserts, updates, or deletes).
2. On the source database in Amazon RDS, check the current Write-Ahead Log (WAL) LSN:

   ```bash
   rdsdb_owner@publisher=> SELECT pg_current_wal_lsn();
   pg_current_wal_lsn
   --------------------
   0/7D213250
   (1 row)
   ```

3. Connect to your destination database in Neon and run the following query to view the received_lsn, latest_end_lsn, last_msg_receipt_time. The LSN values should match the `pg_current_wal_lsn` value on the source database and the the `last_msg_receipt_time` should be very recent.

```bash
neondb_owner@subscriber=> SELECT subname, received_lsn, latest_end_lsn, last_msg_receipt_time from pg_catalog.pg_stat_subscription;
 subname | received_lsn | latest_end_lsn |     last_msg_receipt_time
---------+--------------+----------------+-------------------------------
 pgbench | 0/7D213250   | 0/7D213250     | 2024-08-02 18:37:16.70939+00
(1 rows)
```

As an extra check, you can also do a row count on the source and destination.

```sql
select count(*) from my_db;

 count
-------
  7585
(1 row)
```

## Switch over your application

After the replication operation is complete, you can switch your application over to the destination database by swapping out your AWS RDS source database connection details for your Neon destination database connection details.

You can find your Neon connection details on the **Connection Details** widget in the Neon Console. For details, see [Connect from any application](/docs/connect/connect-from-any-app).
