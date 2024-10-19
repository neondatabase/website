---
createdAt: 2017-08-16T02:58:48.000Z
title: 'PostgreSQL LOCALTIME Function'
redirectFrom:
            - /postgresql/postgresql-localtime 
            - /postgresql/postgresql-date-functions/postgresql-localtime
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `LOCALTIME` function to return the current time at which the current transaction starts.

## Introduction to PostgreSQL LOCALTIME function

The `LOCALTIME()` function returns the current time at which the current transaction starts.

Here's the basic syntax of the `LOCALTIME` function:

```sql
LOCALTIME(precision)
```

The `LOCALTIME` function takes one optional argument:

**1) `precision`**

The `precision` argument specifies fractional seconds precision of the second field.

If you omit the `precision` argument, it defaults to 6.

The `LOCALTIME` function returns a `TIME` value that represents the time at which the current transaction starts.

Note that the `LOCATIME` function returns a `TIME` without time zone whereas the `CURRENT_TIME` function returns a `TIME` with the timezone.

## PostgreSQL LOCALTIME function examples

Let's take some examples of using the `LOCALTIME` function.

### 1) Basic PostgreSQL LOCALTIME function example

The following example uses the `LOCALTIME` function to get the time of the current transaction:

```sql
SELECT LOCALTIME;
```

Output:

```
    localtime
-----------------
 16:37:59.950622
(1 row)
```

### 2) Using the PostgreSQL LOCALTIME function with fractional seconds precision

The following example uses the `LOCALTIME(2)` function to get the time with a specified fractional seconds precision:

```sql
SELECT LOCALTIME(2);
```

Output:

```
  localtime
-------------
 16:38:07.97
(1 row)
```

## Summary

- Use the PostgreSQL `LOCALTIME` function to get the time at which the current transaction starts.
