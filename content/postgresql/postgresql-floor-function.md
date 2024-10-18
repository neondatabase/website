---
title: 'PostgreSQL FLOOR() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-math-functions/postgresql-floor/
ogImage: ./img/wp-content-uploads-2013-05-payment-table.png
tableOfContents: true
---
<!-- wp:paragraph -->

The PostgreSQL `FLOOR()` function returns a number rounded down to the next whole number.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Syntax

<!-- /wp:heading -->

<!-- wp:paragraph -->

The syntax of the `FLOOR()` function is as follows:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
FLOOR(numeric_expression)
```

<!-- /wp:code -->

<!-- wp:heading -->

## Arguments

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `FLOOR()` function requires one argument:

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

**1) `numeric_expression`**

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `numeric_expression` is a number or an expression that evaluates to a number, which you want to round down.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Return Value

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `FLOOR()` function returns a value whose data type is the same as the input argument.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example shows how to use the `FLOOR()` function to round a number down to the nearest integer:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT
    FLOOR( 150.75 );
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The result is:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
150
```

<!-- /wp:code -->

<!-- wp:paragraph -->

See the following `payment` table in the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/):

<!-- /wp:paragraph -->

<!-- wp:image {"id":443} -->

![payment table](./img/wp-content-uploads-2013-05-payment-table.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

The following statement returns the floor of the amount paid by the customer:

<!-- /wp:paragraph -->

<!-- wp:code -->

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

<!-- /wp:code -->

<!-- wp:paragraph -->

The following picture illustrates the result:

<!-- /wp:paragraph -->

<!-- wp:image {"id":3057} -->

![PostgreSQL FLOOR Function Example](./img/wp-content-uploads-2017-08-PostgreSQL-FLOOR-Function-Example.png)

<!-- /wp:image -->

<!-- wp:heading -->

## Remarks

<!-- /wp:heading -->

<!-- wp:paragraph -->

To round a number up to the nearest whole number, you use the `CEIL()` function.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

In this tutorial, you have learned how to use the PostgreSQL `FLOOR()` function to round a number down to the nearest integer, which is less than or equal to the number.

<!-- /wp:paragraph -->
