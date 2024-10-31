---
title: 'PostgreSQL BEFORE DELETE Trigger'
page_title: 'PostgreSQL BEFORE DELETE Trigger'
page_description: 'In this tutorial, you will learn how to define a PostgreSQL BEFORE DELETE trigger that is fired before a row is deleted from a table.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-triggers/postgresql-before-delete-trigger/'
ogImage: ''
updatedOn: '2024-03-28T09:57:59+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL AFTER UPDATE Trigger'
  slug: 'postgresql-triggers/postgresql-after-update-trigger'
nextLink:
  title: 'PostgreSQL AFTER DELETE Trigger'
  slug: 'postgresql-triggers/postgresql-after-delete-trigger'
---

**Summary**: in this tutorial, you will learn how to define a PostgreSQL `BEFORE DELETE` trigger that is fired before a row is deleted from a table.

## Introduction to the PostgreSQL BEFORE DELETE trigger

In PostgreSQL, a trigger is a database object that is automatically activated in response to an event including [`INSERT`](../postgresql-tutorial/postgresql-insert), [`UPDATE`](../postgresql-tutorial/postgresql-update), [`DELETE`](../postgresql-tutorial/postgresql-delete), or [`TRUNCATE`](../postgresql-tutorial/postgresql-truncate-table) occurring on a table.

A `BEFORE DELETE` trigger is activated before one or more rows are deleted from a table.

In practice, you’ll use `BEFORE DELETE` triggers for tasks such as logging deleted data, updating data in related tables, or enforcing complex business rules.

In a `BEFORE DELETE` trigger, you can access the `OLD` variable, which holds the value of the row being deleted. To access a column value of the deleted row, you can use the syntax `OLD.column_name`.

Please note that you cannot modify the column values (`OLD.column_name`) because they are read\-only.

To create a `BEFORE DELETE` trigger, follow these steps:

First, [define a trigger function](../postgresql-plpgsql/postgresql-create-function) that will execute before a `DELETE` operation:

```sql
CREATE OR REPLACE FUNCTION trigger_function_name()
RETURNS TRIGGER AS
$$
BEGIN
    -- This logic will be executed before the DELETE operation

    -- To access the values of rows being deleted:
    -- OLD.column_name

    RETURN OLD;
END;
$$
LANGUAGE plpgsql;
```

Second, create a trigger and associate the trigger function with it:

```sql
CREATE TRIGGER trigger_name
BEFORE DELETE ON table_name
FOR EACH ROW
EXECUTE FUNCTION trigger_function_name();
```

## PostgreSQL BEFORE DELETE trigger example

We’ll use a `BEFORE DELETE` trigger to prevent applications from deleting a row in a table.

First, [create a table](../postgresql-tutorial/postgresql-create-table) called `products` that stores the product data:

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    status BOOLEAN NOT NULL DEFAULT true
);
```

Next, [insert some rows](../postgresql-tutorial/postgresql-insert) into the `products` table:

```sql
INSERT INTO products (name, price, status)
VALUES
  ('A', 10.99, true),
  ('B', 20.49, false),
  ('C', 15.79, true)
RETURNING *;
```

Output:

```sql
 id | name | price | status
----+------+-------+--------
  1 | A    | 10.99 | t
  2 | B    | 20.49 | f
  3 | C    | 15.79 | t
(3 rows)
```

Then, create a `BEFORE DELETE` trigger function that [raises an exception](../postgresql-plpgsql/postgresql-exception):

```sql
CREATE OR REPLACE FUNCTION fn_before_delete_product()
RETURNS TRIGGER
AS
$$
BEGIN
    RAISE EXCEPTION 'Deletion from the products table is not allowed.';
END;
$$
LANGUAGE plpgsql;
```

After that, create a `BEFORE DELETE` trigger on the `products` table:

```sql
CREATE TRIGGER before_delete_product_trigger
BEFORE DELETE ON products
FOR EACH ROW
EXECUTE FUNCTION fn_before_delete_product();
```

Finally, delete a row from the `products` table:

```sql
DELETE FROM products
WHERE id = 1;
```

Error:

```sql
ERROR:  Deletion from the products table is not allowed.
CONTEXT:  PL/pgSQL function fn_before_delete_product() line 3 at RAISE
```

## Summary

- Use a `BEFORE DELETE` trigger to automatically call a function before a row is deleted from a table.
