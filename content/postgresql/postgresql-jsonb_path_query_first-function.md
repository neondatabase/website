---
title: 'PostgreSQL jsonb_path_query_first() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-jsonb_path_query_first/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `jsonb_path_query_first()` function to extract the first JSON value that matches a JSON path expression from a JSON document.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL jsonb_path_query_first() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `jsonb_path_query_first()` function allows you to query data from a [JSONB document](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-json/) based on a [JSON path](https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-json-path/) expression and return the first match.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the basic syntax of the `jsonb_path_query_first()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
jsonb_path_query_first(jsonb_data, json_path)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, specify a JSONB data from which you want to query data.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Second, provide a JSON path to match elements in the JSONB data.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

If the `jsonb_path_query_first()` function doesn't find any match, it returns `NULL`.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL jsonb_path_query_first() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's explore some examples of using the `jsonb_path_query_first()` function.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic jsonb_path_query_first() function example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `jsonb_path_query_first()` function to get the first pet of a person:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT jsonb_path_query_first(
    '{"name": "Alice", "pets": ["Lucy","Bella"]}',
    '$.pets[*]'
) AS first_pet_name;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 first_pet_name
----------------
 "Lucy"
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Using the jsonb_path_query_first() function with table data

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, [create a new table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) called `person`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE person (
    id SERIAL PRIMARY KEY,
    data JSONB
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In the `person` table, the `data` column has the type of JSONB that stores employee information including name, age, and pets.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Second, [insert data](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert-multiple-rows/) into the `person` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO person (data)
VALUES
    ('{"name": "Alice", "age": 30, "pets": [{"type": "cat", "name": "Fluffy"}, {"type": "dog", "name": "Buddy"}]}'),
    ('{"name": "Bob", "age": 35, "pets": [{"type": "dog", "name": "Max"}]}'),
    ('{"name": "Charlie", "age": 40, "pets": [{"type": "rabbit", "name": "Snowball"}]}')
RETURNING *;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, retrieve the first pet name using the `jsonb_path_query_first()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT jsonb_path_query_first(data, '$.pets[*].name') AS first_pet_name
FROM person;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 first_pet_name
----------------
 "Fluffy"
 "Max"
 "Snowball"
(3 rows)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 3) Handling missing paths

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example attempts to find an element whose path does not exist:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT jsonb_path_query_first(data, '$.email')
FROM person;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 jsonb_path_query_first
------------------------
 null
 null
 null
(3 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this case, the person object doesn’t have an `email` key, therefore the result is `NULL`.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `jsonb_path_query_first()` function to extract the first JSON value that matches a JSON path expression from a JSON document.
- <!-- /wp:list-item -->

<!-- /wp:list -->
