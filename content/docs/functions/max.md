---
title: Postgres max() function
subtitle: Find the maximum value in a set of values
enableTableOfContents: true
updatedOn: '2024-06-30T11:39:13.123Z'
---

You can use the Postgres `max()` function to find the maximum value in a set of values.

It's particularly useful for data analysis, reporting, and finding extreme values within datasets. You might use `max()` to find the product with the highest price in the catalog, the most recent timestamp in a log table, or the largest transaction amount in a financial system.

<CTA />

## Function signature

The `max()` function has this simple form:

```sql
max(expression) -> same as expression
```

- `expression`: Any valid expression that can be evaluated across a set of rows. This can be a column name or a function that returns a value.

## Example usage

Consider an `orders` table that tracks orders placed by customers of an online store. It has columns `order_id`, `customer_id`, `product_id`, and `order_date`. We will use this table for examples throughout this guide.

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

We can use `max()` to find the largest order amount:

```sql
SELECT max(order_amount) AS largest_order
FROM orders;
```

This query returns the following output:

```text
 largest_order
---------------
        200.00
(1 row)
```

To find the most recent order date, we compute the maximum value of `order_date`:

```sql
SELECT max(order_date) AS latest_order_date
FROM orders;
```

This query returns the following output:

```text
  latest_order_date
---------------------
 2023-05-20 12:30:00
(1 row)
```

## Advanced examples

### Using max() with GROUP BY

You can use `max()` with `GROUP BY` to find the maximum values in each group:

```sql
SELECT customer_id, max(order_amount) AS largest_order
FROM orders
GROUP BY customer_id
ORDER BY largest_order DESC
LIMIT 5;
```

This query finds the largest order amount for each customer and returns the top 5 customers, sorted in order of the largest order amount.

```text
 customer_id | largest_order
-------------+---------------
           1 |        200.00
           2 |        125.75
           5 |        110.00
           4 |         90.00
           3 |         60.25
(5 rows)
```

### Using max() with a FILTER clause

The `FILTER` clause allows you to selectively include rows in the `max()` calculation:

```sql
SELECT
    max(order_amount) AS max_overall,
    max(order_amount) FILTER (WHERE EXTRACT(MONTH FROM order_date) = 4) AS max_in_april
FROM orders;
```

This query calculates both the overall maximum order amount and the maximum order amount for the year 2023.

```text
 max_overall | max_in_april
-------------+--------------
      200.00 |       180.50
(1 row)
```

### Finding the row with the maximum value for a column

To retrieve the entire row containing the maximum value, you can use a subquery:

```sql
SELECT *
FROM orders
WHERE order_amount = (SELECT max(order_amount) FROM orders);
```

This query returns the full details of the order with the maximum `order_amount`.

```text
 order_id | customer_id | product_id | order_amount |     order_date
----------+-------------+------------+--------------+---------------------
        3 |           1 |        103 |       200.00 | 2023-02-01 09:15:00
(1 row)
```

### Using max() with window functions

`max()` can be used as a window function to calculate the running maximum over a set of rows:

```sql
SELECT
    order_id,
    order_date,
    max(order_amount) OVER (
        ORDER BY order_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS running_max_amount
FROM orders
ORDER BY order_date;
```

This query calculates the running maximum order amount over time, showing how the largest order amount changes as new orders come in.

```text
 order_id |     order_date      | running_max_amount
----------+---------------------+--------------------
        1 | 2023-01-15 10:30:00 |             150.00
        2 | 2023-01-16 11:45:00 |             150.00
        3 | 2023-02-01 09:15:00 |             200.00
        4 | 2023-02-10 14:20:00 |             200.00
        5 | 2023-03-05 16:30:00 |             200.00
        6 | 2023-03-10 13:00:00 |             200.00
        7 | 2023-04-02 11:10:00 |             200.00
        8 | 2023-04-15 10:45:00 |             200.00
        9 | 2023-05-01 15:20:00 |             200.00
       10 | 2023-05-20 12:30:00 |             200.00
(10 rows)
```

## Additional considerations

### NULL values

`max()` ignores NULL values in its calculations. If all values in the set are NULL, `max()` returns NULL.

### Performance implications

When used with an index on the column being evaluated, `max()` is typically very efficient. The database can often use an index scan to quickly find the maximum value without needing to examine every row in the table. For large datasets, ensure that the column used in the `max()` function is properly indexed to maintain good performance.

### Alternative functions

- `min()`: Returns the minimum value in a set of values.
- `greatest()`: Returns the largest value from a list of values/expressions within a single row.

## Resources

- [PostgreSQL documentation: Aggregate Functions](https://www.postgresql.org/docs/current/functions-aggregate.html)
