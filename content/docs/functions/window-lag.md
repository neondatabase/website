---
title: Postgres lag() window function
subtitle: Use lag() to access values from previous rows in a result set
enableTableOfContents: true
updatedOn: '2024-06-14T07:55:54.378Z'
---

The `lag()` function in Postgres is a window function that allows you to access values from previous rows in a result set without the need for a self-join. It's useful for comparing values between the current row and a previous row, for example, when calculating running differences, plotting trends, or doing time series analysis.

<CTA />

## Function signature

The `lag()` function has the following forms:

```sql
lag(value any [, offset integer [, default any ]]) over (...)
```

- `value`: The value to return from the previous row. This can be a column, expression, or subquery.
- `offset` (optional): The number of rows back from the current row to retrieve the value from. If omitted, it defaults to 1. Must be a non-negative integer.
- `default` (optional): The value to return when the offset goes beyond the scope of the window. If omitted, it defaults to null.
- `over (...)`: The `OVER` clause defines the window frame for the function. It can be an empty `OVER ()`, or it can include a `PARTITION BY` and/or `ORDER BY` clause.

## Example usage

Consider a table `sales` that contains daily sales data for a company. We can use `lag()` to compare each day's sales to the previous day's sales.

```sql
WITH sales AS (
  SELECT date '2023-01-01' AS sale_date, 1000 AS amount
  UNION ALL
  SELECT date '2023-01-02' AS sale_date, 1500 AS amount
  UNION ALL
  SELECT date '2023-01-03' AS sale_date, 1200 AS amount
  UNION ALL
  SELECT date '2023-01-04' AS sale_date, 1800 AS amount
)
SELECT
  sale_date,
  amount,
  lag(amount) OVER (ORDER BY sale_date) AS prev_amount,
  amount - lag(amount) OVER (ORDER BY sale_date) AS diff
FROM sales;
```

This query calculates the previous day's sales amount (`prev_amount`) and the difference between the current day's sales and the previous day's sales (`diff`). The `OVER` clause specifies that the window frame should be ordered by `sale_date`.

```text
 sale_date  | amount | prev_amount |  diff
------------+--------+-------------+-------
 2023-01-01 |   1000 |             |
 2023-01-02 |   1500 |        1000 |   500
 2023-01-03 |   1200 |        1500 |  -300
 2023-01-04 |   1800 |        1200 |   600
(4 rows)
```

You can also use `lag()` to access values from rows further back by specifying an offset. For example, to compare each day's sales to the sales from the same day of the previous week:

```sql
WITH sales AS (
  SELECT
    sale_date,
    floor(random() * 1000 + 1)::int AS amount
  FROM generate_series(date '2023-01-01', date '2023-01-31', interval '1 day') AS sale_date
)
SELECT
  sale_date,
  amount,
  lag(amount, 7) OVER (ORDER BY sale_date) AS prev_week_amount,
  amount - lag(amount, 7) OVER (ORDER BY sale_date) AS diff
FROM sales
ORDER BY sale_date DESC
LIMIT 5;
```

This query generates random sales data for each day in January 2023 and compares each day's sales to the sales from the same day of the previous week. The `lag()` function with an offset of 7 retrieves the sales amount from 7 days ago.

```text
       sale_date        | amount | prev_week_amount | diff
------------------------+--------+------------------+------
 2023-01-31 00:00:00+00 |    245 |               64 |  181
 2023-01-30 00:00:00+00 |    736 |              789 |  -53
 2023-01-29 00:00:00+00 |    208 |              763 | -555
 2023-01-28 00:00:00+00 |    710 |              899 | -189
 2023-01-27 00:00:00+00 |      1 |              229 | -228
 (5 rows)
```

## Advanced examples

### Using `lag()` with a default value

When the offset in `lag()` goes beyond the start of the window frame, it returns null by default. You can specify a default value to use instead, so the resulting column does not contain nulls.

