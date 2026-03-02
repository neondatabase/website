---
title: 'PostgreSQL array_prepend() Function'
page_title: 'PostgreSQL array_prepend() Function'
page_description: 'Learn how to use the PostgreSQL array_prepend() function to prepend an element to the beginning of an array.'
prev_url: ''
ogImage: ''
updatedOn: '2026-02-27T00:00:00+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL array_append() Function'
  slug: 'postgresql-array-functions/postgresql-array_append'
nextLink:
  title: 'PostgreSQL array_cat() Function'
  slug: 'postgresql-array-functions/postgresql-array_cat'
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `array_prepend()` function to prepend an element to the beginning of an array.

## Introduction to PostgreSQL array_prepend() function

The `array_prepend()` function adds an element to the beginning of an array. Here's the syntax:

```sql
array_prepend(element, array)
```

In this syntax:

- `element` is the value to prepend. It must be compatible with the array's element type.
- `array` is the array to which the element will be prepended.

Note that the argument order is reversed compared to [`array_append()`](postgresql-array_append), with the element first and the array second.

The function returns a new array with the element added at the beginning. The original array is not modified.

You can also use the `||` operator as a shorthand:

```sql
element || array
```

## PostgreSQL array_prepend() function examples

### 1) Basic array_prepend() example

The following example prepends `0` to an array of integers:

```sql
SELECT array_prepend(0, ARRAY[1, 2, 3]) AS result;
```

Output:

```text
  result
-----------
 {0,1,2,3}
(1 row)
```

### 2) Prepending a string

```sql
SELECT array_prepend('red', ARRAY['green', 'blue']) AS colors;
```

Output:

```text
     colors
-----------------
 {red,green,blue}
(1 row)
```

### 3) Using the || operator

The `||` operator prepends a single element when the element is on the left side:

```sql
SELECT 0 || ARRAY[1, 2, 3] AS result;
```

Output:

```text
  result
-----------
 {0,1,2,3}
(1 row)
```

### 4) Comparing array_prepend() and array_append()

```sql
SELECT
  array_prepend(0, ARRAY[1, 2, 3]) AS prepended,
  array_append(ARRAY[1, 2, 3], 4)  AS appended;
```

Output:

```text
 prepended |  appended
-----------+-----------
 {0,1,2,3} | {1,2,3,4}
(1 row)
```

### 5) Using array_prepend() with a table column

Suppose you have a `priority_queue` table where tasks are stored as ordered arrays:

```sql
CREATE TABLE priority_queue (
  queue_id  INT PRIMARY KEY,
  task_ids  INT[]
);

INSERT INTO priority_queue VALUES (1, ARRAY[20, 30, 40]);
```

To add a high-priority task at the front of the queue:

```sql
UPDATE priority_queue
SET task_ids = array_prepend(10, task_ids)
WHERE queue_id = 1;
```

Verify the result:

```sql
SELECT * FROM priority_queue WHERE queue_id = 1;
```

Output:

```text
 queue_id |  task_ids
----------+------------
        1 | {10,20,30,40}
(1 row)
```

## Summary

- Use `array_prepend(element, array)` to add an element to the beginning of an array.
- Note: unlike `array_append()`, the element argument comes **first** and the array comes **second**.
- The `||` operator with an element on the left is equivalent to `array_prepend()`.
- The function returns a new array; the original is not modified.
