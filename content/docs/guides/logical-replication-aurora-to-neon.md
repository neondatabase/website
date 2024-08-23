---
title: Replicate data from Aurora PostgreSQL
subtitle: Learn how to replicate data from Aurora PostgreSQL to Neon
enableTableOfContents: true
isDraft: false
updatedOn: '2024-08-22T02:18:02.647Z'
---

<LRBeta/>

Neon's logical replication feature allows you to replicate data from Aurora PostgreSQL to Neon.

## Prerequisites

- A source database in Aurora PostgreSQL containing the data you want to replicate. If you're just testing this out and need some data to play with, you can use the following statements to create a table with sample data:

  ```sql shouldWrap
   CREATE TABLE IF NOT EXISTS playing_with_neon(id SERIAL PRIMARY KEY, name TEXT NOT NULL, value REAL);
   INSERT INTO playing_with_neon(name, value)
   SELECT LEFT(md5(i::TEXT), 10), random() FROM generate_series(1, 10) s(i);
  ```

- A Neon project with a Postgres database to receive the replicated data. For information about creating a Neon project, see [Create a project](/docs/manage/projects#create-a-project).
- Read the [important notices about logical replication in Neon](/docs/guides/logical-replication-neon#important-notices) before you begin.

## Prepare your source database

This section describes how to prepare your source Aurora Postgres instance (the publisher) for replicating data to Neon.

### Enable logical replication in the source Aurora PostgreSQL instance

1. Sign in to the AWS Management Console and navigate to the Amazon RDS console at [https://console.aws.amazon.com/rds/](https://console.aws.amazon.com/rds/).

2. From the navigation pane, select your Aurora PostgreSQL DB cluster.

3. Go to the **Configuration** tab. Locate the **DB cluster parameter group** link.

   <Admonition type="note">
   If you are using the default parameter group, you will need to create a custom parameter group to set the value. You can do so by selecting **Parameter groups** > **Create parameter group** from the sidebar, selecting **Aurora PostgreSQL** as the engine type, and filling in the required fields. When you're finished, navigate back to your Aurora instance page, click **Modify**, and scroll down to select your new parameter group. Click **Continue**, and select **Apply immediately** to make the change, then click **Modify DB instance**.
   </Admonition>

4. Click on the link to view the custom parameters for your Aurora PostgreSQL DB cluster.

5. In the parameters search bar, type `rds` to locate the `rds.logical_replication` parameter. This parameter is set to `0` by default, meaning it is turned off.

6. To enable this feature, click on **Edit**, and select `1` from the drop-down menu.

7. Click **Save Changes**.

8. Reboot the **Writer instance** of your Aurora PostgreSQL DB cluster to apply the changes. In the Amazon RDS console, select your Aurora PostgreSQL DB cluster, then select the **Writer instance** of the cluster and choose **Reboot** from the **Actions** menu.

9. Once the instance is available again, you can verify that logical replication is enabled as follows:

   - Use `psql` to connect to the writer instance of your Aurora PostreSQL DB cluster.

     ```bash
     psql --host=your-db-cluster-instance-1.aws-region.rds.amazonaws.com --port=5432 --username=postgres --password --dbname=postgres
     ```

   - Verify that logical replication is enabled by running the following command:

     ```bash
     SHOW rds.logical_replication;
     rds.logical_replication
     -------------------------
     on
     (1 row)
     ```

   - Also, confirm that the `wal_level` is set to logical:

     ```bash
     SHOW wal_level;
     wal_level
     -----------
     logical
     (1 row)
     ```

### Allow connections from Neon

You need to allow inbound connections to your Aurora Postgres instance from Neon. You can do this by editing your writer instance's **CIDR/IP - Inbound** security group, which you can find a link to from the **Connectivity & security** tab on your database instance page.

1. Click on the security group name.
2. Click on the security group ID.
3. From the **Actions** menu, select **Edit inbound rules**.
4. Add rules that allow traffic from each of the IP addresses for your Neon project's region.

   Neon uses 3 to 6 IP addresses per region for outbound communication, corresponding to each availability zone in the region. See [NAT Gateway IP addresses](/docs/introduction/regions#nat-gateway-ip-addresses) for Neon's NAT gateway IP addresses.

5. When you're finished, click **Save rules**.

   <Admonition type="note">
   You can specify a rule for `0.0.0.0/0` to allow traffic from any IP address. However, this configuration is not considered secure.
   </Admonition>

### Create a publication on the source database

Publications are a fundamental part of logical replication in Postgres. They define what will be replicated.

To create a publication for all tables in your source database, run the following query. You can use a publication name of your choice.

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

## Prepare your destination database

This section describes how to prepare your source Neon Postgres database (the subscriber) to receive replicated data from your Aurora Postgres instance.

### Prepare your database schema

When configuring logical replication in Postgres, the tables defined in your publication on the source database you are replicating from must also exist in the destination database, and they must have the same table names and columns. You can create the tables manually in your destination database or use utilities like `pg_dump` and `pg_restore` to dump the schema from your source database and load it to your destination database. See [Import a database schema](/docs/import/import-schema-only) for instructions.

If you're using the sample `playing_with_neon` table, you can create the same table on the destination database with the following statement:

```sql shouldWrap
CREATE TABLE IF NOT EXISTS playing_with_neon(id SERIAL PRIMARY KEY, name TEXT NOT NULL, value REAL);
```

### Create a subscription

After creating a publication on the source database, you need to create a subscription on your Neon destination database.

1. Use the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor), `psql`, or another SQL client to connect to your destination database.
2. Create the subscription using the using a `CREATE SUBSCRIPTION` statement.

   ```sql shouldWrap
   CREATE SUBSCRIPTION my_subscription CONNECTION 'postgresql://postgres:password@database-1.czmwaio8k05k.us-east-2.rds.amazonaws.com/postgres' PUBLICATION my_publication;
   ```

   - `subscription_name`: A name you chose for the subscription.
   - `connection_string`: The connection string for the source AWS Aurora Postgres database where you defined the publication.
   - `publication_name`: The name of the publication you created on the source Aurora Postgres database.

3. Verify the subscription was created by running the following command:

   ```sql
   SELECT * FROM pg_stat_subscription;

   subid |     subname     | pid | leader_pid | relid | received_lsn |      last_msg_send_time       |     last_msg_receipt_time     | latest_end_lsn |        latest_end_time
   ------+-----------------+-----+------------+-------+--------------+-------------------------------+-------------------------------+----------------+-------------------------------
   16471 | my_subscription | 932 |            |       | 0/401CB10    | 2024-08-14 11:57:34.148184+00 | 2024-08-14 11:57:34.148388+00 | 0/401CB10      | 2024-08-14 11:57:34.148184+00
   (1 row)
   ```

   The subscription (`my_subscription`) should be listed, confirming that your subscription was created.

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

## Switch over your application

After the replication operation is complete, you can switch your application over to the destination database by swapping out your Aurora source database connection details for your Neon destination database connection details.

You can find your Neon connection details on the **Connection Details** widget in the Neon Console. For details, see [Connect from any application](/docs/connect/connect-from-any-app).
