---
title: 'Replicate data with DBConvert Streams'
subtitle: 'Set up Neon for use with DBConvert Streams for data migration and CDC'
enableTableOfContents: true
isDraft: false
updatedOn: '2025-04-16T14:49:37.564Z'
---

[DBConvert Streams](https://streams.dbconvert.com) is a data integration platform that specializes in real-time data synchronization and CDC (Change Data Capture) operations between various database systems. It enables you to replicate data from your Neon PostgreSQL database to other destinations while maintaining data consistency.

This guide demonstrates how to configure your Neon PostgreSQL database for connection with DBConvert Streams, including setting up logical replication and user permissions required for CDC operations.

## Prerequisites

- A [DBConvert Streams account](https://streams.dbconvert.com)
- A [DBConvert Streams deployed instance](https://streams.dbconvert.com/deploy)
- A [Neon account](https://console.neon.tech/)
- Read the [important notices about logical replication in Neon](/docs/guides/logical-replication-neon#important-notices) before you begin

## Prepare your source Neon database

This section describes how to prepare your source Neon database (the publisher) for replicating data to your destination Neon database (the subscriber).

### Enable logical replication in Neon

<Admonition type="important">
Enabling logical replication modifies the Postgres `wal_level` configuration parameter, changing it from `replica` to `logical` for all databases in your Neon project. Once the `wal_level` setting is changed to `logical`, it cannot be reverted. Enabling logical replication also restarts all computes in your Neon project, meaning active connections will be dropped and have to reconnect.
</Admonition>

To enable logical replication for CDC operations:

1. Select your project in the Neon Console
2. On the Neon **Dashboard**, select **Settings**
3. Select **Logical Replication**
4. Click **Enable** to enable logical replication

You can verify that logical replication is enabled by running the following query from the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor):

```sql
SHOW wal_level;
 wal_level
-----------
 logical
```


### Verify replication settings

After setting up, verify your replication configuration:

```sql
-- Check replication settings
SELECT name, setting 
FROM pg_settings 
WHERE name IN (
    'wal_level',
    'max_replication_slots',
    'max_wal_senders'
);
```

## Configure database users

For better security, create separate users for regular database operations and CDC operations.

### Create a regular database user

To create a regular database user with standard privileges:

<Tabs labels={["Console", "SQL"]}>

<TabItem>

To create a role in the Neon Console:

1. Navigate to the Neon Console
2. Select your project
3. Select **Branches**
4. Select the branch where you want to create the role
5. Select the **Roles & Databases** tab
6. Click **Add Role**
7. Specify a role name (e.g., `app_user`) 
8. Click **Create**

</TabItem>

<TabItem>

You can create a regular user and assign appropriate permissions with SQL:

```sql
-- Create regular user
CREATE USER app_user WITH PASSWORD 'strong_password';

-- Grant basic privileges
GRANT CONNECT ON DATABASE your_database TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_user;
```

</TabItem>

</Tabs>

### Create a CDC user for replication

For CDC operations, create a dedicated user with replication privileges:

<Tabs labels={["Console", "SQL"]}>

<TabItem>

To create a CDC role in the Neon Console:

1. Follow the same steps as above for creating a regular user
2. Name the role something meaningful like `cdc_user`

The default Postgres role created with your Neon project and roles created using the Neon Console are granted membership in the [neon_superuser](/docs/manage/roles#the-neonsuperuser-role) role, which has the required `REPLICATION` privilege.

</TabItem>

<TabItem>

Create a replication user with the necessary privileges:

```sql
-- Create replication user
CREATE USER cdc_user WITH REPLICATION PASSWORD 'strong_password';

-- Grant necessary privileges
GRANT CONNECT ON DATABASE your_database TO cdc_user;
GRANT USAGE ON SCHEMA public TO cdc_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO cdc_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
    GRANT SELECT ON TABLES TO cdc_user;
```

Verify the privileges are set correctly:

```sql
-- Check replication privilege
\du cdc_user

-- Check table permissions
\dp
```

</TabItem>

</Tabs>



## Connect DBConvert Streams to Neon

### Get your connection information

1. From your Neon Project Dashboard, click the **Connect** button
2. Copy the connection string provided

Connection string format:
```
postgres://user:password@endpoint.region.aws.neon.tech/dbname?sslmode=require
```

### Configure connection in DBConvert Streams

1. Open DBConvert Streams application
2. Create a new connection, selecting PostgreSQL as the database type
3. Enter the connection details from your Neon connection string:
   - **Host**: endpoint.region.aws.neon.tech
   - **Port**: 5432
   - **Database Name**: Your database name
   - **Username**: Your CDC user (e.g., `cdc_user`)
   - **Password**: Your CDC user's password
   - **SSL Mode**: require

<Admonition type="note">
Neon requires SSL connections. Make sure SSL mode is enabled in your connection configuration.
</Admonition>

### Configure CDC settings

When setting up a CDC pipeline in DBConvert Streams:

1. Select the Neon connection as your source
2. Select the tables you want to monitor for changes
3. Configure your destination connection and mappings

## Allow inbound traffic

If you are using Neon's **IP Allow** feature to limit IP addresses that can connect to Neon, you will need to allow inbound traffic from DBConvert Streams's IP addresses. You can find an IP address when deploying your instance of dbconvert streams in the cloud. For information about configuring allowed IPs in Neon, see [Configure IP Allow](/docs/manage/projects#configure-ip-allow).
## References

- [DBConvert Streams Documentation](https://docs.dbconvert.com)
- [Logical Replication in PostgreSQL](https://www.postgresql.org/docs/current/logical-replication.html)

<NeedHelp/> 