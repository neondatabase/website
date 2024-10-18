---
title: 'PostgreSQL DOUBLE PRECISION Data Type'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-double-precision-type/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn about the PostgreSQL `DOUBLE PRECISION` data type and its features.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL double precision type

<!-- /wp:heading -->

<!-- wp:paragraph -->

In PostgreSQL, the `DOUBLE PRECISION` is an inexact, variable-precision numeric type.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Inexact means that PostgreSQL cannot exactly convert some values into an internal format and can only store them as approximations. Consequently, storing and querying a value might show a slight difference.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If your application requires exact storage and calculation, it's recommended to use the [numeric](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-numeric/) type instead.

<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"note"} -->

Note that PostgreSQL double precision data type is an implementation of the[ IEEE Standard 754 for Floating-Point Arithmetic.](https://ieeexplore.ieee.org/document/8766229)

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following shows how to define a column with the `DOUBLE PRECISION` type:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
column_name double precision
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Alternatively, you can use the `float8` or `float` data type which is the same as `DOUBLE PRECISION`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
colum_name float
```

<!-- /wp:code -->

<!-- wp:paragraph -->

A column of `DOUBLE PRECISION` type can store values that have a range around `1E-307` to `1E+308` with a precision of at least 15 digits.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If you store a value that is out of the range, PostgreSQL will be unable to store it and raise an error.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If you store numbers with very high precision, PostgreSQL may round them to fit within the limitation of double precision. This may potentially lose some precision in the calculation.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If you store very small numbers close to zero, PostgreSQL may raise an underflow error due to the limitations of double precision data type, which may be unable to accurately represent such small values distinct from zero.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

In practice, you'll use the double precision type for storing scientific measurements.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL double precision type examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's take some examples of using the `DOUBLE PRECISION` data type.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic double precision data type example

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, [create a table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) called `temperatures` to store temperature readings:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE temperatures (
    id SERIAL PRIMARY KEY,
    location TEXT NOT NULL,
    temperature DOUBLE PRECISION
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, insert some rows into the `temperatures` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO
  temperatures (location, temperature)
VALUES
  ('Lab Room 1', 23.5),
  ('Server Room 1', 21.8),
  ('Server Room 2', 24.3)
RETURNING *;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 id |   location    | temperature
----+---------------+-------------
  1 | Lab Room 1    |        23.5
  2 | Server Room 1 |        21.8
  3 | Server Room 2 |        24.3
(3 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, calculate the average temperature of all locations:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT AVG(temperature)
FROM temperatures;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 avg
------
 23.2
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Storing inexact values

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, [create a table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) `t` with the column `c` of `DOUBLE PRECISION` type:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE t(c double precision);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, [insert rows](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert-multiple-rows/) into the `t` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO t(c) VALUES(0.1), (0.1), (0.1)
RETURNING *;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
  c
-----
 0.1
 0.1
 0.1
(3 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, calculate the sum of values in the c column using the `SUM()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT SUM(c) FROM t;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
         sum
---------------------
 0.30000000000000004
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output indicates that the sum of `0.1`, `0.1`, and `0.1` is not `0.3` but `0.30000000000000004`. This indicates that PostgreSQL cannot store the exact number `0.1` using the `DOUBLE PRECISION` type.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 2) Inserting too small numbers

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following statement attempts to [insert](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert/) a very small number into the `c` column of the `t` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO t(c)
VALUES (1E-400);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

It returns the following error:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ERROR:  "0.0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001" is out of range for type double precision
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The reason is that the number is too small and very close to zero. PostgreSQL cannot store it due to the limitation of the double precision type.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `DOUBLE PRECISION` data type represents the inexact numbers.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `DOUBLE PRECISION`, `FLOAT8`, or `FLOAT` are synonyms.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use `DOUBLE PRECISION` type to store inexact numbers and `NUMERIC` type to store exact numbers.
- <!-- /wp:list-item -->

<!-- /wp:list -->
