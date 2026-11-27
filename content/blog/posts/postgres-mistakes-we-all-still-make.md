---
title: 'The Postgres mistakes we all still make'
description: 'It''s always connections (except when it''s not)'
excerpt: >-
  Postgres is thirty years old. I've been working on it for 22 of those years, and we're all still doing the same bad things over and over. Here are five mistakes, the query that detects each one, and the fix.
date: '2026-11-30T09:00:00'
category: postgres
categories:
  - postgres
authors:
  - scott-mead
cover:
  image: https://cdn.neonapi.io/public/images/pages/blog/postgres-mistakes-we-all-still-make/cover.jpg
  alt: The Postgres mistakes we all still make
isFeatured: false
seo:
  title: 'The Postgres mistakes we all still make - Neon'
  description: 'Five Postgres mistakes that show up on teams of every size, with the query that detects each one and the fix: connection churn, JSONB bloat, open transactions, bulk DELETE, and unused indexes.'
  keywords: []
  noindex: false
  ogTitle: 'The Postgres mistakes we all still make - Neon'
  ogDescription: 'Five Postgres mistakes that show up on teams of every size, with the query that detects each one and the fix.'
  image: https://cdn.neonapi.io/public/images/pages/blog/postgres-mistakes-we-all-still-make/social.jpg
---

Postgres is thirty years old. I've been working on it for 22 of those years, and we're all still doing the same bad things over and over.

At the NYC Postgres Meetup, I walked through the mistakes I keep seeing, on teams of every size and seniority. They have three things in common:

- Every one of them works on your laptop
- Every one of them shows up in your metrics
- They all look innocent at first

