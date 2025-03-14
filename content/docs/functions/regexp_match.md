---
title: Postgres regexp_match() function
subtitle: Extract substrings matching a regular expression pattern
enableTableOfContents: true
updatedOn: '2024-06-30T16:27:35.359Z'
---

The Postgres `regexp_match()` function is used to extract substrings that match a regular expression pattern from a given string. It returns an array of matching substrings, including capture groups if specified in the pattern.

This function is particularly useful for complex string parsing tasks, such as extracting structured information from semi-structured text data. For example, it can be used to parse log files, extract specific components from URLs, or analyze text data for specific patterns.

<CTA />

## Function signature

The `regexp_match()` function has the following form:

```sql
regexp_match(string text, pattern text [, flags text]) -> text[]
```

- `string`: The input string to search for matches.
- `pattern`: A POSIX regular expression pattern to match against the string.
- `flags` (optional): A string of one or more single-letter flags that modify how the regular expression is interpreted.

The function returns an array of text values, where each element corresponds to a substring within the first match of the pattern in the input string. If there are no matches, the function returns NULL. If there are no capture groups in the pattern, the array contains a single element with the full match.

## Example usage

Consider a table `log_entries` with a `log_text` column containing log messages. We can use `regexp_match()` to extract specific information from these logs.

```sql
WITH log_entries AS (
  SELECT '[2024-03-04 10:15:30] INFO: User john_doe logged in from 192.168.1.100' AS log_text
  UNION ALL
  SELECT '[2024-03-04 10:20:45] ERROR: Failed login attempt for user jane_smith from 10.0.0.50' AS log_text
  UNION ALL
  SELECT '[2024-03-04 10:25:55] INFO: User admin logged out' AS log_text
)
SELECT
  regexp_match(log_text, '\[(.*?)\] (\w+): (.*)$') AS parsed_log
FROM log_entries;
```

This query extracts the timestamp, log level, and message from each log entry. The regular expression pattern `\[(.*?)\] (\w+): (.*)$` captures three groups:

1. The timestamp between square brackets
2. The log level (INFO, ERROR, etc.), which is alphabetical and terminated with a colon
3. The rest of the message

```text
                                       parsed_log
-----------------------------------------------------------------------------------------
 {"2024-03-04 10:15:30",INFO,"User john_doe logged in from 192.168.1.100"}
 {"2024-03-04 10:20:45",ERROR,"Failed login attempt for user jane_smith from 10.0.0.50"}
 {"2024-03-04 10:25:55",INFO,"User admin logged out"}
(3 rows)
```

## Advanced examples

### Use `regexp_match()` with regex flags

The `regexp_match()` function accepts optional flags to modify how the regular expression is interpreted. Here's an example using the 'i' flag for case-insensitive matching:

```sql
WITH user_agents AS (
  SELECT 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' AS user_agent
  UNION ALL
  SELECT 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1' AS user_agent
  UNION ALL
  SELECT 'CHROME/91.0.4472.124' AS user_agent
)
SELECT
  regexp_match(user_agent, '(chrome|safari|firefox|msie|opera)\/[\d\.]+', 'i') AS browser
FROM user_agents;
```

This query extracts the browser name and version from user agent strings, using case-insensitive matching.

```text
 browser
----------
 {Chrome}
 {Safari}
 {CHROME}
(3 rows)
```

### Use `regexp_match()` in a WHERE clause

You can use `regexp_match()` in a WHERE clause to filter rows based on a regex pattern:

```sql
WITH emails AS (
  SELECT 'john.doe@example.com' AS email
  UNION ALL
  SELECT 'jane.smith@company.co.uk' AS email
  UNION ALL
  SELECT 'support@mydomain.io' AS email
)
SELECT *
FROM emails
WHERE regexp_match(email, '^[^@]+@[^@]+\.(com|org|io)$') IS NOT NULL;
```

This query selects all rows from the `emails` table where the email address ends with `.com`, ``.org`, or `.io`.

```text
        email
----------------------
 john.doe@example.com
 support@mydomain.io
(2 rows)
```

## Additional considerations

### Performance implications

Using `regexp_match()` can be computationally expensive, especially on large datasets or with complex patterns. For better performance:

1. Use simpler patterns when possible.
2. Consider using `LIKE` or `SIMILAR TO` for simple pattern matching.
3. If you frequently filter based on regex patterns, consider creating a functional index using the `regexp_match()` expression.

### NULL handling

`regexp_match()` returns NULL if there's no match or if the input string is NULL. This behavior can be useful in `WHERE` clauses but may require careful handling in `SELECT` lists.

### Alternative functions

- `regexp_matches()`: Returns a set of all matches, useful for extracting multiple occurrences of the pattern in the input string.
- `regexp_replace()`: Replaces substrings matching a regex pattern within a specified string.
- `regexp_split_to_array()`: Splits a string using a regex pattern as the delimiter and returns the result as an array.
- `substring()`: Extracts substrings based on a regex pattern similar to `regexp_match()`, but only returns the first captured group of the match.

## Resources

- [PostgreSQL documentation: Pattern Matching](https://www.postgresql.org/docs/current/functions-matching.html)
- [PostgreSQL documentation: Regular Expression Details](https://www.postgresql.org/docs/current/functions-matching.html#FUNCTIONS-POSIX-REGEXP)
- [Regular Expression Tester](https://regex101.com/): A useful tool for testing and debugging regular expressions
