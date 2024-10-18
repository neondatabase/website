---
title: 'PostgreSQL POWER() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-math-functions/postgresql-power/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `POWER()` function to raise a number to a specific power.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL POWER() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `POWER()` function allows you to raise a number to a specific power. Here's the basic syntax of the `POWER()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
POWER(base, exponent)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `base`: This is the base number
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `exponent`: This is the exponent to which you want to raise the base number.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The `POWER()` function returns a numeric value representing the result of raising the base number to a specified exponent. It returns `NULL` if either `base` or `exponent` is `NULL`.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL POWER() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's take some examples of using the `POWER()` function.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic POWER() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `POWER()` function to raise the number to the power of 3:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT POWER(2,3) result;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 result
--------
      8
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Similarly, you can use the `POWER()` function with decimal values:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT POWER(2.5, 2);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
       power
--------------------
 6.2500000000000000
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Using the POWER() function with negative exponent

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `POWER()` function with a negative exponent:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT POWER(10, -2);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 power
-------
  0.01
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this example, we raise 10 to the power of -2 resulting in `0.01`.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 3) Using the POWER() function with a fractional exponent

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `POWER()` function to raise the number 2 to the power of `1.5`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT POWER(2, 1.5);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
       power
--------------------
 2.8284271247461901
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 4) Using the POWER() function with table data

<!-- /wp:heading -->

<!-- wp:paragraph -->

We'll use the `POWER()` function to calculate [compound interest](https://en.wikipedia.org/wiki/Compound_interest).

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, [create a table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) called `investments` to store the investment data:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE investments (
    id SERIAL PRIMARY KEY,
    investment_amount NUMERIC NOT NULL,
    annual_interest_rate NUMERIC NOT NULL,
    years INT NOT NULL
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, [insert some rows](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert-multiple-rows/) into the `investments` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO investments (investment_amount, annual_interest_rate, years)
VALUES
    (1000, 5, 1),
    (2000, 7, 3),
    (5000, 4.5, 5)
RETURNING *;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 id | investment_amount | annual_interest_rate | years
----+-------------------+----------------------+-------
  1 |              1000 |                    5 |     1
  2 |              2000 |                    7 |     3
  3 |              5000 |                  4.5 |     5
(3 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, calculate the compound interest of each investment in the `investments` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
    investment_amount,
    annual_interest_rate,
    years,
    ROUND(investment_amount * POWER(1 + (annual_interest_rate / 100), years), 2) AS future_value
FROM
    investments;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 investment_amount | annual_interest_rate | years | future_value
-------------------+----------------------+-------+--------------
              1000 |                    5 |     1 |      1050.00
              2000 |                    7 |     3 |      2450.09
              5000 |                  4.5 |     5 |      6230.91
(3 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The query returns the initial investment details along with the calculated future value for each investment.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To calculate the compound interest of each investment:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Calculate the interest rate using the `POWER()` function.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use the `ROUND()` function to round the future value to two decimal places.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the PostgreSQL `POWER()` function to raise a number to a specific power.
- <!-- /wp:list-item -->

<!-- /wp:list -->
