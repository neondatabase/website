---
title: 'PostgreSQL LPAD() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-string-functions/postgresql-lpad/
ogImage: ./img/wp-content-uploads-2013-05-customer-and-payment-tables.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `LPAD()` function to pad a string on the left to a specified length with a sequence of characters.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL LPAD() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The LPAD() function pad a string on the left to a specified length with a sequence of characters.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the basic syntax of the `LPAD()` function:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
LPAD(string, length[, fill])
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `LPAD()` function accepts 3 arguments:

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

**1) `string`**

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

is a string that should be padded on the left

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

**2) `length`**

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

is an positive integer that specifies the length of the result string after padding.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Note that if the string is longer than the length argument, the string will be truncated on the right.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

**3) `fill`**

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

is a string used for padding.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `fill` argument is optional. If you omit the `fill` argument, its default value is a space.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The PostgreSQL `LPAD()` function returns a string left-padded to `length` characters.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL LPAD() function Examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's see some examples of using the `LPAD()` function.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic PostgreSQL LPAD() function example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following statement uses the `LPAD()` function to pad the '\*' on the left of the string 'PostgreSQL':

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT LPAD('PostgreSQL',15,'*');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The result is:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
      lpad
----------------
 *****PostgreSQL
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this example, the length of the `PostgreSQL` string is 10, and the result string should have a length of 15. Therefore, the `LPAD()` function pads 5 asterisks (\*) on the left of the string.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 2) Padding leading zeros

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `LPAD()` function to pad zeros at the beginning of the string to a length of five characters:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT LPAD('123',5,'0') result;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 result
--------
 00123
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

If you want to pad a number, you need to convert that number to a string before padding. For example:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT LPAD(123::text,5,'0') result;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 result
--------
 00123
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 3) Using LPAD() function with table data

<!-- /wp:heading -->

<!-- wp:paragraph -->

See the following `customer` and `payment` tables from the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/):

<!-- /wp:paragraph -->

<!-- wp:image {"id":428} -->

![customer and payment tables](./img/wp-content-uploads-2013-05-customer-and-payment-tables.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

The following statement illustrates how to use the `LPAD()` function to draw a chart based on the sum of payments per customer.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT first_name || ' ' || last_name fullname,
    SUM(amount) total,
    LPAD('*', CAST(TRUNC(SUM(amount) / 10) AS INT), '*') chart
FROM payment
INNER JOIN customer using (customer_id)
GROUP BY customer_id
ORDER BY SUM(amount) DESC;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following picture illustrates the result:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
       fullname        | total  |         chart
-----------------------+--------+-----------------------
 Eleanor Hunt          | 211.55 | *********************
 Karl Seal             | 208.58 | ********************
 Marion Snyder         | 194.61 | *******************
 Rhonda Kennedy        | 191.62 | *******************
 Clara Shaw            | 189.60 | ******************
 Tommy Collazo         | 183.63 | ******************
 Ana Bradley           | 167.67 | ****************
 Curtis Irby           | 167.62 | ****************
...
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this example,

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, add up the payments for each customer using the [`SUM()`](https://www.postgresqltutorial.com/postgresql-aggregate-functions/postgresql-sum-function/) function and the `GROUP BY` clause,
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Second, calculate the length of the bar chart based on the sums of payments using various functions: `TRUNC()` to truncate the total payments, `CAST()` to convert the result of the `TRUNC()` to an integer. To make the bar chart more readable, we divided the sum of payments by 10.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Third, apply the `LPAD()` function to pad the character (\*) based on the result of the second step above.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the PostgreSQL `LPAD()` function to pad characters on the left of a string to a certain length.
- <!-- /wp:list-item -->

<!-- /wp:list -->
