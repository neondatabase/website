---
title: 'PostgreSQL LOCALTIME Function'
page_title: 'PostgreSQL LOCALTIME Function'
page_description: 'You will learn how to use the PostgreSQL LOCALTIME function to return the current time at which the current transaction starts.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-localtime/'
ogImage: ''
updatedOn: '2024-01-26T09:40:37+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL NOW() Function'
  slug: 'postgresql-date-functions/postgresql-now'
nextLink:
  title: 'PostgreSQL LOCALTIMESTAMP Function'
  slug: 'postgresql-date-functions/postgresql-localtimestamp'
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `LOCALTIME` function to return the current time at which the current transaction starts.

## Introduction to PostgreSQL LOCALTIME function

The `LOCALTIME()` function returns the current time at which the current transaction starts.

Here’s the basic syntax of the `LOCALTIME` function:

```css
LOCALTIME(precision)
```

The `LOCALTIME` function takes one optional argument:

**1\) `precision`**

The `precision` argument specifies fractional seconds precision of the second field.

If you omit the `precision` argument, it defaults to 6\.

The `LOCALTIME` function returns a [`TIME`](../postgresql-tutorial/postgresql-time) value that represents the time at which the current transaction starts.

Note that the `LOCATIME` function returns a `TIME` without time zone whereas the [`CURRENT_TIME`](postgresql-current_time) function returns a `TIME` with the timezone.

## PostgreSQL LOCALTIME function examples

Let’s take some examples of using the `LOCALTIME` function.

### 1\) Basic PostgreSQL LOCALTIME function example

The following example uses the `LOCALTIME` function to get the time of the current transaction:

```
SELECT LOCALTIME;
```

Output:

```
    localtime
-----------------
 16:37:59.950622
(1 row)

```

### 2\) Using the PostgreSQL LOCALTIME function with fractional seconds precision

The following example uses the `LOCALTIME(2)` function to get the time with a specified fractional seconds precision:

```css
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
