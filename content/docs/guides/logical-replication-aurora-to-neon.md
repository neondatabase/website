---
title: Replicate data from Aurora PostgreSQL
subtitle: Use logical replication to perform a near-zero downtime database migration from Aurora PostgreSQL to Neon
enableTableOfContents: true
isDraft: false
updatedOn: '2024-08-02T17:25:18.435Z'
---

Neon's logical replication feature allows you to replicate data from Aurora PostgreSQL to Neon. The steps described can be used for a near-zero downtime migration.

## Prerequisites

- A source database in Aurora PostgreSQL containing the data you want to replicate.
- A destination Neon project. For information about creating a Neon project, see [Create a project](/docs/manage/projects#create-a-project).

## Prepare your source database

### Enable logical replication in the source Aurora PostgreSQL instance

1. Sign in to the AWS Management Console and navigate to the Amazon RDS console at [https://console.aws.amazon.com/rds/](https://console.aws.amazon.com/rds/).

2. From the navigation pane, select your Aurora PostgreSQL DB cluster.

3. Go to the Configuration tab. Within the Instance details, locate the Parameter group link associated with the DB cluster parameter group.

4. Click on the link to view the custom parameters tied to your Aurora PostgreSQL DB cluster.

5. In the Parameters search bar, type `rds` to locate the `rds.logical_replication` parameter. This parameter is set to `0` by default, meaning it is turned off.

6. To enable this feature, click on Edit parameters, and select `1` from the dropdown. Depending on your specific use case, you might also need to adjust the following parameters. However, in many scenarios, the default values are adequate.

   - `max_replication_slots` – Configure this parameter to a value that is at least equal to your expected number of logical replication publications and subscriptions. If you're utilizing AWS DMS, ensure this parameter is set to at least the number of planned change data capture tasks, plus the logical replication publications and subscriptions.

   - `max_wal_senders` and `max_logical_replication_workers` – These should be set to a value that matches the number of active logical replication slots or AWS DMS tasks for change data capture. Inactive logical replication slots can prevent the vacuum from removing outdated tuples, so it's recommended to monitor and remove inactive slots as necessary.

   - `max_worker_processes` – Set this to a value that is equal to the sum of `max_logical_replication_workers`, `autovacuum_max_workers`, and `max_parallel_workers`. On smaller DB instance classes, this setting can impact application workloads, so be sure to monitor database performance if you set `max_worker_processes` above the default value. The default value is calculated as `GREATEST(${DBInstanceVCPU*2},8)`, which means it is either `8` or twice the CPU equivalent of the DB instance class, whichever is greater.

   <Admonition type="note">
   Parameter values can be modified within a custom-created DB parameter group, but cannot be changed in a default DB parameter group.
   </Admonition> 

7. Click **Save changes**.

8. Reboot the writer instance of your Aurora PostgreSQL DB cluster to apply the changes. In the Amazon RDS console, select the primary DB instance of the cluster and choose Reboot from the Actions menu.

9. Once the instance is available again, you can verify that logical replication is enabled as follows:

   - Use `psql` to connect to the writer instance of your Aurora PostgreSQL DB cluster.

   ```bash
   psql --host=your-db-cluster-instance-1.aws-region.rds.amazonaws.com --port=5432 --username=postgres --password --dbname=labdb
   ```
   - Verify that logical replication is enabled by running the following command:

   ```bash
   SHOW rds.logical_replication;
   rds.logical_replication
   -------------------------
   on
   (1 row)
   ```

   - Also, confirm that the wal_level is set to logical:

   ```bash
  SHOW wal_level;
  wal_level
   -----------
    logical
   (1 row)
   ```

### Allow connections from Neon

You need to allow connections to your Aurora Postgres instance from Neon. You can do this by editing your instance's security group, which you can find a link to from your Aurora Postgres instance page.

Add a rule that allows traffic from all of the IP addresses for your Neon project's region.

Neon uses 3 to 6 IP addresses per region for this outbound communication, corresponding to each availability zone in the region. See [NAT Gateway IP addresses](/docs/introduction/regions#nat-gateway-ip-addresses) for Neon's NAT gateway IP addresses by region.


<Admonition type="note">
You could specify a rule for `0.0.0.0/0` to allow traffic from any IP address. However, this configuration is not considered secure.
</Admonition>

### Create a publication on the source database

This step is performed on your source Aurora Postgres instance.

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

This section describes how to prepare your source Neon Postgres database (the subscriber) to receive replicated data from your AWS Aurora Postgres instance.

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
   CONNECTION 'phost=publisher-cluster-writer-endpoint port=5432 dbname=db-name user=user password=password'
   PUBLICATION my_publication;
   ```

   - Subscription name: A name you chose for the subscription.
   - Connection: The connection string for the source database cluster, where you defined the publication.
      - `host` – The publisher Aurora PostgreSQL DB cluster's writer DB instance.
      - `port` – The port on which the writer DB instance is listening. The default for PostgreSQL is 5432.
      - `dbname` – The name of the database.
   - Publication name: The name of the publication you created on the source Aurora Postgres cluster.

3. Verify the subscription was created by running the following command:

   ```sql
   SELECT * FROM pg_stat_subscription;
   ```

   The subscription (`my_subscription`) should be listed, confirming that your subscription has been successfully created.

## Test the replication

Testing your logical replication setup ensures that data is being replicated correctly from the publisher to the subscriber database. You can do this in three steps:

1. Run some data modifying queries on the source database (inserts, updates, or deletes).
2. On the source database in Aurora, check the current Write-Ahead Log (WAL) LSN:

   ```bash
   SELECT pg_current_wal_lsn();
   pg_current_wal_lsn
   --------------------
   0/7D213250
   (1 row)
   ```

3. Connect to your destination database in Neon and run the following query to view the received_lsn, latest_end_lsn, last_msg_receipt_time. The LSN values should match the `pg_current_wal_lsn` value on the source database and the the `last_msg_receipt_time` should be very recent.

```bash
SELECT subname, received_lsn, latest_end_lsn, last_msg_receipt_time from pg_catalog.pg_stat_subscription;
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

After the replication operation is complete, you can switch your application over to the destination database by swapping out your AWS Aurora source database connection details for your Neon destination database connection details.

You can find your Neon connection details on the **Connection Details** widget in the Neon Console. For details, see [Connect from any application](/docs/connect/connect-from-any-app).
