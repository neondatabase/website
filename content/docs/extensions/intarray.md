---
title: The intarray extension
subtitle: Efficiently manipulate and query integer arrays in Postgres
enableTableOfContents: true
updatedOn: '2025-05-27T19:40:34.752Z'
tag: new
---

The `intarray` extension for Postgres provides functions and operators for handling arrays of integers. It's particularly optimized for arrays that do not contain any `NULL` values, offering significant performance advantages for certain operations compared to Postgres's built-in array functions.

<CTA />

This extension is useful when you need to perform set-like operations (unions, intersections), check for containment or overlap, or conduct indexed searches on integer arrays, common in applications like tagging systems, access control lists, or product categorization.

## Enable the `intarray` extension

You can enable the extension by running the following `CREATE EXTENSION` statement in the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or from a client such as [psql](/docs/connect/query-with-psql-editor) that is connected to your Neon database.

```sql
CREATE EXTENSION IF NOT EXISTS intarray;
```

**Version availability:**

Please refer to the [list of all extensions](/docs/extensions/pg-extensions) available in Neon for up-to-date extension version information.

## `intarray` functions

The `intarray` extension provides several useful functions for array manipulation:

- `icount(integer[]) → integer`: Returns the number of elements in the array.
  ```sql
  SELECT icount('{1,2,3,2}'::integer[]);
  -- Result: 4
  ```
- `sort(integer[], dir text) → integer[]`: Sorts the array. `dir` can be 'asc' (ascending) or 'desc' (descending).
  ```sql
  SELECT sort('{1,3,2}'::integer[], 'desc');
  -- Result: {3,2,1}
  ```
- `sort_asc(integer[]) → integer[]`: Sorts the array in ascending order. (Equivalent to `sort(arr, 'asc')`).
  ```sql
  SELECT sort_asc('{11,77,44}'::integer[]);
  -- Result: {11,44,77}
  ```
- `sort_desc(integer[]) → integer[]`: Sorts the array in descending order. (Equivalent to `sort(arr, 'desc')`).
  ```sql
  SELECT sort_desc('{11,77,44}'::integer[]);
  -- Result: {77,44,11}
  ```
- `uniq(integer[]) → integer[]`: Removes _adjacent_ duplicate values from the array. To remove all duplicates, sort the array first.
  ```sql
  SELECT uniq('{1,2,2,3,1,1}'::integer[]);
  -- Result: {1,2,3,1}
  SELECT uniq(sort('{1,2,2,3,1,1}'::integer[]));
  -- Result: {1,2,3}
  ```
- `idx(integer[], item integer) → integer`: Returns the 1-based index of the first occurrence of `item` in the array, or 0 if not found.
  ```sql
  SELECT idx(array[11,22,33,22,11], 22);
  -- Result: 2
  ```
- `subarray(integer[], start_idx integer, len integer) → integer[]`: Extracts a subarray of `len` elements starting from `start_idx` (1-based).
  ```sql
  SELECT subarray('{1,2,3,4,5}'::integer[], 2, 3);
  -- Result: {2,3,4}
  ```
- `subarray(integer[], start_idx integer) → integer[]`: Extracts a subarray from `start_idx` to the end of the array.
  ```sql
  SELECT subarray('{1,2,3,4,5}'::integer[], 3);
  -- Result: {3,4,5}
  ```
- `intset(integer) → integer[]`: Creates a single-element integer array.
  ```sql
  SELECT intset(42);
  -- Result: {42}
  ```

## `intarray` Operators

`intarray` offers set of operators for comparing and manipulating integer arrays:

