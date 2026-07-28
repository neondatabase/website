---
title: 'PostgreSQL 19 Query Writing Improvements'
page_title: 'PostgreSQL 19 Query Improvements - IGNORE NULLS and Memoize Estimates'
page_description: 'Learn about PostgreSQL 19 query writing improvements including IGNORE NULLS for window functions and Memoize plan estimates in EXPLAIN.'
ogImage: ''
updatedOn: '2026-06-04T14:03:00.799Z'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL 19 JSON COPY TO'
  slug: 'postgresql-19/json-copy-to'
nextLink:
  title: 'PostgreSQL 19 Schema Management'
  slug: 'postgresql-19/schema-management'
---

<Admonition type="note" title="PostgreSQL 19 Beta 1 is here">
[PostgreSQL 19 Beta 1 was released on June 4, 2026](https://www.postgresql.org/about/news/postgresql-19-beta-1-released-3313/), so you can try the new query features for yourself ahead of the final release expected later in 2026. Beta 1 includes `IGNORE NULLS`/`RESPECT NULLS` for window functions and Memoize cache estimates in `EXPLAIN` output.
</Admonition>

**Summary**: PostgreSQL 19 adds `IGNORE NULLS` and `RESPECT NULLS` options for window functions, and Memoize cost estimates in EXPLAIN output. These features improve time-series queries and make query plan analysis easier.

## IGNORE NULLS and RESPECT NULLS for Window Functions

PostgreSQL 19 adds the SQL-standard `IGNORE NULLS` and `RESPECT NULLS` options to five window functions. This matters for time-series data, sensor readings, and any dataset with gaps.

### Supported Functions

| Function        | What IGNORE NULLS does                               |
| --------------- | ---------------------------------------------------- |
| `first_value()` | Returns the first non-null value in the window frame |
| `last_value()`  | Returns the last non-null value in the window frame  |
| `nth_value()`   | Returns the Nth non-null value in the window frame   |
| `lag()`         | Looks back, skipping null rows                       |
| `lead()`        | Looks forward, skipping null rows                    |

`RESPECT NULLS` is the default and preserves existing behavior (nulls are included as normal values).

### Syntax

The null treatment clause goes between the function call and `OVER`:

```sql
last_value(reading) IGNORE NULLS OVER (
    PARTITION BY sensor_id ORDER BY ts
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
)
```

### Sample Setup

The window-function examples below use a small sensor-readings table with intentional null gaps so you can see how `IGNORE NULLS` fills them.

```sql
CREATE TABLE sensor_readings (
    sensor_id INT,
    ts TIMESTAMP,
    temperature DECIMAL(5,2),
    humidity DECIMAL(5,2)
);

INSERT INTO sensor_readings VALUES
    (1, '2025-01-01 08:00', 22.5, 45.0),
    (1, '2025-01-01 09:00', NULL, 46.2),
    (1, '2025-01-01 10:00', NULL, NULL),
    (1, '2025-01-01 11:00', 23.1, 44.8),
    (1, '2025-01-01 12:00', NULL, 45.5),
    (1, '2025-01-01 13:00', 24.0, NULL);
```

### Filling Gaps with last_value

The most common use case: carry forward the last known reading through gaps:

```sql
SELECT
    sensor_id,
    ts,
    temperature,
    last_value(temperature) IGNORE NULLS OVER (
        PARTITION BY sensor_id ORDER BY ts
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS last_known_temp
FROM sensor_readings;
```

```
 sensor_id |         ts          | temperature | last_known_temp
-----------+---------------------+-------------+-----------------
         1 | 2025-01-01 08:00:00 |       22.50 |           22.50
         1 | 2025-01-01 09:00:00 |             |           22.50
         1 | 2025-01-01 10:00:00 |             |           22.50
         1 | 2025-01-01 11:00:00 |       23.10 |           23.10
         1 | 2025-01-01 12:00:00 |             |           23.10
         1 | 2025-01-01 13:00:00 |       24.00 |           24.00
```

Without `IGNORE NULLS`, the null readings at 09:00, 10:00, and 12:00 would return null for `last_value`, making gap-filling impossible without a CTE or subquery workaround.

### Forward-Filling with lead

Find the next known reading for each gap:

```sql
SELECT
    sensor_id,
    ts,
    temperature,
    lead(temperature) IGNORE NULLS OVER (
        PARTITION BY sensor_id ORDER BY ts
    ) AS next_known_temp
FROM sensor_readings;
```

### Previous Workaround

Before `IGNORE NULLS`, filling gaps required a self-join or a subquery:

```sql
-- The old way (PG18 and earlier)
SELECT s.*,
    (SELECT temperature FROM sensor_readings s2
     WHERE s2.sensor_id = s.sensor_id
       AND s2.ts <= s.ts
       AND s2.temperature IS NOT NULL
     ORDER BY s2.ts DESC LIMIT 1) AS last_known_temp
FROM sensor_readings s;
```

`IGNORE NULLS` replaces this with a single, readable window function call.

## Memoize Plan Estimates in EXPLAIN

PostgreSQL 19 enhances EXPLAIN output for Memoize nodes by showing the planner's estimated cache performance. Combined with the broader [EXPLAIN improvements landed in PostgreSQL 18](/postgresql/postgresql-18/enhanced-explain), it becomes much easier to understand why the planner chose Memoize and whether its estimates are reasonable.

### What Memoize Does

Memoize (introduced in PostgreSQL 14) caches the results of inner-side scans in nested loop joins. When the same join key appears multiple times, Memoize returns the cached result instead of re-executing the inner scan.

### New EXPLAIN Output

A small two-table setup demonstrates the new annotations. Create users and orders with skewed cardinality so the planner picks Memoize for the nested-loop join.

```sql
CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT);
CREATE TABLE orders (id SERIAL PRIMARY KEY, user_id INT REFERENCES users(id));

INSERT INTO users SELECT g, 'User ' || g FROM generate_series(1, 100) g;
INSERT INTO orders SELECT g, (g % 5) + 1 FROM generate_series(1, 10000) g;
ANALYZE users; ANALYZE orders;

EXPLAIN SELECT u.name, o.id
FROM orders o JOIN users u ON o.user_id = u.id;
```

The Memoize node now includes an `Estimates` line:

```
 Nested Loop  (cost=0.30..418.55 rows=10000 width=40)
   ->  Seq Scan on orders o  (cost=0.00..155.00 rows=10000 width=8)
   ->  Memoize  (cost=0.30..0.32 rows=1 width=36)
         Cache Key: o.user_id
         Cache Mode: logical
         Estimates: capacity=6 distinct keys=5 lookups=10000 hit percent=99.95%
         ->  Index Scan using users_pkey on users u  (cost=0.28..0.30 rows=1 width=36)
               Index Cond: (id = o.user_id)
```

### Understanding the Estimates

| Metric            | Meaning                                                   |
| ----------------- | --------------------------------------------------------- |
| **capacity**      | How many entries the cache can hold (based on `work_mem`) |
| **distinct keys** | Estimated number of unique lookup keys                    |
| **lookups**       | Expected total number of cache lookups                    |
| **hit percent**   | Projected cache hit ratio                                 |

In the example above, the planner estimates 5 distinct user IDs across 10,000 orders, with a cache capacity of 6. Since all 5 keys fit in the cache, the estimated hit rate is 99.95%.

### When to Investigate

If you see unexpected Memoize behavior:

- **Low hit percent with high distinct keys**: The cache may be too small. Increase `work_mem` to fit more entries.
- **Capacity less than distinct keys**: Not all keys fit in the cache, causing evictions. Consider whether Memoize is actually helping.
- **Distinct keys looks wrong**: The planner's `n_distinct` estimate may be off. Run `ANALYZE` or set manual statistics with `ALTER TABLE ... ALTER COLUMN ... SET (n_distinct = ...)`.

Compare the estimates with actual values from `EXPLAIN (ANALYZE)`:

```sql
EXPLAIN (ANALYZE, COSTS OFF) SELECT u.name, o.id
FROM orders o JOIN users u ON o.user_id = u.id;
```

The ANALYZE output shows actual hits, misses, evictions, and memory usage, which you can compare against the estimates to validate the planner's assumptions.

## Summary

These query improvements in PostgreSQL 19 address everyday friction points. `IGNORE NULLS` makes time-series gap-filling a one-liner instead of a subquery workaround. And the Memoize EXPLAIN estimates give you visibility into the planner's caching decisions without running the query first.

## References

- [Commit `25a30bbd`: Add IGNORE NULLS/RESPECT NULLS option to Window functions](https://git.postgresql.org/gitweb/?p=postgresql.git;a=commit;h=25a30bbd)
- [PostgreSQL devel docs: Window Functions](https://www.postgresql.org/docs/devel/functions-window.html)
