---
title: 'PostgreSQL jsonb_pretty() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-jsonb_pretty/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `jsonb_pretty()` function to convert a JSON value to a human-readable, indented format.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL jsonb_pretty() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `jsonb_pretty()` function allows you to convert a given [JSONB](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-json/) value to a human-readable, indented format.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the basic syntax of the `jsonb_pretty()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
jsonb_pretty(jsonb_value)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `jsonb_value` is a JSONB value that you want to convert.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The `jsonb_pretty()` function returns a text that is the human-readable and indented format of the input JSONB value.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL jsonb_pretty() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's explore some examples of using the `jsonb_pretty()` function.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic PostgreSQL jsonb_pretty() function example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `jsonb_pretty()` function to format a JSONB value:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  jsonb_pretty(
    '{"id": 1, "name": {"first": "John", "last": "Doe"}, "age": 30}'
  );
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"json"} -->

```
      jsonb_pretty
-------------------------
 {                      +
     "id": 1,           +
     "age": 30,         +
     "name": {          +
         "last": "Doe", +
         "first": "John"+
     }                  +
 }
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Using PostgreSQL jsonb_pretty() function with table data

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, create a new table called recipes:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    details JSONB
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, insert some rows into the recipes table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO recipes (name, details)
VALUES
    (
        'Spaghetti Carbonara',
        '{"preparation_time": "30 minutes",
          "ingredients": ["spaghetti", "eggs", "bacon", "parmesan cheese", "black pepper"],
          "difficulty": "Medium"}'
    ),
    (
        'Chicken Tikka Masala',
        '{"preparation_time": "45 minutes",
          "ingredients": ["chicken", "tomatoes", "onions", "yogurt", "spices"],
          "difficulty": "Medium-High"}'
    ),
    (
        'Vegetable Stir Fry',
        '{"preparation_time": "20 minutes",
          "ingredients": ["mixed vegetables", "soy sauce", "garlic", "ginger", "sesame oil"],
          "difficulty": "Easy"}'
    );
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, format the JSONB data in the details column:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  name,
  jsonb_pretty(details)
FROM
  recipes;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"json"} -->

```
         name         |             jsonb_pretty
----------------------+--------------------------------------
 Spaghetti Carbonara  | {                                   +
                      |     "difficulty": "Medium",         +
                      |     "ingredients": [                +
                      |         "spaghetti",                +
                      |         "eggs",                     +
                      |         "bacon",                    +
                      |         "parmesan cheese",          +
                      |         "black pepper"              +
                      |     ],                              +
                      |     "preparation_time": "30 minutes"+
                      | }
 Chicken Tikka Masala | {                                   +
                      |     "difficulty": "Medium-High",    +
                      |     "ingredients": [                +
                      |         "chicken",                  +
                      |         "tomatoes",                 +
                      |         "onions",                   +
                      |         "yogurt",                   +
                      |         "spices"                    +
                      |     ],                              +
                      |     "preparation_time": "45 minutes"+
                      | }
 Vegetable Stir Fry   | {                                   +
                      |     "difficulty": "Easy",           +
                      |     "ingredients": [                +
                      |         "mixed vegetables",         +
                      |         "soy sauce",                +
                      |         "garlic",                   +
                      |         "ginger",                   +
                      |         "sesame oil"                +
                      |     ],                              +
                      |     "preparation_time": "20 minutes"+
                      | }
(3 rows)
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `jsonb_pretty()` function to convert a JSON value to pretty-printed, indented text.
- <!-- /wp:list-item -->

<!-- /wp:list -->
