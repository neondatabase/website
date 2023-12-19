---
title: Postgres logical replication basics
subtitle: Learn about PostgreSQL logical replication concepts and syntax
enableTableOfContents: true
isDraft: true
---

Logical replication is one of those most useful features in Postgres. Do you need to move your data to a specialized business analytics platform? Want to set up an ETL pipeline from your Postgres database to a data warehouse? Want to stream data to a change data capture (CDC) ecosystem or an external Postgres database? You can do all of these things and more with logical replication.

With logical replication, you can copy some or all of your data to a different location and continue sending updates from your source database in real-time, allowing you to maintain up-to-date copies of your data in different locations. 

Postgres logical replication architecture is very simple. It uses a _publisher and subscriber_ model for data replication, which you can read about in the [PostgreSQL documentation](https://www.postgresql.org/docs/current/logical-replication.html). The primary data source is the _publisher_, and the database or platform receiving the data is the _subscriber_. On the initial connection from a subscriber, all the data is copied from the publisher to the subscriber. After the initial copy operation, any changes made on the publisher are sent to the subscriber.

![Logical replication publisher subscriber archtitecture](/docs/guides/logical_replication_model.png)

## Publisher setup

This section describes how to set up the publisher for replication.

### Configuring the publisher

To enable logical replication on the publisher, you'll need to change the Postgres `wal_level` configuration parameter setting to `logical`. 

```ini
wal_level = logical
```

In a standalone Postgres installation, you would do this by modifying your `postgresql.conf` configuration file and restarting Postgres. In Neon, you can do this from the console, by following these steps:

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

<Admonition type="note">
Logical replication increases the amount of data written to the Write-Ahead Log (WAL). This is because detailed row-level changes and additional metadata are required to support the replication process. This detailed logging ensures that each change can be accurately replicated to the subscriber. Typically, you can expect a 10% to 30% increase in the amount of data written to the WAL, depending on the extent of write activity.
</Admonition>

Next, you'll want to check your `max_wal_senders` and `max_replication_slots` configuration parameter settings.

The `max_wal_senders` parameter defines the maximum number of concurrent WAL sender processes which are responsible for streaming WAL data to subscribers. In most cases, you should have one WAL sender process for each subscriber or replication slot to ensure efficient and consistent data replication. In Neon's default configuration, this parameter is preset to 10.

The `max_replication_slots` defines the maximum number of replication slots which are used to manage database replication connections. Each replication slot tracks changes in the publisher database to ensure that the connected subscriber stays up to date. You'll want a replication slot for each replication connection. For example, if you expect to have 10 separate subscribers replicating from your database, you would set `max_replication_slots` to 10 to accommodate each connection. In Neon, these values are preset to 10.

```ini
max_wal_senders = 10
max_replication_slots = 10
```

### Granting schema access to your Postgres role

The role you use for replication requires the `REPLICATION` privilege. Currently, only the default Postgres role created with your Neon project has this privilege, and it cannot be granted to other roles. This is the role that is named for the email, Google, GitHub, or partner account you signed up with. For example, if you signed up as `alex@example.com`, you should have a default Postgres role named `alex`. You can verify that your role has this privilege by running the following query: 

```sql
SELECT rolname, rolreplication 
FROM pg_roles 
WHERE rolname = '<role_name>';
```

If the schemas and tables you are replicating from are not owned by this role, make sure to grant access. Run these commands for each schema you expect to replicate data from:

```sql
GRANT USAGE ON SCHEMA <schema_name> TO <role_name>;
GRANT SELECT ON ALL TABLES IN SCHEMA <schema_name> TO <role_name>;
ALTER DEFAULT PRIVILEGES IN SCHEMA <schema_name> GRANT SELECT ON TABLES TO <role_name>;
```

Granting `SELECT ON ALL TABLES IN SCHEMA` instead of naming the specific tables avoids having to add privileges later if you add tables to your publication in the future.

### Allowing inbound traffic

Generally speaking, your subscriber will need to get past any firewall or IP restrictions in order to access the publisher database. In Neon, no action is required unless you use Neon's **IP Allow** feature to limit IP addresses that can connect to Neon.

If you use Neon's **IP Allow** feature:

1. Determine the IP address or addresses of the subscriber.
2. In your Neon project, add the IPs to your **IP Allow** list, which you can find in your project's settings. For instructions, see [Configure IP Allow](/docs/manage/projects#configure-ip-allow).

### Creating a publication

The Postgres documentation describes a [publication](https://www.postgresql.org/docs/current/logical-replication-publication.html) as a group of tables whose data changes are intended to be replicated through logical replication. It also describes a publication as a set of changes generated from a table or a group of tables. It's indeed both of these things.

A particular table can be included in multiple publications if necessary. Currently, publications can only include tables within a particular schema.

Publications can specify the types of changes they replicate, which can include `INSERT`, `UPDATE`, `DELETE`, and `TRUNCATE` operations. By default, they replicate all of these operation types. 

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
Neon currently does not support creating publications using `CREATE PUBLICATION publication_name FOR ALL TABLES` syntax. The `ALL TABLES` clause requires the PostgreSQL superuser privilege, which is not available in a managed service like Neon.
</Admonition>

This command creates a publication that only publishes `INSERT` and `UPDATE` operations in one table. In this case, all data will be published to a subscriber without any data being deleted.

```sql
CREATE PUBLICATION users_publication FOR TABLE users
    WITH (publish = 'insert,update');
```

For the full syntax and more examples, refer to [CREATE PUBLICATION](https://www.postgresql.org/docs/current/sql-createpublication.html), in the PostgreSQL documentation.

## Subscriber setup

In PostgreSQL's logical replication framework, a subscription represents the downstream side of logical replication. It establishes a connection to the publisher and identifies the publication it intends to subscribe to. 

A single subscriber can maintain multiple subscriptions, including multiple subscriptions to the same publisher. 

You can create a subscription using [CREATE SUBSCRIPTION](https://www.postgresql.org/docs/current/sql-createsubscription.html) syntax. Building on the `users_publication` example above, here’s how you can create a subscription:

```sql
CREATE SUBSCRIPTION users_subscription 
CONNECTION 'postgres://username:password@host:port/dbname' 
PUBLICATION users_publication;
```

A subscription requires a unique name, a database connection string, the name and password of your replication role, and the name of the publication that it is subscribing to.

In the example above, `users_subscription` is the subscription that connects to a publication named `users_publication`. When using a Neon database as the publisher, you can replace the connection details with your Neon database connection string.

For the full syntax and more examples, refer to [CREATE SUBSCRIPTION](https://www.postgresql.org/docs/current/sql-createsubscription.html), in the PostgreSQL documentation.

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

## Managing your replication setup

This section outlines some basic commands for managing your replication setup.

### Altering and dropping publications

You might need to change the tables included in a publication or remove a publication altogether. To add or remove tables from a publication, use the [ALTER PUBLICATION](https://www.postgresql.org/docs/current/sql-alterpublication.html) command:

```sql
ALTER PUBLICATION publication_name ADD TABLE new_table;
ALTER PUBLICATION publication_name DROP TABLE removed_table;
```

To drop a publication, use the [DROP PUBLICATION](https://www.postgresql.org/docs/current/sql-droppublication.html) command:

```sql
DROP PUBLICATION publication_name;
```

### Managing subscriptions

Sometimes, you may need to modify or remove a subscription. To modify a subscription, for example, to change the connection info or the subscribed publication, use the [ALTER SUBSCRIPTION](https://www.postgresql.org/docs/current/sql-altersubscription.html) command:

```sql
ALTER SUBSCRIPTION subscription_name CONNECTION 'new_connection_string';
```

To remove a subscription, use the [DROP SUBSCRIPTION](https://www.postgresql.org/docs/current/sql-dropsubscription.html) command:

```sql
DROP SUBSCRIPTION subscription_name;
```

<NeedHelp/>