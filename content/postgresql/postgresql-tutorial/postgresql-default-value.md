---
title: 'PostgreSQL DEFAULT Value'
page_title: 'PostgreSQL DEFAULT Value'
page_description: 'In this tutorial, you will learn how to assign a default value to a column using the PostgreSQL default constraint.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-default-value/'
ogImage: ''
updatedOn: '2024-03-15T04:07:10+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL Not-Null Constraint'
  slug: 'postgresql-tutorial/postgresql-not-null-constraint'
nextLink:
  title: 'PostgreSQL Boolean Data Type with Practical Examples'
  slug: 'postgresql-tutorial/postgresql-boolean'
---

**Summary**: in this tutorial, you will learn how to assign a default value to a column using the PostgreSQL DEFAULT constraint.

## Defining the DEFAULT value for a column of a new table

When [creating a table](postgresql-create-table), you can define a default value for a column in the table using the `DEFAULT` constraint. Here’s the basic syntax:

```phpsql
CREATE TABLE table_name(
    column1 type,
    column2 type DEFAULT default_value,
    column3 type,
    ...
);
```

In this syntax, the `column2` will receive the `default_value` when you [insert a new row](postgresql-insert) into the `table_name` without specifying a value for the column.

If you don’t specify the `DEFAULT` constraint for the column, its default value is `NULL`:

```sql
CREATE TABLE table_name(
    column1 type,
    column2 type,
    column3 type,
    ...
);
```

This often makes sense because `NULL` represents unknown data.

The default value can be a literal value such as a number, a string, a JSON object, etc. Additionally, it can be an expression that will be evaluated when the default value is inserted into the table:

```sql
CREATE TABLE table_name(
    column1 type,
    column2 type DEFAULT expression,
    column3 type,
    ...
);
```

When inserting a new row into a table, you can ignore the column that has a default value. In this case, PostgreSQL will use the default value for the insertion:

```sql
INSERT INTO table_name(column1, colum3)
VALUES(value1, value2);
```

If you specify the column with a default constraint in the `INSERT` statement and want to use the default value for the insertion, you can use the `DEFAULT` keyword as follows:

```sql
INSERT INTO table_name(column1, column2, colum3)
VALUES(value1,DEFAULT,value2);
```

## Defining the DEFAULT value for a column of an existing table

If you want to specify a default value for a column of an existing table, you can use the `ALTER TABLE` statement:

```sql
ALTER TABLE table_name
ALTER COLUMN column2
SET DEFAULT default_value;
```

In this syntax:

- First, specify the table name in the `ALTER TABLE` clause (`table_name`).
- Second, provide the name of the column that you want to assign a default value in the `ALTER COLUMN` clause.
- Third, specify a default value for the column in the `SET DEFAULT` clause.

## Removing the DEFAULT value from a column

To drop a default value later, you can also use the `ALTER TABLE ... ALTER COLUMN ... DROP DEFAULT` statement:

```php
ALTER TABLE table_name
ALTER COLUMN column2
DROP DEFAULT;
```

In this syntax:

- First, specify the table name in the `ALTER TABLE` clause.
- Second, provide the name of the column that you want to remove the default value in the `ALTER COLUMN` clause.
- Third, use the `DROP DEFAULT` to remove the default value from the column.

## PostgreSQL default value examples

Let’s take some examples of using the `DEFAULT` constraint to specify a default value for a column.

### 1\) Basic PostgreSQL default value examples

First, [create a new table](postgresql-create-table) called `products` to store product data:

```php
CREATE TABLE products(
   id SERIAL PRIMARY KEY,
   name VARCHAR(255) NOT NULL,
   price DECIMAL(19,2) NOT NULL DEFAULT 0
);
```

Second, insert a row into the `products` table:

```sql
INSERT INTO products(name)
VALUES('Laptop')
RETURNING *;
```

Output:

```text
 id |  name  | price
----+--------+-------
  1 | Laptop |  0.00
(1 row)
```

In this example, we don’t specify a value for the `price` column in the `INSERT` statement; therefore, PostgreSQL uses the default value `0.00` for the `price` column.

Third, insert one more row into the `products` table:

```sql
INSERT INTO products(name, price)
VALUES
   ('Smartphone', DEFAULT)
RETURNING *;
```

Output:

```text
 id |    name    | price
----+------------+-------
  2 | Smartphone |  0.00
(1 row)
```

In this example, we use the `DEFAULT` keyword as the value for the `price` column in the `INSERT` statement, PostgreSQL uses the default value as `0.00` for the column.

Finally, insert a new row into the `products` table:

```sql
INSERT INTO products(name, price)
VALUES
   ('Tablet', 699.99)
RETURNING *;
```

Output:

```text
 id |  name  | price
----+--------+--------
  3 | Tablet | 699.99
(1 row)
```

In this example, we explicitly specify a value for the price column, and PostgreSQL uses the provided value instead of the default value for the insertion.

### 2\) Using DEFAULT constraint with TIMESTAMP columns

First, create a new table called `logs` that stores the log messages:

```sql
CREATE TABLE logs(
   id SERIAL PRIMARY KEY,
   message TEXT NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

The `created_at` column uses the current timestamp returned by the `CURRENT_TIMESTAMP` function as the default value.

Second, insert rows into the `logs` table:

```sql
INSERT INTO logs(message)
VALUES('Started the server')
RETURNING *;
```

Output:

```text
 id |      message       |         created_at
----+--------------------+----------------------------
  1 | Started the server | 2024-03-15 10:22:48.680802
(1 row)
```

In the `INSERT` statement, we don’t specify the value for the `created_at` column, PostgreSQL uses the current timestamp for the insertion.

### 3\) Using DEFAULT constraint with JSONB type

First, create a table called `settings` to store configuration data:

```sql
CREATE TABLE settings(
   id SERIAL PRIMARY KEY,
   name VARCHAR(50) NOT NULL,
   configuration JSONB DEFAULT '{}'
);
```

The `configuration` column has the [JSONB](postgresql-json) type with the default value as an empty JSON object.

Second, insert a new row into the `settings` table:

```sql
INSERT INTO settings(name)
VALUES('global')
RETURNING *;
```

Output:

```text
 id |  name  | configuration
----+--------+---------------
  1 | global | {}
(1 row)
```

Since we don’t specify a value for the `configuration` column, PostgreSQL uses the empty JSON object `{}` for the insertion.

To remove the default JSONB value from the `configuration` column of the `settings` table, you can use the following `ALTER TABLE` statement:

```
ALTER TABLE settings
ALTER COLUMN configuration
DROP DEFAULT;
```

## Summary

- Use the `DEFAULT` constraint to define a default value for a table column.
- Use the `DEFAULT` keyword to explicitly use the default value specified in the `DEFAULT` constraint in the `INSERT` statement.
