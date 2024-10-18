---
title: 'PostgreSQL TRUNCATE TABLE'
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use PostgreSQL `TRUNCATE TABLE` statement to quickly delete all data from large tables.

## Introduction to PostgreSQL TRUNCATE TABLE statement

To remove all data from a table, you use the `DELETE` statement without a [WHERE](/docs/postgresql/postgresql-where) clause. However, when the table has numerous data, the `DELETE` statement is not efficient. In this case, you can use the `TRUNCATE TABLE` statement.

The `TRUNCATE TABLE` statement deletes all data from a table very fast. Here's the basic syntax of the `TRUNCATE TABLE` statement:

```
TRUNCATE TABLE table_name;
```

In this syntax, you specify the name of the table that you want to delete data after the TRUNCATE TABLE keywords.

### Remove all data from multiple tables

To remove all data from multiple tables at once, you separate the tables by commas (,) as follows:

```
TRUNCATE TABLE
    table_name1,
    table_name2,
    ...;
```

In this syntax, you specify the name of the tables that you want to delete all data after the `TRUNCATE TABLE` keywords.

### Remove all data from a table that has foreign key references

In practice, the table you want to delete all data often has [foreign key](/docs/postgresql/postgresql-foreign-key) references from other tables.

By default, the `TRUNCATE TABLE` statement does not remove any data from the table that has foreign key references.

To remove data from a table and other tables that have foreign key references the table, you use `CASCADE` option in the `TRUNCATE TABLE` statement as follows :

```
TRUNCATE TABLE table_name
CASCADE;
```

## PostgreSQL TRUNCATE TABLE statement examples

Let's explore some examples of using the `TRUNCATE TABLE` statement.

### 1) Basic PostgreSQL TRUNCATE TABLE statement example

First, create a new table called `products`:

```
CREATE TABLE products(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0
);
```

Second, insert some rows into the `products` table:

```
INSERT INTO products (name, price)
VALUES
    ('A', 19.99),
    ('B', 29.99),
    ('C', 39.99),
    ('D', 49.99)
RETURNING *;
```

Output:

```
 id | name | price
----+------+-------
  1 | A    | 19.99
  2 | B    | 29.99
  3 | C    | 39.99
  4 | D    | 49.99
(4 rows)
```

Third, delete all data from the `products` table using the `TRUNCATE TABLE` statement:

```
TRUNCATE TABLE products;
```

Output:

```
TRUNCATE TABLE
```

### 2) Using PostgreSQL TRUNCATE TABLE statement to delete all data from multiple tables

First, create a table called `customers` and insert data into it:

```
CREATE TABLE customers(
   id SERIAL PRIMARY KEY,
   name VARCHAR(255) NOT NULL,
   phone VARCHAR(25) NOT NULL
);

INSERT INTO customers (name, phone) VALUES
    ('John Doe', '123-456-7890'),
    ('Jane Smith', '987-654-3210'),
    ('Robert Johnson', '555-123-4567')

RETURNING *;
```

Second, create a table called `vendors` and insert data into it:

```
CREATE TABLE vendors(
   id SERIAL PRIMARY KEY,
   name VARCHAR(255) NOT NULL,
   phone VARCHAR(25) NOT NULL
);

INSERT INTO vendors (name, phone) VALUES
    ('ABC Electronics', '555-123-4567'),
    ('XYZ Supplies', '999-888-7777'),
    ('Tech Solutions Inc.', '111-222-3333')

RETURNING *;
```

Third, delete data from the customers and vendors tables using the TRUNCATE TABLE statement:

```
TRUNCATE TABLE customers, vendors;
```

### 3) Using PostgreSQL TRUNCATE TABLE statement to delete data from a table referenced by a foreign key

First, create tables `orders` and `order_details`:

