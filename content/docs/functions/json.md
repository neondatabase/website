---
title: Postgres json() Function
subtitle: Convert Text and Binary Data to JSON Values
enableTableOfContents: true
updatedOn: '2024-12-06T20:43:48.686Z'
tag: new
---

The `json()` function in PostgreSQL 17 provides a robust way to convert text or binary data into `JSON` values. This new function offers enhanced control over `JSON` parsing, including options for handling duplicate keys and encoding specifications.

Use `json()` when you need to:

- Convert text strings into `JSON` values
- Parse UTF8-encoded binary data as `JSON`
- Validate `JSON` structure during conversion
- Control handling of duplicate object keys

<CTA />

## Function signature

The `json()` function uses the following syntax:

```sql
json(
    expression                              -- Input text or bytea
    [ FORMAT JSON [ ENCODING UTF8 ]]        -- Optional format specification
    [ { WITH | WITHOUT } UNIQUE [ KEYS ]]   -- Optional duplicate key handling
) → json
```

Parameters:

- `expression`: Input text or bytea string to convert
- `FORMAT JSON`: Explicitly specifies `JSON` format (optional)
- `ENCODING UTF8`: Specifies UTF8 encoding for bytea input (optional)
- `WITH|WITHOUT UNIQUE [KEYS]`: Controls duplicate key handling (optional)

## Example usage

Let's explore various ways to use the `json()` function with different inputs and options.

### Basic JSON conversion

```sql
-- Convert a simple string to JSON
SELECT json('{"name": "Alice", "age": 30}');
```

```text
# |        json
--------------------------------
1 | {"name": "Alice", "age": 30}
```

```sql
-- Convert a JSON array
SELECT json('[1, 2, 3, "four", true, null]');
```

```text
# |           json
--------------------------------
1 | [1, 2, 3, "four", true, null]
```

```sql
-- Convert nested JSON structures
SELECT json('{
    "user": {
        "name": "Bob",
        "contacts": {
            "email": "bob@example.com",
            "phone": "+1-555-0123"
        }
    },
    "active": true
}');
```

```text
# | json
---------------------------------------------------------------------------------------------------------------------
1 | { "user": { "name": "Bob", "contacts": { "email": "bob@example.com", "phone": "+1-555-0123" } }, "active": true }
```

### Handling duplicate keys

```sql
-- Without UNIQUE keys (allows duplicates)
SELECT json('{"a": 1, "b": 2, "a": 3}' WITHOUT UNIQUE);
```

```text
# |           json
----------------------------
1 | {"a": 1, "b": 2, "a": 3}
```

```sql
-- With UNIQUE keys
SELECT json('{"a": 1, "b": 2, "c": 3}' WITH UNIQUE);
```

```text

# |           json
----------------------------
1 | {"a": 1, "b": 2, "c": 3}
```

```sql
-- This will raise an error due to duplicate 'a' key
SELECT json('{"a": 1, "b": 2, "a": 3}' WITH UNIQUE);
```

```text
ERROR: duplicate JSON object key value (SQLSTATE 22030)
```

### Working with binary data

```sql
-- Convert UTF8-encoded bytea to JSON
SELECT json(
    '\x7b226e616d65223a22416c696365227d'::bytea
    FORMAT JSON
    ENCODING UTF8
);
```

```text
# |       json
---------------------
1 | {"name": "Alice"}
```

```sql
-- Convert bytea with explicit format and uniqueness check
SELECT json(
    '\x7b226964223a312c226e616d65223a22426f62227d'::bytea
    FORMAT JSON
    ENCODING UTF8
    WITH UNIQUE
);
```

```text
# |           json
----------------------------
1 | {"id": 1, "name": "Bob"}
```

### Combining with other JSON functions:

```sql
-- Convert and extract
SELECT json('{"users": [{"id": 1}, {"id": 2}]}')->'users'->0->>'id' AS user_id;
```

```text
# | user_id
-----------
1 | 1
```

```sql
-- Convert and check structure
SELECT json_typeof(json('{"a": [1,2,3]}')->'a');
```

```text
# | json_typeof
---------------
1 | array
```

## Error handling

The `json()` function performs validation during conversion and can raise several types of errors:

```sql
-- Invalid JSON syntax (raises error)
SELECT json('{"name": "Alice" "age": 30}');
```

```text
ERROR: invalid input syntax for type json (SQLSTATE 22P02)
```

```sql
-- Invalid UTF8 encoding (raises error)
SELECT json('\xFFFFFFFF'::bytea FORMAT JSON ENCODING UTF8);
```

```text
ERROR: invalid byte sequence for encoding "UTF8": 0xff (SQLSTATE 22021)
```

## Common use cases

### Data validation

```sql
-- Validate JSON structure before insertion
CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    profile_data json
);

-- Insert with validation
INSERT INTO user_profiles (profile_data)
VALUES (
    json('{
        "name": "Alice",
        "age": 30,
        "interests": ["reading", "hiking"]
    }' WITH UNIQUE)
);
```

## Additional considerations

1. Use appropriate input validation:

   - Use `WITH UNIQUE` when duplicate keys should be prevented
   - Consider `FORMAT JSON` for explicit parsing requirements

2. Error handling best practices:
   - Implement proper error handling for invalid JSON
   - Validate input before bulk operations

## Learn more

- [PostgreSQL JSON functions documentation](https://www.postgresql.org/docs/current/functions-json.html)
