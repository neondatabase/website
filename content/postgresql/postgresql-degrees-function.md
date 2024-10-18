---
title: 'PostgreSQL DEGREES() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-math-functions/postgresql-degrees/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `DEGREES()` function to convert radians to degrees.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL DEGREES() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `DEGREES()` function converts radians to degrees. Here's the syntax of the `DEGREES()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
DEGREES(radians_value)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax, the `radians_value` is a value in radians that you want to convert to degrees.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `DEGREES()` function returns the value of the `radians_value` in degrees.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If the `radians_value` is `NULL`, the `DEGREES()` function returns `NULL`.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL DEGREES() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's take some examples of using the `DEGREES()` function.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic DEGREES() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `DEGREES()` function to convert 1 radian to its equivalent degrees:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT DEGREES(1);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
      degrees
-------------------
 57.29577951308232
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example uses the `DEGREES()` function to convert the value of π (pi) radians to its equivalent in degrees:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT DEGREES(PI());
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 degrees
---------
     180
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Note that the `PI()` function returns the value of π (pi) radians.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 2) Using the DEGREES() function with table data

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, [create a new table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) called `angles` to store radian data:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE angles (
    id SERIAL PRIMARY KEY,
    angle_radians NUMERIC
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, [insert some rows](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert/) into the `angles` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO angles (angle_radians)
VALUES
    (2*PI()),
    (PI()),
    (PI()/2),
    (NULL)
RETURNING *;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, use the `DEGREES()` function to convert radians to degrees:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
    id,
    angle_radians,
    ROUND(DEGREES(angle_radians)::numeric, 0) AS angle_degrees
FROM
    angles;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 id |  angle_radians   | angle_degrees
----+------------------+---------------
  1 | 6.28318530717959 |           360
  2 | 3.14159265358979 |           180
  3 |  1.5707963267949 |            90
  4 |             null |          null
(4 rows)
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the PostgreSQL `DEGREES()` function to convert radians to degrees.
- <!-- /wp:list-item -->

<!-- /wp:list -->
