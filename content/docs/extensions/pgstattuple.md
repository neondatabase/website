---
title: The pgstattuple extension
subtitle: 'Analyze table, index bloat, and fragmentation in Postgres'
enableTableOfContents: true
updatedOn: '2025-05-27T19:40:34.755Z'
tag: new
---

The `pgstattuple` extension provides a suite of functions to inspect the physical storage of Postgres tables and indexes at a detailed, tuple (row) level. It offers insights into issues like table and index bloat, fragmentation, and overall space utilization, which are crucial for performance tuning and storage management.

<CTA />

## Enable the `pgstattuple` extension

You can enable the extension by running the following `CREATE EXTENSION` statement in the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or from a client such as [psql](/docs/connect/query-with-psql-editor) that is connected to your Neon database.

```sql
CREATE EXTENSION IF NOT EXISTS pgstattuple;
```

**Version availability:**

Please refer to the [list of all extensions](/docs/extensions/pg-extensions) available in Neon for up-to-date extension version information.

## `pgstattuple` functions

`pgstattuple` offers several functions to inspect different aspects of your database storage.

### Analyzing table statistics with `pgstattuple()`

The `pgstattuple(relation regclass)` function provides detailed statistics about a table's physical storage. It performs a full scan of the relation.

```sql
SELECT * FROM pgstattuple('your_table_name');
```

Key columns in the output include:

- `table_len`: Total size of the table on disk in bytes.
- `tuple_count`: Number of live (visible) tuples.
- `tuple_len`: Total length of live tuples in bytes.
- `tuple_percent`: Percentage of space occupied by live tuples.
- `dead_tuple_count`: Number of dead tuples (not yet vacuumed).
- `dead_tuple_len`: Total length of dead tuples in bytes.
- `dead_tuple_percent`: Percentage of space occupied by dead tuples. This is a direct indicator of bloat due to dead rows.
- `free_space`: Total free space available within allocated pages in bytes (usable for future `INSERT`s/`UPDATE`s without extending the table).
- `free_percent`: Percentage of total table space that is free.

**Example: Observing table statistics and bloat**

Let's create a `customers` table, populate it, delete some rows to create bloat, and then observe the statistics using `pgstattuple`.

```sql
-- Create the customers table
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(20),
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Insert 10,000 rows into the customers table
INSERT INTO customers (first_name, last_name, email, phone, address, city, state, zip_code, created_at)
SELECT
    CASE (i % 10) WHEN 0 THEN 'John' WHEN 1 THEN 'Jane' WHEN 2 THEN 'Peter' WHEN 3 THEN 'Mary' WHEN 4 THEN 'Robert' WHEN 5 THEN 'Patricia' WHEN 6 THEN 'Michael' WHEN 7 THEN 'Linda' WHEN 8 THEN 'William' ELSE 'Elizabeth' END || '_' || i::TEXT,
    CASE (i % 10) WHEN 0 THEN 'Smith' WHEN 1 THEN 'Johnson' WHEN 2 THEN 'Williams' WHEN 3 THEN 'Jones' WHEN 4 THEN 'Brown' WHEN 5 THEN 'Davis' WHEN 6 THEN 'Miller' WHEN 7 THEN 'Wilson' WHEN 8 THEN 'Moore' ELSE 'Taylor' END || '_' || i::TEXT,
    'customer' || i::TEXT || '@example.com',
    '555-' || LPAD((i % 10000)::TEXT, 4, '0'),
    (i * 10)::TEXT || ' Main St',
    CASE (i % 5) WHEN 0 THEN 'New York' WHEN 1 THEN 'Los Angeles' WHEN 2 THEN 'Chicago' WHEN 3 THEN 'Houston' ELSE 'Phoenix' END,
    CASE (i % 5) WHEN 0 THEN 'NY' WHEN 1 THEN 'CA' WHEN 2 THEN 'IL' WHEN 3 THEN 'TX' ELSE 'AZ' END,
    LPAD((i % 99999)::TEXT, 5, '0'),
    NOW() - (random() * INTERVAL '365 days')
FROM generate_series(1, 10000) AS s(i);

 -- Delete half of the rows to create dead tuples
DELETE FROM customers WHERE customer_id % 2 = 0;

-- Check the table statistics before vacuuming
SELECT * FROM pgstattuple('customers');
```

