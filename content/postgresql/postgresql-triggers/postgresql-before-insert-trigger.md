---
title: 'PostgreSQL BEFORE INSERT Trigger'
page_title: 'PostgreSQL BEFORE INSERT Trigger'
page_description: 'In this tutorial, you will learn how to create a PostgreSQL BEFORE INSERT trigger associated with a table.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-triggers/postgresql-before-insert-trigger/'
ogImage: ''
updatedOn: '2024-03-28T10:24:52+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL ALTER TRIGGER Statement'
  slug: 'postgresql-triggers/postgresql-alter-trigger'
nextLink:
  title: 'PostgreSQL AFTER INSERT Trigger'
  slug: 'postgresql-triggers/postgresql-after-insert-trigger'
---

**Summary**: in this tutorial, you will learn how to create a PostgreSQL `BEFORE INSERT` trigger associated with a table.

## Introduction to PostgreSQL BEFORE INSERT trigger

A trigger is a database object that automatically calls a function when an event such as `INSERT`, `UPDATE`, and `DELETE` statement occurs on the associated table.

A `BEFORE INSERT` trigger is activated before an `INSERT` event occurs on a table. To create a `BEFORE INSERT` trigger, you follow these steps:

First, define a trigger function that will execute before the `INSERT` event occurs:

```pgsqlsql
CREATE OR REPLACE FUNCTION trigger_function()
   RETURNS TRIGGER
   LANGUAGE PLPGSQL
AS
$$
BEGIN
   -- trigger logic
   -- ...
   RETURN NEW;
END;
$$
```

At the end of the function, you need to place the `RETURN NEW` statement

Second, create a `BEFORE INSERT` trigger and associate a trigger function with it:

```pgsql
CREATE TRIGGER trigger_name
BEFORE INSERT
ON table_name
FOR EACH {ROW | STATEMENT}
EXECUTE FUNCTION trigger_function();
```

## PostgreSQL BEFORE INSERT trigger example

First, create a table called `inventory` to store inventory data:

```sql
CREATE TABLE inventory(
    product_id INT PRIMARY KEY,
    quantity INT NOT NULL DEFAULT 0
);
```

Second, create a table called `inventory_stat` that stores the total quantity of all products:

```sql
CREATE TABLE inventory_stat(
    total_qty INT
);
```

Third, define a function that increases the total quantity in the `inventory_stat` before a row is inserted into the `inventory` table:

```sql
CREATE OR REPLACE FUNCTION update_total_qty()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS
$$
DECLARE
   p_row_count INT;
BEGIN
   SELECT COUNT(*) FROM inventory_stat
   INTO p_row_count;

   IF p_row_count > 0 THEN
      UPDATE inventory_stat
      SET total_qty = total_qty + NEW.quantity;
   ELSE
      INSERT INTO inventory_stat(total_qty)
      VALUES(new.quantity);
   END IF;
   RETURN NEW;
END;
$$;
```

If the inventory_stat table has no rows, the function inserts a new row with the quantity being inserted into the inventory table. Otherwise, it updates the existing quantity.

Fourth, define a `BEFORE INSERT` trigger associated with the `inventory` table:

```
CREATE TRIGGER inventory_before_insert
BEFORE INSERT
ON inventory
FOR EACH ROW
EXECUTE FUNCTION update_total_qty();
```

Fifth, insert a row into the inventory table:

```sql
INSERT INTO inventory(product_id, quantity)
VALUES(1, 100)
RETURNING *;
```

Output:

```sql
 product_id | quantity
------------+----------
          1 |      100
(1 row)
```

Sixth, retrieve data from the `inventory_stat` table:

```
SELECT * FROM inventory_stat;
```

Output:

```sql
 total_qty
-----------
       100
(1 row)
```

Seventh, insert another row into the `inventory` table:

```sql
INSERT INTO inventory(product_id, quantity)
VALUES(2, 200)
RETURNING *;
```

Output:

```sql
 product_id | quantity
------------+----------
          2 |      200
(1 row)
```

Eighth, retrieve the data from the `inventory_stat` table:

```sql
 total_qty
-----------
       300
(1 row)
```

## Summary

- A `BEFORE INSERT` trigger is activated before an `INSERT` event occurs on a table.
