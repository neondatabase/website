---
title: 'PostgreSQL COALESCE'
redirectFrom:
  - /docs/postgresql/postgresql-tutorial/postgresql-coalesce
tableOfContents: true
---

**Summary**: in this tutorial, you will learn about the PostgreSQL `COALESCE()` function that returns the first non-null argument.

## PostgreSQL COALESCE function syntax

The `COALESCE()` function accepts a list of arguments and returns the first non-null argument.

Here's the basic syntax of the `COALESCE()` function:

```sql
COALESCE (argument_1, argument_2, …);
```

The `COALESCE()` function accepts multiple arguments and returns the first argument that is not null. If all arguments are null, the `COALESCE()` function will return null.

The `COALESCE()` function evaluates arguments from left to right until it finds the first non-null argument. All the remaining arguments from the first non-null argument are not evaluated.

The `COALESCE` function provides the same functionality as `NVL` or `IFNULL` function provided by SQL standard. MySQL has the [IFNULL function](https://www.mysqltutorial.org/mysql-control-flow-functions/mysql-ifnull/) whereas Oracle Database offers the [`NVL`](https://www.oracletutorial.com/oracle-comparison-functions/oracle-nvl/)function.

## PostgreSQL COALESCE() Function examples

Let's take some examples of using the `COALESCE()` function.

### 1) Basic PostgreSQL COALESCE() function examples

The following example uses the `COALESCE()` function to return the first non-null argument:

```sql
SELECT COALESCE (1, 2);
```

Since both arguments are non-null, the function returns the first argument:

```
 coalesce
----------
        1
(1 row)
```

The following example uses the `COALESCE()` function to return the first non-null argument:

```sql
SELECT COALESCE (NULL, 2 , 1);
```

Because the first argument is NULL and the second argument is non-null, the function returns the second argument:

```
 coalesce
----------
        2
(1 row)
```

In practice, you often use the `COLAESCE()` function to substitute a default value for null when querying data from nullable columns.

For example, if you want to display the excerpt from a blog post and the excerpt is not provided, you can use the first 150 characters of the content of the post.

To achieve this, you can use the `COALESCE` function as follows:

```sql
SELECT
  COALESCE (
    excerpt,
    LEFT(content, 150)
  )
FROM
  posts;
```

### 2) Using the COALESCE() function with table data

First, [create a table](/docs/postgresql/postgresql-create-table) called `items`:

```sql
CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  product VARCHAR (100) NOT NULL,
  price NUMERIC NOT NULL,
  discount NUMERIC
);
```

The `items` table has four columns:

- `id`: the primary key that identifies the item in the `items` table.
- `product`: the product name.
- `price`: the price of the product.
- `discount`: the discount on the product.

Second, [insert some rows](/docs/postgresql/postgresql-insert-multiple-rows) into the `items` table:

```sql
INSERT INTO items (product, price, discount)
VALUES
  ('A', 1000, 10),
  ('B', 1500, 20),
  ('C', 800, 5),
  ('D', 500, NULL);
```

Third, retrieve the net prices of the products from the `items` table:

```sql
SELECT
  product,
  (price - discount) AS net_price
FROM
  items;
```

Output:

```
 product | net_price
---------+-----------
 A       |       990
 B       |      1480
 C       |       795
 D       |      null
(4 rows)
```

The output indicates that the net price of the product `D` is null.

The issue is that the `discount` of the product `D` is null. Therefore, the net price is NULL because it involves NULL in the calculation.

With an assumption that if the discount is null, the net price is zero, you can use the `COALESCE()` function in the query as follows:

```sql
SELECT
  product,
  (
    price - COALESCE(discount, 0)
  ) AS net_price
FROM
  items;
```

Output:

```
 product | net_price
---------+-----------
 A       |       990
 B       |      1480
 C       |       795
 D       |       500
(4 rows)
```

Now the net price of the product `D` is `500` because the query uses zero instead of NULL when calculating the net price.

Besides using the `COALESCE()` function, you can use the [CASE](/docs/postgresql/postgresql-case) expression to handle the NULL in this example.

For example, the following query uses the `CASE` expression to achieve the same result:

```sql
SELECT
  product,
  (
    price - CASE WHEN discount IS NULL THEN 0 ELSE discount END
  ) AS net_price
FROM
  items;
```

In this query, if the discount is null then use zero (0) otherwise use the discount value to calculate the net price.

In terms of performance, the `COALESCE()` function and `CASE` expression are the same.

It is recommended to use `COALESCE()` function because it makes the query shorter and easier to read.

## Summary

- Use the `COALESCE()` function to substitute null values in the query.
