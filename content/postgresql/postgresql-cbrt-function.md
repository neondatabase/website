---
title: 'PostgreSQL CBRT() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-math-functions/postgresql-cbrt/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `CBRT()` function to calculate the cube root of a number.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL CBRT() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

A cube root number is a number that when you multiply itself twice, you'll get the cube number. For example, 2 is a cube root number of 8 because when you multiply the number 2 by itself three times, you'll get the number 8:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
2 * 2 * 2 = 8
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In PostgreSQL, the `CBRT()` is a [math function](https://www.postgresqltutorial.com/postgresql-math-functions/) that returns the cube root of a number.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the syntax of the `CBRT()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CBRT(n)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `n` is the number that you want to calculate the cube root. `n` can be a literal number, an expression, or a table column.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The `CBRT()` function returns the cube root of a number n with the double precision type. If `n` is `NULL`, the `CBRT()` function returns `NULL`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If `n` is a string, the `CBRT()` function will attempt to convert it to a number before calculating the cube root. If the conversion fails, it raises an error.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL CBRT() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's explore some examples of using the `CBRT()` function.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic PostgreSQL CBRT() function example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `CBRT()` function to calculate the cube root of 27:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT CBRT(27) result;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 result
--------
      3
```

<!-- /wp:code -->

<!-- wp:paragraph -->

It returns 3 because 3\* 3 \*3 = 27.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 2) Using CBRT() function with a negative number

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `CBRT()` function to find the cube root of -27:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT CBRT(-27) result;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 result
--------
     -3
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The result is -3 because -3 \* -3 \* -3 is -27. Please note that the cube root of a negative number is always negative.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 3) Using CBRT() function with numeric strings

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `CBRT()` function with a numeric string:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT CBRT('125') result;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 result
--------
      5
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this example, the `CBRT()` function converts the text '125' to the number 125 and calculates the cube root.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 4) Using the CBRT() function with table data

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, [create a table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) called `cube_volumes` that stores the volumes of cubes:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE cube_volumes(
    id INT GENERATED ALWAYS AS IDENTITY,
    volume DEC(19,2),
    PRIMARY KEY(id)
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, [insert rows](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert-multiple-rows/) into the `cube_volumes` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO
  cube_volumes (volume)
VALUES
  (8),
  (125),
  (NULL),
  (0)
RETURNING *;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 id | volume
----+--------
  1 |   8.00
  2 | 125.00
  3 |   null
  4 |   0.00
(4 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, calculate the side lengths of cubes using the `CBRT()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  id,
  volume,
  CBRT (volume) side_length
FROM
  cube_volumes;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 id | volume | side_length
----+--------+-------------
  1 |   8.00 |           2
  2 | 125.00 |           5
  3 |   null |        null
  4 |   0.00 |           0
(4 rows)
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `CBRT()` function to calculate the cube root of a number.
- <!-- /wp:list-item -->

<!-- /wp:list -->
