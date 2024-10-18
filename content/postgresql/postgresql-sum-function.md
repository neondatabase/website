---
title: 'PostgreSQL SUM Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-aggregate-functions/postgresql-sum-function/
ogImage: ./img/wp-content-uploads-2013-05-payment-table.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you'll learn how to use PostgreSQL `SUM()` function to calculate the sum of a set of values.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL SUM() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The PostgreSQL `SUM()` is an [aggregate function](https://www.postgresqltutorial.com/postgresql-aggregate-functions/) that returns the sum of values in a set.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the basic syntax of the `SUM()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SUM(DISTINCT expression)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `SUM()` function ignores `NULL`, meaning that it doesn't consider the `NULL` in calculation.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If you use the `DISTINCT` option, the `SUM()` function calculates the sum of only distinct values.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

For example, without the `DISTINCT` option, the `SUM()` of 1, 1, and 2 will return 4. But the sum of distinct values of 1, 1, and 2 will return 3 (1 + 2) because the `SUM()` function ignores one duplicate value (1).

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `SUM()` of an empty set will return `NULL`, not zero.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL SUM() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's take some examples of using the `SUM()` function. We'll use the `payment` table in the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/ "PostgreSQL Sample Database").

<!-- /wp:paragraph -->

<!-- wp:image {"id":443} -->

![payment table](./img/wp-content-uploads-2013-05-payment-table.png)

<!-- /wp:image -->

<!-- wp:heading {"level":3} -->

### 1) Using PostgreSQL SUM() function in SELECT statement example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `SUM()` function to calculate the sum of all payments in the `payment` table:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT
  SUM(amount)
FROM
  payment;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
   sum
----------
 61312.04
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Using PostgreSQL SUM() function with an empty result set

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following statement uses the `SUM()` function to calculate the total payment of the customer id 2000.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
SELECT
  SUM (amount)
FROM
  payment
WHERE
  customer_id = 2000;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
 sum
------
 null
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this example, the `SUM()` function returns a `NULL` because the `payment` the table has no row with the `customer_id` 2000.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 3) Using the SUM() function with COALESCE() function example

<!-- /wp:heading -->

<!-- wp:paragraph -->

If you want the `SUM()` function to return zero instead of `NULL` in case there is no matching row, you use the `COALESCE()` function.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `COALESCE()` function returns the first non-null argument. In other words, it returns the second argument if the first argument is `NULL`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following query illustrates how to use the `SUM()` function with the `COALESCE()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
SELECT
  COALESCE(SUM(amount), 0 ) total
FROM
  payment
WHERE
  customer_id = 2000;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
 total
-------
     0
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 4) Using PostgreSQL SUM() function with the GROUP BY clause example

<!-- /wp:heading -->

<!-- wp:paragraph -->

To calculate the summary of every group, you use the `GROUP BY` clause to group the rows in the table into groups and apply the `SUM()` function to each group.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following example uses the `SUM()` function with the `GROUP BY` clause to calculate the total amount paid by each customer:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  customer_id,
  SUM (amount) AS total
FROM
  payment
GROUP BY
  customer_id
ORDER BY
  total;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 customer_id | total
-------------+--------
         318 |  27.93
         281 |  32.90
         248 |  37.87
         320 |  47.85
...
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following query retrieves the top five customers who made the highest payments:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  customer_id,
  SUM (amount) AS total
FROM
  payment
GROUP BY
  customer_id
ORDER BY
  total DESC
LIMIT
  5;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 customer_id | total
-------------+--------
         148 | 211.55
         526 | 208.58
         178 | 194.61
         137 | 191.62
         144 | 189.60
(5 rows)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 5) Using PostgreSQL SUM() function with a HAVING clause

<!-- /wp:heading -->

<!-- wp:paragraph -->

To filter group sums based on a specific condition, you use the `SUM()` function in the `HAVING` clause.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following example retrieves customers who have made payments exceeding 200:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  customer_id,
  SUM (amount) AS total
FROM
  payment
GROUP BY
  customer_id
HAVING
  SUM(amount) > 200
ORDER BY
  total DESC
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 customer_id | total
-------------+--------
         148 | 211.55
         526 | 208.58
(2 rows)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 6) Using PostgreSQL SUM() function with an expression

<!-- /wp:heading -->

<!-- wp:paragraph -->

See the following `rental` table from the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/):

<!-- /wp:paragraph -->

<!-- wp:image {"id":4023,"sizeSlug":"large"} -->

![](./img/wp-content-uploads-2019-05-rental.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

The following statement uses the `SUM()` function to calculate the total rental days:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
SELECT
  SUM(return_date - rental_date)
FROM
  rental;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
           sum
-------------------------
 71786 days 190098:21:00
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

How it works.

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, calculate the rental duration by subtracting the rental date from the return date.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Second, apply the `SUM()` function to the expression.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The following example uses the `SUM()` function to calculate the total duration by customers:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT
  first_name || ' ' || last_name full_name,
  SUM(return_date - rental_date) rental_duration
FROM
  rental
  INNER JOIN customer USING(customer_id)
GROUP BY
  customer_id
ORDER BY
  full_name;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
       full_name       |  rental_duration
-----------------------+--------------------
 Aaron Selby           | 109 days 273:34:00
 Adam Gooch            | 106 days 245:18:00
 Adrian Clary          | 90 days 286:00:00
 Agnes Bishop          | 97 days 339:40:00
...
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `SUM()` function to calculate the sum of values in a set.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use the `DISTINCT` option in the `SUM()` function to calculate the sum of distinct values.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use the `SUM()` function with the `GROUP BY` clause to calculate the sum for each group.
- <!-- /wp:list-item -->

<!-- /wp:list -->
