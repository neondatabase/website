---
title: Postgres logical replication concepts
subtitle: Learn about PostgreSQL logical replication concepts
enableTableOfContents: true
isDraft: false
updatedOn: '2024-07-23T20:03:37.193Z'
---

Logical Replication is a method of replicating data between databases or between your database and other data services or platforms. It differs from physical replication in that it replicates transactional changes rather than copying the entire database byte-for-byte. This approach allows for selective replication, where users can choose specific tables or rows for replication. It works by capturing DML operations in the source database and applying these changes to the target, which could be another Postgres database or data platform.

With logical replication, you can copy some or all of your data to a different location and continue sending updates from your source database in real-time, allowing you to maintain up-to-date copies of your data in different locations.

<Admonition type="note">
For step-by-step setup instructions, refer to our [logical replication guides](/docs/guides/logical-replication-guide).
</Admonition>

## Publisher subscriber model

The Postgres logical replication architecture is very simple. It uses a _publisher and subscriber_ model for data replication. The primary data source is the _publisher_, and the database or platform receiving the data is the _subscriber_. On the initial connection from a subscriber, all the data is copied from the publisher to the subscriber. After the initial copy operation, any changes made on the publisher are sent to the subscriber. You can read more about this model in the [PostgreSQL documentation](https://www.postgresql.org/docs/current/logical-replication.html).

![Logical replication publisher subscriber archtitecture](/docs/guides/logical_replication_model.jpg)

## Enabling logical replication

In Neon, you can enable logical replication from the Neon Console:

1. Select your project in the Neon Console.
2. On the Neon **Dashboard**, select **Project settings**.
3. Select **Replication**.
4. Click **Enable**.

You can verify that logical replication is enabled by running the following query:

```sql
SHOW wal_level;
 wal_level
-----------
 logical
```

Enabling logical replication turns on detailed logging, which is required to support the replication process. This increases the amount of data written to the Write-Ahead Log (WAL). Typically, you can expect a 10% to 30% increase in the amount of data written to the WAL, depending on the extent of write activity.

## Publications

The Postgres documentation describes a [publication](https://www.postgresql.org/docs/current/logical-replication-publication.html) as a group of tables whose data changes are intended to be replicated through logical replication. It also describes a publication as a set of changes generated from a table or a group of tables. It's indeed both of these things.

A particular table can be included in multiple publications if necessary. Currently, publications can only include tables within a single schema.

Publications can specify the types of changes they replicate, which can include `INSERT`, `UPDATE`, `DELETE`, and `TRUNCATE` operations. By default, publications replicate all of these operation types.

You can create a publication for one or more on the "publisher" database using [CREATE PUBLICATION](https://www.postgresql.org/docs/current/sql-createpublication.html) syntax. For example, this command creates a publication named `users_publication` that tracks changes made to a `users` table.

```sql
CREATE PUBLICATION users_publication FOR TABLE users;
```

## Subscriptions

A subscription represents the downstream side of logical replication. It establishes a connection to the publisher and identifies the publication it intends to subscribe to.

A single subscriber can maintain multiple subscriptions, including multiple subscriptions to the same publisher.

You can create a subscription on a "susbcriber" database or platform using [CREATE SUBSCRIPTION](https://www.postgresql.org/docs/current/sql-createsubscription.html) syntax. Building on the `users_publication` example above, here’s how you would create a subscription:

```sql
CREATE SUBSCRIPTION users_subscription
CONNECTION 'postgresql://username:password@host:port/dbname'
PUBLICATION users_publication;
```

A subscription requires a unique name, a database connection string, the name and password of your replication role, and the name of the publication it subscribes to.

## How does it work under the hood?

While the publisher and subscriber model forms the surface of PostgreSQL logical replication, the underlying mechanism is driven by a few key components, described below.

### Write-Ahead Log (WAL)

The WAL is central to Postgres's data durability and crash recovery mechanisms. In the context of logical replication, the WAL records all changes to your data. For logical replication, the WAL serves as the primary source of data that needs to be replicated. It's the transaction data captured in the WAL that's processed and then relayed from a publisher to a subscriber.

### Replication slots

Replication slots on the publisher database track replication progress, ensuring that no data in the WAL is purged before the subscriber has successfully replicated it. This mechanism helps maintain data consistency and prevent data loss in cases of network interruption or subscriber downtime.

Replication slots are typically created automatically with new subscriptions, but they can be created manually using the `pg_create_logical_replication_slot` function. Some "subscriber" data services and platforms require that you create a dedicated replication slot. This is accomplished using the following syntax:

```sql
SELECT pg_create_logical_replication_slot('my_replication_slot', 'pgoutput');
```

The first value, `my_replication_slot` is the name given to the replication slot. The second value is the decoder plugin the slot should use. Decoder plugins are discussed below.

The `max_replication_slots` configuration parameter defines the maximum number of replication slots that can be used to manage database replication connections. Each replication slot tracks changes in the publisher database to ensure that the connected subscriber stays up to date. You'll want a replication slot for each replication connection. For example, if you expect to have 10 separate subscribers replicating from your database, you would set `max_replication_slots` to 10 to accommodate each connection.

The `max_replication_slots` configuration parameter on Neon is set to `10` by default.

```ini
max_replication_slots = 10
```

<Admonition type="important">
To prevent storage bloat, **Neon automatically removes _inactive_ replication slots after a period of time if there are other _active_ replication slots**. If you have or intend on having more than one replication slot, please see [Unused replication slots](/docs/guides/logical-replication-neon#unused-replication-slots) to learn more.
</Admonition>

### Decoder plugins

The Postgres replication architecture uses decoder plugins to decode WAL entries into a logical replication stream, making the data understandable for the subscriber. The default decoder plugin for PostgreSQL logical replication is `pgoutput`, and it's included in Postgres by default. You don't need to worry about installing it.

Neon, supports an alternative decoder plugin called `wal2json`. This decoder plugin differs from `pgoutput` in that it converts WAL data into `JSON` format, which is useful for integrating Postgres with systems and applications that work with `JSON` data.

To use this decoder plugin, you'll need to create a dedicated replication slot for it, as shown here:

```sql
SELECT pg_create_logical_replication_slot('my_replication_slot', 'wal2json');
```

For for more information about this alternative decoder plugin and how top use it, see [wal2json](https://github.com/eulerto/wal2json).

### WAL senders

WAL senders are processes on the publisher database that read the WAL and send the relevant data to the subscriber.

The `max_wal_senders` parameter defines the maximum number of concurrent WAL sender processes that are responsible for streaming WAL data to subscribers. In most cases, you should have one WAL sender process for each subscriber or replication slot to ensure efficient and consistent data replication.

The `max_wal_senders` configuration parameter on Neon is set to `10` by default, which matches the maximum number of replication slots defined by the `max_replication_slots` setting.

```ini
max_wal_senders = 10
```

### WAL receivers

On the subscriber side, WAL receivers receive the replication stream (the decoded WAL data), and apply these changes to the subscriber. The number of WAL receivers is determined by the number of connections made by subscribers.

## References

- [Logical replication - PostgreSQL documentation](https://www.postgresql.org/docs/current/logical-replication.html)
- [Publications - PostgreSQL documentation](https://www.postgresql.org/docs/current/logical-replication-publication.html)
- [CREATE PUBLICATION](https://www.postgresql.org/docs/current/sql-createpublication.html)
- [CREATE SUBSCRIPTION](https://www.postgresql.org/docs/current/sql-createsubscription.html)
- [wal2json](https://github.com/eulerto/wal2json)

<NeedHelp/>
