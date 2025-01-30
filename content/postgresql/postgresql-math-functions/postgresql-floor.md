---
title: 'PostgreSQL FLOOR() Function'
page_title: 'PostgreSQL FLOOR() Function By Practical Examples'
page_description: 'Show you how to use the PostgreSQL FLOOR() function to round a number down to the nearest integer, which is less than or equal to the number.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-math-functions/postgresql-floor/'
ogImage: '/postgresqltutorial/payment-table.png'
updatedOn: '2024-02-25T04:31:17+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL FACTORIAL() Function'
  slug: 'postgresql-math-functions/postgresql-factorial'
nextLink:
  title: 'PostgreSQL GCD() Function'
  slug: 'postgresql-math-functions/postgresql-gcd'
---

The PostgreSQL `FLOOR()` function returns a number rounded down to the next whole number.

## Syntax

The syntax of the `FLOOR()` function is as follows:

```css
FLOOR(numeric_expression)
```

## Arguments

The `FLOOR()` function requires one argument:

**1\) `numeric_expression`**

The `numeric_expression` is a number or an expression that evaluates to a number, which you want to round down.

## Return Value

The `FLOOR()` function returns a value whose data type is the same as the input argument.

## Examples

The following example shows how to use the `FLOOR()` function to round a number down to the nearest integer:

```
SELECT
    FLOOR( 150.75 );
```

The result is:

```
150
```

See the following `payment` table in the [sample database](../postgresql-getting-started/postgresql-sample-database):

![payment table](/postgresqltutorial/payment-table.png)
The following statement returns the floor of the amount paid by the customer:

```
SELECT
    customer_id,
    FLOOR(SUM( amount )) amount_paid
FROM
    payment
GROUP BY
    customer_id
ORDER BY
    amount_paid DESC;
```

The following picture illustrates the result:

![PostgreSQL FLOOR Function Example](/postgresqltutorial/PostgreSQL-FLOOR-Function-Example.png)

## Remarks

To round a number up to the nearest whole number, you use the [`CEIL()`](postgresql-floor) function.

In this tutorial, you have learned how to use the PostgreSQL `FLOOR()` function to round a number down to the nearest integer, which is less than or equal to the number.
