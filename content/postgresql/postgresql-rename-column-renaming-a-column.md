---
title: 'PostgreSQL RENAME COLUMN: Renaming a column'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-rename-column/
ogImage: ./img/wp-content-uploads-2017-02-postgresql-rename-column-300x254.png
tableOfContents: true
---
<!-- wp:image {"align":"right","id":2598} -->

![PostgreSQL RENAME COLUMN](./img/wp-content-uploads-2017-02-postgresql-rename-column-300x254.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `RENAME COLUMN` clause in the `ALTER TABLE` statement to rename one or more columns of a table.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL RENAME COLUMN clause

<!-- /wp:heading -->

<!-- wp:paragraph -->

To rename a column of a table, you use the [`ALTER TABLE`](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-alter-table/) statement with `RENAME COLUMN` clause as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE table_name
RENAME COLUMN column_name TO new_column_name;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this statement:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, specify the name of the table that contains the column which you want to rename after the `ALTER TABLE` clause.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Second, provide the name of the column that you want to rename after the `RENAME COLUMN` keywords.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Third, specify the new name for the column after the `TO` keyword.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The `COLUMN` keyword in the statement is optional therefore you can omit it like this:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE table_name
RENAME column_name TO new_column_name;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

For some reason, if you try to rename a column that does not exist, PostgreSQL will issue an error. Unfortunately, PostgreSQL does not support the `IF EXISTS` option for the `RENAME` clause.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To rename multiple columns, you execute the `ALTER TABLE RENAME COLUMN` statement multiple times, one column at a time:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE table_name
RENAME column_name1 TO new_column_name1;

ALTER TABLE table_name
RENAME column_name2 TO new_column_name2;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

If you rename a column referenced by other database objects such as [views](https://www.postgresqltutorial.com/postgresql-views/), [foreign key constraints](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-foreign-key/), [triggers](https://www.postgresqltutorial.com/postgresql-triggers/), and [stored procedures](https://www.postgresqltutorial.com/postgresql-stored-procedures/), PostgreSQL will automatically change the column name in the dependent objects.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL RENAME COLUMN examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's take some examples of using the `ALTER TABLE RENAME COLUMN` statement to rename a column.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### Setting up sample tables

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, [create two new tables](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) `customers` and `customer_groups`.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE customer_groups (
  id serial PRIMARY KEY,
  name VARCHAR NOT NULL
);
CREATE TABLE customers (
  id serial PRIMARY KEY,
  name VARCHAR NOT NULL,
  phone VARCHAR NOT NULL,
  email VARCHAR,
  group_id INT,
  FOREIGN KEY (group_id) REFERENCES customer_groups (id)
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Then, [create a new view](https://www.postgresqltutorial.com/postgresql-views/managing-postgresql-views/) named `customer_data` based on the `customers` and `customer_groups` tables.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE VIEW customer_data AS
SELECT
  c.id,
  c.name,
  g.name customer_group
FROM
  customers c
  INNER JOIN customer_groups g ON g.id = c.group_id;
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 1) Renaming one column example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following statement uses the `ALTER TABLE RENAME COLUMN` statement to rename the `email` column of the `customers` table to `contact_email`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE customers
RENAME COLUMN email TO contact_email;
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Renaming a column that has dependent objects example

<!-- /wp:heading -->

<!-- wp:paragraph -->

This example uses the `ALTER TABLE RENAME COLUMN` statement to change the `name` column of the `customer_groups` table to `group_name`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE customer_groups
RENAME COLUMN name TO group_name;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Note that the name column is used in the `customer_data` view.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Now, you can check whether the change in the `name` column was cascaded to the `customer_data` view:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
\d+ customer_data
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
                       View "public.customer_data"
     Column     |       Type        | Modifiers | Storage  | Description
----------------+-------------------+-----------+----------+-------------
 id             | integer           |           | plain    |
 name           | character varying |           | extended |
 customer_group | character varying |           | extended |
View definition:
 SELECT c.id,
    c.name,
    g.group_name AS customer_group
   FROM customers c
     JOIN customer_groups g ON g.id = c.group_id;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output indicates that the `name` column has been changed to `group_name`.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 3) Using multiple RENAME COLUMN statements to rename multiple columns example

<!-- /wp:heading -->

<!-- wp:paragraph -->

These statements rename two columns `name` and `phone` of the `customers` table to `customer_name` and `contact_phone` respectively:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE customers
RENAME COLUMN name TO customer_name;

ALTER TABLE customers
RENAME COLUMN phone TO contact_phone;
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the PostgreSQL `ALTER TABLE...RENAME COLUMN` statement to rename a column.
- <!-- /wp:list-item -->

<!-- /wp:list -->
