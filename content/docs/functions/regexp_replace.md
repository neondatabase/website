---
title: Postgres regexp_replace() function
subtitle: Replace substrings matching a regular expression pattern
enableTableOfContents: true
updatedOn: '2024-06-30T16:56:43.860Z'
---

The Postgres `regexp_replace()` function replaces substrings that match a regular expression pattern with the specified replacement string.

This function is particularly useful for complex string manipulations, and data cleaning/formatting tasks. Consider scenarios where you'd want to remove or replace specific patterns in text or transform data to meet certain requirements. For instance, you might use it to format phone numbers consistently, remove HTML tags from text, or anonymize sensitive information in logs.

<CTA />

## Function signature

The `regexp_replace()` function has the following syntax:

```sql
regexp_replace(source text, pattern text, replacement text [, flags text]) -> text
```

- `source`: The input string to perform replacements on.
- `pattern`: The regular expression pattern to match.
- `replacement`: The string to replace matched substrings with.
- `flags` (optional): A string of one or more single-letter flags that modify how the regex is interpreted.

It returns the input string with occurrence(s) of the pattern replaced by the replacement string.

More recent versions of Postgres (starting with Postgres 16) also support additional parameters to further control the replacement operation:

```sql
regexp_replace(source text, pattern text, replacement text [, start int, [, N int]] [, flags text]) -> text
```

- start: The position in the source string to start searching for matches (default is 1).
- N: If specified, only the Nth occurrence of the pattern is replaced. If N is 0, or the `g` flag is used, all occurrences are replaced.

## Example usage

Consider a `customer_data` table with a `phone_number` column containing phone numbers in different formats. We can use `regexp_replace()` to standardize these numbers to a consistent format.

```sql
WITH customer_data AS (
  SELECT '(555) 123-4567' AS phone_number
  UNION ALL
  SELECT '555.987.6543' AS phone_number
  UNION ALL
  SELECT '555-321-7890' AS phone_number
)
SELECT
  phone_number AS original_number,
  regexp_replace(phone_number, '[^\d]', '', 'g') AS cleaned_number
FROM customer_data;
```

This query removes all non-digit characters from the phone numbers, standardizing them to a simple string of digits.

```text
 original_number | cleaned_number
-----------------+----------------
 (555) 123-4567  | 5551234567
 555.987.6543    | 5559876543
 555-321-7890    | 5553217890
(3 rows)
```

## Advanced examples

### Use `regexp_replace()` with backreferences

You can use backreferences in the replacement string to include parts of the matched pattern in the replacement.

```sql
WITH log_data AS (
  SELECT '2023-05-15 10:30:00 - User john.doe@example.com logged in' AS log_entry
  UNION ALL
  SELECT '2023-05-15 11:45:30 - User jane.smith@example.org logged out' AS log_entry
)
SELECT
  log_entry AS original_log,
  regexp_replace(log_entry, '(.*) - User (.+@.+) (.+)$', '\1 - User [REDACTED] \3') AS anonymized_log
FROM log_data;
```

This query anonymizes email addresses in log entries by replacing them with [REDACTED] while preserving the rest of the log structure.

```text
                         original_log                         |              anonymized_log
--------------------------------------------------------------+-------------------------------------------
 2023-05-15 10:30:00 - User john.doe@example.com logged in    | 2023-05-15 10:30:00 - User [REDACTED] in
 2023-05-15 11:45:30 - User jane.smith@example.org logged out | 2023-05-15 11:45:30 - User [REDACTED] out
(2 rows)
```

### Modify the behavior of `regexp_replace()` using flags

The `flags` parameter allows you to modify how the function operates. Common flags include:

- `g`: Global replacement (replace all occurrences)
- `i`: Case-insensitive matching
- `n`: Newline-sensitive matching

```sql
WITH product_descriptions AS (
  SELECT 'Red Apple: sweet and crisp' AS description
  UNION ALL
  SELECT 'Green Apple: tart and juicy apple' AS description
  UNION ALL
  SELECT 'Yellow Apple: mild and sweet' AS description
)
SELECT
  description AS original_description,
  regexp_replace(description, 'apple', 'pear', 'gi') AS modified_description
FROM product_descriptions;
```

This query replaces all occurrences of "apple" (case-insensitive) with "pear" in the product descriptions.

```text
       original_description        |      modified_description
-----------------------------------+---------------------------------
 Red Apple: sweet and crisp        | Red pear: sweet and crisp
 Green Apple: tart and juicy apple | Green pear: tart and juicy pear
 Yellow Apple: mild and sweet      | Yellow pear: mild and sweet
(3 rows)
```

### Use `regexp_replace()` for complex pattern matching and replacement

`regexp_replace()` can handle complex patterns for sophisticated text processing tasks. For example, the query below removes all HTML tags from the given markup, producing plain text.

```sql
WITH html_content AS (
  SELECT '<p>This is <b>bold</b> and <i>italic</i> text.</p>' AS content
  UNION ALL
  SELECT '<div>Another <span style="color: red;">example</span> here.</div>' AS content
)
SELECT
  content AS original_html,
  regexp_replace(content, '<[^>]+>', '', 'g') AS plain_text
FROM html_content;
```

This query produces the following output:

```text
                           original_html                           |          plain_text
-------------------------------------------------------------------+-------------------------------
 <p>This is <b>bold</b> and <i>italic</i> text.</p>                | This is bold and italic text.
 <div>Another <span style="color: red;">example</span> here.</div> | Another example here.
(2 rows)
```

## Additional considerations

### Performance implications

While `regexp_replace()` is powerful, complex regular expressions or operations on large text fields can be computationally expensive. For frequently used operations, consider preprocessing the data or using simpler string functions if possible.

### Alternative functions

- `replace()`: A simpler function for straightforward string replacements without regular expressions.
- `translate()`: Useful for character-by-character replacements.
- `regexp_matches()`: Returns an array of all substrings matching a regular expression pattern, which can be useful in conjunction with other functions for complex transformations.

## Resources

- [PostgreSQL documentation: String functions](https://www.postgresql.org/docs/current/functions-string.html)
- [PostgreSQL documentation: Pattern matching](https://www.postgresql.org/docs/current/functions-matching.html)
- [PostgreSQL documentation: Regular expressions](https://www.postgresql.org/docs/current/functions-matching.html#FUNCTIONS-POSIX-REGEXP)
