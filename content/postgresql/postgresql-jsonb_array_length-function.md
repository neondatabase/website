---
title: 'PostgreSQL jsonb_array_length() Function'
redirectFrom:
            - /postgresql/postgresql-jsonb_array_length 
            - /postgresql/postgresql-json-functions/postgresql-jsonb_array_length
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `jsonb_array_length()` function to get the number of elements in the top-level JSON array.

## Introduction to the PostgreSQL jsonb_array_length() function

The `jsonb_array_length()` function returns the number of elements in the top-level [JSON](/postgresql/postgresql-json) array.

Here's the syntax of the `jsonb_array_length()` function:

```
jsonb_array_length(json_array)
```

In this syntax, you pass a JSON array with the type JSONB to the function. It'll return the number of elements in the array.

If the array is empty, the `jsonb_array_length()` function returns zero. If the argument is not an array, the function will issue an error. In case the `json_array` is `NULL`, the `jsonb_array_length()` function will return `NULL`.

Note that the function will return the number of elements of the top-level array only. If the array contains nested arrays, the function will not count the elements in the nested arrays but consider the nested arrays as individual elements.

## PostgreSQL jsonb_array_length() function examples

Let's explore some examples of using the `jsonb_array_length()` function.

### 1) Basic PostgreSQL jsonb_array_length() function example

The following example uses the `jsonb_array_length()` function to get the number of elements in a JSON array:

```sql
SELECT jsonb_array_length('[1,2,3]');
```

Output:

```
 jsonb_array_length
--------------------
                  3
(1 row)
```

The function returns 3 because the JSON array \[1,2,3] contains three elements.

### 2) Using the jsonb_array_length() function with nested arrays

The following example uses the `jsonb_array_length()` function with an array that contains another array:

```sql
SELECT jsonb_array_length('[1,2,3, [4,5], 6]');
```

Output:

```
 jsonb_array_length
--------------------
                  5
(1 row)
```

In this example, the function returns 5 because the top-level array contains 5 elements: 1, 2, 3, an array \[4,5], and 6.

### 3) Using the jsonb_array_length() function with table data

First, [create a table](/postgresql/postgresql-create-table) called `person`:

```sql
CREATE TABLE person (
    id SERIAL PRIMARY KEY,
    info JSONB
);
```

In this `person` table, the `info` column has the type `JSONB` that contains the person's information including name, age, and pets.

Second, [insert some rows](/postgresql/postgresql-insert-multiple-rows) into the `person` table:

```sql
INSERT INTO person (info)
VALUES
    ('{"name": "Alice", "age": 30, "pets": [{"type": "cat", "name": "Fluffy"}, {"type": "dog", "name": "Buddy"}]}'),
    ('{"name": "Bob", "age": 35, "pets": [{"type": "dog", "name": "Max"}]}'),
    ('{"name": "Charlie", "age": 40, "pets": [{"type": "rabbit", "name": "Snowball"}]}')
RETURNING *;
```

Third, retrieve the person names with their number of pets from the `info` column of the `person` table:

```sql
SELECT
  jsonb_path_query(info, '$.name') name,
  jsonb_array_length(
    jsonb_path_query(info, '$.pets')
  ) pet_count
FROM
  person;
```

Output:

```
   name    | pet_count
-----------+-----------
 "Alice"   |         2
 "Bob"     |         1
 "Charlie" |         1
(3 rows)
```

In this example:

- The `jsonb_path_query`(info, '\$.name') returns the name of the person.
- The `jsonb_path_query`(info, '\$.pets') returns the `pets` array, and `jsonb_array_length()` returns the number of elements in the `pets` array.

## Summary

- Use the `jsonb_array_length()` function to get the number of elements in the top-level JSON array.
