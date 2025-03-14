---
title: Postgres abs() function
subtitle: Calculate the absolute value of a number
enableTableOfContents: true
updatedOn: '2024-06-27T15:43:16.385Z'
---

The Postgres `abs()` function is used to compute the absolute value of a number. The absolute value is the non-negative value of a number without regard to its sign.

It's useful in multiple scenarios when working with numbers, such as calculating distances, comparing magnitudes regardless of direction, or ensuring non-negative values in financial calculations.

<CTA />

## Function signature

The `abs()` function has a simple form:

```sql
abs(number) -> number
```

- `number`: The input value for which you want to calculate the absolute value. It can be of any numeric data type - integer, floating-point, or decimal.

## Example usage

Consider a table `transactions` with an `amount` column that contains both positive (deposits) and negative (withdrawals) values. We can use `abs()` to order the transactions by their magnitude.

```sql
WITH transactions(id, amount) AS (
  VALUES
    (1, 100.50),
    (2, -75.25),
    (3, 200.00),
    (4, -150.75)
)
SELECT id, amount
FROM transactions
ORDER BY abs(amount) DESC;
```

This query retrieves the transaction IDs and amounts, ordering them by the absolute value of the amount, in descending order.

```text
 id | amount
----+---------
  3 |  200.00
  4 | -150.75
  1 |  100.50
  2 |  -75.25
(4 rows)
```

## Other examples

### Using abs() for distance calculations

The `abs()` function is also frequently used for distance calculations, where the direction is not relevant. Suppose we have a table of geographical coordinates and we want to find points within a certain range of a reference point.

```sql
WITH locations(name, latitude, longitude) AS (
  VALUES
    ('Point A', 40.7128, -74.0060),
    ('Point B', 40.7484, -73.9857),
    ('Point C', 41.6892, -74.0445),
    ('Reference', 40.7300, -73.9950)
)
SELECT
  name,
  abs(latitude - 40.7300) AS lat_diff,
  abs(longitude - (-73.9950)) AS long_diff
FROM locations
WHERE
  abs(latitude - 40.7300) <= 0.05 AND
  abs(longitude - (-73.9950)) <= 0.05;
```

This query finds all points within 0.05 degrees (approximately 5.5 km) of the reference point (40.7300, -73.9950) in both latitude and longitude.

```
   name    | lat_diff | long_diff
-----------+----------+-----------
 Point A   |   0.0172 |    0.0110
 Point B   |   0.0184 |    0.0093
 Reference |   0.0000 |    0.0000
(4 rows)
```

### Combining abs() with other functions

We can combine `abs()` with other functions for more complex calculations. For example, to measure the percentage discrepancy between forecasted and actual sales, we can use `abs()` to calculate the size of the difference and then divide it by the forecasted value.

```sql
WITH sales_data(product, forecast, actual) AS (
  VALUES
    ('Product A', 1000, 1100),
    ('Product B', 500, 450),
    ('Product C', 750, 725),
    ('Product D', 300, 400)
)
SELECT
  product,
  forecast,
  actual,
  round(abs(actual - forecast) / forecast::numeric * 100, 2) AS percentage_difference
FROM sales_data
ORDER BY percentage_difference DESC;
```

This query orders the products by the percentage difference between the forecasted and actual sales.

```
  product  | forecast | actual | percentage_difference
-----------+----------+--------+-----------------------
 Product D |      300 |    400 |                 33.33
 Product A |     1000 |   1100 |                 10.00
 Product B |      500 |    450 |                 10.00
 Product C |      750 |    725 |                  3.33
(4 rows)
```

## Additional considerations

### Performance implications

The `abs()` function is pretty quick, as it's a simple mathematical operation. However, if you frequently filter or join a large dataset based on absolute values, consider creating a functional index using `abs()` to speed up queries.

### Alternative functions and operators

- The `@` operator: Postgres provides the `@` operator as an alternative to the `abs()` function. It performs the same operation (calculating the absolute value) and can be used interchangeably with `abs()`. For example, `@ -5` is equivalent to `abs(-5)`.

## Resources

- [PostgreSQL documentation: Mathematical Functions and Operators](https://www.postgresql.org/docs/current/functions-math.html)
- [PostgreSQL documentation: Numeric Types](https://www.postgresql.org/docs/current/datatype-numeric.html)