| Operator      | Description                                                                                                                                                                | Example                                 | Result      |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | ----------- |
| `&&`          | Overlap: Do arrays have at least one element in common?                                                                                                                    | `'{1,2,3}'::int[] && '{3,4,5}'::int[]`  | `true`      |
| `@>`          | Contains: Does the left array contain all elements of the right array?                                                                                                     | `'{1,2,3,4}'::int[] @> '{2,3}'::int[]`  | `true`      |
| `<@`          | Is contained by: Is the left array contained within the right array?                                                                                                       | `'{2,3}'::int[] <@ '{1,2,3,4}'::int[]`  | `true`      |
| `+ integer`   | Add element: Adds an integer to the end of the array.                                                                                                                      | `'{1,2}'::int[] + 3`                    | `{1,2,3}`   |
| `+ integer[]` | Concatenate arrays.                                                                                                                                                        | `'{1,2}'::int[] + '{3,4}'::int[]`       | `{1,2,3,4}` |
| `- integer`   | Remove element: Removes all occurrences of the integer from the array.                                                                                                     | `'{1,2,3,2}'::int[] - 2`                | `{1,3}`     |
| `- integer[]` | Remove elements: Removes elements of the right array from the left array.                                                                                                  | `'{1,2,3,4}'::int[] - '{2,4,5}'::int[]` | `{1,3}`     |
| `\|`          | Union: Computes the union of the two arrays (duplicate elements included unless arrays are pre-sorted and uniqued). For set union, consider `uniq(sort(array1 + array2))`. | `'{1,2}'::int[] \| '{2,3}'::int[]`      | `{1,2,2,3}` |
| `&`           | Intersection: Computes the intersection of the two arrays (order and duplicates depend on input).                                                                          | `'{1,2,3}'::int[] & '{2,3,4}'::int[]`   | `{2,3}`     |
| `#` (prefix)  | Number of elements: (Same as `icount` function).                                                                                                                           | `#'{1,2,3,4}'::int[]`                   | `4`         |
| `#` (infix)   | Index of element in 1-based indexing (Same as `idx` function).                                                                                                             | `'{10,20,30}'::int[] # 20`              | `2`         |

### `query_int` operators

`intarray` introduces a special data type `query_int` for constructing complex search queries against integer arrays.

- `array @@ query_int → boolean`: Does the array satisfy the `query_int`?
- `query_int ~~ array → boolean`: Commutator for `@@`. Does the array satisfy the `query_int`?

A `query_int` consists of integer values combined with operators:

- `&` (AND)
- `|` (OR)
- `!` (NOT)
  Parentheses `()` can be used for grouping.

Example: `1&(2|3)` matches arrays that contain `1` AND (either `2` OR `3`).

```sql
SELECT '{1,2,7}'::integer[] @@ '1 & (2|3)'::query_int; -- true (1 is present, 2 is present)
SELECT '{1,3,8}'::integer[] @@ '1 & (2|3)'::query_int; -- true (1 is present, 3 is present)
SELECT '1 & (2|3)'::query_int ~~ '{1,3,8}'::integer[]; -- commutator version of the above
SELECT '{1,4,9}'::integer[] @@ '1 & (2|3)'::query_int; -- false (1 is present, but neither 2 nor 3)
SELECT '{2,3,5}'::integer[] @@ '1 & (2|3)'::query_int; -- false (1 is not present)
```

## Example usage

Let's create a table to store an example dataset of articles with tags represented as integer arrays.

```sql
CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    tag_ids INTEGER[] -- This will store an array of integer tag IDs
);

INSERT INTO articles (title, tag_ids) VALUES
    ('Postgres Performance Tips', '{1,2,3}'),
    ('Introduction to SQL', '{2,4}'),
    ('Advanced intarray Usage', '{1,3,5}'),
    ('Database Normalization', '{4,6}');
```

### Basic set operations

Find articles tagged with either tag 2 `OR` tag 5 (overlap):

```sql
SELECT title, tag_ids
FROM articles
WHERE tag_ids && '{2,5}'::integer[];
```

Output:

```text
| title                     | tag_ids |
|---------------------------|---------|
| Postgres Performance Tips | {1,2,3} |
| Introduction to SQL       | {2,4}   |
| Advanced intarray Usage   | {1,3,5} |
```

Find articles tagged with both tag `1` AND tag `2` (contains):

```sql
SELECT title, tag_ids
FROM articles
WHERE tag_ids @> '{1,2}'::integer[];
```

Output:

```text
| title                     | tag_ids |
|---------------------------|---------|
| Postgres Performance Tips | {1,2,3} |
```

Find articles whose tags are fully contained within `{1,2,3,5}` (is contained by):

```sql
SELECT title, tag_ids
FROM articles
WHERE tag_ids <@ '{1,2,3,5}'::integer[];
```

Output:

```text
| title                     | tag_ids |
|---------------------------|---------|
| Postgres Performance Tips | {1,2,3} |
| Advanced intarray Usage   | {1,3,5} |
```

### Array manipulation and combining

Get all unique tags used across articles "Postgres Performance Tips" and "Introduction to SQL":

```sql
SELECT uniq(sort(a1.tag_ids + a2.tag_ids)) AS combined_unique_tags
FROM articles a1, articles a2
WHERE a1.title = 'Postgres Performance Tips' AND a2.title = 'Introduction to SQL';
```

Output:

```text
| combined_unique_tags |
|----------------------|
| {1,2,3,4}            |
```

Find common tags between "Postgres Performance Tips" and "Advanced intarray Usage" (intersection):

