---
title: Replicate data from Cloud SQL Postgres
subtitle: Learn how to replicate data from Google Cloud SQL Postgres to Neon
enableTableOfContents: true
isDraft: false
updatedOn: '2024-08-22T02:18:02.648Z'
---

<LRBeta/>

This guide describes how to replicate data from Cloud SQL Postgres using native Postgres logical replication, as described in [Set up native PostgreSQL logical replication](https://cloud.google.com/sql/docs/postgres/replication/configure-logical-replication#set-up-native-postgresql-logical-replication), in the Google Cloud SQL documentation.

## Prerequisites

- A Cloud SQL Postgres instance containing the data you want to replicate. If you're just testing this out and need some data to play with, you can use the following statements to create a table with sample data. Your database and schema may differ.

  ```sql shouldWrap
  CREATE TABLE IF NOT EXISTS playing_with_neon(id SERIAL PRIMARY KEY, name TEXT NOT NULL, value REAL);
  INSERT INTO playing_with_neon(name, value)
  SELECT LEFT(md5(i::TEXT), 10), random() FROM generate_series(1, 10) s(i);
  ```

- A Neon project with a Postgres database to receive the replicated data. For information about creating a Neon project, see [Create a project](/docs/manage/projects#create-a-project).
- Read the [important notices about logical replication in Neon](/docs/guides/logical-replication-neon#important-notices) before you begin.

## Prepare your Cloud SQL source database

This section describes how to prepare your source Cloud SQL Postgres instance (the publisher) for replicating data to Neon.

### Enable logical replication

The first step is to enable logical replication at the source Postgres instance. In Cloud SQL, you can enable logical replication for your Postgres instance by setting the `cloudsql.logical_decoding` flag to `on`. This action will set the Postgres `wal_level` parameter to `logical`.

To enable this flag:

1. In the Google Cloud console, select the project that contains the Cloud SQL instance for which you want to set a database flag.
2. Open the instance and click **Edit**.
3. Scroll down to the **Flags** section.
4. If this flag has not been set on the instance before, click **Add item**, choose the flag from the drop-down menu, and set its value to `On`.
5. Click **Save** to save your changes.
6. Confirm your changes under **Flags** on the **Overview** page.

The change requires restarting the instance:

![Clod SQL instance restart](/docs/guides/cloud_sql_restart.png)

Afterward, you can verify that logical replication is enabled by running `SHOW wal_level;` from **Cloud SQL Studio** or your terminal.

![show wal_level](/docs/guides/cloud_sql_show_wal_level.png)

### Allow connections from Neon

You need to allow connections to your Cloud SQL Postgres instance from Neon. To do this in Google Cloud:

1. In the Google Cloud console, go to the Cloud SQL Instances page.
1. Open the **Overview** page of your instance by clicking the instance name.
1. From the SQL navigation menu, select **Connections**.
1. Click the **Networking** tab.
1. Select the **Public IP** checkbox.
1. Click **Add network**.
1. Optionally, in the **Name** field, enter a name for this network.
1. In the **Network** field, enter the IP address from which you want to allow connections. You will need to perform this step for each of the NAT gateway IP addresses associated with your Neon project's region. Neon uses 3 to 6 IP addresses per region for this outbound communication, corresponding to each availability zone in the region. See [NAT Gateway IP addresses](/docs/introduction/regions#nat-gateway-ip-addresses) for Neon's NAT gateway IP addresses.

   <Admonition type="note">
   Cloud SQL requires addresses to be specified in CIDR notation. You can do so by appending `/32` to the NAT Gateway IP address; for example: `18.217.181.229/32`
   </Admonition>

   In the example shown below, you can see that three addresses were added, named `Neon1`, `Neon2`, and `Neon3`. You can name them whatever you like. The addresses were added in CIDR format by adding `/32`.

   ![Cloud SQL network configuration](/docs/guides/cloud_sql_network_config.png)

1. Click **Done** after adding a Network entry.
1. Click **Save** when you are finished adding Network entries for all of your Neon project's NAT Gateway IP addresses.

<Admonition type="note">
You can specify a single Network entry using `0.0.0.0/0` to allow traffic from any IP address. However, this configuration is not considered secure and will trigger a warning.
</Admonition>

### Note your public IP address

Record the public IP address of your Cloud SQL Postgres instance. You'll need this value later when you set up a subscription from your Neon database. You can find the public IP address on your Cloud SQL instance's **Overview** page.

<Admonition type="note">
If you do not use a public IP address, you'll need to configure access via a private IP. Refer to the [Cloud SQL documentation](https://cloud.google.com/sql/docs/mysql/private-ip).
</Admonition>

![Clould SQL public IP address](/docs/guides/cloud_sql_public_ip.png)

### Create a Postgres role for replication

It is recommended that you create a dedicated Postgres role for replicating data from your Cloud SQL Postgres instance. The role must have the `REPLICATION` privilege. On your Cloud SQL Postgres instance, login in as your `postgres` user or an administrative user you use to create roles and run the following command to create a replication role. You can replace the name `replication_user` with whatever role name you want to use.

```sql shouldWrap
CREATE USER replication_user WITH REPLICATION IN ROLE cloudsqlsuperuser LOGIN PASSWORD 'replication_user_password';
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

This step is performed on your Cloud SQL instance.

Publications are a fundamental part of logical replication in Postgres. They define what will be replicated.
To create a publication for all tables in your source database:

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

## Prepare your Neon destination database

This section describes how to prepare your source Neon Postgres database (the subscriber) to receive replicated data from your Cloud SQL Postgres instance.

### Prepare your database schema

When configuring logical replication in Postgres, the tables in the source database you are replicating from must also exist in the destination database, and they must have the same table names and columns. You can create the tables manually in your destination database or use utilities like `pg_dump` and `pg_restore` to dump the schema from your source database and load it to your destination database. See [Import a database schema](/docs/import/import-schema-only) for instructions.

If you're using the sample `playing_with_neon` table, you can create the same table on the destination database with the following statement:

```sql shouldWrap
CREATE TABLE IF NOT EXISTS playing_with_neon(id SERIAL PRIMARY KEY, name TEXT NOT NULL, value REAL);
```

### Create a subscription

After creating a publication on the source database, you need to create a subscription on your Neon destination database.

1. Create the subscription using the using a `CREATE SUBSCRIPTION` statement.

   ```sql
   CREATE SUBSCRIPTION my_subscription
   CONNECTION 'host=<primary-ip> port=5432 dbname=postgres user=replication_user password=replication_user_password'
   PUBLICATION my_publication;
   ```

   - `subscription_name`: A name you chose for the subscription.
   - `connection_string`: The connection string for the source Cloud SQL database where you defined the publication. For the `<primary_ip>`, use the IP address of your Cloud SQL Postgres instance that you noted earlier, and specify the name and password of your replication role. If you're replicating from a database other than `postgres`, be sure to specify that database name.
   - `publication_name`: The name of the publication you created on the source Neon database.

2. Verify the subscription was created by running the following command:

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

After the replication operation is complete, you can switch your application over to the destination database by swapping out your Cloud SQL source database connection details for your Neon destination database connection details.

You can find your Neon connection details on the **Connection Details** widget in the Neon Console. For details, see [Connect from any application](/docs/connect/connect-from-any-app).
