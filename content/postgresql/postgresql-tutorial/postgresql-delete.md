---
title: 'PostgreSQL DELETE'
page_title: 'PostgreSQL DELETE Statement'
page_description: 'This tutorial shows you how to use the PostgreSQL DELETE statement to remove one or more rows of a table.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-delete/'
ogImage: ''
updatedOn: '2024-01-23T01:09:16+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL UPDATE Join'
  slug: 'postgresql-tutorial/postgresql-update-join'
nextLink:
  title: 'PostgreSQL DELETE JOIN'
  slug: 'postgresql-tutorial/postgresql-delete-join'
---

**Summary**: in this tutorial, you will learn how to use the **PostgreSQL DELETE** statement to delete data from a table.

## Introduction to PostgreSQL DELETE statement

The PostgreSQL `DELETE` statement allows you to delete one or more rows from a table.

The following shows the basic syntax of the `DELETE` statement:

```shellsql
DELETE FROM table_name
WHERE condition;
```

In this syntax:

- First, specify the name (`table_name`) of the table from which you want to delete data after the `DELETE FROM` keywords.
- Second, specify a condition in the [`WHERE`](postgresql-where) clause to determine which rows to delete.

The `WHERE` clause is optional. If you omit the `WHERE` clause, the `DELETE` statement will delete all rows in the table.

The `DELETE` statement returns the number of rows deleted. It returns zero if the `DELETE` statement did not delete any row.

To return the deleted row(s) to the client, you use the `RETURNING` clause as follows:

```sql
DELETE FROM table_name
WHERE condition
RETURNING (select_list | *)
```

The asterisk (`*`) allows you to return all columns of the deleted row(s). If you want to return the values in a specific column, you can also specify them after the `RETURNING` keyword.

For example, the following statement deletes rows from a table and returns the values of the id of the deleted rows:

```sql
DELETE FROM table_name
WHERE condition
RETURNING id;
```

If you delete data from a table based on data from another table, you can use the [DELETE JOIN](postgresql-delete-join) statement.

To delete data that have a [foreign key](postgresql-foreign-key) relationship, you use the `ON DELETE CASCADE` option.

Note that the `DELETE` statement removes data from a table but doesn’t modify the structure of the table. If you want to change the structure of a table such as removing a column, you should use the [`ALTER TABLE`](postgresql-alter-table) statement instead.

## PostgreSQL DELETE statement examples

Let’s explore some examples of using the `DELETE` statement.

### Setting up a sample table

The following statements [create a new table](postgresql-create-table) called `todos` and [insert some sample data](postgresql-insert):

```sql
CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false
);

INSERT INTO todos (title, completed) VALUES
    ('Learn basic SQL syntax', true),
    ('Practice writing SELECT queries', false),
    ('Study PostgreSQL data types', true),
    ('Create and modify tables', false),
    ('Explore advanced SQL concepts', true),
    ('Understand indexes and optimization', false),
    ('Backup and restore databases', true),
    ('Implement transactions', false),
    ('Master PostgreSQL security features', true),
    ('Build a sample application with PostgreSQL', false);

SELECT * FROM todos;
```

Output:

```text
 id |                   title                    | completed
----+--------------------------------------------+-----------
  1 | Learn basic SQL syntax                     | t
  2 | Practice writing SELECT queries            | f
  3 | Study PostgreSQL data types                | t
  4 | Create and modify tables                   | f
  5 | Explore advanced SQL concepts              | t
  6 | Understand indexes and optimization        | f
  7 | Backup and restore databases               | t
  8 | Implement transactions                     | f
  9 | Master PostgreSQL security features        | t
 10 | Build a sample application with PostgreSQL | f
(10 rows)
```

### 1\) Using PostgreSQL DELETE to delete one row from the table

The following statement uses the `DELETE` statement to delete one row with the id 1 from the `todos` table:

```sql
DELETE FROM todos
WHERE id = 1;
```

The statement returns 1 indicating that one row has been deleted:

```sql
DELETE 1
```

The following statement uses the `DELETE` statement to delete the row with id 100:

```shell
DELETE FROM todos
WHERE id = 100;
```

Since the row with the id 100 does not exist, the `DELETE` statement returns 0:

```sql
DELETE 0
```

### 2\) Using PostgreSQL DELETE to delete a row and return the deleted row

The following statement uses the `DELETE` statement to delete the row with id 2 and return the deleted row to the client:

```
DELETE FROM todos
WHERE id = 2
RETURNING *;
```

PostgreSQL returns the following deleted row:

```text
 id |              title              | completed
----+---------------------------------+-----------
  2 | Practice writing SELECT queries | f
(1 row)
```

### 3\) Using PostgreSQL DELETE to delete multiple rows from the table

The following statement uses the `DELETE` statement to delete all rows from the `todos` table with the value in the value in the completed column `true` and return deleted rows:

```
DELETE FROM todos
WHERE completed = true
RETURNING *;
```

Output:

```text
 id |                title                | completed
----+-------------------------------------+-----------
  3 | Study PostgreSQL data types         | t
  5 | Explore advanced SQL concepts       | t
  7 | Backup and restore databases        | t
  9 | Master PostgreSQL security features | t
(4 rows)


DELETE 4
```

It deleted four rows from the `todos` table.

### 4\) Using PostgreSQL DELETE to delete all rows from the table

The following statement uses the `DELETE` statement without a `WHERE` clause to delete all rows from the `todos` table:

```
DELETE FROM todos;
```

Output:

```
DELETE 4
```

The `todos` table now is empty.

## Summary

- Use the `DELETE FROM` statement to delete one or more rows from a table.
- Use the `WHERE` clause to specify which rows to be deleted.
- Use the `RETURNING` clause to return the deleted rows.
