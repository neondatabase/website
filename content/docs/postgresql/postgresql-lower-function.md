---
title: 'PostgreSQL LOWER() Function'
redirectFrom:
            - /docs/postgresql/postgresql-lower 
            - /docs/postgresql/postgresql-string-functions/postgresql-lower/
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `LOWER()` function to convert the string to all lowercase.

## Introduction to the PostgreSQL LOWER() function

The `LOWER()` function converts a string to lowercase based on the rules of the database's locale.

Here's the syntax of the `LOWER()` function:

```
LOWER(text)
```

In this syntax, text is the input string that you want to convert. Its type can be `CHAR`, `VARCHAR`, or `TEXT`.

The `LOWER()` function returns a new string with all letters converted to lowercase.

If the text is `NULL`, the `LOWER()` function returns `NULL`.

## PostgreSQL LOWER() function examples

Let's explore some examples of using the `LOWER()` function.

### 1) Basic PostgreSQL LOWER() function example

The following example uses the `LOWER()` function to convert the string PostgreSQL to lowercase:

```
SELECT LOWER('PostgreSQL');
```

Output:

```
   lower
------------
 postgresql
(1 row)
```

### 2) Using PostgreSQL LOWER() function with table data

We'll use the `customer` table from the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/):

![PostgreSQL LOWER() Function - Sample Table ](https://www.postgresqltutorial.com/wp-content/uploads/2019/05/customer.png)

The following example uses the `LOWER()` function to convert the first names of customers to lowercase:

```
SELECT
  LOWER(first_name)
FROM
  customer
ORDER BY
  first_name;
```

Output:

```
    lower
-------------
 aaron
 adam
 adrian
 agnes
 alan
...
```

### 3) Using PostgreSQL LOWER() function in the WHERE clause

The following example uses the `LOWER()` function in the `WHERE` clause to find customers by last names, comparing them with the input string in lowercase:

```
SELECT
  first_name,
  last_name
FROM
  customer
WHERE
  LOWER(last_name) = 'barnett';
```

Output:

```
 first_name | last_name
------------+-----------
 Carole     | Barnett
(1 row)
```

## Summary

- Use the `LOWER()` function to return a new string with all the characters of the input string converted to lowercase.
