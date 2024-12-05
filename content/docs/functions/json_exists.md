---
title: Postgres JSON_EXISTS() Function
subtitle: Check for Values in JSON Data Using SQL/JSON Path Expressions
enableTableOfContents: true
updatedOn: '2024-12-04T00:00:00.000Z'
tag: new
---

The `JSON_EXISTS()` function in PostgreSQL 17 provides a powerful way to check for the existence of values within `JSON` data using `SQL/JSON` path expressions. This function is particularly useful for validating `JSON` structure and implementing conditional logic based on the presence of specific `JSON` elements.

Use `JSON_EXISTS()` when you need to:

- Validate the presence of specific `JSON` paths
- Implement conditional logic based on `JSON` content
- Filter `JSON` data based on complex conditions
- Verify `JSON` structure before processing

<CTA />

## Function signature

The `JSON_EXISTS()` function uses the following syntax:

```sql
JSON_EXISTS(
    context_item,                    -- JSON/JSONB input
    path_expression                  -- SQL/JSON path expression
    [ PASSING { value AS varname } [, ...] ]
    [{ TRUE | FALSE | UNKNOWN | ERROR } ON ERROR ]
) → boolean
```

Parameters:

- `context_item`: `JSON` or `JSONB` input to evaluate
- `path_expression`: `SQL/JSON` path expression to check
- `PASSING`: Optional clause to pass variables for use in the path expression
- `ON ERROR`: Controls behavior when path evaluation fails (defaults to `FALSE`)

## Example usage

Let's explore various ways to use the `JSON_EXISTS()` function with different scenarios and options.

### Basic existence checks

```sql
-- Check if a simple key exists
SELECT JSON_EXISTS('{"name": "Alice", "age": 30}', '$.name');
```

```text
# | json_exists
--------------
1 | t
```

```sql
-- Check for a nested key
SELECT JSON_EXISTS(
    '{"user": {"details": {"email": "alice@example.com"}}}',
    '$.user.details.email'
);
```

```text
# | json_exists
--------------
1 | t
```

### Array operations

```sql
-- Check if array contains any elements
SELECT JSON_EXISTS('{"numbers": [1,2,3,4,5]}', '$.numbers[*]');
```

```text
# | json_exists
--------------
1 | t
```

```sql
-- Check for specific array element
SELECT JSON_EXISTS('{"tags": ["postgres", "json", "database"]}', '$.tags[3]');
```

```text
# | json_exists
--------------
1 | f
```

### Conditional checks

```sql
-- Check for values meeting a condition
SELECT JSON_EXISTS(
    '{"scores": [85, 92, 78, 95]}',
    '$.scores[*] ? (@ > 90)'
);
```

```text
# | json_exists
--------------
1 | t
```

### Using PASSING clause

```sql
-- Check using a variable
SELECT JSON_EXISTS(
    '{"temperature": 25}',
    'strict $.temperature ? (@ > $threshold)'
    PASSING 30 AS threshold
);
```

```text
# | json_exists
--------------
1 | f
```

### Error handling

```sql
-- Default behavior (returns FALSE)
SELECT JSON_EXISTS(
    '{"data": [1,2,3]}',
    'strict $.data[5]'
);
```

```text
# | json_exists
--------------
1 | f
```

```sql
-- Using ERROR ON ERROR
SELECT JSON_EXISTS(
    '{"data": [1,2,3]}',
    'strict $.data[5]'
    ERROR ON ERROR
);
```

```text
ERROR: jsonpath array subscript is out of bounds (SQLSTATE 22033)
```

```sql
-- Using UNKNOWN ON ERROR
SELECT JSON_EXISTS(
    '{"data": [1,2,3]}',
    'strict $.data[5]'
    UNKNOWN ON ERROR
);
```

```text
# | json_exists
--------------
1 |
```

## Practical applications

### Data validation

```sql
-- Validate required fields before insertion
CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    data JSONB NOT NULL,
    CONSTRAINT valid_profile CHECK (
        JSON_EXISTS(data, '$.email') AND
        JSON_EXISTS(data, '$.username')
    )
);

-- This insert will succeed
INSERT INTO user_profiles (data) VALUES (
    '{"email": "user@example.com", "username": "user123"}'::jsonb
);

-- This insert will fail
INSERT INTO user_profiles (data) VALUES (
    '{"username": "user123"}'::jsonb
);
```

```text
ERROR: new row for relation "user_profiles" violates check constraint "valid_profile" (SQLSTATE 23514)
```

### Conditional queries

```sql
-- Filter records based on JSON content
SELECT *
FROM user_profiles
WHERE JSON_EXISTS(
    data,
    '$.preferences.notifications ? (@ == true)'
);
```

## Best practices

1. Error handling:

   - Use appropriate `ON ERROR` clauses based on your requirements
   - Consider `UNKNOWN ON ERROR` for nullable conditions
   - Use `ERROR ON ERROR` when validation is critical

2. Performance optimization:

   - Create *GIN* indexes on `JSONB` columns for better performance
   - Use strict mode when path is guaranteed to exist
   - Combine with other `JSON` functions for complex operations

3. Path expressions:
   - Use *lax* mode (default) for optional paths
   - Leverage path variables with `PASSING` clause for dynamic checks

## Learn more

- [PostgreSQL JSON functions documentation](https://www.postgresql.org/docs/current/functions-json.html)
- [SQL/JSON path language](https://www.postgresql.org/docs/current/functions-json.html#FUNCTIONS-SQLJSON-PATH)
