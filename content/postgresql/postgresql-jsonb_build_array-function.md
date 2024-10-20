---
prevPost: postgresql-jdbc-creating-tables
nextPost: postgresql-c-creating-tables
createdAt: 2024-02-23T07:43:00.000Z
title: 'PostgreSQL jsonb_build_array() Function'
redirectFrom:
            - /postgresql/postgresql-jsonb_build_array 
            - /postgresql/postgresql-json-functions/postgresql-jsonb_build_array
ogImage: /postgresqltutorial_data/wp-content-uploads-2019-05-film.png
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `jsonb_build_array()` function to create a JSON array.

## Introduction to the PostgreSQL jsonb_build_array() function

The `jsonb_build_array()` function allows you to construct a JSONB array from a variadic list of arguments.

Here's the basic syntax of the `jsonb_build_array()` function:

```
jsonb_build_array ( VARIADIC "any" ) → jsonb
```

In this syntax, you provide a list of arguments that you want to convert to elements of a JSON array.

The `jsonb_build_array()` will convert each argument using the `to_jsonb()` function.

## PostgreSQL jsonb_build_array() function examples

Let's take some examples of using the `jsonb_build_array()` function.

### 1) Basic PostgreSQL jsonb_build_array() function example

The following example uses the `jsonb_build_array()` function to create a JSON array from a list of values:

```sql
SELECT jsonb_build_array(10, null, 'Hi', true) result;
```

Output:

```
         result
------------------------
 [10, null, "Hi", true]
(1 row)
```

### 2) Using PostgreSQL jsonb_build_array() function with table data

We'll use the `film` table from the [sample database](/postgresql/postgresql-getting-started/postgresql-sample-database):

![](/postgresqltutorial_data/wp-content-uploads-2019-05-film.png)

The following example uses the `jsonb_build_array()` function to convert the title and length of each film into elements of a JSON array:

```sql
SELECT
  jsonb_build_array(title, length)
FROM
  film
ORDER BY
  title;
```

Output:

```
          jsonb_build_array
--------------------------------------
 ["Academy Dinosaur", 86]
 ["Ace Goldfinger", 48]
 ["Adaptation Holes", 50]
 ["Affair Prejudice", 117]
...
```

## Summary

- Use the PostgreSQL `jsonb_build_array()` function to create a `JSONB` array from a variadic list of arguments.
