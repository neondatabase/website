---
title: PostgreSQL LENGTH() Function
page_title: PostgreSQL LENGTH() function
page_description: >-
  In this tutorial, you will learn how to use the PostgreSQL LENGTH() function
  to get the number of characters of a string.
prev_url: >-
  https://www.postgresqltutorial.com/postgresql-string-functions/postgresql-length-function/
ogImage: /postgresqltutorial/customer.png
updatedOn: '2024-01-27T09:29:04+00:00'
enableTableOfContents: true
previousLink:
  title: PostgreSQL REPEAT() Function
  slug: postgresql-string-functions/postgresql-repeat
nextLink:
  title: PostgreSQL TRIM() Function
  slug: postgresql-string-functions/postgresql-trim-function
---
<Admonition type="info" id="CTA">
The LENGTH() function works the same across any PostgreSQL deployment, so what you learn here applies whether you run Postgres yourself or use a managed service. For enterprises building in the AI era, [Lakebase](https://www.databricks.com/product/lakebase) delivers the best managed cloud Postgres with strong performance, security, and native integration into the Lakehouse. For developers and startups who need to ship and scale quickly, [Neon](https://neon.com) is the Postgres platform built around your workflow.
</Admonition>

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `LENGTH()` functions to get the number of characters of a string.

## Introduction to the PostgreSQL LENGTH() function

The PostgreSQL `LENGTH()` function returns the number of characters in a string.

Here’s the basic syntax for the `LENGTH()` function:

```sql
LENGTH(string);
```

The `LENGTH()` function accepts a string as a parameter. It can be any of the following [data types](../postgresql-tutorial/postgresql-data-types):

- character or char
- character varying or varchar
- text

The `LENGTH()` function returns an integer that represents the number of characters in the string. It returns NULL if the string is null.

PostgreSQL provides the `CHAR_LENGTH()` and `CHARACTER_LENGTH()` functions that provide the same functionality as the `LENGTH()` function.

## PostgreSQL LENGTH() function examples

Let’s explore some examples of using the `LENGTH()` function.

### 1\) Basic PostgreSQL LENGTH() function examples

The following example uses the `LENGTH()` function to get the length of a string:

```sql
SELECT
  LENGTH ('PostgreSQL Tutorial');
```

Output:

```text
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

```text
 length
--------
   null
(1 row)
```

### 2\) Using the PostgreSQL LENGTH() function with table data example

We’ll use the `customer` table from the [sample database](../postgresql-getting-started/postgresql-sample-database):

![customer table](/postgresqltutorial/customer.png)The following example uses the `LENGTH()` function to retrieve the first names and the number of characters of first names from the `customer` table:

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
