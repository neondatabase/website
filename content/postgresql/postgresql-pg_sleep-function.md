---
prevPost: postgresql-jsonb_to_record-function
nextPost: postgresql-having
createdAt: 2024-03-21T09:32:33.000Z
title: 'PostgreSQL PG_SLEEP() Function'
redirectFrom:
            - /postgresql/postgresql-pg_sleep 
            - /postgresql/postgresql-date-functions/postgresql-pg_sleep
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `PG_SLEEP()` function to pause the execution of a query.

## Introduction to the PostgreSQL PG_SLEEP() function

The `PG_SLEEP()` function allows you to create a delay (sleep) in your queries. The function can be useful when you want to test, simulate real-time processes, or add a pause between operations.

Here's the syntax of the `PG_SLEEP()` function:

```sql
PG_SLEEP(seconds)
```

In this syntax, the `seconds` parameter specifies the number of seconds for which you want the execution to pause. It can be an integer or a decimal number with fractions.

## The PostgreSQL PG_SLEEP() function examples

Let's explore some examples of using the `PG_SLEEP()` function.

### 1) Basic usage of PG_SLEEP() function

The following example uses the `PG_SLEEP()` function to pause the execution for 3 seconds before returning any result:

```sql
SELECT pg_sleep(3);
```

After 3 seconds:

```
 pg_sleep
----------

(1 row)
```

### 2) Using Fractional Seconds

The following example uses the `PG_SLEEP()` function to pause the execution for `1.5` seconds:

```sql
SELECT PG_SLEEP(1.5);
```

After `1.5` seconds:

```
 pg_sleep
----------

(1 row)
```

### 3) Using the PG_SLEEP() function with NOW() function

The following example uses the `PG_SLEEP()` function between the `NOW()` functions:

```sql
SELECT NOW(), PG_SLEEP(3), NOW();
```

Output:

```
-[ RECORD 1 ]---------------------------
now      | 2024-03-21 02:26:37.710939-07
pg_sleep |
now      | 2024-03-21 02:26:37.710939-07
```

The output indicates that the result of the `NOW()` function does not change within the same statement even though we use pause the execution between the calls of the `NOW()` functions for 3 seconds.

### 4) Using the PG_SLEEP() function with CLOCK_TIMESTAMP() function

The following example uses the `PG_SLEEP()` function between the `CLOCK_TIMESTAMP()` functions:

```sql
SELECT CLOCK_TIMESTAMP(), PG_SLEEP(3), CLOCK_TIMESTAMP();
```

Output:

```
-[ RECORD 1 ]---+------------------------------
clock_timestamp | 2024-03-21 02:27:03.181753-07
pg_sleep        |
clock_timestamp | 2024-03-21 02:27:06.186789-07
```

The output shows that the `CLOCK_TIMESTAMP()` returns the actual current timestamp when it executes. The results of the `CLOCK_TIMESTAMP()` function calls are 3 seconds difference.

## Summary

- Use the `PG_SLEEP()` function to pause the SQL execution for a number of seconds.
