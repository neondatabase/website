---
prevPost: how-to-get-sizes-of-database-objects-in-postgresql
nextPost: postgresql-split_part-function
createdAt: 2017-03-18T03:07:35.000Z
title: 'PostgreSQL NOW() Function'
redirectFrom:
            - /postgresql/postgresql-now 
            - /postgresql/postgresql-date-functions/postgresql-now
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `NOW()` function to get the current date and time with the time zone.

## Introduction to PostgreSQL NOW() function

The `NOW()` function returns the current date and time with the time zone of the database server.

Here's the basic syntax of the `NOW()` function:

```sql
NOW()
```

The `NOW()` function doesn't require any argument. Its return type is the [timestamp with time zone](/postgresql/postgresql-timestamp). For example:

```sql
SELECT NOW();
```

Output:

```
              now
-------------------------------
 2024-01-26 18:14:09.101641-08
(1 row)
```

Note that the `NOW()` function returns the current date and time based on the database server's time zone setting.

For example, if you change the timezone to 'Africa/Cairo' and get the current date and time:

```sql
SET TIMEZONE='Africa/Cairo';
SELECT NOW();
```

Output:

```
              now
-------------------------------
 2024-01-27 04:15:20.112974+02
(1 row)
```

The output indicates that the value returned by the `NOW()` function is adjusted to the new timezone.

Note that to get a complete list of time zones, you can query from the `pg_timezone_names`:

```sql
SELECT * FROM pg_timezone_names;
```

Partial output:

```
               name               | abbrev | utc_offset | is_dst
----------------------------------+--------+------------+--------
 Africa/Abidjan                   | GMT    | 00:00:00   | f
 Africa/Accra                     | GMT    | 00:00:00   | f
 Africa/Addis_Ababa               | EAT    | 03:00:00   | f
...
```

If you want to get the current date and time without a timezone, you can cast it explicitly as follows:

```sql
SELECT NOW()::timestamp;
```

Output:

```
            now
----------------------------
 2017-03-17 18:37:29.229991
(1 row)
```

You can use the common date and time operators for the `NOW()` function. For example, to get 1 hour from now:

```
        an_hour_later
------------------------------
 2024-01-27 05:16:17.15237+02
(1 row)
```

To get this time tomorrow, you add 1 day to the current time:

```sql
SELECT (NOW() + interval '1 day') AS this_time_tomorrow;
```

Output:

```
      this_time_tomorrow
-------------------------------
 2024-01-28 04:16:28.308575+02
(1 row)
```

To get 2 hours 30 minutes ago, you use the minus (-) operator as follows:

```sql
SELECT now() - interval '2 hours 30 minutes' AS two_hour_30_min_go;
```

Output:

```
      two_hour_30_min_go
-------------------------------
 2024-01-27 01:47:18.246763+02
(1 row)
```

## PostgreSQL NOW() related functions

Besides the `NOW()` function, you can use the `CURRENT_TIME` or `CURRENT_TIMESTAMP` to get the current date and time with the timezone:

```sql
SELECT CURRENT_TIME, CURRENT_TIMESTAMP;
```

Output:

```
    current_time    |       current_timestamp
--------------------+-------------------------------
 04:17:46.412062+02 | 2024-01-27 04:17:46.412062+02
(1 row)
```

To get the current date and time without a timezone, you use the `LOCALTIME` and `LOCALTIMESTAMP` functions.

```sql
SELECT LOCALTIME, LOCALTIMESTAMP;
```

Output:

```
      time       |         timestamp
-----------------+----------------------------
 19:13:41.423371 | 2017-03-17 19:13:41.423371
(1 row)
```

Notice that `NOW()` and its related functions return the start time of the current transaction. In other words, the return values of the function calls are the same within a transaction.

The following example illustrates the concept:

```
postgres=# BEGIN;
BEGIN
postgres=# SELECT now();
              now
-------------------------------
 2017-03-17 19:21:43.049715-07
(1 row)


postgres=# SELECT pg_sleep(3);
 pg_sleep
----------

(1 row)


postgres=# SELECT now();
              now
-------------------------------
 2017-03-17 19:21:43.049715-07
(1 row)


postgres=# COMMIT;
COMMIT
```

In this example, we called the `NOW()` function within a transaction and its return values do not change through the transaction.

Note that the `pg_sleep()` function pauses the current session's process sleep for a specified of seconds.

If you want to get the current date and time that does advance during the transaction, you can use the `TIMEOFDAY()` function. Consider the following example:

```sql
SELECT
    TIMEOFDAY(),
    pg_sleep(5),
    TIMEOFDAY();
```

Output:

```
              timeofday              | pg_sleep |              timeofday
-------------------------------------+----------+-------------------------------------
 Sat Jan 27 04:19:08.650831 2024 EET |          | Sat Jan 27 04:19:13.655833 2024 EET
(1 row)
```

After pausing 5 seconds, the current date and time increased.

## PostgreSQL NOW() function as default values

You can use the `NOW()` function as the default value for a column of a table. For example:

First, [create a new table](/postgresql/postgresql-create-table) named posts with the `created_at` column that has a default value provided by the `NOW()` function:

```sql
CREATE TABLE posts (
     id         SERIAL PRIMARY KEY,
     title      VARCHAR NOT NULL,
     created_at TIMESTAMPTZ DEFAULT Now()
);
```

Second, [insert a new row](/postgresql/postgresql-insert) into the `posts` table:

```sql
INSERT INTO posts (title)
VALUES     ('PostgreSQL NOW function');
```

Third, [query data](/postgresql/postgresql-select) from the `posts` table:

```sql
SELECT * FROM posts;
```

Output:

```
 id |          title          |          created_at
----+-------------------------+-------------------------------
  1 | PostgreSQL NOW function | 2024-01-27 04:20:11.286958+02
(1 row)
```

Even though we did not provide the value for the `created_at` column, the statement used the value returned by the `NOW()` function for that column.

## Summary

- Use the PostgreSQL `NOW()` function to get the current date and time with the timezone.
