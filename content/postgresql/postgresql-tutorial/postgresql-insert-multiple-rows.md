---
title: 'PostgreSQL INSERT Multiple Rows'
page_title: 'PostgreSQL INSERT - Inserting Multiple Rows into a Table'
page_description: 'In this tutorial, you will learn how to use a single PostgreSQL INSERT statement to insert multiple rows into a table.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert-multiple-rows/'
ogImage: ''
updatedOn: '2024-01-22T13:22:27+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL INSERT'
  slug: 'postgresql-tutorial/postgresql-insert'
nextLink:
  title: 'PostgreSQL UPDATE'
  slug: 'postgresql-tutorial/postgresql-update'
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `INSERT` statement to insert multiple rows into a table.

## Inserting multiple rows into a table

To insert multiple rows into a table using a single [`INSERT`](postgresql-insert) statement, you use the following syntax:

```shellsql
INSERT INTO table_name (column_list)
VALUES
    (value_list_1),
    (value_list_2),
    ...
    (value_list_n);
```

In this syntax:

- First, specify the name of the table that you want to insert data after the `INSERT INTO` keywords.
- Second, list the required columns or all columns of the table in parentheses that follow the table name.
- Third, supply a comma\-separated list of rows after the `VALUES` keyword.

To insert multiple rows and return the inserted rows, you add the `RETURNING` clause as follows:

```sql
INSERT INTO table_name (column_list)
VALUES
    (value_list_1),
    (value_list_2),
    ...
    (value_list_n)
RETURNING * | output_expression;
```

Inserting multiple rows at once has advantages over inserting one row at a time:

- **Performance:** Inserting multiple rows in a single statement is often more efficient than multiple individual inserts because it reduces the number of round\-trips between the application and the PostgreSQL server.
- **Atomicity:** The entire `INSERT` statement is atomic, meaning that either all rows are inserted, or none are. This ensures data consistency.

## Inserting multiple rows into a table examples

Let’s take some examples of inserting multiple rows into a table.

### Setting up a sample table

The following statement [creates a new table](postgresql-create-table) called `contacts` that has four columns `id`, `first_name`, `last_name`, and `email`:

```sql
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(384) NOT NULL UNIQUE
);
```

### 1\) Basic inserting multiple rows example

The following statement uses the `INSERT` statement to insert three rows into the `links` table:

```sql
INSERT INTO contacts (first_name, last_name, email)
VALUES
    ('John', 'Doe', '[[email protected]](../cdn-cgi/l/email-protection.html)'),
    ('Jane', 'Smith', '[[email protected]](../cdn-cgi/l/email-protection.html)'),
    ('Bob', 'Johnson', '[[email protected]](../cdn-cgi/l/email-protection.html)');
```

PostgreSQL returns the following message:

```sql
INSERT 0 3
```

To verify the inserts, you use the following statement:

```
SELECT * FROM contacts;
```

Output:

```text
 id | first_name | last_name |          email
----+------------+-----------+-------------------------
  1 | John       | Doe       | [[email protected]](../cdn-cgi/l/email-protection.html)
  2 | Jane       | Smith     | [[email protected]](../cdn-cgi/l/email-protection.html)
  3 | Bob        | Johnson   | [[email protected]](../cdn-cgi/l/email-protection.html)
(3 rows)

```

### 2\) Inserting multiple rows and returning inserted rows

The following statement uses the `INSERT` statement to insert two rows into the `contacts` table and returns the inserted rows:

```
INSERT INTO contacts (first_name, last_name, email)
VALUES
    ('Alice', 'Johnson', '[[email protected]](../cdn-cgi/l/email-protection.html)'),
    ('Charlie', 'Brown', '[[email protected]](../cdn-cgi/l/email-protection.html)')
RETURNING *;
```

Output:

```text
 id | first_name | last_name |           email
----+------------+-----------+---------------------------
  4 | Alice      | Johnson   | [[email protected]](../cdn-cgi/l/email-protection.html)
  5 | Charlie    | Brown     | [[email protected]](../cdn-cgi/l/email-protection.html)
(2 rows)


INSERT 0 2
```

If you just want to return the inserted id list, you can specify the `id` column in the `RETURNING` clause like this:

```
INSERT INTO contacts (first_name, last_name, email)
VALUES
    ('Eva', 'Williams', '[[email protected]](../cdn-cgi/l/email-protection.html)'),
    ('Michael', 'Miller', '[[email protected]](../cdn-cgi/l/email-protection.html)'),
    ('Sophie', 'Davis', '[[email protected]](../cdn-cgi/l/email-protection.html)')
RETURNING id;
```

Output:

```
 id
----
  6
  7
  8
(3 rows)


INSERT 0 3
```

## Summary

- Specify multiple value lists in the `INSERT` statement to insert multiple rows into a table.
- Use `RETURNING` clause to return the inserted rows.
