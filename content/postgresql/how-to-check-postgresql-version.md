---
prevPost: /postgresql/postgresql-cte
nextPost: /postgresql/postgresql-recursive-query
createdAt: 2024-02-20T06:32:51.000Z
title: 'How to Check PostgreSQL Version'
redirectFrom: 
            - /postgresql/postgresql-administration/postgresql-version
tableOfContents: true
---


**Summary**: in this tutorial, you will learn various ways to check the PostgreSQL version on your system.

## 1) Checking PostgreSQL version using psql

First, open Command Prompt on Windows or Terminal on a Unix-like system.

Second, run the following command:

```
psql --version
```

This command will display the PostgreSQL version installed on your server.

## 2) Getting the version using SQL statements

First, connect to the PostgreSQL server using psql or GUI tools like pgAdmin.

For example, you can connect to the PostgreSQL server using psql:

```
psql -U postgres
```

Second, run the following statement to retrieve the version:

```sql
SELECT version();
```

The query will return a text that includes the PostgreSQL version. For example:

```
                          version
------------------------------------------------------------
 PostgreSQL 16.1, compiled by Visual C++ build 1937, 64-bit
(1 row)
```

## 3) Querying version from the information schema

First, connect to the PostgreSQL database using psql or a PostgreSQL client.

Second, execute the following query to get the PostgreSQL version:

```sql
SELECT
  setting
FROM
  pg_settings
WHERE
  name = 'server_version';
```

Output:

```
 setting
---------
 16.1
(1 row)
```

## Summary

- Use the `psql --version` command, `select version()` statement, and retrieve the `setting` from the `pg_settings` to get the PostgreSQL version.
