---
title: Postgres json_scalar() Function
subtitle: Convert SQL Scalar Values to JSON Scalar Values
enableTableOfContents: true
updatedOn: '2024-12-06T20:43:48.688Z'
tag: new
---

The `json_scalar()` function in PostgreSQL 17 provides a straightforward way to convert `SQL` scalar values into their `JSON` equivalents. This function is particularly useful when you need to ensure proper type conversion and formatting of individual values for `JSON` output.

Use `json_scalar()` when you need to:

- Convert `SQL` numbers to `JSON` numbers
- Format timestamps as JSON strings
- Convert `SQL` booleans to `JSON` booleans
- Ensure proper null handling in `JSON` context

<CTA />

## Function signature

The `json_scalar()` function uses the following syntax:

```sql
json_scalar(expression) → json
```

Parameters:

- `expression`: Any `SQL` scalar value to be converted to a `JSON` scalar value

## Example usage

Let's explore various ways to use the `json_scalar()` function with different types of input values.

### Numeric values

```sql
-- Convert integer
SELECT json_scalar(42);
```

```text
# | json_scalar
---------------
1 | 42
```

```sql
-- Convert floating-point number
SELECT json_scalar(123.45);
```

```text
# | json_scalar
---------------
1 | 123.45
```

### String values

```sql
-- Convert text
SELECT json_scalar('Hello, World!');
```

```text
# |     json_scalar
--------------------
1 | "Hello, World!"
```

### Date and timestamp values

```sql
-- Convert timestamp
SELECT json_scalar(CURRENT_TIMESTAMP);
```

```text
# |            json_scalar
---------------------------------------
1 | "2024-12-04T06:19:14.458444+00:00"
```

```sql
-- Convert date
SELECT json_scalar(CURRENT_DATE);
```

```text
# |  json_scalar
----------------
1 | "2024-12-04"
```

### Boolean values

```sql
-- Convert boolean true
SELECT json_scalar(true);
```

```text
# | json_scalar
--------------
1 | true
```

### NULL handling

```sql
-- Convert NULL value
SELECT json_scalar(NULL);
```

```text
# | json_scalar
--------------
1 |
```

## Common use cases

### Building JSON objects

```sql
-- Create a JSON object with properly formatted values
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT,
    created_at TIMESTAMP WITH TIME ZONE
);

INSERT INTO users (name, created_at)
VALUES
    ('Alice', '2024-12-04T14:30:45.000000+00:00'),
    ('Bob', '2024-12-04T15:30:45.000000+00:00');

SELECT json_build_object(
    'id', json_scalar(id),
    'name', json_scalar(name),
    'created_at', json_scalar(created_at)
)
FROM users;
```

```text
# |                              json_build_object
-----------------------------------------------------------------------------------
1 | {"id" : 3, "name" : "Alice", "created_at" : "2024-12-04T14:30:45.000000+00:00"}
2 | {"id" : 4, "name" : "Bob", "created_at" : "2024-12-04T15:30:45.000000+00:00"}
```

### Data type conversion

```sql
-- Convert mixed data types in a single query
SELECT json_build_array(
    json_scalar(42),
    json_scalar('text'),
    json_scalar(CURRENT_TIMESTAMP),
    json_scalar(NULL)
);
```

```text
# |                 json_build_array
----------------------------------------------------------
1 | [42, "text", "2024-12-04T06:25:29.928376+00:00", null]
```

## Type conversion rules

The function follows these conversion rules:

1. `NULL` -> `SQL NULL`
2. Numbers → JSON numbers (preserving exact value)
3. Booleans → JSON booleans
4. All other types → JSON strings with appropriate formatting:
   - Timestamps include timezone when available
   - Text is properly escaped according to JSON standards

## Learn more

- [json_build_object() function documentation](/docs/functions/json_build_object)
- [PostgreSQL JSON functions documentation](https://www.postgresql.org/docs/current/functions-json.html)
- [PostgreSQL data type formatting](https://www.postgresql.org/docs/current/datatype.html)
