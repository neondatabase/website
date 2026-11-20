---
title: The pg_stash_advice and pg_plan_advice extensions
subtitle: Generate, test, and automatically apply query plan advice in Postgres 19
summary: >-
  Postgres 19 adds pg_plan_advice, which describes and constrains planner
  decisions such as join order, join method, and scan method, and
  pg_stash_advice, which stores that advice by query ID and applies it
  automatically without changing application SQL. On Neon, pg_stash_advice is
  preloaded on Postgres 19 projects and loads pg_plan_advice with it. Use this
  page to generate advice with EXPLAIN (PLAN_ADVICE), test it in a session,
  stash it for a query ID, and apply it per session, role, or database. Advice
  stashes aren't saved across compute restarts yet.
enableTableOfContents: true
tag: new
---

Postgres usually picks a good query plan, but not always. When the planner chooses a bad plan for an important query, the usual fixes are better statistics, a new index, or a rewritten query. Postgres 19 adds a more direct option with two modules that work together:

- `pg_plan_advice` describes the planner's decisions in a short advice language, such as `JOIN_ORDER(c o)` or `SEQ_SCAN(o)`, and lets you supply advice that constrains those decisions.
- `pg_stash_advice` stores advice by query ID and applies it automatically whenever a matching query is planned, so you don't have to change your application's SQL.

<CTA />

This guide covers:

