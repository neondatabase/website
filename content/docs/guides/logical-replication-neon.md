---
title: Manage logical replication in Neon
subtitle: Learn how to manage logical replication in Neon
enableTableOfContents: true
isDraft: false
updatedOn: '2024-08-20T23:55:48.548Z'
---

<LRBeta/>

This topic provides commands for managing publications, subscriptions, and replication slots. It also includes information about logical replication specific to Neon, including [known limitations](#known-limitations).

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
To prevent storage bloat, **Neon automatically removes _inactive_ replication slots after a period of time if there are other _active_ replication slots**. If you have or intend on having more than one replication slot, please see [Unused replication slots](#unused-replication-slots) to learn more.
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

It provides details like the state of the replication, the last received WAL location, sent location, write location, and the delay between the publisher and subscriber.

Additionally, the [pg_replication_slots](https://www.postgresql.org/docs/current/view-pg-replication-slots.html) view shows information about the current replication slots on the publisher, including their size.

```sql
SELECT * FROM pg_replication_slots;
```

It's important to keep an eye on replication lag, which indicates how far behind the subscriber is from the publisher. A significant replication lag could mean that the subscriber isn't receiving updates in a timely manner, which could lead to data inconsistencies.

## Neon specifics

This section outlines information about logical replication specific to Neon, including known limitations.

### Enabling logical replication in Neon

<Admonition type="important">
Once you enable logical replication in Neon, the setting cannot be reverted. Enabling logical replication also restarts all computes in your Neon project, meaning that active connections will be dropped and have to reconnect.
</Admonition>

In Neon, logical replication is enabled from the console, by following these steps:

1. Select your project in the Neon Console.
2. On the Neon **Dashboard**, select **Settings**.
3. Select **Logical Replication**.
4. Click **Enable** to enable logical replication.

You can verify that logical replication is enabled by running the following query:

```sql
SHOW wal_level;
wal_level
-----------
logical
```

### Logical replication and autosuspend

By default, Neon's [Autosuspend](/docs/introduction/auto-suspend) feature suspends a compute after 300 seconds (5 minutes) of inactivity. In a logical replication setup, Neon does not autosuspend a compute that has an active connection from a logical replication subscriber. In other words, a compute with an active subscriber remains active at all times. Neon determines if there are active connections from a logical replication subscriber by checking for `walsender` processes on the Neon Postgres instance using the following query:

```sql
SELECT *
FROM pg_stat_replication
WHERE application_name != 'walproposer';
```

If the count is greater than 0, a Neon compute where the publishing Postgres instance runs will not ber suspended.

### Replication roles

It is recommended that you create a dedicated Postgres role for replicating data. The role must have the `REPLICATION` privilege. The default Postgres role created with your Neon project and roles created using the Neon Console, CLI, or API are granted membership in the [neon_superuser](/docs/manage/roles#the-neonsuperuser-role) role, which has the required `REPLICATION` privilege. Roles created via SQL do not have this privilege, and the `REPLICATION` privilege cannot be granted.

<Tabs labels={["Neon Console", "CLI", "API"]}>

<TabItem>

To create a replication role in the Neon Console:

1. Navigate to the [Neon Console](https://console.neon.tech).
2. Select a project.
3. Select **Roles**.
4. Select the branch where you want to create the role.
5. Click **New Role**.
6. In the role creation dialog, specify a role name.
7. Click **Create**. The role is created, and you are provided with the password for the role.

</TabItem>

<TabItem>

The following CLI command creates a role. To view the CLI documentation for this command, see [Neon CLI commands — roles](https://api-docs.neon.tech/reference/createprojectbranchrole)

```bash
neon roles create --name <role>
```

</TabItem>

<TabItem>

The following Neon API method creates a role. To view the API documentation for this method, refer to the [Neon API reference](/docs/reference/cli-roles).

```bash
curl 'https://console.neon.tech/api/v2/projects/hidden-cell-763301/branches/br-blue-tooth-671580/roles' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
  "role": {
    "name": "replication_user"
  }
}' | jq
```

</TabItem>

</Tabs>

You can verify that your role has the `REPLICATION` privilege by running the following query:

```sql
SELECT rolname, rolreplication
FROM pg_roles
WHERE rolname = '<role_name>';
```

### Subscriber access

A subscriber must be able to access the Neon database that is acting as a publisher. In Neon, no action is required unless you use Neon's **IP Allow** feature to limit IP addresses that can connect to Neon.

If you use Neon's **IP Allow** feature:

1. Determine the IP address or addresses of the subscriber.
2. In your Neon project, add the IPs to your **IP Allow** list, which you can find in your project's settings. For instructions, see [Configure IP Allow](/docs/manage/projects#configure-ip-allow).

### Decoder plugins

Neon supports both `pgoutput` and `wal2json` replication output decoder plugins.

- `pgoutput`: This is the default logical replication output plugin for Postgres. Specifically, it's part of the Postgres built-in logical replication system, designed to read changes from the database's write-ahead log (WAL) and output them in a format suitable for logical replication.
- `wal2json`: This is also a logical replication output plugin for Postgres, but it differs from `pgoutput` in that it converts WAL data into `JSON` format. This makes it useful for integrating Postgres with systems and applications that work with `JSON` data. For usage information, see [The wal2json plugin](/docs/extensions/wal2json).

### Dedicated replication slots

Some data services and platforms require dedicated replication slots. You can create a dedicated replication slot using the standard PostgreSQL syntax. As mentioned above, Neon supports both `pgoutput` and `wal2json` replication output decoder plugins.

```sql
SELECT pg_create_logical_replication_slot('my_replication_slot', 'pgoutput');
```

```sql
SELECT pg_create_logical_replication_slot('my_replication_slot', 'wal2json');
```

### Publisher settings

The `max_wal_senders` and `max_replication_slots` configuration parameter settings on Neon are set to `10`.

```text
max_wal_senders = 10
max_replication_slots = 10
```

- The `max_wal_senders` parameter defines the maximum number of concurrent WAL sender processes that are responsible for streaming WAL data to subscribers. In most cases, you should have one WAL sender process for each subscriber or replication slot to ensure efficient and consistent data replication.
- The `max_replication_slots` defines the maximum number of replication slots which are used to manage database replication connections. Each replication slot tracks changes in the publisher database to ensure that the connected subscriber stays up to date. You'll want a replication slot for each replication connection. For example, if you expect to have 10 separate subscribers replicating from your database, you would set `max_replication_slots` to 10 to accommodate each connection.

If you require different values for these parameters, please contact Neon support.

### Unused replication slots

To prevent storage bloat, **Neon automatically removes an _inactive_ replication slot if you have other _active_ replication slots**. Removal occurs after 75 minutes.

If you have only one replication slot, and that slot becomes inactive, it is not removed due to inactivity because a single replication slot does not bloat storage. If you find that your single replication slot has been removed, please contact [Neon Support](/docs/introduction/support).

#### What causes a replication slot to become inactive?

An inactive replication slot is one that doesn't acknowledge `flush_lsn` progress for an extended period. This is the same `flush_lsn` value found in the `pg_stat_replication` view in your Neon database.

An _inactive_ replication slot is often the result of a _dead subscriber_, where the replication slot is not dropped after a subscriber is deactivated or becomes unavailable. An inactive replication slot can also result from a replication delay configured on the subscriber. For example, some subscribers allow you to configure the replication frequency or set a replication delay to minimize usage.

#### How to avoid removal of inactive replication slots

To avoid having "inactive" replication slots removed, ensure that your subscriber reports `flush_lsn` progress regularly and that your replication connection doesn't disappear for more than 75 minutes. If the 75-minute limit is not sufficient for your replication setup, please contact [Neon Support](/docs/introduction/support) to discuss a limit extension.

If using Debezium, ensure that [flush.lsn.source](https://debezium.io/documentation/reference/stable/connectors/postgresql.html#postgresql-property-flush-lsn-source) is set to `true` to allow WAL logs on the source to be cleared. For other subscriber platforms, check for an equivalent setting to make sure it's configured to acknowledge progress on the subscriber.

#### What to do if your replication slot is removed

If you find that a replication slot was removed and you need to add it back, please see [Create a replication slot](/docs/guides/logical-replication-neon#create-a-replication-slot) for instructions or refer to the replication slot creation instructions for your subscriber.

### Known limitations

Neon is working toward removing the following limitations in future releases:

- Only your default Neon Postgres role and roles created via the Neon Console, CLI, or API have the `REPLICATION` privilege. This privilege cannot be granted to other roles. You can expect this limitation to be lifted in a future release. Roles created via SQL do not have the `REPLICATION` privilege, and this privilege cannot be granted.
- `max_slot_wal_keep_size` is set to 1 GB, limiting the maximum size of WAL files that replication slots are allowed to retain in the `pg_wal` directory. This is a temporary limit that will be removed in a future release. The limit avoids an accumulation of WAL data at the publisher due to a lagging subscriber, which could cause a slow compute start.
- To avoid storage bloat, Neon automatically removes an _inactive_ replication slot if you have other _active_ replication slots. See [Unused replication slots](#unused-replication-slots).

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
