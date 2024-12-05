---
title: Postgres json_serialize() Function
subtitle: Convert JSON Values to Text or Binary Format
enableTableOfContents: true
updatedOn: '2024-12-04T00:00:00.000Z'
tag: new
---

The `json_serialize()` function in PostgreSQL 17 provides a flexible way to convert `JSON` values into text or binary format. This function is particularly useful when you need to control the output format of `JSON` data or prepare it for transmission or storage in specific formats.

Use `json_serialize()` when you need to:

- Convert `JSON` values to specific text formats
- Transform `JSON` into binary representation
- Ensure consistent `JSON` string formatting
- Prepare `JSON` data for external systems or storage

<CTA />

## Function signature

The `json_serialize()` function uses the following syntax:

```sql
json_serialize(
    expression                              -- Input JSON expression
    [ FORMAT JSON [ ENCODING UTF8 ] ]       -- Optional input format specification
    [ RETURNING data_type                   -- Optional return type specification
      [ FORMAT JSON [ ENCODING UTF8 ] ] ]   -- Optional output format specification
) → text | bytea
```

Parameters:

- `expression`: Input `JSON` value or expression to serialize
- `FORMAT JSON`: Explicitly specifies `JSON` format for input (optional)
- `ENCODING UTF8`: Specifies `UTF8` encoding for input/output (optional)
- `RETURNING data_type`: Specifies the desired output type (optional, defaults to text)

## Example usage

Let's explore various ways to use the `json_serialize()` function with different inputs and output formats.

### Basic serialization

```sql
-- Serialize a simple JSON object to text
SELECT json_serialize('{"name": "Alice", "age": 30}');
```

```text
# |       json_serialize
--------------------------------
1 | {"name": "Alice", "age": 30}
```

```sql
-- Serialize a JSON array
SELECT json_serialize('[1, 2, 3, "four", true, null]');
```

```text
# |      json_serialize
----------------------------------
1 | [1, 2, 3, "four", true, null]
```

### Binary serialization

```sql
-- Convert JSON to binary format
SELECT json_serialize(
    '{"id": 1, "data": "test"}'
    RETURNING bytea
);
```

```text
# |                   json_serialize
--------------------------------------------------------
1 | \x7b226964223a20312c202264617461223a202274657374227d
```

### Working with complex structures

```sql
-- Serialize nested JSON structures
SELECT json_serialize('{
    "user": {
        "name": "Bob",
        "settings": {
            "theme": "dark",
            "notifications": true
        },
        "tags": ["admin", "active"]
    }
}');
```

```text
# |                                  json_serialize
---------------------------------------------------------------------------------------------------------------------
1 | { "user": { "name": "Bob", "settings": { "theme": "dark", "notifications": true }, "tags": ["admin", "active"] } }
```

## Comparison with `json()` function

While both `json_serialize()` and `json()` work with `JSON` data, they serve different purposes:

- `json()` converts text or binary data into `JSON` values
- `json_serialize()` converts `JSON` values into text or binary format
- `json()` focuses on input validation (e.g., `WITH UNIQUE` keys)
- `json_serialize()` focuses on output format control

Think of them as complementary functions:

```sql
-- json() for input conversion
SELECT json('{"name": "Alice"}');  -- Text to JSON

-- json_serialize() for output conversion
SELECT json_serialize('{"name": "Alice"}'::json);  -- JSON to Text
```

## Common use cases

### Data export preparation

```sql
-- Create a table with JSON data
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    event_data json
);

-- Insert sample data
INSERT INTO events (event_data) VALUES
    ('{"type": "login", "user_id": 123}'),
    ('{"type": "purchase", "amount": 99.99}');

-- Export data in specific format
SELECT id, json_serialize(event_data RETURNING text)
FROM events;
```

## Error handling

The function handles various error conditions:

```sql
-- Invalid JSON input (raises error)
SELECT json_serialize('{"invalid": }');
```

```text
ERROR: invalid input syntax for type json (SQLSTATE 22P02)
```

## Learn more

- [json() function documentation](/docs/functions/json)
- [PostgreSQL JSON functions documentation](https://www.postgresql.org/docs/current/functions-json.html)
- [PostgreSQL data type formatting functions](https://www.postgresql.org/docs/current/functions-formatting.html)
