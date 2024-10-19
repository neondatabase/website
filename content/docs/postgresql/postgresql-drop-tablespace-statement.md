---
title: 'PostgreSQL DROP TABLESPACE Statement'
redirectFrom: 
            - /docs/postgresql/postgresql-administration/postgresql-drop-tablespace/
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the **PostgreSQL DROP TABLESPACE** statement to remove a tablespace.

## Introduction to PostgreSQL DROP TABLESPACE statement

The `DROP TABLESPACE` statement delete a tablespace from a database:

Here's the syntax of the `DROP TABLE` statement:

```
DROP TABLESPACE [IF EXISTS] tablespace_name;
```

In this syntax:

- First, specify the name of the tablespace that you want to remove after the `DROP TABLESPACE` keywords.
-
- Second, use the `IF EXISTS` option to instruct PostgreSQL to issue a notice instead of an error when the tablespace does not exist.

Only tablespace owners or superusers can execute the `DROP TABLESPACE` statement to drop the tablespace.

## PostgreSQL DROP TABLESPACE examples

Let's explore some examples of using the `DROP TABLESPACE` statement.

### 1) Basic DROP TABLESPACE statement example

First, open the Command Prompt or Terminal on a Unix-like system and create a new directory for the tablespace such as `C:\pgdata\demo`:

```
mkdir C:\pgdata\sample
```

Next, connect to the PostgreSQL server:

```
psql -U postgres
```

Then, create a new tablespace called sample_ts:

```
CREATE TABLESPACE sample_ts
LOCATION 'C:/pgdata/demo';
```

After that, drop the `sample_ts` tablespace using the `DROP TABLESPACE` statement:

```
DROP TABLESPACE sample_ts;
```

Finally, exit psql:

```
exit
```

### 2) Dropping a tablespace that has objects

First, create a new directory called `C:/pgdata/demo` on your server. Replace the path with the actual one that you use:

```
mkdir C:\pgdata\demo
```

Second, [create a new tablespace](/docs/postgresql/postgresql-administration/postgresql-create-tablespace) named `demo` and map it to the `c:\pgdata\demo` directory.

```
CREATE TABLESPACE demo_ts
LOCATION 'C:/pgdata/demo';
```

Third, [create a new database](https://www.postgresqltutorial.com/postgresql-administration/postgresql-create-database/ "PostgreSQL CREATE DATABASE") named `dbdemo` and set its tablespace to `demo`:

```
CREATE DATABASE demodb
TABLESPACE = demo;
```

Fourth, connect to the `demodb` database:

```
\c demodb
```

Fifth, [create a new table](/docs/postgresql/postgresql-create-table "PostgreSQL CREATE TABLE") named `test`in the `dbdemo` and set it `tablespace` to `demo_ts`:

```
CREATE TABLE test (
  id serial PRIMARY KEY,
  title VARCHAR (255) NOT NULL
) TABLESPACE demo;
```

Sixth, attempt to drop the `demo` tablespace:

```
DROP TABLESPACE demo_ts;
```

PostgreSQL issues an error:

```
[Err] ERROR: tablespace "demo_ts" is not empty
```

Because the `demo_ts` tablespace is not empty, you cannot drop it.

Seventh, connect to the `postgres` database:

```
\c postgres
```

Eight, drop the `demodb` database:

```
DROP DATABASE demodb;
```

Ninth, drop the `demo_ts` tablespace:

```
DROP TABLESPACE demo_ts;
```

Instead of [dropping the database](https://www.postgresqltutorial.com/postgresql-administration/postgresql-drop-database/ "PostgreSQL DROP DATABASE"), you can move it to another tablespace such as `pg_default` by using the [ALTER TABLE](https://www.postgresqltutorial.com/postgresql-administration/postgresql-alter-database/ "PostgreSQL ALTER DATABASE") statement as follows:

```
ALTER DATABASE demodb
SET TABLESPACE = pg_default;
```

And then delete the `demo_ts` tablespace again:

```
DROP TABLESPACE demo_ts
```

## Summary

- Use the PostgreSQL `DROP TABLESPACE` statement to drop a tablespace.
