---
title: 'PostgreSQL AVG Function'
redirectFrom:
            - /docs/postgresql/postgresql-avg 
            - /docs/postgresql/postgresql-aggregate-functions/postgresql-avg-function/
ogImage: /postgresqltutorial_data/wp-content-uploads-2013-05-payment-table.png
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use PostgreSQL `AVG()` function to calculate the average value of a set.

## Introduction to PostgreSQL AVG() function

The `AVG()` function is one of the most commonly used [aggregate functions](https://www.postgresqltutorial.com/postgresql-aggregate-functions/) in PostgreSQL. The `AVG()` function allows you to calculate the average value of a set.

Here is the syntax of the `AVG()` function:

```
AVG(column)
```

You can use the `AVG()` function in the `SELECT` and `HAVING` clauses.

To calculate the average value of distinct values in a set, you use the distinct option as follows:

```
AVG(DISTINCT column)
```

Notice that the `AVG()` function ignores `NULL`. If the column has no values, the `AVG()` function returns `NULL`.

## PostgreSQL AVG() function examples

Let's take a look at some examples of using the `AVG` function.

We will use the following `payment` table in the [dvdrental sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/ "PostgreSQL Sample Database") for demonstration:

![payment table](/postgresqltutorial_data/wp-content-uploads-2013-05-payment-table.png)

### 1) Basic PostgreSQL AVG() function example

The following example uses the `AVG()` function to calculate the average amount that customers paid:

```
SELECT AVG(amount)
FROM payment;
```

Output:

```
        avg
--------------------
 4.2006056453822965
(1 row)
```

To make the output more readable, you can use the [cast](/docs/postgresql/postgresql-cast) operator as follows:

```
SELECT AVG(amount)::numeric(10,2)
FROM payment;
```

Output:

```
 avg
------
 4.20
(1 row)
```

### 2) Using AVG() function with DISTINCT operator example

The following query returns the average payment made by customers. Because we use `DISTINCT` PostgreSQL takes unique amounts and calculates the average.

```
SELECT AVG(DISTINCT amount)::numeric(10,2)
FROM payment;
```

Output:

```
 avg
------
 6.14
(1 row)
```

Notice that the result is different from the first example that does not use the `DISTINCT` option.

### 3) Using AVG() function with SUM() function example

The following query uses the `AVG()` function with the `SUM()` function to calculate the total payment made by customers and the average of all transactions.

```
SELECT
 AVG(amount)::numeric(10,2),
 SUM(amount)::numeric(10,2)
FROM
 payment;
```

```
 avg  |   sum
------+----------
 4.20 | 61312.04
(1 row)
```

### 4) Using PostgreSQL AVG() function with GROUP BY clause

Typically, you use the AVG() function with the GROUP BY clause to calculate the average value of per group.

- First, the `GROUP BY` clause divides rows of the table into groups
- Then, the `AVG()` function calculates the average value per group.

The following example uses the `AVG()` function with `GROUP BY` clause to calculate the average amount paid by each customer:

```
SELECT
  customer_id,
  first_name,
  last_name,
  AVG (amount):: NUMERIC(10, 2)
FROM
  payment
  INNER JOIN customer USING(customer_id)
GROUP BY
  customer_id
ORDER BY
  customer_id;
```

Output:

```
 customer_id | first_name  |  last_name   | avg
-------------+-------------+--------------+------
           1 | Mary        | Smith        | 3.82
           2 | Patricia    | Johnson      | 4.76
           3 | Linda       | Williams     | 5.45
           4 | Barbara     | Jones        | 3.72
...
```

In the query, we joined the `payment` table with the `customer` table using [inner join](/docs/postgresql/postgresql-inner-join). We used `GROUP BY` clause to group customers into groups and applied the `AVG()` function to calculate the average per group.

### 5) PostgreSQL AVG() function with HAVING clause example

You can use the `AVG()` function in the `HAVING` clause to filter groups based on a specified condition.

The following example uses the `AVG()` function to calculate the average payment of each customer and return only the ones who paid higher than 5 USD:

```
SELECT
  customer_id,
  first_name,
  last_name,
  AVG (amount):: NUMERIC(10, 2)
FROM
  payment
  INNER JOIN customer USING(customer_id)
GROUP BY
  customer_id
HAVING
  AVG (amount) > 5
ORDER BY
  customer_id;
```

Output:

```
 customer_id | first_name | last_name | avg
-------------+------------+-----------+------
           3 | Linda      | Williams  | 5.45
          19 | Ruth       | Martinez  | 5.49
         137 | Rhonda     | Kennedy   | 5.04
         181 | Ana        | Bradley   | 5.08
         187 | Brittany   | Riley     | 5.62
         209 | Tonya      | Chapman   | 5.09
         259 | Lena       | Jensen    | 5.16
         272 | Kay        | Caldwell  | 5.07
         285 | Miriam     | Mckinney  | 5.12
         293 | Mae        | Fletcher  | 5.13
         310 | Daniel     | Cabral    | 5.30
         311 | Paul       | Trout     | 5.39
         321 | Kevin      | Schuler   | 5.52
         470 | Gordon     | Allard    | 5.09
         472 | Greg       | Robins    | 5.07
         477 | Dan        | Paine     | 5.09
         508 | Milton     | Howland   | 5.29
         522 | Arnold     | Havens    | 5.05
         542 | Lonnie     | Tirado    | 5.30
         583 | Marshall   | Thorn     | 5.12
(20 rows)
```

This query is similar to the one above with an additional `HAVING` clause. We used `AVG` function in the `HAVING` clause to filter the groups that have an average amount less than or equal to 5.

### 6) Using PostgreSQL AVG() function and NULL

Let's see the behavior of the `AVG()` function when its input has NULL.

First, [create a table](/docs/postgresql/postgresql-create-table) named `t1`.

```
CREATE TABLE t1 (
  id serial PRIMARY KEY,
  amount INTEGER
);
```

Second, [insert](/docs/postgresql/postgresql-insert) some sample data:

```
INSERT INTO t1 (amount)
VALUES
  (10),
  (NULL),
  (30);
```

The data of the `t1` table is as follows:

```
SELECT
  *
FROM
  t1;
```

Third, use the `AVG()` function to calculate average values in the amount column.

```
SELECT AVG(amount)::numeric(10,2)
FROM t1;
```

Output:

```
  avg
-------
 20.00
(1 row)
```

It returns 20, meaning that the `AVG()` function ignores `NULL` values.

## Summary

- Use PostgreSQL `AVG()` function to calculate the average value of a set.
- The `AVG()` function ignores NULL in the calculation.
- The `AVG()` function returns NULL if the set is empty.
