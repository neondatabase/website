---
title: 'PostgreSQL string_to_array() Function'
page_title: 'PostgreSQL string_to_array() Function'
page_description: 'Learn how to use the PostgreSQL string_to_array() function to split a string into an array using a delimiter.'
prev_url: ''
ogImage: ''
updatedOn: '2026-02-27T00:00:00+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL array_to_string() Function'
  slug: 'postgresql-array-functions/postgresql-array_to_string'
nextLink:
  title: 'PostgreSQL array_position() Function'
  slug: 'postgresql-array-functions/postgresql-array_position'
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `string_to_array()` function to split a string into an array using a delimiter.

## Introduction to PostgreSQL string_to_array() function

The `string_to_array()` function splits a string into an array of `TEXT` elements using a specified delimiter. Here's the syntax:

```sql
string_to_array(string, delimiter [, null_string])
```

In this syntax:

- `string` is the input string to split.
- `delimiter` is the string used to split the input. If `NULL`, each character becomes a separate element. If an empty string `''`, the function returns the entire string as a single-element array.
- `null_string` (optional) is a string that, when matched, will be stored as `NULL` in the resulting array.

The function returns a `TEXT[]` array.

`string_to_array()` is the inverse of [`array_to_string()`](postgresql-array_to_string).

## PostgreSQL string_to_array() function examples

### 1) Basic string_to_array() example

The following example splits a comma-separated string into an array:

```sql
SELECT string_to_array('one,two,three', ',') AS result;
```

Output:

```text
     result
---------------
 {one,two,three}
(1 row)
```

### 2) Using a multi-character delimiter

```sql
SELECT string_to_array('a::b::c', '::') AS result;
```

Output:

```text
  result
----------
 {a,b,c}
(1 row)
```

### 3) Splitting into individual characters

When the delimiter is `NULL`, each character in the string becomes a separate array element:

```sql
SELECT string_to_array('hello', NULL) AS result;
```

Output:

```text
     result
-----------------
 {h,e,l,l,o}
(1 row)
```

### 4) Converting matched substrings to NULL

Use the optional third argument to treat specific substrings as `NULL`:

```sql
SELECT string_to_array('a,b,N/A,d', ',', 'N/A') AS result;
```

Output:

```text
   result
-----------
 {a,b,NULL,d}
(1 row)
```

### 5) Using string_to_array() with unnest()

Combine `string_to_array()` with [`unnest()`](postgresql-unnest) to split a string and process each element as a separate row:

```sql
SELECT unnest(string_to_array('red,green,blue', ',')) AS color;
```

Output:

```text
 color
-------
 red
 green
 blue
(3 rows)
```

### 6) Parsing CSV-like data in a column

Suppose you have a `survey_responses` table where answers are stored as comma-separated strings:

```sql
CREATE TABLE survey_responses (
  id      INT PRIMARY KEY,
  answers TEXT
);

INSERT INTO survey_responses VALUES
  (1, 'strongly agree,agree,neutral'),
  (2, 'disagree,strongly disagree');
```

Use `string_to_array()` to convert the answers to arrays for further processing:

```sql
SELECT
  id,
  string_to_array(answers, ',') AS answer_array
FROM survey_responses;
```

Output:

```text
 id |            answer_array
----+-------------------------------------
  1 | {strongly agree,agree,neutral}
  2 | {disagree,strongly disagree}
(2 rows)
```

### 7) Checking if a value exists in the split result

Use the `= ANY()` operator to check if a value appears anywhere in the split result:

```sql
SELECT id
FROM survey_responses
WHERE 'agree' = ANY(string_to_array(answers, ','));
```

Output:

```text
 id
----
  1
(1 row)
```

## Summary

- Use `string_to_array(string, delimiter)` to split a string into a `TEXT[]` array.
- Pass `NULL` as the delimiter to split the string into individual characters.
- Provide an optional third argument to treat specific substrings as `NULL` in the result.
- Combine with [`unnest()`](postgresql-unnest) to process each split element as a separate row.
- `string_to_array()` is the inverse of [`array_to_string()`](postgresql-array_to_string).
