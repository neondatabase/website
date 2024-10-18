---
title: 'PostgreSQL FLOOR() Function'
redirectFrom: 
            - /docs/postgresql/postgresql-floor
ogImage: /postgresqltutorial_data/wp-content-uploads-2013-05-payment-table.png
tableOfContents: true
---


The PostgreSQL `FLOOR()` function returns a number rounded down to the next whole number.

## Syntax

The syntax of the `FLOOR()` function is as follows:

```
FLOOR(numeric_expression)
```

## Arguments

The `FLOOR()` function requires one argument:

**1) `numeric_expression`**

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

See the following `payment` table in the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/):

![payment table](/postgresqltutorial_data/wp-content-uploads-2013-05-payment-table.png)

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

![PostgreSQL FLOOR Function Example](/postgresqltutorial_data/wp-content-uploads-2017-08-PostgreSQL-FLOOR-Function-Example.png)

## Remarks

To round a number up to the nearest whole number, you use the `CEIL()` function.

In this tutorial, you have learned how to use the PostgreSQL `FLOOR()` function to round a number down to the nearest integer, which is less than or equal to the number.
