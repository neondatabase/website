---
title: The pg_prewarm extension
subtitle: Load data into your Postgres buffer cache with the pg_prewarm extension
enableTableOfContents: true
updatedOn: '2024-07-25T12:53:42.420Z'
---

You can use the `pg_prewarm` extension to preload data into the Postgres buffer cache after a restart. Doing so improves query response times by ensuring that your data is readily available in memory. Otherwise, data must be loaded into the buffer cache from disk on-demand, which can result in slower query response times.

<CTA />

In this guide, we'll explore the `pg_prewarm` extension, how to enable it, and how to use it to prewarm your Postgres buffer cache.

<Admonition type="note">
The `pg_prewarm` extension is open-source and can be installed on any Postgres setup. Detailed information about the extension is available in the [PostgreSQL Documentation](https://www.postgresql.org/docs/current/pgprewarm.html).
</Admonition>

**Version availability**

Please refer to the [list of extensions](https://neon.tech/docs/extensions/pg-extensions) available in Neon for information about the version of `pg_prewarm` that Neon supports.

## Enable the `pg_prewarm` extension

Enable the `pg_prewarm` extension by running the `CREATE EXTENSION` statement in your Postgres client:

```sql
CREATE EXTENSION IF NOT EXISTS pg_prewarm;
```

For information about using the Neon SQL Editor, see [Query with Neon's SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor). For information about using the `psql` client with Neon, see [Connect with psql](/docs/connect/query-with-psql-editor).

## Basic usage

To prewarm a specific table, simply use the `pg_prewarm` function with the name of the table you want to cache.

```sql
SELECT pg_prewarm('table_name');
```

Replace `table_name` with the actual name of your table.

The output of `SELECT pg_prewarm()` is the number of blocks from the specified table that was loaded into the Postgres buffer cache. The default block size in Postgres is 8192 bytes (8KB).

The `pg_prewarm` function does not support specifying multiple table names in a single command. It's designed to work with a single table at a time. If you want to prewarm multiple tables, you would need to call `pg_prewarm` separately for each.

## Running pg_prewarm on indexes

Running `pg_prewarm` on frequently-used indexes can help improve query performance after a Postgres restart. You might also run `pg_prewarm` on indexes that are not frequently used but will be involved in upcoming heavy read operations.

Running `pg_prewarm` on an index is similar to running it on a table, but you specify the index's fully qualified name (schema name plus index name) or OID (Object Identifier) instead.

Here's an example that demonstrates how to use `pg_prewarm` to preload an index into memory:

```sql
SELECT pg_prewarm('schema_name.index_name');
```

Replace `schema_name.index_name` with the actual schema and index name you want to prewarm. If you're not sure about the index name or want to list all indexes for a specific table, you can use the `pg_indexes` view to find out. Here's how you might query for index names:

```sql
SELECT indexname FROM pg_indexes WHERE tablename = 'your_table_name';
```

Replace `your_table_name` with the name of the table whose indexes you're interested in. Once you have the index name, you can then use `pg_prewarm` as shown above.

Additionally, if you prefer to use the index's OID, you can find it using the `pg_class` system catalog. Here's how to find an index's OID:

```sql
SELECT oid FROM pg_class WHERE relname = 'index_name';
```

Then, you can use the OID with `pg_prewarm` like so:

```sql
SELECT pg_prewarm(your_index_oid);
```

## Check the proportion of a table loaded into memory

In this example, you create a table, check its data size, run `pg_prewarm`, and then check to see how much of the table's data was loaded into memory.

1. First, create a table and populate it with some data:

   ```sql
   CREATE TABLE t_test AS
   SELECT * FROM generate_series(1, 1000000) AS id;
   ```

2. Check the size of the table:

   ```sql
   SELECT pg_size_pretty(pg_relation_size('t_test')) AS table_size_pretty,
       pg_relation_size('t_test') AS table_size_bytes;
   ```

   This command returns the size of the table in both MB and bytes.

   ```sql
    table_size_pretty | table_size_bytes
   -------------------+------------------
   35 MB              |         36700160
   ```

3. Load the table data into the Postgres buffer cache using `pg_prewarm`:

   ```sql
   SELECT pg_prewarm('public.t_test') AS blocks_loaded;
   ```

   This will output the number of blocks that were loaded:

   ```sql
   blocks_loaded
   ---------------
           4480
   ```

4. To understand the calculation that follows, check the block size of your Postgres instance:

   ```sql
   SHOW block_size;
   ```

   The default block size in Postgres is 8192 bytes (8KB). We'll use this value in the next step.

   ```sql
   block_size
   ------------
   8192
   ```

5. Calculate the total size of the data loaded into the cache using the block size and the number of blocks loaded:

   ```sql
   -- Assuming 4480 blocks were loaded (replace with your actual number from pg_prewarm output)
   SELECT 4480 * 8192 AS loaded_data_bytes;
   ```

   You can now compare this value with the size of your table.

   ```sql
    loaded_data_bytes
   -------------------
           36700160
   ```

   <Admonition type="note">
   The values for the size of the table and the size of the data loaded into the buffer cache as shown in the example above match exactly, which is an ideal scenario. However, there are cases where these values might not match, indicating that not all the data was loaded into the buffer cache; for example, this can happen if `pg_prewarm` only partially loads the table into the buffer cache due to lack of memory availability. Concurrent data modifications could also cause sizes to differ.

   To understand how much memory is available to your Postgres instance on Neon, see [How to size your compute](/docs/manage/endpoints#how-to-size-your-compute).
   </Admonition>

## Demonstrating the effect of pg_prewarm

This example shows how preloading data can improve query performance. We'll create two tables with the same data, preload one table, and then run `EXPLAIN ANALYZE` to compare execution time results.

1. Create two sample tables with the same data for comparison:

   ```sql
   CREATE TABLE tbl_transactions_1
   (
       tran_id_ SERIAL,
       transaction_date TIMESTAMPTZ,
       transaction_name TEXT
   );

   INSERT INTO tbl_transactions_1
   (transaction_date, transaction_name)
   SELECT x, 'dbrnd'
   FROM generate_series('2010-01-01 00:00:00'::timestamptz, '2018-02-01 00:00:00'::timestamptz, '1 minutes'::interval) a(x);
   ```

   ```sql
   CREATE TABLE tbl_transactions_2
   (
       tran_id_ SERIAL,
       transaction_date TIMESTAMPTZ,
       transaction_name TEXT
   );

   INSERT INTO tbl_transactions_2
   (transaction_date, transaction_name)
   SELECT x, 'dbrnd'
   FROM generate_series('2010-01-01 00:00:00'::timestamptz, '2018-02-01 00:00:00'::timestamptz, '1 minutes'::interval) a(x);
   ```

2. Restart your Postgres instance to clear the cache. On Neon, you can do this by [restarting your compute](/docs/manage/endpoints#restart-a-compute).

3. Prewarm the first sample table:

   ```sql
   SELECT pg_prewarm('tbl_transactions_1') AS blocks_loaded;
   ```

   This will output the number of blocks that were loaded into the cache:

   ```sql
   blocks_loaded
   ---------------
           27805
   ```

4. Now, compare the execution plan of the prewarmed table vs. a non-prewarmed table to see the performance improvement.

   ```sql
   EXPLAIN ANALYZE SELECT * FROM tbl_transactions_1;
   ```

   ```sql
   EXPLAIN ANALYZE SELECT * FROM tbl_transactions_2;
   ```

   The execution time for the prewarmed table should be significantly lower than for the table that has not been prewarmed, as shown here:

   ```sql
   EXPLAIN ANALYZE SELECT * FROM tbl_transactions_1;
                                                         QUERY PLAN
   -------------------------------------------------------------------------------------------------------------------------------
   Seq Scan on tbl_transactions_1  (cost=0.00..69608.21 rows=4252321 width=18) (actual time=0.017..228.995 rows=4252321 loops=1)
   Planning Time: 1.134 ms
   Execution Time: 344.028 ms
   (3 rows)

   EXPLAIN ANALYZE SELECT * FROM tbl_transactions_2;
                                                           QUERY PLAN
   ---------------------------------------------------------------------------------------------------------------------------------
   Seq Scan on tbl_transactions_2  (cost=0.00..69608.21 rows=4252321 width=18) (actual time=2.251..11859.232 rows=4252321 loops=1)
   Planning Time: 0.216 ms
   Execution Time: 11994.066 ms
   (3 rows)
   ```

## Conclusion

Prewarming your table data and indexes can help improve read performance, especially after a database restart or for indexes that are not frequently used but will be involved in upcoming heavy read operations. However, it's important to use this feature cautiously, especially on systems with limited memory, to avoid potential negative impacts on overall performance.

## Resources

- [PostgreSQL pg_prewarm documentation](https://www.postgresql.org/docs/current/pgprewarm.html)
- [How to size your compute in Neon](/docs/manage/endpoints#how-to-size-your-compute)

<NeedHelp/>
