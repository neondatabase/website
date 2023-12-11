---
title: Replicate data with Airbyte
subtitle: Learn how to replicate data from Neon with Airbyte
enableTableOfContents: true
isDraft: true
---

In this guide, you will learn how to enable logical replication in Neon, create a publication, and configure an external Postgres database as a subscriber to recieve replicated data.

## Enable logical replication

Neon's logical replication feature, which is currently in **Beta**, allows for replication of data to external subscribers. These subscribers might include an external Postgres database, platforms for operational data warehousing, analytical database services, real-time stream processing systems, messaging and event-streaming technologies, change data capture (CDC) ecosystems, data pipeline orchestrators, among others.

<Admonition type="important">
Enabling logical replication permanently modifies the PostgreSQL `wal_level` configuration parameter, changing it from `replica` to `logical` for all databases in your Neon project. This change increases the amount of data written to the WAL (Write-Ahead Logging), which will increase your storage consumption. It's important to note that once the `wal_level` setting is changed to `logical`, it cannot be reverted.
</Admonition>

To enable the logical replication for your Neon project:

1. Select your project in the Neon console.
2. On the Neon **Dashboard**, select **Settings**.
3. Select **Replication**.
4. Click **Enable**.

After enabling logical replication, the next steps involve creating publications on your replication source database in Neon and configuring subscriptions on the destination system or service. These processes are the same as those you would perform for a standalone Postgresql environment. 

## Create a publication

Publications in PostgreSQL are a fundamental part of logical replication. They allow you to specify a set of database changes that can be replicated to subscribers. For Neon users, setting up a publication is an essential step towards synchronizing data with other systems. This section walks you through creating a publication for a `users` table.

1. Create the `users` table in your Neon database. You can do this via the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or by connecting to your Neon database from an SQL client such as [psql](/docs/connect/query-with-psql-editor).

    ```sql
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) NOT NULL,
      email VARCHAR(100) NOT NULL
    );
    ```

2. To create a publication for the `users` table.

    ```sql
    CREATE PUBLICATION users_publication FOR TABLE users;
    ```

This command creates a publication named `users_publication` which will include all changes to the `users` table in your replication stream.

<Admonition type="note">
In addition to creating a publication for a specific table, Postgres allows you to create a publication for all tables within your database by using `CREATE PUBLICATION all_tables_publication FOR ALL TABLES` syntax. This command is particularly useful when you need to replicate the entire database. Furthermore, PostgreSQL allows for fine-tuning your publications. For instance, you can create a publication for a subset of tables or configure publications to only replicate certain types of data changes, such as inserts, updates, or deletes. This level of customization ensures that your replication strategy aligns precisely with your data management and integration requirements.
</Admonition>

With your publication created, you're now ready to configure subscribers that will receive the data changes from this publication.

## Configure PotgreSQL as a subscriber

A subscriber is a destination that receive data changes from your publications. 

Subscribers can range from external Postgres instances to a variety of data services and platforms, each serving different roles within your data infrastructure.

This section describes how to configure a subscription on a standalone Postgres instance to a publication on defined on your Neon database. After the subscription is defined, the destination Postgres instance will able to receive data changes from the publication defined on your Neon database.

### Prerequisites

- You have created a publication on your Neon database, as described in [Create a publication](#create-a-publication).
- A separate Postgres instance ready to act as the subscriber. This must be a Postgres instance other than Neon, such as a local PostgreSQL installation. Currently, a Neon database cannot be defined as a subscriber.
- The PostgreSQL version of the subscriber should be compatible with the publisher. The primary (publishing) server must be of the same or a higher version than the replica (subscribing) server. For example, you can replicate from PostgreSQL 14 to 16, but not from 16 to 14. Neon supports Postgres 14, 15, and 16. The Postgres version is deifned when you create a Neon project.

### Configure the destination Postgres instance for replication

If you have not already, you'll need to configure your destination (subscriber) Postgres instance for logical replication, following these steps:

1. Modify `postgresql.conf`, which is typically located in the PostgreSQL data directory. Update the `postgresql.conf` file with the following configurations:

  - `wal_level`: Set the value to logical to enable logical decoding, which is essential for logical replication.

      ```ini
      wal_level = logical
      ```
  - `max_replication_slots`: Increase this to the number of subscriptions you intend to have, allowing for a dedicated slot for each replication connection. For exmaple, if you plan to have 10 replication connections:

      ```ini
      max_replication_slots = 10
      ```

  - `max_wal_senders`: Set this to the number of concurrent WAL sender processes, which should accommodate all replication and backup processes.

      ```ini
      max_wal_senders = 10
      ```

2. Restart your Postgres instance to apply these configuration changes. How to restart may differ based on your environment and how you installed Postgres.

    <Tabs labels={["Systemd", "Windows", "MacOS", "Docker", "Binary"]}>

    <TabItem>

    ```bash
    sudo systemctl restart postgresql
    ```
    </TabItem>

    <TabItem>

    ```bash
    net stop postgresql-x64-<version> && net start postgresql-x64-<version>
    # Replace <version> with your installed PostgreSQL version
    ```
    </TabItem>

    <TabItem>

    ```bash
    brew services restart postgresql
    ```
    </TabItem>

    <TabItem>

    ```bash
    docker restart <container_name>
    # Replace <container_name> with the name or ID of your PostgreSQL Docker container
    ```
    </TabItem>

    <TabItem>

    ```bash
    pg_ctl restart -D /path/to/data/directory
    # Replace /path/to/data/directory with your Postgres data directory path
    ```

    </TabItem>

    </Tabs>

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

1. Use `psql` or another SQL client to connect to your subscriber Postgres database (a Postgres instance other than Neon).
2. Create the subscription using the using a `CREATE SUBSCRIPTION` statement. This example creates a subscription for the `user` table publication (`users_publication`) that you created previously, in [Create a publication](#create-a-publications).

    ```sql
    CREATE SUBSCRIPTION users_subscription 
    CONNECTION 'postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname' 
    PUBLICATION users_publication;
    ```

    - `subscription_name`: A name you choose for the subscription.
    - `connection_string`: The connection string for connecting to your Neon database, where you defined the publication.
    - `publication_name`: The name of the publication you created on your Neon database.

3. Verify the subscription was created by running the following command: 

    ```sql
    SELECT * FROM pg_stat_subscription;
    ```

    The subscription (`users_subscription`) should be listed, confirming that that your subscription has been successfully created.

### Test the replication

Testing your logical replication setup ensures that the data is being replicated correctly from the publisher to the subscriber; in this case, from your Neon database to your standalone Postgres instance.

First, you need to generate some changes in the users table on the publisher database to see if these changes are replicated to the subscriber. To do so:

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

