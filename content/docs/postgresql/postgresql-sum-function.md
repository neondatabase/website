---
title: 'PostgreSQL SUM Function'
redirectFrom:
            - /docs/postgresql/postgresql-sum 
            - /docs/postgresql/postgresql-aggregate-functions/postgresql-sum-function
ogImage: /postgresqltutorial_data/wp-content-uploads-2013-05-payment-table.png
tableOfContents: true
---


**Summary**: in this tutorial, you'll learn how to use PostgreSQL `SUM()` function to calculate the sum of a set of values.

## Introduction to PostgreSQL SUM() function

The PostgreSQL `SUM()` is an [aggregate function](/docs/postgresql/postgresql-aggregate-functions) that returns the sum of values in a set.

Here's the basic syntax of the `SUM()` function:

```sql
SUM(DISTINCT expression)
```

The `SUM()` function ignores `NULL`, meaning that it doesn't consider the `NULL` in calculation.

If you use the `DISTINCT` option, the `SUM()` function calculates the sum of only distinct values.

For example, without the `DISTINCT` option, the `SUM()` of 1, 1, and 2 will return 4. But the sum of distinct values of 1, 1, and 2 will return 3 (1 + 2) because the `SUM()` function ignores one duplicate value (1).

The `SUM()` of an empty set will return `NULL`, not zero.

## PostgreSQL SUM() function examples

Let's take some examples of using the `SUM()` function. We'll use the `payment` table in the [sample database](/docs/postgresql/postgresql-getting-started/postgresql-sample-database).

![payment table](/postgresqltutorial_data/wp-content-uploads-2013-05-payment-table.png)

### 1) Using PostgreSQL SUM() function in SELECT statement example

The following example uses the `SUM()` function to calculate the sum of all payments in the `payment` table:

```sql
SELECT
  SUM(amount)
FROM
  payment;
```

Output:

```
   sum
----------
 61312.04
(1 row)
```

### 2) Using PostgreSQL SUM() function with an empty result set

The following statement uses the `SUM()` function to calculate the total payment of the customer id 2000.

```sql
SELECT
  SUM (amount)
FROM
  payment
WHERE
  customer_id = 2000;
```

Output:

```
 sum
------
 null
(1 row)
```

In this example, the `SUM()` function returns a `NULL` because the `payment` the table has no row with the `customer_id` 2000.

### 3) Using the SUM() function with COALESCE() function example

If you want the `SUM()` function to return zero instead of `NULL` in case there is no matching row, you use the `COALESCE()` function.

The `COALESCE()` function returns the first non-null argument. In other words, it returns the second argument if the first argument is `NULL`.

The following query illustrates how to use the `SUM()` function with the `COALESCE()` function:

```sql
SELECT
  COALESCE(SUM(amount), 0 ) total
FROM
  payment
WHERE
  customer_id = 2000;
```

Output:

```
 total
-------
     0
(1 row)
```

### 4) Using PostgreSQL SUM() function with the GROUP BY clause example

To calculate the summary of every group, you use the `GROUP BY` clause to group the rows in the table into groups and apply the `SUM()` function to each group.

The following example uses the `SUM()` function with the `GROUP BY` clause to calculate the total amount paid by each customer:

```sql
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

Output:

```
 customer_id | total
-------------+--------
         318 |  27.93
         281 |  32.90
         248 |  37.87
         320 |  47.85
...
```

The following query retrieves the top five customers who made the highest payments:

```sql
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

Output:

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

### 5) Using PostgreSQL SUM() function with a HAVING clause

To filter group sums based on a specific condition, you use the `SUM()` function in the `HAVING` clause.

The following example retrieves customers who have made payments exceeding 200:

```sql
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

Output:

```
 customer_id | total
-------------+--------
         148 | 211.55
         526 | 208.58
(2 rows)
```

### 6) Using PostgreSQL SUM() function with an expression

See the following `rental` table from the [sample database](/docs/postgresql/postgresql-getting-started/postgresql-sample-database):

![](/postgresqltutorial_data/wp-content-uploads-2019-05-rental.png)

The following statement uses the `SUM()` function to calculate the total rental days:

```sql
SELECT
  SUM(return_date - rental_date)
FROM
  rental;
```

Output:

```
           sum
-------------------------
 71786 days 190098:21:00
(1 row)
```

How it works.

- First, calculate the rental duration by subtracting the rental date from the return date.
-
- Second, apply the `SUM()` function to the expression.

The following example uses the `SUM()` function to calculate the total duration by customers:

```sql
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

Output:

```
       full_name       |  rental_duration
-----------------------+--------------------
 Aaron Selby           | 109 days 273:34:00
 Adam Gooch            | 106 days 245:18:00
 Adrian Clary          | 90 days 286:00:00
 Agnes Bishop          | 97 days 339:40:00
...
```

## Summary

- Use the `SUM()` function to calculate the sum of values in a set.
-
- Use the `DISTINCT` option in the `SUM()` function to calculate the sum of distinct values.
-
- Use the `SUM()` function with the `GROUP BY` clause to calculate the sum for each group.
