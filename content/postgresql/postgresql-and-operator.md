---
prevPost: postgresql-python-call-postgresql-functions
nextPost: how-to-change-the-owner-of-a-postgresql-database
createdAt: 2024-01-17T01:14:35.000Z
title: 'PostgreSQL AND Operator'
redirectFrom: 
            - /postgresql/postgresql-tutorial/postgresql-and
            - /postgresql/postgresql-and
ogImage: /postgresqltutorial_data/wp-content-uploads-2019-05-film.png
tableOfContents: true
---


**Summary**: in this tutorial, you will learn about the PostgreSQL `AND` logical operator and how to use it to combine multiple boolean expressions.

## Introduction to the PostgreSQL AND operator

In PostgreSQL, a [boolean](/postgresql/postgresql-boolean) value can have one of three values: `true`, `false`, and `null`.

PostgreSQL uses `true`, `'t'`, `'true'`, `'y'`, `'yes'`, `'1'` to represent `true` and `false`, `'f'`, `'false'`, `'n'`, `'no'`, and `'0'` to represent `false`.

A boolean expression is an expression that evaluates to a boolean value. For example, the expression `1=1`is a boolean expression that evaluates to `true`:

```sql
SELECT 1 = 1 AS result;
```

Output:

```
 result
--------
 t
(1 row)
```

The letter `t` in the output indicates the value of `true`.

The `AND` operator is a logical operator that combines two boolean expressions.

Here's the basic syntax of the `AND` operator:

```
expression1 AND expression2
```

In this syntax, `expression1` and `expression2` are boolean expressions that evaluate to `true`, `false`, or `null`.

The `AND` operator returns `true` only if both expressions are `true`. It returns `false` if one of the expressions is `false`. Otherwise, it returns `null`.

The following table shows the results of the `AND` operator when combining `true`, `false`, and `null`.

| AND       | True  | False | Null  |
| --------- | ----- | ----- | ----- |
| **True**  | True  | False | Null  |
| **False** | False | False | False |
| **Null**  | Null  | False | Null  |

In practice, you often use the `AND` operator in a `WHERE` clause to ensure that all specified expressions must be true for a row to be included in the result set.

## PostgreSQL AND operator

Let's explore some examples of using the `AND` operator.

### 1) Basic PostgreSQL AND operator examples

The following example uses the `AND` operator to combine two true values, which returns true:

```sql
SELECT true AND true AS result;
```

Output:

```
 result
--------
 t
(1 row)
```

The following statement uses the `AND` operator to combine true with false, which returns false:

```sql
SELECT true AND false AS result;
```

Output:

```
 result
--------
 f
(1 row)
```

The following example uses the `AND` operator to combine true with null, which returns null:

```sql
SELECT true AND null AS result;
```

Output:

```
 result
--------
 null
(1 row)
```

The following example uses the `AND` operator to combine false with false, which returns false:

```sql
SELECT false AND false AS result;
```

Output:

```
 result
--------
 f
(1 row)
```

The following example uses the `AND` operator to combine false with null, which returns false:

```sql
SELECT false AND null AS result;
```

Output:

```
 result
--------
 f
(1 row)
```

The following example uses the `AND` operator to combine null with null, which returns null:

```sql
SELECT null and null AS result;
```

Output:

```
 result
--------
 null
(1 row)
```

### 2) Using the AND operator in the WHERE clause

We'll use the `film` table from the [sample database](/postgresql/postgresql-getting-started/postgresql-sample-database) for the demonstration:

![](/postgresqltutorial_data/wp-content-uploads-2019-05-film.png)

The following example uses the `AND` operator in the `WHERE` clause to find the films that have a length greater than 180 and a rental rate less than 1:

```sql
SELECT
  title,
  length,
  rental_rate
FROM
  film
WHERE
  length > 180
  AND rental_rate < 1;
```

Output:

```
       title        | length | rental_rate
--------------------+--------+-------------
 Catch Amistad      |    183 |        0.99
 Haunting Pianist   |    181 |        0.99
 Intrigue Worst     |    181 |        0.99
 Love Suicides      |    181 |        0.99
 Runaway Tenenbaums |    181 |        0.99
 Smoochy Control    |    184 |        0.99
 Sorority Queen     |    184 |        0.99
 Theory Mermaid     |    184 |        0.99
 Wild Apollo        |    181 |        0.99
 Young Language     |    183 |        0.99
(10 rows)
```

## Summary

- Use the `AND` operator to combine multiple boolean expressions.
