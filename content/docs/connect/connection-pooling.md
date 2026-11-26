---
title: Connection pooling
subtitle: Learn how connection pooling works in Neon
summary: >-
  Neon connection pooling uses PgBouncer in transaction mode, accepting up to
  10,000 client connections through per-user, per-database pools sized at 90%
  of max_connections. Use the pooled connection string (hostname with -pooler
  suffix) for serverless functions and connection-per-request workloads. Use a
  direct connection for schema migrations, pg_dump, logical replication, and
  queries that depend on SET, LISTEN/NOTIFY, or session-level state. In
  transaction mode, SET, temporary tables, and SQL-level PREPARE/DEALLOCATE
  are not supported on pooled connections, though protocol-level prepared
  statements are supported.
enableTableOfContents: true
redirectFrom:
  - /docs/get-started/connection-pooling
  - /docs/guides/connection-pooling
  - /docs/introduction/connection-pooling
  - /docs/manage/connection-pooling
updatedOn: '2026-11-26T14:33:45.440Z'
---

For most apps, use a pooled connection. It reuses database connections to help you avoid connection limits. Direct connections are typically used for schema migrations, backups, and other work that needs a single continuous session.

## Choose a connection

### Pooled connections

<div className="flex items-start gap-6 sm:flex-col">
  <div style={{ flex: '1 1 50%' }}>

    A pooled connection reuses a small set of Postgres connections across many clients, so your app can open many connections at once without running into connection limits. The pooler accepts up to 10,000 concurrent connections. This is the right choice for most apps, including web and serverless apps. The pooled hostname ends in `-pooler`.

  </div>
  <div style={{ flex: '1 1 50%' }}>

<InlineSvg src="/docs/connect/pooled-connection.svg" title="Many app connections enter the pooler and are shared over a few Postgres sessions, up to 10,000 connections." />

  </div>
</div>

### Direct connections

<div className="flex items-start gap-6 sm:flex-col">
  <div style={{ flex: '1 1 50%' }}>

    A direct connection is its own continuous, dedicated Postgres session, up to your compute's connection limit. Use it for work that needs one stable session, like the cases below.

  </div>
  <div style={{ flex: '1 1 50%' }}>

<InlineSvg src="/docs/connect/direct-connection.svg" title="Each app connection holds its own dedicated Postgres session, up to the compute's connection limit." />

  </div>
</div>

### When to use pooled vs direct connections

Use a pooled connection by default. Switch to a direct connection only for work that needs a single, continuous session.

<div className="flex items-start gap-6 sm:flex-col">
<div style={{ flex: '1 1 50%' }}>

**Use a pooled connection for**

- Web and serverless apps
- Connection-per-request workloads
- Anything that opens many short-lived connections

</div>
<div style={{ flex: '1 1 50%' }}>

**Use a direct connection for**

- Schema migrations
- `pg_dump` / `pg_restore` and backups
- Logical replication
- `LISTEN` / `NOTIFY`
- Session-level advisory locks
- `SET` and other session state (temp tables, persistent prepared statements)
- `CREATE INDEX CONCURRENTLY` and other statements that can't run inside a transaction block

</div>
</div>

If you run on a platform that scales instances up and down quickly (for example AWS Fargate, Google Cloud Run, or Vercel), see [Serverless connection pooling](/docs/guides/serverless-connection-pooling) for strategies that prevent connection leaks and exhaustion when instances scale out or suspend.

<Admonition type="tip">
For connection errors or slow connections, see [Connection errors](/docs/connect/connection-errors) and [Connection latency and timeouts](/docs/connect/connection-latency).
</Admonition>

### How to use connection pooling

To use connection pooling, connect with the pooled connection string. It's your direct connection string with `-pooler` added to the endpoint ID.

Direct (no pooling):

```text shouldWrap
postgresql://user1:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

Pooled:

```text shouldWrap
postgresql://user1:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

To copy the pooled string from the Neon Console, click **Connect** in the Console nav and turn on the **Connection pooling** toggle.

![Connection Details pooled connection string](/docs/connect/connect_to_branch_modal.png)

The toggle is on by default for new projects. It doesn't start or stop the pooler; the pooled endpoint is always available. The toggle only switches the displayed connection string between the pooled hostname (with the `-pooler` suffix) and the direct hostname. Use the pooled string to enable pooling in your app, or the direct string to disable it.

## How connection pooling works

Connection pooling works around the `max_connections` limit by keeping a pool of reusable connections. Instead of opening a new Postgres connection for every client, PgBouncer routes many client connections through a smaller set of actual Postgres connections.

### Per-user, per-database pools

PgBouncer creates a separate pool for each combination of database user and database name:

- `user1` connecting to `database1` gets one pool.
- `user2` connecting to `database1` gets a separate pool.
- `user1` connecting to `database2` gets another separate pool.

