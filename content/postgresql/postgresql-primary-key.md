---
prevPost: postgresql-copy-table-a-step-by-step-guide-with-practical-examples
nextPost: postgresql-foreign-key
createdAt: 2015-08-30T09:23:06.000Z
title: 'PostgreSQL Primary Key'
redirectFrom:
  - /postgresql/postgresql-tutorial/postgresql-primary-key
tableOfContents: true
---

**Summary**: in this tutorial, you will learn about the PostgreSQL primary key and how to manage primary key constraints effectively.

## Introduction to PostgreSQL primary key

A primary key is a column or a group of columns used to uniquely identify a row in a table. The column that participates in the primary key is known as the primary key column.

A table can have zero or one primary key. It cannot have more than one primary key.

It is a good practice to add a primary key to every table. When you add a primary key to a table, PostgreSQL creates a unique B-tree index on the column or a group of columns used to define the primary key.

Technically, a primary key constraint is the combination of a [not-null constraint](/postgresql/postgresql-not-null-constraint) and [a UNIQUE constraint](/postgresql/postgresql-tutorial/postgresql-unique-constraint).

Typically, you define primary for a table when creating it:

```sql
CREATE TABLE table_name (
  column_1 data_type PRIMARY KEY,
  column_2 data_type,
  …
);
```

In this syntax, you define the primary key as the column constraint of the primary key column.

If the primary key consists of more than one column, you can define it using the table constraint:

```sql
CREATE TABLE table_name (
  column_1 data_type,
  column_2 data_type,
  column_3 data_type,
  …
  PRIMARY KEY(column_1, column2, ...)
);
```

To add a primary key to an existing table, you the `ALTER TABLE ... ADD PRIMARY KEY` statement:

```sql
ALTER TABLE table_name
ADD PRIMARY KEY (column_1, column_2, ...);
```

If you don't explicitly specify the name for the primary key constraint, PostgreSQL will assign a default name to the primary key constraint.

By default, PostgreSQL uses the format `table-name_pkey` as the default name for the primary key constraint.

To assign a name for the primary key, you can use the `CONSTRAINT` clause as follows:

```sql
CONSTRAINT constraint_name
PRIMARY KEY(column_1, column_2,...);
```

## PostgreSQL primary key examples

Let's explore some examples of using the PostgreSQL primary key.

### 1) Creating a table with a primary key that consists of one column

The following statement creates a table with a primary key that consists of one column:

```sql
CREATE TABLE orders(
  order_id SERIAL PRIMARY KEY,
  customer_id VARCHAR(255) NOT NULL,
  order_date DATE NOT NULL
);
```

In this example, we create the orders with the order_id as the primary key.

We define the order_id column with the type SERIAL so that PostgreSQL will generate a unique integer (1, 2, 3, and so on) when you insert a new row into the table without providing the value for the order_id column.

This ensures the value in the order_id is unique for every row in the table.

### 2) Creating a table with a primary key that consists of two columns

The following example shows how to define a primary key that consists of two columns `order_id` and `item_no`:

```sql
CREATE TABLE order_items(
  order_id INT,
  item_no SERIAL,
  item_description VARCHAR NOT NULL,
  quantity INTEGER NOT NULL,
  price DEC(10, 2),
  PRIMARY KEY (order_id, item_no)
);
```

### 3) Adding a primary key to an existing table

First, create a table called `products` without defining any primary key.

```sql
CREATE TABLE products (
  product_id INT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DEC(10, 2) NOT NULL
);
```

Second, add a primary key constraint to the `products` table using the `ALTER TABLE ... ADD PRIMARY KEY` statement:

```sql
ALTER TABLE products
ADD PRIMARY KEY (product_id);
```

### 4) Adding an auto-incremented primary key to an existing table

First, create a new table called `vendors` that does not have a primary key:

```sql
CREATE TABLE vendors (
  name VARCHAR(255)
);
```

Second, insert some rows into the `vendors` table:

```sql
INSERT INTO vendors (name)
VALUES
  ('Microsoft'),
  ('IBM'),
  ('Apple'),
  ('Samsung')
RETURNING *;
```

Output:

```
   name
-----------
 Microsoft
 IBM
 Apple
 Samsung
(4 rows)
```

Third, add a primary key named `vendor_id` into the `vendors` table with the type `SERIAL`:

```sql
ALTER TABLE vendors
ADD COLUMN vendor_id SERIAL PRIMARY KEY;
```

Finally, verify the vendor_id column:

```sql
SELECT
  vendor_id,
  name
FROM
  vendors;
```

Output:

```
 vendor_id |   name
-----------+-----------
         1 | Microsoft
         2 | IBM
         3 | Apple
         4 | Samsung
(4 rows)
```

## Drop a primary key

To remove a primary key from a table, you use the following `ALTER TABLE` statement:

```sql
ALTER TABLE table_name
DROP CONSTRAINT primary_key_constraint;
```

In this syntax:

- First, specify the name of the table from which you want to remove the primary key.
- Second, provide the primary key constraint to drop.

Let's take an example of removing the primary key constraint from the `vendors` table using psql.

First, display the structure of the `vendors` table using the \\d command:

```
\d vendors
```

Output:

```
                                         Table "public.vendors"
  Column   |          Type          | Collation | Nullable |                  Default
-----------+------------------------+-----------+----------+--------------------------------------------
 name      | character varying(255) |           |          |
 vendor_id | integer                |           | not null | nextval('vendors_vendor_id_seq'::regclass)
Indexes:
    "vendors_pkey" PRIMARY KEY, btree (vendor_id)
```

The output indicates that the primary key constraint is vendors_pkey.

Second, drop the primary key from the `vendors` table using the `ALTER TABLE ... DROP CONSTRAINT` statement:

```sql
ALTER TABLE vendors
DROP CONSTRAINT vendors_pkey;
```

Output:

```sql
ALTER TABLE
```

The statement removes only the primary key constraint but does not remove the vendor_id column:

```sql
SELECT vendor_id, name
FROM vendors;
```

Output:

```
 vendor_id |   name
-----------+-----------
         1 | Microsoft
         2 | IBM
         3 | Apple
         4 | Samsung
(4 rows)
```

## Summary

- Use the `PRIMARY KEY` constraint to define a primary key for a table when creating the table.
- Use the `ALTER TABLE ... ADD PRIMARY KEY` statement to add a primary key to a table.
- Use the `ALTER TABLE ... DROP CONSTRAINT` statement to drop a primary key from a table.
