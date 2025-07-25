---
title: 'PostgreSQL 18 B-tree Skip Scan for Better Queries'
page_title: 'PostgreSQL 18 B-tree Skip Scan for Better Queries'
page_description: "Learn how PostgreSQL 18's new B-tree skip scan feature enables efficient queries on multicolumn indexes even when you omit conditions on prefix columns, dramatically improving query performance for analytics and reporting workloads."
ogImage: ''
updatedOn: '2025-06-28T02:20:00+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL 18 Asynchronous I/O'
  slug: 'postgresql-18/asynchronous-io'
nextLink:
  title: 'PostgreSQL 18 Enhanced EXPLAIN'
  slug: 'postgresql-18/enhanced-explain'
---

**Summary**: In this tutorial, you will learn how PostgreSQL 18's new B-tree skip scan feature enables efficient queries on multicolumn indexes even when you omit equality conditions on prefix columns, dramatically improving performance for analytics and reporting workloads.

## Introduction to B-tree Skip Scan

PostgreSQL 18 introduces an improvement to B-tree index scanning called "skip scan." This feature addresses a long-standing limitation where multicolumn B-tree indexes could only be used efficiently when queries included equality conditions on the leading (leftmost) columns of the index.

Before PostgreSQL 18, if you had an index on `(region, category, date)` and wanted to query by `category` and `date` without specifying `region`, PostgreSQL would typically resort to a sequential scan or a less efficient index scan. The skip scan optimization changes this by allowing PostgreSQL to intelligently "skip" over portions of the index to find relevant data, even when prefix columns are omitted from the query.

This feature is particularly valuable for analytics and reporting workloads where you often need to query different combinations of indexed columns without always specifying the leading ones.

## Understanding the Problem

To understand why skip scan is important, let's first look at how traditional multicolumn B-tree indexes work and their limitations.

### Traditional B-tree Index Limitations

In previous PostgreSQL versions, multicolumn B-tree indexes were most effective when queries included conditions on the leading columns. The index structure organizes data first by the first column, then by the second column within each first column value, and so on.

```sql
-- Consider this index
CREATE INDEX idx_sales_region_category_date
ON sales (region, category, date);

-- This query uses the index efficiently
SELECT * FROM sales
WHERE region = 'North' AND category = 'Electronics';

-- This query cannot use the index efficiently
SELECT * FROM sales
WHERE category = 'Electronics' AND date > '2025-01-01';
```

The second query above would traditionally require PostgreSQL to scan through all index entries or fall back to a sequential scan because it doesn't specify the leading `region` column.

### The Skip Scan Solution

Skip scan solves this by allowing PostgreSQL to efficiently navigate the index structure even when prefix columns are missing from the query. It does this by identifying distinct values in the unspecified prefix columns and performing targeted scans for each value.

## Setting Up a Test Environment

Let's set up a PostgreSQL 18 environment to demonstrate the skip scan feature. We'll create a sample table and populate it with data that illustrates the benefits of this new functionality.

Start by creating a PostgreSQL database and a table that will benefit from skip scan optimization:

```sql
-- Create a sales table
CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    region VARCHAR(20),
    category VARCHAR(30),
    product_name VARCHAR(100),
    sale_date DATE,
    amount DECIMAL(10,2),
    sales_rep VARCHAR(50)
);
```

In this table, we have several columns that represent sales data, including `region`, `category`, `sale_date`, and others. The goal is to create a multicolumn index that allows efficient querying across these columns.

Next, we will create a multicolumn index on the `sales` table that includes `region`, `category`, and `sale_date`. This index will be used to demonstrate the skip scan functionality.

```sql
-- Create the multicolumn index
CREATE INDEX idx_sales_analytics
ON sales (region, category, sale_date);
```

This index will allow us to efficiently query sales data based on combinations of `region`, `category`, and `sale_date`. This also represents a common scenario in analytics applications where you might want to analyze sales data by different dimensions.

### Loading Sample Data

Now let's populate the table with sample data that demonstrates the skip scan benefits:

```sql
-- Insert sample data with various combinations
INSERT INTO sales (region, category, product_name, sale_date, amount, sales_rep)
SELECT
    CASE (random() * 3)::int
        WHEN 0 THEN 'North'
        WHEN 1 THEN 'South'
        ELSE 'West'
    END,
    CASE (random() * 4)::int
        WHEN 0 THEN 'Electronics'
        WHEN 1 THEN 'Clothing'
        WHEN 2 THEN 'Books'
        ELSE 'Home'
    END,
    'Product ' || i,
    '2025-01-01'::date + (random() * 365)::int,
    (random() * 1000 + 100)::decimal(10,2),
    'Rep ' || (random() * 10)::int
FROM generate_series(1, 100000) i;
```

The above SQL statement generates 100,000 rows of sample sales data with random regions, categories, product names, sale dates throughout 2025, and amounts. This dataset will allow us to test the skip scan functionality effectively.

After inserting the data, we can update the statistics for the query planner to ensure it has the latest information about the table and index:

```sql
-- Update statistics for the query planner
ANALYZE sales;
```

This creates a dataset with three regions, four categories, and dates spread throughout 2025, providing a good test case for skip scan functionality.

## Demonstrating Skip Scan in Action

Let's see how PostgreSQL 18's skip scan feature improves query performance for different scenarios.

### Basic Skip Scan Example

First, let's examine a query that benefits from skip scan:

```sql
-- Query that omits the leading 'region' column
EXPLAIN (ANALYZE, BUFFERS)
SELECT category, COUNT(*), AVG(amount)
FROM sales
WHERE category = 'Electronics'
  AND sale_date BETWEEN '2025-06-01' AND '2025-08-31'
GROUP BY category;
```

In PostgreSQL 18, this query can use the skip scan optimization to efficiently use the `idx_sales_analytics` index even though it doesn't specify the `region` column.

The query planner will identify the distinct region values and perform targeted scans for each region where the category and date conditions match.

### Comparing with Traditional Approach

To see the difference, you can compare this with a query that includes all prefix columns:

```sql
-- Traditional approach: specify all prefix columns
EXPLAIN (ANALYZE, BUFFERS)
SELECT region, category, COUNT(*), AVG(amount)
FROM sales
WHERE region IN ('North', 'South', 'West')
  AND category = 'Electronics'
  AND sale_date BETWEEN '2025-06-01' AND '2025-08-31'
GROUP BY region, category;
```

Both queries should now show similar performance characteristics, whereas in previous PostgreSQL versions, the first query would be significantly slower.

## When Skip Scan Provides the Most Benefit

Skip scan optimization is most effective in specific scenarios. Understanding these helps you design better indexes and queries.

### Low Cardinality Leading Columns

Skip scan works best when the leading columns that you're omitting have relatively few distinct values:

```sql
-- Effective: region has only 3 distinct values
SELECT * FROM sales
WHERE category = 'Electronics'
  AND sale_date > '2025-06-01';

-- Less effective if region had thousands of distinct values
-- because skip scan would need to check many different values
```

The optimization works by essentially performing separate index scans for each distinct value in the omitted leading columns, so fewer distinct values mean fewer separate scans.

## Monitoring Skip Scan Usage

PostgreSQL 18 provides [enhanced EXPLAIN](/postgresql/postgresql-18/enhanced-explain) output that helps you understand when skip scan is being used.

### Enhanced EXPLAIN Output

When examining query plans, look for indicators that skip scan is being used:

```sql
-- Use verbose explain to see detailed execution information
EXPLAIN (ANALYZE, BUFFERS, VERBOSE)
SELECT category, AVG(amount)
FROM sales
WHERE category = 'Electronics'
  AND sale_date > '2025-09-01'
GROUP BY category;
```

The output will show how PostgreSQL is handling the index scan and whether it's using skip scan optimization. You'll see information about the number of index lookups and how efficiently the query is using the available index.

## Performance Considerations

While skip scan significantly improves query performance in many scenarios, it's important to understand its characteristics and limitations.

### When Skip Scan May Not Help

Skip scan isn't beneficial in all situations. Let's examine the scenarios where PostgreSQL's query planner will choose other strategies.

#### High Cardinality Leading Columns

High cardinality means the leading column in your index has many distinct values.

When the leading column has too many distinct values, skip scan becomes inefficient:

```sql
-- Example: user_id has millions of distinct values
SELECT * FROM user_events
WHERE event_type = 'login'
  AND event_date > '2025-01-01';
```

With an index on `(user_id, event_type, event_date)`, skip scan would need to perform separate scans for each `user_id` value - potentially millions of them. This makes it slower than alternatives. In such cases, PostgreSQL will likely choose a sequential scan or bitmap index scan instead.

#### Large Result Sets

When your query returns most of the table, sequential scan is typically faster:

```sql
-- If this matches 90% of all rows
SELECT * FROM sales
WHERE category IN ('Electronics', 'Clothing', 'Books', 'Home')
  AND sale_date > '2025-01-01';
```

Even with skip scan, reading most of the table through an index is slower than just scanning the table directly.

#### Automatic Decision Making

PostgreSQL's query planner automatically determines when skip scan is worthwhile based on table statistics and cost estimates. You don't need to manually configure when to use it - the planner chooses the most efficient approach for each query.

### Maintenance Considerations

Keep your table statistics updated to ensure the query planner makes good decisions about when to use skip scan:

```sql
-- Regular analysis ensures good skip scan decisions
ANALYZE sales;

-- Consider automatic analyze settings
ALTER TABLE sales SET (autovacuum_analyze_scale_factor = 0.02);
```

Here the `ANALYZE` command updates the statistics for the `sales` table, which is crucial for the query planner to make informed decisions about using skip scan. With the `autovacuum_analyze_scale_factor` set, PostgreSQL will automatically analyze the table when a certain percentage of rows have changed, keeping statistics fresh, in this case, 2% of the table but you can adjust this based on your workload.

Fresh statistics help PostgreSQL accurately estimate the cardinality of index columns and make optimal skip scan decisions.

### Limitations

While skip scan is a handy feature, it's important to understand its current limitations in PostgreSQL 18.

Skip scan in PostgreSQL 18 has specific scope:

- Works only with B-tree indexes. This should be generally applicable as B-tree is the most common index type.
- Most effective when omitted leading columns have low cardinality
- Requires at least one equality condition on a later column in the index
- Performance benefit decreases as the number of distinct values in omitted columns increases

## Summary

PostgreSQL 18's B-tree skip scan feature represents an improvement in query performance for analytics and reporting workloads. It enables efficient use of multicolumn indexes even when prefix columns are omitted, skip scan reduces the need for additional indexes and improves query performance across a wide range of scenarios. The feature is most beneficial when working with multicolumn indexes where leading columns have low cardinality.
