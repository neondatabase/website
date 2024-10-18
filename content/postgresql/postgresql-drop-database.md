---
title: 'PostgreSQL DROP DATABASE'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-administration/postgresql-drop-database/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `DROP DATABASE` statement to drop a database.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL DROP DATABASE statement

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `DROP DATABASE` statement deletes a database from a PostgreSQL server.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the basic syntax of the `DROP DATABASE` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
DROP DATABASE [IF EXISTS] database_name
[WITH (FORCE)]
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, specify the database name that you want to remove after the `DROP DATABASE` keywords.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Second, if you delete a non-existing database, PostgreSQL will issue an error. To prevent the error, you can use the `IF EXISTS` option. In this case, PostgreSQL will issue a notice instead.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Third, the `DROP DATABASE` statement will fail if there are active connections to the target database unless you use the `FORCE` option. The `FORCE` option will attempt to terminate all existing connections to the target database.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The `DROP DATABASE` statement deletes the database from both catalog entry and data directory. Since PostgreSQL does not allow you to roll back this operation, you should use it with caution.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To execute the `DROP DATABASE` statement, you need to be the database owner.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Additionally, you cannot execute the `DROP DATABASE` statement while connecting to the target database. In this case, you can connect to the default `postgres` database or use the `dropdb` utility before executing the `DROP DATABASE` statement.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `dropdb` is a command-line utility that allows you to drop a database. The `dropdb` program executes the `DROP DATABASE` statement behind the scenes.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL DROP DATABASE statement examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's take some examples of using the `DROP DATABASE` statement.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### Setting up sample databases

<!-- /wp:heading -->

<!-- wp:paragraph -->

We'll create some databases for the demonstration purposes:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE DATABASE hr;
CREATE DATABASE test;
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 1) Basic DROP DATABASE statement example

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, open Command Prompt on Windows or Terminal on Unix-like systems and connect to the PostgreSQL server using psql:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
psql -U postgres
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, drop the database `hr` using the following `DROP DATABASE` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
DROP DATABASE hr;
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Removing a non-existing database example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example attempts to drop a database that does not exist:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
DROP DATABASE non_existing_database;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

PostgreSQL will issue the following error:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
ERROR:  database "non_existing_database" does not exist
```

<!-- /wp:code -->

<!-- wp:paragraph -->

If you use the `IF EXISTS` option, PostgreSQL will issue a notice instead:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
DROP DATABASE IF EXISTS non_existing_database;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
NOTICE:  database "non_existing_database" does not exist, skipping
DROP DATABASE
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 3) Drop a database that has active connections example

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, establish a connection to the PostgreSQL server using the `psql` tool:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
psql -U postgres
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Next, open the second connection to the PostgreSQL server. You can use psql, pgAdmin, or any PostgreSQL client tool.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Then, attempt to delete the `test` database from the first session:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
DROP DATABASE test;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

PostgreSQL issues an error:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
ERROR:  database "test" is being accessed by other users
DETAIL:  There is 1 other session using the database.
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output indicates that the `test` database is being accessed by other users.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To drop the database that has active connections, you can use the `FORCE` option.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

After that, find the connections to the `test` database by retrieving data from the `pg_stat_activity` view:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  datname,
  pid,
  usename,
  application_name,
  client_addr,
  client_port
FROM
  pg_stat_activity
WHERE
  datname = 'test';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 datname | pid  | usename  | application_name | client_addr | client_port
---------+------+----------+------------------+-------------+-------------
 test    | 9724 | postgres | psql             | 127.0.0.1   |       61287
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `test` database has one connection from `localhost`. Therefore, it's safe to terminate this connection and remove the database.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Finally, terminate the connections to the `test` database and drop it using the `WITH (FORCE)` option:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
DROP DATABASE test WITH (FORCE)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
DROP DATABASE
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the PostgreSQL `DROP DATABASE` statement to drop a database.
- <!-- /wp:list-item -->

<!-- /wp:list -->
