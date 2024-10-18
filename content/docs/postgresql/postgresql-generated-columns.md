---
title: 'PostgreSQL Generated Columns'
tableOfContents: true
---

**Summary**: in this tutorial, you will learn about PostgreSQL generated columns whose values are automatically calculated from other columns.

## Introduction to PostgreSQL Generated Columns

In PostgreSQL, a generated column is a special type of column whose values are automatically calculated based on expressions or values from other columns.

A generated column is referred to as a [computed column in the SQL Server](https://www.sqlservertutorial.net/sql-server-basics/sql-server-computed-columns/) or a [virtual column in Oracle](https://www.oracletutorial.com/oracle-basics/oracle-virtual-column/).

There are two kinds of generated columns:

- Stored: A stored generated column is calculated when it is inserted or updated and occupies storage space.
- Virtual: A virtual generated column is computed when it is read and does not occupy storage space.

A virtual generated column is like a [view](https://www.postgresqltutorial.com/postgresql-views/), whereas a stored generated column is similar to a [materialized view](https://www.postgresqltutorial.com/postgresql-views/postgresql-materialized-views/). Unlike a material view, PostgreSQL automatically updates data for stored generated columns.

**PostgreSQL currently implements only stored generated columns.**

### Defining generated columns

Typically, you define a generated column when [creating a table](/docs/postgresql/postgresql-create-table)with the following syntax:

```
CREATE TABLE table_name(
   ...,
   colum_name type GENERATED ALWAYS AS (expression ) STORED | VIRTUAL,
   ...
);
```

In this syntax:

- `column_name`: Specify the name of the generated column.
- `type`: Specify the data type for the column.
- `expression`: Provide an expression that returns values for the calculated column.
- `STORED` keyword: Indicate that the data of the generated column is physically stored in the table.
- `VIRTUAL` keyword: Indicate that the data of the generated column is computed when queried, not stored physically.

To add a generated column to a table, you can use the [ALTER TABLE ... ADD COLUMN](/docs/postgresql/postgresql-add-column) statement:

```
ALTER TABLE table_name
ADD COLUMN column_name type GENERATED ALWAYS AS (expression) STORED;
```

When defining an expression for a generated column, ensure that it meets the following requirements:

- The expression can only use immutable functions and cannot involve [subqueries](/docs/postgresql/postgresql-subquery/) or reference anything beyond the current row. For example, the expression cannot use the [CURRENT_TIMESTAMP](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-current_timestamp) function.
- The expression cannot reference another generated column or a system column, except `tableoid`.

A generated column cannot have a default value or an identity definition. Additionally, it cannot be a part of the partition key.

## PostgreSQL Generated Column examples

Let's explore some examples of using generated columns.

### 1) Concatenating columns

First, create a new table called `contacts`:

```
CREATE TABLE contacts(
   id SERIAL PRIMARY KEY,
   first_name VARCHAR(50) NOT NULL,
   last_name VARCHAR(50) NOT NULL,
   full_name VARCHAR(101) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
   email VARCHAR(300) UNIQUE
);
```

Second, insert rows into the `contacts` table. The values of the `full_name` column will be automatically updated from the values in the `first_name` and `last_name` columns:

```
INSERT INTO contacts(first_name, last_name, email)
VALUES
   ('John', 'Doe', 'john.doe@postgresqltutorial.com'),
   ('Jane', 'Doe', 'jane.doe@postgresqltutorial.com')
RETURNING *;
```

Output:

```
 id | first_name | last_name | full_name |              email
----+------------+-----------+-----------+---------------------------------
  1 | John       | Doe       | John Doe  | john.doe@postgresqltutorial.com
  2 | Jane       | Doe       | Jane Doe  | jane.doe@postgresqltutorial.com
(2 rows)
```

### 2) Calculating net prices

First, create a table called `products` that stores the product information:

```
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    list_price DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(5, 2) DEFAULT 0,
    discount DECIMAL(5, 2) DEFAULT 0,
    net_price DECIMAL(10, 2) GENERATED ALWAYS AS ((list_price + (list_price * tax / 100)) - (list_price * discount / 100)) STORED
);
```

In the `products` table, the `net_price` column is a generated column whose values are calculated based on the list price, tax, and discount with the following formula:

```
list_price = list_price + (list_price * tax / 100)) - (list_price * discount / 100)
```

Second, insert rows into the `products` table:

```
INSERT INTO products (name, list_price, tax, discount)
VALUES
    ('A', 100.00, 10.00, 5.00),
    ('B', 50.00, 8.00, 0.00),
    ('C', 120.00, 12.50, 10.00)
RETURNING *;
```

Output:

```
 id | name | list_price |  tax  | discount | net_price
----+------+------------+-------+----------+-----------
  1 | A    |     100.00 | 10.00 |     5.00 |    105.00
  2 | B    |      50.00 |  8.00 |     0.00 |     54.00
  3 | C    |     120.00 | 12.50 |    10.00 |    123.00
(3 rows)
```

## Summary

- Use generated columns to automate calculations within your table.
