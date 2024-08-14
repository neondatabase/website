---
title: Replicate data from AlloyDB
subtitle: Learn how to replicate data from AlloyDB to Neon
enableTableOfContents: true
isDraft: false
updatedOn: '2024-08-02T17:25:18.435Z'
---

The guide describes how to replicate data from AlloyDB Postgres using native Postgres logical replication, as described in [Set up native PostgreSQL logical replication](https://cloud.google.com/sql/docs/postgres/replication/configure-logical-replication#set-up-native-postgresql-logical-replication), in the Google AlloyDB documentation.

## Prerequisites

- An AlloyDB Postgres instance containing the data you want to replicate. If you need some data to play with, you can use the following statements to create a table with sample data. Your database and schema may differ.

  ```sql shouldWrap
  CREATE TABLE IF NOT EXISTS playing_with_neon(id SERIAL PRIMARY KEY, name TEXT NOT NULL, value REAL);
  INSERT INTO playing_with_neon(name, value)
  SELECT LEFT(md5(i::TEXT), 10), random() FROM generate_series(1, 10) s(i);
  ```

  <Admonition type="note">
  This guide uses the default `postgres` data and `public` schema in the AlloyDB Postgres instance. Your database and schema may differ, but the same steps should apply.
  </Admonition>

- A Neon project with a Postgres database to receive the replicated data. For information about creating a Neon project, see [Create a project](/docs/manage/projects#create-a-project).

## Prepare your AlloyDB source database

This section describes how to prepare your source AlloyDB Postgres instance (the publisher) for replicating data to Neon.

### Enable logical replication

The first step is to enable logical replication at the source Postgres instance. In AlloyDB, you can enable logical replication for your Postgres instance by setting the `alloydb.enable_pglogical` and `alloydb.logical_decoding` flags to `on`. This action will set the Postgres `wal_level` parameter to `logical`.

To enable these flags:

1. In the Google Cloud console, navigate to your [AlloyDB Clusters](https://console.cloud.google.com/alloydb/clusters) page.
2. From the **Actions** menu for your Primary instance, select **Edit**.
3. Scroll down to the **Advanced Configurations Options** > **Flags** section.
4. If these flags have not been set on the instance before, click **Add a Database Flag**, and set the value to `on` for the `alloydb.enable_pglogical` and `alloydb.logical_decoding` flags.
5. Click **Update instance** to save your changes.
6. Confirm your selections.

Afterward, you can verify that logical replication is enabled by running `SHOW wal_level;` from **AlloyDB Studio** or your terminal.

![show wal_level](/docs/guides/alloydb_show_wal_level.png)

### Allow connections from Neon

You need to allow connections to your AlloyDB Postgres instance from Neon. To do this in Google Cloud:

In the Google Cloud console, go to the AlloyDB Instances page.

1. To open the **Overview** page of your instance, click the instance name.
2. From the SQL navigation menu, select **Connections**.
3. Click the **Networking** tab.
4. Select the **Public IP** checkbox.
5. Click **Add network**.
6. Optionally, in the **Name** field, enter a name for this network.
7. In the **Network** field, enter the IP address from which you want to allow connections. You will need to perform this step for each of NAT gateway IP addresses associated with your Neon project's region. Neon uses 3 to 6 IP addresses per region for this outbound communication, corresponding to each availability zone in the region. See [NAT Gateway IP addresses](/docs/introduction/regions#nat-gateway-ip-addresses) for Neon's NAT gateway IP addresses by region.

   <Admonition type="note">
   AlloyDB requires that addresses are specified in CIDR notation. You can do so by appending `/32` to the NAT Gateway IP address; for example: `18.217.181.229/32`
   </Admonition>

   In the example shown below, you can see that three addresses were added, named `Neon1`, `Neon2`, and `Neon3`. You can name them whatever you like. The addresses were added in CIDR format by appending adding `/32`.

   ![AlloyDB network configuration](/docs/guides/cloud_sql_network_config.png)

8. Click **Done** after adding a Network entry.
9. Click **Save** when you are finished adding Network entries for all of your Neon project's NAT Gateway IP addresses.

<Admonition type="note">
You may specify a single Network entry using `0.0.0.0/0` to allow traffic from any IP address. However, this configuration is not considered secure and will trigger a warning.
</Admonition>

### Note your public IP address

Record the public IP address of your AlloyDB Postgres instance. You'll need this value later when you set up a subscription from your Neon database. You can find the public IP address on your AlloyDB instance's **Overview** page.

![Clould SQL public IP address](/docs/guides/cloud_sql_public_ip.png)

### Create a Postgres role for replication

It is recommended that you create a dedicated Postgres role for replicating data from your AlloyDB Postgres instance. The role must have the `REPLICATION` privilege. On your AlloyDB Postgres instance, login in as your `postgres` user or an administrative user you use to create roles and run the following command to create a replication role. You can replace the name `REPLICATION_USER` with whatever role name you want to use.

```sql shouldWrap
CREATE USER REPLICATION_USER WITH REPLICATION IN ROLE cloudsqlsuperuser LOGIN PASSWORD 'REPLICATION_USER_PASSWORD';
```

### Grant schema access to your Postgres role

If your replication role does not own the schemas and tables you are replicating from, make sure to grant access. For example, the following commands grant access to all tables in the `public` schema to a Postgres role named `REPLICATION_USER`:

```sql
GRANT USAGE ON SCHEMA public TO REPLICATION_USER;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO REPLICATION_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO REPLICATION_USER;
```

Granting `SELECT ON ALL TABLES IN SCHEMA` instead of naming the specific tables avoids having to add privileges later if you add tables to your publication.

### Create a publication on the source database

This step is performed on your AlloyDB instance.

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

## Prepare your Neon destination database

This section describes how to prepare your source Neon Postgres database (the subscriber) to receive replicated data from your AlloyDB Postgres instance.

### Prepare your database schema

When configuring logical replication in Postgres, the tables in the source database that you are replicating from must also exist in the destination database, and they must have the same table names and columns. You can create the tables manually in your destination database or use a utility like `pg_dump` to dump the schema from your source database.

If you're using the sample `playing_with_neon` table, you can create the same table on the destination database with the following statement:

```sql shouldWrap
CREATE TABLE IF NOT EXISTS playing_with_neon(id SERIAL PRIMARY KEY, name TEXT NOT NULL, value REAL);
```

### Create a subscription

After defining a publication on the source database, you need to define a subscription on your Neon destination database.

1. Create the subscription using the using a `CREATE SUBSCRIPTION` statement.

   ```sql
   CREATE SUBSCRIPTION my_subscription
   CONNECTION 'host=<primary-ip> port=5432 dbname=postgres user=replication_user password=replicapassword'
   PUBLICATION my_publication;
   ```

   - `subscription_name`: A name you chose for the subscription.
   - `connection_string`: The connection string for the source AlloyDB database, where you defined the publication. For the `<primary_ip>`, use the public IP address of your AlloyDB Postgres instance that you noted earlier, and specify the name and password of the replication role you created earlier. If you're replicating from a database other than `postgres`, be sure to specify that database name.
   - `publication_name`: The name of the publication you created on the source Neon database.

2. Verify the subscription was created by running the following command:

   ```sql
   SELECT * FROM pg_stat_subscription;
   ```

   The subscription (`my_subscription`) should be listed, confirming that your subscription has been successfully created.

## Test the replication

Testing your logical replication setup ensures that data is being replicated correctly from the publisher to the subscriber database. You can do this in three steps:

1. Run some data modifying queries on the source database (inserts, updates, or deletes).
2. On the source Postgres database in AlloyDB, check the current Write-Ahead Log (WAL) LSN:

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
   mysubscription | 0/7D213250   | 0/7D213250     | 2024-08-02 18:37:16.70939+00
   (1 rows)
   ```

4. As an extra check, you can also do a row count on the source and destination.

   ```sql
   select count(*) from my_db;

   count
   -------
   7585
   (1 row)
   ```

## Switch over your application

After the replication operation is complete, you can switch your application over to the destination database by swapping out your AlloyDB source database connection details for your Neon destination database connection details.

You can find your Neon connection details on the **Connection Details** widget in the Neon Console. For details, see [Connect from any application](/docs/connect/connect-from-any-app).
