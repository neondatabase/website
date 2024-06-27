---
title: Postgres trim() function
subtitle: Remove leading and trailing characters from a string
enableTableOfContents: true
updatedOn: '2024-06-27T15:30:35.233Z'
---

The Postgres `trim()` function removes the specified characters from the beginning and/or end of a string.

This function is commonly used in data preprocessing tasks, such as cleaning user input before storing it in a database or standardizing data for comparison or analysis. For example, you might use it to remove extra spaces from product names or to standardize phone numbers by removing surrounding parentheses.

<CTA />

## Function signature

The `trim()` function has two forms:

```sql
trim([leading | trailing | both] [characters] from string) -> text
```

- `leading | trailing | both` (optional): Specifies which part of the string to trim. If omitted, it defaults to `both`.
- `characters` (optional): The set of characters to remove. If omitted, it defaults to spaces.
- `string`: The input string to trim.

```sql
trim(string text [, characters text]) -> text
```

- `string`: The input string to trim.
- `characters` (optional): The characters to remove from both ends. If omitted, it defaults to spaces.

## Example usage

Consider a table `products` with a `product_name` column that contains product names with inconsistent spacing. We can use `trim()` to standardize these names.

```sql
WITH products(product_name) AS (
  VALUES
    ('  Laptop  '),
    ('Smartphone '),
    (' Tablet'),
    ('  Wireless Earbuds  ')
)
SELECT trim(product_name) AS cleaned_name
FROM products;
```

This query removes leading and trailing spaces from the `product_name` column.

```text
   cleaned_name
------------------
 Laptop
 Smartphone
 Tablet
 Wireless Earbuds
(4 rows)
```

You can also use `trim()` to remove specific characters from both ends of a string.

```sql
WITH order_ids(id) AS (
  VALUES
    ('###ORDER-123###'),
    ('###ORDER-456###'),
    ('###ORDER-789###')
)
SELECT trim(id, '#') AS cleaned_id
FROM order_ids;
```

This query removes the '#' characters from both ends of the `id` column.

```text
 cleaned_id
------------
 ORDER-123
 ORDER-456
 ORDER-789
(3 rows)
```

## Advanced examples

### Trim only leading or trailing characters

You can specify whether to trim characters from the beginning, end, or both sides of a string.

```sql
WITH user_inputs(input) AS (
  VALUES
    ('***Secret Password***'),
    ('***Admin Access***'),
    ('***Guest User***')
)
SELECT
  trim(leading '*' from input) AS leading_trimmed,
  trim(trailing '*' from input) AS trailing_trimmed,
  trim(both '*' from input) AS both_trimmed
FROM user_inputs;
```

The query above demonstrates trimming asterisks from the beginning, end, and both sides of the `input` column, as shown in the following table.

```text
  leading_trimmed   |  trailing_trimmed  |  both_trimmed
--------------------+--------------------+-----------------
 Secret Password*** | ***Secret Password | Secret Password
 Admin Access***    | ***Admin Access    | Admin Access
 Guest User***      | ***Guest User      | Guest User
(3 rows)
```

### Use trim() in a WHERE clause

You can use `trim()` in a `WHERE` clause to filter rows based on matching a trimmed value.

```sql
WITH product_codes(code) AS (
  VALUES
    ('  ABC-123  '),
    ('DEF-456'),
    (' ABC-789 '),
    ('  JKL-101  '),
    ('MNO-202 ')
)
SELECT code AS original_code, trim(code) AS trimmed_code
FROM product_codes
WHERE trim(code) LIKE 'ABC%';
```

The query above filters for rows where the trimmed `code` column starts with 'ABC', as shown in the following table:

```text
 original_code | trimmed_code
---------------+--------------
   ABC-123     | ABC-123
  ABC-789      | ABC-789
(2 rows)
```

### Combine trim() with other string functions

You can combine `trim()` with other string functions for more complex string manipulations.

```sql
WITH user_emails(email) AS (
  VALUES
    ('  john.doe@example.com  '),
    (' jane.smith@example.org '),
    ('  admin@gmail.com  ')
)
SELECT
  trim(email) AS trimmed_email,
  upper(split_part(trim(email), '@', 1)) AS username
FROM user_emails;
```

The query above trims spaces from the email addresses and then extracts and uppercases the username part (before the '@' symbol).

```text
     trimmed_email      |  username
------------------------+------------
 john.doe@example.com   | JOHN.DOE
 jane.smith@example.org | JANE.SMITH
 admin@gmail.com        | ADMIN
(3 rows)
```

## Additional considerations

### Performance implications

While `trim()` is generally efficient, using it extensively on large datasets, especially in `WHERE` clauses, may impact query performance. If you frequently filter or join based on trimmed values, consider creating a functional index on the trimmed column.

### Handling NULL values

The `trim()` function returns NULL if the input string is NULL. Be aware of this when working with potentially NULL columns to avoid unexpected results.

### Alternative functions

- `ltrim()` - Removes specified characters from the beginning (left side) of a string.
- `rtrim()` - Removes specified characters from the end (right side) of a string.
- `btrim()` - Removes specified characters from both the beginning and end of a string.
- `regexp_replace()` - Can be used for more complex trimming operations using regular expressions.

## Resources

- [PostgreSQL documentation: String functions and operators](https://www.postgresql.org/docs/current/functions-string.html)
- [PostgreSQL documentation: Pattern matching](https://www.postgresql.org/docs/current/functions-matching.html)
