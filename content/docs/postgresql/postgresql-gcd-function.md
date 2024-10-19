---
title: 'PostgreSQL GCD() Function'
redirectFrom: 
            - /docs/postgresql/postgresql-gcd
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `gcd()` function to find the greatest common divisor of two numbers.

## Introduction to the PostgreSQL gcd() function

The greatest common divisor (GCD) is the largest positive integer that divides two numbers without leaving a remainder. In other words, GCD is the greatest number which is a common divisor of two given numbers.

For example, the GCD of 8 and 12 is 4, because 4 is the largest integer that divides both 8 and 12 without leaving a remainder.

There are multiple ways of finding the GCD including [prime factorization](https://en.wikipedia.org/wiki/Integer_factorization) and [Euclidean algorithm](https://en.wikipedia.org/wiki/Euclidean_algorithm).

PostgreSQL 13 or later offers a built-in `gcd()` function that allows you to find the GCD of two numbers.

Here's the syntax of the `gcd()` function:

```
gcd(a, b)
```

In this syntax, you specify two numbers that you want to find their greatest common divisor. Both a and b are the types of [integer](/docs/postgresql/postgresql-integer), [bigint](/docs/postgresql/postgresql-tutorial/postgresql-integer), and [numeric](/docs/postgresql/postgresql-tutorial/postgresql-numeric).

The `gcd()` function returns an integer that is the GCD of the two input numbers.

If both numbers a and b are zero, the `gcd()` function returns zero. If a and/or b are null, the `gcd()` function returns null.

PostgreSQL uses the Euclidean algorithm under the hood:

- Step 1. Given two integers a and b, a >= b, calculate the remainder r when a is divided by b.
- Step 2. Replace a with b and b with r.
- Step 3. Repeat steps 1 and 2 until b becomes zero.

The GCD is the last non-zero remainder.

## PostgreSQL gcd() function examples

Let's take some examples of using the `gcd()` function.

### 1) Basic PostgreSQL gcd() function example

The following statement uses the `gcd()` function to find the greatest common divisor of two numbers 8 and 12:

```
SELECT gcd(8,12) result;
```

Output:

```
 result
--------
      4
(1 row)
```

### 2) Using the gcd() function to find the greatest common divisor of three numbers

To find the GCD of three numbers, you apply the `gcd()` function twice:

- The first one calculates the GCD of the first two numbers.
- The second one returns the GCD of the result of the first one and the third number.

The following example uses the `gcd()` function to find the GCD of three numbers 30, 45, and 60:

```
SELECT gcd(gcd(30,45), 60) result;
```

Output:

```
 result
--------
     15
(1 row)
```

In this example:

- First, `gcd(30, 45)` finds the GCD of 30 and 45, which is 15.
- Then, `gcd(15, 60)` returns the GCD of the result (15) and 60, which is 15.

### 3) Using the gcd() function to find the greatest common divisor of multiple numbers

First, [create a table](/docs/postgresql/postgresql-create-table) called `numbers` that have two columns `id` and `value`:

```
CREATE TABLE numbers (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    value INTEGER NOT NULL
);
```

Second, [insert some rows](/docs/postgresql/postgresql-insert-multiple-rows) into the `numbers` table:

```
INSERT INTO numbers (value)
VALUES (30), (45), (60), (90), (120)
RETURNING *;
```

Output:

```
 id | value
----+-------
  1 |    30
  2 |    45
  3 |    60
  4 |    90
  5 |   120
(5 rows)
```

Third, use a [recursive query](/docs/postgresql/postgresql-recursive-query) to find the GCD of all the numbers in the `value` column:

```
WITH RECURSIVE gcd_calculation AS (
    -- Initialize with the first value
    SELECT id, value AS gcd_value
    FROM numbers
    WHERE id = (SELECT MIN(id) FROM numbers)

    UNION ALL

    -- Recursively apply the GCD function to the current GCD value and the next value
    SELECT gcd(gcd_value, value) AS gcd_value, numbers.id
    FROM gcd_calculation, numbers
    WHERE numbers.id = (
        SELECT id
        FROM numbers
        WHERE id > gcd_calculation.id
        ORDER BY id
        LIMIT 1
    )
)
SELECT gcd_value AS greatest_common_divisor
FROM gcd_calculation
ORDER BY id DESC
LIMIT 1;
```

How it works.

Initialization: define the `gcd_calculation` [CTE](/docs/postgresql/postgresql-cte) that initializes the first number in the `value` column of the `numbers` table:

```
SELECT id, value AS gcd_value
    FROM numbers
    WHERE id = (SELECT MIN(id) FROM numbers)
```

It returns 30.

Recursive part: takes the current `gcd_value` and applies the `gcd()` function to it with the next value in the list:

```
SELECT
  gcd (gcd_value, VALUE) AS gcd_value,
  numbers.id
FROM
  gcd_calculation,
  numbers
WHERE
  numbers.id = (
    SELECT
      id
    FROM
      numbers
    WHERE
      id > gcd_calculation.id
    ORDER BY
      id
    LIMIT
      1
  );
```

Final selection: selects the last GCD value which is the GCD of all values in `value` column of the `numbers` table:

```
SELECT gcd_value AS greatest_common_divisor
FROM gcd_calculation
ORDER BY id DESC
LIMIT 1;
```

### 4) Defining a gcd() function using PL/pgSQL

If you use the earlier versions of PostgreSQL, you will not be able to use the built-in `gcd()` function.

However, you can create the following gcd() function using PL/pgSQL:

```
CREATE OR REPLACE FUNCTION gcd(a INTEGER, b INTEGER)
RETURNS INTEGER AS $$
   DECLARE
      r INTEGER = 0;
BEGIN

    WHILE b <> 0 LOOP
        r = a % b;
        a = b;
        b = r;
    END LOOP;
    RETURN a;
END;
$$ LANGUAGE plpgsql;
```

The following shows how to use the user-defined `gcd` function:

```
SELECT gcd(8,12) result;
```

Output:

```
 result
--------
      4
(1 row)
```

## Defining an aggregate GCD function

Using a recursive query to calculate the GCD of multiple values is quite complex. To make it simple, you can define an aggregate GCD function based on the built-in `gcd()` function as follows:

```
CREATE AGGREGATE gcd_agg(bigint) (
    SFUNC = gcd,
    STYPE = bigint
);
```

To calculate the GCD of all numbers in the value column of the numbers table, you can use the `gcd_agg()` function as follows:

```
SELECT gcd_agg(value)
FROM numbers;
```

Output:

```
 gcd_agg
---------
      15
(1 row)
```

## Summary

- Use the `gcd()` function to calculate the GCD of two numbers.
- Use a recursive CTE to find the GCD of three or more numbers.
