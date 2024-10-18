---
title: 'PostgreSQL IN'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-in/
ogImage: ./img/wp-content-uploads-2019-05-film.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the **PostgreSQL IN** operator to check if a value matches any value in a list.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL IN operator

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `IN` operator allows you to check whether a value matches any value in a list of values.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the basic syntax of the `IN` operator:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
value IN (value1,value2,...)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `IN` operator returns true if the `value` is equal to any value in the list such as `value1` and `value2`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The list of values can be a list of literal values including numbers and strings.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

In addition to literal values, the `IN` operator also accepts a list of values returned from a query. You'll learn more about how to use the `IN` operator with a query in the [subquery tutorial](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-subquery/).

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Functionally, the `IN` operator is equivalent to combining multiple boolean expressions with the [OR](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-or/) operators:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
value = value1 OR value = value2 OR ...
```

<!-- /wp:code -->

<!-- wp:heading -->

## PostgreSQL IN operator examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

We'll use the `film` table from the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/):

<!-- /wp:paragraph -->

<!-- wp:image {"id":4017,"sizeSlug":"full","linkDestination":"none"} -->

![](./img/wp-content-uploads-2019-05-film.png)

<!-- /wp:image -->

<!-- wp:heading {"level":3} -->

### 1) Using the PostgreSQL IN operator with a list of numbers

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `IN` operator to retrieve information about the film with id 1, 2, and 3:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  film_id,
  title
FROM
  film
WHERE
  film_id in (1, 2, 3);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 film_id |      title
---------+------------------
       1 | Academy Dinosaur
       2 | Ace Goldfinger
       3 | Adaptation Holes
(3 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following statement uses the equal (`=`) and `OR` operators instead of the `IN` operator, which is equivalent to the query above:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  film_id,
  title
FROM
  film
WHERE
  film_id = 1
  OR film_id = 2
  OR film_id = 3;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The query that uses the `IN` operator is shorter and more readable than the query that uses equal (`=`) and `OR` operators.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Additionally, PostgreSQL executes the query with the `IN` operator much faster than the same query that uses a list of `OR` operators.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 2) Using the PostgreSQL IN operator with a list of strings

<!-- /wp:heading -->

<!-- wp:paragraph -->

We'll use the `actor` table from the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/):

<!-- /wp:paragraph -->

<!-- wp:image {"id":4026,"sizeSlug":"full","linkDestination":"none"} -->

![](./img/wp-content-uploads-2019-05-actor.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

The following example uses the `IN` operator to find the actors who have the last name in the list `'Allen'`, `'Chase'`, and `'Davis'`:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT
  first_name,
  last_name
FROM
  actor
WHERE
  last_name IN ('Allen', 'Chase', 'Davis')
ORDER BY
  last_name;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 first_name | last_name
------------+-----------
 Meryl      | Allen
 Cuba       | Allen
 Kim        | Allen
 Jon        | Chase
 Ed         | Chase
 Susan      | Davis
 Jennifer   | Davis
 Susan      | Davis
(8 rows)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 3) Using the PostgreSQL IN operator with a list of dates

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following statement uses the IN operator to find payments whose payment dates are in a list of dates: `2007-02-15` and `2007-02-16`:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT
  payment_id,
  amount,
  payment_date
FROM
  payment
WHERE
  payment_date::date IN ('2007-02-15', '2007-02-16');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
payment_id | amount |        payment_date
------------+--------+----------------------------
      17503 |   7.99 | 2007-02-15 22:25:46.996577
      17504 |   1.99 | 2007-02-16 17:23:14.996577
      17505 |   7.99 | 2007-02-16 22:41:45.996577
      17512 |   4.99 | 2007-02-16 00:10:50.996577
...
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this example, the `payment_date` column has the type `timestamp` that consists of both date and time parts.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To match the values in the `payment_date` column with a list of dates, you need to cast them to date values that have the date part only.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To do that you use the `::` [cast operator](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-cast/):

<!-- /wp:paragraph -->

<!-- wp:code -->

```
payment_date::date
```

<!-- /wp:code -->

<!-- wp:paragraph -->

For example, if the timestamp value is `2007-02-15 22:25:46.996577`, the cast operator will convert it to `2007-02-15`.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL NOT IN operator

<!-- /wp:heading -->

<!-- wp:paragraph -->

To negate the `IN` operator, you use the `NOT IN` operator. Here's the basic syntax of the `NOT IN` operator:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
value NOT IN (value1, value2, ...)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `NOT IN` operator returns `true` if the `value` is not equal to any value in the list such as `value1` and `value2`; otherwise, the `NOT IN` operator returns `false`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `NOT IN` operator is equivalent to a combination of multiple boolean expressions with the [AND operators](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-and/):

<!-- /wp:paragraph -->

<!-- wp:code -->

```
value <> value1 AND value <> value2 AND ...
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### PostgreSQL NOT IN operator example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `NOT IN` operator to retrieve films whose id is not 1, 2, or 3:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  film_id,
  title
FROM
  film
WHERE
  film_id NOT IN (1, 2, 3)
ORDER BY
  film_id;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 film_id |            title
---------+-----------------------------
       4 | Affair Prejudice
       5 | African Egg
       6 | Agent Truman
       7 | Airplane Sierra
       8 | Airport Pollock
...
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following query retrieves the same set of data but uses the not-equal (`<>`) and `AND` operators:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  film_id,
  title
FROM
  film
WHERE
  film_id <> 1
  AND film_id <> 2
  AND film_id <> 3
ORDER BY
  film_id;
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `IN` operator to check if a value matches any value in a list of values.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use the `NOT` operator to negate the `IN` operator.
- <!-- /wp:list-item -->

<!-- /wp:list -->
