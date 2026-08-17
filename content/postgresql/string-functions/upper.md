---
title: PostgreSQL UPPER() Function
page_title: PostgreSQL UPPER() Function
page_description: >-
  In this tutorial, you will learn how to use the PostgreSQL UPPER() function to
  convert the string to all uppercase.
prev_url: >-
  https://www.postgresqltutorial.com/postgresql-string-functions/postgresql-upper/
ogImage: /postgresqltutorial/customer.png
updatedOn: '2026-06-03T13:01:21.685Z'
enableTableOfContents: true
previousLink:
  title: PostgreSQL LOWER() Function
  slug: postgresql-string-functions/postgresql-lower
nextLink:
  title: PostgreSQL RTRIM() Function
  slug: postgresql-string-functions/postgresql-rtrim
---

<Admonition type="info" id="CTA">
The UPPER() function works the same way across any PostgreSQL deployment. [Lakebase Postgres](https://www.databricks.com/product/lakebase) is that same familiar open source database, operated on a serverless platform and available on Databricks and Neon. [Neon](https://neon.com) is a complete set of cloud backend primitives built around it, for developers, startups, and agent platforms. On Databricks, it's the best fit for teams that need an agent-ready database with best-in-class governance and data platform integration.
</Admonition>

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `UPPER()` function to convert a string to uppercase.

## Introduction to the PostgreSQL UPPER() function

The `UPPER()` function converts a string to uppercase based on the rules of the database’s locale.

Here’s the syntax of the `UPPER()` function:

```sql
UPPER(text)
```

In this syntax, `text` is the input string that you want to convert to uppercase. Its type can be `CHAR`, [`VARCHAR`](../postgresql-tutorial/postgresql-char-varchar-text), or `TEXT`.

The `UPPER()` function returns a new string with all letters converted to uppercase.

The `UPPER()` function returns `NULL` if the `text` is `NULL`.

Note that to convert a string to lowercase, you use the [LOWER()](postgresql-lower) function.

## PostgreSQL UPPER() function examples

Let’s take some examples of using the `UPPER()` function.

### 1\) Basic PostgreSQL UPPER() function example

The following example uses the `UPPER()` function to convert the string `PostgreSQL` to uppercase:

```sql
SELECT UPPER('PostgreSQL');
```

Output:

```text
   upper
------------
 POSTGRESQL
(1 row)
```

### 2\) Using PostgreSQL UPPER() function with table data

We’ll use the `customer` table from the [sample database](../postgresql-getting-started/postgresql-sample-database):

![PostgreSQL UPPER() Function - Sample Table ](/postgresqltutorial/customer.png)The following example uses the `UPPER()` function to convert the first names of customers to uppercase:

```sql
SELECT
  UPPER(first_name)
FROM
  customer
ORDER BY
  first_name;
```

Output:

```text
    upper
-------------
 AARON
 ADAM
 ADRIAN
 AGNES
 ALAN
...
```

### 3\) Using PostgreSQL UPPER() function in the WHERE clause

The following example uses the `UPPER()` function in the [`WHERE`](../postgresql-tutorial/postgresql-where) clause to find customers by last names, comparing them with the input string in uppercase:

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

```text
 first_name | last_name
------------+-----------
 Carole     | Barnett
(1 row)
```

## Summary

- Use the `UPPER()` function to return a new string with all the characters of the input string converted to uppercase.
