---
title: Postgres logical replication basics
subtitle: Learn about PostgreSQL logical replication concepts and syntax
enableTableOfContents: true
isDraft: true
---

Logical replication is one of those most useful features in Postgres. Do you need to move your to a specialized business analytics platform? Want to set up am ETL pipeline from your Postgres database to a data warehouse? Want to stream data to change data capture (CDC) ecosystem or an external instance of Postgres? You can do all of these things and more with logical replication.

With logical replication, you can copy some or all of your data to a different location and continue sending updates from your source in real-time, allowing you to maintain up-to-date copies of your data in different locations. 

Postgres logical replication architecture is very simple. It use a _publisher and subscriber_ model for data replication, which you can read about in the [PostgreSQL documentation](https://www.postgresql.org/docs/current/logical-replication.html). The primary data source, your Neon database in this case, is the _publisher_. The database or platform receiving the data is the _subscriber_. On the initial connection from a subscriber, all of the data is copied from the publisher to the subscriber. After the initial copy operation, any changes made on the publisher are sent to the subscriber.

![Logical replication publisher subscriber archtitecture](/docs/guides/logical_replication_model.png)

In the next section, we'll look at how to set up the publisher for replication, which is generally the same on any standard Postgres installation, including Neon. 

## Publisher setup

This sectioon describes how to set up the publisher for replication.

### Configuring the publisher

To turn on logical replication on the publisher, you'll need to change the Postgres `wal_level` configuration parameter setting to `logical`. This parameter is set to `replica` by default. 

```ini
wal_level = logical
```

In a standalone Postgres installation, you would do this by modifying your `postgresql.conf` configuration file and restarting Postgres. In Neon, you can do this from the console, following these steps:

1. Select your project in the Neon console.
2. On the Neon **Dashboard**, select **Settings**.
3. Select **Replication**.
4. Click **Enable**.

The new setting is applied the next time your compute restarts. By default, the compute that runs your Neon Postgres intance automatically suspends after five minutes of inactivity and restarts on the next access. To force an immediate restart, refer to [Restart a compute endpoint](/docs/manage/endpoints/).

You can verify that logical replication is enabled by running the following query from the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor):

```sql
SHOW wal_level;
 wal_level 
-----------
 logical
```

<Admonition type="note">
Logical replication increases the amount of data written to the Write-Ahead Log (WAL) for write transactions. This is becuase detailed row-level changes and additional metadata are required to support the replication process. This detailed logging ensures that each change can be accurately replicated to the subscriber. Typically, you can expect a 10% to 30% increase in the amount of data written to the WAL, which means increased storage usage.
</Admonition>

Next, you'll want to check your `max_wal_senders` and `max_replication_slots` configuration parameter settings to make sure you have enough WAL senders and replication slots.

The `max_wal_senders` parameter defines the maximum number of concurrent WAL sender processes, which are responsible for streaming WAL data to subscribers. In most cases, you should have one WAL sender process for each subscriber or replication slot to ensure efficient and consistent data replication. In Neon's default configuration, this parameter is preset to 10.

The `max_replication_slots` defines the maximum number of replication slots, which are used to manage database replication connections. Each replication slot tracks changes in the publisher database to ensure that each connected subscriber stays up to date. You'll want a replication slot for each replication connection. For example, if you expect to have 10 separate subscribers replicating your from your database, you would set `max_replication_slots` to 10 to accommodate each connection. In Neon, this value is preset to 10. If you need a higher setting, the configuration can be adjusted by updating your project using the [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api).

```ini
max_wal_senders = 10
max_replication_slots = 10
```

## Grant schema access to your Postgres role

The role you use for replication requires the `REPLICATION` privilege. Currently, only the default Postgres role created with your Neon project has this privilege and it cannot be granted to other roles. This is the role that is named for the email, Google, GitHub, or partner account you signed up with. For example, if you signed up as `alex@example.com`, you should have a default Postgres uers named `alex`. You can verify your user has this privilege by running the follow query: 

```sql
SELECT rolname, rolreplication 
FROM pg_roles 
WHERE rolname = '<role_name>';
```

If the schemas and tables you are replicating from are not owned by this role, make sure to grant this role access. Run these commands for each schema you expect to replicate data from:

```sql
GRANT USAGE ON SCHEMA <schema_name> TO <role_name>;
GRANT SELECT ON ALL TABLES IN SCHEMA <schema_name> TO <role_name>;
ALTER DEFAULT PRIVILEGES IN SCHEMA <schema_name> GRANT SELECT ON TABLES TO <role_name>;
```

Granting `SELECT ON ALL TABLES IN SCHEMA` instead of naming the specific tables avoids having to add privileges later if you add tables to your publication in the future.

### Allowing inbound traffic

