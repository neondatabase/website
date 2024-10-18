---
title: 'PostgreSQL RADIANS() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-math-functions/postgresql-radians/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `RADIANS()` function to convert degrees to radians.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL RADIANS() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `RADIANS()` function converts degrees to radians.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the basic syntax of the `RADIANS()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
RADIANS(degrees_value)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax, the `degrees_value` is a value in degrees that you want to convert to radians. The function returns the `degrees_value` converted to radians.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If the `degrees_value` is `NULL`, the function returns `NULL`.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL RADIANS() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's explore some examples of using the `RADIANS()` function.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic RADIANS() function example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `RADIANS()` function to convert 180 degrees to its equivalent in radians, resulting in `PI` value:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT RADIANS(180);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
      radians
-------------------
 3.141592653589793
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Using the RADIANS() function with table data

<!-- /wp:heading -->

<!-- wp:paragraph -->

We'll show you how to use the `RADIANS` with data in a table.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, [create a new table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) called `angles` to store angle data in radians:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE angles (
    id SERIAL PRIMARY KEY,
    angle_degrees NUMERIC
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, [insert some rows](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert-multiple-rows/) into the `angles` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO angles (angle_degrees)
VALUES
    (45),
    (60),
    (90),
    (NULL)
RETURNING *;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 id | angle_degrees
----+---------------
  1 |            45
  2 |            60
  3 |            90
  4 |          null
(4 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, use the `RADIANS()` function to convert the values in the `angle_degrees` column to radians:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
    id,
    angle_degrees,
    RADIANS(angle_degrees) AS angle_radians
FROM
    angles;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 id | angle_degrees |   angle_radians
----+---------------+--------------------
  1 |            45 | 0.7853981633974483
  2 |            60 | 1.0471975511965976
  3 |            90 | 1.5707963267948966
  4 |          null |               null
(4 rows)
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the PostgreSQL `RADIANS()` function to convert degrees to radians.
- <!-- /wp:list-item -->

<!-- /wp:list -->
