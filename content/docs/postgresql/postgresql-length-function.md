---
title: 'PostgreSQL LENGTH() Function'
redirectFrom:
            - /docs/postgresql/postgresql-length 
            - /docs/postgresql/postgresql-string-functions/postgresql-length-function
ogImage: /postgresqltutorial_data/wp-content-uploads-2019-05-customer.png
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `LENGTH()` functions to get the number of characters of a string.

## Introduction to the PostgreSQL LENGTH() function

The PostgreSQL `LENGTH()` function returns the number of characters in a string.

Here's the basic syntax for the `LENGTH()` function:

```sql
LENGTH(string);
```

The `LENGTH()` function accepts a string as a parameter. It can be any of the following [data types](/docs/postgresql/postgresql-data-types):

- character or char
- character varying or varchar
- text

The `LENGTH()` function returns an integer that represents the number of characters in the string. It returns NULL if the string is null.

PostgreSQL provides the `CHAR_LENGTH()` and `CHARACTER_LENGTH()` functions that provide the same functionality as the `LENGTH()` function.

## PostgreSQL LENGTH() function examples

Let's explore some examples of using the `LENGTH()` function.

### 1) Basic PostgreSQL LENGTH() function examples

The following example uses the `LENGTH()` function to get the length of a string:

```sql
SELECT
  LENGTH ('PostgreSQL Tutorial');
```

Output:

```
 length
--------
     19
(1 row)
```

If you pass NULL to the `LENGTH()` function, it returns NULL.

```sql
SELECT
  LENGTH (NULL);
```

Output:

```
 length
--------
   null
(1 row)
```

### 2) Using the PostgreSQL LENGTH() function with table data example

We'll use the `customer` table from the [sample database](/docs/postgresql/postgresql-getting-started/postgresql-sample-database):

![customer table](/postgresqltutorial_data/wp-content-uploads-2019-05-customer.png)

The following example uses the `LENGTH()` function to retrieve the first names and the number of characters of first names from the `customer` table:

```sql
SELECT
  first_name,
  LENGTH (first_name) len
FROM
  customer
ORDER BY
  len;
```

Output:

```
 first_name  | len
-------------+-----
 Jo          |   2
 Sam         |   3
 Roy         |   3
 Eva         |   3
 Don         |   3
 Dan         |   3
...
```

## Summary

- Use the PostgreSQL `LENGTH()` function to get the number of characters of a string.