Each pool can grow up to `default_pool_size` (90% of `max_connections`) on its own, but all pools on a compute draw from the same underlying `max_connections` limit. For the exact numbers and what happens when a pool fills up, see [Pooler limits](#pooler-limits).

### Connection pooling in transaction mode

Neon uses [PgBouncer](https://www.pgbouncer.org/) in transaction mode (`pool_mode=transaction`), so a server connection returns to the pool after each transaction completes. This limits Postgres features that need a persistent session. The following are not supported on pooled connections:

- `SET` / `RESET` (session variables)
- `LISTEN` / `NOTIFY`
- `WITH HOLD CURSOR`
- `PREPARE` / `DEALLOCATE` (SQL-level prepared statements)
- Temporary tables with `PRESERVE` / `DELETE ROWS`
- `LOAD` statement
- Session-level advisory locks

For the complete list, see the [PgBouncer features documentation](https://www.pgbouncer.org/features.html).

### Common issues with SET statements

The most common issue you'll hit is with `SET` statements, particularly `SET search_path`.

PgBouncer doesn't reset a server connection when it returns to the pool in transaction mode. A `SET` changes the setting on the server connection, not on your client, so two things can happen:

- Your next transaction might run on a different server connection that doesn't have the setting.
- Another client connecting to the same database with the same role might get the connection and inherit your setting. For example, a leftover `search_path` can make that client read from or write to tables in the wrong schema.

PgBouncer does restore each client's own values for a few parameters: `client_encoding`, `DateStyle`, `TimeZone`, `standard_conforming_strings`, `application_name`, `IntervalStyle`, and `default_transaction_read_only`. Other settings, including `search_path`, `statement_timeout`, and `synchronous_commit`, carry over.

For example, a `SET search_path` can break on the next transaction:

```sql
SET search_path TO myschema;
SELECT * FROM mytable;  -- Works on this server connection
-- Transaction ends, connection returns to the pool with search_path still set
SELECT * FROM mytable;  -- Might run on another connection: ERROR: relation "mytable" does not exist
```

To work around this, you have a few options:

1. Use `SET LOCAL` inside a transaction so the setting reverts when the transaction ends:
   ```sql
   BEGIN;
   SET LOCAL search_path TO myschema, public;
   SELECT * FROM mytable;
   COMMIT;
   ```
2. Specify the schema explicitly in your queries: `SELECT * FROM myschema.mytable`
3. Set it at the role level (applies to new server connections, so pooled connections that are already open keep the old value until they close):
   ```sql
   ALTER ROLE user1 SET search_path TO myschema, public;
   ```
4. Use a direct connection when you need persistent session settings.

This issue also affects tools like `pg_dump`, which relies on `SET` statements. Always use a direct connection for `pg_dump`.

### Optimize queries with PgBouncer and prepared statements

PgBouncer supports protocol-level prepared statements (as of PgBouncer 1.22.0), which can improve query performance and reduce SQL injection risk. SQL-level `PREPARE` and `EXECUTE` are not supported, so use the protocol-level prepared statements exposed by your database driver.

With JavaScript (pg):

```javascript
const query = {
  name: 'fetch-user',
  text: 'SELECT * FROM users WHERE username = $1',
  values: ['alice'],
};
await client.query(query);
```

With Python (psycopg 3):

```python
with conn.cursor() as cur:
    cur.execute("SELECT * FROM users WHERE username = %s", ("alice",), prepare=True)
    results = cur.fetchall()
```

Most PostgreSQL client libraries support protocol-level prepared statements. Check your driver's documentation for details.

## Connection limits

Each Postgres connection starts a new operating-system process that uses memory and CPU, so Postgres caps the number of connections based on available RAM. In Neon, that cap is `max_connections`, which scales with compute size.

### Connection limits without connection pooling

| Compute size (CU) | RAM         | max_connections |
| :---------------- | :---------- | :-------------- |
| 0.25              | 1 GB        | 112             |
| 0.50              | 2 GB        | 225             |
| 1                 | 4 GB        | 450             |
| 2                 | 8 GB        | 901             |
| 3                 | 12 GB       | 1351            |
| 4                 | 16 GB       | 1802            |
| 5                 | 20 GB       | 2253            |
| 6                 | 24 GB       | 2703            |
| 7                 | 28 GB       | 3154            |
| 8                 | 32 GB       | 3604            |
| 9 - 56            | 36 - 224 GB | 4000            |

<Admonition type="note">
For compute sizes 9 CU and above, `max_connections` is capped at 4000 regardless of RAM size. See [Postgres settings that differ by compute size](/docs/reference/compatibility#parameter-settings-that-differ-by-compute-size) for details.
</Admonition>

<Admonition type="note">
Seven connections are reserved for the Neon superuser account. For a 0.25 CU compute, this means 105 connections are available for your application (112 total - 7 reserved).
</Admonition>

Workloads that commonly exceed `max_connections` on a direct connection:

- Serverless functions (each invocation may open a connection)
- Connection-per-request web frameworks
- Multiple application instances without proper connection management
- Applications that don't close connections properly

To check your current limit:

```sql
SHOW max_connections;
```

To view active connections:

```sql
SELECT usename, count(*)
FROM pg_stat_activity
WHERE datname = '<database_name>'
GROUP BY usename;
```

You can also view active connections on the [Monitoring page](/docs/introduction/monitoring-page#connections) in the Neon Console, which graphs connection usage over time.

### Pooler limits

Connection pooling adds two more limits on top of `max_connections`:

| Limit               | Value                    | What it controls                                 | When you hit it                            |
| ------------------- | ------------------------ | ------------------------------------------------ | ------------------------------------------ |
| `max_client_conn`   | 10,000                   | Maximum client connections to PgBouncer          | Client gets: "no more connections allowed" |
| `default_pool_size` | 90% of `max_connections` | Maximum active connections per user per database | Client waits in the queue                  |
| `max_connections`   | Varies by compute        | Direct connections to Postgres                   | Client gets: "too many connections"        |

The 10,000 client connection limit is not 10,000 concurrent queries. For a 1 CU compute (`max_connections` = 450), you can have up to 10,000 client connections to PgBouncer, about 405 concurrent active transactions per user per database (`default_pool_size`, 90% of 450), and 450 concurrent connections to Postgres. The 10,000 limit is useful for applications with many idle or short-lived connections, such as serverless functions that open and close connections frequently.

### What happens when you hit a limit

- **Per-user, per-database pool full**: on a 1 CU compute (`default_pool_size` = 405), if `user1` holds 405 active connections to `database1` with long-running queries, connection 406 waits in the queue and fails with `query_wait_timeout` after 2 minutes. Keep transactions short, or move to a larger compute to raise the pool size. A second database user gets its own pool, but all pools share `max_connections`, so it helps only when `max_connections` still has headroom (on a 1 CU compute, about 38 connections remain after a full 405-connection pool and the 7 reserved for the superuser).
- **Client connection limit reached**: the 10,001st client connection to PgBouncer fails with `no more connections allowed (max_client_conn)`. Fix connection leaks, add client-side pooling, or reduce the number of application instances.
- **`max_connections` reached on a direct connection**: on a 0.25 CU compute (112 `max_connections`), connection 106 on a non-pooled string fails with `FATAL: remaining connection slots are reserved`. Switch to the pooled connection string (add `-pooler` to the hostname), increase the compute size, or add connection pooling in your application.

## Reference

### Neon PgBouncer configuration settings

You can't change Neon's PgBouncer settings yourself. To request a different `default_pool_size`, contact [Support](/docs/introduction/support). The current settings are:

```ini
[pgbouncer]
pool_mode=transaction
max_client_conn=10000
default_pool_size=0.9 * max_connections
max_prepared_statements=1000
query_wait_timeout=120
```

- `pool_mode=transaction`: connections return to the pool after each transaction.
- `max_client_conn=10000`: the maximum number of client connections PgBouncer accepts.
- `default_pool_size`: the maximum concurrent connections per user per database, set to 90% of `max_connections`.
- `max_prepared_statements=1000`: the maximum number of protocol-level prepared statements per connection.
- `query_wait_timeout=120`: the maximum time, in seconds, a query waits for a connection from the pool.

### Pool lifecycle and compute restarts

Connection pools reduce dropped connections during compute restarts (maintenance, updates, or scaling):

- **Automatic reconnection**: production connection pools detect stale connections and replace them.
- **Health checks**: configure validation queries (`pool_pre_ping` in SQLAlchemy, validation in HikariCP) to test connections before use.
- **Connection lifecycle tuning**: settings like `maxLifetime` (HikariCP) or `idleTimeoutMillis` (node-postgres) refresh connections periodically.
- **Retry logic integration**: combined with [retry logic and exponential backoff](/docs/connect/connection-latency#build-connection-timeout-handling-into-your-application), pools provide resilience during brief interruptions.

For complete guidance, see [Building resilient applications with Postgres](/guides/building-resilient-applications-with-postgres).

### Monitoring connection pool activity

The [Monitoring page](/docs/introduction/monitoring-page) in the Neon Console provides two dedicated graphs for tracking PgBouncer connection pool activity:

- **Pooler client connections**: Shows connections from your applications to PgBouncer, including active, idle, and waiting states. This helps you understand client-side connection usage and identify when clients are waiting for available server connections.
- **Pooler server connections**: Shows connections from PgBouncer to your Postgres database, including active and idle server connections in the pool. This helps you monitor how efficiently the pool is being used relative to your `default_pool_size` limit.

For detailed descriptions of these graphs and what each connection state means, see:

- [Pooler client connections](/docs/introduction/monitoring-page#pooler-client-connections)
- [Pooler server connections](/docs/introduction/monitoring-page#pooler-server-connections)

PgBouncer metrics are also available via [OpenTelemetry](/docs/guides/opentelemetry) and [Datadog](/docs/guides/datadog) integrations.

<NeedHelp/>
