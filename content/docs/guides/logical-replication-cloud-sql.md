---
title: Replicate data from Cloud SQL Postgres
subtitle: Use logical replication to perform a near-zero downtime database migration from Google Cloud SQL to Neon
enableTableOfContents: true
isDraft: false
updatedOn: '2024-08-02T17:25:18.435Z'
---

Neon's logical replication feature allows you to replicate data from Google Cloud SQL to Neon. The steps described can be used for a near-zero downtime migration.

The setup described here follows the procedure outlined in [Set up native PostgreSQL logical replication](https://cloud.google.com/sql/docs/postgres/replication/configure-logical-replication#set-up-native-postgresql-logical-replication), in the Googl Cloud SQL documentation.

## Prerequisites

- A source database in Google Cloud SQL for PostgreSQL containing the data you want to replicate.
- A destination Neon project. For information about creating a Neon project, see [Create a project](/docs/manage/projects#create-a-project).

## Enable logical replication in the source Google Cloud SQL PostgreSQL instance

In Cloud SQL, you enable logical replication for your Postgres instance by setting the `cloudsql.logical_decoding` flag to `on`. This setting is different from the setting used in standard Postgres where you enable this feature by setting the `wal_level` configuration parameter to `logical`.

To enable this flag:

1. In the Google Cloud console, select the project that contains the Cloud SQL instance for which you want to set a database flag.
2. Open the instance and click **Edit**.
3. Scroll down to the **Flags** section.
4. To set a flag that has not been set on the instance before, click **Add item**, choose the flag from the drop-down menu, and set its value.
5. Click **Save** to save your changes.
6. Confirm your changes under **Flags** on the **Overview** page.

The change will require a restart:

![Clod SQL instance restart](/docs/guides/cloud_sql_restart.png)

Afterward, you can verify that logical replication is enable by running `SHOW wal_level;` from **Cloud SQL Studio** or your terminal.

![show wal_level](/docs/guides/cloud_sql_show_wal_level.png)

## Allow connection from your Neon project

You need to allow connections to your Google Cloud SQL Postgres instance from Neon. To do this in Google Cloud:

In the Google Cloud console, go to the Cloud SQL Instances page.

1. To open the **Overview** page of your instance, click the instance name.
2. From the SQL navigation menu, select **Connections**.
3. Click the **Networking** tab.
4. Select the **Public IP** checkbox.
5. Click **Add network**.
6. Optionally, in the **Name** field, enter a name for this network.
7. In the **Network** field, enter the IP address or address range from which you want to allow connections. Do this for each of your Neon project's NAT Gateway IP addresses.

   <Admonition type="note">
   Google Cloud SQL requires that addresses are specified in CIDR notation. You can do so by appending `/32` to each address; for example: `18.217.181.229/32`
   </Admonition>

   Neon uses 3 to 6 IP addresses per region for outbound communication (1 per availability zone + region). Create a rule to allow access to all of the IPs for your Neon project's region, as per the following table. If you do not know the region of your Neon project, you can find it in the **Project settings** widget on the **Project Dashboard**.

   | Region                                        | NAT Gateway IP Addresses                                                               |
   | --------------------------------------------- | -------------------------------------------------------------------------------------- |
   | US East (N. Virginia) — aws-us-east-1         | 23.23.0.232, 3.222.32.110, 35.168.244.148, 54.160.39.37, 54.205.208.153, 54.88.155.118 |
   | US East (Ohio) — aws-us-east-2                | 18.217.181.229, 3.129.145.179, 3.139.195.115                                           |
   | US West (Oregon) — aws-us-west-2              | 44.235.241.217, 52.32.22.241, 52.37.48.254, 54.213.57.47                               |
   | Europe (Frankfurt) — aws-eu-central-1         | 18.158.63.175, 3.125.234.79, 3.125.57.42                                               |
   | Asia Pacific (Singapore) — aws-ap-southeast-1 | 54.254.50.26, 54.254.92.70, 54.255.161.23                                              |
   | Asia Pacific (Sydney) — aws-ap-southeast-2    | 13.237.134.148, 13.55.152.144, 54.153.185.87                                           |

   ![Cloud SQL network configuration](/docs/guides/cloud_sql_network_config.png)

8. Click **Done** after adding each Network entry.
9. Click **Save** when you are finished adding entries all of your Neon project's NAT Gateway IP addresses.

### Record the public IP address and public outgoing IP address of the primary instance

Record the public IP address of your Google Cloud SQL Postgres instance. You can this value on the instance's **Overview** page.

![Clould SQL public IP adrress](/docs/guides/cloud_sql_public_ip.png)

You'll nee this value later when you set up a subscription from your Neon database.

## Create a Postgres role for replication

It is recommended that you create a dedicated Postgres role for replicating data from your Google Cloud SQL Postgres instance. The role must have the `REPLICATION` privilege. On your Google Cloud SQL Postgres instance, run the following command to create your replication role:

```sql
CREATE USER REPLICATION_USER WITH REPLICATION IN ROLE cloudsqlsuperuser LOGIN PASSWORD 'REPLICATION_USER_PASSWORD';
```

## Grant schema access to your Postgres role

If your replication role does not own the schemas and tables you are replicating from, make sure to grant access. For example, the following commands grant access to all tables in the `public` schema to Postgres role `REPLICATION_USER`:

```sql
GRANT USAGE ON SCHEMA public TO REPLICATION_USER;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO REPLICATION_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO REPLICATION_USER;
```

Granting `SELECT ON ALL TABLES IN SCHEMA` instead of naming the specific tables avoids having to add privileges later if you add tables to your publication.

## Create a subscription

After defining a publication on the source database, you need to define a subscription on your Neon destination database.

1. Create the subscription using the using a `CREATE SUBSCRIPTION` statement.

   ```sql
   CREATE SUBSCRIPTION my_subscription
   CONNECTION 'host=<primary-ip> port=5432 dbname=postgres user=replication_user password=replicapassword'
   PUBLICATION my_publication;
   ```

   - `subscription_name`: A name you chose for the subscription.
   - `connection_string`: The connection string for the source Neon database, where you defined the publication. For the primary_ip, use the public IP address of your Google Cloud SQL POstgres instance, and specify the name and password of the replication role you created earlier.
   - `publication_name`: The name of the publication you created on the source Neon database.

2. Verify the subscription was created by running the following command:

   ```sql
   SELECT * FROM pg_stat_subscription;
   ```

   The subscription (`my_subscription`) should be listed, confirming that your subscription has been successfully created.

## Test the replication

Testing your logical replication setup ensures that data is being replicated correctly from the publisher to the subscriber database. You can do this in three steps:

1. Run some data modifying queries on the source database (inserts, updates, or deletes).
2. On the source Postgres database in Google Cloud SQL, check the current Write-Ahead Log (WAL) LSN:

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
