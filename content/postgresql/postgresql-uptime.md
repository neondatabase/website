---
title: 'PostgreSQL Uptime'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-administration/postgresql-uptime/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to calculate the PostgreSQL uptime based on the current time and the server's started time.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Checking PostgreSQL uptime

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, open the Command Prompt on Windows or Terminal on Unix-like systems and connect to the PostgreSQL server:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
psql -U postgres
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, execute the following query to get the PostgreSQL uptime:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  date_trunc(
    'second',
    current_timestamp - pg_postmaster_start_time()
  ) as uptime;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

How it works

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

PostgreSQL stores the time when it was started in the database server. To retrieve the start time, you use the `pg_postmaster_start_time()` function as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT pg_postmaster_start_time();
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
   pg_postmaster_start_time
-------------------------------
 2024-02-14 03:41:32.048451-07
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

You can then calculate the uptime based on the current time and the start time returned by the `pg_postmaster_start_time()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT current_timestamp - pg_postmaster_start_time() uptime;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
         uptime
------------------------
 6 days 07:39:06.006459
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

You can truncate the microsecond from the uptime using the `DATE_TRUNC()` function to make the output more human-readable:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  date_trunc(
    'second',
    current_timestamp - pg_postmaster_start_time()
  ) as uptime;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
     uptime
-----------------
 6 days 07:39:24
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Calculate the PostgreSQL uptime using the current time and start time.
- <!-- /wp:list-item -->

<!-- /wp:list -->
