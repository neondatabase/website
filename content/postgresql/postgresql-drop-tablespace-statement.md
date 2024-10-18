---
title: 'PostgreSQL DROP TABLESPACE Statement'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-administration/postgresql-drop-tablespace/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the **PostgreSQL DROP TABLESPACE** statement to remove a tablespace.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL DROP TABLESPACE statement

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `DROP TABLESPACE` statement delete a tablespace from a database:

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the syntax of the `DROP TABLE` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
DROP TABLESPACE [IF EXISTS] tablespace_name;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, specify the name of the tablespace that you want to remove after the `DROP TABLESPACE` keywords.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Second, use the `IF EXISTS` option to instruct PostgreSQL to issue a notice instead of an error when the tablespace does not exist.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

Only tablespace owners or superusers can execute the `DROP TABLESPACE` statement to drop the tablespace.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL DROP TABLESPACE examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's explore some examples of using the `DROP TABLESPACE` statement.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic DROP TABLESPACE statement example

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, open the Command Prompt or Terminal on a Unix-like system and create a new directory for the tablespace such as `C:\pgdata\demo`:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
mkdir C:\pgdata\sample
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Next, connect to the PostgreSQL server:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
psql -U postgres
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Then, create a new tablespace called sample_ts:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
CREATE TABLESPACE sample_ts
LOCATION 'C:/pgdata/demo';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

After that, drop the `sample_ts` tablespace using the `DROP TABLESPACE` statement:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
DROP TABLESPACE sample_ts;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Finally, exit psql:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
exit
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Dropping a tablespace that has objects

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, create a new directory called `C:/pgdata/demo` on your server. Replace the path with the actual one that you use:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
mkdir C:\pgdata\demo
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, [create a new tablespace](https://www.postgresqltutorial.com/postgresql-administration/postgresql-create-tablespace/ "PostgreSQL Creating Tablespace") named `demo` and map it to the `c:\pgdata\demo` directory.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLESPACE demo_ts
LOCATION 'C:/pgdata/demo';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, [create a new database](https://www.postgresqltutorial.com/postgresql-administration/postgresql-create-database/ "PostgreSQL CREATE DATABASE") named `dbdemo` and set its tablespace to `demo`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE DATABASE demodb
TABLESPACE = demo;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Fourth, connect to the `demodb` database:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
\c demodb
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Fifth, [create a new table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/ "PostgreSQL CREATE TABLE") named `test`in the `dbdemo` and set it `tablespace` to `demo_ts`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE test (
  id serial PRIMARY KEY,
  title VARCHAR (255) NOT NULL
) TABLESPACE demo;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Sixth, attempt to drop the `demo` tablespace:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
DROP TABLESPACE demo_ts;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

PostgreSQL issues an error:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
[Err] ERROR: tablespace "demo_ts" is not empty
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Because the `demo_ts` tablespace is not empty, you cannot drop it.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Seventh, connect to the `postgres` database:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
\c postgres
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Eight, drop the `demodb` database:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
DROP DATABASE demodb;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Ninth, drop the `demo_ts` tablespace:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
DROP TABLESPACE demo_ts;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Instead of [dropping the database](https://www.postgresqltutorial.com/postgresql-administration/postgresql-drop-database/ "PostgreSQL DROP DATABASE"), you can move it to another tablespace such as `pg_default` by using the [ALTER TABLE](https://www.postgresqltutorial.com/postgresql-administration/postgresql-alter-database/ "PostgreSQL ALTER DATABASE") statement as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER DATABASE demodb
SET TABLESPACE = pg_default;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

And then delete the `demo_ts` tablespace again:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
DROP TABLESPACE demo_ts
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the PostgreSQL `DROP TABLESPACE` statement to drop a tablespace.
- <!-- /wp:list-item -->

<!-- /wp:list -->
