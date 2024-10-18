---
title: 'PostgreSQL ROUND() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-math-functions/postgresql-round/
ogImage: ./img/wp-content-uploads-2013-05-customer-and-payment-tables.png
tableOfContents: true
---
<!-- wp:paragraph -->

The PostgreSQL `ROUND()` function rounds a numeric value to its nearest [integer](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-integer/) or a number with the number of decimal places.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Syntax

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following illustrates the syntax of the `ROUND()` function:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
ROUND (source [ , n ] )
```

<!-- /wp:code -->

<!-- wp:heading -->

## Arguments

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `ROUND()` function accepts 2 arguments:

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

1. source

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `source` argument is a number or a numeric expression that is to be rounded.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

2. n

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `n` argument is an integer that determines the number of decimal places after rounding.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The n argument is optional. If you omit the n argument, its default value is 0.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Return value

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `ROUND()` function returns a result whose type is the same as the input if you omit the second argument.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If you use both arguments, the `ROUND()` function returns a numeric value.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Examples

<!-- /wp:heading -->

<!-- wp:heading {"level":3} -->

### 1) Basic ROUND() function example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example shows how to round a decimal using the `ROUND()` function:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT
    ROUND( 10.4 );
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Because the nearest integer of 10.4 is 10, the function returns 10 as expected:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
10
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example rounds 10.5:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT
    ROUND( 10.5 );
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
11
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Round to 2 decimal places examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `ROUND()` function to round a number to the one with 2 decimal places:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT
    ROUND( 10.812, 2 );
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Result:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
10.81
```

<!-- /wp:code -->

<!-- wp:paragraph -->

And another example of rounding a decimal to 2 decimal places:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT
    ROUND( 10.817, 2 );
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Result:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
10.82
```

<!-- /wp:code -->

<!-- wp:paragraph -->

You can change the second argument to round a number to specific decimal places.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 3) Rounding data from table examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

We will use the following `payment` and `customer` tables in the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/) for the demonstration.

<!-- /wp:paragraph -->

<!-- wp:image {"id":428} -->

![customer and payment tables](./img/wp-content-uploads-2013-05-customer-and-payment-tables.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

The following statement retrieves the average rental fee that each customer has paid.

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT
    first_name,
    last_name,
    ROUND( AVG( amount ), 2 ) avg_rental
FROM
    payment
INNER JOIN customer
        USING(customer_id)
GROUP BY
    customer_id
ORDER BY
    avg_rental DESC;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this statement, we use the `ROUND()` function to round the average rental fee to 2 decimal places.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
first_name  |  last_name   | avg_rental
-------------+--------------+------------
 Brittany    | Riley        |       5.62
 Kevin       | Schuler      |       5.52
 Ruth        | Martinez     |       5.49
 Linda       | Williams     |       5.45
 Paul        | Trout        |       5.39
 Daniel      | Cabral       |       5.30
...
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following statement calculates the average number of rentals per customer:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
WITH rental(customer_id,rent) AS
(
    SELECT
        customer_id,
        COUNT( rental_id )
    FROM
        payment
    GROUP BY
        customer_id
)
SELECT
    ROUND(AVG(rent))
FROM
    rental;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 round
-------
    24
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this example, we used the `ROUND()` function to round the result to an integer.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the PostgreSQL `ROUND()` function to round a number to its nearest integer or a number of specified decimal places.
- <!-- /wp:list-item -->

<!-- /wp:list -->