```sql
WITH inventory AS (
  SELECT date '2023-01-01' AS snapshot_date, 100 AS quantity
  UNION ALL
  SELECT date '2023-01-02' AS snapshot_date, 80 AS quantity
  UNION ALL
  SELECT date '2023-01-03' AS snapshot_date, 120 AS quantity
  UNION ALL
  SELECT date '2023-01-04' AS snapshot_date, 90 AS quantity
)
SELECT
  snapshot_date,
  quantity,
  lag(quantity, 1, quantity) OVER (ORDER BY snapshot_date) AS prev_quantity,
  quantity - lag(quantity, 1, quantity) OVER (ORDER BY snapshot_date) AS change
FROM inventory;
```

This query calculates the change in inventory quantity compared to the previous day. For the first row, where there is no previous quantity, it uses the current quantity as the default value, resulting in a change of 0.

```text
 snapshot_date | quantity | prev_quantity | change
---------------+----------+---------------+--------
 2023-01-01    |      100 |           100 |      0
 2023-01-02    |       80 |           100 |    -20
 2023-01-03    |      120 |            80 |     40
 2023-01-04    |       90 |           120 |    -30
(4 rows)
```

### Using `lag()` with partitioning

You can use `lag()` with partitioning to perform calculations within groups of rows.

```sql
WITH orders AS (
  SELECT 1 AS order_id, date '2023-01-01' AS order_date, 100 AS amount, 1 AS customer_id
  UNION ALL
  SELECT 2 AS order_id, date '2023-01-02' AS order_date, 150 AS amount, 1 AS customer_id
  UNION ALL
  SELECT 3 AS order_id, date '2023-01-03' AS order_date, 200 AS amount, 2 AS customer_id
  UNION ALL
  SELECT 4 AS order_id, date '2023-01-04' AS order_date, 120 AS amount, 1 AS customer_id
  UNION ALL
  SELECT 5 AS order_id, date '2023-01-05' AS order_date, 180 AS amount, 2 AS customer_id
)
SELECT
  order_id,
  order_date,
  amount,
  customer_id,
  lag(order_date) OVER (PARTITION BY customer_id ORDER BY order_date) AS prev_order_date,
  order_date - lag(order_date) OVER (PARTITION BY customer_id ORDER BY order_date) AS days_since_last_order
FROM orders;
```

This query calculates the number of days since each customer's previous order. The `OVER` clause partitions the data by `customer_id` and orders it by `order_date` within each partition.

```text
 order_id | order_date | amount | customer_id | prev_order_date | days_since_last_order
----------+------------+--------+-------------+-----------------+-----------------------
        1 | 2023-01-01 |    100 |           1 |                 |
        2 | 2023-01-02 |    150 |           1 | 2023-01-01      |                     1
        4 | 2023-01-04 |    120 |           1 | 2023-01-02      |                     2
        3 | 2023-01-03 |    200 |           2 |                 |
        5 | 2023-01-05 |    180 |           2 | 2023-01-03      |                     2
(5 rows)
```

## Additional considerations

### Correctness

The `lag()` function relates each row in the result set to a previous row in the same window frame. If the window frame is not explicitly defined, the default frame is the entire result set. Make sure to specify the correct `ORDER BY` and `PARTITION BY` clauses to ensure the desired behavior.

### Performance implications

Window functions like `lag()` perform calculations across a set of rows defined by the `OVER` clause. This can be computationally expensive for large datasets or complex window definitions.

To optimize performance, make sure to:

- Include an `ORDER BY` clause in the `OVER` clause to avoid sorting the entire dataset.
- Use partitioning (`PARTITION BY`) to divide the data into smaller chunks when possible.
- Create appropriate indexes on the columns used in the `OVER` clause.

### Alternative functions

- [lead](/docs/functions/window-lead) - Access values from subsequent rows in a result set. Similar to `lag()` but looks ahead in the partition instead of behind.
- `first_value()` - Get the first value within a window frame.
- `last_value()` - Get the last value within a window frame.

## Resources

- [PostgreSQL documentation: Window functions](https://www.postgresql.org/docs/current/tutorial-window.html)
- [PostgreSQL documentation: Lag function](https://www.postgresql.org/docs/current/functions-window.html#FUNCTIONS-WINDOW-TABLE)