Example output:

```text
table_len | tuple_count | tuple_len | tuple_percent | dead_tuple_count | dead_tuple_len | dead_tuple_percent | free_space | free_percent
-----------+-------------+-----------+----------------+------------------+----------------+--------------------+------------+--------------
 1343488   |    5000     |   638144  |      47.5      |       5000       |     645432     |       48.04        |   15320    |     1.14
```

The output above (your values may vary) shows `dead_tuple_count` of 5000 and `dead_tuple_percent` around 48%. This high percentage of dead tuples indicates significant table bloat caused by the `DELETE` operation. Neon performs automatic `VACUUM` operations, but for immediate analysis or specific needs, you can run `VACUUM` manually.

To reclaim the space occupied by these dead tuples for reuse within the table, run:

```sql
VACUUM customers;
```

Now, let's check the statistics again:

```sql
SELECT * FROM pgstattuple('customers');
```

Example output (after `VACUUM`):

```text
table_len | tuple_count | tuple_len | tuple_percent | dead_tuple_count | dead_tuple_len | dead_tuple_percent | free_space | free_percent
-----------+-------------+-----------+----------------+------------------+----------------+--------------------+------------+--------------
 1343488   |    5000     |   638144  |      47.5      |       0          |     0          |       0            |   661080    |     49.21
```

After `VACUUM`, `dead_tuple_count` is 0, and `dead_tuple_percent` is 0. The `free_space` (and `free_percent`) has increased significantly, indicating that the space previously occupied by dead tuples is now available for reuse by future `INSERT` or `UPDATE` operations on the `customers` table.

<Admonition type="note" title="Page Overhead">
The `table_len` will always be greater than the sum of `tuple_len`, `dead_tuple_len`, and `free_space`. The difference accounts for page headers, per-page tuple pointers, and padding required for data alignment.
</Admonition>

### Estimating table statistics with `pgstattuple_approx()`

The `pgstattuple_approx(relation regclass)` function offers a faster way to get approximate table statistics. It tries to avoid full table scans by using the visibility map (VM) to skip pages known to contain only live tuples. For such pages, it estimates live tuple data from free space map information. Dead tuple statistics reported by this function are exact.

```sql
SELECT * FROM pgstattuple_approx('your_table_name');
```

This function is particularly useful for large tables where a full `pgstattuple()` scan would be too slow or resource-intensive for frequent checks. - Output columns are similar to `pgstattuple()`, but with `approx_` prefixes for estimated values (e.g., `approx_tuple_count`, `approx_free_space`). - `dead_tuple_count` and `dead_tuple_len` are exact.

### Analyzing B-tree index statistics with `pgstatindex()`

The `pgstatindex(index regclass)` function provides statistics for B-tree indexes.

```sql
SELECT * FROM pgstatindex('your_index_name');
```

Key columns in the output include:

- `version`: B-tree version number.
- `tree_level`: Level of the B-tree (0 for an empty index, 1 for a root page with leaves, etc.).
- `index_size`: Total size of the index on disk in bytes.
- `leaf_pages`: Number of leaf pages (where actual index entries pointing to table rows are stored).
- `internal_pages`: Number of internal (non-leaf) pages.
- `empty_pages`: Number of completely empty pages within the index.
- `deleted_pages`: Number of pages marked as deleted but not yet reclaimed.
- `avg_leaf_density`: Average fullness of leaf pages as a percentage. Lower values can indicate bloat or inefficient space usage.
- `leaf_fragmentation`: A measure of logical fragmentation of leaf pages. Higher values indicate that logically sequential leaf pages might be physically distant on disk, which can impact scan performance.

**Example: Observing Index statistics**

```sql
-- Create an index on the customers table
CREATE INDEX idx_customers_first_name ON customers (first_name);

-- Check index statistics
SELECT * FROM pgstatindex('idx_customers_first_name');
```

Example output (your values may vary):

