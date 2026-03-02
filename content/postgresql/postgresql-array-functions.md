---
title: 'PostgreSQL Array Functions'
page_title: 'PostgreSQL Array Functions'
page_description: 'Learn how to use PostgreSQL array functions to manipulate, query, and transform array values, including unnest, array_length, array_append, and more.'
prev_url: ''
ogImage: ''
updatedOn: '2026-02-27T00:00:00+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL Window Functions'
  slug: 'postgresql-window-function'
nextLink:
  title: 'PostgreSQL unnest() Function'
  slug: 'postgresql-array-functions/postgresql-unnest'
---

**Summary**: in this tutorial, you will get an overview of PostgreSQL array functions for creating, querying, and manipulating arrays.

## Introduction to PostgreSQL array functions

PostgreSQL provides a rich set of functions and operators for working with [array](postgresql-tutorial/postgresql-array) values. These functions allow you to expand, modify, search, and transform arrays directly in SQL queries.

## PostgreSQL array function list

The following table shows the most commonly used PostgreSQL array functions:

| Function | Description |
|---|---|
| [`unnest()`](postgresql-array-functions/postgresql-unnest) | Expands an array into a set of rows |
| [`array_length()`](postgresql-array-functions/postgresql-array_length) | Returns the length of a specific array dimension |
| [`cardinality()`](postgresql-array-functions/postgresql-cardinality) | Returns the total number of elements in an array |
| [`array_append()`](postgresql-array-functions/postgresql-array_append) | Appends an element to the end of an array |
| [`array_prepend()`](postgresql-array-functions/postgresql-array_prepend) | Prepends an element to the beginning of an array |
| [`array_cat()`](postgresql-array-functions/postgresql-array_cat) | Concatenates two arrays |
| [`array_to_string()`](postgresql-array-functions/postgresql-array_to_string) | Converts an array to a delimited string |
| [`string_to_array()`](postgresql-array-functions/postgresql-string_to_array) | Splits a string into an array |
| [`array_position()`](postgresql-array-functions/postgresql-array_position) | Returns the position of the first occurrence of an element |
| [`array_remove()`](postgresql-array-functions/postgresql-array_remove) | Removes all occurrences of an element from an array |

## Quick examples

### Expanding an array into rows

```sql
SELECT unnest(ARRAY['a', 'b', 'c']) AS element;
```

Output:

```text
 element
---------
 a
 b
 c
(3 rows)
```

### Getting array length

```sql
SELECT array_length(ARRAY[1, 2, 3, 4, 5], 1) AS len;
```

Output:

```text
 len
-----
   5
(1 row)
```

### Appending and prepending elements

```sql
SELECT
  array_append(ARRAY[1, 2, 3], 4)  AS appended,
  array_prepend(0, ARRAY[1, 2, 3]) AS prepended;
```

Output:

```text
  appended   | prepended
-------------+-------------
 {1,2,3,4}   | {0,1,2,3}
(1 row)
```

### Splitting a string into an array

```sql
SELECT string_to_array('one,two,three', ',') AS arr;
```

Output:

```text
      arr
---------------
 {one,two,three}
(1 row)
```

## Array operators

In addition to functions, PostgreSQL provides several array operators:

| Operator | Description | Example |
|---|---|---|
| `\|\|` | Concatenation | `ARRAY[1,2] \|\| ARRAY[3,4]` → `{1,2,3,4}` |
| `@>` | Contains | `ARRAY[1,2,3] @> ARRAY[1,2]` → `true` |
| `<@` | Is contained by | `ARRAY[1,2] <@ ARRAY[1,2,3]` → `true` |
| `&&` | Overlaps | `ARRAY[1,2] && ARRAY[2,3]` → `true` |
| `[]` | Subscript | `ARRAY[1,2,3][2]` → `2` |

## See also

- [PostgreSQL Array Data Type](postgresql-tutorial/postgresql-array) – how to define and work with array columns
- [ARRAY_AGG()](postgresql-aggregate-functions/postgresql-array_agg) – aggregate function to collect values into an array
