---
modifiedAt: 2024-02-16 07:25:02
prevPost: postgresql-md5-function
nextPost: postgresql-right-join
createdAt: 2017-08-16T08:22:36.000Z
title: 'PostgreSQL ROUND() Function'
redirectFrom: 
            - /postgresql/postgresql-math-functions/postgresql-round
            - /postgresql/postgresql-round
ogImage: /postgresqltutorial_data/wp-content-uploads-2013-05-customer-and-payment-tables.png
tableOfContents: true
---


The PostgreSQL `ROUND()` function rounds a numeric value to its nearest [integer](/postgresql/postgresql-integer) or a number with the number of decimal places.

## Syntax

The following illustrates the syntax of the `ROUND()` function:

```sql
ROUND (source [ , n ] )
```

## Arguments

The `ROUND()` function accepts 2 arguments:

1. source

The `source` argument is a number or a numeric expression that is to be rounded.

2. n

The `n` argument is an integer that determines the number of decimal places after rounding.

The n argument is optional. If you omit the n argument, its default value is 0.

## Return value

The `ROUND()` function returns a result whose type is the same as the input if you omit the second argument.

If you use both arguments, the `ROUND()` function returns a numeric value.

## Examples

### 1) Basic ROUND() function example

The following example shows how to round a decimal using the `ROUND()` function:

```sql
SELECT
    ROUND( 10.4 );
```

Because the nearest integer of 10.4 is 10, the function returns 10 as expected:

```text
10
```

The following example rounds 10.5:

```sql
SELECT
    ROUND( 10.5 );
```

Output:

```text
11
```

### 2) Round to 2 decimal places examples

The following example uses the `ROUND()` function to round a number to the one with 2 decimal places:

```sql
SELECT
    ROUND( 10.812, 2 );
```

Result:

```text
10.81
```

And another example of rounding a decimal to 2 decimal places:

```sql
SELECT
    ROUND( 10.817, 2 );
```

Result:

```text
10.82
```

You can change the second argument to round a number to specific decimal places.

### 3) Rounding data from table examples

We will use the following `payment` and `customer` tables in the [sample database](/postgresql/postgresql-getting-started/postgresql-sample-database) for the demonstration.

![customer and payment tables](/postgresqltutorial_data/wp-content-uploads-2013-05-customer-and-payment-tables.png)

The following statement retrieves the average rental fee that each customer has paid.

```sql
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

In this statement, we use the `ROUND()` function to round the average rental fee to 2 decimal places.

Output:

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

The following statement calculates the average number of rentals per customer:

```sql
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

Output:

```
 round
-------
    24
(1 row)
```

In this example, we used the `ROUND()` function to round the result to an integer.

## Summary

- Use the PostgreSQL `ROUND()` function to round a number to its nearest integer or a number of specified decimal places.
