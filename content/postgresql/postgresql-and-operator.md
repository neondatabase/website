---
title: 'PostgreSQL AND Operator'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-and/
ogImage: ./img/wp-content-uploads-2019-05-film.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn about the PostgreSQL `AND` logical operator and how to use it to combine multiple boolean expressions.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL AND operator

<!-- /wp:heading -->

<!-- wp:paragraph -->

In PostgreSQL, a [boolean](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-boolean/) value can have one of three values: `true`, `false`, and `null`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

PostgreSQL uses `true`, `'t'`, `'true'`, `'y'`, `'yes'`, `'1'` to represent `true` and `false`, `'f'`, `'false'`, `'n'`, `'no'`, and `'0'` to represent `false`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

A boolean expression is an expression that evaluates to a boolean value. For example, the expression `1=1`is a boolean expression that evaluates to `true`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT 1 = 1 AS result;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 result
--------
 t
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The letter `t` in the output indicates the value of `true`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `AND` operator is a logical operator that combines two boolean expressions.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the basic syntax of the `AND` operator:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
expression1 AND expression2
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax, `expression1` and `expression2` are boolean expressions that evaluate to `true`, `false`, or `null`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `AND` operator returns `true` only if both expressions are `true`. It returns `false` if one of the expressions is `false`. Otherwise, it returns `null`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following table shows the results of the `AND` operator when combining `true`, `false`, and `null`.

<!-- /wp:paragraph -->

<!-- wp:table -->

| AND       | True  | False | Null  |
| --------- | ----- | ----- | ----- |
| **True**  | True  | False | Null  |
| **False** | False | False | False |
| **Null**  | Null  | False | Null  |

<!-- /wp:table -->

<!-- wp:paragraph -->

In practice, you often use the `AND` operator in a `WHERE` clause to ensure that all specified expressions must be true for a row to be included in the result set.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL AND operator

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's explore some examples of using the `AND` operator.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic PostgreSQL AND operator examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `AND` operator to combine two true values, which returns true:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT true AND true AS result;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 result
--------
 t
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following statement uses the `AND` operator to combine true with false, which returns false:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT true AND false AS result;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 result
--------
 f
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example uses the `AND` operator to combine true with null, which returns null:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT true AND null AS result;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 result
--------
 null
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example uses the `AND` operator to combine false with false, which returns false:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT false AND false AS result;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 result
--------
 f
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example uses the `AND` operator to combine false with null, which returns false:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT false AND null AS result;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 result
--------
 f
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example uses the `AND` operator to combine null with null, which returns null:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT null and null AS result;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 result
--------
 null
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Using the AND operator in the WHERE clause

<!-- /wp:heading -->

<!-- wp:paragraph -->

We'll use the `film` table from the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/) for the demonstration:

<!-- /wp:paragraph -->

<!-- wp:image {"id":4017,"sizeSlug":"full","linkDestination":"none"} -->

![](./img/wp-content-uploads-2019-05-film.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

The following example uses the `AND` operator in the `WHERE` clause to find the films that have a length greater than 180 and a rental rate less than 1:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
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

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

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

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `AND` operator to combine multiple boolean expressions.
- <!-- /wp:list-item -->

<!-- /wp:list -->
