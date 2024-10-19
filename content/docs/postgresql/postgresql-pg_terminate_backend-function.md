---
title: 'PostgreSQL pg_terminate_backend() Function'
redirectFrom:
            - /docs/postgresql/postgresql-pg_terminate_backend 
            - /docs/postgresql/postgresql-administration/postgresql-pg_terminate_backend
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to terminate a process in PostgreSQL using the `pg_terminate_backend()` function.

## Introduction to the pg_terminate_backend() function

The `pg_terminate_backend()` function allows you to terminate a backend process, which effectively kills the connection associated with that process.

The `pg_terminate_backend()` function can be useful for various database administrative tasks, such as terminating long-running queries or disconnecting idle sessions.

Here's the syntax of the `pg_terminate_backend()` function:

```
pg_terminate_backend ( pid integer, timeout bigint DEFAULT 0 ) → boolean
```

In this syntax:

- First, specify the process id (`pid`) that you want to terminate.
- Second, use the `timeout` in milliseconds to instruct the function to wait until the process is terminated or until the given time has passed. The timeout is optional.

If you don't use a `timeout`, the function returns `true` indicating that it has successfully sent a termination signal to the backend whether the process is terminated or not.

If you use a `timeout`, the function returns true if the process is terminated or `false` on timeout.

## PostgreSQL pg_terminate_backend() function example

The steps for killing a process by the process `ID` are as follows:

First, [connect to the PostgreSQL server](/docs/postgresql/postgresql-getting-started/connect-to-postgresql-database) using `psql`:

```
psql -U postgres
```

Second, retrieve a list of process `ID` (or pid) using the following query:

```
SELECT
  pid,
  usename,
  state,
  query
FROM
  pg_stat_activity;
```

Third, suppose you want to kill the process id `2600`, you can execute the `pg_terminate_backend()` function:

```
SELECT pg_terminate_backend(2600);
```

Output:

```
 pg_terminate_backend
----------------------
 t
(1 row)
```

## Summary

- Use the `pg_terminate_backend()` function to terminate a process by the process ID.