```sql
SELECT a1.tag_ids & a2.tag_ids AS common_tags
FROM articles a1
CROSS JOIN articles a2
WHERE a1.title = 'Postgres Performance Tips' AND a2.title = 'Advanced intarray Usage';
```

Output:

```text
| common_tags |
|-------------|
| {1,3}       |
```

Add a new tag `7` to "Introduction to SQL":

```sql
UPDATE articles
SET tag_ids = tag_ids + 7
WHERE title = 'Introduction to SQL'
RETURNING title, tag_ids;
```

Output:

```text
| title                 | tag_ids   |
|-----------------------|-----------|
| Introduction to SQL   | {2,4,7}   |
```

Remove tag `2` from "Postgres Performance Tips":

```sql
UPDATE articles
SET tag_ids = tag_ids - 2
WHERE title = 'Postgres Performance Tips'
RETURNING title, tag_ids;
```

Output:

```text
| title                     | tag_ids |
|---------------------------|---------|
| Postgres Performance Tips | {1,3}   |
```

### Using `query_int` for complex searches

Find articles tagged with `1` AND (either `3` OR `4`):

```sql
SELECT title, tag_ids
FROM articles
WHERE tag_ids @@ '1 & (3|4)'::query_int;
```

```text
| title                     | tag_ids |
|---------------------------|---------|
| Advanced intarray Usage   | {1,3,5} |
| Postgres Performance Tips |  {1,3}  |
```

### Using `intarray` functions

Find the index of tag `3` in "Postgres Performance Tips":

```sql
SELECT title, idx(tag_ids, 3) AS index_of_tag_3
FROM articles
WHERE title = 'Postgres Performance Tips';
```

Output:

```text
| title                     | index_of_tag_3 |
|---------------------------|----------------|
| Postgres Performance Tips |       2        |
```

## Indexing with `intarray`

`intarray` provides excellent indexing capabilities for its operators, which is crucial for performance on large datasets. It supports both GiST and GIN indexes. These indexes can accelerate queries using `&&`, `@>`, `<@`, `@@`, and array equality.

### GiST Index operator classes

- `gist__int_ops`: Suitable for small to medium-sized datasets. It approximates an integer set as an array of integer ranges.
  - Optional parameter: `numranges` (default 100, range 1-253). Defines the maximum number of ranges in an index key. Larger values lead to more precise (faster) searches but larger indexes.
- `gist__intbig_ops`: Better for large datasets (columns with many distinct array values). It approximates an integer set as a bitmap signature.
  - Optional parameter: `siglen` (default 16 bytes, range 1-2024 bytes). Defines the signature length. Longer signatures mean more precise searches but larger indexes.

> GiST index doesn't benefit from `<@` operator.

**Example GiST Index:**

To create a GiST index on `tag_ids` using `gist__intbig_ops` with a signature length of 32 bytes:

```sql shouldWrap
CREATE INDEX idx_articles_tag_ids_gist ON articles USING GIST (tag_ids gist__intbig_ops (siglen = 32));
```

To use the `gist__int_ops`:

```sql shouldWrap
CREATE INDEX idx_articles_tag_ids_gist_default ON articles USING GIST (tag_ids gist__int_ops);
```

You can also specify parameters for `gist__int_ops`, for example:

```sql shouldWrap
CREATE INDEX idx_articles_tag_ids_gist_custom_ranges ON articles USING GIST (tag_ids gist__int_ops (numranges = 50));
```

### GIN Index operator class

`gin__int_ops`: This is a non-default GIN operator class. It supports `&&`, `@>`, `@@`, and also `<@`.

**Example GIN Index:**

```sql
CREATE INDEX idx_articles_tag_ids_gin ON articles USING GIN (tag_ids gin__int_ops);
```

## Practical applications

- **Tagging systems:** Efficiently find items associated with specific tags, combinations of tags, or overlapping tag sets.
- **Access Control Lists (ACLs):** Store group memberships or resource permissions as integer arrays and quickly check if a user (belonging to certain groups) has access to a resource.
- **Product categorization:** Manage products belonging to multiple categories and find products based on category inclusion/exclusion criteria.
- **Recommendation engines:** Identify items with similar properties by checking for overlaps in their feature ID arrays.

## Conclusion

The intarray extension provides a powerful set of tools within Postgres for efficiently managing and querying integer arrays. Its rich functions and operators are designed to significantly improve performance, particularly during complex array operations.

## Resources

- [PostgreSQL `intarray` documentation](https://www.postgresql.org/docs/current/intarray.html)

<NeedHelp/>
