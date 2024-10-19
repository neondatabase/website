---
title: 'PostgreSQL CONCAT() Function'
redirectFrom:
            - /docs/postgresql/postgresql-concat 
            - /docs/postgresql/postgresql-string-functions/postgresql-concat-function
ogImage: /postgresqltutorial_data/wp-content-uploads-2019-05-customer.png
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `CONCAT()` function to concatenate two or more strings into one.

## Introduction to PostgreSQL CONCAT() function

To concatenate two or more strings into a single string, you can use the string concatenation operator || as shown in the following example:

```
SELECT
   'John' || ' ' || 'Doe' AS full_name;
```

Output:

```
 full_name
-----------
 John Doe
(1 row)
```

The following statement uses the concatenation operator (`||`) to concatenate a string with `NULL`:

```
SELECT
   'John' || NULL result;
```

It returns `NULL`.

```
 result
--------
 null
(1 row)
```

Since version 9.1, PostgreSQL has introduced a built-in string function called `CONCAT()` to concatenate two or more strings into one.

Here's the basic syntax of the `CONCAT()` function:

```
CONCAT(string1, string2, ...)
```

The `CONCAT` function accepts a list of input strings, which can be any string type including `CHAR`, `VARCHAR`, and `TEXT`.

The `CONCAT()` function returns a new string that results from concatenating the input strings.

Unlike the concatenation operator `||`, the `CONCAT` function ignores `NULL` arguments.

To concatenate two or more strings into one using a specified separator, you can use the [CONCAT_WS()](/docs/postgresql/postgresql-string-functions/postgresql-concat_ws) function.

## PostgreSQL CONCAT() function examples

Let's take some examples of using the PostgreSQL `CONCAT()` function.

### 1) Basic PostgreSQL CONCAT() function example

The following example uses the `CONCAT()` function to concatenate three literal strings into one:

```
SELECT
  CONCAT ('John', ' ', 'Doe') full_name;
```

Output:

```
 full_name
-----------
 John Doe
(1 row)
```

### 2) Using the CONCAT() function with table data example

We'll use the `customer` table from the [sample database](/postgresqltutorial_data/dvdrental.zip):

![customer table](/postgresqltutorial_data/wp-content-uploads-2019-05-customer.png)

The following statement uses the `CONCAT()` function to concatenate values in the `first_name`, a space, and values in the `last_name` columns of the `customer` table into a single string:

```
SELECT
  CONCAT (first_name, ' ', last_name) AS full_name
FROM
  customer
ORDER BY
  full_name;
```

Output:

```
       full_name
-----------------------
 Aaron Selby
 Adam Gooch
 Adrian Clary
 Agnes Bishop
 Alan Kahn
...
```

### 3) Using the CONCAT() function with NULL

First, [create a table](/docs/postgresql/postgresql-create-table) called `contacts` and [insert some rows](/docs/postgresql/postgresql-tutorial/postgresql-insert-multiple-rows) into it:

```
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(15)
);

INSERT INTO contacts (name, email, phone)
VALUES
    ('John Doe', 'john@gmail.com', '123-456-7890'),
    ('Jane Smith', 'jane@example.com', NULL),
    ('Bob Johnson', 'bob@example.com', '555-1234'),
    ('Alice Brown', 'alice@example.com', NULL),
    ('Charlie Davis', 'charlie@example.com', '987-654-3210')
RETURNING *;
```

Output:

```
 id |     name      |        email        |    phone
----+---------------+---------------------+--------------
  1 | John Doe      | john@gmail.com      | 123-456-7890
  2 | Jane Smith    | jane@example.com    | null
  3 | Bob Johnson   | bob@example.com     | 555-1234
  4 | Alice Brown   | alice@example.com   | null
  5 | Charlie Davis | charlie@example.com | 987-654-3210
(5 rows)


INSERT 0 5
```

Second, use the `CONCAT()` function to concatenate the values in the `name`, `email`, and `phone` columns of the `contacts` table:

```
SELECT
  CONCAT(name, ' ', '(', email, ')', ' ', phone) contact
FROM
  contacts;
```

Output:

```
                     contact
--------------------------------------------------
 John Doe (john@gmail.com) 123-456-7890
 Jane Smith (jane@example.com)
 Bob Johnson (bob@example.com) 555-1234
 Alice Brown (alice@example.com)
 Charlie Davis (charlie@example.com) 987-654-3210
(5 rows)
```

The output indicates that the `CONCAT()` function ignores `NULL`.

## Summary

- Use the PostgreSQL `CONCAT()` function to concatenate two or more strings into one.
