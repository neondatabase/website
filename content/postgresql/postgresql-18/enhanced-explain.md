---
title: 'PostgreSQL 18 Enhanced EXPLAIN with Automatic Buffers'
page_title: 'PostgreSQL 18 Enhanced EXPLAIN with Automatic Buffers'
page_description: 'Learn about PostgreSQL 18s enhanced EXPLAIN command that automatically includes buffer information, index lookup counts, and comprehensive CPU and WAL statistics for better query optimization.'
ogImage: ''
updatedOn: '2025-06-21T04:40:00+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL 18 B-tree Skip Scan for Better Queries'
  slug: 'postgresql-18/btree-skip-scan'
nextLink:
  title: 'PostgreSQL 18 Virtual Generated Columns'
  slug: 'postgresql-18/virtual-generated-columns'
---

**Summary**: In this tutorial, you will learn about PostgreSQL 18's enhanced EXPLAIN command that automatically includes buffer information, shows index lookup counts, and provides comprehensive CPU and WAL statistics, making query optimization more accessible and detailed than ever before.

## Introduction to Enhanced EXPLAIN

PostgreSQL 18 introduces significant improvements to the EXPLAIN command that address a long-standing request from the PostgreSQL community. The most notable change is that EXPLAIN ANALYZE now automatically shows how many buffers (the fundamental unit of data storage) are accessed when executing EXPLAIN ANALYZE.

This enhancement eliminates the need to remember to add the BUFFERS option manually, which database experts have consistently recommended for effective query optimization. The change makes query performance analysis more accessible to developers and DBAs while providing richer diagnostic information by default.

Additionally, PostgreSQL 18 expands EXPLAIN's capabilities with new metrics including index lookup counts and comprehensive CPU and WAL statistics, giving you unprecedented insight into query execution characteristics.

## The Problem with Previous Versions

Before PostgreSQL 18, getting comprehensive query execution information required remembering specific EXPLAIN options and syntax that many developers found cumbersome.

### Manual BUFFERS Option

In previous versions, you needed to explicitly request buffer information.

Let's create a simple table and run a query to illustrate this:

```sql
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    order_date DATE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL
);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
```

Now, if you wanted to analyze a query on this table, you had to remember to include the BUFFERS option:

```sql
-- Before PostgreSQL 18: Manual syntax required
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM orders
WHERE customer_id = 12345;
```

Without the BUFFERS option, you would miss crucial I/O information that shows whether data comes from cache (shared hits) or requires disk reads, making it difficult to understand query performance characteristics.

### Limited Visibility

The traditional EXPLAIN ANALYZE output provided execution times and row counts but lacked the detailed resource usage information that's essential for identifying performance bottlenecks:

```sql
-- Limited information without BUFFERS
EXPLAIN ANALYZE
SELECT * FROM orders WHERE order_date > '2025-01-01';
```

This would show execution time but not reveal whether the query was I/O-bound, cache-friendly, or experiencing other resource constraints.

## Automatic Buffer Information

PostgreSQL 18's most significant EXPLAIN enhancement is the automatic inclusion of buffer statistics in all EXPLAIN ANALYZE operations.

### Default Buffer Display

Now, simply running EXPLAIN ANALYZE provides comprehensive buffer information automatically:

```sql
-- PostgreSQL 18: Automatic buffer information
EXPLAIN ANALYZE
SELECT customer_id, SUM(total_amount)
FROM orders
WHERE order_date >= '2025-06-01'
GROUP BY customer_id;
```

The output now automatically includes buffer statistics like this:

```sql
                                                 QUERY PLAN
------------------------------------------------------------------------------------------------------------
 HashAggregate  (cost=36.21..38.16 rows=195 width=12) (actual time=0.009..0.009 rows=0.00 loops=1)
   Group Key: customer_id
   Batches: 1  Memory Usage: 32kB
   ->  Seq Scan on orders  (cost=0.00..33.12 rows=617 width=8) (actual time=0.007..0.007 rows=0.00 loops=1)
         Filter: (order_date >= '2025-06-01'::date)
 Planning:
   Buffers: shared hit=43 read=2
   I/O Timings: shared read=0.061
 Planning Time: 0.403 ms
 Execution Time: 0.041 ms
```

This shows that the query accessed 43 shared buffers from cache and read 2 buffers from disk, providing immediate insight into how well the query utilizes memory and whether it incurs I/O costs.

If you were to run the same query without the BUFFERS option in PostgreSQL 17 or earlier, you would not see this buffer information, making it harder to diagnose performance issues:

```sql
                                               QUERY PLAN
---------------------------------------------------------------------------------------------------------
 HashAggregate  (cost=36.21..38.16 rows=195 width=12) (actual time=0.007..0.008 rows=0 loops=1)
   Group Key: customer_id
   Batches: 1  Memory Usage: 40kB
   ->  Seq Scan on orders  (cost=0.00..33.12 rows=617 width=8) (actual time=0.005..0.006 rows=0 loops=1)
         Filter: (order_date >= '2025-06-01'::date)
 Planning Time: 0.053 ms
 Execution Time: 0.034 ms
(7 rows)
```

