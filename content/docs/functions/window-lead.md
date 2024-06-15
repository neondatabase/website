---
title: Postgres lead() window function
subtitle: Use lead() to access values from subsequent rows in a result set
enableTableOfContents: true
updatedOn: '2024-06-14T07:55:54.378Z'
---

The `lead()` function in Postgres is a window function that allows you to access values from subsequent rows in a result set without the need for a self-join.

It's useful for comparing values between the current row and a later row, for example, when calculating the time until the next event, determining the next event in a sequence, or analyzing trends in time series data.

<CTA />

## Function signature

The `lead()` function has the following forms:

```sql
lead(value any [, offset integer [, default any ]]) over (...)
```

- `value`: The value to return from the subsequent row. This can be a column, expression, or subquery.
- `offset` (optional): The number of rows ahead of the current row to retrieve the value from. If omitted, it defaults to 1. Must be a non-negative integer.
- `default` (optional): The value to return when the offset goes beyond the scope of the window. If omitted, it defaults to null.
- `over (...)`: The `OVER` clause defines the window frame for the function. It can be an empty `OVER ()`, or it can include a `PARTITION BY` and/or `ORDER BY` clause.

## Example usage

Consider a table `shipments` that contains information about product shipments. We can use `lead()` to determine the next scheduled shipment date for each product.

```sql
WITH shipments AS (
  SELECT 1 AS product_id, date '2023-01-01' AS ship_date
  UNION ALL
  SELECT 1 AS product_id, date '2023-01-15' AS ship_date
  UNION ALL
  SELECT 2 AS product_id, date '2023-01-05' AS ship_date
  UNION ALL
  SELECT 1 AS product_id, date '2023-02-01' AS ship_date
  UNION ALL
  SELECT 2 AS product_id, date '2023-01-20' AS ship_date
)
SELECT
  product_id,
  ship_date,
  lead(ship_date) OVER (PARTITION BY product_id ORDER BY ship_date) AS next_ship_date,
  lead(ship_date) OVER (PARTITION BY product_id ORDER BY ship_date) - ship_date AS days_until_next_shipment
FROM shipments;
```

This query calculates the next shipment date (`next_ship_date`) and the number of days until the next shipment (`days_until_next_shipment`) for each product. The `OVER` clause partitions the data by `product_id` and orders it by `ship_date` within each partition.

```text
 product_id | ship_date  | next_ship_date | days_until_next_shipment
------------+------------+----------------+--------------------------
          1 | 2023-01-01 | 2023-01-15     |                       14
          1 | 2023-01-15 | 2023-02-01     |                       17
          1 | 2023-02-01 |                |
          2 | 2023-01-05 | 2023-01-20     |                       15
          2 | 2023-01-20 |                |
(5 rows)
```

You can also use `lead()` to access values from rows further ahead by specifying an offset. For example, to compute the net return on investment for a stock ticker over each 2-year period:

```sql
WITH stock_prices AS (
  SELECT 'AAPL' AS ticker, date '2018-01-01' AS price_date, 41.54 AS price
  UNION ALL
  SELECT 'AAPL' AS ticker, date '2019-01-01' AS price_date, 39.48 AS price
  UNION ALL
  SELECT 'AAPL' AS ticker, date '2020-01-01' AS price_date, 74.60 AS price
  UNION ALL
  SELECT 'AAPL' AS ticker, date '2021-01-01' AS price_date, 131.96 AS price
  UNION ALL
  SELECT 'AAPL' AS ticker, date '2022-01-01' AS price_date, 182.01 AS price
  UNION ALL
  SELECT 'AAPL' AS ticker, date '2023-01-01' AS price_date, 129.93 AS price
)
SELECT
  ticker,
  price_date,
  price,
  lead(price, 2) OVER (PARTITION BY ticker ORDER BY price_date) AS price_2_years_later,
  round(100.0 * (lead(price, 2) OVER (PARTITION BY ticker ORDER BY price_date) - price) / price, 2) AS two_year_return_pct
FROM stock_prices;
```

This query calculates the price of each stock ticker 2 years later (`price_2_years_later`) and the percentage return on investment (`two_year_return_pct`) for each ticker. The `OVER` clause partitions the data by `ticker` and orders it by `price_date` within each partition.

```text
 ticker | price_date | price  | price_2_years_later | two_year_return_pct
--------+------------+--------+---------------------+---------------------
 AAPL   | 2018-01-01 |  41.54 |               74.60 |               79.59
 AAPL   | 2019-01-01 |  39.48 |              131.96 |              234.25
 AAPL   | 2020-01-01 |  74.60 |              182.01 |              143.98
 AAPL   | 2021-01-01 | 131.96 |              129.93 |               -1.54
 AAPL   | 2022-01-01 | 182.01 |                     |
 AAPL   | 2023-01-01 | 129.93 |                     |
 (6 rows)
```

## Advanced examples

### Using `lead()` with a default value

