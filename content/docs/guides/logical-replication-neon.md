---
title: Manage logical replication in Neon
subtitle: Learn how to manage logical replication in Neon
enableTableOfContents: true
isDraft: true
---

This topic outlines how to manage your logical replication setup in Neon. It includes commands for managing publications, subscriptions, and replication slots. It also provides information about logical replication specific to Neon, including [known limitations](#known-limitations).

<Admonition type="note">
Logical replication in Neon is currently in Beta. We welcome your feedback to help improve this feature. You can provide feedback via the **Feedback** link inthe Neon Console or by reaching out to us on [Discord](https://t.co/kORvEuCUpJ).
</Admonition>

## Manage publications

This section outlines how to manage publications in your replication setup.

### Create a publication

This command creates a publication named `my_publication` that will track changes made to the `users` table.

```sql
CREATE PUBLICATION my_publication FOR TABLE users;
```

This command creates a publication that publishes all changes in two tables:

```sql
CREATE PUBLICATION my_publication FOR TABLE users, departments;
```
<Admonition type="note">
Neon currently does not support creating publications using `CREATE PUBLICATION publication_name FOR ALL TABLES` syntax. The `ALL TABLES` clause requires the PostgreSQL superuser privilege, which is not available in a managed service like Neon.
</Admonition>

This command creates a publication that only publishes `INSERT` and `UPDATE` operations. In this case, all data will be published to a subscriber without any data being deleted. To replicate delete operations, add `delete` to the list of operations.

```sql
CREATE PUBLICATION my_publication FOR TABLE users
    WITH (publish = 'insert,update');
```

### Add a table to a publication

This command adds a publication to an existing table:

```sql
ALTER my_publication ADD TABLE sales;
```

### Remove a table from a publication

```sql
ALTER PUBLICATION my_publication DROP TABLE sales;
```

### Remove a publication

This command removes a publication:

```sql
DROP PUBLICATION IF EXISTS my_publication;
```

### Recreate a publication

This command recreates a publication within a single transaction:

```sql
BEGIN;
  -- remove the publication
  DROP PUBLICATION IF EXISTS my_publication;

  -- re-create the publication
  CREATE PUBLICATION my_publication;
COMMIT;
```

## Manage subscriptions

This section outlines how to manage subscriptions in your replication setup.

Sometimes, you may need to modify or remove a subscription.

<Admonition type="note">
Currently, you cannot create subscriptions on a Neon database. Neon can only act as a subscriber in a publisher in a replication setup. The following commands would only be run on an external Postgres database that you are using as a subscriber.
</Admonition>

### Create a subscription

You can create a subscription using [CREATE SUBSCRIPTION](https://www.postgresql.org/docs/current/sql-createsubscription.html) syntax. Building on the `my_publication` example above, here’s how you can create a subscription:

```sql
CREATE SUBSCRIPTION my_subscription 
CONNECTION 'postgres://username:password@host:port/dbname' 
PUBLICATION my_publication;
```

A subscription requires a unique name, a database connection string, the name and password of your replication role, and the name of the publication that it is subscribing to.

In the example above, `my_subscription` is the subscription that connects to a publication named `my_publication`. When using a Neon database as the publisher, you can replace the connection details with your Neon database connection string.

### Create a subscription with two publications

```sql
CREATE SUBSCRIPTION my_subscription 
CONNECTION 'postgres://username:password@host:port/dbname' 
PUBLICATION my_publication, sales_publication;
```

A single subscriber can maintain multiple subscriptions, including multiple subscriptions to the same publisher. 

### Create a subscription to be enabled later

```sql
CREATE SUBSCRIPTION my_subscription 
CONNECTION 'postgres://username:password@host:port/dbname' 
PUBLICATION my_publication
WITH (enabled = false);
```

### Change the publication subscribed to

```sql
ALTER SUBSCRIPTION my_subscription SET PUBLICATION new_new_subscription;
```

### Change the subscription connection

```sql
ALTER SUBSCRIPTION subscription_name CONNECTION 'new_connection_string';
```

### Disable a subscription

```sql
ALTER SUBSCRIPTION my_subscription DISABLE;
```

### Drop a subscription

```sql
DROP SUBSCRIPTION my_subscription;
```

## Manage replication slots

Replication slots are created on the publisher database track replication progress, ensuring that no data in the WAL is purged before the subscriber has successfully replicated it. This mechanism serves to maintain data consistency and prevent data loss in cases of network interruption or subscriber downtime.

### Create a replication slot

Replication slots are typically created automatically with new subscriptions, but they can be created manually using the `pg_create_logical_replication_slot` function. Some "subscriber" data services and platforms require that you create a dedicated replication slot. This is accomplished using the following syntax:

```sql
SELECT pg_create_logical_replication_slot('my_replication_slot', 'pgoutput');
```

The first value, `my_replication_slot` is the name given to the replication slot. The second value is the [decoder plugin](#decoder-plugins) the slot should use.

The `max_replication_slots` configuration parameter defines the maximum number of replication slots that can be used to manage database replication connections. Each replication slot tracks changes in the publisher database to ensure that the connected subscriber stays up to date. You'll want a replication slot for each replication connection. For example, if you expect to have 10 separate subscribers replicating from your database, you would set `max_replication_slots` to 10 to accommodate each connection.

The `max_replication_slots` configuration parameter on Neon is set to `10` by default.

```ini
max_replication_slots = 10
```

### remove a replication slot

To drop a logical replication slot, you can use the `pg_drop_replication_slot()` function. If you've already created a replication slot named `my_replication_slot` using `pg_create_logical_replication_slot()`, you can drop it by executing the following SQL command:

```sql
SELECT pg_drop_replication_slot('my_replication_slot');
```

This command removes the specified replication slot (`my_replication_slot` in this case) from your database. It's important to ensure that the replication slot is no longer in use or required before dropping it, as this action is irreversible and could affect replication processes relying on this slot.

## Monitoring replication

To ensure that your logical replication setup is running as expected, you should monitor replication processes regularly. Postgres provides several ways to monitor replication status. One of the most useful is the [pg_stat_replication](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-REPLICATION-VIEW) view, which displays information about each active replication connection to the publisher.

```sql
SELECT * FROM pg_stat_replication;
```
This view provides details like the state of the replication, the last received WAL location, sent location, write location, and the delay between the publisher and subscriber.

Additionally, the [pg_replication_slots](https://www.postgresql.org/docs/current/view-pg-replication-slots.html) view shows information about the current replication slots on the publisher, including their size.

```sql
SELECT * FROM pg_replication_slots;
```

It's important to keep an eye on replication lag, which indicates how far behind the subscriber is from the publisher. A significant replication lag could mean that the subscriber isn't receiving updates in a timely manner, which could lead to data inconsistencies.

## Neon specifics

This section outlines information about logical replication specific to Neon, including known limitations.

### Enabling logical replication in Neon

<Admonition type="important">
Once you enable logical replication in Neon, the setting cannot be reverted. Enabling logical replication also restarts all computes in your Neon project, which means that active connections will be dropped and have to reconnect.
</Admonition>

In standalone PostgreSQL, logical replication is enabled by setting `wal_level=logical` in the  `postgresql.conf` configuration file and restarting Postgres. In Neon, logical replication is enabled from the console, by following these steps:

1. Select your project in the Neon console.
2. On the Neon **Dashboard**, select **Settings**.
3. Select **Replication**.
4. Click **Enable**.

You can verify that logical replication is enabled by running the following query:

```sql
SHOW wal_level;
wal_level 
-----------
logical
```

### Replication roles

The role you use to connect from the subscriber to the publisher in a subscription requires the `REPLICATION` privilege. Currently, only the default Postgres role created with your Neon project has this privilege, and it cannot be granted to other roles. This is the role that is named for the email, Google, GitHub, or partner account you signed up with. For example, if you signed up as `alex@example.com`, you should have a default Postgres role named `alex`. You can verify that your role has this privilege by running the following query: 

```sql
SELECT rolname, rolreplication 
FROM pg_roles 
WHERE rolname = '<role_name>';
```

### Subscriber access

Generally speaking, your subscriber will need to get past any firewall or IP restrictions in order to access the publisher database. In Neon, no action is required unless you use Neon's **IP Allow** feature to limit IP addresses that can connect to Neon.

If you use Neon's **IP Allow** feature:

1. Determine the IP address or addresses of the subscriber.
2. In your Neon project, add the IPs to your **IP Allow** list, which you can find in your project's settings. For instructions, see [Configure IP Allow](/docs/manage/projects#configure-ip-allow).

### Decoder plugins

Neon supports both `pgoutput` and `wal2json` replication output decoder plugins.

- `pgoutput`: This is the default logical replication output plugin for Postgres. Specifically, it's part of the Postgres built-in logical replication system, designed to read changes from the database's write-ahead log (WAL) and output them in a format suitable for logical replication. 
- `wal2json`: This is also a logical replication output plugin for Postgres, but it differs from `pgoutput` in that it converts WAL data into `JSON` format. This makes it useful for integrating Postgres with systems and applications that work with `JSON` data. For usage information, see [wal2json](https://github.com/eulerto/wal2json).

### Dedicated replication slots

Some data services and platforms require dedicated replication slots. You can create a dedicated replication slot using the standrad PostgreSQL syntax. As mentioned above, Neon supports both `pgoutput` and `wal2json` replication output decoder plugins.

```sql
SELECT pg_create_logical_replication_slot('my_replication_slot', 'pgoutput');
```

```sql
SELECT pg_create_logical_replication_slot('my_replication_slot', 'wal2json');
```

### Publisher settings

The `max_wal_senders` and `max_replication_slots` configuration parameter settings on Neon are set to `10`.

```ini
max_wal_senders = 10
max_replication_slots = 10
```

- The `max_wal_senders` parameter defines the maximum number of concurrent WAL sender processes which are responsible for streaming WAL data to subscribers. In most cases, you should have one WAL sender process for each subscriber or replication slot to ensure efficient and consistent data replication. 
- The `max_replication_slots` defines the maximum number of replication slots which are used to manage database replication connections. Each replication slot tracks changes in the publisher database to ensure that the connected subscriber stays up to date. You'll want a replication slot for each replication connection. For example, if you expect to have 10 separate subscribers replicating from your database, you would set `max_replication_slots` to 10 to accommodate each connection.

If you require different values for these paramters, please contact Neon support.

### Known limitations

Neon is working toward removing the following limitations in future releases:

- A Neon database can only act as a publisher in a replication setup. Creating a subscription on a Neon database is not permitted. You can only create publications on a Neon database. This means that you cannot replicate data from one Neon database to another or from one Neon project to another.
- Only your default Neon Postgres role has the `REPLICATION` privilege. This privilege cannot be granted to other roles. You can expect this limitation to be lifted in a future release.
- You cannot use `CREATE PUBLICATION my_publication FOR ALL TABLES;` syntax in Neon. Specifying `ALL TABLES` requires the Postgres `superuser` privilege, which is not available on Neon. Instead, you can specify multiple tables using `CREATE PUBLICATION my_pub FOR TABLE <table1>, <table2>;` syntax.

## References

- [CREATE PUBLICATION](https://www.postgresql.org/docs/current/sql-createpublication.html)
- [ALTER PUBLICATION](https://www.postgresql.org/docs/current/sql-alterpublication.html)
- [DROP PUBLICATION](https://www.postgresql.org/docs/current/sql-droppublication.html)
- [CREATE SUBSCRIPTION](https://www.postgresql.org/docs/current/sql-createsubscription.html)
- [ALTER SUBSCRIPTION](https://www.postgresql.org/docs/current/sql-altersubscription.html)
- [DROP SUBSCRIPTION](https://www.postgresql.org/docs/current/sql-dropsubscription.html)
- [wal2json](https://github.com/eulerto/wal2json)
- [pg_stat_replication](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-REPLICATION-VIEW)
- [pg_replication_slots](https://www.postgresql.org/docs/current/view-pg-replication-slots.html)

<NeedHelp/>
