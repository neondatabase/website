---
title: Postgres sum() function
subtitle: Calculate the sum of a set of values
enableTableOfContents: true
updatedOn: '2024-06-29T11:31:24.999Z'
---

The Postgres `sum()` function calculates the total of a set of numeric values.

It's used in data analysis and reporting to compute totals across rows in a table or grouped data. This function is particularly useful in financial applications for calculating total revenue or expenses, in inventory management for summing up quantities, or in analytics for aggregating metrics across various dimensions.

<CTA />

## Function signature

The `sum()` function has this simple form:

```sql
sum([DISTINCT] expression) -> numeric type
```

- `expression`: Any numeric expression or column name. The function returns a value of the same data type as the input.
- `DISTINCT`: Optional keyword that causes `sum()` to consider only unique values in the calculation.

The output of the `sum()` function has the same data type as the input if it's a floating-point (real / double-precision) type. To avoid overflow, the output for smallint/integer inputs is a bigint, and for bigint/numeric inputs, it is numeric type.

## Example usage

Consider a `sales` table that tracks product sales, with columns `product_id`, `quantity`, and `price`. We can use `sum()` to calculate the total revenue from each product.

```sql
WITH sales(product_id, quantity, price) AS (
  VALUES
    (1, 10, 100.0),
    (2, 5, 50.0),
    (1, 5, 100.0),
    (3, 3, 75.0),
    (2, 2, 50.0)
)
SELECT sum(quantity * price) AS total_revenue
FROM sales;
```

This query calculates the total revenue by multiplying the quantity and price for each sale.

```text
 total_revenue
---------------
        2075.0
(1 row)
```

## Advanced examples

### Sum with grouping

You can use `sum()` with `GROUP BY` to calculate subtotals for different categories:

```sql
WITH employee_sales AS (
  SELECT 'Alice' AS employee, 'Electronics' AS department, 5000 AS sales
  UNION ALL
  SELECT 'Bob' AS employee, 'Electronics' AS department, 6000 AS sales
  UNION ALL
  SELECT 'Charlie' AS employee, 'Clothing' AS department, 4500 AS sales
  UNION ALL
  SELECT 'David' AS employee, 'Clothing' AS department, 5500 AS sales
)
SELECT department, sum(sales) AS total_sales
FROM employee_sales
GROUP BY department;
```

This query calculates the total sales for each department.

```
 department  | total_sales
-------------+-------------
 Clothing    |       10000
 Electronics |       11000
(2 rows)
```

### Sum with FILTER clause

You can use the `FILTER` clause to conditionally include values in the sum:

```sql
WITH orders AS (
  SELECT 1 AS order_id, 'completed' AS status, 100 AS total
  UNION ALL
  SELECT 2 AS order_id, 'pending' AS status, 150 AS total
  UNION ALL
  SELECT 3 AS order_id, 'completed' AS status, 200 AS total
  UNION ALL
  SELECT 4 AS order_id, 'cancelled' AS status, 75 AS total
)
SELECT
  sum(total) AS all_orders_total,
  sum(total) FILTER (WHERE status = 'completed') AS completed_orders_total
FROM orders;
```

This query calculates the sum of all order totals and the sum of only completed order totals.

```text
 all_orders_total | completed_orders_total
------------------+------------------------
              525 |                    300
(1 row)
```

### Sum over a window

You can use `sum()` as a window function to calculate running totals:

```sql
WITH monthly_sales AS (
  SELECT
    '2023-01-01'::date AS month,
    10000 AS sales
  UNION ALL
  SELECT '2023-02-01'::date, 12000
  UNION ALL
  SELECT '2023-03-01'::date, 15000
  UNION ALL
  SELECT '2023-04-01'::date, 11000
)
SELECT
  month,
  sales,
  sum(sales) OVER (ORDER BY month) AS running_total
FROM monthly_sales;
```

This query calculates a running total of sales over time.

```text
   month    | sales | running_total
------------+-------+---------------
 2023-01-01 | 10000 |         10000
 2023-02-01 | 12000 |         22000
 2023-03-01 | 15000 |         37000
 2023-04-01 | 11000 |         48000
(4 rows)
```

## Additional considerations

### Null values

The `sum()` function ignores NULL values in its calculations. If all values are NULL, `sum()` returns NULL. Additionally, if there are no rows to sum over, `sum()` returns NULL instead of 0 which might be unexpected.

### Overflow handling

When summing very large numbers, be aware of potential overflow issues. Consider using larger data types (e.g., `bigint` instead of `integer`) or the `numeric` type for precise calculations with large numbers.

### Alternative functions

- `avg()`: Calculates the average of a set of values.
- `count()`: Counts the number of rows or non-null values.
- `max()` and `min()`: Find the maximum and minimum in a set of values.

## Resources

- [PostgreSQL documentation: Aggregate Functions](https://www.postgresql.org/docs/current/functions-aggregate.html)
- [PostgreSQL documentation: Window Functions](https://www.postgresql.org/docs/current/tutorial-window.html)
