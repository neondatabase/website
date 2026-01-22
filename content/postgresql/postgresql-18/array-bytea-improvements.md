---
title: 'PostgreSQL 18 Array and Bytea Function Improvements'
page_title: 'PostgreSQL 18 Array and Bytea Function Improvements'
page_description: 'Learn about PostgreSQL 18 new array and bytea functions including array_sort(), array_reverse(), reverse() for bytea, integer-to-bytea casting, and MIN/MAX aggregates for arrays and composite types.'
ogImage: ''
updatedOn: '2025-08-10T12:30:00+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL 18 Temporal Constraints'
  slug: 'postgresql-18/temporal-constraints'
nextLink:
  title: 'PostgreSQL 18 Logical Replication Improvements'
  slug: 'postgresql-18/logical-replication-improvements'
---

**Summary**: In this tutorial, you will learn about PostgreSQL 18's new array and bytea function improvements including `array_sort()`, `array_reverse()`, `reverse()` for bytea, integer-to-bytea casting capabilities, and `MIN`/`MAX` aggregate support for arrays and composite types.

## Introduction to Array and Bytea Improvements

PostgreSQL 18 introduces several useful enhancements for working with arrays and binary data (bytea). These improvements address common developer needs that previously required custom functions or complex workarounds.

The key additions include native array sorting and reversing, bytea manipulation functions, simplified integer-to-bytea conversions, and expanded aggregate support.

## New Array Functions

PostgreSQL 18 adds two important array manipulation functions that developers have long requested.

### array_sort() Function

The `array_sort()` function provides native array sorting capabilities, eliminating the need for custom sorting implementations.

```sql
-- Sort different data types
SELECT array_sort(ARRAY[3, 1, 4, 1, 5, 9, 2, 6]);
-- Result: {1,1,2,3,4,5,6,9}

SELECT array_sort(ARRAY['zebra', 'apple', 'banana']);
-- Result: {apple,banana,zebra}
```

### array_reverse() Function

The `array_reverse()` function reverses the order of elements in the first dimension:

```sql
SELECT array_reverse(ARRAY[1, 2, 3, 4, 5]);
-- Result: {5,4,3,2,1}

SELECT array_reverse(ARRAY['first', 'second', 'third']);
-- Result: {third,second,first}
```

For multi-dimensional arrays, these functions operate only on the first dimension, so `array_reverse(ARRAY[ARRAY[1,2], ARRAY[3,4]])` becomes `{{3,4},{1,2}}`.

### Array Function Performance

Array functions work efficiently on reasonably sized arrays but may impact performance with very large arrays containing thousands of elements. The `array_sort()` and `array_reverse()` functions operate in memory, so consider the size of your arrays when using them in large datasets.

## Binary Data (Bytea) Improvements

PostgreSQL 18 introduces several improvements for working with binary data, including a new reverse function and better casting capabilities.

### New reverse() Function for Bytea

The `reverse()` function allows you to reverse the byte order of binary data:

```sql
SELECT reverse('\x12345678'::bytea);
-- Result: \x78563412
```

This can be used to convert between big-endian and little-endian formats, cryptographic operations that require byte reversal, and data format transformations.

## Integer-to-Bytea Casting

PostgreSQL 18 introduces casting between integer types and bytea. The bytea value has the most significant byte first (big-endian format).

### Basic Integer Casting

```sql
SELECT 1234::bytea;
-- Result: \x000004d2

SELECT (-1234)::bytea;
-- Result: \xfffffb2e
```

Different integer types produce different byte lengths - the output size is fixed based on the integer type, not the value:

```sql
SELECT 123::smallint::bytea;  -- Always 2 bytes: \x007b
SELECT 123::integer::bytea;   -- Always 4 bytes: \x0000007b
SELECT 123::bigint::bytea;    -- Always 8 bytes: \x000000000000007b
```

In previous versions, if you were to try to cast an integer directly to bytea, you would have to use a custom function or complex bit manipulation. Now, this is simplified with direct casting.

Whether you cast `123` or `123456`, an `integer::bytea` conversion always produces exactly 4 bytes.

You can also cast back from bytea to integers:

```sql
SELECT '\x007b'::bytea::smallint;
-- Result: 123
```

This feature is useful for compact binary storage of numeric IDs, protocol implementations that require specific byte representations, and interfacing with external systems that expect binary integer formats.

## MIN/MAX Aggregates for Arrays and Composite Types

PostgreSQL 18 extends `MIN()` and `MAX()` aggregate functions to work with arrays and composite types, using their natural comparison operators.

### Array Aggregates

Arrays are compared element by element (lexicographically). This means `{1,3}` is considered less than `{2,1}` because the first element is smaller.

Let's see how this works with arrays:

```sql
-- Sample table with arrays
CREATE TABLE sales_data (
    product VARCHAR(50),
    monthly_sales INTEGER[]
);

INSERT INTO sales_data VALUES
    ('Laptop', ARRAY[45, 52, 38]),
    ('Mouse', ARRAY[67, 71, 58]),
    ('Keyboard', ARRAY[23, 28, 15]);

-- Find minimum and maximum sales arrays
SELECT
    MIN(monthly_sales) AS min_sales_pattern,
    MAX(monthly_sales) AS max_sales_pattern
FROM sales_data;

 min_sales_pattern | max_sales_pattern
-------------------+-------------------
 {23,28,15}        | {67,71,58}
(1 row)
```

This query returns the `Keyboard` monthly_sales value for min and the `Mouse` value for max because it is evaluating based on the first element of each array.

### Composite Type Aggregates

Composite types are compared field by field, from left to right. Note that all field types in the composite must have comparison operators (`<`, `>`) defined, or you'll get an error.

```sql
-- Create a composite type
CREATE TYPE product_rating AS (
    average_score DECIMAL(3,2),
    review_count INTEGER
);

-- Use MIN/MAX with the composite type
SELECT
    MIN(rating) AS lowest_rating,
    MAX(rating) AS highest_rating
FROM (VALUES
    (ROW(4.5, 120)::product_rating),
    (ROW(4.2, 89)::product_rating),
    (ROW(4.8, 156)::product_rating)
) AS ratings(rating);

 lowest_rating | highest_rating
---------------+----------------
 (4.20,89)     | (4.80,156)
```

This query finds the lowest and highest product ratings based on average score and review count. In previous PostgreSQL versions, using `MIN()` or `MAX()` on arrays or composite types required custom aggregate functions or complex subqueries. Now, these operations are straightforward and come built-in.

### Aggregate Performance

The MIN/MAX aggregates on arrays and composite types currently require sequential scans through the data. Unlike simple column aggregates, these cannot benefit from standard B-tree indexes because PostgreSQL cannot directly index arbitrary array contents or composite type comparisons.

```sql
-- This will scan all rows to find MIN/MAX arrays
SELECT MIN(monthly_sales), MAX(monthly_sales) FROM sales_data;

```
