---
title: Logical replication commands
subtitle: Commands for managing your logical replication configuration
enableTableOfContents: true
isDraft: false
updatedOn: '2024-09-27T18:08:38.284Z'
---

This topic provides commands for managing publications, subscriptions, and replication slots.

For step-by-step setup instructions, refer to our [logical replication guides](/docs/guides/logical-replication-guide).

## Publications

This section outlines how to manage **publications** in your replication setup.

### Create a publication

This command creates a publication named `my_publication` that will track changes made to the `users` table:

```sql
CREATE PUBLICATION my_publication FOR TABLE users;
```

This command creates a publication that publishes all changes in two tables:

```sql
CREATE PUBLICATION my_publication FOR TABLE users, departments;
```

This command creates a publication that only publishes `INSERT` and `UPDATE` operations. Delete operations will not be published.

```sql
CREATE PUBLICATION my_publication FOR TABLE users
    WITH (publish = 'insert,update');
```

### Add a table to a publication

This command adds a table to a publication:

```sql
ALTER PUBLICATION my_publication ADD TABLE sales;
```

### Remove a table from a publication

This command removes a table from a publication:

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
  -- drop the publication
  DROP PUBLICATION IF EXISTS my_publication;

  -- re-create the publication
  CREATE PUBLICATION my_publication;
COMMIT;
```

## Subscriptions

This section outlines how to manage **subscriptions** in your replication setup.

### Create a subscription

Building on the `my_publication` example in the preceding section, here’s how you can create a subscription:

```sql
CREATE SUBSCRIPTION my_subscription
CONNECTION 'postgresql://username:password@host:port/dbname'
PUBLICATION my_publication;
```

A subscription requires a unique name, a database connection string, the name and password of your replication role, and the name of the publication that it subscribes to.

In the example above, `my_subscription` is the name of the subscription that connects to a publication named `my_publication`. In the example above, you would replace the connection details with your Neon database connection string, which you'll find in the **Connection Details** widget on the **Neon Dashboard**.

### Create a subscription with two publications

This command creates a subscription that receives data from two publications:

```sql
CREATE SUBSCRIPTION my_subscription
CONNECTION 'postgresql://username:password@host:port/dbname'
PUBLICATION my_publication, sales_publication;
```

A single subscriber can maintain multiple subscriptions, including multiple subscriptions to the same publisher.

### Create a subscription to be enabled later

This command creates a subscription with `enabled = false` so that you can enable the scription at a later time:

```sql
CREATE SUBSCRIPTION my_subscription
CONNECTION 'postgresql://username:password@host:port/dbname'
PUBLICATION my_publication
WITH (enabled = false);
```

### Change the publication subscribed to

This command modifies an existing subscription to set it to a different publication:

```sql
ALTER SUBSCRIPTION my_subscription SET PUBLICATION new_new_publication;
```

### Change the subscription connection

This command updates the connection details for a subscription:

```sql
ALTER SUBSCRIPTION subscription_name CONNECTION 'new_connection_string';
```

### Disable a subscription

This command disables an existing subscription:

```sql
ALTER SUBSCRIPTION my_subscription DISABLE;
```

### Drop a subscription

This command drops an existing subscription:

```sql
DROP SUBSCRIPTION my_subscription;
```

## Replication slots

Replication slots are created on the publisher database to track replication progress, ensuring that no data in the WAL is purged before the subscriber has successfully replicated it. This mechanism serves to maintain data consistency and prevent data loss in cases of network interruption or subscriber downtime.

<Admonition type="important">
To prevent storage bloat, **Neon automatically removes _inactive_ replication slots after a period of time if there are other _active_ replication slots**. If you have or intend on having more than one replication slot, please see [Unused replication slots](/docs/guides/logical-replication-neon#unused-replication-slots) to learn more.
</Admonition>

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

### Remove a replication slot

To drop a logical replication slot that you created, you can use the `pg_drop_replication_slot()` function. For example, if you've already created a replication slot named `my_replication_slot` using `pg_create_logical_replication_slot()`, you can drop it by executing the following SQL command:

```sql
SELECT pg_drop_replication_slot('my_replication_slot');
```

This command removes the specified replication slot (`my_replication_slot` in this case) from your database. It's important to ensure that the replication slot is no longer in use or required before dropping it, as this action is irreversible and could affect replication processes relying on this slot.

## Data Definition Language (DDL) operations

Logical replication in Postgres primarily handles Data Manipulation Language (DML) operations like `INSERT`, `UPDATE`, and `DELETE`. However, it does not automatically replicate Data Definition Language (DDL) operations such as `CREATE TABLE`, `ALTER TABLE`, or `DROP TABLE`. This means that schema changes in the publisher database are not directly replicated to the subscriber database.

Manual intervention is required to replicate DDL changes. This can be done by applying the DDL changes separately in both the publisher and subscriber databases or by using third-party tools that can handle DDL replication.

## Monitoring replication

To ensure that your logical replication setup is running as expected, you should monitor replication processes regularly. The [pg_stat_replication](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-REPLICATION-VIEW) view displays information about each active replication connection to the publisher.

```sql
SELECT * FROM pg_stat_replication;
```

The view provides details like the state of the replication, the last received WAL location, sent location, write location, and the delay between the publisher and subscriber.

Additionally, the [pg_replication_slots](https://www.postgresql.org/docs/current/view-pg-replication-slots.html) view shows information about the current replication slots on the publisher, including their size.

```sql
SELECT * FROM pg_replication_slots;
```

It's important to keep an eye on replication lag, which indicates how far behind the subscriber is from the publisher. A significant replication lag could mean that the subscriber isn't receiving updates in a timely manner, which could lead to data inconsistencies.

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
