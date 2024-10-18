---
title: 'PostgreSQL SPLIT_PART() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-string-functions/postgresql-split_part/
ogImage: ./img/wp-content-uploads-2013-05-payment-table.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL SPLIT_PART() function to retrieve a part of a string at a specified position after splitting.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL SPLIT_PART() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `SPLIT_PART()` function splits a [string](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-char-varchar-text/) on a specified delimiter and returns the nth substring.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following illustrates the syntax of the PostgreSQL `SPLIT_PART()` function:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SPLIT_PART(string, delimiter, position)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `SPLIT_PART()` function requires three arguments:

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

**1) `string`**

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

This is the string to be split.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

**2) `delimiter`**

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The delimiter is a string used as the delimiter for splitting.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

**3) `position`**

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

This is the position of the part to return, starting from 1. The position must be a positive integer.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If the `position` is greater than the number of parts after splitting, the `SPLIT_PART()` function returns an empty string.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `SPLIT_PART()` function returns a part as a string at a specified position.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL SPLIT_PART() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's take some examples of using the PostgreSQL `SPLIT_PART()` function.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic PostgreSQL SPLIT_PART() function example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `SPLIT_PART()` function to split a string by a comma (`,`) and returns the third substring:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT SPLIT_PART('A,B,C', ',', 2);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The string `'A,B,C'` is split on the comma delimiter (,) that results in 3 substrings: 'A', 'B', and 'C'.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Because the `position` is 2, the function returns the 2nd substring which is 'B'.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here is the output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 split_part
------------
 B
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 1) Using PostgreSQL SPLIT_PART() function with a position that does not exist

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example returns an empty string because the position is greater than the number of parts (3):

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT SPLIT_PART('A,B,C', ',', 4) result;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 result
--------

(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 3) Using the SPLIT_PART() function with table data

<!-- /wp:heading -->

<!-- wp:paragraph -->

See the following `payment` table in the [sample database.](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/)

<!-- /wp:paragraph -->

<!-- wp:image {"id":443} -->

![payment table](./img/wp-content-uploads-2013-05-payment-table.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

The following statement uses the `SPLIT_PART()` function to return the year and month of the payment date:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT
    split_part(payment_date::TEXT,'-', 1) y,
    split_part(payment_date::TEXT,'-', 2) m,
    amount
FROM
    payment;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
  y   | m  | amount
------+----+--------
 2007 | 02 |   7.99
 2007 | 02 |   1.99
 2007 | 02 |   7.99
...
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the PostgreSQL `SPLIT_PART()` function to retrieve a part of a string at a specified position after splitting.
- <!-- /wp:list-item -->

<!-- /wp:list -->
