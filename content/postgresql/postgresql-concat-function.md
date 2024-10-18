---
title: 'PostgreSQL CONCAT() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-string-functions/postgresql-concat-function/
ogImage: ./img/wp-content-uploads-2019-05-customer.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `CONCAT()` function to concatenate two or more strings into one.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL CONCAT() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

To concatenate two or more strings into a single string, you can use the string concatenation operator || as shown in the following example:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
   'John' || ' ' || 'Doe' AS full_name;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 full_name
-----------
 John Doe
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following statement uses the concatenation operator (`||`) to concatenate a string with `NULL`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
   'John' || NULL result;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

It returns `NULL`.

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 result
--------
 null
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Since version 9.1, PostgreSQL has introduced a built-in string function called `CONCAT()` to concatenate two or more strings into one.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the basic syntax of the `CONCAT()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CONCAT(string1, string2, ...)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `CONCAT` function accepts a list of input strings, which can be any string type including `CHAR`, `VARCHAR`, and `TEXT`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `CONCAT()` function returns a new string that results from concatenating the input strings.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Unlike the concatenation operator `||`, the `CONCAT` function ignores `NULL` arguments.

<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"note"} -->

To concatenate two or more strings into one using a specified separator, you can use the [CONCAT_WS()](https://www.postgresqltutorial.com/postgresql-string-functions/postgresql-concat_ws/) function.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL CONCAT() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's take some examples of using the PostgreSQL `CONCAT()` function.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic PostgreSQL CONCAT() function example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `CONCAT()` function to concatenate three literal strings into one:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  CONCAT ('John', ' ', 'Doe') full_name;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 full_name
-----------
 John Doe
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Using the CONCAT() function with table data example

<!-- /wp:heading -->

<!-- wp:paragraph -->

We'll use the `customer` table from the [sample database](https://www.postgresqltutorial.com/download/dvd-rental-sample-database/):

<!-- /wp:paragraph -->

<!-- wp:image {"id":4011,"sizeSlug":"full","linkDestination":"none"} -->

![customer table](./img/wp-content-uploads-2019-05-customer.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

The following statement uses the `CONCAT()` function to concatenate values in the `first_name`, a space, and values in the `last_name` columns of the `customer` table into a single string:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  CONCAT (first_name, ' ', last_name) AS full_name
FROM
  customer
ORDER BY
  full_name;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

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

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 3) Using the CONCAT() function with NULL

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, [create a table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) called `contacts` and [insert some rows](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert-multiple-rows/) into it:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

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

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

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

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, use the `CONCAT()` function to concatenate the values in the `name`, `email`, and `phone` columns of the `contacts` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  CONCAT(name, ' ', '(', email, ')', ' ', phone) contact
FROM
  contacts;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

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

<!-- /wp:code -->

<!-- wp:paragraph -->

The output indicates that the `CONCAT()` function ignores `NULL`.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the PostgreSQL `CONCAT()` function to concatenate two or more strings into one.
- <!-- /wp:list-item -->

<!-- /wp:list -->
