---
title: 'PostgreSQL Rename Database'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-administration/postgresql-rename-database/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn step-by-step how to rename a PostgreSQL database using the `ALTER DATABASE...RENAME TO` statement.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL rename database steps

<!-- /wp:heading -->

<!-- wp:paragraph -->

To rename a PostgreSQL database, you use the following steps:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, change the current database from the one that you want to rename to a different one.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Second, terminate all active connections to the database that you want to rename.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Third, use the `ALTER DATABASE` statement to rename the database to the new one.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

Let's take a look at an example of renaming a database.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, open the Command Prompt on Windows or Terminal on a Unix-like system and connect to the PostgreSQL server:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
psql -U postgres
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, create a new database called db:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
CREATE DATABASE db;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

We'll rename the `db` database to `newdb`:

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Third, if you are already connected to the PostgreSQL server, you can change the current database to a different one, for example, postgres:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
\c postgres
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Fourth, retrieve all active connections to the `db` database:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
SELECT  *
FROM pg_stat_activity
WHERE datname = 'db';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The query returned the following output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
-[ RECORD 1 ]----+------------------------------
datid            | 35918
datname          | db
pid              | 6904
usesysid         | 10
usename          | postgres
application_name | psql
client_addr      | ::1
client_hostname  |
client_port      | 56412
backend_start    | 2017-02-21 08:25:05.083705+07
xact_start       |
query_start      |
state_change     | 2017-02-21 08:25:05.092168+07
waiting          | f
state            | idle
backend_xid      |
backend_xmin     |
query            |
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output shows one connection to the `db` database.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

In practice, a database may have many active connections. In this case, you need to inform the respective users as well as the application owners before terminating connections to avoid data loss.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Fifth, terminate all the connections to the `db` database:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
    pg_terminate_backend (pid)
FROM
    pg_stat_activity
WHERE
    datname = 'db';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Sixth, rename the `db` database to `newdb` using the `ALTER DATABASE RENAME TO` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER DATABASE db RENAME TO newdb;
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `ALTER DATABASE RENAME TO` statement to rename a database from the PostgreSQL server.
- <!-- /wp:list-item -->

<!-- /wp:list -->
