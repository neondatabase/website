---
title: Postgres COUNT() function
subtitle: Count rows or non-null values in a result set
enableTableOfContents: true
updatedOn: '2024-06-29T12:27:47.894Z'
---

The Postgres `COUNT()` function counts the number of rows in a result set or the number of non-null values in a specific column.

It's useful for data analysis, reporting, and understanding the size and composition of your datasets. Some common use cases include calculating the total number of records in a table, finding the number of distinct values in a column, or determining how many rows meet certain conditions.

<CTA />

## Function signatures

The `COUNT()` function has two main forms:

```sql
COUNT(*) -> bigint
```

- Counts the total number of rows in the result set.

```sql
COUNT([DISTINCT] expression) -> bigint
```

- Counts the number of rows where the input expression is not NULL.
- `DISTINCT` is an optional keyword, that removes duplicate values before counting.

## Example usage

Consider an `orders` table that tracks orders placed by customers of an online store. It has columns `order_id`, `customer_id`, `product_id`, and `order_date`. We'll use the `COUNT()` function to analyze this data.

```sql
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    product_id INTEGER,
    order_amount DECIMAL(10, 2) NOT NULL,
    order_date TIMESTAMP NOT NULL
);

INSERT INTO orders (customer_id, product_id, order_amount, order_date)
VALUES
    (1, 101, 150.00, '2023-01-15 10:30:00'),
    (2, 102, 75.50, '2023-01-16 11:45:00'),
    (1, 103, 200.00, '2023-02-01 09:15:00'),
    (3, 104, 50.25, '2023-02-10 14:20:00'),
    (2, 105, 125.75, '2023-03-05 16:30:00'),
    (4, NULL, 90.00, '2023-03-10 13:00:00'),
    (1, 106, 180.50, '2023-04-02 11:10:00'),
    (3, 107, 60.25, '2023-04-15 10:45:00'),
    (5, 108, 110.00, '2023-05-01 15:20:00'),
    (2, 109, 95.75, '2023-05-20 12:30:00');
```

### Count all rows

To get the total number of orders, you can use `COUNT(*)`:

```sql
SELECT COUNT(*) AS total_orders
FROM orders;
```

This query will return the total number of rows in the `orders` table.

```text
 total_orders
--------------
           10
(1 row)
```

### Count non-null values

To count how many orders have a `product_id` (assuming some orders might not have a product associated):

```sql
SELECT COUNT(product_id) AS orders_with_product
FROM orders;
```

This query will return the number of orders where `product_id` is not NULL.

```text
 orders_with_product
---------------------
                   9
(1 row)
```

### Count distinct values

To find out how many unique customers have placed orders:

```sql
SELECT COUNT(DISTINCT customer_id) AS unique_customers
FROM orders;
```

This query will return the number of distinct `customer_id` values in the `orders` table.

```text
 unique_customers
------------------
                5
(1 row)
```

## Advanced examples

We use the `orders` table created in the previous section to demonstrate more use cases of the `COUNT()` function.

### Combine COUNT() with GROUP BY

You can use `COUNT()` with `GROUP BY` to get counts for different categories:

```sql
SELECT
  DATE_TRUNC('month', order_date) AS month,
  COUNT(*) AS orders_per_month
FROM orders
GROUP BY DATE_TRUNC('month', order_date)
ORDER BY month;
```

This query counts the number of orders for each month.

```text
        month        | orders_per_month
---------------------+------------------
 2023-01-01 00:00:00 |                2
 2023-02-01 00:00:00 |                2
 2023-03-01 00:00:00 |                2
 2023-04-01 00:00:00 |                2
 2023-05-01 00:00:00 |                2
(5 rows)
```

### Use COUNT() in a subquery

You can use `COUNT()` in a subquery to filter based on counts:

```sql
SELECT customer_id, COUNT(*) AS order_count
FROM orders
GROUP BY customer_id
HAVING COUNT(*) > (
  SELECT AVG(order_count)
  FROM (
    SELECT COUNT(*) AS order_count
    FROM orders
    GROUP BY customer_id
  ) AS customer_order_counts
);
```

This query finds customers who have placed more orders than the average number of orders per customer.

```text
 customer_id | order_count
-------------+-------------
           2 |           3
           1 |           3
(2 rows)
```

### Combine COUNT() with CASE

You can use `COUNT()` with `CASE` statements to only count rows that meet specific conditions:

```sql
SELECT
  COUNT(*) AS total_orders,
  COUNT(CASE WHEN order_amount > 100 THEN 1 END) AS high_value_orders,
  COUNT(CASE WHEN order_amount <= 100 THEN 1 END) AS low_value_orders
FROM orders;
```

This query counts the total number of orders, as well as the number of high-value and low-value orders.

```text
 total_orders | high_value_orders | low_value_orders
--------------+-------------------+------------------
           10 |                 5 |                5
(1 row)
```

### Use COUNT() with FILTER clause

Postgres also allows using a `FILTER` clause with aggregate functions, which can be more readable than `CASE` statements:

```sql
SELECT
  COUNT(*) AS total_orders,
  COUNT(*) FILTER (WHERE order_date >= '2023-04-01') AS recent_orders
FROM orders;
```

This query counts the total number of orders, as well as the number of orders placed after April 1, 2023.

```text
 total_orders | recent_orders
--------------+---------------
           10 |             4
(1 row)
```

## Additional considerations

### Performance implications

`COUNT(*)` is generally faster than `COUNT(column)` or `COUNT(DISTINCT column)` because it doesn't need to check for NULL values or uniqueness. However, on very large tables, even `COUNT(*)` can be slow if it needs to scan the entire table.

For frequently used counts, consider maintaining a separate counter table or using materialized views to improve performance.

### NULL handling

Both `COUNT(column)` and `COUNT(DISTINCT column)` expressions do not count NULL values. If you need to include NULL values in your count, use `COUNT(*)` or `COUNT(COALESCE(column, 0))`.

### Alternative approaches

- For approximate counts of distinct values in very large datasets, consider using the `pg_stat_statements` extension or the `HyperLogLog` algorithm (available through extensions like `postgresql-hll`).
- For faster counts on large tables, consider using estimate counts based on table statistics with `pg_class.reltuples`.

## Resources

- [PostgreSQL documentation: Aggregate Functions](https://www.postgresql.org/docs/current/functions-aggregate.html)
- [PostgreSQL documentation: FILTER Clause for Aggregate Functions](https://www.postgresql.org/docs/current/sql-expressions.html#SYNTAX-AGGREGATES)
