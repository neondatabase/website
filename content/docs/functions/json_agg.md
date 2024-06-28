---
title: Postgres json_agg() function
subtitle: Aggregate values into a JSON array
enableTableOfContents: true
updatedOn: '2024-06-28T22:29:50.742Z'
---

The Postgres `json_agg()` function is an aggregate function that collects values from multiple rows and returns them as a single JSON array.

It's particularly useful when you need to denormalize data for performance reasons or prepare data for front-end applications and APIs. For example, you might use it to aggregate product reviews for an e-commerce application or collect all posts by a user on a social media platform.

<CTA />

## Function signature

The `json_agg()` function has this simple form:

```sql
json_agg(expression) -> json
```

- `expression`: The value to be aggregated into a JSON array. This can be a column, a complex expression, or even a subquery.

When used in this manner, the order of the values in the resulting JSON array is not guaranteed. Postgres supports an extended syntax for aggregating values in a specific order.

```sql
json_agg(expression ORDER BY sort_expression [ASC | DESC] [NULLS { FIRST | LAST }]) -> json
```

- `expression`: The value to be aggregated into a JSON array.
- `ORDER BY`: Specifies the order in which the values should be aggregated.
- `sort_expression`: The expression to sort by.
- `ASC | DESC`: Specifies ascending or descending order (default is ASC).
- `NULLS { FIRST | LAST }`: Specifies whether nulls should be first or last in the ordering (default depends on `ASC` or `DESC`).

## Example usage

Consider an `orders` table with columns `order_id`, `product_name`, and `quantity`. We can use `json_agg()` to create a JSON array of all products in each order.

```sql
WITH orders AS (
    SELECT *
    FROM (
        VALUES
            (1, 'Widget A', 2),
            (1, 'Widget B', 1),
            (2, 'Widget C', 3),
            (2, 'Widget D', 2)
    ) AS t(order_id, product_name, quantity)
)
SELECT
  order_id,
  json_agg(json_build_object('product', product_name, 'quantity', quantity)) AS products
FROM orders
GROUP BY order_id;
```

This query groups the orders by `order_id` and creates a JSON array of products for each order.

```text
 order_id |                                       products
----------+--------------------------------------------------------------------------------------
        1 | [{"product" : "Widget A", "quantity" : 2}, {"product" : "Widget B", "quantity" : 1}]
        2 | [{"product" : "Widget C", "quantity" : 3}, {"product" : "Widget D", "quantity" : 2}]
(2 rows)
```

## Advanced examples

### Ordered aggregation

You can specify an order for the aggregated values, as suggested in the function signature section. Here's an example:

```sql
WITH reviews AS (
  SELECT 1 AS product_id, 'Great product!' AS comment, 5 AS rating, '2023-01-15'::date AS review_date
  UNION ALL SELECT 1, 'Could be better', 3, '2023-02-01'::date
  UNION ALL SELECT 1, 'Awesome!', 5, '2023-01-20'::date
  UNION ALL SELECT 2, 'Not bad', 4, '2023-01-10'::date
)
SELECT
  product_id,
  json_agg(
    comment || ' (' || rating || ' stars)'
    ORDER BY review_date DESC
  ) AS reviews
FROM reviews
GROUP BY product_id;
```

This query aggregates product reviews into a JSON array, ordered by the review date in descending order.

```text
 product_id |                                     reviews
------------+---------------------------------------------------------------------------------
          1 | ["Could be better (3 stars)", "Awesome! (5 stars)", "Great product! (5 stars)"]
          2 | ["Not bad (4 stars)"]
(2 rows)
```

### Combining with other JSON functions

`json_agg()` can be combined with other JSON functions for more complex transformations:

```sql
WITH sales AS (
  SELECT 'North' AS region, 'Q1' AS quarter, 100000 AS amount
  UNION ALL SELECT 'North', 'Q2', 120000
  UNION ALL SELECT 'South', 'Q1', 80000
  UNION ALL SELECT 'South', 'Q2', 90000
)
SELECT
    region,
    json_agg(
        (SELECT json_build_object('quarter', quarter, 'amount', amount))
        ORDER BY quarter DESC
    ) AS quarterly_sales
FROM sales
GROUP BY region;
```

This query uses `json_build_object()` in combination with `json_agg()` to create an array of quarterly sales data, for each region.

```text
 region |                                quarterly_sales
--------+--------------------------------------------------------------------------------
 North  | [{"quarter" : "Q2", "amount" : 120000}, {"quarter" : "Q1", "amount" : 100000}]
 South  | [{"quarter" : "Q2", "amount" : 90000}, {"quarter" : "Q1", "amount" : 80000}]
(2 rows)
```

## Additional considerations

### Performance implications

While `json_agg()` is powerful for creating JSON structures, it can be memory-intensive for large datasets since its output size linearly increases with the number of rows. When working with very large tables, consider using pagination or limiting the number of rows aggregated.

### Alternative functions

- `array_agg()`: Aggregates values into a Postgres array instead of a JSON array.
- `jsonb_agg()`: Similar to `json_agg()`, but returns a `jsonb` type, which is more efficient for storage and processing.
- `json_agg_strict()`: Aggregates values into a JSON array, skipping over the NULL values.

## Resources

- [PostgreSQL documentation: Aggregate Functions](https://www.postgresql.org/docs/current/functions-aggregate.html)
- [PostgreSQL documentation: JSON Functions and Operators](https://www.postgresql.org/docs/current/functions-json.html)
