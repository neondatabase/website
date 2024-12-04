---
title: Postgres JSON_QUERY() Function
subtitle: Extract and Transform JSON Values with SQL/JSON Path Expressions
enableTableOfContents: true
updatedOn: '2024-12-04T00:00:00.000Z'
tag: new
---

The `JSON_QUERY()` function in PostgreSQL 17 provides a powerful way to extract and transform JSON values using SQL/JSON path expressions. This function offers fine-grained control over how JSON values are extracted and formatted in the results.

Use `JSON_QUERY()` when you need to:

- Extract specific values from complex JSON structures
- Handle multiple values in results
- Control JSON string formatting
- Handle empty results and errors gracefully

<CTA />

## Function signature

The `JSON_QUERY()` function uses the following syntax:

```sql
JSON_QUERY(
    context_item,                    -- Input JSON/JSONB data
    path_expression                  -- SQL/JSON path expression
    [ PASSING { value AS varname } [, ...] ]
    [ RETURNING data_type [ FORMAT JSON [ ENCODING UTF8 ] ] ]
    [ { WITHOUT | WITH { CONDITIONAL | [UNCONDITIONAL] } } [ ARRAY ] WRAPPER ]
    [ { KEEP | OMIT } QUOTES [ ON SCALAR STRING ] ]
    [ { ERROR | NULL | EMPTY { [ ARRAY ] | OBJECT } | DEFAULT expression } ON EMPTY ]
    [ { ERROR | NULL | EMPTY { [ ARRAY ] | OBJECT } | DEFAULT expression } ON ERROR ]
) → jsonb
```

## Understanding Wrappers and Quotes

### Wrapper Behavior

By default, `JSON_QUERY()` does not wrap results (equivalent to `WITHOUT WRAPPER`). There are three wrapper modes:

1. `WITHOUT WRAPPER` (default):
   - Returns unwrapped values
   - Throws an error if multiple values are returned
2. `WITH UNCONDITIONAL WRAPPER` (same as `WITH WRAPPER`):
   - Always wraps results in an array
   - Even single values are wrapped
3. `WITH CONDITIONAL WRAPPER`:
   - Only wraps results when multiple values are present
   - Single values remain unwrapped

### Quote Behavior

For scalar string results:

- By default, values are surrounded by quotes (making them valid JSON)
- `KEEP QUOTES`: Explicitly keeps quotes (same as default)
- `OMIT QUOTES`: Removes quotes from the result
- Cannot use `OMIT QUOTES` with any `WITH WRAPPER` option

## Example usage

Let's explore these behaviors using a sample dataset:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    data JSONB
);

