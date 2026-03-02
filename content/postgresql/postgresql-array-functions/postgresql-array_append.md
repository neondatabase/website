---
title: 'PostgreSQL array_append() Function'
page_title: 'PostgreSQL array_append() Function'
page_description: 'Learn how to use the PostgreSQL array_append() function to append an element to the end of an array.'
prev_url: ''
ogImage: ''
updatedOn: '2026-02-27T00:00:00+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL cardinality() Function'
  slug: 'postgresql-array-functions/postgresql-cardinality'
nextLink:
  title: 'PostgreSQL array_prepend() Function'
  slug: 'postgresql-array-functions/postgresql-array_prepend'
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `array_append()` function to append an element to the end of an array.

## Introduction to PostgreSQL array_append() function

The `array_append()` function appends an element to the end of an array. Here's the syntax:

```sql
array_append(array, element)
```

In this syntax:

- `array` is the array to which the element will be appended.
- `element` is the value to append. It must be compatible with the array's element type.

The function returns a new array with the element added at the end. The original array is not modified.

You can also use the `||` operator as a shorthand:

```sql
array || element
```

## PostgreSQL array_append() function examples

### 1) Basic array_append() example

The following example appends the integer `4` to an array of integers:

```sql
SELECT array_append(ARRAY[1, 2, 3], 4) AS result;
```

Output:

```text
  result
-----------
 {1,2,3,4}
(1 row)
```

### 2) Appending a string to a text array

```sql
SELECT array_append(ARRAY['red', 'green'], 'blue') AS colors;
```

Output:

```text
    colors
---------------
 {red,green,blue}
(1 row)
```

### 3) Using the || operator

The `||` operator is equivalent to `array_append()` when appending a single element:

```sql
SELECT ARRAY[1, 2, 3] || 4 AS result;
```

Output:

```text
  result
-----------
 {1,2,3,4}
(1 row)
```

### 4) Appending NULL

You can append a `NULL` value to an array:

```sql
SELECT array_append(ARRAY[1, 2, 3], NULL) AS result;
```

Output:

```text
   result
------------
 {1,2,3,NULL}
(1 row)
```

### 5) Using array_append() with a table column

Suppose you have a `user_interests` table where each user has an array of interests:

```sql
CREATE TABLE user_interests (
  user_id   INT PRIMARY KEY,
  interests TEXT[]
);

INSERT INTO user_interests VALUES
  (1, ARRAY['reading', 'coding']),
  (2, ARRAY['gaming']);
```

To add a new interest to user `1`:

```sql
UPDATE user_interests
SET interests = array_append(interests, 'hiking')
WHERE user_id = 1;
```

Verify the update:

```sql
SELECT * FROM user_interests WHERE user_id = 1;
```

Output:

```text
 user_id |        interests
---------+-------------------------
       1 | {reading,coding,hiking}
(1 row)
```

### 6) Building an array incrementally

`array_append()` is useful for building arrays row by row. You can combine it with a subquery or CTE to accumulate values:

```sql
SELECT array_append(array_append(ARRAY[]::TEXT[], 'first'), 'second') AS result;
```

Output:

```text
     result
--------------
 {first,second}
(1 row)
```

## Summary

- Use `array_append(array, element)` to add an element to the end of an array.
- The function returns a new array; the original is not modified.
- The `||` operator is a shorthand for `array_append()` when appending a single element.
- You can append `NULL` values to an array.
