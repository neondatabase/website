---
title: Create an automatic audit trail with Bemi
subtitle: Learn how to create an automatic audit trail for your Postgres database with Bemi
enableTableOfContents: true
isDraft: false
---

<LRNotice/>

[Bemi](https://bemi.io/) is an open-source solution that plugs into PostgreSQL and ORMs to track database changes automatically. It unlocks robust context-aware audit trails and time travel querying inside your application.

Designed with simplicity and non-invasiveness in mind, Bemi doesn't require any alterations to your existing database structure. It operates in the background, empowering you with data change tracking features.

In this guide, we'll show you how to connect your Neon database to Bemi to create an automatic audit trail.

## Prerequisites

- A [Bemi account](https://bemi.io/)
- A [Neon account](https://console.neon.tech/)

## Enable logical replication in Neon

<Admonition type="important">
Enabling logical replication modifies the Postgres `wal_level` configuration parameter, changing it from replica to logical for all databases in your Neon project. Once the `wal_level` setting is changed to logical, it cannot be reverted. Enabling logical replication also restarts all computes in your Neon project, meaning active connections will be dropped and have to reconnect.
</Admonition>

To enable logical replication in Neon:

1. Select your project in the Neon Console.
2. On the Neon **Dashboard**, select **Project settings**.
3. Select **Beta**.
4. Click **Enable** to enable logical replication.

You can verify that logical replication is enabled by running the following query from the [Neon SQL Editor](https://neon.tech/docs/get-started-with-neon/query-with-neon-sql-editor):

```sql
SHOW wal_level;
wal_level
-----------
logical
```

## Connect your Neon database to Bemi

The following instructions assume that you are using a Postgres role created via the Neon Console, API, or CLI. These roles are automatically granted `neon_superuser` group automatically granted the required REPLICATION privilege.

1. Create a [new database connection](https://dashboard.bemi.io/databases/source/new) by entering the connection details for your Neon database. You can get these details from your Neon connection string, which you'll find in the **Connection Details** widget on the **Dashboard** of your Neon project. For example, given a connection string like this:

    ```sql
    postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
    ```

    Enter the details in the **Connect PostgreSQL Database** dialog as shown below. Your values will differ.

    - **Host**: ep-cool-darkness-123456.us-east-2.aws.neon.tech
    - **Port**: 5432
    - **Database Name**: dbname
    - **Username**: alex
    - **Password**: AbC123dEf

    ![Bemi Connect PostgreSQL Database](/docs/guides/bemi_connect_postgres.png)

2. During the connection setup, or any time after, you can configure the tables you want to track changes for:

    ![Bemi Tracked Tables](/docs/guides/bemi_tracked_tables.png)

3. Please wait a few minutes while Bemi provisions the infrastructure. Once this succeeds, you’ve successfully configured a Bemi Postgres source for your Neon database.

## Use a read-only Postgres role for Bemi

Alternatively, you can manually create read-only PostgreSQL database credentials to connect to your Neon database. To do so requires running the following commands, which are safe to execute without any downtime or performance issues:

- `CREATE ROLE`: Creates a new read-only user for Bemi to read database changes.
- `CREATE PUBLICATION`: creates a "channel" that we'll subscribe to and track changes in real-time.
- `REPLICA IDENTITY FULL`: enhances records stored in WAL to record the previous state (“before”) in addition to the tracked by default new state (“after”).

```sql
-- Create read-only user with REPLICATION permission
CREATE ROLE [username] WITH LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE REPLICATION PASSWORD '[password]';
-- Grant SELECT access to tables for selective tracking
GRANT SELECT ON ALL TABLES IN SCHEMA public TO [username];
-- Grant SELECT access to new tables created in the future for selective tracking
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO [username];

-- Create "bemi" PUBLICATION to enable logical replication
CREATE PUBLICATION bemi FOR ALL TABLES;

-- Create a procedure to set REPLICA IDENTITY FULL for tables to track the "before" state on DB row changes
CREATE OR REPLACE PROCEDURE _bemi_set_replica_identity() AS $$ DECLARE current_tablename TEXT;
BEGIN
  FOR current_tablename IN SELECT tablename FROM pg_tables LEFT JOIN pg_class ON relname = tablename WHERE schemaname = 'public' AND relreplident != 'f' LOOP
    EXECUTE format('ALTER TABLE %I REPLICA IDENTITY FULL', current_tablename);
  END LOOP;
END $$ LANGUAGE plpgsql;
-- Call the created procedure
CALL _bemi_set_replica_identity();
```

<Admonition type="note">
After creating a read-only role, you can find the connection details for this role in the **Connection Details** widget in the Neon console.
</Admonition>

## Allow inbound traffic

If you’re using Neon's IP Allow feature to limit IP addresses that can connect to Neon, you will need to allow inbound traffic from Bemi. [Contact Bemi](mailto:hi@bemi.io) to get the static IPs that need to be allowlisted. For information about configuring allowed IPs in Neon, see [Configure IP Allow](/docs/manage/projects#configure-ip-allow).

 ## **References**

- [The ultimate guide to PostgreSQL data change tracking](https://blog.bemi.io/the-ultimate-guide-to-postgresql-data-change-tracking/)
- [Logical replication - PostgreSQL documentation](https://www.postgresql.org/docs/current/logical-replication.html)
- [Publications - PostgreSQL documentation](https://www.postgresql.org/docs/current/logical-replication-publication.html)
