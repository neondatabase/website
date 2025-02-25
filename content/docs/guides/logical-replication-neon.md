---
title: Logical replication in Neon
subtitle: Information about logical replication specific to Neon
enableTableOfContents: true
isDraft: false
updatedOn: '2025-02-14T17:05:10.001Z'
---

This topic outlines information about logical replication specific to Neon, including important notices.

## Important notices

To avoid potential issues, please review the following notices carefully before using logical replication in Neon.

### Neon as a publisher

These notices apply when replicating data from Neon:

- **Scale to zero**: Neon does not scale to zero a compute that has an active connection from a logical replication subscriber. In other words, a Neon Postgres instance with an active subscriber will not scale to zero, which may result in increased compute usage. For more information, see [Logical replication and scale to zero](/docs/guides/logical-replication-neon#logical-replication-and-scale-to-zero).
- **Removal of inactive replication slots**: To prevent storage bloat, **Neon automatically removes _inactive_ replication slots after approximately 40 hours if there are other _active_ replication slots**. If you plan to have more than one subscriber, please read [Unused replication slots](/docs/guides/logical-replication-neon#unused-replication-slots) before you begin.
- **Branch restore removes replication slots**: [Restoring a branch](/docs/guides/branch-restore) will delete all replication slots on that branch. Replication slots are not automatically re-created during the restore process.

### Neon as a subscriber

- Before dropping a database in response to a user issued `DROP DATABASE` command or operation, Neon will drop any logical replication subscriptions defined in the database.
- To prevent issues due to unintended duplication of logical replication subscriptions, subscriptions defined on a parent branch are not duplicated on child branches — they are dropped from child branches before the compute associated with the child branch starts. This applies to all branching contexts where logical replication subscriptions could be duplicated on a child branch, including creating a child branch, resetting a child branch, and restoring a child branch.

## Logical replication and scale to zero

Neon's [Scale to Zero](/docs/introduction/scale-to-zero) feature suspends a compute after 300 seconds (5 minutes) of inactivity. In a logical replication setup, Neon does not scale to zero a compute that has an active connection from a logical replication subscriber. In other words, a compute with an active subscriber remains active at all times. Neon determines if there are active connections from a logical replication subscriber by checking for `walsender` processes on the Neon Postgres instance using the following query:

```sql
SELECT *
FROM pg_stat_replication
WHERE application_name != 'walproposer';
```

If the count is greater than 0, a Neon compute where the publishing Postgres instance runs will not be suspended.

## Unused replication slots

To prevent storage bloat, **Neon automatically removes _inactive_ replication slots after approximately 40 hours if there are other _active_ replication slots**.

If you have only one replication slot, and that slot becomes inactive, it will not be dropped because a single replication slot does not cause storage bloat.

An inactive replication slot is one that doesn't acknowledge `flush_lsn` progress for more than approximately 40 hours. This is the same `flush_lsn` value found in the `pg_stat_replication` view in your Neon database.

An _inactive_ replication slot can be the result of a dead subscriber, where the replication slot has not been removed after a subscriber is deactivated or becomes unavailable. An inactive replication slot can also result from a long replication delay configured on the subscriber. For example, subscribers like Fivetran or Airbyte let you to configure the replication frequency or set a replication delay to minimize usage.

### How to avoid removal of replication slots

- If replication frequency configured on the subscriber is more than 40 hours, you can prevent replication slots from being dropped by changing the replication frequency to less than 40 hours.

  This will ensure that your subscriber reports `flush_lsn` progress more frequently than every 40 hours. If increasing replication frequency is not possible, please contact [Neon Support](/docs/introduction/support) for alternatives.

- If using Debezium, set [flush.lsn.source](https://debezium.io/documentation/reference/stable/connectors/postgresql.html#postgresql-property-flush-lsn-source) to `true` to ensure that `flush_lsn` progress is being reported. For other subscriber platforms, check for an equivalent setting to make sure it's configured to acknowledge progress on the subscriber.

### What to do if your replication slot is removed

If you find that a replication slot was removed and you need to add it back, please see [Create a replication slot](/docs/guides/logical-replication-neon#create-a-replication-slot) for instructions or refer to the replication slot creation instructions for your subscriber.

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

## Replicating between databases on the same Neon project branch

Each branch in a Neon project has its own Postgres instance, and a Postgres instance is a database cluster, capable of supporting multiple databases. If your use case requires replicating data between two databases in the same database cluster, i.e., on the same Neon project branch, the setup is slightly different than configuring replication between separate Postgres instances. As described in the official PostgreSQL [CREATE SUBSCRIPTION Notes documentation](https://www.postgresql.org/docs/current/sql-createsubscription.html):

```text shouldWrap
Creating a subscription that connects to the same database cluster (for example, to replicate between databases in the same cluster or to replicate within the same database) will only succeed if the replication slot is not created as part of the same command. Otherwise, the `CREATE SUBSCRIPTION` call will hang. To make this work, create the replication slot separately (using the function `pg_create_logical_replication_slot` with the plugin name `pgoutput`) and create the subscription using the parameter `create_slot = false`. This is an implementation restriction that might be lifted in a future release.
```

For example, on the publisher database, you would create the publication and the replication slot, as shown:

```sql
CREATE PUBLICATION my_publication FOR TABLES <table1>, <table2>;
SELECT pg_create_logical_replication_slot('my_replication_slot', 'pgoutput');
```

Then, on the subscriber database, you would create a subscription that references the replication slot with the `create_slot` option set to `false` and `slot_name` set to the name of the slot you created. The `connection_string` should be the connection string for the Postgres role used to connect to the publisher database. This role must have the `REPLICATION` privilege. Any Postgres role create created via the Neon Console, CLI, or API is a member of the `neon_superuser` role, which has the `REPLICATION` privilege by default. You can find your Neon database connection details by clicking the **Connect** button on your **Project Dashboard** to open the **Connect to your database** modal. See [Connect from any application](/docs/connect/connect-from-any-app). Be sure to select the correct role and database before copying the connection string.

```sql
CREATE SUBSCRIPTION my_subscription
    CONNECTION 'connection_string'
    PUBLICATION my_publication with (create_slot = false, slot_name = 'my_replication_slot');
```

<NeedHelp/>
