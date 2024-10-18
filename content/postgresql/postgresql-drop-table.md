---
title: 'PostgreSQL DROP TABLE'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-drop-table/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `DROP TABLE` statement to remove one or more tables from the database.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL DROP TABLE statement

<!-- /wp:heading -->

<!-- wp:paragraph -->

To drop a table from the database, you use the `DROP TABLE` statement as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
DROP TABLE [IF EXISTS] table_name
[CASCADE | RESTRICT];
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, specify the name of the table that you want to drop after the `DROP TABLE` keywords.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Second, use the `IF EXISTS` option to remove the table only if it exists.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

If you remove a table that does not exist, PostgreSQL issues an error. To avoid the error, you can use the `IF EXISTS` option.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If the table is used in other database objects such as [views](https://www.postgresqltutorial.com/postgresql-views/), [triggers](https://www.postgresqltutorial.com/postgresql-triggers/enable-triggers/), functions, and stored procedures, you cannot remove it. In this case, you have two options:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `CASCADE` option to remove the table and its dependent objects.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use the `RESTRICT` option rejects the removal if there is any object depending on the table. The `RESTRICT` option is the default if you don't explicitly specify it in the `DROP TABLE` statement.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

To remove multiple tables simultaneously, you can place the tables separated by commas after the `DROP TABLE` keywords:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
DROP TABLE [IF EXISTS]
   table_name_1,
   table_name_2,
   ...
[CASCADE | RESTRICT];
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Note that you need to have the roles of the superuser, schema owner, or table owner to drop tables.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL DROP TABLE examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's take some examples of using the PostgreSQL `DROP TABLE` statement.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Drop a table that does not exist

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following statement removes a table named `author` in the database:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
DROP TABLE author;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

PostgreSQL issues an error because the `author` table does not exist.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
[Err] ERROR:  table "author" does not exist
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To avoid the error, you can use the `IF EXISTS` option like this.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
DROP TABLE IF EXISTS author;
```

<!-- /wp:code -->

<!-- wp:code {"language":"shell"} -->

```
NOTICE:  table "author" does not exist, skipping DROP TABLE
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output indicates that PostgreSQL issued a notice instead of an error.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 2) Drop a table that has dependent objects

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following [creates new tables](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/ "PostgreSQL CREATE TABLE") called `authors` and `pages`. The `pages` table has a foreign key that references the `authors` table.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
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

<!-- /wp:code -->

<!-- wp:paragraph -->

The following statement uses the `DROP TABLE` to drop the `authors` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
DROP TABLE IF EXISTS authors;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Because the `authors` table has a dependent object which is a foreign key that references the `pages` table, PostgreSQL issues an error message:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
ERROR:  cannot drop table authors because other objects depend on it
DETAIL:  constraint pages_author_id_fkey on table pages depends on table authors
HINT:  Use DROP ... CASCADE to drop the dependent objects too.
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this case, you need to remove all dependent objects first before dropping the `author` table or use `CASCADE` option as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
DROP TABLE authors CASCADE;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

This statement deletes the `authors` table as well as the constraint in the `pages` table.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If the `DROP TABLE` statement removes the dependent objects of the table that are being dropped, it will issue a notice like this:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
NOTICE:  drop cascades to constraint pages_author_id_fkey on table pages
DROP TABLE
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 3) Drop multiple tables

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following statements create two tables for the demo purposes:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
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

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example uses a single `DROP TABLE` statement to drop the `tvshows` and `animes` tables:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
DROP TABLE tvshows, animes;
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `DROP TABLE` statement to drop one or more tables.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use the `CASCADE` option to drop a table and all of its dependent objects.
- <!-- /wp:list-item -->

<!-- /wp:list -->
