---
title: Connection pooling
subtitle: Learn how to enable connection pooling in Neon
enableTableOfContents: true
redirectFrom:
  - /docs/get-started-with-neon/connection-pooling
updatedOn: '2024-08-07T21:36:52.641Z'
---

Neon uses [PgBouncer](https://www.pgbouncer.org/) to support connection pooling, enabling up to 10,000 concurrent connections. PgBouncer is a lightweight connection pooler for Postgres.

## How to use connection pooling

To use connection pooling with Neon, use a pooled connection string instead of a regular connection string. A pooled connection string adds the `-pooler` option to your compute ID, as shown below:

```text shouldWrap
postgresql://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require
```

The **Connection Details** widget on the Neon **Dashboard** provides **Pooled connection** checkbox that adds the `-pooler` option to a connection string for you. You can copy a pooled connection string from the **Dashboard** or manually add the `-pooler` option to the endpoint ID in an existing connection string.

![Connection Details pooled connection string](/docs/connect/connection_details_pooled.png)

<Admonition type="info">
The `-pooler` option routes the connection to a connection pooling port at the Neon Proxy.
</Admonition>

## Connection limits without connection pooling

Each Postgres connection creates a new process in the operating system, which consumes resources. Postgres limits the number of open connections for this reason. The Postgres connection limit is defined by the Postgres `max_connections` parameter. In Neon, `max_connections` is set according to your compute size &#8212; and if you are using Neon's Autoscaling feature, it is set according to your **minimum** compute size.

| Compute Size (CU) | vCPU | RAM   | max_connections |
| :---------------- | :--- | :---- | :-------------- |
| 0.25              | 0.25 | 1 GB  | 112             |
| 0.50              | 0.50 | 2 GB  | 225             |
| 1                 | 1    | 4 GB  | 450             |
| 2                 | 2    | 8 GB  | 901             |
| 3                 | 3    | 12 GB | 1351            |
| 4                 | 4    | 16 GB | 1802            |
| 5                 | 5    | 20 GB | 2253            |
| 6                 | 6    | 24 GB | 2703            |
| 7                 | 7    | 28 GB | 3154            |
| 8                 | 8    | 32 GB | 3604            |
| 9                 | 9    | 36 GB | 4000            |
| 10                | 10   | 40 GB | 4000            |

The formula used to calculate `max_connections` for Neon computes is `RAM in bytes / 9531392 bytes`. For a Neon Free Plan compute, which has 1 GB of RAM, this works out to approximately 112 connections. Larger computes offered with paid plans have more RAM and therefore support a larger number of connections. For example, a compute with 12 GB of RAM supports up to 1351 connections. You can check the `max_connections` limit for your compute by running the following query from the Neon SQL Editor or a client connected to Neon:

```sql
SHOW max_connections;
```

<Admonition type="note">
Four connections are reserved for the Neon-managed Postgres `superuser` account. For example, for a 0.25 compute size, 4/112 connections are reserved, so you would only have 108 available connections. If you are running queries from the Neon SQL Editor, that will also use a connection. To view the currently open connections, you can run the following query:

```sql
SELECT usename FROM pg_stat_activity WHERE datname = '<database_name>';
```

</Admonition>

Even with the largest compute size, the `max_connections` limit may not be sufficient for some applications, such as those that use serverless functions. To increase the number of connections that Neon supports, you can use _connection pooling_. All Neon plans, including the [Neon Free Plan](/docs/introduction/plans#free-plan), support connection pooling.

## Connection pooling

Some applications open numerous connections, with most eventually becoming inactive. This behavior can often be attributed to database driver limitations, running many instances of an application, or applications with serverless functions. With regular Postgres, new connections are rejected when reaching the `max_connections` limit. To overcome this limitation, Neon supports connection pooling using [PgBouncer](https://www.pgbouncer.org/), which allows Neon to support up to 10,000 concurrent connections through the -pooler endpoint.

The use of connection pooling, however, is not a magic bullet: As the name implies, connections to the pooler endpoint together share a pool of connections to the normal PostgreSQL endpoint, so they still consume some connections to the main Postgres instance.

To ensure that direct access to Postgres is still possible for e.g. administrative tasks, the pooler is configured to only open up to [64 connections](#neon-pgbouncer-configuration-settings) to Postgres for each user to each database. I.e., there can be only 64 active connections by `john` to the `neondb` database through the pooler. All other connections by `john` to the `neondb` database will have to wait for one of those 64 active connections to complete their transactions before the next connection's work is started.  
At the same time, a user `mike` will also be able to connect to the `neondb` database through the pooler and have up to 64 concurrent active transactions across 64 connections, assuming the endpoint started with a high enough `minCU` setting to be configured with a high enough `max_connections` setting to support those 128 concurrent connections from those two users.  
Similarly, even if the user `john` has 64 concurrently active transactions through the pooler to the `neondb` database, that user can still start up to 64 concurrent transactions in the `john_db` database when connected through the pooler; but again, only if Postgres' `max_connections` limit has the capacity for the connections that are managed by the pooler.

For further information, see [PgBouncer](#pgbouncer).

<Admonition type="important">
You will not be able to get interactive results from all 10,000 connections at the same time. Connections to the pooler endpoint still consume some connections on the main endpoint: PgBouncer forwards operations from the user's connections through its own pool of connnections to Postgres, and adaptively adds more connections to PostgreSQL as and when needed by more concurrently active user connections. The 10,000 connection limit is therefore most useful for "serverless" applications and application-side connection pools that have many open connections, but infrequent and/or short [transactions](https://neon.tech/docs/postgresql/query-reference#transactions).
</Admonition>

## PgBouncer

PgBouncer is an open-source connection pooler for Postgres. When an application needs to connect to a database, PgBouncer provides a connection from the pool. Connections in the pool are routed to a smaller number of actual Postgres connections. When a connection is no longer required, it is returned to the pool and is available to be used again. Maintaining a pool of available connections improves performance by reducing the number of connections that need to be created and torn down to service incoming requests. Connection pooling also helps avoid rejected connections. When all connections in the pool are being used, PgBouncer queues a new request until a connection from the pool becomes available.

Neon uses `PgBouncer` in `transaction mode`. For limitations associated with `transaction mode`, see [Connection pooling notes and limitations](#connection-pooling-notes). For more information about `PgBouncer`, refer to [https://www.pgbouncer.org/](https://www.pgbouncer.org/).

## Neon PgBouncer configuration settings

Neon's PgBouncer configuration is shown below. The settings are not user-configurable, but if you are a paid plan user and require a different setting, please contact [Neon Support](/docs/introduction/support).

```ini
[pgbouncer]
pool_mode=transaction
max_client_conn=10000
default_pool_size=64
max_prepared_statements=0
query_wait_timeout=120
```

The following list describes each setting. For a full explanation of each parameter, please refer to the official [PgBouncer documentation](https://www.pgbouncer.org/config.html).

- `pool_mode=transaction`: The pooling mode PgBouncer uses, set to `transaction` pooling.
- `max_client_conn=10000`: Maximum number of client connections allowed.
- `default_pool_size=64`: Default number of server connections to allow per user/database pair.
- `max_prepared_statements=0`: Maximum number of prepared statements a connection is allowed to have at the same time. `0` means prepared statements are disabled.
- `query_wait_timeout=120`: Maximum time queries are allowed to spend waiting for execution. Neon uses the default setting of `120` seconds.

## Connection pooling notes

Neon uses PgBouncer in _transaction mode_, which limits some functionality in Postgres. For a complete list of limitations, refer to the "_SQL feature map for pooling modes_" section in the [pgbouncer.org Features](https://www.pgbouncer.org/features.html) documentation.

## Optimize queries with PgBouncer and prepared statements

Protocol-level prepared statements are supported with Neon and PgBouncer as of the [PgBouncer 1.22.0 release](https://github.com/pgbouncer/pgbouncer/releases/tag/pgbouncer_1_21_0). Using prepared statements can help boost query performance while providing an added layer of protection against potential SQL injection attacks.

### Understanding prepared statements

A prepared statement in Postgres allows for the optimization of an SQL query by defining its structure once and executing it multiple times with varied parameters. Here's an SQL-level example to illustrate. Note that direct SQL-level `PREPARE` and `EXECUTE` are not supported with PgBouncer (see [below](#use-prepared-statements-with-pgbouncer)), so you can't use this query from the SQL Editor. It is meant to give you a clear idea of how a prepared statement works. Refer to the protocol-level samples below to see how this SQL-level example translates to different protocol-level examples.

```sql
PREPARE fetch_plan (TEXT) AS
SELECT * FROM users WHERE username = $1;

EXECUTE fetch_plan('alice');
```

`fetch_plan` here is the prepared statement's name, and `$1` acts as a parameter placeholder.

The benefits of using prepared statements include:

- **Performance**: Parsing the SQL and creating the execution plan happens just once, speeding up subsequent executions. This performance benefit would be most noticeable on databases with heavy and repeated traffic.
- **Security**: By sending data values separately from the query, prepared statements reduce the risk of SQL injection attacks.

You can learn more about prepared statements in the PostgreSQL documentation. See [PREPARE](https://www.postgresql.org/docs/current/sql-prepare.html).

### Use prepared statements with PgBouncer

Since pgBouncer supports protocol-level prepared statements only, you must rely on PostgreSQL client libraries instead (direct SQL-level `PREPARE` and `EXECUTE` are not supported). Fortunately, most PostgreSQL client libraries support prepared statements. Here are a couple of examples showing how to use prepared statements with Javascript and Python client libraries:

<CodeTabs labels={["pg", "psycopg2"]}>

```javascript
const query = {
  // give the query a unique name
  name: 'fetch-plan',
  text: 'SELECT * FROM users WHERE username = $1',
  values: ['alice'],
};
client.query(query);
```

```python
cur = conn.cursor()
  query = "SELECT * FROM users WHERE username = %s;"
  cur.execute(query, ('alice',), prepare=True)
  results = cur.fetchall()
```

</CodeTabs>

<NeedHelp/>