When the offset in `lead()` goes beyond the end of the window frame, it returns null by default. You can specify a default value to use instead, so the resulting column does not contain nulls.

```sql
WITH tasks AS (
  SELECT 1 AS project_id, 1 AS task_id, date '2023-01-01' AS start_date, date '2023-01-05' AS end_date
  UNION ALL
  SELECT 1 AS project_id, 2 AS task_id, date '2023-01-07' AS start_date, date '2023-01-10' AS end_date
  UNION ALL
  SELECT 1 AS project_id, 3 AS task_id, date '2023-01-10' AS start_date, date '2023-01-15' AS end_date
  UNION ALL
  SELECT 2 AS project_id, 1 AS task_id, date '2023-01-01' AS start_date, date '2023-01-10' AS end_date
  UNION ALL
  SELECT 2 AS project_id, 2 AS task_id, date '2023-01-11' AS start_date, date '2023-01-20' AS end_date
)
SELECT
  project_id,
  task_id,
  start_date,
  end_date,
  lead(start_date, 1, end_date) OVER (PARTITION BY project_id ORDER BY start_date) AS next_start_date
FROM tasks;
```

This query determines the start date of the next task in each project. For the last task in each project, where there is no next start date, it uses the current task's end date as the default value.

```text
 project_id | task_id | start_date |  end_date  | next_start_date
------------+---------+------------+------------+-----------------
          1 |       1 | 2023-01-01 | 2023-01-05 | 2023-01-07
          1 |       2 | 2023-01-07 | 2023-01-10 | 2023-01-10
          1 |       3 | 2023-01-10 | 2023-01-15 | 2023-01-15
          2 |       1 | 2023-01-01 | 2023-01-10 | 2023-01-11
          2 |       2 | 2023-01-11 | 2023-01-20 | 2023-01-20
(5 rows)
```

### Using `lead()` with multiple partitions

You can use `lead()` with multiple partitions to perform calculations within different groups of rows simultaneously.

```sql
WITH readings AS (
  SELECT 1 AS device_id, date '2023-01-01' AS reading_date, 25.5 AS temperature
  UNION ALL
  SELECT 1 AS device_id, date '2023-01-02' AS reading_date, 26.0 AS temperature
  UNION ALL
  SELECT 2 AS device_id, date '2023-01-01' AS reading_date, 22.1 AS temperature
  UNION ALL
  SELECT 1 AS device_id, date '2023-01-03' AS reading_date, 25.8 AS temperature
  UNION ALL
  SELECT 2 AS device_id, date '2023-01-02' AS reading_date, 21.9 AS temperature
)
SELECT
  device_id,
  reading_date,
  temperature,
  lead(temperature) OVER (PARTITION BY device_id ORDER BY reading_date) AS next_temperature,
  lead(temperature) OVER (PARTITION BY device_id ORDER BY reading_date) - temperature AS temperature_change
FROM readings;
```

This query calculates the next temperature reading (`next_temperature`) and the change in temperature (`temperature_change`) for each device. The `OVER` clause partitions the data by `device_id` and orders it by `reading_date` within each partition, allowing the analysis to be performed separately for each device.

```text
 device_id | reading_date | temperature | next_temperature | temperature_change
-----------+--------------+-------------+------------------+--------------------
         1 | 2023-01-01   |        25.5 |             26.0 |                0.5
         1 | 2023-01-02   |        26.0 |             25.8 |               -0.2
         1 | 2023-01-03   |        25.8 |                  |
         2 | 2023-01-01   |        22.1 |             21.9 |               -0.2
         2 | 2023-01-02   |        21.9 |                  |
(5 rows)
```

## Additional considerations

### Correctness

The `lead()` function relates each row in the result set to a subsequent row in the same window frame. If the window frame is not explicitly defined, the default frame is the entire partition or result set. Make sure to specify the correct `ORDER BY` and `PARTITION BY` clauses to ensure the desired behavior.

### Performance implications

Window functions like `lead()` perform calculations across a set of rows defined by the `OVER` clause. This can be computationally expensive, especially for large datasets or complex window definitions.

To optimize performance, make sure to:

- Include an `ORDER BY` clause in the `OVER` clause to avoid sorting the entire dataset.
- Use partitioning (`PARTITION BY`) to divide the data into smaller chunks when possible.
- Create appropriate indexes on the columns used in the `OVER` clause.

### Alternative functions

- [lag](/docs/functions/window-lag) - Access values from previous rows in a result set. Similar to `lead()` but looks behind in the partition instead of ahead.
- `first_value()` - Get the first value within a window frame.
- `last_value()` - Get the last value within a window frame.

## Resources

- [PostgreSQL documentation: Window functions](https://www.postgresql.org/docs/current/tutorial-window.html)
- [PostgreSQL documentation: Lead function](https://www.postgresql.org/docs/current/functions-window.html#FUNCTIONS-WINDOW-TABLE)
