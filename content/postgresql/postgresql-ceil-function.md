---
modifiedAt: 2024-02-16 07:25:43
prevPost: postgresql-current_time-function
nextPost: postgresql-unique-index
createdAt: 2017-08-17T06:29:22.000Z
title: 'PostgreSQL CEIL() Function'
redirectFrom: 
            - /postgresql/postgresql-math-functions/postgresql-ceil
            - /postgresql/postgresql-ceil
ogImage: /postgresqltutorial_data/wp-content-uploads-2017-08-customer-and-payment-tables.png
tableOfContents: true
---

The PostgreSQL `CEIL()` function returns a number rounded up to the next whole number.

## Syntax

The following illustrates the syntax of the `CEIL()` function:

```sql
CEIL(numeric_expression)
```

## Arguments

The `CEIL()` function requires one argument:

**1) `numeric_expression`**

The `numeric_expression` is a number (or an expression that evaluates to a number) that is rounded up.

## Return Value

The `CEIL()` function returns a value whose data type is the same as the input argument.

## Examples

The following statement illustrates how to use the `CEIL()` function to round a number up to the nearest integer:

```sql
SELECT
    CEIL( 200.25 );
```

The result is:

```
 ceil
------
  201
(1 row)
```

Let's take the `customer` and `payment` tables in the [sample database](/postgresql/postgresql-getting-started/postgresql-sample-database) for the demonstration.

![customer and payment tables](/postgresqltutorial_data/wp-content-uploads-2017-08-customer-and-payment-tables.png)

The following example calculates the ceiling of amounts paid by customers for rentals:

```sql
SELECT
    first_name,
    last_name,
    CEIL(SUM( amount )) amt
FROM
    payment
INNER JOIN customer
        USING(customer_id)
GROUP BY
    customer_id
ORDER BY
    amt DESC;
```

The following picture illustrates the result:

![PostgreSQL CEIL function example](/postgresqltutorial_data/wp-content-uploads-2017-08-PostgreSQL-CEIL-function-example.png)

## Remarks

To round a number down to the nearest whole number, you use the `FLOOR()` function.

In this tutorial, you have learned how to use the PostgreSQL `CEIL()` function to round a number up to the nearest integer, greater than or equal to the number.
