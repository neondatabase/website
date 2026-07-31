---
title: 'Postgres 18 Is Out: Try it on Neon'
description: Deploy it for free in just a couple of clicks
excerpt: >-
  Postgres 18 just shipped, and as always, it’s available in preview on Neon
  right away. You can try it right now on Neon’s Free plan, no credit card or
  setup required. New Features in Postgres 18 Postgres 18 comes with a ton of
  other exciting updates around performance, flexibilit...
date: '2025-09-25T18:54:37'
updatedOn: '2025-09-25T19:00:05'
category: product
categories:
  - product
  - postgres
authors:
  - bryan-clark
cover:
  image: 'https://cdn.neonapi.io/public/images/pages/blog/postgres-18/cover.jpg'
  alt: null
isFeatured: true
seo:
  title: 'Postgres 18 Is Out: Try it on Neon - Neon'
  description: >-
    Postgres 18 just shipped, and it’s available in preview on Neon right away.
    Try it right now on Neon’s Free plan.
  keywords: []
  noindex: false
  ogTitle: 'Postgres 18 Is Out: Try it on Neon - Neon'
  ogDescription: >-
    Postgres 18 just shipped, and it’s available in preview on Neon right away.
    Try it right now on Neon’s Free plan.
  image: 'https://cdn.neonapi.io/public/images/pages/blog/postgres-18/social.png'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/postgres-18/neon-postgress-18-1-1024x576-bf6c52ad.jpg)