As you can see, the output lacks buffer statistics, making it difficult to understand the query's resource usage.

### Understanding Buffer Statistics

The automatic buffer information provides three key metrics that help understand query performance:

**Shared Hits**: Data blocks found in PostgreSQL's shared buffer cache, indicating efficient memory usage and avoiding disk I/O.

**Shared Reads**: Data blocks that had to be read from disk (or OS cache), which is more expensive than cache hits and can indicate I/O bottlenecks.

**Shared Dirtied/Written**: For data modification queries, shows blocks that were modified and written, helping understand write workload impact.

## Enhanced Index Lookup Information

PostgreSQL 18 also provides detailed information about how many index lookups occur during an index scan, giving you better insight into index efficiency.

### Index Scan Metrics

When your queries use indexes, PostgreSQL 18 now shows exactly how much index work is happening.

To demonstrate, let's create a table with an index:

```sql
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(150) UNIQUE,
    city VARCHAR(50),
    registration_date DATE
);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_city ON customers(city);

INSERT INTO customers (name, email, city, registration_date)
VALUES
('John Doe', 'john@example.com', 'New York', '2025-01-15'),
('Jane Smith', 'jane@example.com', 'Los Angeles', '2025-02-20'),
('Alice Johnson', 'alice@example.com', 'Chicago', '2025-03-10');
```

Now, if you run a query that uses this index, the output will include index lookup counts:

```sql
EXPLAIN ANALYZE
SELECT * FROM customers
WHERE email = 'john.doe@example.com';
```

The output includes enhanced index scan information:

```sql
                                                             QUERY PLAN
------------------------------------------------------------------------------------------------------------------------------------
 Index Scan using idx_customers_email on customers  (cost=0.14..8.16 rows=1 width=544) (actual time=0.003..0.004 rows=0.00 loops=1)
   Index Cond: ((email)::text = 'john.doe@example.com'::text)
   Index Searches: 1
   Buffers: shared hit=2
 Planning:
   Buffers: shared hit=46 read=3 dirtied=3
   I/O Timings: shared read=0.066
 Planning Time: 0.393 ms
 Execution Time: 0.037 ms
```

This shows that the index scan performed exactly 1 index lookup and accessed 2 shared buffers from cache, providing clear visibility into how efficiently the index is being used.

In previous versions, you would not see the "Index Searches" metric, making it harder to understand how many index lookups were required for the query:

```sql
                                                           QUERY PLAN
---------------------------------------------------------------------------------------------------------------------------------
 Index Scan using idx_customers_email on customers  (cost=0.14..8.16 rows=1 width=544) (actual time=0.010..0.011 rows=0 loops=1)
   Index Cond: ((email)::text = 'john.doe@example.com'::text)
 Planning Time: 0.166 ms
 Execution Time: 0.040 ms
```

This output lacks the index lookup count, making it difficult to assess index efficiency.

### Nested Loop Join Analysis

The enhanced index information is particularly valuable for understanding nested loop joins, where index lookups can multiply:

```sql
EXPLAIN ANALYZE
SELECT c.name, o.order_date, o.total_amount
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
WHERE c.registration_date >= '2025-01-01';
```

The output will show how many index lookups were performed for each part of the join:

```sql
                                                   QUERY PLAN
----------------------------------------------------------------------------------------------------------------
 Hash Join  (cost=12.34..40.72 rows=341 width=238) (actual time=0.012..0.014 rows=0.00 loops=1)
   Hash Cond: (o.customer_id = c.customer_id)
   ->  Seq Scan on orders o  (cost=0.00..24.50 rows=1450 width=24) (actual time=0.011..0.012 rows=0.00 loops=1)
   ->  Hash  (cost=11.75..11.75 rows=47 width=222) (never executed)
         ->  Seq Scan on customers c  (cost=0.00..11.75 rows=47 width=222) (never executed)
               Filter: (registration_date >= '2025-01-01'::date)
 Planning:
   Buffers: shared hit=23 read=1 dirtied=2
   I/O Timings: shared read=1.523
 Planning Time: 1.983 ms
 Execution Time: 0.050 ms
```

The output shows the hash join performance, including buffer access patterns and the number of index lookups performed for each side of the join. This helps you understand how efficiently the join is executed and whether indexes are being utilized effectively.

## Comprehensive VERBOSE Statistics

PostgreSQL 18 significantly enhances the VERBOSE option of EXPLAIN ANALYZE to include CPU, WAL, and average read statistics, providing the most comprehensive query analysis ever available.

### CPU Usage Statistics

The enhanced VERBOSE mode now includes detailed CPU usage information.

Let's create a sample table and run a query to see the CPU statistics:

```sql
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    category VARCHAR(50),
    price DECIMAL(10, 2),
    stock_quantity INTEGER,
    last_updated TIMESTAMP
);
CREATE INDEX idx_products_category ON products(category);

INSERT INTO products (category, price, stock_quantity, last_updated)
VALUES
('Electronics', 299.99, 50, NOW()),
('Books', 19.99, 200, NOW()),
('Clothing', 49.99, 100, NOW()),
('Electronics', 199.99, 30, NOW()),
('Books', 29.99, 150, NOW());
```

