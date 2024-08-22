---
title: Logical replication in Neon
subtitle: Information about logical replication specific to Neon
enableTableOfContents: true
isDraft: false
updatedOn: '2024-08-20T23:55:48.548Z'
---

<LRBeta/>

This topic outlines information about logical replication specific to Neon, including important notices.

## Important notices

To avoid potential issues, please review the following notices carefully before using logical replication in Neon.

### Neon as a publisher

These notices apply when replicating data from Neon:

- **Autosuspend**: Neon does not autosuspend a compute that has an active connection from a logical replication subscriber. In other words, a Neon Postgres instance with an active subscriber will not scale to zero, which may result in increased compute usage. For more information, see [Logical replication and autosuspend](/docs/guides/logical-replication-neon#logical-replication-and-autosuspend).
- **Removal of inactive replication slots**: To prevent storage bloat, **Neon automatically removes _inactive_ replication slots if there are other _active_ replication slots**. If you will have more than one replication slot, please read [Unused replication slots](/docs/guides/logical-replication-neon#unused-replication-slots) before you begin.

### Neon as a subscriber

This notice applies when replicating data to Neon:

- **Duplicate subscriptions when branching from a subscriber**: When a child branch is created, restored, or reset from a parent branch that is a subscriber in a logical replication configuration, any subscription defined on the parent branch is duplicated on the child branch. This duplicate subscription will attempt to establish a connection to the same publisher, potentially leading to "slot already used" errors. Additionally, if the parent branch's compute is suspended, the child branch might take over as the subscriber, which can result in a replication gap on the parent branch as updates are directed to the child branch.

  To avoid interruptions and inconsistencies, it’s strongly recommended to disable and drop the duplicate subscriptions on child branches using the following commands:

  ```sql
  ALTER SUBSCRIPTION subscription_name DISABLE;
  ALTER SUBSCRIPTION subscription_name SET (slot_name = NONE);
  DROP SUBSCRIPTION subscription_name;
  ```

  Even with this workaround, the replication gap issue can still occur if the parent branch is suspended before the duplicate subscription on a child branch is disabled. Therefore, we encourage you to take this action promptly on newly created, restored, or reset child branches.

  This issue will be addressed in an upcoming release.

## Logical replication and autosuspend

By default, Neon's [Autosuspend](/docs/introduction/auto-suspend) feature suspends a compute after 300 seconds (5 minutes) of inactivity. In a logical replication setup, Neon does not autosuspend a compute that has an active connection from a logical replication subscriber. In other words, a compute with an active subscriber remains active at all times. Neon determines if there are active connections from a logical replication subscriber by checking for `walsender` processes on the Neon Postgres instance using the following query:

```sql
SELECT *
FROM pg_stat_replication
WHERE application_name != 'walproposer';
```

If the count is greater than 0, a Neon compute where the publishing Postgres instance runs will not be suspended.

## Replication roles

It is recommended that you create a dedicated Postgres role for replicating data from Neon to a subscriber. This role must have the `REPLICATION` privilege. The default Postgres role created with your Neon project and roles created using the Neon Console, CLI, or API are granted membership in the [neon_superuser](/docs/manage/roles#the-neonsuperuser-role) role, which has the required `REPLICATION` privilege. Roles created via SQL do not have this privilege, and the `REPLICATION` privilege cannot be granted.

You can verify that your role has the `REPLICATION` privilege by running the following query:

```sql
SELECT rolname, rolreplication
FROM pg_roles
WHERE rolname = '<role_name>';
```

## Subscriber access

A subscriber must be able to access the Neon database that is acting as a publisher. In Neon, no action is required unless you use Neon's **IP Allow** feature to limit IP addresses that can connect to Neon.

If you use Neon's **IP Allow** feature:

1. Determine the IP address or addresses of the subscriber.
2. In your Neon project, add the IPs to your **IP Allow** list, which you can find in your project's settings. For instructions, see [Configure IP Allow](/docs/manage/projects#configure-ip-allow).

## Publisher access

When replicating data to Neon, you may need to allow connections from Neon on the publisher platform or service.

Neon uses 3 to 6 IP addresses per region for outbound communication, corresponding to each availability zone in the region. See [NAT Gateway IP addresses](/docs/introduction/regions#nat-gateway-ip-addresses) for Neon's NAT gateway IP addresses. When configuring access, be sure to open access to all of the NAT gateway IP addresses for your Neon project's region.

## Decoder plugins

Neon supports both `pgoutput` and `wal2json` replication output decoder plugins.

- `pgoutput`: This is the default logical replication output plugin for Postgres. Specifically, it's part of the Postgres built-in logical replication system, designed to read changes from the database's write-ahead log (WAL) and output them in a format suitable for logical replication.
- `wal2json`: This is also a logical replication output plugin for Postgres, but it differs from `pgoutput` in that it converts WAL data into `JSON` format. This makes it useful for integrating Postgres with systems and applications that work with `JSON` data. For usage information, see [The wal2json plugin](/docs/extensions/wal2json).

## Dedicated replication slots

Some data services and platforms require dedicated replication slots. You can create a dedicated replication slot using the standard PostgreSQL syntax. As mentioned above, Neon supports both `pgoutput` and `wal2json` replication output decoder plugins.

```sql
SELECT pg_create_logical_replication_slot('my_replication_slot', 'pgoutput');
```

```sql
SELECT pg_create_logical_replication_slot('my_replication_slot', 'wal2json');
```

## Publisher settings

The `max_wal_senders` and `max_replication_slots` configuration parameter settings on Neon are set to `10`.

```text
max_wal_senders = 10
max_replication_slots = 10
```

- The `max_wal_senders` parameter defines the maximum number of concurrent WAL sender processes that are responsible for streaming WAL data to subscribers. In most cases, you should have one WAL sender process for each subscriber or replication slot to ensure efficient and consistent data replication.
- The `max_replication_slots` defines the maximum number of replication slots used to manage database replication connections. Each replication slot tracks changes in the publisher database to ensure that the connected subscriber stays up to date. You'll want a replication slot for each replication connection. For example, if you expect to have 10 separate subscribers replicating from your database, you would set `max_replication_slots` to 10 to accommodate each connection.

If you require different values for these parameters, please contact Neon support.

## Unused replication slots

To prevent storage bloat, **Neon automatically removes an _inactive_ replication slot if you have other _active_ replication slots**. Removal occurs after 75 minutes.

If you have only one replication slot, and that slot becomes inactive, it is not removed due to inactivity because a single replication slot does not bloat storage. If you find that your single replication slot has been removed, please contact [Neon Support](/docs/introduction/support).

### What causes a replication slot to become inactive?

An inactive replication slot is one that doesn't acknowledge `flush_lsn` progress for an extended period. This is the same `flush_lsn` value found in the `pg_stat_replication` view in your Neon database.

An _inactive_ replication slot is often the result of a _dead subscriber_, where the replication slot is not dropped after a subscriber is deactivated or becomes unavailable. An inactive replication slot can also result from a replication delay configured on the subscriber. For example, some subscribers allow you to configure the replication frequency or set a replication delay to minimize usage.

### How to avoid removal of inactive replication slots

To avoid having "inactive" replication slots removed, ensure that your subscriber reports `flush_lsn` progress regularly and that your replication connection doesn't disappear for more than 75 minutes. If the 75-minute limit is not sufficient for your replication setup, please contact [Neon Support](/docs/introduction/support) to discuss a limit extension.

If using Debezium, ensure that [flush.lsn.source](https://debezium.io/documentation/reference/stable/connectors/postgresql.html#postgresql-property-flush-lsn-source) is set to `true` to allow WAL logs on the source to be cleared. For other subscriber platforms, check for an equivalent setting to make sure it's configured to acknowledge progress on the subscriber.

### What to do if your replication slot is removed

If you find that a replication slot was removed and you need to add it back, please see [Create a replication slot](/docs/guides/logical-replication-neon#create-a-replication-slot) for instructions or refer to the replication slot creation instructions for your subscriber.

<NeedHelp/>
