---
title: Logical replication in Neon
subtitle: Learn how to manage logical replication in Neon
enableTableOfContents: true
isDraft: true
---

This topic outlines how to manage your logical replication setup in Neon. It includes information specific to logical replication in Neon and known limitations.

<Admonition type="note">
Logical replication in Neon is currently in Beta. We welcome your feedback to help improve this feature. You can provide feedback via the **Feedback** link inthe Neon Console or by reaching out to us on [Discord](https://t.co/kORvEuCUpJ).
</Admonition>

- In standalone PostgreSQL, logical replication is enabled by setting `wal_level=logical` in the  `postgresql.conf` configuration file and restarting Postgres. In Neon, logical replication is enabled from the console, by following these steps:

    1. Select your project in the Neon console.
    2. On the Neon **Dashboard**, select **Settings**.
    3. Select **Replication**.
    4. Click **Enable**.

    The new setting is applied the next time your compute restarts. By default, the compute that runs your Neon Postgres instance automatically suspends after five minutes of inactivity and restarts on the next access. To force an immediate restart, refer to [Restart a compute endpoint](/docs/manage/endpoints/).

    You can verify that logical replication is enabled by running the following query:

    ```sql
    SHOW wal_level;
    wal_level 
    -----------
    logical
    ```

    Once you enable logical replication in Neon, the setting cannot be reverted.

- The role you use to connect from the subscriber to the publisher in a subscription requires the `REPLICATION` privilege. Currently, only the default Postgres role created with your Neon project has this privilege, and it cannot be granted to other roles. This is the role that is named for the email, Google, GitHub, or partner account you signed up with. For example, if you signed up as `alex@example.com`, you should have a default Postgres role named `alex`. You can verify that your role has this privilege by running the following query: 

    ```sql
    SELECT rolname, rolreplication 
    FROM pg_roles 
    WHERE rolname = '<role_name>';
    ```

- If you use Neon's **IP Allow** feature to limit IP addresses that can connect to Neon, you will need to determine the IP address or addresses of the subscriber and add those IPs to your **IP Allow** list, which you can find in your Neon project's settings. For instructions, see [Configure IP Allow](/docs/manage/projects#configure-ip-allow).
- Neon supports both `pgoutput` and `wal2json` replication output plugins for logical decoding.

    - `pgoutput`: This is the default logical replication output plugin for Postgres. Specifically, it's part of the Postgres built-in logical replication system, designed to read changes from the database's write-ahead log (WAL) and output them in a format suitable for logical replication. 
    - `wal2json`: This is also a logical replication output plugin for Postgres, but it differs from `pgoutput` in that it converts WAL data into `JSON` format. This makes it useful for integrating Postgres with systems and applications that work with `JSON` data. For usage information, see [wal2json](https://github.com/eulerto/wal2json).
- Some data services and platforms require dedicated replication slots. You can create a dedicated replication slot using the standrad PostgreSQL syntax. As mentioned above, Neon supports both `pgoutput` and `wal2json` replication output decoder plugins.

    ```sql
    SELECT pg_create_logical_replication_slot('my_replication_slot', 'pgoutput');
    ```

    ```sql
    SELECT pg_create_logical_replication_slot('my_replication_slot', 'wal2json');
    ```

- The `max_wal_senders` and `max_replication_slots` configuration parameter settings on Neon are set to `10`.

    ```ini
    max_wal_senders = 10
    max_replication_slots = 10
    ```

    - The `max_wal_senders` parameter defines the maximum number of concurrent WAL sender processes which are responsible for streaming WAL data to subscribers. In most cases, you should have one WAL sender process for each subscriber or replication slot to ensure efficient and consistent data replication. 
    - The `max_replication_slots` defines the maximum number of replication slots which are used to manage database replication connections. Each replication slot tracks changes in the publisher database to ensure that the connected subscriber stays up to date. You'll want a replication slot for each replication connection. For example, if you expect to have 10 separate subscribers replicating from your database, you would set `max_replication_slots` to 10 to accommodate each connection.

    If you require different values for these paramters, please contact Neon support.

## Limitations

Neon is working toward removing the following limitations in a future release:

- A Neon database can only act as a publisher in a replication setup. Creating a subscription on a Neon database is not permitted. You can only create publications on a Neon database. This means that you cannot replicate data from one Neon database to another or from one Neon project to another.
- Only your default Neon Postgres role has the `REPLICATION` privilege. This privilege cannot be granted to other roles. You can expect this limitation to be lifted in a future release.
- You cannot use `CREATE PUBLICATION my_publication FOR ALL TABLES;` syntax in Neon. Specifying `ALL TABLES` requires the Postgres `superuser` privilege, which is not available on Neon. Instead, you can specify multiple tables using `CREATE PUBLICATION my_pub FOR TABLE <table1>, <table2>;` syntax.

<NeedHelp/>
