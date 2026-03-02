---
title: 'PostgreSQL gen_random_uuid() Function'
page_title: 'PostgreSQL gen_random_uuid() Function'
page_description: 'Learn how to use the PostgreSQL gen_random_uuid() function to generate random UUID values for use as primary keys and unique identifiers.'
prev_url: ''
ogImage: ''
updatedOn: '2026-02-27T00:00:00+00:00'
enableTableOfContents: true
previousLink:
  title: 'generate_series() Function'
  slug: 'postgresql-tutorial/postgresql-generate_series'
nextLink:
  title: 'Random Number in Range'
  slug: 'postgresql-tutorial/postgresql-random-range'
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `gen_random_uuid()` function to generate random UUID values.

## Introduction to PostgreSQL gen_random_uuid() function

The `gen_random_uuid()` function generates a random [UUID](postgresql-uuid) (Universally Unique Identifier) version 4 value. Here's the syntax:

```sql
gen_random_uuid()
```

The function takes no arguments and returns a value of type `uuid`.

UUID v4 values are randomly generated using a cryptographically secure random number generator. Each call produces a different UUID with an extremely low probability of collision.

`gen_random_uuid()` is built into PostgreSQL 13 and later. No extension is required. In earlier versions of PostgreSQL, you needed the `pgcrypto` extension and called `pgcrypto.gen_random_uuid()`.

## PostgreSQL gen_random_uuid() function examples

### 1) Basic gen_random_uuid() example

The following example generates a single random UUID:

```sql
SELECT gen_random_uuid() AS id;
```

Output:

```text
                  id
--------------------------------------
 a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11
(1 row)
```

Each call returns a different UUID:

```sql
SELECT gen_random_uuid(), gen_random_uuid(), gen_random_uuid();
```

Output:

```text
           gen_random_uuid            |           gen_random_uuid            |           gen_random_uuid
--------------------------------------+--------------------------------------+--------------------------------------
 3d5f2b94-1c8a-4e7d-b3f0-9a2e5c6d1234 | 8b9c7a0e-5f3d-4c2b-a1e8-d6f4b7c9e021 | 1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d
(1 row)
```

### 2) Using gen_random_uuid() as a default column value

A common pattern is to use `gen_random_uuid()` as the default value for a primary key column. This lets PostgreSQL automatically generate a unique UUID whenever a row is inserted without specifying an ID:

```sql
CREATE TABLE users (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email      TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

Now insert a user without specifying the `id`:

```sql
INSERT INTO users (email) VALUES ('alice@example.com');
```

Query the table:

```sql
SELECT * FROM users;
```

Output:

```text
                  id                  |       email        |          created_at
--------------------------------------+--------------------+-------------------------------
 f47ac10b-58cc-4372-a567-0e02b2c3d479 | alice@example.com  | 2026-02-27 12:00:00.000000+00
(1 row)
```

PostgreSQL automatically generated a UUID for the `id` column.

### 3) Generating UUIDs in bulk

You can combine `gen_random_uuid()` with [`generate_series()`](postgresql-generate_series) to create multiple UUID values at once:

```sql
SELECT gen_random_uuid() AS id
FROM generate_series(1, 5);
```

Output:

```text
                  id
--------------------------------------
 1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed
 2c624234-b55d-4e3c-9a9d-a2234bcd4c2f
 3d2b8456-c7a8-4f21-bd8c-b3456cde5d30
 4e7f9123-d891-4a32-ce8d-c4567def6e41
 5a8c0234-e902-4b43-df8e-d5678efa7f52
(5 rows)
```

### 4) Comparing gen_random_uuid() with SERIAL

`SERIAL` generates sequential integer IDs, while `gen_random_uuid()` generates random UUIDs. Here's when to prefer each:

| Feature | SERIAL | gen_random_uuid() |
|---|---|---|
| Type | Integer | UUID |
| Sequential | Yes | No |
| Globally unique | No (per-table) | Yes |
| Exposes row count | Yes | No |
| Index performance | Better for inserts | Slightly worse for inserts |

UUIDs are preferred when:
- IDs must be unique across multiple databases or services
- You want to avoid exposing the number of rows in a table
- You generate IDs on the client before inserting into the database

### 5) Using gen_random_uuid() in an INSERT statement

You can also call `gen_random_uuid()` explicitly in an `INSERT` statement:

```sql
INSERT INTO users (id, email)
VALUES (gen_random_uuid(), 'bob@example.com');
```

## Summary

- Use `gen_random_uuid()` to generate a random UUID v4 value.
- The function is built into PostgreSQL 13+ and requires no extension.
- Use `gen_random_uuid()` as a `DEFAULT` for primary key columns to automatically assign unique IDs on insert.
- UUIDs are globally unique, making them suitable for distributed systems where multiple databases share data.
