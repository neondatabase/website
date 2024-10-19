---
title: 'PostgreSQL jsonb_pretty() Function'
redirectFrom:
            - /docs/postgresql/postgresql-jsonb_pretty 
            - /docs/postgresql/postgresql-json-functions/postgresql-jsonb_pretty
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `jsonb_pretty()` function to convert a JSON value to a human-readable, indented format.

## Introduction to the PostgreSQL jsonb_pretty() function

The `jsonb_pretty()` function allows you to convert a given [JSONB](/docs/postgresql/postgresql-json) value to a human-readable, indented format.

Here's the basic syntax of the `jsonb_pretty()` function:

```
jsonb_pretty(jsonb_value)
```

In this syntax:

- `jsonb_value` is a JSONB value that you want to convert.

The `jsonb_pretty()` function returns a text that is the human-readable and indented format of the input JSONB value.

## PostgreSQL jsonb_pretty() function examples

Let's explore some examples of using the `jsonb_pretty()` function.

### 1) Basic PostgreSQL jsonb_pretty() function example

The following example uses the `jsonb_pretty()` function to format a JSONB value:

```sql
SELECT
  jsonb_pretty(
    '{"id": 1, "name": {"first": "John", "last": "Doe"}, "age": 30}'
  );
```

Output:

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

### 2) Using PostgreSQL jsonb_pretty() function with table data

First, create a new table called recipes:

```sql
CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    details JSONB
);
```

Second, insert some rows into the recipes table:

```sql
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

Third, format the JSONB data in the details column:

```sql
SELECT
  name,
  jsonb_pretty(details)
FROM
  recipes;
```

Output:

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

## Summary

- Use the `jsonb_pretty()` function to convert a JSON value to pretty-printed, indented text.