```text
version | tree_level | index_size | root_block_no | internal_pages | leaf_pages | empty_pages | deleted_pages | avg_leaf_density | leaf_fragmentation
---------+------------+------------+----------------+----------------+------------+-------------+---------------+------------------+-------------------
       4 |          1 |      180224 |              3 |              1 |         20 |           0 |             0 |            86.14 |                 0
```

<Admonition type="note" title="Other Index Types">
The `pgstattuple` extension also provides `pgstatginindex()` for GIN indexes and `pgstathashindex()` for HASH indexes. While these functions also report on storage characteristics, the specific metrics returned are tailored to the internal structure of GIN and HASH indexes, respectively.
</Admonition>

## Practical usage examples

### Detecting and managing table bloat

Table bloat occurs primarily when `UPDATE` or `DELETE` operations are performed. `UPDATE` operations in Postgres internally perform a `DELETE` of the old row version and an `INSERT` of the new row version. The space occupied by these "dead" (old or deleted) tuples is not immediately reclaimed by the operating system. Instead, it remains within the table's allocated pages, potentially leading to larger table sizes than necessary and reduced query performance due to scanning more pages. `pgstattuple` helps quantify this bloat.

In our `customers` table example:

1.  We inserted 10,000 rows.
2.  We then deleted half of these rows (`DELETE FROM customers WHERE customer_id % 2 = 0;`). These 5,000 deleted rows become "dead tuples".

The `pgstattuple('customers')` output _before_ running `VACUUM` was:

```text
table_len | tuple_count | tuple_len | tuple_percent | dead_tuple_count | dead_tuple_len | dead_tuple_percent | free_space | free_percent
-----------+-------------+-----------+----------------+------------------+----------------+--------------------+------------+--------------
 1343488   |    5000     |   638144  |      47.5      |       5000       |     645432     |       48.04        |   15320    |     1.14
```

Here's how to interpret this:

- `dead_tuple_count` is 5000, matching the number of rows we deleted.
- `dead_tuple_percent` is 48.04%, indicating that nearly half the space within the data pages (excluding page overhead and existing free space) is occupied by these dead tuples. This is a clear sign of significant bloat.
- `free_percent` is low (1.14%), meaning there isn't much readily available space within the existing pages for new data _before_ a `VACUUM`.

Upon identifying bloat, `VACUUM` is the standard command to reclaim this space _for reuse by Postgres_. A standard `VACUUM` marks the space occupied by dead tuples as free, making it available for future `INSERT`s and `UPDATE`s on the same table. It typically does not shrink the table file on disk (i.e., `table_len` often remains the same).

After running `VACUUM customers;`, the `pgstattuple('customers')` output showed:

```text
table_len | tuple_count | tuple_len | tuple_percent | dead_tuple_count | dead_tuple_len | dead_tuple_percent | free_space | free_percent
-----------+-------------+-----------+----------------+------------------+----------------+--------------------+------------+--------------
 1343488   |    5000     |   638144  |      47.5      |       0          |     0          |       0            |   661080    |     49.21
```

Observations:

- `dead_tuple_count` and `dead_tuple_percent` are now 0, confirming the dead tuples have been processed.
- `free_percent` has increased dramatically to 49.21%. This space, previously held by dead tuples, is now marked as free and can be reused by new rows or updates to existing rows in the `customers` table without requiring Postgres to request more disk space from the OS for this table immediately.
- `table_len` (1343488) remained the same, which is typical for a standard `VACUUM`. To return space to the operating system and reduce `table_len`, you would need `VACUUM FULL` or tools like `pg_repack`, but these come with different locking implications.

To run `VACUUM FULL`, which compacts the table and returns space to the OS, you would use:

```sql
VACUUM FULL customers;
```

<Admonition type="warning">
`VACUUM FULL` requires an exclusive lock on the table, which can block other operations. Use it judiciously, especially in production environments.
</Admonition>

Running the `pgstattuple('customers')` again after `VACUUM FULL` would show a reduced `table_len`, indicating that the space has been returned to the operating system.

```sql
SELECT * FROM pgstattuple('customers');
```

