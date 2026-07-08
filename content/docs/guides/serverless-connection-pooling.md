---
title: Using Neon from highly elastic serverless platforms
subtitle: Manage connection lifecycles and prevent connection exhaustion in highly elastic serverless environments
summary: >-
   Learn how to manage database connection lifecycles and prevent connection exhaustion when using Neon from highly elastic serverless platforms such as AWS Fargate, Google Cloud Run, Modal, and Vercel.
enableTableOfContents: true
updatedOn: '2026-07-08T11:47:12.663Z'
---

Highly elastic serverless platforms such as AWS Fargate, Google Cloud Run, Modal, and Vercel can scale compute from zero to hundreds of concurrent instances within seconds. While Neon’s [lakebase architecture](/docs/introduction/architecture-overview) is designed for dynamic workloads, rapidly scaling out hundreds of workers can overwhelm your database unless connection lifecycles and local pool sizes are carefully managed.

This guide explains how database connection protocols interact with serverless runtimes, provides strategies to prevent connection leaks during container suspension, and demonstrates how to implement safe, resilient connection pooling configurations.

## The problem with serverless and databases

To understand why serverless architectures require a specialized database connection strategy, it helps to understand how different cloud platforms handle concurrent traffic.

### The serverless connection storm

Traditional relational databases including PostgreSQL were designed under the assumption of persistent, long-lived connections from a static number of application servers. Each PostgreSQL connection spawns a dedicated backend process on the database host, consuming memory and CPU.

Serverless architectures completely invert these design assumptions by introducing three new behaviors that can overwhelm a database:

1. **Massive Fan-out:** Highly elastic serverless platforms can scale compute from zero to hundreds of concurrent instances within seconds to handle sudden spikes in traffic.
2. **Ephemeral lifecycles:** Containers are continuously provisioned, suspended, and terminated as traffic fluctuates, leading to severe connection churn.
3. **High latency overhead:** Establishing a standard Postgres connection over TCP requires a TCP handshake, TLS negotiation, authentication, and backend process initialization, which typically takes **50 to 100 milliseconds** per request.

Without proper pooling and lifecycle management, this behavior can quickly exhaust your database's connection capacity and degrade application performance.

### How modern platforms handle parallel requests

To mitigate connection churn and cold starts, serverless platforms have evolved. They generally handle bursts of parallel requests in one of two ways, and your database pooling strategy depends entirely on which model your platform uses:

#### Multi request concurrency (Google Cloud Run, AWS Fargate, Vercel Fluid Compute, Modal Functions)

These platforms allow a single container instance to process multiple requests or tasks concurrently inside the same memory space using async threads or runtime loops.

If 10 parallel requests hit a single container, they can safely share a single global, client-side TCP connection pool. This drops query latency to near zero on subsequent requests without overwhelming the database.

#### Single request isolation (AWS Lambda)

By default, traditional serverless functions enforce strict isolation, executing only one request or task per instance at any given millisecond.

If 10 parallel requests arrive, the platform instantly spins up 10 separate instances. By default, most standard database clients automatically initialize a local connection pool (typically 5 to 10 connections) out of the box. Unless optimized, these 10 instances will attempt to open up to 100 total database connections, causing a sudden connection spike that risks immediate database exhaustion.

### Choosing your connection strategy

#### The HTTP Driver (For single request isolation)

If you are deploying to strictly ephemeral or single-request environments like AWS Lambda, traditional client-side connection pooling can cause "zombie" connections when instances are abruptly frozen or destroyed.

