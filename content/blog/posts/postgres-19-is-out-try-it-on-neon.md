---
title: 'Postgres 19 is out: try it on Neon'
description: 'REPACK, query plan advice, WAIT FOR LSN, and more'
excerpt: >-
  Postgres 19 is out, and as always, it's available on Neon
  the same day. You can already try it on the Neon Free plan: start a Postgres
  19 project from the Neon Console by choosing version 19 when you create the
  project, or ask your agent to do it...
date: '2026-11-19T09:00:00'
category: postgres
categories:
  - postgres
  - product
authors:
  - savannah-longoria
cover:
  image: https://cdn.neonapi.io/public/images/pages/blog/postgres-19-is-out-try-it-on-neon/cover.jpg
  alt: Postgres 19 is out, try it on Neon
isFeatured: true
seo:
  title: 'Postgres 19 is out: try it on Neon - Neon'
  description: 'REPACK, query plan advice, WAIT FOR LSN, and more'
  keywords: []
  noindex: false
  ogTitle: 'Postgres 19 is out: try it on Neon - Neon'
  ogDescription: 'REPACK, query plan advice, WAIT FOR LSN, and more'
  image: https://cdn.neonapi.io/public/images/pages/blog/postgres-19-is-out-try-it-on-neon/social.jpg
---

<video autoPlay muted loop playsInline width="708" height="398" aria-label="Postgres 19 available on Neon">
<source src="https://cdn.neonapi.io/public/images/pages/blog/postgres-19-is-out-try-it-on-neon/clip-1.webm" type="video/webm" />
<source src="https://cdn.neonapi.io/public/images/pages/blog/postgres-19-is-out-try-it-on-neon/clip-1.mp4" type="video/mp4" />
</video>

