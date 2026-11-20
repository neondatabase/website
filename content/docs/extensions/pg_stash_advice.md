---
title: The pg_stash_advice and pg_plan_advice extensions
subtitle: Fix a slow query plan in Postgres 19 without changing your application's SQL
summary: >-
  Postgres 19 adds pg_plan_advice, which describes and constrains planner
  decisions such as join order, join method, and scan method, and
  pg_stash_advice, which stores that advice by query ID and applies it
  automatically without changing application SQL. On Neon, pg_stash_advice is
  preloaded on Postgres 19 projects and loads pg_plan_advice with it. Use this
  page to find a slow query, generate advice with EXPLAIN (PLAN_ADVICE), test it
  in a session, stash it for a query ID, and apply it per session, role, or
  database. Advice stashes aren't saved across compute restarts yet.
enableTableOfContents: true
tag: new
updatedOn: '2026-11-20T16:25:24.432Z'
---

Postgres usually picks a good query plan, but not always. When the planner chooses a slow plan for an important query, the usual fixes are better statistics, a new index, or a rewritten query. Postgres 19 adds a more direct option with two modules that work together:

- `pg_plan_advice` describes the planner's decisions in a short advice language, such as `INDEX_SCAN(o orders_customer_id_idx)` or `SEQ_SCAN(o)`, and lets you supply advice that constrains those decisions.
- `pg_stash_advice` stores advice by query ID and applies it automatically whenever a matching query is planned, so you don't have to change your application's SQL.

<CTA />

This guide walks through one slow query from start to finish:

- [Find a slow query](#find-a-slow-query)
- [See why the plan is slow](#see-why-the-plan-is-slow)
- [Test advice in a session](#test-advice-in-a-session)
- [Stash the advice so it applies automatically](#stash-advice-for-the-query)
- [Limitations to know on Neon](#limitations-on-neon)

<Admonition type="note">
`pg_plan_advice` and `pg_stash_advice` are open-source PostgreSQL contrib modules. For full details, see [pg_plan_advice](https://www.postgresql.org/docs/19/pgplanadvice.html) and [pg_stash_advice](https://www.postgresql.org/docs/19/pgstashadvice.html) in the PostgreSQL documentation.
</Admonition>

### Version availability

Both modules are available on Postgres 19 only. On Neon Postgres 19 projects, the `pg_stash_advice` library is preloaded, and loading it also loads `pg_plan_advice`, so `EXPLAIN (PLAN_ADVICE)` and the `pg_plan_advice.*` settings work right away. To create stashes, you also run `CREATE EXTENSION pg_stash_advice`, as shown [later in this guide](#install-the-extension). `pg_plan_advice` isn't a `CREATE EXTENSION` extension, so it doesn't appear in `pg_available_extensions`. For the `pg_stash_advice` version, see [Supported Postgres extensions](/docs/extensions/pg-extensions).

### Use advice sparingly

Advice overrides the planner, which normally adapts its plan as your data changes. Advice that helps today can produce a very poor plan later. Use it for specific queries where the planner gets the plan wrong, keep advice strings as small as possible, and look at statistics and indexes first.

## Quick start

If you already know which query is slow and what plan it should use, these are the steps. The rest of this guide explains each one.

```sql
-- 1. Try advice in your session and compare EXPLAIN ANALYZE timings
SET pg_plan_advice.advice = 'INDEX_SCAN(o orders_customer_id_idx)';
EXPLAIN (ANALYZE, PLAN_ADVICE) SELECT ...;

-- 2. Install the extension and store the advice for the query's ID
CREATE EXTENSION pg_stash_advice;
SELECT pg_create_advice_stash('app_stash');
SELECT pg_set_stashed_advice('app_stash', <query_id>, 'INDEX_SCAN(o orders_customer_id_idx)');

-- 3. Apply the stash to every new session for your application's role
ALTER ROLE neondb_owner SET pg_stash_advice.stash_name = 'app_stash';
```

## Example data

The examples use a `customers` table and an `orders` table with skewed data. A small number of enterprise customers place 30% of all orders, and all of their orders were placed early, so they have low order IDs:

```sql
-- 100,000 customers. 100 of them (0.1%) are enterprise customers.
CREATE TABLE customers (
  customer_id int PRIMARY KEY,
  segment     text NOT NULL
);

INSERT INTO customers
SELECT g, CASE WHEN g <= 100 THEN 'enterprise' ELSE 'self-serve' END
FROM generate_series(1, 100000) AS g;

-- 1,000,000 orders. Enterprise customers place 30% of them.
CREATE TABLE orders (
  order_id    bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id int NOT NULL REFERENCES customers (customer_id),
  total       numeric(10,2) NOT NULL
);

INSERT INTO orders (customer_id, total)
SELECT CASE WHEN g <= 300000 THEN (g % 100) + 1 ELSE (g % 99900) + 101 END,
       (g % 2000)::numeric
FROM generate_series(1, 1000000) AS g;

CREATE INDEX orders_customer_id_idx ON orders (customer_id);
ANALYZE customers, orders;
```

The query to fix shows a customer's 10 most recent orders:

```sql
SELECT o.order_id, o.total
FROM orders o
WHERE o.customer_id = 50
ORDER BY o.order_id DESC
LIMIT 10;
```

Your timings will differ from the ones in this guide, depending on your compute size and whether the data is cached.

## Find a slow query

To find the queries worth fixing, use [`pg_stat_statements`](/docs/extensions/pg_stat_statements). It's preloaded on Neon, but you need to install it in your database before you can query it:

```sql
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

SELECT queryid, calls, round(mean_exec_time::numeric, 1) AS mean_ms, query
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 5;
```

```text
       queryid       | calls | mean_ms |                                                query
---------------------+-------+---------+------------------------------------------------------------------------------------------------------
 2413612393237116133 |     3 |    83.0 | SELECT o.order_id, o.total FROM orders o WHERE o.customer_id = $1 ORDER BY o.order_id DESC LIMIT $2
```

The `queryid` column is the query ID that `pg_stash_advice` uses later. Constants such as the customer ID and the `LIMIT` value appear as `$1` and `$2`, because one query ID covers every value. You can also find slow queries in the Neon Console. See [Monitor query performance](/docs/introduction/monitor-query-performance).

## See why the plan is slow

Run `EXPLAIN ANALYZE` to see the plan and how long each part takes:

```sql
EXPLAIN (ANALYZE, COSTS OFF, BUFFERS OFF)
SELECT o.order_id, o.total
FROM orders o
WHERE o.customer_id = 50
ORDER BY o.order_id DESC
LIMIT 10;
```

```text
                                               QUERY PLAN
---------------------------------------------------------------------------------------------------------
 Limit (actual time=78.692..78.789 rows=10.00 loops=1)
   ->  Index Scan Backward using orders_pkey on orders o (actual time=78.691..78.787 rows=10.00 loops=1)
         Filter: (customer_id = 50)
         Rows Removed by Filter: 700942
         Index Searches: 1
 Planning Time: 0.073 ms
 Execution Time: 78.816 ms
```

The planner reads `orders` backward through its primary key, newest order first, and stops after it finds 10 orders for customer 50. It expects to find them quickly, because it assumes customer 50's orders are spread evenly through the table. They aren't. They all have low order IDs, so Postgres reads and throws away 700,942 rows first.

A better plan is to use `orders_customer_id_idx` to fetch customer 50's 3,000 orders and sort them. The planner already picks that plan for most customers. Customer 5,000, a self-serve customer, gets it and runs in about 1 ms.

To see the planner's choices written as advice, add the `PLAN_ADVICE` option to `EXPLAIN`:

```sql
EXPLAIN (COSTS OFF, PLAN_ADVICE)
SELECT o.order_id, o.total
FROM orders o
WHERE o.customer_id = 50
ORDER BY o.order_id DESC
LIMIT 10;
```

```text
                       QUERY PLAN
---------------------------------------------------------
 Limit
   ->  Index Scan Backward using orders_pkey on orders o
         Filter: (customer_id = 50)
 Generated Plan Advice:
   INDEX_SCAN(o public.orders_pkey)
   NO_GATHER(o)
```

Each line describes one decision, using the table aliases from the query:

- `INDEX_SCAN(o public.orders_pkey)`: `orders` (alias `o`) is scanned with the `orders_pkey` index. This is the choice to change.
- `NO_GATHER(o)`: `orders` isn't scanned in parallel.

For queries with joins, the advice also describes the join order and join method, such as `JOIN_ORDER(c o)` and `HASH_JOIN(c)`. For the full list, see [Advice tags](https://www.postgresql.org/docs/19/pgplanadvice.html) in the PostgreSQL documentation.

## Test advice in a session

Set `pg_plan_advice.advice` to apply advice to queries in your current session. A common approach is to copy the generated advice and change only the part you want to enforce. Here, the advice tells the planner to scan `orders` with `orders_customer_id_idx`:

```sql
SET pg_plan_advice.advice = 'INDEX_SCAN(o orders_customer_id_idx)';

EXPLAIN (ANALYZE, COSTS OFF, BUFFERS OFF)
SELECT o.order_id, o.total
FROM orders o
WHERE o.customer_id = 50
ORDER BY o.order_id DESC
LIMIT 10;
```

```text
                                                   QUERY PLAN
-----------------------------------------------------------------------------------------------------------------
 Limit (actual time=1.380..1.381 rows=10.00 loops=1)
   ->  Sort (actual time=1.379..1.379 rows=10.00 loops=1)
         Sort Key: order_id DESC
         Sort Method: top-N heapsort  Memory: 25kB
         ->  Index Scan using orders_customer_id_idx on orders o (actual time=0.021..1.090 rows=3000.00 loops=1)
               Index Cond: (customer_id = 50)
               Index Searches: 1
 Planning Time: 0.101 ms
 Supplied Plan Advice:
   INDEX_SCAN(o orders_customer_id_idx) /* matched */
 Execution Time: 1.406 ms
```

The query went from about 79 ms to about 1.4 ms. Always compare `EXPLAIN ANALYZE` timings before you keep advice. A plan that looks better can still be slower.

`EXPLAIN` lists each supplied advice item with feedback, so you can tell whether it was used. Here's what you see when the advice doesn't fit the query:

```sql
SET pg_plan_advice.advice = 'INDEX_SCAN(o no_such_index) SEQ_SCAN(x)';

EXPLAIN (COSTS OFF)
SELECT o.order_id, o.total
FROM orders o
WHERE o.customer_id = 50
ORDER BY o.order_id DESC
LIMIT 10;
```

```text
 Supplied Plan Advice:
   INDEX_SCAN(o no_such_index) /* matched, inapplicable, failed */
   SEQ_SCAN(x) /* not matched */
```

- `matched`: the advice found its target table.
- `inapplicable`: the advice can't be applied, here because the index doesn't exist.
- `failed`: the plan doesn't follow the advice.
- `not matched`: the query has no table with alias `x`.

Advice never makes a query fail. If advice can't be followed, Postgres still plans the query, and the plan can be worse than having no advice at all. Always check the feedback.

Clear the session advice when you're done:

```sql
RESET pg_plan_advice.advice;
```

## Stash advice for the query

Session advice only affects your own session. To apply advice to every session that runs the query, including your application's, store it in a stash with `pg_stash_advice`. A stash maps query IDs to advice strings.

### Install the extension

Install the extension in your database:

```sql
CREATE EXTENSION IF NOT EXISTS pg_stash_advice;
```

To create stashes and change their contents, use a role that's a member of `neon_superuser`, such as the role created with your project or a role created in the Neon Console or API. For more about these roles, see [Manage roles](/docs/manage/roles).

### Find the query ID

Advice is stored by query ID. If you found the query in `pg_stat_statements`, use its `queryid`. You can also get the ID from `EXPLAIN (VERBOSE)`:

```sql
EXPLAIN (VERBOSE, COSTS OFF)
SELECT o.order_id, o.total
FROM orders o
WHERE o.customer_id = 50
ORDER BY o.order_id DESC
LIMIT 10;
```

```text
 ...
 Query Identifier: 2413612393237116133
```

Query IDs ignore constant values, so this ID covers any customer ID and any `LIMIT` value. A change to the query's structure, such as removing the `LIMIT` or adding a column, gives it a different ID. Query IDs also differ between databases, so use the ID from your own database.

### Create a stash and add advice

Create a stash, then store the advice for the query ID:

```sql
SELECT pg_create_advice_stash('app_stash');

SELECT pg_set_stashed_advice('app_stash', 2413612393237116133, 'INDEX_SCAN(o orders_customer_id_idx)');
```

Check the stash and its contents:

```sql
SELECT * FROM pg_get_advice_stashes();

SELECT * FROM pg_get_advice_stash_contents('app_stash');
```

```text
 stash_name | num_entries
------------+-------------
 app_stash  |           1

 stash_name |      query_id       |            advice_string
------------+---------------------+--------------------------------------
 app_stash  | 2413612393237116133 | INDEX_SCAN(o orders_customer_id_idx)
```

### Choose where the stash applies

Stashed advice applies only in sessions where `pg_stash_advice.stash_name` names the stash. You can set it at different levels:

```sql
-- Current session only
SET pg_stash_advice.stash_name = 'app_stash';

-- Every new session for a role
ALTER ROLE neondb_owner SET pg_stash_advice.stash_name = 'app_stash';

-- Every new session in a database
ALTER DATABASE neondb SET pg_stash_advice.stash_name = 'app_stash';
```

`ALTER ROLE` and `ALTER DATABASE` take effect for new connections. Setting it on the role your application connects with applies the advice to the application without changing its code.

### Check that the advice applies

In a new session for the role, run `EXPLAIN ANALYZE` on the query with a different enterprise customer:

```sql
EXPLAIN (ANALYZE, COSTS OFF, BUFFERS OFF)
SELECT o.order_id, o.total
FROM orders o
WHERE o.customer_id = 77
ORDER BY o.order_id DESC
LIMIT 10;
```

```text
                                                   QUERY PLAN
-----------------------------------------------------------------------------------------------------------------
 Limit (actual time=4.326..4.328 rows=10.00 loops=1)
   ->  Sort (actual time=4.324..4.325 rows=10.00 loops=1)
         Sort Key: order_id DESC
         Sort Method: top-N heapsort  Memory: 25kB
         ->  Index Scan using orders_customer_id_idx on orders o (actual time=1.002..3.987 rows=3000.00 loops=1)
               Index Cond: (customer_id = 77)
               Index Searches: 1
 Planning Time: 0.315 ms
 Supplied Plan Advice:
   INDEX_SCAN(o orders_customer_id_idx) /* matched */
 Execution Time: 4.386 ms
```

The stashed advice applies even though the customer ID is different. It applies to self-serve customers too, which already got this plan, so their queries stay fast.

Advice is applied only when a query is planned. Prepared statements and PL/pgSQL functions can keep using a cached plan after you change a stash. Run `DISCARD PLANS` in a session to force those queries to be planned again.

### Remove advice

To remove one entry, set its advice to `NULL`. To remove a stash and all its entries, drop it:

```sql
SELECT pg_set_stashed_advice('app_stash', 2413612393237116133, NULL);

SELECT pg_drop_advice_stash('app_stash');
```

If you set `pg_stash_advice.stash_name` on a role or database, reset it too:

```sql
ALTER ROLE neondb_owner RESET pg_stash_advice.stash_name;

ALTER DATABASE neondb RESET pg_stash_advice.stash_name;
```

## Limitations on Neon

- **Stashes don't survive a compute restart yet.** Stashes are lost when your compute restarts, including when it scales to zero and starts again. Settings made with `ALTER ROLE` and `ALTER DATABASE` are kept, but they point to a stash that no longer exists, so your queries quietly go back to the planner's own plans without an error. Keep the `pg_create_advice_stash` and `pg_set_stashed_advice` calls in a script so you can run them again after a restart. For more about restarts, see [Compute lifecycle](/docs/introduction/compute-lifecycle) and [Scale to zero](/docs/introduction/scale-to-zero).
- **New branches start with no stashes.** Stash contents aren't copied to child branches.
- **Advice can be visible to other users.** Any role can set `pg_stash_advice.stash_name`, and the PostgreSQL documentation advises assuming that advice strings may become visible to non-privileged users. Don't put sensitive information in advice strings.
- **Stashes use shared memory.** Keep stashes small, and store advice only for the queries that need it.

## Resources

- [pg_plan_advice](https://www.postgresql.org/docs/19/pgplanadvice.html) in the PostgreSQL documentation
- [pg_stash_advice](https://www.postgresql.org/docs/19/pgstashadvice.html) in the PostgreSQL documentation
- [pg_plan_advice: Plan Stability and User Planner Control for PostgreSQL?](https://rhaas.blogspot.com/2026/03/pgplanadvice-plan-stability-and-user.html), by Robert Haas, the modules' author
- [PostgreSQL 19 pg_plan_advice](/postgresql/postgresql-19/pg-plan-advice) tutorial

<NeedHelp/>