- [Generating advice for a query](#generate-plan-advice)
- [Testing advice in a session](#test-advice-in-a-session)
- [Stashing advice so it applies automatically](#stash-advice-for-a-query)
- [Limitations to know on Neon](#limitations-on-neon)

<Admonition type="note">
`pg_plan_advice` and `pg_stash_advice` are open-source PostgreSQL contrib modules. For full details, see [pg_plan_advice](https://www.postgresql.org/docs/19/pgplanadvice.html) and [pg_stash_advice](https://www.postgresql.org/docs/19/pgstashadvice.html) in the PostgreSQL documentation.
</Admonition>

### Version availability

Both modules are available on Postgres 19 only. On Neon Postgres 19 projects, `pg_stash_advice` is preloaded by default, and loading it also loads `pg_plan_advice`, so `EXPLAIN (PLAN_ADVICE)` and the `pg_plan_advice.*` settings work without any setup. `pg_plan_advice` isn't a `CREATE EXTENSION` extension, so it doesn't appear in `pg_available_extensions`. For the `pg_stash_advice` version, see [Supported Postgres extensions](/docs/extensions/pg-extensions).

You can confirm the library is loaded by running:

```sql
SHOW shared_preload_libraries;
```

```text
                           shared_preload_libraries
-------------------------------------------------------------------------------
 neon,pg_stat_statements,pg_cron,lakebase_vector,lakebase_text,pg_stash_advice
```

### Use advice sparingly

Advice overrides the planner, which normally adapts its plan as your data changes. Advice that helps today can produce a very poor plan later. Use it for specific queries where the planner gets the plan wrong, keep advice strings as small as possible, and look at statistics and indexes first.

## Example tables

The examples in this guide use two tables:

```sql
CREATE TABLE customers (
  id   int PRIMARY KEY,
  name text NOT NULL
);

CREATE TABLE orders (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id int NOT NULL REFERENCES customers (id),
  total       numeric(10,2) NOT NULL
);

INSERT INTO customers
SELECT g, 'customer ' || g FROM generate_series(1, 1000) AS g;

INSERT INTO orders (customer_id, total)
SELECT (random() * 999)::int + 1, round((random() * 2000)::numeric, 2)
FROM generate_series(1, 50000);

CREATE INDEX orders_customer_id_idx ON orders (customer_id);
ANALYZE customers, orders;
```

## Generate plan advice

Add the `PLAN_ADVICE` option to `EXPLAIN` to see the planner's choices written as advice:

```sql
EXPLAIN (COSTS OFF, PLAN_ADVICE)
SELECT c.name, o.total
FROM orders o
JOIN customers c ON c.id = o.customer_id
WHERE o.customer_id = 42;
```

```text
                       QUERY PLAN
---------------------------------------------------------
 Nested Loop
   ->  Index Scan using customers_pkey on customers c
         Index Cond: (id = 42)
   ->  Bitmap Heap Scan on orders o
         Recheck Cond: (customer_id = 42)
         ->  Bitmap Index Scan on orders_customer_id_idx
               Index Cond: (customer_id = 42)
 Generated Plan Advice:
   JOIN_ORDER(c o)
   NESTED_LOOP_PLAIN(o)
   BITMAP_HEAP_SCAN(o)
   INDEX_SCAN(c public.customers_pkey)
   NO_GATHER(o c)
```

Each line describes one decision, using the table aliases from the query:

- `JOIN_ORDER(c o)`: `customers` is scanned first, then joined to `orders`.
- `NESTED_LOOP_PLAIN(o)`: `orders` is on the inner side of a nested loop join.
- `BITMAP_HEAP_SCAN(o)` and `INDEX_SCAN(c public.customers_pkey)`: the scan method for each table.
- `NO_GATHER(o c)`: neither table is scanned in parallel.

Other advice covers hash and merge joins, index-only scans, partitionwise joins, and parallel query. For the full list, see [Advice tags](https://www.postgresql.org/docs/19/pgplanadvice.html) in the PostgreSQL documentation.

## Test advice in a session

Set `pg_plan_advice.advice` to apply advice to queries in your current session. A common approach is to copy the generated advice and keep only the part you want to enforce. This example forces a sequential scan of `orders`:

```sql
SET pg_plan_advice.advice = 'SEQ_SCAN(o)';

EXPLAIN (COSTS OFF)
SELECT c.name, o.total
FROM orders o
JOIN customers c ON c.id = o.customer_id
WHERE o.customer_id = 42;
```

```text
                      QUERY PLAN
------------------------------------------------------
 Nested Loop
   ->  Index Scan using customers_pkey on customers c
         Index Cond: (id = 42)
   ->  Seq Scan on orders o
         Filter: (customer_id = 42)
 Supplied Plan Advice:
   SEQ_SCAN(o) /* matched */
```

`EXPLAIN` lists each supplied advice item with feedback, so you can tell whether it was used. Here's what you see when some of the advice doesn't fit the query:

```sql
SET pg_plan_advice.advice = 'SEQ_SCAN(o) INDEX_SCAN(c no_such_index) HASH_JOIN(x)';

EXPLAIN (COSTS OFF)
SELECT c.name, o.total
FROM orders o
JOIN customers c ON c.id = o.customer_id
WHERE o.customer_id = 42;
```

```text
 Supplied Plan Advice:
   SEQ_SCAN(o) /* matched */
   INDEX_SCAN(c no_such_index) /* matched, inapplicable, failed */
   HASH_JOIN(x) /* not matched */
```

- `matched`: the advice found its targets and was applied.
- `inapplicable`: the advice can't be applied, here because the index doesn't exist.
- `failed`: the plan doesn't follow the advice.
- `not matched`: the query has no table with alias `x`.

Advice never makes a query fail. If advice can't be followed, Postgres still plans the query, and the plan can be worse than having no advice at all. Always check the feedback.

Clear the session advice when you're done:

```sql
RESET pg_plan_advice.advice;
```

## Stash advice for a query

Session advice only affects your own session. To apply advice to every session that runs a query, including your application's, store it in a stash with `pg_stash_advice`. A stash maps query IDs to advice strings.

### Enable the extension

Install the extension in your database:

```sql
CREATE EXTENSION IF NOT EXISTS pg_stash_advice;
```

To create stashes and change their contents, use a role that's a member of `neon_superuser`, such as the role created with your project or a role created in the Neon Console or API. For more about these roles, see [Manage roles](/docs/manage/roles).

### Find the query ID

Advice is stored by query ID, which identifies the shape of a query. Run `EXPLAIN (VERBOSE)` to see the ID:

```sql
EXPLAIN (VERBOSE, COSTS OFF)
SELECT c.name, o.total
FROM orders o
JOIN customers c ON c.id = o.customer_id
WHERE o.customer_id = 42;
```

```text
 ...
 Query Identifier: 7024005748528505225
```

If your application already runs the query, you can also find the ID in [`pg_stat_statements`](/docs/extensions/pg_stat_statements):

```sql
SELECT queryid, query
FROM pg_stat_statements
WHERE query LIKE 'SELECT c.name, o.total%';
```

```text
       queryid       |                  query
---------------------+------------------------------------------
 7024005748528505225 | SELECT c.name, o.total                  +
                     | FROM orders o                           +
                     | JOIN customers c ON c.id = o.customer_id+
                     | WHERE o.customer_id = $1
```

Query IDs ignore constant values, so the same ID covers `customer_id = 42`, `customer_id = 7`, and so on. A change to the query's structure, such as adding `LIMIT`, gives it a different ID.

### Create a stash and add advice

Create a stash, then store advice for the query ID. Use the ID from your own database. The ID below is from the example output.

```sql
SELECT pg_create_advice_stash('app_stash');

SELECT pg_set_stashed_advice('app_stash', 7024005748528505225, 'SEQ_SCAN(o)');
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

 stash_name |      query_id       | advice_string
------------+---------------------+---------------
 app_stash  | 7024005748528505225 | SEQ_SCAN(o)
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

`ALTER ROLE` and `ALTER DATABASE` take effect for new connections. Setting it on the role your application connects with is a good way to apply advice to the application without changing its code.

### Check that the advice applies

Run `EXPLAIN` on the query in a session that uses the stash. The advice applies even though the constant is different:

```sql
SET pg_stash_advice.stash_name = 'app_stash';

EXPLAIN (COSTS OFF)
SELECT c.name, o.total
FROM orders o
JOIN customers c ON c.id = o.customer_id
WHERE o.customer_id = 7;
```

```text
                      QUERY PLAN
------------------------------------------------------
 Nested Loop
   ->  Index Scan using customers_pkey on customers c
         Index Cond: (id = 7)
   ->  Seq Scan on orders o
         Filter: (customer_id = 7)
 Supplied Plan Advice:
   SEQ_SCAN(o) /* matched */
```

If you add `LIMIT 10` to the same query, the query ID changes, no stashed advice matches, and the planner goes back to its own plan.

Advice is applied only when a query is planned. Prepared statements and PL/pgSQL functions can keep using a cached plan after you change a stash. Run `DISCARD PLANS` in a session to force those queries to be planned again.

### Remove advice

To remove one entry, set its advice to `NULL`. To remove a stash and all its entries, drop it:

```sql
SELECT pg_set_stashed_advice('app_stash', 7024005748528505225, NULL);

SELECT pg_drop_advice_stash('app_stash');
```

If you set `pg_stash_advice.stash_name` on a role or database, reset it too:

```sql
ALTER ROLE neondb_owner RESET pg_stash_advice.stash_name;

ALTER DATABASE neondb RESET pg_stash_advice.stash_name;
```

## Limitations on Neon

- **Stashes don't survive a compute restart yet.** Stashes are lost when your compute restarts, including when it scales to zero and starts again. Keep the `pg_create_advice_stash` and `pg_set_stashed_advice` calls in a script so you can run them again after a restart. Settings made with `ALTER ROLE` and `ALTER DATABASE` are kept. For more about restarts, see [Compute lifecycle](/docs/introduction/compute-lifecycle) and [Scale to zero](/docs/introduction/scale-to-zero).
- **New branches start with no stashes.** Stash contents aren't copied to child branches.
- **Advice can be visible to other users.** Any role can set `pg_stash_advice.stash_name`, and the PostgreSQL documentation advises assuming that advice strings may become visible to non-privileged users. Don't put sensitive information in advice strings.
- **Stashes use shared memory.** Keep stashes small, and store advice only for the queries that need it.

## Resources

- [pg_plan_advice](https://www.postgresql.org/docs/19/pgplanadvice.html) in the PostgreSQL documentation
- [pg_stash_advice](https://www.postgresql.org/docs/19/pgstashadvice.html) in the PostgreSQL documentation
- [pg_plan_advice: Plan Stability and User Planner Control for PostgreSQL?](https://rhaas.blogspot.com/2026/03/pgplanadvice-plan-stability-and-user.html), by Robert Haas, the modules' author
- [PostgreSQL 19 pg_plan_advice](/postgresql/postgresql-19/pg-plan-advice) tutorial

<NeedHelp/>
