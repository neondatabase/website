---
title: 'PostgreSQL 19 pg_plan_advice'
page_title: 'PostgreSQL 19 pg_plan_advice - Query Plan Hints for PostgreSQL'
page_description: 'Learn how to use PostgreSQL 19 pg_plan_advice to stabilize query plans, override planner decisions, and diagnose performance issues with plan hints.'
ogImage: ''
updatedOn: '2026-04-14T00:00:00+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL 19 Temporal Data Operations'
  slug: 'postgresql-19/temporal-data-operations'
nextLink:
  title: 'PostgreSQL 19 REPACK Command'
  slug: 'postgresql-19/repack-command'
---

**Summary**: PostgreSQL 19 introduces `pg_plan_advice`, a contrib module that brings query plan hints to PostgreSQL. Unlike Oracle or MySQL hints embedded in SQL comments, pg_plan_advice uses a GUC setting and an `EXPLAIN (PLAN_ADVICE)` workflow to generate, apply, and validate plan advice externally from query text.

## Introduction to pg_plan_advice

PostgreSQL has historically avoided query plan hints. The community position was that hints create maintenance burdens, break on upgrades, discourage root-cause investigation, and reduce the number of optimizer bug reports. If the planner makes a bad choice, the right fix is better statistics or a planner improvement, not a hint.

That position has softened. Sometimes you need to lock in a known-good plan for a critical query while you investigate a regression. Sometimes the planner's cost estimates are wrong and you know it. Sometimes you are running a workload where a specific join strategy is always correct regardless of statistics.

`pg_plan_advice` addresses these scenarios while avoiding the worst problems of traditional hint systems. Advice lives outside the query text (in a GUC setting), it is generated from actual plans rather than hand-written, and a feedback system tells you exactly which hints were honored and which were ignored.

## Installation

`pg_plan_advice` ships as a contrib module. No `CREATE EXTENSION` is needed - you load it as a shared library:

```sql
-- For the current session only
LOAD 'pg_plan_advice';

-- Or permanently in postgresql.conf
-- shared_preload_libraries = 'pg_plan_advice'
```

You can also use `session_preload_libraries` for per-session loading without a server restart.

## The Generate-Then-Replay Workflow

The typical workflow for pg_plan_advice has two steps: generate advice from a plan you want to keep, then feed that advice back to lock the plan.

### Step 1: Generate Advice

Use `EXPLAIN (PLAN_ADVICE)` to get the planner's current choices expressed as advice strings:

```sql
EXPLAIN (COSTS OFF, PLAN_ADVICE)
SELECT o.*, c.name
FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE o.total > 1000;
```

The output includes the normal plan tree plus a generated advice string:

```
 Hash Join
   Hash Cond: (o.customer_id = c.id)
   ->  Seq Scan on orders o
         Filter: (total > 1000)
   ->  Hash
         ->  Seq Scan on customers c
 Generated Plan Advice:
   JOIN_ORDER(o c)  HASH_JOIN(c)  SEQ_SCAN(o c)  NO_GATHER(o c)
```

### Step 2: Apply Advice

Set the advice string in the GUC to lock this plan:

```sql
SET pg_plan_advice.advice = 'JOIN_ORDER(o c) HASH_JOIN(c) SEQ_SCAN(o c)';
```

Now every execution of this query (or any query with matching aliases) will use the same plan regardless of changes to statistics or data distribution.

## Available Hint Types

pg_plan_advice supports hints across several categories:

### Scan Method Hints

Control how individual tables are accessed:

```sql
-- Force a sequential scan
SET pg_plan_advice.advice = 'SEQ_SCAN(orders)';

-- Force a specific index
SET pg_plan_advice.advice = 'INDEX_SCAN(orders orders_customer_id_idx)';

-- Force index-only scan
SET pg_plan_advice.advice = 'INDEX_ONLY_SCAN(orders orders_covering_idx)';

-- Force bitmap scan
SET pg_plan_advice.advice = 'BITMAP_HEAP_SCAN(orders)';
```

### Join Method Hints

Control which join algorithm is used:

```sql
-- Force hash join
SET pg_plan_advice.advice = 'HASH_JOIN(customers)';

-- Force merge join
SET pg_plan_advice.advice = 'MERGE_JOIN_PLAIN(customers)';

-- Force nested loop with memoize
SET pg_plan_advice.advice = 'NESTED_LOOP_MEMOIZE(customers)';
```

### Join Order Hints

Control the order in which tables are joined:

