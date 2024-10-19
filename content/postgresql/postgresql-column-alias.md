---
prevPost: /postgresql/postgresql-drop-trigger-statement
nextPost: /postgresql/postgresql-jsonb_build_object-function
createdAt: 2020-07-11T02:45:37.000Z
title: 'PostgreSQL Column Alias'
ogImage: /postgresqltutorial_data/wp-content-uploads-2013-05-customer-table.png
tableOfContents: true
---


**Summary**: In this tutorial, you will learn about PostgreSQL column aliases and how to use them to assign temporary names to columns in a query.

## Introduction to the PostgreSQL column aliases

A column alias allows you to assign a column or an expression in the select list of a `SELECT` statement a temporary name. The column alias exists temporarily during the execution of the query.

The following illustrates the syntax of using a column alias:

```sql
SELECT column_name AS alias_name
FROM table_name;
```

In this syntax, the `column_name` is assigned an alias `alias_name`. The `AS` keyword is optional so you can omit it like this:

```sql
SELECT column_name alias_name
FROM table_name;
```

The following syntax illustrates how to set an alias for an expression in the `SELECT` clause:

```sql
SELECT expression AS alias_name
FROM table_name;
```

The main purpose of column aliases is to make the headings of the output of a query more meaningful.

### PostgreSQL column alias examples

We'll use the `customer` table from the [sample database](/postgresql/postgresql-getting-started/postgresql-sample-database) to show you how to work with column aliases.

![customer table](/postgresqltutorial_data/wp-content-uploads-2013-05-customer-table.png)

### 1) Assigning a column alias to a column example

The following query returns the first names and last names of all customers from the `customer` table:

```sql
SELECT
   first_name,
   last_name
FROM customer;
```

![PostgreSQL Column Alias](/postgresqltutorial_data/wp-content-uploads-2020-07-PostgreSQL-Column-Alias-example-1.png)

If you want to rename the `last_name` heading, you can assign it a new name using a column alias like this:

```sql
SELECT
   first_name,
   last_name AS surname
FROM customer;
```

This query assigned the `surname` as the alias of the `last_name` column:

![PostgreSQL Column Alias example](/postgresqltutorial_data/wp-content-uploads-2020-07-PostgreSQL-Column-Alias-Surname-example-1.png)

Or you can make it shorter by removing the `AS` keyword as follows:

```sql
SELECT
   first_name,
   last_name surname
FROM customer;
```

### 2) Assigning a column alias to an expression example

The following query returns the full names of all customers. It constructs the full name by concatenating the first name, space, and the last name:

```sql
SELECT
   first_name || ' ' || last_name
FROM
   customer;
```

Note that in PostgreSQL, you use the `||` as the concatenating operator that concatenates one or more strings into a single string.

![PostgreSQL Alias Example](/postgresqltutorial_data/wp-content-uploads-2020-07-PostgreSQL-Alias-Example.png)

As you can see clearly from the output, the heading of the column is not meaningful `?column?` .

To fix this, you can assign the expression `first_name || ' ' || last_name` a column alias e.g., `full_name`:

```sql
SELECT
    first_name || ' ' || last_name AS full_name
FROM
    customer;
```

![PostgreSQL Column Alias Example](/postgresqltutorial_data/wp-content-uploads-2020-07-PostgreSQL-Alias-column-alias-example.png)

### 3) Column aliases that contain spaces

If a column alias contains one or more spaces, you need to surround it with double quotes like this:

```
column_name AS "column alias"
```

For example:

```sql
SELECT
    first_name || ' ' || last_name "full name"
FROM
    customer;
```

![](/postgresqltutorial_data/wp-content-uploads-2020-07-PostgreSQL-Column-Alias-with-space.png)

## Summary

- Assign a column or an expression a column alias using the syntax `column_name AS alias_name` or `expression AS alias_name`. The `AS` keyword is optional.
-
- Use double quotes (") to surround column aliases that contain spaces.
