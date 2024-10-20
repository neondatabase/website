---
prevPost: postgresql-instead-of-triggers
nextPost: postgresql-between
createdAt: 2024-05-19T04:16:09.000Z
title: 'PostgreSQL MIN_SCALE() Function'
redirectFrom: 
            - /postgresql/postgresql-min_scale
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `min_scale()` function to determine the minimum number of decimal places required to represent a number accurately.

## Introduction to the PostgreSQL MIN_SCALE() function

In PostgreSQL, the `min_scale()` function allows you to determine the minimum number of decimal places required to represent a number accurately.

Here's the syntax of the `min_scale()` function:

```
min_sacle(n)
```

In this syntax:

- `n` is a value of the numeric data type that you want to find the minimum number of decimal places.

The `min_scale()` function returns an integer that represents the minimum scale needed to represent the input number `n` precisely.

The `min_scale()` function returns null if the input number is null.

Please note that PostgreSQL added the `min_scale()` function since version 13.

In practice, you can use the `min_scale()` function to save storage space by avoiding unnecessary decimal places when storing numeric data.

## PostgreSQL MIN_SCALE() function examples

The following example uses the `min_scale()` function to return the min scale of the number `1.2300`:

```sql
SELECT min_scale(1.2300);
```

Output:

```
 min_scale
-----------
         2
(1 row)
```

The following example returns the min scale of the number 1.23:

```sql
SELECT min_scale(1.23);
```

Output:

```
 min_scale
-----------
         2
(1 row)
```

The following example returns 0 because the integer 10 has no decimals:

```sql
SELECT min_scale(10);
```

Output:

```
 min_scale
-----------
         0
(1 row)
```

## Summary

- Use the `min_scale()` function to determine the minimum scale of a number.
