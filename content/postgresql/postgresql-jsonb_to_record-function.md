---
title: 'PostgreSQL jsonb_to_record() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-jsonb_to_record/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `jsonb_to_record()` function to convert a JSON object into a PostgreSQL record type.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL JSONB jsonb_to_record() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `jsonb_to_record()` function allows you to convert a [JSON](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-json/) object into a PostgreSQL record type.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the basic syntax of the `jsonb_to_record()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
jsonb_to_record(json_object)
  as record_type (column1 type, column2 type,...)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, specify a JSON object (`json_object`) of type JSONB that you want to convert into a record type.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Second, define the `record_type` with a list of columns that have the same names as the keys in the JSON object. The record may have fewer columns than the number of keys in the JSON object. If the names of the columns of the `record_type` are not the same as the names of the keys in the JSON object, they will be ignored.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The function `jsonb_to_record()` returns a record type representing the structure of a JSON object.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If the `json_object` is null, the `jsonb_to_record()` function returns null.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL jsonb_to_record() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's take some examples of using the `jsonb_to_record()` function.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic PostgreSQL jsonb_to_record() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `jsonb_to_record()` function to convert a JSON object into a record:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  *
FROM
  jsonb_to_record(
    '{"id": 1, "name": "Alice", "age": 30}'
  ) AS person (id INT, name TEXT, age INT);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 id | name  | age
----+-------+-----
  1 | Alice |  30
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example converts a JSON object into a record type but with fewer keys:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  *
FROM
  jsonb_to_record(
    '{"id": 1, "name": "Alice", "age": 30}'
  ) AS person (id INT, name TEXT);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 id | name
----+-------
  1 | Alice
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Using jsonb_to_record() function with user-defined type

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, create a new custom type called `pet` with two fields `type` and `name`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TYPE pet AS (type VARCHAR, name VARCHAR);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, use the pet type with the `jsonb_to_record()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  *
FROM
  jsonb_to_record(
    '{"id": 1, "name": "Alice", "age": 30, "pets": [{"type":"cat", "name": "Ellie"}, {"type":"dog", "name": "Birdie"}]}'
  ) AS person (id INT, name TEXT, pets pet[]);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 id | name  |              pets
----+-------+--------------------------------
  1 | Alice | {"(cat,Ellie)","(dog,Birdie)"}
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `jsonb_to_record()` function to convert a JSON object into a PostgreSQL record type.
- <!-- /wp:list-item -->

<!-- /wp:list -->
