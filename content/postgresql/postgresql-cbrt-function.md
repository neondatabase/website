---
prevPost: /postgresql/postgresql-jsonb_build_object-function
nextPost: /postgresql/postgresql-c-inserting-data
createdAt: 2024-04-18T02:13:52.000Z
title: 'PostgreSQL CBRT() Function'
redirectFrom: 
            - /postgresql/postgresql-cbrt
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `CBRT()` function to calculate the cube root of a number.

## Introduction to the PostgreSQL CBRT() function

A cube root number is a number that when you multiply itself twice, you'll get the cube number. For example, 2 is a cube root number of 8 because when you multiply the number 2 by itself three times, you'll get the number 8:

```text
2 * 2 * 2 = 8
```

In PostgreSQL, the `CBRT()` is a [math function](/postgresql/postgresql-math-functions) that returns the cube root of a number.

Here's the syntax of the `CBRT()` function:

```sql
CBRT(n)
```

In this syntax:

- `n` is the number that you want to calculate the cube root. `n` can be a literal number, an expression, or a table column.

The `CBRT()` function returns the cube root of a number n with the double precision type. If `n` is `NULL`, the `CBRT()` function returns `NULL`.

If `n` is a string, the `CBRT()` function will attempt to convert it to a number before calculating the cube root. If the conversion fails, it raises an error.

## PostgreSQL CBRT() function examples

Let's explore some examples of using the `CBRT()` function.

### 1) Basic PostgreSQL CBRT() function example

The following example uses the `CBRT()` function to calculate the cube root of 27:

```sql
SELECT CBRT(27) result;
```

Output:

```
 result
--------
      3
```

It returns 3 because 3\* 3 \*3 = 27.

### 2) Using CBRT() function with a negative number

The following example uses the `CBRT()` function to find the cube root of -27:

```sql
SELECT CBRT(-27) result;
```

Output:

```
 result
--------
     -3
```

The result is -3 because -3 \* -3 \* -3 is -27. Please note that the cube root of a negative number is always negative.

### 3) Using CBRT() function with numeric strings

The following example uses the `CBRT()` function with a numeric string:

```sql
SELECT CBRT('125') result;
```

Output:

```
 result
--------
      5
```

In this example, the `CBRT()` function converts the text '125' to the number 125 and calculates the cube root.

### 4) Using the CBRT() function with table data

First, [create a table](/postgresql/postgresql-create-table) called `cube_volumes` that stores the volumes of cubes:

```sql
CREATE TABLE cube_volumes(
    id INT GENERATED ALWAYS AS IDENTITY,
    volume DEC(19,2),
    PRIMARY KEY(id)
);
```

Second, [insert rows](/postgresql/postgresql-insert-multiple-rows) into the `cube_volumes` table:

```sql
INSERT INTO
  cube_volumes (volume)
VALUES
  (8),
  (125),
  (NULL),
  (0)
RETURNING *;
```

Output:

```
 id | volume
----+--------
  1 |   8.00
  2 | 125.00
  3 |   null
  4 |   0.00
(4 rows)
```

Third, calculate the side lengths of cubes using the `CBRT()` function:

```sql
SELECT
  id,
  volume,
  CBRT (volume) side_length
FROM
  cube_volumes;
```

Output:

```
 id | volume | side_length
----+--------+-------------
  1 |   8.00 |           2
  2 | 125.00 |           5
  3 |   null |        null
  4 |   0.00 |           0
(4 rows)
```

## Summary

- Use the `CBRT()` function to calculate the cube root of a number.
