---
title: 'PostgreSQL POWER() Function'
page_title: 'PostgreSQL POWER() Function'
page_description: 'In this tutorial, you will learn how to use the PostgreSQL POWER() function to raise a number to a specific power.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-math-functions/postgresql-power/'
ogImage: ''
updatedOn: '2024-02-17T15:07:31+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL LOG() Function'
  slug: 'postgresql-math-functions/postgresql-log'
nextLink:
  title: 'PostgreSQL PI() Function'
  slug: 'postgresql-math-functions/postgresql-pi-function'
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `POWER()` function to raise a number to a specific power.

## Introduction to PostgreSQL POWER() function

The `POWER()` function allows you to raise a number to a specific power. Here’s the basic syntax of the `POWER()` function:

```sql
POWER(base, exponent)
```

In this syntax:

- `base`: This is the base number
- `exponent`: This is the exponent to which you want to raise the base number.

The `POWER()` function returns a numeric value representing the result of raising the base number to a specified exponent. It returns `NULL` if either `base` or `exponent` is `NULL`.

## PostgreSQL POWER() function examples

Let’s take some examples of using the `POWER()` function.

### 1\) Basic POWER() function examples

The following example uses the `POWER()` function to raise the number to the power of 3:

```sql
SELECT POWER(2,3) result;
```

Output:

```sql
 result
--------
      8
(1 row)
```

Similarly, you can use the `POWER()` function with decimal values:

```sql
SELECT POWER(2.5, 2);
```

Output:

```sql
       power
--------------------
 6.2500000000000000
(1 row)
```

### 2\) Using the POWER() function with negative exponent

The following example uses the `POWER()` function with a negative exponent:

```sql
SELECT POWER(10, -2);
```

Output:

```sql
 power
-------
  0.01
(1 row)
```

In this example, we raise 10 to the power of \-2 resulting in `0.01`.

### 3\) Using the POWER() function with a fractional exponent

The following example uses the `POWER()` function to raise the number 2 to the power of `1.5`:

```sql
SELECT POWER(2, 1.5);
```

Output:

```sql
       power
--------------------
 2.8284271247461901
(1 row)
```

### 4\) Using the POWER() function with table data

We’ll use the `POWER()` function to calculate [compound interest](https://en.wikipedia.org/wiki/Compound_interest).

First, [create a table](../postgresql-tutorial/postgresql-create-table) called `investments` to store the investment data:

```sql
CREATE TABLE investments (
    id SERIAL PRIMARY KEY,
    investment_amount NUMERIC NOT NULL,
    annual_interest_rate NUMERIC NOT NULL,
    years INT NOT NULL
);
```

Second, [insert some rows](../postgresql-tutorial/postgresql-insert-multiple-rows) into the `investments` table:

```sql
INSERT INTO investments (investment_amount, annual_interest_rate, years)
VALUES
    (1000, 5, 1),
    (2000, 7, 3),
    (5000, 4.5, 5)
RETURNING *;
```

Output:

```sql
 id | investment_amount | annual_interest_rate | years
----+-------------------+----------------------+-------
  1 |              1000 |                    5 |     1
  2 |              2000 |                    7 |     3
  3 |              5000 |                  4.5 |     5
(3 rows)
```

Third, calculate the compound interest of each investment in the `investments` table:

```sql
SELECT
    investment_amount,
    annual_interest_rate,
    years,
    ROUND(investment_amount * POWER(1 + (annual_interest_rate / 100), years), 2) AS future_value
FROM
    investments;
```

Output:

```sql
 investment_amount | annual_interest_rate | years | future_value
-------------------+----------------------+-------+--------------
              1000 |                    5 |     1 |      1050.00
              2000 |                    7 |     3 |      2450.09
              5000 |                  4.5 |     5 |      6230.91
(3 rows)
```

The query returns the initial investment details along with the calculated future value for each investment.

To calculate the compound interest of each investment:

- Calculate the interest rate using the `POWER()` function.
- Use the [`ROUND()`](postgresql-round) function to round the future value to two decimal places.

## Summary

- Use the PostgreSQL `POWER()` function to raise a number to a specific power.