```
CREATE TABLE orders(
  order_id SERIAL PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  ordered_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL
);

CREATE TABLE order_items (
  order_id INT NOT NULL,
  item_id INT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  FOREIGN KEY (order_id)
     REFERENCES orders(order_id) ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY (order_id, item_id)
);

INSERT INTO orders (customer_name, ordered_date, status)
VALUES
  ('John Doe', '2024-01-25', 'Processing'),
  ('Jane Smith', '2024-01-26', 'Shipped'),
  ('Bob Johnson', '2024-01-27', 'Delivered');

INSERT INTO order_items (order_id, item_id, product_name, quantity)
VALUES
  (1, 1, 'A', 2),
  (1, 2, 'B', 1),
  (2, 1, 'C', 3),
  (3, 1, 'D', 5),
  (3, 2, 'E', 2);
```

Second, attempt to truncate data from the `orders` table:

```
TRUNCATE TABLE orders;
```

PostgreSQL issues the following error:

```
DETAIL:  Table "order_items" references "orders".
HINT:  Truncate table "order_items" at the same time, or use TRUNCATE ... CASCADE.
```

The reason is that the `orders` table is referenced by the `order_items` table. To truncate both the `orders` and `order_items` tables at the same time, you can use the `CASCADE` option.

Third, truncate data from both `orders` and `order_items` tables:

```
TRUNCATE TABLE orders CASCADE;
```

PostgreSQL issues the following notice indicating that the `order_items` is also truncated:

```
NOTICE:  truncate cascades to table "order_items"
TRUNCATE TABLE
```

Note that the `TRUNCATE TABLE` statement uses the `RESTRICT` option by default to prevent a table that is referenced by a foreign key from being truncated.

## Restarting sequence

Besides removing data, you may want to reset the values of the [identity column](/docs/postgresql/postgresql-identity-column) by using the `RESTART IDENTITY` option like this:

```
TRUNCATE TABLE table_name
RESTART IDENTITY;
```

For example, the following statement removes all rows from the `products` table and resets the [sequence](/docs/postgresql/postgresql-sequences) associated with the `id` column:

```
TRUNCATE TABLE products
RESTART IDENTITY;
```

By default, the `TRUNCATE TABLE` statement uses the `CONTINUE IDENTITY` option. This option does not restart the value in the sequence associated with the column in the table.

## TRUNCATE TABLE statement and ON DELETE trigger

Even though the `TRUNCATE TABLE` statement removes all data from a table, it does not fire any `ON DELETE` [triggers](https://www.postgresqltutorial.com/postgresql-triggers/) associated with the table.

To fire the trigger when the `TRUNCATE TABLE` statement executes, you need to define `BEFORE TRUNCATE` and/or `AFTER TRUNCATE` triggers for that table.

## TRUNCATE TABLE statement and transactions

The `TRUNCATE TABLE` is transaction-safe, meaning that you can place it within a transaction.

## Why TRUNCATE TABLE statement is more efficient than the DELETE statement

The `TRUNCATE TABLE` statement is more efficient than the `DELETE` statement due to the following main reasons:

- **Minimal logging**: The `TRUNCATE TABLE` statement doesn't generate individual row deletion logs. Instead, it deallocates entire data pages making it faster than the `DELETE` statement.
- **Fewer resources**: The truncate operation is more lightweight than the delete option because it doesn't generate as much undo and redo information. It releases storage space without scanning individual rows.
- **Lower-level locking mechanism**: The truncate operation often requires lower-level locks and is less prone to conflicts with other transactions, which improves overall system concurrency.

## Summary

- Use the `TRUNCATE TABLE` statement to delete all data from a large table very fast.
- Use the `CASCADE` option to truncate a table that is referenced by foreign key constraints.
- The `TRUNCATE TABLE` deletes data but does not fire `ON DELETE` triggers. Instead, it fires the `BEFORE TRUNCATE` and `AFTER TRUNCATE` triggers.
- The `TRUNCATE TABLE` statement is transaction-safe.
