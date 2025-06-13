---
title: 'PostgreSQL DROP COLUMN: Remove One or More Columns of a Table'
page_title: 'PostgreSQL DROP COLUMN'
page_description: 'This tutorial shows you how to use the PostgreSQL DROP COLUMN clause in the ALTER TABLE statement to remove one or more columns of a table.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-drop-column/'
ogImage: '/postgresqltutorial/PostgreSQL-Drop-Column-300x128.png'
updatedOn: '2024-01-25T04:15:44+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL ADD COLUMN:  Add One or More Columns to a Table'
  slug: 'postgresql-tutorial/postgresql-add-column'
nextLink:
  title: 'PostgreSQL Change Column Type'
  slug: 'postgresql-tutorial/postgresql-change-column-type'
---

![PostgreSQL DROP COLUMN](/postgresqltutorial/PostgreSQL-Drop-Column-300x128.png?alignright)
**Summary**: In this tutorial, you will learn how to use the PostgreSQL `DROP COLUMN` clause in the `ALTER TABLE` statement to remove one or more columns from a table.

## Introduction to PostgreSQL DROP COLUMN clause

To drop a column of a table, you use the `DROP COLUMN` clause in the [`ALTER TABLE`](postgresql-alter-table) statement as follows:

```shellsql
ALTER TABLE table_name
DROP COLUMN column_name;
```

When you remove a column from a table, PostgreSQL will automatically remove all of the [indexes](../postgresql-indexes) and constraints that involved the dropped column.

If the column that you want to remove is used in other database objects such as [views](../postgresql-views), [triggers](../postgresql-triggers), and [stored procedures](/postgresql/postgresql-stored-procedures/), you cannot drop the column because other objects depend on it.

In this case, you can use the `CASCADE` option in the `DROP COLUMN` clause to drop the column and all of its dependent objects:

```sql
ALTER TABLE table_name
DROP COLUMN column_name CASCADE;
```

If you remove a column that does not exist, PostgreSQL will issue an error. To remove a column if it exists only, you can use the `IF EXISTS` option as follows:

```sql
ALTER TABLE table_name
DROP COLUMN IF EXISTS column_name;
```

In this syntax, if you remove a column that does not exist, PostgreSQL will issue a notice instead of an error.

If you want to drop multiple columns of a table simultaneously, you use multiple `DROP COLUMN` clauses in the `ALTER TABLE` statement like this:

```sql
ALTER TABLE table_name
DROP COLUMN column_name1,
DROP COLUMN column_name2,
...;
```

Notice that you need to add a comma (`,`) after each `DROP COLUMN` clause.

If a table has one column, you can use drop it using the `ALTER TABLE...DROP COLUMN` statement. Consequently, the table will have no columns.

It’s worth noting that while PostgreSQL allows a table that has no column, it may be not allowed according to the standard SQL.

## PostgreSQL DROP COLUMN examples

Let’s look at some examples to see how the `ALTER TABLE...DROP COLUMN` statement works.

We will create three tables: `books`, `categories`, and `publishers` for the demonstration.

![PostgreSQL DROP COLUMN Example Diagram](/postgresqltutorial/PostgreSQL-DROP-COLUMN-Example-Diagram.png)In this diagram, each book has only one publisher and each publisher can publish many books. Each book is assigned to a category and each category can have many books.

The following statements create the three tables:

```sql
CREATE TABLE publishers (
    publisher_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE books (
    book_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    isbn VARCHAR(255) NOT NULL,
    published_date DATE NOT NULL,
    description VARCHAR,
    category_id INT NOT NULL,
    publisher_id INT NOT NULL,
    FOREIGN KEY (publisher_id)
       REFERENCES publishers (publisher_id),
    FOREIGN KEY (category_id)
       REFERENCES categories (category_id)
);

```

Additionally, we [create a view](../postgresql-views/managing-postgresql-views) based on the `books` and `publishers` tables as follows:

```sql
CREATE VIEW book_info
AS SELECT
    book_id,
    title,
    isbn,
    published_date,
    name
FROM
    books b
INNER JOIN publishers
    USING(publisher_id)
ORDER BY title;
```

### 1\) Drop a column example

First, drop the `category_id` column in the `books` table using the `ALTER TABLE...DROP COLUMN` statement:

```sql
ALTER TABLE books
DROP COLUMN category_id;
```

Second, view the structure of the `books` table in psql:

```text
\d books
```

Output:

```
                                          Table "public.books"
     Column     |          Type          | Collation | Nullable |                Default
----------------+------------------------+-----------+----------+----------------------------------------
 book_id        | integer                |           | not null | nextval('books_book_id_seq'::regclass)
 title          | character varying(255) |           | not null |
 isbn           | character varying(255) |           | not null |
 published_date | date                   |           | not null |
 description    | character varying      |           |          |
 publisher_id   | integer                |           | not null |
Indexes:
    "books_pkey" PRIMARY KEY, btree (book_id)
Foreign-key constraints:
    "books_publisher_id_fkey" FOREIGN KEY (publisher_id) REFERENCES publishers(publisher_id)
```

The output indicates that the statement removes both the `category_id` column and the [foreign key constraint](postgresql-foreign-key) that involves the `category_id` column.

### 2\) Drop a column that is referenced by a constraint

First, attempt to remove the `publisher_id` column from the `books` table:

```shell
ALTER TABLE books
DROP COLUMN publisher_id;
```

PostgreSQL issued the following error:

```sql
ERROR:  cannot drop table books column publisher_id because other objects depend on it
DETAIL:  view book_info depends on table books column publisher_id
HINT:  Use DROP ... CASCADE to drop the dependent objects too.

```

The output states that the `book_info` view is using the column `publisher_id` of the `books` table. You need to use the `CASCADE` option to remove both the `publisher_id` column and `book_info` view as shown in the following statement:

```php
ALTER TABLE books
DROP COLUMN publisher_id CASCADE;
```

The statement issued the following notice indicating that the view book_info was also removed:

```sql
NOTICE:  drop cascades to view book_info
ALTER TABLE
```

### 3\) Drop multiple columns example

To remove both `isbn` and `description` columns simultaneously, you can use multiple `DROP COLUMN` clauses as follows:

```sql
ALTER TABLE books
  DROP COLUMN isbn,
  DROP COLUMN description;
```

When viewing the books table, you’ll see that those columns were removed:

```
\d books
```

Output:

```
                                          Table "public.books"
     Column     |          Type          | Collation | Nullable |                Default
----------------+------------------------+-----------+----------+----------------------------------------
 book_id        | integer                |           | not null | nextval('books_book_id_seq'::regclass)
 title          | character varying(255) |           | not null |
 published_date | date                   |           | not null |
Indexes:
    "books_pkey" PRIMARY KEY, btree (book_id)
```

## Summary

- Use the PostgreSQL `ALTER TABLE ... DROP COLUMN` statement to drop one or more columns from a table.
