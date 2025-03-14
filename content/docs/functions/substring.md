---
title: Postgres substring() function
subtitle: Extract a substring from a string
enableTableOfContents: true
updatedOn: '2024-06-14T07:55:54.378Z'
---

The `substring()` function in Postgres is used to extract a portion of a string based on specified start and end positions, or a regular expression pattern.

It's useful for data cleaning and transformation where you might need to extract relevant parts of a string. For example, when working with semi-structured data like an address, where you want to extract the zip code. Or, to extract the timestamp of events when working with machine-generated data like logs.

<CTA />

## Function signature

The `substring()` function has two forms:

```sql
substring(string text [from int] [for int]) -> text
```

- `string`: The input string to extract the substring from.
- `from` (optional): The starting position for the substring (1-based index). If omitted, it defaults to 1.
- `for` (optional): The length of the substring to extract. If omitted, the substring extends to the end of the string.

```sql
substring(string text from pattern text) -> text
```

- `string`: The input string to extract the substring from.
- `pattern`: A POSIX regular expression pattern. The substring matching this pattern is returned.

## Example usage

Consider a table `users` with a `user_id` column that contains IDs in the format "user_123". We can use `substring()` to extract just the numeric part of the ID.

```sql
WITH users AS (
  SELECT 'user_123' AS user_id
  UNION ALL
  SELECT 'user_482892' AS user_id
)
SELECT substring(user_id from 6) AS numeric_id
FROM users;
```

This query extracts the substring starting from the 6th character of `user_id` (1-based index) and returns it as `numeric_id`.

```text
 numeric_id
------------
 123
 482892
(2 rows)
```

You can also use a regular expression pattern to find and extract a substring.

```sql
WITH addresses AS (
  SELECT '123 Main St, Anytown, CA 12345, (555) 123-4567' AS address
  UNION ALL
  SELECT '456 Oak Ave, Somewhere, NY 54321, (555) 987-6543' AS address
)
SELECT substring(address from '\d{5}') AS zip_code
FROM addresses;
```

This query extracts the 5-digit zip code from the `address` column using the regular expression pattern `\d{5}`, which matches exactly 5 consecutive digits.

```text
 zip_code
----------
 12345
 54321
(2 rows)
```

## Advanced examples

### Extract a substring of a specific length

You can specify both the starting position and the length of the substring to extract.

```sql
WITH logs AS (
  SELECT '2023-05-15T10:30:00.000Z - User 123 logged in' AS log_entry
  UNION ALL
  SELECT '2023-05-15T11:45:30.000Z - User 456 logged out' AS log_entry
)
SELECT substring(log_entry from 1 for 23) AS timestamp
FROM logs;
```

This query extracts the timestamp portion from the `log_entry` column. It assumes that the timestamp always appears at the beginning of the log entry and has a fixed length of 23 characters

```text
        timestamp
-------------------------
 2023-05-15T10:30:00.000
 2023-05-15T11:45:30.000
(2 rows)
```

### Extract a substring matching a regex pattern with capture groups

The `substring()` function extracts the first part of the string that matches the regular expression pattern. However, if the pattern contains capture groups (specified using parentheses), it returns the substring matched by the first parenthesized subexpression.

```sql
WITH orders AS (
  SELECT 'Order #1234 - $150.00' AS order_info
  UNION ALL
  SELECT 'Order #5678 - $75.50' AS order_info
  UNION ALL
  SELECT 'Order #9012 - $200.00' AS order_info
)
SELECT
  substring(order_info from 'Order #(\d+)') AS order_number,
  substring(order_info from '\$(\d+\.\d+)') AS order_amount
FROM orders;
```

This query extracts the order number and order amount from the `order_info` column using regular expressions with capture groups.

- The pattern `Order #(\d+)` matches the string "Order #" followed by one or more digits. The parentheses around `\d+` create a capture group that extracts just the order number.
- The pattern `\$(\d+\.\d+)` matches a dollar sign followed by a decimal number. The parentheses around `\d+\.\d+` create a capture group that extracts just the order amount.

```text
 order_number | order_amount
--------------+--------------
 1234         | 150.00
 5678         | 75.50
 9012         | 200.00
(3 rows)
```

### Use `substring()` in a `WHERE` clause

You can use `substring()` in a `WHERE` clause to filter rows based on a substring condition.

```sql
WITH users AS (
  SELECT 'john.doe@example.com' AS email
  UNION ALL
  SELECT 'jane.smith@example.org' AS email
  UNION ALL
  SELECT 'admin@gmail.com' AS email
)
SELECT *
FROM users
WHERE substring(email from '.*@(.*)\.') = 'example';
```

This query selects all rows from the `users` table where the email address has the domain name `example`. The regular expression pattern `.*@(.*)\.` extracts the domain part of the email address.

```text
         email
------------------------
 john.doe@example.com
 jane.smith@example.org
(2 rows)
```

## Additional considerations

### Performance implications

When working with large datasets, using `substring()` in a `WHERE` clause may impact query performance since it requires scanning the entire string column to extract substrings and compare them.

If you frequently filter based on substrings, consider creating a _functional index_ on the relevant column using the substring expression, to improve query performance.

### Alternative functions

- `left` - Extracts the specified number of characters from the start of a string.
- `right` - Extracts the specified number of characters from the end of a string.
- `split_part` - Splits a string on the specified delimiter and returns the nth substring.
- `regexp_match` - Extracts the first substring matching a regular expression pattern. Unlike `substring()`, it returns an array of all the captured substrings when the regex pattern contains multiple parentheses.

## Resources

- [PostgreSQL documentation: String functions](https://www.postgresql.org/docs/current/functions-string.html)
- [PostgreSQL documentation: Pattern matching](https://www.postgresql.org/docs/current/functions-matching.html)
