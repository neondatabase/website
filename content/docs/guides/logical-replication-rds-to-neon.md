---
title: Replicate data from Amazon RDS Postgres
subtitle: Use logical replication to perform a near-zero downtime database migration from Amazon RDS PostgreSQL to Neon  
enableTableOfContents: true
isDraft: false
updatedOn: '2024-08-02T17:25:18.435Z'
---

Neon's logical replication feature allows you to replicate data from Amazon RDS PostgreSQL to Neon. The steps described can be used for a near-zero downtime migration.

## Prerequisites

- A source database in Amazon RDS for PostgreSQL containing the data you want to replicate.
- A destination Neon project. For information about creating a Neon project, see [Create a project](/docs/manage/projects#create-a-project).

## Enable logical replication in the source Amazon RDS PostgreSQL instance

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

## Check network connectivity between Amazon RDS and your Neon project

You need to allow connections to your Amazon RDS Postgres instance from Neon. To do this in AWS, you need to edit the VPC security group for your RDS instance, which you can find a link to from your RDS instance page. The most relaxed rule for source connections is to allow `0.0.0.0/0`, which opens your instance for connections from the public internet without restriction. For better security, we recommend creating a rule specifically for connections from the region where your Neon project resides. Neon uses 3 to 6 IP addresses per region for outbound communication (1 per availability zone + region). Create a rule to allow access to all of the IPs for your Neon project's region, as per the following table:

| Region                | NAT Gateway IP Addresses                             |
|-----------------------|------------------------------------------------------|
| US East (N. Virginia) — aws-us-east-1 | 23.23.0.232, 3.222.32.110, 35.168.244.148, 54.160.39.37, 54.205.208.153, 54.88.155.118 |
| US East (Ohio) — aws-us-east-2       | 18.217.181.229, 3.129.145.179, 3.139.195.115                       |
| US West (Oregon) — aws-us-west-2     | 44.235.241.217, 52.32.22.241, 52.37.48.254, 54.213.57.47             |
| Europe (Frankfurt) — aws-eu-central-1| 18.158.63.175, 3.125.234.79, 3.125.57.42                            |
| Asia Pacific (Singapore) — aws-ap-southeast-1 | 54.254.50.26, 54.254.92.70, 54.255.161.23                 |
| Asia Pacific (Sydney) — aws-ap-southeast-2    | 13.237.134.148, 13.55.152.144, 54.153.185.87             |

If you do not know the region of your Neon project, you can find it in the **Project settings** widget on the **Project Dashboard**.

## Prepare the destination database in your Neon project

This section describes how to prepare your destination database.

<Admonition type="note">
You do not need to set `wal_level=logical` at the subscriber. This is only required at the publisher Postgres instance, which you already done.
</Admonition>

When configuring logical replication in Postgres, the tables in the source database that you are replicating from must also exist in the destination database, and they must have the same table names and columns. You can create the tables manually in your destination database or use a utility like `pg_dump` to dump the schema from your source database. For example, the following `pg_dump` command dumps the database schema from a database named `neondb`. The command uses a database connection URL. You can obtain a connection URL for your database from **Connection Details** widget on the Neon Dashboard. For instructions, see [Connect from any application](/docs/connect/connect-from-any-app).

```bash
pg_dump --schema-only \
	--no-privileges \
	--no-owner \
	"postgresql://rdsdb_owner:XXX@neon-replication-test.XXX.eu-west-1.rds.amazonaws.com/publisher" \
	> schema_dump.sql
```

<Admonition type="note">
The `--no-privileges` and `--no-owner` options prevent `pg_dump` from dumping privileges and `ALTER OWNER` statements that may not be supported in Neon. When you load the schema into Neon, objects will be owned by the Neon user performing that loads the schema. Privileges and ownership can be defined in Neon later according to what is supported in Neon.
</Admonition>

To load the schema into your destination database in Neon, you can run the following [psql](/docs/connect/query-with-psql-editor) command, specifying the database connection URL for your destination database:

```bash
 psql \
	"postgresql://neondb_owner:<password>@ep-mute-recipe-123456.us-east-2.aws.neon.tech/neondb?sslmode=require" \
	< schema_dump.sql
```

<Admonition type="note">
Notice that the database URLs for the source and destination databases differ. This is because they are different Postgres instances. Your source and destination database URLs will also differ.
</Admonition>

You can verify that the schema was loaded by running the following command on the destination database via [psql](/docs/connect/query-with-psql-editor) or the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor):

```bash
\dt
```

If you've dumped and loaded the database schema as described above, this command should display the same schema that exists in your source database.


## Create a publication on the source database

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

3. Connect to your destination database in Neon and run the following query  to view the received_lsn, latest_end_lsn, last_msg_receipt_time. The LSN values should match the `pg_current_wal_lsn` value on the source database and the the `last_msg_receipt_time` should be very recent.

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

## Switch your application to the destination Neon project

After the replication operation is complete, you can switch your application over to the destination database by swapping out the source database connection details for your Neon destination database connection details. 