**Example output (after `VACUUM FULL`)**:

```text
 table_len | tuple_count | tuple_len | tuple_percent | dead_tuple_count | dead_tuple_len | dead_tuple_percent | free_space | free_percent
-----------+-------------+-----------+---------------+------------------+----------------+--------------------+------------+--------------
    671744 |        5000 |    638144 |            95 |                0 |              0 |                  0 |      11304 |         1.68
(1 row)
```

### Identifying top bloated tables

You can query `pg_class` and use `pgstattuple` functions to find the most bloated tables in your database. This query focuses on the actual space occupied by dead tuples.

```sql
SELECT
    c.relname AS table_name,
    pg_size_pretty(s.table_len) AS total_table_size,
    round(s.dead_tuple_percent::numeric, 2) AS dead_tuple_percentage,
    pg_size_pretty(s.dead_tuple_len) AS space_occupied_by_dead_tuples,
    round(s.free_percent::numeric, 2) AS free_space_percentage
FROM
    pg_class c
JOIN
    pg_namespace n ON n.oid = c.relnamespace
CROSS JOIN LATERAL pgstattuple(c.oid::regclass) s -- For better performance on large DBs, consider pgstattuple_approx(c.oid::regclass) s
WHERE
    c.relkind IN ('r', 'm') -- r = ordinary table, m = materialized view
    AND n.nspname NOT IN ('pg_catalog', 'information_schema') -- Exclude system schemas
    AND n.nspname NOT LIKE 'pg_toast%' -- Exclude TOAST tables
    AND n.nspname NOT LIKE 'pg_temp_%' -- Exclude temporary schemas
    AND s.dead_tuple_len > 0 -- Only consider tables with some dead tuple space
ORDER BY
    s.dead_tuple_len DESC -- Order by the tables with the most space taken by dead tuples
LIMIT 10;
```

<Admonition type="warning" title="Resource Intensive Query">
Running `pgstattuple()` for every table can be very resource-intensive. For larger databases, consider using `pgstattuple_approx()` in the `CROSS JOIN LATERAL` subquery or filtering tables by size first (e.g., adding `AND pg_total_relation_size(c.oid) > '1GB'` to the `WHERE` clause).
</Admonition>

### Diagnosing and resolving index bloat and fragmentation

For B-tree indexes, low `avg_leaf_density` or high `leaf_fragmentation` can indicate performance issues.

```sql
SELECT
    index_size,
    leaf_pages,
    avg_leaf_density,
    leaf_fragmentation
FROM pgstatindex('idx_customers_first_name');
```

If `avg_leaf_density` is low (e.g., < 60-70%) or `leaf_fragmentation` is high (e.g., > 20-30% for frequently scanned indexes), the index might benefit from rebuilding.

To rebuild an index:

```sql
REINDEX INDEX idx_customers_first_name;
```

After reindexing, check `pgstatindex` again; you should see improved `avg_leaf_density` (closer to 90%) and reduced `leaf_fragmentation`.

## Best practices

- **Resource Intensive:** `pgstattuple()` performs a full table/index scan, which can be I/O and CPU intensive, especially on large objects. `pgstattuple_approx()` is faster but still reads a portion of the table.
- **Run off-peak:** Schedule `pgstattuple` analysis during low-traffic periods to minimize impact on production workloads.
- **Target specific objects:** Instead of scanning all tables/indexes, focus on known large or frequently modified objects, or those identified as problematic by other monitoring tools.
- **Combine with `pg_repack`:** For online table and index reorganization to remove bloat without extensive locking (unlike `VACUUM FULL` or `REINDEX`), consider the [`pg_repack` extension](/docs/extensions/pg_repack).

## Conclusion

The `pgstattuple` extension is a powerful diagnostic tool for understanding the physical storage characteristics of your Postgres database within Neon. It allows you to identify and quantify table and index bloat and fragmentation, leading to more effective maintenance strategies, better autovacuum tuning, and ultimately, improved database performance and storage efficiency.

## Resources

- [PostgreSQL documentation for pgstattuple](https://www.postgresql.org/docs/current/pgstattuple.html)

<NeedHelp />
