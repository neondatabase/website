---
title: 'PostgreSQL RENAME COLUMN: Renaming a column'
page_title: 'PostgreSQL RENAME COLUMN'
page_description: 'You will learn how to use the PostgreSQL RENAME COLUMN clause in the ALTER TABLE statement to rename a column of a table.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-rename-column/'
ogImage: '/postgresqltutorial/postgresql-rename-column-300x254.png'
updatedOn: '2024-01-25T06:33:58+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL Change Column Type'
  slug: 'postgresql-tutorial/postgresql-change-column-type'
nextLink:
  title: 'PostgreSQL DROP TABLE'
  slug: 'postgresql-tutorial/postgresql-drop-table'
---

![PostgreSQL RENAME COLUMN](/postgresqltutorial/postgresql-rename-column-300x254.png?alignright)**Summary**: in this tutorial, you will learn how to use the PostgreSQL `RENAME COLUMN` clause in the `ALTER TABLE` statement to rename one or more columns of a table.

## Introduction to PostgreSQL RENAME COLUMN clause

To rename a column of a table, you use the [`ALTER TABLE`](postgresql-alter-table) statement with `RENAME COLUMN` clause as follows:

```shellsql
ALTER TABLE table_name
RENAME COLUMN column_name TO new_column_name;
```

In this statement:

- First, specify the name of the table that contains the column which you want to rename after the `ALTER TABLE` clause.
- Second, provide the name of the column that you want to rename after the `RENAME COLUMN` keywords.
- Third, specify the new name for the column after the `TO` keyword.

The `COLUMN` keyword in the statement is optional therefore you can omit it like this:

```sql
ALTER TABLE table_name
RENAME column_name TO new_column_name;
```

For some reason, if you try to rename a column that does not exist, PostgreSQL will issue an error. Unfortunately, PostgreSQL does not support the `IF EXISTS` option for the `RENAME` clause.

To rename multiple columns, you execute the `ALTER TABLE RENAME COLUMN` statement multiple times, one column at a time:

```sql
ALTER TABLE table_name
RENAME column_name1 TO new_column_name1;

ALTER TABLE table_name
RENAME column_name2 TO new_column_name2;
```

If you rename a column referenced by other database objects such as [views](../postgresql-views), [foreign key constraints](postgresql-foreign-key), [triggers](../postgresql-triggers), and [stored procedures](/postgresql/postgresql-stored-procedures/), PostgreSQL will automatically change the column name in the dependent objects.

## PostgreSQL RENAME COLUMN examples

Let’s take some examples of using the `ALTER TABLE RENAME COLUMN` statement to rename a column.

### Setting up sample tables

First, [create two new tables](postgresql-create-table) `customers` and `customer_groups`.

```sql
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

Then, [create a new view](../postgresql-views/managing-postgresql-views) named `customer_data` based on the `customers` and `customer_groups` tables.

```sql
CREATE VIEW customer_data AS
SELECT
  c.id,
  c.name,
  g.name customer_group
FROM
  customers c
  INNER JOIN customer_groups g ON g.id = c.group_id;
```

### 1\) Renaming one column example

The following statement uses the `ALTER TABLE RENAME COLUMN` statement to rename the `email` column of the `customers` table to `contact_email`:

```sql
ALTER TABLE customers
RENAME COLUMN email TO contact_email;
```

### 2\) Renaming a column that has dependent objects example

This example uses the `ALTER TABLE RENAME COLUMN` statement to change the `name` column of the `customer_groups` table to `group_name`:

```sql
ALTER TABLE customer_groups
RENAME COLUMN name TO group_name;
```

Note that the name column is used in the `customer_data` view.

Now, you can check whether the change in the `name` column was cascaded to the `customer_data` view:

```text
\d+ customer_data
```

Output:

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

The output indicates that the `name` column has been changed to `group_name`.

### 3\) Using multiple RENAME COLUMN statements to rename multiple columns example

These statements rename two columns `name` and `phone` of the `customers` table to `customer_name` and `contact_phone` respectively:

```
ALTER TABLE customers
RENAME COLUMN name TO customer_name;

ALTER TABLE customers
RENAME COLUMN phone TO contact_phone;
```

## Summary

- Use the PostgreSQL `ALTER TABLE...RENAME COLUMN` statement to rename a column.
