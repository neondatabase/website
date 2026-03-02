---
title: 'PostgreSQL array_position() Function'
page_title: 'PostgreSQL array_position() Function'
page_description: 'Learn how to use the PostgreSQL array_position() function to find the position of an element in an array.'
prev_url: ''
ogImage: ''
updatedOn: '2026-02-27T00:00:00+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL string_to_array() Function'
  slug: 'postgresql-array-functions/postgresql-string_to_array'
nextLink:
  title: 'PostgreSQL array_remove() Function'
  slug: 'postgresql-array-functions/postgresql-array_remove'
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `array_position()` function to find the position of an element in an array.

## Introduction to PostgreSQL array_position() function

The `array_position()` function returns the subscript (position) of the first occurrence of a value in an array. Here's the syntax:

```sql
array_position(array, element [, start])
```

In this syntax:

- `array` is the array to search.
- `element` is the value to search for. The search uses `IS NOT DISTINCT FROM` semantics, meaning it can find `NULL` elements.
- `start` (optional) is the subscript at which to begin the search. Defaults to `1`.

The function returns an integer subscript (1-based), or `NULL` if the element is not found or if the array itself is `NULL`.

To find all positions of an element (not just the first), use `array_positions()`.

## PostgreSQL array_position() function examples

### 1) Basic array_position() example

The following example finds the position of `30` in an integer array:

```sql
SELECT array_position(ARRAY[10, 20, 30, 40, 50], 30) AS position;
```

Output:

```text
 position
----------
        3
(1 row)
```

The value `30` is at position 3 (1-based).

### 2) Element not found

If the element is not in the array, the function returns `NULL`:

```sql
SELECT array_position(ARRAY[10, 20, 30], 99) AS position;
```

Output:

```text
 position
----------

(1 row)
```

### 3) Finding the position of a string

```sql
SELECT array_position(ARRAY['apple', 'banana', 'cherry'], 'banana') AS position;
```

Output:

```text
 position
----------
        2
(1 row)
```

### 4) Using the start parameter

Use the `start` parameter to begin the search at a specific position. This is useful for finding duplicate values:

```sql
SELECT
  array_position(ARRAY[1, 2, 3, 2, 1], 2)    AS first_occurrence,
  array_position(ARRAY[1, 2, 3, 2, 1], 2, 3)  AS second_occurrence;
```

Output:

```text
 first_occurrence | second_occurrence
------------------+-------------------
                2 |                 4
(1 row)
```

The first call finds `2` at position `2`. The second call starts searching from position `3` and finds the next `2` at position `4`.

### 5) Searching for NULL

`array_position()` can find `NULL` elements using `IS NOT DISTINCT FROM` semantics:

```sql
SELECT array_position(ARRAY[1, NULL, 3], NULL) AS position;
```

Output:

```text
 position
----------
        2
(1 row)
```

### 6) Using array_position() in a WHERE clause

Suppose you have a `menu_items` table with a `categories` array:

```sql
CREATE TABLE menu_items (
  id         INT PRIMARY KEY,
  name       TEXT,
  categories TEXT[]
);

INSERT INTO menu_items VALUES
  (1, 'Caesar Salad',   ARRAY['salads', 'vegetarian', 'starters']),
  (2, 'Grilled Salmon', ARRAY['mains', 'seafood']),
  (3, 'Veggie Burger',  ARRAY['mains', 'vegetarian']);
```

Find all items that include `'vegetarian'` in their categories:

```sql
SELECT name
FROM menu_items
WHERE array_position(categories, 'vegetarian') IS NOT NULL;
```

Output:

```text
     name
--------------
 Caesar Salad
 Veggie Burger
(2 rows)
```

Note: you can also use the `@>` contains operator for this check:

```sql
SELECT name FROM menu_items WHERE categories @> ARRAY['vegetarian'];
```

## Summary

- Use `array_position(array, element)` to find the 1-based position of the first occurrence of an element.
- Returns `NULL` if the element is not found or the array is `NULL`.
- Use the optional `start` parameter to search from a specific position (useful for finding duplicate values).
- Can find `NULL` elements using `IS NOT DISTINCT FROM` semantics.