Generally speaking, your subscriber will need to be able to get past any firewall or IP restrictions in order to access the publisher database. In Neon, action is only required in this regard if you use Neon's **IP Allow** feature to limit IP addresses that can connect to Neon.

If you do use Neon's **IP Allow** feature:

1. Determine the IP address or addresses of the subscriber.
2. In your Neon project, add the IPs to your **IP Allow** list, which you can find in your project's settings. For instructions, see [Configure IP Allow](/docs/manage/projects#configure-ip-allow).

### Creating a publication

The Postgres documentation describes a [publication](https://www.postgresql.org/docs/current/logical-replication-publication.html) as a group of tables whose data changes are intended to be replicated through logical replication. It also describes a publication as a set of changes generated from a table or a group of tables, and as a "change set" or "replication set". It's indeed all of those things.

A particular table can be included in multiple publications, if necessary. Currently, publications can only include tables within a particular schema.

Publications can specify the types of changes they replicate, which can include `INSERT`, `UPDATE`, `DELETE`, and `TRUNCATE` operations. By default, they replicate all these operation types. 

You can create a publication for a specific table using [CREATE PUBLICATION](https://www.postgresql.org/docs/current/sql-createpublication.html) syntax. 

This command creates a publication named `users_publication` that will track changes made to the `users` table.

```sql
CREATE PUBLICATION users_publication FOR TABLE users;
```

This command creates a publication that publishes all changes in two tables:

```sql
CREATE PUBLICATION users_publication FOR TABLE users, departments;
```
<Admonition type="note">
Neon currently does not support creating publications that include all tables within a schema using `CREATE PUBLICATION publication_name FOR ALL TABLES` syntax. This requires the PostgreSQL superuser privilege, which is not available in Neon.
</Admonition>

This command creates a publication that only publishes `INSERT` and `UPDATE` operations in one table. In this case, all data is published without any data being deleted.

```sql
CREATE PUBLICATION users_publication FOR TABLE users
    WITH (publish = 'insert,update');
```

For more examples and the full syntax, refer to [CREATE PUBLICATION](https://www.postgresql.org/docs/current/sql-createpublication.html), in the PostgreSQL documentation.


## Subscriber setup

In PostgreSQL's logical replication framework, a subscription represents the downstream side of logical replication. It establishes a connection to the publisher and identifies the publication it intends to subscribe to. 

A single subscriber can maintain multiple subscriptions, including multiple subscriptions to the same publisher. 

Building on the `users_publication` example above, here’s how you can create a subscription. A subscription requires a unique name, a database connection string, the name and password of your replication role, and the name of the publication.

```sql
CREATE SUBSCRIPTION users_subscription 
CONNECTION 'postgres://username:password@host:port/dbname' 
PUBLICATION users_publication;
```

If you don't do this correctly the first time, 

In this example, `users_subscription` is the subscription that connects to a publication named `users_publication`. Replace username, password, host, port, and dbname with your specific database details. In Neon, you can replace this with your Neon database connection string.

## Replication Slots

Replication slots play a critical role in logical replication. They are used to ensure data consistency and reliability during the replication process.

A replication slot on the publisher database tracks the progress of the corresponding subscriber, ensuring that the publisher retains all changes that have not yet been replicated to the subscriber. This mechanism helps prevent data loss during replication, especially in cases of network issues or subscriber downtime.

### Creating Replication Slots

Typically, replication slots are created automatically when a new subscription is set up. However, they can also be manually created and managed, which is useful in advanced replication setups. For example, some data platforms require that you create replication slot when configuring replication from Postgres.

To create a replication slot manually, you would use the following SQL command:

```sql
SELECT * FROM pg_create_physical_replication_slot('slot_name');
```

In this example, `slot_name` is the name of the new replication slot.

### Monitoring replication slots

Monitoring replication slots is important to ensure they are being used effectively and not causing undue storage retention on the publisher. The following query can be used to view the status of all replication slots:

```sql
SELECT * FROM pg_replication_slots;
```

This query provides information about each slot, such as whether it is active, the last received LSN (Log Sequence Number), and more.

### Managing replication slots

In some cases, replication slots may need to be manually removed, particularly if a subscription is no longer needed, or if you're reconfiguring your replication setup. To drop a replication slot, use the following command:

```sql
SELECT pg_drop_replication_slot('slot_name');
```

This command will remove the replication slot named `slot_name`.

### Example in the context of logical replication

Considering our earlier examples with `users_publication` and `users_subscription`, the replication slot for this subscription would typically be created automatically. However, if you need to manage it manually for advanced configurations or troubleshooting, you can reference it by the subscription name:

```sql
SELECT * FROM pg_replication_slots WHERE slot_name = 'users_subscription';
```

This query would show the status of the replication slot associated with `users_subscription`.

