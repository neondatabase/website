---
title: 'PostgreSQL jsonb_object_keys() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-jsonb_object_keys/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `jsonb_object_keys()` function to extract the keys from a JSON object.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL jsonb_object_keys() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `jsonb_object_keys()` function allows you to extract the keys of a [JSON](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-json/) object into a set of text values.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the basic syntax of the `jsonb_object_keys()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
jsonb_object_keys(json_object)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `json_object` is the JSON object of type JSONB that you want to extract the keys.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The `jsonb_object_keys()` function returns a set of text values representing the keys in the `json_object`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If the `json_object` is not a JSON object, the `jsonb_object_keys()` function will issue an error.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If the `json_object` is `NULL`, the function will return an empty set.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL jsonb_object_keys() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's take some examples of using the `jsonb_object_keys()` function.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic the jsonb_object_keys() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `jsonb_object_keys()` function to extract the keys of a JSON object as a set of text values:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  jsonb_object_keys(
    '{"name": "Joe", "age": 18, "city": "New York"}'
  );
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 jsonb_object_keys
-------------------
 age
 city
 name
(3 rows)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Using the PostgreSQL jsonb_object_keys() function with table data

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, [create a table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) called `person`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE person (
    id SERIAL PRIMARY KEY,
    info JSONB
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In the `person` table, the `info` column has the type JSONB that stores various information about each person.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Second, [insert rows](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert-multiple-rows/) into the `person` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO person (info)
VALUES
    ('{"name": "John", "age": 30, "city": "New York"}'),
    ('{"name": "Alice", "city": "Los Angeles"}'),
    ('{"name": "Bob", "age": 35 }');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, get the keys of the objects in the `info` column:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT jsonb_object_keys(info)
FROM person;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 jsonb_object_keys
-------------------
 age
 city
 name
 city
 name
 age
 name
(7 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To get unique keys from all the stored JSON objects in the info column, you can use the `DISTINCT` operator:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT DISTINCT jsonb_object_keys(info)
FROM person;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 jsonb_object_keys
-------------------
 age
 city
 name
(3 rows)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 3) Dynamically accessing keys

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example shows how to dynamically access values corresponding to each key retrieved using `jsonb_object_keys()`:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT
    id,
    key,
    info->key AS value
FROM
    person,
    jsonb_object_keys(info) AS key;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 id | key  |     value
----+------+---------------
  1 | age  | 30
  1 | city | "New York"
  1 | name | "John"
  2 | city | "Los Angeles"
  2 | name | "Alice"
  3 | age  | 35
  3 | name | "Bob"
(7 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this example, the query returns each key along with its corresponding value from the `info` column of the `person` table.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `jsonb_object_keys()` function to extract the keys from a JSON object.
- <!-- /wp:list-item -->

<!-- /wp:list -->
