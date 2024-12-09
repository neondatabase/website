---
title: Postgres JSON_VALUE() Function
subtitle: Extract and Convert JSON Scalar Values
enableTableOfContents: true
updatedOn: '2024-12-06T20:43:48.688Z'
tag: new
---

The `JSON_VALUE()` function in PostgreSQL 17 provides a specialized way to extract single scalar values from `JSON` data with type conversion capabilities. This function is particularly useful when you need to extract and potentially convert individual values from `JSON` structures while ensuring type safety and proper error handling.

Use `JSON_VALUE()` when you need to:

- Extract single scalar values from `JSON`
- Convert `JSON` values to specific PostgreSQL data types
- Ensure strict type safety when working with `JSON` data
- Handle missing or invalid `JSON` values gracefully

<CTA />

## Function signature

The `JSON_VALUE()` function uses the following syntax:

```sql
JSON_VALUE(
    context_item,                    -- JSON input
    path_expression                  -- SQL/JSON path expression
    [ PASSING { value AS varname } [, ...] ]
    [ RETURNING data_type ]         -- Optional type conversion
    [ { ERROR | NULL | DEFAULT expression } ON EMPTY ]
    [ { ERROR | NULL | DEFAULT expression } ON ERROR ]
) → text
```

Parameters:

- `context_item`: `JSON/JSONB` input to process
- `path_expression`: `SQL/JSON` path expression that identifies the value to extract
- `PASSING`: Optional clause to pass variables into the path expression
- `RETURNING`: Specifies the desired output data type (defaults to text)
- `ON EMPTY`: Handles cases where no value is found
- `ON ERROR`: Handles extraction or conversion errors

## Example usage

Let's explore various ways to use the `JSON_VALUE()` function with different scenarios and options.

### Basic value extraction

```sql
-- Extract a simple string value
SELECT JSON_VALUE('{"name": "Alice"}', '$.name');
```

```text
# |  json_value
--------------
1 | Alice
```

```sql
-- Extract a numeric value
SELECT JSON_VALUE('{"age": 30}', '$.age');
```

```text
# | json_value
-------------
1 | 30
```

### Type conversion with RETURNING

```sql
-- Convert string to float
SELECT JSON_VALUE(
    '"123.45"',
    '$'
    RETURNING float
);
```

```text
# | json_value
-------------
1 | 123.45
```

```sql
-- Convert string to date
SELECT JSON_VALUE(
    '"2024-12-04"',
    '$'
    RETURNING date
);
```

```text
# | json_value
-------------
1 | 2024-12-04
```

### Using variables with PASSING

```sql
-- Extract array element using variable
SELECT JSON_VALUE(
    '[1, 2, 3, 4, 5]',
    'strict $[$index]'
    PASSING 2 AS index
);
```

```text
# | json_value
-------------
1 | 3
```

### Error handling

```sql
-- Handle missing values with DEFAULT
SELECT JSON_VALUE(
    '{"data": null}',
    '$.missing_field'
    DEFAULT 'Not Found' ON EMPTY
);
```

```text
# |  json_value
---------------
1 | Not Found
```

```sql
-- Handle conversion errors
SELECT JSON_VALUE(
    '{"value": "not a number"}',
    '$.value'
    RETURNING numeric
    DEFAULT 0 ON ERROR
);
```

```text
# | json_value
-------------
1 | 0
```

### Working with nested structures

```sql
-- Extract from nested object
SELECT JSON_VALUE(
    '{
        "user": {
            "contact": {
                "email": "alice@example.com"
            }
        }
    }',
    '$.user.contact.email'
);
```

```text
# |      json_value
----------------------
1 | alice@example.com
```

## Common use cases

### Data validation

```sql
-- Validate email format
CREATE TABLE user_emails (
    id SERIAL PRIMARY KEY,
    user_data jsonb,
    CONSTRAINT valid_email CHECK (
        JSON_VALUE(user_data, '$.email' RETURNING text)
        ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    )
);

-- This insert will succeed
INSERT INTO user_emails (user_data)
VALUES (
    '{"name": "John Doe", "email": "john.doe@example.com"}'
);

-- This insert will fail
INSERT INTO user_emails (user_data)
VALUES (
    '{"name": "Alice", "email": "invalid-email"}'
);

```

## Error handling

The function provides several ways to handle errors:

1. Using `ON EMPTY`:

   - `ERROR`: Raises an error (default)
   - `NULL`: Returns `NULL`
   - `DEFAULT expression`: Returns specified value

2. Using `ON ERROR`:
   - `ERROR`: Raises an error (default)
   - `NULL`: Returns `NULL`
   - `DEFAULT expression`: Returns specified value

## JSON_VALUE vs JSON_QUERY

The `JSON_VALUE()` function is designed for extracting scalar values from `JSON` data, while `JSON_QUERY()` is used for extracting `JSON` structures (objects, arrays, or scalar values). Here's a comparison of the two functions:

### Purpose and Return Types

`JSON_VALUE()`:

- Designed specifically for extracting scalar values (numbers, strings, booleans)
- Always returns a single scalar value as text (or specified type via `RETURNING`)
- Removes quotes from string values by default
- Throws an error if the result is an object or array

`JSON_QUERY()`:

- Designed for extracting `JSON` structures (objects, arrays, or scalar values)
- Returns valid `JSON/JSONB` output
- Preserves quotes on string values by default
- Can handle multiple values using wrapper options

### Example Comparisons

```sql
-- Working with scalar string values
SELECT
    JSON_VALUE('{"name": "Alice"}', '$.name') as value_result,
    JSON_QUERY('{"name": "Alice"}', '$.name') as query_result;
```

```text
# | value_result | query_result
--------------------------------
1 | Alice        | "Alice"
```

```sql
-- Working with arrays (JSON_VALUE will error and give null by default)
SELECT
    JSON_VALUE('{"tags": ["sql", "json"]}', '$.tags' NULL ON ERROR) as value_result,
    JSON_QUERY('{"tags": ["sql", "json"]}', '$.tags') as query_result;
```

```text
# |  value_result |       query_result
---------------------------------------
1 |               | ["sql", "json"]
```

## Additional considerations

1. Type safety:

   - Always use `RETURNING` when specific data types are expected
   - Implement appropriate error handling for type conversions

2. Performance considerations:

   - Use indexes on frequently queried `JSON` paths

## Learn more

- [PostgreSQL JSON functions documentation](https://www.postgresql.org/docs/current/functions-json.html)
- [SQL/JSON path language](https://www.postgresql.org/docs/current/datatype-json.html#DATATYPE-JSONPATH)