INSERT INTO users (data) VALUES
('{
    "profile": {
        "name": "John Doe",
        "contacts": {
            "email": ["john@example.com", "john.doe@work.com"],
            "phone": "+1-555-0123"
        }
    }
}');
```

### Working with single values

```sql
-- Default behavior (unwrapped, quoted)
SELECT JSON_QUERY(
    data,
    '$.profile.contacts.email[0]'
) FROM users;
```

```text
# |        json_query
------------------------
1 | "john@example.com"
```

```sql
-- With unconditional wrapper
SELECT JSON_QUERY(
    data,
    '$.profile.contacts.email[0]'
    WITH WRAPPER
) FROM users;
```

```text
# |        json_query
------------------------
1 | ["john@example.com"]
```

### Working with multiple values

```sql
-- Must use wrapper for multiple values
SELECT JSON_QUERY(
    data,
    '$.profile.contacts.email[*]'
    WITH WRAPPER
) FROM users;
```

```text
# |                        json_query
-----------------------------------------------------
1 | ["john@example.com", "john.doe@work.com"]
```

```sql
-- This will error (multiple values without wrapper)
SELECT JSON_QUERY(
    data,
    '$.profile.contacts.email[*]'
    ERROR ON ERROR
) FROM users;
```

```text
ERROR: JSON path expression in JSON_QUERY should return single item without wrapper (SQLSTATE 22034)
HINT: Use the WITH WRAPPER clause to wrap SQL/JSON items into an array.
```

### Using conditional wrapper

```sql
-- Single value with conditional wrapper
SELECT JSON_QUERY(
    data,
    '$.profile.contacts.phone'
    WITH CONDITIONAL WRAPPER
) FROM users;
```

```text
# |     json_query
-------------------
1 | "+1-555-0123"
```

```sql
-- Multiple values with conditional wrapper
SELECT JSON_QUERY(
    data,
    '$.profile.contacts.email[*]'
    WITH CONDITIONAL WRAPPER
) FROM users;
```

```text
# |                        json_query
-----------------------------------------------------
1 | ["john@example.com", "john.doe@work.com"]
```

### Quote handling

```sql
-- Default (quoted)
SELECT JSON_QUERY(
    data,
    '$.profile.contacts.phone'
) FROM users;
```

```text
# |     json_query
-------------------
1 | "+1-555-0123"
```

```sql
-- Without quotes (must not use with wrapper)
SELECT JSON_QUERY(
    data,
    '$.profile.contacts.phone'
    RETURNING TEXT
    OMIT quotes
) FROM users;
```

```text
# | json_query
-------------
1 | +1-555-0123
```

### Using the PASSING clause

```sql
-- Extract array element using a variable
SELECT JSON_QUERY(
    '[1, [2, 3], null]',
    'lax $[*][$idx]'
    PASSING 1 AS idx
    WITH CONDITIONAL WRAPPER
);
```

```text
# | json_query
-------------
1 | 3
```

### Handling empty results

```sql
-- Return custom value when path doesn't match
SELECT JSON_QUERY(
    '{"a": 1}',
    '$.b'
    DEFAULT '{"status": "not_found"}' ON EMPTY
);
```

```text
# |           json_query
--------------------------------
1 | {"status": "not_found"}
```

```sql
-- Return empty array when path doesn't match
SELECT JSON_QUERY(
    '{"a": 1}',
    '$.b[*]'
    EMPTY ARRAY ON EMPTY
);
```

```text
# | json_query
-------------
1 | []
```

### Error handling examples

```sql
-- Handle type conversion errors
SELECT JSON_QUERY(
    '{"value": "not_a_number"}',
    '$.value'
    RETURNING numeric
    NULL ON ERROR
);
```

```text
# | json_query
-------------
1 |
```

```sql
-- Raise error on invalid path
SELECT JSON_QUERY(
    '{"a": 1}',
    'invalid_path'
    ERROR ON ERROR
);
```

```text
ERROR: syntax error at end of jsonpath input (SQLSTATE 42601)
```

## Common use cases

### Data transformation

```sql
-- Transform and validate JSON data
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    event_data JSONB
);

INSERT INTO events (event_data) VALUES
('{
    "type": "user_login",
    "timestamp": "2024-12-04T10:30:00Z",
    "details": {
        "user_id": "U123",
        "device": "mobile",
        "location": {"city": "London", "country": "UK"}
    }
}');

-- Extract specific fields with custom formatting
SELECT
    JSON_QUERY(event_data, '$.type' RETURNING TEXT OMIT QUOTES) as event_type,
    JSON_QUERY(event_data, '$.details.location' WITH WRAPPER) as location
FROM events;
```

```text
# | event_type | location
-------------------------------------
1 | user_login | [{"city": "London", "country": "UK"}]
```

## Performance considerations

1. Use appropriate options:

   - Use `RETURNING TEXT` with `OMIT QUOTES` when JSON formatting is not required
   - Choose `CONDITIONAL WRAPPER` over `UNCONDITIONAL` when possible
   - Consider using `DEFAULT` expressions for better error recovery

2. Optimization tips:
   - Create indexes on frequently queried JSON paths
   - Use specific path expressions instead of wildcards when possible

## Learn more

- [PostgreSQL JSON functions documentation](https://www.postgresql.org/docs/current/functions-json.html)
- [SQL/JSON path language](https://www.postgresql.org/docs/current/datatype-json.html#DATATYPE-JSONPATH)
