---
title: 'PostgreSQL Column Alias'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-column-alias/
ogImage: ./img/wp-content-uploads-2013-05-customer-table.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: In this tutorial, you will learn about PostgreSQL column aliases and how to use them to assign temporary names to columns in a query.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL column aliases

<!-- /wp:heading -->

<!-- wp:paragraph -->

A column alias allows you to assign a column or an expression in the select list of a `SELECT` statement a temporary name. The column alias exists temporarily during the execution of the query.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following illustrates the syntax of using a column alias:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT column_name AS alias_name
FROM table_name;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax, the `column_name` is assigned an alias `alias_name`. The `AS` keyword is optional so you can omit it like this:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT column_name alias_name
FROM table_name;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following syntax illustrates how to set an alias for an expression in the `SELECT` clause:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT expression AS alias_name
FROM table_name;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The main purpose of column aliases is to make the headings of the output of a query more meaningful.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### PostgreSQL column alias examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

We'll use the `customer` table from the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/) to show you how to work with column aliases.

<!-- /wp:paragraph -->

<!-- wp:image {"id":456,"sizeSlug":"large"} -->

![customer table](./img/wp-content-uploads-2013-05-customer-table.png)

<!-- /wp:image -->

<!-- wp:heading {"level":3} -->

### 1) Assigning a column alias to a column example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following query returns the first names and last names of all customers from the `customer` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
   first_name,
   last_name
FROM customer;
```

<!-- /wp:code -->

<!-- wp:image {"id":4801,"sizeSlug":"large"} -->

![PostgreSQL Column Alias](./img/wp-content-uploads-2020-07-PostgreSQL-Column-Alias-example-1.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

If you want to rename the `last_name` heading, you can assign it a new name using a column alias like this:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
   first_name,
   last_name AS surname
FROM customer;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

This query assigned the `surname` as the alias of the `last_name` column:

<!-- /wp:paragraph -->

<!-- wp:image {"id":4802,"sizeSlug":"large"} -->

![PostgreSQL Column Alias example](./img/wp-content-uploads-2020-07-PostgreSQL-Column-Alias-Surname-example-1.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

Or you can make it shorter by removing the `AS` keyword as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
   first_name,
   last_name surname
FROM customer;
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Assigning a column alias to an expression example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following query returns the full names of all customers. It constructs the full name by concatenating the first name, space, and the last name:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
   first_name || ' ' || last_name
FROM
   customer;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Note that in PostgreSQL, you use the `||` as the concatenating operator that concatenates one or more strings into a single string.

<!-- /wp:paragraph -->

<!-- wp:image {"id":4646,"width":200,"height":364,"sizeSlug":"large"} -->

![PostgreSQL Alias Example](./img/wp-content-uploads-2020-07-PostgreSQL-Alias-Example.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

As you can see clearly from the output, the heading of the column is not meaningful `?column?` .

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To fix this, you can assign the expression `first_name || ' ' || last_name` a column alias e.g., `full_name`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
    first_name || ' ' || last_name AS full_name
FROM
    customer;
```

<!-- /wp:code -->

<!-- wp:image {"id":4647,"sizeSlug":"large"} -->

![PostgreSQL Column Alias Example](./img/wp-content-uploads-2020-07-PostgreSQL-Alias-column-alias-example.png)

<!-- /wp:image -->

<!-- wp:heading {"level":3} -->

### 3) Column aliases that contain spaces

<!-- /wp:heading -->

<!-- wp:paragraph -->

If a column alias contains one or more spaces, you need to surround it with double quotes like this:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
column_name AS "column alias"
```

<!-- /wp:code -->

<!-- wp:paragraph -->

For example:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT
    first_name || ' ' || last_name "full name"
FROM
    customer;
```

<!-- /wp:code -->

<!-- wp:image {"id":4803,"sizeSlug":"large"} -->

![](./img/wp-content-uploads-2020-07-PostgreSQL-Column-Alias-with-space.png)

<!-- /wp:image -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Assign a column or an expression a column alias using the syntax `column_name AS alias_name` or `expression AS alias_name`. The `AS` keyword is optional.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use double quotes (") to surround column aliases that contain spaces.
- <!-- /wp:list-item -->

<!-- /wp:list -->
