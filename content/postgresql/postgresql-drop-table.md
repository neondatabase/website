---
redirectFrom:
    - /postgresql/postgresql-tutorial/postgresql-drop-table
prevPost: postgresql-rename-column-renaming-a-column
nextPost: postgresql-truncate-table
createdAt: 2013-05-31T08:04:05.000Z
title: 'PostgreSQL DROP TABLE'
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `DROP TABLE` statement to remove one or more tables from the database.

## Introduction to PostgreSQL DROP TABLE statement

To drop a table from the database, you use the `DROP TABLE` statement as follows:

```sql
DROP TABLE [IF EXISTS] table_name
[CASCADE | RESTRICT];
```

In this syntax:

- First, specify the name of the table that you want to drop after the `DROP TABLE` keywords.
-
- Second, use the `IF EXISTS` option to remove the table only if it exists.

If you remove a table that does not exist, PostgreSQL issues an error. To avoid the error, you can use the `IF EXISTS` option.

If the table is used in other database objects such as [views](/postgresql/postgresql-views), [triggers](/postgresql/postgresql-triggers/enable-triggers), functions, and stored procedures, you cannot remove it. In this case, you have two options:

- Use the `CASCADE` option to remove the table and its dependent objects.
-
- Use the `RESTRICT` option rejects the removal if there is any object depending on the table. The `RESTRICT` option is the default if you don't explicitly specify it in the `DROP TABLE` statement.

To remove multiple tables simultaneously, you can place the tables separated by commas after the `DROP TABLE` keywords:

```sql
DROP TABLE [IF EXISTS]
   table_name_1,
   table_name_2,
   ...
[CASCADE | RESTRICT];
```

Note that you need to have the roles of the superuser, schema owner, or table owner to drop tables.

## PostgreSQL DROP TABLE examples

Let's take some examples of using the PostgreSQL `DROP TABLE` statement.

### 1) Drop a table that does not exist

The following statement removes a table named `author` in the database:

```sql
DROP TABLE author;
```

PostgreSQL issues an error because the `author` table does not exist.

```
[Err] ERROR:  table "author" does not exist
```

To avoid the error, you can use the `IF EXISTS` option like this.

```sql
DROP TABLE IF EXISTS author;
```

```sql
NOTICE:  table "author" does not exist, skipping DROP TABLE
```

The output indicates that PostgreSQL issued a notice instead of an error.

### 2) Drop a table that has dependent objects

The following [creates new tables](/postgresql/postgresql-create-table "PostgreSQL CREATE TABLE") called `authors` and `pages`. The `pages` table has a foreign key that references the `authors` table.

```sql
CREATE TABLE authors (
  author_id INT PRIMARY KEY,
  firstname VARCHAR (50) NOT NULL,
  lastname VARCHAR (50) NOT NULL
);

CREATE TABLE pages (
  page_id SERIAL PRIMARY KEY,
  title VARCHAR (255) NOT NULL,
  contents TEXT,
  author_id INT NOT NULL,
  FOREIGN KEY (author_id) REFERENCES authors (author_id)
);
```

The following statement uses the `DROP TABLE` to drop the `authors` table:

```sql
DROP TABLE IF EXISTS authors;
```

Because the `authors` table has a dependent object which is a foreign key that references the `pages` table, PostgreSQL issues an error message:

```sql
ERROR:  cannot drop table authors because other objects depend on it
DETAIL:  constraint pages_author_id_fkey on table pages depends on table authors
HINT:  Use DROP ... CASCADE to drop the dependent objects too.
```

In this case, you need to remove all dependent objects first before dropping the `author` table or use `CASCADE` option as follows:

```sql
DROP TABLE authors CASCADE;
```

This statement deletes the `authors` table as well as the constraint in the `pages` table.

If the `DROP TABLE` statement removes the dependent objects of the table that are being dropped, it will issue a notice like this:

```sql
NOTICE:  drop cascades to constraint pages_author_id_fkey on table pages
DROP TABLE
```

### 3) Drop multiple tables

The following statements create two tables for the demo purposes:

```sql
CREATE TABLE tvshows(
  tvshow_id INT GENERATED ALWAYS AS IDENTITY,
  title VARCHAR,
  release_year SMALLINT,
  PRIMARY KEY(tvshow_id)
);

CREATE TABLE animes(
  anime_id INT GENERATED ALWAYS AS IDENTITY,
  title VARCHAR,
  release_year SMALLINT,
  PRIMARY KEY(anime_id)
);
```

The following example uses a single `DROP TABLE` statement to drop the `tvshows` and `animes` tables:

```sql
DROP TABLE tvshows, animes;
```

## Summary

- Use the `DROP TABLE` statement to drop one or more tables.
-
- Use the `CASCADE` option to drop a table and all of its dependent objects.
