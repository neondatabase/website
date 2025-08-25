---
title: 'PostgreSQL IN'
page_title: 'PostgreSQL IN - Matching Against a List of Values'
page_description: 'This tutorial shows you how to use the PostgreSQL IN operator to match against a list of values. It also shows you how to use the IN operator in a subquery.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-in/'
ogImage: '/postgresqltutorial/film.png'
updatedOn: '2024-01-17T02:52:11+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL FETCH'
  slug: 'postgresql-tutorial/postgresql-fetch'
nextLink:
  title: 'PostgreSQL BETWEEN'
  slug: 'postgresql-tutorial/postgresql-between'
---

**Summary**: in this tutorial, you will learn how to use the **PostgreSQL IN** operator to check if a value matches any value in a list.

## Introduction to PostgreSQL IN operator

The `IN` operator allows you to check whether a value matches any value in a list of values.

Here’s the basic syntax of the `IN` operator:

```phpsqlsql
value IN (value1,value2,...)
```

The `IN` operator returns true if the `value` is equal to any value in the list such as `value1` and `value2`.

The list of values can be a list of literal values including numbers and strings.

In addition to literal values, the `IN` operator also accepts a list of values returned from a query. You’ll learn more about how to use the `IN` operator with a query in the [subquery tutorial](postgresql-subquery).

Functionally, the `IN` operator is equivalent to combining multiple boolean expressions with the [OR](postgresql-or) operators:

```sql
value = value1 OR value = value2 OR ...
```

## PostgreSQL IN operator examples

We’ll use the `film` table from the [sample database](../postgresql-getting-started/postgresql-sample-database):

![](/postgresqltutorial/film.png)

### 1\) Using the PostgreSQL IN operator with a list of numbers

The following example uses the `IN` operator to retrieve information about the film with id 1, 2, and 3:

```
SELECT
  film_id,
  title
FROM
  film
WHERE
  film_id in (1, 2, 3);
```

Output:

```text
 film_id |      title
---------+------------------
       1 | Academy Dinosaur
       2 | Ace Goldfinger
       3 | Adaptation Holes
(3 rows)
```

The following statement uses the equal (`=`) and `OR` operators instead of the `IN` operator, which is equivalent to the query above:

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

The query that uses the `IN` operator is shorter and more readable than the query that uses equal (`=`) and `OR` operators.

Additionally, PostgreSQL executes the query with the `IN` operator much faster than the same query that uses a list of `OR` operators.

### 2\) Using the PostgreSQL IN operator with a list of strings

We’ll use the `actor` table from the [sample database](../postgresql-getting-started/postgresql-sample-database):

![](/postgresqltutorial/actor.png)
The following example uses the `IN` operator to find the actors who have the last name in the list `'Allen'`, `'Chase'`, and `'Davis'`:

```sql
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

Output:

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

### 3\) Using the PostgreSQL IN operator with a list of dates

We’ll use the `payment` table from the [sample database](../postgresql-getting-started/postgresql-sample-database):

![](/postgresqltutorial/payment.png)

The following statement uses the IN operator to find payments whose payment dates are in a list of dates: `2007-02-15` and `2007-02-16`:

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

Output:

```css
payment_id | amount |        payment_date
------------+--------+----------------------------
      17503 |   7.99 | 2007-02-15 22:25:46.996577
      17504 |   1.99 | 2007-02-16 17:23:14.996577
      17505 |   7.99 | 2007-02-16 22:41:45.996577
      17512 |   4.99 | 2007-02-16 00:10:50.996577
...
```

In this example, the `payment_date` column has the type [`timestamp`](postgresql-timestamp) that consists of both date and time parts.

To match the values in the `payment_date` column with a list of dates, you need to cast them to date values that have the date part only.

To do that you use the `::` [cast operator](postgresql-cast):

```
payment_date::date
```

For example, if the timestamp value is `2007-02-15 22:25:46.996577`, the cast operator will convert it to `2007-02-15`.

## PostgreSQL NOT IN operator

To negate the `IN` operator, you use the `NOT IN` operator. Here’s the basic syntax of the `NOT IN` operator:

```xml
value NOT IN (value1, value2, ...)
```

The `NOT IN` operator returns `true` if the `value` is not equal to any value in the list such as `value1` and `value2`; otherwise, the `NOT IN` operator returns `false`.

The `NOT IN` operator is equivalent to a combination of multiple boolean expressions with the [AND operators](postgresql-and):

```sql
value <> value1 AND value <> value2 AND ...
```

### PostgreSQL NOT IN operator example

The following example uses the `NOT IN` operator to retrieve films whose id is not 1, 2, or 3:

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

Output:

```text
 film_id |            title
---------+-----------------------------
       4 | Affair Prejudice
       5 | African Egg
       6 | Agent Truman
       7 | Airplane Sierra
       8 | Airport Pollock
...
```

The following query retrieves the same set of data but uses the not\-equal (`<>`) and [`AND`](postgresql-and) operators:

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

## Summary

- Use the `IN` operator to check if a value matches any value in a list of values.
- Use the `NOT` operator to negate the `IN` operator.
