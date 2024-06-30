---
title: Postgres round() function
subtitle: Round numbers to a specified precision
enableTableOfContents: true
updatedOn: '2024-06-28T21:11:50.387Z'
---

The Postgres `round()` function rounds numeric values to a specified number of decimal places or the nearest integer.

It can help maintain consistency in numerical data, simplify complex decimal numbers, and adjust the precision of calculations to meet specific requirements. It's particularly useful in financial calculations, data analysis, and for presenting numerical data in a more readable format.

<CTA />

## Function signature

The `round()` function has a simple form:

```sql
round(number [, decimal_places]) -> number
```

- `number`: The input value to be rounded. It can be of any numeric data type &#8212; integer, floating-point, or decimal.
- `decimal_places`: An optional integer that specifies the number of decimal places to round to. If omitted, the input number is rounded to the nearest integer.

## Example usage

Let's consider a table `product_sales` that tracks sales data for various products. We'll use the `round()` function to adjust the precision of our sales figures.

```sql
WITH product_sales(product_id, sales_amount) AS (
  VALUES
    (1, 1234.5678),
    (2, 2345.6789),
    (3, 3456.7890),
    (4, 4567.8901)
)
SELECT
  product_id,
  sales_amount,
  round(sales_amount) AS rounded_to_integer,
  round(sales_amount, 2) AS rounded_to_cents
FROM product_sales;
```

This query demonstrates using the `round()` function to round sales amounts to the nearest integer and to two decimal places (cents).

```text
 product_id | sales_amount | rounded_to_integer | rounded_to_cents
------------+--------------+--------------------+------------------
          1 |    1234.5678 |               1235 |          1234.57
          2 |    2345.6789 |               2346 |          2345.68
          3 |    3456.7890 |               3457 |          3456.79
          4 |    4567.8901 |               4568 |          4567.89
(4 rows)
```

## Other examples

### Using round() to calculate accurate percentages

The `round()` function is often used when calculating and displaying percentages. For example, consider a table with sales data for different products. Let's calculate the percentage of total sales contributed by each product.

```sql
WITH product_sales(product_id, sales_amount) AS (
  VALUES
    (1, 1234.56),
    (2, 2345.67),
    (3, 3456.78),
    (4, 4567.89)
)
SELECT
  product_id,
  sales_amount,
  round(
    (sales_amount / SUM(sales_amount) OVER ()) * 100,
    2
  ) AS percentage_of_total
FROM product_sales
ORDER BY percentage_of_total DESC;
```

This query calculates each product's contribution to total sales and rounds the percentage to two decimal places. This avoids displaying overly precise percentages that can be misleading.

```text
 product_id | sales_amount | percentage_of_total
------------+--------------+---------------------
          4 |      4567.89 |               39.36
          3 |      3456.78 |               29.79
          2 |      2345.67 |               20.21
          1 |      1234.56 |               10.64
(4 rows)
```

### Combining round() with other functions

We can combine `round()` with other functions for more complex calculations. For example, let's calculate the average order value and round it to the nearest dollar and the nearest cents:

```sql
WITH orders(order_id, total_amount) AS (
  VALUES
    (1, 123.45),
    (2, 234.56),
    (3, 345.67),
    (4, 456.78),
    (5, 567.89)
)
SELECT
  round(AVG(total_amount)) AS avg_order_value_rounded,
  round(AVG(total_amount), 2) AS avg_order_value_cents
FROM orders;
```

```text
 avg_order_value_rounded | avg_order_value_cents
-------------------------+-----------------------
                     346 |                345.67
```

## Additional considerations

### Rounding behavior

Postgres `round()` function uses the half-round-up method for tie-breaking. This means that when the input is exactly halfway between two numbers, it rounds up to the higher number. For example:

```sql
SELECT round(2.65, 1), round(2.75, 1);
```

This query rounds both 2.65 and 2.75 to the next higher number with one decimal place:

```text
 round | round
-------+-------
   2.7 |   2.8
(1 row)
```

Financial calculations often require banker's rounding (also known as round-to-even) to minimize bias. If you need this behavior, you can implement it using a custom function or by combining `round()` with other functions.

### Performance implications

The `round()` function is generally fast, but frequent use in large datasets might impact performance. If you need to round values frequently in queries, consider storing pre-rounded values in a separate column and creating a function index on it.

### Alternative functions

- `ceil()` and `floor()`: These functions round up or down to the nearest integer, respectively.
- `trunc()`: This function truncates a number to a specified number of decimal places without rounding.

## Resources

- [PostgreSQL documentation: Mathematical Functions and Operators](https://www.postgresql.org/docs/current/functions-math.html)
- [PostgreSQL documentation: Numeric Types](https://www.postgresql.org/docs/current/datatype-numeric.html)
