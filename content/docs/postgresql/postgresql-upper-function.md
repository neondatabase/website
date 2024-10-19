---
title: 'PostgreSQL UPPER() Function'
redirectFrom:
            - /docs/postgresql/postgresql-upper 
            - /docs/postgresql/postgresql-string-functions/postgresql-upper
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `UPPER()` function to convert a string to uppercase.

## Introduction to the PostgreSQL UPPER() function

The `UPPER()` function converts a string to uppercase based on the rules of the database's locale.

Here's the syntax of the `UPPER()` function:

```sql
UPPER(text)
```

In this syntax, `text` is the input string that you want to convert to uppercase. Its type can be `CHAR`, `VARCHAR`, or `TEXT`.

The `UPPER()` function returns a new string with all letters converted to uppercase.

The `UPPER()` function returns `NULL` if the `text` is `NULL`.

Note that to convert a string to lowercase, you use the [LOWER()](/docs/postgresql/postgresql-string-functions/postgresql-lower) function.

## PostgreSQL UPPER() function examples

Let's take some examples of using the `UPPER()` function.

### 1) Basic PostgreSQL UPPER() function example

The following example uses the `UPPER()` function to convert the string `PostgreSQL` to uppercase:

```sql
SELECT UPPER('PostgreSQL');
```

Output:

```
   upper
------------
 POSTGRESQL
(1 row)
```

### 2) Using PostgreSQL UPPER() function with table data

We'll use the `customer` table from the [sample database](/docs/postgresql/postgresql-getting-started/postgresql-sample-database):

![PostgreSQL UPPER() Function - Sample Table ](/postgresqltutorial_data/customer.png)

The following example uses the `UPPER()` function to convert the first names of customers to uppercase:

```sql
SELECT
  UPPER(first_name)
FROM
  customer
ORDER BY
  first_name;
```

Output:

```
    upper
-------------
 AARON
 ADAM
 ADRIAN
 AGNES
 ALAN
...
```

### 3) Using PostgreSQL UPPER() function in the WHERE clause

The following example uses the `UPPER()` function in the `WHERE` clause to find customers by last names, comparing them with the input string in uppercase:

```sql
SELECT
  first_name,
  last_name
FROM
  customer
WHERE
  UPPER(last_name) = 'BARNETT';
```

Output:

```
 first_name | last_name
------------+-----------
 Carole     | Barnett
(1 row)
```

## Summary

- Use the `UPPER()` function to return a new string with all the characters of the input string converted to uppercase.
