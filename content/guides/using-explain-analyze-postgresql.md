---
title: Using EXPLAIN ANALYZE in PostgreSQL to Diagnose Slow Queries
subtitle: A beginner's tutorial on understanding and optimizing query performance
author: neon
enableTableOfContents: true
createdAt: '2025-05-08T00:00:00.000Z'
updatedOn: '2025-05-08T00:00:00.000Z'
---

## Introduction

When a PostgreSQL query is slow, the first step to improving it is understanding _why_ it's slow. PostgreSQL provides the `EXPLAIN` and `EXPLAIN ANALYZE` commands to peek under the hood of your SQL and see how the database plans and executes your query. In this tutorial, we'll introduce the purpose and basic syntax of these commands, learn to interpret their output (focusing on things like sequential scans vs. index scans, row estimates, and execution time), and walk through practical examples of using `EXPLAIN ANALYZE` to identify common performance issues. By the end, you'll know how to use `EXPLAIN ANALYZE` as a tool to diagnose slow queries and apply basic fixes (such as adding indexes or rewriting parts of the query) to make them faster.

## What are EXPLAIN and EXPLAIN ANALYZE?

EXPLAIN is a PostgreSQL command that shows the _query plan_ the optimizer _plans_ to use for a given query – without actually executing the query. It reveals how the database _expects_ to retrieve the data: for example, whether it will scan a table sequentially or use an index, what join strategy it will use, and estimates of how many rows it will process. This is extremely useful for understanding query performance because it shows the approach the database _thinks_ is best.

EXPLAIN ANALYZE goes a step further – it actually runs the query and then shows the plan _along with actual execution statistics_. In other words, it not only displays the plan, but also how long each step _actually_ took and how many rows were processed in reality. This allows you to compare the planner's expectations with what really happened. For example, you can see if the planner's row count estimates were accurate or if a different plan might have been better.

Basic syntax: To use these, simply prepend the keyword `EXPLAIN` to your query. For example:

```sql
EXPLAIN SELECT * FROM users WHERE id = 123;
```

This will output the planned execution without running the SELECT. To actually run the query and get actual timing, use `EXPLAIN ANALYZE`:

```sql
EXPLAIN ANALYZE SELECT * FROM users WHERE id = 123;
```

⚠️ Keep in mind: Because `EXPLAIN ANALYZE` _executes_ the query, avoid using it on queries that modify data (INSERT/UPDATE/DELETE) unless you wrap them in a transaction you can roll back, or you don't mind the changes. Otherwise, you might inadvertently change or delete data while analyzing the plan. For read-only queries, `EXPLAIN ANALYZE` is safe – just remember it will actually run potentially slow queries (so don't use it lightly on a heavy query in a production environment).

PostgreSQL 14+ (and most recent versions) support additional options with EXPLAIN, such as `EXPLAIN (ANALYZE, BUFFERS)` to show buffer I/O, or outputting the plan in JSON or YAML. In this tutorial, we'll stick to the default text format for simplicity, as it's the most human-friendly.

## Understanding the EXPLAIN ANALYZE Output

The output of `EXPLAIN` (and `EXPLAIN ANALYZE`) may look intimidating at first, but it follows a structured format. Let's break down a simple example and the key concepts you need to know to read an execution plan.

Consider a basic query:

```sql
EXPLAIN SELECT * FROM items WHERE location = 'Warehouse';
```

Suppose the `items` table has around 1,000 rows, and we want all rows where the `location` is `'Warehouse'`. The `EXPLAIN` output might look like:

```pgsql
QUERY PLAN
----------------------------------------------------------
Seq Scan on items  (cost=0.00..20.50 rows=488 width=26)
  Filter: (location = 'Warehouse'::text)
```

This output is showing a plan node called `Seq Scan on items` with some numbers in parentheses, and a sub-item `Filter` condition. Here's how to interpret it:

- Plan nodes and tree structure: The plan is structured as a tree (hierarchy) of nodes. Each line represents an operation (a node in the tree), and indentation indicates child-parent relationships. In the example above, there is a single top-level node (`Seq Scan on items`) and a child detail (`Filter: (location = 'Warehouse'::text)`). If a query had multiple steps (joins, sorts, etc.), you'd see multiple indented lines. The topmost node is the final step, and it might have one or more child nodes that feed data into it. (Think of it like an upside-down tree where children are indented below their parent.) For now, our simple query has just one node doing a sequential scan.