[Postgres 18 just shipped](https://www.postgresql.org/about/news/postgresql-18-released-3142/), and as always, it’s available in preview on Neon right away. [You can try it right now on Neon’s Free plan](https://console.neon.tech/signup), no credit card or setup required.

<video autoPlay muted loop width="1424" height="720">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/postgres-18/pg-18-ea50ce03.mp4" />
</video>

<Admonition type="important" title="Disclaimer: This is a preview release!">
It’s important for us to offer Postgres 18 to our users right when it ships, but we strongly recommend waiting until it’s out of preview before upgrading your production database to PG 18, to make sure everything is stable.
</Admonition>

## New Features in Postgres 18

Postgres 18 comes with a ton of other exciting updates around performance, flexibility, and developer experience. Here are just a few:

### B-tree skip scan

Postgres 18 removes a long-standing limitation of multicolumn B-tree indexes. Previously, queries could only use such indexes efficiently if they included equality conditions on the leading column. [With the new skip scan optimization](https://neon.com/postgresql/postgresql-18/skip-scan-btree), Postgres can intelligently scan across distinct values in the omitted prefix columns, enabling efficient access even when the first column is not part of the filter. This is especially useful in analytics and reporting workloads where queries often vary the combinations of indexed columns.

```sql
-- Index on 3 columns (region, category, sale_date)
CREATE INDEX idx_sales_analytics ON sales (region, category, sale_date);
-- Query that benefits from skip scan (no region filter)
EXPLAIN (ANALYZE, BUFFERS)
SELECT category, COUNT(*)
FROM sales
WHERE category = 'Electronics'
  -- AND region = 'US' (filter is ommitted but the index still works!)
  AND sale_date BETWEEN '2025-06-01' AND '2025-08-31'
GROUP BY category;
```

### Improved EXPLAIN output

Query optimization becomes easier in Postgres 18 thanks to the expanded EXPLAIN ANALYZE output. [Buffer usage is now included by default](https://neon.com/postgresql/postgresql-18/enhanced-explain), eliminating the need to add BUFFERS manually, and new metrics show the number of index lookups performed. In verbose mode, additional details such as CPU usage and WAL writes are also included.

```sql
-- Buffer statistics are always included
EXPLAIN ANALYZE
SELECT customer_id, SUM(total_amount)
FROM orders
WHERE order_date >= '2025-06-01'
GROUP BY customer_id;
```

```sql
 HashAggregate  (cost=36.21..38.16 rows=195 width=12) (actual time=0.009..0.010 rows=2 loops=1)
   Group Key: customer_id
   Batches: 1  Memory Usage: 32kB
   Buffers: shared hit=43 read=2
   I/O Timings: shared read=0.061
   ->  Seq Scan on orders  (cost=0.00..33.12 rows=617 width=8)
         Filter: (order_date >= '2025-06-01'::date)
         Buffers: shared hit=43 read=2
 Planning:
   Buffers: shared hit=15 read=1
   I/O Timings: shared read=0.206
 Planning Time: 0.403 ms
 Execution Time: 0.041 ms
```

### Virtual generated columns by default

In Postgres 18, [you can now use generated columns without increasing the on-disk size of your table data.](https://neon.com/postgresql/postgresql-18/virtual-generated-columns) These virtual generated columns allow you to speed up `INSERT` and `UPDATE` operations, and ensures that values are always up-to-date. The associated syntax has been updated accordingly, now defaulting to virtual generated columns if no generated column type was indicated (previously, `STORED` was required).

```sql
-- Virtual by default, no STORED keyword needed
ALTER TABLE products
ADD COLUMN selling_price NUMERIC
GENERATED ALWAYS AS (base_price *(1 - discount_rate)* (1 + tax_rate));

-- Stored if you need to index
ALTER TABLE products
ADD COLUMN indexed_price NUMERIC
GENERATED ALWAYS AS (base_price * (1 - discount_rate)) STORED;
```

### UUIDv7 support

Postgres 18 introduces [native support for UUIDv7](https://neon.com/postgresql/postgresql-18/uuidv7-support), a new RFC-standardized format that embeds a timestamp in the UUID. Unlike the random distribution of UUIDv4, UUIDv7 values are naturally ordered, which improves B-tree index performance and cache efficiency, which can be seen in better update and insert performance.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  username TEXT UNIQUE NOT NULL
);

-- Inspect the embedded timestamp
SELECT id, uuid_extract_timestamp(id)
FROM users
ORDER BY id;
```

### Improved RETURNING clause

The `RETURNING` clause has also been expanded in Postgres 18 to make [both old and new row values available in a single statement.](https://neon.com/postgresql/postgresql-18/enhanced-returning) This allows developers to capture before-and-after values during INSERT, UPDATE, DELETE, or MERGE operations without triggers or additional queries.

```sql
-- See both old and new values in one query
UPDATE pricing
SET monthly_fee = 5
WHERE plan = 'Launch'
RETURNING
  plan,
  old.monthly_fee AS before_price,
  new.monthly_fee AS after_price;
```

```sql
 plan   | before_price | after_price
--------+--------------+-------------
 Launch |         19.00 |        5.00
(1 row)
```

### Temporal constraints

Postgres 18 introduces [temporal integrity at the schema level](https://neon.com/postgresql/postgresql-18/temporal-constraints) with `WITHOUT OVERLAPS` for primary and unique keys, and the `PERIOD` clause for foreign keys. These constraints ensure that time ranges do not overlap incorrectly and that temporal relationships between tables remain consistent. Think of it like a [Gantt chart](https://en.wikipedia.org/wiki/Gantt_chart) – each row represents a period of validity, and temporal constraints guarantee that these “bars” on the timeline never overlap when they shouldn’t.

```sql
-- Prevent overlapping employment periods per employee
CREATE TABLE employees (
  emp_id INT,
  valid_period tstzrange NOT NULL,
  PRIMARY KEY (emp_id, valid_period WITHOUT OVERLAPS)
);
```

### OAuth authentication

[Authentication in Postgres 18 can now be delegated to OAuth 2.0 identity providers,](https://neon.com/postgresql/postgresql-18/oauth-authentication) such as Google, Azure AD, or Auth0. Applications and users can connect to Postgres with access tokens rather than passwords. The feature supports the device authorization flow for CLI tools as well as direct bearer tokens for applications.

### NOT NULL constraints as NOT VALID

Adding a `NOT NULL` constraint to a large table [no longer requires an immediate full-table scan](https://neon.com/postgresql/postgresql-18/not-null-as-not-valid). Postgres 18 allows you to mark constraints as `NOT VALID`, enforcing them for new rows immediately while deferring validation of existing data, e.g. for safer schema migrations in production.

```sql
ALTER TABLE users
ADD CONSTRAINT users_email_not_null NOT NULL email NOT VALID;

-- Later, validate existing rows once data is clean
ALTER TABLE users VALIDATE CONSTRAINT users_email_not_null;
```

### Autovacuum maintenance configuration

[Postgres 18 also refines autovacuum behavior](https://neon.com/postgresql/postgresql-18/autovacuum-maintenance-configuration) with new insert-specific thresholds. This allows developers to configure vacuuming more precisely for workloads where inserts dominate, preventing table bloat while reducing unnecessary maintenance load.

```sql
-- Adjust active workers dynamically
ALTER SYSTEM SET autovacuum_max_workers = 10;
SELECT pg_reload_conf();

-- Cap dead tuples for high-traffic tables
ALTER TABLE user_sessions SET (autovacuum_vacuum_max_threshold = 10000);
ALTER TABLE order_items SET (autovacuum_vacuum_max_threshold = 25000);

-- Track cumulative autovacuum timing
SELECT relname AS table_name,
       total_autovacuum_time,
       autovacuum_count
FROM pg_stat_all_tables
WHERE autovacuum_count > 0
ORDER BY total_autovacuum_time DESC
LIMIT 5;
```

### Parallel GIN index builds

Postgres’ GIN index, which is commonly used for indexing JSON[B] fields and to power full-text-search capabilities, got a major indexing performance boost with the newly implemented support for parallel index builds. By processing table data in multiple workers, the time spent creating or reindexing a GIN index can now be significantly reduced.

## And Last But Not Least: Asynchronous I/O

<YoutubeIframe embedId="nUGmpnuU9jU" isDocPost={false} />

One of the biggest changes in Postgres 18 is the introduction of [asynchronous I/O](https://neon.com/postgresql/postgresql-18/asynchronous-io) for read operations. Until now, all reads in Postgres were synchronous: queries had to wait for each read to complete before continuing. Async I/O allows Postgres to issue multiple reads at once and continue execution while waiting for the results, reducing idle CPU time and improving throughput.

<Admonition type="important" title="So, why we’re leaving this to the end?">
While PG 18 is fully available today, Neon will still be running with `io_method = 'sync'` for a while longer, and parts of our sequential scan and prefetch code aren’t yet optimized for Postgres 18. We’re actively working on an improved I/O backend that integrates with the new asynchronous I/O system in Postgres 18, but that will take more time to land.

Integrating the new communicator code (the I/O backend that enables `io_method` values other than `sync`) will take us a while, but we’ll correct the performance discrepancy around prefetch and sequential scans very soon - likely in the next release!

**Conclusion: don’t benchmark Postgres 18 performance on Neon just yet.** You’ll see short-term improvements as we roll out the prefetch/seqscan fixes, and further gains once the new I/O backend is fully integrated.
</Admonition>

Once this is available on Neon, you’ll be able to configure the I/O behavior using a new setting in postgresql.conf called [io_method](https://www.postgresql.org/docs/18/runtime-config-resource.html#GUC-IO-METHOD). This setting controls how read operations are handled internally and must be set at startup. There’s a few available options:

```sql
# postgresql.conf

io_method = 'worker'    # default
io_method = 'io_uring'  # Linux-only
io_method = 'sync'      # preserves legacy synchronous behavior
```

- `worker` (default): Uses a pool of background I/O workers. Read requests are enqueued by the backend process and processed in parallel by these workers, which then deliver the data into shared buffers. The number of workers can be tuned via io_workers (default is 3).
- `io_uring`: A Linux-only method that uses a shared ring buffer with the kernel to submit and complete I/O operations directly, without spawning additional processes. It offers lower overhead and better performance, but requires a recent kernel and compatible file system.
- `sync`: Keeps the legacy behavior from earlier Postgres versions. Reads are blocking and use `posix_fadvise()` for basic prefetching, relying on OS heuristics.

This change will improve Postgres performance across the board in managed cloud environments, where storage is often network-attached and I/O latency is non-trivial.

<Admonition type="info">
By now, asynchronous I/O in Postgres 18 is limited to sequential scans, bitmap heap scans, and VACUUM/maintenance operations. Writes remain synchronous.
</Admonition>

### New pg_stat_io view will be especially useful alongside the new asynchronous I/O

One cool new feature we skip from the list above is that [Postgres 18 makes the pg_stat_io view more powerful](https://v) by breaking down I/O activity by backend type, object, and context, making it easier to see how disk access is being performed and where bottlenecks may be – something that will complements great the new asynchronous I/O subsystem.

```sql
-- Quick look at active I/O
SELECT backend_type, object, context, reads, writes
FROM pg_stat_io
WHERE reads > 0 OR writes > 0
LIMIT 10;
```

```sql

 backend_type   |  object   |  context  | reads | writes
----------------+-----------+-----------+-------+--------
 client backend | relation  | normal    |   120 |    45
 client backend | index     | normal    |    87 |     0
 autovacuum     | relation  | vacuum    |    64 |    12
 walwriter      | wal       | normal    |     0 |   320
 checkpointer   | relation  | bulkwrite |     0 |   210
(5 rows)
```

## Thanks to the Postgres community

Postgres 18 is the result of hard work by many contributors across the community. Every release is a reminder of the depth and strength of the Postgres ecosystem, and we’re grateful to everyone who made this milestone possible.

At Neon (a [Databricks](https://www.databricks.com/) company) we’re proud to contribute back. This release includes work from our own team members, [Heikki Linnakangas](https://git.postgresql.org/gitweb/?p=postgresql.git;a=commitdiff;h=5a1e6df3b) and [Matthias van de Meent](https://git.postgresql.org/gitweb/?p=postgresql.git;a=commitdiff;h=8492feb98).

**You can try Postgres 18 today on Neon’s Free plan. Sign up** [here](https://console.neon.tech/signup).

<Admonition type="comingSoon" title="Maybe for PG 19?">
Heikki and other Postgres contributors are still working on **multi-threaded Postgres**. For Neon’s decoupled architecture in particular, this will be a game-changer. [Check out this PGConf talk if you’re interested in learning more.](https://www.youtube.com/watch?v=1_8Kc9nBh20)
</Admonition>
