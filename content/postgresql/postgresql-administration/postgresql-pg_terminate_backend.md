---
title: 'PostgreSQL pg_terminate_backend() Function'
page_title: 'PostgreSQL pg_terminate_backend() Function'
page_description: 'In this tutorial, you will learn how to terminate a process by pid in PostgreSQL using the pg_terminate_backend function.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-administration/postgresql-pg_terminate_backend/'
ogImage: ''
updatedOn: '2024-02-22T13:20:44+00:00'
enableTableOfContents: true
previousLink:
  title: 'How to Restart PostgreSQL on Windows'
  slug: 'postgresql-administration/restart-postgresql-windows'
nextLink:
  title: 'PostgreSQL Functions'
  slug: 'postgresql-administration/../postgresql-functions'
---

**Summary**: in this tutorial, you will learn how to terminate a process in PostgreSQL using the `pg_terminate_backend()` function.

## Introduction to the pg_terminate_backend() function

The `pg_terminate_backend()` function allows you to terminate a backend process, which effectively kills the connection associated with that process.

The `pg_terminate_backend()` function can be useful for various database administrative tasks, such as terminating long\-running queries or disconnecting idle sessions.

Here’s the syntax of the `pg_terminate_backend()` function:

```sql
pg_terminate_backend ( pid integer, timeout bigint DEFAULT 0 ) → boolean
```

In this syntax:

- First, specify the process id (`pid`) that you want to terminate.
- Second, use the `timeout` in milliseconds to instruct the function to wait until the process is terminated or until the given time has passed. The timeout is optional.

If you don’t use a `timeout`, the function returns `true` indicating that it has successfully sent a termination signal to the backend whether the process is terminated or not.

If you use a `timeout`, the function returns true if the process is terminated or `false` on timeout.

<Admonition type="tip" title="Neon Note">
On the Neon platform, superuser privileges are not available, so you can only cancel or terminate your own connections. You cannot stop other users' connections directly. As a workaround, you can identify the user that owns the connection and request that the user terminate the connection. To identify the user:

```sql
SELECT pid, usename, client_addr, application_name, state, query, now() - query_start AS duration
FROM pg_stat_activity
WHERE state <> 'idle'
ORDER BY duration DESC;
```

</Admonition>

## PostgreSQL pg_terminate_backend() function example

The steps for killing a process by the process `ID` are as follows:

First, [connect to the PostgreSQL server](../postgresql-getting-started/connect-to-postgresql-database) using `psql`:

```bash
psql -U postgres
```

Second, retrieve a list of process `ID` (or pid) using the following query:

```sql
SELECT
  pid,
  usename,
  state,
  query
FROM
  pg_stat_activity;
```

Third, suppose you want to kill the process id `2600`, you can execute the `pg_terminate_backend()` function:

```sql
SELECT pg_terminate_backend(2600);
```

Output:

```text
 pg_terminate_backend
----------------------
 t
(1 row)
```

## Summary

- Use the `pg_terminate_backend()` function to terminate a process by the process ID.
