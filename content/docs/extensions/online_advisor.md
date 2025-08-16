---
title: The online_advisor extension
subtitle: Get index, statistics, and prepared statement recommendations based on your
  query workload
enableTableOfContents: true
updatedOn: '2025-08-15T16:04:35.020Z'
---

The `online_advisor` extension recommends **indexes**, **extended statistics**, and **prepared statements** based on your actual query workload. It uses the same executor hook mechanism as [`auto_explain`](https://www.postgresql.org/docs/current/auto-explain.html) to collect and analyze execution data.

<CTA />

## What it does

- Suggests **indexes** when queries filter many rows
- Suggests **extended statistics** when the planner's row estimates are far off from actuals
- Identifies queries that could benefit from **prepared statements** when planning time is high

<Admonition type="note">
`online_advisor` only makes recommendations. It does not create indexes or statistics for you.
</Admonition>

## Requirements

- PostgreSQL **14–17**
- For Postgres 14-16 only, `online_advisor` must be added to [`shared_preload_libraries`](/docs/extensions/pg-extensions#extensions-with-preloaded-libraries) before you can install it via `CREATE EXTENSION`.
- Create the extension in every database you want to inspect
- Activate it by calling any provided function (for example, `get_executor_stats()`)

### Version availability

Please refer to the [Supported Postgres extensions](/docs/extensions/pg-extensions) page for the latest supported version of `online_advisor` on Neon.

## Enable the online_advisor extension

<Admonition type="important">
Before you can create the `online_advisor` extension **on Neon Postgres 14-16**, you must enable the `online_advisor` preloaded library. See [Extensions with preloaded libraries](/docs/extensions/pg-extensions#extensions-with-preloaded-libraries) for instructions. This step is not required on Postgres 17 projects.
</Admonition>

You can create the extension in each target database using `CREATE EXTENSION`:

```sql
CREATE EXTENSION online_advisor;
```

For information about using the Neon SQL Editor, see [Query with Neon's SQL Editor](/docs/get-started/query-with-neon-sql-editor). For information about using the `psql` client with Neon, see [Connect with psql](/docs/connect/query-with-psql-editor).

## Start collecting recommendations

1. Activate the extension by calling any function:

   ```sql
   SELECT get_executor_stats();
   ```

2. Run your workload to collect data.

3. View recommendations:

   ```sql
   -- Proposed indexes
   SELECT * FROM proposed_indexes ORDER BY elapsed_sec DESC;

   -- Proposed extended statistics
   SELECT * FROM proposed_statistics ORDER BY elapsed_sec DESC;
   ```

## Apply accepted recommendations

Run the `create_index` or `create_statistics` statement from the views, then analyze the table:

```sql
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_customer_date ON orders(customer_id, order_date);
VACUUM (ANALYZE) orders;
```

## Configure thresholds

You can tune `online_advisor` with these settings:

| Setting                                  | Default | Description                                                                              |
| ---------------------------------------- | ------- | ---------------------------------------------------------------------------------------- |
| `online_advisor.filtered_threshold`      | `1000`  | Minimum filtered rows in a node to suggest an index.                                     |
| `online_advisor.misestimation_threshold` | `10`    | Minimum actual/estimated row ratio to flag misestimation.                                |
| `online_advisor.min_rows`                | `1000`  | Minimum returned rows before misestimation is considered.                                |
| `online_advisor.max_index_proposals`     | `1000`  | Max tracked clauses for index proposals (system-level, read-only on Neon).               |
| `online_advisor.max_stat_proposals`      | `1000`  | Max tracked clauses for extended statistics proposals (system-level, read-only on Neon). |
| `online_advisor.do_instrumentation`      | `on`    | Toggle data collection.                                                                  |
| `online_advisor.log_duration`            | `off`   | Log planning/execution time for each query.                                              |
| `online_advisor.prepare_threshold`       | `1.0`   | Planning/execution time ratio above which to suggest prepared statements.                |

<Admonition type="note">
On Neon, you can only modify session-level settings using `SET`. System-level settings like `online_advisor.max_index_proposals` and `online_advisor.max_stat_proposals` use default values and cannot be changed. If you need different system-level settings, reach out to Neon Support.
</Admonition>

Change a setting for the current session:

```sql
SET online_advisor.filtered_threshold = 2000;
```

## Check planning and execution stats

Use `get_executor_stats()` to see planning and execution times and whether prepared statements might help:

```sql
SELECT * FROM get_executor_stats(false); -- false = do not reset counters
```

Look at `avg_planning_overhead`. Values greater than `1` suggest that some queries would benefit from prepared statements.

## Combine or separate index proposals

By default, `online_advisor` tries to combine related predicates into a single compound index. To view separate recommendations for each predicate:

```sql
SELECT * FROM propose_indexes(false);
```

## Limitations

- Does not check operator ordering for compound indexes
- Does not suggest indexes for joins or `ORDER BY` clauses
- Does not estimate the benefit of adding an index — pair with [HypoPG](https://github.com/HypoPG/hypopg#) if you want to simulate usage
- Recommendations are per database

## Remove the extension

```sql
DROP EXTENSION IF EXISTS online_advisor;
```

If you're not using it anywhere, remove it from `shared_preload_libraries` and restart.

## Example workflow

```sql
-- Activate and run workload
SELECT get_executor_stats();

-- View index proposals
SELECT create_index, n_filtered, n_called, elapsed_sec
FROM proposed_indexes
ORDER BY elapsed_sec DESC
LIMIT 10;

-- View extended statistics proposals
SELECT create_statistics, misestimation, n_called, elapsed_sec
FROM proposed_statistics
ORDER BY misestimation DESC
LIMIT 10;

-- Apply a recommendation
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_customer_date ON orders(customer_id, order_date);
VACUUM (ANALYZE) orders;

-- Check planning/execution times
SELECT * FROM get_executor_stats(true); -- reset after reading
```

## Resources

- [online_advisor GitHub repository](https://github.com/knizhnik/online_advisor)
- [PostgreSQL auto_explain documentation](https://www.postgresql.org/docs/current/auto-explain.html)