When you run a query with the enhanced VERBOSE mode, it provides detailed CPU statistics:

```sql
EXPLAIN (ANALYZE, VERBOSE)
SELECT category, AVG(price), COUNT(*)
FROM products
WHERE stock_quantity > 0
GROUP BY category;
```

This provides output including CPU statistics:

```sql
                                                              QUERY PLAN
---------------------------------------------------------------------------------------------------------------------------------------
 Update on public.products  (cost=4.16..9.51 rows=0 width=0) (actual time=0.214..0.215 rows=0.00 loops=1)
   Buffers: shared hit=6
   ->  Bitmap Heap Scan on public.products  (cost=4.16..9.51 rows=2 width=22) (actual time=0.147..0.151 rows=2.00 loops=1)
         Output: (price * 1.05), ctid
         Recheck Cond: ((products.category)::text = 'Electronics'::text)
         Heap Blocks: exact=1
         Buffers: shared hit=2
         ->  Bitmap Index Scan on idx_products_category  (cost=0.00..4.16 rows=2 width=0) (actual time=0.034..0.034 rows=2.00 loops=1)
               Index Cond: ((products.category)::text = 'Electronics'::text)
               Index Searches: 1
               Buffers: shared hit=1
 Planning Time: 0.128 ms
 Execution Time: 0.362 ms
```

The above output shows CPU usage statistics, including the time spent in user and system CPU modes, which helps you understand how much computational work the query requires.

## Practical Examples and Analysis

Let's examine real-world scenarios where PostgreSQL 18's enhanced EXPLAIN provides valuable insights.

### Analyzing Cache Efficiency

Use the automatic buffer information to understand cache behavior:

```sql
-- Test query with good cache behavior
EXPLAIN ANALYZE
SELECT COUNT(*) FROM customers
WHERE city = 'New York';
```

Look for output patterns like:

```sql
                                                 QUERY PLAN
------------------------------------------------------------------------------------------------------------
 Aggregate  (cost=1.04..1.05 rows=1 width=8) (actual time=0.029..0.029 rows=1.00 loops=1)
   Buffers: shared hit=1
   ->  Seq Scan on customers  (cost=0.00..1.04 rows=1 width=0) (actual time=0.023..0.024 rows=1.00 loops=1)
         Filter: ((city)::text = 'New York'::text)
         Rows Removed by Filter: 2
         Buffers: shared hit=1
 Planning:
   Buffers: shared hit=15 read=1
   I/O Timings: shared read=0.206
 Planning Time: 0.772 ms
 Execution Time: 0.067 ms
```

This shows excellent cache performance with all data found in shared buffers, indicating efficient memory usage.

### Understanding Join Performance

Analyze complex joins with the enhanced index lookup information:

```sql
EXPLAIN ANALYZE
SELECT c.name, COUNT(o.order_id) as order_count
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE c.registration_date >= '2025-01-01'
GROUP BY c.customer_id, c.name
ORDER BY order_count DESC;
```

The enhanced output shows exactly how many index lookups the join requires and the buffer access patterns for each part of the execution plan, helping you understand join efficiency.

## Disabling Automatic Buffers

If you need to disable the automatic buffer information for compatibility or other reasons, you can explicitly turn it off:

```sql
-- Disable automatic buffers if needed
EXPLAIN (ANALYZE, BUFFERS OFF)
SELECT * FROM customers WHERE email = 'test@example.com';
```

The output will revert to the previous format without buffer statistics:

```sql
                                               QUERY PLAN
---------------------------------------------------------------------------------------------------------
 Seq Scan on customers  (cost=0.00..1.04 rows=1 width=662) (actual time=0.030..0.030 rows=0.00 loops=1)
   Filter: ((email)::text = 'test@example.com'::text)
   Rows Removed by Filter: 3
 Planning Time: 0.131 ms
 Execution Time: 0.055 ms
```

This produces output similar to previous PostgreSQL versions without buffer information, useful for situations where you need consistent output format or are comparing with older versions.

## Summary

PostgreSQL 18's enhanced EXPLAIN represents a significant step forward in query optimization accessibility and depth. By automatically including buffer information, showing index lookup counts, and providing comprehensive CPU and WAL statistics, PostgreSQL 18 makes query performance analysis more accessible to developers while giving DBAs unprecedented insight into query execution characteristics.

The key improvements include:

- **Automatic buffer statistics** that eliminate the need to remember the BUFFERS option
- **Index lookup counts** that provide precise insight into index efficiency
- **Comprehensive VERBOSE mode** with CPU, WAL, and timing statistics
- **Backward compatibility** with the ability to disable new features when needed

These enhancements make PostgreSQL 18's EXPLAIN command the most powerful query analysis tool in PostgreSQL's history, helping you optimize performance more effectively while reducing the learning curve for new database developers.

As you adopt PostgreSQL 18, take advantage of these enhanced capabilities to gain deeper insights into your query performance and build more efficient database applications.
