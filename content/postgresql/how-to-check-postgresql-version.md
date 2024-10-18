---
title: 'How to Check PostgreSQL Version'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-administration/postgresql-version/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn various ways to check the PostgreSQL version on your system.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## 1) Checking PostgreSQL version using psql

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, open Command Prompt on Windows or Terminal on a Unix-like system.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Second, run the following command:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
psql --version
```

<!-- /wp:code -->

<!-- wp:paragraph -->

This command will display the PostgreSQL version installed on your server.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## 2) Getting the version using SQL statements

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, connect to the PostgreSQL server using psql or GUI tools like pgAdmin.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

For example, you can connect to the PostgreSQL server using psql:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
psql -U postgres
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, run the following statement to retrieve the version:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT version();
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The query will return a text that includes the PostgreSQL version. For example:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
                          version
------------------------------------------------------------
 PostgreSQL 16.1, compiled by Visual C++ build 1937, 64-bit
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading -->

## 3) Querying version from the information schema

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, connect to the PostgreSQL database using psql or a PostgreSQL client.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Second, execute the following query to get the PostgreSQL version:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  setting
FROM
  pg_settings
WHERE
  name = 'server_version';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 setting
---------
 16.1
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `psql --version` command, `select version()` statement, and retrieve the `setting` from the `pg_settings` to get the PostgreSQL version.
- <!-- /wp:list-item -->

<!-- /wp:list -->
