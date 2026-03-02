---
title: 'PostgreSQL array_remove() Function'
page_title: 'PostgreSQL array_remove() Function'
page_description: 'Learn how to use the PostgreSQL array_remove() function to remove all occurrences of a value from an array.'
prev_url: ''
ogImage: ''
updatedOn: '2026-02-27T00:00:00+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL array_position() Function'
  slug: 'postgresql-array-functions/postgresql-array_position'
nextLink:
  title: 'PostgreSQL Functions'
  slug: 'postgresql-functions'
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `array_remove()` function to remove all occurrences of a specific element from an array.

## Introduction to PostgreSQL array_remove() function

The `array_remove()` function removes all occurrences of a specified value from an array. Here's the syntax:

```sql
array_remove(array, element)
```

In this syntax:

- `array` is the input array. It must be a one-dimensional array.
- `element` is the value to remove. All occurrences of this value are removed.

The function returns a new array with the element removed. If the element does not exist, the original array is returned unchanged.

## PostgreSQL array_remove() function examples

### 1) Basic array_remove() example

The following example removes all occurrences of `3` from an integer array:

```sql
SELECT array_remove(ARRAY[1, 2, 3, 4, 3, 5], 3) AS result;
```

Output:

```text
  result
----------
 {1,2,4,5}
(1 row)
```

Both occurrences of `3` are removed.

### 2) Removing a string element

```sql
SELECT array_remove(ARRAY['a', 'b', 'c', 'b'], 'b') AS result;
```

Output:

```text
 result
--------
 {a,c}
(1 row)
```

### 3) Element not in the array

If the element does not exist in the array, the function returns the original array unchanged:

```sql
SELECT array_remove(ARRAY[1, 2, 3], 99) AS result;
```

Output:

```text
 result
---------
 {1,2,3}
(1 row)
```

### 4) Removing NULL elements

To remove `NULL` elements from an array, pass `NULL` as the element:

```sql
SELECT array_remove(ARRAY[1, NULL, 2, NULL, 3], NULL) AS result;
```

Output:

```text
 result
---------
 {1,2,3}
(1 row)
```

### 5) Using array_remove() with a table column

Suppose you have a `user_skills` table where each user has an array of skills:

```sql
CREATE TABLE user_skills (
  user_id INT PRIMARY KEY,
  skills  TEXT[]
);

INSERT INTO user_skills VALUES
  (1, ARRAY['python', 'javascript', 'sql', 'javascript']),
  (2, ARRAY['java', 'sql', 'docker']);
```

Remove `'javascript'` from user 1's skills:

```sql
UPDATE user_skills
SET skills = array_remove(skills, 'javascript')
WHERE user_id = 1;
```

Verify the result:

```sql
SELECT * FROM user_skills WHERE user_id = 1;
```

Output:

```text
 user_id |    skills
---------+---------------
       1 | {python,sql}
(1 row)
```

Both occurrences of `'javascript'` were removed in a single call.

### 6) Removing an element from all rows

You can use `array_remove()` in an `UPDATE` to remove an element from every row in a table:

```sql
UPDATE user_skills
SET skills = array_remove(skills, 'sql');
```

Result:

```sql
SELECT * FROM user_skills;
```

Output:

```text
 user_id |    skills
---------+-------------
       2 | {java,docker}
       1 | {python}
(2 rows)
```

## Summary

- Use `array_remove(array, element)` to remove all occurrences of a value from a one-dimensional array.
- If the element is not found, the function returns the original array unchanged.
- To remove `NULL` elements, pass `NULL` as the element argument.
- The function returns a new array; the original is not modified unless you use it in an `UPDATE`.
