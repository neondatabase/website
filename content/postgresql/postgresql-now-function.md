---
title: 'PostgreSQL NOW() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-now/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `NOW()` function to get the current date and time with the time zone.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL NOW() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `NOW()` function returns the current date and time with the time zone of the database server.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the basic syntax of the `NOW()` function:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
NOW()
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `NOW()` function doesn't require any argument. Its return type is the [timestamp with time zone](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-timestamp/). For example:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT NOW();
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
              now
-------------------------------
 2024-01-26 18:14:09.101641-08
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Note that the `NOW()` function returns the current date and time based on the database server's time zone setting.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

For example, if you change the timezone to 'Africa/Cairo' and get the current date and time:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SET TIMEZONE='Africa/Cairo';
SELECT NOW();
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
              now
-------------------------------
 2024-01-27 04:15:20.112974+02
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output indicates that the value returned by the `NOW()` function is adjusted to the new timezone.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Note that to get a complete list of time zones, you can query from the `pg_timezone_names`:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT * FROM pg_timezone_names;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Partial output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
               name               | abbrev | utc_offset | is_dst
----------------------------------+--------+------------+--------
 Africa/Abidjan                   | GMT    | 00:00:00   | f
 Africa/Accra                     | GMT    | 00:00:00   | f
 Africa/Addis_Ababa               | EAT    | 03:00:00   | f
...
```

<!-- /wp:code -->

<!-- wp:paragraph -->

If you want to get the current date and time without a timezone, you can cast it explicitly as follows:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT NOW()::timestamp;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
            now
----------------------------
 2017-03-17 18:37:29.229991
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

You can use the common date and time operators for the `NOW()` function. For example, to get 1 hour from now:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
        an_hour_later
------------------------------
 2024-01-27 05:16:17.15237+02
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To get this time tomorrow, you add 1 day to the current time:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT (NOW() + interval '1 day') AS this_time_tomorrow;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
      this_time_tomorrow
-------------------------------
 2024-01-28 04:16:28.308575+02
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To get 2 hours 30 minutes ago, you use the minus (-) operator as follows:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT now() - interval '2 hours 30 minutes' AS two_hour_30_min_go;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
      two_hour_30_min_go
-------------------------------
 2024-01-27 01:47:18.246763+02
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading -->

## PostgreSQL NOW() related functions

<!-- /wp:heading -->

<!-- wp:paragraph -->

Besides the `NOW()` function, you can use the `CURRENT_TIME` or `CURRENT_TIMESTAMP` to get the current date and time with the timezone:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT CURRENT_TIME, CURRENT_TIMESTAMP;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
    current_time    |       current_timestamp
--------------------+-------------------------------
 04:17:46.412062+02 | 2024-01-27 04:17:46.412062+02
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To get the current date and time without a timezone, you use the `LOCALTIME` and `LOCALTIMESTAMP` functions.

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT LOCALTIME, LOCALTIMESTAMP;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
      time       |         timestamp
-----------------+----------------------------
 19:13:41.423371 | 2017-03-17 19:13:41.423371
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Notice that `NOW()` and its related functions return the start time of the current transaction. In other words, the return values of the function calls are the same within a transaction.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following example illustrates the concept:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

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

<!-- /wp:code -->

<!-- wp:paragraph -->

In this example, we called the `NOW()` function within a transaction and its return values do not change through the transaction.

<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"note"} -->

Note that the `pg_sleep()` function pauses the current session's process sleep for a specified of seconds.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If you want to get the current date and time that does advance during the transaction, you can use the `TIMEOFDAY()` function. Consider the following example:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT
    TIMEOFDAY(),
    pg_sleep(5),
    TIMEOFDAY();
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
              timeofday              | pg_sleep |              timeofday
-------------------------------------+----------+-------------------------------------
 Sat Jan 27 04:19:08.650831 2024 EET |          | Sat Jan 27 04:19:13.655833 2024 EET
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

After pausing 5 seconds, the current date and time increased.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL NOW() function as default values

<!-- /wp:heading -->

<!-- wp:paragraph -->

You can use the `NOW()` function as the default value for a column of a table. For example:

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, [create a new table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) named posts with the `created_at` column that has a default value provided by the `NOW()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE posts (
     id         SERIAL PRIMARY KEY,
     title      VARCHAR NOT NULL,
     created_at TIMESTAMPTZ DEFAULT Now()
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, [insert a new row](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert/) into the `posts` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO posts (title)
VALUES     ('PostgreSQL NOW function');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, [query data](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-select/) from the `posts` table:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT * FROM posts;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 id |          title          |          created_at
----+-------------------------+-------------------------------
  1 | PostgreSQL NOW function | 2024-01-27 04:20:11.286958+02
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Even though we did not provide the value for the `created_at` column, the statement used the value returned by the `NOW()` function for that column.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the PostgreSQL `NOW()` function to get the current date and time with the timezone.
- <!-- /wp:list-item -->

<!-- /wp:list -->
