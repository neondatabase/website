---
title: 'PostgreSQL Not-Null Constraint'
redirectFrom: 
            - /docs/postgresql/postgresql-tutorial/postgresql-not-null-constraint
            - /docs/postgresql/postgresql-not-null-constraint
tableOfContents: true
---


**Summary**: in this tutorial, you will learn about PostgreSQL not-null constraints to ensure the values of a column are not null.

## Introduction to NULL

In the database world, NULL represents unknown or missing information. NULL is not the same as an empty string or the number zero.

Suppose you need to insert the email address of a contact into a table. You can request his or her email address.

However, if you don't know whether the contact has an email address or not, you can insert NULL into the email address column. In this case, NULL indicates that the email address is unknown at the recording time.

NULL is very special. It does not equal anything, even itself. The expression `NULL = NULL` returns NULL because it makes sense that two unknown values should not be equal.

To check if a value is NULL or not, you use the `IS NULL` boolean operator. For example, the following expression returns true if the value in the email address is NULL.

```
email_address IS NULL
```

The `IS NOT NULL` operator negates the result of the `IS NULL` operator.

## PostgreSQL NOT NULL constraints

To control whether a column can accept NULL, you use the `NOT NULL` constraint:

```sql
CREATE TABLE table_name(
   ...
   column_name data_type NOT NULL,
   ...
);
```

If a column has a `NOT NULL` constraint, any attempt to [insert](/docs/postgresql/postgresql-insert) or [update](/docs/postgresql/postgresql-tutorial/postgresql-update) NULL in the column will result in an error.

## Declaring NOT NULL columns

The following `CREATE TABLE` statement creates a new table name `invoices` with the not-null constraints.

```sql
CREATE TABLE invoices(
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  qty numeric NOT NULL CHECK(qty > 0),
  net_price numeric CHECK(net_price > 0)
);
```

This example uses the `NOT NULL` keywords that follow the [data type](/docs/postgresql/postgresql-data-types) of the product_id and qty columns to declare `NOT NULL` constraints.

Note that a column can have multiple constraints such as `NOT NULL`, [check](/docs/postgresql/postgresql-check-constraint), [unique](/docs/postgresql/postgresql-tutorial/postgresql-unique-constraint), [foreign key](/docs/postgresql/postgresql-tutorial/postgresql-foreign-key) appearing next to each other. The order of the constraints is not important. PostgreSQL may check constraints in any order.

If you use `NULL` instead of `NOT NULL`, the column will accept both `NULL` and non-NULL values. If you don't explicitly specify `NULL` or `NOT NULL`, it will accept `NULL` by default.

## Adding NOT NULL Constraints to existing columns

To add the `NOT NULL` constraint to a column of an existing table, you use the following form of the `ALTER TABLE` statement:

```sql
ALTER TABLE table_name
ALTER COLUMN column_name SET NOT NULL;
```

To add multiple `NOT NULL` constraints to multiple columns, you use the following syntax:

```sql
ALTER TABLE table_name
ALTER COLUMN column_name_1 SET NOT NULL,
ALTER COLUMN column_name_2 SET NOT NULL,
...;
```

Let's take a look at the following example.

First, [create a new table](/docs/postgresql/postgresql-create-table) called production orders ( `production_orders`):

```sql
CREATE TABLE production_orders (
 id SERIAL PRIMARY KEY,
 description VARCHAR (40) NOT NULL,
 material_id VARCHAR (16),
 qty NUMERIC,
 start_date DATE,
 finish_date DATE
);
```

Next, insert a new row into the `production_orders` table:

```sql
INSERT INTO production_orders (description)
VALUES('Make for Infosys inc.');
```

Then, to make sure that the `qty` field is not null, you can add the not-null constraint to the `qty` column. However, the column already contains data. If you try to add the not-null constraint, PostgreSQL will issue an error.

To add the `NOT NULL` constraint to a column that already contains NULL, you need to update `NULL` to non-NULL first, like this:

```sql
UPDATE production_orders
SET qty = 1;
```

The values in the `qty` column is updated to one. Now, you can add the `NOT NULL` constraint to the `qty` column:

```sql
ALTER TABLE production_orders
ALTER COLUMN qty
SET NOT NULL;
```

After that, you can update the not-null constraints for `material_id`, `start_date`, and `finish_date` columns:

```sql
UPDATE production_orders
SET material_id = 'ABC',
    start_date = '2015-09-01',
    finish_date = '2015-09-01';
```

Add not-null constraints to multiple columns:

```sql
ALTER TABLE production_orders
ALTER COLUMN material_id SET NOT NULL,
ALTER COLUMN start_date SET NOT NULL,
ALTER COLUMN finish_date SET NOT NULL;
```

Finally, attempt to update values in the `qty` column to NULL:

```sql
UPDATE production_orders
SET qty = NULL;
```

PostgreSQL issued an error message:

```
[Err] ERROR:  null value in column "qty" violates not-null constraint
DETAIL:  Failing row contains (1, make for infosys inc., ABC, null, 2015-09-01, 2015-09-01).
```

## The special case of NOT NULL constraint

Besides the `NOT NULL` constraint, you can use a [CHECK constraint](/docs/postgresql/postgresql-check-constraint) to force a column to accept not NULL values. The `NOT NULL` constraint is equivalent to the following `CHECK` constraint:

```sql
CHECK(column IS NOT NULL)
```

This is useful because sometimes you may want either column `a` or `b` is not null, but not both.

For example, you may want either `username` or `email` column of the user tables is not null or empty. In this case, you can use the `CHECK` constraint as follows:

```sql
CREATE TABLE users (
  id serial PRIMARY KEY,
  username VARCHAR (50),
  password VARCHAR (50),
  email VARCHAR (50),
  CONSTRAINT username_email_notnull CHECK (
    NOT (
      (
        username IS NULL
        OR username = ''
      )
      AND (
        email IS NULL
        OR email = ''
      )
    )
  )
);
```

The following statement works.

```sql
INSERT INTO users (username, email)
VALUES
 ('user1', NULL),
 (NULL, 'email1@example.com'),
 ('user2', 'email2@example.com'),
 ('user3', '');
```

However, the following statement will not work because it violates the `CHECK` constraint:

```sql
INSERT INTO users (username, email)
VALUES
 (NULL, NULL),
 (NULL, ''),
 ('', NULL),
 ('', '');
```

```
[Err] ERROR:  new row for relation "users" violates check constraint "username_email_notnull"
```

## Summary

- Use the `NOT NULL` constraint for a column to enforce a column not accept `NULL`. By default, a column can hold NULL.
-
- To check if a value is `NULL` or not, you use the `IS NULL` operator. The `IS NOT NULL` negates the result of the `IS NULL`.
-
- Never use equal operator `=` to compare a value with `NULL` because it always returns `NULL`.