Postgres 19 [just went GA](https://www.postgresql.org/about/news/postgresql-19-released-3449/), and [as always](https://neon.com/blog/postgres-18), it's available on Neon the same day. You can already try it on the Neon Free plan: start a Postgres 19 project from the Neon Console by choosing version 19 when you create the project, or [ask your agent to do it](https://neon.com/docs/ai/neon-mcp-server):

```
Create a new Neon project on Postgres 19
```

<video autoPlay muted loop playsInline width="708" height="403" aria-label="Trying Postgres 19 on Neon with an agent">
<source src="https://cdn.neonapi.io/public/images/pages/blog/postgres-19-is-out-try-it-on-neon/clip-2.webm" type="video/webm" />
<source src="https://cdn.neonapi.io/public/images/pages/blog/postgres-19-is-out-try-it-on-neon/clip-2.mp4" type="video/mp4" />
</video>

<Admonition type="note" title="This release took a little longer">
Postgres 19 was first scheduled for October 29. The release team added a second release candidate, moved general availability to November 19, and pulled several large features late in the cycle (more on those below). Robert Haas, a Postgres committer on our team, wrote [wrote a blog post discussing why](https://neon.com/blog/postgres-19-is-late-and-its-ais-fault)**.**
</Admonition>

## What's new in Postgres 19

Postgres 19 is a practical release. There is no single headline feature that changes what Postgres is. Instead, version 19 goes after operational problems that database teams know well: bloated tables, unstable query plans, replica lag, incomplete statistics, and maintenance work that is hard to run safely in production.

The common thread is control. Postgres 19 gives you more ways to step in when the defaults are not enough, without giving up the project's bias toward reliability and predictable behavior.

We've written hands-on guides for many of these features, linked from each section below. The full list of changes is in the [Postgres 19 release notes](https://www.postgresql.org/docs/19/release-19.html).

### REPACK

Postgres uses multiversion concurrency control, so an UPDATE creates a new row version and a DELETE leaves a dead tuple behind. Routine vacuuming makes that space reusable, but it doesn't necessarily return space to the operating system or restore a useful physical row order. Over time, heavily updated tables can become bloated and poorly clustered.

The usual fixes have been `VACUUM FULL`, `CLUSTER`, or external tools such as `pg_repack`. The built-in commands work, but they take an `ACCESS EXCLUSIVE` lock for the whole operation, blocking normal access to the table.

Postgres 19 adds `REPACK`, which reclaims space while normal reads and writes continue during most of the operation. For example, a chat application can rebuild its `messages` table while clustering rows by conversation and send time using an existing index:

```
REPACK (CONCURRENTLY, ANALYZE) messages
USING INDEX messages_conversation_id_sent_at_idx;
```

`REPACK` reclaims space like `VACUUM FULL`; with `USING INDEX`, it also physically orders rows like `CLUSTER`. With `CONCURRENTLY`, Postgres rebuilds the table while normal reads and writes continue, capturing ongoing changes through logical decoding. It then takes an `ACCESS EXCLUSIVE` lock to apply any remaining captured changes and swap the new table and index files into place. This phase is typically brief but can take longer on a busy table.

There are operational constraints. Concurrent repacking creates an additional replication slot for the duration of the operation, so it needs free capacity under `max_repack_replication_slots` and a table with either a non-deferrable primary key or a suitable index-based replica identity. It also needs temporary disk space for a copy of the table and all its indexes, potentially plus a sort file up to the size of the table. Tables with heavy update and delete traffic face an additional limit: the current upstream Postgres 19 implementation fails if more than about 104 million tuples in the target table are updated or deleted while `REPACK (CONCURRENTLY)` is running. This counts changes made during the repack, not rows already in the table.

Not every relation type is eligible. Long-running transactions can delay the final lock. Concurrent repacking is also not MVCC-safe: after it commits, transactions using snapshots taken before the repack began can see the table as empty. Physical clustering also degrades as later writes arrive.

`REPACK CONCURRENTLY` still needs planning, but it brings into core a job that previously required more downtime or an extension.

<Admonition type="tip" title="Check out our full guide">
[Postgres 19 REPACK command](https://neon.com/postgresql/postgresql-19/repack-command)
</Admonition>

### Query plan advice

The Postgres cost-based optimizer uses table statistics and cost estimates to choose an execution plan. Most of the time, that works well.

Statistics describe individual tables well, but real datasets often contain relationships that are harder to capture. Imagine that enterprise customers make up 0.1% of customers but generate 30% of orders. Per-table statistics cannot capture that cross-table correlation.

With an index on `orders.customer_id`, the planner may estimate that each enterprise customer has only a few orders and choose a nested loop that repeatedly probes the index. If those customers actually account for 30% of orders, each lookup returns far more rows than expected, and a hash join may be more appropriate.

Postgres 19 adds `pg_plan_advice` and `pg_stash_advice` for these situations:

- `pg_plan_advice` describes planner decisions as advice, applies supplied advice, and reports whether it was followed.
- `pg_stash_advice` stores advice by query ID and applies it automatically when a matching query is planned

These components do not add cross-table statistics or replace the planner. Instead, they let you intervene when an inaccurate estimate produces a poor plan.

Consider a query that counts orders from enterprise customers:

```
SELECT count(*)
FROM customers AS c
JOIN orders AS o
  ON o.customer_id = c.customer_id
WHERE c.segment = 'enterprise';
```

Here, `c` is the alias for the filtered customers table. The following advice asks Postgres to place those customers on the inner side of a hash join:

```
SET pg_plan_advice.advice = 'HASH_JOIN(c)';
EXPLAIN (VERBOSE, PLAN_ADVICE)
SELECT count(*)
FROM customers AS c
JOIN orders AS o
  ON o.customer_id = c.customer_id
WHERE c.segment = 'enterprise';
```

When Postgres can apply the advice, `EXPLAIN` reports feedback similar to:

```
Supplied Plan Advice:
  HASH_JOIN(c) /* matched */
```

`matched` means the resulting plan complies with the advice. It does not mean the new plan is necessarily better; you still need to evaluate it against the actual workload.

Unlike inline optimizer hints, plan advice lives outside the application's query text. You can inspect the current plan, test focused advice, and then stash it by query ID.

On Neon, `pg_stash_advice` is preloaded and loads `pg_plan_advice` automatically. You still need to create the extension in each database before using its stash-management functions:

```
CREATE EXTENSION pg_stash_advice;
```

Create a stash and associate the tested advice with the query ID reported by `EXPLAIN (VERBOSE)`. Replace `<query_id>` with the identifier from your plan:

```
SELECT pg_create_advice_stash('order_reporting');
```

```
SELECT pg_set_stashed_advice(
 'order_reporting',
 <query_id>,
 'HASH_JOIN(c)'
);
```

Configure the database to use the stash for new connections:

```
ALTER DATABASE appdb
 SET pg_stash_advice.stash_name = 'order_reporting';
```

Replace `appdb` with the name of your database.

Treat plan advice as a stabilizer once you've diagnosed the problem. Data distributions change, cached prepared statements may keep using an older plan for a while, and the optimizer is still right more often than it is wrong.

When the planner unexpectedly switches a critical query to a worse plan, Postgres 19 gives you a supported way to stabilize it.

<Admonition type="tip" title="Check out our full guide">
[Postgres 19 pg_plan_advice](https://neon.com/postgresql/postgresql-19/pg-plan-advice)
</Admonition>

### Parallel autovacuum and new statistics views

Autovacuum can now use parallel workers when vacuuming indexes, controlled by `autovacuum_max_parallel_workers`. A new scoring system prioritizes eligible tables based on how urgently they need vacuuming or analysis.

New statistics views expose more of what the server is doing:

- `pg_stat_lock` reports statistics by lock type.
- `pg_stat_recovery` shows recovery status.
- `pg_stat_autovacuum_scores` shows how autovacuum prioritizes tables.

Query-level diagnostics improve as well. `EXPLAIN (ANALYZE, IO)` reports asynchronous I/O activity, and `auto_explain.log_io` can include the same information in logged plans.

Postgres 19 also reports bytes written for full-page images in `pg_stat_wal`, `EXPLAIN (ANALYZE, WAL)`, and vacuum and analyze logs.

Together, these make performance investigations less dependent on inference. You can see why maintenance work was prioritized, where asynchronous I/O happened, and how many WAL bytes came from full-page images.

<Admonition type="tip" title="Check out our full guides">
[Postgres 19 parallel autovacuum](https://neon.com/postgresql/postgresql-19/parallel-autovacuum) and [Postgres 19 monitoring and operations](https://neon.com/postgresql/postgresql-19/monitoring-operations)
</Admonition>

### Logical replication

Logical replication has become core infrastructure for change data capture, migrations, real-time serving, and ETL pipelines. Postgres 19 closes several long-standing gaps:

- Logical decoding can be activated without a restart when `wal_level` is `replica`. Creating the first valid logical replication slot raises `effective_wal_level` to `logical`, showing the WAL level currently in effect.
- Sequence values can be synchronized from publishers to subscribers.
- Publications can include all sequences with FOR ALL SEQUENCES.
- `CREATE PUBLICATION ... FOR ALL TABLES EXCEPT (...)` publishes all tables except a named set.
- Subscriptions can reuse connection details from a `postgres_fdw` server with `CREATE SUBSCRIPTION ... SERVER`.
- The `retain_dead_tuples` subscription option preserves enough information to detect `update_deleted` conflicts, where a replicated update targets a row deleted by another origin. Detection also requires `track_commit_timestamp` on the subscriber, and `pg_stat_subscription_stats` counts these conflicts.

Sequence synchronization removes an awkward migration edge case, especially during major-version upgrades that use logical replication. Copying table rows without advancing their sequences can leave a promoted subscriber generating values that already exist, causing duplicate-key errors.

Postgres copies the initial sequence values when the subscription is created with `copy_data = true`, the default. Later sequence changes are not streamed continuously, so refresh them immediately before cutover:

```
ALTER SUBSCRIPTION migration_sub
  REFRESH SEQUENCES;
```

This updates the sequences already known to the subscription to their current values on the publisher. If the publication has gained new sequences, use `ALTER SUBSCRIPTION ... REFRESH PUBLICATION` to add them and synchronize their values before cutover.

<Admonition type="tip" title="Check out our full guide">
[Postgres 19 logical replication improvements](https://neon.com/postgresql/postgresql-19/logical-replication-improvements)
</Admonition>

### WAIT FOR LSN

Asynchronous read replicas add read capacity without making primary commits wait for them. The tradeoff is replication lag. An application can commit a write on the primary, immediately read from a replica, and not find the row because the replica has not replayed the relevant WAL yet.

Postgres 19 adds a direct way to coordinate that handoff. An LSN identifies a position in the Postgres WAL, and WAIT FOR LSN blocks the standby until replay reaches at least the requested position:

```
-- On the primary, after the write commits:
SELECT pg_current_wal_insert_lsn();
```

```
-- On the standby:
WAIT FOR LSN '1/87299680';
```

```
SELECT *
FROM cart_items
WHERE cart_item_id = 1499625;
```

By default, `WAIT FOR LSN` waits indefinitely for the standby to replay the requested LSN. Other modes can wait for WAL to be written or flushed, and you can set a timeout.

The client or connection pooler still has to carry the LSN from the primary to the replica. The database now provides the missing synchronization step, so read-your-writes behavior no longer needs polling or arbitrary sleeps.

<Admonition type="tip" title="Check out our full guide">
[Postgres 19 monitoring and operations](https://neon.com/postgresql/postgresql-19/monitoring-operations) (WAIT FOR LSN section)
</Admonition>

### Statistics import for postgres_fdw

Foreign data wrappers let Postgres query remote systems as if their data were local. Planning those queries has always been hard when the local optimizer does not know the remote table's size or data distribution.

Postgres 19 lets `postgres_fdw` import statistics from the remote server:

```
ALTER SERVER loyalty
OPTIONS (ADD import_stats 'true');
```

```
ANALYZE VERBOSE loyalty_accounts;
```

`ANALYZE` imports the existing remote statistics into the local server. If the import fails, `postgres_fdw` falls back to row sampling. The remote statistics therefore need to be current.

Without remote statistics, Postgres may rely on fallback size estimates and choose a nested loop. After importing them, the planner can estimate row counts more accurately and may choose a hash join instead.

Federated queries still pay network and remote-system costs, but accurate row estimates remove a major source of avoidable bad plans.

### ON CONFLICT DO SELECT

`INSERT ... ON CONFLICT DO SELECT` gives you a clean get-or-create pattern that returns both existing and newly inserted rows:

```
INSERT INTO users (email)
VALUES ('existing@example.com'), ('another@example.com')
ON CONFLICT (email) DO SELECT
RETURNING id, email, old.id IS NULL AS created;
```

It replaces the `DO UPDATE SET col = EXCLUDED.col` workaround, which performs an update even though no values change. That creates a new row version and leaves a dead tuple on every conflict.

<Admonition type="tip" title="Check out our full guide">
[Postgres 19 ON CONFLICT DO SELECT](https://neon.com/postgresql/postgresql-19/on-conflict-do-select)
</Admonition>

### JSON output for COPY TO

`COPY TO` can now emit JSON directly. By default, it writes one object per line, while `FORCE_ARRAY` wraps the output in a single JSON array:

```
COPY users TO STDOUT (FORMAT JSON, FORCE_ARRAY);
```

The new JSON format is export-only, so `COPY FROM` does not accept it.

<Admonition type="tip" title="Check out our full guide">
[Postgres 19 JSON format for COPY TO](https://neon.com/postgresql/postgresql-19/json-copy-to)
</Admonition>

### Smaller SQL and performance changes

Lastly, few compact changes with a quality-of-life payoff:

- JSON path expressions gain familiar string methods such as `btrim()`, `lower()`, `replace()`, and `split_part()`.
- The `random(min, max)` family now supports `date`, `timestamp`, and `timestamptz`, which helps with tests and synthetic datasets.
- Five window functions accept `IGNORE NULLS` and `RESPECT NULLS` ([guide](https://neon.com/postgresql/postgresql-19/query-improvements)).
- When io_method = worker, I/O workers scale automatically between io_min_workers and io_max_workers. Foreign-key checks are faster, and the planner and executor get another round of targeted optimizations.

## We also lost a few features

Several major features landed during Postgres 19 development but were removed before release. Reviewers found correctness or design problems that were too risky to resolve late in the cycle, so the community held the features for a later release.

Some of the features that finally won't ship in 19:

- **SQL/PGQ property graph queries.** `CREATE PROPERTY GRAPH` and `GRAPH_TABLE` brought graph pattern matching over regular tables into SQL. [Reverted on September 7, 2026](https://git.postgresql.org/gitweb/?p=postgresql.git;a=commit;h=b1f106c80cbeb18d3a0219994d98a51a6eca8ede).
- `UPDATE` and `DELETE ... FOR PORTION OF`. Temporal updates and deletes that split rows to preserve history outside the targeted time range. [Reverted on September 15, 2026](https://git.postgresql.org/gitweb/?p=postgresql.git;a=commit;h=a4b26b8f7cd07a3e7f0cba550c30db142329e065).
- `ALTER TABLE ... MERGE PARTITIONS` and `SPLIT PARTITION`. Built-in commands for combining or dividing partitions. [Reverted on August 27, 2026](https://git.postgresql.org/gitweb/?p=postgresql.git;a=commit;h=7612ae8ed8c941985d9cbf60a0674c48f5b0abe5).
- `GROUP BY ALL`. Shorthand for grouping by every non-aggregate expression in the select list.. [Reverted on July 17, 2026](https://git.postgresql.org/gitweb/?p=postgresql.git;a=commit;h=a32733d8f10f0e35f7e4ee772ddbef552296577f).
- Non-text output formats for `pg_dumpall`. [Reverted on June 18, 2026](https://git.postgresql.org/gitweb/?p=postgresql.git;a=commit;h=7ca548f23a60887541493b2da47f2b2720c35ee3).
- DDL extraction functions. `pg_get_role_ddl()`, `pg_get_tablespace_ddl()`, and `pg_get_database_ddl()` were [Reverted on September 13, 202](https://www.postgresql.org/message-id/E1x5ovh-00000000AmY-3ObG%40gemulon.postgresql.org)6.

## Thanks to the Postgres contributors

Postgres is made by its contributors: thank you to the hundreds of community contributors credited in the [release notes](https://www.postgresql.org/docs/19/release-19.html). Especial mention to the engineers in the Lakebase team who worked on this version of Postgres:

- [Robert Haas](https://rhaas.blogspot.com/) wrote `pg_plan_advice` and `pg_stash_advice` (the latter with Lukas Fittl)
- [Heikki Linnakangas](https://aq.linkedin.com/in/heikki-linnakangas-6b58bb203) worked on a new mechanism for registering shared memory, a rework of how subsystems allocate it, multixact fixes, and the new default of 128 for `max_locks_per_transaction`
- [Jeff Davis](https://www.linkedin.com/in/jeff-davis-706b6410) wrote the change that lets `CREATE SUBSCRIPTION` reuse a `postgres_fdw` server's connection details, and did a long run of locale and character-handling work
- [Jonathan Katz](https://www.linkedin.com/in/jkatz05/) worked on the Postgres 19 press release and handled release shepherding
- [Matthias van de Meent](https://nl.linkedin.com/in/matthias-van-de-meent-4464a16a) worked on multiple commits including the change to static index access method routines
- [Alexander Lakhin](https://www.postgresql.org/community/people/law/) fould and reported multiple bugs

Postgres 19 is available on Neon today. [Create a Postgres 19 project](https://console.neon.tech/signup) on the Free plan or ask your agent to do it.

## Upgrading to Postgres 19

As with any new major version of Postgres, we recommend a measured approach to adopting 19. Before you move production workloads to 19,

- Test your own workloads, queries, and extensions on Postgres 19 first, in a separate Postgres 19 project
- Compare performance and behavior against your current version, since major releases can change query plans and defaults (see the list below)
- Check that the extensions you rely on are already available on Postgres 19
- Keep production on your current version until you're comfortable with the results

**Most of the extensions we support on Postgres 18 are already available on Postgres 19, but not all of them yet.** We're adding more as extension maintainers release versions that work with 19. If your workload depends on a specific extension, confirm it's on the [supported extensions list](https://neon.com/docs/extensions/pg-extensions) before you plan a migration.