- Sequential scan vs. index scan: The plan node name tells you what operation is being performed. In our example, `Seq Scan on items` means a _Sequential Scan_ on the `items` table. A sequential scan is a brute-force approach that reads every row in the table to find those matching the condition. PostgreSQL decided to scan the whole `items` table and then apply the filter `location = 'Warehouse'` to each row. If the table had an index on the `location` column, the planner might have chosen an `Index Scan` instead, which would use the index to directly locate rows with `'Warehouse'` without reading the entire table. (We'll see an example of that later.) The key point: Sequential Scan means scanning all rows (potentially slow on large tables), while Index Scan means using an index to narrow down to matching rows (usually faster for selective queries).

- Cost, rows, and width (estimates): Inside the parentheses after the node, we see `cost=0.00..20.50 rows=488 width=26`. These are planner's estimates for this operation:

  - Cost=0.00..20.50: This is the estimated cost range for the operation. The first number (0.00) is the estimated _startup cost_ (cost before producing the first row), and the second number (20.50) is the estimated _total cost_ to execute the operation to completion. Cost is an abstract unit (not milliseconds or any real-world time) – it's based on factors like disk page fetches and CPU overhead. By convention, a cost of 1.0 is roughly one sequential page read. In our case, the planner expects that scanning the `items` table and filtering will cost "20.50" units. You typically compare cost numbers only relative to other plans; they are not actual time.
  - rows=488: This is the estimated number of rows this node will output (after applying any filters). The planner thinks ~488 rows will match `location = 'Warehouse'`. This is based on statistics – if the table had 1000 rows and roughly half have location Warehouse, an estimate of 488 is reasonable. It's important to note this is an estimate, not an exact count.
  - width=26: The average size (in bytes) of each row output by this operation. In our case, each `items` row is estimated to be 26 bytes on average (perhaps the sum of average lengths of columns selected).

- Filter: The indented line `Filter: (location = 'Warehouse'::text)` indicates that for each row in the sequential scan, PostgreSQL applies this filter condition, only passing through rows that satisfy it. This essentially reflects our `WHERE` clause.

So, in plain English, the plan is saying: _"Postgres will sequentially scan the `items` table, checking each row where `location = 'Warehouse'`. The planner expects this to process ~1000 rows, output ~488 of them, with a cost around 20.50 units."_ Since this table scan is the whole plan for our query, the total cost of the query is 20.50 and it returns an estimated 488 rows.

Now, what about `EXPLAIN ANALYZE` output? When you add `ANALYZE`, the plan output includes additional actual execution metrics for each node, right next to the estimates. These appear as a second set of parentheses for each plan node when you run the query for real. For example, if we actually run the previous query with `EXPLAIN ANALYZE`, we might see something like:

```pgsql
 Seq Scan on items  (cost=0.00..20.50 rows=488 width=26) (actual time=0.050..1.234 rows=500 loops=1)
   Filter: (location = 'Warehouse'::text)
   Rows Removed by Filter: 500
 Planning Time: 0.123 ms
 Execution Time: 1.300 ms
```

New information in `EXPLAIN ANALYZE` output includes:

- Actual time=0.050..1.234: This is the actual elapsed time for this operation in milliseconds, from start to finish. In the example above, it started producing rows at 0.050 ms and finished at 1.234 ms. (If a node runs in multiple iterations, these times are per iteration; more on that in a moment.)
- Actual rows=500: The actual number of rows produced by this node. Here it returned 500 rows in reality (maybe our estimate of 488 was a little off – the planner predicted 488, but 500 rows matched at runtime).
- loops=1: How many times this node was executed. In complex plans, some nodes might execute multiple times (for instance, in a nested loop join, the inner scan might run once per outer row). If loops > 1, the actual time and rows are usually per loop averages. In our case, loops=1 means the scan ran once.
- Rows Removed by Filter: This line (not always present) tells how many rows were read but discarded by the filter condition. Here, 500 rows were filtered out. Combined with the 500 rows output, that suggests the table had 1000 rows total (500 passed the filter, 500 did not).
- Planning Time and Execution Time: At the bottom, `Planning Time` is how long it took the PostgreSQL query planner to devise the plan (usually very small), and `Execution Time` is the total time to execute the query and gather all results, in milliseconds. Note that the execution time is slightly higher than the actual node time because it includes some overhead like sending results to the client. Also, using `EXPLAIN ANALYZE` itself adds some overhead (so the query might run a bit faster when not measuring it).

From an `EXPLAIN ANALYZE`, we can now compare estimated vs. actual. In this example, the planner estimated 488 rows, but actually 500 rows were returned – pretty close. The cost estimate 20.50 doesn't directly translate to the ~1.3 ms execution, and that's expected: cost is a unitless metric, not milliseconds. Instead of matching cost to time, we typically focus on disparities like _estimated rows vs actual rows_. If those differ dramatically, it might indicate the planner had outdated statistics or chose a suboptimal strategy. The goal is usually to see estimates reasonably close to actuals; large differences can be a red flag.

A few more things you might see in `EXPLAIN` output:

- Parallelism: In newer PostgreSQL versions, if a table is large and the server has multiple CPU cores, the planner might use parallel query execution. The plan will include nodes like `Gather` (to combine results from workers) and lines like `Workers Planned: 3`. Under the `Gather` you'll see an indented plan that each worker runs (e.g. a `Parallel Seq Scan`). This just means PostgreSQL split the work across workers to scan faster. You don't have to interpret each worker's work separately; just note that it was done in parallel. In our earlier example, if `items` had millions of rows, you might see a `Gather` node with multiple `Parallel Seq Scan` children, indicating parallel processing.

- Join operations: If your query involves joins, you'll see plan nodes like `Nested Loop`, `Hash Join`, or `Merge Join`. These indicate the join algorithm used. A Nested Loop join means for each row of one table, PostgreSQL is finding matching rows in the other (often using an index on the join key). A Hash Join means PostgreSQL built an in-memory hash table of one side of the join to efficiently look up matches from the other side. A Merge Join means both sides were sorted and then merged. We won't dive deep into join types here, but it's good to recognize them. We'll see an example of a hash join vs. an index-based plan in a moment.

To summarize the key points for interpreting plans:

1. Plan is a tree: Indentation shows which nodes feed into others. The top node is the final step.
2. Node types: Look at the operation (Seq Scan, Index Scan, Bitmap Heap Scan, Nested Loop, Hash Join, etc.) to understand _how_ it's doing the work.
3. Estimates: The first parentheses on each node give _estimated_ cost and rows. These help you understand what the planner expected.
4. Actuals (with ANALYZE): The second parentheses (if present) give actual time and row counts. Comparing these to estimates can reveal if the planner was off.
5. Execution time: The bottom line gives total execution time. This is the ultimate measure of query performance, and what we aim to reduce by tuning the query or the database.

Next, let's apply this knowledge to some real examples of slow queries and see how `EXPLAIN ANALYZE` can guide us to solutions.

## Example 1: Sequential Scan vs. Index Scan (Filtering a Large Table)

Scenario: You have a table with a few million rows and a query that searches for a specific value in that table. For example, imagine a `us_geonames` table (from a geographical dataset of U.S. place names) with over 2 million records, and you run a query to find a place by name:

```sql
EXPLAIN ANALYZE
SELECT * FROM us_geonames
WHERE name = 'Tampa International Airport';
```

Let's say the `name` column is not indexed. The query is slow, and `EXPLAIN ANALYZE` shows why. Here's a simplified version of what the output might be (based on an example):

```pgsql
QUERY PLAN
------------------------------------------------------------------------------------------------
Gather  (cost=1000.00..30062.35 rows=7888 width=84) (actual time=37.164..192.388 rows=1 loops=1)
  Workers Planned: 3
  Workers Launched: 3
  ->  Parallel Seq Scan on us_geonames  (cost=0.00..28273.55 rows=2545 width=84) (actual time=93.085..130.232 rows=0 loops=4)
        Filter: (name = 'Tampa International Airport'::text)
        Rows Removed by Filter: 559758
Planning Time: 0.052 ms
Execution Time: 192.413 ms
```

_(This output is abbreviated for clarity.)_

Let's interpret this step by step:

- The top node is a `Gather`, which tells us this query was executed in parallel with 3 worker processes. The Gather is collecting results from the workers. The total actual execution time was about 192 ms in this example (just for demonstration; it could be much higher if the table is larger or not in memory).

- Under the Gather, the child node is a `Parallel Seq Scan on us_geonames`. This means each worker is doing a sequential scan on the table. The plan shows an estimated rows=2545 per worker, but actual rows output by each worker were 0 in this snippet (because one worker found the matching row, the others got none, as only one row in the whole table matched the name). The Filter line confirms the filter condition on name.

- "Rows Removed by Filter: 559758" indicates that across all workers, over 559k rows were checked and discarded because they did not match the name. This number hints at how large the table is (since only one row matched, all others were "removed" by the filter).

- No index usage is mentioned; it's a pure sequential scan. So PostgreSQL had to read through a lot of rows (over half a million in this portion of the scan) to find that single matching row.

The result: a slow query. Even ~192 ms (0.192 seconds) for one lookup is far from ideal – and in many cases without an index, it could be much slower (if the table isn't already cached in memory, if it's bigger, etc.). The key culprit visible in the plan is "Seq Scan on us_geonames" – scanning a large table in full.

Solution: Add an index on the `name` column, so PostgreSQL doesn't have to scan everything. For example, we create an index:

```sql
CREATE INDEX us_geonames_name_idx ON us_geonames (name);
```

After creating the index, run the same query again with `EXPLAIN ANALYZE`:

```pgsql
QUERY PLAN
--------------------------------------------------------------------------------------------------
Bitmap Heap Scan on us_geonames  (cost=4.52..47.91 rows=11 width=44) (actual time=0.035..0.036 rows=1 loops=1)
  Recheck Cond: (name = 'Tampa International Airport'::text)
  Heap Blocks: exact=1
  ->  Bitmap Index Scan on us_geonames_name_idx  (cost=0.00..4.51 rows=11 width=0) (actual time=0.030..0.030 rows=1 loops=1)
        Index Cond: (name = 'Tampa International Airport'::text)
Planning Time: 0.214 ms
Execution Time: 0.074 ms
```

Now this is a _much_ better plan! Here's what changed and why it's faster:

- The plan is using our new index. We see a `Bitmap Index Scan` on `us_geonames_name_idx`, feeding into a `Bitmap Heap Scan` on the table. PostgreSQL chose a bitmap scan likely because it expected multiple rows (estimated 11 rows) – but even for one row, this is fine. In essence, the database uses the index to find matching row locations, then fetches the actual row from the heap.

- The cost estimates plummeted from ~30000 down to ~47 total. More tellingly, the _actual_ execution time is now 0.074 ms, basically instantaneous, and it read only 1 heap block (as indicated by `Heap Blocks: exact=1`). This is a huge improvement over 192 ms and scanning thousands of blocks before.

- The plan shows `rows=1` actually returned, matching our expectation of one row. The estimates expected maybe up to 11 rows (perhaps the stats thought "Tampa International Airport" might not be unique, but it is).

- We can also see that the planning time increased slightly (0.214 ms now) – that's the extra overhead of the planner considering the index. But that planning time is negligible, and the execution is now _much_ faster than before.

In summary, by adding an index, the plan changed from a costly sequential scan to an efficient index scan. `EXPLAIN ANALYZE` was crucial to diagnosing this: it showed the sequential scan and a large number of rows being filtered out, which signaled that an index could help. After creating the index, `EXPLAIN ANALYZE` confirmed the index was used and the performance gain (execution time dropped from around 192 ms to 0.07 ms in this example).

This example illustrated a very common scenario:

- Symptom: A query with a simple `WHERE` clause is slow on a large table.
- EXPLAIN finding: The plan shows a sequential scan on the table (no index used).
- Solution: Add an index on the filtered column. The new plan uses an index scan (or bitmap scan) and avoids reading the whole table, dramatically speeding up the query.

## Example 2: Speeding Up Joins with Indexes

Not only single-table lookups benefit from indexes; joins do as well. In this example, we'll look at a slow query involving a join, and how `EXPLAIN ANALYZE` guides us to improve it.

Scenario: Suppose you have three tables in a simple e-commerce setup: `users`, `orders`, and `line_items`. Each order has a `user_id` (foreign key to `users`), and each line item has an `order_id` (foreign key to `orders`). We want to find all line items for orders made by a user with a certain name (say, user `'Karisa'`). The query might look like:

```sql
EXPLAIN ANALYZE
SELECT items.* FROM line_items AS items
LEFT JOIN orders ON items.order_id = orders.id
LEFT JOIN users ON users.id = orders.user_id
WHERE users.name = 'Karisa';
```

Now, if we haven't indexed those foreign key columns (`line_items.order_id` and `orders.user_id`), the database may have to do a lot of work to join these tables. An `EXPLAIN ANALYZE` (before adding any indexes) might reveal something like this:

```sql
QUERY PLAN
------------------------------------------------------------------------------------------------------------
Hash Join  (cost=... rows=... width=...) (actual time=... rows=... loops=...)
  Hash Cond: (orders.user_id = users.id)
  ->  Hash Join  (cost=... rows=... width=...) (actual time=... rows=... loops=...)
        Hash Cond: (items.order_id = orders.id)
        ->  Seq Scan on line_items items  (cost=0.00..931789.57 rows=... width=...) (actual time=... rows=... loops=1)
        ->  Hash  (cost=... rows=... width=...) (actual time=... rows=... loops=1)
              -> Seq Scan on orders  (cost=... rows=... width=...) (actual time=... rows=... loops=1)
  ->  Hash  (cost=... rows=... width=...) (actual time=... rows=... loops=1)
        -> Seq Scan on users  (cost=... rows=... width=...) (actual time=... rows=... loops=1)
              Filter: (name = 'Karisa'::text)
              Rows Removed by Filter: ...
```

_(Note: This is a generalized illustration. The key part to notice is the `Seq Scan on line_items` with a very high cost.)_

Looking at this plan, even without all the numbers, we can spot trouble:

- There's a `Seq Scan on line_items` with an enormous cost (in this hypothetical, cost ~931789.57 for that scan alone). That suggests `line_items` is a large table, and PostgreSQL is scanning the entire thing.

- The joins are implemented as hash joins (`Hash Join` nodes). The planner likely chose hash joins because there were no indexes on the join keys, so it's hashing the `orders` and `users` tables in memory and scanning `line_items` fully to match them up. Hash joins can handle large data sets, but if one side is a huge table and it's doing a full scan, it's expensive.

- We see sequential scans on `orders` and `users` as well, though those might be smaller. The filter on `users.name = 'Karisa'` indicates it scanned all users to find "Karisa".

Identifying the issue: The sequential scan on the large `line_items` table is the biggest concern. The plan's high cost and (implied) long actual time for that part of the plan tell us the join is slow because it's reading a lot of rows. As the plan stands, for each user named 'Karisa', it likely scans all their orders, and for each order, scans all line items to find matches – a lot of unnecessary work without indexes.

In fact, the plan time might confirm the query is slow, possibly taking several seconds to execute for a large dataset. The `EXPLAIN` output estimated hundreds of thousands of rows and a cost near a million for scanning `line_items`, which is a sign of trouble.

Solution: Add indexes on the join columns to speed up the join lookups. Specifically, an index on `line_items(order_id)` and on `orders(user_id)` would allow Postgres to use an index scan to find line items for each order, and orders for the user, rather than scanning entire tables. We create those indexes:

```sql
CREATE INDEX idx_line_item_orders ON line_items (order_id);
CREATE INDEX idx_user_orders ON orders (user_id);
```

Now, with indexes in place, if we run the query again:

- We expect the planner to use an `Index Scan` on `line_items` (using `idx_line_item_orders`) to directly fetch line items for only the relevant orders, instead of scanning all line items.

- Similarly, it might use an index on `orders.user_id` to find orders for user 'Karisa' quickly.

- The join strategy might change. Often, when indexes are available, PostgreSQL might choose a Nested Loop join: for each user (or order) found, use an index to find matching rows in the other table. This can be very efficient when the index lookup is fast.

Let's say the new `EXPLAIN ANALYZE` shows something like:

```sql
QUERY PLAN
---------------------------------------------------------------------------------------------------
Nested Loop  (cost=... rows=... width=...) (actual time=... rows=... loops=...)
  ->  Nested Loop  (cost=... rows=... width=...) (actual time=... rows=... loops=...)
        ->  Index Scan using idx_user_orders on orders  (cost=... rows=... width=...) (actual time=... rows=... loops=...)
              Index Cond: (user_id = <id of 'Karisa'>)
        ->  Index Scan using idx_line_item_orders on line_items items  (cost=... rows=... width=...) (actual time=... rows=... loops=...)
              Index Cond: (order_id = orders.id)
  ->  ... (likely a single-row lookup on users 'Karisa')
```

In plain terms, the plan is now doing: find the user 'Karisa' (probably a quick index or filter on `users`), then use the index on `orders.user_id` to find that user's orders, and for each order, use the index on `line_items.order_id` to fetch line items. No more full table scans of `line_items` or `orders`.

The cost estimates will drop dramatically (the new plan might have costs in the thousands or even less, instead of ~931k). And importantly, the actual execution time should drop by orders of magnitude. In a real example, such an optimization brought a query that took over 5 seconds down to about 0.05 seconds (5,300 ms to ~52 ms) after indexing – roughly a 100x speedup, as seen in the execution times.

`EXPLAIN ANALYZE` would confirm the improvement:

- The `Seq Scan on line_items` would be gone, replaced by `Index Scan using idx_line_item_orders` (much lower actual rows scanned).

- The `Hash Join` would likely be gone or reduced; you might see `Nested Loop` which indicates it's using the indexes to loop through matching entries.

- The actual row counts at each step should match up more closely with what's needed (only line items for the relevant orders, etc., rather than reading thousands that get filtered out).

- The `Execution Time` at the bottom will show a much smaller number, confirming the query is faster.

This example highlights how missing indexes on join columns can lead to expensive hash joins or sequential scans. The fix was straightforward: add the appropriate indexes so the database can quickly look up the matching rows instead of scanning everything.

## Using EXPLAIN ANALYZE to Identify Common Performance Issues

From the examples above, you can see a pattern: `EXPLAIN ANALYZE` helps pinpoint which part of the query is doing the most work, so you know where to focus your optimization efforts. Here are some common issues that beginners can catch using `EXPLAIN ANALYZE`, along with basic improvements:

- Sequential scan on a large table when an index exists (or should exist): If you see `Seq Scan` on a big table and the query is slow, check if there is an index that _should_ be used. The plan might show a sequential scan because there's no index on the column in the `WHERE` clause or join condition. The improvement is to create an index on that column, or ensure your query can use an existing index (e.g., avoid wrapping the column in a function that makes the index unusable). In Example 1, the lack of an index led to a sequential scan over millions of rows; adding the index fixed it. Tip: After adding an index, run `EXPLAIN` again to verify that the plan now shows an `Index Scan` (or `Bitmap Index Scan`) on that index.

- Index not being used due to query formulation: Sometimes you _have_ an index but the plan still does a sequential scan. Common causes include:

  - Applying a function or expression to the indexed column in the WHERE clause (e.g., `WHERE LOWER(name) = 'joe'` won't use an index on `name` unless it's an index on `LOWER(name)`). Or using a data type cast that prevents using the index.
  - Using a leading wildcard in a `LIKE` pattern (e.g., `name LIKE '%Smith'`) – a normal b-tree index cannot be used in that case. The planner in our example with `%Tampa%` did a seq scan despite an index on `name` because the pattern wasn't index-friendly. Improvement could be to use a full-text index or trigram index for such patterns, or redesign the query if possible.
  - The query condition is not selective (e.g., `WHERE column > 0` on a column that's almost always >0). PostgreSQL might decide an index is not worthwhile if it would have to fetch a large portion of the table anyway. In such cases, a sequential scan can be the right decision. Rule of thumb: If the plan shows a sequential scan but the query is fast enough and the row estimate vs actual is reasonable, it might be fine. Sequential scans are not _always_ bad – for small tables or very broad queries, they're expected.

- Row count misestimates: `EXPLAIN ANALYZE` is great for catching this. If the estimated rows vs actual rows for a plan node differ by a large factor (say, the planner expected 100 rows but got 100000), that's a sign the planner's statistics are off. This could lead it to choose a suboptimal plan. For example, if the planner underestimates rows, it might choose a Nested Loop when a Hash Join would be better, or vice versa. Improvement: Run the `ANALYZE` command on the table(s) to update statistics, or increase the `stats_target` for particularly problematic columns and analyze again. Updated statistics can make the planner's estimates more accurate so it can choose better plans. In our Example 1, the estimate was 7888 rows vs actual 1 – a big discrepancy, which was a clue that maybe the stats didn't expect the name to be so unique. An `ANALYZE` might help such cases (though adding the index solved it by making the scan moot).

- Join order or join type issues: If `EXPLAIN` reveals a costly join (e.g., a huge Nested Loop that iterates millions of times, or a Hash Join building a massive hash table), consider if an index could allow a better join strategy (as in Example 2), or if rewriting the query might help. Sometimes reordering the joins (if the planner isn't choosing the best order on its own) or using explicit join hints (not straightforward in Postgres, but you can influence by query structure) can help. Usually, though, adding the right indexes is the first resort. In complex queries, you can also break them down and analyze parts to see which join or subquery is the bottleneck.

- Sorting and aggregation bottlenecks: If the plan shows a `Sort` node or an `Aggregate` that takes a lot of time (you might see a large "actual time" for a Sort), you might improve it by adding an index to avoid an explicit sort. For example, if your query does `ORDER BY date`, a b-tree index on `date` can allow PostgreSQL to read data already sorted by date (an index scan) instead of a separate sort step. For aggregation, indexes or rewriting the query can sometimes help (e.g., an index on grouped columns, or using incremental materialized views, etc., beyond our scope). Also, if sorts or hash operations can't fit in memory, they might spill to disk and slow down; increasing `work_mem` configuration or using `EXPLAIN (ANALYZE, BUFFERS)` to check for disk usage could be considered if you suspect this.

- Suboptimal use of ORMs or repeated queries: While not directly shown in a single `EXPLAIN`, sometimes performance issues are due to how an application queries the database (for instance, N+1 query problems where many small queries are run in a loop). You can use `EXPLAIN` on representative queries, but also consider tools like `pg_stat_statements` to find frequent slow queries. If the plan is okay for each query but the sheer number of queries is the issue, you might need to rewrite your application logic rather than the SQL itself.

In general, when you have a slow query, follow this process:

1. Run `EXPLAIN ANALYZE` on the query. (On production, you might do just `EXPLAIN` first to avoid impact, and run the actual query on a staging or replica.) Look at the output and identify the most expensive operations. Is it doing sequential scans on large tables? A massive sort or hash? A nested loop iterating many times?
2. Focus on the slowest parts. If it's a seq scan, can an index help? If it's a join, are join keys indexed? If the estimated vs actual rows are way off at a certain node, maybe update stats or check if the query can be rewritten.
3. Apply a fix (add an index, rewrite the query, etc.). Then run `EXPLAIN ANALYZE` again to see how the plan and timings change.
4. Repeat if needed. Sometimes multiple issues stack up in one query.

To practice, you can take some slow query in your database (or a sample large dataset) and go through this process. It's a bit of an art that gets easier with experience. Plan-reading can be daunting at first, but the core principles we covered – understanding scans, looking at rows and cost, and zeroing in on the big numbers – will get you pretty far.

## Neon-specific EXPLAIN Options

In Neon, a serverless PostgreSQL service, there are additional EXPLAIN options that can provide valuable insights specific to Neon's architecture. One particularly useful option is `EXPLAIN (ANALYZE, FILECACHE)`, which provides information about the Local File Cache (LFC) usage during query execution.

### What is Neon's Local File Cache (LFC)?

Neon's architecture separates compute and storage, which is different from traditional PostgreSQL deployments where compute and storage are tightly coupled. In this serverless architecture, Neon uses a Local File Cache (LFC) as an essential component that bridges the gap between compute and storage.

The LFC is a memory-resident cache on the compute node that stores recently accessed data pages from your database. When your query needs to read data:

1. Neon first checks if the required data pages are already in the LFC
2. If found (a cache hit), the data is read directly from memory, which is very fast
3. If not found (a cache miss), Neon fetches the data from the remote storage layer, which takes longer

The size of the LFC is directly proportional to your compute instance size - larger compute instances have larger LFCs, allowing more data to be cached in memory. This is why query performance can improve significantly when you have a properly sized LFC for your workload.

In a serverless environment like Neon, understanding LFC performance is crucial because:

- Remote storage access is slower than local memory access
- A high cache hit rate means better performance
- Workloads that exceed the LFC size will experience more cache misses and slower performance

The `FILECACHE` option in EXPLAIN helps you understand how effectively your queries are utilizing this cache.

### Understanding EXPLAIN (ANALYZE, FILECACHE)

The FILECACHE option shows how Neon's Local File Cache is being utilized during query execution. This is especially important in a serverless environment where efficient cache usage directly impacts performance. Here's an example of how to use it:

```sql
EXPLAIN (ANALYZE, FILECACHE) SELECT * FROM large_table WHERE id = 123;
```

The output will include additional information about cache hits and misses:

```pgsql
QUERY PLAN
--------------------------------------------------------------------------------------------------
Index Scan using large_table_pkey on large_table  (cost=0.42..8.44 rows=1 width=42) (actual time=0.035..0.036 rows=1 loops=1)
  Index Cond: (id = 123)
  LFC: blocks cached: 2  blocks not cached: 0  cache hit rate: 100.00%
Planning Time: 0.214 ms
Execution Time: 0.074 ms
```

The key information to look for is:

- `blocks cached`: Number of blocks found in the Local File Cache
- `blocks not cached`: Number of blocks that had to be fetched from storage
- `cache hit rate`: Percentage of blocks that were found in the cache

### Importance of LFC Size and Cache Misses

When you observe a high number of cache misses (low cache hit rate) in your EXPLAIN output, it may indicate that your LFC size is insufficient for your workload. The Local File Cache in Neon acts as a buffer between your compute instance and the storage layer, and its size directly impacts query performance.

If you're seeing many cache misses, consider:

1. Increasing your compute instance size, which also increases the LFC size
2. Optimizing your queries to touch fewer data blocks
3. Ensuring your most frequently accessed data fits within the LFC

For more information about Neon's architecture and the Local File Cache, refer to the [Neon extensions documentation](https://neon.tech/docs/extensions/neon).

## The Importance of Up-to-date Statistics and VACUUM

While understanding query plans is crucial, ensuring that PostgreSQL has accurate information to create those plans is equally important. Two maintenance operations play a vital role in this: ANALYZE and VACUUM.

### ANALYZE and Statistics Collection

The PostgreSQL query planner relies on statistics about your tables to make good decisions. These statistics include:

- Table size (number of rows)
- Column value distributions
- Correlation between columns

When these statistics are outdated, the planner might make poor decisions, leading to suboptimal query plans. For example, if a table has grown significantly but statistics haven't been updated, the planner might underestimate the cost of a sequential scan.

You can manually update statistics with:

```sql
ANALYZE table_name;
```

Or for a specific column:

```sql
ANALYZE table_name(column_name);
```

When examining EXPLAIN output, if you notice large discrepancies between estimated and actual row counts, it's often a sign that you need to run ANALYZE.

### VACUUM and Dead Tuples

In PostgreSQL, when you update or delete rows, the old versions aren't immediately removed—they become "dead tuples" that still occupy space. Over time, these dead tuples can:

- Bloat your tables, increasing disk usage
- Slow down sequential scans (more data to read)
- Make indexes less efficient
- Cause statistics to become inaccurate

The VACUUM process reclaims space from dead tuples and updates statistics. You can run it manually:

```sql
VACUUM table_name;
```

Or with ANALYZE to update statistics in one operation:

```sql
VACUUM ANALYZE table_name;
```

Most PostgreSQL installations, including Neon, have autovacuum enabled, which automatically runs VACUUM when needed. However, for tables with high update/delete rates, you might need to adjust autovacuum settings or run manual VACUUMs.

### Impact on Query Performance

When investigating slow queries with EXPLAIN ANALYZE, consider whether outdated statistics or table bloat might be contributing factors:

1. If estimated rows are far off from actual rows, run ANALYZE
2. If sequential scans are slower than expected, check for table bloat and run VACUUM
3. If index scans aren't being chosen when they should be, ensure statistics are up-to-date

For more detailed information on PostgreSQL maintenance, refer to the [PostgreSQL tutorial on Neon's website](https://neon.tech/postgresql/tutorial).

## Conclusion

PostgreSQL's `EXPLAIN` and `EXPLAIN ANALYZE` are powerful tools for any developer or DBA looking to optimize queries. They pull back the curtain on the query planner and show you exactly _how_ a query is executed, which is invaluable for diagnosing performance issues. In this tutorial, we introduced the basic syntax and concepts, learned how to read the output (in particular identifying sequential scans, index usage, row estimates vs. actuals, and execution time), and walked through examples where we improved slow queries by adding indexes and making the database do less work.

With this knowledge, you should be able to tackle many common slow-query scenarios:

- Use `EXPLAIN ANALYZE` to find the bottlenecks in the plan (be it a full table scan, a heavy join, or a sort).
- Apply basic optimizations like indexing the appropriate columns or slightly rewriting the query.
- Verify the improvement by comparing the new plan and execution time to the old one.
- For Neon users, leverage the FILECACHE option to understand cache performance.
- Ensure statistics are up-to-date and tables are properly vacuumed for optimal performance.

Keep in mind that performance tuning can get very deep, and there are cases where you might need to adjust PostgreSQL configuration, redesign your schema, or use more advanced features (like partitioning or query hints via `enable_seqscan` toggling for testing). But for a beginner, mastering `EXPLAIN ANALYZE` is the first step to becoming self-sufficient in investigating and resolving query performance issues.

Remember, the database is your friend – using `EXPLAIN (ANALYZE)` is like asking PostgreSQL "how are you executing my query, and where are you spending time?". With practice, you'll start intuitively understanding what the planner is telling you, and you'll be able to make your SQL run faster and more efficiently. Happy optimizing!

<NeedHelp />