This post covers the five from the talk, with the query that detects each one and the fix. The full deck is on [PgCraftsman](https://pgcraftsman.io/talks/the-postgres-mistakes-we-all-still-make/).

## TL;DR

- **Open a new connection per request** and Postgres forks a process every time. Use a connection pool.
- **Append to a JSONB column** and every UPDATE rewrites the whole document. Facts that accumulate go in a table.
- **Call an external API inside a transaction** and you hold a connection, a row lock, and the vacuum horizon for as long as the API takes. Only SQL goes inside the transaction.
- **Run a nightly bulk DELETE** and you generate millions of dead tuples and hours of WAL. Partition and drop.
- **Keep unused indexes** and every write pays for them, and an index on the wrong column turns off HOT updates. Find them and drop them.

## Mistake 1: Opening a new Postgres connection for every request

Postgres runs one process per connection. Connecting means a `fork()`, memory allocation, authentication, and a cold catalog cache, all before a single row is read. A 5 ms query can pay about 2 ms just to connect.

The number of connections is one problem. The rate of new connections is the bigger one. Without a pool, every request connects and disconnects:

```python
def handle(request):
    conn = psycopg2.connect(DSN)        # a new connection per request, no pool
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT ... WHERE id = %s", (request.user_id,))
            return cur.fetchone()
    finally:
        conn.close()                    # torn down again. Next request: fork again
```

The same rate problem shows up as forty app servers each with a pool of fifty per core, or a client that reconnects with no delay.

To see how much connecting costs, I ran pgbench on my laptop (10 cores, Postgres 17, a 1-million-row table, select-only queries) with 20 clients, three ways. First, a new connection for every transaction, which is what the code above does. Then the same thing through PgBouncer. Then persistent connections, the way a pool works.

Connecting per transaction topped out at 1,415 transactions per second, about 7 ms per connect. Going through PgBouncer brought that up to 31,524 per second. With persistent connections, the same workload ran at 215,538 per second, about 150 times faster.

**[ADD IMAGE: Throughput with a new connection per transaction, through PgBouncer, and with a persistent pool]**

### How to detect connection churn

On Postgres 14 and later, `pg_stat_database` counts sessions. Sample it twice, a minute apart. The difference is your connection rate.

```sql
SELECT now(), datname, sessions,
       sessions_abandoned, sessions_fatal,
       sessions_killed, stats_reset
  FROM pg_stat_database;
```

- `sessions`: sessions established since `stats_reset`
- `sessions_abandoned`: the client went away without disconnecting
- `sessions_fatal`: ended by a FATAL error
- `sessions_killed`: ended by an operator

### How to fix it: use a connection pool

A pool connects once and reuses the backend:

```python
from psycopg2 import pool

db = pool.ThreadedConnectionPool(minconn=2, maxconn=10, dsn=DSN)   # once, at startup

def handle(request):
    conn = db.getconn()                 # borrow an open connection, no fork
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT ... WHERE id = %s", (request.user_id,))
            return cur.fetchone()
    finally:
        db.putconn(conn)                # give it back, still connected
```

The pattern is the same in psycopg 3, HikariCP in Java, and `database/sql` in Go. Deployment options:

- **A pool in the application**, sized to the cores, not to the thread count. 64 threads can share 4 connections.
- **PgBouncer in transaction mode**, when many clients need few server connections. 5,000 clients in, 20 server connections out.
- **Both**, when the app autoscales. Forty instances with a pool of 20 each are still 20 backends behind PgBouncer.

On Neon, every Lakebase Postgres compute has a [PgBouncer pooler](https://neon.com/docs/connect/connection-pooling) in transaction mode that accepts up to 10,000 client connections. Add `-pooler` to the endpoint ID in your connection string to use it.

## Mistake 2: Ignoring MVCC (appending to JSONB columns)

Postgres never overwrites a row. An UPDATE writes a new version of the row and marks the old one with `xmax`, the ID of the transaction that replaced it. The old version stays on the page, and every reader steps over it, until VACUUM removes it and records the freed bytes in the free space map. The next row that fits in that gap reuses it. A row that doesn't fit makes the table grow a page, and the gap stays empty. That gap is bloat.

Here's how that plays out with a schema that's common today: a `users` table where everything about the user lives in one JSONB column.

```sql
CREATE TABLE users (
    id      bigint PRIMARY KEY,
    profile jsonb
);
```

In this example, Jane signs up and her profile is 110 bytes. A year of new features later, it's 688 bytes. It now holds her addresses, her preferences, a link to her spouse, and a `login_history` array that gets a new entry every time she logs in.

Because Postgres writes a whole new row version on every UPDATE, small changes are expensive. Switching her theme with `profile || '{"theme": "light"}'` changes 17 bytes, but Postgres rewrites all 688.

**[ADD IMAGE: A year of logins on one row: 364 dead versions, 221 pages]**

With one login a day, Jane's row ends the year as one live version and 364 dead ones, spread over 221 pages. Each version is 24 bytes bigger than the last, so none of them ever fits the space the previous one freed, even with autovacuum keeping up. Across a million users that's 1.8 TB of row versions holding 9.3 GB of live data.

### Why it becomes a connection problem

- The reader steps over 364 dead versions to find the live one.
- The row lives on 221 pages instead of one, so it's a disk read, not a cache hit.
- Every query holds its connection for the extra pages. Same traffic, longer holds.
- The pool opens more connections to keep up, months after the schema decision.
- Autovacuum reads and rewrites the same pages, competing with the queries for disk.

### How to fix it: facts that accumulate go in a table

```sql
-- before: one login rewrites the whole profile, 9,296 bytes by day 365
UPDATE users
   SET profile = jsonb_set(profile, '{login_history}',
                           profile->'login_history' || to_jsonb(now()))
 WHERE id = 1;

-- after: a table. INSERT one small row, UPDATE nothing
CREATE TABLE login_history (
    user_id       bigint       NOT NULL REFERENCES users (id),
    logged_in_at  timestamptz  NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, logged_in_at)
);

INSERT INTO login_history (user_id) VALUES (1);
```

The users row never changes again.

A smaller step, if you only need the latest value: overwrite a field instead of appending to a list. Every version is then the same 110 bytes, so the gap VACUUM frees fits the next version and the table stops growing. It's better, not best. You still create one dead version per login, VACUUM still has to keep up, and a pinned horizon (Mistake 3) still bites.

```sql
UPDATE users
   SET profile = jsonb_set(profile, '{last_login}', to_jsonb(now()))
 WHERE id = 1;
```

## Mistake 3: Leaving transactions open during external API calls

This looks harmless:

```python
cur.execute("SELECT * FROM orders WHERE id = %s FOR UPDATE", (oid,))

resp = requests.post("https://api.payments-provider.com/v1/charges",     # HTTP to a third party
                     json={"card": card, "amount": amount})

cur.execute("UPDATE orders SET status = 'paid' WHERE id = %s", (oid,))
conn.commit()
```

In psycopg2 and psycopg 3, autocommit is off by default, so the `SELECT` opened a transaction (JDBC and other drivers differ here). That transaction holds the row lock and a transaction ID for as long as the payments API takes to answer. In READ COMMITTED, the default, a transaction ID pins the vacuum horizon the same way a snapshot does: VACUUM can't remove any row version newer than it, in any table.

**[ADD IMAGE: A transaction left open during an API call, before and after]**

When the payments API slows from 50 ms to 20 seconds, each request holds its server connection while it waits. The pool opens more connections, and they fill the same way. The pool is exhausted and the database is idle. When the API recovers, every connection is still held and every app instance is still stuck.

Adding `timeout=30` to the HTTP call doesn't solve it. It caps each wait at 30 seconds, and at 300 commits a second, 9,000 transactions can pile up behind one stuck request.

### How to detect open transactions

VACUUM tells you when someone is holding the horizon:

```
INFO:  finished vacuuming "app.public.orders": index scans: 0
tuples: 0 removed, 1483112 remain, 612004 are dead but not yet removable
removable cutoff: 982144, which was 61930 XIDs old when operation ended
```

"Dead but not yet removable" with an old cutoff means something holds the horizon. The usual holders:

| Holder | What it pins | Where to look |
| :---- | :---- | :---- |
| A report running for 40 minutes (read-only transactions count too) | snapshot (xmin) | `pg_stat_activity` |
| A nightly batch in one transaction | xid and snapshot | `pg_stat_activity` |
| `pg_dump` at noon | snapshot | `pg_stat_activity` |
| A physical slot with `hot_standby_feedback` | xmin for every table | `pg_replication_slots` |
| A logical slot nobody consumes | catalog_xmin, and WAL is retained | `pg_replication_slots` |
| A prepared transaction nobody finished | xmin, indefinitely | `pg_prepared_xacts` |

To find the backends holding a snapshot or a transaction ID, oldest first:

```sql
SELECT pid, datname, application_name, state,
       age(backend_xmin) AS xmin_age,
       age(backend_xid)  AS xid_age,
       now() - xact_start AS xact_time
  FROM pg_stat_activity
 WHERE backend_type = 'client backend'
   AND (backend_xmin IS NOT NULL OR backend_xid IS NOT NULL)
 ORDER BY greatest(age(backend_xmin), age(backend_xid)) DESC;
```

`xmin_age` is how many transactions have committed since this one started. A 10-second transaction at 500 transactions a second is 5,000 commits behind.

### How to fix it: only SQL inside the transaction

`FOR UPDATE` plus the charge was never one transaction. Postgres can't roll back an HTTP call. Turn autocommit on, charge first with an idempotency key, then run one guarded UPDATE:

```python
# borrow a connection. The pool was built with autocommit on
conn = pool.getconn()

# the charge runs with no transaction open
resp = requests.post("https://api.payments-provider.com/v1/charges",
                     headers={"Idempotency-Key": f"order-{oid}"},
                     data={"amount": amount, "currency": "usd",
                           "customer": cust, "confirm": "true"}, timeout=30)

# one UPDATE. The status guard replaces the row lock
cur.execute("UPDATE orders SET status = 'paid' "
            "WHERE id = %s AND status = 'pending'", (oid,))

# the only transaction. SQL only, milliseconds
with conn.transaction():
    cur.execute("INSERT INTO ledger ...")
    cur.execute("UPDATE balances ...")
```

Now when the payments API goes down, requests wait on HTTP with no transaction open. Postgres has free connections and nothing to do. When the API recovers, the waiting requests run their UPDATE and finish, with nothing to clean up.

Add a backstop on the server, per role, because the app and the reports need different numbers:

```sql
ALTER ROLE app_rw SET idle_in_transaction_session_timeout = '30s';
ALTER ROLE app_rw SET transaction_timeout = '5min';  -- Postgres 17+: the whole transaction, idle or not
```

Pick the number of seconds from your commit rate. Alert on the oldest idle-in-transaction age (over 30 seconds) and on transactions open longer than 60 seconds. To verify the fix, rerun the detection query: `xmin_age` should fall back to the hundreds.

## Mistake 4: Using bulk DELETE instead of partitioning

The symptom is replication lag and a WAL spike at 02:00. The cause is the nightly retention job:

```sql
DELETE FROM events WHERE created_at < now() - interval '90 days';
```

On an `events` table with 2 billion rows, 90 days of retention, and six indexes, that DELETE removes about 22 million rows a night. DELETE only marks rows dead, so it leaves 22 million dead tuples in the heap and writes WAL for all of them, which every replica replays. The transaction runs for hours, holding a transaction ID and a snapshot the whole time (Mistake 3). Then VACUUM generates another round of WAL traffic across the heap and all six indexes.

**[ADD IMAGE: Bulk DELETE compared with detaching and dropping a partition]**

### Why it becomes a connection problem

- The bulk DELETE is one long-running transaction. Its transaction ID pins the horizon for hours.
- VACUUM is held back the whole time, so dead versions pile up in every table, not only this one.
- The index pages the DELETE empties stay allocated. Every INSERT and UPDATE walks a bigger index.
- Slower writes hold their connection longer. Same traffic, longer holds, and the pool opens more.

### How to detect a bulk DELETE problem

```sql
-- which statement wrote last night's WAL spike?
SELECT queryid, calls, rows, wal_bytes, total_exec_time
  FROM pg_stat_statements
 ORDER BY wal_bytes DESC
 LIMIT 5;

-- dead rows by table
SELECT relname, n_dead_tup, n_live_tup, last_autovacuum
  FROM pg_stat_user_tables
 ORDER BY n_dead_tup DESC
 LIMIT 5;
```

Look for one statement with `wal_bytes` over 1 GB and `rows` in the millions, and for `n_dead_tup` above a fifth of `n_live_tup` with `last_autovacuum` hours old.

### How to fix it: partition and drop

Build the partitioned table next to the existing one. The primary key must include the partition key:

```sql
CREATE TABLE events_p (LIKE events INCLUDING DEFAULTS, PRIMARY KEY (id, created_at))
  PARTITION BY RANGE (created_at);

CREATE TABLE events_p_2026_08 PARTITION OF events_p
  FOR VALUES FROM ('2026-08-01') TO ('2026-09-01');
-- one partition per month back to the retention edge, indexes on events_p.
-- pg_partman keeps the calendar.

-- copy a month per batch
INSERT INTO events_p SELECT * FROM events
 WHERE created_at >= '2026-08-01' AND created_at < '2026-09-01';

-- the swap is two renames
SET lock_timeout = '2s';
BEGIN;
ALTER TABLE events RENAME TO events_old;
ALTER TABLE events_p RENAME TO events;
COMMIT;
```

From then on, retention is a catalog change:

```sql
-- Postgres 14+. Not in a transaction block. Waits for open transactions (Mistake 3)
ALTER TABLE events DETACH PARTITION events_p_2026_08 CONCURRENTLY;
DROP TABLE events_p_2026_08;
```

Dropping a month removes about 680 million rows with zero dead tuples, WAL for catalog rows only, and a wall-clock time of milliseconds once open transactions on `events` finish. To verify, check that `n_tup_del` stays flat on the parent.

You can rehearse the copy and the swap on a [Neon branch](https://neon.com/docs/introduction/branching) of production before running them for real.

Until you can partition, delete in bounded batches and commit each one, so no single transaction runs for hours.

## Mistake 5: Keeping unused indexes

The symptoms are slow: UPDATE latency creeping up, and connection counts rising 1% month over month on the same traffic. Indexes accumulate. Someone adds one for a slow query, the query changes, and the index stays. The ORM adds one on every foreign key. Someone adds `(a)`, `(a, b)`, and `(a, b, c)` just in case.

Every index adds work to every write. To measure how much, I ran the same UPDATE on a 1-million-row table twice: once with only a primary key, and once with seven extra indexes. Then I scaled the results up to a 1-billion-row table taking 5,000 UPDATEs a second:

|  | Primary key only | Seven indexes |
| :---- | :---- | :---- |
| Page writes per UPDATE | 2 | 9 |
| WAL per UPDATE | 311 B | 855 B |
| WAL per day at 1B rows, 5,000 UPDATE/s | 134 GB | 369 GB |

At 1 million rows, the UPDATE takes 0.2 ms with zero indexes or seven, because everything is in RAM. At 1 billion rows, the indexes compete with the heap for RAM, and the UPDATE holds its connection through every one of those reads. Every replica and the WAL archive carry the extra 235 GB a day.

### The index that turns off HOT updates

A HOT (heap-only tuple) update writes only to the heap. Postgres can use one when the new row version fits on the same page and no indexed column changed. No index entry is written, and the old version is pruned in place on the next visit.

Index a column that every UPDATE changes, and HOT is off for that table:

```sql
UPDATE pgbench_accounts SET abalance = abalance + 1 WHERE aid = $1;
CREATE INDEX ON pgbench_accounts (abalance);   -- second run only
```

**[ADD IMAGE: One extra index turns off HOT updates]**

With autovacuum disabled on the table, the run without the index stayed at 1.9% dead tuples after 64,000 updates (3.5% after 1.5 million updates and 53 minutes). With the index on `abalance`, the table was 38% dead after 61,000 updates.

### How to detect unused indexes

Indexes with zero scans since the stats reset, largest first:

```sql
SELECT s.relname, s.indexrelname, s.idx_scan, s.last_idx_scan,   -- last_idx_scan: Postgres 16+
       pg_relation_size(s.indexrelid) AS bytes
  FROM pg_stat_user_indexes s
  JOIN pg_index i USING (indexrelid)
 WHERE s.idx_scan = 0
   AND NOT i.indisunique
   AND NOT i.indisprimary
 ORDER BY pg_relation_size(s.indexrelid) DESC;
```

- `idx_scan = 0` with more than 100 MB of index is a write tax on every INSERT and non-HOT UPDATE.
- Zero counts only since `stats_reset` in `pg_stat_database`. A short window isn't proof.
- Each replica counts its own scans. Check every node before dropping.

Then watch the HOT ratio:

```sql
SELECT relname, n_tup_upd, n_tup_hot_upd, n_tup_newpage_upd,   -- n_tup_newpage_upd: Postgres 16+
       n_dead_tup
  FROM pg_stat_user_tables
 WHERE n_tup_upd > 0
 ORDER BY n_tup_upd DESC;
```

If `n_tup_hot_upd` is under half of `n_tup_upd`, either an indexed column is being updated or the page is full. The counters are cumulative, so diff two samples.

### How to fix it: save the definition, then drop

Save `pg_get_indexdef()` first, then run `DROP INDEX CONCURRENTLY`. To verify, the HOT percentage should recover on the next sample and the index should be gone from `pg_index`. Alert daily on unused index bytes and hourly on invalid indexes.

## Every Postgres mistake becomes a connection problem

For thirty years, the response to connection trouble has been the same: raise `max_connections`. That hides the problem. Each of these mistakes makes every transaction hold its connection longer, and the pool grows to compensate.

**[ADD IMAGE: Summary: what each mistake does to connections and the fix]**

My recommendation: make every interaction with the database direct, fast, and consistent in latency. Your app depends on external services. Don't force your database to as well. Make each transaction cheaper and the connection count follows.

### Know your timeout defaults

These five settings all default to 0, which means a connection can be held with no limit:

- `statement_timeout`
- `lock_timeout`
- `idle_in_transaction_session_timeout`
- `transaction_timeout` (Postgres 17)
- `idle_session_timeout` (Postgres 14)

Set them per role, for example `ALTER ROLE reporting SET statement_timeout = '15min';`. This query lists login roles with no `statement_timeout` override:

```sql
SELECT rolname
  FROM pg_roles r
 WHERE rolcanlogin
   AND NOT EXISTS (SELECT 1 FROM pg_db_role_setting s
                    WHERE s.setrole = r.oid
                      AND s.setconfig::text LIKE '%statement_timeout%');
```

When it returns no application roles, you're done.

## FAQ

### Why does opening a new Postgres connection per request hurt performance?

Postgres forks a new backend process for every connection and authenticates it before running any query. In a pgbench test on Postgres 17 (20 clients, select-only, 10-core laptop), opening a new connection for every transaction capped throughput at 1,415 transactions per second. With persistent connections from a pool, the same workload ran at 215,538 per second.

### Why does updating a JSONB column cause table bloat?

Postgres MVCC writes a new version of the whole row on every UPDATE, including the full JSONB document. If the document grows on each update, the new version never fits the space VACUUM freed from the old one, so the table keeps growing. Store data that accumulates, such as login history, in its own table.

### What does "dead but not yet removable" mean in VACUUM output?

A transaction, replication slot, or prepared transaction is holding the xmin horizon, so VACUUM can't remove row versions newer than it. Find the holder in `pg_stat_activity`, `pg_replication_slots`, or `pg_prepared_xacts`.

### How do I stop idle transactions from blocking VACUUM?

Keep external calls out of transactions. Then set `idle_in_transaction_session_timeout` per role, plus `transaction_timeout` on Postgres 17 and later, so a stuck session ends automatically.

### Is DELETE or DROP PARTITION better for data retention in Postgres?

Dropping a partition. DELETE marks every row dead, writes WAL for each one, and runs as one long transaction. `DETACH PARTITION ... CONCURRENTLY` followed by `DROP TABLE` is a catalog change that takes milliseconds and leaves no dead tuples.

### How do I find unused indexes in Postgres?

Query `pg_stat_user_indexes` for non-unique, non-primary indexes where `idx_scan = 0`. Check that the stats window is long enough and that every replica agrees. Save the definition with `pg_get_indexdef()`, then run `DROP INDEX CONCURRENTLY`.

### What is a HOT update in Postgres?

A HOT (heap-only tuple) update writes the new row version to the same page without touching any index. It needs free space on the page and no change to an indexed column. Indexing a column that's updated often disables HOT for those updates.
