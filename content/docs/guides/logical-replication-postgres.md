---
title: Replicate data to an external Postgres instance
subtitle: Learn how to replicate data from Neon to an external Postgres instance
enableTableOfContents: true
isDraft: true
---

Neon's logical replication feature allows you to replicate data from Neon to external subscribers. This guide shows you how to stream data from a Neon Postgres database to an external Postgres database.

You will learn how to enable logical replication in Neon, create a publication, and configure an external Postgres database as a subscriber.

## Enable logical replication

<Admonition type="important">
Enabling logical replication modifies the PostgreSQL `wal_level` configuration parameter, changing it from `replica` to `logical` for all databases in your Neon project. Once the `wal_level` setting is changed to `logical`, it cannot be reverted.

Since logical replication requires more detailed logging to the Write-Ahead Log (WAL) for write transactions, it consumes additional storage.
</Admonition>

To enable logical replication in Neon:

1. Select your project in the Neon console.
2. On the Neon **Dashboard**, select **Settings**.
3. Select **Replication**.
4. Click **Enable**.

The new setting is applied the next time your compute restarts. By default, the compute that runs your Neon Postgres intance automatically suspends after five minutes of inactivity and restarts on the next access. To force an immediate restart, refer to [Restart a compute endpoint](/docs/manage/endpoints/).

You can verify that logical replication is enabled by running the following query from the the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor):

```sql
SHOW wal_level;
 wal_level 
-----------
 logical
```

After enabling logical replication, the next steps involve creating publications on your replication source database in Neon and configuring subscriptions on the destination system or service. These processes are the same as those you would perform for a standalone Postgresql environment. 

## Create a publication

Publications are a fundamental part of logical replication in Postgres. They allow you to specify a set of database changes that can be replicated to subscribers. This section walks you through creating a publication for a `users` table.

1. Create the `users` table in your Neon database. You can do this via the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or by connecting to your Neon database from an SQL client such as [psql](/docs/connect/query-with-psql-editor).

    ```sql
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) NOT NULL,
      email VARCHAR(100) NOT NULL
    );
    ```

2. To create a publication for the `users` table:

    ```sql
    CREATE PUBLICATION users_publication FOR TABLE users;
    ```

This command creates a publication named `users_publication`, which will include all changes to the `users` table in your replication stream.

<Admonition type="note">
In addition to creating a publication for a specific table, Postgres allows you to create a publication for all tables within your database by using `CREATE PUBLICATION all_tables_publication FOR ALL TABLES` syntax. This command is particularly useful when you need to replicate the entire database. Furthermore, PostgreSQL allows for fine-tuning your publications. For instance, you can create a publication for a subset of tables or configure publications to only replicate certain types of data changes, such as inserts, updates, or deletes. This level of customization ensures that your replication strategy aligns precisely with your data management and integration requirements.
</Admonition>

With your publication created, you're now ready to configure subscribers that will receive the data changes from this publication.

## Configure PostgreSQL as a subscriber

A subscriber is a destination that receives data changes from your publications. 

This section describes how to configure a subscription on a standalone Postgres instance to a publication defined on your Neon database. After the subscription is defined, the destination Postgres instance will be able to receive data changes from the publication defined on your Neon database.

It is assumed that you have a separate Postgres instance ready to act as the subscriber. This must be a Postgres instance other than Neon, such as a local PostgreSQL installation. Currently, a Neon database cannot be defined as a subscriber. The PostgreSQL version of the subscriber should be compatible with the publisher. The primary (publishing) server must be of the same or a higher version than the replica (subscribing) server. For example, you can replicate from PostgreSQL 14 to 16, but not from 16 to 14. Neon supports Postgres 14, 15, and 16. The Postgres version is defined when you create a Neon project.

### Configure the destination Postgres instance

If you haven't already, you'll need to configure your destination (subscriber) Postgres instance for logical replication, following these steps:

1. Modify `postgresql.conf`, which is typically located in the PostgreSQL data directory. Update the `postgresql.conf` file with the following configurations:

    - `wal_level`: Set the value to logical to enable logical decoding, which is essential for logical replication.

        ```ini
        wal_level = logical
        ```
    - `max_replication_slots`: Increase this to the number of subscriptions you intend to have, allowing for a dedicated slot for each replication connection. For example, if you plan to have 10 replication connections:

        ```ini
        max_replication_slots = 10
        ```

    - `max_wal_senders`: Set this to the number of concurrent WAL sender processes, which should accommodate all replication and backup processes.

        ```ini
        max_wal_senders = 10
        ```

2. Restart your Postgres instance to apply these configuration changes.
3. Configure `pg_hba.conf`, which is located in the same directory as `postgresql.conf`, to allow replication connections from your Neon database host:

    You can set the IP address to `0.0.0.0` to allow connections from any IP. However, this is not recommended for production environments due to security concerns.

    ```ini
    host replication <replication_username> 0.0.0.0/0 md5
    ```

    It's safer to specify the IP address of your publishing Neon database. You can use a tool like `nslookup` to find the IP address of your Neon host, which you can obtain from your Neon connection string. For example:

    ```bash
    nslookup ep-cool-darkness-123456.us-east-2.aws.neon.tech
    ```

    Then, update `pg_hba.conf` with that IP address:

    ```ini
    host replication <replication_username> 192.0.2.1/32 md5
    ```

    Apply the changes by reloading the PostgreSQL configuration:

    ```sql
    SELECT pg_reload_conf();
    ```

### Create the subscription

To create a subscription:

1. Use `psql` or another SQL client to connect to your subscriber Postgres database.
2. Create the subscription using the using a `CREATE SUBSCRIPTION` statement. This example creates a subscription for the `user` table publication (`users_publication`) that you created previously.

    ```sql
    CREATE SUBSCRIPTION users_subscription 
    CONNECTION 'postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname' 
    PUBLICATION users_publication;
    ```

    - `subscription_name`: A name you choose for the subscription.
    - `connection_string`: The connection string for your Neon database, where you defined the publication.
    - `publication_name`: The name of the publication you created on your Neon database.

3. Verify the subscription was created by running the following command: 

    ```sql
    SELECT * FROM pg_stat_subscription;
    ```

    The subscription (`users_subscription`) should be listed, confirming that your subscription has been successfully created.

## Test the replication

Testing your logical replication setup ensures that data is being replicated correctly from the publisher to the subscriber (from your Neon database to your standalone Postgres instance).

First, generate some changes in the `users` table on the publisher database to see if these changes are replicated to the subscriber:

1. Connect to your Neon database (the publisher) and perform an `INSERT` operation. For example:

    ```sql
    -- Insert a new user
    INSERT INTO users (username, email) VALUES ('new_user', 'new_user@example.com');
    ```

2. After making changes, query the `users` table on the publisher to confirm your `INSERT`:

    ```sql
    SELECT * FROM users;
    ```

    Note the changes you made for comparison with the subscriber's data.

3. Now, connect to your subscriber database on your standalone Postgres instance:

    ```bash
    psql -h [server_IP_or_hostname] -U [username] -d [database] -W
    ```

4. Query the `users` table:

    ```sql
    SELECT * FROM users;
    ```

  Compare the results with what you observed on the publisher.

4. On the subscriber, you can also check the status of the replication:

    ```sql
    SELECT * FROM pg_stat_subscription;
    ```

    Look for the `last_msg_receive_time` to confirm that the subscription is active and receiving data.

<NeedHelp/>