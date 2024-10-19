---
prevPost: /postgresql/postgresql-regexp_replace-function
nextPost: /postgresql/postgresql-floor-function
createdAt: 2017-08-16T02:49:19.000Z
title: 'PostgreSQL LOCALTIMESTAMP Function'
redirectFrom:
            - /postgresql/postgresql-localtimestamp 
            - /postgresql/postgresql-date-functions/postgresql-localtimestamp
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `LOCALTIMESTAMP` function to return the current date and time at which the current transaction starts.

## Introduction to PostgreSQL LOCALTIMESTAMP function

The following illustrates the syntax of the `LOCALTIMESTAMP` function:

```sql
LOCALTIMESTAMP(precision)
```

The `LOCALTIMESTAMP` function accepts one argument:

**1) `precision`**

The `precision` argument specifies fractional seconds precision of the second field.

The `precision` argument is optional. If you omit it, its default value is 6.

The `LOCALTIMESTAMP` function returns a `TIMESTAMP` value that represents the date and time at which the current transaction starts.

The `LOCALTIMESTAMP` function returns a `TIMESTAMP` value **without** time zone whereas the `CURRENT_TIMESTAMP` function returns a `TIMESTAMP` **with** the timezone.

## PostgreSQL LOCALTIMESTAMP function examples

Let's explore some examples of using the `LOCALTIMESTAMP` function

### 1) Basic PostgreSQL LOCALTIMESTAMP function example

The following example uses the `LOCALTIMESTAMP` function to get the current date and time of the transaction:

```sql
SELECT LOCALTIMESTAMP;
```

Output:

```
         timestamp
----------------------------
 2017-08-16 09:37:38.443431
(1 row)
```

### 2) Using PostgreSQL LOCALTIMESTAMP function with a fractional seconds precision example

To get the timestamp of the current transaction with specific fractional seconds precision, you use the `precision` argument as follows:

```sql
SELECT LOCALTIMESTAMP(2);
```

The result is:

```
       timestamp
------------------------
 2017-08-16 09:39:06.64
(1 row)
```

## Summary

- Use the PostgreSQL `LOCALTIMESTAMP` function to return the date and time at which the current transaction starts.