The workaround is to use HTTP-based drivers like [`@neondatabase/serverless`](https://www.google.com/search?q=/docs/serverless/serverless-driver). These skip the heavy TCP/TLS handshake entirely, reducing connection setup from ~8 network roundtrips to ~3, making it safe to open and close connections on every single invocation without overloading the database.

#### The safe pooling strategy (For multi request concurrency)

If you are using a concurrent platform like Cloud Run, Fargate, Vercel Fluid Compute, or Modal, you _should_ use a traditional client-side TCP connection pool. You can initialize the database client globally at container startup to reuse it across hundreds of subsequent requests.

To safely throttle your database connection count when these platforms inevitably scale out to hundreds of worker instances globally, you can restrict the max pool size per container instance (often to a small number).

## Why container suspension leaks connections

In standard server environments, database connection pools cleanly close idle connections using internal background timers. However, in serverless environments, **container suspension introduces a connection leak blind spot**.

When a serverless instance becomes idle, the platform's orchestration layer suspends the container in memory. During suspension:

- The container's CPU allocation is paused.
- Internal client-side timers (such as `idleTimeoutMillis` in Node.js or pool cleanup threads in Python) **stop executing**.
- Because these timers cannot run, the client-side pooler never closes idle connections.
- The physical TCP socket remains open on the database or proxy side until either the container is fully terminated by the platform or the server-side idle timeout closes the connection.

During a traffic burst or a new application deployment, this state of suspension can cause "phantom" connection accumulation, where hundreds of inactive containers hold open sockets, blocking new instances from connecting.

## The math of serverless connection pooling

To manage connections effectively, you must coordinate client-side pool sizes with your platform's concurrency limits.

The total number of database connections attempted during a peak traffic event is determined by:

```bash
Total Connections = C × P
```

Where:

- C is the number of active, concurrent containers/functions.
- P is the client-side pool size configured inside each container.

### Comparing connection footprints by compute model

| Compute model               | Concurrent containers (C) | Local pool size (P) | Total pool clients | Key Risk                                                  |
| :-------------------------- | :------------------------ | :------------------ | :----------------- | :-------------------------------------------------------- |
| **Monolithic Server**       | 5                         | 20                  | 100                | Static, easily predictable.                               |
| **Unconfigured Serverless** | 300                       | 10                  | **3,000**          | Instantly exhausts `max_connections` or PgBouncer limits. |
| **Optimized Serverless**    | 300                       | 1                   | **300**            | Clean execution; matches live concurrency.                |

To support massive serverless scale-out, keep your client-side pool sizes small (1–2 connections per container) and rely on Neon's built-in PgBouncer pooling to multiplex traffic to Postgres.

## Best practices for serverless connection pooling

### Always use Neon's pooled endpoint

Neon provides built-in connection pooling through PgBouncer in transaction mode. The pooled endpoint accepts up to **10,000 concurrent client connections** and multiplexes them into a smaller number of actual Postgres connections.

Use the pooled connection string with `-pooler` in the hostname for all your serverless app traffic:

![Pooled Connection String](/docs/connect/connection_details.png)

> Ensure **Connection pooling** is enabled when you copy the connection string from the Neon Console.

```text shouldWrap
# App traffic: use the pooled endpoint
DATABASE_URL="postgresql://user:pass@ep-cool-rain-123456-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

Reserve the direct connection string no `-pooler` suffix, for administrative tasks that need session-level state, such as database migrations (e.g., `prisma migrate dev` or `drizzle-kit push`) or `pg_dump`:

```text shouldWrap
# Migrations only: direct Postgres connection
DIRECT_URL="postgresql://user:pass@ep-cool-rain-123456.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

Checkout the [Connection pooling](/docs/connect/connection-pooling) guide for a deeper explanation of how Neon's managed PgBouncer pooling works and the `max_connections` limits that govern your Postgres connection capacity for each compute size.

### Keep client-side pool sizes small

On a traditional fixed server, a pool size of `max: 20` is standard. In serverless, the number of containers is dynamic, if 200 containers each hold 10 connections, that's 2,000 simultaneous connections before you've processed a single query.

Set your local pool's maximum to **1 or 2 per container**. Let Neon's PgBouncer handle the multiplexing to Postgres. If your functions execute sequentially one query at a time, a pool size of `1` is optimal.

### Initialize your pool globally

Never create your database client or pool inside a request handler. Doing so opens a new connection on every invocation, degrading performance and exhausting connections almost immediately.

Always declare your pool in the global scope, outside your handler function. This lets the runtime reuse the same connections across warm invocations:

<CodeTabs labels={["TypeScript", "Python"]}>

```typescript
// ✅ Correct: global scope, reused across invocations
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 2,
});

export default async function handler(req) {
  const client = await pool.connect();
  // ...
}

// ❌ Wrong: inside handler, new connection every request
export default async function handler(req) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  // ...
}
```

```python
import os
from psycopg_pool import ConnectionPool

# ✅ Correct: global scope, reused across invocations
pool = ConnectionPool(
    conninfo=os.environ["DATABASE_URL"],
    min_size=1,
    max_size=2,
    open=True,
)

def handler(request):
    with pool.connection() as conn:
        # ...

# ❌ Wrong: inside handler, new pool every request
def handler(request):
    pool = ConnectionPool(
        conninfo=os.environ["DATABASE_URL"],
        min_size=1,
        max_size=2,
        open=True,
    )
    with pool.connection() as conn:
        # ...
```

</CodeTabs>

### Handle suspension leaks

When a container goes idle, you need to close its database connections before the platform suspends the container. Some platforms provide lifecycle hooks that let you clean up just before suspension or termination. The implementation differs by platform:

<Tabs labels={["Vercel Fluid Compute", "Modal", "Google Cloud Run"]}>
<TabItem>

On Vercel Fluid Compute, use `attachDatabasePool` from `@vercel/functions`. It keeps the instance alive just long enough to close idle connections before suspension:

```typescript
import { Pool } from 'pg';
import { attachDatabasePool } from '@vercel/functions';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 2,
  idleTimeoutMillis: 10000,
});
attachDatabasePool(pool);
```

</TabItem>
<TabItem>

Modal provides the `@modal.exit()` lifecycle hook, which runs when a container is about to exit (including preemption). It gives the handler a 30-second grace period to close resources cleanly. Open the pool with `@modal.enter()` and close it with `@modal.exit()`:

```python
import os
import modal
from psycopg_pool import ConnectionPool

app = modal.App("neon-resilient-worker")

@app.cls(
    secrets=[modal.Secret.from_name("neon-db-secrets")],
)
class DatabaseWorker:
    @modal.enter()
    def open_pool(self):
        self.pool = ConnectionPool(
            conninfo=os.environ["DATABASE_URL"],
            min_size=1,
            max_size=2,
            open=True,
        )

    @modal.method()
    def process_task(self, task_id: int):
        with self.pool.connection() as conn:
            # Run queries
            pass

    @modal.exit()
    def close_pool(self):
        self.pool.close()
```

See the [Modal lifecycle hooks guide](https://modal.com/docs/guide/lifecycle-functions#modalexit) for more on `@modal.exit()`.

</TabItem>
<TabItem>

Google Cloud Run doesn't expose a pre-suspension hook, but it sends a `SIGTERM` signal before terminating a container (with a configurable grace period). Register a signal handler to close the pool, and set a short idle timeout so connections don't linger while idle:

```python
import os
import signal
import sys
from psycopg_pool import ConnectionPool

pool = ConnectionPool(
    conninfo=os.environ["DATABASE_URL"],
    min_size=1,
    max_size=2,
    timeout=10,
)

def shutdown(signum, frame):
    pool.close()
    sys.exit(0)

signal.signal(signal.SIGTERM, shutdown)
signal.signal(signal.SIGINT, shutdown)
```

</TabItem>
</Tabs>

For platforms without dedicated lifecycle hooks, configure a short **idle timeout** of 5 to 10 seconds on your pool, and listen for shutdown signals (`SIGTERM`, `SIGINT`) to close connections cleanly.

### Coordinate with Neon autoscaling

Neon's [autoscaling](/docs/introduction/autoscaling) adjusts your database compute based on load. Connection limits scale with compute size. A 0.25 CU instance handles far fewer connections than a 1 CU instance. While PgBouncer accepts up to 10,000 client connections, the number of active parallel transactions it sends to Postgres is capped by `default_pool_size` (set to `0.9 × max_connections` for [your compute](/docs/connect/connection-pooling).

#### Neon's connection limits

Neon enforces three layers of connection limits. Understanding how they stack is essential for sizing your serverless tier:

| Limit               | Value                    | Controls                                   | What happens when exceeded                                          |
| :------------------ | :----------------------- | :----------------------------------------- | :------------------------------------------------------------------ |
| `max_client_conn`   | 10,000                   | Client connections to PgBouncer            | New connections rejected                                            |
| `default_pool_size` | 90% of `max_connections` | Active transactions per user, per database | Queries queue, then fail after 120s (`query_wait_timeout`)          |
| `max_connections`   | Varies by compute size   | Direct Postgres connections                | New connections rejected: "remaining connection slots are reserved" |

The `max_connections` limit and therefore your `default_pool_size` depends on your compute size:

| Compute size (CU) | RAM         | max_connections | default_pool_size (90%) |
| :---------------- | :---------- | :-------------- | :---------------------- |
| 0.25              | 1 GB        | 104             | 93                      |
| 0.50              | 2 GB        | 209             | 188                     |
| 1                 | 4 GB        | 419             | 377                     |
| 2                 | 8 GB        | 839             | 755                     |
| 3                 | 12 GB       | 1258            | 1132                    |
| 4                 | 16 GB       | 1678            | 1510                    |
| 9 – 56            | 36 – 224 GB | 4000 (capped)   | 3600                    |

<Admonition type="note">
Seven connections are reserved for the Neon superuser account. On a 0.25 CU compute, this leaves 97 connections available to your application (104 − 7) via direct connections. The pooled endpoint's `default_pool_size` already reserves similar headroom.
</Admonition>

For the complete up-to-date table including intermediate compute sizes, see [Postgres settings that differ by compute size](/docs/reference/compatibility#parameter-settings-that-differ-by-compute-size).

If your database idles at a small compute size and your serverless tier suddenly bursts to 500 containers running heavy queries, some requests will queue in PgBouncer. After **120 seconds** in the queue, they fail with a `query_wait_timeout` error.

To prevent this, set your **minimum compute size** high enough to handle expected traffic bursts. A minimum of 1 or 2 CU gives your baseline connection pool enough headroom to absorb spikes without waiting for a scaling event. See the [autoscaling guide](/docs/guides/autoscaling-guide) for details.

You can monitor pooler client and server connections on the [Monitoring page](/docs/introduction/monitoring-page) in the Neon Console.

## The Bulkhead Pattern: Protecting Transactional APIs

In many architectures, different systems share a single database. If high-concurrency background workers (such as image processors or batch jobs) scale up, they can consume all available slots in the database pool, starving your user-facing APIs.

To prevent this, implement the **Bulkhead Pattern** by isolating your workloads at the database layer.

PgBouncer manages connection pools based on the distinct combination of **database user (role) and database name**. You can exploit this behavior to partition your database limits:

### Create distinct roles in PostgreSQL

```sql
-- Create a role for your web API
CREATE ROLE web_api_user WITH LOGIN PASSWORD 'secure_web_pass';
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO web_api_user;

-- Create a role for your background workers
CREATE ROLE worker_user WITH LOGIN PASSWORD 'secure_worker_pass';
GRANT SELECT, INSERT ON ALL TABLES IN SCHEMA public TO worker_user;
```

### Configure different credentials in your systems

- **Web application:** Use a connection string signed in as `web_api_user`.
- **Background worker:** Use a connection string signed in as `worker_user`.

Because the roles are different, PgBouncer assigns them to separate internal pools. This gives you soft isolation: if your background workers saturate their share of the connection pool, your web application still has breathing room under its own pool. However, both pools share the same total connection budget from Postgres, so heavy worker activity can still reduce the connections available to your web app.

For hard isolation with guaranteed per-role connection limits, you would need to run your own PgBouncer instance and configure per-user `pool_size` or `max_db_connections` settings in `pgbouncer.ini`

## Troubleshooting

### `max_connections` errors

```
Remaining connection slots are reserved for roles with the SUPERUSER attribute
```

You're connecting directly to Postgres bypassing PgBouncer or your client-side pool sizes are too large for the number of containers running. Check that your `DATABASE_URL` contains `-pooler` in the hostname and reduce pool sizes to `max: 1` or `max: 2`. See [Connection errors](/docs/connect/connection-errors) for more.

### Double pooling

If you use a client-side pooler like Prisma's connection manager with large pool sizes on top of Neon's pooled endpoint, containers will hoard idle connections that other containers need. Set client-side pool sizes to `1` or `2` and use a short idle timeout 10 seconds works well. See [Choose a connection method](/docs/connect/choose-connection) for guidance.

### `query_wait_timeout` errors

```
query_wait_timeout SSL connection has been closed unexpectedly
```

A sudden burst of queries exceeded what your current compute size could handle. Queries sat in PgBouncer's queue for longer than 120 seconds and timed out. Optimize slow queries and increase your **minimum compute size** to 1 or 2 CU to raise the baseline execution capacity. See [Connection errors](/docs/connect/connection-errors) for more.

<Admonition type="note">
Neon's autoscaling handles gradual traffic increases well, but sudden bursts from serverless scale-outs can outpace it. A higher minimum compute size gives you a safety buffer.
</Admonition>

## Resources

- [Connection pooling](/docs/connect/connection-pooling)
- [Autoscaling guide](/docs/guides/autoscaling-guide)
- [Connection latency and timeouts](/docs/connect/connection-latency)
- [Vercel connection methods](/docs/guides/vercel-connection-methods)
- [Neon serverless driver](/docs/serverless/serverless-driver)

<NeedHelp/>