```sql
-- Constrained order: must join in this exact sequence
SET pg_plan_advice.advice = 'JOIN_ORDER(orders customers products)';

-- Unconstrained order (use braces): join these tables together, order flexible
SET pg_plan_advice.advice = 'JOIN_ORDER({orders customers} products)';
```

### Parallel Execution Hints

Control whether parallel workers are used:

```sql
SET pg_plan_advice.advice = 'GATHER(orders)';        -- Force parallel
SET pg_plan_advice.advice = 'NO_GATHER(orders)';     -- Prevent parallel
SET pg_plan_advice.advice = 'GATHER_MERGE(orders)';  -- Force gather merge
```

## Feedback and Validation

One of the key design decisions in pg_plan_advice is the feedback system. When you apply advice, EXPLAIN tells you whether each hint was actually used:

```sql
SET pg_plan_advice.advice = 'HASH_JOIN(c) INDEX_SCAN(o orders_total_idx)';
SET pg_plan_advice.feedback_warnings = on;

EXPLAIN (COSTS OFF)
SELECT o.*, c.name
FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE o.total > 1000;
```

Each hint in the output is annotated with one of:

- **matched**: The hint was applied as requested
- **partially matched**: Some aspects of the hint were applied
- **not matched**: The hint could not be applied, with a reason:
  - `inapplicable`: The hint does not apply to this query
  - `conflicting`: Multiple hints conflict with each other
  - `failed`: The planner could not produce a plan with this hint

This feedback loop is what separates pg_plan_advice from traditional hint systems. You know immediately whether your advice is doing what you intended.

## Practical examples

Two common scenarios where `pg_plan_advice` earns its keep: locking in a known-good plan for a critical query, and forcing a better plan when the optimizer's estimates are off.

### Stabilizing a critical query

After a statistics update causes a query plan regression:

```sql
-- 1. Get the good plan's advice before the regression
EXPLAIN (PLAN_ADVICE, COSTS OFF)
SELECT * FROM transactions t
JOIN accounts a ON t.account_id = a.id
WHERE t.created_at > now() - interval '24 hours';

-- Generated Plan Advice:
--   JOIN_ORDER(t a) NESTED_LOOP_PLAIN(a) INDEX_SCAN(t transactions_created_at_idx)

-- 2. Lock this plan
SET pg_plan_advice.advice =
  'JOIN_ORDER(t a) NESTED_LOOP_PLAIN(a) INDEX_SCAN(t transactions_created_at_idx)';
```

### Forcing an Index Scan

When you know the planner's row estimate is wrong:

```sql
-- Planner thinks seq scan is cheaper, but you know the selectivity is low
SET pg_plan_advice.advice = 'INDEX_SCAN(events events_type_idx)';

SELECT * FROM events WHERE event_type = 'critical_alert';
```

### Per-Session Advice

Advice is set via a GUC, so you can scope it to specific sessions or connections:

```sql
-- In your application's connection setup
SET pg_plan_advice.advice = 'HASH_JOIN(c) INDEX_SCAN(o orders_pkey)';

-- All queries in this session get the advice
-- Other sessions are unaffected
```

## When Not to Use Plan Advice

pg_plan_advice is a diagnostic and stabilization tool, not a permanent solution for every slow query. Consider these guidelines:

**Use plan advice when:**

- A plan regression needs immediate stabilization while you investigate
- You have a critical query where the optimal plan is known and stable
- You are debugging planner behavior and need to test specific strategies

**Prefer other approaches when:**

- Statistics are stale (run `ANALYZE` instead)
- Indexes are missing (create the right index)
- The query itself can be rewritten for better plans
- Data distribution changes frequently (advice prevents the planner from adapting)

## Limitations

- Cannot control aggregation strategy (sort vs hash agg)
- Cannot control set operations (UNION, INTERSECT, EXCEPT)
- Cannot force plans the planner refused to consider entirely
- Advice applies by alias matching, so queries with different aliases need separate advice strings
- `DO_NOT_SCAN` usually cannot fully remove a relation from the plan

## Summary

`pg_plan_advice` brings query plan hints to PostgreSQL in a way that addresses the historical concerns about hint systems. By keeping advice external to query text, providing a generate-then-replay workflow, and including a feedback mechanism, it gives DBAs a practical tool for plan stabilization and debugging without the maintenance burden of embedded hints.

## References

- [Commit `5883ff30`: Add pg_plan_advice contrib module](https://git.postgresql.org/gitweb/?p=postgresql.git;a=commit;h=5883ff30)
- [PostgreSQL devel docs: pg_plan_advice](https://www.postgresql.org/docs/devel/pgplanadvice.html)
